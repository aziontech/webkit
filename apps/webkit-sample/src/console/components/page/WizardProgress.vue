<script setup>
  // HOW FAR THROUGH THE PARTS — the wizard's position, as a progress bar over the part
  // names.
  //
  // WHY A BAR AND NOT A DOT RAIL. A rail of dots down the side of the page says which
  // part is current, but it says nothing about how much is LEFT — the reader has to
  // count markers to find out. A bar answers that in the one glance it costs, and it
  // sits above the form instead of beside it, so the form keeps the full measure every
  // other create page in this console gets (../../components/page/CreatePage.vue).
  //
  // The bar is webkit's own ProgressBar, so its fill, height and easing are the ones the
  // rest of the console already animates with — nothing is hand-drawn here.
  //
  // UNDER IT, THE PARTS BY NAME. The bar alone would be a number without a subject;
  // the names say what the reader just answered and what is coming. Parts already
  // answered are BUTTONS — going back is always safe because the wizard keeps every
  // answer — and parts ahead are plain text, because reaching them is what the Next
  // button validates.
  import ProgressBar from '@aziontech/webkit/progress-bar'
  import { computed } from 'vue'

  import SuccessMark from './SuccessMark.vue'

  const props = defineProps({
    // The flow's parts, in order: [{ id, label }].
    steps: { type: Array, default: () => [] },
    // Index into `steps` of the part showing now.
    currentStep: { type: Number, default: 0 },
    // Blocks the backward jump while a commit is in flight.
    disabled: { type: Boolean, default: false }
  })

  const emit = defineEmits(['go'])

  const total = computed(() => Math.max(props.steps.length, 1))

  // The count the reader reads: the part they are ON, one-based.
  const position = computed(() => Math.min(props.currentStep + 1, total.value))

  // THE FILL STOPS MID-PART, and both ends of that are deliberate.
  //
  // It does not start at zero, because a bar reading empty on the first screen of a
  // stepped flow says "nothing counted yet" when the reader is in fact a third of the way
  // through what they will be asked.
  //
  // It does not reach 100% on the last part either, because the last part is where the
  // reader still has to name the project, fill in whatever the template asked for, and
  // press the button that spends real infrastructure. A full bar there says "nothing
  // left" in front of the single most consequential action in the flow. 100% belongs to
  // the deploy, and by then the bar is gone (WizardPage retires it on a terminal phase).
  //
  // So the fill lands on the MIDDLE of the current part: 1/6, 3/6, 5/6 of a three-part
  // flow — 17%, 50%, 83%. Doubling the scale keeps both numbers integers rather than
  // handing the progressbar a fractional value.
  const value = computed(() => position.value * 2 - 1)
  const max = computed(() => total.value * 2)

  const stepState = (index) => {
    if (index < props.currentStep) return 'done'
    if (index === props.currentStep) return 'current'
    return 'todo'
  }

  const onGo = (index) => {
    if (stepState(index) !== 'done' || props.disabled) return
    emit('go', index)
  }
</script>

<template>
  <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
    <!-- `value`/`max` run on the doubled scale (see above), so the accessible name
         carries the reader-facing count instead — the raw numbers would say 3 of 6. -->
    <ProgressBar
      :value="value"
      :max="max"
      size="small"
      shape="rounded"
      :aria-label="`Step ${position} of ${total}: ${steps[currentStep]?.label ?? ''}`"
    />

    <!-- THE PARTS BY NAME, and the count opposite them. The current part is named ONCE:
         it used to be spelled out again as a heading above the bar, which said nothing
         the emphasised entry in this row does not, and pushed the first field a line
         further down on every part.
         Below `sm` the row gives way to the count alone — three labels plus separators
         wrap into a block taller than the field they introduce, and "Step 2 of 3 · Choose
         a repository" says the same thing in one line. -->
    <div class="flex min-w-0 items-baseline justify-between gap-(--spacing-sm)">
      <ol class="hidden min-w-0 flex-wrap items-center gap-(--spacing-xs) sm:flex">
        <li
          v-for="(step, index) in steps"
          :key="step.id"
          :data-state="stepState(index)"
          class="group flex min-w-0 items-center gap-(--spacing-xs)"
        >
          <component
            :is="stepState(index) === 'done' ? 'button' : 'span'"
            :type="stepState(index) === 'done' ? 'button' : undefined"
            :disabled="stepState(index) === 'done' && disabled ? true : undefined"
            :aria-current="stepState(index) === 'current' ? 'step' : undefined"
            class="flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) px-(--spacing-xxs) text-label-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none group-data-[state=current]:text-(--text-default) group-data-[state=done]:cursor-pointer group-data-[state=done]:hover:text-(--text-default)"
            @click="onGo(index)"
          >
            <!-- A part behind the reader carries the SUCCESS MARK; a part ahead carries
                 its number. The two must not read the same — that is the one thing this
                 row exists to say. The mark is the deploy pipeline's own
                 (./SuccessMark.vue): this flow ENDS in that pipeline, so one idea must not
                 wear two different green affordances seconds apart. -->
            <SuccessMark
              v-if="stepState(index) === 'done'"
              size="small"
            />
            <span
              v-else
              aria-hidden="true"
              class="shrink-0 tabular-nums"
              >{{ index + 1 }}.</span
            >
            <span class="min-w-0 truncate">{{ step.label }}</span>
          </component>
          <i
            v-if="index < steps.length - 1"
            class="pi pi-chevron-right shrink-0 text-[0.625rem] leading-none text-(--text-muted)"
            aria-hidden="true"
          />
        </li>
      </ol>

      <p class="min-w-0 truncate text-label-sm text-(--text-muted) sm:hidden">
        Step {{ position }} of {{ total }} · {{ steps[currentStep]?.label }}
      </p>
      <p class="hidden shrink-0 text-label-sm text-(--text-muted) sm:block">
        Step {{ position }} of {{ total }}
      </p>
    </div>
  </div>
</template>
