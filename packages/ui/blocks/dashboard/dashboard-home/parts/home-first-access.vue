<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import Illustration from '@aziontech/ui/illustration'
  import SearchTrigger from '@aziontech/ui/search-trigger'
  import { useConsoleLayout } from '@aziontech/ui/use-console-layout'

  import type { HomeDashboardDomainAvailability } from '../dashboard-home.vue'
  import HomeDomainCheck from './home-domain-check.vue'

  export interface HomeFirstAccessProps {
    /** Time-of-day greeting before the name. */
    greeting: string
    /** First name in the greeting. */
    name: string
    /** Answer to the last check-domain event. */
    domainAvailability?: HomeDashboardDomainAvailability
  }

  withDefaults(defineProps<HomeFirstAccessProps>(), { domainAvailability: undefined })

  const emit = defineEmits<{
    'create-project': [event: MouseEvent]
    'check-domain': [name: string]
    'register-domain': [event: MouseEvent, name: string]
    'copy-prompt': [event: MouseEvent]
  }>()

  const layout = useConsoleLayout({ optional: true })

  const openSearch = () => layout?.openSearch()
</script>

<template>
  <div class="layout-column layout-boundary relative flex min-h-full flex-1 flex-col">
    <div class="my-auto flex w-full flex-col gap-(--layout-section-gap) py-(--spacing-xl)">
      <div
        class="animate-content-enter motion-reduce:animate-none flex flex-col items-center gap-(--spacing-lg)"
      >
        <div class="flex flex-col items-center gap-(--spacing-xs)">
          <p class="text-center text-body-md text-(--text-muted)">{{ greeting }}, {{ name }}</p>
          <h1 class="text-balance text-center text-title-md text-(--text-default)">
            Let's build something new.
          </h1>
        </div>

        <div class="flex w-full max-w-(--container-2xl) flex-col items-stretch">
          <SearchTrigger
            class="w-full"
            label="Search resources, pages and commands"
            @open="openSearch"
          />
        </div>
      </div>

      <div
        class="animate-content-enter motion-reduce:animate-none grid grid-cols-1 gap-(--spacing-lg) md:grid-cols-3 [--content-enter-delay:var(--transition-duration-fast-01)]"
      >
        <Card :padded="false">
          <template #default>
            <div class="flex h-full flex-col p-(--spacing-sm)">
              <div
                class="flex aspect-4/3 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <Illustration name="modern-frontends" />
              </div>

              <div
                class="flex flex-1 flex-col gap-(--spacing-md) px-(--spacing-sm) pb-(--spacing-sm) pt-(--spacing-md)"
              >
                <div class="flex flex-1 flex-col gap-(--spacing-xs)">
                  <h3 class="text-label-md text-(--text-default)">Ship something new</h3>
                  <p class="text-pretty text-body-sm text-(--text-muted)">
                    Deploy a static site or a full-stack app, with compute, AI, storage and media on
                    the same build.
                  </p>
                </div>
                <div class="flex items-center gap-(--spacing-xs)">
                  <Button
                    label="Create Project"
                    variant="outline"
                    size="medium"
                    @click="(event) => emit('create-project', event)"
                  />
                </div>
              </div>
            </div>
          </template>
        </Card>
        <Card :padded="false">
          <template #default>
            <div class="flex h-full flex-col p-(--spacing-sm)">
              <div
                class="flex aspect-4/3 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <Illustration name="dns-protection" />
              </div>

              <div
                class="flex flex-1 flex-col gap-(--spacing-md) px-(--spacing-sm) pb-(--spacing-sm) pt-(--spacing-md)"
              >
                <div class="flex flex-1 flex-col gap-(--spacing-xs)">
                  <h3 class="text-label-md text-(--text-default)">Add a domain</h3>
                  <p class="text-pretty text-body-sm text-(--text-muted)">
                    Register a new one or bring your own. DNS, automatic HTTPS and DDoS protection
                    come with it.
                  </p>
                </div>
                <div class="flex items-center gap-(--spacing-xs)">
                  <HomeDomainCheck
                    :domain-availability="domainAvailability"
                    @check-domain="(value) => emit('check-domain', value)"
                    @register-domain="(event, value) => emit('register-domain', event, value)"
                  />
                </div>
              </div>
            </div>
          </template>
        </Card>
        <Card :padded="false">
          <template #default>
            <div class="flex h-full flex-col p-(--spacing-sm)">
              <div
                class="flex aspect-4/3 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <Illustration name="ai-applications" />
              </div>

              <div
                class="flex flex-1 flex-col gap-(--spacing-md) px-(--spacing-sm) pb-(--spacing-sm) pt-(--spacing-md)"
              >
                <div class="flex flex-1 flex-col gap-(--spacing-xs)">
                  <h3 class="text-label-md text-(--text-default)">Onboard your agent</h3>
                  <p class="text-pretty text-body-sm text-(--text-muted)">
                    Give Claude, Cursor, Windsurf, Codex or OpenCode a prompt that sets your project
                    up to deploy here.
                  </p>
                </div>
                <div class="flex items-center gap-(--spacing-xs)">
                  <Button
                    label="Copy prompt"
                    variant="outline"
                    size="medium"
                    icon="az az-copy"
                    @click="(event) => emit('copy-prompt', event)"
                  />
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>
