type MetricName = "LCP" | "CLS" | "INP";

function reportMetric(name: MetricName, value: number) {
  if (import.meta.env.DEV) {
    console.info(`[web-vitals] ${name}:`, value);
  }
}

export function startPerformanceObservers() {
  if (!("PerformanceObserver" in window)) return;

  const lcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const latest = entries.at(-1);
    if (latest) {
      reportMetric("LCP", latest.startTime);
    }
  });
  lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

  let clsValue = 0;
  const clsObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries() as Array<
      PerformanceEntry & { hadRecentInput?: boolean; value?: number }
    >) {
      if (!entry.hadRecentInput && typeof entry.value === "number") {
        clsValue += entry.value;
      }
    }
    reportMetric("CLS", clsValue);
  });
  clsObserver.observe({ type: "layout-shift", buffered: true });

  const inpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const latest = entries.at(-1);
    if (latest) {
      reportMetric("INP", latest.duration);
    }
  });
  inpObserver.observe({ type: "event", buffered: true } as PerformanceObserverInit);
}
