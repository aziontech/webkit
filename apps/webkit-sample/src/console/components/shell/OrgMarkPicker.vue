<script setup>
  // The organization's mark colour, as a choice — a radiogroup of the accents
  // from `orgAccents`, each option a swatch of that accent's own three-stop
  // palette.
  //
  // Why swatches and not previews of the art: the mark itself is GENERATED from
  // the organization's name (see OrgAvatar), so an option painted with the live
  // name repaints on every keystroke — seven little pictures churning while the
  // user is trying to read the field they are typing in. What the user is
  // actually choosing here is the colour; the art is the name's business. So the
  // options are stable, the header preview beside the form is where the real
  // generated mark lives, and the two answer different questions instead of
  // competing.
  //
  // Shared by the signup onboarding and the console's Create Organization flow,
  // so the mark is chosen the same way wherever an organization is created.
  import BoxGridSelection from '@aziontech/webkit/box-grid-selection'

  import { orgAccents } from '../../lib/state/organizations.js'

  defineProps({
    disabled: { type: Boolean, default: false }
  })

  // The chosen accent (`v-model`).
  const accent = defineModel({ type: String, default: orgAccents[0].value })

  const items = orgAccents.map((entry) => ({
    value: entry.value,
    label: entry.label,
    ariaLabel: `${entry.label} mark`
  }))

  // The swatch reads as one object rather than three stripes: the palette's own
  // stops on a diagonal, in the order the marble generator holds them (pale →
  // saturated → neighbour hue), so the swatch and the mark it produces are
  // recognisably the same colour family.
  const swatchOf = (value) => {
    const { colors } = orgAccents.find((entry) => entry.value === value) ?? orgAccents[0]
    return { backgroundImage: `linear-gradient(135deg, ${colors.join(', ')})` }
  }
</script>

<template>
  <!-- A grid, not the component's default wrap-flex: the options are one choice
       of the same kind repeated, so they should divide the width evenly instead of
       each being as wide as its own label — "Orange" and "Red" are not different
       sizes of decision. `cn` inside BoxGridSelection lets this override its
       `flex flex-wrap`, and every option then stretches to its column. Four
       columns on a narrow card, all seven in a row from `sm` up. -->
  <BoxGridSelection
    v-model="accent"
    :items="items"
    :disabled="disabled"
    aria-label="Organization mark"
    class="grid w-full grid-cols-4 sm:grid-cols-7"
  >
    <template #default="{ item }">
      <span class="flex flex-col items-center gap-[var(--spacing-xs)]">
        <!-- Round, so a colour reads as a colour and not as a tiny app icon: the
             square shape belongs to the MARK (the org avatar is a rounded square
             everywhere in the console), and reusing it here made the swatch look
             like a preview of the mark rather than a palette. -->
        <span
          class="size-[var(--size-8)] rounded-full"
          :style="swatchOf(item.value)"
        />
        <span class="text-body-xs text-[var(--text-muted)]">{{ item.label }}</span>
      </span>
    </template>
  </BoxGridSelection>
</template>
