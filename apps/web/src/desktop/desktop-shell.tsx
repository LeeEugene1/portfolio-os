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
import { motion } from "framer-motion";
import { Maximize2, Minimize2, Minus, X } from "lucide-react";
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  openOrder: number;
  isMaximized: boolean;
  isMinimized: boolean;
};

type DragState = {
  kind: "window";
  appId: AppId;
  offsetX: number;
  offsetY: number;
  startX: number;
  startY: number;
  hasMoved: boolean;
};

type IconPosition = {
  x: number;
  y: number;
};

function createWindowState(
  appId: AppId,
  zIndex: number,
  openOrder: number,
): WindowState {
  const app = appsById.get(appId);
  const openOffset = openOrder * 10;

  return {
    appId,
    zIndex,
    x: (app?.defaultPosition.x ?? 0) + openOffset,
    y: (app?.defaultPosition.y ?? 0) + openOffset,
    openOrder,
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

const initialWindows: WindowState[] = [createWindowState("portfolio", 1, 0)];
const iconOrigin = 24;
const iconStep = 102;
const iconSize = 88;
const iconGap = 8;
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

function doIconsOverlap(first: IconPosition, second: IconPosition) {
  return (
    Math.abs(first.x - second.x) < iconSize + iconGap &&
    Math.abs(first.y - second.y) < iconSize + iconGap
  );
}

function findOpenIconPosition(
  appId: AppId,
  nextPosition: IconPosition,
  currentPositions: Record<AppId, IconPosition>,
) {
  const basePosition = clampIconPosition(nextPosition.x, nextPosition.y);
  const isOpen = Object.entries(currentPositions).every(
    ([currentAppId, currentPosition]) =>
      currentAppId === appId || !doIconsOverlap(basePosition, currentPosition),
  );

  if (isOpen) {
    return basePosition;
  }

  const step = iconSize + iconGap;
  const candidates: Array<IconPosition & { distance: number }> = [];

  for (let radius = step; radius <= step * 5; radius += step) {
    for (let dx = -radius; dx <= radius; dx += step) {
      for (let dy = -radius; dy <= radius; dy += step) {
        if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) {
          continue;
        }

        const candidate = clampIconPosition(
          basePosition.x + dx,
          basePosition.y + dy,
        );
        const overlaps = Object.entries(currentPositions).some(
          ([currentAppId, currentPosition]) =>
            currentAppId !== appId && doIconsOverlap(candidate, currentPosition),
        );

        if (!overlaps) {
          candidates.push({
            ...candidate,
            distance: Math.abs(dx) + Math.abs(dy),
          });
        }
      }
    }

    if (candidates.length > 0) {
      break;
    }
  }

  return (
    candidates.sort((first, second) => first.distance - second.distance)[0] ??
    basePosition
  );
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 720px)").matches;
}

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 720px)");
    const syncViewport = () => setIsMobile(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  return isMobile;
}

function DesktopIcon({
  app,
  isActive,
  isMobile,
  onOpen,
  position,
}: {
  app: DesktopApp;
  isActive: boolean;
  isMobile: boolean;
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
        transform: isMobile ? undefined : CSS.Transform.toString(transform),
      }}
      type="button"
      {...(isMobile ? {} : attributes)}
      {...(isMobile ? {} : listeners)}
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
  const [nextOpenOrder, setNextOpenOrder] = useState(1);
  const [suppressedClickAppId, setSuppressedClickAppId] =
    useState<AppId | null>(null);
  const [suppressedWindowClickAppId, setSuppressedWindowClickAppId] =
    useState<AppId | null>(null);
  const draggedWindowAppIdRef = useRef<AppId | null>(null);
  const isMobile = useIsMobileViewport();
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
  const hasMaximizedWindow = visibleWindows.some(
    (windowState) => windowState.isMaximized,
  );
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

  function focusOrExpandWindow(appId: AppId) {
    const shouldExpand = isMobileViewport();

    setWindows((currentWindows) =>
      currentWindows.map((windowState) =>
        windowState.appId === appId
          ? {
              ...windowState,
              zIndex: nextZIndex,
              isMaximized: shouldExpand ? true : windowState.isMaximized,
              isMinimized: false,
            }
          : shouldExpand
            ? { ...windowState, isMaximized: false }
            : windowState,
      ),
    );
    setNextZIndex((current) => current + 1);
  }

  function openApp(appId: AppId, options?: { expandOnMobile?: boolean }) {
    const shouldExpand = Boolean(options?.expandOnMobile && isMobileViewport());

    setWindows((currentWindows) => {
      if (currentWindows.some((windowState) => windowState.appId === appId)) {
        return currentWindows.map((windowState) =>
          windowState.appId === appId
            ? {
                ...windowState,
                zIndex: nextZIndex,
                isMaximized: shouldExpand ? true : windowState.isMaximized,
                isMinimized: false,
              }
            : shouldExpand
              ? { ...windowState, isMaximized: false }
              : windowState,
        );
      }

      const nextWindow = createWindowState(appId, nextZIndex, nextOpenOrder);

      return [
        ...currentWindows.map((windowState) =>
          shouldExpand ? { ...windowState, isMaximized: false } : windowState,
        ),
        { ...nextWindow, isMaximized: shouldExpand },
      ];
    });
    setNextZIndex((current) => current + 1);
    setNextOpenOrder((current) => current + 1);
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
    event.stopPropagation();

    if (isMobileViewport()) {
      return;
    }

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
      startX: event.clientX,
      startY: event.clientY,
      hasMoved: false,
    });
  }

  function dragWindow(event: React.PointerEvent<HTMLElement>) {
    if (!dragState) {
      return;
    }

    const hasMoved =
      dragState.hasMoved ||
      Math.abs(event.clientX - dragState.startX) > 4 ||
      Math.abs(event.clientY - dragState.startY) > 4;
    const nextPosition = clampWindowPosition(
      event.clientX - dragState.offsetX,
      event.clientY - dragState.offsetY,
    );

    if (hasMoved !== dragState.hasMoved) {
      draggedWindowAppIdRef.current = dragState.appId;
      setDragState({ ...dragState, hasMoved });
    }
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

    if (draggedWindowAppIdRef.current) {
      setSuppressedWindowClickAppId(draggedWindowAppIdRef.current);
      draggedWindowAppIdRef.current = null;
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
        [activeId]: findOpenIconPosition(
          activeId,
          {
            x: currentPosition.x + event.delta.x,
            y: currentPosition.y + event.delta.y,
          },
          currentPositions,
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
              isMobile={isMobile}
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

      <section
        className="window-layer"
        aria-label="Open windows"
        data-has-maximized={hasMaximizedWindow}
      >
        {orderedWindows.map((windowState, stackIndex) => {
          const app = appsById.get(windowState.appId);

          if (!app) {
            return null;
          }

          const Content = app.content;
          const titleId = `${app.id}-window-title`;
          const isFocused = focusedAppId === app.id;

          return (
            <motion.article
              aria-labelledby={titleId}
              className="desktop-window"
              data-app-id={app.id}
              data-focused={isFocused}
              data-maximized={windowState.isMaximized}
              data-stack-index={stackIndex}
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              key={app.id}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                boxShadow: isFocused
                  ? "10px 10px 0 #202124"
                  : "8px 8px 0 rgba(32, 33, 36, 0.9)",
              }}
              layout
              onClick={() => {
                if (suppressedWindowClickAppId === app.id) {
                  setSuppressedWindowClickAppId(null);
                  return;
                }

                if (isMobileViewport()) {
                  focusOrExpandWindow(app.id);
                }
              }}
              onPointerDown={() => {
                if (!isMobileViewport()) {
                  focusWindow(app.id);
                }
              }}
              role="dialog"
              style={{
                height: windowState.isMaximized ? undefined : app.defaultSize.height,
                left: windowState.isMaximized ? undefined : windowState.x,
                top: windowState.isMaximized ? undefined : windowState.y,
                width: windowState.isMaximized ? undefined : app.defaultSize.width,
                zIndex: windowState.zIndex,
                "--stack-index": stackIndex,
                "--stack-offset": `${stackIndex * 10}px`,
                "--stack-lift": `${stackIndex * -18}px`,
              } as CSSProperties}
              transition={{ duration: 0.18, ease: "easeOut" }}
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
                    onClick={(event) => {
                      event.stopPropagation();
                      minimizeApp(app.id);
                    }}
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
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleMaximizeApp(app.id);
                    }}
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
                    onClick={(event) => {
                      event.stopPropagation();
                      closeApp(app.id);
                    }}
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
            </motion.article>
          );
        })}
      </section>

      <nav className="mobile-window-tabs" aria-label="Mobile applications">
        {desktopApps.map((app) => {
          const Icon = app.icon;
          const isRunning = runningAppIds.has(app.id);
          const isFocused = focusedAppId === app.id;

          return (
            <button
              aria-label={`Mobile tab ${app.label}`}
              className="mobile-window-tab"
              data-focused={isFocused}
              data-running={isRunning}
              key={app.id}
              onClick={() => openApp(app.id, { expandOnMobile: true })}
              type="button"
            >
              <span className="mobile-tab-status" aria-hidden="true" />
              <Icon size={15} strokeWidth={1.8} />
              <span>{app.label}</span>
            </button>
          );
        })}
      </nav>

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
