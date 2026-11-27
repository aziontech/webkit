---
name: azion-ui-product-screens
description: Design, build or review Azion product UI on @aziontech/ui end to end — console screens and flows, signed-out pages (sign in, sign up, password reset, onboarding), settings, lists, create and edit flows, drawers and dialogs, the Marketplace and internal tools. Holds the routing table that binds each product design problem (component choice, states, forms, create surfaces, errors, tables, lists, navigation, copy, layout, cleanup, style overrides, themes, charts, accessibility, motion, polish, verification, adoption, consumption, a missing component, agents) to the skill or rule that owns it and what enforces it, then runs the stages — check the wiring, classify, start each screen from a block, decide structure from the owning skills, build, copy, polish, verify, report. Use for any product screen task, or when a layout, screenshot or Figma frame of product UI has to be built. Azion web pages use azion-ui-site-pages.
scope: general
status: active
last_updated: 2026-11-25
enforced_by:
  [azion-ui-prefer-over-custom, azion-ui-component-states, azion-ui-accessibility, ui-verify, review]
---

# Skill: azion-ui-product-screens

Product UI is what people operate: the console, the Marketplace, partner surfaces and internal
tools. This pattern restates no design rule. It routes each design problem to the skill or rule
that owns it, and runs the order they apply in. Azion web pages (the site, landing pages) follow
[Building a site page](../azion-ui-site-pages/SKILL.md) instead: never compose product UI from page sections, and never apply an SD
rule to product UI.

Read every file from the installed package (`node_modules/@aziontech/ui/`, or `.agents/` once
`azion-ui sync` has copied the agent files), never from memory or an older copy. When an `.agents/`
copy and the package disagree, the package wins and `npx @aziontech/ui sync --check` reports the
drift.

## Routing table

Read the whole owning file before deciding. **Enforced by** is the owning skill's own
`enforced_by`; the skill's file wins over this table. An `azion-ui-<name>` value is rule
`rules/azion-ui-<name>.md` (lint carries part of it), `ui-verify` is the runtime check of
`/azion-ui-verify`, and `review` is held by a person or a reviewing agent.

| Design problem                                                                  | Owner                                                                                                          | Enforced by                                                                   |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| The right component for a UX moment; usability rules every surface follows      | `/azion-ui-ux-heuristics`, rule `azion-ui-prefer-over-custom`                                                  | prefer-over-custom, component-states, accessibility, ui-verify, review        |
| Loading, empty, partial, error and success states; async behaviour              | [Loading, empty and error states](../azion-ui-states/SKILL.md), rule `azion-ui-component-states`               | component-states, prefer-over-custom, ui-verify                               |
| Form layout, grouping, labels, required and invalid fields, when to validate    | [Forms](../azion-ui-form/SKILL.md)                                                                             | accessibility, component-states, ui-verify                                    |
| Where a create, edit or settings flow lives (page or drawer), the commit bar    | [Create flows](../azion-ui-create-surface/SKILL.md)                                                            | ui-verify, component-states, accessibility, prefer-over-custom                |
| Where an error goes (field, section, toast, signed-out screen) and what it says | [Errors](../azion-ui-errors/SKILL.md)                                                                          | component-states, accessibility, ui-verify                                    |
| Data tables: column model, toolbar, internal scroll, cell recipes               | [Tables](../azion-ui-tables/SKILL.md)                                                                          | prefer-over-custom, component-states, tokens, ui-verify                       |
| The list page around a table: skeleton, search versus filters, filter bar       | [List pages](../azion-ui-lists/SKILL.md)                                                                       | prefer-over-custom, component-states, styling, ui-verify, review              |
| Shells, navigation levels, breadcrumb, when a drawer may open                   | [Navigation](../azion-ui-navigation/SKILL.md), rule `azion-ui-navigation-levels`                               | navigation-levels, accessibility, prefer-over-custom, ui-verify               |
| Explaining a field, section, metric or page in place (info icon, help panel)    | [In-product help](../azion-ui-in-product-help/SKILL.md)                                                        | prefer-over-custom, accessibility, strings, ui-verify                         |
| Every interface string                                                          | [Interface text](../azion-ui-microcopy/SKILL.md), rule `azion-ui-strings`                                      | ui-verify, component-states, prefer-over-custom, review                       |
| Page width, inset from the chrome, vertical rhythm                              | [Page layout](../azion-ui-layout/SKILL.md), rule `azion-ui-page-layout`                                        | styling, tokens, direction, ui-verify, review                                 |
| Components only, tokens only, type hierarchy, spacing: the cleanup pass         | `/azion-ui-quick-cleanup`, rules `azion-ui-tokens`, `azion-ui-styling`                                         | tokens, prefer-over-custom, styling                                           |
| Changing how a shipped component looks                                          | rule `azion-ui-style-override`                                                                                 | style-override                                                                |
| Light and dark with no per-theme edits                                          | `/azion-ui-theming-dark-mode`                                                                                  | tokens, ui-verify                                                             |
| Charts: series colours, re-theming, the chart's own states                      | [Charts and figures](../azion-ui-data-viz/SKILL.md)                                                            | tokens, component-states, ui-verify                                           |
| AI chat, streamed answers, citations, approved actions                          | [AI chat and actions](../azion-ui-ai-surfaces/SKILL.md)                                                        | accessibility, component-states, ui-verify                                    |
| Accessibility: roles, keyboard, focus, reduced motion                           | rule `azion-ui-accessibility`                                                                                  | accessibility, ui-verify                                                      |
| Motion: timing, easing, what may animate                                        | `/azion-ui-motion-polish`, rule `azion-ui-motion`                                                              | motion, accessibility, ui-verify                                              |
| The "feels finished" pass across a screen                                       | `/azion-ui-final-polish`                                                                                       | ui-verify, component-states, motion, review                                   |
| Proving a screen works: both themes, widths, console errors, axe, states        | `/azion-ui-verify`                                                                                             | ui-verify, accessibility, component-states, navigation-levels                 |
| Moving an existing app onto Azion UI, with a coverage scorecard                 | `/azion-ui-adoption`                                                                                           | prefer-over-custom, prop-vocabulary, style-override, review                   |
| Consuming the package: find, import, keep bundles small                         | `/azion-ui-usage`, rules `azion-ui-imports`, `azion-ui-performance`                                            | imports, tokens, style-override, prefer-over-custom, performance, page-layout |
| A component the system does not ship                                            | rule `azion-ui-construction-standards`, after `/azion-ui-adoption` files the gap                               | the construction rules it lists                                               |
| The Azion API from the browser; a Metrics or Events explorer                    | [Calling the Azion API](../azion-ui-azion-api/SKILL.md), [Query explorer](../azion-ui-query-explorer/SKILL.md) | example-data, component-states, prefer-over-custom, review                    |
| API data: references by name, remote pickers, fresh lookups, typed records      | [Showing API data](../azion-ui-api-data/SKILL.md), rule [Showing API data](../azion-ui-api-data/SKILL.md)      | api-data, component-states, ui-verify, review                                 |

Which component exists, its API and import: the MCP (`suggest_component`, `get_component`) or
`catalog.json`. A component that is not there does not exist.

Agents to delegate to: `azion-ui-advisor` (which component and how), `azion-ui-reviewer` (review a
diff), `azion-ui-verifier` (drive the finished screen), `azion-ui-adopter` (set up the package),
`azion-ui-adoption-auditor` (how much of an app renders through Azion UI).

## Workflow

Run the stages in order; ask the person at every fork the owning files leave open.

0. **Set up the project.** `@aziontech/ui` and `@aziontech/theme` are installed at a pinned
   version, `init` has wired lint, styles, the MCP and the `.agents/` files, the files are
   committed, `npx @aziontech/ui sync --check` reports no drift and `doctor` is clean (project
   contract: `docs/toolkit/CLI.md`). Show the `init --dry-run` plan and get the person's yes before
   any setup, bundle update or CI change.
1. **Classify** the request: new screen, a block inside a screen, a multi-screen flow, a state or
   error fix, a copy change, a layout someone sent, or a review. Name the shell: signed in,
   focused creation, or signed out ([Navigation](../azion-ui-navigation/SKILL.md) confirms it).
2. **Start from a block.** For each screen, `npx @aziontech/ui search` (or MCP `search_blocks`),
   read the best with `view` (`get_block`), and copy it with `add`. Map a sent layout region by
   region onto blocks; where it differs from the block, follow the block and list each difference
   for the person. A region no block draws is reported as a block for Azion UI to add.
3. **Decide the structure** from the routing table: states, forms, the create surface, errors,
   tables and lists, navigation, layout. Each decision cites the file it rests on. Structure comes
   before any polish.
4. **Build** with components the installed catalog has, tokens only, no restyling of a shipped
   component.
5. **Copy** every string under [Interface text](../azion-ui-microcopy/SKILL.md). Product names and terms come from the
   `azion-kb` knowledge base; limits, plans and prices come from the knowledge base or the person,
   never from invention.
6. **Foundation and polish:** `/azion-ui-quick-cleanup`, `/azion-ui-theming-dark-mode`,
   `/azion-ui-motion-polish`, then `/azion-ui-final-polish`.
7. **Verify:** lint and `azion-ui check`, then `/azion-ui-verify` (or the `azion-ui-verifier`
   agent): both themes, several widths, console errors, axe, every state, the primary interaction.
8. **Report:** what changed and the files touched; per region, the block it starts from; the
   package files read, with the version; findings by the file that owns them; missing blocks and
   components; differences from a sent layout; decisions left to the person.

## Guardrails

- Never write an Azion UI name from memory, and never restate a package rule as this pattern's: cite
  its file.
- Never raise a lint baseline or disable an Azion UI rule to make a gate pass.
- Never compose a screen from primitives when a block draws it.
- Do not commit or push unless the person asks.
