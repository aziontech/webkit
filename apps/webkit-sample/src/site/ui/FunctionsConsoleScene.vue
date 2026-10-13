<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Stepper from '@aziontech/webkit/stepper'
  import Switch from '@aziontech/webkit/switch'
  import ToastDescription from '@aziontech/webkit/toast-description'
  import ToastItem from '@aziontech/webkit/toast-item'
  import ToastTitle from '@aziontech/webkit/toast-title'
  import { minWidthQuery } from '@shared/lib/breakpoints.js'
  import { computed, onMounted, onScopeDispose, ref } from 'vue'

  import { typeInto, useSceneScript } from '../composables/use-scene-script'
  import {
    CONSOLE_APPLICATIONS,
    CONSOLE_CODE,
    CONSOLE_ENVIRONMENTS,
    CONSOLE_HIDDEN_APPLICATIONS,
    CONSOLE_STEPS,
    FUNCTION_APPLICATION,
    FUNCTION_NAME
  } from '../data/functions-start.js'

  const DESKTOP_WIDTH = 860
  const MOBILE_WIDTH = 390

  interface Props {
    /** Whether this scene is the one showing; a scene that shares a frame plays only while it is. */
    active?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true })

  const root = ref<HTMLElement | null>(null)
  const frame = ref({ width: DESKTOP_WIDTH, height: 600, scale: 1 })

  let observer: globalThis.ResizeObserver | null = null

  const measure = () => {
    const box = root.value?.getBoundingClientRect()
    if (!box?.width) return
    const mobile = !(minWidthQuery('md')?.matches ?? true)
    const width = mobile ? MOBILE_WIDTH : DESKTOP_WIDTH
    const scale = box.width / width
    frame.value = { width, height: box.height / scale, scale }
  }

  onMounted(() => {
    observer = new globalThis.ResizeObserver(measure)
    if (root.value) observer.observe(root.value)
    measure()
  })

  onScopeDispose(() => observer?.disconnect())

  const frameStyle = computed(() => ({
    width: `${frame.value.width}px`,
    height: `${frame.value.height}px`,
    transform: `scale(${frame.value.scale})`
  }))

  const current = ref('where-it-runs')
  const selected = ref('')
  const code = ref('')
  const name = ref('')
  const saving = ref(false)
  const created = ref(false)
  const pressed = ref('')

  const index = computed(() => CONSOLE_STEPS.findIndex((step) => step.value === current.value))
  const step = computed(() => CONSOLE_STEPS[index.value])
  const isFirst = computed(() => index.value === 0)
  const isLast = computed(() => index.value === CONSOLE_STEPS.length - 1)

  const steps = computed(() =>
    CONSOLE_STEPS.map((entry, position) => ({
      ...entry,
      state:
        saving.value && position === CONSOLE_STEPS.length - 1
          ? 'loading'
          : position < index.value || created.value
            ? 'complete'
            : 'upcoming',
      disabled: position > index.value
    }))
  )

  const breadcrumb = [{ label: 'Functions', href: '#' }, { label: 'Create Function' }]

  const press = async (wait: (ms: number) => Promise<void>, target: string) => {
    pressed.value = target
    await wait(260)
    pressed.value = ''
  }

  useSceneScript(root, {
    active: () => props.active,
    hold: 3600,
    reset: () => {
      current.value = 'where-it-runs'
      selected.value = ''
      code.value = ''
      name.value = ''
      saving.value = false
      created.value = false
      pressed.value = ''
    },
    settle: () => {
      current.value = 'settings'
      selected.value = FUNCTION_APPLICATION
      code.value = CONSOLE_CODE
      name.value = FUNCTION_NAME
      saving.value = false
      created.value = true
    },
    play: async (wait) => {
      await wait(900)
      selected.value = FUNCTION_APPLICATION
      await wait(700)
      current.value = 'code'
      await wait(700)
      await typeInto(wait, CONSOLE_CODE, (text) => (code.value = text), { step: 3, every: 26 })
      await wait(900)
      await press(wait, 'next')
      current.value = 'settings'
      await wait(800)
      await typeInto(wait, FUNCTION_NAME, (text) => (name.value = text), { step: 1, every: 60 })
      await wait(800)
      await press(wait, 'next')
      saving.value = true
      await wait(1000)
      saving.value = false
      created.value = true
    }
  })

  const KEYWORDS = new Set([
    'export',
    'default',
    'async',
    'await',
    'const',
    'let',
    'return',
    'if',
    'new',
    'function'
  ])
  const TOKEN =
    /(\/\/.*$)|('[^']*'?|`[^`]*`?)|(\b\d+\b)|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)|([{}()[\].,;:?!=<>+\-*/|&]+)|(\s+)/gm

  const tokenize = (line: string) => {
    const tokens: { text: string; kind: string }[] = []
    for (const match of line.matchAll(TOKEN)) {
      const [text, comment, string, number, call, word, punctuation] = match
      const kind = comment
        ? 'comment'
        : string
          ? 'string'
          : number
            ? 'number'
            : call
              ? KEYWORDS.has(call)
                ? 'keyword'
                : 'function'
              : word
                ? KEYWORDS.has(word)
                  ? 'keyword'
                  : 'identifier'
                : punctuation
                  ? 'punctuation'
                  : 'space'
      tokens.push({ text, kind })
    }
    return tokens
  }

  const lines = computed(() => {
    const rows = code.value.split('\n')
    return rows.map((row, position) => ({
      number: String(position + 1).padStart(2, '0'),
      tokens: tokenize(row),
      caret:
        current.value === 'code' &&
        position === rows.length - 1 &&
        code.value.length < CONSOLE_CODE.length
    }))
  })
</script>

<template>
  <figure
    ref="root"
    inert
    aria-hidden="true"
    class="pointer-events-none relative m-0 h-full min-w-0 overflow-hidden bg-(--bg-canvas) select-none"
  >
    <div
      class="absolute top-0 left-0 flex origin-top-left flex-col bg-(--bg-canvas)"
      :style="frameStyle"
    >
      <GlobalHeader aria-label="Azion Console">
        <GlobalHeader.Left>
          <IconButton
            icon="pi pi-chevron-left"
            aria-label="Back to Functions"
            kind="outlined"
            size="small"
          />
          <GlobalHeader.Brand>
            <span class="inline-flex shrink-0 items-center self-center">
              <Brand
                kind="default"
                size="small"
              />
            </span>
          </GlobalHeader.Brand>
          <Breadcrumb :items="breadcrumb" />
        </GlobalHeader.Left>
        <GlobalHeader.Middle />
        <GlobalHeader.Right>
          <Avatar
            label="myemail@azion.com"
            size="medium"
            kind="square"
          />
        </GlobalHeader.Right>
      </GlobalHeader>

      <div class="flex min-h-0 flex-1">
        <aside
          class="hidden h-full w-64 shrink-0 overflow-hidden border-r border-(--border-default) px-(--spacing-md) py-(--layout-section-gap) md:block"
        >
          <Stepper
            :model-value="current"
            aria-label="Create Function"
            class="h-full"
          >
            <Stepper.Step
              v-for="entry in steps"
              :key="entry.value"
              :value="entry.value"
              :title="entry.title"
              :description="entry.value === current && !created ? entry.description : ''"
              :state="entry.state"
              :disabled="entry.disabled"
            />
          </Stepper>
        </aside>

        <div class="flex min-w-0 flex-1 flex-col">
          <main
            :key="current"
            :data-bleed="current === 'code' || null"
            class="animate-page-enter min-h-0 flex-1 overflow-hidden [--page-enter-distance:calc(var(--layout-boundary-inline)*-1)] data-bleed:flex data-bleed:flex-col motion-reduce:animate-none"
          >
            <div
              v-if="current === 'code'"
              class="flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              <div
                class="flex shrink-0 flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
              >
                <SegmentedButton
                  model-value="code"
                  :options="[
                    { label: 'Code', value: 'code' },
                    { label: 'Arguments', value: 'arguments' }
                  ]"
                  aria-label="Editor document"
                />
                <p class="min-w-0 truncate text-body-xs text-(--text-muted)">
                  JavaScript, running on request
                </p>
              </div>

              <div
                class="relative min-h-0 flex-1 overflow-hidden bg-[linear-gradient(to_right,var(--bg-canvas)_3.875rem,var(--bg-surface)_3.875rem)] py-(--spacing-xs) text-label-code-sm"
              >
                <div
                  v-for="(line, position) in lines"
                  :key="position"
                  :data-active="position === 0 || null"
                  class="flex h-[1.125rem] items-center border-y border-transparent data-active:border-(--border-default) data-active:bg-(--bg-hover)"
                >
                  <span
                    :data-active="position === 0 || null"
                    class="w-[3.875rem] shrink-0 ps-(--spacing-md) text-(--code-sintax-line-number) data-active:text-(--text-default)"
                    >{{ line.number }}</span
                  >
                  <span class="whitespace-pre"
                    ><span
                      v-for="(token, at) in line.tokens"
                      :key="at"
                      :data-token="token.kind"
                      class="text-(--code-sintax-identifier) data-[token=comment]:text-(--text-muted) data-[token=comment]:italic data-[token=function]:text-(--code-sintax-function) data-[token=keyword]:text-(--code-sintax-keyword) data-[token=number]:text-(--code-sintax-type) data-[token=punctuation]:text-(--code-sintax-punctuation) data-[token=string]:text-(--code-sintax-string)"
                      >{{ token.text }}</span
                    ><span
                      v-if="line.caret"
                      class="inline-block h-[1.1em] w-px translate-y-[0.2em] bg-(--text-default)"
                  /></span>
                </div>
              </div>
            </div>

            <div
              v-else
              class="layout-form-create layout-boundary-inline flex flex-1 flex-col pt-(--layout-section-gap) pb-(--layout-section-gap)"
            >
              <p class="pb-(--spacing-sm) text-label-sm text-(--text-muted) md:hidden">
                Step {{ index + 1 }} of {{ CONSOLE_STEPS.length }}
              </p>

              <section
                v-if="current === 'where-it-runs'"
                class="mx-auto flex w-full max-w-(--container-md) flex-col items-center gap-(--spacing-lg)"
              >
                <header class="flex flex-col items-center gap-(--spacing-xs) text-center">
                  <span
                    class="flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                  >
                    <i
                      class="ai ai-edge-functions text-body-lg leading-none text-(--text-default)"
                      aria-hidden="true"
                    />
                  </span>
                  <h1 class="text-heading-xs text-(--text-default)">Create Function</h1>
                  <p class="text-body-sm text-(--text-muted)">Choose an application to continue</p>
                </header>

                <SegmentedButton
                  model-value="application"
                  :options="[
                    { label: 'Application', value: 'application' },
                    { label: 'Firewall', value: 'firewall' }
                  ]"
                  aria-label="Where the function is used"
                  size="medium"
                  fluid
                />

                <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                  <InputText
                    model-value=""
                    size="large"
                    class="w-full"
                    placeholder="Find application…"
                    aria-label="Find application"
                  />
                  <div class="flex flex-col">
                    <div
                      v-for="option in CONSOLE_APPLICATIONS"
                      :key="option"
                      :data-selected="selected === option || null"
                      class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left transition-colors duration-fast-02 ease-productive-entrance data-selected:bg-(--bg-selected) motion-reduce:transition-none"
                    >
                      <i
                        class="ai ai-edge-application shrink-0 text-body-md leading-none text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="min-w-0 flex-1 truncate text-body-md text-(--text-default)">
                        {{ option }}
                      </span>
                      <i
                        v-if="selected === option"
                        class="pi pi-check shrink-0 text-body-sm leading-none text-(--text-default)"
                        aria-hidden="true"
                      />
                    </div>
                    <p class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)">
                      {{ CONSOLE_HIDDEN_APPLICATIONS }} more — type to narrow.
                    </p>
                    <div
                      class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs)"
                    >
                      <i
                        class="pi pi-plus shrink-0 text-body-sm leading-none text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="min-w-0 flex-1 truncate text-body-md text-(--text-default)">
                        Create Application
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  label="Continue without an application"
                  kind="text"
                  size="small"
                />
              </section>

              <template v-else>
                <header class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                  <h1 class="text-balance text-heading-sm text-(--text-default)">
                    {{ step.title }}
                  </h1>
                  <p class="text-pretty text-body-sm text-(--text-muted)">{{ step.description }}</p>
                </header>

                <div class="mt-(--layout-section-gap)">
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <Item
                          size="small"
                          class="items-start"
                        >
                          <Item.Content>
                            <Item.Title>Name</Item.Title>
                            <Item.Description>
                              Give a unique and descriptive name to identify the function.
                            </Item.Description>
                          </Item.Content>
                          <Item.Actions class="max-w-(--container-3xs) flex-1 justify-end">
                            <InputText
                              :model-value="name"
                              size="large"
                              class="w-full"
                              aria-label="Name"
                              placeholder="my-function"
                            />
                          </Item.Actions>
                        </Item>
                        <Item
                          size="small"
                          class="items-start"
                        >
                          <Item.Content>
                            <Item.Title>Runtime</Item.Title>
                            <Item.Description>
                              The runtime isn't editable after the function is created.
                            </Item.Description>
                          </Item.Content>
                          <Item.Actions class="max-w-(--container-3xs) flex-1 justify-end">
                            <InputText
                              model-value="JavaScript"
                              size="large"
                              class="w-full"
                              aria-label="Runtime"
                              readonly
                            />
                          </Item.Actions>
                        </Item>
                        <Item
                          size="small"
                          class="flex-col items-stretch gap-(--spacing-sm)"
                        >
                          <Item.Content>
                            <Item.Title>Execution environment</Item.Title>
                            <Item.Description>
                              Set by the application it runs on, {{ FUNCTION_APPLICATION }}.
                            </Item.Description>
                          </Item.Content>
                          <Item.Actions class="w-full justify-start">
                            <div class="flex w-full flex-col gap-(--spacing-sm)">
                              <FieldRadioBlock
                                v-for="option in CONSOLE_ENVIRONMENTS"
                                :key="option.value"
                                model-value="application"
                                :value="option.value"
                                name="scene-function-execution-environment"
                                :label="option.label"
                                :description="option.description"
                              />
                            </div>
                          </Item.Actions>
                        </Item>
                        <Item
                          size="small"
                          class="items-start"
                        >
                          <Item.Content>
                            <Item.Title>Active</Item.Title>
                            <Item.Description>
                              An inactive function keeps its code and stops running.
                            </Item.Description>
                          </Item.Content>
                          <Item.Actions class="justify-end">
                            <Switch
                              :model-value="true"
                              aria-label="Active"
                            />
                          </Item.Actions>
                        </Item>
                      </Item.List>
                    </template>
                  </CardBox>
                </div>
              </template>
            </div>
          </main>

          <footer class="shrink-0 border-t border-(--border-default) bg-(--bg-surface)">
            <div
              class="layout-form-create layout-boundary-inline flex items-center justify-between gap-(--spacing-sm) py-(--spacing-md)"
            >
              <Button
                label="Cancel"
                kind="text"
                size="medium"
              />
              <div class="flex shrink-0 items-center gap-(--spacing-sm)">
                <Button
                  v-if="!isFirst"
                  label="Back"
                  kind="outlined"
                  size="medium"
                />
                <Button
                  :label="isLast ? 'Create function' : 'Next'"
                  kind="primary"
                  size="medium"
                  :loading="saving"
                  :data-pressed="pressed === 'next' || null"
                  class="data-pressed:ring-2 data-pressed:ring-(--ring-color) data-pressed:ring-offset-2 data-pressed:ring-offset-(--bg-surface)"
                />
              </div>
            </div>
          </footer>
        </div>
      </div>

      <div
        v-if="created"
        class="absolute right-(--spacing-md) bottom-18 z-10 w-[22rem] max-w-[calc(100%-2*var(--spacing-md))] animate-fade-in motion-reduce:animate-none"
      >
        <ToastItem type="success">
          <ToastTitle>{{ FUNCTION_NAME }} created.</ToastTitle>
          <ToastDescription
            >Save the rule to run it on {{ FUNCTION_APPLICATION }}.</ToastDescription
          >
        </ToastItem>
      </div>
    </div>
  </figure>
</template>
