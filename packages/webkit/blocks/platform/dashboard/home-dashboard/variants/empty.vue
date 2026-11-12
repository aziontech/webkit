<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Illustration from '@aziontech/webkit/illustration'
  import Input from '@aziontech/webkit/input'
  import Popover from '@aziontech/webkit/popover'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Spinner from '@aziontech/webkit/spinner'
  import { useConsoleLayout } from '@aziontech/webkit/use-console-layout'
  import { reactive, ref, watch } from 'vue'

  const layout = useConsoleLayout({ optional: true })

  const openSearch = () => layout?.openSearch()

  const DOMAIN_SHAPE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9-]+)*\.[a-z]{2,}$/i
  const REGISTERED = ['example.com', 'example.org', 'example.net', 'acme.com']
  const CHECK_MS = 900

  const domain = ref('')
  const check = reactive({ open: false, loading: false, name: '', registered: false })
  const fieldWidth = ref(0)
  let checkTimer: ReturnType<typeof globalThis.setTimeout> | undefined

  const measureField = (event: Event) => {
    const form = (event.target as Element | null)?.closest?.('form')
    if (form) fieldWidth.value = Math.round(form.offsetWidth)
  }

  watch(domain, (value) => {
    globalThis.clearTimeout(checkTimer)
    const name = value.trim().toLowerCase()
    if (!DOMAIN_SHAPE.test(name)) {
      check.open = false
      check.loading = false
      return
    }
    check.open = true
    check.loading = true
    check.name = name
    checkTimer = globalThis.setTimeout(() => {
      check.loading = false
      check.registered = REGISTERED.includes(name)
    }, CHECK_MS)
  })

  const onCheckOpen = (value: boolean) => {
    if (!value) check.open = false
  }
</script>

<template>
  <div class="layout-column layout-boundary relative flex min-h-full flex-1 flex-col">
    <div class="my-auto flex w-full flex-col gap-(--layout-section-gap) py-(--spacing-xl)">
      <div
        class="animate-content-enter motion-reduce:animate-none flex flex-col items-center gap-(--spacing-lg)"
      >
        <div class="flex flex-col items-center gap-(--spacing-xs)">
          <p class="text-center text-body-md text-(--text-muted)">Good morning, Alex</p>
          <h1 class="text-balance text-center text-heading-lg text-(--text-default)">
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
          <template #content>
            <div class="flex h-full flex-col p-(--spacing-sm)">
              <div
                class="flex aspect-4/3 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
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
                    kind="outlined"
                    size="medium"
                  />
                </div>
              </div>
            </div>
          </template>
        </Card>
        <Card :padded="false">
          <template #content>
            <div class="flex h-full flex-col p-(--spacing-sm)">
              <div
                class="flex aspect-4/3 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
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
                  <Popover
                    :open="check.open"
                    placement="bottom-start"
                    :offset="8"
                    class="w-full"
                    @update:open="onCheckOpen"
                  >
                    <Popover.Trigger class="w-full">
                      <form
                        class="w-full"
                        @submit.prevent
                      >
                        <Input
                          v-model="domain"
                          placeholder="Type in your domain"
                          size="medium"
                          aria-label="Domain to add"
                          @input="measureField"
                        />
                      </form>
                    </Popover.Trigger>

                    <Popover.Content>
                      <div
                        class="overflow-hidden transition-[height] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                        :style="fieldWidth ? { width: fieldWidth + 'px' } : {}"
                      >
                        <Transition
                          mode="out-in"
                          enter-active-class="animate-fade-in motion-reduce:animate-none"
                          leave-active-class="animate-fade-out motion-reduce:animate-none"
                        >
                          <div
                            v-if="check.loading"
                            key="checking"
                            class="flex items-center justify-center gap-(--spacing-xs) p-(--spacing-sm) text-center text-body-sm text-(--text-muted)"
                          >
                            <div class="contents text-(--text-muted)">
                              <Spinner class="shrink-0" />
                            </div>
                            Checking {{ check.name }}...
                          </div>

                          <div
                            v-else
                            key="verdict"
                            class="flex flex-col gap-(--spacing-sm) p-(--spacing-sm)"
                          >
                            <p class="text-body-sm text-(--text-default)">
                              <template v-if="check.registered">
                                {{ check.name }} is already registered. Try another name.
                              </template>
                              <template v-else>
                                {{ check.name }} is available. We register it and issue the
                                certificate.
                              </template>
                            </p>
                            <Button
                              v-if="!check.registered"
                              label="Register"
                              kind="secondary"
                              size="medium"
                              class="w-full"
                            />
                          </div>
                        </Transition>
                      </div>
                    </Popover.Content>
                  </Popover>
                </div>
              </div>
            </div>
          </template>
        </Card>
        <Card :padded="false">
          <template #content>
            <div class="flex h-full flex-col p-(--spacing-sm)">
              <div
                class="flex aspect-4/3 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
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
                    kind="outlined"
                    size="medium"
                    icon="pi pi-copy"
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
