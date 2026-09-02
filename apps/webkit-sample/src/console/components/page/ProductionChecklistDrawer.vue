<script setup>
  // THE PRODUCTION CHECKLIST, EXPANDED — the same steps as the band on the page, with
  // everything the band deliberately leaves out: what each step is for, what satisfied
  // the ones already done, and the control that starts the one you pick.
  //
  // ── WHY A SECOND SURFACE AT ALL ──
  //
  // The band on the page had to be two things at once and could only be one well: a
  // GLANCE ("how far from production am I?") and a BRIEF ("what is a custom domain for,
  // and what happens if I skip it?"). Carrying both made every row three lines tall, so
  // three steps ate the top of the Overview above the topology they are about. Splitting
  // them lets the band shrink to a count and five labels, and lets the brief have the
  // room it actually needs — a paragraph per step, and the step's own control under it.
  //
  // ── A DRAWER, AND THE BIGGEST ONE ──
  //
  // `large` (1024px, full viewport height): this is reading, not a form. It is a drawer
  // and not a dialog because it belongs to the resource behind it — the reader is still
  // on this workload, and the page stays visible at the edge the whole time
  // (`docs/surfaces.js`: a dialog is for the thing that must be answered before anything
  // else, and a checklist never is).
  //
  // ── A STEP IS A CARD, NOT A ROW ──
  //
  // Each step is an outlined `Item`: the glyph, the name, the sentence, and — in the
  // footer, on its own line — the control that starts it. A row could hold the first
  // three and would then have to put the act somewhere; as a card the act sits under the
  // words that argue for it, which is the order the reader needs them in.
  //
  // WHAT A DONE CARD TURNS INTO: the primary mask fills it, its border goes primary, the
  // name and the sentence are LINED THROUGH, and the button is replaced by a Tag holding
  // the fact that satisfied it — the domain, the firewall's name. Struck-through text and
  // a filled card say "settled" faster than any word, and the tag then says which. The
  // card is still a control: it is how a reader gets back to the thing they configured.
  //
  // ── IT HOLDS NOTHING ──
  //
  // Same contract as the band: `done` is passed in, derived by the page from the state it
  // already renders. There is no Skip and no "mark as done" — a stored claim would
  // survive the reader undoing the work, and a production gate that lies is worse than no
  // gate. The only writes this surface makes are the ones the reader performs for real.
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Item from '@aziontech/webkit/item'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  const open = defineModel('open', { type: Boolean, default: false })

  const props = defineProps({
    // The band's own name, repeated here so the two surfaces are visibly one thing.
    title: { type: String, default: 'Ship to production' },
    // One line under the title on what the list is for.
    description: { type: String, default: '' },
    // The same array the band renders, plus `actionLabel` — the verb of the control a
    // pending card offers. Each step:
    //   { id, icon, title, description, done, doneNote?, actionLabel? }
    steps: { type: Array, default: () => [] }
  })

  const emit = defineEmits(['action'])

  const doneCount = computed(() => props.steps.filter((step) => step.done).length)
  const complete = computed(() => props.steps.length > 0 && doneCount.value === props.steps.length)

  // THE DRAWER CLOSES FIRST, then the page acts. Every step's act lands somewhere on the
  // page behind this one — another drawer, a scroll to the topology — and a surface that
  // stayed open would either cover it or scroll a page nobody can see.
  const act = (step) => {
    open.value = false
    emit('action', step)
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="right"
  >
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
            <div class="flex min-w-0 items-center gap-(--spacing-sm)">
              <DrawerTitle>{{ title }}</DrawerTitle>
              <!-- The same count the band wears, so the reader who pressed expand does
                   not have to re-find their place. -->
              <Tag
                :label="complete ? 'Ready for production' : `${doneCount} of ${steps.length}`"
                :severity="complete ? 'success' : 'secondary'"
                size="small"
                class="shrink-0"
              />
            </div>
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
          <div class="flex flex-col gap-(--spacing-sm)">
            <!-- KEYED ON THE STATE, not just the id: a card that completes has to be a
                 new card, or the glyph and the struck line lag a step behind the header
                 count (same reason the band keys its rows this way). -->
            <!-- The card draws its OWN surface rather than taking `kind="outline"`: that
                 kind's `bg-(--bg-surface)` and the done state's `bg-(--primary-mask)` are
                 both one-attribute selectors, so they tie on specificity and the winner is
                 whichever Tailwind happens to emit last — which is how the mask silently
                 did nothing on the first pass. One source for the fill, no tie. -->
            <Item
              v-for="step in steps"
              :key="`${step.id}:${step.done ? 'done' : 'todo'}`"
              size="medium"
              :data-done="step.done || null"
              class="rounded-(--shape-card) border-(--border-muted) bg-(--bg-surface) transition-colors duration-fast-02 ease-productive-entrance data-done:border-(--primary) data-done:bg-(--primary-mask) motion-reduce:transition-none"
            >
              <Item.Media>
                <!-- The 32px glyph box, drawn here rather than with `Item.Media
                     kind="icon"`: that kind hard-codes the muted chip fill, and on a
                     card wearing the primary mask a grey chip is the one thing that
                     still looks pending. Same box either way, so nothing shifts when a
                     step completes — the fill and the glyph carry the change. -->
                <span
                  class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface) text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance group-data-done/item:border-(--primary) group-data-done/item:bg-transparent group-data-done/item:text-(--primary) motion-reduce:transition-none"
                  aria-hidden="true"
                >
                  <i
                    :class="step.done ? 'pi pi-check' : step.icon"
                    class="text-[0.875rem] leading-none"
                  />
                </span>
              </Item.Media>

              <Item.Content>
                <Item.Title
                  class="group-data-done/item:text-(--primary) group-data-done/item:line-through"
                >
                  {{ step.title }}
                </Item.Title>
                <Item.Description
                  class="group-data-done/item:text-(--primary) group-data-done/item:line-through"
                >
                  {{ step.description }}
                </Item.Description>
              </Item.Content>

              <!-- The act, on its own line under the sentence that argues for it —
                   `Item.Footer` is `basis-full`, so it wraps to a row of its own and
                   starts at the card's left edge. -->
              <Item.Footer>
                <!-- DONE: the fact, as a tag — WHICH domain, WHICH firewall. `secondary`
                     and not `primary`: a primary tag is the same mask-plus-primary-ink pair
                     the whole card is already wearing, so it dissolved into the fill. The
                     struck title is decoration and can afford to be faint; this line is the
                     one piece of real information on a finished card, so it gets the
                     neutral chip that stays legible on the mask. -->
                <Tag
                  v-if="step.done"
                  icon="pi pi-check"
                  :label="step.doneNote || 'Done'"
                  severity="secondary"
                  size="medium"
                />
                <!-- PENDING: the verb, and the SAME control the step leads to — the
                     topology's own empty slots offer `outlined` + `pi pi-plus` for exactly
                     these acts, so the brief and the thing it opens look alike. Outlined
                     also keeps a column of them quiet: there are as many of these as there
                     are steps, and none of them is the page's primary act. -->
                <Button
                  v-else
                  :label="step.actionLabel || step.title"
                  kind="outlined"
                  size="small"
                  @click="act(step)"
                />
              </Item.Footer>
            </Item>
          </div>
        </PanelContent>

        <!-- One control, and it only dismisses: nothing on this surface is pending a
             commit, so a Save would have nothing to save. -->
        <PanelFooter class="justify-end">
          <Button
            label="Done"
            kind="primary"
            size="medium"
            @click="open = false"
          />
        </PanelFooter>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
