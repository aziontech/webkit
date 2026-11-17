<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, ref, useAttrs, watch } from 'vue'

  import { useMediaQuery } from '../../../../composables/use-media-query'
  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import { PASSWORD_MANAGER_IGNORE } from '../../../../utils/autofill'
  import Button from '../../../action/button/button.vue'
  import CopyButton from '../../../action/copy-button/copy-button.vue'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import ToggleGroup from '../../../action/toggle-group/toggle-group.vue'
  import InputGroup from '../../../input/input-group/input-group.vue'
  import InputGroupAddon from '../../../input/input-group/input-group-addon/input-group-addon.vue'
  import type { ClosingCallToActionSectionAudience } from '../closing-call-to-action-section.vue'

  defineOptions({
    name: 'ClosingCallToActionSectionAudiences',
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
    audiences?: ClosingCallToActionSectionAudience[]
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
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const { t } = useTranslate({ common: en.common })

  const audience = ref(props.audiences[0]?.value ?? '')
  const word = ref('')

  let timer: ReturnType<typeof setTimeout> | undefined
  let index = 0
  let length = 0
  let erasing = false

  const mounted = ref(false)
  const chosenPaused = ref<boolean | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'closing-call-to-action-section-audiences'
  )

  const current = computed(
    () => props.audiences.find((item) => item.value === audience.value) ?? props.audiences[0]
  )

  const options = computed(() =>
    props.audiences.map((item) => ({ value: item.value, label: item.label }))
  )

  const paused = computed(() => chosenPaused.value ?? reduced.value)
  const pauseLabel = computed(() =>
    paused.value ? t('common.playAnimation') : t('common.pauseAnimation')
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

  const halt = () => {
    clearTimeout(timer)
    timer = undefined
  }

  const sync = () => {
    if (!mounted.value || props.typedWords.length === 0) return
    halt()
    if (paused.value) {
      word.value = props.typedWords.join(', ')
      return
    }
    index = 0
    length = 0
    erasing = false
    word.value = ''
    schedule(TYPE_DELAY)
  }

  const onPauseToggle = () => {
    chosenPaused.value = !paused.value
  }

  onMounted(() => {
    mounted.value = true
    sync()
  })

  watch(paused, sync)

  onScopeDispose(halt)
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
          :icon="action.trailing ? 'az az-chevron-right' : ''"
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
          <span
            v-if="paused"
            class="text-(--text-default)"
            >{{ word }}</span
          >
          <span
            v-else
            class="text-(--text-default)"
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
    <IconButton
      v-if="typedWords.length > 0"
      :data-testid="`${testId}__pause`"
      :icon="paused ? 'az az-play' : 'az az-pause'"
      :aria-label="pauseLabel"
      variant="outline"
      size="small"
      @click="onPauseToggle"
    />
  </div>
</template>
