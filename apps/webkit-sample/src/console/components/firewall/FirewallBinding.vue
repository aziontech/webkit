<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'

  import { FIREWALL_MODULE_FIELDS } from '../../lib/data/firewalls'
  import FieldStack from '../form/FieldStack.vue'
  import ResourcePicker from '../resource/ResourcePicker.vue'

  interface Props {
    options?: unknown[]
    defaultName?: string
    description?: string
    message?: string
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    options: () => [],
    defaultName: '',
    description: 'Filters requests before they reach your code.',
    message: '',
    disabled: false
  })

  const protection = defineModel({ type: Object, required: true })

  const MODES = [
    { label: 'Existing firewall', value: 'existing' },
    { label: 'New firewall', value: 'new' }
  ]

  const enabled = computed({
    get: () => Boolean(protection.value.enabled),
    set: (next) => {
      protection.value = { ...protection.value, enabled: next }
    }
  })

  const mode = computed({
    get: () => protection.value.mode ?? 'existing',
    set: (next) => {
      protection.value = { ...protection.value, mode: next }
    }
  })

  const name = computed({
    get: () => protection.value.name ?? '',
    set: (next) => {
      protection.value = { ...protection.value, name: next }
    }
  })

  const chosen = computed({
    get: () => protection.value.firewall ?? '',
    set: (next) => {
      protection.value = { ...protection.value, firewall: next }
    }
  })

  const setModule = (key, value) => {
    protection.value = {
      ...protection.value,
      modules: { ...protection.value.modules, [key]: value }
    }
  }

  watch(
    [enabled, mode],
    ([isEnabled, which]) => {
      if (isEnabled && which === 'new' && !name.value && props.defaultName) {
        name.value = `${props.defaultName}-firewall`
      }
    },
    { immediate: true }
  )

  const picker = ref(null)

  watch([enabled, mode], () => picker.value?.cancelLoad())

  const canBindExisting = computed(() => props.options.length > 0)
  watch(canBindExisting, (can) => {
    if (!can && mode.value === 'existing') mode.value = 'new'
  })
</script>

<template>
  <CardBox :padded="false">
    <template #content>
      <Item.List>
        <Item size="small">
          <Item.Content>
            <Item.Title>Protect with Azion Firewall</Item.Title>
            <Item.Description>{{ description }}</Item.Description>
          </Item.Content>
          <Item.Actions class="justify-end">
            <Switch
              v-model="enabled"
              aria-label="Protect with Azion Firewall"
              :disabled="disabled"
            />
          </Item.Actions>
        </Item>
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
              <SegmentedButton
                v-if="canBindExisting"
                v-model="mode"
                :options="MODES"
                size="large"
                fluid
                aria-label="Where the firewall comes from"
              />

              <FieldStack
                v-if="mode === 'new'"
                class="pb-(--spacing-md)"
                label="Firewall name"
                required
                hint="Created alongside the resource this flow provisions."
                description="Lowercase letters, numbers, and hyphens. Its rules are authored in Firewall, under Secure."
                :message="message"
                message-kind="required"
              >
                <template #default="{ controlId, describedBy }">
                  <InputText
                    :id="controlId"
                    v-model="name"
                    size="large"
                    class="w-full"
                    placeholder="my-firewall"
                    :disabled="disabled"
                    :required="!!message"
                    :aria-describedby="describedBy"
                  />
                </template>
              </FieldStack>
            </div>

            <ResourcePicker
              v-if="mode === 'existing'"
              ref="picker"
              v-model="chosen"
              class="pt-(--spacing-md)"
              :options="options"
              icon="ai ai-edge-firewall"
              noun="firewall"
              :message="message"
              :disabled="disabled"
            />

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
                <Item
                  v-for="mod in FIREWALL_MODULE_FIELDS"
                  :key="mod.key"
                  size="small"
                >
                  <Item.Content>
                    <Item.Title>{{ mod.title }}</Item.Title>
                    <Item.Description>{{ mod.description }}</Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end">
                    <Tooltip
                      v-if="mod.locked"
                      text="DDoS Protection is always on."
                    >
                      <Switch
                        :model-value="true"
                        disabled
                        :aria-label="mod.title"
                      />
                    </Tooltip>
                    <Switch
                      v-else
                      :model-value="protection.modules?.[mod.key] ?? false"
                      :aria-label="mod.title"
                      :disabled="disabled"
                      @update:model-value="setModule(mod.key, $event)"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CardBox>
</template>
