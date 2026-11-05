<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, ref, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import CopyButton from '../../actions/copy-button/copy-button.vue'
  import SegmentedButton from '../../actions/segmented-button/segmented-button.vue'
  import InputGroup from '../../inputs/input-group/input-group.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import CallToAction from '../../marketing/call-to-action/call-to-action.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import TextureMaterial from '../../marketing/texture-material/texture-material.vue'

  defineOptions({
    name: 'ClosingCallToActionAgents',
    inheritAttrs: false
  })

  /** Visual weight of an audience action. */
  export type ClosingCallToActionAgentsActionKind = 'secondary' | 'outlined'

  /** One action of an audience. */
  export type ClosingCallToActionAgentsAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Visual weight: `secondary` is the white pill, `outlined` the quiet one; defaults to `outlined`. */
    kind?: ClosingCallToActionAgentsActionKind
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
  }

  /** The copyable line of an audience. */
  export type ClosingCallToActionAgentsCopy = {
    /** Accessible name of the copy button. */
    label: string
    /** Line shown in the read-only field and copied as is. */
    text: string
  }

  /** One way in, picked by the audience switch. */
  export type ClosingCallToActionAgentsAudience = {
    /** Stable value of the audience in the switch. */
    value: string
    /** Visible label of the audience in the switch. */
    label: string
    /** Copyable line shown beside the actions. */
    copy?: ClosingCallToActionAgentsCopy
    /** The actions of the audience, in order. */
    actions?: ClosingCallToActionAgentsAction[]
  }

  interface Props {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Headline of the band, rendered by the call to action as its `h2`; the band renders nothing when empty. */
    title?: string
    /** Fixed opening of the typed line, before the typed word. */
    typedLead?: string
    /** Words typed, held, erased and typed again in order after `typedLead`; the typed line renders only when there are words. */
    typedWords?: string[]
    /** Closing sentence under the typed line, the same for every audience. */
    description?: string
    /** The ways in, in switch order; each is `{ value, label, copy?, actions? }` and the first one opens. The switch renders only with two or more. */
    audiences?: ClosingCallToActionAgentsAudience[]
    /** Accessible name of the audience switch. */
    audiencesAriaLabel?: string
    /** Accessible name of the read-only field that shows an audience's copyable line. */
    lineAriaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    title: '',
    typedLead: '',
    typedWords: () => [],
    description: '',
    audiences: () => [],
    audiencesAriaLabel: '',
    lineAriaLabel: ''
  })

  const TYPE_DELAY = 90
  const HOLD_DELAY = 1800
  const ERASE_DELAY = 45
  const NEXT_DELAY = 270

  const attrs = useAttrs()

  const audience = ref(props.audiences[0]?.value ?? '')
  const word = ref('')

  let timer: ReturnType<typeof setTimeout> | undefined
  let index = 0
  let length = 0
  let erasing = false

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-closing-call-to-action-agents'
  )

  const current = computed(
    () => props.audiences.find((item) => item.value === audience.value) ?? props.audiences[0]
  )

  const options = computed(() =>
    props.audiences.map((item) => ({ value: item.value, label: item.label }))
  )

  const spoken = computed(() =>
    [props.typedLead, `${props.typedWords.join(', ')}.`].filter(Boolean).join(' ')
  )

  const schedule = (delay: number) => {
    timer = setTimeout(step, delay)
  }

  function step() {
    const target = props.typedWords[index % props.typedWords.length] ?? ''
    if (!erasing) {
      length += 1
      word.value = target.slice(0, length)
      if (length < target.length) return schedule(TYPE_DELAY)
      erasing = true
      return schedule(HOLD_DELAY)
    }
    length -= 1
    word.value = target.slice(0, length)
    if (length > 0) return schedule(ERASE_DELAY)
    erasing = false
    index += 1
    schedule(NEXT_DELAY)
  }

  onMounted(() => {
    if (props.typedWords.length === 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      word.value = props.typedWords.join(', ')
      return
    }
    schedule(TYPE_DELAY)
  })

  onScopeDispose(() => clearTimeout(timer))
</script>

<template>
  <div
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    class="scroll-mt-(--spacing-xxl)"
  >
    <template v-if="title">
      <SectionModule
        :divided="false"
        :padded="false"
      >
        <CallToAction
          framed
          kind="primary"
          :title="title"
        >
          <template #background>
            <TextureMaterial
              kind="pixelate"
              size="small"
              fade="bottom"
            />
          </template>
          <template #actions>
            <div
              class="flex w-[min(var(--container-xl),calc(100vw_-_var(--spacing-xxl)*3))] flex-col items-center gap-(--spacing-md)"
            >
              <SegmentedButton
                v-if="options.length > 1"
                v-model="audience"
                size="large"
                :aria-label="audiencesAriaLabel || undefined"
                :options="options"
              />
              <div
                v-if="current"
                aria-live="polite"
                class="w-full min-w-0"
              >
                <div
                  :key="current.value"
                  class="flex w-full min-w-0 animate-fade-in flex-col items-stretch justify-center gap-(--spacing-sm) motion-reduce:animate-none sm:items-center lg:flex-row"
                >
                  <div
                    v-if="current.copy"
                    class="w-full min-w-0 max-w-(--container-xs) lg:w-(--container-xs)"
                  >
                    <InputGroup size="large">
                      <input
                        readonly
                        :value="current.copy.text"
                        :aria-label="lineAriaLabel || undefined"
                        class="h-full min-w-0 flex-1 border-0 bg-(--bg-surface) px-(--spacing-md) text-label-code-sm text-(--text-default) outline-none"
                      />
                      <CopyButton
                        size="large"
                        :value="current.copy.text"
                        :aria-label="current.copy.label"
                      />
                    </InputGroup>
                  </div>
                  <Button
                    v-for="action in current.actions ?? []"
                    :key="action.label"
                    :label="action.label"
                    :href="action.href"
                    :kind="action.kind ?? 'outlined'"
                    size="large"
                    class="shrink-0"
                    :icon="action.trailing ? 'pi pi-chevron-right' : ''"
                    icon-position="trailing"
                    :animated="Boolean(action.trailing)"
                  />
                </div>
              </div>
              <p
                v-if="typedWords.length > 0 || description"
                class="m-0 max-w-(--container-md) text-center text-body-code-sm text-(--text-muted)"
              >
                <span
                  v-if="typedWords.length > 0"
                  class="block"
                >
                  <span class="sr-only">{{ spoken }}</span>
                  <span aria-hidden="true">
                    {{ typedLead }}
                    <span class="text-(--text-default)"
                      ><TransitionGroup
                        tag="span"
                        enter-from-class="-translate-x-1 opacity-0"
                        enter-active-class="transition-[translate,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                        ><span
                          v-for="(char, position) in Array.from(word)"
                          :key="position"
                          class="inline-block whitespace-pre"
                          >{{ char }}</span
                        ></TransitionGroup
                      ><span
                        class="ml-px inline-block h-4 w-1 animate-blink bg-(--accent) align-text-bottom motion-reduce:hidden"
                    /></span>
                  </span>
                </span>
                <span
                  v-if="description"
                  class="block"
                  >{{ description }}</span
                >
              </p>
            </div>
          </template>
        </CallToAction>
      </SectionModule>
      <FrameBox
        borders="none"
        marks="all"
        data-hatch="true"
        class="h-[calc(var(--spacing-xxl)*2)]"
      >
        <TextureMaterial kind="lines" />
      </FrameBox>
    </template>
  </div>
</template>
