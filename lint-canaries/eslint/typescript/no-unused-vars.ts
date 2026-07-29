// CANARY — must keep failing unused-imports/no-unused-vars.
// `orphan` is assigned and never used, without the `_` prefix that would
// mark it intentional. (Unused IMPORTS are guarded separately by
// eslint/import-hygiene/no-unused-imports.ts.)
export function onSelect(item: { label: string }) {
  const orphan = item.label
  return item
}
