<script setup lang="ts">
  import { computed } from 'vue'

  import Button from '../../../action/button/button.vue'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'

  defineOptions({ name: 'LoadBalancerOriginsFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; Add Address is pressed and a new address joins the list while it is, and leaves after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const ADDRESSES = [
    { address: 'origin-aws.example.com', role: 'primary', weight: 2 },
    { address: '203.0.113.20', role: 'backup', weight: 1 }
  ]

  const ADDED = { address: 'example.com', role: 'primary', weight: 1 }

  interface Frame {
    pressed: boolean
    added: boolean
    forward: number
    back: number
  }

  const FRAMES: Frame[] = [
    { pressed: false, added: false, forward: 0, back: 0 },
    { pressed: true, added: false, forward: 320, back: 0 },
    { pressed: true, added: true, forward: 260, back: 120 },
    { pressed: false, added: true, forward: 360, back: 360 }
  ]

  const { frame, goingBack } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered,
    stepOnTouch: true
  })
  const pressed = computed(() => frame.value.pressed && !goingBack.value)

  const meta = (row: { role: string; weight: number }) => [
    { label: 'HTTP Port:', value: '80' },
    { label: 'HTTPS Port:', value: '443' },
    { label: 'Server Role:', value: row.role },
    { label: 'Weight:', value: String(row.weight) }
  ]

  const BUTTON_RING_CLASS =
    'inline-flex rounded-(--shape-button) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance ' +
    'data-pressed:ring-2 data-pressed:ring-offset-2 ' +
    'motion-reduce:transition-none'
</script>

<template>
  <MockupFragment
    shell="legacy"
    class="[--console-mockup-fade-start:80%]"
    :active="active"
  >
    <div class="flex flex-col gap-(--spacing-md) py-(--spacing-xs)">
      <div class="flex flex-col">
        <div class="flex flex-col gap-(--spacing-xs)">
          <ConsoleMockupShellItem
            v-for="(row, index) in ADDRESSES"
            :key="row.address"
            :order="index"
          >
            <div
              class="flex items-center gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
            >
              <i
                class="az az-chevron-right shrink-0 text-body-xs leading-none text-(--text-muted) rtl:-scale-x-100"
                aria-hidden="true"
              />
              <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs)">
                <span class="truncate text-body-sm text-(--text-default)">{{ row.address }}</span>
                <span class="flex flex-wrap gap-x-(--spacing-xs)">
                  <span
                    v-for="pair in meta(row)"
                    :key="pair.label"
                    class="flex gap-(--spacing-2xs)"
                  >
                    <span class="text-body-xs text-(--text-muted)">{{ pair.label }}</span>
                    <span class="text-label-sm text-(--text-default)">{{ pair.value }}</span>
                  </span>
                </span>
              </span>
              <IconButton
                icon="az az-trash"
                variant="outline"
                size="small"
                ariaLabel="Remove address"
              />
            </div>
          </ConsoleMockupShellItem>
        </div>

        <Transition
          enter-from-class="-translate-y-1 opacity-0"
          enter-active-class="transition-[opacity,translate] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
          leave-to-class="-translate-y-1 opacity-0"
          leave-active-class="transition-[opacity,translate] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
        >
          <div
            v-if="frame.added"
            class="overflow-hidden [interpolate-size:allow-keywords]"
          >
            <div class="pt-(--spacing-xs)">
              <div
                class="flex items-center gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
              >
                <i
                  class="az az-chevron-down shrink-0 text-body-xs leading-none text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs)">
                  <span class="truncate text-body-sm text-(--text-default)">
                    {{ ADDED.address }}
                  </span>
                  <span class="flex flex-wrap gap-x-(--spacing-xs)">
                    <span
                      v-for="pair in meta(ADDED)"
                      :key="pair.label"
                      class="flex gap-(--spacing-2xs)"
                    >
                      <span class="text-body-xs text-(--text-muted)">{{ pair.label }}</span>
                      <span class="text-label-sm text-(--text-default)">{{ pair.value }}</span>
                    </span>
                  </span>
                </span>
                <IconButton
                  icon="az az-trash"
                  variant="outline"
                  size="small"
                  ariaLabel="Remove address"
                />
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <ConsoleMockupShellItem :order="2">
        <span class="flex">
          <span
            :data-pressed="pressed || null"
            :class="BUTTON_RING_CLASS"
          >
            <Button
              label="Add Address"
              variant="outline"
              size="small"
              icon="az az-circle-plus"
            />
          </span>
        </span>
      </ConsoleMockupShellItem>
    </div>
  </MockupFragment>
</template>
