<script setup>
  // SWITCH ACCOUNT — the tenancy tree, and the tenancy you are in.
  //
  // THE TREE IS THE POINT. The console's own dialog listed ONE tier at a time
  // (`listTypeAccountService`: `account_type=organizations&q=…`, a flat table plus a
  // tier picker), which answers "which organizations are there" but never "where does
  // this workspace sit". The tenancy IS a shape — an Organization owns Groups, a Group
  // owns Workspaces — and the reason an operator opens this dialog is to move around
  // that shape. So the roster renders as a TREE: Organizations at the root, their
  // children beneath them, indented one step per tier, each row led by its tier's own
  // glyph so a level is legible before its label is read.
  //
  // THE WORDS ARE THE NEW ONES. "brand", "reseller" and "client" are retired:
  // ORGANIZATION → GROUP → WORKSPACE (../../lib/state/accounts.js owns that rename and
  // the tiers it folds). Nothing here says the old words.
  //
  // ONE REQUEST, NOT ONE PER CHEVRON. A tree needs the shape, so the roster is fetched
  // whole (`listAccountTree`) and then expanded and filtered locally — which is also
  // why this surface owns a loading, an empty and a failure state.
  //
  // Search prunes the tree and reveals matches: a node survives when it matches or a
  // descendant does, so the path down to a match stays on screen, and every surviving
  // node is forced open while a term is live.
  //
  // WHAT A CLICK DOES. The row switches; the chevron only opens. That split is why the
  // chevron is its own button with `@click.stop` — a tier with children is both a place
  // to go and a place to look inside, and one gesture cannot mean both.
  //
  // THE TENANCY IN SCOPE states itself at the FOOT (PanelFooter), outside the scroll:
  // "which account am I in" is answerable at any scroll position, and the answer never
  // moves. The header pill has room for a name and nothing else.
  //
  // Switching is the store's (../../lib/state/accounts.js), and what it does to the
  // page underneath is ../../lib/state/tenancy-reload.js — the console's answer is a
  // full reload, and ours is the reload window plus the retreat from a resource that
  // does not exist in the tenancy we just moved to.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Message from '@aziontech/webkit/message'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, onScopeDispose, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import {
    accountTreeRows,
    accountTypeOf,
    expandableAccountIds,
    listAccountTree,
    useAccounts
  } from '../../lib/state/accounts.js'
  import AccountMark from './AccountMark.vue'

  const open = defineModel('open', { type: Boolean, default: false })

  const { currentAccount, currentAccountId, switchAccount } = useAccounts()

  const route = useRoute()
  const router = useRouter()

  // A quarter second on the term: long enough that a fast typist filters once per
  // word instead of once per letter, short enough that the rows feel like they answer
  // the keystroke. The filter is local, so this only paces the work, not a request.
  const SEARCH_DEBOUNCE_MS = 250

  const search = ref('')
  const debouncedSearch = ref('')

  // The fetched roster, flat — the tree is derived from it, so expanding a node is a
  // render and not a request.
  const roster = ref([])
  const expanded = ref(new Set())
  const loading = ref(false)
  const error = ref('')

  // Only the newest request may write: a retry fired while the first is still in
  // flight must not land the slower answer on top of the faster one.
  let requestId = 0
  let debounce

  const load = async () => {
    const id = ++requestId
    loading.value = true
    error.value = ''
    try {
      const { results } = await listAccountTree()
      if (id !== requestId) return
      roster.value = results
      // Opened all the way down. The whole roster is a couple of dozen rows, so
      // opening it closed would put three clicks between the reader and the tier they
      // actually switch to — and the shape is the thing this dialog exists to show.
      expanded.value = expandableAccountIds(results)
    } catch {
      if (id !== requestId) return
      roster.value = []
      // The failure is stated where the rows would have been, with the one action that
      // answers it. Not a toast: a toast leaves the reader looking at an empty tree
      // that reads as "no accounts", which is a different fact.
      error.value = 'The account list could not be loaded.'
    } finally {
      if (id === requestId) loading.value = false
    }
  }

  onScopeDispose(() => clearTimeout(debounce))

  // Opening resets the surface and re-asks. The caret goes to the FIELD, not to the
  // close button the focus trap picks first: the dialog exists to find one tenancy
  // among many, and landing on Close means the first keystroke does nothing and the
  // first Enter dismisses the thing just opened. Two frames after mount, because the
  // trap focuses on mount and whoever writes last wins.
  const searchRef = ref(null)

  watch(open, (isOpen) => {
    if (!isOpen) return
    search.value = ''
    debouncedSearch.value = ''
    load()
    nextTick(() => {
      globalThis.requestAnimationFrame(() => searchRef.value?.querySelector('input')?.focus())
    })
  })

  watch(search, (value) => {
    clearTimeout(debounce)
    debounce = setTimeout(() => {
      debouncedSearch.value = value
    }, SEARCH_DEBOUNCE_MS)
  })

  // Depth, chevron state, tier label and tier glyph all come from the one tree
  // function the Manage Resources page also uses, so the two trees cannot drift.
  const rows = computed(() =>
    accountTreeRows(roster.value, {
      expandedIds: expanded.value,
      search: debouncedSearch.value
    })
  )

  const toggle = (row) => {
    const next = new Set(expanded.value)
    if (next.has(row.id)) next.delete(row.id)
    else next.add(row.id)
    expanded.value = next
  }

  const currentType = computed(() => accountTypeOf(currentAccount.value?.type))

  // The console's four columns, in its order. `Name` carries the tree — the indent,
  // the chevron, the tier glyph — so it takes the widest share; the two ids are
  // fixed-width facts.
  //
  // NOTHING IS SORTABLE and nothing pages. Both would flatten the tree: a sort
  // reorders rows whose meaning is their position under a parent, and a page break
  // cuts children away from the parent they belong to. The tree is the order.
  const columns = [
    { accessorKey: 'name', header: 'Name', principal: true, grow: 3 },
    { accessorKey: 'typeLabel', header: 'Type' },
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'clientId', header: 'Client ID' }
  ]

  const onSelect = (_event, row) => {
    // The dialog closes either way: it asked one question and it has its answer. The
    // toast carries what changed, because the surface that would have shown it is the
    // one being dismissed.
    open.value = false
    if (switchAccount(row)) {
      toast.success(`Switched to ${row.name}.`, {
        description: `ID ${row.id} · Client ID ${row.clientId}`
      })
    } else {
      toast.info(`You're already on ${row.name}.`)
    }
  }

  const openAccountSettings = () => {
    open.value = false
    router.push({
      path: '/account',
      query: route.query.email ? { email: route.query.email } : {}
    })
  }
</script>

<template>
  <Dialog
    v-model:open="open"
    size="large"
    data-testid="switch-account-dialog"
  >
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>Switch account</DialogTitle>
          <DialogClose />
        </PanelHeader>

        <PanelContent class="flex flex-col gap-(--layout-section-gap)">
          <!-- THE ROSTER LEADS. The dialog was asked for to leave the account you are
               in, so the list of places to go is what the title opens onto — and the
               account you are in states itself at the FOOT (PanelFooter, below), where
               it is standing context rather than a step to read past. That also puts
               it outside the scroll: the panel's body scrolls, its footer does not, so
               "which account am I in" is on screen at any scroll position.
               The controls and the rows they narrow are ONE band, joined by the group
               step: the search is not a section of its own sitting a full band away
               from the table it filters. The band takes no heading of its own — the
               dialog's title already names it, and "Switch account / Accounts / Pick
               the account…" is the same word three times in 60px. -->
          <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
            <p class="text-body-sm text-(--text-muted)">
              Pick the account to operate as. Search matches a name, an account ID or a client ID.
            </p>

            <!-- ONE CONTROL, not two. The tier picker the console needed is gone with
                 the flat table: the tree already shows every tier, so a Select that hid
                 two of them would be a filter fighting the shape it sits above. -->
            <div ref="searchRef">
              <InputText
                v-model="search"
                size="medium"
                placeholder="Search accounts..."
                aria-label="Search accounts"
              >
                <template #iconLeft>
                  <i
                    class="pi pi-search"
                    aria-hidden="true"
                  />
                </template>
              </InputText>
            </div>

            <!-- The failure sits above the rows, not over them: the retry has to stay
                 reachable, and the table below keeps whatever it last showed. -->
            <Message
              v-if="error"
              severity="danger"
              size="medium"
              :label="error"
              action-label="Try again"
              @action="load"
            />

            <CardBox
              v-if="!error"
              :padded="false"
            >
              <template #content>
                <Table
                  :data="rows"
                  :columns="columns"
                  row-key="id"
                  :loading="loading"
                  :border="false"
                  max-height="var(--container-md)"
                  data-testid="switch-account-table"
                  @row-click="onSelect"
                >
                  <!-- THE TREE CELL: indent · chevron · tier glyph · name.
                       ONE STEP PER TIER is `--spacing-md`, derived from the token and not
                       a literal, so the indent cannot come unstuck from the rows it
                       nests (the Manage Resources tree steps by the same token).
                       THE CHEVRON BOX IS RESERVED on a leaf. Normally an empty glyph box
                       is the bug — it misreports where a row's content starts — but in a
                       tree the opposite holds: siblings share one content column, and a
                       leaf that dropped the box would slide its glyph and its name left
                       of every sibling that has children. -->
                  <template #cell-name="{ value, row }">
                    <div
                      class="flex w-full min-w-0 items-center gap-(--spacing-xxs)"
                      :style="{ paddingInlineStart: `calc(var(--spacing-md) * ${row.depth})` }"
                    >
                      <IconButton
                        v-if="row.hasChildren"
                        :icon="row.expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
                        kind="transparent"
                        size="small"
                        :aria-label="row.expanded ? `Collapse ${value}` : `Expand ${value}`"
                        :aria-expanded="row.expanded"
                        class="shrink-0"
                        @click.stop="toggle(row)"
                      />
                      <span
                        v-else
                        class="size-(--size-7) shrink-0"
                        aria-hidden="true"
                      />
                      <!-- THE TIER'S OWN GLYPH — Organization, Group and Workspace each
                           carry theirs (../../lib/state/accounts.js owns the mapping), so
                           a level is legible before the Type column is read. -->
                      <i
                        :class="row.icon"
                        class="shrink-0 text-body-sm text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="min-w-0 cursor-pointer truncate hover:underline">{{
                        value
                      }}</span>
                      <Tag
                        v-if="row.id === currentAccountId"
                        label="Current"
                        severity="success"
                        size="small"
                        class="ml-auto shrink-0"
                      />
                    </div>
                  </template>

                  <!-- The tier named, once. No icon on the tag: the row's leading glyph
                       already carries it, and the same glyph twice on one row is the
                       same statement made twice. -->
                  <template #cell-typeLabel="{ row }">
                    <Tag
                      :label="row.typeLabel"
                      :severity="accountTypeOf(row.type).severity"
                      size="small"
                    />
                  </template>

                  <template #cell-id="{ value }">
                    <span class="tabular-nums">{{ value }}</span>
                  </template>

                  <!-- Two sentences, because they are two different facts: a term that
                       matches nothing is the term's problem and is undone by clearing it,
                       and a roster with no tree at all is the account's own shape. A
                       FAILED request is neither: the table is not rendered at all then
                       (see `v-if` above), because a header with "nothing here" under it
                       would contradict the Message saying the request failed. -->
                  <template #empty>
                    <EmptyState
                      v-if="search"
                      key="no-match"
                      size="small"
                      icon="pi pi-search"
                      title="No accounts match your search"
                      :description="`Nothing in this tree matches “${search}”.`"
                    >
                      <template #actions>
                        <Button
                          label="Clear search"
                          kind="outlined"
                          size="medium"
                          @click="search = ''"
                        />
                      </template>
                    </EmptyState>
                    <EmptyState
                      v-else
                      key="no-tree"
                      size="small"
                      icon="pi pi-sitemap"
                      title="No other account to switch to"
                      description="This account is the only tenancy you can operate."
                    />
                  </template>
                </Table>
              </template>
            </CardBox>
          </section>
        </PanelContent>

        <!-- THE ACCOUNT IN SCOPE, at the foot — the one line of standing context the
             roster above it is offering to replace. The footer draws its own top rule
             and surface, so there is no card here: a bordered card inside a bordered
             footer is two rectangles with a stripe of dead space between them.
             IT TURNS INTO A COLUMN BELOW `sm`, where the dialog is a bottom sheet: the
             mark and the identity stay a row (a mark alone on a line is a decoration),
             and the settings button drops under them at full width instead of
             squeezing the name to "Caixa Eco…" with 200px going spare beside it. -->
        <PanelFooter class="flex-col items-stretch gap-(--spacing-sm) sm:flex-row sm:items-center">
          <!-- `items-start` below `sm`, where the name takes a line of its own and the
               block is three lines deep: a 24px mark centred against that floats in the
               middle of nothing. From `sm` up the block is two lines and centred is
               right. -->
          <div
            class="flex min-w-0 flex-1 items-start gap-(--spacing-sm) sm:items-center"
            data-testid="switch-account-current"
          >
            <AccountMark
              :name="currentAccount?.name"
              size="medium"
              class="shrink-0"
            />

            <div class="flex min-w-0 flex-col">
              <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                <!-- `basis-full` below `sm`: the name is a flex item that may shrink
                     past its own content, so on the sheet's width it would ellipsize
                     while the tags sat beside it. Its own line there, back on the
                     tags' line from `sm` up. -->
                <span
                  class="min-w-0 basis-full truncate text-label-sm text-(--text-default) sm:basis-auto"
                >
                  {{ currentAccount?.name }}
                </span>
                <!-- The LEVEL, in the level's own colour and glyph (the store owns
                     both), and the one fact the roster's Type column cannot state
                     about this row: that it is the account you are operating as. -->
                <Tag
                  :label="currentType.typeLabel"
                  :icon="currentType.icon"
                  :severity="currentType.severity"
                  size="small"
                  class="shrink-0"
                />
                <Tag
                  label="Current"
                  severity="success"
                  size="small"
                  class="shrink-0"
                />
              </div>

              <!-- The two identifiers, spelled out: they are what a support thread and
                   a contract each ask for, and this is the one place in the console
                   that can be read from memory. -->
              <p class="flex flex-wrap gap-(--spacing-sm) text-body-xs">
                <span class="text-(--text-muted)">
                  ID
                  <span class="tabular-nums text-(--text-default)">
                    {{ currentAccount?.id }}
                  </span>
                </span>
                <span class="text-(--text-muted)">
                  Client ID
                  <span class="tabular-nums text-(--text-default)">
                    {{ currentAccount?.clientId }}
                  </span>
                </span>
              </p>
            </div>
          </div>

          <Button
            label="Account settings"
            kind="outlined"
            size="medium"
            icon="pi pi-cog"
            class="shrink-0 max-sm:w-full"
            @click="openAccountSettings"
          />
        </PanelFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>
