<script setup>
  // WorkloadSummary — the workload ITSELF, as the first block of its Overview.
  //
  // ── WHY IT EXISTS ──
  //
  // The page opened on "Ship to production" and never once said the thing a workload IS:
  // the address it answers on. A reader arriving from the list saw the hostname in the row
  // they clicked and then lost it — the Overview reported the active deployment, the
  // topology and the version history, and the address appeared nowhere until a topology
  // node was expanded. The page's own subject was the one fact it did not carry.
  //
  // ── WHY IT HAS NO HEADING ──
  //
  // Every other band here is titled (Ship to production, Deployment topology, Version
  // History) because each one is a SECTION of the page. This is not a section — it is the
  // page's subject line. The breadcrumb already names the workload; a heading over its
  // address would name it twice.
  //
  // ── WHAT IT REPORTS ──
  //
  // The workload as `/v4/workspace/workloads` describes it. The field names below are the
  // serializer's, not a paraphrase:
  //
  //   workload_domain        the hostname Azion generates and always answers on. The
  //                          strip's link, and the thing a reader copies to curl.
  //   domains[]              the reader's OWN domains, pointed at this workload. Empty
  //                          until the "Add a custom domain" step is done, which is why
  //                          this block and that checklist row report the same state.
  //   active                 rendered as the Live / Inactive status
  //   created_at             when the workload was made, with the person who made it
  //   id                     the handle
  //
  // WHAT IT DELIBERATELY DOES NOT REPORT: `tls.minimum_version`, and the application the
  // workload serves. Both are real, and both were here — the TLS floor as a fourth fact,
  // the application as a second link. They came out because a summary earns its place by
  // being SHORT: the floor is a settings value nobody reads off a summary, and the
  // application is one card down in the topology, named and linked, where the reader is
  // already looking at what it connects to. A block that reports everything is a block
  // nobody reads the top line of.
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Chip from '@aziontech/webkit/chip'
  import CopyButton from '@aziontech/webkit/copy-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { formatShortDate } from '@shared/lib/dates'
  import { computed } from 'vue'

  import DomainOverflowPopover from '../list/DomainOverflowPopover.vue'

  const props = defineProps({
    /** The record's workload — `{ id, name, domain, domains, domainCount, status, owner, ownerAvatar, modifiedAt }`. */
    workload: { type: Object, required: true },
    /** The reader's own domains on this workload — `{ domain }[]`, the API's `domains[]`. */
    customDomains: { type: Array, default: () => [] }
  })

  // Visit is the card's own action, so the card only says it was pressed — the PAGE owns
  // what opening the workload does, exactly as it did while the button lived in the tab
  // bar. Nothing about "open this address" belongs to a summary component.
  const emit = defineEmits(['visit', 'add-domain'])

  // The hostname the workload is being READ on. The Environment Select re-points it per
  // environment, so the block takes the domain it is handed rather than reaching for
  // `workload.domains[0]` — the two disagree the moment the reader picks Stage.
  const domain = computed(() => props.workload.domain ?? '')

  // Every Azion hostname on the workload, primary first — what the "+N" popover lists.
  // A record minted by a create carries exactly one; a seeded row carries its aliases.
  const domains = computed(() => props.workload.domains ?? [domain.value])
  const aliasCount = computed(() => props.workload.domainCount ?? 0)

  // `active` — whether the address answers at all. `Live` is the word the Workloads list
  // uses for it, so the row and the page it opens agree.
  const live = computed(() => props.workload.status !== 'Inactive')

  // The reader's own domains. NAMED, not counted: "which domain" is the question a reader
  // comes back to this row with, and a bare "2 domains" answers a question nobody asked.
  //
  // The first one is what the cell shows and links; the rest are a "+N" beside it and the
  // full list is on the tooltip. That is the same primary-plus-overflow shape the strip
  // above uses for the Azion hostnames, and it is what keeps the cell to one line at a
  // quarter of the card's width — where two comma-separated hostnames do not fit.
  const customNames = computed(() => props.customDomains.map((entry) => entry.domain))
  const primaryCustom = computed(() => customNames.value[0] ?? '')
  const extraCustomCount = computed(() => Math.max(customNames.value.length - 1, 0))
  // "Aug 14", or "Aug 14, 2024" outside this year — the compact form a fact cell wants,
  // not the table column's "August 14, 2026, 01:03:00 PM".
  const createdOn = computed(() => formatShortDate(props.workload.createdAt))

  // Emails and dotted handles → a readable name, the same normalization the author cells
  // in every list apply, so a person is spelled one way across the console.
  const ownerName = computed(() => {
    const raw = String(props.workload.owner ?? '').trim()
    if (!raw) return ''
    const local = raw.includes('@') ? raw.slice(0, raw.indexOf('@')) : raw
    return local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  })
</script>

<template>
  <!-- THE CARD IS THE DS CARD (`CardBox`), not a hand-rolled box. It draws the surface, the
       border, the radius and the `overflow-clip` that lets the footer's fill take the
       bottom corners — the four things this file used to spell out in a class string, and
       the reason it must not: a card the system ships is a card the system owns.

       `:padded="false"` because the card holds BANDS, not padded content: the address
       strip, the record's facts and the footer each carry their own inset, and each rule is
       the next band's own top border rather than a Divider, so they stay one box — the same
       object at three grains, not three cards.

       The bands live in `#content` rather than in CardBox's own `#header`/`#footer` slots:
       that header is a 56px title bar (this card's first band is an address, not a title)
       and that footer centres its children and pads them itself, which the deployment band
       cannot use. Their chrome is what was wanted here; their layout is not. -->
  <CardBox :padded="false">
    <template #content>
      <!-- THE ADDRESS STRIP. It WRAPS the who/when group to its own line rather than
         letting it squeeze the address: the hostname is what this block is FOR, and at
         900px the two halves on one row truncated it to `my-workload…`. The basis is what
         makes that happen — `flex-1 min-w-0` alone shrinks to zero and never triggers the
         wrap, so the left group declares a preferred 300px and the row breaks under it. -->
      <div
        class="flex flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) p-(--spacing-md)"
      >
        <div class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)">
          <!-- The glyph names the subject of the line; it is not part of what the link
             opens, so it sits outside the anchor — the same split the Workloads list
             makes in its Domains cell. -->
          <i
            class="ai ai-domains shrink-0 text-[1.15em] text-(--text-muted)"
            aria-hidden="true"
          />
          <!-- FULL INK AND AN UNDERLINE, not `--text-link`. Blue is how this console marks a
             link that is one of several things on a row; this one is the page's SUBJECT,
             and painting the subject blue made the strip read as a call to action rather
             than as the workload's name. The underline is what still says "link" once the
             colour is gone — the same trade the sign-in screen's secondary link makes,
             and hover returns the rule to full ink rather than to blue.

             The rule is `--text-muted`, NOT `--border-strong`: that token is the loudest
             border in the theme (#FFFFFF in dark, #000000 in light), so it drew a rule
             brighter than the glyphs above it and hover DIMMED it. Measured — 255,255,255
             at rest against 250,250,250 text. The muted ink is the one that sits under
             full ink in both themes. -->
          <a
            :href="`https://${domain}`"
            target="_blank"
            rel="noopener noreferrer"
            class="flex min-w-0 items-center gap-(--spacing-xxs) text-label-md text-(--text-default) underline decoration-(--text-muted) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:decoration-(--text-default) motion-reduce:transition-none"
          >
            <span class="truncate">{{ domain }}</span>
            <i
              class="pi pi-arrow-up-right shrink-0 text-[0.85em]"
              aria-hidden="true"
            />
          </a>
          <DomainOverflowPopover
            v-if="aliasCount"
            :domains="domains"
            :count="aliasCount"
          />
          <CopyButton
            kind="outlined"
            :value="domain"
            aria-label="Copy workload domain"
            class="shrink-0"
          />
        </div>

        <!-- THE STRIP'S RIGHT END IS ACTIONS, and there is exactly one. The status and the
           who/when used to sit here too; both are things the record IS, so both moved down
           into the fact row where they are captioned like every other fact — which is what
           left this end reading as what it is.

           VISIT LIVES HERE, not in the page's tab bar. It opens the address this card is
           about, so it belongs beside the address rather than up in the row of page-level
           actions — which is now the one primary action a workload page has (Deploy),
           instead of a primary and a secondary competing for the same corner. The card's
           domain link goes to the same place; the button is the affordance for a reader
           who is scanning the card rather than reading it. -->
        <div class="ml-auto flex shrink-0 items-center">
          <Button
            label="Visit"
            kind="outlined"
            size="medium"
            icon="pi pi-arrow-up-right"
            @click="emit('visit')"
          />
        </div>
      </div>

      <!-- THE RECORD. Four facts, each a caption over a value.

         EVERY VALUE LINE IS THE SAME BOX: `min-h-7 items-center`. The four values are
         made of different things — a number beside a 24px copy button, a 24px chip, a
         status dot, a name beside a 24px avatar — so left to their natural heights they
         sat on four different baselines and the row read as ragged even though the
         captions above it were flush. Pinning the line to the tallest control's height and
         centring in it is what makes the values align across the row; the captions never
         needed it, they are all one span of one size.

         `min-h-7` (28px), not 24: the copy button is the tallest thing in the row and it
         measures 28. At 24 the four lines shared a TOP but not a middle — the id sat 2px
         below the other three, which is exactly the kind of drift that reads as wrong
         without being nameable.

         FOUR COLUMNS, FOUR CELLS at `sm`. Below that they fall into two, where a caption
         and its value still fit on one line each. -->
      <div
        class="grid grid-cols-2 gap-(--spacing-sm) border-t border-(--border-muted) p-(--spacing-md) sm:grid-cols-4"
      >
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Workload ID</span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <span class="truncate text-body-sm tabular-nums text-(--text-default)">
              {{ workload.id }}
            </span>
            <CopyButton
              kind="outlined"
              :value="String(workload.id)"
              aria-label="Copy workload ID"
              class="shrink-0"
            />
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Custom domains</span>
          <!-- EMPTY IS A CONTROL, not an em dash. This is the one field on the card the
             reader is expected to fill, and a dash said so without offering the way in —
             the only door was a checklist row further down the page. `kind="dashed"` is
             the Chip variant that exists for exactly this ("the control that adds one"),
             so an unfilled slot reads as an invitation in the same visual language the
             topology's unbound nodes use. It opens the same drawer the checklist does;
             the page owns that, so the chip only says it was pressed.
             Once filled, the cell is a FACT again and the names take it back — adding a
             second still goes through the checklist row, which stays pressable when
             done. The tooltip carries the full list when it outgrows the cell. -->
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <!-- A BOUND DOMAIN IS SOMETHING YOU VISIT. It was plain text, which made the one
               field the reader had just gone and configured the only address on the card
               they could not open. Now it is a real external anchor to the live site, in
               the same clothes as the hostname in the strip above — full ink with a quiet
               underline and the outbound arrow, never the blue `--text-link`, so the card
               reads at one voice. -->
            <Tooltip
              v-if="primaryCustom"
              :text="customNames.join('\n')"
            >
              <a
                :href="`https://${primaryCustom}`"
                target="_blank"
                rel="noopener noreferrer"
                class="flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm text-(--text-default) underline decoration-(--text-muted) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:decoration-(--text-default) motion-reduce:transition-none"
              >
                <span class="truncate">{{ primaryCustom }}</span>
                <i
                  class="pi pi-arrow-up-right shrink-0 text-[0.85em]"
                  aria-hidden="true"
                />
              </a>
            </Tooltip>
            <!-- The rest, counted. Not a link: it names no single address. The tooltip on
               the anchor beside it already lists every one of them. -->
            <span
              v-if="extraCustomCount"
              class="shrink-0 text-body-sm text-(--text-muted)"
            >
              +{{ extraCustomCount }}
            </span>
            <Chip
              v-else
              kind="dashed"
              size="small"
              clickable
              class="max-w-full"
              @click="emit('add-domain')"
            >
              <i
                class="pi pi-plus shrink-0 text-[0.75em]"
                aria-hidden="true"
              />
              <span class="truncate">Add a custom domain</span>
            </Chip>
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Status</span>
          <div class="flex min-h-7 min-w-0 items-center">
            <StatusIndicator
              :severity="live ? 'success' : 'neutral'"
              :label="live ? 'Live' : 'Inactive'"
            />
          </div>
        </div>

        <!-- CREATED — the date and the person on ONE line, the face last: "Aug 14 by Robson
           Junior". It is one fact, so it reads as one sentence under one caption, which is
           what the avatar-then-name pair in the strip above could not do — there, the who
           and the when were two uncaptioned fragments a reader had to infer. The avatar
           keeps the square kind every other author face in this console wears. -->
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Created</span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <span class="truncate text-body-sm text-(--text-default)">
              {{ createdOn }}<template v-if="ownerName"> by {{ ownerName }}</template>
            </span>
            <Avatar
              v-if="ownerName"
              :src="workload.ownerAvatar || undefined"
              :alt="ownerName"
              :label="ownerName"
              size="small"
              kind="square"
              class="shrink-0"
            />
          </div>
        </div>
      </div>

      <!-- THE FOOTER — what is running on this workload right now (./DeploymentFooter.vue,
         passed in by the page).

         A RECESSED band, not another white one: `--bg-canvas` is the only surface token
         that steps back from `--bg-surface` in BOTH themes and by the same sign — measured
         #FAFAFA on #FFFFFF in light, #000000 on #0A0A0A in dark. (`--bg-surface-raised` is
         identical to `--bg-surface` in light, so it would have shown no fill at all, and
         in dark it steps the wrong way.) The recess is what says "this belongs to the card
         above it" rather than "this is a third thing". -->
      <div
        v-if="$slots.footer"
        class="border-t border-(--border-muted) bg-(--bg-canvas)"
      >
        <slot name="footer" />
      </div>
    </template>
  </CardBox>
</template>
