"use client";

import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { appsById, desktopApps, type AppId } from "./app-definitions";

type WindowState = {
  appId: AppId;
  zIndex: number;
  x: number;
  y: number;
};

type IconPosition = {
  x: number;
  y: number;
};

type IconSlot = {
  column: number;
  row: number;
};

type DragState =
  | {
      kind: "window";
      appId: AppId;
      offsetX: number;
      offsetY: number;
    }
  | {
      kind: "icon";
      appId: AppId;
      offsetX: number;
      offsetY: number;
      startX: number;
      startY: number;
      hasMoved: boolean;
    };

function createWindowState(appId: AppId, zIndex: number): WindowState {
  const app = appsById.get(appId);

  return {
    appId,
    zIndex,
    x: app?.defaultPosition.x ?? 0,
    y: app?.defaultPosition.y ?? 0,
  };
}

function clampWindowPosition(x: number, y: number) {
  return {
    x: Math.max(12, Math.min(x, window.innerWidth - 120)),
    y: Math.max(12, Math.min(y, window.innerHeight - 64)),
  };
}

const iconOrigin = 24;
const iconStep = 102;
const iconSize = 88;

function getIconSlot(position: IconPosition): IconSlot {
  return {
    column: Math.round((position.x - iconOrigin) / iconStep),
    row: Math.round((position.y - iconOrigin) / iconStep),
  };
}

function getIconPosition(slot: IconSlot): IconPosition {
  return {
    x: iconOrigin + slot.column * iconStep,
    y: iconOrigin + slot.row * iconStep,
  };
}

function getNearestOpenIconPosition(
  appId: AppId,
  x: number,
  y: number,
  currentPositions: Record<AppId, IconPosition>,
) {
  const maxColumn = Math.max(
    0,
    Math.floor((window.innerWidth - iconOrigin - iconSize) / iconStep),
  );
  const maxRow = Math.max(
    0,
    Math.floor((window.innerHeight - iconOrigin - iconSize) / iconStep),
  );
  const desiredSlot = {
    column: Math.max(
      0,
      Math.min(Math.round((x - iconOrigin) / iconStep), maxColumn),
    ),
    row: Math.max(
      0,
      Math.min(Math.round((y - iconOrigin) / iconStep), maxRow),
    ),
  };
  const occupiedSlots = new Set(
    Object.entries(currentPositions)
      .filter(([currentAppId]) => currentAppId !== appId)
      .map(([, position]) => {
        const slot = getIconSlot(position);

        return `${slot.column}:${slot.row}`;
      }),
  );
  const candidates: Array<IconSlot & { distance: number }> = [];

  for (let row = 0; row <= maxRow; row += 1) {
    for (let column = 0; column <= maxColumn; column += 1) {
      if (occupiedSlots.has(`${column}:${row}`)) {
        continue;
      }

      candidates.push({
        column,
        distance:
          Math.abs(column - desiredSlot.column) +
          Math.abs(row - desiredSlot.row),
        row,
      });
    }
  }

  const nearestSlot = candidates.sort((first, second) => {
    if (first.distance !== second.distance) {
      return first.distance - second.distance;
    }

    if (first.row !== second.row) {
      return first.row - second.row;
    }

    return first.column - second.column;
  })[0];

  return getIconPosition(nearestSlot ?? desiredSlot);
}

const initialIconPositions = Object.fromEntries(
  desktopApps.map((app, index) => [
    app.id,
    getIconPosition({ column: 0, row: index }),
  ]),
) as Record<AppId, IconPosition>;

const initialWindows: WindowState[] = [createWindowState("portfolio", 1)];

export function DesktopShell() {
  const [windows, setWindows] = useState<WindowState[]>(initialWindows);
  const [iconPositions, setIconPositions] =
    useState<Record<AppId, IconPosition>>(initialIconPositions);
  const [nextZIndex, setNextZIndex] = useState(2);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [suppressedClickAppId, setSuppressedClickAppId] =
    useState<AppId | null>(null);

  const focusedAppId = useMemo(() => {
    return windows.reduce<WindowState | null>((focused, windowState) => {
      if (!focused || windowState.zIndex > focused.zIndex) {
        return windowState;
      }

      return focused;
    }, null)?.appId;
  }, [windows]);

  function focusWindow(appId: AppId) {
    setWindows((currentWindows) =>
      currentWindows.map((windowState) =>
        windowState.appId === appId
          ? { ...windowState, zIndex: nextZIndex }
          : windowState,
      ),
    );
    setNextZIndex((current) => current + 1);
  }

  function openApp(appId: AppId) {
    setWindows((currentWindows) => {
      if (currentWindows.some((windowState) => windowState.appId === appId)) {
        return currentWindows.map((windowState) =>
          windowState.appId === appId
            ? { ...windowState, zIndex: nextZIndex }
            : windowState,
        );
      }

      return [...currentWindows, createWindowState(appId, nextZIndex)];
    });
    setNextZIndex((current) => current + 1);
  }

  function closeApp(appId: AppId) {
    setWindows((currentWindows) =>
      currentWindows.filter((windowState) => windowState.appId !== appId),
    );
  }

  function startDrag(
    appId: AppId,
    event: React.PointerEvent<HTMLElement>,
    windowState: WindowState,
  ) {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    focusWindow(appId);
    setDragState({
      kind: "window",
      appId,
      offsetX: event.clientX - windowState.x,
      offsetY: event.clientY - windowState.y,
    });
  }

  function dragWindow(event: React.PointerEvent<HTMLElement>) {
    if (!dragState || dragState.kind !== "window") {
      return;
    }

    const nextPosition = clampWindowPosition(
      event.clientX - dragState.offsetX,
      event.clientY - dragState.offsetY,
    );

    setWindows((currentWindows) =>
      currentWindows.map((windowState) =>
        windowState.appId === dragState.appId
          ? { ...windowState, ...nextPosition }
          : windowState,
      ),
    );
  }

  function endDrag(event: React.PointerEvent<HTMLElement>) {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setDragState(null);
  }

  function startIconDrag(
    appId: AppId,
    event: React.PointerEvent<HTMLButtonElement>,
  ) {
    const position = iconPositions[appId];

    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragState({
      kind: "icon",
      appId,
      offsetX: event.clientX - position.x,
      offsetY: event.clientY - position.y,
      startX: event.clientX,
      startY: event.clientY,
      hasMoved: false,
    });
  }

  function dragIcon(event: React.PointerEvent<HTMLButtonElement>) {
    if (!dragState || dragState.kind !== "icon") {
      return;
    }

    const hasMoved =
      dragState.hasMoved ||
      Math.abs(event.clientX - dragState.startX) > 4 ||
      Math.abs(event.clientY - dragState.startY) > 4;
    setDragState({ ...dragState, hasMoved });
    setIconPositions((currentPositions) => {
      const nextPosition = getNearestOpenIconPosition(
        dragState.appId,
        event.clientX - dragState.offsetX,
        event.clientY - dragState.offsetY,
        currentPositions,
      );

      return {
        ...currentPositions,
        [dragState.appId]: nextPosition,
      };
    });
  }

  function endIconDrag(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (dragState?.kind === "icon" && dragState.hasMoved) {
      setSuppressedClickAppId(dragState.appId);
    }

    setDragState(null);
  }

  function handleIconClick(appId: AppId) {
    if (suppressedClickAppId === appId) {
      setSuppressedClickAppId(null);
      return;
    }

    openApp(appId);
  }

  return (
    <main className="desktop-shell" aria-label="Portfolio OS desktop">
      <section className="desktop-icons" aria-label="Applications">
        {desktopApps.map((app) => {
          const Icon = app.icon;

          return (
            <button
              aria-label={`Open ${app.label}`}
              className="desktop-icon"
              key={app.id}
              onClick={() => handleIconClick(app.id)}
              onPointerCancel={endIconDrag}
              onPointerDown={(event) => startIconDrag(app.id, event)}
              onPointerMove={dragIcon}
              onPointerUp={endIconDrag}
              style={{
                left: iconPositions[app.id].x,
                top: iconPositions[app.id].y,
              }}
              type="button"
            >
              <span className="desktop-icon-tile" aria-hidden="true">
                <Icon size={28} strokeWidth={1.8} />
              </span>
              <span>{app.label}</span>
            </button>
          );
        })}
      </section>

      <section className="window-layer" aria-label="Open windows">
        {windows.map((windowState) => {
          const app = appsById.get(windowState.appId);

          if (!app) {
            return null;
          }

          const Content = app.content;
          const titleId = `${app.id}-window-title`;
          const isFocused = focusedAppId === app.id;

          return (
            <article
              aria-labelledby={titleId}
              className="desktop-window"
              data-focused={isFocused}
              key={app.id}
              onPointerDown={() => focusWindow(app.id)}
              role="dialog"
              style={{
                height: app.defaultSize.height,
                left: windowState.x,
                top: windowState.y,
                width: app.defaultSize.width,
                zIndex: windowState.zIndex,
              }}
            >
              <header
                className="window-titlebar"
                onPointerDown={(event) =>
                  startDrag(app.id, event, windowState)
                }
                onPointerMove={dragWindow}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              >
                <div>
                  <span className="window-status" aria-hidden="true" />
                  <h1 id={titleId}>{app.title}</h1>
                </div>
                <button
                  aria-label={`Close ${app.label}`}
                  className="window-close"
                  onClick={() => closeApp(app.id)}
                  onPointerDown={(event) => event.stopPropagation()}
                  type="button"
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </header>
              <div className="window-body">
                <Content />
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
