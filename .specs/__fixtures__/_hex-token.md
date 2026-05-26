---
name: hex-token
category: actions
structure: monolithic
status: draft
spec_version: 1
created: 2026-05-22
last_updated: 2026-05-22
---

# Hex Token — Component Spec

## Purpose

Fixture: the Tokens table references a HEX literal instead of a DESIGN.md token. spec-validator must reject.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `'primary'` | `'primary'` | no | Visual variant. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `click` | `MouseEvent` | Fires on click. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Body. |

## States

- `default`, `hover`

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography | `.text-button-lg` |
| surface | `#0066ff` |

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
- Do not edit DESIGN.md or COMPONENT_REQUIREMENTS.md.
- Do not change `structure` after `status: approved`.
- Do not create files outside the paths declared by your task.
- If anything is ambiguous, emit `BLOCKED:` and write nothing.
