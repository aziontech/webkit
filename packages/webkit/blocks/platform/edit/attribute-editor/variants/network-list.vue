<script setup lang="ts">
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, nextTick, ref, useId, watch } from 'vue'

  type ListEntry = { value: string; note: string; pasted: boolean }
  type ListCopy = { column: string; placeholder: string; noun: string; rule: string; hint: string }

  const TYPES = [
    { label: 'IP/CIDR', value: 'ip' },
    { label: 'ASN', value: 'asn' },
    { label: 'Countries', value: 'countries' }
  ]
  const TYPE_COPY: Record<string, ListCopy | undefined> = {
    ip: {
      column: 'Address',
      placeholder: '203.0.113.0/24',
      noun: 'address',
      rule: 'an IPv4 or IPv6 address, or a CIDR range',
      hint: 'One IPv4 or IPv6 address or CIDR range per row, with an optional comment.'
    },
    asn: {
      column: 'ASN',
      placeholder: 'AS64500',
      noun: 'ASN',
      rule: 'a number from 1 to 4294967295, with or without AS',
      hint: 'One autonomous system number per row, written 64500 or AS64500.'
    }
  }
  const COUNTRIES = [
    { value: 'AR', label: 'Argentina' },
    { value: 'BR', label: 'Brazil' },
    { value: 'CL', label: 'Chile' },
    { value: 'DE', label: 'Germany' },
    { value: 'IN', label: 'India' },
    { value: 'JP', label: 'Japan' },
    { value: 'MX', label: 'Mexico' },
    { value: 'PT', label: 'Portugal' },
    { value: 'US', label: 'United States' }
  ]
  const SAMPLE_LIST = [
    '# Office and partner ranges',
    '203.0.113.0/24  # head office',
    '198.51.100.17',
    '198.51.100.300',
    '2001:db8::/32  # partner VPN',
    '192.0.2.44',
    '198.51.100.17',
    '192.0.2.0/33',
    '192.0.2.128/25  # staging'
  ].join('\n')
  const LIMIT = 200

  const drawerOpen = ref(false)
  const name = ref('')
  const type = ref('ip')
  const countries = ref<string[]>([])
  const submitted = ref(false)
  const submitting = ref(false)
  const formEl = ref<HTMLFormElement | null>(null)

  const isIPv4 = (value: string) => {
    const parts = value.split('.')
    return (
      parts.length === 4 && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255)
    )
  }
  const isIPv6 = (value: string) =>
    /^[0-9a-f:]+$/i.test(value) &&
    value.includes(':') &&
    (value.match(/::/g) ?? []).length <= 1 &&
    value.split(':').every((group) => group.length <= 4)
  const validIp = (raw: string) => {
    const [address, prefix, extra] = raw.split('/')
    if (extra !== undefined) return false
    const v4 = isIPv4(address)
    if (!v4 && !isIPv6(address)) return false
    if (prefix === undefined) return true
    if (!/^\d{1,3}$/.test(prefix)) return false
    return Number(prefix) <= (v4 ? 32 : 128)
  }
  const validAsn = (raw: string) => {
    const digits = raw.replace(/^AS/i, '')
    return /^\d{1,10}$/.test(digits) && Number(digits) >= 1 && Number(digits) <= 4294967295
  }
  const entryError = (kind: string, value: string) => {
    const text = value.trim()
    if (!text) return `Enter ${kind === 'ip' ? 'an address' : 'an ASN'}.`
    const ok = kind === 'ip' ? validIp(text) : validAsn(text)
    return ok ? '' : `${text} is not ${TYPE_COPY[kind]?.rule}.`
  }
  const normalize = (kind: string, value: string) =>
    kind === 'asn' ? value.trim().replace(/^AS/i, '') : value.trim().toLowerCase()

  const createEntry = (value = '', note = '', pasted = false): ListEntry => ({
    value,
    note,
    pasted
  })
  const entries = ref<Record<string, ListEntry[]>>({ ip: [createEntry()], asn: [createEntry()] })
  const rows = computed({
    get: () => entries.value[type.value] ?? [],
    set: (next: ListEntry[]) => {
      entries.value = { ...entries.value, [type.value]: next }
    }
  })
  const copy = computed(() => TYPE_COPY[type.value])
  const columns = computed(() =>
    copy.value
      ? [
          {
            key: 'value',
            label: copy.value.column,
            placeholder: copy.value.placeholder,
            required: true
          },
          { key: 'note', label: 'Comment', placeholder: 'Optional' }
        ]
      : []
  )
  const filled = computed(() => rows.value.filter((entry) => entry.value.trim()))
  const checked = (entry: ListEntry) =>
    Boolean(entry.value.trim() || entry.note.trim() || !filled.value.length)
  const rowErrors = computed(() =>
    rows.value.map((entry) => {
      const shown = submitted.value ? checked(entry) : entry.pasted && entry.value.trim()
      const message = shown ? entryError(type.value, entry.value) : ''
      return message ? { value: message } : {}
    })
  )
  const nameMissing = computed(() => submitted.value && !name.value.trim())
  const countriesMissing = computed(
    () => submitted.value && type.value === 'countries' && !countries.value.length
  )

  const pasteId = useId()
  const pasteOpen = ref(false)
  const pasteText = ref('')
  const status = ref('')
  const pasteToggle = ref<{ $el?: HTMLElement } | null>(null)

  const pasteReport = computed(() => {
    const kind = type.value
    const seen = new Set(
      rows.value.filter((entry) => entry.value.trim()).map((entry) => normalize(kind, entry.value))
    )
    const lines: ListEntry[] = []
    const duplicates: number[] = []
    const invalid: number[] = []
    pasteText.value.split(/\r?\n/).forEach((line, index) => {
      const [body, ...comment] = line.split('#')
      const value = body.trim()
      if (!value) return
      const key = normalize(kind, value)
      if (seen.has(key)) {
        duplicates.push(index + 1)
        return
      }
      seen.add(key)
      if (entryError(kind, value)) invalid.push(index + 1)
      lines.push(createEntry(value, comment.join('#').trim(), true))
    })
    return { lines, duplicates, invalid }
  })
  const lineList = (numbers: number[]) =>
    numbers.length === 1
      ? `Line ${numbers[0]} is`
      : `Lines ${numbers.slice(0, -1).join(', ')} and ${numbers[numbers.length - 1]} are`

  const applyPaste = async () => {
    const { lines, invalid } = pasteReport.value
    const kept = rows.value.filter((entry) => entry.value.trim() || entry.note.trim())
    rows.value = [...kept, ...lines].slice(0, LIMIT)
    status.value = `${lines.length} ${lines.length === 1 ? 'entry' : 'entries'} added from the pasted list.${
      invalid.length ? ` ${invalid.length} ${invalid.length === 1 ? 'needs' : 'need'} a fix.` : ''
    }`
    pasteOpen.value = false
    pasteText.value = ''
    await nextTick()
    pasteToggle.value?.$el?.focus()
  }
  const cancelPaste = async () => {
    pasteOpen.value = false
    await nextTick()
    pasteToggle.value?.$el?.focus()
  }

  watch(drawerOpen, (isOpen) => {
    if (!isOpen) return
    name.value = 'Office and partners'
    type.value = 'ip'
    countries.value = []
    entries.value = { ip: [createEntry()], asn: [createEntry()] }
    submitted.value = false
    status.value = ''
    pasteOpen.value = true
    pasteText.value = SAMPLE_LIST
  })

  const countryDisplay = (ids: unknown[]) => {
    if (!ids?.length) return ''
    if (ids.length > 1) return `${ids.length} countries`
    return COUNTRIES.find((option) => option.value === ids[0])?.label ?? String(ids[0])
  }

  const isValid = computed(() => {
    if (!name.value.trim()) return false
    if (type.value === 'countries') return countries.value.length > 0
    return (
      filled.value.length > 0 &&
      rows.value.filter(checked).every((entry) => !entryError(type.value, entry.value))
    )
  })

  const submit = async () => {
    if (submitting.value) return
    submitted.value = true
    if (!isValid.value) {
      await nextTick()
      formEl.value
        ?.querySelector<HTMLElement>(
          ':is(input, textarea, button)[aria-invalid="true"], :is(input, textarea, button)[aria-required="true"]'
        )
        ?.focus()
      return
    }
    submitting.value = true
    await new Promise((resolve) => setTimeout(resolve, 900))
    const count = type.value === 'countries' ? countries.value.length : filled.value.length
    submitting.value = false
    drawerOpen.value = false
    toast.success(`${name.value.trim()} created.`, {
      description: `${count} ${count === 1 ? 'entry' : 'entries'}, ready to use in firewall rules.`
    })
  }
</script>

<template>
  <Drawer
    v-model:open="drawerOpen"
    size="medium"
    side="right"
  >
    <DrawerTrigger>
      <div class="w-full md:w-fit">
        <Button
          label="Create Network List"
          icon="pi pi-plus"
          kind="primary"
          size="large"
          class="w-full"
        />
      </div>
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          ref="formEl"
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Create Network List"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DrawerTitle>Create Network List</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                A list of addresses, ASNs or countries that firewall rules allow or refuse.
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Create Network List</legend>
              <SettingsSection
                title="General"
                hint="Names the list where firewall rules pick it."
              >
                <Field
                  required
                  :invalid="nameMissing"
                >
                  <Field.Label>Name</Field.Label>
                  <Input
                    v-model="name"
                    size="large"
                    placeholder="Office and partners"
                    autocomplete="off"
                  />
                  <Field.Error v-if="nameMissing">Name is required.</Field.Error>
                </Field>
              </SettingsSection>

              <SettingsSection
                title="Entries"
                :hint="
                  copy?.hint ?? 'The countries the list matches, by where the request comes from.'
                "
              >
                <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
                  <div class="flex flex-wrap items-center justify-between gap-(--spacing-xs)">
                    <ToggleGroup
                      v-model="type"
                      :options="TYPES"
                      aria-label="List type"
                      size="medium"
                    />
                    <Button
                      v-if="copy"
                      ref="pasteToggle"
                      label="Paste list"
                      icon="pi pi-clipboard"
                      kind="outlined"
                      size="medium"
                      :aria-expanded="pasteOpen"
                      :aria-controls="pasteOpen ? `${pasteId}-panel` : undefined"
                      @click="pasteOpen = !pasteOpen"
                    />
                  </div>

                  <template v-if="copy">
                    <div
                      v-if="pasteOpen"
                      :id="`${pasteId}-panel`"
                      class="flex min-w-0 flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-(--border-muted) bg-(--bg-surface) p-(--spacing-md)"
                      data-testid="network-list-paste-panel"
                    >
                      <Field>
                        <Field.Label :for="pasteId">Paste one {{ copy.noun }} per line</Field.Label>
                        <div class="[&_textarea]:font-code">
                          <Textarea
                            :id="pasteId"
                            v-model="pasteText"
                            :rows="7"
                            spellcheck="false"
                            :aria-describedby="`${pasteId}-report`"
                          />
                        </div>
                      </Field>
                      <div
                        :id="`${pasteId}-report`"
                        class="flex flex-col gap-(--spacing-xxs)"
                      >
                        <HelperText
                          key="found"
                          :label="`${pasteReport.lines.length} ${pasteReport.lines.length === 1 ? 'entry' : 'entries'} found. Text after # is kept as the comment.`"
                        />
                        <HelperText
                          v-if="pasteReport.invalid.length"
                          key="invalid"
                          kind="invalid"
                          :label="`${lineList(pasteReport.invalid)} not ${copy.rule}; ${pasteReport.invalid.length === 1 ? 'it is' : 'they are'} added with an error to fix.`"
                        />
                        <HelperText
                          v-if="pasteReport.duplicates.length"
                          key="duplicates"
                          :label="`${lineList(pasteReport.duplicates)} already in the list and will be skipped.`"
                        />
                      </div>
                      <div class="flex flex-wrap items-center gap-(--spacing-xs)">
                        <Button
                          :label="`Add ${pasteReport.lines.length} ${pasteReport.lines.length === 1 ? 'entry' : 'entries'}`"
                          kind="primary"
                          size="medium"
                          :disabled="!pasteReport.lines.length"
                          data-testid="network-list-paste-apply"
                          @click="applyPaste"
                        />
                        <Button
                          label="Cancel"
                          kind="transparent"
                          size="medium"
                          @click="cancelPaste"
                        />
                      </div>
                    </div>
                    <p
                      class="sr-only"
                      role="status"
                      aria-live="polite"
                    >
                      {{ status }}
                    </p>
                    <AttributeEditor
                      v-model:items="rows"
                      :definition="columns"
                      :errors="rowErrors"
                      :new-item="() => createEntry()"
                      :min-items="1"
                      :limit="LIMIT"
                      size="large"
                      :add-button-label="`Add ${copy.noun}`"
                      :remove-button-label="`Remove ${copy.noun}`"
                      :aria-label="`${copy.column} entries`"
                    >
                      <template #cell-value="{ value, update, invalid }">
                        <div class="contents font-code">
                          <Input
                            :model-value="value as string"
                            size="large"
                            :placeholder="copy.placeholder"
                            autocomplete="off"
                            :spellcheck="false"
                            :invalid="invalid"
                            @update:model-value="update"
                          />
                        </div>
                      </template>
                    </AttributeEditor>
                  </template>

                  <Field
                    v-else
                    required
                    :invalid="countriesMissing"
                  >
                    <Field.Label>Countries</Field.Label>
                    <MultiSelect
                      v-model="countries"
                      size="large"
                      placeholder="Select countries"
                      :display-value="countryDisplay"
                    >
                      <MultiSelect.Trigger aria-label="Countries" />
                      <MultiSelect.Content>
                        <MultiSelect.Option
                          v-for="option in COUNTRIES"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </MultiSelect.Option>
                      </MultiSelect.Content>
                    </MultiSelect>
                    <Field.Error v-if="countriesMissing">Select at least one country.</Field.Error>
                  </Field>
                </div>
              </SettingsSection>
            </fieldset>
          </PanelContent>

          <PanelFooter
            ><div class="flex w-full justify-end">
              <Button
                type="submit"
                label="Save"
                kind="primary"
                size="medium"
                :loading="submitting"
              /></div
          ></PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
  <Toaster position="bottom-right" />
</template>
