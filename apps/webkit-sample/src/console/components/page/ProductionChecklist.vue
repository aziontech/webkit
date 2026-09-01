<script setup>
  // THE PRODUCTION CHECKLIST — what is still between this resource and production,
  // counted, in one band that retires itself when there is nothing left in it.
  //
  // ── WHY A CHECKLIST AND NOT A LIST OF LINKS ──
  //
  // A resource create can only ask what it needs to create the thing. The rest of what
  // makes it production-ready — a domain of the reader's own, a firewall in front of it,
  // a page to answer a 5xx with — is not part of creating it and must not be forced into
  // the create; but it is also not something to leave the reader to discover. So it
  // becomes a band on the resource's own page, and it is a CHECKLIST rather than a row
  // of documentation links because the two differ in the only way that matters here: a
  // checklist knows what is already done.
  //
  // ── THE STATE IS DERIVED, NEVER CLICKED ──
  //
  // A step is done because the thing it asks for EXISTS — a custom domain is on the
  // workload, a firewall is bound — not because somebody pressed the button once. A
  // stored "I did this" is a claim that survives the reader undoing the work, and a
  // checklist that lies about the state of a production gate is worse than no checklist.
  // So this component holds nothing: the caller passes `done` per step, computed from
  // the same state the rest of the page renders from, and the count follows.
  //
  // ── IT IS THE "NEXT STEPS" LIST, THE SAME ONE ──
  //
  // The rows are the anatomy the deploy outcome already uses for exactly this job
  // (../../pages/applications/wizard/DeploySuccess.vue § Next steps): a 32px glyph box,
  // the step's name, one line of what it is for, and a chevron — one Item per step, the
  // whole row a control. Both screens answer the same question ("what now?"), so they
  // are one pattern and not two. What used to be here — three columns, each with its own
  // outlined Button under a paragraph — said "three forms" where the answer is a list,
  // and it was the only list on the console that did.
  //
  // WHAT A DONE STEP TURNS INTO: not a struck-through row. The glyph becomes a check on
  // the success fill, and the description is replaced by the FACT that satisfied it
  // (`doneNote` — the domain, the firewall's name), because the reader coming back wants
  // to know WHICH domain, not that a domain exists. The row stays pressable: it is how
  // they get back to the thing they configured.
  //
  // ── AND IT COLLAPSES WHEN IT IS FINISHED ──
  //
  // A band still open at 3 of 3 is a wall of settled questions above the page's real
  // content. It does not disappear — the steps are still the way back in, and a vanished
  // band would take the record of them with it — it just arrives closed once there is
  // nothing left to do, and says so in the header.
  //
  // The disclosure is the DS Accordion, stock: one item, the default trigger, the
  // default panel. It replaces a hand-rolled `grid-template-rows` collapse that had to
  // re-implement the trigger, the chevron, the rotation, the `aria-expanded`/`inert`
  // pair and the animation this component gets for free. The one thing the hand-rolled
  // version bought — a count that sat OUTSIDE the button, so a reader could rest on it
  // without standing on a control — is what the stock trigger costs: it owns the whole
  // header row. Cheap at the price of not owning an accordion.
  import Accordion from '@aziontech/webkit/accordion'
  import Item from '@aziontech/webkit/item'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref, watch } from 'vue'

  const props = defineProps({
    // The band's own name.
    title: { type: String, default: 'Ship to production' },
    // The steps, in the order they are worth doing. Each one:
    //   { id, icon, title, description, done, doneNote? }
    steps: { type: Array, default: () => [] }
  })

  // The step the reader pressed. The BAND does not know what any of them do — the page
  // that owns the state owns the act, the same way a `Section` owns none of its fields.
  const emit = defineEmits(['action'])

  // The single item's value. One panel, so the name is a constant rather than a prop:
  // nothing outside this file addresses it.
  const PANEL = 'production'

  const doneCount = computed(() => props.steps.filter((step) => step.done).length)
  const complete = computed(() => props.steps.length > 0 && doneCount.value === props.steps.length)

  // Open while there is something to do. Controlled (`v-model:value`) and seeded from the
  // first read, then steered by the watch below, so the reader's own toggle survives a
  // step completing.
  const openPanel = ref(complete.value ? null : PANEL)

  // FINISHING THE LAST STEP CLOSES THE BAND, and only that transition does. A band that
  // re-closed on every render would fight a reader who opened it to look something up.
  watch(complete, (next, previous) => {
    if (next && !previous) openPanel.value = null
  })
</script>

<template>
  <!-- The Accordion IS the card: it draws the box, its trigger draws the header (and,
       open, the rule under it), its panel holds the rows. `border-b-0` on the item
       because the item's own bottom rule is what separates it from the NEXT item, and
       there is no next item — closed, it would double the card's own bottom border. -->
  <Accordion
    v-model:value="openPanel"
    type="single"
    collapsible
    size="large"
    class="overflow-clip rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
  >
    <Accordion.Item
      :value="PANEL"
      class="border-b-0"
    >
      <!-- `level="2"`: the band names a section of the page, so it is a real heading in
           the outline, not a styled button. The title wears the card-header type
           (`text-label-md`) because that is what this row is. -->
      <Accordion.Trigger :level="2">
        <span class="flex min-w-0 flex-1 items-center justify-between gap-(--spacing-sm)">
          <span class="truncate text-label-md text-(--text-default)">{{ title }}</span>

          <!-- THE COUNT, and it changes what it claims when it reaches the end: "3 of 3
               steps complete" is a score, and the reader who finished does not need to
               do the arithmetic to learn they are finished. -->
          <Tag
            :label="
              complete ? 'Ready for production' : `${doneCount} of ${steps.length} steps complete`
            "
            :severity="complete ? 'success' : 'secondary'"
            size="small"
            class="shrink-0"
          />
        </span>
      </Accordion.Trigger>

      <!-- The panel is flush by contract — the DS pads its trigger and leaves the panel
           to the consumer — and it needs no inset here: the rows carry their own, the
           same `--spacing-md` the trigger uses, so a step's glyph box lines up under the
           band's title. -->
      <Accordion.Content>
        <Item.List>
          <!-- as-child: the row shell (layout + hover ghost + focus ring) is merged onto
               the button, so each step is one real control instead of a <div> wrapping
               one. A step is an ACT on the page that owns it — open the drawer, scroll
               to the bind node — never a link, so it is a <button>. -->
          <!-- KEYED ON THE STATE, not just the id. `as-child` renders the merged row
               through a functional component, and a functional component is not
               re-rendered when only its parent's SLOT CONTENT changes (no props, no
               children on that vnode, so Vue's shouldUpdateComponent says no) — the
               row's vnode is cloned once and then frozen. Without the state in the key
               a step that completed kept its pending glyph and its pending sentence
               while the header count next to it said "1 of 3". The key makes the
               completed row a new row. -->
          <Item
            v-for="step in steps"
            :key="`${step.id}:${step.done ? 'done' : 'todo'}`"
            as-child
            size="small"
          >
            <button
              type="button"
              class="w-full text-left"
              @click="emit('action', step)"
            >
              <Item.Media>
                <!-- The same 32px box either way, so the row does not shift when a step
                     completes — the fill and the glyph carry the change. `aria-hidden`:
                     the done state is said in words by the note below it. -->
                <span
                  :data-done="step.done || null"
                  class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface) text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance data-done:border-transparent data-done:bg-(--success) data-done:text-(--success-contrast) motion-reduce:transition-none"
                  aria-hidden="true"
                >
                  <i
                    :class="step.done ? 'pi pi-check' : step.icon"
                    class="text-[0.875rem] leading-none"
                  />
                </span>
              </Item.Media>

              <Item.Content>
                <Item.Title>{{ step.title }}</Item.Title>
                <!-- WHAT IT IS FOR, or — once it is done — WHAT SATISFIED IT. The second
                     is the more useful sentence to come back to: a reader returning to a
                     finished step is checking which domain, not re-reading why domains
                     matter. -->
                <Item.Description>
                  {{ step.done ? (step.doneNote ?? 'Done.') : step.description }}
                </Item.Description>
              </Item.Content>

              <Item.Actions>
                <i
                  class="pi pi-chevron-right text-(--text-muted)"
                  aria-hidden="true"
                />
              </Item.Actions>
            </button>
          </Item>
        </Item.List>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
</template>
