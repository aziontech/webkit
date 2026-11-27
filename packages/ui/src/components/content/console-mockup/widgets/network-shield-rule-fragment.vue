<script setup lang="ts">
  import Button from '../../../action/button/button.vue'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import { openAndPick, option } from '../lib/pick-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'
  import MockupSelect from '../parts/mockup-select.vue'

  defineOptions({ name: 'NetworkShieldRuleFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the rule's network list is picked from its list, qa-nl-ipcidr to qa-nl-countries, while it is, and back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const NETWORK_LISTS = ['qa-nl-ipcidr', 'qa-nl-countries', 'qa-nl-syntax', 'qa-p-nl-ip']

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    focused: boolean
    open: boolean
    highlight: number
    list: string
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'network-list', x: -0.2, y: 2.6 }
  const TRIGGER: MockupCursorTarget = { key: 'network-list', x: 0.4, y: 0.6 }

  const REST = {
    cursor: IDLE,
    press: false,
    focused: false,
    open: false,
    highlight: -1,
    list: NETWORK_LISTS[0]
  }

  const PICKED = { ...REST, list: NETWORK_LISTS[1] }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    ...openAndPick(
      REST,
      TRIGGER,
      [
        [0, 160, 300],
        [1, 460, 420]
      ],
      { list: NETWORK_LISTS[1] },
      [
        [120, 440],
        [560, 160]
      ]
    ),
    { ...PICKED, cursor: option(1), focused: true, forward: 200, back: 260 },
    { ...PICKED, cursor: TRIGGER, forward: 260, back: 160 }
  ]

  const { frame } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })
</script>

<template>
  <MockupFragment
    shell="legacy"
    class="[--console-mockup-fade-start:80%]"
    :active="active"
    :cursor="frame.cursor"
    cursor-name="Sam"
    :pressed="frame.press"
  >
    <div class="relative flex flex-col gap-(--spacing-md) py-(--spacing-xs)">
      <ConsoleMockupShellItem
        :order="0"
        :data-state="frame.open ? 'open' : 'closed'"
        class="relative data-[state=open]:z-1"
      >
        <div class="flex flex-col gap-(--spacing-sm)">
          <span class="flex items-center gap-(--spacing-sm)">
            <span class="text-body-sm text-(--text-default)">If</span>
            <span class="h-0 flex-1 border-t border-dashed border-(--border-default)" />
          </span>
          <span class="grid min-w-0 grid-cols-[4fr_4fr_5fr] gap-(--spacing-xs)">
            <MockupSelect
              value="Network"
              aria-label="Variable"
            >
              <template #leading>
                <span class="text-body-sm text-(--text-muted)">$</span>
              </template>
            </MockupSelect>
            <MockupSelect
              value="matches"
              aria-label="Operator"
            />
            <MockupSelect
              :value="frame.list"
              :options="NETWORK_LISTS"
              :open="frame.open"
              :highlighted-index="frame.highlight"
              :focused="frame.focused"
              data-cursor="network-list"
              aria-label="Network list"
            />
          </span>
        </div>
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem :order="1">
        <span class="flex gap-(--spacing-xs)">
          <Button
            label="And"
            variant="outline"
            size="small"
            icon="az az-circle-plus"
          />
          <Button
            label="Or"
            variant="outline"
            size="small"
            icon="az az-circle-plus"
          />
        </span>
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem :order="2">
        <div class="flex flex-col gap-(--spacing-sm)">
          <span class="flex items-center gap-(--spacing-sm)">
            <span class="text-body-sm text-(--text-default)">Then</span>
            <span class="h-0 flex-1 border-t border-dashed border-(--border-default)" />
          </span>
          <span class="grid min-w-0 grid-cols-2 gap-(--spacing-xs)">
            <MockupSelect
              value="Deny (403 Forbidden)"
              aria-label="Behavior"
            />
          </span>
        </div>
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem :order="3">
        <Button
          label="Add Behavior"
          variant="outline"
          size="small"
          icon="az az-circle-plus"
        />
      </ConsoleMockupShellItem>
    </div>
  </MockupFragment>
</template>
