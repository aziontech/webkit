<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import HelperText, { type HelperTextKind } from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import NumberInput from '@aziontech/webkit/number-input'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, onBeforeUnmount, reactive, ref } from 'vue'

  type FieldProblem = { kind: HelperTextKind; message: string }
  type LabeledOption = SelectOptionItem

  const browserBehaviors = [
    { value: 'honor', label: 'Honor origin cache headers' },
    { value: 'override', label: 'Override cache settings' },
    { value: 'no-cache', label: 'No cache' }
  ]
  const edgeBehaviors = [
    { value: 'honor', label: 'Honor origin cache headers' },
    { value: 'override', label: 'Override cache settings' }
  ]
  const topologies = [
    { value: 'nearest-region', label: 'Nearest region' },
    { value: 'south-america', label: 'South America' },
    { value: 'north-america', label: 'North America' }
  ]
  const varyBehaviors = [
    { value: 'ignore', label: 'Ignore all, best cache rate' },
    { value: 'all', label: 'Vary by all' },
    { value: 'allowlist', label: 'Vary by some (allowlist)' },
    { value: 'denylist', label: 'Vary by all except some (denylist)' }
  ]
  const methods = [
    { value: 'POST', label: 'POST' },
    { value: 'OPTIONS', label: 'OPTIONS' }
  ]

  const labelOf = (options: LabeledOption[]) => (value: string) =>
    options.find((option) => option.value === value)?.label ?? value
  const methodsLabel = (values: unknown[] | undefined) => (values?.length ? values.join(', ') : '')

  const form = reactive({
    name: 'static-assets',
    browserBehavior: 'override',
    browserMaxAge: 604800,
    edgeBehavior: 'override',
    edgeMaxAge: 2592000,
    staleCache: true,
    largeFileCache: false,
    largeFileOffset: 1024,
    tieredCache: true,
    tieredTopology: 'nearest-region',
    varyByMethod: [] as string[],
    queryStringBehavior: 'allowlist',
    queryStringFields: 'v, lang',
    cookieBehavior: 'ignore',
    cookieNames: ''
  })
  const baseline = ref(JSON.stringify(form))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)
  const saving = ref(false)
  const errors = reactive<Record<string, FieldProblem | undefined>>({})

  const clear = (key: string) => {
    delete errors[key]
  }

  const validate = () => {
    Object.keys(errors).forEach((key) => delete errors[key])
    if (!form.name.trim()) {
      errors.name = { kind: 'required', message: 'Enter a name for this cache setting.' }
    } else if (!/^[a-z0-9-]+$/.test(form.name.trim())) {
      errors.name = {
        kind: 'invalid',
        message: 'Use lowercase letters, numbers and hyphens only.'
      }
    }
    if (form.edgeBehavior === 'override' && form.edgeMaxAge < 60) {
      errors.edgeMaxAge = {
        kind: 'invalid',
        message: 'The edge keeps an object for at least 60 seconds.'
      }
    }
    if (['allowlist', 'denylist'].includes(form.queryStringBehavior)) {
      if (!form.queryStringFields.trim()) {
        errors.queryStringFields = {
          kind: 'required',
          message: 'List at least one query string field.'
        }
      }
    }
    if (['allowlist', 'denylist'].includes(form.cookieBehavior) && !form.cookieNames.trim()) {
      errors.cookieNames = { kind: 'required', message: 'List at least one cookie name.' }
    }
    return Object.keys(errors).length === 0
  }

  const ERROR_ORDER = ['name', 'edgeMaxAge', 'queryStringFields', 'cookieNames']
  const focusFirstError = () =>
    nextTick(() => {
      const first = ERROR_ORDER.find((key) => errors[key])
      if (first) document.getElementById(`cache-${first}`)?.focus()
    })

  const RUN_TOAST = 'cache-settings-deploy'
  let timer: ReturnType<typeof setTimeout> | undefined

  const editAgain = () => {
    toast.dismiss(RUN_TOAST)
    nextTick(() => document.getElementById('cache-name')?.focus())
  }

  const deploy = () => {
    toast.loading(`Deploying ${form.name}…`, {
      id: RUN_TOAST,
      description: 'storefront-app keeps serving the current cache rules until it finishes.'
    })
    clearTimeout(timer)
    timer = setTimeout(() => {
      saving.value = false
      baseline.value = JSON.stringify(form)
      toast.success(`${form.name} is live.`, {
        id: RUN_TOAST,
        description: 'Production caches with the new rules from now on.',
        duration: 0,
        closable: true,
        actions: [
          { label: 'Edit', onClick: editAgain },
          { label: 'Redeploy', onClick: deploy }
        ]
      })
    }, 1200)
  }

  const save = () => {
    if (!validate()) {
      focusFirstError()
      return
    }
    saving.value = true
    deploy()
  }

  const discard = () => {
    Object.assign(form, JSON.parse(baseline.value) as typeof form)
    Object.keys(errors).forEach((key) => delete errors[key])
  }

  onBeforeUnmount(() => {
    clearTimeout(timer)
    toast.dismiss(RUN_TOAST)
  })
</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-1 flex-col">
    <form
      class="flex min-h-0 min-w-0 flex-1 flex-col"
      aria-label="Cache settings"
      novalidate
      @submit.prevent="save"
    >
      <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
        <PageHeader
          title="Cache settings"
          description="How static-assets is cached at the edge and in browsers. Rules of storefront-app pick it with the Set cache policy behavior."
          size="small"
        />

        <fieldset
          class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
          :disabled="saving"
        >
          <legend class="sr-only">Cache settings</legend>

          <SettingsSection
            title="General"
            hint="Names the cache setting in the rules that reference it."
            anchor="general"
          >
            <Card :padded="false">
              <template #content>
                <Item.List>
                  <TransitionGroup
                    enter-active-class="animate-content-enter motion-reduce:animate-none"
                  >
                    <SettingRow
                      key="name"
                      title="Name"
                      description="What the Set cache policy behavior of a rule picks from its list."
                    >
                      <Input
                        id="cache-name"
                        v-model="form.name"
                        size="large"
                        class="w-full"
                        aria-label="Name"
                        placeholder="static-assets"
                        autocomplete="off"
                        :required="errors.name?.kind === 'required'"
                        :invalid="errors.name?.kind === 'invalid'"
                        :aria-describedby="errors.name ? 'cache-name-message' : undefined"
                        :disabled="saving"
                        @update:model-value="clear('name')"
                      />
                      <HelperText
                        v-if="errors.name"
                        id="cache-name-message"
                        :kind="errors.name.kind"
                        :label="errors.name.message"
                      />
                    </SettingRow>
                  </TransitionGroup>
                </Item.List>
              </template>
            </Card>
          </SettingsSection>
          <SettingsSection
            title="Browser cache"
            hint="How long the visitor's browser may reuse a response before asking again."
            anchor="browser-cache"
          >
            <Card :padded="false">
              <template #content>
                <Item.List>
                  <TransitionGroup
                    enter-active-class="animate-content-enter motion-reduce:animate-none"
                  >
                    <SettingRow
                      key="browserBehavior"
                      title="Behavior"
                      description="Honoring the origin passes its Cache-Control through. Overriding replaces it with the time set here."
                    >
                      <Select
                        v-model="form.browserBehavior"
                        size="large"
                        class="w-full"
                        :display-value="labelOf(browserBehaviors)"
                        :disabled="saving"
                      >
                        <Select.Trigger aria-label="Browser cache behavior" />
                        <Select.Content>
                          <Select.Option
                            v-for="option in browserBehaviors"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                    </SettingRow>
                    <SettingRow
                      v-if="form.browserBehavior === 'override'"
                      key="browserMaxAge"
                      title="Maximum TTL in seconds"
                      description="Up to 31536000 seconds, one year."
                      :level="1"
                    >
                      <NumberInput
                        id="cache-browserMaxAge"
                        v-model="form.browserMaxAge"
                        size="large"
                        class="w-full"
                        :min="0"
                        :max="31536000"
                        aria-label="Browser maximum TTL in seconds"
                        :disabled="saving"
                      />
                    </SettingRow>
                  </TransitionGroup>
                </Item.List>
              </template>
            </Card>
          </SettingsSection>
          <SettingsSection
            title="Edge cache"
            hint="How long the edge may serve a stored response before it asks the origin again."
            anchor="edge-cache"
          >
            <Card :padded="false">
              <template #content>
                <Item.List>
                  <TransitionGroup
                    enter-active-class="animate-content-enter motion-reduce:animate-none"
                  >
                    <SettingRow
                      key="edgeBehavior"
                      title="Behavior"
                      description="Overriding sets the time the edge keeps each object, from 60 seconds up."
                    >
                      <Select
                        v-model="form.edgeBehavior"
                        size="large"
                        class="w-full"
                        :display-value="labelOf(edgeBehaviors)"
                        :disabled="saving"
                      >
                        <Select.Trigger aria-label="Edge cache behavior" />
                        <Select.Content>
                          <Select.Option
                            v-for="option in edgeBehaviors"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                    </SettingRow>
                    <SettingRow
                      v-if="form.edgeBehavior === 'override'"
                      key="edgeMaxAge"
                      title="Maximum TTL in seconds"
                      description="From 60 to 31536000 seconds."
                      :level="1"
                    >
                      <NumberInput
                        id="cache-edgeMaxAge"
                        v-model="form.edgeMaxAge"
                        size="large"
                        class="w-full"
                        :min="0"
                        :max="31536000"
                        aria-label="Edge maximum TTL in seconds"
                        :disabled="saving"
                        :invalid="Boolean(errors.edgeMaxAge)"
                        :aria-describedby="
                          errors.edgeMaxAge ? 'cache-edgeMaxAge-message' : undefined
                        "
                        @update:model-value="clear('edgeMaxAge')"
                      />
                      <HelperText
                        v-if="errors.edgeMaxAge"
                        id="cache-edgeMaxAge-message"
                        :kind="errors.edgeMaxAge.kind"
                        :label="errors.edgeMaxAge.message"
                      />
                    </SettingRow>
                    <SettingRow
                      key="staleCache"
                      title="Stale cache"
                      description="Keep serving the expired object while the origin is unreachable, instead of answering with an error."
                      kind="compact"
                    >
                      <Switch
                        v-model="form.staleCache"
                        aria-label="Stale cache"
                        :disabled="saving"
                      />
                    </SettingRow>
                    <SettingRow
                      key="largeFileCache"
                      title="Large file optimization"
                      description="Fetch and cache large objects in fragments, so a partial request does not wait for the whole file."
                      kind="compact"
                    >
                      <Switch
                        v-model="form.largeFileCache"
                        aria-label="Large file optimization"
                        :disabled="saving"
                      />
                    </SettingRow>
                    <SettingRow
                      v-if="form.largeFileCache"
                      key="largeFileOffset"
                      title="Fragment size in kB"
                      description="Each fragment requested from the origin. 1024 kB is the default."
                      :level="1"
                    >
                      <NumberInput
                        id="cache-largeFileOffset"
                        v-model="form.largeFileOffset"
                        size="large"
                        class="w-full"
                        :min="1"
                        aria-label="Fragment size in kilobytes"
                        :disabled="saving"
                      />
                    </SettingRow>
                    <SettingRow
                      key="tieredCache"
                      title="Tiered cache"
                      description="Add a second cache layer between the edge and your origin, so an edge miss can still be answered without reaching it."
                      kind="compact"
                    >
                      <Switch
                        v-model="form.tieredCache"
                        aria-label="Tiered cache"
                        :disabled="saving"
                      />
                    </SettingRow>
                    <SettingRow
                      v-if="form.tieredCache"
                      key="tieredTopology"
                      title="Topology"
                      description="Where the second layer sits. Pin a region only when the origin is fixed to one."
                      :level="1"
                    >
                      <Select
                        v-model="form.tieredTopology"
                        size="large"
                        class="w-full"
                        :display-value="labelOf(topologies)"
                        :disabled="saving"
                      >
                        <Select.Trigger aria-label="Tiered cache topology" />
                        <Select.Content>
                          <Select.Option
                            v-for="option in topologies"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                    </SettingRow>
                  </TransitionGroup>
                </Item.List>
              </template>
            </Card>
          </SettingsSection>
          <SettingsSection
            title="Advanced cache key"
            hint="Which parts of a request make two requests two different cached objects."
            anchor="cache-key"
            collapsible
          >
            <Card :padded="false">
              <template #content>
                <Item.List>
                  <TransitionGroup
                    enter-active-class="animate-content-enter motion-reduce:animate-none"
                  >
                    <SettingRow
                      key="varyByMethod"
                      title="Cache by HTTP method"
                      description="GET and HEAD are always cached. Adding POST or OPTIONS puts the request body in the cache key."
                    >
                      <MultiSelect
                        v-model="form.varyByMethod"
                        size="large"
                        class="w-full"
                        placeholder="GET and HEAD only"
                        :display-value="methodsLabel"
                        :disabled="saving"
                      >
                        <MultiSelect.Trigger aria-label="Cache by HTTP method" />
                        <MultiSelect.Content>
                          <MultiSelect.Option
                            v-for="option in methods"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </MultiSelect.Option>
                        </MultiSelect.Content>
                      </MultiSelect>
                    </SettingRow>
                    <SettingRow
                      key="queryStringBehavior"
                      title="Cache by query string"
                    >
                      <Select
                        v-model="form.queryStringBehavior"
                        size="large"
                        class="w-full"
                        :display-value="labelOf(varyBehaviors)"
                        :disabled="saving"
                      >
                        <Select.Trigger aria-label="Cache by query string" />
                        <Select.Content>
                          <Select.Option
                            v-for="option in varyBehaviors"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                    </SettingRow>
                    <SettingRow
                      v-if="['allowlist', 'denylist'].includes(form.queryStringBehavior)"
                      key="queryStringFields"
                      title="Query string fields"
                      description="Comma separated and case sensitive: utm_source and UTM_SOURCE are two fields."
                      :level="1"
                    >
                      <Input
                        id="cache-queryStringFields"
                        v-model="form.queryStringFields"
                        size="large"
                        class="w-full"
                        aria-label="Query string fields"
                        placeholder="page, sort, lang"
                        autocomplete="off"
                        :required="errors.queryStringFields?.kind === 'required'"
                        :invalid="errors.queryStringFields?.kind === 'invalid'"
                        :aria-describedby="
                          errors.queryStringFields ? 'cache-queryStringFields-message' : undefined
                        "
                        :disabled="saving"
                        @update:model-value="clear('queryStringFields')"
                      />
                      <HelperText
                        v-if="errors.queryStringFields"
                        id="cache-queryStringFields-message"
                        :kind="errors.queryStringFields.kind"
                        :label="errors.queryStringFields.message"
                      />
                    </SettingRow>
                    <SettingRow
                      key="cookieBehavior"
                      title="Cache by cookies"
                    >
                      <Select
                        v-model="form.cookieBehavior"
                        size="large"
                        class="w-full"
                        :display-value="labelOf(varyBehaviors)"
                        :disabled="saving"
                      >
                        <Select.Trigger aria-label="Cache by cookies" />
                        <Select.Content>
                          <Select.Option
                            v-for="option in varyBehaviors"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                    </SettingRow>
                    <SettingRow
                      v-if="['allowlist', 'denylist'].includes(form.cookieBehavior)"
                      key="cookieNames"
                      title="Cookie names"
                      description="Comma separated. A name ending in * matches every cookie that starts with it."
                      :level="1"
                    >
                      <Input
                        id="cache-cookieNames"
                        v-model="form.cookieNames"
                        size="large"
                        class="w-full"
                        aria-label="Cookie names"
                        placeholder="session_id, ab_*"
                        autocomplete="off"
                        :required="errors.cookieNames?.kind === 'required'"
                        :invalid="errors.cookieNames?.kind === 'invalid'"
                        :aria-describedby="
                          errors.cookieNames ? 'cache-cookieNames-message' : undefined
                        "
                        :disabled="saving"
                        @update:model-value="clear('cookieNames')"
                      />
                      <HelperText
                        v-if="errors.cookieNames"
                        id="cache-cookieNames-message"
                        :kind="errors.cookieNames.kind"
                        :label="errors.cookieNames.message"
                      />
                    </SettingRow>
                  </TransitionGroup>
                </Item.List>
              </template>
            </Card>
          </SettingsSection>
        </fieldset>
      </div>

      <Transition
        enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
        enter-from-class="translate-y-2 opacity-0"
        leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
        leave-to-class="translate-y-2 opacity-0"
      >
        <SaveBar v-if="dirty || saving">
          Cache settings changed.
          <span class="text-(--text-muted)">Saving deploys storefront-app to Production.</span>

          <template #actions>
            <Button
              type="button"
              label="Discard"
              kind="outlined"
              size="medium"
              :disabled="saving"
              @click="discard"
            />
            <Button
              label="Save"
              kind="primary"
              size="medium"
              :loading="saving"
              @click="save"
            />
          </template>
        </SaveBar>
      </Transition>
    </form>
  </div>
</template>
