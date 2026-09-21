<script setup>
  // THE DRAWER. One shell for every create that happens INSIDE a resource, and the
  // only shell for them — see `docs/surfaces.js` for where that rule comes from.
  //
  // WHY A SHELL AND NOT A PAGE. A create that lives inside a resource is a step in
  // work already underway: the reader is on the zone, the table, the rules list, and
  // what they are adding only means anything in that context. A page would throw the
  // context away and make them navigate back to it. The drawer keeps the list behind
  // it, so the thing being added is seen against the things already there.
  //
  // THE CHROME IS THE VARIABLES DRAWER'S, deliberately. That flow was the one the
  // console had already settled, so it is the shape every other in-resource create
  // now takes rather than each one re-deciding:
  //   - a right-side Drawer, `medium` by default (`large` only when the body genuinely
  //     needs the width — a rule builder, a table editor);
  //   - ONE native `<form novalidate @submit.prevent>` owning the scope, so Enter
  //     submits through the sr-only submit control (the styled Button cannot be a
  //     native submit);
  //   - ONE `submitting` flag locking everything: the body `<fieldset :disabled>` is
  //     the native safety net and Save carries `:loading`;
  //   - NO Cancel. The panel's X, the overlay and Escape are all the dismissal, and a
  //     fourth one in the footer would only compete with Save for the eye. Save sits
  //     alone on the right.
  //
  // THE BODY IS SECTIONS. The default slot is a stack of `Section` bands (title +
  // Hint, a flush CardBox of Item rows), the same bands a create PAGE uses — so a
  // drawer create and a page create are the same form in two containers, and the
  // reader learns one anatomy. A band whose fields the endpoint does not require goes
  // in a `collapsible` Section titled Advanced, last.
  //
  // Validation stays with the OWNER: it validates in its `submit` handler and closes
  // by setting `open` to false. This shell never decides whether a form is valid,
  // because what a DNS record requires has nothing to do with what a table column
  // does.
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'

  const open = defineModel('open', { type: Boolean, default: false })

  defineProps({
    // Drawer title, e.g. "Add Record". It names the ACTION on the resource, not the
    // resource — the reader already knows which zone they are in.
    title: { type: String, default: '' },
    // Optional supporting line under the title. Optional on purpose: a drawer whose
    // bands already carry hints does not need a paragraph repeating them, and the
    // Variables drawer ships without one.
    description: { type: String, default: '' },
    // The owner's in-flight flag. Locks the whole scope: the body fieldset and the
    // Save's spinner.
    submitting: { type: Boolean, default: false },
    // Panel width. `medium` is the pattern; `large` is the exception a body earns by
    // being genuinely wide (a rule builder, a schema editor), never by having many
    // fields — many fields want scrolling, not width.
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    // The commit's own verb. "Save" for most; "Add" / "Create" when the list behind
    // the drawer is what visibly changes.
    saveLabel: { type: String, default: 'Save' },
    // A HARD precondition the form cannot satisfy from inside itself — the body is an
    // empty state offering the only way forward, so the commit has nothing to act on.
    // NOT for validation: a missing required field is reported on submit, next to the
    // field, which is what keeps the reader from hunting a disabled button for a reason.
    saveDisabled: { type: Boolean, default: false },
    // WHETHER ESCAPE AND THE OVERLAY STILL DISMISS THIS PANEL. On by default, because
    // they are this drawer's only exits (there is no Cancel).
    //
    // Turn it OFF while a SECOND drawer is open over this one. Every open DrawerContent
    // listens for Escape on `document`, so with two panels open one press closes BOTH —
    // measured: a reader backing out of the child loses the parent form they had already
    // filled in. Until the component only lets the topmost panel answer, the parent stands
    // its exits down while it is not the one on top.
    dismissible: { type: Boolean, default: true },
    // THIS DRAWER IS THE SECOND IN A STACK — opened over another drawer, not over the page.
    //
    // A Drawer panel is z-1001 and its overlay z-1000, so a child's backdrop lands BELOW
    // the parent's panel: measured, the parent stayed undimmed AND live — clicking its
    // domain field while the child was open still typed into it. Two live forms, one
    // behind the other. This lifts the pair a layer so the child's own backdrop covers the
    // parent, which is what makes it inert and what makes the stack read.
    //
    // Set it on the CHILD, never the parent. Same workaround
    // ../../pages/forms/NestedDrawer.vue spells out inline, in one place instead of at
    // every nesting site — and it goes away when the Drawer stacks its own layers.
    stacked: { type: Boolean, default: false }
  })

  const emit = defineEmits(['submit'])
</script>

<template>
  <Drawer
    v-model:open="open"
    :size="size"
    :dismissible="dismissible"
    side="right"
  >
    <DrawerPortal>
      <!-- THE LAYER ARRIVES AS A CLASS, not as a `data-stacked` + Tailwind variant, which
           is what this wanted to be. `DrawerOverlay` and `DrawerContent` set
           `inheritAttrs: false` and never spread `$attrs` — they read `attrs.class` and
           drop everything else — so a data attribute passed here never reaches the DOM and
           the variant silently matches nothing. Measured: the attribute was absent and the
           panel stayed at z-1001. `class` is the one channel these two forward, so the
           layer goes through it; `cn` tailwind-merges it over their own `z-`. -->
      <DrawerOverlay :class="stacked ? 'z-1002' : ''" />
      <DrawerContent :class="stacked ? 'z-1003' : ''">
        <form
          class="flex min-h-0 flex-1 flex-col"
          :aria-label="title"
          novalidate
          @submit.prevent="emit('submit')"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DrawerTitle>{{ title }}</DrawerTitle>
              <p
                v-if="description"
                class="text-body-sm text-(--text-muted)"
              >
                {{ description }}
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <!-- One fieldset for the whole body: a single `disabled` locks every
                 field in every band while the scoped save runs. The bands space
                 themselves (Section owns the step), so nothing here sets a gap. -->
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">{{ title }}</legend>
              <slot />
            </fieldset>
          </PanelContent>

          <!-- The footer keeps PanelFooter's own surface — it is part of the drawer, not
               a plane behind it, and a second background here only draws a seam across
               the panel. `#start` is for a bulk path that belongs to the whole form (the
               Variables drawer's Import); everything else stays out of here. -->
          <PanelFooter class="flex-wrap justify-between">
            <div class="flex min-w-0 items-center gap-(--spacing-sm)">
              <slot name="start" />
            </div>
            <Button
              :label="saveLabel"
              kind="primary"
              size="medium"
              :loading="submitting"
              :disabled="saveDisabled"
              @click="emit('submit')"
            />
            <!-- Enter-to-submit: the visible Save is a click handler (not a native
                 submit button), so the form needs a real submit control for the
                 keyboard path. -->
            <button
              type="submit"
              class="sr-only"
              tabindex="-1"
              aria-hidden="true"
            >
              {{ saveLabel }}
            </button>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
