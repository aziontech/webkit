/**
 * Declarative z-index tokens.
 *
 * Intra-input stacking:
 *
 *   - `z-input-field`   → native field / interactive foreground (e.g. an
 *                          `<input>` or trigger button) sitting above the
 *                          input's own background surface, icons, and
 *                          adornments so keyboard/mouse focus is never
 *                          hijacked by a decorative sibling.
 *   - `z-input-popup`   → inline (non-teleported) overlays anchored to the
 *                          input — dropdown menus, option lists, popovers —
 *                          that must sit above surrounding form content but
 *                          within the current stacking context.
 *   - `z-input-overlay` → teleported overlays (rendered under `<body>` via
 *                          `<Teleport>`) that must clear application chrome
 *                          such as drawers, modals, and fixed headers.
 *
 * Values are intentionally small and well-spaced to make future additions
 * obvious. Consume as `z-[var(--z-input-*)]` in components — do not
 * introduce ad-hoc numeric z-index in input `.vue` files.
 */

export const zIndicesData = {
  'z-input-field': { _: '1' },
  'z-input-popup': { _: '10' },
  'z-input-overlay': { _: '1100' },
};

export default { zIndicesData };
