"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  type DragEndEvent,
  type DragStartEvent,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Maximize2, Minimize2, Minus, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  appsById,
  desktopApps,
  type AppId,
  type DesktopApp,
} from "./app-definitions";

type WindowState = {
  appId: AppId;
  zIndex: number;
  x: number;
  y: number;
  isMaximized: boolean;
  isMinimized: boolean;
};

type DragState = {
  kind: "window";
  appId: AppId;
  offsetX: number;
  offsetY: number;
};

type IconPosition = {
  x: number;
  y: number;
};

function createWindowState(appId: AppId, zIndex: number): WindowState {
  const app = appsById.get(appId);

  return {
    appId,
    zIndex,
    x: app?.defaultPosition.x ?? 0,
    y: app?.defaultPosition.y ?? 0,
    isMaximized: false,
    isMinimized: false,
  };
}

function clampWindowPosition(x: number, y: number) {
  return {
    x: Math.max(12, Math.min(x, window.innerWidth - 120)),
    y: Math.max(12, Math.min(y, window.innerHeight - 104)),
  };
}

const initialWindows: WindowState[] = [createWindowState("portfolio", 1)];
const iconOrigin = 24;
const iconStep = 102;
const iconSize = 88;
const initialIconPositions = Object.fromEntries(
  desktopApps.map((app, index) => [
    app.id,
    { x: iconOrigin, y: iconOrigin + index * iconStep },
  ]),
) as Record<AppId, IconPosition>;

function clampIconPosition(x: number, y: number) {
  return {
    x: Math.max(0, Math.min(x, window.innerWidth - iconSize)),
    y: Math.max(0, Math.min(y, window.innerHeight - iconSize)),
  };
}

function DesktopIcon({
  app,
  isActive,
  onOpen,
  position,
}: {
  app: DesktopApp;
  isActive: boolean;
  onOpen: (appId: AppId) => void;
  position: IconPosition;
}) {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({ id: app.id });
  const Icon = app.icon;

  return (
    <button
      aria-label={`Open ${app.label}`}
      className="desktop-icon"
      data-dragging={isDragging}
      data-running={isActive}
      onClick={() => onOpen(app.id)}
      ref={setNodeRef}
      style={{
        left: position.x,
        top: position.y,
        transform: CSS.Transform.toString(transform),
      }}
      type="button"
      {...attributes}
      {...listeners}
    >
      <span className="desktop-icon-tile" aria-hidden="true">
        <Icon size={28} strokeWidth={1.8} />
      </span>
      <span>{app.label}</span>
    </button>
  );
}

function IconGhost({ app }: { app: DesktopApp }) {
  const Icon = app.icon;

  return (
    <div className="desktop-icon desktop-icon-ghost" aria-hidden="true">
      <span className="desktop-icon-tile">
        <Icon size={28} strokeWidth={1.8} />
      </span>
      <span>{app.label}</span>
    </div>
  );
}

export function DesktopShell() {
  const [windows, setWindows] = useState<WindowState[]>(initialWindows);
  const [iconPositions, setIconPositions] =
    useState<Record<AppId, IconPosition>>(initialIconPositions);
  const [nextZIndex, setNextZIndex] = useState(2);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [activeIconId, setActiveIconId] = useState<AppId | null>(null);
  const [suppressedClickAppId, setSuppressedClickAppId] =
    useState<AppId | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const visibleWindows = useMemo(
    () => windows.filter((windowState) => !windowState.isMinimized),
    [windows],
  );
  const focusedAppId = useMemo(() => {
    return visibleWindows.reduce<WindowState | null>((focused, windowState) => {
      if (!focused || windowState.zIndex > focused.zIndex) {
        return windowState;
      }

      return focused;
    }, null)?.appId;
  }, [visibleWindows]);
  const orderedWindows = useMemo(() => {
    return [...visibleWindows].sort(
      (first, second) => second.zIndex - first.zIndex,
    );
  }, [visibleWindows]);
  const activeIcon = activeIconId ? appsById.get(activeIconId) : undefined;
  const runningAppIds = useMemo(
    () => new Set(windows.map((windowState) => windowState.appId)),
    [windows],
  );
  const minimizedAppIds = useMemo(
    () =>
      new Set(
        windows
          .filter((windowState) => windowState.isMinimized)
          .map((windowState) => windowState.appId),
      ),
    [windows],
  );

  function focusWindow(appId: AppId) {
    setWindows((currentWindows) =>
      currentWindows.map((windowState) =>
        windowState.appId === appId
          ? { ...windowState, zIndex: nextZIndex, isMinimized: false }
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
            ? { ...windowState, zIndex: nextZIndex, isMinimized: false }
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

  function minimizeApp(appId: AppId) {
    setWindows((currentWindows) =>
      currentWindows.map((windowState) =>
        windowState.appId === appId
          ? { ...windowState, isMinimized: true }
          : windowState,
      ),
    );
  }

  function toggleMaximizeApp(appId: AppId) {
    setWindows((currentWindows) =>
      currentWindows.map((windowState) =>
        windowState.appId === appId
          ? {
              ...windowState,
              zIndex: nextZIndex,
              isMaximized: !windowState.isMaximized,
              isMinimized: false,
            }
          : windowState,
      ),
    );
    setNextZIndex((current) => current + 1);
  }

  function startDrag(
    appId: AppId,
    event: React.PointerEvent<HTMLElement>,
    windowState: WindowState,
  ) {
    if (windowState.isMaximized) {
      focusWindow(appId);
      return;
    }

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
    if (!dragState) {
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

  function handleDragStart(event: DragStartEvent) {
    setActiveIconId(event.active.id as AppId);
  }

  function handleDragEnd(event: DragEndEvent) {
    const activeId = event.active.id as AppId;
    const hasMoved = Math.abs(event.delta.x) > 4 || Math.abs(event.delta.y) > 4;

    setActiveIconId(null);

    if (!hasMoved) {
      return;
    }

    setSuppressedClickAppId(activeId);
    setIconPositions((currentPositions) => {
      const currentPosition = currentPositions[activeId];

      return {
        ...currentPositions,
        [activeId]: clampIconPosition(
          currentPosition.x + event.delta.x,
          currentPosition.y + event.delta.y,
        ),
      };
    });
  }

  return (
    <main className="desktop-shell" aria-label="Portfolio OS desktop">
      <DndContext
        onDragCancel={() => setActiveIconId(null)}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        <section className="desktop-icons" aria-label="Applications">
          {desktopApps.map((app) => (
            <DesktopIcon
              app={app}
              isActive={runningAppIds.has(app.id)}
              key={app.id}
              onOpen={(appId) => {
                if (suppressedClickAppId === appId) {
                  setSuppressedClickAppId(null);
                  return;
                }

                openApp(appId);
              }}
              position={iconPositions[app.id]}
            />
          ))}
        </section>
        <DragOverlay dropAnimation={null}>
          {activeIcon ? <IconGhost app={activeIcon} /> : null}
        </DragOverlay>
      </DndContext>

      <section className="window-layer" aria-label="Open windows">
        {orderedWindows.map((windowState) => {
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
              data-app-id={app.id}
              data-focused={isFocused}
              data-maximized={windowState.isMaximized}
              key={app.id}
              onPointerDown={() => focusWindow(app.id)}
              role="dialog"
              style={{
                height: windowState.isMaximized ? undefined : app.defaultSize.height,
                left: windowState.isMaximized ? undefined : windowState.x,
                top: windowState.isMaximized ? undefined : windowState.y,
                width: windowState.isMaximized ? undefined : app.defaultSize.width,
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
                <div className="window-controls">
                  <button
                    aria-label={`Minimize ${app.label}`}
                    className="window-control window-minimize"
                    onClick={() => minimizeApp(app.id)}
                    onPointerDown={(event) => event.stopPropagation()}
                    type="button"
                  >
                    <Minus size={16} strokeWidth={2} />
                  </button>
                  <button
                    aria-label={
                      windowState.isMaximized
                        ? `Restore ${app.label}`
                        : `Maximize ${app.label}`
                    }
                    className="window-control window-maximize"
                    onClick={() => toggleMaximizeApp(app.id)}
                    onPointerDown={(event) => event.stopPropagation()}
                    type="button"
                  >
                    {windowState.isMaximized ? (
                      <Minimize2 size={15} strokeWidth={2} />
                    ) : (
                      <Maximize2 size={15} strokeWidth={2} />
                    )}
                  </button>
                  <button
                    aria-label={`Close ${app.label}`}
                    className="window-control window-close"
                    onClick={() => closeApp(app.id)}
                    onPointerDown={(event) => event.stopPropagation()}
                    type="button"
                  >
                    <X size={16} strokeWidth={2} />
                  </button>
                </div>
              </header>
              <div className="window-body">
                <Content />
              </div>
            </article>
          );
        })}
      </section>

      <div className="dock-zone">
        <nav className="app-dock" aria-label="Running applications">
          {desktopApps.map((app) => {
            const Icon = app.icon;
            const isRunning = runningAppIds.has(app.id);
            const isMinimized = minimizedAppIds.has(app.id);
            const isFocused = focusedAppId === app.id;

            return (
              <button
                aria-label={`Dock ${app.label}: ${isRunning ? "focus" : "open"}`}
                className="dock-icon"
                data-focused={isFocused}
                data-minimized={isMinimized}
                data-running={isRunning}
                key={app.id}
                onClick={() => openApp(app.id)}
                title={app.label}
                type="button"
              >
                <Icon size={22} strokeWidth={1.9} />
                <span>{app.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </main>
  );
}
