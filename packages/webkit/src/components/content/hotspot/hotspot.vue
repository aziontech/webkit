<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import Popover from '../../overlay/popover/popover.vue'
  import PopoverClose from '../../overlay/popover/popover-close/popover-close.vue'
  import PopoverContent from '../../overlay/popover/popover-content/popover-content.vue'
  import PopoverDescription from '../../overlay/popover/popover-description/popover-description.vue'
  import PopoverFooter from '../../overlay/popover/popover-footer/popover-footer.vue'
  import PopoverHeader from '../../overlay/popover/popover-header/popover-header.vue'
  import PopoverTitle from '../../overlay/popover/popover-title/popover-title.vue'
  import PopoverTrigger from '../../overlay/popover/popover-trigger/popover-trigger.vue'
  import { useOptionalTutorialContext } from '../tutorial-panel/composables/use-tutorial-context'

  defineOptions({
    name: 'Hotspot',
    inheritAttrs: false
  })

  interface Props {
    /** Matches the `hotspotId` of a tutorial step; the marker shows while that step's tutorial runs. */
    hotspotId: string
    /** Which side of the wrapped control the marker sits on, in reading direction. */
    side?: 'start' | 'end'
  }

  const props = withDefaults(defineProps<Props>(), {
    side: 'end'
  })

  defineSlots<{
    /** The real control the step is about. */
    default?(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ hotspot: en.hotspot })
  const context = useOptionalTutorialContext()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-hotspot'
  )

  const entry = computed(() => {
    if (!context || !context.active.value || context.finished.value) return null
    return context.steps.value.find((item) => item.hotspotId === props.hotspotId) ?? null
  })

  const total = computed<number>(() => context?.steps.value.length ?? 0)
  const isCurrent = computed<boolean>(
    () => entry.value !== null && context?.step.value === entry.value.index
  )
  const isOpen = computed<boolean>(() => isCurrent.value && !context?.dismissed.value)
  const isLast = computed<boolean>(
    () => entry.value !== null && entry.value.index === total.value - 1
  )
  const taskTitle = computed<string>(() => {
    if (!entry.value) return ''
    return context?.active.value?.tasks[entry.value.taskIndex]?.title ?? ''
  })

  const marker = ref<globalThis.HTMLElement | null>(null)
  const body = ref<globalThis.HTMLElement | null>(null)

  const setOpen = (value: boolean) => {
    if (!context || !entry.value) return
    if (value) context.goTo(entry.value.index)
    else if (isCurrent.value) context.dismiss()
  }

  const reveal = async () => {
    await nextTick()
    const reduce = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    marker.value?.scrollIntoView?.({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' })
    body.value?.closest<globalThis.HTMLElement>('[role="dialog"]')?.focus({ preventScroll: true })
  }

  watch(
    () => context?.focusRequest.value,
    () => {
      if (isOpen.value) reveal()
    },
    { flush: 'post' }
  )

  onMounted(() => context?.registerHotspot(props.hotspotId))
  onBeforeUnmount(() => context?.unregisterHotspot(props.hotspotId))
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    :data-side="side"
    :data-active="entry ? true : null"
    :data-current="isCurrent || null"
    class="group/hotspot inline-flex max-w-full items-center gap-(--spacing-xxs) data-[side=start]:flex-row-reverse"
  >
    <slot />
    <Popover
      v-if="entry"
      :open="isOpen"
      placement="auto"
      width="small"
      :offset="8"
      :data-testid="`${testId}__popover`"
      @update:open="setOpen"
    >
      <PopoverTrigger :data-testid="`${testId}__trigger`">
        <button
          ref="marker"
          type="button"
          :aria-label="t('hotspot.label', { title: entry.title })"
          :data-testid="`${testId}__marker`"
          :data-current="isCurrent || null"
          class="relative inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-(--radius-full) outline-none before:absolute before:-inset-2 before:content-[''] focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
        >
          <span
            v-if="isOpen"
            aria-hidden="true"
            class="absolute inset-0 rounded-(--radius-full) bg-(--primary) opacity-40 animate-ping motion-reduce:animate-none"
          />
          <span
            aria-hidden="true"
            class="relative size-3 rounded-(--radius-full) border-2 border-(--primary) bg-(--bg-surface) transition-colors duration-fast-02 ease-productive-entrance group-data-[current]/hotspot:bg-(--primary) motion-reduce:transition-none"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div
          ref="body"
          :data-testid="`${testId}__step`"
          class="flex flex-col"
        >
          <PopoverHeader>
            <PopoverTitle>{{ entry.title }}</PopoverTitle>
            <PopoverDescription>
              {{ t('hotspot.stepOf', { current: entry.index + 1, total }) }}
              <template v-if="taskTitle">· {{ taskTitle }}</template>
            </PopoverDescription>
            <PopoverClose :data-testid="`${testId}__dismiss`" />
          </PopoverHeader>
          <p class="px-(--spacing-md) py-(--spacing-sm) text-body-sm text-(--text-default)">
            {{ entry.content }}
          </p>
          <PopoverFooter>
            <Button
              v-if="entry.index > 0"
              :label="t('hotspot.previous')"
              kind="outlined"
              size="small"
              :data-testid="`${testId}__previous`"
              @click="context?.previous()"
            />
            <Button
              :label="isLast ? t('hotspot.finish') : t('hotspot.next')"
              kind="primary"
              size="small"
              :data-testid="`${testId}__next`"
              @click="context?.next()"
            />
          </PopoverFooter>
        </div>
      </PopoverContent>
    </Popover>
  </span>
</template>
