# Rule: comments are API docs or directives, never prose

The code is the document. Names, types and structure carry the intent; when a block needs
a comment to be understood, rename or restructure it. The `webkit/authoring-standards`
ESLint rule reports every other comment (`prose-comment`) at its line.

## Allowed

- **Component API docs** — JSDoc on `interface Props` entries, `defineEmits` / `defineSlots`
  / `defineModel` declarations, `defineExpose` members, and exported types.
- **Tool directives** — `eslint-*`, `@ts-*`, `prettier-ignore`, `@vite-ignore`, `#__PURE__`.
- **`@deprecated`** JSDoc naming the replacement and the removal version.
- **JSDoc type tags in `.js`** (`@type`, `@typedef`, `@param {T} name`, `@returns {T}`) —
  without description text.

## Don't

- Don't explain a line, add a "why" note, or write a section banner.
- Don't write JSDoc descriptions on functions, composables or constants.
- Don't narrate layout decisions in `<!-- -->` template comments.
- Don't leave commented-out code — delete it; git remembers.
- Don't put rationale in the source — it belongs in a spec, a doc or the commit message.
