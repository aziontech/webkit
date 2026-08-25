<script setup>
  // The feature matrix — what every tier includes, product by product.
  //
  // This is the substance of the pricing page: nine product sections, ~100 rows, three
  // columns of allowances. It is a real `<table>`, not a grid of divs, because that is
  // what it is: a screen reader announcing "Requests, Pro, 20M / mo included" is the
  // whole point of the screen, and no amount of `role="cell"` gets there as cheaply as
  // the element that already means it.
  //
  // ── THE FRAME, DRAWN EXACTLY ONCE (CONTAINERS.md) ──
  //
  // `border-separate` rather than the browser default `collapse`: a sticky header cell
  // loses its borders under `collapse` in every engine, and separated borders force the
  // one-rule-per-edge discipline the framed grid already asks for. So each edge has one
  // owner:
  //
  //   • the plan header row      → its own `border-b` (its top edge is the cards band's floor)
  //   • the vertical column rules → `border-l` on columns 2–4, drawn by every cell, which is
  //                                 what makes them read as continuous rules down the page
  //   • a section band            → `border-t` (except the first, under the header's rule)
  //                                 and `border-b` dividing its copy from its rows
  //   • a group row               → `border-t`, except the first in a section
  //   • the closing link row      → `border-y` (the table's own last line, and its floor)
  //
  // Rows INSIDE a group draw nothing: a group is one block of related allowances, and a
  // hairline between every line turns the matrix into graph paper. That is the real
  // page's own rhythm and the reason it stays readable at 100 rows.
  //
  // ── THE RHYTHM AND THE TYPE SCALE ──
  //
  // Both come from vercel.com/pricing, whose matrix solves the same problem at the same
  // scale, measured off the rendered page rather than guessed:
  //
  //   • a row is `py-4` + a 20px line → 52px. Ours is `py-(--spacing-md)` + `text-label-md`
  //     (14/21) → 53px. The size token goes on the CELL, not on a span inside it: the
  //     table's own 16/24 line box was setting the row height, so a 14px value sat in a
  //     24px line and every row was 56px.
  //   • ONE size AND one weight for the whole matrix — 14px, regular. A header is never
  //     bold — and note that costs an explicit `font-normal` on every `th`, because the UA
  //     stylesheet sets `th { font-weight: bold }` and `text-overline-md` declares no
  //     weight of its own, so `FEATURES` rendered at 700 the moment it stopped being a
  //     heading. It goes on the CELL, not the text: an inherited weight loses to a child's
  //     own token, so this can never override a `text-*` bundle that does set one.
  //     Beyond that: a group row is the same 14px regular in full contrast, a row under it 14px
  //     regular and muted, and the group's own `border-t` says where the block opens.
  //     CONTRAST carries the hierarchy, not size and not weight — which is what the
  //     typography rule means by never inverting the scale: you cannot add emphasis by
  //     reaching outside the token, only by changing which token (or which text colour)
  //     you are in.
  //   • the allowances are CENTRED and at full contrast, the labels muted. The reader came
  //     to compare three columns of numbers, so the numbers are the figure and the label is
  //     the ground — and centring is what lets the eye track one plan down 89 rows.
  //   • the HEADER is not: a plan name is a heading, and a heading STARTS. `Hobby` centred
  //     over its column sat on no line the page draws anywhere else, and its button sat
  //     centred under it, so the top of the matrix read as three floating stacks over a
  //     grid. Start-aligned, the three names land on the same rule as `Features` and every
  //     band title below them.
  //   • a band is a 24px title (`text-heading-md`) over a description capped at `max-w-md`,
  //     not a full-width line: at 1190px a one-sentence description that runs the whole
  //     table reads as a rule, not as prose.
  //
  // ── ONE PROPORTIONAL BOX, ONE START LINE ──
  //
  // Every cell that holds copy takes `--spacing-lg` — the SAME token on all four sides
  // (`p-(--spacing-lg)`), not one scale across and another down. A cell padded `xl` at the
  // sides and `xxl` on top is not a box, it is two decisions: at ≥1280 that reads 48 across
  // against 96 down, so the band floated in a field of space while its own rows sat tight
  // against the rule above them. One token per box keeps the ratio fixed at every
  // breakpoint, because the token itself is what steps.
  //
  // And it is the same token in every box, so the whole matrix has ONE start line:
  // `Features`, each plan name and its button, every band's eyebrow / title / description,
  // every row label, and the on-demand link all begin at `--spacing-lg` from their own
  // column's edge. The 89 value cells are the one exception — their content is centred, so
  // their `--spacing-sm` is clearance from the vertical rules and nothing else.
  //
  // A row under a group row is NOT indented. Its label is the same level of hierarchy as
  // the group that opens it, distinguished by text COLOUR alone (full contrast vs. muted)
  // plus the rule the group draws — so an extra `--spacing-xs` of inset bought a second,
  // weaker signal for something already said, and cost the column the one straight edge it
  // is read down.
  //
  // `Features` is the same reasoning applied to the sticky header: it names the column, it
  // does not head the page, so it is `text-overline-md` and muted — the quietest token on
  // the page — while the three plan names it sits beside keep `text-heading-md` in full
  // contrast, because THEY are what the reader is choosing between.
  //
  // ── BELOW `lg`, ONE PLAN AT A TIME ──
  //
  // Four columns do not fit a phone, and a horizontally scrolling table would break the
  // sticky header (the scroll container becomes the sticky ancestor, and it does not
  // scroll vertically). So the matrix keeps two columns below `lg` — the feature and ONE
  // plan — and a Select in the sticky header picks which. The unselected columns are
  // `hidden lg:table-cell`, so this is one table rendered once, not a second mobile copy
  // of a hundred rows.
  //
  // The picker is a Select and not the three-chip SegmentedButton it started as, because
  // a segmented control's width is the sum of its options: three plan names held the
  // header cell at 228px, which pushed the table to 391px inside a 375px viewport — the
  // page scrolled sideways and the plan's own CTA was cut off at the right edge. A select
  // costs one control at one width whatever the tier count, and the table lands at 373.
  //
  // It also collapses the header to ONE row below `lg`: the select already names the
  // column it drives, so `Features` and the plan's own name go `max-lg:sr-only` rather
  // than printing `Pro` twice side by side. Screen-reader-only, not removed — they are
  // what give each `<th scope="col">` its accessible name for the hundred rows under it.
  // The header goes 105px → 73px, and the select sits on the same line as the CTA.
  //
  // The layout algorithm has to switch with it: `table-fixed` builds its column grid from
  // the row with the most cells and keeps a slot for every one of them, so a hidden column
  // still takes its quarter of the width — two visible columns then crowd into the left
  // half of the table and the right half is blank. So the matrix is `table-auto` below `lg`
  // (the two live columns share the full width) and `table-fixed` from `lg` up (four equal
  // columns, so a long allowance wraps instead of stretching its column).
  import Button from '@aziontech/webkit/button'
  import Hint from '@aziontech/webkit/hint'
  import Link from '@aziontech/webkit/link'
  import Select from '@aziontech/webkit/select'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  const props = defineProps({
    // The tiers, in column order — the PLANS entries from ../data/pricing.js.
    plans: {
      type: Array,
      required: true
    },
    // The product sections, each with its own band copy and its rows.
    sections: {
      type: Array,
      required: true
    },
    // The table's ONE hand-off to the per-unit rates, rendered as its closing row.
    // `{ label, href }`, or null for a table that ends on its last comparison row.
    link: {
      type: Object,
      default: null
    }
  })

  const emit = defineEmits(['select'])

  // Which single plan the narrow layout shows. Defaults to the recommended tier, since
  // that is the column a reader arriving on a phone is most likely comparing against.
  const visiblePlan = ref((props.plans.find((plan) => plan.highlighted) ?? props.plans[0]).id)

  const planOptions = computed(() =>
    props.plans.map((plan) => ({ label: plan.name, value: plan.id }))
  )

  // The trigger reads the tier's NAME while the model carries its id, so the control says
  // `Pro` and not `pro` from the first paint — before the options have registered.
  const planName = (id) => props.plans.find((plan) => plan.id === id)?.name ?? ''

  // A column is present below `lg` only when it is the picked one. Above `lg` every
  // column is present, so the class is the whole responsive behaviour.
  const columnClass = (plan) => (plan.id === visiblePlan.value ? '' : 'hidden lg:table-cell')

  // A hint glyph is laid out inline so it hangs after the label's final word (see the
  // template). Inline flow has one failure mode: when the label wraps and the last word
  // exactly fills its line, the glyph alone falls to the next one and reads as a stray
  // bullet at the row's indent — "Role-Based Access Control (RBAC)" did it in a 297px
  // column. Splitting the label at its last space lets that word and the glyph share a
  // `whitespace-nowrap` box, so they wrap together or not at all. A single-word label
  // yields an empty head and is unaffected.
  const labelHead = (label) => label.slice(0, label.lastIndexOf(' ') + 1)
  const labelTail = (label) => label.slice(label.lastIndexOf(' ') + 1)
</script>

<template>
  <div class="w-full">
    <table
      class="w-full table-auto border-separate border-spacing-0 text-left lg:table-fixed"
      data-testid="pricing-comparison"
    >
      <caption class="sr-only">
        Feature and included-usage comparison across the Hobby, Pro and Enterprise plans.
      </caption>

      <!-- The plan header. Each cell is individually sticky (a `<thead>` cannot be, and a
           `<tr>` only can in some engines), pinned under the site nav's 3.5rem bar, and
           opaque so a hundred rows pass behind it rather than through it. -->
      <thead>
        <tr>
          <th
            scope="col"
            class="sticky top-14 z-20 border-b border-(--border-default) bg-(--bg-canvas) p-(--spacing-lg) align-top font-normal"
          >
            <span class="text-overline-md text-(--text-muted) max-lg:sr-only">Features</span>
            <!-- The narrow-layout plan picker lives with the header it re-labels, so the
                 control and the column it drives are never apart on screen. It stays in
                 THIS cell, which is present at every width: parked in the plan column it
                 would unmount itself mid-selection — that column is the one going
                 `display: none` — and take the focus the closing dropdown restores with
                 it. `large` so the trigger is the CTA's own 40px on the row beside it. -->
            <Select
              v-model="visiblePlan"
              :display-value="planName"
              size="large"
              class="w-full lg:hidden"
            >
              <Select.Trigger aria-label="Plan being compared" />
              <Select.Content>
                <Select.Option
                  v-for="option in planOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Option>
              </Select.Content>
            </Select>
          </th>
          <th
            v-for="plan in plans"
            :key="plan.id"
            scope="col"
            :class="[
              'sticky top-14 z-20 border-b border-l border-(--border-default) bg-(--bg-canvas) p-(--spacing-lg) align-top font-normal',
              columnClass(plan)
            ]"
          >
            <!-- The recommended tier is marked with a 2px accent bar on the column's top
                 edge — a filled element, never a border (DESIGN.md § Weights) — so the
                 highlight cannot thicken the frame's own hairline. -->
            <span
              v-if="plan.highlighted"
              class="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-(--border-selected)"
              aria-hidden="true"
            />
            <div class="flex h-full flex-col items-start gap-(--spacing-sm)">
              <span class="text-heading-md text-(--text-default) max-lg:sr-only">{{
                plan.name
              }}</span>
              <!-- Each column's CTA takes the tier's OWN kind, so `Start with Pro` is the
                   same button here as it is on the card above — one label cannot be the
                   brand fill in one place and a light fill in another on the same page. -->
              <Button
                :label="plan.action.label"
                :kind="plan.action.kind"
                size="large"
                class="w-full"
                @click="emit('select', plan)"
              />
            </div>
          </th>
        </tr>
      </thead>

      <!-- One `<tbody>` per product section: the band is that group's heading row, so the
           grouping is in the markup rather than only in the spacing. -->
      <tbody
        v-for="(section, sectionIndex) in sections"
        :key="section.title"
        :data-last="sectionIndex === sections.length - 1 || null"
      >
        <tr>
          <th
            scope="colgroup"
            colspan="4"
            :class="[
              'border-b border-(--border-default) p-(--spacing-lg) text-left font-normal',
              sectionIndex > 0 && 'border-t'
            ]"
          >
            <!-- No eyebrow. The page's `Overline` is the ORANGE opening line of a section
                 (`--primary`, `font-medium`); thirty of them down one table read as thirty
                 section openings competing with the single heading each band actually has,
                 and the colour pulls the eye off the plan columns the reader came for. The
                 title is the band's first line, so it carries no leading margin. -->
            <span class="block text-heading-md text-(--text-default)">
              {{ section.title }}
            </span>
            <span
              class="mt-(--spacing-xs) block max-w-md text-body-sm text-(--text-muted) md:text-body-md"
            >
              {{ section.description }}
            </span>
          </th>
        </tr>

        <!-- `data-closing` marks the row that is the matrix's own last, and it draws the
             floor — but only when nothing else will. With a closing link row the `<tfoot>`
             below owns that edge, so marking this row too would put two hairlines 1px
             apart at the end of a 105-row table. Without one the table would otherwise
             stop in mid-air and the section below it open against nothing. -->
        <tr
          v-for="(row, rowIndex) in section.rows"
          :key="`${section.title}-${rowIndex}-${row.label}`"
          :data-closing="
            !link && sectionIndex === sections.length - 1 && rowIndex === section.rows.length - 1
              ? true
              : null
          "
          class="group/row"
        >
          <th
            scope="row"
            :class="[
              'py-(--spacing-md) px-(--spacing-lg) text-left align-middle text-label-md font-normal',
              'group-data-[closing]/row:border-b group-data-[closing]/row:border-(--border-default)',
              // A group row opens a block, so it carries the rule — unless it is the
              // first, whose top edge is the band's own `border-b`. The rule and the
              // weight are the whole distinction; the rows under it are NOT indented.
              row.group && rowIndex > 0 && 'border-t border-(--border-default)',
              row.group ? 'text-(--text-default)' : 'text-(--text-muted)'
            ]"
          >
            <!-- INLINE FLOW, not flex. A label here is a sentence fragment that wraps
                 ("Role-Based Access Control (RBAC)"), and a flex row treats the whole
                 label as ONE item: the glyph beside it is pushed onto a line of its own,
                 which both looks like a bullet and grows the row to two lines. Laid out
                 inline, the glyph hangs after the final word wherever that word lands.
                 `align-middle` is what keeps it there without lifting the line box —
                 an `inline-flex` child sits on the BASELINE by default, and a 20px
                 affordance on the baseline of a 21px line grows the row. -->
            <span>
              <!-- The hint is the one-sentence definition of a term the row names but does
                   not explain — a product, a jargon abbreviation, a billing unit. It is an
                   enhancement, never the only place a number lives: every allowance the
                   reader has to compare is already stated in the three cells. Rows whose
                   label is plain English carry none, so the glyph keeps meaning
                   "there is something here you may not know".

                   The label is split at its last space (see `labelHead` / `labelTail`) so
                   the glyph and that final word share one `whitespace-nowrap` box and
                   cannot be separated by a wrap. -->
              <template v-if="row.hint"
                >{{ labelHead(row.label)
                }}<span class="whitespace-nowrap"
                  >{{ labelTail(row.label)
                  }}<Hint
                    :text="row.hint"
                    class="ml-(--spacing-xxs) align-middle" /></span
              ></template>
              <template v-else>{{ row.label }}</template>
              <!-- `Preview` is a fact about the product, not about a tier, so it sits on
                   the label and not in one of the three cells. -->
              <!-- `secondary` is the neutral bordered chip: `Preview` is a status label on
                   a product name, not a piece of information competing with the tier
                   values beside it, so it takes the quiet severity rather than the blue
                   `info` fill. -->
              <Tag
                v-if="row.tag"
                :label="row.tag"
                severity="secondary"
                size="small"
                class="ml-(--spacing-xs) align-middle"
              />
            </span>
          </th>
          <td
            v-for="(plan, planIndex) in plans"
            :key="plan.id"
            :class="[
              'border-l border-(--border-default) px-(--spacing-sm) py-(--spacing-md) text-center align-middle text-label-md text-(--text-default)',
              'group-data-[closing]/row:border-b',
              row.group && rowIndex > 0 && 'border-t',
              columnClass(plan)
            ]"
          >
            <!-- Three kinds of cell, and only three: included (a check), not offered (an
                 em dash), or the stated allowance. Each of the two glyphs carries its own
                 screen-reader text, because a tick and a dash are the two cells whose
                 meaning is entirely in the shape.

                 The tick is `--success-contrast`, NOT `--success`. The pair is a surface
                 and its ink: `--success` is the pale/deep green FILL (#A4F4C0 light,
                 #0A2916 dark), so a glyph painted with it is very nearly invisible on the
                 canvas in whichever theme you are not looking at. `--success-contrast`
                 (#12542B / #52E086) is the ink, and it reads as green on the canvas in
                 both. -->
            <template v-if="row.values[planIndex] === true">
              <i
                class="pi pi-check text-body-sm text-(--success-contrast)"
                aria-hidden="true"
              />
              <span class="sr-only">Included</span>
            </template>
            <template v-else-if="row.values[planIndex] === '—'">
              <span
                class="text-(--text-muted)"
                aria-hidden="true"
                >—</span
              >
              <span class="sr-only">Not included</span>
            </template>
            <span v-else-if="row.values[planIndex]">
              {{ row.values[planIndex] }}
            </span>
          </td>
        </tr>
      </tbody>

      <!-- ONE closing row for the whole table: the hand-off to the per-unit rates. It was
           a row per section — the same sentence seven times, each one cutting across a
           column the reader was scanning down — and it says nothing a reader needs before
           they reach the end of the comparison. `<tfoot>` because that is what this row
           is: not part of any product's block, but the table's own last line. It draws its
           own floor (`border-b`), which is why the last comparison row does not. -->
      <tfoot v-if="link">
        <tr>
          <td
            colspan="4"
            class="border-y border-(--border-default) px-(--spacing-lg) py-(--spacing-md)"
          >
            <Link
              :label="link.label"
              :href="link.href"
              target="_blank"
              icon="pi pi-arrow-right"
              size="medium"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
