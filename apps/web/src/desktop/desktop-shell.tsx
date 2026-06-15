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

type DragState = {
  appId: AppId;
  offsetX: number;
  offsetY: number;
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

const initialWindows: WindowState[] = [createWindowState("portfolio", 1)];

export function DesktopShell() {
  const [windows, setWindows] = useState<WindowState[]>(initialWindows);
  const [nextZIndex, setNextZIndex] = useState(2);
  const [dragState, setDragState] = useState<DragState | null>(null);

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
              onClick={() => openApp(app.id)}
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
