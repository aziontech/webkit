/**
 * Documentation Analytics Hooks
 * 
 * Prepares hooks to track:
 * - Most visited pages
 * - Search queries
 * - Documentation usage
 * 
 * Does not integrate analytics providers yet.
 * Instead creates hooks that allow integration later.
 */

/**
 * Analytics event types
 */
export type AnalyticsEventType =
  | 'page_view'
  | 'search_query'
  | 'search_result_click'
  | 'component_view'
  | 'code_copy'
  | 'link_click'
  | 'feedback_submit'
  | 'version_switch'
  | 'language_switch';

/**
 * Analytics event
 */
export interface AnalyticsEvent {
  type: AnalyticsEventType;
  timestamp: string;
  data: Record<string, unknown>;
  metadata?: {
    path?: string;
    referrer?: string;
    language?: string;
    version?: string;
    userAgent?: string;
  };
}

/**
 * Page view event data
 */
export interface PageViewData {
  path: string;
  title: string;
  section?: string;
  category?: string;
  component?: string;
  timeOnPage?: number;
}

/**
 * Search query event data
 */
export interface SearchQueryData {
  query: string;
  resultsCount: number;
  filters?: Record<string, string>;
}

/**
 * Search result click event data
 */
export interface SearchResultClickData {
  query: string;
  resultPath: string;
  resultTitle: string;
  position: number;
}

/**
 * Component view event data
 */
export interface ComponentViewData {
  componentName: string;
  section: string;
  tab?: string;
}

/**
 * Code copy event data
 */
export interface CodeCopyData {
  language: string;
  component?: string;
  codeLength: number;
}

/**
 * Link click event data
 */
export interface LinkClickData {
  url: string;
  text: string;
  isExternal: boolean;
  component?: string;
}

/**
 * Feedback submit event data
 */
export interface FeedbackSubmitData {
  path: string;
  rating: 'helpful' | 'not-helpful';
  comment?: string;
}

/**
 * Version switch event data
 */
export interface VersionSwitchData {
  fromVersion: string;
  toVersion: string;
  path: string;
}

/**
 * Language switch event data
 */
export interface LanguageSwitchData {
  fromLanguage: string;
  toLanguage: string;
  path: string;
}

/**
 * Analytics handler function type
 */
export type AnalyticsHandler = (event: AnalyticsEvent) => void | Promise<void>;

/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
  /** Whether analytics is enabled */
  enabled: boolean;
  /** Debug mode - logs events to console */
  debug: boolean;
  /** Custom handlers */
  handlers: AnalyticsHandler[];
  /** Event filtering */
  filter?: (event: AnalyticsEvent) => boolean;
  /** Event transformation */
  transform?: (event: AnalyticsEvent) => AnalyticsEvent;
}

/**
 * Default analytics configuration
 */
const defaultConfig: AnalyticsConfig = {
  enabled: false,
  debug: false,
  handlers: [],
};

/**
 * Analytics manager class
 */
export class AnalyticsManager {
  private config: AnalyticsConfig;
  private eventQueue: AnalyticsEvent[] = [];
  private isProcessing = false;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Update configuration
   */
  configure(config: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Track an analytics event
   */
  track(
    type: AnalyticsEventType,
    data: Record<string, unknown> | { [key: string]: unknown },
    metadata?: AnalyticsEvent['metadata']
  ): void {
    if (!this.config.enabled) return;

    const event: AnalyticsEvent = {
      type,
      timestamp: new Date().toISOString(),
      data,
      metadata: {
        path: typeof window !== 'undefined' ? window.location.pathname : undefined,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
        language: typeof navigator !== 'undefined' ? navigator.language : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        ...metadata,
      },
    };

    // Apply transformation if configured
    const transformedEvent = this.config.transform
      ? this.config.transform(event)
      : event;

    // Apply filter if configured
    if (this.config.filter && !this.config.filter(transformedEvent)) {
      return;
    }

    // Debug logging
    if (this.config.debug) {
      console.log('[Analytics]', transformedEvent);
    }

    // Add to queue
    this.eventQueue.push(transformedEvent);

    // Process queue
    this.processQueue();
  }

  /**
   * Track page view
   */
  trackPageView(data: PageViewData): void {
    this.track('page_view', { ...data });
  }

  /**
   * Track search query
   */
  trackSearchQuery(data: SearchQueryData): void {
    this.track('search_query', { ...data });
  }

  /**
   * Track search result click
   */
  trackSearchResultClick(data: SearchResultClickData): void {
    this.track('search_result_click', { ...data });
  }

  /**
   * Track component view
   */
  trackComponentView(data: ComponentViewData): void {
    this.track('component_view', { ...data });
  }

  /**
   * Track code copy
   */
  trackCodeCopy(data: CodeCopyData): void {
    this.track('code_copy', { ...data });
  }

  /**
   * Track link click
   */
  trackLinkClick(data: LinkClickData): void {
    this.track('link_click', { ...data });
  }

  /**
   * Track feedback submission
   */
  trackFeedbackSubmit(data: FeedbackSubmitData): void {
    this.track('feedback_submit', { ...data });
  }

  /**
   * Track version switch
   */
  trackVersionSwitch(data: VersionSwitchData): void {
    this.track('version_switch', { ...data });
  }

  /**
   * Track language switch
   */
  trackLanguageSwitch(data: LanguageSwitchData): void {
    this.track('language_switch', { ...data });
  }

  /**
   * Add a custom handler
   */
  addHandler(handler: AnalyticsHandler): void {
    this.config.handlers.push(handler);
  }

  /**
   * Remove a custom handler
   */
  removeHandler(handler: AnalyticsHandler): void {
    const index = this.config.handlers.indexOf(handler);
    if (index > -1) {
      this.config.handlers.splice(index, 1);
    }
  }

  /**
   * Process the event queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) return;

    this.isProcessing = true;

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        await this.dispatchEvent(event);
      }
    }

    this.isProcessing = false;
  }

  /**
   * Dispatch event to all handlers
   */
  private async dispatchEvent(event: AnalyticsEvent): Promise<void> {
    for (const handler of this.config.handlers) {
      try {
        await handler(event);
      } catch (error) {
        if (this.config.debug) {
          console.error('[Analytics] Handler error:', error);
        }
      }
    }
  }

  /**
   * Get all tracked events (for debugging)
   */
  getEventQueue(): AnalyticsEvent[] {
    return [...this.eventQueue];
  }

  /**
   * Clear event queue
   */
  clearQueue(): void {
    this.eventQueue = [];
  }
}

/**
 * Global analytics instance
 */
let globalInstance: AnalyticsManager | null = null;

/**
 * Get or create global analytics instance
 */
export function getAnalytics(): AnalyticsManager {
  if (!globalInstance) {
    globalInstance = new AnalyticsManager();
  }
  return globalInstance;
}

/**
 * Initialize analytics with configuration
 */
export function initAnalytics(config: Partial<AnalyticsConfig> = {}): AnalyticsManager {
  globalInstance = new AnalyticsManager(config);
  return globalInstance;
}

/**
 * Create a console logging handler (for development)
 */
export function createConsoleHandler(): AnalyticsHandler {
  return (event: AnalyticsEvent) => {
    console.log('[Analytics Event]', event.type, event.data);
  };
}

/**
 * Create a local storage handler (for offline analytics)
 */
export function createLocalStorageHandler(storageKey: string = 'docs_analytics'): AnalyticsHandler {
  return (event: AnalyticsEvent) => {
    if (typeof localStorage === 'undefined') return;

    try {
      const stored = localStorage.getItem(storageKey);
      const events: AnalyticsEvent[] = stored ? JSON.parse(stored) : [];
      events.push(event);

      // Keep only last 100 events
      const trimmed = events.slice(-100);
      localStorage.setItem(storageKey, JSON.stringify(trimmed));
    } catch (error) {
      console.error('[Analytics] Local storage error:', error);
    }
  };
}

/**
 * Create a batch handler that sends events in batches
 */
export function createBatchHandler(
  sendFunction: (events: AnalyticsEvent[]) => Promise<void>,
  batchSize: number = 10,
  batchInterval: number = 5000
): AnalyticsHandler {
  let batch: AnalyticsEvent[] = [];
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const flush = async () => {
    if (batch.length === 0) return;

    const eventsToSend = [...batch];
    batch = [];

    try {
      await sendFunction(eventsToSend);
    } catch (error) {
      console.error('[Analytics] Batch send error:', error);
    }
  };

  const scheduleFlush = () => {
    if (timeoutId) return;
    timeoutId = setTimeout(() => {
      timeoutId = null;
      flush();
    }, batchInterval);
  };

  return (event: AnalyticsEvent) => {
    batch.push(event);

    if (batch.length >= batchSize) {
      flush();
    } else {
      scheduleFlush();
    }
  };
}

/**
 * Create a Google Analytics 4 handler (placeholder)
 */
export function createGA4Handler(measurementId: string): AnalyticsHandler {
  return (event: AnalyticsEvent) => {
    // This would integrate with GA4 when implemented
    // For now, just log in debug mode
    if (process.env.NODE_ENV === 'development') {
      console.log(`[GA4 ${measurementId}]`, event.type, event.data);
    }
  };
}

/**
 * Create a Plausible handler (placeholder)
 */
export function createPlausibleHandler(domain: string): AnalyticsHandler {
  return (event: AnalyticsEvent) => {
    // This would integrate with Plausible when implemented
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Plausible ${domain}]`, event.type, event.data);
    }
  };
}

/**
 * Vue composable for analytics
 */
export function useAnalytics() {
  const analytics = getAnalytics();

  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackSearchQuery: analytics.trackSearchQuery.bind(analytics),
    trackSearchResultClick: analytics.trackSearchResultClick.bind(analytics),
    trackComponentView: analytics.trackComponentView.bind(analytics),
    trackCodeCopy: analytics.trackCodeCopy.bind(analytics),
    trackLinkClick: analytics.trackLinkClick.bind(analytics),
    trackFeedbackSubmit: analytics.trackFeedbackSubmit.bind(analytics),
    trackVersionSwitch: analytics.trackVersionSwitch.bind(analytics),
    trackLanguageSwitch: analytics.trackLanguageSwitch.bind(analytics),
  };
}
