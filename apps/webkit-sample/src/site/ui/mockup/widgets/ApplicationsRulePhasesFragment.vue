<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../MockupCursor.vue'
  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'ApplicationsRulePhasesFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the request phase is collapsed so the response rules rise into view while it is, and reopened after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const PHASES = [
    {
      value: 'request',
      label: 'Request',
      rules: [
        { name: 'Maintenance page', status: 'Inactive' },
        { name: 'Redirect www', status: 'Active' },
        { name: 'API gateway', status: 'Active' },
        { name: 'Docs rewrite', status: 'Active' },
        { name: 'Add remote port header', status: 'Active' }
      ]
    },
    {
      value: 'response',
      label: 'Response',
      rules: [
        { name: 'Cache bypass', status: 'Active' },
        { name: 'Security headers', status: 'Active' },
        { name: 'Compress assets', status: 'Inactive' }
      ]
    }
  ]

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    open: string[]
    forward: number
    back: number
  }

  const BOTH = ['request', 'response']
  const RESPONSE_ONLY = ['response']

  const IDLE: MockupCursorTarget = { key: 'request', x: 0.62, y: 1.9 }
  const TRIGGER: MockupCursorTarget = { key: 'request', x: 0.3, y: 0.55 }

  const FRAMES: Frame[] = [
    { cursor: IDLE, press: false, open: BOTH, forward: 0, back: 0 },
    { cursor: TRIGGER, press: false, open: BOTH, forward: 160, back: 420 },
    { cursor: TRIGGER, press: true, open: BOTH, forward: 520, back: 160 },
    { cursor: TRIGGER, press: true, open: RESPONSE_ONLY, forward: 120, back: 260 },
    { cursor: TRIGGER, press: false, open: RESPONSE_ONLY, forward: 160, back: 220 }
  ]

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(0)
  const frame = computed(() => FRAMES[step.value])

  const stage = ref<globalThis.HTMLElement | null>(null)

  const { position } = useMockupCursor(stage, () => frame.value.cursor)

  let timer: ReturnType<typeof globalThis.setTimeout> | null = null

  const halt = () => {
    if (timer) globalThis.clearTimeout(timer)
    timer = null
  }

  const advance = () => {
    halt()
    const target = wanted() ? LAST : 0
    if (step.value === target) return
    if (reduced) {
      step.value = target
      return
    }
    const forward = target > step.value
    const next = step.value + (forward ? 1 : -1)
    const delay = forward ? FRAMES[next].forward : FRAMES[step.value].back
    timer = globalThis.setTimeout(() => {
      step.value = next
      advance()
    }, delay)
  }

  watch(wanted, advance, { immediate: true })

  onScopeDispose(halt)
</script>

<template>
  <ShellMockup
    kind="bare"
    fade="bottom"
    class="[--mockup-fade-start:76%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="stage"
      class="relative py-(--spacing-xs)"
    >
      <MockupPart :order="0">
        <div class="overflow-hidden rounded-(--shape-card) border border-(--border-default)">
          <Table :border="false">
            <Table.Header>
              <Table.Row>
                <Table.HeadCell class="w-24 flex-none!">
                  <span class="sr-only">Order</span>
                </Table.HeadCell>
                <Table.HeadCell principal>Name</Table.HeadCell>
                <Table.HeadCell class="w-24 flex-none!">Status</Table.HeadCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Accordion
                :value="frame.open"
                type="multiple"
                size="large"
                arrow-position="left"
              >
                <Accordion.Item
                  v-for="(phase, phaseIndex) in PHASES"
                  :key="phase.value"
                  :value="phase.value"
                >
                  <Accordion.Trigger
                    :data-cursor="phase.value"
                    :class="[
                      'bg-(--bg-canvas)! [&>span]:flex-1!',
                      phaseIndex > 0 ? 'border-t border-(--border-default)' : '',
                      frame.open.includes(phase.value) ? '' : 'border-b-0!'
                    ]"
                  >
                    <span class="flex min-w-0 items-center gap-(--spacing-sm)">
                      <span class="truncate text-label-sm text-(--text-default)">
                        {{ phase.label }}
                      </span>
                      <span class="shrink-0 text-body-xs text-(--text-muted) tabular-nums">
                        {{ phase.rules.length }} rules
                      </span>
                    </span>
                  </Accordion.Trigger>

                  <Accordion.Content>
                    <div class="flex w-full flex-col [&>*:last-child]:border-b-0">
                      <Table.Row
                        v-for="(rule, index) in phase.rules"
                        :key="rule.name"
                      >
                        <Table.Cell class="w-24 flex-none! gap-(--spacing-xxs)">
                          <span class="w-12 shrink-0 [&>span]:w-full">
                            <InputText
                              :model-value="String(index + 1)"
                              size="small"
                              :disabled="index === 0"
                              class="[&_input]:text-center [&_input]:tabular-nums"
                              :aria-label="`Position of ${rule.name} in the ${phase.label} phase`"
                            />
                          </span>
                          <IconButton
                            icon="pi pi-bars"
                            kind="outlined"
                            size="small"
                            :disabled="index === 0"
                            :aria-label="`Reorder ${rule.name}`"
                          />
                        </Table.Cell>
                        <Table.Cell
                          principal
                          clickable
                        >
                          <span class="min-w-0 truncate">{{ rule.name }}</span>
                        </Table.Cell>
                        <Table.Cell class="w-24 flex-none!">
                          <Tag
                            :label="rule.status"
                            :severity="rule.status === 'Active' ? 'success' : 'secondary'"
                            size="medium"
                          />
                        </Table.Cell>
                      </Table.Row>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            </Table.Body>
          </Table>
        </div>
      </MockupPart>

      <MockupCursor
        name="Rafael"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>
