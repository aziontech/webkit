<script setup lang="ts">
  import { curve, duration } from '@aziontech/theme/animations'
  import Button from '@aziontech/webkit/button'
  import Divider from '@aziontech/webkit/divider'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputPassword from '@aziontech/webkit/input-password'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, reactive, ref, useId, watch } from 'vue'

  import ResourceDrawer from '../../components/form/ResourceDrawer.vue'
  import { APPLICATIONS } from '../../lib/data/applications'
  import { parseDotenv } from '../../lib/format/dotenv'
  import { presetIcon, presetLabel } from '../../lib/format/presets'

  const open = defineModel('open', { type: Boolean, default: false })

  interface Props {
    existingKeys?: unknown[]
  }

  const props = withDefaults(defineProps<Props>(), {
    existingKeys: () => []
  })

  const emit = defineEmits<{
    created: [created: unknown]
  }>()

  let nextId = 0
  const uid = () => (nextId += 1)

  const newEntry = (key = '', value = '', note = '') => ({
    id: uid(),
    key,
    value,
    note,
    flagged: false
  })

  const ENVIRONMENTS = [
    { value: 'production', label: 'Production' },
    { value: 'preview', label: 'Preview' },
    { value: 'development', label: 'Development' }
  ]

  const SENSITIVE_HINT =
    'A sensitive value is stored encrypted and masked in the list. It can be replaced but never read back.'

  const blankForm = () => ({
    entries: [newEntry()],
    sensitive: true,
    environments: ['production', 'preview'],
    projects: []
  })

  const form = reactive(blankForm())
  const submitted = ref(false)
  const submitting = ref(false)

  const scope = useId()
  const keyId = (entry) => `${scope}-key-${entry.id}`
  const valueId = (entry) => `${scope}-value-${entry.id}`
  const noteId = (entry) => `${scope}-note-${entry.id}`
  const sensitiveId = `${scope}-sensitive`
  const environmentsId = `${scope}-environments`
  const projectsId = `${scope}-projects`

  const KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/

  const keyError = (entry, index) => {
    const key = entry.key.trim()
    if (!key) return { kind: 'required', message: 'Key is required.' }
    if (!KEY_PATTERN.test(key))
      return {
        kind: 'invalid',
        message: 'Use letters, numbers and underscore. It cannot start with a number.'
      }
    if (form.entries.some((other, position) => position < index && other.key.trim() === key))
      return { kind: 'invalid', message: `“${key}” is repeated in this form.` }
    if (props.existingKeys.includes(key))
      return { kind: 'invalid', message: `“${key}” already exists in this list.` }
    return null
  }

  const errors = computed(() =>
    form.entries.map((entry, index) => ({
      key: keyError(entry, index),
      value: entry.value.trim() ? null : { kind: 'required', message: 'Value is required.' }
    }))
  )

  const environmentsError = computed(() => form.environments.length === 0)

  const isValid = computed(
    () => !environmentsError.value && errors.value.every((entry) => !entry.key && !entry.value)
  )

  const morphStyle = {
    '--tg-move-duration': duration['slow-01'],
    '--tg-move-ease': curve['expressive-entrance'],
    '--tg-enter-duration': duration['moderate-01'],
    '--tg-enter-ease': curve['productive-entrance'],
    '--tg-leave-duration': duration['slow-01'],
    '--tg-leave-ease': curve['productive-exit']
  }
  const morphTransition = {
    moveClass:
      'transition-transform duration-(--tg-move-duration) ease-(--tg-move-ease) motion-reduce:transition-none',
    enterActiveClass:
      'transition-all duration-(--tg-enter-duration) ease-(--tg-enter-ease) motion-reduce:transition-none',
    enterFromClass: '-translate-y-(--spacing-xxs) opacity-0',
    leaveActiveClass:
      'transition-opacity duration-(--tg-leave-duration) ease-(--tg-leave-ease) motion-reduce:transition-none',
    leaveToClass: 'opacity-0'
  }

  const focusKey = async (entry) => {
    await nextTick()
    document.getElementById(keyId(entry))?.focus()
  }

  const addEntry = () => {
    const entry = newEntry()
    form.entries.push(entry)
    focusKey(entry)
  }

  const removeEntry = (index) => {
    if (form.entries.length <= 1) return
    form.entries.splice(index, 1)
  }

  const expandInto = (index, pairs) => {
    const [first, ...rest] = pairs
    const target = form.entries[index]
    target.key = first.key
    target.value = first.value
    form.entries.splice(index + 1, 0, ...rest.map((pair) => newEntry(pair.key, pair.value)))
  }

  const onKeyPaste = (event, index) => {
    const pairs = parseDotenv(event.clipboardData?.getData('text/plain') ?? '')
    if (pairs.length === 0) return

    event.preventDefault()
    expandInto(index, pairs)
    toast.success(
      pairs.length === 1
        ? `Read ${pairs[0].key} from the pasted .env.`
        : `Read ${pairs.length} variables from the pasted .env.`
    )
  }

  const fileRef = ref(null)

  const openImport = () => fileRef.value?.click()

  const onFilePicked = async (event) => {
    const [file] = event.target.files ?? []
    event.target.value = ''
    if (!file) return

    const pairs = parseDotenv(await file.text())
    if (pairs.length === 0) {
      toast.error(`No variables found in “${file.name}”.`, {
        description: 'Expected lines in the KEY=value form.'
      })
      return
    }

    const typed = form.entries.filter((entry) => entry.key.trim() || entry.value.trim())
    form.entries = [...typed, ...pairs.map((pair) => newEntry(pair.key, pair.value))]
    toast.success(
      pairs.length === 1
        ? `Imported ${pairs[0].key} from “${file.name}”.`
        : `Imported ${pairs.length} variables from “${file.name}”.`
    )
  }

  const environmentsDisplay = (value) => {
    const picked = ENVIRONMENTS.filter((option) => value?.includes(option.value))
    if (picked.length === 0) return ''
    if (picked.length === ENVIRONMENTS.length) return 'All Environments'
    const labels = picked.map((option) => option.label)
    if (labels.length === 1) return labels[0]
    return `${labels.slice(0, -1).join(', ')} and ${labels.at(-1)}`
  }

  const projectOptions = APPLICATIONS.map((application) => ({
    value: application.id,
    label: application.name,
    preset: application.preset
  }))

  const projectQuery = ref('')
  const projectsOpen = ref(false)
  watch(projectsOpen, (isOpen) => {
    if (!isOpen) projectQuery.value = ''
  })

  const visibleProjects = computed(() => {
    const query = projectQuery.value.trim().toLowerCase()
    if (!query) return projectOptions
    return projectOptions.filter((option) => option.label.toLowerCase().includes(query))
  })

  const projectsDisplay = (value) => {
    const names = projectOptions
      .filter((option) => value?.includes(option.value))
      .map((option) => option.label)
    if (names.length === 0) return ''
    if (names.length <= 2) return names.join(', ')
    return `${names.slice(0, 2).join(', ')} +${names.length - 2}`
  }

  watch(open, (isOpen) => {
    if (isOpen) return
    Object.assign(form, blankForm())
    submitted.value = false
    submitting.value = false
    projectsOpen.value = false
    projectQuery.value = ''
  })

  const submit = async () => {
    submitted.value = true
    for (const entry of form.entries) entry.flagged = true
    if (submitting.value) return
    if (!isValid.value) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      const created = form.entries.map((entry) => ({
        key: entry.key.trim(),
        value: entry.value,
        note: entry.note.trim(),
        secret: form.sensitive,
        environments: [...form.environments],
        projects: [...form.projects]
      }))
      emit('created', created)
      toast.success(
        created.length === 1
          ? `Variable “${created[0].key}” created.`
          : `${created.length} variables created.`
      )
      open.value = false
    } catch (error) {
      toast.error('Could not create the variables.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <ResourceDrawer
    v-model:open="open"
    size="medium"
    title="Create Variable"
    save-label="Save"
    :submitting="submitting"
    @submit="submit"
  >
    <div class="flex min-w-0 flex-col gap-(--layout-section-gap)">
      <TransitionGroup
        tag="div"
        class="flex min-w-0 flex-col gap-(--layout-section-gap)"
        v-bind="morphTransition"
        :style="morphStyle"
      >
        <div
          v-for="(entry, index) in form.entries"
          :key="entry.id"
          class="flex min-w-0 flex-col gap-(--spacing-md)"
        >
          <div class="flex w-full flex-col gap-(--spacing-xs)">
            <div class="flex items-center justify-between gap-(--spacing-xs)">
              <Label :for="keyId(entry)">Key</Label>
              <Tooltip
                v-if="form.entries.length > 1"
                text="Remove variable"
              >
                <IconButton
                  icon="pi pi-times"
                  kind="outlined"
                  size="small"
                  aria-label="Remove variable"
                  @click="removeEntry(index)"
                />
              </Tooltip>
            </div>
            <InputText
              :id="keyId(entry)"
              v-model="entry.key"
              name="key"
              size="large"
              class="w-full"
              autocomplete="off"
              spellcheck="false"
              :required="entry.flagged && errors[index].key?.kind === 'required'"
              :invalid="entry.flagged && errors[index].key?.kind === 'invalid'"
              :aria-describedby="
                entry.flagged && errors[index].key ? `${keyId(entry)}-message` : undefined
              "
              @paste="onKeyPaste($event, index)"
            />
            <HelperText
              v-if="entry.flagged && errors[index].key"
              :id="`${keyId(entry)}-message`"
              :kind="errors[index].key.kind"
              :label="errors[index].key.message"
            />
          </div>

          <div class="flex w-full flex-col gap-(--spacing-xs)">
            <Label :for="valueId(entry)">Value</Label>
            <InputPassword
              :id="valueId(entry)"
              v-model="entry.value"
              name="value"
              class="w-full"
              autocomplete="off"
              :required="entry.flagged && Boolean(errors[index].value)"
              :aria-describedby="
                entry.flagged && errors[index].value ? `${valueId(entry)}-message` : undefined
              "
            />
            <HelperText
              v-if="entry.flagged && errors[index].value"
              :id="`${valueId(entry)}-message`"
              kind="required"
              :label="errors[index].value.message"
            />
          </div>

          <div class="flex w-full flex-col gap-(--spacing-xs)">
            <Label :for="noteId(entry)">Note (Optional)</Label>
            <InputText
              :id="noteId(entry)"
              v-model="entry.note"
              name="note"
              size="large"
              class="w-full"
              placeholder="Where to rotate, or who to contact"
            />
          </div>
        </div>
      </TransitionGroup>

      <Button
        class="self-start"
        label="Add another"
        kind="outlined"
        size="medium"
        icon="pi pi-plus"
        @click="addEntry"
      />

      <div class="-mx-(--spacing-lg)">
        <Divider />
      </div>

      <div class="flex items-center gap-(--spacing-sm)">
        <Switch
          :id="sensitiveId"
          v-model="form.sensitive"
        />
        <Label
          :for="sensitiveId"
          :hint="SENSITIVE_HINT"
          >Sensitive</Label
        >
      </div>

      <div class="flex w-full flex-col gap-(--spacing-xs)">
        <Label
          :id="`${environmentsId}-label`"
          :for="environmentsId"
          >Environments</Label
        >
        <Select
          v-model="form.environments"
          multiple
          size="large"
          placeholder="Select environments"
          :required="submitted && environmentsError"
          :display-value="environmentsDisplay"
        >
          <Select.Trigger
            :id="environmentsId"
            class="pl-0"
            :aria-labelledby="`${environmentsId}-label`"
            :aria-describedby="
              submitted && environmentsError ? `${environmentsId}-message` : undefined
            "
          >
            <template #iconLeft>
              <span
                class="flex shrink-0 items-center self-stretch border-r border-(--border-default) bg-(color:--bg-canvas) px-(--spacing-md) text-(--text-muted)"
                aria-hidden="true"
              >
                <i class="ai ai-layers" />
              </span>
            </template>
          </Select.Trigger>
          <Select.Content>
            <Select.Option
              v-for="option in ENVIRONMENTS"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select.Content>
        </Select>
        <HelperText
          v-if="submitted && environmentsError"
          :id="`${environmentsId}-message`"
          kind="required"
          label="Pick at least one environment."
        />
      </div>

      <div class="flex w-full flex-col gap-(--spacing-xs)">
        <Label
          :id="`${projectsId}-label`"
          :for="projectsId"
          >Link to Projects (optional)</Label
        >
        <Select
          v-model="form.projects"
          v-model:open="projectsOpen"
          multiple
          size="large"
          placeholder="Search projects"
          :display-value="projectsDisplay"
        >
          <Select.Trigger
            :id="projectsId"
            :aria-labelledby="`${projectsId}-label`"
          >
            <template #iconLeft>
              <i
                class="pi pi-search shrink-0 text-(--text-muted)"
                aria-hidden="true"
              />
            </template>
          </Select.Trigger>
          <Select.Content>
            <template #search>
              <InputText
                v-model="projectQuery"
                size="large"
                class="w-full"
                placeholder="Search projects"
                aria-label="Search projects"
                @keydown.stop
              >
                <template #iconLeft>
                  <i
                    class="pi pi-search"
                    aria-hidden="true"
                  />
                </template>
              </InputText>
            </template>
            <Select.Option
              v-for="option in visibleProjects"
              :key="option.value"
              :value="option.value"
            >
              <template #left>
                <i
                  :class="presetIcon(option.preset)"
                  class="shrink-0 text-body-lg"
                  :title="presetLabel(option.preset)"
                  aria-hidden="true"
                />
              </template>
              {{ option.label }}
            </Select.Option>
            <p
              v-if="!visibleProjects.length"
              class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
            >
              No project matches “{{ projectQuery }}”.
            </p>
          </Select.Content>
        </Select>
      </div>
    </div>

    <template #start>
      <Button
        label="Import"
        kind="outlined"
        size="medium"
        icon="pi pi-upload"
        :disabled="submitting"
        @click="openImport"
      />
      <p class="min-w-0 text-body-sm text-(--text-muted)">or paste .env contents in Key input</p>
      <input
        ref="fileRef"
        type="file"
        accept=".env,.txt,text/plain"
        class="sr-only"
        tabindex="-1"
        aria-hidden="true"
        @change="onFilePicked"
      />
    </template>
  </ResourceDrawer>
</template>
