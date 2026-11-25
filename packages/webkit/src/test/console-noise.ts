export const RESIZE_OBSERVER_LOOP =
  /ResizeObserver loop (completed with undelivered notifications|limit exceeded)/

export const keepConsoleLog = (log: string): boolean => !RESIZE_OBSERVER_LOOP.test(log)
