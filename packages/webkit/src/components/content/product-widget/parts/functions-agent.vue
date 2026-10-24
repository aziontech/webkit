<script setup lang="ts">
  import { curve, duration } from '@aziontech/theme/animations'
  import {
    type ComponentPublicInstance,
    computed,
    onMounted,
    onScopeDispose,
    ref,
    shallowRef
  } from 'vue'

  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import Tag from '../../../tag/tag.vue'
  import { typeInto, useSceneScript } from '../composables/use-scene-script'
  import {
    AGENT_CLIENTS,
    AGENT_TRANSCRIPT,
    type AgentTranscriptEntry
  } from '../data/functions-start'

  defineOptions({ name: 'FunctionsAgent' })

  interface Props {
    /** Whether this transcript is the one showing; it plays only while it is. */
    active?: boolean
    /** Mark of the coding agent the transcript runs in. */
    client?: string
  }

  const props = withDefaults(defineProps<Props>(), { active: true, client: 'claude' })

  const STATES = {
    preview: { label: 'Dry run', severity: 'info' },
    running: { label: 'Running', severity: 'secondary' },
    done: { label: 'Done', severity: 'success' }
  } as const

  const root = ref<HTMLElement | null>(null)
  const windowEl = ref<HTMLElement | null>(null)
  const trackEl = ref<ComponentPublicInstance | null>(null)
  const shown = shallowRef<AgentTranscriptEntry[]>([])
  const draft = ref('')
  const heights = ref({ window: 0, track: 0 })
  const glide = ref(false)

  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  let observer: globalThis.ResizeObserver | null = null

  const agent = computed(
    () => AGENT_CLIENTS.find((entry) => entry.mark === props.client) ?? AGENT_CLIENTS[0]
  )

  const trackStyle = computed(() => ({
    translate: `0 ${-Math.max(0, heights.value.track - heights.value.window)}px`,
    transition:
      reduced || !glide.value
        ? 'none'
        : `translate ${duration['moderate-02']} ${curve['productive-entrance']}`
  }))

  const trackElement = () => trackEl.value?.$el as HTMLElement | undefined

  const measure = () => {
    heights.value = {
      window: windowEl.value?.offsetHeight ?? 0,
      track: trackElement()?.offsetHeight ?? 0
    }
  }

  onMounted(() => {
    if (typeof globalThis.ResizeObserver !== 'function') return
    observer = new globalThis.ResizeObserver(measure)
    if (windowEl.value) observer.observe(windowEl.value)
    const track = trackElement()
    if (track) observer.observe(track)
    measure()
  })

  onScopeDispose(() => observer?.disconnect())

  const push = (entry: AgentTranscriptEntry) => {
    glide.value = true
    shown.value = [...shown.value, entry]
  }

  const rewrite = (entry: AgentTranscriptEntry) => {
    shown.value = [...shown.value.slice(0, -1), entry]
  }

  const [prompt, ...replies] = AGENT_TRANSCRIPT

  useSceneScript(root, {
    active: () => props.active,
    reset: () => {
      glide.value = false
      shown.value = []
      draft.value = prompt.text ?? ''
    },
    settle: () => {
      glide.value = false
      shown.value = AGENT_TRANSCRIPT
      draft.value = ''
    },
    play: async (wait) => {
      draft.value = ''
      push(prompt)
      await wait(900)
      for (const entry of replies) {
        if (entry.kind === 'tool') {
          push({ ...entry, state: 'running' })
          await wait(entry.state === 'preview' ? 900 : 700)
          rewrite(entry)
          await wait(entry.state === 'preview' ? 900 : 380)
          continue
        }
        const user = entry.kind === 'user'
        push({ ...entry, text: '' })
        await typeInto(wait, entry.text ?? '', (text) => rewrite({ ...entry, text }), {
          step: user ? 3 : 4,
          every: user ? 30 : 24
        })
        await wait(user ? 900 : 420)
      }
    }
  })
</script>

<template>
  <div
    ref="root"
    class="flex h-full min-w-0 flex-col gap-(--spacing-md)"
  >
    <div
      ref="windowEl"
      class="min-h-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_24%)] [mask-mode:alpha]"
    >
      <TransitionGroup
        ref="trackEl"
        tag="ol"
        enter-from-class="opacity-0!"
        :style="trackStyle"
        class="m-0 flex list-none flex-col gap-(--spacing-lg) p-0 pt-(--spacing-xl) pb-(--spacing-xxs)"
      >
        <li
          v-for="(entry, index) in shown"
          :key="index"
          :data-active="index === shown.length - 1 || null"
          class="opacity-45 transition-opacity duration-moderate-02 ease-productive-entrance data-active:opacity-100 motion-reduce:opacity-100 motion-reduce:transition-none"
        >
          <p
            v-if="entry.kind === 'user'"
            class="m-0 ms-(--spacing-xl) rounded-(--shape-elements) [border:var(--illustration-rim-width,var(--border-2))_solid_transparent] [background-image:var(--illustration-rim-layers,linear-gradient(var(--illustration-fill,var(--bg-surface)),var(--illustration-fill,var(--bg-surface))),var(--illustration-rim,linear-gradient(135deg,var(--border-default)_0%,var(--border-default)_18%,transparent_45%,transparent_55%,var(--border-default)_82%,var(--border-default)_100%)),linear-gradient(var(--illustration-fill,var(--bg-surface)),var(--illustration-fill,var(--bg-surface))))] [background-origin:var(--illustration-rim-boxes,padding-box,border-box,border-box)] [background-clip:var(--illustration-rim-boxes,padding-box,border-box,border-box)] px-(--spacing-md) py-(--spacing-sm) text-body-sm text-(--text-default)"
          >
            {{ entry.text }}
          </p>

          <p
            v-else-if="entry.kind === 'agent'"
            class="m-0 flex gap-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            <i
              :class="agent.icon"
              class="mt-[0.2em] shrink-0 text-label-sm leading-none"
              aria-hidden="true"
            />
            <span class="min-w-0">{{ entry.text }}</span>
          </p>

          <div
            v-else
            class="ms-(--spacing-lg) flex flex-col overflow-hidden rounded-(--shape-elements) [border:var(--illustration-rim-width,var(--border-2))_solid_transparent] [background-image:var(--illustration-rim-layers,linear-gradient(var(--illustration-fill,var(--bg-surface)),var(--illustration-fill,var(--bg-surface))),var(--illustration-rim,linear-gradient(135deg,var(--border-default)_0%,var(--border-default)_18%,transparent_45%,transparent_55%,var(--border-default)_82%,var(--border-default)_100%)),linear-gradient(var(--illustration-fill,var(--bg-surface)),var(--illustration-fill,var(--bg-surface))))] [background-origin:var(--illustration-rim-boxes,padding-box,border-box,border-box)] [background-clip:var(--illustration-rim-boxes,padding-box,border-box,border-box)]"
          >
            <div class="flex items-center gap-(--spacing-xs) px-(--spacing-md) py-(--spacing-xs)">
              <i
                class="ai ai-azion text-label-sm leading-none text-(--primary)"
                aria-hidden="true"
              />
              <span class="min-w-0 truncate text-label-sm text-(--text-default)">
                <span class="text-(--text-muted)">Azion {{ entry.server }}</span>
                {{ entry.action }}
              </span>
              <span class="ms-auto flex shrink-0">
                <Tag
                  size="small"
                  :label="STATES[entry.state ?? 'done'].label"
                  :severity="STATES[entry.state ?? 'done'].severity"
                />
              </span>
            </div>
            <dl
              v-if="entry.state !== 'running'"
              class="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-(--spacing-md) gap-y-(--spacing-xxs) border-t border-(--border-default) px-(--spacing-md) py-(--spacing-sm) text-label-code-sm"
            >
              <template
                v-for="[term, value] in entry.detail"
                :key="term"
              >
                <dt class="text-(--text-muted)">{{ term }}</dt>
                <dd class="m-0 truncate text-(--text-default)">{{ value }}</dd>
              </template>
            </dl>
          </div>
        </li>
      </TransitionGroup>
    </div>

    <div
      class="flex shrink-0 items-end gap-(--spacing-sm) rounded-(--shape-elements) [border:var(--illustration-rim-width,var(--border-2))_solid_transparent] [background-image:var(--illustration-rim-layers,linear-gradient(var(--illustration-fill,var(--bg-surface)),var(--illustration-fill,var(--bg-surface))),var(--illustration-rim,linear-gradient(135deg,var(--border-default)_0%,var(--border-default)_18%,transparent_45%,transparent_55%,var(--border-default)_82%,var(--border-default)_100%)),linear-gradient(var(--illustration-fill,var(--bg-surface)),var(--illustration-fill,var(--bg-surface))))] [background-origin:var(--illustration-rim-boxes,padding-box,border-box,border-box)] [background-clip:var(--illustration-rim-boxes,padding-box,border-box,border-box)] py-(--spacing-sm) ps-(--spacing-md) pe-(--spacing-sm)"
    >
      <p class="m-0 min-h-10 min-w-0 flex-1 self-center text-body-sm">
        <span
          v-if="draft"
          class="text-(--text-default)"
          >{{ draft }}</span
        >
        <span
          v-else
          class="text-(--text-muted)"
          >Ask {{ agent.name }} to build something</span
        >
      </p>
      <IconButton
        icon="pi pi-arrow-up"
        kind="primary"
        size="small"
        ariaLabel="Send"
        :disabled="!draft"
      />
    </div>
  </div>
</template>
