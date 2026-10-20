<script setup lang="ts">
  import { curve, duration } from '@aziontech/theme/animations'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tag from '@aziontech/webkit/tag'
  import AgentMark from '@shared/ui/brand/AgentMark.vue'
  import { computed, onMounted, onScopeDispose, ref, shallowRef } from 'vue'

  import { typeInto, useSceneScript } from '../composables/use-scene-script'
  import { AGENT_CLIENTS, AGENT_TRANSCRIPT } from '../data/functions-start.js'

  interface TranscriptEntry {
    kind: 'user' | 'agent' | 'tool'
    text?: string
    server?: string
    action?: string
    state?: 'preview' | 'running' | 'done'
    detail?: [string, string][]
  }

  interface Props {
    /** Whether this scene is the one showing; a scene that shares a frame plays only while it is. */
    active?: boolean
    /** Mark of the coding agent the transcript runs in — a `mark` of `AGENT_CLIENTS`. */
    client?: string
  }

  const props = withDefaults(defineProps<Props>(), { active: true, client: 'claude' })

  const root = ref<HTMLElement | null>(null)
  const windowEl = ref<HTMLElement | null>(null)
  const trackEl = ref<HTMLElement | null>(null)
  const shown = shallowRef<TranscriptEntry[]>([])
  const draft = ref('')

  const heights = ref({ window: 0, track: 0 })
  const glide = ref(false)

  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  let observer: globalThis.ResizeObserver | null = null

  const measure = () => {
    heights.value = {
      window: windowEl.value?.offsetHeight ?? 0,
      track: trackEl.value?.offsetHeight ?? 0
    }
  }

  onMounted(() => {
    observer = new globalThis.ResizeObserver(measure)
    if (windowEl.value) observer.observe(windowEl.value)
    if (trackEl.value) observer.observe(trackEl.value)
    measure()
  })

  onScopeDispose(() => observer?.disconnect())

  const trackStyle = computed(() => ({
    translate: `0 ${-Math.max(0, heights.value.track - heights.value.window)}px`,
    transition:
      reduced || !glide.value
        ? 'none'
        : `translate ${duration['moderate-02']} ${curve['productive-entrance']}`
  }))

  const agent = computed(
    () => AGENT_CLIENTS.find((entry) => entry.mark === props.client) ?? AGENT_CLIENTS[0]
  )

  const push = (entry: TranscriptEntry) => {
    glide.value = true
    shown.value = [...shown.value, entry]
  }

  const rewrite = (entry: TranscriptEntry) => {
    shown.value = [...shown.value.slice(0, -1), entry]
  }

  const transcript = AGENT_TRANSCRIPT as TranscriptEntry[]
  const [prompt, ...replies] = transcript

  useSceneScript(root, {
    active: () => props.active,
    reset: () => {
      glide.value = false
      shown.value = []
      draft.value = prompt.text ?? ''
    },
    settle: () => {
      glide.value = false
      shown.value = transcript
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

  const STATES = {
    preview: { label: 'Dry run', severity: 'info' },
    running: { label: 'Running', severity: 'secondary' },
    done: { label: 'Done', severity: 'success' }
  } as const
</script>

<template>
  <figure
    ref="root"
    inert
    aria-hidden="true"
    class="pointer-events-none m-0 flex h-full min-w-0 flex-col gap-(--spacing-md) select-none"
  >
    <div
      ref="windowEl"
      class="min-h-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_24%)] [mask-mode:alpha]"
    >
      <ol
        ref="trackEl"
        :style="trackStyle"
        class="m-0 flex list-none flex-col gap-(--spacing-lg) p-0 pt-(--spacing-xl) pb-(--spacing-xxs)"
      >
        <li
          v-for="(entry, index) in shown"
          :key="index"
          :data-active="index === shown.length - 1 || null"
          class="animate-fade-in opacity-45 transition-opacity duration-moderate-02 ease-productive-entrance data-active:opacity-100 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transition-none"
        >
          <p
            v-if="entry.kind === 'user'"
            class="m-0 ms-(--spacing-xl) rounded-(--shape-elements) [border:var(--illustration-rim-width)_solid_transparent] [background-image:var(--illustration-rim-layers)] [background-origin:var(--illustration-rim-boxes)] [background-clip:var(--illustration-rim-boxes)] px-(--spacing-md) py-(--spacing-sm) text-body-sm text-(--text-default)"
          >
            {{ entry.text }}
          </p>

          <p
            v-else-if="entry.kind === 'agent'"
            class="m-0 flex gap-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            <AgentMark
              :name="agent.mark"
              class="mt-[0.2em] size-3.5 shrink-0"
            />
            <span class="min-w-0">{{ entry.text }}</span>
          </p>

          <div
            v-else
            class="ms-(--spacing-lg) flex flex-col overflow-hidden rounded-(--shape-elements) [border:var(--illustration-rim-width)_solid_transparent] [background-image:var(--illustration-rim-layers)] [background-origin:var(--illustration-rim-boxes)] [background-clip:var(--illustration-rim-boxes)]"
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
      </ol>
    </div>

    <div
      class="flex shrink-0 items-end gap-(--spacing-sm) rounded-(--shape-elements) [border:var(--illustration-rim-width)_solid_transparent] [background-image:var(--illustration-rim-layers)] [background-origin:var(--illustration-rim-boxes)] [background-clip:var(--illustration-rim-boxes)] py-(--spacing-sm) ps-(--spacing-md) pe-(--spacing-sm)"
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
        aria-label="Send"
        :disabled="!draft"
      />
    </div>
  </figure>
</template>
