<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingRow from '@aziontech/webkit/setting-row'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Switch from '@aziontech/webkit/switch'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref, watch } from 'vue'

  interface PickerOption {
    value: string
    label: string
    description?: string
  }

  interface PickerInitial {
    chosen?: string
    message?: string
    loading?: boolean
  }

  const firewallModes = [
    { label: 'Existing firewall', value: 'existing' },
    { label: 'New firewall', value: 'new' }
  ]
  const firewalls: PickerOption[] = [
    { value: 'production-firewall', label: 'production-firewall', description: '12 rules · WAF' },
    { value: 'api-firewall', label: 'api-firewall', description: '4 rules · Rate limiting' },
    { value: 'docs-firewall', label: 'docs-firewall', description: '1 rule · Bot Manager' },
    { value: 'staging-firewall', label: 'staging-firewall', description: '3 rules · WAF' },
    {
      value: 'checkout-firewall',
      label: 'checkout-firewall',
      description: '8 rules · WAF, Bot Manager'
    },
    {
      value: 'partner-api-firewall',
      label: 'partner-api-firewall',
      description: '2 rules · Network Shield'
    },
    { value: 'marketing-firewall', label: 'marketing-firewall', description: '1 rule · WAF' }
  ]
  const firewallModules = [
    {
      key: 'ddos',
      title: 'DDoS Protection',
      description: 'Absorbs volumetric attacks at the network layer.',
      locked: true
    },
    {
      key: 'waf',
      title: 'WAF',
      description: 'Inspects each request and blocks the OWASP Top 10 attack classes.'
    },
    {
      key: 'networkShield',
      title: 'Network Shield',
      description: 'Blocks traffic by country, ASN or IP range using network lists.'
    },
    {
      key: 'botManager',
      title: 'Bot Manager',
      description: 'Scores automated traffic and challenges the requests that fail.'
    }
  ]
  const projectName = 'web-app'
  const PAGE_SIZE = 5
  const wireWidths = ['62%', '48%', '70%', '54%', '44%']
  const wireSubWidths = ['84%', '66%', '78%', '58%', '72%']

  const usePicker = (options: PickerOption[], noun: string, initial: PickerInitial = {}) => {
    const query = ref('')
    const chosen = ref(initial.chosen ?? '')
    const message = ref(initial.message ?? '')
    const shown = ref(PAGE_SIZE)
    const loading = ref(initial.loading ?? false)

    const chosenIndex = options.findIndex((option) => option.value === chosen.value)
    if (chosenIndex >= PAGE_SIZE) shown.value = Math.ceil((chosenIndex + 1) / PAGE_SIZE) * PAGE_SIZE

    const paged = computed(() => options.length > PAGE_SIZE)
    const matches = computed(() => {
      const text = query.value.trim().toLowerCase()
      if (!text) return options
      return options.filter(
        (option) =>
          option.label.toLowerCase().includes(text) ||
          String(option.description ?? '')
            .toLowerCase()
            .includes(text)
      )
    })
    const visible = computed(() => matches.value.slice(0, shown.value))
    const remaining = computed(() => Math.max(0, matches.value.length - visible.value.length))
    const nextBatch = computed(() => Math.min(PAGE_SIZE, remaining.value))

    const summary = computed(() => {
      if (loading.value) return 'Loading ' + nextBatch.value + ' more ' + noun + 's'
      if (query.value.trim() && !matches.value.length)
        return 'No ' + noun + ' matches ' + query.value
      if (remaining.value)
        return visible.value.length + ' of ' + matches.value.length + ' ' + noun + 's'
      return query.value.trim()
        ? matches.value.length + ' of ' + options.length + ' ' + noun + 's'
        : options.length + ' ' + noun + 's'
    })

    const loadMore = () => {
      if (loading.value || !remaining.value) return
      loading.value = true
      setTimeout(() => {
        shown.value += PAGE_SIZE
        loading.value = false
      }, 420)
    }

    return reactive({
      query,
      chosen,
      message,
      loading,
      paged,
      matches,
      visible,
      remaining,
      nextBatch,
      summary,
      loadMore
    })
  }

  const enabled = ref(true)
  const mode = ref('new')
  const name = ref('')
  const modules = reactive<Record<string, boolean>>({
    waf: true,
    networkShield: false,
    botManager: false
  })
  const firewallPicker = usePicker(firewalls, 'firewall', {
    chosen: '',
    loading: false,
    message: ''
  })

  watch(
    [enabled, mode],
    () => {
      if (enabled.value && mode.value === 'new' && !name.value)
        name.value = projectName + '-firewall'
    },
    { immediate: true }
  )
</script>

<template>
  <div class="layout-column-form">
    <Card :padded="false">
      <template #content>
        <Item.List>
          <SettingRow
            title="Protect with a firewall"
            description="Filters requests before they reach your code. Off by default. Turn it on to bind an existing firewall, or create one with the project."
            kind="compact"
          >
            <Switch
              v-model="enabled"
              aria-label="Protect with a firewall"
            />
          </SettingRow>
        </Item.List>

        <div
          :data-open="enabled || null"
          class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
        >
          <div
            class="min-w-0 overflow-hidden"
            :inert="!enabled"
          >
            <div class="border-t border-(--border-default)">
              <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md) pb-0">
                <ToggleGroup
                  v-model="mode"
                  :options="firewallModes"
                  size="large"
                  fluid
                  aria-label="Where the firewall comes from"
                />

                <div
                  v-if="mode === 'new'"
                  class="pb-(--spacing-md)"
                >
                  <Field :required="!!firewallPicker.message">
                    <Field.Label
                      for="firewall-name"
                      hint="Created alongside the resource this flow provisions."
                      >Firewall name</Field.Label
                    >
                    <Input
                      id="firewall-name"
                      v-model="name"
                      size="large"
                      placeholder="my-firewall"
                    />
                    <Field.Description>{{
                      firewallPicker.message || 'Lowercase letters, numbers, and hyphens.'
                    }}</Field.Description>
                  </Field>
                </div>
              </div>

              <div
                v-if="mode === 'existing'"
                class="min-w-0 pt-(--spacing-md)"
              >
                <div
                  v-if="firewallPicker.paged || firewallPicker.message"
                  :data-field-invalid="firewallPicker.message || null"
                  class="flex flex-col gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-md)"
                >
                  <Input
                    v-if="firewallPicker.paged"
                    v-model="firewallPicker.query"
                    size="large"
                    class="w-full"
                    placeholder="Search firewalls"
                    aria-label="Search firewalls"
                  >
                    <template #iconLeft>
                      <i
                        class="pi pi-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>

                  <HelperText
                    v-if="firewallPicker.message"
                    kind="required"
                    >{{ firewallPicker.message }}</HelperText
                  >
                </div>

                <div class="border-t border-(--border-default)">
                  <Item.List>
                    <Item
                      v-for="option in firewallPicker.visible"
                      :key="option.value"
                      size="small"
                      clickable
                      :aria-pressed="option.value === firewallPicker.chosen"
                      @click="firewallPicker.chosen = option.value"
                    >
                      <Item.Media>
                        <span
                          class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                        >
                          <i
                            class="ai ai-edge-firewall text-body-md leading-none text-(--text-default)"
                            aria-hidden="true"
                          />
                        </span>
                      </Item.Media>
                      <Item.Content>
                        <Item.Title>{{ option.label }}</Item.Title>
                        <Item.Description>{{ option.description }}</Item.Description>
                      </Item.Content>
                      <Item.Actions>
                        <i
                          v-if="option.value === firewallPicker.chosen"
                          class="pi pi-check shrink-0 text-(--text-default)"
                          aria-hidden="true"
                        />
                      </Item.Actions>
                    </Item>

                    <template v-if="firewallPicker.loading">
                      <Item
                        v-for="index in firewallPicker.nextBatch"
                        :key="'wire-' + index"
                        size="small"
                        aria-hidden="true"
                      >
                        <Item.Media>
                          <Skeleton
                            kind="shape"
                            width="2rem"
                            height="2rem"
                          />
                        </Item.Media>
                        <Item.Content>
                          <div class="flex flex-col gap-(--spacing-xs)">
                            <Skeleton
                              :width="wireWidths[(index - 1) % wireWidths.length]"
                              height="0.875rem"
                            />
                            <Skeleton
                              :width="wireSubWidths[(index - 1) % wireSubWidths.length]"
                              height="0.75rem"
                            />
                          </div>
                        </Item.Content>
                      </Item>
                    </template>
                  </Item.List>

                  <div
                    v-if="firewallPicker.remaining"
                    class="border-t border-(--border-default) p-(--spacing-xxs)"
                  >
                    <Button
                      type="button"
                      :label="'Load ' + firewallPicker.nextBatch + ' more'"
                      kind="transparent"
                      size="small"
                      class="w-full"
                      :loading="firewallPicker.loading"
                      @click="firewallPicker.loadMore"
                    />
                  </div>

                  <p
                    v-if="!firewallPicker.matches.length"
                    class="px-(--spacing-md) py-(--spacing-md) text-body-sm text-(--text-muted)"
                  >
                    No firewall matches “{{ firewallPicker.query }}”. Create one instead, or clear
                    the search.
                  </p>

                  <span
                    class="sr-only"
                    role="status"
                    >{{ firewallPicker.summary }}</span
                  >
                </div>
              </div>

              <div
                v-else
                class="border-t border-(--border-default)"
              >
                <h3
                  class="px-(--spacing-md) pb-(--spacing-xs) pt-(--spacing-md) text-label-sm text-(--text-muted)"
                >
                  Firewall modules
                </h3>
                <Item.List>
                  <SettingRow
                    v-for="module in firewallModules"
                    :key="module.key"
                    :title="module.title"
                    :description="module.description"
                    kind="compact"
                  >
                    <Tooltip
                      v-if="module.locked"
                      text="DDoS Protection is always on."
                    >
                      <Switch
                        :model-value="true"
                        disabled
                        :aria-label="module.title"
                      />
                    </Tooltip>
                    <Switch
                      v-else
                      v-model="modules[module.key]"
                      :aria-label="module.title"
                    />
                  </SettingRow>
                </Item.List>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
