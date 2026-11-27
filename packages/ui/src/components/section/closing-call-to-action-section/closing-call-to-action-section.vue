<script setup lang="ts">
  import { computed, defineAsyncComponent, useAttrs } from 'vue'

  import Button from '../../action/button/button.vue'
  import Texture from '../../content/texture/texture.vue'
  import Module from '../../layout/module/module.vue'
  import type { ModuleHeaderAction } from '../../layout/module-header/module-header.vue'
  import CallToAction from '../../marketing/call-to-action/call-to-action.vue'
  import SectionHatch from '../parts/section-hatch.vue'

  defineOptions({
    name: 'ClosingCallToActionSection',
    inheritAttrs: false
  })

  export type { ModuleHeaderAction }

  /** Layout of the band. */
  export type ClosingCallToActionSectionVariant = 'panel' | 'primary' | 'frame'

  /** Visual weight of an audience action. */
  export type ClosingCallToActionSectionAudienceActionVariant = 'secondary' | 'outline'

  /** One action of an audience. */
  export type ClosingCallToActionSectionAudienceAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Visual weight: `secondary` is the white pill, `outline` the quiet one; defaults to `outline`. */
    variant?: ClosingCallToActionSectionAudienceActionVariant
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
  }

  /** The copyable line of an audience. */
  export type ClosingCallToActionSectionAudienceCopy = {
    /** Accessible name of the copy button. */
    label: string
    /** Line shown in the read-only field and copied as is. */
    text: string
    /** Draws the `$` shell prompt before the line, so a command reads apart from a prompt meant for an agent. */
    shell?: boolean
  }

  /** One way in, picked by the audience switch. */
  export type ClosingCallToActionSectionAudience = {
    /** Stable value of the audience in the switch. */
    value: string
    /** Visible label of the audience in the switch. */
    label: string
    /** Copyable line shown beside the actions. */
    copy?: ClosingCallToActionSectionAudienceCopy
    /** The actions of the audience, in order. */
    actions?: ClosingCallToActionSectionAudienceAction[]
  }

  export interface ClosingCallToActionSectionProps {
    /** Layout of the band: `panel` is one surface over a short closing frame, `primary` a centred ask under a pixelated texture over a tall closing frame, `frame` the tall closing frame alone. */
    variant?: ClosingCallToActionSectionVariant
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Short overline above the headline; not drawn in `primary`. */
    eyebrow?: string
    /** Headline of the band, rendered by the call to action as its `h2`; the band renders nothing when empty. */
    title?: string
    /** Supporting sentence under the headline. */
    description?: string
    /** The white button of the band, under the headline; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent. */
    primaryAction?: ModuleHeaderAction
    /** The outlined button of the band, beside the primary one; `{ label, href, trailing? }`. Omitted when absent. */
    secondaryAction?: ModuleHeaderAction
    /** Shell command on a copyable line before the actions, copied as written; drawn in `panel` and `primary`. */
    command?: string
    /** Draws the hatched closing frame under the band; turn it off when another closing band stacks directly below and draws the shared frame. */
    hatch?: boolean
    /**
     * The ways in of the `primary` close, in switch order; each is `{ value, label, copy?, actions? }`
     * (`copy` is `{ label, text, shell? }`, `shell` drawing the `$` prompt; an action is `{ label, href,
     * variant?, trailing? }`) and the first one opens. Replaces the command and the two actions; the
     * switch renders only with two or more.
     */
    audiences?: ClosingCallToActionSectionAudience[]
    /** Fixed opening of the typed line under the audiences, before the typed word. */
    typedLead?: string
    /** Words typed, held, erased and typed again in order after `typedLead`; the typed line renders only with `audiences` and words. */
    typedWords?: string[]
    /** Accessible name of the audience switch. */
    audiencesAriaLabel?: string
    /** Accessible name of the read-only field that shows an audience's copyable line. */
    lineAriaLabel?: string
  }

  const props = withDefaults(defineProps<ClosingCallToActionSectionProps>(), {
    variant: 'panel',
    anchor: '',
    eyebrow: '',
    title: '',
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

  const CopyCommandSection = defineAsyncComponent(
    () => import('../copy-command-section/copy-command-section.vue')
  )

  const ClosingCallToActionSectionAudiences = defineAsyncComponent(
    () => import('./parts/closing-call-to-action-section-audiences.vue')
  )

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'closing-call-to-action-section'
  )

  const isPrimary = computed(() => props.variant === 'primary')

  const isFrame = computed(() => props.variant === 'frame')

  const bandKind = computed(() => (isPrimary.value ? 'primary' : 'panel'))

  const hasAudiences = computed(() => isPrimary.value && props.audiences.length > 0)

  const hasActions = computed(() =>
    Boolean(hasAudiences.value || props.command || props.primaryAction || props.secondaryAction)
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :data-variant="variant"
    class="group scroll-mt-(--spacing-2xl)"
  >
    <template v-if="title && !isFrame">
      <Module
        :divided="false"
        :padded="false"
      >
        <CallToAction
          framed
          :variant="bandKind"
          :eyebrow="isPrimary ? '' : eyebrow"
          :title="title"
          :description="hasAudiences ? '' : description"
        >
          <template
            v-if="isPrimary"
            #background
          >
            <Texture
              variant="pixelate"
              size="small"
              fade="bottom"
            />
          </template>
          <template
            v-if="hasActions"
            #actions
          >
            <ClosingCallToActionSectionAudiences
              v-if="hasAudiences"
              :audiences="audiences"
              :typed-lead="typedLead"
              :typed-words="typedWords"
              :description="description"
              :audiences-aria-label="audiencesAriaLabel"
              :line-aria-label="lineAriaLabel"
            />
            <template v-else>
              <CopyCommandSection
                v-if="command"
                :value="command"
              />
              <Button
                v-if="primaryAction"
                :label="primaryAction.label"
                :href="primaryAction.href"
                variant="secondary"
                size="large"
                :icon="primaryAction.trailing ? 'az az-chevron-right' : ''"
                icon-position="trailing"
                :animated="Boolean(primaryAction.trailing)"
              />
              <Button
                key="button-2"
                v-if="secondaryAction"
                :label="secondaryAction.label"
                :href="secondaryAction.href"
                variant="outline"
                size="large"
                :icon="secondaryAction.trailing ? 'az az-chevron-right' : ''"
                icon-position="trailing"
                :animated="Boolean(secondaryAction.trailing)"
              />
            </template>
          </template>
        </CallToAction>
      </Module>
    </template>
    <SectionHatch
      v-if="isFrame || (title && hatch)"
      class="group-data-[variant=panel]:h-(--spacing-2xl)"
    />
  </div>
</template>
