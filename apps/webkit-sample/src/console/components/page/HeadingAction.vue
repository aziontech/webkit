<script setup>
  // A HEADING ACTION — the control that sits in a PageHeading's or SectionHeading's
  // `actions` slot. It keeps its label at every width and goes FULL WIDTH below `md`,
  // where the heading stacks and the action takes its own row:
  //
  //     ≥ md   [ Workloads                    [▤ Documentation] [+ Create workload] ]
  //
  //     < md   [ Workloads                                                          ]
  //            [ View and manage your workloads.                                     ]
  //            [ [           ▤ Documentation           ]                            ]
  //            [ [          + Create workload          ]                            ]
  //
  // WHY FULL WIDTH AND NOT AN ICON. The label is the action's name and the page it
  // opens repeats it as its own title (the webkit-microcopy rule, § 5) — dropping it
  // for a bare `+` saves ~130px on the one row that has room to give a whole line
  // instead. Stacked, the button gets the full measure, so the longest label in the
  // console ("Create Deployment Settings") still fits on one line, and the tap target
  // becomes the width of the screen rather than 40px in a corner.
  //
  // `w-full md:w-auto` — the width, not the display, is what changes, so this can be
  // ONE node. (A `hidden` passed as a class would have lost to `Button`'s own
  // `inline-flex` base; a width utility has no such competitor, and the `md:` variant
  // sorts after the unprefixed one.) The stacking itself belongs to the heading, which
  // owns the row: ./PageHeading.vue and ./SectionHeading.vue turn their trailing group
  // full-width and wrapping below `md`, and a `w-full` item in a wrapping row claims a
  // line of its own — so two actions stack without either heading counting them.
  //
  // It stays `large` (40px) at both widths: the heading row is the page's own action,
  // and the controls row under it (./ControlsHeader.vue) is the `medium` one.
  //
  // What does NOT use this: an EMPTY STATE's call to action (a first-use screen, a
  // table's no-rows block). That button is centred in an empty column with room to
  // spare, and stretching it to the column's width would make the instruction read as
  // the page's primary control.
  import Button from '@aziontech/webkit/button'

  defineProps({
    // The action's name. Reads as `Create <object>` on a first-level module list and
    // `Add <Product Module>` inside a resource — the webkit-microcopy rule, § 5.
    label: { type: String, required: true },
    // PrimeIcons class. `pi pi-plus` for a create/add.
    icon: { type: String, default: 'pi pi-plus' },
    // Visual variant, passed straight through. `outlined` is the house shape for a
    // heading action, INCLUDING the create button: the console's one filled `primary`
    // is the Create in the header bar (../shell/AppLayout.vue), the only act reachable
    // from every screen. A list's own create is a narrower version of that same act, so
    // it reads as outlined under it and a list page carries no filled button of its own
    // — one blue button per screen, always in the same corner of the chrome.
    //
    // `primary` is left for a COMMIT: an action that writes what the page is already
    // holding (Build's Deploy, a form's Save), which is not a create and has no
    // counterpart in the header.
    kind: { type: String, default: 'outlined' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    // When set the action is a LINK, not a button — `Button` renders an <a> and the
    // click handler is never wired. This is how the Documentation action on
    // ./PageHeading.vue reuses this shape: it leaves the console, so it has to be a
    // real anchor (middle-click, "copy link address"), and it still has to stack and
    // stretch like every other action on the row.
    href: { type: String, default: '' },
    target: { type: String, default: '_self' }
  })

  defineEmits(['click'])
</script>

<template>
  <Button
    :label="label"
    :icon="icon"
    :kind="kind"
    :disabled="disabled"
    :loading="loading"
    :href="href"
    :target="target"
    size="large"
    class="w-full md:w-auto"
    @click="$emit('click', $event)"
  />
</template>
