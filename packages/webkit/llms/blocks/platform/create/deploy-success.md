# DeploySuccess (`platform/create/deploy-success`)

> The outcome screen a create flow ends on, in the terminal column of the wizard page: a heading with its lead and, for a Git source, the scope as a Tag; the deployment card with a preview tile, the service name with a Live Tag and its creation time, Visit site, the domain with Add custom domain, and the repository with its branch; the Resources list that tags each row Created or Bound; Next steps as integration Cards that open the docs or carry on in the console; Get started with the CLI or GitHub Actions for a resource made from the CLI; and the Manage service button. Any create flow can end on it, with its own title and, when there is no Git source, no scope. Built from `SectionHeader`, `Card`, `Tag`, `Button`, `Link`, `Tooltip`, `Item`, `ToggleGroup` and `CodeBlock`.

- Surface: product
- Source: `blocks/platform/create/deploy-success/deploy-success.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/create/deploy-success")`
- Components: [Button](../../../components/button.md), [Card](../../../components/card.md), [CodeBlock](../../../components/code-block.md), [Item](../../../components/item.md), [Link](../../../components/link.md), [SectionHeader](../../../components/section-header.md), [Tag](../../../components/tag.md), [ToggleGroup](../../../components/toggle-group.md), [Tooltip](../../../components/tooltip.md)
- Skills: `webkit-ui-states`, `webkit-microcopy`

## Asked as

deploy success; deployment successful; deployed; success page; deployment complete; next steps after deploy; wizard finish; deploy concluído; sucesso do deploy; aplicação publicada

The screen a create flow ends on. The user has just watched a deploy finish and needs three answers before leaving: is it live and where, what exactly was created or bound along the way, and what to do next. The page answers them in that order in the terminal column of the wizard, then offers one way out to manage the resource.

## When to use

- A create flow (a template deploy, an import from Git, a source or provision wizard) has finished and the resource is serving, or was created for the first time.
- The flow created or bound more than one resource and the user should see each one.
- A resource was made from the CLI and nothing serves it yet: the CliCreated state shows how to deploy it.

## When not to use

- The run is still going or has failed: keep `platform/create/deployment-flow` on screen.
- A resource created from a form that does not deploy: end on the resource's page with a success toast that names it, as `skills/webkit-create-surface` describes; there is no outcome screen.
- An item added inside a resource from a drawer: use `platform/create/create-in-drawer` and close it on save.
- The onboarding steps for a CLI resource on its Overview tab: use `platform/detail/get-started`.

## Building blocks

### A. Outcome heading — `Tag` (required)

A large `h1` stating the outcome and one muted lead sentence under it. For a Git source the lead ends with the scope as a secondary `Tag` with the provider glyph; without a Git source there is no scope tag. The heading enters with the content animation and respects reduced motion.

### B. Deployment card — `Card`, `Tag`, `Button`, `Link`, `Tooltip` (required)

The live service: a decorative preview tile (hidden from assistive technology; Visit site is the link), the service name as an `h2` with a small success `Tag` reading Live, and its creation time. An outlined medium `Button` Visit site opens the domain in a new tab. Under it, one row for the domain (a small `Link` with `target="_blank"`) with Add custom domain beside it (a small `Button kind="link"` with `href`), and one row for the repository (a small `Link`) with its branch. Each external `Link` carries a `Tooltip` naming where it goes and its external-link glyph. Never hand-roll the anchors. Leave the card out when nothing serves the resource yet.

### C. Resources list — `Card`, `Item`, `Tag` (required)

A small heading, "Resources", over `Card :padded="false"` holding an `Item` list, one small row per resource: kind glyph, name, its ID or contents as the description, and a small `Tag` reading Created or Bound. Bound marks a resource that already existed and was attached, so the user can tell new things from reused ones.

### D. Next steps — `Card` (required)

`Card kind="integration"` tiles in a row from the small breakpoint, each with a glyph (`logo`), a title and one sentence. A step with `href` is a link stretched over the tile; a step that acts in place (Deploy this resource) has no `href`, and its title is a button that emits `select`. Mark at most one with a primary Recommended badge (`badges`). Docs steps open in the same tab, so no new-tab notice is needed.

### E. Manage — `Button` (required)

One full-width secondary large `Button`, "Manage service", at the end of the column that opens the resource. It is the only exit; do not add a second.

## Do

- Lead with the outcome and the live address; the user came to see it work.
- Tag every resource Created or Bound so the list doubles as a receipt of what the flow touched.
- Open the domain and the repository in a new tab with `Link target="_blank"`, and a `Tooltip` saying so.
- Drop the scope tag and the repository row when the flow had no Git source.
- In CliCreated, replace the deployment card with next steps that deploy the resource, and add the Get started paths for the CLI and GitHub Actions.

## Don't

- Don't celebrate: no confetti, no exclamation, no emoji. State the fact.
- Don't put more than one Recommended tag among the next steps.
- Don't add a Deploy again or Create another action; the user starts a new flow from the Creation Center.
- Don't leave the screen without a way into the resource; Manage is required.
- Don't repeat the resource list inside the deployment card.

## Copy

- **Heading:** the object and the past-tense result in sentence case, e.g. "Resource deployed", or "Resource created" when nothing serves it.
- **Lead:** one sentence with a period, e.g. "You deployed a new resource." followed by "Source:" and the source tag. Never a dangling fragment after the period.
- **Status tag:** one word, e.g. "Live"; resource tags "Created" or "Bound".
- **Links:** verb first, e.g. "Visit site", "Add custom domain"; tooltips name the target, e.g. "Open acme/web-app in a new tab".
- **Next steps:** title verb first in two or three words, e.g. "Customize domain", "View analytics"; description one sentence with a period.
- **Exit:** "Manage service", the verb and its object.
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no ampersand, no "please".

## Accessibility

- The heading is the page's only `h1`; the service name and the section titles are `h2`.
- The preview tile is decorative (`aria-hidden`); Visit site names the address.
- Links that open a new tab say so in their `Tooltip`, not only with the external-link glyph.
- Glyphs in rows and cards are decorative and carry `aria-hidden="true"`; the Created or Bound tag gives the state in words.
- A next-step card is one focusable link or button with a visible focus ring; its title and description are its name.
- Focus order follows reading order: heading, deployment card, resources, next steps, Manage.

## States

- Default: a deployed service from a Git source, with the scope, the deployment card, four resources and three next steps.
- CliCreated: a resource made from the CLI that nothing serves yet; no deployment card, one resource row, next steps to deploy it here or on a new service, and the Get started paths.

## Related

- `platform/create/deployment-flow` — the run this screen follows.
- `platform/create/deploy-template` — a flow that ends here.
- `platform/create/source-wizard` — a wizard that ends here.
- `platform/create/provision-wizard` — a wizard that ends here with its own title.
- `platform/detail/get-started` — the source of the CLI and GitHub Actions steps the CliCreated state embeds; CliCreated copies its section verbatim, so change the command copy there first and copy it here.
- `platform/detail/details-page` — where Manage leads.

## Variants

- `Default` — primary (the code below)
- `CliCreated` — A resource made from the CLI that nothing serves yet: no deployment card, the resource as the only row, next steps that deploy it here (Recommended) or on a new service, and Get started with the CLI and GitHub Actions paths.

Each variant is the same screen in another state: `get_pattern("platform/create/deploy-success", { variant })`, or the file under `blocks/platform/create/deploy-success/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card, { type CardBadge } from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'

  interface NextStep {
    icon: string
    title: string
    description: string
    href?: string
    action?: boolean
    recommended?: boolean
  }

  const recommendedBadge: CardBadge[] = [{ label: 'Recommended', severity: 'primary' }]

  const resources = [
    {
      key: 'service',
      kind: 'Service',
      icon: 'pi pi-server',
      name: 'web-app',
      reference: '1482736015'
    },
    {
      key: 'resource',
      kind: 'Resource',
      icon: 'pi pi-box',
      name: 'web-app',
      state: 'created',
      reference: '1739204418'
    },
    {
      key: 'integration',
      kind: 'Integration',
      icon: 'pi pi-link',
      name: 'web-app-storage',
      reference: '1215583907'
    },
    {
      key: 'storage',
      kind: 'Storage',
      icon: 'pi pi-inbox',
      name: 'web-app-assets',
      reference: '24 files · 1.2 MB'
    }
  ]

  const nextSteps: NextStep[] = [
    {
      icon: 'pi pi-globe',
      title: 'Customize domain',
      description:
        'Associate a custom domain and subdomains with this service to handle user access.',
      href: 'https://example.com/docs'
    },
    {
      icon: 'pi pi-sitemap',
      title: 'Point traffic',
      description:
        'Redirect the traffic of a domain to the platform and take advantage of the distributed network.',
      href: 'https://example.com/docs'
    },
    {
      icon: 'pi pi-chart-line',
      title: 'View analytics',
      description: 'Gain powerful insights into your performance, availability, and security.',
      href: 'https://example.com/docs'
    }
  ]
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-(--bg-canvas)">
    <div class="flex min-h-full flex-1 flex-col pb-(--layout-section-gap)">
      <div
        class="layout-column-form layout-boundary-inline flex min-w-0 flex-1 flex-col pt-(--layout-section-gap)"
      >
        <div class="layout-column-content my-auto flex flex-col gap-(--spacing-xl)">
          <header
            class="animate-content-enter motion-reduce:animate-none flex w-full flex-col gap-(--spacing-xxs)"
          >
            <h1 class="text-balance text-heading-lg text-(--text-default)">Resource deployed</h1>
            <p
              class="flex flex-wrap items-center gap-(--spacing-xs) text-body-sm text-(--text-muted)"
            >
              You deployed a new resource. Source:
              <Tag
                label="acme"
                severity="secondary"
                icon="ai ai-github"
              />
            </p>
          </header>

          <div
            class="animate-content-enter motion-reduce:animate-none flex w-full flex-col gap-(--spacing-lg) [--content-enter-delay:var(--transition-duration-fast-01)]"
          >
            <Card>
              <template #content>
                <div class="flex flex-col gap-(--spacing-md) sm:flex-row">
                  <div
                    aria-hidden="true"
                    class="relative flex aspect-16/10 w-full shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-canvas) sm:w-56"
                  >
                    <span
                      class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)"
                    >
                      <i
                        class="pi pi-globe text-body-md leading-none text-(--text-default)"
                        aria-hidden="true"
                      />
                    </span>
                  </div>

                  <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-md)">
                    <div class="flex flex-wrap items-start justify-between gap-(--spacing-sm)">
                      <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                        <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                          <h2 class="min-w-0 truncate text-heading-xs text-(--text-default)">
                            web-app
                          </h2>
                          <Tag
                            label="Live"
                            severity="success"
                            size="small"
                          />
                        </div>
                        <span class="text-body-sm text-(--text-muted)">Created just now</span>
                      </div>

                      <Button
                        label="Visit site"
                        kind="outlined"
                        size="medium"
                        icon="pi pi-external-link"
                        icon-position="trailing"
                        href="https://web-app-k3x9q2.example.com"
                        target="_blank"
                      />
                    </div>

                    <ul class="flex flex-col gap-(--spacing-xs)">
                      <li class="flex min-h-7 min-w-0 flex-wrap items-center gap-x-(--spacing-md)">
                        <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                          <i
                            class="pi pi-globe shrink-0 text-(--text-muted)"
                            aria-hidden="true"
                          />
                          <div class="min-w-0">
                            <Tooltip
                              text="Open web-app-k3x9q2.example.com in a new tab"
                              class="w-full"
                            >
                              <Link
                                label="web-app-k3x9q2.example.com"
                                href="https://web-app-k3x9q2.example.com"
                                target="_blank"
                                size="small"
                              />
                            </Tooltip>
                          </div>
                        </span>
                        <Button
                          label="Add custom domain"
                          kind="link"
                          size="small"
                          icon="pi pi-plus-circle"
                          href="/services/1482736015?name=web-app&tab=settings"
                        />
                      </li>
                      <li class="flex min-h-7 min-w-0 flex-wrap items-center gap-x-(--spacing-md)">
                        <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                          <i
                            class="ai ai-github shrink-0 text-(--text-muted)"
                            aria-hidden="true"
                          />
                          <div class="min-w-0">
                            <Tooltip
                              text="Open acme/web-app in a new tab"
                              class="w-full"
                            >
                              <Link
                                label="acme/web-app"
                                href="https://github.com/acme/web-app"
                                target="_blank"
                                size="small"
                              />
                            </Tooltip>
                          </div>
                        </span>
                        <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                          <i
                            class="ai ai-branch shrink-0 text-(--text-muted)"
                            aria-hidden="true"
                          />
                          <span class="truncate text-body-sm text-(--text-default)">main</span>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </template>
            </Card>

            <section class="flex flex-col gap-(--spacing-sm)">
              <h2 class="text-label-md text-(--text-default)">Resources</h2>
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <Item
                      v-for="resource in resources"
                      :key="resource.key"
                      size="small"
                    >
                      <Item.Media>
                        <span
                          class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)"
                        >
                          <i
                            :class="resource.icon"
                            class="text-body-sm leading-none text-(--text-default)"
                            aria-hidden="true"
                          />
                        </span>
                      </Item.Media>
                      <Item.Content>
                        <Item.Title>{{ resource.name }}</Item.Title>
                        <Item.Description>
                          {{ resource.kind }} · {{ resource.reference }}
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions>
                        <Tag
                          :label="resource.state === 'bound' ? 'Bound' : 'Created'"
                          :severity="resource.state === 'bound' ? 'info' : 'success'"
                          size="small"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="flex flex-col gap-(--spacing-sm)">
              <h2 class="text-label-md text-(--text-default)">Next steps</h2>
              <div class="grid grid-cols-1 gap-(--spacing-sm) sm:grid-cols-3">
                <Card
                  v-for="step in nextSteps"
                  :key="step.title"
                  kind="integration"
                  :title="step.title"
                  :logo="step.icon"
                  :description="step.description"
                  :href="step.href ?? ''"
                  :badges="step.recommended ? recommendedBadge : []"
                />
              </div>
            </section>

            <Button
              class="w-full"
              label="Manage service"
              kind="secondary"
              size="large"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```
