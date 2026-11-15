<script setup lang="ts">
  import { computed, defineAsyncComponent, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import CallToAction from '../../marketing/call-to-action/call-to-action.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import type { SectionTitleAction } from '../../marketing/section-title/section-title.vue'
  import TextureMaterial from '../../marketing/texture-material/texture-material.vue'

  defineOptions({
    name: 'ClosingCallToAction',
    inheritAttrs: false
  })

  export type { SectionTitleAction }

  /** Layout of the band. */
  export type ClosingCallToActionKind = 'split' | 'panel' | 'primary' | 'frame'

  /** Visual weight of an audience action. */
  export type ClosingCallToActionAudienceActionKind = 'secondary' | 'outlined'

  /** One action of an audience. */
  export type ClosingCallToActionAudienceAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Visual weight: `secondary` is the white pill, `outlined` the quiet one; defaults to `outlined`. */
    kind?: ClosingCallToActionAudienceActionKind
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
  }

  /** The copyable line of an audience. */
  export type ClosingCallToActionAudienceCopy = {
    /** Accessible name of the copy button. */
    label: string
    /** Line shown in the read-only field and copied as is. */
    text: string
    /** Draws the `$` shell prompt before the line, so a command reads apart from a prompt meant for an agent. */
    shell?: boolean
  }

  /** One way in, picked by the audience switch. */
  export type ClosingCallToActionAudience = {
    /** Stable value of the audience in the switch. */
    value: string
    /** Visible label of the audience in the switch. */
    label: string
    /** Copyable line shown beside the actions. */
    copy?: ClosingCallToActionAudienceCopy
    /** The actions of the audience, in order. */
    actions?: ClosingCallToActionAudienceAction[]
  }

  export interface ClosingCallToActionProps {
    /** Layout of the band: `split` is a raised lead cell beside an aside cell over a tall closing frame, `panel` one surface over a short closing frame, `primary` a centred ask under a pixelated texture over a tall closing frame, `frame` the tall closing frame alone. */
    kind?: ClosingCallToActionKind
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Short overline above the headline; not drawn in `primary`. */
    eyebrow?: string
    /** Headline of the band, rendered by the call to action as its `h2`; the band renders nothing when empty. */
    title?: string
    /** Second line of the headline in muted ink; drawn in `split` only. */
    titleMuted?: string
    /** Supporting sentence: in the aside cell in `split`, under the headline in `panel`. */
    description?: string
    /** The white button of the band, under the headline in `split`; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent. */
    primaryAction?: SectionTitleAction
    /** The outlined button of the band, in the aside cell in `split` and beside the primary one in `panel` and `primary`; `{ label, href, trailing? }`. Omitted when absent. */
    secondaryAction?: SectionTitleAction
    /** Shell command on a copyable line before the actions, copied as written; drawn in `split`, `panel` and `primary`. */
    command?: string
    /** Draws the hatched closing frame under the band; turn it off when another closing band stacks directly below and draws the shared frame. */
    hatch?: boolean
    /** The ways in of the `primary` close, in switch order; each is `{ value, label, copy?, actions? }` (`copy` is `{ label, text, shell? }`, `shell` drawing the `$` prompt; an action is `{ label, href, kind?, trailing? }`) and the first one opens. Replaces the command and the two actions; the switch renders only with two or more. */
    audiences?: ClosingCallToActionAudience[]
    /** Fixed opening of the typed line under the audiences, before the typed word. */
    typedLead?: string
    /** Words typed, held, erased and typed again in order after `typedLead`; the typed line renders only with `audiences` and words. */
    typedWords?: string[]
    /** Accessible name of the audience switch. */
    audiencesAriaLabel?: string
    /** Accessible name of the read-only field that shows an audience's copyable line. */
    lineAriaLabel?: string
  }

  const props = withDefaults(defineProps<ClosingCallToActionProps>(), {
    kind: 'split',
    anchor: '',
    eyebrow: '',
    title: '',
    titleMuted: '',
    description: '',
    primaryAction: undefined,
    secondaryAction: undefined,
    command: '',
    hatch: true,
    audiences: () => [],
    typedLead: '',
    typedWords: () => [],
    audiencesAriaLabel: '',
    lineAriaLabel: ''
  })

  const SectionCommand = defineAsyncComponent(
    () => import('../section-command/section-command.vue')
  )

  const ClosingCallToActionAudiences = defineAsyncComponent(
    () => import('./closing-call-to-action-audiences/closing-call-to-action-audiences.vue')
  )

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-closing-call-to-action'
  )

  const isSplit = computed(() => props.kind === 'split')

  const isPrimary = computed(() => props.kind === 'primary')

  const isFrame = computed(() => props.kind === 'frame')

  const bandKind = computed(() => (props.kind === 'frame' ? 'split' : props.kind))

  const hasAudiences = computed(() => isPrimary.value && props.audiences.length > 0)

  const hasActions = computed(() =>
    Boolean(
      hasAudiences.value ||
      props.command ||
      props.primaryAction ||
      (!isSplit.value && props.secondaryAction)
    )
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :data-kind="kind"
    class="group scroll-mt-(--spacing-2xl)"
  >
    <template v-if="title && !isFrame">
      <SectionModule
        :divided="false"
        :padded="false"
      >
        <CallToAction
          framed
          :kind="bandKind"
          :eyebrow="isPrimary ? '' : eyebrow"
          :title="title"
          :title-muted="isSplit ? titleMuted : ''"
          :description="hasAudiences ? '' : description"
        >
          <template
            v-if="isPrimary"
            #background
          >
            <TextureMaterial
              kind="pixelate"
              size="small"
              fade="bottom"
            />
          </template>
          <template
            v-if="hasActions"
            #actions
          >
            <ClosingCallToActionAudiences
              v-if="hasAudiences"
              :audiences="audiences"
              :typed-lead="typedLead"
              :typed-words="typedWords"
              :description="description"
              :audiences-aria-label="audiencesAriaLabel"
              :line-aria-label="lineAriaLabel"
            />
            <template v-else>
              <SectionCommand
                v-if="command"
                :value="command"
              />
              <Button
                v-if="primaryAction"
                :label="primaryAction.label"
                :href="primaryAction.href"
                kind="secondary"
                size="large"
                :icon="primaryAction.trailing ? 'ai ai-chevron-right' : ''"
                icon-position="trailing"
                :animated="Boolean(primaryAction.trailing)"
              />
              <Button
                key="button-2"
                v-if="!isSplit && secondaryAction"
                :label="secondaryAction.label"
                :href="secondaryAction.href"
                kind="outlined"
                size="large"
                :icon="secondaryAction.trailing ? 'ai ai-chevron-right' : ''"
                icon-position="trailing"
                :animated="Boolean(secondaryAction.trailing)"
              />
            </template>
          </template>
          <template
            v-if="isSplit && secondaryAction"
            #aside
          >
            <Button
              :label="secondaryAction.label"
              :href="secondaryAction.href"
              kind="outlined"
              size="large"
              :icon="secondaryAction.trailing ? 'ai ai-chevron-right' : ''"
              icon-position="trailing"
              :animated="Boolean(secondaryAction.trailing)"
            />
          </template>
        </CallToAction>
      </SectionModule>
    </template>
    <FrameBox
      v-if="isFrame || (title && hatch)"
      borders="none"
      marks="all"
      data-hatch="true"
      class="h-[calc(var(--spacing-2xl)*2)] group-data-[kind=panel]:h-(--spacing-2xl)"
    >
      <TextureMaterial kind="lines" />
    </FrameBox>
  </div>
</template>
