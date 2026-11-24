---
name: message-thread
category: content
structure: composition
status: approved
stability: preview
spec_version: 1
template: 2
checksum: ed4e8e1cf2bace65ba3a075e920076fa28d9284908da6a0fb73312d9bf76ccb9
created: 2026-11-23
last_updated: 2026-11-23
---

# MessageThread — Component Spec

## Purpose

The conversation of a support ticket, oldest first, as Help Scout, Front, Plain and the Zendesk
Agent Workspace show it: each message names its author (avatar, name, customer or agent), the
channel it came by, when it was sent and, for email, who received it; then the body, the
attachments and the quoted previous messages behind a toggle. Three types of item share the list:
a public reply, an internal note (a warning band labelled "Internal note", so it never reads as a
reply sent to the customer), and a system event line ("Jane Doe changed status to Pending"). A
long middle collapses behind "Show 6 earlier messages". It is not `ChatMessage`, which is the
generative AI chat (decision SUP-03).

## When to use

- The conversation on a support ticket or a customer case: the customer's emails and chats, the agents' replies, the internal notes agents leave each other, and the status changes in between.
- An email-style message history where each message shows its sender, recipients (To, Cc), channel, attachments and the quoted text of earlier messages.
- A ticket that mixes public replies and private notes, where an agent must see at a glance which messages the customer can read.

## When NOT to use

- A chat with the generative AI assistant → `chat-message` inside `conversation`.
- A log of what happened to a resource, with no messages (deploys, status changes, audit entries) → `timeline`.
- A single notice on a page → `alert`.
- Comments on a code line or a review → not this component; it carries support semantics (channels, recipients, internal notes).

## Related

- `chat-message` — the AI conversation turn (`from: user | assistant | system`, feedback thumbs, regenerate). A ticket has customers and agents, notes, channels and recipients instead (SUP-03).
- `timeline` — an activity log of events; a thread interleaves a few event lines between messages.
- `timestamp` — the sent time of each item; it opens the full date in every zone.
- `avatar` — the author's picture or initials.
- `file-token-group`, `file-preview` — the attachments composed into an item's `attachments` slot.
- `icon-button`, `dropdown-menu` — the Reply button and the More menu (Forward, …) composed into an item's `actions` slot.

## Best practices

- Render the items oldest first; the newest message sits at the end, next to the reply composer.
- Put every message after the first two and before the last three in a `MessageThread.Group` once a thread holds more than eight, so the newest messages stay in view.
- Pass `count` on the Group with the number of items it holds; the button reads it.
- Use `type="note"` for anything only agents can read; never colour a reply to make it look private.
- Put the text of earlier messages that an email quotes in the `quoted` slot, not in the body, so the reader sees only what is new.
- Keep the `actions` slot short: Reply as an `IconButton`, Forward and the rest as items of a More `DropdownMenu`.
- Write an event line as one short sentence that names who did what ("Jane Doe changed status to Pending").

## Usage

```vue
<script setup>
  import MessageThread from '@aziontech/webkit/message-thread'
  import FileTokenGroup from '@aziontech/webkit/file-token-group'
  import IconButton from '@aziontech/webkit/icon-button'

  const attachments = [{ file: { name: 'invoice-1042.pdf', size: 84000 } }]
</script>

<template>
  <MessageThread aria-label="Ticket 1042 conversation">
    <MessageThread.Item
      author="Alex Morgan"
      from="customer"
      channel="email"
      timestamp="2026-11-20T09:12:00Z"
      :to="['support@example.com']"
      :cc="['sam.lee@example.com']"
    >
      I was charged twice for the November invoice. Can you refund one of them?
      <template #attachments>
        <FileTokenGroup
          :items="attachments"
          readonly
        />
      </template>
      <template #quoted>On Nov 18, Acme Support wrote: Your invoice is ready.</template>
    </MessageThread.Item>
    <MessageThread.Group :count="2">
      <MessageThread.Item
        author="Jane Doe"
        from="agent"
        channel="email"
        timestamp="2026-11-20T10:02:00Z"
      >
        Thanks, Alex. I am checking the payment with our billing team.
      </MessageThread.Item>
      <MessageThread.Item
        type="note"
        author="Jane Doe"
        from="agent"
        timestamp="2026-11-20T10:05:00Z"
      >
        Duplicate charge confirmed in the billing console.
      </MessageThread.Item>
    </MessageThread.Group>
    <MessageThread.Item
      type="event"
      timestamp="2026-11-20T10:06:00Z"
    >
      Jane Doe changed status to Pending
    </MessageThread.Item>
    <MessageThread.Item
      author="Jane Doe"
      from="agent"
      channel="email"
      timestamp="2026-11-20T11:30:00Z"
    >
      The refund is on its way and will reach your card in 5 to 10 business days.
      <template #actions>
        <IconButton
          icon="az az-reply"
          variant="ghost"
          aria-label="Reply"
        />
      </template>
    </MessageThread.Item>
  </MessageThread>
</template>
```

Tree-shaking alternative — the standalone root and each part from its own entry:

```vue
<script setup>
  import MessageThread from '@aziontech/webkit/message-thread-root'
  import MessageThreadItem from '@aziontech/webkit/message-thread-item'
  import MessageThreadGroup from '@aziontech/webkit/message-thread-group'
</script>
```

## Sub-components

Compound API through `index.ts` (`MessageThread.Item`, `MessageThread.Group`); standalone entries
`message-thread-root`, `message-thread-item`, `message-thread-group`. The root provides
`{ timestampFormat }` (`injection-key.ts`, `MessageThreadInjectionKey`, type `MessageThreadContext`);
`useMessageThreadContext()` (`composables/use-message-thread-context.ts`, a public named export of `index.ts`
with its type, `CODE_QUALITY.md` § 3.5 point 6, so an app can write its own context-aware part) throws outside a `MessageThread`, so a part rendered loose fails loudly.

The root is an `ol` (`role="list"`): every Item is an `li`, and a Group is an `li` holding a nested
`ol` of its Items once open. The parts never read their slot vnodes.

- `message-thread-item/message-thread-item.vue` — one item of the thread, an `li`.
  - `type="reply"` and `type="note"`: an `article` card. Header: the author's `Avatar` (`medium`, decorative, initials from `author` when `avatarSrc` is empty), the name (`__author`), the role (`Customer` / `Agent`, `__role`), the channel (`via Email`, with its glyph, `__channel`; replies only), the sent `Timestamp` (`__time`) and the `actions` slot (`__actions`) at the inline end. Under the header, for a reply with recipients, a line `To: …` and `Cc: …` (`__recipients`, one `To` and one `Cc` line, the address list isolated). Then the body (`__content`, the default slot), the quoted-text toggle and region (`__quoted-toggle`, `__quoted`) when the `quoted` slot is given, and the `attachments` slot (`__attachments`).
  - `type="note"` adds a band across the top of the card (`__note`): a lock glyph and the words `Internal note`, on the warning fill. Channel and recipients are not shown on a note.
  - `type="event"`: no card, no article; one muted line (`__event`) with a history glyph, the default slot (the sentence) and the `Timestamp`. Author, avatar, role, channel, recipients, `quoted`, `attachments` and `actions` are not rendered.
  - Props: see the table below (`MessageThreadItemProps`).
  - v-model: `v-model:quotedOpen` — `boolean`, `defineModel('quotedOpen')`, default `false`, emits `update:quotedOpen`. The quoted-text toggle flips it.
  - Slots: `default` — the body (plain text keeps its line breaks, or composed content); `actions` — a Reply `IconButton` and a More `DropdownMenu` (Forward, …) at the end of the header; `attachments` — a read-only `FileTokenGroup` or `FilePreview`s under the body; `quoted` — the earlier messages an email quotes, hidden until the toggle opens it.
  - `data-testid` fallback `message-thread-item`; `data-slot="message-thread-item"`.
- `message-thread-group/message-thread-group.vue` — a run of items collapsed behind one button, an `li`.
  - Closed: a `Button` (`variant="outline"`, `size="small"`, `__toggle`) reading `Show {count} earlier messages`, centred between two hairlines. It reveals and is then replaced, like a load-more button, so it carries no `aria-expanded` or `aria-controls`; focus moves into what it revealed.
  - Open: a nested `ol` (`role="list"`, `__list`, named `Earlier messages`) holding the default slot. Opening moves focus to the first item's `article` (or `li` for an event) inside it, so a keyboard or screen reader user lands on the first revealed message.
  - Props: `count?: number` (default `0` — how many items the group holds, read in the button; `0` reads `Show earlier messages`).
  - v-model: `v-model:open` — `boolean`, `defineModel('open')`, default `false`, emits `update:open`.
  - Slots: `default` — the hidden `MessageThread.Item`s.
  - `data-testid` fallback `message-thread-group`; `data-slot="message-thread-group"`; `data-state="open|closed"`.

Exported types: `MessageThreadProps`, `MessageThreadItemProps`, `MessageThreadGroupProps`,
`MessageThreadItemType` (`'reply' | 'note' | 'event'`), `MessageThreadFrom`
(`'customer' | 'agent'`), `MessageThreadChannel` (`'email' | 'chat' | 'phone' | 'web' | 'api'`),
`MessageThreadContext`; `timestampFormat` reuses `TimestampFormat` exported by `timestamp`. Composed DS components: `timestamp`, `avatar`, `icon-button`, `button`,
`skeleton`.

```
packages/webkit/src/components/content/message-thread/
├── message-thread.vue
├── message-thread.test.ts
├── index.ts
├── injection-key.ts
├── composables/use-message-thread-context.ts
├── message-thread-item/message-thread-item.vue
└── message-thread-group/message-thread-group.vue
```

Exports: `./message-thread` → `index.ts`, `./message-thread-root` → `message-thread.vue`,
`./message-thread-item`, `./message-thread-group` → their `.vue` files.

### MessageThread.Item props

| Prop        | Type                                               | Default     | Required | JSDoc                                                                                                       |
| ----------- | -------------------------------------------------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `type`      | `'reply' \| 'note' \| 'event'`                     | `'reply'`   | false    | What the item is: a public reply, an internal note only agents read, or a system event line.                |
| `author`    | `string`                                           | `''`        | false    | Name of who wrote the message, shown in the header and read in the item's accessible name.                  |
| `avatarSrc` | `string`                                           | `''`        | false    | Image URL of the author's avatar. Empty shows the initials of `author`.                                     |
| `from`      | `'customer' \| 'agent'`                            | `'customer'`| false    | Whether the author is the customer or an agent; shown as the role beside the name.                          |
| `channel`   | `'email' \| 'chat' \| 'phone' \| 'web' \| 'api'`   | `undefined` | false    | How a reply came in or went out, shown as `via Email` with its glyph. Unset shows no channel.               |
| `timestamp` | `string \| number \| Date`                         | `undefined` | false    | When the item was sent: an ISO string, an epoch in milliseconds or a `Date`, rendered by `Timestamp`.       |
| `to`        | `string[]`                                         | `[]`        | false    | Email addresses the reply was sent to, shown on the recipients line.                                        |
| `cc`        | `string[]`                                         | `[]`        | false    | Email addresses copied on the reply, shown on the recipients line.                                          |

## Props

| Prop              | Type                               | Default   | Required | JSDoc                                                                                                  |
| ----------------- | ---------------------------------- | --------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `timestampFormat` | `TimestampFormat`                  | `'local'` | false    | How every item's sent time reads: `relative` (`2 hours ago`), `local` date and time, or `utc` — Timestamp's own union. |
| `loading`         | `boolean`                          | `false`   | false    | Shows three placeholder messages in place of the items while the thread loads, and marks it busy.     |
| `ariaLabel`       | `string`                           | `''`      | false    | Accessible name of the list. Empty uses the locale catalog (`Conversation`).                          |

## Events

_None._ The root emits nothing; each part's two-way state is its `v-model` (see Sub-components).
Reply, Forward and other actions are the app's own controls in the `actions` slot, so the thread
adds no action events.

## Slots

| Slot      | Scope | Notes                                                                                          |
| --------- | ----- | ---------------------------------------------------------------------------------------------- |
| `default` | —     | The `MessageThread.Item` and `MessageThread.Group` children, oldest first. Not rendered while `loading`. |

## States

- Root: `data-testid` fallback `message-thread`, `data-slot="message-thread"`, `data-loading` and `aria-busy="true"` while `loading`; `data-timestamp-format` mirrors `timestampFormat`.
- Loading: three `li` placeholders (`__placeholder`), each an avatar circle and two text lines built from `Skeleton`, in place of the slot. When `loading` turns on, `Loading conversation` is announced through `useAnnouncer`; when it turns off, `Conversation loaded`.
- No empty state (`emptyTitle` is not taken, the second exception to § 3.7): a ticket always holds its first message; an app with nothing to show renders `EmptyState` instead of the thread.
- Item: `data-type` (`reply` | `note` | `event`), `data-from` (`customer` | `agent`, not on events), `data-channel` when `channel` is set. The quoted region (`__quoted`) carries `data-state` (`open` | `closed`).
- Group: `data-state` (`open` | `closed`).
- Quoted region: always rendered once the `quoted` slot is given, with the `hidden` attribute while closed, so the toggle's `aria-controls` always points at an element.
- States the thread does not own: `disabled`, `readonly` and `invalid` do not apply (the items are display-only; the controls in `actions` carry their own); there is no `error` / `retry` either. The thread is one region of a ticket page that loads the ticket as a whole, so a failed load is the page's own state (an `Alert` or `EmptyState` with Try again in place of the thread), as the `detail` blocks do. This is the explicit exception to the list state contract of `CODE_QUALITY.md` § 3.7, which is written for pickers and data lists that fetch and page their own rows; the thread keeps only its `loading`.
- Invalid or missing `timestamp`: the item shows no time (Timestamp is not rendered) and its accessible name is the author alone.

## Motion & Animations

_none_ — the thread does not animate. `Timestamp` owns its panel motion and `Button` / `IconButton`
their hover fades, each with its `motion-reduce:` fallback.

## Tokens

| Region                        | Token (DESIGN.md)                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------ |
| list gap                      | `var(--spacing-md)`                                                                              |
| message card                  | `var(--bg-surface)`, `border border-(--border-default)`, `var(--shape-card)`, padding `var(--spacing-md)` |
| header gap                    | `var(--spacing-sm)`, `var(--spacing-2xs)`                                                        |
| author                        | `.text-label-md`, `var(--text-default)`                                                          |
| role, channel, recipients     | `.text-body-sm`, `var(--text-muted)`                                                             |
| body                          | `.text-body-md`, `var(--text-default)`, `whitespace-pre-line`, `break-words`                     |
| note band                     | `var(--warning)` fill, `var(--warning-foreground)` text and lock glyph, `.text-label-sm`, padding `var(--spacing-2xs)` / `var(--spacing-md)` |
| quoted region                 | `border-s-2 border-(--border-default)`, `ps-(--spacing-sm)`, `.text-body-sm`, `var(--text-muted)` |
| event line                    | `.text-body-sm`, `var(--text-muted)`, glyph `var(--text-muted)`                                  |
| group hairlines               | `border-t border-(--border-default)`                                                             |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Structure: the root is an `ol` with `role="list"` (kept under `list-style: none`), named by `ariaLabel` or `Conversation`; each Item is an `li`. A reply or note is an `article` named by `aria-labelledby`: for a note the `Internal note` band, then the author name, then the Timestamp's text — so every message has a unique name ("Internal note Jane Doe Nov 20, 2026, 10:05 AM"). An event line is plain text in its `li`. It is a list of articles, not the APG Feed pattern (`role="feed"`): the thread does not load more as the reader scrolls; it collapses its middle behind a Group button instead.
- Never colour alone: a note carries the visible words `Internal note` and a lock glyph; the role is written (`Customer`, `Agent`); the channel is written beside its glyph. Every glyph is `aria-hidden`.
- The avatar is decorative (`aria-hidden`): the name beside it is the text.
- Keyboard map: `Tab` moves through the controls in reading order — each Timestamp, the item's actions, the quoted-text toggle, links and attachments in the content, the Group button. `Enter` / `Space` activate. Opening a Group moves focus to the first revealed item (`tabindex="-1"` on its `article` or `li`); nothing else moves focus.
- Quoted text: the toggle follows the WAI-ARIA APG Disclosure (Show/Hide) pattern: a small ghost `IconButton` (ellipsis glyph) named `Show quoted text` / `Hide quoted text`, with `aria-expanded` and `aria-controls` pointing at the region (`useId`), which is `hidden` while closed.
- Group: the button is a native `Button` that reveals and is replaced (no `aria-expanded`); open, the nested list is named `Earlier messages` and focus is on its first item.
- Loading: `aria-busy="true"` on the list; the placeholders are `aria-hidden`; the start and end are announced through `useAnnouncer`.
- Visible focus: the composed controls draw the ring token; the focused `article` after opening a Group draws `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Contrast: `--text-default` and `--text-muted` on `--bg-surface`, `--warning-foreground` on `--warning` — documented pairs in both themes.
- Touch target: the quoted toggle and the app's `IconButton`s are 32 px with a 44 px hit area on a coarse pointer; the Group button is a `Button` with the same hit area.

## Internationalization

| Key                          | English source                                                         | Override prop |
| ---------------------------- | ---------------------------------------------------------------------- | ------------- |
| `messageThread.label`        | `Conversation`                                                         | `ariaLabel`   |
| `messageThread.loading`      | `Loading conversation`                                                 | —             |
| `messageThread.loaded`       | `Conversation loaded`                                                  | —             |
| `messageThread.customer`     | `Customer`                                                             | —             |
| `messageThread.agent`        | `Agent`                                                                | —             |
| `messageThread.via`          | `via {channel}`                                                        | —             |
| `messageThread.email`        | `Email`                                                                | —             |
| `messageThread.chat`         | `Chat`                                                                 | —             |
| `messageThread.phone`        | `Phone`                                                                | —             |
| `messageThread.web`          | `Web form`                                                             | —             |
| `messageThread.api`          | `API`                                                                  | —             |
| `messageThread.internalNote` | `Internal note`                                                        | —             |
| `messageThread.to`           | `To: {addresses}`                                                      | —             |
| `messageThread.cc`           | `Cc: {addresses}`                                                      | —             |
| `messageThread.showQuoted`   | `Show quoted text`                                                     | —             |
| `messageThread.hideQuoted`   | `Hide quoted text`                                                     | —             |
| `messageThread.showEarlier`  | `{ one: 'Show {count} earlier message', other: 'Show {count} earlier messages' }` (plural forms) | — |
| `messageThread.showEarlierAll` | `Show earlier messages`                                              | —             |
| `messageThread.earlier`      | `Earlier messages`                                                     | —             |

- Formatting: the sent time goes through `Timestamp` (`Intl` in the provider's locale and time zone); `showEarlier` is a plural forms object; `useLocale` picks the form for `count` with `Intl.PluralRules` and formats the count in the provider locale, as `FileTokenGroup`'s `showMore` does. `{addresses}` is the list joined with `Intl.ListFormat` (`useLocale().formatList`, `type: 'unit'`) in the provider locale and wrapped in Unicode isolates (U+2068 … U+2069), the text form of `bdi`, so the addresses keep their order. Addresses and names are not translated.

## Right-to-left

- Layout: logical utilities only (`ms-auto`, `ps-`, `border-s-2`, `text-start`); the avatar sits at the inline start, the time and actions at the inline end, and the quoted rule on the inline-start edge.
- Icons: lock, history, ellipsis and the channel glyphs (mail, comments, phone, globe, code) are not mirrored; the app's `az-reply` glyph mirrors through the stylesheet's directional set (there is no forward-mail glyph; Forward is a text item in the More menu).
- Keyboard: no arrow keys.
- User data: the author name renders in `bdi` and the address list inside Unicode isolates (U+2068 … U+2069); the body is `dir="auto"` so a message written in another script keeps its own direction.

## Responsive

- Container queries: none; the header is a wrapping flex row.
- Narrow: there is no breakpoint; at any width the header wraps through `flex-wrap` — name and role stay on the first line, channel, time and actions move under it with the actions kept at the inline end; recipients wrap address by address; long words and URLs in the body break (`break-words`).
- Touch: every control is a `Button` or `IconButton` with a 44 px hit area on `pointer: coarse`; nothing appears only on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; attachments wrap inside their own group.

## Performance

- Bundle budget: `message-thread-root` 6 KB gzip (list, context, placeholders, announcer, locale); `message-thread-item` 32 KB (it composes `Timestamp`, 20.35 KB alone with its `Popover`, `Avatar`, 12.25 KB, and `IconButton`, 2.7 KB, which share Vue helpers and the locale runtime); `message-thread-group` 6 KB; the compound `message-thread` 36 KB. The `.size-limit.json` entries are the measured gzip plus a small headroom, never above these numbers.
- Runtime budget: a thread of 200 items renders in under 100 ms; each item renders one `Timestamp` and no watchers of its own besides the quoted model.
- Heavy parts: none; long threads collapse their middle with `MessageThread.Group` instead of virtualizing.

## Examples

- Default — the first example, file `default.vue`: a customer email with recipients, an attachment and quoted text, an agent reply with a Reply button and a More menu holding Forward, and a status event line.
- Types — `types.vue`: one item of each `type` (`reply`, `note`, `event`) side by side; the component has a `type` prop.
- Channels — `channels.vue`: one reply per `channel` value (email, chat, phone, web, api), the channel axis of the Item; kept apart from `types.vue` because channel applies to replies only, so crossing it with `type` would show five near-identical cards.
- Earlier messages — `with-earlier-messages.vue`: a ten-message thread whose middle six sit in a closed `MessageThread.Group`; justified because the collapsed middle is the thread's own state and is shown nowhere else.
- Quoted text — `with-quoted-text.vue`: an email reply whose quoted history starts closed; justified because the quoted toggle is the Item's `v-model:quotedOpen` and only shows when the slot is used.
- Loading — `loading.vue`: the root with `loading`.

## Constraints — DO NOT

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/primitives/animations/animate.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Variants + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Variants/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
