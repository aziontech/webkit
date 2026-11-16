<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref } from 'vue'

  interface FormErrors {
    name: string
    nameKind: 'helper' | 'invalid' | 'required'
    domain: string
    domainKind: 'helper' | 'invalid' | 'required'
  }

  interface ZoneRecord {
    name: string
    type: string
    value: string
    ttl: number
  }

  interface ParsedZone {
    origin: string
    records: ZoneRecord[]
  }

  const breadcrumb = [{ label: 'Edge DNS', href: '/edge-dns' }, { label: 'Create Zone' }]

  const form = reactive({ name: 'example.com', domain: 'example.com', dnssec: false, active: true })
  const errors = reactive<FormErrors>({
    name: '',
    nameKind: 'required',
    domain: '',
    domainKind: 'required'
  })
  const advancedOpen = ref(false)
  const fileEl = ref<HTMLInputElement | null>(null)

  const records = ref<ZoneRecord[]>([
    { name: '@', type: 'A', value: '192.0.2.10', ttl: 3600 },
    { name: 'www', type: 'CNAME', value: 'example.com.', ttl: 3600 },
    { name: 'api', type: 'A', value: '198.51.100.24', ttl: 300 },
    { name: '@', type: 'MX', value: '10 mail.example.com.', ttl: 3600 },
    { name: '@', type: 'TXT', value: '"v=spf1 include:_spf.example.com ~all"', ttl: 3600 }
  ])
  const importedFrom = ref('“example.com.zone”')

  const RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'SRV', 'CAA', 'PTR', 'NS', 'SOA']
  const KEPT_BY_PROVIDER = ['SOA', 'NS']

  const parseZoneFile = (text: string): ParsedZone => {
    let origin = ''
    let ttl = 3600
    const parsed: ZoneRecord[] = []
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.replace(/;.*$/, '').trim()
      if (!line) continue
      const parts = line.split(/\s+/)
      if (parts[0] === '$ORIGIN') {
        origin = (parts[1] ?? '').replace(/\.$/, '')
        continue
      }
      if (parts[0] === '$TTL') {
        ttl = Number.parseInt(parts[1] ?? '', 10) || ttl
        continue
      }
      const typeAt = parts.findIndex((part, index) => index > 0 && RECORD_TYPES.includes(part))
      if (typeAt < 1) continue
      const type = parts[typeAt]
      if (KEPT_BY_PROVIDER.includes(type)) continue
      const recordTtl = parts.slice(1, typeAt).find((part) => /^\d+$/.test(part))
      parsed.push({
        name: parts[0],
        type,
        value: parts.slice(typeAt + 1).join(' '),
        ttl: recordTtl ? Number(recordTtl) : ttl
      })
    }
    return { origin, records: parsed }
  }

  const RECORD_PREVIEW = 50
  const recordKey = (record: ZoneRecord) => `${record.name}|${record.type}|${record.value}`
  const shownRecords = computed(() => records.value.slice(0, RECORD_PREVIEW))
  const hiddenRecordCount = computed(() => records.value.length - shownRecords.value.length)

  const applyParsed = (parsed: ParsedZone, source: string) => {
    if (parsed.origin) {
      if (!form.domain.trim()) {
        form.domain = parsed.origin
        errors.domain = ''
      }
      if (!form.name.trim()) {
        form.name = parsed.origin
        errors.name = ''
      }
    }
    const seen = new Set(records.value.map(recordKey))
    const fresh = parsed.records.filter((record) => {
      const key = recordKey(record)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    records.value = [...records.value, ...fresh]
    importedFrom.value = source
    const count = fresh.length
    toast.success(
      count === 1
        ? `Imported 1 record from ${source}.`
        : `Imported ${count} records from ${source}.`,
      parsed.origin ? { description: `Zone origin ${parsed.origin}.` } : undefined
    )
  }

  const onFilePicked = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const [file] = Array.from(input.files ?? [])
    input.value = ''
    if (!file) return
    const parsed = parseZoneFile(await file.text())
    if (!parsed.records.length) {
      toast.error(`No records found in “${file.name}”.`, {
        description: 'Expected a zone file in the BIND form, like www IN CNAME example.com.'
      })
      return
    }
    applyParsed(parsed, `“${file.name}”`)
  }

  const onDomainPaste = (event: ClipboardEvent) => {
    const parsed = parseZoneFile(event.clipboardData?.getData('text/plain') ?? '')
    if (!parsed.records.length) return
    event.preventDefault()
    applyParsed(parsed, 'the pasted zone file')
  }

  const removeRecord = (index: number) => {
    records.value.splice(index, 1)
    if (!records.value.length) importedFrom.value = ''
  }

  const discardImport = () => {
    const count = records.value.length
    records.value = []
    importedFrom.value = ''
    toast.info(
      count === 1 ? '1 imported record discarded.' : `${count} imported records discarded.`
    )
  }

  const NAME_MAX = 50
  const DOMAIN_PATTERN = /^(?=.{4,253}$)((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$/

  const validate = () => {
    const name = form.name.trim()
    if (!name) {
      errors.nameKind = 'required'
      errors.name = 'This field is required.'
    } else if (name.length > NAME_MAX) {
      errors.nameKind = 'invalid'
      errors.name = 'Use at most ' + NAME_MAX + ' characters.'
    } else {
      errors.name = ''
    }

    const domain = form.domain.trim()
    if (!domain) {
      errors.domainKind = 'required'
      errors.domain = 'This field is required.'
    } else if (!DOMAIN_PATTERN.test(domain)) {
      errors.domainKind = 'invalid'
      errors.domain = 'Enter a valid domain name. Example: example.com.'
    } else {
      errors.domain = ''
    }

    return !errors.name && !errors.domain
  }

  const submitting = ref(false)
  const SAVE_FAILURES = 0
  let failuresLeft = SAVE_FAILURES

  const sendRequest = () =>
    new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (failuresLeft > 0) {
          failuresLeft -= 1
          reject(new Error('The service did not answer. Check your connection and try again.'))
          return
        }
        resolve()
      }, 900)
    })

  const submit = async () => {
    if (submitting.value || !validate()) return
    submitting.value = true
    try {
      await sendRequest()
      toast.success(`${form.domain.trim()} zone created.`)
    } catch (error) {
      toast.error('Could not create the zone.', {
        description: error instanceof Error ? error.message : 'Try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
  const openImport = () => fileEl.value?.click()
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <AppHeader aria-label="Console">
      <AppHeader.Start>
        <IconButton
          icon="ai ai-chevron-left"
          aria-label="Back to Edge DNS"
          variant="outline"
          size="small"
        />
        <AppHeader.Brand>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
          >
            <Brand
              variant="default"
              size="small"
            />
          </a>
        </AppHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </AppHeader.Start>
      <AppHeader.Center />
      <AppHeader.End>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            variant="square"
          />
        </button>
      </AppHeader.End>
    </AppHeader>

    <main class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col">
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-labelledby="create-zone-title"
        novalidate
        @submit.prevent="submit"
      >
        <div class="flex min-h-0 flex-1 flex-col overflow-auto">
          <div
            class="layout-column-form layout-boundary-inline flex flex-1 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeader
              title="Create Zone"
              description="A zone holds the DNS records that answer authoritatively for a domain."
              size="small"
              title-id="create-zone-title"
            />

            <fieldset
              :disabled="submitting"
              class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
            >
              <legend class="sr-only">Create Zone</legend>

              <SettingsSection
                title="General"
                hint="The two fields a zone requires: what the zone is called here, and the domain it answers for."
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        stackable
                        title="Name"
                        description="Identifies the zone in this list. It is not the domain."
                      >
                        <Input
                          v-model="form.name"
                          size="large"
                          class="w-full"
                          aria-label="Name"
                          placeholder="My zone"
                          autocomplete="off"
                          :required="!!errors.name && errors.nameKind === 'required'"
                          :invalid="!!errors.name && errors.nameKind === 'invalid'"
                          :aria-describedby="errors.name ? 'create-zone-name-message' : undefined"
                          @update:model-value="errors.name = ''"
                        />
                        <FieldError
                          v-if="errors.name"
                          id="create-zone-name-message"
                          >{{ errors.name }}</FieldError
                        >
                      </SettingsRow>
                      <SettingsRow
                        stackable
                        title="Domain name"
                        description="The root domain, without a subdomain. Paste a zone file to import it."
                      >
                        <Input
                          v-model="form.domain"
                          size="large"
                          class="w-full"
                          aria-label="Domain name"
                          placeholder="example.com"
                          autocomplete="off"
                          :required="!!errors.domain && errors.domainKind === 'required'"
                          :invalid="!!errors.domain && errors.domainKind === 'invalid'"
                          :aria-describedby="
                            errors.domain ? 'create-zone-domain-message' : undefined
                          "
                          @update:model-value="errors.domain = ''"
                          @paste="onDomainPaste"
                        />
                        <FieldError
                          v-if="errors.domain"
                          id="create-zone-domain-message"
                          >{{ errors.domain }}</FieldError
                        >
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                v-if="records.length"
                title="Records"
                :hint="`Read from ${importedFrom} and created with the zone, except the SOA and the nameservers, which the provider keeps.`"
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List aria-label="Imported records">
                      <Item
                        v-for="(record, index) in shownRecords"
                        :key="`${index}-${recordKey(record)}`"
                        size="small"
                      >
                        <Item.Content>
                          <Item.Title>
                            <span class="text-label-code-sm">{{ record.name }}</span>
                            <Tag
                              :label="record.type"
                              severity="info"
                              size="small"
                            />
                          </Item.Title>
                          <Item.Description>
                            <span class="text-label-code-sm">{{ record.value }}</span> · TTL
                            {{ record.ttl }}
                          </Item.Description>
                        </Item.Content>
                        <Item.Actions>
                          <IconButton
                            icon="ai ai-x"
                            variant="ghost"
                            size="medium"
                            :aria-label="`Remove ${record.type} record ${record.name}`"
                            @click="removeRecord(index)"
                          />
                        </Item.Actions>
                      </Item>
                    </Item.List>
                    <p
                      v-if="hiddenRecordCount > 0"
                      class="m-0 px-(--spacing-md) py-(--spacing-sm) text-body-sm text-(--text-muted)"
                    >
                      and {{ hiddenRecordCount }} more
                    </p>
                  </template>
                  <template #footer>
                    <div
                      class="flex min-w-0 flex-wrap items-center justify-between gap-(--spacing-sm)"
                    >
                      <p class="m-0 text-body-sm text-(--text-muted)">
                        {{ records.length }} {{ records.length === 1 ? 'record' : 'records' }} to
                        create
                      </p>
                      <Button
                        type="button"
                        label="Discard import"
                        variant="ghost"
                        size="medium"
                        @click="discardImport"
                      />
                    </div>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Advanced"
                v-model:open="advancedOpen"
                icon="ai ai-settings"
                collapsible
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        title="DNSSEC"
                        description="Signs this zone's answers so a resolver can detect cache poisoning and spoofing. Completing the setup also means adding the Key Tag and Digest at your domain provider."
                        variant="compact"
                      >
                        <Switch
                          v-model="form.dnssec"
                          aria-label="Enable DNSSEC"
                        />
                      </SettingsRow>
                      <SettingsRow
                        title="Active"
                        description="When active, the zone answers authoritative DNS queries for the domain."
                        variant="compact"
                      >
                        <Switch
                          v-model="form.active"
                          aria-label="Active"
                        />
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
            </fieldset>
          </div>
          <SaveBar variant="centered">
            <template #leading>
              <div class="flex min-w-0 items-center gap-(--spacing-sm)">
                <Button
                  type="button"
                  label="Import"
                  variant="outline"
                  size="medium"
                  icon="ai ai-upload"
                  class="shrink-0"
                  @click="openImport"
                />
                <p class="min-w-0 text-body-sm text-(--text-muted) max-sm:hidden">
                  or paste zone file contents in Domain name
                </p>
                <input
                  ref="fileEl"
                  type="file"
                  accept=".zone,.txt,.db,text/plain"
                  class="sr-only"
                  tabindex="-1"
                  aria-hidden="true"
                  @change="onFilePicked"
                />
              </div>
            </template>
            <template #actions>
              <Button
                type="button"
                label="Cancel"
                variant="outline"
                size="medium"
              />
              <Button
                label="Save"
                variant="primary"
                size="medium"
                type="submit"
                :loading="submitting"
              />
            </template>
          </SaveBar>
        </div>
      </form>
    </main>
  </div>
</template>
