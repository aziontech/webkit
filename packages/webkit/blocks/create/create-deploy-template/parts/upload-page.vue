<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import { computed, onMounted, ref } from 'vue'

  import CreateDeployTemplate from '../create-deploy-template.vue'
  import { sampleUploadedProject } from '../sample'
  import BuildPresetField from './build-preset-field.vue'
  import DeployHeading from './deploy-heading.vue'
  import DiscardDialog from './discard-dialog.vue'

  interface ProjectFile {
    path: string
    bytes: number
    glyph: string
  }

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

  const { formatNumber, formatFileSize } = useLocale()

  const countFormat = (value: number) => formatNumber(value)

  const formatSize = (bytes: number): string => formatFileSize(bytes)

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

  const guard = useUnsavedChanges(() => ({
    projectName: projectName.value,
    preset: preset.value,
    root: root.value
  }))

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
            <DeployHeading once />

            <div class="grid grid-cols-1 items-start gap-(--spacing-lg) sm:grid-cols-2">
              <Field required>
                <Field.Label>Project name</Field.Label>
                <Input
                  v-model="projectName"
                  size="large"
                  placeholder="my-project"
                />
              </Field>
              <BuildPresetField
                v-model="preset"
                :detected-preset="detectedPreset"
              />
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
  <DiscardDialog
    :guard="guard"
    data-testid="unsaved-changes-dialog"
  />
</template>
