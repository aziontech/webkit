<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import { computed, ref } from 'vue'

  interface ProjectFile {
    path: string
    size: string
    glyph: string
  }

  const breadcrumb = [{ label: 'Upload a project' }, { label: 'acme-landing', current: true }]

  const presets: SelectOptionItem[] = [
    { label: 'Nuxt', value: 'nuxt' },
    { label: 'Next.js', value: 'next' },
    { label: 'Vite', value: 'vite' },
    { label: 'Astro', value: 'astro' },
    { label: 'Static files', value: 'static' }
  ]

  const files: ProjectFile[] = [
    { path: 'about.html', size: '4.2 KB', glyph: 'pi pi-code' },
    { path: 'pricing.html', size: '6.8 KB', glyph: 'pi pi-code' },
    { path: 'robots.txt', size: '68 B', glyph: 'pi pi-file' },
    { path: 'assets/app.js', size: '31.0 KB', glyph: 'pi pi-code' },
    { path: 'assets/logo.svg', size: '2.1 KB', glyph: 'pi pi-image' },
    { path: 'assets/styles.css', size: '12.4 KB', glyph: 'pi pi-palette' },
    { path: 'images/hero.webp', size: '184.5 KB', glyph: 'pi pi-image' }
  ]

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
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Left>
        <IconButton
          icon="pi pi-chevron-left"
          aria-label="Back to Creation Center"
          kind="outlined"
          size="small"
        />
        <GlobalHeader.Brand>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
          >
            <Brand
              kind="default"
              size="small"
            />
          </a>
        </GlobalHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            kind="square"
          />
        </button>
      </GlobalHeader.Right>
    </GlobalHeader>

    <main
      class="animate-page-enter motion-reduce:animate-none relative min-w-0 flex-1 overflow-auto"
    >
      <div
        class="layout-column-focused relative flex min-h-full flex-col items-center gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-xxl)"
      >
        <div
          class="flex w-full items-start gap-(--spacing-md) overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
        >
          <span
            class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
          >
            <i
              class="pi pi-folder text-body-lg leading-none text-(--text-default)"
              aria-hidden="true"
            />
          </span>

          <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-md)">
            <div class="flex w-full min-w-0 flex-col overflow-hidden">
              <span class="flex items-center gap-(--spacing-xs)">
                <span class="truncate text-heading-xxs text-(--text-default)">acme-landing</span>
              </span>
              <span class="text-body-xs text-(--text-muted)">
                Deploy this project straight from your machine.
              </span>
            </div>
          </div>
        </div>

        <div
          data-phase="form"
          class="flex w-full flex-col items-center gap-(--spacing-xl)"
        >
          <Card class="w-full">
            <template #content>
              <div class="flex flex-col gap-(--spacing-lg)">
                <div class="flex flex-col gap-(--spacing-xxs)">
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
                        <Select.Option
                          v-for="option in presets"
                          :key="String(option.value)"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Option>
                      </Select.Content>
                    </Select>
                    <Field.Description>{{ presetHelper }}</Field.Description>
                  </Field>
                </div>

                <h3 class="text-heading-xxs text-(--text-default)">Project files</h3>
                <div class="flex w-full flex-col gap-(--spacing-lg)">
                  <div
                    class="overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)"
                  >
                    <div class="flex items-center gap-(--spacing-sm) p-(--spacing-sm)">
                      <span
                        class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)"
                      >
                        <i
                          class="pi pi-folder-open text-body-md leading-none text-(--text-default)"
                          aria-hidden="true"
                        />
                      </span>
                      <span class="text-label-md text-(--text-default)">
                        acme-landing · 7 files · 241 KB
                      </span>
                    </div>
                    <ul
                      class="max-h-56 list-none overflow-auto overscroll-contain border-t border-(--border-muted) p-0"
                      aria-label="Files in acme-landing"
                    >
                      <li
                        v-for="file in files"
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
                          {{ file.size }}
                        </span>
                      </li>
                    </ul>
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
                        <Select.Option
                          v-for="option in rootOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Option>
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
                kind="primary"
                size="large"
                :disabled="!canDeploy"
              />
            </template>
          </Card>

          <Button
            label="Browse templates"
            kind="outlined"
            size="medium"
          />
        </div>
      </div>
    </main>
  </div>
</template>
