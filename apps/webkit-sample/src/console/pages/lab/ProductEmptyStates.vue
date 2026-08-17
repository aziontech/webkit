<script setup>
  // ProductEmptyStates — /empty-states, the first-use screen of a product module,
  // per product.
  //
  // Home already answers "this account has nothing yet" for a resource type: an
  // EmptyState lead over an Item.List of the ways to create a first one, swapped by
  // a filter Dropdown (components/Home.vue). This page is that pattern moved into
  // the PRODUCT's context — same idea, same switcher, but the content is the
  // module's own, because everything worth saying on a first-use screen is a fact
  // about the product and not about emptiness (src/product-empty-states.js holds
  // the copy and argues that split).
  //
  // ── THE GALLERY, AND THE BLOCK ──
  //
  // This page is the GALLERY: a heading and a product picker around one block. The
  // block itself — the lead and the gates — is ui/ProductFirstUse.vue, because it has
  // a second home: it is what /applications, /workloads and /functions render in the
  // sample's EMPTY version (lib/sample-mode.js). Reviewing the pattern happens here;
  // meeting it happens on the module's own page.
  //
  // The block used to carry a second half of templates. It does not any more — the
  // create flow (/create) and the Marketplace are where a starting point is picked,
  // and each gate here routes into the one that owns it. The argument is in
  // src/product-empty-states.js.
  //
  // ── WHAT IS NOT HERE ──
  //
  // No progress bar, no checklist, no dismiss. Nothing on this screen has to be
  // completed, and nothing needs a "seen" flag: the whole block is gone the moment
  // the module owns its first resource, so the DATA retires the guidance. That is
  // the same reason there is no tour — the reader is already on the real page, with
  // the real navigation, and the only thing missing is the first resource.
  import Button from '@aziontech/webkit/button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import { computed, ref } from 'vue'

  import ProductFirstUse from '../../components/home/ProductFirstUse.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { productEmptyStates, productOptions } from '../../lib/data/product-empty-states'

  // Functions opens the page: it is the product the screen was designed against,
  // and the one where "start from a template" carries the most weight.
  const selected = ref(productEmptyStates[0].id)
  const current = computed(
    () =>
      productEmptyStates.find((product) => product.id === selected.value) ?? productEmptyStates[0]
  )

  // Dropdown emits (event, value).
  //
  // `swapped` is what earns the block its entrance: the FIRST render arrives with the
  // page (the route transition carries it), and every render after that is a change
  // inside a page already on screen, which is what `animate-content-enter` is for. Without
  // the distinction the block rose through the page's own slide on arrival — see the
  // note in ui/ProductFirstUse.vue.
  const swapped = ref(false)

  const onProduct = (event, value) => {
    selected.value = value
    swapped.value = true
  }
</script>

<template>
  <AppLayout
    active=""
    :breadcrumb="[{ label: 'Empty states' }, { label: current.label }]"
  >
    <!-- The gallery only ever holds first use, so it takes the focused measure
         unconditionally — the same width the block gets on a module's own page and
         on /home. A review surface that showed the pattern 700px wider than its two
         real homes would be reviewing something nobody sees. -->
    <main class="layout-column-focused flex min-h-full flex-col">
      <!-- ── HOME'S CONTAINER ──
           The same box the first access uses on /home (./HomeEmptyState.vue): centred in
           the viewport rather than hanging from the top edge, with the section step
           between the heading and the block. This screen and that one are the same KIND of
           screen — a short block answering "there is nothing here yet" — and a short block
           pinned to the top with a void under it reads as content that failed to load.
           CENTRED WITH AUTO MARGINS: `min-h-full` resolves against a parent whose height is
           itself `auto`, so it never applied and `justify-center` only centred the content
           inside a content-height box. `my-auto` splits the flex parent's free space above
           and below, and collapses to 0 when the content is taller than the viewport
           instead of clipping its top. -->
      <div
        class="my-auto flex w-full flex-col gap-(--layout-section-gap) py-(--spacing-xl)"
      >
        <!-- ── HOME'S HEADING ──
             A centred hero, not the left-aligned PageHeading a module list carries, for the
             same reason home's first access is centred: there is no table, no toolbar and no
             second column here to align a left edge against, so a heading pinned left leaves
             the page reading as if something were missing beside it. It also puts the product
             picker where the reader is already looking — under the sentence that told them a
             product is being picked — instead of on the far right of a heading row.
             The h1 is the PAGE's claim and never the product's headline: the block below
             already opens with "Deploy your first Function", and two headings saying the same
             thing one above the other is the first thing this pattern removed (see the note
             in ui/ProductFirstUse.vue). -->
        <div
          class="animate-content-enter motion-reduce:animate-none flex flex-col items-center gap-(--spacing-lg)"
        >
          <div
            class="flex max-w-(--container-2xl) flex-col items-center gap-(--spacing-xs)"
          >
            <p class="text-center text-body-md text-(--text-muted)">Empty states</p>
            <h1 class="text-balance text-center text-heading-lg text-(--text-default)">
              What a product shows before it owns anything.
            </h1>
            <p class="text-pretty text-center text-body-sm text-(--text-muted)">
              What the product is, and the gates into it — each one opening the create flow that
              already owns it. Switch the product to see the same block asked in its own terms.
            </p>
          </div>

          <!-- The same control Home uses to swap resources, labelled with the
               product in force so the button states the context instead of only
               offering to change it. Centred under the hero, so `bottom` rather than
               `bottom-end`: the panel opens on the trigger's own axis. -->
          <Dropdown
            placement="bottom"
            @select="onProduct"
          >
            <Dropdown.Trigger>
              <Button
                :label="current.label"
                :icon="current.icon"
                kind="outlined"
                size="medium"
              />
            </Dropdown.Trigger>

            <Dropdown.Group label="Product">
              <Dropdown.Option
                v-for="option in productOptions"
                :key="option.value"
                :value="option.value"
                :label="option.label"
                :selected="selected === option.value"
              >
                <template #left>
                  <i
                    :class="option.icon"
                    class="text-(--text-muted)"
                    aria-hidden="true"
                  />
                </template>
                <template
                  v-if="selected === option.value"
                  #right
                >
                  <i
                    class="pi pi-check text-(--text-default)"
                    aria-hidden="true"
                  />
                </template>
              </Dropdown.Option>
            </Dropdown.Group>
          </Dropdown>
        </div>

        <!-- The block itself lives in ui/ProductFirstUse.vue: this page is the
             gallery around it (a product picker), and the same block is what
             /applications, /workloads and /functions render in the sample's EMPTY
             version (../lib/sample-mode.js). One copy, two homes.

             One card wide now, not two halves — see the note in that file.

             No `layout-section-start` any more: the container above carries that step as a
             `gap`, and a margin here would add to it and land the block at twice the
             distance. -->
        <ProductFirstUse
          :key="current.id"
          :product="current"
          :enter="swapped"
        />
      </div>
    </main>
  </AppLayout>
</template>
