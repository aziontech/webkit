<script setup>
  // THE PRODUCTION CHECKLIST — what is still between this resource and production,
  // counted, in one band at the top of the page.
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
  // ── THE BAND IS A GLANCE; THE DRAWER IS THE BRIEF ──
  //
  // This used to be one surface doing two jobs. Every row carried the step's name AND a
  // sentence on what it is for, which made three steps a three-paragraph wall sitting
  // above the topology those steps are about — and the reader who only wanted to know
  // "how far am I?" had to read all of it to find out.
  //
  // So the band answers only that: a count, and one line per step — GLYPH AND LABEL, no
  // sentence, no chevron. Everything the sentence used to say now lives one press away,
  // in the expand control on the header (./ProductionChecklistDrawer.vue), where each
  // step is a card with its paragraph and its own button. The band is a table of
  // contents; the drawer is the chapter.
  //
  // Because that expand control has to live in the header, the header is no longer an
  // accordion trigger — the DS trigger is the whole header row, and a button inside a
  // button is neither valid nor operable. The fold went with it, and is not missed: at
  // one line per step the band is now shorter closed-and-labelled than the old one was
  // folded, so there is nothing left to fold away.
  //
  // ── AND IT RETIRES ITSELF WHEN THERE IS NOTHING LEFT ──
  //
  // At 3 of 3 every row wears the mask, and three masked rows stacked make the finished
  // band the loudest thing on a page whose real content is below it — the exact opposite
  // of what a settled question should do. So a complete band keeps only its header: the
  // title, a success tag saying "Ready for production", and the expand control. Nothing
  // is lost — the steps are still the way back to what was configured, and the drawer is
  // now the door to them.
  //
  // ── WHAT A DONE STEP LOOKS LIKE ──
  //
  // Lined through, on the primary mask, in primary ink, with a check at the end of the
  // row. Not a green fill: green is the console's word for "this is healthy right now"
  // (StatusIndicator, deploy outcomes), and a finished checklist step is not a health
  // reading — it is a thing crossed off. The strike-through is what says that, and the
  // mask is what makes it visible from across the page. The row stays pressable: it is
  // how the reader gets back to the thing they configured.
  import CardBox from '@aziontech/webkit/card-box'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  import ProductionChecklistDrawer from './ProductionChecklistDrawer.vue'

  const props = defineProps({
    // The band's own name.
    title: { type: String, default: 'Ship to production' },
    // One line for the drawer's header — the band itself has no room for it, which is
    // the whole point of the split.
    description: { type: String, default: '' },
    // The steps, in the order they are worth doing. Each one:
    //   { id, icon, title, description, done, doneNote?, actionLabel? }
    // `description` / `doneNote` / `actionLabel` are read only by the drawer; the band
    // shows the glyph and the title.
    steps: { type: Array, default: () => [] }
  })

  // The step the reader pressed, from either surface. The BAND does not know what any of
  // them do — the page that owns the state owns the act, the same way a `Section` owns
  // none of its fields.
  const emit = defineEmits(['action'])

  // The brief. Owned here rather than by the page because the control that opens it is
  // this component's header: nothing outside needs to address it.
  const detailOpen = ref(false)

  const doneCount = computed(() => props.steps.filter((step) => step.done).length)
  const complete = computed(() => props.steps.length > 0 && doneCount.value === props.steps.length)
</script>

<template>
  <!-- Flush: the rows carry their own `--spacing-md` inset, the same one the card header
       uses, so a step's glyph sits on the vertical line the band's title starts on.

       `data-complete` + the child-header override: a complete band renders no rows, and
       the header's bottom rule would then be a line drawn across the bottom of an empty
       card. The variant is a targeted reach into CardBox's own header because the card
       exposes no "headerless-bottom" prop and this is the one place that needs it. -->
  <CardBox
    :padded="false"
    :data-complete="complete || null"
    class="data-complete:[&>header]:border-b-0"
  >
    <template #header>
      <div class="flex min-w-0 flex-1 items-center gap-(--spacing-sm)">
        <!-- `h2`: the band names a section of the page, so it is a real heading in the
             outline. -->
        <h2 class="truncate text-label-md text-(--text-default)">{{ title }}</h2>

        <!-- THE COUNT, and it changes what it claims when it reaches the end: "Ready for
             production" is the verdict, and the reader who finished does not need to do
             the arithmetic to learn they are finished. -->
        <Tag
          :label="complete ? 'Ready for production' : `${doneCount} of ${steps.length}`"
          :severity="complete ? 'success' : 'secondary'"
          size="small"
          class="shrink-0"
        />
      </div>

      <!-- THE ONE CONTROL ON THE HEADER, and it is the way to everything the band leaves
           out. Icon-only because the header already names what it expands, and `outlined`
           so it reads as a control on a row that is otherwise all text. -->
      <IconButton
        icon="pi pi-window-maximize"
        aria-label="Expand the production checklist"
        kind="outlined"
        size="small"
        class="shrink-0"
        @click="detailOpen = true"
      />
    </template>

    <template #content>
      <div
        v-if="!complete"
        class="flex flex-col"
      >
        <!-- as-child: the row shell (layout + hover ghost + focus ring) is merged onto
             the button, so each step is one real control instead of a <div> wrapping one.
             A step is an ACT on the page that owns it — open the drawer, scroll to the
             bind node — never a link, so it is a <button>. -->
        <!-- KEYED ON THE STATE, not just the id. `as-child` renders the merged row
             through a functional component, and a functional component is not re-rendered
             when only its parent's SLOT CONTENT changes (no props, no children on that
             vnode, so Vue's shouldUpdateComponent says no) — the row's vnode is cloned
             once and then frozen. Without the state in the key a step that completed kept
             its pending look while the header count next to it said "1 of 3". The key
             makes the completed row a new row. -->
        <Item
          v-for="step in steps"
          :key="`${step.id}:${step.done ? 'done' : 'todo'}`"
          as-child
          size="small"
        >
          <button
            type="button"
            :data-done="step.done || null"
            class="w-full rounded-none text-left transition-colors duration-fast-02 ease-productive-entrance data-done:bg-(--primary-mask) motion-reduce:transition-none"
            @click="emit('action', step)"
          >
            <Item.Media>
              <!-- The step's OWN glyph either way — it is what the step is about, and
                   swapping it for a check on completion costs the row its identity. The
                   state is said by the ink, the line and the check at the far end. -->
              <i
                :class="step.icon"
                class="text-[0.875rem] leading-none text-(--text-muted) group-data-done/item:text-(--primary)"
                aria-hidden="true"
              />
            </Item.Media>

            <Item.Content>
              <Item.Title
                class="truncate group-data-done/item:text-(--primary) group-data-done/item:line-through"
              >
                {{ step.title }}
              </Item.Title>
            </Item.Content>

            <Item.Actions>
              <!-- The check is the state, and it is the only thing on the row that is
                   not there when the step is pending — so a reader scanning the right
                   edge counts what is done without reading a word. -->
              <i
                v-if="step.done"
                class="pi pi-check text-[0.875rem] leading-none text-(--primary)"
                aria-hidden="true"
              />
              <span class="sr-only">{{ step.done ? 'Done' : 'Not started' }}</span>
            </Item.Actions>
          </button>
        </Item>
      </div>
    </template>
  </CardBox>

  <ProductionChecklistDrawer
    v-model:open="detailOpen"
    :title="title"
    :description="description"
    :steps="steps"
    @action="emit('action', $event)"
  />
</template>
