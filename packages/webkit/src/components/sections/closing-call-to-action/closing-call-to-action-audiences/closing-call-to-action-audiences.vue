<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, ref, useAttrs } from 'vue'

  import { PASSWORD_MANAGER_IGNORE } from '../../../../utils/autofill'
  import Button from '../../../actions/button/button.vue'
  import CopyButton from '../../../actions/copy-button/copy-button.vue'
  import ToggleGroup from '../../../actions/toggle-group/toggle-group.vue'
  import InputGroup from '../../../inputs/input-group/input-group.vue'
  import InputGroupAddon from '../../../inputs/input-group/input-group-addon/input-group-addon.vue'
  import type { ClosingCallToActionAudience } from '../closing-call-to-action.vue'

  defineOptions({
    name: 'ClosingCallToActionAudiences',
    inheritAttrs: false
  })

  interface Props {
    /** Fixed opening of the typed line, before the typed word. */
    typedLead?: string
    /** Words typed, held, erased and typed again in order after `typedLead`. */
    typedWords?: string[]
    /** Closing sentence under the typed line, the same for every audience. */
    description?: string
    /** The ways in, in switch order; the first one opens. */
    audiences?: ClosingCallToActionAudience[]
    /** Accessible name of the audience switch. */
    audiencesAriaLabel?: string
    /** Accessible name of the read-only field that shows an audience's copyable line. */
    lineAriaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
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
    () =>
      (attrs['data-testid'] as string | undefined) ?? 'sections-closing-call-to-action-audiences'
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
    :data-testid="testId"
    class="flex w-[min(var(--container-xl),calc(100vw_-_var(--spacing-2xl)*3))] flex-col items-center gap-(--spacing-md)"
  >
    <ToggleGroup
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
            <InputGroupAddon
              v-if="current.copy.shell"
              aria-hidden="true"
              >$</InputGroupAddon
            >
            <input
              readonly
              v-bind="PASSWORD_MANAGER_IGNORE"
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
          :variant="action.variant ?? 'outline'"
          size="large"
          class="shrink-0"
          :icon="action.trailing ? 'ai ai-chevron-right' : ''"
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
              class="ms-px inline-block h-4 w-1 animate-blink bg-(--accent) align-text-bottom motion-reduce:hidden"
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
