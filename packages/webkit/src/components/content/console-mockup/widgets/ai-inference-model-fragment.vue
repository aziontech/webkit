<script setup lang="ts">
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { useMediaQuery } from '../../../../composables/use-media-query'
  import Button from '../../../actions/button/button.vue'
  import FieldDescription from '../../../inputs/field/field-description/field-description.vue'
  import FieldLabel from '../../../inputs/field/field-label/field-label.vue'
  import Input from '../../../inputs/input/input.vue'
  import InputGroupRoot from '../../../inputs/input-group/input-group.vue'
  import InputGroupAddon from '../../../inputs/input-group/input-group-addon/input-group-addon.vue'
  import Select from '../../../inputs/select/index'
  import Switch from '../../../inputs/switch/switch.vue'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import ConsoleMockupShell from '../console-mockup-shell/console-mockup-shell.vue'
  import ConsoleMockupShellItem from '../console-mockup-shell/console-mockup-shell-item/console-mockup-shell-item.vue'
  import MockupCursor from '../parts/mockup-cursor.vue'

  defineOptions({ name: 'AiInferenceModelFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the model is typed into the template setting while it is, and taken back out after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = useMediaQuery('(hover: hover)', true)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')

  const MODEL = 'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8'

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    focused: boolean
    typed: number
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'model', x: 0.82, y: 2.1 }
  const FIELD: MockupCursorTarget = { key: 'model', x: 0.72, y: 0.6 }
  const DEPLOY: MockupCursorTarget = { key: 'deploy', x: 0.62, y: 0.6 }

  const REST = { cursor: IDLE, press: false, focused: false, typed: 0 }
  const TYPED = { ...REST, cursor: FIELD, focused: true, typed: MODEL.length }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: FIELD, forward: 120, back: 420 },
    { ...REST, cursor: FIELD, press: true, focused: true, forward: 480, back: 160 },
    ...Array.from(MODEL, (_, index) => ({
      ...REST,
      cursor: FIELD,
      focused: true,
      typed: index + 1,
      forward: index === 0 ? 200 : 40,
      back: 14
    })),
    { ...TYPED, cursor: DEPLOY, focused: false, forward: 360, back: 420 }
  ]

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hovered || !canHover.value)

  const step = ref(0)
  const stageEl = ref<globalThis.HTMLElement | null>(null)

  const frame = computed(() => FRAMES[step.value])
  const model = computed(() => MODEL.slice(0, frame.value.typed))
  const { position } = useMockupCursor(stageEl, () => frame.value.cursor)

  let timer: ReturnType<typeof globalThis.setTimeout> | null = null

  const halt = () => {
    if (timer) globalThis.clearTimeout(timer)
    timer = null
  }

  const advance = () => {
    halt()
    const target = wanted() ? LAST : 0
    if (step.value === target) return
    if (reduced.value || !canHover.value) {
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

  const shown = (value: unknown) => String(value)
</script>

<template>
  <ConsoleMockupShell
    variant="bare"
    fade="bottom"
    class="[--mockup-fade-start:82%]"
    :chrome="false"
    :active="active"
    :width="480"
    :mobile-width="420"
  >
    <div
      ref="stageEl"
      class="relative"
    >
      <div class="flex flex-col gap-(--spacing-lg) py-(--spacing-xs)">
        <ConsoleMockupShellItem :order="0">
          <div class="grid grid-cols-2 items-start gap-(--spacing-lg)">
            <div class="flex flex-col gap-(--spacing-xs)">
              <FieldLabel
                required
                for="ai-inference-scope"
                >Scope</FieldLabel
              >
              <Select
                model-value="gab-az"
                size="large"
                placeholder="Select a scope"
                :display-value="shown"
              >
                <Select.Trigger aria-label="Scope" />
              </Select>
            </div>

            <div class="flex flex-col gap-(--spacing-xs)">
              <FieldLabel
                required
                for="ai-inference-repo"
                >Public Repository Name</FieldLabel
              >
              <InputGroupRoot size="large">
                <Input
                  id="ai-inference-repo"
                  model-value="ai-inference-starter-kit"
                  size="large"
                  placeholder="my-repository"
                  class="flex-1"
                />
                <InputGroupAddon>
                  <Switch
                    :model-value="true"
                    variant="privacy"
                    aria-label="Repository is public — toggle to make it private"
                  />
                </InputGroupAddon>
              </InputGroupRoot>
            </div>
          </div>
        </ConsoleMockupShellItem>

        <ConsoleMockupShellItem :order="1">
          <h3 class="text-heading-2xs text-(--text-default)">Template Settings</h3>
        </ConsoleMockupShellItem>

        <ConsoleMockupShellItem :order="2">
          <div class="flex flex-col gap-(--spacing-xs)">
            <FieldLabel
              required
              for="ai-inference-model"
              >Model</FieldLabel
            >
            <span
              :data-focused="frame.focused || null"
              data-cursor="model"
              class="flex rounded-(--shape-control) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance data-focused:ring-2 data-focused:ring-offset-2 motion-reduce:transition-none"
            >
              <Input
                id="ai-inference-model"
                :model-value="model"
                size="large"
                placeholder="llama-3.2-3b-instruct"
                class="flex-1"
                aria-describedby="ai-inference-model-helper"
              />
            </span>
            <FieldDescription id="ai-inference-model-helper"
              >The model the application loads on the first request.</FieldDescription
            >
          </div>
        </ConsoleMockupShellItem>

        <ConsoleMockupShellItem :order="3">
          <span
            data-cursor="deploy"
            class="flex"
          >
            <Button
              class="w-full"
              label="Deploy"
              variant="primary"
              size="large"
              :disabled="!model"
            />
          </span>
        </ConsoleMockupShellItem>
      </div>

      <MockupCursor
        name="Jane"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ConsoleMockupShell>
</template>
