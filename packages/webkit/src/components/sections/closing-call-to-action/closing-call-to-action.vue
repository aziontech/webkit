<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import CallToAction from '../../marketing/call-to-action/call-to-action.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import TextureMaterial from '../../marketing/texture-material/texture-material.vue'

  defineOptions({
    name: 'ClosingCallToAction',
    inheritAttrs: false
  })

  /** Layout of the band. */
  export type ClosingCallToActionKind = 'split' | 'panel' | 'primary'

  /** One call to action of the band. */
  export type ClosingCallToActionAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
  }

  interface Props {
    /** Layout of the band: `split` is a raised lead cell beside an aside cell over a tall closing frame, `panel` one surface over a short closing frame, `primary` a centred ask under a pixelated texture over a tall closing frame. */
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
    primaryAction?: ClosingCallToActionAction
    /** The outlined button of the band, in the aside cell in `split` and beside the primary one in `panel` and `primary`; `{ label, href, trailing? }`. Omitted when absent. */
    secondaryAction?: ClosingCallToActionAction
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'split',
    anchor: '',
    eyebrow: '',
    title: '',
    titleMuted: '',
    description: '',
    primaryAction: undefined,
    secondaryAction: undefined
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-closing-call-to-action'
  )

  const isSplit = computed(() => props.kind === 'split')

  const isPrimary = computed(() => props.kind === 'primary')

  const hasActions = computed(() =>
    Boolean(props.primaryAction || (!isSplit.value && props.secondaryAction))
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :data-kind="kind"
    class="group scroll-mt-(--spacing-xxl)"
  >
    <template v-if="title">
      <SectionModule
        :divided="false"
        :padded="false"
      >
        <CallToAction
          framed
          :kind="kind"
          :eyebrow="isPrimary ? '' : eyebrow"
          :title="title"
          :title-muted="isSplit ? titleMuted : ''"
          :description="description"
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
            <Button
              v-if="primaryAction"
              :label="primaryAction.label"
              :href="primaryAction.href"
              kind="secondary"
              size="large"
              :icon="primaryAction.trailing ? 'pi pi-chevron-right' : ''"
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
              :icon="secondaryAction.trailing ? 'pi pi-chevron-right' : ''"
              icon-position="trailing"
              :animated="Boolean(secondaryAction.trailing)"
            />
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
              :icon="secondaryAction.trailing ? 'pi pi-chevron-right' : ''"
              icon-position="trailing"
              :animated="Boolean(secondaryAction.trailing)"
            />
          </template>
        </CallToAction>
      </SectionModule>
      <FrameBox
        borders="none"
        marks="all"
        data-hatch="true"
        class="h-[calc(var(--spacing-xxl)*2)] group-data-[kind=panel]:h-(--spacing-xxl)"
      >
        <TextureMaterial kind="lines" />
      </FrameBox>
    </template>
  </div>
</template>
