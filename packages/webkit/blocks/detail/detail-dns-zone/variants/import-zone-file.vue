<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import type { TableColumn } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Field from '@aziontech/webkit/field'
  import FieldError from '@aziontech/webkit/field-error'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onBeforeUnmount, ref, watch } from 'vue'

  import DetailDnsZone, { type DnsZoneDetailRecord } from '../detail-dns-zone.vue'
  import { sampleRecords } from '../sample'

  type ZoneLineBase = {
    line: number
    name?: string
    type?: string
    ttl?: number
    value?: string
    reason: string
  }
  type ZoneLine =
    | (ZoneLineBase & { status: 'skipped' | 'error' })
    | (ZoneLineBase & { status: 'ready'; name: string; type: string; ttl: number; value: string })

  const rows = ref<DnsZoneDetailRecord[]>([...sampleRecords])

  const SUPPORTED = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'CAA', 'SRV', 'NS', 'PTR']

  const stripComment = (line: string) => {
    let quoted = false
    for (let index = 0; index < line.length; index += 1) {
      const char = line[index]
      if (char === '"') quoted = !quoted
      else if (char === ';' && !quoted) return line.slice(0, index)
    }
    return line
  }
  const unroot = (name: string) =>
    name.length > 1 && name.endsWith('.') ? name.slice(0, -1) : name
  const readTtl = (token: string) => {
    if (/^\d+$/.test(token)) return Number(token)
    const match = /^(\d+)([smhdw])$/i.exec(token)
    if (!match) return null
    const units: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400, w: 604800 }
    return Number(match[1]) * units[match[2].toLowerCase()]
  }
  const IPV4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/
  const checkValue = (type: string, value: string) => {
    if (!value) return 'The record has no value.'
    if (type === 'A' && !IPV4.test(value)) return `${value} is not an IPv4 address.`
    if (type === 'AAAA' && !value.includes(':')) return `${value} is not an IPv6 address.`
    if (type === 'MX' && !/^\d+\s+\S+$/.test(value)) return 'MX needs a priority and a host.'
    return ''
  }

  const parseZoneFile = (text: string) => {
    const lines: ZoneLine[] = []
    let origin = ''
    let defaultTtl = 3600
    let lastName = '@'
    let skipping = 0
    text.split(/\r?\n/).forEach((rawLine, position) => {
      const line = stripComment(rawLine)
      const number = position + 1
      if (!line.trim()) return
      if (skipping > 0) {
        skipping += (line.match(/\(/g)?.length ?? 0) - (line.match(/\)/g)?.length ?? 0)
        return
      }
      const tokens = line.trim().split(/\s+/)
      const directive = tokens[0].toUpperCase()
      if (directive === '$ORIGIN') {
        origin = unroot(tokens[1] ?? '')
        return
      }
      if (directive === '$TTL') {
        const ttl = readTtl(tokens[1] ?? '')
        if (ttl === null) {
          lines.push({
            line: number,
            status: 'error',
            reason: `$TTL ${tokens[1] ?? ''} is not a time.`
          })
        } else defaultTtl = ttl
        return
      }
      if (directive.startsWith('$')) return
      let index = 0
      let name = lastName
      if (!/^\s/.test(line)) {
        name = tokens[0]
        index = 1
      }
      lastName = name
      let ttl = defaultTtl
      for (let guard = 0; guard < 2 && index < tokens.length; guard += 1) {
        const parsed = readTtl(tokens[index])
        if (parsed !== null) {
          ttl = parsed
          index += 1
        } else if (/^(IN|CH|HS)$/i.test(tokens[index])) index += 1
        else break
      }
      const type = (tokens[index] ?? '').toUpperCase()
      const rest = tokens.slice(index + 1)
      const unrooted = unroot(name)
      const relative =
        unrooted === '@' || (origin && unrooted === origin)
          ? '@'
          : origin && unrooted.endsWith(`.${origin}`)
            ? unrooted.slice(0, -(origin.length + 1))
            : unrooted
      if (type === 'SOA') {
        skipping = (line.match(/\(/g)?.length ?? 0) - (line.match(/\)/g)?.length ?? 0)
        lines.push({
          line: number,
          name: relative,
          type,
          status: 'skipped',
          reason: 'The zone keeps its own SOA.'
        })
        return
      }
      if (!SUPPORTED.includes(type)) {
        lines.push({
          line: number,
          name: relative,
          type: type || '—',
          status: type ? 'skipped' : 'error',
          reason: type ? `${type} records are not supported.` : 'No record type on this line.'
        })
        return
      }
      if (type === 'NS' && relative === '@') {
        lines.push({
          line: number,
          name: relative,
          type,
          status: 'skipped',
          reason: 'The zone answers with its own nameservers.'
        })
        return
      }
      const value =
        type === 'TXT'
          ? (rest.join(' ').match(/"([^"]*)"/g) ?? [rest.join(' ')])
              .map((part) => part.replace(/^"|"$/g, ''))
              .join('')
          : rest.map(unroot).join(' ')
      const problem = checkValue(type, value)
      lines.push({
        line: number,
        name: relative,
        type,
        ttl,
        value,
        status: problem ? 'error' : 'ready',
        reason: problem
      })
    })
    return { origin, lines }
  }

  const SAMPLE_ZONE = `$ORIGIN example.com.
$TTL 1h
@       IN SOA ns1.example.net. admin.example.com. ( 2026111101 7200 3600 1209600 3600 )
@       IN NS  ns1.example.net.
@       IN A   192.0.2.10
www     IN CNAME example.com.
api 300 IN A   192.0.2.300
mail    IN MX  10 mx.example.net.
@       IN TXT "v=spf1 include:_spf.example.net ~all"
ipv6    IN AAAA 2001:db8::10
legacy  IN HINFO "PC" "Linux"`

  const importOpen = ref(true)
  const zoneText = ref(SAMPLE_ZONE)
  const zoneSource = ref('the pasted zone file')
  const fileInputEl = ref<HTMLInputElement | null>(null)
  const dropError = ref('')
  const parsedText = ref(SAMPLE_ZONE)
  let parseTimer: ReturnType<typeof setTimeout> | undefined
  watch(zoneText, (text) => {
    clearTimeout(parseTimer)
    if (text === parsedText.value) return
    parseTimer = setTimeout(() => {
      parsedText.value = text
    }, 250)
  })
  const parsed = computed(() => parseZoneFile(parsedText.value))
  const readyLines = computed(() => parsed.value.lines.filter((entry) => entry.status === 'ready'))
  const errorLines = computed(() => parsed.value.lines.filter((entry) => entry.status === 'error'))
  const skippedLines = computed(() =>
    parsed.value.lines.filter((entry) => entry.status === 'skipped')
  )
  const previewColumns: TableColumn[] = [
    { accessorKey: 'line', header: 'Line', minWidth: 64 },
    { accessorKey: 'name', header: 'Name', principal: true },
    { accessorKey: 'type', header: 'Type', minWidth: 80 },
    { accessorKey: 'value', header: 'Value', grow: 2 },
    { accessorKey: 'status', header: 'Status', minWidth: 104 }
  ]
  const statusTag: Record<ZoneLine['status'], { label: string; severity: TagSeverity }> = {
    ready: { label: 'Ready', severity: 'success' },
    skipped: { label: 'Skipped', severity: 'neutral' },
    error: { label: 'Error', severity: 'danger' }
  }

  const readFile = async (file: File | undefined) => {
    if (!file) return
    dropError.value = ''
    const text = await file.text()
    if (!parseZoneFile(text).lines.length) {
      dropError.value = `No records found in ${file.name}. Expected a zone file in BIND format, like www IN CNAME example.com.`
      return
    }
    clearTimeout(parseTimer)
    parsedText.value = text
    zoneText.value = text
    zoneSource.value = file.name
  }
  const onDrop = (_event: DragEvent, files: File[]) => readFile(files[0])
  const onReject = () => {
    dropError.value = 'Drop one text file, such as example.com.zone or zone.txt.'
  }
  const onPicked = (event: Event) => {
    const input = event.target as HTMLInputElement
    readFile(input.files?.[0])
    input.value = ''
  }
  const onPaste = () => {
    zoneSource.value = 'the pasted zone file'
  }

  const runImport = () => {
    clearTimeout(parseTimer)
    parsedText.value = zoneText.value
    if (!readyLines.value.length) return
    const added: DnsZoneDetailRecord[] = readyLines.value.map((entry, offset) => ({
      id: String(424000 + rows.value.length + offset),
      name: entry.name,
      type: entry.type,
      value: entry.value,
      ttl: entry.ttl,
      policy: 'simple',
      weight: null,
      description: ''
    }))
    rows.value = [...rows.value, ...added]
    importOpen.value = false
    const left = errorLines.value.length
    toast.success(
      added.length === 1
        ? `Imported 1 record from ${zoneSource.value}.`
        : `Imported ${added.length} records from ${zoneSource.value}.`,
      {
        description: left
          ? `${left} ${left === 1 ? 'line was' : 'lines were'} left out. Fix them in the file and import it again.`
          : 'The zone answers with them now.'
      }
    )
  }
  onBeforeUnmount(() => clearTimeout(parseTimer))
</script>

<template>
  <DetailDnsZone
    tab="records"
    importable
    :records="rows"
    @import="importOpen = true"
  />

  <Drawer
    v-model:open="importOpen"
    side="end"
    size="large"
  >
    <DrawerContent>
      <PanelHeader class="w-full">
        <DrawerTitle>Import zone file</DrawerTitle>
      </PanelHeader>
      <PanelBody>
        <div class="flex flex-col gap-(--spacing-lg)">
          <DrawerDescription>
            Records in BIND format are added to example.com. Nothing changes until you import, and
            lines that cannot be read are left out.
          </DrawerDescription>

          <section
            aria-labelledby="zone-import-source"
            class="flex flex-col gap-(--spacing-sm)"
          >
            <h3
              id="zone-import-source"
              class="m-0 text-label-md text-(--text-default)"
            >
              Zone file
            </h3>
            <FileDropzone
              title="Drop a zone file"
              description="One .zone or .txt file in BIND format."
              accept=".zone,.txt,.db,text/plain"
              :multiple="false"
              icon="az az-file-import"
              :invalid="Boolean(dropError)"
              @drop="onDrop"
              @reject="onReject"
            >
              <Button
                label="Browse files"
                variant="secondary"
                size="medium"
                @click="fileInputEl?.click()"
              />
            </FileDropzone>
            <input
              ref="fileInputEl"
              type="file"
              accept=".zone,.txt,.db,text/plain"
              class="hidden"
              aria-hidden="true"
              tabindex="-1"
              @change="onPicked"
            />
            <FieldError v-if="dropError">{{ dropError }}</FieldError>
            <Field>
              <Field.Label for="zone-import-text">
                <span class="text-(--text-muted)">Or paste it</span>
              </Field.Label>
              <Textarea
                id="zone-import-text"
                v-model="zoneText"
                class="w-full"
                :rows="8"
                placeholder="www IN CNAME example.com."
                @paste="onPaste"
              />
            </Field>
          </section>

          <section
            aria-labelledby="zone-import-preview"
            class="flex flex-col gap-(--spacing-sm)"
          >
            <div class="flex flex-wrap items-baseline justify-between gap-(--spacing-xs)">
              <h3
                id="zone-import-preview"
                class="m-0 text-label-md text-(--text-default)"
              >
                Preview
              </h3>
              <p
                role="status"
                class="m-0 text-body-sm text-(--text-muted)"
              >
                {{ readyLines.length }} ready, {{ skippedLines.length }} skipped,
                {{ errorLines.length }} {{ errorLines.length === 1 ? 'error' : 'errors' }}
              </p>
            </div>
            <Alert
              v-if="errorLines.length"
              severity="danger"
            >
              {{
                errorLines.length === 1
                  ? `Line ${errorLines[0].line} cannot be imported.`
                  : `${errorLines.length} lines cannot be imported.`
              }}
              The ready records still import; fix the rest in the file and import it again.
            </Alert>
            <Card :padded="false">
              <template #default>
                <DataTable
                  :data="parsed.lines"
                  :columns="previewColumns"
                  row-key="line"
                  paginated
                  :page-size="10"
                  :bordered="false"
                  aria-label="Zone file preview"
                >
                  <template #cell-name="{ value }">
                    <span class="font-(family-name:--font-code) text-body-sm">{{
                      value ?? '—'
                    }}</span>
                  </template>
                  <template #cell-value="{ row }">
                    <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                      <span
                        v-if="row.value"
                        class="truncate font-(family-name:--font-code) text-body-sm"
                        >{{ row.value }}</span
                      >
                      <span
                        v-if="row.reason"
                        class="text-body-xs"
                        :class="row.status === 'error' ? 'text-(--danger)' : 'text-(--text-muted)'"
                        >{{ row.reason }}</span
                      >
                    </span>
                  </template>
                  <template #cell-status="{ value }">
                    <Tag
                      :label="statusTag[value].label"
                      :severity="statusTag[value].severity"
                      size="small"
                    />
                  </template>
                </DataTable>
              </template>
            </Card>
          </section>
        </div>
      </PanelBody>
      <PanelFooter>
        <div class="flex w-full justify-end gap-(--spacing-xs)">
          <Button
            label="Cancel"
            variant="outline"
            @click="importOpen = false"
          />
          <Button
            :label="
              readyLines.length === 1 ? 'Import 1 record' : `Import ${readyLines.length} records`
            "
            variant="primary"
            :disabled="!readyLines.length"
            @click="runImport"
          />
        </div>
      </PanelFooter>
    </DrawerContent>
  </Drawer>
</template>
