# ChatGPT chat measurement: spec for roadmap 1.10, steps 1 and 2

Written 2026-11-23 for the session that will run it. It follows `ROADMAP.md` row 1.10, "1.10 in
detail", and decision CHAT-1 in `.claude/docs/DECISIONS.md`. Read both first.

## Goal

Measure ChatGPT's chat screen live, in every situation, at phone and desktop widths, in light and
dark. Then build one comparison page that puts ChatGPT and our `ai/ai-chat` block side by side,
lists every difference with its numbers, and marks each one as either a fix for us or a brand
clash the owner settles. That page becomes the work list and the scorecard for steps 3 to 6 of
1.10.

This step measures. It does not change WebKit code.

## Ground rules

1. **Only look and measure.** Take measurements and behaviour: sizes, spacing, timings, what a
   control does. Never copy ChatGPT's code, CSS, SVG icons, fonts, logo, brand colours or copy
   text into the repo or the comparison page. Draw our side with our real components (see
   memory "Mock-ups use real components"). On ChatGPT's side, show screenshots only, kept out of
   git.
2. **The owner's account, read-only.** The owner signs in themselves in the preview browser. The
   T3 `request_secret` refs are not typed by `preview_act` (it types the literal `secret-ref:…`
   string), so never ask for the password. Ask the owner to sign in in the preview tab and wait
   for "logged in".
3. **No personal data and no account changes.** Do not open settings, memory, custom
   instructions, billing or connected apps. Do not rename, delete, share, archive or pin a chat.
   Do not read past conversations: the sidebar may show their titles in screenshots, so crop or
   blur the sidebar list before saving a screenshot.
4. **Test messages are allowed only in one new chat**, named by its first prompt, using the
   neutral prompts below. They contain no personal or company data. At the end, tell the owner
   the chat's title so they can delete it; do not delete it yourself.
5. **Nothing secret in the repo or logs.** No cookies, tokens, account email or chat URLs in
   files, commits or the comparison page.

## Tools

- The T3 preview browser: `preview_open`, `preview_navigate`, `preview_resize`,
  `preview_set_appearance` (light and dark), `preview_snapshot`, `preview_evaluate`,
  `preview_act`, `preview_wait_for`, `preview_recording_start` / `preview_recording_stop` for
  motion. Close every tab you opened before you reply.
- Measure with `preview_evaluate` (`getComputedStyle`, `getBoundingClientRect`), never by eye.
  Record each value with the element it came from, in px, at the width it was taken.
- Motion: sample the property over `requestAnimationFrame` (see `.claude/rules/styling.md`, "Verify
  motion by measuring") or read `transition` / `animation` from the computed style.
- Our side: the hosted docs site, `http://206.223.239.5:4413/blocks/ai/ai-chat` (and
  `/frame/...` for a fullscreen frame), and the demos on `:4433`. Rebuild and re-host first if
  the PR head moved (memory "WebKit hosting").

## Widths and themes

| Name    | Viewport   | Why                                  |
| ------- | ---------- | ------------------------------------ |
| Phone   | 390 × 844  | iPhone 14/15, the owner's screenshot |
| Small   | 360 × 780  | small Android                        |
| Tablet  | 768 × 1024 | the sidebar break                    |
| Desktop | 1280 × 800 | the visual suite's desktop width     |
| Wide    | 1600 × 900 | how the thread column caps its width |

Each width in light and dark. The keyboard-open phone is step 5 of 1.10 (real phones), not this
step; note it as "not measured".

## Prompts (one new chat, in this order)

Each prompt triggers one situation. Send it, wait for the answer to finish, measure, then send
the next.

1. `Give me a three-item list of tips for writing clear commit messages.` (list, short answer)
2. `Write a JavaScript function that debounces another function, with a usage example.` (code
   block, copy button, syntax colours)
3. `Show a table comparing HTTP/1.1, HTTP/2 and HTTP/3 in four rows.` (table)
4. `Explain how TLS 1.3 handshakes work in about 600 words.` (long answer, streaming, scroll)
5. `What is the quadratic formula? Show it as an equation.` (maths)
6. `What are the latest stable versions of Node.js? Cite sources.` (sources, citations,
   favicons; skip if web search is off)
7. Edit prompt 1 to `…five-item list…` (prompt editing, versions `< 1/2 >`)
8. Press "Try again" on answer 2 (regenerate, response versions)
9. Press "Stop" while answer 4 is streaming, in a second run of it (stopped state)
10. Thumbs up and thumbs down menus: open them, do not submit (feedback)
11. Open the "+" (attach) menu and the model/tools menu: open and close only, attach nothing
12. Voice button: hover and focus only, do not start voice

An image answer and an error state cannot be triggered safely: record "not measured" and, for the
error, use any network error banner that appears by itself.

## What to measure

Record every value for phone and desktop, light and dark, unless the row says otherwise.

### Layout

- Thread column: max width, side padding, where it centres, at each width.
- Header: height, background (solid, translucent, blur value), the fade under it, the buttons
  (size, radius, fill, shadow), what scrolls under it.
- Sidebar: width, when it collapses, how it opens on a phone (drawer, overlay, push).
- Composer: min and max height, radius, border, shadow, padding, placeholder, where buttons sit,
  how it grows with lines, the fade above it, the safe-area gap at the bottom.
- Scroll-to-latest button: size, radius, shadow, position, when it appears.
- Empty chat (welcome): heading size, position of the composer, suggestion chips.

### Messages

- User bubble: max width (px and % of the column), radius, fill, padding, alignment, font.
- Assistant answer: no bubble? font size, line height, weight, paragraph spacing, list indent
  and item spacing, heading sizes, link style.
- Space between a prompt and its answer, and between two turns.
- Action rows (copy, edit, thumbs, try again, share, read aloud): icon size, button size, gap,
  when they show (always, on hover, on the last answer only, long press on a phone).
- Code block: header (language, copy), radius, background, font size, line height, padding,
  horizontal scroll, syntax colour roles (record roles like "keyword", "string", not ChatGPT's
  hex values; we map them to our `--code-syntax-*` tokens).
- Table: borders, header style, cell padding, horizontal scroll on a phone.
- Maths: inline and block display, size.
- Sources and citations: chip shape, favicon size, where the source list opens.
- Prompt and response versions: the `< 1/2 >` control, size, position.

### Behaviour and motion

- After sending: does the new prompt move to the top of the view? Scroll distance and timing.
- Streaming: how text appears (by word, fade-in, cursor or dot), frame rate, auto-scroll while
  streaming, what happens when the reader scrolls up mid-stream.
- Thinking state before the first token: what shows and for how long.
- Stop: what the stopped answer looks like.
- Hover, focus and press states of every button; the focus ring.
- Every transition's property, duration and easing (menus, sidebar, scroll button, action rows).
- Keyboard: Enter sends, Shift+Enter new line, Escape, Tab order from the composer, shortcuts
  shown in menus.

## Where our side lives

- Block: `packages/webkit/blocks/ai/ai-chat/` (`ai-chat.vue`, `parts/ai-chat-header.vue`,
  `ai-chat-composer.vue`, `ai-chat-turn.vue`, `ai-chat-start.vue`, `ai-chat-history.vue`) and
  `blocks/ai/ai-chat-drawer/`.
- Components in `src/components/ai/`: `chat-message`, `prompt-input`, `streaming-response`,
  `citation`, `sources`, `conversation`, `conversation-history`, `response-branches`,
  `response-loading`, `reasoning`, `suggestion-group`, `tool-call`, `feedback-reason-dialog`.
- Tokens: `.claude/docs/DESIGN.md`. Brand rules that may clash: corners only `--shape-*` (6 or
  8px, no pills), circles only for avatars and favicons, `--primary` orange fills, no
  translucency rule, BRAND-1 (orange never text).

Find components through the catalog or the MCP when building the page, not by file path.

## Deliverables

1. **Measurement sheet**: `packages/webkit/docs/reviews/chatgpt-chat-measurements.json`, one entry
   per item: `situation`, `element`, `property`, `width`, `theme`, `chatgpt`, `ours`, `unit`,
   `note`. Measure our side with the same script so the two columns compare like for like.
2. **Comparison page**: `packages/webkit/docs/reviews/chatgpt-chat-comparison.html`, copied to
   the hosted docs under `/proposal/chatgpt-chat/` and published as an artifact. One section per
   situation: ChatGPT screenshot (cropped, sidebar list blurred) beside our block at the same
   width and theme, then a table of differences with both numbers. Each difference is tagged:
   - **Fix**: we match it in our components (no brand conflict).
   - **Brand clash**: shown both ways (ChatGPT's value and ours); the owner picks. Expected
     clashes: round composer, round floating buttons, translucent header and buttons, voice
     button fill, bubble radius. One option for each: a chat-only exception with larger radii.
   - **Keep ours**: we are already better or the difference is deliberate; say why.
   - **Not measured**: say why (needs a real phone, cannot be triggered safely).
3. **Scorecard** at the top of the page: count of Fix / Brand clash / Keep ours / Not measured,
   and the seven known gaps from "1.10 in detail" each marked with what the measurement found.
4. **Screenshots** stay outside git (a scratchpad or a temp folder outside the repository) and are
   embedded in the page as files published with the artifact, never committed.
5. **Owner questions**: the brand clashes, gathered in one list at the end, each with the two
   options, ready for the owner to answer in one message. Each answer becomes a `DECISIONS.md`
   row (CHAT-2, CHAT-3, …) in the step-3 session.

## Done when

- Every prompt above is measured at phone and desktop, light and dark (tablet, small and wide
  for layout only), or marked "Not measured" with a reason.
- Every row of the sheet has both columns filled, or a reason.
- The comparison page is hosted and published, and the owner has the link and the list of brand
  questions.
- The test chat's title is given to the owner, nothing in their account changed, and every
  preview tab is closed.
- The sheet and page are committed on their own branch (docs only), and the push waits for the
  owner's yes.

## What comes after (not this session)

Steps 3 to 6 of 1.10: the owner answers the brand questions, one lane polishes the whole screen
against the page (spec first, tests, examples, budgets, baselines), then the real-phone check
with roadmap 1.8.
