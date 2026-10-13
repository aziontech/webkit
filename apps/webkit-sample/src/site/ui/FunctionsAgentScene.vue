<script setup lang="ts">
  import Tag from '@aziontech/webkit/tag'
  import AgentMark from '@shared/ui/brand/AgentMark.vue'
  import { computed, nextTick, ref, shallowRef } from 'vue'

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
  }

  const props = withDefaults(defineProps<Props>(), { active: true })

  const root = ref<HTMLElement | null>(null)
  const scroller = ref<HTMLElement | null>(null)
  const shown = shallowRef<TranscriptEntry[]>([])
  const draft = ref('')
  const pass = ref(0)

  const client = computed(() => AGENT_CLIENTS[pass.value % AGENT_CLIENTS.length])

  const follow = () =>
    nextTick(() => {
      if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
    })

  const push = (entry: TranscriptEntry) => {
    shown.value = [...shown.value, entry]
    follow()
  }

  const rewrite = (entry: TranscriptEntry) => {
    shown.value = [...shown.value.slice(0, -1), entry]
    follow()
  }

  const transcript = AGENT_TRANSCRIPT as TranscriptEntry[]

  let started = false

  useSceneScript(root, {
    active: () => props.active,
    reset: () => {
      if (started) pass.value += 1
      started = true
      shown.value = []
      draft.value = ''
    },
    settle: () => {
      shown.value = transcript
      draft.value = ''
      follow()
    },
    play: async (wait) => {
      for (const entry of transcript) {
        if (entry.kind === 'user') {
          await typeInto(wait, entry.text ?? '', (text) => (draft.value = text), {
            step: 3,
            every: 30
          })
          await wait(420)
          draft.value = ''
          push(entry)
          await wait(700)
        } else if (entry.kind === 'agent') {
          push({ ...entry, text: '' })
          await typeInto(wait, entry.text ?? '', (text) => rewrite({ ...entry, text }), {
            step: 4,
            every: 24
          })
          await wait(420)
        } else {
          push({ ...entry, state: 'running' })
          await wait(entry.state === 'preview' ? 900 : 700)
          rewrite(entry)
          await wait(entry.state === 'preview' ? 900 : 380)
        }
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
    class="pointer-events-none m-0 flex h-full min-w-0 flex-col overflow-hidden bg-(--bg-canvas) select-none"
  >
    <div
      class="flex shrink-0 items-center gap-(--spacing-xs) border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-xs)"
    >
      <AgentMark
        :key="client.mark"
        :name="client.mark"
        class="size-4 animate-fade-in motion-reduce:animate-none"
      />
      <span class="truncate text-label-sm text-(--text-default)">{{ client.name }}</span>
      <span
        class="ms-auto flex shrink-0 items-center gap-(--spacing-xxs) text-label-sm text-(--text-muted)"
      >
        <span class="size-1.5 rounded-full bg-(--success-contrast)" />
        Azion MCP · docs, build
      </span>
    </div>

    <div
      ref="scroller"
      class="min-h-0 flex-1 overflow-hidden px-(--spacing-md) py-(--spacing-md)"
    >
      <ol class="m-0 flex list-none flex-col gap-(--spacing-sm) p-0">
        <li
          v-for="(entry, index) in shown"
          :key="index"
          class="animate-fade-in motion-reduce:animate-none"
        >
          <p
            v-if="entry.kind === 'user'"
            class="m-0 rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            <span class="text-(--text-muted)">› </span>{{ entry.text }}
          </p>

          <p
            v-else-if="entry.kind === 'agent'"
            class="m-0 flex gap-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            <span class="mt-[0.45em] size-1.5 shrink-0 rounded-full bg-(--text-default)" />
            <span class="min-w-0">{{ entry.text }}</span>
          </p>

          <div
            v-else
            class="ms-(--spacing-sm) flex flex-col overflow-hidden rounded-(--shape-elements) border border-(--border-default)"
          >
            <div
              class="flex items-center gap-(--spacing-xs) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xxs)"
            >
              <i
                class="ai ai-azion text-label-sm leading-none text-(--primary)"
                aria-hidden="true"
              />
              <span class="min-w-0 truncate text-label-sm text-(--text-default)">
                <span class="text-(--text-muted)">Azion {{ entry.server }} ›</span>
                {{ entry.action }}
              </span>
              <Tag
                class="ms-auto shrink-0"
                size="small"
                :label="STATES[entry.state ?? 'done'].label"
                :severity="STATES[entry.state ?? 'done'].severity"
              />
            </div>
            <dl
              v-if="entry.state !== 'running'"
              class="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-(--spacing-md) gap-y-(--spacing-xxs) border-t border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-label-code-sm"
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

    <div class="shrink-0 border-t border-(--border-default) px-(--spacing-md) py-(--spacing-sm)">
      <div
        class="flex min-h-9 items-start gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs) text-body-sm"
      >
        <span class="text-(--text-muted)">›</span>
        <span
          v-if="draft"
          class="min-w-0 text-(--text-default)"
          >{{ draft
          }}<span class="ms-px inline-block h-[1.1em] w-px translate-y-[0.2em] bg-(--text-default)"
        /></span>
        <span
          v-else
          class="text-(--text-muted)"
          >Ask {{ client.name }} to build something</span
        >
      </div>
    </div>
  </figure>
</template>
