---
name: kebab-event
category: actions
structure: monolithic
status: draft
spec_version: 1
created: 2026-05-22
last_updated: 2026-05-22
---

# Kebab Event — Component Spec

## Purpose

Fixture: an event uses camelCase instead of kebab-case — spec-validator must reject.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `'primary'` | `'primary'` | no | Visual variant. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `onClick` | `MouseEvent` | Wrong: should be `click`. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Body. |

## States

- `default`, `hover`

## Tokens

| Region | Token (Design.md) |
|---|---|
| typography | `.text-button-lg` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|

## Accessibility (WCAG 2.1 AA)

- Visible focus ring.

## Stories (Storybook)

- Default
- LightDark
- Playground

## Constraints — DO NOT

- Do not add props beyond the Props table above.
- Do not add events beyond the Events table above.
- Do not invent imports.
- Do not use HEX/RGB/HSL colors, Tailwind palette names, raw typography classes, `any`, `@ts-ignore`, or `class` in defineProps.
- Do not edit Design.md or COMPONENT_REQUIREMENTS.md.
- Do not change `structure` after `status: approved`.
- Do not create files outside the paths declared by your task.
- If anything is ambiguous, emit `BLOCKED:` and write nothing.
