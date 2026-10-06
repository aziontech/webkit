<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import InputText from '@aziontech/webkit/input-text'
  import Kbd from '@aziontech/webkit/kbd'
  import Popover from '@aziontech/webkit/popover'
  import Spinner from '@aziontech/webkit/spinner'
  import { toast } from '@aziontech/webkit/toast'
  import { AGENT_SETUP_PROMPT } from '@shared/lib/agent-onboarding'
  import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ProjectDropZone from '../../components/creation/ProjectDropZone.vue'
  import ProjectInitializing from '../../components/creation/ProjectInitializing.vue'
  import FirstUseCard from '../../components/home/FirstUseCard.vue'
  import HomeFirstUseWire from '../../components/home/HomeFirstUseWire.vue'
  import { useProjectDrop } from '../../lib/behavior/project-upload'
  import { createResourcePath } from '../../lib/data/create-resources'
  import { useGreeting } from '../../lib/data/greeting'
  import { firstUseDoors } from '../../lib/data/home-first-use'

  const route = useRoute()
  const router = useRouter()

  const LOAD_MS = 620
  const arriving = ref(true)
  let arrivalTimer
  onMounted(() => {
    arrivalTimer = globalThis.setTimeout(() => {
      arriving.value = false
    }, LOAD_MS)
  })

  const emit = defineEmits<{
    'open-palette': []
  }>()
  const openPalette = () => emit('open-palette')

  const { greetingFor } = useGreeting()
  const greeting = computed(() => greetingFor(route.query.email))

  const runDoor = (door) =>
    door.action.kind === 'copy-prompt' ? copyAgentPrompt() : openCreateFlow()

  const openCreateFlow = () =>
    router.push({ path: '/create', query: { email: route.query.email || undefined } })

  const copyAgentPrompt = async () => {
    try {
      await navigator.clipboard.writeText(AGENT_SETUP_PROMPT)
      toast.success('Setup prompt copied.', {
        description: 'Paste it into Claude, Cursor, Windsurf, Codex or OpenCode.'
      })
    } catch {
      toast.error("Couldn't copy the prompt.", {
        description: 'Clipboard access was blocked by the browser.'
      })
    }
  }

  const domain = ref('')

  const DOMAIN_SHAPE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9-]+)*\.[a-z]{2,}$/i

  const REGISTERED = ['azion.com', 'google.com', 'example.com', 'cloudflare.com']

  const CHECK_MS = 900

  const check = reactive({ open: false, loading: false, name: '', registered: false })
  let checkTimer

  const fieldWidth = ref(0)

  const measureField = (event) => {
    const form = event?.target?.closest?.('form')
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

  const onCheckOpen = (value) => {
    if (!value) {
      check.open = false
      releaseSwapHeight()
    }
  }

  const swapHeight = ref('')

  const pinSwapHeight = (el) => {
    swapHeight.value = `${el.offsetHeight}px`
  }

  const growSwapHeight = (el) => {
    swapHeight.value = `${el.offsetHeight}px`
  }

  const releaseSwapHeight = () => {
    swapHeight.value = ''
  }

  const addDomain = () => {
    const typed = domain.value.trim()
    if (!typed) {
      return
    }
    if (check.registered && check.name === typed.toLowerCase() && !check.loading) return
    globalThis.clearTimeout(checkTimer)
    check.open = false
    releaseSwapHeight()
    router.push({
      path: createResourcePath('domains'),
      query: {
        domain: typed,
        from: route.path,
        email: route.query.email || undefined
      }
    })
    domain.value = ''
  }

  const { dragging, initializing } = useProjectDrop()

  onUnmounted(() => {
    globalThis.clearTimeout(checkTimer)
    globalThis.clearTimeout(arrivalTimer)
  })
</script>

<template>
  <main class="layout-column layout-boundary relative flex min-h-full flex-col">
    <ProjectDropZone
      :active="dragging"
      class="[--drop-zone-inset:var(--layout-boundary-inline)]"
    />

    <ProjectInitializing
      v-if="initializing"
      :files="initializing.files"
      :truncated="initializing.truncated"
    />

    <HomeFirstUseWire v-if="arriving" />

    <div
      v-else
      class="my-auto flex w-full flex-col gap-(--layout-section-gap) py-(--spacing-xl)"
    >
      <div
        class="animate-content-enter motion-reduce:animate-none flex flex-col items-center gap-(--spacing-lg)"
      >
        <div class="flex flex-col items-center gap-(--spacing-xs)">
          <p class="text-center text-body-md text-(--text-muted)">{{ greeting }}</p>
          <h1 class="text-balance text-center text-heading-lg text-(--text-default)">
            Let's build on Azion.
          </h1>
        </div>

        <div class="flex w-full max-w-(--container-2xl) flex-col items-stretch">
          <div
            class="min-w-0 flex-1 cursor-pointer [&_input]:cursor-pointer"
            @click="openPalette"
            @keydown.enter="openPalette"
          >
            <InputText
              model-value=""
              placeholder="Search products, resources and commands"
              size="large"
              readonly
              aria-label="Search products, resources and commands"
              aria-keyshortcuts="Meta+K"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
              <template #iconRight>
                <Kbd
                  meta
                  size="small"
                  >K</Kbd
                >
              </template>
            </InputText>
          </div>
        </div>
      </div>

      <div
        class="animate-content-enter motion-reduce:animate-none grid grid-cols-1 gap-(--spacing-lg) md:grid-cols-3 [--content-enter-delay:var(--transition-duration-fast-01)]"
      >
        <FirstUseCard
          v-for="door in firstUseDoors"
          :key="door.id ?? door.title"
          :illustration="door.illustration"
          :title="door.title"
          :description="door.description"
        >
          <template #action>
            <Popover
              v-if="door.action.kind === 'domain'"
              :open="check.open"
              placement="bottom-start"
              :offset="8"
              class="w-full"
              @update:open="onCheckOpen"
            >
              <Popover.Trigger class="w-full">
                <form
                  class="w-full"
                  @submit.prevent="addDomain"
                >
                  <InputText
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
                  :style="{
                    ...(fieldWidth ? { width: `${fieldWidth}px` } : {}),
                    ...(swapHeight ? { height: swapHeight } : {})
                  }"
                >
                  <Transition
                    mode="out-in"
                    enter-active-class="animate-fade-in motion-reduce:animate-none"
                    leave-active-class="animate-fade-out motion-reduce:animate-none"
                    @before-leave="pinSwapHeight"
                    @enter="growSwapHeight"
                    @after-enter="releaseSwapHeight"
                  >
                    <p
                      v-if="check.loading"
                      key="checking"
                      class="flex items-center justify-center gap-(--spacing-xs) p-(--spacing-sm) text-center text-body-sm text-(--text-muted)"
                    >
                      <Spinner class="size-4 shrink-0 text-(--text-muted)" />
                      Checking {{ check.name }}...
                    </p>

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
                          {{ check.name }} is available. Azion registers it and issues the
                          certificate.
                        </template>
                      </p>
                      <Button
                        v-if="!check.registered"
                        label="Register"
                        kind="secondary"
                        size="medium"
                        class="w-full"
                        @click="addDomain"
                      />
                    </div>
                  </Transition>
                </div>
              </Popover.Content>
            </Popover>
            <Button
              v-else
              :label="door.action.label"
              kind="outlined"
              size="medium"
              :icon="door.action.kind === 'copy-prompt' ? 'pi pi-copy' : ''"
              @click="runDoor(door)"
            />
          </template>
        </FirstUseCard>
      </div>
    </div>
  </main>
</template>
