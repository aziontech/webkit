<script setup>
  // FunctionDetail — the view of a function that already exists, at `/functions/:id`.
  //
  // WHY IT IS NOT THE GENERIC SETTINGS PAGE. Every other first-level resource is edited
  // by ./ResourceSettings.vue, generated from the same descriptor as its create page —
  // and that is right for a resource whose settings ARE a list of fields. A function's
  // are not: the record is a body of code, a JSON object of default arguments, and four
  // small properties. Rendering the code as one row in a stack of rows makes the reader
  // scroll past the settings to reach the thing they came to read.
  //
  // SO THE PAGE IS AN EXPLORER, the same shape SqlDatabaseDetail and RealTimeEvents
  // take — resizable panels around the thing you came to work on, each scrolling its
  // own body, the page itself never scrolling:
  //
  //   ┌─ Code | Settings ───────────────────────────────────────────────────────┐
  //   │ [ Code · Arguments ]   Run                    ┊                          │
  //   │ the editor, filling                           ┊  Preview — the response  │
  //   │                                               ┊  the function produces,  │
  //   ├─ Terminal ────────────────────────────────────┤  rendered                │
  //   │ what the last run reported                    ┊                          │
  //   └───────────────────────────────────────────────┴──────────────────────────┘
  //
  // TWO TABS, NOT THREE. Code and Arguments were separate tabs, which made a reader
  // switch pages to see the values the code they are reading is written against. They
  // are one editor now with a SegmentedButton over it: the same surface, two documents,
  // and the preview beside them updates from whichever one was last edited.
  //
  // THE PANELS ARE THE DESIGN SYSTEM'S — `ResizablePanel`, not `Sidebar`. The code, the
  // terminal and the preview are three views of one piece of work, not three places to
  // navigate to, so the edges between them are resizable panes (see
  // ui/FunctionCodeEditor.vue for why that distinction decides the component). `Sidebar`
  // stays what its name says: the app's navigation rail.
  //
  // ONE RECORD, ONE COMMIT. Both tabs describe one function, so they share one baseline
  // and one save bar (ui/SettingsSaveBar.vue). Editing the code and flipping Active is
  // ONE save, and the bar is NOT gated on a tab: an edit made on Code is still pending
  // while the reader is on Settings, and a bar that vanished on the tab switch would say
  // otherwise.
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import FieldRow from '../../components/form/FieldRow.vue'
  import SettingsSaveBar from '../../components/form/SettingsSaveBar.vue'
  import FunctionCodeEditor from '../../components/function/FunctionCodeEditor.vue'
  import FunctionSettings from '../../components/function/FunctionSettings.vue'
  import PageTabs from '../../components/page/PageTabs.vue'
  import Section from '../../components/page/Section.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { saveGroup, useBaseline } from '../../lib/behavior/forms'
  import { useTabEnter } from '../../lib/behavior/tab-enter'
  import { functionById, runtimeOf } from '../../lib/data/functions'

  const route = useRoute()
  const router = useRouter()

  // The record. The prototype has no store, so the seed IS the store: the row is read
  // once, by id, and the page edits its own copy — mutating the seed would leak an
  // unsaved edit into the list behind it.
  const record = functionById(route.params.id)
  const runtime = computed(() => runtimeOf(record))
  const title = computed(() => record?.name ?? 'Function')

  // An id nobody owns is not a screen: there is no record to show and nothing to edit,
  // so the page hands back to the list rather than rendering an editor over nothing.
  if (!record) router.replace({ path: '/functions', query: { email: route.query.email } })

  const form = reactive({
    name: record?.name ?? '',
    executionEnvironment: record?.executionEnvironment ?? 'application',
    active: record?.active ?? true,
    code: record?.code ?? '',
    // The editor edits TEXT; `default_args` is an object. Indented on the way in so the
    // reader meets formatted JSON, parsed on the way out.
    args: JSON.stringify(record?.args ?? {}, null, 2)
  })

  const { dirty, commit } = useBaseline(form)
  const saving = ref(false)

  // Discard restores the last committed state, so the page keeps its own snapshot —
  // `useBaseline` reports dirtiness but does not hand the snapshot back.
  let snapshot = JSON.stringify(form)
  const discard = () => Object.assign(form, JSON.parse(snapshot))

  // --- Tabs (URL-synced, so a tab is linkable and survives a reload) ---------
  const tabs = [
    { value: 'code', label: 'Code' },
    { value: 'settings', label: 'Settings' }
  ]
  const activeTab = computed({
    get: () => (tabs.some((tab) => tab.value === route.query.tab) ? route.query.tab : 'code'),
    set: (value) => router.replace({ query: { ...route.query, tab: value } })
  })

  // Which document the one editor is showing. In the URL beside the tab, for the same
  // reason: a review comment can point at the arguments, not at "the Code tab, then
  // switch".
  const documents = [
    { label: 'Code', value: 'code' },
    { label: 'Arguments', value: 'arguments' }
  ]
  const activeDocument = computed({
    get: () => (documents.some((doc) => doc.value === route.query.doc) ? route.query.doc : 'code'),
    set: (value) => router.replace({ query: { ...route.query, doc: value } })
  })

  // A tab switch replaces a whole screen, so it arrives like one.
  const scrollRef = ref(null)
  const enterRef = ref(null)
  useTabEnter(enterRef, activeTab, scrollRef)

  // --- Validation, same rules as the create page ----------------------------
  const nameError = ref('')
  const codeError = ref('')
  const argsError = ref('')

  /** `default_args` is posted as an object, so what is typed has to parse to one. */
  const parsedArgs = () => {
    try {
      const value = JSON.parse(form.args)
      if (value === null || Array.isArray(value) || typeof value !== 'object') return null
      return value
    } catch {
      return null
    }
  }

  /**
   * Every failure is behind a tab or a document here, so the surface holding the
   * leftmost one is switched to before the field is marked. A message on a tab nobody
   * is looking at is a failed save with no visible cause.
   */
  const validate = () => {
    nameError.value = form.name.trim() ? '' : 'This field is required.'
    codeError.value = form.code.trim() ? '' : 'This field is required.'
    argsError.value = parsedArgs() ? '' : 'Arguments must be a JSON object.'

    if (argsError.value) {
      activeTab.value = 'code'
      activeDocument.value = 'arguments'
    }
    if (codeError.value) {
      activeTab.value = 'code'
      activeDocument.value = 'code'
    }
    if (nameError.value) activeTab.value = 'settings'

    return !nameError.value && !codeError.value && !argsError.value
  }

  /**
   * What a save would send: `PATCH v4/workspace/functions/{id}`, the same properties the
   * create page posts, in the endpoint's own snake_case.
   */
  const body = () => ({
    name: form.name.trim(),
    code: form.code,
    runtime: runtime.value.api,
    execution_environment: form.executionEnvironment,
    default_args: parsedArgs(),
    active: form.active
  })

  const save = () => {
    if (!validate()) return
    const patched = body()
    return saveGroup(saving, `${patched.name} saved.`, () => {
      commit()
      snapshot = JSON.stringify(form)
    })
  }
</script>

<template>
  <AppLayout
    active="functions"
    :padded="false"
    :breadcrumb="[{ label: 'Functions', href: '/functions' }, { label: title }]"
  >
    <main class="flex h-full min-h-0 flex-col">
      <!-- No page heading BLOCK: the function's name is the breadcrumb and each tab
           names itself, which is the nav pattern every other detail page here uses. The
           page still owns an <h1> — it is what a screen reader announces as the name of
           the screen, and the tabs below it read as sections of it. -->
      <h1 class="sr-only">{{ title }}</h1>

      <PageTabs
        v-model:value="activeTab"
        :tabs="tabs"
      />

      <section
        ref="scrollRef"
        class="flex min-h-0 flex-1 flex-col"
        :class="activeTab === 'code' ? 'overflow-hidden' : 'overflow-auto'"
      >
        <!-- A STABLE wrapper: `useTabEnter` replays the page entrance on it when the tab
             changes, and sends the region back to the top. -->
        <div
          ref="enterRef"
          class="flex min-h-0 flex-1 flex-col"
        >
          <!-- One flag locks every control while the save is in flight. -->
          <fieldset
            class="m-0 flex min-h-0 min-w-0 flex-1 flex-col border-0 p-0"
            :disabled="saving"
          >
            <legend class="sr-only">{{ title }} settings</legend>

            <!-- ── Code ──
                 `v-show`, not `v-if`: Monaco owns undo history, cursor and folding
                 state, and unmounting the editor on every tab switch throws all three
                 away. `relative`, because the preview panel's way back is an absolutely
                 positioned sibling of it. -->
            <div
              v-show="activeTab === 'code'"
              class="flex min-h-0 flex-1 flex-col"
            >
              <FunctionCodeEditor
                v-model:code="form.code"
                v-model:args="form.args"
                v-model:document="activeDocument"
                :language="runtime.language"
                :runtime-label="runtime.label"
                :file-name="form.name || 'function'"
                :code-error="codeError"
                :args-error="argsError"
                :disabled="saving"
                test-id="function-detail"
                @update:code-error="codeError = $event"
                @update:args-error="argsError = $event"
              />
            </div>

            <!-- ── Settings ── -->
            <div
              v-show="activeTab === 'settings'"
              class="layout-column-form layout-boundary flex min-w-0 flex-col"
            >
              <!-- `layout-boundary`, not its inline half plus a hand-written `py`: the
                   page's top inset belongs to the BOUNDARY (see the layout tokens), and
                   `layout-section-start` below zeroes itself as the first child — so a
                   band with nothing above it opens at the boundary step or not at all.
                   Carrying it here also grows the measure by the inset it now contains,
                   so the form column is the same width as on a padded page. -->
              <section class="layout-section-start flex min-w-0 flex-col">
                <Section
                  stacked
                  :divided="false"
                  title="General"
                >
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <FieldRow
                          title="Name"
                          description="Give a unique and descriptive name to identify your function."
                          :message="nameError"
                          message-kind="required"
                        >
                          <template #default="{ messageId }">
                            <InputText
                              v-model="form.name"
                              size="large"
                              class="w-full"
                              aria-label="Name"
                              autocomplete="off"
                              :required="!!nameError"
                              :aria-describedby="messageId"
                              :disabled="saving"
                              @update:model-value="nameError = ''"
                            />
                          </template>
                        </FieldRow>
                      </Item.List>
                    </template>
                  </CardBox>
                </Section>

                <!-- The other three bands, shared with the create page so the two
                     screens cannot drift (ui/FunctionSettings.vue). -->
                <FunctionSettings
                  v-model:execution-environment="form.executionEnvironment"
                  v-model:active="form.active"
                  :runtime-label="runtime.label"
                  :disabled="saving"
                />
              </section>
            </div>
          </fieldset>
        </div>
      </section>

      <!-- The page commits as ONE record, so the bar is not gated on a tab: an edit made
           in the editor is still pending while the reader is in Settings. It is a
           sibling of the scroll region inside this flex column, which is where `sticky
           bottom-0` resolves to in-flow — so on the Code tab the editor shrinks by the
           bar's height instead of being covered by it. -->
      <SettingsSaveBar
        :dirty="dirty"
        :saving="saving"
        @save="save"
        @discard="discard"
      />
    </main>
  </AppLayout>
</template>
