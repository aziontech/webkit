<script setup>
  // THE FIELD, SEPARATED — a real `<Label for>` above the control, the control at the
  // full measure of its column, and the control's own message under it. This is the
  // shape the Variables drawer has always used (../AddVariableDrawer.vue), extracted so
  // every create flow in a drawer is built from the same unit instead of each one
  // re-deciding what a field looks like.
  //
  // ── WHY NOT ./FieldRow.vue ──
  //
  // `FieldRow` is the other shape: two columns, the name and its guidance on the left,
  // the control capped at 256px on the right. That is correct for SETTINGS, where the
  // reader is scanning a list of current values and the right edge of the card is a
  // column they read down. It is wrong for a CREATE, and in three specific ways:
  //
  //   THE NAME IS NOT A LABEL. `Item.Title` is text beside a control, so the control has
  //     to carry an `aria-label` that repeats it, and clicking the name does not focus
  //     the field. In a form the reader is filling in, that is the one interaction the
  //     label exists for.
  //   THE CONTROL IS CAPPED AT 256px. Fine for a value you are reading; hostile for a
  //     path, a regex, a connection string or a JSON default you are typing into.
  //   THE GUIDANCE IS ALWAYS ON. A description under every row is prose the reader has
  //     to cross between each field. Here the band says it once, in `Section`'s `hint`.
  //
  // So: `FieldRow` for settings surfaces, `FieldStack` for the creates. Both keep the
  // message a part of the field rather than the caller's job, and both keep `required`
  // (amber — not answered yet) distinct from `invalid` (red — cannot be accepted), which
  // are never both on for one field.
  import HelperText from '@aziontech/webkit/helper-text'
  import Label from '@aziontech/webkit/label'
  import { computed, useId } from 'vue'

  const props = defineProps({
    // The field's name, rendered as a real <Label for>.
    label: { type: String, default: '' },
    // Guidance that belongs to THIS field rather than to the band — a format, an
    // example. Use the `description` slot when it needs markup.
    description: { type: String, default: '' },
    // The message under the control. Empty = nothing rendered, and nothing reserved:
    // a create form is a column of fields, so a message appearing pushes the fields
    // below it down rather than sideways, which is the honest direction.
    message: { type: String, default: '' },
    // `required` (amber: not answered yet), `invalid` (red: cannot be accepted), or
    // `helper` (neutral guidance under the control).
    messageKind: {
      type: String,
      default: 'helper',
      validator: (value) => ['helper', 'required', 'invalid'].includes(value)
    }
  })

  // Both handed to the slot, so the caller wires the control it actually renders: the
  // id the label points at, and the message id for `aria-describedby`. Generated here
  // and not by the caller, because a field that owns its label owns the association.
  const controlId = useId()
  const messageId = useId()

  const describedBy = computed(() => (props.message ? messageId : undefined))
</script>

<template>
  <div class="flex w-full min-w-0 flex-col gap-[var(--spacing-xs)]">
    <!-- The label row carries a trailing slot for a control that belongs to the whole
         field rather than to its value — the Remove on a repeater row. It rides HERE so
         at rest every label in the form sits at exactly the same step above its input. -->
    <div
      v-if="label || $slots.label || $slots.action"
      class="flex min-w-0 items-center justify-between gap-[var(--spacing-xs)]"
    >
      <!-- The `label` slot is for a name that is not plain prose — a column name in code
           type, a key with its own glyph. It stays INSIDE the `<Label for>`, so it is
           still the thing clicking focuses the control. -->
      <Label :for="controlId">
        <slot name="label">{{ label }}</slot>
      </Label>
      <slot name="action" />
    </div>

    <p
      v-if="description || $slots.description"
      class="text-body-xs text-[var(--text-muted)]"
    >
      <slot name="description">{{ description }}</slot>
    </p>

    <slot
      :control-id="controlId"
      :described-by="describedBy"
    />

    <HelperText
      v-if="message"
      :id="messageId"
      :kind="messageKind"
      :label="message"
    />
  </div>
</template>
