---
name: webkit-product-screens
description: Design, build or review Azion product UI on @aziontech/webkit end to end — console screens and flows, signed-out pages (sign in, sign up, password reset, onboarding), settings, lists, create and edit flows, drawers and dialogs, the Marketplace and internal tools. Holds the routing table that binds each product design problem (component choice, states, forms, create surfaces, errors, tables, lists, navigation, copy, layout, cleanup, style overrides, themes, charts, accessibility, motion, polish, verification, adoption, consumption, a missing component, agents) to the skill or rule that owns it and what enforces it, then runs the stages — check the wiring, classify, start each screen from a block, decide structure from the owning skills, build, copy, polish, verify, report. Use for any product screen task, or when a layout, screenshot or Figma frame of product UI has to be built. Azion web pages use webkit-site-pages.
scope: general
status: active
last_updated: 2026-11-16
enforced_by:
  [webkit-prefer-over-custom, webkit-component-states, webkit-accessibility, ui-verify, review]
---

# Skill: webkit-product-screens

Product UI is what people operate: the console, the Marketplace, partner surfaces and internal
tools. This skill restates no design rule. It routes each design problem to the skill or rule
that owns it, and runs the order they apply in. Azion web pages (the site, landing pages) follow
`/webkit-site-pages` instead: never compose product UI from page sections, and never apply an SD
rule to product UI.

Read every file from the installed package (`node_modules/@aziontech/webkit/`, or `.claude/` once
`webkit sync` has copied the bundle), never from memory or an older copy. When a `.claude/` copy
and the package disagree, the package wins and `npx @aziontech/webkit sync --check` reports the
drift.

## Routing table

Read the whole owning file before deciding. **Enforced by** is the owning skill's own
`enforced_by`; the skill's file wins over this table. A `webkit-<name>` value is rule
`rules/webkit-<name>.md` (lint carries part of it), `ui-verify` is the runtime check of
`/webkit-ui-verify`, and `review` is held by a person or a reviewing agent.

| Design problem                                                                  | Owner                                                                        | Enforced by                                                                   |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| The right component for a UX moment; usability rules every surface follows      | `/webkit-ux-heuristics`, rule `webkit-prefer-over-custom`                    | prefer-over-custom, component-states, accessibility, ui-verify, review        |
| Loading, empty, partial, error and success states; async behaviour              | `/webkit-ui-states`, rule `webkit-component-states`                          | component-states, prefer-over-custom, ui-verify                               |
| Form layout, grouping, labels, required and invalid fields, when to validate    | `/webkit-form`                                                               | accessibility, component-states, ui-verify                                    |
| Where a create, edit or settings flow lives (page or drawer), the commit bar    | `/webkit-create-surface`                                                     | ui-verify, component-states, accessibility, prefer-over-custom                |
| Where an error goes (field, section, toast, signed-out screen) and what it says | `/webkit-errors`                                                             | component-states, accessibility, ui-verify                                    |
| Data tables: column model, toolbar, internal scroll, cell recipes               | `/webkit-tables`                                                             | prefer-over-custom, component-states, tokens, ui-verify                       |
| The list page around a table: skeleton, search versus filters, filter bar       | `/webkit-lists`                                                              | prefer-over-custom, component-states, styling, ui-verify, review              |
| Shells, navigation levels, breadcrumb, when a drawer may open                   | `/webkit-navigation`, rule `webkit-navigation-levels`                        | navigation-levels, accessibility, prefer-over-custom, ui-verify               |
| Explaining a field, section, metric or page in place (info icon, help panel)    | `/webkit-in-product-help`                                                    | prefer-over-custom, accessibility, strings, ui-verify                         |
| Every interface string                                                          | `/webkit-microcopy`, rule `webkit-strings`                                   | ui-verify, component-states, prefer-over-custom, review                       |
| Page width, inset from the chrome, vertical rhythm                              | `/webkit-layout`, rule `webkit-page-layout`                                  | styling, tokens, direction, ui-verify, review                                 |
| Components only, tokens only, type hierarchy, spacing: the cleanup pass         | `/webkit-quick-cleanup`, rules `webkit-tokens`, `webkit-styling`             | tokens, prefer-over-custom, styling                                           |
| Changing how a shipped component looks                                          | rule `webkit-style-override`                                                 | style-override                                                                |
| Light and dark with no per-theme edits                                          | `/webkit-theming-dark-mode`                                                  | tokens, ui-verify                                                             |
| Charts: series colours, re-theming, the chart's own states                      | `/webkit-data-viz`                                                           | tokens, component-states, ui-verify                                           |
| AI chat, streamed answers, citations, approved actions                          | `/webkit-ai-surfaces`                                                        | accessibility, component-states, ui-verify                                    |
| Accessibility: roles, keyboard, focus, reduced motion                           | rule `webkit-accessibility`                                                  | accessibility, ui-verify                                                      |
| Motion: timing, easing, what may animate                                        | `/webkit-motion-polish`, rule `webkit-motion`                                | motion, accessibility, ui-verify                                              |
| The "feels finished" pass across a screen                                       | `/webkit-final-polish`                                                       | ui-verify, component-states, motion, review                                   |
| Proving a screen works: both themes, widths, console errors, axe, states        | `/webkit-ui-verify`                                                          | ui-verify, accessibility, component-states, navigation-levels                 |
| Moving an existing app onto WebKit, with a coverage scorecard                   | `/webkit-adoption`                                                           | prefer-over-custom, prop-vocabulary, style-override, review                   |
| Consuming the package: find, import, keep bundles small                         | `/webkit-usage`, rules `webkit-imports`, `webkit-performance`                | imports, tokens, style-override, prefer-over-custom, performance, page-layout |
| A component the system does not ship                                            | rule `webkit-construction-standards`, after `/webkit-adoption` files the gap | the construction rules it lists                                               |
| The Azion API from the browser; a Metrics or Events explorer                    | `/webkit-azion-api`, `/webkit-query-explorer`                                | example-data, component-states, prefer-over-custom, review                    |

Which component exists, its API and import: the MCP (`suggest_component`, `get_component`) or
`catalog.json`. A component that is not there does not exist.

Agents to delegate to: `webkit-advisor` (which component and how), `webkit-reviewer` (review a
diff), `webkit-ui-verifier` (drive the finished screen), `webkit-adopter` (set up the package),
`webkit-adoption-auditor` (how much of an app renders through WebKit).

## Workflow

Run the stages in order; ask the person at every fork the owning files leave open.

0. **Set up the project.** `@aziontech/webkit` and `@aziontech/theme` are installed at a pinned
   version, `init` has wired lint, styles, the MCP and the `.claude/` bundle, the bundle is
   committed, `npx @aziontech/webkit sync --check` reports no drift and `doctor` is clean (project
   contract: `docs/toolkit/CLI.md`). Show the `init --dry-run` plan and get the person's yes before
   any setup, bundle update or CI change.
1. **Classify** the request: new screen, a block inside a screen, a multi-screen flow, a state or
   error fix, a copy change, a layout someone sent, or a review. Name the shell: signed in,
   focused creation, or signed out (`/webkit-navigation` confirms it).
2. **Start from a block.** For each screen, `npx @aziontech/webkit search` (or MCP `search_blocks`),
   read the best with `view` (`get_block`), and copy it with `add`. Map a sent layout region by
   region onto blocks; where it differs from the block, follow the block and list each difference
   for the person. A region no block draws is reported as a block for WebKit to add.
3. **Decide the structure** from the routing table: states, forms, the create surface, errors,
   tables and lists, navigation, layout. Each decision cites the file it rests on. Structure comes
   before any polish.
4. **Build** with components the installed catalog has, tokens only, no restyling of a shipped
   component.
5. **Copy** every string under `/webkit-microcopy`. Product names and terms come from the
   `azion-kb` knowledge base; limits, plans and prices come from the knowledge base or the person,
   never from invention.
6. **Foundation and polish:** `/webkit-quick-cleanup`, `/webkit-theming-dark-mode`,
   `/webkit-motion-polish`, then `/webkit-final-polish`.
7. **Verify:** lint and `webkit check`, then `/webkit-ui-verify` (or the `webkit-ui-verifier`
   agent): both themes, several widths, console errors, axe, every state, the primary interaction.
8. **Report:** what changed and the files touched; per region, the block it starts from; the
   package files read, with the version; findings by the file that owns them; missing blocks and
   components; differences from a sent layout; decisions left to the person.

## Guardrails

- Never write a WebKit name from memory, and never restate a package rule as this skill's: cite
  its file.
- Never raise a lint baseline or disable a WebKit rule to make a gate pass.
- Never compose a screen from primitives when a block draws it.
- Do not commit or push unless the person asks.
