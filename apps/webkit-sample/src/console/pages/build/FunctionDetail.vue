<script setup>
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

  const record = functionById(route.params.id)
  const runtime = computed(() => runtimeOf(record))
  const title = computed(() => record?.name ?? 'Function')

  if (!record) router.replace({ path: '/functions', query: { email: route.query.email } })

  const form = reactive({
    name: record?.name ?? '',
    executionEnvironment: record?.executionEnvironment ?? 'application',
    active: record?.active ?? true,
    code: record?.code ?? '',
    args: JSON.stringify(record?.args ?? {}, null, 2),
    argsForm: record?.form ? JSON.stringify(record.form, null, 2) : ''
  })

  const { dirty, commit } = useBaseline(form)
  const saving = ref(false)

  let snapshot = JSON.stringify(form)
  const discard = () => Object.assign(form, JSON.parse(snapshot))

  const tabs = [
    { value: 'code', label: 'Code' },
    { value: 'settings', label: 'Settings' }
  ]
  const activeTab = computed({
    get: () => (tabs.some((tab) => tab.value === route.query.tab) ? route.query.tab : 'code'),
    set: (value) => router.replace({ query: { ...route.query, tab: value } })
  })

  const documents = [
    { label: 'Code', value: 'code' },
    { label: 'Arguments', value: 'arguments' }
  ]
  const activeDocument = computed({
    get: () => (documents.some((doc) => doc.value === route.query.doc) ? route.query.doc : 'code'),
    set: (value) => router.replace({ query: { ...route.query, doc: value } })
  })

  const scrollRef = ref(null)
  const enterRef = ref(null)
  useTabEnter(enterRef, activeTab, scrollRef)

  const nameError = ref('')
  const codeError = ref('')
  const argsError = ref('')
  const formError = ref('')

  const parsedArgs = () => {
    try {
      const value = JSON.parse(form.args)
      if (value === null || Array.isArray(value) || typeof value !== 'object') return null
      return value
    } catch {
      return null
    }
  }

  const parsedForm = () => {
    if (!form.argsForm.trim()) return undefined
    try {
      const value = JSON.parse(form.argsForm)
      if (value === null || Array.isArray(value) || typeof value !== 'object') return null
      return value
    } catch {
      return null
    }
  }

  const validate = () => {
    nameError.value = form.name.trim() ? '' : 'This field is required.'
    codeError.value = form.code.trim() ? '' : 'This field is required.'
    argsError.value = parsedArgs() ? '' : 'Arguments must be a JSON object.'
    formError.value = parsedForm() === null ? 'The form schema must be a JSON object.' : ''

    if (formError.value) {
      activeTab.value = 'code'
      activeDocument.value = 'arguments'
    }
    if (argsError.value) {
      activeTab.value = 'code'
      activeDocument.value = 'arguments'
    }
    if (codeError.value) {
      activeTab.value = 'code'
      activeDocument.value = 'code'
    }
    if (nameError.value) activeTab.value = 'settings'

    return !nameError.value && !codeError.value && !argsError.value && !formError.value
  }

  const body = () => ({
    name: form.name.trim(),
    code: form.code,
    runtime: runtime.value.api,
    execution_environment: form.executionEnvironment,
    default_args: parsedArgs(),
    azion_form: parsedForm(),
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
        <div
          ref="enterRef"
          class="flex min-h-0 flex-1 flex-col"
        >
          <fieldset
            class="m-0 flex min-h-0 min-w-0 flex-1 flex-col border-0 p-0"
            :disabled="saving"
          >
            <legend class="sr-only">{{ title }} settings</legend>

            <div
              v-show="activeTab === 'code'"
              class="flex min-h-0 flex-1 flex-col"
            >
              <FunctionCodeEditor
                v-model:code="form.code"
                v-model:args="form.args"
                v-model:form="form.argsForm"
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

            <div
              v-show="activeTab === 'settings'"
              class="layout-column-form layout-boundary flex min-w-0 flex-col"
            >
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

      <SettingsSaveBar
        :dirty="dirty"
        :saving="saving"
        @save="save"
        @discard="discard"
      />
    </main>
  </AppLayout>
</template>
