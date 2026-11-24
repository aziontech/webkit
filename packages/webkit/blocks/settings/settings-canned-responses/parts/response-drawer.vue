<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Combobox from '@aziontech/webkit/combobox'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import MarkdownEditor from '@aziontech/webkit/markdown-editor'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import RadioGroup from '@aziontech/webkit/radio-group-root'
  import Select from '@aziontech/webkit/select'
  import { computed, nextTick, reactive, ref, useId, watch } from 'vue'

  import type {
    CannedResponsesPlaceholder,
    CannedResponsesResponse,
    CannedResponsesTicketStatus,
    CannedResponsesValues,
    CannedResponsesVisibility
  } from '../settings-canned-responses.vue'

  const props = defineProps<{
    response: CannedResponsesResponse | null
    folders: string[]
    titles: string[]
    placeholders: CannedResponsesPlaceholder[]
    saving: boolean
    saveError: string
    visibilityLabels: Record<CannedResponsesVisibility, string>
  }>()

  const emit = defineEmits<{ save: [event: Event, values: CannedResponsesValues] }>()

  const open = defineModel<boolean>('open', { required: true })

  const UNCHANGED = 'unchanged'
  const ids = {
    title: useId(),
    folder: useId(),
    body: useId(),
    status: useId(),
    visibility: useId()
  }

  const statusOptions: { value: CannedResponsesTicketStatus | typeof UNCHANGED; label: string }[] =
    [
      { value: UNCHANGED, label: "Don't change the status" },
      { value: 'New', label: 'New' },
      { value: 'Open', label: 'Open' },
      { value: 'Pending', label: 'Pending' },
      { value: 'On hold', label: 'On hold' },
      { value: 'Solved', label: 'Solved' }
    ]
  const statusLabel = (value: string) =>
    statusOptions.find((option) => option.value === value)?.label ?? ''

  const visibilityHints: Record<CannedResponsesVisibility, string> = {
    personal: 'Only you can insert it.',
    team: 'Everyone in your team can insert it.',
    everyone: 'Every agent of the account can insert it.'
  }
  const visibilityOptions = computed(() =>
    (Object.keys(visibilityHints) as CannedResponsesVisibility[]).map((value) => ({
      value,
      label: props.visibilityLabels[value],
      description: visibilityHints[value]
    }))
  )

  const folderOptions = computed(() => props.folders.map((value) => ({ value })))

  const placeholderGroups = computed(() => {
    const groups = new Map<string, CannedResponsesPlaceholder[]>()
    for (const placeholder of props.placeholders) {
      groups.set(placeholder.group, [...(groups.get(placeholder.group) ?? []), placeholder])
    }
    return [...groups.entries()].map(([label, items]) => ({ label, items }))
  })

  const form = reactive({
    title: '',
    folder: '',
    visibility: 'personal' as CannedResponsesVisibility,
    body: '',
    status: UNCHANGED as string
  })
  const errors = reactive({ title: '', body: '' })
  const editing = computed(() => props.response !== null)

  watch(
    open,
    (now) => {
      if (!now) return
      const response = props.response
      Object.assign(form, {
        title: response?.title ?? '',
        folder: response?.folder ?? '',
        visibility: response?.visibility ?? 'personal',
        body: response?.body ?? '',
        status: response?.status ?? UNCHANGED
      })
      Object.assign(errors, { title: '', body: '' })
    },
    { immediate: true }
  )

  const editorEl = ref<InstanceType<typeof MarkdownEditor> | null>(null)
  const bodyField = () => document.getElementById(ids.body) as HTMLTextAreaElement | null
  const caret = ref<{ start: number; end: number } | null>(null)

  const rememberCaret = (menuOpen: boolean) => {
    if (!menuOpen) return
    const field = bodyField()
    caret.value = field ? { start: field.selectionStart, end: field.selectionEnd } : null
  }

  const tokenOf = (value: DropdownMenuItemValue) => `{{${value}}}`

  const insertPlaceholder = async (_event: Event, value: DropdownMenuItemValue) => {
    const token = tokenOf(value)
    const { start, end } = caret.value ?? { start: form.body.length, end: form.body.length }
    form.body = form.body.slice(0, start) + token + form.body.slice(end)
    errors.body = ''
    const next = start + token.length
    caret.value = { start: next, end: next }
    editorEl.value?.focus()
    await nextTick()
    setTimeout(() => {
      const field = bodyField()
      field?.focus()
      field?.setSelectionRange(next, next)
    })
  }

  const focusById = (id: string) => nextTick(() => document.getElementById(id)?.focus())

  const submit = (event: Event) => {
    if (props.saving) return
    const title = form.title.trim()
    if (!title) errors.title = 'Enter a title.'
    else if (props.titles.some((other) => other.toLowerCase() === title.toLowerCase())) {
      errors.title = 'A response with this title already exists. Use another title.'
    } else errors.title = ''
    errors.body = form.body.trim() ? '' : 'Write the reply agents insert.'
    if (errors.title) return focusById(ids.title)
    if (errors.body) return editorEl.value?.focus()
    emit('save', event, {
      title,
      folder: form.folder.trim(),
      visibility: form.visibility,
      body: form.body,
      status: form.status === UNCHANGED ? null : (form.status as CannedResponsesTicketStatus)
    })
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="end"
    :dismissible="!saving"
    :closable="!saving"
  >
    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        :aria-label="editing ? 'Edit response' : 'New response'"
        novalidate
        @submit.prevent="submit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>{{ editing ? 'Edit response' : 'New response' }}</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              Agents insert it from the reply box of a ticket. Placeholders are filled in for each
              ticket.
            </p>
          </div>
        </PanelHeader>

        <PanelBody>
          <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
            <Alert
              v-if="saveError"
              severity="danger"
              :label="saveError"
            />
            <fieldset
              class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
              :disabled="saving"
            >
              <legend class="sr-only">{{ editing ? 'Edit response' : 'New response' }}</legend>
              <Field
                required
                :invalid="!!errors.title"
              >
                <Field.Label :for="ids.title">Title</Field.Label>
                <Input
                  :id="ids.title"
                  v-model="form.title"
                  dir="auto"
                  size="large"
                  autocomplete="off"
                  @update:model-value="errors.title = ''"
                />
                <Field.Error v-if="errors.title">{{ errors.title }}</Field.Error>
                <Field.Description v-else
                  >Agents search for it by title, so name what the reply answers.</Field.Description
                >
              </Field>

              <Field>
                <Field.Label :for="ids.folder">Folder</Field.Label>
                <Combobox
                  :id="ids.folder"
                  v-model="form.folder"
                  :options="folderOptions"
                  icon="az az-folder"
                  size="large"
                  clearable
                />
                <Field.Description
                  >Pick a folder or type a new name to create one. Leave it empty for no
                  folder.</Field.Description
                >
              </Field>

              <Field.Set>
                <Field.Legend>Visibility</Field.Legend>
                <RadioGroup
                  v-model="form.visibility"
                  :name="ids.visibility"
                  :options="visibilityOptions"
                />
              </Field.Set>

              <Field
                required
                :invalid="!!errors.body"
              >
                <Field.Label :for="ids.body">Reply</Field.Label>
                <MarkdownEditor
                  :id="ids.body"
                  dir="auto"
                  ref="editorEl"
                  v-model="form.body"
                  :min-rows="8"
                  @update:model-value="errors.body = ''"
                >
                  <template #footer>
                    <DropdownMenu
                      side="top"
                      @update:open="rememberCaret"
                      @select="insertPlaceholder"
                    >
                      <DropdownMenu.Trigger>
                        <Button
                          label="Insert placeholder"
                          icon="az az-code"
                          variant="outline"
                          size="small"
                          type="button"
                        />
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Group
                        v-for="group in placeholderGroups"
                        :key="group.label"
                        :label="group.label"
                      >
                        <DropdownMenu.Item
                          v-for="placeholder in group.items"
                          :key="placeholder.value"
                          :value="placeholder.value"
                          :label="placeholder.label"
                        >
                          <template #trailing>
                            <bdi
                              dir="ltr"
                              class="font-mono text-body-xs text-(--text-muted)"
                              >{{ tokenOf(placeholder.value) }}</bdi
                            >
                          </template>
                        </DropdownMenu.Item>
                      </DropdownMenu.Group>
                    </DropdownMenu>
                  </template>
                </MarkdownEditor>
                <Field.Error v-if="errors.body">{{ errors.body }}</Field.Error>
                <Field.Description v-else
                  >Markdown. A placeholder such as the requester's name is written in double
                  braces.</Field.Description
                >
              </Field>

              <Field>
                <Field.Label :for="ids.status">Also set the ticket status to</Field.Label>
                <Select
                  v-model="form.status"
                  size="large"
                  class="w-full"
                  :display-value="statusLabel"
                >
                  <Select.Trigger :id="ids.status" />
                  <Select.Content>
                    <Select.Item
                      v-for="option in statusOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Item>
                  </Select.Content>
                </Select>
                <Field.Description>Applied when the agent sends the reply.</Field.Description>
              </Field>
            </fieldset>
          </div>
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
            <Button
              label="Cancel"
              variant="outline"
              size="medium"
              type="button"
              :disabled="saving"
              @click="open = false"
            />
            <Button
              label="Save response"
              variant="primary"
              size="medium"
              type="submit"
              :loading="saving"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
