let started = false

function start() {
  if (started) return
  started = true
  void import('./main')
}

function afterFirstPaint() {
  if (performance.getEntriesByName('first-contentful-paint').length) return start()
  try {
    const observer = new PerformanceObserver(() => {
      observer.disconnect()
      start()
    })
    observer.observe({ type: 'paint', buffered: true })
  } catch {
    return start()
  }
  setTimeout(start, 3000)
}

afterFirstPaint()
