<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import { computed, onMounted, ref } from 'vue'

  import CreateDeployTemplate from '../create-deploy-template.vue'
  import { sampleUploadedProject } from '../sample'

  interface ProjectFile {
    path: string
    bytes: number
    glyph: string
  }

  const presets: SelectOptionItem[] = [
    { label: 'Nuxt', value: 'nuxt' },
    { label: 'Next.js', value: 'next' },
    { label: 'Vite', value: 'vite' },
    { label: 'Astro', value: 'astro' },
    { label: 'Static files', value: 'static' }
  ]

  const files: ProjectFile[] = [
    { path: 'about.html', bytes: 4301, glyph: 'az az-code' },
    { path: 'pricing.html', bytes: 6963, glyph: 'az az-code' },
    { path: 'robots.txt', bytes: 68, glyph: 'az az-file' },
    { path: 'assets/app.js', bytes: 31744, glyph: 'az az-code' },
    { path: 'assets/logo.svg', bytes: 2150, glyph: 'az az-image' },
    { path: 'assets/styles.css', bytes: 12698, glyph: 'az az-palette' },
    { path: 'images/hero.webp', bytes: 188928, glyph: 'az az-image' }
  ]

  const FILE_LIMIT = 100
  const folderName = 'acme-landing'

  const { formatNumber } = useLocale()

  const byteFormat = (value: number) =>
    formatNumber(value, {
      style: 'unit',
      unit: 'byte',
      unitDisplay: 'narrow'
    })
  const kilobyteFormat = (value: number) =>
    formatNumber(value, {
      style: 'unit',
      unit: 'kilobyte',
      unitDisplay: 'short',
      maximumFractionDigits: 1
    })
  const megabyteFormat = (value: number) =>
    formatNumber(value, {
      style: 'unit',
      unit: 'megabyte',
      unitDisplay: 'short',
      maximumFractionDigits: 1
    })
  const countFormat = (value: number) => formatNumber(value)

  function formatSize(bytes: number): string {
    if (bytes < 1024) return byteFormat(bytes)
    if (bytes < 1024 * 1024) return kilobyteFormat(bytes / 1024)
    return megabyteFormat(bytes / (1024 * 1024))
  }

  const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0)
  const folderSummary = `${folderName} · ${countFormat(files.length)} ${
    files.length === 1 ? 'file' : 'files'
  } · ${formatSize(totalBytes)}`
  const shownFiles = files.slice(0, FILE_LIMIT)
  const hiddenFileCount = files.length - shownFiles.length

  const rootOptions = files
    .filter((file) => !file.path.includes('/'))
    .map((file) => ({ label: file.path, value: file.path }))

  const detectedPreset = ''
  const projectName = ref('acme-landing')
  const preset = ref(detectedPreset)
  const root = ref('')

  const canDeploy = computed(
    () => Boolean(projectName.value.trim()) && (Boolean(preset.value) || Boolean(root.value))
  )

  const presetHelper = computed(() => {
    if (!preset.value)
      return 'Nothing here names a framework. Pick one to build the project, or leave it empty to serve the files as they are.'
    if (preset.value === detectedPreset)
      return 'Detected from your project. Change it if it is wrong.'
    return 'The project is built with this preset.'
  })

  const guard = useUnsavedChanges(() => ({
    projectName: projectName.value,
    preset: preset.value,
    root: root.value
  }))
  const discardDialog = guard.dialogProps
  const discardLabels = guard.labels

  const onLeave = () => guard.confirmLeave()

  const panelEl = ref<HTMLElement | null>(null)

  onMounted(() =>
    panelEl.value
      ?.querySelector<HTMLElement>(
        '[role="combobox"], input:not([type="hidden"]), textarea, select'
      )
      ?.focus()
  )

  const FILE_REGION_CLASS =
    'max-h-56 overflow-auto overscroll-contain border-t border-(--border-muted) ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)'
</script>

<template>
  <CreateDeployTemplate
    crumb="Upload a project"
    :template="sampleUploadedProject"
    @back="onLeave"
  >
    <div
      ref="panelEl"
      data-phase="form"
      class="flex w-full flex-col items-center gap-(--spacing-xl)"
    >
      <Card class="w-full">
        <template #default>
          <div class="flex flex-col gap-(--spacing-lg)">
            <div class="flex flex-col gap-(--spacing-2xs)">
              <h2 class="text-heading-xs text-(--text-default)">Deploy your project</h2>
              <p class="text-body-sm text-pretty text-(--text-muted)">
                These files deploy once. Connect a Git provider later to ship every push
                automatically.
              </p>
            </div>

            <div class="grid grid-cols-1 items-start gap-(--spacing-lg) sm:grid-cols-2">
              <Field required>
                <Field.Label>Project name</Field.Label>
                <Input
                  v-model="projectName"
                  size="large"
                  placeholder="my-project"
                />
              </Field>
              <Field>
                <Field.Label>Build preset</Field.Label>
                <Select
                  v-model="preset"
                  size="large"
                  placeholder="Select a preset"
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item
                      v-for="option in presets"
                      :key="String(option.value)"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Item>
                  </Select.Content>
                </Select>
                <Field.Description>{{ presetHelper }}</Field.Description>
              </Field>
            </div>

            <h3 class="text-heading-2xs text-(--text-default)">Project files</h3>
            <div class="flex w-full flex-col gap-(--spacing-lg)">
              <div
                class="overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)"
              >
                <div class="flex items-center gap-(--spacing-sm) p-(--spacing-sm)">
                  <span
                    class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface)"
                  >
                    <i
                      class="az az-folder-open text-body-md leading-none text-(--text-default)"
                      aria-hidden="true"
                    />
                  </span>
                  <span class="text-label-md text-(--text-default)">
                    {{ folderSummary }}
                  </span>
                </div>
                <div
                  role="region"
                  tabindex="0"
                  :aria-label="`Files in ${folderName}`"
                  :class="FILE_REGION_CLASS"
                >
                  <ul
                    class="list-none p-0"
                    :aria-label="`Files in ${folderName}`"
                  >
                    <li
                      v-for="file in shownFiles"
                      :key="file.path"
                      class="flex items-center gap-(--spacing-sm) px-(--spacing-sm) py-(--spacing-xs)"
                    >
                      <i
                        :class="file.glyph"
                        class="shrink-0 text-body-sm leading-none text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span
                        class="min-w-0 flex-1 truncate text-body-code-sm text-(--text-default)"
                        :title="file.path"
                      >
                        {{ file.path }}
                      </span>
                      <span class="shrink-0 tabular-nums text-body-xs text-(--text-muted)">
                        {{ formatSize(file.bytes) }}
                      </span>
                    </li>
                  </ul>
                  <p
                    v-if="hiddenFileCount > 0"
                    class="px-(--spacing-sm) py-(--spacing-xs) text-body-xs text-(--text-muted)"
                  >
                    and {{ countFormat(hiddenFileCount) }} more
                  </p>
                </div>
              </div>

              <Field
                v-if="!preset"
                required
              >
                <Field.Label>Root (/)</Field.Label>
                <Select
                  v-model="root"
                  size="large"
                  placeholder="Select a file"
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item
                      v-for="option in rootOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Item>
                  </Select.Content>
                </Select>
                <Field.Description>
                  No index.html was found, so pick the file served at your site's root.
                </Field.Description>
              </Field>
            </div>
          </div>
        </template>

        <template #footer>
          <Button
            class="w-full"
            label="Deploy"
            variant="primary"
            size="large"
            :disabled="!canDeploy"
          />
        </template>
      </Card>

      <Button
        label="Browse templates"
        variant="outline"
        size="medium"
      />
    </div>
  </CreateDeployTemplate>
  <ConfirmDialog
    v-bind="discardDialog"
    data-testid="unsaved-changes-dialog"
  >
    <template #actions>
      <Button
        :label="discardLabels.keepEditing"
        variant="ghost"
        size="medium"
        data-autofocus
        @click="guard.keepEditing"
      />
      <Button
        :label="discardLabels.discard"
        variant="danger"
        size="medium"
        @click="guard.discardAndLeave"
      />
    </template>
  </ConfirmDialog>
</template>
