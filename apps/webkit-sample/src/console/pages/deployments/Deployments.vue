<script setup>
  // Deployments — the Azion Console "Deployments" module. The app shell (single
  // sidebar + GlobalHeader with the module breadcrumb) comes from AppLayout; this
  // page renders only its content, in the shape every module list takes: a PAGE
  // HEADING over a CONTROLS HEADER (search + Filter) over a data-driven <Table>
  // living in a flush CardBox (../../components/page/PageHeading.vue,
  // ../../components/page/ControlsHeader.vue).
  //
  // ONE SUBJECT: WORKLOAD DEPLOYMENTS. Azion creates a deployment with one request,
  // `POST /workloads/{id}/deployments`, whose body is `{ name, active, current,
  // strategy }` — the workload is the PATH PARAMETER, so every row in this list
  // belongs to exactly one workload, and this module is the history of what has
  // shipped across all of them.
  //
  // The `strategy` half of that body is the reusable one — which application, firewall
  // and custom page a deployment binds — so it is authored once and applied by many.
  // It used to be a second tab here ("Settings"), which put a per-workload record and
  // an account-wide configuration behind one nav as if they were siblings. It now
  // lives in Settings → Build & Deployment (/account/build-deployment), and the only
  // action on this page creates a DEPLOY: the release composer (./ReleaseComposer.vue),
  // the same page every resource opens, the console's one deploy surface.
  //
  // Narrowing is the FILTER BUTTON (list/FilterButton.vue) beside the search — the one
  // shape every module list uses (the webkit-lists skill), never a
  // field/operator/value builder. The COLUMNS decide the fields; they pre-filter
  // `:data`, and the table sees only the rows that survive.
  //
  // The catalog is the SHARED one (`deploymentFilterFields` in src/lib/deployments.js)
  // — the same Status / Type / Environment / Author every deployment surface narrows
  // by — asked for `{ deployed: true }`, the window only a cross-resource list needs.
  // Being a first level, this page holds the state and binds it into DeploymentsTable
  // as models.
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import { toast } from '@aziontech/webkit/toast'
  import { consoleDeployRows, deployRows } from '@shared/lib/azion-deploys'
  import { DEPLOYMENT_HISTORY } from '../../lib/data/deployment-history'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DeploymentsTable from '../../components/deployment/DeploymentsTable.vue'
  import ProductFirstUse from '../../components/home/ProductFirstUse.vue'
  import ColumnsButton from '../../components/list/ColumnsButton.vue'
  import ExportButton from '../../components/list/ExportButton.vue'
  import FilterButton from '../../components/list/FilterButton.vue'
  import FilterChips from '../../components/list/FilterChips.vue'
  import RefreshButton from '../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../components/page/HeadingAction.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { useListFilters } from '../../lib/behavior/list-state'
  import { DEPLOYMENT_COLUMNS } from '../../lib/data/deployment-columns'
  import { deploymentFilterFields } from '../../lib/data/deployments'
  import { productFirstUse } from '../../lib/data/product-empty-states'
  import { useSampleMode } from '../../lib/state/sample-mode'
  import { tenancyRows } from '../../lib/state/tenancy-scope'

  // The sample's EMPTY version: a deployment is the record of having shipped, so an
  // account that has shipped nothing has no history at all, and the list is replaced by
  // first use (../lib/sample-mode.js, ./ui/ProductFirstUse.vue).
  const { accountEmpty } = useSampleMode()
  const firstUse = productFirstUse('deployments')

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // The statuses, resource types and environments come from src/lib/deployments.js
  // — the same vocabulary the workload's tables and the deployment page read, so a
  // status or a product tag can never mean two things in two places.
  //
  // `deployedAt` is the real instant — the date filter compares it and `date`
  // (the sortable, exportable display string) is derived from it by one
  // formatter, never hand-written per row (see src/lib/dates.js).
  //
  // `resourceId` is the deployed resource's real id: for an application it is the
  // id the Applications list uses, so the resource link lands on that detail page.
  const byNewest = (a, b) => b.deployedAt - a.deployedAt

  // The seeded population, the part a tenancy scope owns.
  const seededDeployments = computed(() =>
    [
      // The deployments whose whole `azion deploy` pipeline is recorded — which step
      // failed, which never ran. Every row opens `/deployments/:id`; these are the
      // ones that arrive there with a real pipeline to show (see `openDeployment`).
      // They are mapped by the module that owns those records
      // (src/lib/azion-deploys.js) and satisfy the same row contract as every row
      // beside them: the table cannot tell them apart.
      ...deployRows(),
      // The seeded history, shared with every workload's own Deployments tab
      // (src/lib/deployment-history.js). A workload page lists the rows whose
      // `workloadId` is its own — the same rows, filtered, never a second fixture.
      ...DEPLOYMENT_HISTORY
    ].sort(byNewest)
  )

  // A deploy started in THIS session — from here, or from any resource page — leads
  // the list and is never projected away: it is the operator's own, and it is still
  // moving (Building → Ready | Error), which is why this is a computed rather than a
  // list seeded once at mount.
  //
  // Switching account reloads the module (src/lib/tenancy-reload.js): both tabs show
  // skeletons while the new tenant's records arrive. A deployment belongs to the
  // account that made it, so the seed is projected through the account in scope
  // (src/lib/tenancy-scope.js).
  const allDeployments = computed(() =>
    [...consoleDeployRows(), ...tenancyRows(seededDeployments.value, 'deployments')].sort(byNewest)
  )

  // The SHARED catalog, asked for the Deployed window — the field only a
  // cross-resource list needs (src/lib/deployments.js). A getter for the Author
  // options: a deploy started in this session adds a person, and the field has to be
  // able to offer them without a reload.
  const deployFields = computed(() =>
    deploymentFilterFields(allDeployments.value, { deployed: true })
  )

  // A first-level page hoists its controls out of the table (see ui/ControlsHeader.vue)
  // and owns their state, binding the two models into DeploymentsTable. The rows are
  // passed unfiltered — the table applies the catalog itself, so the narrowing happens
  // in exactly one place whether the controls are hoisted or not.
  const {
    filters: deployFilters,
    search: deploySearch,
    loading,
    refresh
  } = useListFilters([], allDeployments)

  // The table the controls row drives. Download CSV calls the DS's own `exportCsv()`
  // through it (../../components/list/ExportButton.vue) — through the shared component
  // that owns the table, which forwards the call.
  const deploymentsTableRef = ref(null)

  // Which columns are switched off, driven by the Columns button beside the filter
  // (../../components/list/ColumnsButton.vue). Only a HIDDEN column is ever recorded, so this
  // never has to be kept in step with the column model above.
  //
  // ID SHIPS OFF. It is the column an operator wants when they are quoting a resource
  // into a support thread or an API call, and almost never while scanning the list —
  // so it starts hidden and is one switch away. That is the whole point of the panel:
  // a column can be available without being in the way by default.
  const columnVisibility = ref({ id: false })

  // ── Actions ────────────────────────────────────────────────────────────────
  // ONE create action: a DEPLOY. It binds a version of every resource and publishes it
  // into one or more Deployment settings, opening a deployment per workload those
  // settings reach. A page, not a drawer, because it is reviewed before it happens
  // (./ReleaseComposer.vue) — and the SAME page every other Deploy in the console
  // opens, only with nothing preselected here. Authoring the settings it publishes into
  // is account configuration and lives in Settings → Build & Deployment.
  //
  // There is no second, smaller deploy form beside it. This module used to carry a "New
  // Deployment" drawer as well, so the same act had two shapes — a drawer that asked for
  // a workload and an application, and a page that reviewed what a release reaches — and
  // which one you got depended on where you clicked. One place, for every deployment
  // event.
  //
  // It does not route to /deploy any more. That page is the Creation Center's template /
  // Git clone flow: it CREATES a chain (workload + application + connector + storage)
  // from a repository, which is a different action from deploying a resource that
  // already exists — and with no `?template=`, it silently opened whichever template
  // happened to be first.
  const newRelease = () => {
    router.push({ path: '/deployments/releases/new', query: { email: userEmail.value } })
  }

  // Every deployment opens its PAGE, whatever kind of record it is. It used to
  // split: the runs whose pipeline is recorded went to `/deployments/:id` and every
  // other row opened a read-only drawer — so the same click gave two different
  // depths of answer, and the shallower one closed on Escape and could not be linked
  // to or reloaded. A deployment is the thing people quote in a support thread, so it
  // gets a URL. The page resolves both families (lib/azion-deploys.js's
  // `deployPageRecord`) and renders the fields each one actually has.
  //
  // The VERSION id is the key, not `row.id`: it is the column this table shows and
  // the string a person copies, and for a recorded run it is the same value as its
  // own id — so one route covers both.
  const openDeployment = (event, row) =>
    router.push({
      path: `/deployments/${row.versionId}`,
      // The workload rides along for the same reason it does from a workload page: a
      // workload this sample does not seed has a derived history, and a row of it can
      // reach this list through a session deploy.
      query: {
        email: userEmail.value,
        workload: row.workloadId,
        workloadName: row.workloadName
      }
    })

  const onDeploymentAction = (event, value, row) => {
    if (value === 'details') {
      openDeployment(event, row)
      return
    }
    if (value === 'redeploy') {
      toast.info(`Redeploying version ${row.versionId}.`)
      return
    }
    toast.info(`Promoting version ${row.versionId} to Production.`)
  }
</script>

<template>
  <AppLayout
    active="deployments"
    :breadcrumb="[{ label: 'Deployments' }]"
  >
    <!-- THE MEASURE FOLLOWS THE MODE, the shape every module list carries
         (../applications/Applications.vue): the populated list takes the STANDARD page
         container (`layout-column`, 1388px) because its columns ARE the content, and
         first use takes the FOCUSED one (1024px), where a lead and three rows would
         otherwise float at a width they do not read at.
         This page is `padded`: it carries no full-bleed element, so it takes the
         boundary from AppLayout and scrolls as one, like every other list. -->
    <main
      class="flex min-h-full flex-col"
      :class="accountEmpty ? 'layout-column-focused' : 'layout-column'"
    >
      <!-- THE PAGE HEADING. A first-level resource page names itself: the module name
           over one line saying what the module is, with the module's own action on the
           right. The breadcrumb says WHERE you are; the heading says WHAT this page is.
           `size="medium"` is the first-level list scale (components/page/PageHeading.vue). -->
      <PageHeading
        v-if="!accountEmpty"
        size="medium"
        title="Deployments"
        description="Track every deployment your workloads have published, across all of your resources."
        :documentation="firstUse.learnMore.href"
      >
        <template #actions>
          <!-- The ONE way a deployment is created, here and everywhere else: the release
               composer (./ReleaseComposer.vue). From the module it opens with nothing
               settled — no Deployment setting and no scoped resource, so the operator
               selects the targets first and then composes (§ the `global` scenario);
               from a Workload or a resource the same page opens with that context in
               its URL. -->
          <HeadingAction
            label="Create Release"
            kind="outlined"
            icon="pi pi-cloud-upload"
            @click="newRelease"
          />
        </template>
      </PageHeading>

      <!-- FIRST USE, IN HOME'S CONTAINER: the same centred box every other module's
           empty version uses. A deployment is the record of having shipped, so an account
           that has shipped nothing has no history to list at all.
           CENTRED WITH AUTO MARGINS: `my-auto` asks the flex parent to split its free
           space above and below this one item, and collapses to 0 when the block is
           taller than the viewport instead of clipping its top. -->
      <div
        v-if="accountEmpty"
        class="my-auto flex w-full flex-col py-(--spacing-xl)"
      >
        <ProductFirstUse :product="firstUse" />
      </div>

      <!-- The page's parent section. It holds ONE section here: the controls row and
           the table are parts of the same band. The RHYTHM is the shared one — the page
           stack carries no vertical gap, the parent spaces its sections at
           --layout-section-gap, and each section spaces its own parts at
           --layout-group-gap (theme semantic/layouts § "THE PAGE SHAPE"). -->
      <section
        v-else
        class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)"
      >
        <!-- ONE section, at --layout-group-gap: the controls row narrows the list, the
             table is what both are about. -->
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <ControlsHeader>
            <FilterButton
              v-model="deployFilters"
              :fields="deployFields"
            />
            <InputText
              v-model="deploySearch"
              size="medium"
              placeholder="Search deployments"
              aria-label="Search deployments"
              class="min-w-36 grow basis-(--container-2xs)"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </InputText>
            <template #actions>
              <!-- THE RIGHT GROUP: the three controls that act on the LISTING rather
                   than narrow it — fetch it again, take it away as a file, choose
                   which columns it shows. Download CSV reaches the table through the
                   shared component that owns it (it forwards `exportCsv`), because
                   the table itself is one level down. -->
              <RefreshButton
                :loading="loading"
                @refresh="refresh"
              />
              <ExportButton
                :table="deploymentsTableRef"
                filename="deployments.csv"
              />
              <ColumnsButton
                v-model="columnVisibility"
                :columns="DEPLOYMENT_COLUMNS"
              />
            </template>
          </ControlsHeader>

          <FilterChips
            v-model="deployFilters"
            :fields="deployFields"
          />

          <section class="flex min-h-0 flex-col">
            <CardBox :padded="false">
              <template #content>
                <!-- The shared deployment table owns the columns and the cells; its
                 controls are hoisted into the page's ControlsHeader and filter row
                 above (`:controls="false"`), with their state bound back in as the
                 two models. It applies the catalog itself, so the narrowing happens
                 in one place whether the controls are hoisted or not. Page size is
                 the component's default, so every deployment table paginates and
                 reads the same. -->
                <DeploymentsTable
                  ref="deploymentsTableRef"
                  v-model:columnVisibility="columnVisibility"
                  v-model:search="deploySearch"
                  v-model:filters="deployFilters"
                  :deployments="allDeployments"
                  :fields="deployFields"
                  :email="userEmail"
                  :controls="false"
                  :loading="loading"
                  @row-click="openDeployment"
                  @action="onDeploymentAction"
                />
              </template>
            </CardBox>
          </section>
        </section>
      </section>
    </main>
  </AppLayout>
</template>
