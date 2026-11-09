<script setup lang="ts">
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import HelperText from '../../../inputs/helper-text/helper-text.vue'
  import Hint from '../../../inputs/hint/hint.vue'
  import InputText from '../../../inputs/input-text/input-text.vue'
  import Label from '../../../inputs/label/label.vue'
  import Textarea from '../../../inputs/textarea/textarea.vue'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'

  defineOptions({ name: 'ApplicationsDeviceGroupFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the User-Agent expression is typed into the group while it is, and erased after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const EXPRESSION = '(Mobile|iPhone|Android|BlackBerry)'

  interface Frame {
    focused: boolean
    typed: number
    forward: number
    back: number
  }

  const FRAMES: Frame[] = [
    { focused: false, typed: 0, forward: 0, back: 0 },
    { focused: true, typed: 0, forward: 260, back: 200 },
    ...Array.from({ length: EXPRESSION.length }, (_, index) => ({
      focused: true,
      typed: index + 1,
      forward: index === 0 ? 520 : 45,
      back: 16
    }))
  ]

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(reduced || !canHover ? LAST : 0)
  const frame = computed(() => FRAMES[step.value])
  const expression = computed(() => EXPRESSION.slice(0, frame.value.typed))
  const lifted = computed(() => step.value > 0)

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
    :fade="lifted ? 'y' : 'bottom'"
    class="[--mockup-fade-edge:14%] [--mockup-fade-start:80%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      :data-lifted="lifted || null"
      class="flex flex-col gap-(--spacing-xl) py-(--spacing-xs) transition-[translate] duration-slow-01 ease-productive-entrance data-lifted:-translate-y-32 motion-reduce:transition-none"
    >
      <ShellMockupPart :order="0">
        <div class="flex flex-col gap-(--spacing-md)">
          <div class="flex items-center gap-(--spacing-xxs)">
            <span class="text-heading-xxs text-(--text-default)">General</span>
            <Hint
              text="Names the group in the rules that reference it, so renaming it later means revisiting every rule that uses it."
            />
          </div>
          <div class="flex flex-col gap-(--spacing-xs)">
            <Label
              for="device-group-name"
              label="Name"
            />
            <InputText
              id="device-group-name"
              model-value="mobiledevices"
              size="large"
              class="w-full font-code"
              placeholder="mobiledevices"
              aria-label="Name"
            />
            <HelperText
              label="Lowercase letters and numbers only. Spaces, uppercase and special characters are rejected."
            />
          </div>
        </div>
      </ShellMockupPart>

      <ShellMockupPart :order="1">
        <div class="flex flex-col gap-(--spacing-md)">
          <div class="flex items-center gap-(--spacing-xxs)">
            <span class="text-heading-xxs text-(--text-default)">Match to User-Agent</span>
            <Hint
              text="Every request whose User-Agent header matches this expression belongs to the group."
            />
          </div>
          <div class="flex flex-col gap-(--spacing-xs)">
            <Label
              for="device-group-expression"
              label="Regular expression"
            />
            <span
              :data-focused="frame.focused || null"
              class="flex rounded-(--shape-elements) ring-offset-2 ring-offset-(--bg-surface) data-focused:ring-2 data-focused:ring-(--ring-color)"
            >
              <Textarea
                id="device-group-expression"
                :model-value="expression"
                class="w-full font-code"
                placeholder="(Mobile|iP(hone|od)|BlackBerry|IEMobile)"
                aria-label="Regular expression"
              />
            </span>
            <HelperText
              label="Matched against the header's full value, so anchor the pattern if you need one."
            />
          </div>
        </div>
      </ShellMockupPart>
    </div>
  </ShellMockup>
</template>
