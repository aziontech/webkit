<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Card from '@aziontech/ui/card'
  import FieldDescription from '@aziontech/ui/field-description'
  import Item from '@aziontech/ui/item'
  import RadioGroup from '@aziontech/ui/radio-group'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import SettingsRow from '@aziontech/ui/settings-row'
  import Textarea from '@aziontech/ui/textarea'
  import { toast } from '@aziontech/ui/toast'
  import { computed, onMounted, reactive, ref, watch } from 'vue'

  import { useCreateForm } from '../use-create-form'
  import CreationFrame from './creation-frame.vue'

  interface PurgeError {
    type: 'helper' | 'invalid' | 'required'
    message: string
  }

  const breadcrumb = [{ label: 'Cache', href: '/cache' }, { label: 'Create Purge' }]
  const layers = [
    {
      value: 'cache',
      label: 'Cache',
      description: 'Evicts the objects from the cache layer, in every location.'
    },
    {
      value: 'tiered_cache',
      label: 'Tiered Cache',
      description:
        'Evicts the objects from the tiered cache layer that sits between the cache and your origin.'
    }
  ]
  const types = [
    {
      value: 'cachekey',
      label: 'Cache key',
      noun: 'cache key',
      description: 'The exact keys objects were cached under, including any @@ variations.',
      placeholder: 'www.example.com/images/image.jpg@@cookie_name=value',
      helper: 'One cache key per line, without the protocol.'
    },
    {
      value: 'url',
      label: 'URL',
      noun: 'URL',
      description: 'Every cached variation of each address.',
      placeholder: 'www.example.com/index.html\nwww.example.com/styles/main.css',
      helper: 'One URL per line, without the protocol.'
    },
    {
      value: 'wildcard',
      label: 'Wildcard',
      noun: 'wildcard expression',
      description: 'Everything that matches a pattern, where an asterisk matches any path.',
      placeholder: 'www.example.com/images/*',
      helper: 'One expression per line. An asterisk matches any sequence of characters.'
    }
  ]
  const TIERED_CACHE_TYPES = ['cachekey']

  const form = reactive({ layer: 'cache', type: 'url', arguments: '' })
  const error = reactive<PurgeError>({ type: 'required', message: '' })

  const tiered = computed(() => form.layer === 'tiered_cache')
  const typeAllowed = (value: string) => !tiered.value || TIERED_CACHE_TYPES.includes(value)

  watch(tiered, () => {
    if (!typeAllowed(form.type)) form.type = TIERED_CACHE_TYPES[0]
  })

  watch(
    () => [form.type, form.arguments],
    () => {
      error.message = ''
    }
  )

  const selectedType = computed(() => types.find((type) => type.value === form.type) ?? types[1])
  const entries = computed(() =>
    form.arguments
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  )

  const guidance = computed(() => error.message || selectedType.value.helper)

  const lineIssue = (line: string, index: number) => {
    const at = entries.value.length > 1 ? 'Line ' + (index + 1) : 'The argument'
    if (/^https?:\/\//i.test(line)) return at + ' starts with a protocol. Remove it.'
    if (form.type === 'wildcard' && !line.includes('*'))
      return at + ' has no asterisk. Select URL to purge an exact address.'
    if (form.type === 'url' && line.includes('*'))
      return at + ' contains an asterisk. Select Wildcard to purge a pattern.'
    return ''
  }

  const validate = () => {
    if (!entries.value.length) {
      error.type = 'required'
      error.message = 'This field is required.'
      return false
    }
    const issue = entries.value.map(lineIssue).find(Boolean)
    if (issue) {
      error.type = 'invalid'
      error.message = issue
      return false
    }
    return true
  }

  const formEl = ref<HTMLFormElement | null>(null)

  const { guard, failure, submitting, submitButton, leave, submit } = useCreateForm({
    source: () => form,
    formEl,
    shortcutLabel: 'Purge',
    validate,
    onCreated: () =>
      toast.success(
        `Purge started for ${entries.value.length} ${entries.value.length === 1 ? 'entry' : 'entries'}.`
      )
  })

  onMounted(() =>
    formEl.value?.querySelector<HTMLInputElement>('input[name="purge-layer"]:checked')?.focus()
  )
</script>

<template>
  <CreationFrame
    back-label="Back to Cache"
    :breadcrumb="breadcrumb"
    title="Create Purge"
    description="Evict cached objects from every location. Each one is fetched from your origin again on its next request."
    title-id="create-purge-title"
    submit-label="Purge"
    :submitting="submitting"
    :failure="failure"
    failure-title="Could not start the purge."
    :submit-button="submitButton"
    :guard="guard"
    :bind-form="(element) => (formEl = element)"
    @leave="leave"
    @submit="submit"
  >
    <SettingsGroup
      label="Target"
      hint="Where the objects are evicted from, and how this purge identifies them."
    >
      <Card :padded="false">
        <template #default>
          <Item.List>
            <SettingsRow
              title="Layer"
              description="The cache layer the objects are evicted from."
              variant="stacked"
            >
              <RadioGroup
                v-model="form.layer"
                variant="card"
                class="w-full"
                name="purge-layer"
                aria-label="Layer"
              >
                <RadioGroup.Item
                  v-for="option in layers"
                  :key="option.value"
                  :value="option.value"
                  :description="option.description"
                  >{{ option.label }}</RadioGroup.Item
                >
              </RadioGroup>
            </SettingsRow>
            <SettingsRow
              title="Purge type"
              description="How the arguments below identify the objects."
              variant="stacked"
            >
              <RadioGroup
                v-model="form.type"
                variant="card"
                class="w-full"
                name="purge-type"
                aria-label="Purge type"
              >
                <RadioGroup.Item
                  v-for="option in types"
                  :key="option.value"
                  :value="option.value"
                  :description="
                    typeAllowed(option.value)
                      ? option.description
                      : option.description + ' Tiered Cache purges by cache key only.'
                  "
                  :disabled="!typeAllowed(option.value)"
                  >{{ option.label }}</RadioGroup.Item
                >
              </RadioGroup>
            </SettingsRow>
          </Item.List>
        </template>
      </Card>
    </SettingsGroup>

    <SettingsGroup
      label="Arguments"
      :hint="'The ' + selectedType.noun + 's to purge, one per line.'"
    >
      <Card :padded="false">
        <template #default>
          <Item.List>
            <SettingsRow
              required
              title="List"
              :description="selectedType.description"
              variant="stacked"
            >
              <template #title> {{ selectedType.label }} List </template>
              <Textarea
                monospace
                v-model="form.arguments"
                class="w-full"
                :rows="6"
                :aria-label="selectedType.label + ' list'"
                :placeholder="selectedType.placeholder"
                required
                :invalid="!!error.message"
                aria-describedby="create-purge-arguments-message"
                :spellcheck="false"
                autocomplete="off"
              />

              <FieldDescription id="create-purge-arguments-message">{{
                guidance
              }}</FieldDescription>
            </SettingsRow>
          </Item.List>
        </template>
      </Card>

      <Alert
        severity="warning"
        size="small"
        label="A purge cannot be undone. A broad one briefly raises the traffic that reaches your origin, while the cache fills again."
      />
    </SettingsGroup>
  </CreationFrame>
</template>
