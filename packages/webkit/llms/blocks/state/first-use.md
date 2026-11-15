# FirstUse (`state/first-use`)

> The block a first-level list renders before the account owns any resource of that kind: a flush Card holding an EmptyState (the resource glyph, headline, lead and a Documentation link) over an Item.List of the ways to create the first one, each led by `Item.Media kind="icon"` (the CLI method copies `azion deploy`), with the promo cards below it, each a link covering its card: Catalog templates (only for resource kinds that have a template catalog) and agent onboarding, whose frames carry the Claude, Codex, Gemini and Cursor marks from the webkit assets. The EmptyState’s icon slot shows the resource glyph; an app may draw a richer figure there. Every list that is still empty renders it with its own nouns, methods and promos. Built from Card, EmptyState, Item, Button, InputGroup, Input, CopyButton and Link. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: app
- Source: `blocks/state/first-use/first-use.vue` in `@aziontech/webkit`
- MCP: `get_block("state/first-use")`
- Components: `claudeMark`, `codexMark`, `cursorMark`, `geminiMark`, [Button](../../components/button.md), [Card](../../components/card.md), [CopyButton](../../components/copy-button.md), [EmptyState](../../components/empty-state.md), [Input](../../components/input.md), `InputGroupRoot`, [Item](../../components/item.md), [Link](../../components/link.md), [Logo](../../components/logo.md), [Skeleton](../../components/skeleton.md)
- Skills: `webkit-ui-states`, `webkit-microcopy`

## Asked as

empty state; empty list; first use; no resources yet; create first resource; product empty state; zero state; estado vazio; lista vazia; primeiro uso; first resource empty state

What a first-level list shows before the account owns any resource of that kind. The user's job is to create the first one, so the block replaces the empty table with a short explanation and every way to get started on the same screen: the methods to create one (import, CLI, from scratch), then the promotions that shortcut it (a Catalog template, a coding agent). Every list that is still empty renders this block with its own nouns, methods and promos.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/console`), which owns the rail, the header and the `main`.

## When to use

- Use first-use on a list page before the account owns any resource of that kind.
- The first visit to a list page (Resources, Services, Domains…) when the account has none of that resource.
- When there is more than one way to create the first item and each deserves its own action.

## When not to use

- A list that has items but a filter or search matched none: use the no-match state of `view/table-view`.
- An empty panel inside a dashboard or detail page: use `EmptyState` alone, without the method list.
- Choosing what to create across every resource kind: use `create/create-hub`.
- The Home page before the first project: use `dashboard/home-dashboard` (its Empty state).
- A list that failed to load: that is an error, not first use; see `skills/webkit-ui-states`.

## Building blocks

### A. Frame — `Card` (required)

A flush `Card` (`:padded="false"`) holds the explanation and the method list as one object. Each promo below sits in its own flush `Card`, two columns from `md`.

### B. Agent marks — `Logo` (optional)

The coding-agent promo stacks the agent marks, each a decorative `Logo` at `size="small"` in a bordered tile. A mono mark takes `kind="current"` and the tile's text colour, a coloured one `kind="color"`.

### C. Explanation — `EmptyState` (required)

The resource glyph, a headline that names the first action, and one sentence on the ways to do it. Its `#actions` slot holds only the documentation link; the create actions live in the method list. The icon slot shows the resource glyph; an app may draw a richer figure there.

### D. Documentation — `Link` (required)

`Documentation`, opening the docs for this resource in a new tab. One link, no button.

### E. Methods — `Item` (required)

An `Item.List` under the `EmptyState`, one `Item` per way to create the first resource: the method glyph in `Item.Media kind="icon"` (the component draws the frame), `Item.Title` and `Item.Description`, and one action in `Item.Actions`. List the methods in order of how most users start (repository import, CLI, from scratch).

### F. Method action — `Button` (required)

One per method. The recommended method takes `kind="primary"` (`Import`); the others take `kind="outlined"` (`Create`). Only one primary on the block.

### G. Command row — `InputGroupRoot` (CLI method)

Joins the read-only command and its copy button into one control, full width.

### H. Command — `Input` (CLI method)

`readonly`, `monospace`, `:spellcheck="false"` and `size="large"`, holding the command to run in the
code face, with an `aria-label` that names it.

### I. Copy — `CopyButton` (CLI method)

Copies the command, with an `aria-label` (`Copy the Via CLI command`) and a `copied-label` (`Command copied`) that confirms it.

## Do

- Rewrite the headline, lead, methods and promos for each resource kind; the structure stays, the nouns change.
- Show the Catalog template promo only for resource kinds that have a template catalog.
- Keep one primary action across the whole block, on the method most users take.
- Keep the documentation link as the only action in the `EmptyState`.
- Hold the block's own footprint while the account reloads (the empty-state band, one row per method and the promo cards, in `Skeleton`s), so it does not jump in.

## Don't

- Don't draw an agent mark by hand (an `img` or a CSS mask): `Logo` already inks it for the theme.
- Don't show list controls (search, filters, pagination, column settings) over a list that has never had an item.
- Don't render this block for a filtered list with no matches; that state says how to clear the filter.
- Don't show it while the list is still loading; the user would see "create your first" for an account that has items.
- Don't add a second primary button to a promo card; the whole card is the action.

## Copy

- **Headline:** names the first action and the noun: `Create your first resource`.
- **Lead:** one sentence on the ways in: `Start from scratch, from a template or by importing your code.`
- **Method title:** two or three words for how: `From GitHub`, `Via CLI`, `From scratch`.
- **Method description:** one sentence on what happens: `Import a repository and deploy it on every push.`
- **Method action:** one verb: `Import`, `Create`.
- **Promo title:** sentence case, product names capitalized: `Start from a Catalog template`, `Set up your coding agent`.
- **Promo description:** one sentence on the result: `Deploy a framework starter and the resource that serves it, in one step.`
- **Documentation link:** `Documentation`.

## Accessibility

- The method icons and promo marks are decorative (`aria-hidden="true"`, `alt=""`); the titles carry the meaning.
- Each promo is a real link (`<a href>`) covering the card, because both navigate; the Catalog one opens a new tab, shows the external-link glyph and says so to screen readers.
- The command `Input` has an `aria-label`; the copy button has its own label and announces the copied state.
- The documentation link opens in a new tab; say so in the destination or let `Link` mark it.
- The headline is the page's first heading under the list title, not a second `h1`.

## States

- Default: the explanation, three create methods and the two promos.
- Loading: while the account reloads, `Skeleton`s draw the block's footprint (empty-state band, three method rows, two promo cards) in a busy status region.

## Related

- `view/table-view` — the list this block stands in for once the first item exists, and the home of the no-match state.
- `create/create-hub` — every create entry point across resource kinds.
- `create/deploy-template` — where the Catalog template promo leads.
- `state/project-intake` — the drop target and upload overlay an empty page can also render.
- `state/page-skeleton` — the skeleton painted before the page knows whether the list is empty.

## Variants

- `Default` — primary (the code below)
- `Loading` — While the account reloads, the page holds the block's own footprint in `Skeleton`s: the empty-state band, the three method rows and the two promo cards, in a busy status region.

Each variant is the same screen in another state: `get_block("state/first-use", { variant })`, or the file under `blocks/state/first-use/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import claudeMark from '@aziontech/webkit/assets/claude-symbol-color.svg'
  import codexMark from '@aziontech/webkit/assets/codex-symbol-mono.svg'
  import cursorMark from '@aziontech/webkit/assets/cursor-symbol-mono.svg'
  import geminiMark from '@aziontech/webkit/assets/gemini-symbol-color.svg'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import Logo from '@aziontech/webkit/logo'

  const agentMarks = [
    { name: 'Claude', src: claudeMark, mono: false },
    { name: 'Codex', src: codexMark, mono: true },
    { name: 'Gemini', src: geminiMark, mono: false },
    { name: 'Cursor', src: cursorMark, mono: true }
  ]
</script>

<template>
  <div class="flex flex-col items-start gap-(--spacing-lg)">
    <Card
      :padded="false"
      class="w-full"
    >
      <template #default>
        <EmptyState
          icon="ai ai-box"
          title="Create your first resource"
          description="Start from scratch, from a template or by importing your code."
        >
          <template #actions>
            <Link
              label="Documentation"
              href="https://example.com/docs/resources"
              target="_blank"
            />
          </template>
        </EmptyState>

        <div class="border-t border-(--border-muted)">
          <Item.List>
            <Item>
              <Item.Media kind="icon">
                <i
                  class="ai ai-github text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </Item.Media>
              <Item.Content>
                <Item.Title>From GitHub</Item.Title>
                <Item.Description
                  >Import a repository and deploy it on every push.</Item.Description
                >
              </Item.Content>
              <Item.Actions>
                <Button
                  label="Import"
                  kind="primary"
                  size="medium"
                />
              </Item.Actions>
            </Item>
            <Item>
              <Item.Media kind="icon">
                <i
                  class="ai ai-code text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </Item.Media>
              <Item.Content>
                <Item.Title>Via CLI</Item.Title>
                <Item.Description
                  >Run azion deploy and ship the branch you are on.</Item.Description
                >
              </Item.Content>
              <div
                class="flex basis-full md:basis-auto md:max-w-(--container-3xs) md:flex-1 justify-end"
              >
                <Item.Actions class="w-full">
                  <InputGroupRoot class="w-full">
                    <div class="flex min-w-0 flex-1">
                      <Input
                        model-value="azion deploy"
                        size="large"
                        class="w-full"
                        aria-label="Via CLI command"
                        readonly
                        monospace
                        :spellcheck="false"
                      />
                    </div>
                    <CopyButton
                      value="azion deploy"
                      aria-label="Copy the Via CLI command"
                      copied-label="Command copied"
                      size="small"
                    />
                  </InputGroupRoot>
                </Item.Actions>
              </div>
            </Item>
            <Item>
              <Item.Media kind="icon">
                <i
                  class="ai ai-globe text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </Item.Media>
              <Item.Content>
                <Item.Title>From scratch</Item.Title>
                <Item.Description>Point a domain at a service you already run.</Item.Description>
              </Item.Content>
              <Item.Actions>
                <Button
                  label="Create"
                  kind="outlined"
                  size="medium"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </div>
      </template>
    </Card>

    <div class="grid w-full gap-(--spacing-lg) md:grid-cols-2">
      <Card
        :padded="false"
        class="w-full"
      >
        <template #default>
          <a
            href="https://www.azion.com/en/templates/"
            target="_blank"
            rel="noopener noreferrer"
            class="group relative flex h-full w-full flex-col items-start gap-(--spacing-md) rounded-(--shape-card) p-(--spacing-md) text-start no-underline transition-colors duration-moderate-01 ease-productive-entrance motion-reduce:transition-none hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset"
          >
            <span
              class="flex items-center [&>*+*]:-ms-2 [&>*+*]:transition-[margin-left] [&>*+*]:duration-moderate-01 [&>*+*]:ease-productive-entrance group-hover:[&>*+*]:-ms-1.5 group-focus-visible:[&>*+*]:-ms-1.5 motion-reduce:[&>*+*]:transition-none"
              aria-hidden="true"
            >
              <span
                class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  class="ai-color ai-nextjs text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
              <span
                class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  class="ai-color ai-react text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
              <span
                class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  class="ai-color ai-vue text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
              <span
                class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  class="ai-color ai-svelte text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
            </span>

            <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <span class="text-heading-2xs text-(--text-default)"
                >Start from a Catalog template</span
              >
              <span class="text-pretty text-body-sm text-(--text-muted)"
                >Deploy a framework starter and the resource that serves it, in one step.</span
              >
            </span>

            <i
              class="ai ai-external-link absolute end-(--spacing-md) top-(--spacing-md) text-body-sm leading-none text-(--text-muted) transition-colors duration-moderate-01 ease-productive-entrance motion-reduce:transition-none group-hover:text-(--text-default)"
              aria-hidden="true"
            />
            <span class="sr-only">(opens in a new tab)</span>
          </a>
        </template>
      </Card>

      <Card
        :padded="false"
        class="w-full"
      >
        <template #default>
          <a
            href="/agent-setup"
            class="group relative flex h-full w-full flex-col items-start gap-(--spacing-md) rounded-(--shape-card) p-(--spacing-md) text-start no-underline transition-colors duration-moderate-01 ease-productive-entrance motion-reduce:transition-none hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset"
          >
            <span
              class="flex items-center [&>*+*]:-ms-2 [&>*+*]:transition-[margin-left] [&>*+*]:duration-moderate-01 [&>*+*]:ease-productive-entrance group-hover:[&>*+*]:-ms-1.5 group-focus-visible:[&>*+*]:-ms-1.5 motion-reduce:[&>*+*]:transition-none"
              aria-hidden="true"
            >
              <span
                v-for="agent in agentMarks"
                :key="agent.name"
                class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <Logo
                  :name="agent.name"
                  :src="agent.src"
                  :kind="agent.mono ? 'current' : 'color'"
                  decorative
                  size="small"
                />
              </span>
            </span>

            <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <span class="text-heading-2xs text-(--text-default)">Set up your coding agent</span>
              <span class="text-pretty text-body-sm text-(--text-muted)"
                >Give your editor a prompt that teaches it to build and deploy here.</span
              >
            </span>
          </a>
        </template>
      </Card>
    </div>
  </div>
</template>
```
