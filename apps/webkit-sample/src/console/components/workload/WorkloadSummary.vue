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
  import CopyButton from '@aziontech/webkit/copy-button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { formatShortDate } from '@shared/lib/dates'
  import { computed } from 'vue'

  import DomainOverflowPopover from '../list/DomainOverflowPopover.vue'
  import ResourceLink from '../resource/ResourceLink.vue'
  import SummaryBand from '../resource/SummaryBand.vue'

  const props = defineProps({
    /** The record's workload — `{ id, name, domain, domains, domainCount, status, owner, ownerAvatar, modifiedAt }`. */
    workload: { type: Object, required: true },
    /** The reader's own domains on this workload — `{ domain }[]`, the API's `domains[]`. */
    customDomains: { type: Array, default: () => [] },
    /**
     * The environments this workload publishes into — `{ name, settingsId }[]`
     * (../../lib/state/workload-environments.js). Each one is here because a DOMAIN on
     * this workload answers there, which is why the picker's action adds a domain.
     */
    environments: { type: Array, default: () => [] }
  })

  // WHICH ENVIRONMENT THE CARD IS REPORTING. Two-way, because the footer under this card
  // answers for the same environment: the live deployment and the Deployment setting that
  // published it are both facts ABOUT one, and the page owns that pairing.
  const environment = defineModel('environment', { type: String, default: '' })

  // Visit is the card's own action, so the card only says it was pressed — the PAGE owns
  // what opening the workload does, exactly as it did while the button lived in the tab
  // bar. Nothing about "open this address" belongs to a summary component.
  const emit = defineEmits(['visit', 'add-domain', 'add-environment', 'manage-domains', 'settings'])

  // The hostname the workload is being READ on. The Environment Select re-points it per
  // environment, so the block takes the domain it is handed rather than reaching for
  // `workload.domains[0]` — the two disagree the moment the reader picks Stage.
  const domain = computed(() => props.workload.domain ?? '')
  const domainUrl = computed(() => (domain.value ? `https://${domain.value}` : ''))

  // Copying is silent by nature, so it toasts — the same confirmation every other copy in
  // this console gives. What travels is the URL, not the bare hostname: the reader's next
  // move with it is a browser or a curl, and both want the scheme.
  const copyUrl = async () => {
    try {
      await globalThis.navigator?.clipboard?.writeText(domainUrl.value)
      toast.success('URL copied.')
    } catch {
      toast.error('Could not copy the URL.')
    }
  }

  // The strip's overflow. Copying is the card's own act; the other two are the PAGE's
  // destinations, exactly as Visit is — a summary does not know what tab its settings
  // live on.
  const onAction = (value) => {
    if (value === 'copy-url') return copyUrl()
    if (value === 'manage-domains') return emit('manage-domains')
    if (value === 'settings') return emit('settings')
  }

  // Every Azion hostname on the workload, primary first — what the "+N" popover lists.
  // A record minted by a create carries exactly one; a seeded row carries its aliases.
  const domains = computed(() => props.workload.domains ?? [domain.value])
  const aliasCount = computed(() => props.workload.domainCount ?? 0)

  const environmentLabel = computed(
    () => environment.value || props.environments[0]?.name || 'Production'
  )

  // The action row's sentinel value. It is an ACTION in a list of values, so it is told
  // apart by identity rather than by position — a picker whose last row happens to mean
  // something else is one reorder away from a bug.
  //
  // WHAT IT ADDS IS AN ENVIRONMENT; WHAT IT ASKS FOR IS A DOMAIN. The row opened a Create
  // Environment drawer that made an environment no domain answered on — not how one
  // reaches a workload. An environment is an account record, and it arrives here because a
  // DOMAIN on this workload answers in it (../../lib/state/workload-settings.js). So the
  // row keeps the name of the act and the form behind it asks for the address, offering
  // the account's environments and a quick-add for one that does not exist yet.
  const ADD = '__add-environment__'

  const onSelect = (value) => {
    if (value === ADD) return emit('add-environment')
    environment.value = value
  }

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
      <SummaryBand kind="subject">
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
          <ResourceLink
            :label="domain"
            :href="`https://${domain}`"
          />
          <DomainOverflowPopover
            v-if="aliasCount"
            :domains="domains"
            :count="aliasCount"
          />
        </div>

        <!-- THE STRIP'S RIGHT END IS ACTIONS, and there is exactly one. The status and the
           who/when used to sit here too; both are things the record IS, so both moved down
           into the fact row where they are captioned like every other fact — which is what
           left this end reading as what it is.

           THE OVERFLOW CLOSES THE ROW, and what it holds is the address's own menu:
           Copy URL, Manage Domains, Settings. Copying used to be a boxed CopyButton beside
           the hostname — a permanent control for a once-in-a-while act, sitting between the
           address and the "+N" that belongs to it. The other two are where a reader goes
           NEXT from an address, and both were reachable only by finding the right tab.

           IT DOES NOT HOLD CLONE OR DELETE, which it once did, picked up from the Workloads
           list row. Delete lives in the Settings tab's Danger Zone, where every destructive
           act in this console is read with the sentence that says what it costs; a menu that
           has to be opened to find out it holds a delete is the wrong place for the one
           action a workload cannot take back. Clone went with it rather than being given a
           home of its own: it is a list act, on the row, where the reader is choosing WHICH
           workload.

           VISIT LIVES HERE, not in the page's tab bar. It opens the address this card is
           about, so it belongs beside the address rather than up in the row of page-level
           actions — which is now the one primary action a workload page has (Deploy),
           instead of a primary and a secondary competing for the same corner. The card's
           domain link goes to the same place; the button is the affordance for a reader
           who is scanning the card rather than reading it. -->
        <div class="ml-auto flex shrink-0 items-center gap-(--spacing-xs)">
          <Button
            label="Visit"
            kind="secondary"
            size="medium"
            icon="pi pi-external-link"
            @click="emit('visit')"
          />

          <!-- THE ENVIRONMENT PICKER, at the strip's action end — the placement
               console-kit gives it: everything under this card (the live deployment, the
               Deployment setting that published it) is a fact about ONE environment, so
               the card has to say which, let the reader move it, and let them add one.

               A PICKER, NOT A SELECT, because the answer set is not closed: a Select
               offers what exists, and this also offers the act that ADDS one. That is a
               different kind of row — an action, not a value — so it sits in its own group
               under a rule instead of pretending to be another environment. It is also why
               a workload with one environment still gets the control: there is always
               something to do in it.

               ADDING ONE IS ADDING A DOMAIN. This row opened a Create Environment drawer
               that asked for a name and a Deployment Setting — an environment nothing
               answered on, and a link the platform makes itself. An environment is an
               account record (../../lib/data/environments.js), and it reaches a workload
               because a DOMAIN on it answers there. So the row keeps its name and opens
               the form that does that (../resource/AddDomainDrawer.vue): the address,
               then the environment it answers in — an existing one, or a new one made in a
               second drawer without leaving the form.

               `Dropdown.Trigger` is already the button (a `span` with `role="button"`),
               so what goes inside is a plain `span` wearing the closed-Select chrome — a
               real `<button>` there would be a control nested inside a control. Medium
               (32px), so it sits at the same height as Visit beside it. -->
          <Tooltip
            text="Select an environment to see its deployment and settings, or add another one"
          >
            <Dropdown
              placement="bottom-end"
              @select="(event, value) => onSelect(value)"
            >
              <Dropdown.Trigger>
                <span
                  class="flex h-8 min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-label-sm text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-(--border-strong)"
                >
                  <i
                    class="ai ai-layers shrink-0 text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="truncate">{{ environmentLabel }}</span>
                  <i
                    class="pi pi-chevron-down shrink-0 text-(--text-muted)"
                    aria-hidden="true"
                  />
                </span>
              </Dropdown.Trigger>

              <Dropdown.Group label="Environments">
                <Dropdown.Option
                  v-for="option in environments"
                  :key="option.name"
                  :value="option.name"
                  :label="option.name"
                  :selected="option.name === environmentLabel"
                />
              </Dropdown.Group>

              <Dropdown.Group>
                <!-- A PLUS, not the environment glyph. The row is the ACT, and every
                     other row in this menu is an environment the reader can select — the
                     layers mark would have named the same thing they all are instead of
                     the one thing this row does. The trigger keeps the layers glyph, which
                     is where naming the subject belongs. -->
                <Dropdown.Option
                  :value="ADD"
                  label="Add Environment"
                >
                  <template #left>
                    <i
                      class="pi pi-plus"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
              </Dropdown.Group>
            </Dropdown>
          </Tooltip>

          <Dropdown
            placement="bottom-end"
            @select="(event, value) => onAction(value)"
          >
            <Dropdown.Trigger>
              <Tooltip text="Workload actions">
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="outlined"
                  size="medium"
                  aria-label="Workload actions"
                />
              </Tooltip>
            </Dropdown.Trigger>

            <Dropdown.Group>
              <Dropdown.Option
                value="copy-url"
                label="Copy URL"
              >
                <template #left>
                  <i
                    class="pi pi-copy"
                    aria-hidden="true"
                  />
                </template>
              </Dropdown.Option>
            </Dropdown.Group>

            <Dropdown.Group>
              <Dropdown.Option
                value="manage-domains"
                label="Manage Domains"
              >
                <template #left>
                  <i
                    class="ai ai-domains"
                    aria-hidden="true"
                  />
                </template>
              </Dropdown.Option>
              <Dropdown.Option
                value="settings"
                label="Settings"
              >
                <template #left>
                  <i
                    class="pi pi-cog"
                    aria-hidden="true"
                  />
                </template>
              </Dropdown.Option>
            </Dropdown.Group>
          </Dropdown>
        </div>
      </SummaryBand>

      <!-- THE RECORD. Four facts, each a caption over a value.

         EVERY VALUE LINE IS THE SAME BOX: `min-h-7 items-center`. The four values are
         made of different things — a 24px chip, a status dot, a number beside a 24px copy
         button, a name beside a 24px avatar — so left to their natural heights they
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
      <SummaryBand
        kind="facts"
        class="grid grid-cols-2 gap-(--spacing-sm) sm:grid-cols-4"
      >
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <!-- THE ADD SITS ON THE LABEL, not in the value row. It was a dashed Chip
               reading "Add a custom domain", which took the whole value cell and only
               appeared while the cell was empty — so the one field the reader is expected
               to fill lost its way in the moment they filled it, and a second domain had
               to be added from a checklist row further down the page.
               A glyph beside the label is always there and says the same thing: this is
               the field, and this is how you add one. The label carries the meaning, so
               the glyph is `aria-hidden` and the button takes the name.
               THE TARGET IS BIGGER THAN THE GLYPH: `size-6` with `p-1` gives a 24px hit
               area around a 14px mark, and `-m-1` pulls the extra back out of the flow so
               the label row keeps its own height. A 10x14 target is the size the icon
               happens to be, which is not a reason for it to be the size of the button. -->
          <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
            <span class="text-label-sm text-(--text-muted)">Custom domains</span>
            <Tooltip text="Add a custom domain">
              <button
                type="button"
                class="-m-1 inline-flex size-6 shrink-0 items-center justify-center rounded-(--shape-button) p-1 text-(--text-muted) transition-colors duration-150 ease-out hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                aria-label="Add a custom domain"
                @click="emit('add-domain')"
              >
                <i
                  class="pi pi-plus-circle text-body-sm leading-none"
                  aria-hidden="true"
                />
              </button>
            </Tooltip>
          </span>

          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <!-- A BOUND DOMAIN IS SOMETHING YOU VISIT. It was plain text, which made the one
               field the reader had just gone and configured the only address on the card
               they could not open. Now it is a real external anchor to the live site, in
               the same clothes as the hostname in the strip above — full ink with a quiet
               underline and the outbound arrow, never the blue `--text-link`, so the card
               reads at one voice. -->
            <ResourceLink
              v-if="primaryCustom"
              :label="primaryCustom"
              :href="`https://${primaryCustom}`"
            />
            <!-- The rest, behind the console's own overflow badge — the same component
               the alias strip above this row uses (../list/DomainOverflowPopover.vue).
               It was a bare `+N` span with the full list hiding in the anchor's tooltip,
               which is a different answer to the same question two rows apart: one you
               click, one you hover, neither searchable. A workload can carry dozens of
               these, and the popover is the thing that pages and filters them. -->
            <DomainOverflowPopover
              v-if="extraCustomCount"
              :domains="customNames"
              :count="extraCustomCount"
            />
            <!-- EMPTY READS AS EMPTY, in the disabled ink every other absent value on this
               card uses. The invitation is the glyph on the label above; repeating it here
               would put the same control on the row twice. -->
            <span
              v-if="!primaryCustom"
              class="truncate text-body-sm text-(--text-disabled)"
            >
              None
            </span>
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
      </SummaryBand>

      <!-- THE FOOTER — what is running on this workload right now (./DeploymentFooter.vue,
         passed in by the page).

         A RECESSED band, not another white one: `--bg-canvas` is the only surface token
         that steps back from `--bg-surface` in BOTH themes and by the same sign — measured
         #FAFAFA on #FFFFFF in light, #000000 on #0A0A0A in dark. (`--bg-surface-raised` is
         identical to `--bg-surface` in light, so it would have shown no fill at all, and
         in dark it steps the wrong way.) The recess is what says "this belongs to the card
         above it" rather than "this is a third thing". -->
      <SummaryBand
        v-if="$slots.footer"
        kind="state"
        :padded="false"
      >
        <slot name="footer" />
      </SummaryBand>
    </template>
  </CardBox>
</template>
