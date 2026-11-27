<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import Field from '@aziontech/ui/field'
  import FieldError from '@aziontech/ui/field-error'
  import Input from '@aziontech/ui/input'
  import Item from '@aziontech/ui/item'
  import SettingsRow from '@aziontech/ui/settings-row'
  import Skeleton from '@aziontech/ui/skeleton'
  import Switch from '@aziontech/ui/switch'
  import ToggleGroup from '@aziontech/ui/toggle-group'
  import { onRadioListKeydown, radioListTabIndex } from '@aziontech/ui/utils/radio-list'
  import { onBeforeUnmount, reactive, ref, watch } from 'vue'

  import { usePagedList } from '../composables/use-paged-list'
  import { sampleFirewallModules as firewallModules, sampleFirewalls as firewalls } from '../sample'

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
  const projectName = 'web-app'
  const wireWidths = ['62%', '48%', '70%', '54%', '44%']
  const wireSubWidths = ['84%', '66%', '78%', '58%', '72%']

  const usePicker = (options: PickerOption[], noun: string, initial: PickerInitial = {}) => {
    const chosen = ref(initial.chosen ?? '')
    const message = ref(initial.message ?? '')
    const loading = ref(initial.loading ?? false)
    let timer: ReturnType<typeof setTimeout> | undefined
    onBeforeUnmount(() => clearTimeout(timer))

    const { showMore, ...list } = usePagedList(options, noun, loading, chosen)

    const loadMore = () => {
      if (loading.value || !list.remaining.value) return
      loading.value = true
      clearTimeout(timer)
      timer = setTimeout(() => {
        showMore()
        loading.value = false
      }, 420)
    }

    return reactive({ ...list, chosen, message, loading, loadMore })
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
      <template #default>
        <Item.List>
          <SettingsRow
            title="Protect with a firewall"
            description="Filters requests before they reach your code. Off by default. Turn it on to bind an existing firewall, or create one with the project."
            variant="compact"
          >
            <Switch
              v-model="enabled"
              aria-label="Protect with a firewall"
            />
          </SettingsRow>
        </Item.List>

        <div
          :data-state="enabled ? 'open' : 'closed'"
          class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-[state=open]:grid-rows-[1fr] motion-reduce:transition-none"
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
                  <Field
                    required
                    :invalid="!!firewallPicker.message"
                  >
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
                    <template #leading>
                      <i
                        class="az az-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>

                  <FieldError v-if="firewallPicker.message">{{
                    firewallPicker.message
                  }}</FieldError>
                </div>

                <div
                  class="border-t border-(--border-default)"
                  role="radiogroup"
                  aria-label="Firewalls"
                >
                  <Item.List>
                    <Item
                      v-for="option in firewallPicker.visible"
                      :key="option.value"
                      size="small"
                      clickable
                      role="radio"
                      @keydown="onRadioListKeydown"
                      :aria-checked="option.value === firewallPicker.chosen"
                      :tabindex="
                        radioListTabIndex(
                          option.value,
                          firewallPicker.chosen,
                          firewallPicker.visible.map((entry) => entry.value)
                        )
                      "
                      @click="firewallPicker.chosen = option.value"
                    >
                      <Item.Media>
                        <span
                          class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                        >
                          <i
                            class="az az-firewall text-body-md leading-none text-(--text-default)"
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
                          class="az az-circle-on shrink-0 text-(--text-default)"
                          aria-hidden="true"
                        />
                        <i
                          v-else
                          class="az az-circle shrink-0 text-(--text-muted)"
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
                            variant="rectangle"
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
                    class="border-t border-(--border-default) p-(--spacing-2xs)"
                  >
                    <Button
                      type="button"
                      :label="'Load ' + firewallPicker.nextBatch + ' more'"
                      variant="ghost"
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
                  <SettingsRow
                    v-for="module in firewallModules"
                    :key="module.key"
                    :title="module.title"
                    :description="module.description"
                    variant="compact"
                  >
                    <Switch
                      v-if="module.locked"
                      key="locked"
                      :model-value="true"
                      disabled
                      :aria-label="module.title"
                    />
                    <Switch
                      v-else
                      key="editable"
                      v-model="modules[module.key]"
                      :aria-label="module.title"
                    />
                  </SettingsRow>
                </Item.List>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
