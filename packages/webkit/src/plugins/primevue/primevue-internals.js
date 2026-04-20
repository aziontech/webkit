/**
 * Centralized re-export of all stateful PrimeVue internal modules.
 *
 * WHY THIS FILE EXISTS:
 * PrimeVue 3.x uses module-level singletons (EventBus instances, Symbols)
 * for communication between services and components (e.g., ToastService emits
 * to ToastEventBus, and the Toast component listens on the same bus).
 *
 * When a consumer app uses Vite, pre-bundling can create separate chunks for
 * each primevue/* import encountered from different entry points. This
 * duplicates the singletons, breaking the communication channel.
 *
 * By funneling all stateful primevue imports through this single file,
 * Vite sees one dependency graph and creates one chunk -- guaranteeing
 * singleton identity.
 *
 * RULE: All webkit files that need these modules MUST import from here,
 * never directly from primevue/*. Stateless component imports (e.g.,
 * primevue/button) are safe to import directly in .vue files.
 */

// ---- PrimeVue core ----
export { default as PrimeVueConfig } from 'primevue/config'

// ---- Toast (stateful: EventBus + Symbol) ----
export { default as ToastEventBus } from 'primevue/toasteventbus'
export { default as ToastService } from 'primevue/toastservice'
export { PrimeVueToastSymbol, useToast as usePrimeToast } from 'primevue/usetoast'

// ---- Dialog (stateful: EventBus + Symbol) ----
export { default as DialogService } from 'primevue/dialogservice'
export { default as DynamicDialogEventBus } from 'primevue/dynamicdialogeventbus'
export { PrimeVueDialogSymbol, useDialog as usePrimeDialog } from 'primevue/usedialog'

// ---- Directives ----
export { default as Tooltip } from 'primevue/tooltip'

// ---- API / Utils ----
export { FilterMatchMode } from 'primevue/api'
