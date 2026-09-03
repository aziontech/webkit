# Rule: comments are rare, objective, and never prose

The code is the document; a comment is the exception. Write one only to state what the
code cannot show — a constraint, a non-obvious why. The `webkit/authoring-standards`
ESLint rule blocks a comment block longer than **5 lines** (`verbose-comment-block`) and
a file that is **≥20% prose comments** (`comment-heavy-file`); one-line JSDoc on public
props/events/slots and lint/ts directives are excluded from both counts.

## Do

- Default to **no comment**; let names and types carry the meaning.
- Keep the **one-line JSDoc** on every public prop/event/slot/exported type.
- State a constraint in one or two objective lines when the code cannot express it.
- Move long rationale (design decisions, migration notes) to a doc file, not the source.

## Don't

- Don't narrate the code (`// loop over items`) or restate a name.
- Don't write comment blocks longer than 5 lines — blank lines between comment lines do
  not reset the block.
- Don't leave commented-out code — delete it; git remembers.
- Don't address the reviewer in comments (`// this is correct because…`).
