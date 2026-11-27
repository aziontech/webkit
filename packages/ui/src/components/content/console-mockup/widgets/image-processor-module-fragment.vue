<script setup lang="ts">
  import Button from '../../../action/button/button.vue'
  import Tag from '../../tag/tag.vue'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupScrollFrames } from '../composables/use-mockup-scroll-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupScrollColumn from '../parts/mockup-scroll-column.vue'
  import ModuleSwitchCard from '../parts/module-switch-card.vue'

  defineOptions({ name: 'ImageProcessorModuleFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the list scrolls to Image Processor and switches it on while it is, and back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const MODULES = [
    {
      key: 'application-accelerator',
      title: 'Application Accelerator',
      subtitle: 'Optimize protocols and manage dynamic content delivery.',
      locked: false
    },
    {
      key: 'cache',
      title: 'Cache',
      subtitle: 'Customize advanced cache settings.',
      locked: true
    },
    {
      key: 'functions',
      title: 'Functions',
      subtitle: 'Build low-latency functions that run close to users.',
      locked: false
    },
    {
      key: 'image-processor',
      title: 'Image Processor',
      subtitle: 'Enable dynamic image editing options.',
      locked: false
    }
  ]

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    anchor: number
    enabled: boolean
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'functions', x: 5.2, y: 1.6 }
  const SWITCH: MockupCursorTarget = { key: 'image-processor', x: 0.6, y: 0.6 }

  const REST = { cursor: IDLE, press: false, anchor: 0, enabled: false }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, anchor: 1, forward: 200, back: 420 },
    { ...REST, anchor: 1, cursor: SWITCH, forward: 650, back: 420 },
    { ...REST, anchor: 1, cursor: SWITCH, press: true, forward: 520, back: 120 },
    { ...REST, anchor: 1, cursor: SWITCH, press: true, enabled: true, forward: 120, back: 160 },
    { ...REST, anchor: 1, cursor: SWITCH, enabled: true, forward: 160, back: 120 }
  ]

  const { frame, bindColumn } = useMockupScrollFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered,
    stepOnTouch: true
  })

  const enabled = (key: string) => key !== 'image-processor' || frame.value.enabled
</script>

<template>
  <MockupScrollColumn
    :ref="bindColumn"
    shell="legacy"
    class="[--console-mockup-fade-edge:20%] [--console-mockup-fade-start:74%]"
    column-class="flex flex-col gap-(--spacing-sm)"
    :active="active"
    :anchor="frame.anchor || null"
    :lead="150"
    observe
    :cursor="frame.cursor"
    cursor-name="Priya"
    :pressed="frame.press"
  >
    <span
      data-anchor
      class="text-label-md text-(--text-default)"
    >
      Default Modules
    </span>

    <ConsoleMockupShellItem
      v-for="(module, index) in MODULES"
      :key="module.key"
      :order="index"
      :data-anchor="module.key === 'image-processor' || undefined"
    >
      <ModuleSwitchCard
        :title="module.title"
        :description="module.subtitle"
        :checked="enabled(module.key)"
        :disabled="module.locked"
        :cursor-key="module.key"
      >
        <span
          v-if="module.locked"
          class="mt-(--spacing-xs) flex"
        >
          <Tag
            label="Automatically enabled in all accounts."
            icon="az az-lock"
            severity="neutral"
            size="small"
          />
        </span>
      </ModuleSwitchCard>
    </ConsoleMockupShellItem>

    <div class="flex flex-col gap-(--spacing-xs) pt-(--spacing-md)">
      <span class="text-label-md text-(--text-default)">Subscription modules</span>
      <span class="flex">
        <Button
          label="Contact sales"
          variant="outline"
          size="medium"
          icon="az az-shopping-cart"
        />
      </span>
    </div>
  </MockupScrollColumn>
</template>
