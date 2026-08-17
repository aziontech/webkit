<script setup>
  // THE ROW. One field inside a band's card — the unit every create page and every
  // in-resource drawer is built from, so a form is a list of these and nothing else.
  //
  // In an ItemGroup the ROW IS THE LABEL: the Item.Title names the field and the
  // Item.Description carries its guidance, so there is no `<Label for>` and the
  // control takes an `aria-label` instead. That is the whole reason this shape is
  // compact — the name, the guidance and the control share one line's worth of
  // vertical space instead of three.
  //
  // `kind` is about WHAT THE CONTROL NEEDS, and it is the only decision this
  // component asks of a caller:
  //
  //   compact — the control is small and fixed (a Switch, a MiniButton). It sits hard
  //     right at its natural size. Wrapping it would only push it away from the edge.
  //   field   — the control is a field the reader types or picks in (InputText,
  //     Select, InputNumber). It fills a cell capped at `--container-3xs`, so every
  //     field on the page ends at the same x and the card reads as a column of
  //     controls rather than a ragged edge.
  //   wide    — the control cannot work in 256px: a textarea, a code block, a radio
  //     group, an editor. The row STACKS — name and guidance above, control at the
  //     full measure below — instead of squeezing it. This is what keeps the
  //     ItemGroup anatomy usable for long-form fields rather than forcing a page to
  //     abandon it the first time it needs a textarea.
  //
  // The message under the control is part of the row, not the caller's job: `field`
  // and `wide` reserve a column for it so a HelperText appearing on a failed submit
  // pushes nothing sideways. `kind` is what separates the amber prompt (you have not
  // answered yet) from the red error (the answer cannot be accepted) — required is
  // NOT an error, and the two are never both on for one field.
  import HelperText from '@aziontech/webkit/helper-text'
  import Item from '@aziontech/webkit/item'
  import { computed, useId } from 'vue'

  const props = defineProps({
    // The field's name. This IS the label — the control gets it as `aria-label`.
    title: { type: String, default: '' },
    // Guidance under the name. Use the `description` slot when it needs markup (a
    // link, an inline code span).
    description: { type: String, default: '' },
    // How much room the control needs — see the note above.
    kind: {
      type: String,
      default: 'field',
      validator: (value) => ['compact', 'field', 'wide'].includes(value)
    },
    // The message under the control. Empty = nothing rendered.
    message: { type: String, default: '' },
    // `required` (amber: not answered yet) or `invalid` (red: cannot be accepted) or
    // `helper` (neutral guidance that belongs under the control rather than beside
    // the name — a format example, a live count).
    messageKind: {
      type: String,
      default: 'helper',
      validator: (value) => ['helper', 'required', 'invalid'].includes(value)
    }
  })

  // Handed back through the default slot so the caller can point the control's
  // `aria-describedby` at the message it is actually showing.
  const messageId = useId()

  const stacked = computed(() => props.kind === 'wide')

  const actionsClass = computed(() => {
    if (props.kind === 'compact') return 'justify-end'
    if (stacked.value) return 'w-full justify-start'
    return 'flex-1 justify-end max-w-(--container-3xs)'
  })
</script>

<template>
  <Item
    size="small"
    :class="stacked ? 'flex-col items-stretch gap-(--spacing-sm)' : 'items-start'"
  >
    <Item.Content>
      <Item.Title>{{ title }}</Item.Title>
      <Item.Description v-if="description || $slots.description">
        <slot name="description">{{ description }}</slot>
      </Item.Description>
    </Item.Content>

    <Item.Actions :class="actionsClass">
      <!-- `compact` passes the control straight through: a Switch pinned right needs
           no column around it, and one would only unpin it. -->
      <slot
        v-if="kind === 'compact'"
        :message-id="message ? messageId : undefined"
      />
      <div
        v-else
        class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
      >
        <slot :message-id="message ? messageId : undefined" />
        <HelperText
          v-if="message"
          :id="messageId"
          :kind="messageKind"
          :label="message"
        />
      </div>
    </Item.Actions>
  </Item>
</template>
