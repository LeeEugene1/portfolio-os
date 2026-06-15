"use client";

import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { appsById, desktopApps, type AppId } from "./app-definitions";

type WindowState = {
  appId: AppId;
  zIndex: number;
};

const initialWindows: WindowState[] = [{ appId: "portfolio", zIndex: 1 }];

export function DesktopShell() {
  const [windows, setWindows] = useState<WindowState[]>(initialWindows);
  const [nextZIndex, setNextZIndex] = useState(2);

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

      return [...currentWindows, { appId, zIndex: nextZIndex }];
    });
    setNextZIndex((current) => current + 1);
  }

  function closeApp(appId: AppId) {
    setWindows((currentWindows) =>
      currentWindows.filter((windowState) => windowState.appId !== appId),
    );
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
                left: app.defaultPosition.x,
                top: app.defaultPosition.y,
                width: app.defaultSize.width,
                zIndex: windowState.zIndex,
              }}
            >
              <header className="window-titlebar">
                <div>
                  <span className="window-status" aria-hidden="true" />
                  <h1 id={titleId}>{app.title}</h1>
                </div>
                <button
                  aria-label={`Close ${app.label}`}
                  className="window-close"
                  onClick={() => closeApp(app.id)}
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
