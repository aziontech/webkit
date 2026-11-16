---
name: webkit-site-pages
description: Design, compose or audit an Azion web page (the marketing site, a product or Solution page, a campaign landing page) with @aziontech/webkit page sections and SitePage, under the Web Design Guide (rule webkit-site-pages, SD-01 to SD-25). Runs the page task end to end — check the project is wired, classify the request, write a sourced brief, compose the page JSON from the sections' own site JSON, set the hero, pick bank assets by render, touch copy only when asked, verify the rendered page at four widths in both themes, and report findings by rule ID. Use when asked to create, lay out, rework or review a page, hero or band of an Azion web page. Product UI (console screens, sign-in, settings, create flows) uses webkit-product-screens instead.
scope: general
status: active
last_updated: 2026-11-16
enforced_by:
  [webkit-site-pages, webkit-sections, webkit-page-layout, webkit-tokens, ui-verify, review]
---

# Skill: webkit-site-pages

The rules live in rule `webkit-site-pages` (the Web Design Guide). Read it at the start of every
run; every decision and report line cites the SD rule it rests on. This skill owns layout: which
sections a page uses, in which order, with which hero and which assets. It never invents a fact,
and it changes copy only when the person asks (SD-03).

Product UI is out of scope: console screens and flows, sign-in and sign-up, settings and create
flows use `/webkit-product-screens`. A page is never composed from product blocks, and the SD rules
never apply to product UI.

## Content lives with marketing

WebKit owns the design; marketing owns the content and keeps it in its own toolkit. Read it there,
never copy it into the page's repo or into WebKit:

| Need                                              | Where                                                                                                                      |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Positioning, claims, proof for one product        | `azion-kb` `product-marketing/products/<group>/<product>/messaging-positioning.md`                                         |
| Portfolio context, Solutions, Use Cases, personas | `azion-kb` `product-marketing/product-marketing-context.md`, `gtm-definitions/solutions.md`, `use-cases.md`, `personas.md` |
| Voice, headline patterns, labels outside SD-04    | the `azion-brand-voice` skill                                                                                              |
| Product names, terms, editorial style             | `azion-kb` `company-definitions/product-naming.md`, `brand-guidelines/terminology.md`, `editorial-style.md`                |
| The copy of a product or Solution page            | the content parts of the `product-page-builder` and `solution-page-builder` skills                                         |
| Translation into pt-BR and es                     | the `translate-content` skill                                                                                              |

The action labels of a page are WebKit's (SD-04), not the toolkit's.

## Workflow

Run the stages in order; ask the person at every fork the rule does not decide.

0. **Set up the project.** The repo has `@aziontech/webkit` installed and wired, and
   `npx @aziontech/webkit doctor` is clean (project contract: `docs/toolkit/CLI.md`). Setup and CI
   changes touch the repo for everyone: show the `init --dry-run` plan and the workflow diff first,
   and run them only after the person agrees. Never raise a lint baseline, disable a rule or move
   to a looser preset to make a gate pass.
1. **Classify** the request: new page, new band, hero change, copy change, asset change, or audit.
   Note the page type (Home, product, Solution, pricing, trust page, Blog, campaign, other), the
   route, the languages, and what must not change. Ask when the page type is unclear or the
   request mixes copy with layout.
2. **Load the rule.** Read rule `webkit-sections` and rule `webkit-site-pages`; for the hero, the
   `hero-section` component page (its When to use holds the page-type matrix).
3. **Brief.** Read the content sources above for the subject. Every claim carries its source path;
   a slot with no source stays out and goes into the report (SD-16). Write nothing to the page yet.
4. **Compose.** For each band of the page type's pattern (SD-22, SD-23, or the hero matrix for
   other pages), find the section with the MCP (`suggest_component`, `list_components` category
   `sections`) and seed its entry verbatim from its site JSON example (SD-01, SD-02). Write the page
   as `SitePage` JSON, `{ hero, sections }`. A band no section covers stops the run: list it as a
   section for WebKit to add (SD-11).
5. **Hero.** Pick the variant from the matrix, set `titleLength` from the headline (SD-07), keep
   the eyebrow (SD-09), give the first column section `gap: 'none'` after a band hero (SD-05;
   `small` on the Blog), keep the marquee off band heroes (SD-06), and set one primary and one
   outlined action from the SD-04 list.
6. **Assets.** Resolve every image slot to a bank asset (`list_assets`, `@aziontech/webkit/assets/<file>`),
   colour marks first (SD-13, SD-14). Render each candidate illustration before assigning it and
   compare the drawn weight of neighbours (SD-18, SD-20). When nothing fits, stop and report the
   closest candidates; place a stand-in only when the person picks it (SD-19). Never draw,
   download or generate art.
7. **Copy, only when unlocked.** Copy stays as the example seeded it until the person asks for a
   change to a named band (SD-03). Then draft with `azion-brand-voice`, check names and terms
   (SD-17), keep plain text (SD-25) and the line budgets (SD-24), show the diff before writing, and
   translate with `translate-content`.
8. **Verify.** Run the repo's gates (lint, `webkit check`), then `/webkit-ui-verify` at 390, 768,
   1280 and 1440 px in both themes, checking the hero, frame, pattern, copy and asset rules by DOM
   (rule `webkit-site-pages`, Verify). Line counts fail at desktop widths only.
9. **Report:** what changed and the files touched; each section, variant and asset used, with
   where it was read; findings by SD ID with width and theme; slots left out for lack of a source;
   missing sections and missing assets; copy and label findings for the person to decide.

## Guardrails

- Never write a WebKit name from memory: read components, variants, props, assets and commands
  from the installed package (MCP, `catalog.json`, `llms/`), and cite where each was read.
- Never edit copy the person did not ask to change; never invent a claim, a metric or a customer.
- Never place a band that is not a WebKit section, and never fix a bank defect with a local copy:
  report it to WebKit.
- Do not commit or push unless the person asks.
