<script setup>
  // FunctionDetail — the view of a function that already exists, at `/functions/:id`.
  //
  // WHY IT IS NOT THE GENERIC SETTINGS PAGE. Every other first-level resource is edited
  // by ./ResourceSettings.vue, generated from the same descriptor as its create page —
  // and that is right for a resource whose settings ARE a list of fields. A function's
  // are not: the record is a body of code, a JSON object of default arguments, and four
  // small properties. Rendering the code as one row in a stack of rows makes the reader
  // scroll past the settings to reach the thing they came to read. So this page mirrors
  // the create page (./CreateFunction.vue) — the same three groups the console gives a
  // function, as second-level nav:
  //
  //   Main Settings — name, runtime (locked), execution environment, status
  //   Code          — the function body, in its own runtime's grammar
  //   Arguments     — `default_args`, as JSON
  //
  // MAIN SETTINGS LEADS HERE, and Code leads on the create page. The difference is the
  // reason for arriving: a create page opens on the empty thing you came to write; a
  // detail page opens on what the record IS, which is what the reader is here to check
  // before changing anything.
  //
  // ONE RECORD, ONE COMMIT. The three tabs describe one function, so they share one
  // baseline and one save bar (ui/SettingsSaveBar.vue) — the console's settings model
  // everywhere else. Editing the code and flipping Active is ONE save, and the bar is
  // NOT gated on a tab: an edit made on Code is still pending while the reader is on
  // Main Settings, and a bar that vanished on the tab switch would say otherwise.
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { saveGroup, useBaseline } from '../lib/forms'
  import { functionById, runtimeOf } from '../lib/functions'
  import { useTabEnter } from '../lib/tab-enter'
  import MonacoEditor from './monaco-editor/monaco-editor.vue'
  import AppLayout from './ui/AppLayout.vue'
  import FieldRow from './ui/FieldRow.vue'
  import FunctionSettings from './ui/FunctionSettings.vue'
  import PageTabs from './ui/PageTabs.vue'
  import Section from './ui/Section.vue'
  import SettingsSaveBar from './ui/SettingsSaveBar.vue'

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
    { value: 'settings', label: 'Main Settings' },
    { value: 'code', label: 'Code' },
    { value: 'arguments', label: 'Arguments' }
  ]
  const activeTab = computed({
    get: () => (tabs.some((tab) => tab.value === route.query.tab) ? route.query.tab : 'settings'),
    set: (value) => router.replace({ query: { ...route.query, tab: value } })
  })

  // The editor tabs own their height instead of scrolling the page: the editor scrolls
  // its own document, and a page that grows under it would push the save bar off screen.
  const editorTab = computed(() => activeTab.value !== 'settings')

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
   * Every failure is behind a tab here, including the name — so the tab that holds the
   * leftmost one is switched to before the field is marked. A message on a tab nobody is
   * looking at is a failed save with no visible cause.
   */
  const validate = () => {
    nameError.value = form.name.trim() ? '' : 'This field is required.'
    codeError.value = form.code.trim() ? '' : 'This field is required.'
    argsError.value = parsedArgs() ? '' : 'Arguments must be a JSON object.'

    if (argsError.value) activeTab.value = 'arguments'
    if (codeError.value) activeTab.value = 'code'
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
    <main class="flex h-full flex-col">
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
        :class="editorTab ? 'overflow-hidden' : 'overflow-auto'"
      >
        <!-- A STABLE wrapper: `useTabEnter` replays the page entrance on it when the tab
             changes, and sends the region back to the top. -->
        <div
          ref="enterRef"
          class="flex min-h-0 flex-1 flex-col"
        >
          <!-- One flag locks every control while the save is in flight. -->
          <fieldset
            class="m-0 flex min-h-0 flex-1 flex-col border-0 p-0"
            :disabled="saving"
          >
            <legend class="sr-only">{{ title }} settings</legend>

            <!-- ── Main Settings ── -->
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

            <!-- ── Code ──
                 `v-show`, not `v-if`: Monaco owns undo history, cursor and folding
                 state, and unmounting the editor on every tab switch throws all three
                 away. The grammar is the function's OWN runtime, so a Lua function is
                 highlighted as Lua. -->
            <div
              v-show="activeTab === 'code'"
              class="layout-boundary flex min-h-0 flex-1 flex-col"
            >
              <MonacoEditor
                v-model="form.code"
                fill
                pad-line-numbers
                size="small"
                :language="runtime.language"
                :path="`${form.name || 'function'}.${runtime.language === 'lua' ? 'lua' : 'js'}`"
                :invalid="!!codeError"
                :helper-text="codeError"
                :disabled="saving"
                aria-label="Function code"
                data-testid="function-detail-code"
                @update:model-value="codeError = ''"
              />
            </div>

            <!-- ── Arguments ── -->
            <div
              v-show="activeTab === 'arguments'"
              class="layout-boundary flex min-h-0 flex-1 flex-col gap-[var(--spacing-sm)]"
            >
              <p class="text-body-sm text-[var(--text-muted)]">
                Default arguments for every instance of this function. An instance can override them
                with its own.
              </p>
              <MonacoEditor
                v-model="form.args"
                fill
                pad-line-numbers
                size="small"
                language="json"
                :path="`${form.name || 'function'}.args.json`"
                :invalid="!!argsError"
                :helper-text="argsError"
                :disabled="saving"
                aria-label="Default arguments, as JSON"
                data-testid="function-detail-args"
                @update:model-value="argsError = ''"
              />
            </div>
          </fieldset>
        </div>
      </section>

      <!-- The page commits as ONE record, so the bar is not gated on a tab: an edit made
           in the editor is still pending while the reader is in Main Settings. It is a
           sibling of the scroll region inside this flex column, which is where `sticky
           bottom-0` resolves to in-flow — so on the editor tabs the editor shrinks by the
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
