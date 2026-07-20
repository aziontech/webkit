---
name: webkit-content-microcopy
description: The words in a @aziontech/webkit app are UI — errors, buttons, empty states, and toasts follow one calm, literal, technical register, not marketing copy. Use when writing or reviewing any user-facing string in a console screen. Fixes error phrasing, CTA verbs, sentence case, one-term-per-concept vocabulary, and toast-vs-inline placement.
status: active
last_updated: 2026-07-20
---

# Skill: webkit-content-microcopy

## Purpose

A console is read under pressure — a deploy is failing, a workload is down, a quota is close. The words
have to carry information, not personality. This skill fixes the **register** every user-facing string in
a `@aziontech/webkit` app is written in: calm, literal, technical, product-specific. An error says what
broke and how to fix it; a button names the action it performs; an empty state explains itself with real
product nouns. The goal is that the copy across every screen reads like one person wrote it — a person who
respects the reader's time and never says "Oops!".

## How to use

- `/webkit-content-microcopy` — apply this register to any string you write in this conversation.
- `/webkit-content-microcopy <file>` — review the file's strings and report, per issue: the quoted line,
  the register violation, and the concrete rewrite.

## How to find the copy-bearing components

Copy lives inside components — a `Button` label, a `Message`/toast body, an `EmptyState` title, a
`HelperText` under a field. Never guess a component or import path; resolve it the same way every time:

- Ask the **webkit MCP** — `suggest_component` in plain words ("toast", "empty state", "field error").
- Or read **`node_modules/@aziontech/webkit/catalog.json`** — every key under `imports` is a real
  published subpath. If a subpath is not a key there, it does not exist.

## Error messages — what happened, then how to fix it

An error names the failure and the recovery in **≤2 sentences**. No raw error codes, no stack fragments,
never a bare "Error" or "Something went wrong" — those tell the reader nothing they can act on.

| ✗ Before                         | ✓ After                                                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| `Error 500`                      | `Couldn't reach Azion to deploy. Try again in a moment.`                                |
| `Something went wrong`           | `Deploy failed: the build exceeded the 10-minute limit. Reduce the bundle, then retry.` |
| `Request failed with status 403` | `You don't have permission to delete this workload. Ask an account owner.`              |
| `Invalid input`                  | `Enter a domain like app.example.com — no https:// prefix.`                             |
| `Timeout`                        | `The edge function didn't respond in time. Check its logs and redeploy.`                |

The failure clause is literal (what the system did); the fix clause is a next action the reader controls.
If there is no recovery, say what to do instead ("Contact support with request ID …") — never leave a
dead end.

## CTAs and buttons — the verb is the action

A button label is the specific verb for what will happen when it's clicked. Generic labels
("Submit", "OK", "Click here", "Continue" where the next step is unnamed) make the reader guess.

- ✗ `Submit` → ✓ `Deploy`
- ✗ `OK` → ✓ `Delete workload`
- ✗ `Click here` → ✓ `View deployment`
- ✗ `Confirm` (on a destructive dialog) → ✓ `Delete 3 workloads`

The button states the action in **present-tense imperative**; the resulting **toast confirms it in past
tense** — `Deploy` → "Deployed", `Delete workload` → "Workload deleted". Don't duplicate the verb into a
"Success!" banner; the past-tense confirmation is the success signal.

## Sentence case everywhere

Labels, buttons, headings, menu items, and toasts use **sentence case** — capitalize the first word and
proper nouns only. Not Title Case, not ALL CAPS. The single exception is an overline/eyebrow token, whose
uppercase is a typographic style applied by the theme, not typed into the string.

- ✗ `Create New Workload` → ✓ `Create workload`
- ✗ `DELETE` → ✓ `Delete`
- ✗ `Deploy Your Edge Function` → ✓ `Deploy your edge function`

## One term per concept

Pick one name for each concept and use it across the entire flow — nav, page title, button, toast, empty
state, docs. Drifting between synonyms ("workloads" here, "apps" there) makes the reader wonder if they're
two different things. And name things by what the **user** recognizes, not by the system's internals.

- ✗ mixing `workload` / `app` / `application` → ✓ pick `workload`, use it everywhere
- ✗ `Webhook config` (system term) → ✓ `Notifications` (what the user is managing)
- ✗ `Origin` in one screen, `Backend` in the next → ✓ one term, chosen once

## Empty states and success — concrete and product-specific

Empty and success copy earns its space by being specific. A number, a place, a real noun beats a cheer.

- ✗ `All done!` → ✓ `Deployed to 24 edge locations.`
- ✗ `No items` → ✓ `No workloads yet. Create one to route traffic to the edge.`
- ✗ `Success 🎉` → ✓ `Cache purged. Changes are live across all edge locations.`

No emoji as decoration, no marketing fluff ("blazing-fast", "effortless") inside the product. The reader
is working, not being sold to.

## Numbers, dates, and alignment

Use **one** format per kind and keep it consistent (e.g. `2026-07-20 14:32 UTC`, `1,204 requests`,
`4.2 GB`). Columns of figures — metrics, quotas, request counts — use the **tabular-nums** token so digits
align vertically and are scannable; don't left-shift a table of numbers with proportional figures.

## Toast vs inline — placement is part of the message

Where the copy appears is a decision, not an afterthought:

- **Request / system failures → a toast** (transient action) **or a `Message` in the view** (persistent
  state). A deploy that failed, a save that couldn't reach the server, a purge that errored.
- **Field validation → inline `HelperText` next to the field.** A malformed domain, a required value, a
  name that's already taken. Never fire a toast for a single bad field — the reader needs it anchored to
  the input they're fixing.

## Hard rules

- Every error names what happened **and** a next action, in ≤2 sentences; no raw codes, never bare "Error".
- Every button/CTA label is the specific verb for its action; no "Submit" / "OK" / "Click here".
- Sentence case for all labels, buttons, headings; ALL CAPS only via the overline token.
- One term per concept across the whole flow; name by what the user recognizes, not the system internal.
- Empty/success copy is concrete and product-specific; no emoji decoration, no marketing language.
- System/request failures go to a toast or view `Message`; field validation stays inline in `HelperText`.

## Review output

For `/webkit-content-microcopy <file>`, list issues in file order. Each:

```
✗ DeployButton.vue:18  label="Submit"
  register: generic CTA — doesn't say what happens.
  fix: label="Deploy"; confirm with a "Deployed" toast, not a "Success!" banner.

✗ WorkloadsEmpty.vue:9  title="No items"
  register: not product-specific.
  fix: "No workloads yet. Create one to route traffic to the edge."
```

End with: `copy consistent` or `N issues — rewrite before ship`.

Enforcement note: this is **largely review-enforced**. A lint can catch the mechanical cases — a label of
`Submit`/`OK`/`Click here`, an emoji inside a button/heading string, ALL CAPS outside an overline — and
should. But register, specificity, and one-term-per-concept consistency are judgment calls a human reviewer
confirms; treat the lint as the floor, not the ceiling.

## Definition of Done

- [ ] Every error states the failure and a recovery action, ≤2 sentences, no raw codes.
- [ ] Every button label is a specific action verb; toasts confirm in past tense.
- [ ] Sentence case throughout; one term per concept across the flow.
- [ ] Empty/success copy is concrete and product-specific — no emoji, no marketing fluff.
- [ ] System failures → toast/`Message`; field errors → inline `HelperText`; numbers use one format.
