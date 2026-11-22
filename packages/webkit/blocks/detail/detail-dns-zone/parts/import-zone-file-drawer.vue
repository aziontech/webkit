<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import type { TableColumn } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
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
  import { useFilePicker } from '@aziontech/webkit/use-file-picker'
  import { computed, onBeforeUnmount, ref, watch } from 'vue'

  import type { DnsZoneDetailRecord } from '../detail-dns-zone.vue'
  import { parseZoneFile, type ZoneLine } from '../dns-zone-file'
  import { sampleZoneFile } from '../sample'

  const importOpen = defineModel<boolean>('open', { required: true })
  const rows = defineModel<DnsZoneDetailRecord[]>('records', { required: true })

  const zoneText = ref(sampleZoneFile)
  const zoneSource = ref('the pasted zone file')
  const zoneFilePicker = useFilePicker({ accept: '.zone,.txt,.db,text/plain' })
  const dropError = ref('')
  const parsedText = ref(sampleZoneFile)
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
  const pickZoneFile = async () => {
    const [file] = await zoneFilePicker.open()
    if (file) readFile(file)
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
                @click="pickZoneFile"
              />
            </FileDropzone>
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
                  <template #footer>
                    <DataTablePagination :page-size="10" />
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
