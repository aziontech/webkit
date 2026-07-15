---
name: navigation
description: Two navigation shells for UI on @aziontech/webkit — the persistent console shell (AppLayout + AppSidebar: full sidebar + in-content GlobalHeader, always shown) for hub/browse pages, and the focused creation shell (CreationHeader: no sidebar, GlobalHeader with back + brand + breadcrumb) for create/edit/deploy flows. A page picks exactly ONE shell, renders exactly ONE GlobalHeader, and the signed-in user stays visible in both. Built on @aziontech/webkit/global-header, /sidebar, /breadcrumb.
status: active
last_updated: 2026-07-15
---

# Skill: navigation

## Purpose

Every screen in the console lives in one of **two** navigation shells, and picking the wrong one — or
worse, blending them — is where a prototype stops feeling like one product. A browse page with no way
back to the rest of the console strands the user; a focused create flow that keeps the full sidebar
lets the user wander off mid-task and lose their work. This skill fixes which shell a page uses, how
each is composed on `@aziontech/webkit`, and the one invariant they share: **the signed-in user is
always visible.** It is the layout-shell companion to [`/form`](../form/SKILL.md) (what goes *inside* a
focused flow) and [`/ux-heuristics`](../ux-heuristics/SKILL.md) (states + feedback).

## How to use

- `/navigation`
  Apply the shell rules below to any page or flow you build in this conversation.
- `/navigation <file>`
  Review the file against the rules and output, per gap:
  - the exact line / element (quoted),
  - which rule it breaks (1 short sentence),
  - the concrete fix, naming the shell component to use.

## When to invoke

- Starting a new page and deciding how it sits in the app (a hub page vs a create/edit/deploy flow).
- The user asks "which header goes here", "should this have a sidebar", "how do I get back", "the user
  disappeared on the create screen".
- Reviewing a screen for whether it uses the right shell and shows exactly one header.

## The two shells

A page picks **exactly one**. The choice is not stylistic — it follows from what the page is *for*.

| | **Persistent console shell** | **Focused creation shell** |
|---|---|---|
| Component | `AppLayout` (+ `AppSidebar`) | `CreationHeader` |
| Use for | Hubs, lists, dashboards, settings — anywhere the user *browses* and moves laterally | Create / edit / deploy / wizard — a single task with a start and an end |
| Sidebar | **Yes** — full console nav, always present | **No** — removed so the task is the only focus |
| Header | `GlobalHeader` inside the content zone: breadcrumb (2+ levels) + Create/Docs actions + account avatar | `GlobalHeader`: back button + Azion brand + breadcrumb + account avatar |
| Way out | Lateral — pick any other module from the sidebar | Linear — the **back** button (and breadcrumb) returns to where the flow started |
| Signed-in user | Sidebar footer (avatar + account menu) **and** header avatar | Header avatar (right) |
| Examples | `Dashboard`, `Applications`, `Variables`, `AccountSettings` | `CreateApplication`, `CreationCenter`, `DeployTemplate` |

### Shell 1 — persistent console (`AppLayout` + `AppSidebar`)

For pages the user **browses**. A full-height `Sidebar` on the left carries the whole console
navigation (grouped by product area) plus the team switcher and the user footer; the `GlobalHeader`
lives inside the content zone and carries the module breadcrumb and the primary actions. The page
renders only its own content through the default slot.

```vue
<script setup>
import AppLayout from "./ui/AppLayout.vue";
</script>

<template>
  <AppLayout
    active="applications"
    :breadcrumb="[{ label: 'Applications' }]"
  >
    <!-- page content only -->
  </AppLayout>
</template>
```

- The sidebar is the way out — the user moves laterally to any other module. Never remove it on a
  browse page.
- The breadcrumb appears only once the user is **inside** something (a trail of 2+ levels); a
  first-level module shows no crumb.

### Shell 2 — focused creation (`CreationHeader`)

For a **single task** — create, edit, deploy, a wizard step. The sidebar is gone so nothing competes
with the form. The only chrome is one `GlobalHeader`: a **back** button, the Azion brand, the flow
breadcrumb, and the account avatar. The page owns its own full-bleed body below the header.

```vue
<script setup>
import CreationHeader from "./ui/CreationHeader.vue";
</script>

<template>
  <div class="flex h-dvh flex-col bg-[var(--bg-canvas)]">
    <CreationHeader
      :breadcrumb="[
        { label: 'Applications', href: '/applications' },
        { label: 'Create' },
      ]"
      back-label="Back to Applications"
      @back="cancel"
      @navigate="cancel"
    />
    <main class="min-h-0 flex-1 overflow-auto">
      <!-- the focused task -->
    </main>
  </div>
</template>
```

- The **back** button (and the breadcrumb links) are the *only* way out — the exit is linear and
  explicit, so a half-finished task is never abandoned by an accidental sidebar click.
- Hide the back button (`:show-back="false"`) only on a terminal state (a success screen with nowhere
  left to go back to).

## The shared invariant — the user is never signed out

**Both shells keep the signed-in user visible.** A focused flow drops the sidebar, but it does **not**
drop the account avatar — it stays anchored to `GlobalHeader.Right`, mirroring the console header. A
user who is mid-create must still see they're signed in and reach their account; a header with no
identity reads as "logged out" and breaks trust.

- **Persistent shell:** user shows twice — the sidebar footer (avatar + name + account menu with
  theme + logout) and the header avatar.
- **Focused shell:** the header avatar (`GlobalHeader.Right`) is the persistent identity. It routes to
  the same account page as the console header, carrying the `email` query so identity is continuous
  across shells.

`CreationHeader` wires this itself (reads `route.query.email`, renders the avatar in
`GlobalHeader.Right`), so every creation page gets it for free — a page must **not** have to remember
to add it.

## Hard rules

- **One shell per page.** A page is either a persistent-console page or a focused-creation page —
  never both, never neither.
- **Exactly one `GlobalHeader` per page.** `AppLayout` renders it; `CreationHeader` *is* it. Never
  render a second header inside the content.
- **The user is always visible.** Every shell shows the account avatar; a focused flow keeps it in
  `GlobalHeader.Right`. Never ship a screen where the user looks signed out.
- **Focused flows have no sidebar.** If a create/edit/deploy page renders `AppSidebar`, it's the wrong
  shell. Remove the sidebar or switch to a browse page.
- **Focused flows have a back way out.** A `CreationHeader` without a working `@back` (or a terminal
  state that justifies `:show-back="false"`) strands the user.
- **Breadcrumb only when nested.** Show it at 2+ levels; a first-level page shows none. Crumb links
  (`href`) navigate; the last crumb is the current page.
- **Compose the shells, don't hand-roll.** Use `AppLayout` / `CreationHeader`; they wrap
  `@aziontech/webkit/global-header`, `/sidebar`, `/breadcrumb`. Never build a bare `<header>`/`<nav>`
  when a shell exists.

## Review output

For `/navigation <file>`, list gaps. Each:

```
✗ CreateApplication.vue:12  renders AppSidebar inside a create flow
  rule: One shell per page — a create flow is the focused shell, which has no sidebar.
  fix: drop AppSidebar; wrap the page in CreationHeader (back + brand + breadcrumb + avatar).

✗ SomeCreate.vue:40  GlobalHeader.Right is empty on a focused flow
  rule: The user is always visible — a header with no identity reads as signed out.
  fix: use CreationHeader (it anchors the account avatar in GlobalHeader.Right for you).
```

End with: `navigation sound` or `N gaps — fix before polish`.

## References

- Persistent shell: [`AppLayout.vue`](../../../src/components/ui/AppLayout.vue) +
  [`AppSidebar.vue`](../../../src/components/ui/AppSidebar.vue).
- Focused shell: [`CreationHeader.vue`](../../../src/components/ui/CreationHeader.vue).
- Header regions: `@aziontech/webkit/global-header` (`GlobalHeader.Left` / `.Middle` / `.Right` /
  `.Brand`). Sidebar: `@aziontech/webkit/sidebar` (+ `/sidebar-group`). Breadcrumb:
  `@aziontech/webkit/breadcrumb`.
- Exemplars — persistent: `Dashboard.vue`, `Applications.vue`; focused: `CreateApplication.vue`,
  `CreationCenter.vue`, `DeployTemplate.vue`.
- Companion skills: [`/form`](../form/SKILL.md) (what fills a focused flow),
  [`/ux-heuristics`](../ux-heuristics/SKILL.md) (states + feedback),
  [`/baseline-ui`](../baseline-ui/SKILL.md) (components + tokens).

## Definition of Done

- [ ] The page uses exactly one shell (persistent console **or** focused creation), matching its job.
- [ ] Exactly one `GlobalHeader` renders on the page.
- [ ] The signed-in user is visible: sidebar footer + header avatar (persistent), or the
      `GlobalHeader.Right` avatar (focused).
- [ ] Focused flows have no sidebar and a working back way out (`@back` / breadcrumb).
- [ ] The breadcrumb shows only at 2+ levels; crumb links navigate, the last crumb is current.
- [ ] Shells are composed (`AppLayout` / `CreationHeader`), not hand-rolled.
