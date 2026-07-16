# Rule: composables — one shape, `readonly` outward, cleanup on scope dispose

A composable is a reusable piece of a component's logic, extracted into a `useXxx` function. In this design system it is a **public building block** as much as a component is: it is imported, typed, and relied on by consumers. So it follows a contract as strict as a component's — a predictable surface, a predictable lifetime, and no surprises on destructure. This rule fixes that contract so every composable in the package reads the same way and none of them leak state, listeners, or reactivity.

It rests on three decisions, in priority order:

1. **The surface is verifiable without running anything.** Name, file, return shape, and argument shape are conventions a reviewer (or a lint rule) can check from the signature alone.
2. **State outward is read-only.** A composable owns its state; consumers read it and drive it through the returned functions — they never reassign it. Anything mutable escapes only as an explicit setter.
3. **Everything a composable starts, it stops.** Every listener, timer, `rAF`, and observer is torn down on `onScopeDispose` — so the composable works outside a component and never leaks between tests.

## A. Semantics — the surface every composable declares

Verifiable by lint/signature, without executing anything.

- **Name & file.** `useXxx`, one composable per file, kebab filename (`use-controllable.ts`). **Co-located** in the component's own `composables/` folder when it is specific to that component; in [`src/composables/`](../../packages/webkit/src/composables/) when it is shared across components.
- **Return.** An **object of refs / computed / functions** — never a `reactive()` object (destructuring a `reactive` loses reactivity). Reactive state that escapes is wrapped in **`readonly()`**; mutation happens only through returned functions.
- **Arguments.** Accept **`MaybeRefOrGetter<T>`** and resolve with **`toValue()`** (the successor to `unref`) — so a caller may pass a ref, a getter, or a raw value. Do not accept a `reactive` object as an argument for the same reason you do not return one.
- **Types.** Generics + an **explicit return type**; no `any`. Export the return type when a consumer needs to hold it (`UseControllableReturn<T>`).

```ts
// use-controllable.ts — pure, per-instance
export interface UseControllableReturn<T> {
  value: Readonly<Ref<T>>
  setValue: (next: T) => void
}

export function useControllable<T>(
  modelValue: MaybeRefOrGetter<T | undefined>,
  fallback: T,
  emit: (value: T) => void
): UseControllableReturn<T> {
  const internal = ref(fallback) as Ref<T>
  const value = computed(() => toValue(modelValue) ?? internal.value)
  const setValue = (next: T) => {
    internal.value = next
    emit(next)
  }
  return { value: readonly(value) as Readonly<Ref<T>>, setValue }
}
```

## B. Behaviour by type — how the composable works inside

> **Transversal rule:** state created **inside** the function is **per-instance**; state at **module scope** is a **singleton** (e.g. `use-toast-store`). This is a deliberate choice, made explicit in the name and the doc comment — never an accident of where a `ref` was declared.

### Pure composable (e.g. `use-controllable`)

- Only `ref` / `computed` / functions. **No** `onMounted`, `watch`, `inject`, or DOM access.
- No side-effects, no I/O. **Deterministic:** same inputs → same return.
- Testable by calling it directly — no component host required.

### Lifecycle composable (e.g. `use-dialog-motion-state`)

- **Cleanup with `onScopeDispose`** (not just `onUnmounted`): every listener / timer / `rAF` / observer is removed on dispose. `onScopeDispose` fires for any reactive scope, so the composable also works inside a detached **`effectScope()`** and never leaks between tests.
- **Called synchronously in `setup`** — never inside an `await` continuation or a callback (Vue can only bind lifecycle hooks during synchronous setup).
- **`useId()`** for generated ids (stable in SSR) — never a home-grown counter.
- **Reuse VueUse for primitives** (`useEventListener`, `onClickOutside`, focus-trap) — they already ship correct cleanup. VueUse (`@vueuse/core`) is allow-listed; `@vueuse/motion` and positioning libs are **not** (see [`dependencies.md`](./dependencies.md)).
- **Never call `provide()`** from a lifecycle composable — providing context is the job of the context composable below, invoked from a component root.

## C. The one DS-specific subtype: the context composable

Compound components (`structure: composition`, see [`compound-api.md`](./compound-api.md)) share state root→leaf through `provide`/`inject`. That wiring is a composable so the sub-components consume it without touching `inject` by hand.

```ts
// injection-key.ts
export const LOG_VIEW_KEY: InjectionKey<LogViewContext> = Symbol('LogView')

// use-log-view-context.ts
export function useLogViewContext(): LogViewContext {
  const ctx = inject(LOG_VIEW_KEY, null)
  if (!ctx) throw new Error('useLogViewContext must be used within <LogView>.')
  return ctx
}
```

- A **typed `InjectionKey<T>`** lives in `injection-key.ts` next to the root; its `Symbol()` description is the PascalCase component name (see [`imports.md`](./imports.md) for why `injection-key.ts` is imported as source).
- `useXxxContext()` does the `inject` and **throws a clear error when used outside its provider** — a leaf rendered loose fails loudly, not silently with `undefined`.
- The root `provide`s the context; only the root. Leaves only `inject` via this composable.

## Out of scope — the data composable

A composable that wraps `useQuery`/`useMutation`, derives a `queryKey`, and talks to an API is a **consuming-application** concern (data layer, stores, adapters), **not** a design-system component pattern. This package ships **no** data composables and declares **no** data-fetching rules. A DS component reaches its loading / empty / error surface through props and its own sub-components (see [`component-states.md`](./component-states.md)) — never by fetching. Do not add `@tanstack/vue-query`, HTTP clients, or store logic to a composable in this package.

## Hard prohibitions

- Do not return a `reactive()` object from a composable (destructure loses reactivity). Return refs/computed/functions.
- Do not expose mutable state outward — wrap reactive state in `readonly()`; expose a setter function for writes.
- Do not accept a plain value where a `MaybeRefOrGetter` + `toValue()` would let the caller pass a ref/getter.
- Do not use `any` or omit the return type.
- Do not register a listener/timer/observer without an `onScopeDispose` (or a VueUse primitive that owns its cleanup).
- Do not call a lifecycle composable asynchronously (after `await`) or outside `setup`.
- Do not roll your own id counter — use `useId()`.
- Do not `provide()` from anything other than a context composable invoked at a component root.
- Do not add data-fetching, HTTP, or store logic to a composable (out of scope; see above).

## Enforcement

- **`validate-composable.mjs`** (PreToolUse on `Write|Edit|MultiEdit`, to be added) blocks a `use-*.{ts,js}` that returns a bare `reactive(...)`, that registers a listener/timer/observer with no `onScopeDispose` in the same file, or that uses `any`. Until it lands, the pattern is flagged by `echo-reporter`.
- The **`webkit/composable-readonly-return`** and **`webkit/composable-scope-cleanup`** ESLint rules (to be added to [`eslint-plugin`](../../packages/webkit/src/eslint-plugin/)) cover the same surface at lint time.
- The scaffolder injects this rule whenever a component's spec declares a composable; a composable that diverges surfaces as `BLOCKED:` and stops the run.
- New composables are `.ts` (never `.js`) so the return type is derivable by consumers — same reason the compound `index.ts` is `.ts` (see [`compound-api.md`](./compound-api.md)).

## Why this rule exists

The package already had ~22 composables that had **converged** on good patterns (`use-log-view-context` throws outside its provider; `use-dialog-motion-state` cleans up; `use-controllable` is pure) — but by habit, not by contract. Half were `.js`, they sat in two different folder conventions, and nothing guaranteed a new one would wrap its state in `readonly()`, resolve args with `toValue()`, or tear down its listeners. Writing the contract down — and enforcing the parts a signature reveals — makes the next composable correct by construction instead of by whoever wrote it remembering the last one.
