<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import FieldText from '@aziontech/webkit/field-text'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import type { TickerItem } from '@aziontech/webkit/ticker'
  import Ticker from '@aziontech/webkit/ticker'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref } from 'vue'

  import { useTypedWords } from '../../composables/use-typed-words'
  import SectionAction from './SectionAction.vue'
  import SectionCommand from './SectionCommand.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'ClosingCallToAction' })

  /** split: the lead and aside actions side by side; panel: one centred ask; newsletter: the split band with a subscribe form; primary: a centred ask on the canvas lit by a pixelated primary wave, with a benefits strip; agents: the primary layout with a switch between the human and the agent way in, a copyable line and a typed sentence; frame: the closing frame alone. */
  export type ClosingCallToActionKind =
    'split' | 'panel' | 'newsletter' | 'primary' | 'agents' | 'frame'

  export interface ClosingCallToActionAudience {
    /** Stable key of the audience. */
    value: string
    /** Label of the audience in the switch. */
    label: string
    /** Shell command shown on a copyable line, copied as written. */
    command?: string
    /** Prompt for the visitor's agent, shown on the same copyable line without the shell prompt; ignored when a command is set. */
    prompt?: string
    /** Actions beside the command. */
    actions?: SiteAction[]
  }

  export interface ClosingCallToActionForm {
    /** Label of the email field. */
    label: string
    /** Placeholder of the email field. */
    placeholder: string
    /** Label of the submit action. */
    submit: string
    /** Toast once the address is in. */
    success: string
    /** Message when the field is left empty. */
    required: string
    /** Message when the address is malformed. */
    invalid: string
  }

  interface Props {
    /** Id of the band, for in-page contact links; empty drops it, so a page can carry several closings. */
    anchor?: string
    /** Layout of the closing band. */
    kind?: ClosingCallToActionKind
    /** Draw the hatched field under the band; off when another band stacks directly below and shares its rule. */
    hatch?: boolean
    /** Overline above the title; the primary and agents layouts leave it out. */
    eyebrow?: string
    /** The closing ask. */
    title?: string
    /** Second line of the title, in the muted ink. */
    titleMuted?: string
    /** One sentence under the title. */
    description?: string
    /** Actions in the lead cell. */
    actions?: SiteAction[]
    /** Shell command on a copyable line above the actions of the split, panel and primary layouts, copied as written. */
    command?: string
    /** Action in the aside cell of the split layout. */
    aside?: SiteAction | null
    /** Copy of the subscribe form, for the newsletter layout. */
    form?: ClosingCallToActionForm | null
    /** Claims the primary layout runs along its floor, each with an optional leading icon class. */
    benefits?: TickerItem[]
    /** Accessible name of the benefits strip. */
    benefitsLabel?: string
    /** The ways in the agents layout switches between; the first one opens. */
    audiences?: ClosingCallToActionAudience[]
    /** Accessible name of the audience switch. */
    audiencesLabel?: string
    /** Text before the typed word in the agents layout, such as a lead-in that ends on the word. */
    typedLead?: string
    /** Words the agents layout types, erases and types again, in order. */
    typedWords?: string[]
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: 'contact',
    kind: 'split',
    hatch: true,
    eyebrow: '',
    title: '',
    titleMuted: '',
    description: '',
    actions: () => [],
    command: '',
    aside: null,
    form: null,
    benefits: () => [],
    benefitsLabel: '',
    audiences: () => [],
    audiencesLabel: 'Audience',
    typedLead: '',
    typedWords: () => []
  })

  const callToActionKind = computed(() =>
    props.kind === 'panel'
      ? 'panel'
      : props.kind === 'primary' || props.kind === 'agents'
        ? 'primary'
        : 'split'
  )

  const audienceValue = ref(props.audiences[0]?.value ?? '')

  const audienceOptions = computed(() =>
    props.audiences.map(({ value, label }) => ({ value, label }))
  )

  const audience = computed(
    () => props.audiences.find(({ value }) => value === audienceValue.value) ?? props.audiences[0]
  )

  const { text: typedText } = useTypedWords(() => props.typedWords)

  const typedChars = computed(() => Array.from(typedText.value))

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const email = ref('')
  const error = ref('')
  const sending = ref(false)

  async function subscribe() {
    if (sending.value || !props.form) return
    const value = email.value.trim()
    if (!value) return (error.value = props.form.required)
    if (!EMAIL.test(value)) return (error.value = props.form.invalid)
    error.value = ''
    sending.value = true
    await new Promise((resolve) => globalThis.setTimeout(resolve, 600))
    sending.value = false
    email.value = ''
    toast.success(props.form.success)
  }
</script>

<template>
  <SectionModule
    v-if="kind !== 'frame'"
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
    class="scroll-mt-(--spacing-xxl)"
  >
    <CallToAction
      framed
      :kind="callToActionKind"
      :eyebrow="eyebrow"
      :title="title"
      :title-muted="titleMuted"
      :description="kind === 'agents' ? '' : description"
    >
      <template #actions>
        <div
          v-if="kind === 'agents' && audience"
          style="width: min(var(--container-xl), calc(100vw - var(--spacing-xxl) * 3))"
          class="flex flex-col items-center gap-(--spacing-md)"
        >
          <SegmentedButton
            v-model="audienceValue"
            :options="audienceOptions"
            :aria-label="audiencesLabel"
            size="large"
          />
          <div
            aria-live="polite"
            class="w-full min-w-0"
          >
            <div
              :key="audience.value"
              class="flex w-full min-w-0 animate-fade-in flex-col items-stretch justify-center gap-(--spacing-sm) motion-reduce:animate-none sm:items-center lg:flex-row"
            >
              <SectionCommand
                v-if="audience.command || audience.prompt"
                :value="audience.command || audience.prompt || ''"
                :shell="Boolean(audience.command)"
              />
              <SectionAction
                v-for="action in audience.actions"
                :key="action.label"
                :action="action"
                class="shrink-0"
              />
            </div>
          </div>
          <p
            v-if="typedWords.length || description"
            class="m-0 max-w-(--container-md) text-center text-body-code-sm text-(--text-muted)"
          >
            <span
              v-if="typedWords.length"
              class="block"
            >
              <span class="sr-only">{{ typedLead }} {{ typedWords.join(', ') }}.</span>
              <span aria-hidden="true">
                {{ typedLead }}
                <span class="text-(--text-default)">
                  <TransitionGroup
                    tag="span"
                    enter-from-class="-translate-x-1 opacity-0"
                    enter-active-class="transition-[translate,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                  >
                    <span
                      v-for="(char, index) in typedChars"
                      :key="index"
                      class="inline-block whitespace-pre"
                      >{{ char }}</span
                    > </TransitionGroup
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
        <div v-else-if="kind === 'newsletter' && form">
          <form
            novalidate
            class="flex w-full flex-col gap-(--spacing-sm) sm:w-(--container-md) sm:max-w-full sm:flex-row sm:items-start"
            @submit.prevent="subscribe"
          >
            <FieldText
              v-model="email"
              :label="form.label"
              size="large"
              type="email"
              autocomplete="email"
              :placeholder="form.placeholder"
              :invalid="Boolean(error)"
              :helper-text="error"
              :disabled="sending"
              class="min-w-0 flex-1"
              @update:model-value="error = ''"
            />
            <Button
              :label="form.submit"
              kind="secondary"
              size="large"
              :loading="sending"
              class="sm:mt-(--spacing-lg)"
              @click="subscribe"
            />
          </form>
        </div>
        <template v-else>
          <SectionCommand
            v-if="command"
            :value="command"
          />
          <SectionAction
            v-for="action in actions"
            :key="action.label"
            :action="action"
          />
        </template>
      </template>
      <template
        v-if="kind === 'primary' || kind === 'agents'"
        #background
      >
        <TextureMaterial
          kind="pixelate"
          size="small"
          fade="bottom"
        />
      </template>
      <template
        v-if="kind === 'primary' && benefits.length"
        #bottom
      >
        <Ticker
          :items="benefits"
          :aria-label="benefitsLabel"
        />
      </template>
      <template
        v-if="kind === 'split' && aside"
        #aside
      >
        <SectionAction :action="{ kind: 'outlined', trailing: true, ...aside }" />
      </template>
    </CallToAction>
  </SectionModule>
  <FrameBox
    v-if="hatch || kind === 'frame'"
    borders="none"
    marks="all"
    data-hatch="true"
    :data-size="kind === 'panel' ? 'small' : 'large'"
    class="h-[calc(var(--spacing-xxl)*2)] data-[size=small]:h-(--spacing-xxl)"
  >
    <TextureMaterial kind="lines" />
  </FrameBox>
</template>
