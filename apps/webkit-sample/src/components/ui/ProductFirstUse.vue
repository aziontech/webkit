<script setup>
  // ProductFirstUse — what a product module shows BEFORE it owns anything.
  //
  // TWO TIERS, stacked in the order a reader needs them, per the Figma frame this screen
  // implements (console.azion.com → Empty Module, node 2262:2839). The copy is per
  // product and lives in ../../product-empty-states.js; this file is only its rendering.
  //
  //   1. THE EMPTY — an EmptyState lead (headline, one line, and a Documentation button
  //      in its `actions` slot) over an Item.List of the gates, all in one card.
  //   2. THE PROMOS — two quiet cards side by side under it: the product's catalog, and
  //      the agent in the reader's own editor. No buttons; the whole card is the control
  //      (./FirstUsePromo.vue argues that anatomy).
  //
  // The order is the argument: tier 1 says what the product is and how to make one,
  // tier 2 offers to have something else start it. Reversed, the screen would open by
  // asking the reader to pick a framework for a product it had not named yet.
  //
  // ── WHY TIER 2 IS TWO CARDS AND NOT A SECOND ROW LIST ──
  //
  // It has been three things. First a hand-written per-product list of "starting points"
  // BESIDE the gates with an `Or` down the seam claiming the two were equal ways in —
  // equal was the wrong claim, and the list was a third catalog that drifted from the
  // create page's and the Marketplace's on the first edit. Then a second card of rows
  // under the first, which fixed the drift (the rows were a projection of those catalogs)
  // but not the weight: a dozen identical rows in two identical cards, and by the time a
  // reader reached row nine the three gates that actually matter were off screen.
  //
  // The design settles it: the catalog collapses to ONE card that opens the catalog. That
  // is the projection argument taken all the way — the Marketplace owns the list, so this
  // screen names it and hands over, instead of restating three rows of it. The framework
  // marks stay as the card's logo cluster, so the reader still sees WHAT is in there
  // (../../lib/frameworks.js — the same array the create page renders).
  //
  // ── WHY IT IS HOME'S SHAPE ──
  //
  // The ways in used to be three side-by-side cards with the product's mark tinted
  // primary. It was a good card row and the wrong screen: Overview already answers
  // "you own none of these yet" for the same resource, and it answers it as an
  // EmptyState lead over an Item.List of ways to create the first one (../Home.vue).
  // A reader who saw that on Overview and then opened the module met a second,
  // unrelated first-use design one click later — two answers to one question, which
  // is what a design system exists to stop.
  //
  // So this block is now that block: same card, same EmptyState lead, same rows,
  // and the same 32px bordered icon frame, which lives in ./IconFrame.vue so the
  // two cannot drift. What stays product-specific is the only part that should be —
  // the copy: the headline, which doors exist, and where each one goes.
  //
  // The rows carry a per-METHOD glyph, never the product's mark. Three identical
  // marks stacked in a column read as a rendering bug; side by side as cards they
  // read as "these are all Functions", which is why the card row could get away
  // with it and a list cannot.
  //
  // It is a COMPONENT and not a page because the same block has two homes:
  //
  //   /empty-states                 → the gallery, product picked by a Dropdown
  //                                   (../ProductEmptyStates.vue).
  //   /applications /workloads /functions
  //                                 → the module's own first use, when the sample is
  //                                   in its EMPTY version (../../lib/sample-mode.js).
  //
  // One block, one copy source: a module that reproduced these two sections by hand
  // would be a second answer to "what does Functions say before it has functions",
  // and the two would drift on the first wording change.
  //
  // ── WHAT IS NOT HERE ──
  //
  // No progress bar, no checklist, no dismiss. Nothing on this screen has to be
  // completed and nothing needs a "seen" flag: the whole block is gone the moment
  // the module owns its first resource, so the DATA retires the guidance.
  //
  // The one state that is NOT empty-but-ready is a tenancy switch. "Nothing here yet"
  // is a claim about the scope in force, and during the switch we have not finished
  // reading the new one — so that window shows the block's own shape in placeholder
  // fill instead of asserting emptiness about an account we have not read.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import InputGroup from '@aziontech/webkit/input-group'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { AGENT_SETUP_PROMPT, AGENT_TOOLS } from '../../lib/agent-onboarding'
  import { useTenancyReload } from '../../lib/tenancy-reload'
  import { AGENT_PROMO } from '../../product-empty-states'
  import AgentMark from '../site/ui/AgentMark.vue'
  import FirstUsePromo from './FirstUsePromo.vue'
  import IconFrame from './IconFrame.vue'

  const props = defineProps({
    /** One entry of `productEmptyStates` — the module's own copy. */
    product: { type: Object, required: true },
    /**
     * Whether this render is a CHANGE inside a page that is already on screen — the
     * gallery swapping product — in which case the block rises into place. Off by
     * default: see the note on the entrance below.
     */
    enter: { type: Boolean, default: false }
  })

  const { tenancyReloading } = useTenancyReload()

  // ── THE ENTRANCE, AND WHEN IT IS WRONG ──
  //
  // `animate-content-enter` is for content settling INSIDE a page that is already there. On
  // a module's own page this block IS the page, so animating it on mount put it in
  // lockstep with the route transition: measured on a navigation into empty
  // /functions, at 8ms the block was rising through 7.2px while the page was still
  // sliding in at −21.5px, both at opacity 0.10 — one element travelling diagonally
  // rather than a page arriving. The page's own entrance is the only one it needs.
  //
  // So the block rises only when it really is a change within a standing page:
  //   - the gallery swapping product (`enter`, passed by the host), and
  //   - a tenancy reload resolving back into content, which is a loading window by
  //     definition — the one case the class was written for.
  const settled = ref(false)
  watch(tenancyReloading, (now, before) => {
    if (before && !now) settled.value = true
  })

  const entranceClass = computed(() =>
    props.enter || settled.value ? 'animate-content-enter motion-reduce:animate-none' : ''
  )

  // ── WHAT A ROW DOES ──
  //
  // A row with a `route` NAVIGATES; a row with a `command` shows that command, copyable,
  // and has no button at all; a row with neither says what it would have created and that
  // the demo stops there. Every gate that creates or imports has a route: the create flow
  // for an import (/create → /deploy), the resource's own create page for "new one"
  // (including the ones generated from the API in ../../lib/create-resources.js), the
  // Marketplace for a Functions template.
  //
  // The CLI door used to be in the third group: a `View commands` button that opened no
  // page and toasted that the demo stops there — the one row on the screen whose content
  // is a single line of shell, spending a control to withhold it. It carries the line now
  // (`command` in ../../product-empty-states.js), so the row is complete where it stands
  // and the clipboard is the whole flow, in the demo exactly as in production.
  //
  // One door is genuinely left in the toast group — Object Storage's S3 credentials, which
  // are neither a form nor a command.
  //
  // The toast's sentence uses the product's `unit` (a Function, a DNS zone, a bucket)
  // and never the module label, which is plural and does not survive being dropped
  // into English.
  //
  // The email rides along the way every route in this prototype carries it.
  const route = useRoute()
  const router = useRouter()

  const go = (target) =>
    router.push({
      path: target.path,
      query: { ...target.query, email: route.query.email || undefined }
    })

  const start = (method) => {
    if (method.route) return go(method.route)
    toast.info(method.title, {
      description: `Creating a ${props.product.unit} is disabled in the demo.`
    })
  }

  // ── THE PROMO ROW ──
  //
  // The catalog card exists only for a product the Marketplace publishes something for.
  // A card offering a catalog that is empty for this product would be a section that
  // failed to load, so Edge DNS and Object Storage get the agent card alone — and the row
  // stops being a grid, because one card in a two-column grid is a card beside a hole.
  const catalog = computed(() => props.product.startFast ?? null)

  // Four marks. The catalog's own rows carry them (framework logos for a boilerplate,
  // `pi` glyphs for a function), so the cluster shows what is actually in there rather
  // than a decorative set — and which four is decided where the catalog is
  // (`FIRST_USE_TECHS` in ../../lib/frameworks.js), not by taking whatever comes first.
  const catalogLogos = computed(() =>
    (catalog.value?.items ?? []).slice(0, 4).map((item) => item.icon)
  )

  // The catalog card opens the Marketplace — inside the console, so no external glyph.
  // Its rows used to route with a `q=` per entry; the card is the whole catalog, so it
  // opens the TAB that holds this product's offering and lets the reader look.
  //
  // Which tab is a fact about the product, so it rides the data (`startFast.route` in
  // ../../product-empty-states.js) and not a branch here: Applications and Workloads are
  // served by TEMPLATES (a framework boilerplate is a template), Functions by
  // INTEGRATIONS (an installable function). Hardcoding one tab sent two of the three
  // products to a catalog that does not hold what their card just offered.
  const openCatalog = () => go(catalog.value.route)

  // The agent card's whole action is the clipboard — the same offer, the same prompt and
  // the same sentence as the pill on Overview (../../lib/agent-onboarding.js). There is no
  // page to open, so a button that opened one to then offer a copy button would be a step
  // with no decision in it.
  const copyAgentPrompt = async () => {
    try {
      await navigator.clipboard.writeText(AGENT_SETUP_PROMPT)
      toast.success('Setup prompt copied.', {
        description: 'Paste it into Claude, Cursor, Windsurf, Codex or OpenCode.'
      })
    } catch {
      toast.error("Couldn't copy the prompt.", {
        description: 'Clipboard access was blocked by the browser.'
      })
    }
  }
</script>

<template>
  <!-- The reload window: the block's own shape, not a claim about a scope we
       are still reading. Same widths and heights it resolves to, so nothing
       shifts when the read lands. -->
  <div
    v-if="tenancyReloading"
    class="flex flex-col gap-[var(--spacing-md)]"
  >
    <!-- The two tiers, at the heights they resolve to: the card, then the promo row. -->
    <Skeleton height="23rem" />
    <Skeleton height="7rem" />
  </div>

  <!-- The entrance is conditional — see the note in the script. On a module page
       the route transition already carries the arrival; here it would run alongside
       it. -->
  <!-- ── ONE COLUMN, TWO TIERS ──
       It was a 50/50: the gates on the left, a template list on the right, an `Or`
       down the seam claiming they were equal ways in. Equal was the wrong claim and
       the seam was the wrong device — so the two are STACKED, in the order a reader
       needs them: the empty first (what this is, and the gates), the promos under it
       (have something else start it). One column at the page's focused measure, the
       same 1024px Overview's own empty card takes.
       ONE STEP, NOT TWO. The gap here used to be the SECTION step on the argument that
       the tiers are two different offers — which was right while tier 2 was a second
       card of rows the size of the first. It is a row of two short cards now, and the
       design spaces it at the CARD step, the same 24px that separates the two promos
       from each other. Read as a rhythm: the card, then a row that belongs to it. At the
       section step the promos detached and read as a second, unrelated block. -->
  <div
    v-else
    class="flex flex-col items-start gap-[var(--spacing-lg)]"
    :class="entranceClass"
  >
    <!-- Overview's empty card, to the element: one flush CardBox holding the
         EmptyState lead and an Item.List of the doors under a hairline (../Home.vue
         renders the same two). `:padded="false"` because the parts bring their own
         padding — a card padding on top would inset the divider from the card edge
         and leave the rows floating in a frame.
         NO `grow`, on the card or on the lead inside it. It used to carry both: the
         block hung from the top of the page, so the card stretched to the column's
         height and the lead absorbed the slack that would otherwise sit under the last
         row as an empty band. Every host now wraps this block in Home's centred
         container, so there is no slack to absorb — and a `grow` card inside a
         `justify-center` box defeats the centring by filling the height it was supposed
         to be centred in. -->
    <CardBox
      :padded="false"
      class="w-full"
    >
      <template #content>
        <!-- The headline is the lead's title, so there is no separate <h2> above
             the card any more: two headings saying "Deploy your first Function"
             one above the other was the first thing this shape removed. -->
        <EmptyState
          :icon="product.icon"
          :title="product.headline"
          :description="product.lead"
        >
          <!-- The way out to the docs rides the lead's own `actions` slot rather than
               sitting under the card: with a second tier below, a link between the two
               would read as belonging to whichever one the eye reached first. In the slot
               it is unambiguously this tier's read-more, centred under the sentence it
               continues.
               A LINK, not a button, and it carries the EXTERNAL glyph. The design draws
               it as an outlined button, and that is the one place this screen departs
               from it: every control on this card creates or opens something inside the
               console, and a button shaped like those that instead throws the reader onto
               azion.com is the shape lying about the destination. `pi-external-link` is
               how the rest of the console says "this leaves", and a link is what wears
               it. The label is the destination; the headline above says whose docs. -->
          <template #actions>
            <Link
              label="Documentation"
              :href="product.learnMore.href"
              target="_blank"
            />
          </template>
        </EmptyState>

        <Item.List class="border-t border-[var(--border-muted)]">
          <Item
            v-for="method in product.methods"
            :key="method.id"
          >
            <Item.Media>
              <IconFrame :icon="method.icon" />
            </Item.Media>
            <Item.Content>
              <Item.Title>{{ method.title }}</Item.Title>
              <Item.Description>{{ method.description }}</Item.Description>
            </Item.Content>
            <!-- The command takes THE CELL EVERY FIELD IN THE CONSOLE TAKES: the action
                 column is `flex-1` capped at `--container-3xs`, the same two classes an
                 ItemGroup field row is built from (./FieldRow.vue, and ../CreateRecordDrawer.vue
                 which types them out per row). So the field ends at the right edge the
                 sibling rows' buttons hold and begins where every other field on every
                 other page begins.
                 Below `md` the row wraps and the command takes its own full line: the
                 action column is `w-fit`, so there is nothing for a percentage width to
                 resolve against (a percentage of a box sized by its own child is circular)
                 and a 46-glyph command ran ~120px past the card edge. `basis-full`
                 overrides the width of a flex item, so the row's own `flex-wrap` gives the
                 field a line and the field fills it — only on the CLI row, so every button
                 keeps hugging the right. -->
            <Item.Actions
              :class="
                method.command
                  ? 'basis-full justify-end md:basis-auto md:max-w-[var(--container-3xs)] md:flex-1'
                  : undefined
              "
            >
              <!-- THE CLI DOOR'S ACTION IS THE COMMAND.
                   A door whose whole instruction is one line of shell shows that line
                   instead of a button that opens nothing (../../product-empty-states.js →
                   `command`), and it shows it WHERE THE BUTTON WAS — the action column, at
                   the same right edge every other row's control holds. Under the
                   description it spanned the content column and broke the row's own logic:
                   media, then what this door is, then the one thing you do with it.
                   IT IS THE COPY-OUT ROW THE CONSOLE ALREADY HAS. A value the reader takes
                   somewhere else — a nameserver, a DNSSEC digest, a command — is one
                   readonly InputText with a transparent CopyButton inside the same
                   InputGroup (../EdgeDnsZoneDetail.vue § Configure your Nameserver). The
                   earlier shape was a FieldInputGroup with a `$` addon on the left and the
                   copy walled in an addon on the right: three ruled boxes for one string,
                   where the copy-out row is one field with a glyph in it. The `$` went with
                   the wall — in the code face `azion …` is already unmistakably a command,
                   and the addon was ~35px the command could have.
                   FIT TO THE PAGE MEASURE, not to the command. The field fills the capped
                   cell above, so the fifteen products — whose commands run from 12 to 45
                   glyphs — read as ONE column of controls rather than fifteen boxes each
                   starting at its own x; that ragged left edge is what the earlier
                   `ch`-of-the-mono-face fit produced, and it was most visible on the
                   /empty-states gallery, where those rows stack.
                   A command longer than the measure scrolls inside the input: the copy
                   carries the WHOLE line whatever is on screen, and the row's description
                   already says what the command does.
                   `readonly`, so the text selects and the caret never suggests the reader
                   should be editing it here; `aria-label` rather than a visible label,
                   which would only repeat the row's own title. -->
              <template v-if="method.command">
                <InputGroup class="w-full">
                  <InputText
                    :model-value="method.command"
                    size="large"
                    class="min-w-0 flex-1 [&_input]:text-label-code-sm"
                    :aria-label="`${method.title} command`"
                    readonly
                  />
                  <CopyButton
                    :value="method.command"
                    :aria-label="`Copy the ${method.title} command`"
                    copied-label="Command copied"
                  />
                </InputGroup>
              </template>

              <!-- ONE FILLED CONTROL, and it is the import.
                   The three gates were all outlined, on the argument that they are
                   alternatives and a filled one would answer a question the reader has
                   not been asked. Three equal controls turned out to answer it worse: a
                   reader with a repo — which is most of them — had to read all three
                   descriptions to find the row that already does what they want. So the
                   import gate is `primary` and the others stay outlined: the screen
                   recommends the fastest real path and keeps the other two one click
                   away, which is a recommendation rather than a maze.
                   Exactly one per product carries the flag (`primary` in
                   ../../product-empty-states.js) — a second filled control in the same
                   list would be two recommendations, which is none. -->
              <Button
                v-else
                :label="method.action"
                :kind="method.primary ? 'primary' : 'outlined'"
                size="medium"
                @click="start(method)"
              />
            </Item.Actions>
          </Item>
        </Item.List>
      </template>
    </CardBox>

    <!-- ── TIER 2: THE PROMOS ──
         Two cards on one row, the design's second row. `md:grid-cols-2` only when there
         are two: a product with no Marketplace catalog offers the agent alone, and one
         card in a two-column grid is a card beside a hole.
         The cards are `items-stretch` by the grid's default, so the shorter description
         does not leave one card an inch taller than its neighbour — a pair that reads as
         one row has to end on one line. -->
    <div
      class="grid w-full gap-[var(--spacing-lg)]"
      :class="catalog ? 'md:grid-cols-2' : ''"
    >
      <!-- THE CATALOG. Its copy is the one already authored for this product
           (../../product-empty-states.js → `startFast`), because that is the offer: the
           card is the header that list used to have, with the list itself left to the
           Marketplace. The cluster shows the marks of what is actually in there. -->
      <!-- `navigates`, so it carries the corner glyph: pressing it leaves this screen for
           the Marketplace. The agent card beside it takes none — it copies a prompt and
           leaves the reader where they are, and the glyph is the only thing that says so
           before either is pressed. -->
      <FirstUsePromo
        v-if="catalog"
        :title="catalog.title"
        :description="catalog.description"
        navigates
        @activate="openCatalog"
      >
        <template #logos>
          <IconFrame
            v-for="icon in catalogLogos"
            :key="icon"
            :icon="icon"
          />
        </template>
      </FirstUsePromo>

      <!-- THE AGENT. Product-independent — the same offer on every module's first use,
           and the same one the pill on Overview makes — so its copy is one shared const
           rather than a line repeated in nine products. The marks are the editors
           themselves, drawn by AgentMark: four of the five, matching the catalog card's
           four beside it, so the two clusters are the same object at the same width.
           IN COLOR, not `mono`. The pill on Overview draws them the same way, and for the
           same reason: here they are a row of LOGOS, so each brand's own treatment is what
           makes the row scannable — a reader spots the editor they use before reading a
           word. (Only Claude actually carries a brand color; the other four ride
           currentColor by their own guidelines, so this is one warm mark in four rather
           than four colors competing.) -->
      <FirstUsePromo
        :title="AGENT_PROMO.title"
        :description="AGENT_PROMO.description"
        @activate="copyAgentPrompt"
      >
        <template #logos>
          <IconFrame
            v-for="agent in AGENT_TOOLS.slice(0, 4)"
            :key="agent"
          >
            <AgentMark
              :name="agent"
              class="size-[18px] text-[var(--text-default)]"
            />
          </IconFrame>
        </template>
      </FirstUsePromo>
    </div>
  </div>
</template>
