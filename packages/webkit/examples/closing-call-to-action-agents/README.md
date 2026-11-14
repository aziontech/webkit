# ClosingCallToActionAgents

The close for a reader who may be a person or an agent. It is `ClosingCallToActionAgents` from `@aziontech/webkit/closing-call-to-action-agents`.

## Examples

### Default

The close for a reader who may be a person or an agent. It is the `primary` register, so it shares its canvas ground and the pixelated wave. One centred ask, with a small `ToggleGroup` under the title that switches the way in: For humans offers the sign-up and a specialist, For agents hands over a prompt that connects the Azion MCP server, which works in any client. Each way carries an optional copyable line and its actions, then the closing frame follows.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

The title, a small switch, one compact row of copyable line and actions, then two lines that are the same for every audience, so the band keeps its height when the switch changes. The swapped row sits in a polite live region and fades in, with no motion under reduced motion.

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `anchor` is the band's id for in-page links, `contact` by convention.
- `title` is the headline.
- `typedLead` and `typedWords` make the first line under the row. The lead stays put, and the words are typed, held, erased and typed again, in order, behind a blinking cursor. Screen readers get the whole sentence at once, and reduced motion shows every word at once with no cursor. `description` is the line under it.
- `audiences` are the ways in, each a `value` and a `label` for the switch; the first one opens. `copy` is an optional line to copy: `text` is what the field shows and the button copies, `label` names the copy button. `actions` are the buttons beside it, each a `label`, an `href`, a `kind` (`secondary` for the white pill, `outlined` by default) and `trailing` for the chevron.
- `audiencesAriaLabel` names the switch and `lineAriaLabel` the copyable field for assistive tech.

Example:

Site JSON: [`site-default.json`](./site-default.json)
