<script setup>
  // Home — Overview for an account that OWNS things: account usage down the left,
  // the resource list on the right. The app shell (sidebar + GlobalHeader with the
  // breadcrumb) comes from AppLayout; this page renders only its content — a heading
  // with a resource TAB ROW — every type the account can hold, with how many of each
  // it owns — over a single CardBox holding the selected type's Table.
  //
  // It is one half of /home. The other is the first access (HomeEmptyState.vue), and
  // which one the URL resolves to is the sample's VERSION — empty account or populated
  // (../lib/sample-mode.js, dispatched by Overview.vue). So everything here can assume
  // the account has resources: the usage cards carry real readings, and the filter
  // opens on APPLICATIONS with its table already listing, because that is what the
  // reader came back to Overview to see.
  //
  // A resource the account genuinely does not own yet (Object Storage, Functions in
  // this seed) still shows an empty state in its own card — one account can be
  // populated and empty at the same time, per resource.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import ProgressBar from '@aziontech/webkit/progress-bar'
  import Skeleton from '@aziontech/webkit/skeleton'
  import TabView from '@aziontech/webkit/tab-view'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { useAgentOnboarding } from '../lib/agent-onboarding'
  import { APPLICATIONS } from '../lib/applications'
  import { useGreeting } from '../lib/greeting'
  import { presetIcon, presetLabel } from '../lib/presets'
  import { useTenancyReload } from '../lib/tenancy-reload'
  import { WORKLOADS } from '../lib/workloads'
  import ContrastBanner from './ui/ContrastBanner.vue'
  import DeleteDialog from './ui/DeleteDialog.vue'
  import DomainCell from './ui/DomainCell.vue'
  import HomeWire from './ui/HomeWire.vue'
  import IconFrame from './ui/IconFrame.vue'
  import LastModifiedCell from './ui/LastModifiedCell.vue'

  // Account-level usage. `value` + `unit` is the reading; `percent` drives the
  // small progress bar showing how much of the plan allowance is consumed.
  const metrics = [
    {
      label: 'Data Transferred',
      value: '842',
      unit: 'GB',
      percent: 62,
      hint: 'Total bytes delivered across all your resources.'
    },
    {
      label: 'Requests / Second',
      value: '1,240',
      unit: '/s',
      percent: 41,
      hint: 'Average requests handled per second in the selected window.'
    },
    {
      // GB, not MB: it is a share of what was transferred above, and two different
      // magnitudes for the same traffic read as two unrelated numbers.
      label: 'Bandwidth Saving',
      value: '588',
      unit: 'GB',
      percent: 70,
      hint: 'Bytes served from cache instead of your origin.'
    },
    {
      label: 'Data Offload',
      value: '70',
      unit: '%',
      percent: 70,
      hint: 'Share of traffic offloaded from your origin to the edge.'
    }
  ]

  // The resource map behind the filter. `reactive`, not a plain object: a row action
  // deletes from `rows`, and a plain object's array swap would never reach the Table.
  //
  // Applications and Workloads carry the sample's seeded rows (the same fixtures their
  // module lists read, so a name here is the name over there); the rest have none yet
  // and render their create-your-first empty state. Sliced through a paginated Table
  // rather than cut to a "recent N": a summary that silently drops rows is a lie the
  // reader has no way to detect.
  const resources = reactive({
    applications: {
      label: 'Applications',
      // The singular the delete dialog says back ("Delete Application").
      singular: 'Application',
      detailPath: '/applications',
      columns: [
        { accessorKey: 'name', header: 'Name', principal: true, enableSorting: true },
        // FOUR columns, and no more. Overview's list sits beside the usage rail, which
        // leaves it 626px: the module's own column set needs 735px there, and the
        // overflow silently ate Status and Last Modified from the right edge. So the
        // summary keeps what identifies a row and what it is doing — name, where it
        // lives, whether it is serving — and the module list keeps the rest.
        { accessorKey: 'domainName', header: 'Domain', grow: 2 },
        { accessorKey: 'status', header: 'Status' },
        { id: 'actions', kind: 'action', hideable: false }
      ],
      rows: [...APPLICATIONS],
      empty: {
        icon: 'ai ai-edge-application',
        title: 'No applications created yet',
        description:
          'Deploy a static site or a full-stack app, with compute, AI, storage and media on the same build.',
        actions: [
          {
            id: 'github',
            title: 'Import from GitHub',
            description: 'Import a repository from GitHub.',
            button: 'Import',
            icon: 'pi pi-github'
          },
          {
            id: 'template',
            title: 'Start from a Template',
            description: 'Choose a framework boilerplate.',
            button: 'Templates',
            icon: 'pi pi-clone'
          },
          {
            id: 'scratch',
            title: 'Start from Scratch',
            description: 'Start from a blank Application.',
            button: 'Create',
            icon: 'pi pi-file'
          }
        ]
      }
    },
    workloads: {
      label: 'Workloads',
      singular: 'Workload',
      detailPath: '/workloads',
      columns: [
        { accessorKey: 'name', header: 'Name', principal: true, enableSorting: true },
        { accessorKey: 'domain', header: 'Domain', grow: 2 },
        { accessorKey: 'status', header: 'Status' },
        { id: 'actions', kind: 'action', hideable: false }
      ],
      rows: [...WORKLOADS],
      empty: {
        icon: 'pi pi-box',
        title: 'No Workloads created yet',
        description:
          'Create your first deploy starting from scratch, a template or importing your code.',
        actions: [
          {
            id: 'github',
            title: 'Import from GitHub',
            description: 'Import a repository from GitHub.',
            button: 'Import',
            icon: 'pi pi-github'
          },
          {
            id: 'template',
            title: 'Start from a Template',
            description: 'Choose a framework boilerplate.',
            button: 'Templates',
            icon: 'pi pi-clone'
          },
          {
            id: 'scratch',
            title: 'Start from Scratch',
            description: 'Start from a blank Workload.',
            button: 'Create',
            icon: 'pi pi-file'
          }
        ]
      }
    },
    'edge-dns': {
      label: 'Edge DNS',
      singular: 'Zone',
      columns: [
        { accessorKey: 'name', header: 'Zone Name', principal: true, enableSorting: true },
        { accessorKey: 'domain', header: 'Domain', grow: 2 },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'lastModified', header: 'Last Modified', grow: 2, enableSorting: true },
        { id: 'actions', kind: 'action', hideable: false }
      ],
      rows: [],
      empty: {
        icon: 'pi pi-globe',
        title: 'No DNS zones created yet',
        description: 'Add a zone to manage records and route traffic through Azion Edge DNS.',
        actions: [
          {
            id: 'create',
            title: 'Create a Zone',
            description: 'Set up a new DNS zone from scratch.',
            button: 'Create',
            icon: 'pi pi-plus'
          },
          {
            id: 'import',
            title: 'Import a Zone File',
            description: 'Import records from a BIND zone file.',
            button: 'Import',
            icon: 'pi pi-upload'
          }
        ]
      }
    },
    'object-storage': {
      label: 'Object Storage',
      singular: 'Bucket',
      columns: [
        { accessorKey: 'name', header: 'Bucket Name', principal: true, enableSorting: true },
        { accessorKey: 'access', header: 'Edge Access' },
        { accessorKey: 'objects', header: 'Objects' },
        { accessorKey: 'lastModified', header: 'Last Modified', grow: 2, enableSorting: true },
        { id: 'actions', kind: 'action', hideable: false }
      ],
      rows: [],
      empty: {
        icon: 'pi pi-database',
        title: 'No buckets created yet',
        description: 'Create a bucket to store and serve static assets from the edge.',
        actions: [
          {
            id: 'create',
            title: 'Create a Bucket',
            description: 'Provision a new storage bucket.',
            button: 'Create',
            icon: 'pi pi-plus'
          },
          {
            id: 'upload',
            title: 'Upload Files',
            description: 'Add objects to an existing bucket.',
            button: 'Upload',
            icon: 'pi pi-upload'
          }
        ]
      }
    },
    functions: {
      label: 'Functions',
      singular: 'Function',
      columns: [
        { accessorKey: 'name', header: 'Name', principal: true, enableSorting: true },
        { accessorKey: 'language', header: 'Language' },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'lastModified', header: 'Last Modified', grow: 2, enableSorting: true },
        { id: 'actions', kind: 'action', hideable: false }
      ],
      rows: [],
      empty: {
        icon: 'pi pi-code',
        title: 'No functions created yet',
        description: 'Write an edge function to run serverless code close to your users.',
        actions: [
          {
            id: 'scratch',
            title: 'Start from Scratch',
            description: 'Create a blank edge function.',
            button: 'Create',
            icon: 'pi pi-file'
          },
          {
            id: 'template',
            title: 'Start from a Template',
            description: 'Use a function boilerplate.',
            button: 'Templates',
            icon: 'pi pi-clone'
          }
        ]
      }
    }
  })

  // The resource types, as a VISIBLE tab row rather than options inside a filter menu.
  //
  // They used to live behind an unlabelled sliders IconButton, which made this card
  // answer only the question the reader had already answered — Applications — and hid
  // the four other things the account can hold behind a control that names none of
  // them. A reader who does not know Object Storage exists has no reason to open a
  // filter to look for it. The row states the set, and the count states which of them
  // this account actually owns, so "what can I get to from here" is answered by
  // reading rather than by clicking.
  //
  // Derived from the resource map, so a resource added there appears here with no
  // second list to keep in step.
  const resourceTabs = computed(() =>
    Object.entries(resources).map(([value, resource]) => ({
      value,
      label: resource.label,
      count: resource.rows.length
    }))
  )

  // Applications is selected by default: it is the thing the rest of the console hangs
  // off — a Workload serves one, a Function runs on one — so it is what the reader is
  // most likely to have come back to check.
  // Switching organization, account or workspace reloads Home: usage is metered for
  // the scope in force and the resources below are that scope's, so both go to
  // skeletons and come back re-read (src/lib/tenancy-reload.js).
  const { tenancyReloading } = useTenancyReload()

  // THE COLD ARRIVAL. Overview is the console's landing page and nothing on it is
  // held: account usage is metered per scope and the resource list is a query. So
  // the page opens as its own WIRE (./ui/HomeWire.vue) and settles once, which is a
  // different window from the tenancy re-read below and deliberately handled
  // differently — arriving there is no page yet to leave standing, whereas a scope
  // switch has a page on screen whose readings are merely stale, so that one keeps
  // the page and swaps only its numbers for skeletons.
  //
  // Long enough to read as a fetch, short enough that nobody waits for it. Shorter
  // than the tenancy reload's 900ms on purpose: this window lands on a first paint,
  // where the shell's own entrance is still arriving underneath it.
  const LOAD_MS = 620
  const arriving = ref(true)
  let arrivalTimer
  onMounted(() => {
    arrivalTimer = setTimeout(() => {
      arriving.value = false
    }, LOAD_MS)
  })
  onUnmounted(() => clearTimeout(arrivalTimer))

  // The agent pill, and whether the reader has already sent it away. The flag is
  // shared and persisted (../lib/agent-onboarding.js) — one answer for the whole
  // onboarding, not one per screen.
  const { agentOnboardingVisible, dismissAgentOnboarding } = useAgentOnboarding()

  // The greeting. Five time bands, re-read on the hour so a tab left open overnight
  // does not still say "Good morning" (../lib/greeting.js), and the name comes from
  // the address every route in the console already carries, falling back to the seeded
  // account's owner when that address is the sample's placeholder.
  //
  // The label and the name are read SEPARATELY because the heading renders them in two
  // colours: "Good morning," is muted and the name is at full contrast, so the line has
  // a subject the eye lands on. As one uniform string the whole thing reads as chrome —
  // which is what it was: a heading the size of a heading, saying nothing to anybody.
  const route = useRoute()
  const { greeting, nameFor } = useGreeting()
  const userName = computed(() => nameFor(route.query.email))

  // Say what dismissing DID. The pill is gone by the time this is read, so the toast
  // names the thing that left and where the prompt still lives — a dismissal with no
  // way back reads as a control that broke something.
  const onAgentOnboardingClose = () => {
    dismissAgentOnboarding()
    toast.info('Agent onboarding removed.', {
      description: 'The setup prompt stays available from the docs.'
    })
  }

  const selected = ref('applications')
  const current = computed(() => resources[selected.value])
  const isEmpty = computed(() => current.value.rows.length === 0)

  // A row on Overview goes where the same row goes in its own module — the detail
  // page. Overview is a way INTO the console, so a row that only highlighted would be
  // a dead end; `detailPath` is null for a resource whose detail view this prototype
  // does not have, and those rows simply do not navigate.
  const router = useRouter()

  const openRow = (event, row) => {
    const path = current.value.detailPath
    if (path) router.push(`${path}/${row.id}`)
  }

  const createFrom = (action) =>
    toast.info(action.title, { description: `Starting a new ${current.value.label} flow.` })

  // Colored Tag for a resource that is serving — Applications say "Active", Workloads
  // say "Live" — and neutral for everything else.
  const statusSeverity = (value) =>
    value === 'Active' || value === 'Live' ? 'success' : 'secondary'

  // Deleting from Overview removes the SAME resource its module list owns, so it asks
  // the same way: the menu click arms the dialog, and the row goes only once its name
  // has been typed back.
  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    current.value.rows = current.value.rows.filter((item) => item.id !== row.id)
    toast.success(`${row.name} deleted`)
    pendingDelete.value = null
  }

  // Row action menu — Dropdown emits (event, value); routed per row.
  const onRowAction = (event, value, row) => {
    if (value === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
      return
    }
    const copy = { view: `Viewing ${row.name}`, edit: `Editing ${row.name}` }
    toast.info(copy[value] ?? row.name, { description: `${current.value.label} · ${row.id}` })
  }
</script>

<template>
  <!-- No AppLayout here: the shell is owned by Overview.vue, which holds it ACROSS
       the version swap. When each version rendered its own, flipping the sample's
       version unmounted the sidebar and the header and replayed the route
       transition — measured, the nav, the header and the content zone were all
       replaced and `pageEnter` ran again — so a change of what the page shows read
       as a reload of an app that never reloaded. -->
  <!-- Overview is a short page — two stacked blocks that never fill a desktop
         viewport — so it centers in the scroll area instead of hanging from the
         top edge with a void below. `min-h-full`, never `h-full`: min-height
         resolves against the padded scroll box, and once the content does
         exceed it the box grows, justify-center runs out of free space, and
         nothing gets clipped above the scroll origin. -->
  <div class="layout-column-focused flex min-h-full flex-col justify-center">
    <!-- THE COLD ARRIVAL: the page's own wire, in the page's own column.
           Everything below is read rather than held — usage is metered per
           tenancy scope, the resource list is a query — so Overview opens as its
           own shape in placeholder fill and settles once the read lands. The wire
           is the same component the session teardown draws for this route family
           (./ui/HomeWire.vue), so the layout the reader sees for that beat is
           exactly the layout that resolves: nothing shifts on arrival.

           A wire and not in-place skeletons, for THIS window only: on a cold
           arrival there is no page yet to leave standing. A tenancy switch is the
           other case — the page is already there and only its readings are stale,
           so that window keeps the numbers' own skeletons (bound to
           `tenancyReloading` below) instead of tearing the page down. -->
    <HomeWire v-if="arriving" />

    <template v-else>
      <!-- THE OPENING ROW: who is here, and the one offer the page makes them.
           The greeting is the only line on Overview addressed to the PERSON rather
           than to their infrastructure, and it is what gives the agent pill a place
           to sit that is not a band of its own. The pill was centred on its own row
           above the columns; once it became dismissible that row had to disappear
           with it, and a row that exists only sometimes is a page that jumps. Here
           the greeting holds the row and the pill rides its right edge — dismissing
           it takes the pill out and moves nothing else.
           They stack below `md`, greeting first: the greeting is the heading, and a
           heading does not go second. -->
      <header
        class="flex flex-col gap-[var(--spacing-md)] md:flex-row md:items-center md:justify-between md:gap-[var(--spacing-lg)]"
      >
        <h1 class="text-heading-sm text-[var(--text-muted)]">
          {{ greeting }},
          <span class="text-[var(--text-default)]">{{ userName }}</span>
        </h1>

        <!-- `closable` removes the pill from the LAYOUT (it unmounts — no reserved
             band, nothing left tabbable), and the answer is persisted in
             lib/agent-onboarding.js so it survives the reload and the first-access
             surface that offers the same thing. -->
        <ContrastBanner
          v-if="agentOnboardingVisible"
          closable
          class="md:shrink-0"
          @close="onAgentOnboardingClose"
        />
      </header>

      <!-- Two columns that terminate at the same y. No `items-start`: the row
           keeps `align-items: stretch`, so its height is max(aside, section) and
           both columns stretch to it. Each column then needs one internal grow
           target (the metric grid; the resources CardBox) or the slack would
           pile up below the cards. `grow`, never `flex-1` — a zero flex-basis
           makes a column's intrinsic height contribution ill-defined, and that
           contribution is exactly what the row height derives from. -->
      <!--
        THE ENTRANCE. Replacing the wire MOUNTS these two columns, so each one
        rises into place as it arrives (`animate-content-enter`, src/styles/motion.css) —
        usage first, resources one beat behind it, so the page assembles in
        reading order instead of popping as one slab. Simultaneous arrival reads
        as a swap; a stagger reads as choreography (the same reasoning as the
        signed-out screens' entrance, ../lib/auth-entrance.js).

        It rises rather than travelling sideways: the page itself already arrived
        from the left a beat ago (the route transition), and only what is inside
        it changed now. The delay token is one fast-01 (70ms) — long enough to
        read as an order, short enough that the two still land together.
      -->
      <main
        class="layout-section-start flex flex-col gap-[var(--layout-boundary-start)] lg:flex-row lg:gap-[var(--layout-section-gap)]"
      >
        <!-- Left (minor): account usage — one metric per card, its reading beside a
             small progress bar showing plan consumption. On mobile it spans the
             full width above the resources; on `md`+ it becomes the narrow rail. -->
        <aside
          class="animate-content-enter motion-reduce:animate-none flex w-full shrink-0 flex-col gap-[var(--layout-group-gap)] lg:max-w-[var(--container-xs)]"
        >
          <div class="flex min-h-[var(--size-8)] items-center px-[var(--spacing-xs)]">
            <h2 class="text-heading-xxs text-[var(--text-default)]">Usage</h2>
          </div>

          <!-- 2-up on mobile where the aside is full width; single column once it
               narrows into the desktop rail. -->
          <div
            class="grid grow auto-rows-fr grid-cols-2 gap-[var(--layout-group-gap)] lg:grid-cols-1"
          >
            <CardBox
              v-for="metric in metrics"
              :key="metric.label"
              :padded="false"
            >
              <template #content>
                <div class="flex grow flex-col gap-[var(--spacing-sm)] p-[var(--spacing-md)]">
                  <div class="flex items-center gap-[var(--spacing-xs)]">
                    <span class="min-w-0 truncate text-label-sm text-[var(--text-default)]">
                      {{ metric.label }}
                    </span>
                    <Tooltip :text="metric.hint">
                      <i
                        class="pi pi-info-circle text-body-sm text-[var(--text-muted)]"
                        aria-hidden="true"
                      />
                    </Tooltip>
                  </div>
                  <div class="flex items-baseline gap-[var(--spacing-xxs)]">
                    <!-- A reading from the scope we just left is worse than no
                         reading: while the switch reloads, the number is a
                         placeholder the size of the number it replaces. -->
                    <Skeleton
                      v-if="tenancyReloading"
                      width="4.5rem"
                      height="1.75rem"
                    />
                    <template v-else>
                      <span class="text-big-number-sm tabular-nums text-[var(--text-default)]">
                        {{ metric.value }}
                      </span>
                      <span
                        v-if="metric.unit"
                        class="text-body-xs text-[var(--text-muted)]"
                        >{{ metric.unit }}</span
                      >
                    </template>
                  </div>
                </div>
                <!-- Progress reads as a flush bar on the card's bottom edge — a
                     consumption "border" that costs no inline space. -->
                <ProgressBar
                  :value="tenancyReloading ? 0 : metric.percent"
                  :max="100"
                  size="small"
                  shape="flat"
                  class="w-full shrink-0"
                  :aria-label="`${metric.label} usage`"
                />
              </template>
            </CardBox>
          </div>
        </aside>

        <!-- Right (major): the resource types on a tab row, each with the number of
             rows the account holds of it; choosing one swaps the card below.
             The entrance's follower — one fast-01 behind the usage column. -->
        <section
          class="animate-content-enter motion-reduce:animate-none flex w-full min-w-0 flex-col gap-[var(--layout-group-gap)] lg:flex-1 [--content-enter-delay:var(--transition-duration-fast-01)]"
        >
          <!-- The heading names the block; the tabs name what is IN it. `min-w-0` on
               the TabView is what lets the row scroll its own overflow (it fades its
               edges) instead of pushing the heading out of the header. The row's 30px
               items sit inside the header's 32px floor, so switching resource never
               moves the card below by a pixel. -->
          <header
            class="flex min-h-[var(--size-8)] items-center gap-[var(--spacing-sm)] px-[var(--spacing-xs)]"
          >
            <h2 class="shrink-0 text-heading-xxs text-[var(--text-default)]">Resources</h2>

            <TabView
              v-model:value="selected"
              class="min-w-0 flex-1"
            >
              <TabView.List>
                <TabView.Item
                  v-for="tab in resourceTabs"
                  :key="tab.value"
                  :value="tab.value"
                  :label="tab.label"
                >
                  <!-- The count is the point of the row: it separates "this account
                       has none of these" from "you have not looked yet". Muted, so
                       the label stays the thing being read. -->
                  <template #trailing>
                    <span class="text-body-xs tabular-nums text-[var(--text-muted)]">
                      {{ tab.count }}
                    </span>
                  </template>
                </TabView.Item>
              </TabView.List>
            </TabView>
          </header>

          <!-- Empty state (Workloads on a fresh account): one CardBox holding the
             EmptyState lead and an Item.List of the ways to create a first
             resource — each row an Item with a left icon, its title/description,
             and action. -->
          <!-- Not while reloading: "nothing here yet" is a claim about the new
             scope, and we have not finished reading it. The table below takes
             that window and shows its skeleton instead. -->
          <CardBox
            v-if="isEmpty && !tenancyReloading"
            key="resource-empty"
            :padded="false"
            class="grow"
          >
            <template #content>
              <EmptyState
                :icon="current.empty.icon"
                :title="current.empty.title"
                :description="current.empty.description"
                class="grow"
              />

              <Item.List class="border-t border-[var(--border-muted)]">
                <Item
                  v-for="action in current.empty.actions"
                  :key="action.id"
                >
                  <Item.Media>
                    <!-- Icon frame: 32px square, surface-raised fill, muted
                       hairline border, shape-elements radius, 18px glyph. It
                       lives in ./ui/IconFrame.vue because a module's own first
                       use renders this same row (./ui/ProductFirstUse.vue), and
                       a frame specified twice drifts on the first change. -->
                    <IconFrame :icon="action.icon" />
                  </Item.Media>
                  <Item.Content>
                    <Item.Title>{{ action.title }}</Item.Title>
                    <Item.Description>{{ action.description }}</Item.Description>
                  </Item.Content>
                  <Item.Actions>
                    <Button
                      :label="action.button"
                      kind="outlined"
                      size="medium"
                      @click="createFrom(action)"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>
            </template>
          </CardBox>

          <!-- Populated resource: data-driven Table inside a flush CardBox, with a
             per-row action menu. -->
          <CardBox
            v-else
            key="resource-table"
            :padded="false"
            class="grow"
          >
            <template #content>
              <!-- Paginated at 7: Overview is a summary next to a usage rail, and a
                 module's full list would set the page height from the resource with
                 the most rows. The paginator states the total, so the card is short
                 without hiding anything. `page-size` doubles as the skeleton's row
                 count during the tenancy reload.
                 SEVEN, not six, because the row count is what makes the two columns
                 END TOGETHER. The rail's height is fixed by its content — four metric
                 cards at their natural 96px plus the gaps, 484px, and nothing in it
                 can compress. At six rows the table's own content came to 436px and
                 the `grow` above stretched the CARD the remaining 48px, so the card's
                 bottom edge lined up with the rail while the paginator floated 48px
                 above it: a box that finished lower than everything inside it. At
                 seven the table's content is 485px, one pixel past the rail, so the
                 stretch reverses — the card is at its natural height and the rail's
                 `auto-rows-fr` absorbs the 1px instead. Same aligned bottom edges,
                 no empty band inside either box. Changing a metric card or a row
                 height moves this number; the check is that the paginator sits on
                 the card's bottom edge, not near it. -->
              <Table
                :data="current.rows"
                :columns="current.columns"
                row-key="id"
                enable-sorting
                paginated
                :loading="tenancyReloading"
                :page-size="7"
                @row-click="openRow"
              >
                <!-- THE CELLS ARE THE MODULE'S OWN CELLS. Overview lists the same rows
                   Applications and Workloads list, so a row has to read the same in
                   both places: the framework mark beside the name, the domain as a
                   link with its copy button pinned right, the status chip, and the
                   author + relative date. A summary that renders plain strings where
                   the module renders anatomy makes the two look like two datasets. -->
                <template #cell-name="{ value, row }">
                  <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                    <!-- Only applications carry a framework preset; a workload has no
                       mark, so the glyph is bound to the row and not to the column. -->
                    <i
                      v-if="row.preset"
                      :class="`ai-cor ${presetIcon(row.preset)}`"
                      class="shrink-0 text-[1.15em]"
                      :title="presetLabel(row.preset)"
                      aria-hidden="true"
                    />
                    <!-- Principal column opens the detail view — underline on hover. -->
                    <span class="cursor-pointer truncate hover:underline">{{ value }}</span>
                  </div>
                </template>

                <!-- Applications name the column `domainName`, workloads `domain`; the
                   cell is the same one, declared for both keys rather than renamed in
                   one of the fixtures the module lists also read. -->
                <template #cell-domainName="{ value }">
                  <DomainCell :value="value" />
                </template>

                <template #cell-domain="{ value }">
                  <DomainCell :value="value" />
                </template>

                <template #cell-status="{ value }">
                  <Tag
                    :label="value"
                    :severity="statusSeverity(value)"
                    size="medium"
                  />
                </template>

                <template #cell-lastModified="{ row }">
                  <LastModifiedCell
                    :author="row.author ?? row.owner"
                    :avatar-src="row.authorAvatar ?? row.ownerAvatar"
                    :date="row.modifiedAt"
                  />
                </template>

                <template #cell-actions="{ row }">
                  <Dropdown
                    placement="bottom-end"
                    @select="(event, value) => onRowAction(event, value, row)"
                  >
                    <Dropdown.Trigger>
                      <Tooltip text="Row actions">
                        <IconButton
                          icon="pi pi-ellipsis-h"
                          kind="outlined"
                          size="small"
                          aria-label="Row actions"
                        />
                      </Tooltip>
                    </Dropdown.Trigger>

                    <Dropdown.Group>
                      <Dropdown.Option
                        value="view"
                        label="View details"
                      />
                      <Dropdown.Option
                        value="edit"
                        label="Edit"
                      />
                    </Dropdown.Group>

                    <Dropdown.Group>
                      <Dropdown.Option
                        value="delete"
                        label="Delete"
                      >
                        <template #left>
                          <i
                            class="pi pi-trash"
                            aria-hidden="true"
                          />
                        </template>
                      </Dropdown.Option>
                    </Dropdown.Group>
                  </Dropdown>
                </template>
              </Table>
            </template>
          </CardBox>
        </section>

        <DeleteDialog
          v-model:open="deleteOpen"
          :kind="current.singular ?? 'resource'"
          :name="pendingDelete?.name ?? ''"
          @confirm="confirmDelete"
        />
      </main>
    </template>
  </div>
</template>
