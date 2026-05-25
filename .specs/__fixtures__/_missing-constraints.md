---
name: missing-constraints
category: actions
structure: monolithic
status: draft
spec_version: 1
created: 2026-05-22
last_updated: 2026-05-22
---

# Missing Constraints — Component Spec

## Purpose

Fixture: the "Constraints — DO NOT" block is absent. spec-validator must reject.

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
