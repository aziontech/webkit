<script setup>
  // Application → Functions Instances. Edge functions instantiated on this
  // application.
  //
  // An INTERNAL page on the DATA measure — see DeviceGroups.vue for the page shape
  // (one band: the controls row over the table it narrows, carrying the band step).
  //
  // AN INSTANCE IS A BINDING, NOT A RESOURCE OF ITS OWN. The function is written once in
  // the Functions module (../../components/Functions.vue) and instanced here with this
  // application's own name and arguments — so this tab and that module read and write
  // ONE library (../../lib/functions.js), never two lists that happen to use the same
  // words.
  //
  // THE CREATE FORM IS THE ENDPOINT'S BODY, field for field:
  //
  //   POST /v4/workspace/applications/{application_id}/functions
  //   { name, function, args, active, azion_form }
  //
  //   `name`      the instance's name on this application — the one required text field;
  //   `function`  the function's id, from the selector below;
  //   `args`      the instance's arguments, as JSON. Selecting a function SEEDS them from
  //               its `default_args`, which is what the console does: the function
  //               declares the arguments it reads, and the instance is that function with
  //               this application's values for them;
  //   `active`    posted as `true`. The console hard-codes it on create rather than
  //               asking, so this form does not ask either;
  //   `azion_form` the Form Builder's JSON Schema (a schema renders a form which writes
  //               the args). The sample does not build the Form Builder — the same stance
  //               ../../lib/create-resources.js takes for the function itself — so the
  //               args are written as JSON, which is what the endpoint receives either way.
  //
  // That relationship is visible in both directions:
  //
  //   this way   → the Function column links to the function's own page, and the
  //                selector offers the functions the module actually holds — narrowed
  //                to `execution_environment: application`, because a firewall function
  //                receives a different request object and cannot be instanced here;
  //   that way   → creating an instance counts up the function's Instances column and
  //                takes it out of Draft, and a function written from the selector's
  //                quick-add is in the module's list before the reader is back here.
  //
  // ── "CREATE FUNCTION" IS THE CREATE FUNCTION PAGE ──
  //
  // The Function field is a Select for a RELATED resource, so its footer carries a
  // "Create Function" quick-add. That quick-add does NOT open a small drawer asking for a
  // name and a runtime: a function is a FIRST-LEVEL RESOURCE, and the console's surface
  // rule (../../lib/surfaces.js) says a first-level resource creates on its own page. A
  // reduced copy of that page in a drawer would be a second, lesser Create Function —
  // one that cannot write the code, which is the resource itself.
  //
  // So the quick-add LEAVES for `/functions/new` — the real editor page
  // (../../components/CreateFunction.vue) — and comes back. What the reader had already
  // typed here is kept across the hop in sessionStorage, so the round trip costs them
  // nothing:
  //
  //   leaving  → the in-progress instance is stashed, and the create page is given a
  //              `returnTo` pointing back at this tab (with `resume=function-instance`);
  //   back     → this view reopens the drawer, restores the name, and — when the create
  //              page returns a `created` id — selects that new function.
  //
  // Cancelling on the create page returns the same way, with the typed name intact and
  // nothing selected: leaving to create something is not a reason to lose the form.
  //
  // The drawer's field shape is the console's — separated fields, a real `<Label for>`
  // over a full-width control (../../components/ui/FieldStack.vue, the shape
  // ../../components/AddVariableDrawer.vue set), with the band's guidance said once in
  // its `Section` hint.
  //
  // The "Functions Instance" button itself is on the page's tab row, not in this
  // heading (ApplicationDetail owns that row). The flow stays here: the shell calls
  // the `openCreate` this view exposes.
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Select from '@aziontech/webkit/select'
  import Table from '@aziontech/webkit/table'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onMounted, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import FieldStack from '../../../components/form/FieldStack.vue'
  import ResourceDrawer from '../../../components/form/ResourceDrawer.vue'
  import FilterBar from '../../../components/list/FilterBar.vue'
  import MonacoEditor from '../../../components/monaco-editor/monaco-editor.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import Section from '../../../components/page/Section.vue'
  import { sleep } from '../../../lib/behavior/forms'
  import { useListFilters } from '../../../lib/behavior/list-state'
  import { countInstance, functionById, functionOptionsFor } from '../../../lib/data/functions'

  const columns = [
    { accessorKey: 'name', header: 'Name', principal: true, enableSorting: true },
    { accessorKey: 'edgeFunction', header: 'Function' },
    { accessorKey: 'args', header: 'Arguments', grow: 2 }
  ]

  // Free-text search, hoisted into the ControlsHeader above the card.

  // An instance stores the function's ID, never its name: the name is the library's to
  // change, and a row holding a copy of it would be the one place in the console still
  // showing the old one.
  const instances = ref([
    { id: 'fi-auth', name: 'auth-guard', functionId: '4021884', args: '{}' },
    { id: 'fi-img', name: 'img-resize', functionId: '4021885', args: '{ "quality": 80 }' }
  ])

  // The rows the table renders: the instance, plus the bound function resolved from the
  // library. A function deleted in the Functions module leaves the binding behind, so
  // the cell says so rather than rendering an empty column.
  const rows = computed(() =>
    instances.value.map((instance) => {
      const fn = functionById(instance.functionId)
      return { ...instance, edgeFunction: fn?.name ?? 'Deleted function', functionExists: !!fn }
    })
  )

  // The functions this application can instance — the library's own, narrowed by
  // `execution_environment` (../../lib/functions.js). A function written on the create
  // page lands in that library, so this list picks it up with no wiring of its own.
  const functionOptions = computed(() => functionOptionsFor('application'))
  const functionLabel = (value) =>
    functionOptions.value.find((option) => option.value === value)?.label ?? ''

  // The arguments editor opens on an empty object, and is SEEDED from the function the
  // moment one is picked — the function's `default_args` are the arguments it documents
  // itself as reading, so they are the honest starting point for an instance of it. The
  // reader edits them from there; this only ever replaces what the previous selection
  // seeded, never something they typed against the function now chosen.
  const EMPTY_ARGS = '{}'

  const seedArgs = (functionId) => {
    const fn = functionById(functionId)
    if (!fn) return
    form.args = JSON.stringify(fn.args ?? {}, null, 2)
    errors.args = ''
  }

  // ── LARGE create drawer — the Functions Instance itself ───────────────────
  const createOpen = ref(false)
  // Opened from the page's tab row (ApplicationDetail).
  defineExpose({ openCreate: () => (createOpen.value = true) })
  // One field per property of the request body the endpoint takes (see the header).
  const form = reactive({ name: '', functionId: '', args: EMPTY_ARGS })
  const errors = reactive({ name: '', functionId: '', args: '' })
  const submitting = ref(false)

  // Controls the Function Select's dropdown so the quick-add (its footer slot) can
  // close it before the page leaves for the create page.
  const functionSelectOpen = ref(false)

  // Sentinel value for the "Create Function" option in the Select footer. The Select
  // is controlled (`:model-value`), so picking it never commits — the page leaves for
  // the create page instead and the real selection is left untouched.
  const CREATE_FUNCTION = '__create-function__'
  const onFunctionModel = (value) => {
    if (value === CREATE_FUNCTION) {
      goCreateFunction()
      return
    }
    form.functionId = value
    errors.functionId = ''
    seedArgs(value)
  }

  watch(createOpen, (open) => {
    if (open) return
    form.name = ''
    form.functionId = ''
    form.args = EMPTY_ARGS
    errors.name = ''
    errors.functionId = ''
    errors.args = ''
  })

  /** `args` is posted as an object, so what is typed has to parse to one. */
  const parsedArgs = () => {
    try {
      const value = JSON.parse(form.args)
      // `[1,2]` and `"x"` are valid JSON and invalid arguments: the endpoint takes an
      // object, and an array would be posted as one silently.
      if (value === null || Array.isArray(value) || typeof value !== 'object') return null
      return value
    } catch {
      return null
    }
  }

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'Name is required.'
    errors.functionId = form.functionId ? '' : 'Select a function.'
    errors.args = parsedArgs() ? '' : 'Arguments must be a JSON object.'
    return !errors.name && !errors.functionId && !errors.args
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await sleep(900)
      const name = form.name.trim()

      // Stands in for `POST /v4/workspace/applications/{id}/functions`. The row keeps
      // what that body carries — `active` is posted as `true` and never asked for, so
      // it is not a column either.
      instances.value = [
        {
          id: `fi-${Date.now()}`,
          name,
          functionId: form.functionId,
          args: JSON.stringify(parsedArgs())
        },
        ...instances.value
      ]

      // The other half of the relationship: the module's Instances column is this count.
      countInstance(form.functionId)

      toast.success(`Functions Instance "${name}" created.`)
      createOpen.value = false
    } catch (error) {
      toast.error('Could not create the functions instance.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }

  // ── The filter catalog ────────────────────────────────────────────────────
  // Function is the one enumerable column — which function an instance runs is
  // what people narrow by. Name and Arguments are free text, covered by the search.
  const filterFields = [
    {
      id: 'edgeFunction',
      label: 'Function',
      kind: 'options',
      get options() {
        return [...new Set(rows.value.map((instance) => instance.edgeFunction))]
          .sort((a, b) => a.localeCompare(b))
          .map((fn) => ({ value: fn, label: fn }))
      },
      match: (instance, values) => values.includes(instance.edgeFunction)
    }
  ]

  // No pagination model: this table lists every row, so there is no page offset a
  // narrowed set could strand.
  const { filters, search, visibleRows: visibleInstances } = useListFilters(filterFields, rows)

  // OPENING THE BOUND FUNCTION. The instance is this application's binding; the code is
  // the Functions module's record, so the Function column leaves for that module's own
  // page rather than reproducing a second, lesser view of it here. A `router-link` with
  // the truncate + arrow shape every cross-module cell in the console uses
  // (../../components/ui/DeploymentsTable.vue, ./ui/DomainCell.vue). The email rides
  // along the way every route in this prototype carries it.
  const route = useRoute()
  const router = useRouter()

  const email = computed(() => route.query.email || undefined)
  const functionPath = (row) => `/functions/${row.functionId}`

  // ── LEAVING TO CREATE A FUNCTION, AND COMING BACK ─────────────────────────
  //
  // A function creates on its own page (../../lib/surfaces.js), so the quick-add is a
  // round trip rather than a nested drawer. The in-progress instance is stashed under a
  // key of THIS tab's path, so two applications' drawers cannot restore each other's
  // work, and the create page is told where to come back to.
  const DRAFT_KEY = 'webkit-sample:function-instance-draft'
  const RESUME = 'function-instance'

  const readDraft = () => {
    try {
      const raw = globalThis.sessionStorage?.getItem(DRAFT_KEY)
      const draft = raw ? JSON.parse(raw) : null
      return draft?.path === route.path ? draft : null
    } catch {
      return null
    }
  }

  const clearDraft = () => {
    try {
      globalThis.sessionStorage?.removeItem(DRAFT_KEY)
    } catch {
      // An unavailable sessionStorage must not break the flow — the round trip still
      // works, it just arrives back with an empty form.
    }
  }

  const goCreateFunction = () => {
    functionSelectOpen.value = false
    try {
      globalThis.sessionStorage?.setItem(
        DRAFT_KEY,
        JSON.stringify({
          path: route.path,
          name: form.name,
          functionId: form.functionId,
          args: form.args
        })
      )
    } catch {
      // Same as above: the hop is worth making even when the draft cannot be kept.
    }

    // `returnTo` carries the resume marker, so BOTH outcomes of the create page — saved
    // or cancelled — land back on this tab with the drawer reopened.
    const returnTo = router.resolve({
      path: route.path,
      query: { ...route.query, resume: RESUME }
    }).fullPath

    router.push({
      path: '/functions/new',
      query: { email: email.value, returnTo, returnLabel: 'Functions Instances' }
    })
  }

  // Coming back. The create page pushes `resume` (always) and `created` (on save), so
  // the drawer reopens exactly as it was left, with the new function already selected.
  onMounted(() => {
    if (route.query.resume !== RESUME) return clearDraft()

    const draft = readDraft()
    const createdId = route.query.created ? String(route.query.created) : ''

    form.name = draft?.name ?? ''
    form.functionId = createdId || draft?.functionId || ''
    form.args = draft?.args ?? EMPTY_ARGS
    errors.name = ''
    errors.functionId = ''
    errors.args = ''
    // A function created on the way back seeds its own arguments, exactly as picking one
    // from the list would — the reader chose it, they just chose it by writing it.
    if (createdId) seedArgs(createdId)
    createOpen.value = true

    clearDraft()
    // The resume markers are a way BACK into the drawer, not part of the route — the
    // same reason `?state=` does not stay in the address bar (../../lib/sample-mode.js).
    const query = { ...route.query }
    delete query.resume
    delete query.created
    router.replace({ path: route.path, query })
  })
</script>

<template>
  <div class="layout-column layout-boundary flex min-w-0 flex-col">
    <PageHeading
      title="Functions Instances"
      description="Edge functions instantiated on this application."
      size="small"
    />

    <!-- The page's parent section. It holds one section here — the controls row
         over the table it narrows, at the GROUP step — and spaces whatever sits
         inside it at --layout-section-gap. -->
    <section class="layout-section-start flex min-w-0 flex-col gap-[var(--layout-section-gap)]">
      <section class="flex min-w-0 flex-col gap-[var(--layout-group-gap)]">
        <!-- The band's CONTROLS: narrowing on the left, the band's own action on the
             right, above the card — the same row every list in the console opens with. -->
        <ControlsHeader>
          <!-- Search drives the table's global filter from outside the card, so the field is
               a plain InputText (`Table.Search` is context-aware and only works inside
               `<Table>`). One horizontal band: it grows into the row's slack and compresses
               rather than wrapping (see ui/ControlsHeader.vue). -->
          <InputText
            v-model="search"
            size="large"
            placeholder="Search functions instances"
            aria-label="Search functions instances"
            class="min-w-36 grow basis-[var(--container-2xs)]"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>
        </ControlsHeader>

        <!-- The filter bar takes its own row: it grows as filters are applied, so
               sharing the controls row would make the search field jump width. -->
        <FilterBar
          v-model="filters"
          :fields="filterFields"
        />

        <CardBox :padded="false">
          <template #content>
            <Table
              v-model:globalFilter="search"
              :data="visibleInstances"
              :columns="columns"
              row-key="id"
              enable-sorting
              :border="false"
            >
              <!-- The binding, rendered as what it is: a pointer at a record another
                   module owns — the console's cross-module cell (truncating name +
                   arrow), not a standalone Link component. A function that has since
                   been deleted has nothing to point at, so its cell is plain text. -->
              <template #cell-edgeFunction="{ row }">
                <div class="flex min-w-0 items-center">
                  <router-link
                    v-if="row.functionExists"
                    :to="{ path: functionPath(row), query: { email } }"
                    class="flex min-w-0 items-center gap-[var(--spacing-xxs)] text-body-sm text-[var(--text-default)] no-underline hover:underline"
                    @click.stop
                  >
                    <span class="truncate">{{ row.edgeFunction }}</span>
                    <i
                      class="pi pi-arrow-up-right shrink-0 text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                  </router-link>
                  <span
                    v-else
                    class="truncate text-body-sm text-[var(--text-muted)]"
                    >{{ row.edgeFunction }}</span
                  >
                </div>
              </template>
            </Table>
          </template>
        </CardBox>
      </section>
    </section>

    <ResourceDrawer
      v-model:open="createOpen"
      title="Add Functions Instance"
      :submitting="submitting"
      @submit="submit"
    >
      <Section
        stacked
        :divided="false"
        title="General"
        hint="Instantiates a function from the Functions module on this application; a rule in Rules Engine is what runs it. One function can be instantiated more than once with different arguments, so the name is what tells the two apart in the rules that call them."
      >
        <FieldStack
          label="Name"
          :message="errors.name"
          :message-kind="form.name.trim() ? 'invalid' : 'required'"
        >
          <template #default="{ controlId, describedBy }">
            <InputText
              :id="controlId"
              v-model="form.name"
              size="large"
              :disabled="submitting"
              class="w-full"
              placeholder="My application function instance"
              :required="!!errors.name && !form.name.trim()"
              :invalid="!!errors.name && !!form.name.trim()"
              :aria-describedby="describedBy"
              @update:model-value="errors.name = ''"
            />
          </template>
        </FieldStack>
      </Section>

      <!-- The related-resource case: a Select over the Functions module's library, with
           a "Create Function" quick-add in its footer that leaves for that module's
           create page and comes back. -->
      <Section
        stacked
        :divided="false"
        title="Function"
        hint="Select an existing function and customize the arguments it runs with. Only functions written for the application environment are listed — a firewall function receives a different request object. If the one you need does not exist yet, the selector's footer opens the function editor and brings you back here with it selected."
      >
        <FieldStack
          label="Edge Function"
          :message="errors.functionId"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <Select
              v-model:open="functionSelectOpen"
              :model-value="form.functionId"
              size="large"
              :disabled="submitting"
              class="w-full"
              placeholder="Select a function"
              :required="!!errors.functionId"
              :display-value="functionLabel"
              @update:model-value="onFunctionModel"
            >
              <Select.Trigger
                :id="controlId"
                aria-label="Edge Function"
                :aria-describedby="describedBy"
              />
              <!-- TEMPORARY WORKAROUND (webkit bug): Select.Content teleports to
                   <body> at z-50, so inside the Drawer panel (z-[1001]) it renders
                   behind and is invisible. Remove once webkit stacks overlay popups
                   above Drawer. -->
              <Select.Content class="!z-[1002]">
                <Select.Option
                  v-for="fn in functionOptions"
                  :key="fn.value"
                  :value="fn.value"
                >
                  {{ fn.label }}
                </Select.Option>
                <!-- Quick-add lives in the Select's bottom (footer) slot as a normal
                     option; picking it stashes this form and opens the function
                     editor instead of committing a value. -->
                <template #footer>
                  <Select.Option
                    :value="CREATE_FUNCTION"
                    icon="pi pi-plus-circle"
                    class="w-full"
                  >
                    Create Function
                  </Select.Option>
                </template>
              </Select.Content>
            </Select>
          </template>
        </FieldStack>

        <!-- ARGUMENTS — `args`, the third property of the request body. JSON the reader
             writes, not a value they pick, so it is the same editor the function's own
             page writes its `default_args` in (../../components/monaco-editor), seeded
             from those defaults when a function is selected. Monaco's JSON worker
             underlines a syntax error as it is typed; the "must be an object" check runs
             on submit, with the rest of the form.

             NOT in a FieldStack: that renders a real `<label for>`, and Monaco's input is
             a hidden textarea a label cannot point at — which is exactly why the editor
             carries its own label and helper row. -->
        <MonacoEditor
          v-model="form.args"
          label="Arguments"
          language="json"
          path="function-instance.args.json"
          height="12rem"
          size="small"
          :disabled="submitting"
          :invalid="!!errors.args"
          :helper-text="errors.args || 'Read in the function as event.args(\'arg_name\').'"
          aria-label="Arguments"
          class="w-full"
          @update:model-value="errors.args = ''"
        />
      </Section>
    </ResourceDrawer>
  </div>
</template>
