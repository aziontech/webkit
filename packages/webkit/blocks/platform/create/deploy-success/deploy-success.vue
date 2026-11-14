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
