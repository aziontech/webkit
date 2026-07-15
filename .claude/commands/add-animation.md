# /add-animation <name> [component]

Scaffold a **new** webkit animation in the one correct place — the semantic animation
catalog — so components never ship a component-local `@keyframes` or an off-catalog
`animate-[…]`. Triggered by hand, or pointed at by `validate-spec-compliance` when a
component uses an `animate-*` that is not yet in the catalog.

Run the **add-animation** skill (`.claude/skills/add-animation/SKILL.md`). It:

1. Adds a `.animate-<name>` utility + its `@keyframes` to
   `packages/theme/src/tokens/semantic/animations.js`, using the `duration` / `curve`
   tokens from `primitives/animations/animate.js` — published as `@aziontech/theme/animations` — (never a raw ms / cubic-bezier literal).
2. Records a **Theme gaps** row in the component's `.specs/<component>.md` (when a
   component is given) so the addition is tracked.
3. Regenerates the catalog (`pnpm --filter @aziontech/webkit catalog:build`) so
   `tokens.animations` includes `<name>` and the compliance cross-check passes.
4. Reminds you to pair the class with `motion-reduce:*` in the component.

Do **not** edit `.claude/docs/DESIGN.md` — the catalog + `semantic/animations.js` are the
source of truth; DESIGN.md is a human mirror updated separately.

`<name>` is kebab-case (e.g. `slide-left`). The keyframe name is its camelCase form.
