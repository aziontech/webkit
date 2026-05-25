---
name: bad-checksum
category: actions
structure: monolithic
status: approved
spec_version: 1
checksum: 0000000000000000000000000000000000000000000000000000000000000000
created: 2026-05-22
last_updated: 2026-05-22
---

# Bad Checksum — Component Spec

## Purpose

Fixture: status is `approved` but the checksum does not match sha256(body).
enforce-spec-exists must block.

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

## Constraints — DO NOT

- Do not add props beyond the Props table above.
- Do not add events beyond the Events table above.
- Do not invent imports.
- Do not use HEX/RGB/HSL colors, Tailwind palette names, raw typography classes, `any`, `@ts-ignore`, or `class` in defineProps.
- Do not edit Design.md or COMPONENT_REQUIREMENTS.md.
- Do not change `structure` after `status: approved`.
- Do not create files outside the paths declared by your task.
- If anything is ambiguous, emit `BLOCKED:` and write nothing.
