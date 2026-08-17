<script setup>
  // THE FIELD, SEPARATED — the webkit TRIAD, and nothing else: a real `<Label for>`, the
  // control at the full measure of its column, and ONE auxiliary line under it.
  //
  // ── ONE AUXILIARY REGION, NOT TWO ──
  //
  // This component used to render guidance as its own `<p>` BETWEEN the label and the
  // control, and the validation message as a `HelperText` under it — two text regions
  // around one control. No webkit field is built that way. Every `field-*` component
  // ships exactly one:
  //
  //   Label  →  control  →  HelperText
  //
  // and `/webkit-form` says what that one region is for: "**the helper region is the
  // guidance region.** Feed it the field's guidance; on a failed submit swap it for the
  // message and flip the state." So that is what happens here — `description` is the
  // guidance, `message` is what replaces it when the submit failed, and they share one
  // row that is `aria-describedby`-linked to the control.
  //
  // Two regions was not only off-pattern, it was worse to read: guidance above the
  // control pushes the control away from its label, and a message appearing below it
  // meant a field could be talking in two places at once about the same value.
  //
  // ── AND GUIDANCE THAT SHOULD NOT BE ALWAYS-ON IS A `hint` ──
  //
  // A form of ten fields, each with a permanent line of prose under it, is a wall the
  // reader crosses on the way to every control. `hint` is the other half of the webkit
  // structure: `Label` renders it as an ⓘ glyph that reveals the text on hover or focus.
  // Use `description` when the guidance is needed EVERY time (a format, a unit, a
  // consequence); use `hint` when it is needed ONCE (what the field is for).
  //
  // ── WHY NOT ./FieldRow.vue ──
  //
  // `FieldRow` is the other shape: two columns, the name and its guidance on the left,
  // the control capped at 256px on the right. That is correct for SETTINGS, where the
  // reader is scanning a list of current values and the right edge of the card is a
  // column they read down. It is wrong for a CREATE, and in two specific ways:
  //
  //   THE NAME IS NOT A LABEL. `Item.Title` is text beside a control, so the control has
  //     to carry an `aria-label` that repeats it, and clicking the name does not focus
  //     the field. In a form the reader is filling in, that is the one interaction the
  //     label exists for.
  //   THE CONTROL IS CAPPED AT 256px. Fine for a value you are reading; hostile for a
  //     path, a regex, a connection string or a JSON default you are typing into.
  //
  // So: `FieldRow` for settings surfaces, `FieldStack` for the creates. Both keep the
  // message a part of the field rather than the caller's job, and both keep `required`
  // (amber — not answered yet) distinct from `invalid` (red — cannot be accepted), which
  // are never both on for one field.
  //
  // Reach for a complete `field-*` (FieldText, FieldTextarea, FieldSwitch, …) before
  // reaching for this: those ARE this triad with the control built in and the a11y wired
  // by construction. This is for the cases they do not cover — a composed `Select`, a
  // control that has to sit in a bespoke layout.
  import HelperText from '@aziontech/webkit/helper-text'
  import Label from '@aziontech/webkit/label'
  import { computed, useId } from 'vue'

  const props = defineProps({
    // The field's name, rendered as a real <Label for>.
    label: { type: String, default: '' },
    // ALWAYS-ON guidance for this field — a format, an example, a unit. Rendered in the
    // helper row UNDER the control, which is the one auxiliary region a webkit field
    // has. Use the `description` slot when it needs markup (a link, an inline code span).
    description: { type: String, default: '' },
    // GUIDANCE ON DEMAND — an ⓘ glyph on the label that reveals this on hover or focus.
    // For what the field is for, which a reader needs once rather than on every pass.
    hint: { type: String, default: '' },
    // The message under the control. Empty = the guidance shows instead.
    message: { type: String, default: '' },
    // `required` (amber: not answered yet), `invalid` (red: cannot be accepted), or
    // `helper` (neutral).
    messageKind: {
      type: String,
      default: 'helper',
      validator: (value) => ['helper', 'required', 'invalid'].includes(value)
    },
    // The PERSISTENT required tag on the label — on from first render, so the reader
    // knows the field is mandatory before touching it. Not the amber submit state.
    required: { type: Boolean, default: false }
  })

  const slots = defineSlots()

  // Both handed to the slot, so the caller wires the control it actually renders: the
  // id the label points at, and the message id for `aria-describedby`. Generated here
  // and not by the caller, because a field that owns its label owns the association.
  const controlId = useId()
  const helperId = useId()

  // ONE ROW, ONE PRECEDENCE. The message is what the field has to say right now, so it
  // wins; the guidance is what it says the rest of the time.
  const helperShown = computed(
    () => !!(props.message || props.description || slots.description)
  )
  const helperKind = computed(() => (props.message ? props.messageKind : 'helper'))
  const describedBy = computed(() => (helperShown.value ? helperId : undefined))
</script>

<template>
  <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
    <!-- The label row carries a trailing slot for a control that belongs to the whole
         field rather than to its value — the Remove on a repeater row. It rides HERE so
         at rest every label in the form sits at exactly the same step above its input. -->
    <div
      v-if="label || $slots.label || $slots.action"
      class="flex min-w-0 items-center justify-between gap-(--spacing-xs)"
    >
      <!-- The `label` slot is for a name that is not plain prose — a column name in code
           type, a key with its own glyph. It stays INSIDE the `<Label for>`, so it is
           still the thing clicking focuses the control. `hint` renders as the ⓘ glyph
           Label already knows how to draw. -->
      <Label
        :for="controlId"
        :required="required"
        :hint="hint"
      >
        <slot name="label">{{ label }}</slot>
      </Label>
      <slot name="action" />
    </div>

    <slot
      :control-id="controlId"
      :described-by="describedBy"
    />

    <HelperText
      v-if="helperShown"
      :id="helperId"
      :kind="helperKind"
    >
      <template v-if="message">{{ message }}</template>
      <slot
        v-else
        name="description"
        >{{ description }}</slot
      >
    </HelperText>
  </div>
</template>
