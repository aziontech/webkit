# CliTerminal

The Azion CLI band: a headline beside its description, with one outlined button to install the CLI, over a terminal session on the pixelate texture. Product pages close their argument with it when the point is how little it takes to ship from the terminal, like Functions and Workloads.

The session sits in a `CodeBlock` that runs off the frame's bottom rule, its lines entering one after another. With reduced motion the finished session draws at once.

The band is the `CliTerminal` component from `@aziontech/webkit/cli-terminal`; it composes `SectionModule`, `SectionTitle`, `Button`, `FrameBox`, `TextureMaterial` and `CodeBlock`.

## Examples

### Terminal

From the Functions page: the two-command deploy: `azion link`, then `azion deploy`, then a curl to the domain the CLI hands back. The Workloads page renders the same band with its own title and its own session.

Example: [`site-terminal.vue`](./site-terminal.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `eyebrow`, `title` and `description` are the headline copy.
- `session` is the terminal session itself, commands and output verbatim; output lines are comments so the copied text still runs.
- `copyAriaLabel` names the copy button for screen readers.
- `primaryAction` is the outlined button beside the headline, a `label`, an `href` and `trailing`. Leave it out to drop the button.

Example:

Site JSON: [`site-terminal.json`](./site-terminal.json)
