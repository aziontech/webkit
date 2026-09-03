<script setup>
  // ConsoleApplicationScene — the console's Application detail page, COMPOSED.
  //
  // The band beside it argues that one resource carries every second-level pattern the
  // console has. This is the evidence, and it is built the way this design system builds
  // everything else: out of the components the console itself renders. The tab bar is
  // `TabView` — the same component console PageTabs mounts. The list is the data-driven
  // `Table`, with its own toolbar row of `InputText` + `Button` above it. The create
  // surface is `Panel` + `PanelHeader` / `PanelContent` / `PanelFooter`, the shell a
  // `Drawer` teleports. The settings bands are `CardBox` over `Item.List`, their controls
  // `Switch` and `Tag`, their fields `FieldText`. Nothing here re-draws a control that the
  // library ships.
  //
  // WHY COMPOSED AND NOT DRAWN. The first version of this scene was a lookalike: hand-rolled
  // rows, borders, pills and toggles, ~300 lines of utilities imitating the console. It
  // read close from a distance and was wrong in every detail that matters — a "tab" with no
  // focus ring, a "switch" with the wrong knob travel, a "tag" one step off the tag scale —
  // and it would drift the day any of those components changed. Composing the real parts is
  // the same argument DESIGN.md makes for illustrations (§ Illustration system: built, not
  // drawn) and the one shared/ui/illustration/DeployExample.vue makes for reusing the
  // console's own DeploymentLogs rather than a marketing copy of it. This mock cannot look
  // out of date, because it is the library.
  //
  // Everything visual therefore comes from a component or a token: the frame is a bordered
  // `--bg-canvas` surface at `--shape-card`, and the only literals in the file are the
  // scene's own geometry — the content region's height and the drawer's width.
  //
  // IT IS A PICTURE, NOT A CONTROL. Real components bring real buttons, so the figure is
  // `inert` as well as `aria-hidden` and `pointer-events-none`: nothing inside it is
  // clickable, focusable, or reachable by assistive tech, and `inert` is what makes that
  // true of a `Table`'s sort buttons and a `TabView`'s tabs too. The list beside it is the
  // whole control surface; this is what that list is talking about.
  //
  // THE TWO MOVES, both from the animation catalogue, both `motion-reduce` aware:
  //
  //   1. THE TAB SWITCH IS A PAGE CHANGE, so it arrives like one — the same
  //      `animate-page-enter` the console replays on every tab switch (console
  //      lib/behavior/tab-enter.js), with `--page-enter-distance` cut to one spacing step
  //      because the mock's frame is a few hundred pixels wide, not a page. A `:key` on the
  //      content wrapper is what replays it: a fresh element restarts its own animation.
  //      The settings bands then settle in reading order with `animate-content-enter`,
  //      staggered a `fast-01` apart.
  //
  //   2. THEN THE SECOND MOVE, after SECOND_MOVE_MS: the list tabs open their create
  //      drawer (`animate-slide-in-right` over a `--bg-backdrop` scrim, which is what
  //      DrawerOverlay draws), and the two form tabs raise their commit bar
  //      (`animate-content-enter`, the bar that mounts on the first edit — console
  //      SettingsSaveBar, whose anatomy this reproduces: the sentence, then Discard, then
  //      Save). Which one a tab plays is data, not a branch here.
  //
  // Under `prefers-reduced-motion` the scene renders the SETTLED frame — drawer open, bar
  // up, no entrances — which is the composition, not a degraded version of it. The timer is
  // cleared on every tab change and on unmount, so nothing is left running.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CodeBlock from '@aziontech/webkit/code-block'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import FieldSelect from '@aziontech/webkit/field-select'
  import FieldSwitch from '@aziontech/webkit/field-switch'
  import FieldText from '@aziontech/webkit/field-text'
  import FieldTextarea from '@aziontech/webkit/field-textarea'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Label from '@aziontech/webkit/label'
  import Panel from '@aziontech/webkit/panel'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Switch from '@aziontech/webkit/switch'
  import TabView from '@aziontech/webkit/tab-view'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { computed, onBeforeUnmount, ref, watch } from 'vue'

  import { APPLICATION_TABS } from '../data/console-application.js'

  const props = defineProps({
    // Which tab the mock is showing — one of APPLICATION_TABS' `value`s.
    tab: { type: String, required: true }
  })

  // How long the content holds before the drawer slides in / the bar comes up. Must stay
  // comfortably under the band's own dwell (ConsoleApplicationBand.vue, STEP_MS) so every
  // tab gets to play its second move before the next one takes over.
  const SECOND_MOVE_MS = 900

  const prefersReducedMotion = () =>
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const step = computed(
    () => APPLICATION_TABS.find((entry) => entry.value === props.tab) ?? APPLICATION_TABS[0]
  )
  const index = computed(() => APPLICATION_TABS.indexOf(step.value))

  // The console's own breadcrumb, plus a step counter so the frame says which of the six it
  // is showing without the reader counting tabs.
  const counter = computed(() => `0${index.value + 1}/0${APPLICATION_TABS.length}`)

  // ── The table, as the data-driven Table takes it ───────────────────────────────
  // The data module holds each list as a header row and rows of cells, which is how a
  // reader diffs it against the console's own `columns`. Table wants records and column
  // definitions, so the two shapes are mapped here rather than duplicated there. The first
  // column is the `principal` one — the way in, which is what the console marks too.
  const columns = computed(() =>
    step.value.table?.columns.map((header, i) => ({
      accessorKey: `c${i}`,
      header,
      principal: i === 0
    }))
  )
  const rows = computed(() =>
    step.value.table?.rows.map((row) => Object.fromEntries(row.map((cell, i) => [`c${i}`, cell])))
  )

  // A state cell is a chip in BOTH of its readings — success when the thing is in play,
  // secondary when it is not, never bare text. The pair every console list shows.
  const POSITIVE = new Set(['Enabled', 'Active', 'Ready'])
  const severity = (value) => (POSITIVE.has(value) ? 'success' : 'secondary')

  // Has the second move played for the tab currently showing?
  const second = ref(false)
  let timer = null

  watch(
    () => props.tab,
    () => {
      clearTimeout(timer)
      timer = null
      if (prefersReducedMotion()) {
        second.value = true
        return
      }
      second.value = false
      timer = setTimeout(() => {
        second.value = true
      }, SECOND_MOVE_MS)
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    clearTimeout(timer)
    timer = null
  })

  // Per-band entrance delay, in token steps rather than hand-picked milliseconds.
  const bandDelay = (i) => ({
    '--content-enter-delay': `calc(var(--transition-duration-fast-01) * ${i + 1})`
  })
</script>

<template>
  <!-- `inert` is load-bearing: the parts inside are real controls, and this is a picture of
       a screen. It takes them out of the tab order and out of the accessibility tree in one
       attribute; `aria-hidden` and `pointer-events-none` state the same thing for older
       engines and for the pointer. -->
  <figure
    inert
    aria-hidden="true"
    class="pointer-events-none m-0 min-w-0 select-none self-start overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-canvas) shadow-(--shadow-sm)"
  >
    <!-- The page header's identity row: the breadcrumb that names the record, and the
         counter for which tab of the six is drawn. -->
    <div
      class="flex items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-xs)"
    >
      <span class="flex min-w-0 items-center gap-(--spacing-xxs) text-label-sm">
        <i class="ai ai-edge-application text-[length:inherit] leading-none text-(--primary)" />
        <span class="text-(--text-muted)">Applications</span>
        <span class="text-(--text-disabled)">/</span>
        <span class="truncate text-(--text-default)">webkit-sample-vue</span>
      </span>
      <span class="shrink-0 text-label-code-sm text-(--text-muted)">{{ counter }}</span>
    </div>

    <!-- Second-level navigation: TabView, the component console PageTabs mounts, so the
         marker, the type step and the scroll behaviour are the console's own. Controlled
         and never written to — inside an `inert` figure there is nothing to write it. -->
    <div class="border-b border-(--border-default) px-(--spacing-md)">
      <TabView :value="step.value">
        <TabView.List>
          <TabView.Item
            v-for="entry in APPLICATION_TABS"
            :key="entry.value"
            :value="entry.value"
            :label="entry.label"
          />
        </TabView.List>
      </TabView>
    </div>

    <!-- The content region. Fixed height so no tab's content moves the band, and the frame
         for everything absolutely positioned inside it (the drawer, its scrim, the bar). -->
    <div class="relative h-[36rem] overflow-hidden">
      <!-- Keyed on the tab: a fresh element replays the page entrance, which is exactly
           what the console does when a tab is picked. -->
      <div
        :key="step.value"
        class="flex h-full flex-col gap-(--spacing-lg) p-(--spacing-md) animate-page-enter [--page-enter-distance:var(--spacing-lg)] motion-reduce:animate-none"
      >
        <!-- The tab's OWN page heading, and its primary action beside it — `outlined`,
             which is where every second-level list in the console puts it. -->
        <div class="flex min-w-0 items-center justify-between gap-(--spacing-sm)">
          <span class="truncate text-heading-xs text-(--text-default)">{{ step.heading }}</span>
          <Button
            v-if="step.action"
            :label="step.action"
            kind="outlined"
            size="medium"
            icon="pi pi-plus"
            class="shrink-0"
          />
        </div>

        <!-- ── A LIST TAB: the controls row, then the table ────────────────────── -->
        <template v-if="step.table">
          <!-- The row every list in the console opens with: narrowing on the left, the
               listing's own controls on the right, above the card. -->
          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
            <InputText
              size="medium"
              placeholder="Search"
              class="min-w-36 grow basis-(--container-2xs)"
            >
              <template #iconLeft>
                <i class="pi pi-search" />
              </template>
            </InputText>
            <Button
              label="Filter"
              kind="outlined"
              size="medium"
              icon="pi pi-filter"
              class="shrink-0"
            />
          </div>

          <Table
            :data="rows"
            :columns="columns"
            enable-sorting
            :border="false"
            header-kind="compact"
            max-height="17rem"
          >
            <!-- Rules Engine rows carry the reorder grip: that list's substance is the
                 order its rules run in, so the principal cell leads with the handle. -->
            <template #cell-c0="{ value }">
              <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                <i
                  v-if="step.table.handle"
                  class="pi pi-bars shrink-0 text-[length:inherit] leading-none text-(--text-disabled)"
                />
                <span class="truncate">{{ value }}</span>
              </span>
            </template>

            <!-- The last column of three of these lists is a STATE, so it is a chip in
                 both readings; on the fourth it is a date and renders as itself. -->
            <template #cell-c4="{ value }">
              <Tag
                v-if="step.table.tagColumn === 4"
                :label="value"
                :severity="severity(value)"
                size="medium"
              />
              <span
                v-else
                class="truncate"
                >{{ value }}</span
              >
            </template>
          </Table>
        </template>

        <!-- ── A FORM TAB: the stacked bands the settings pages are made of ────────
             `CardBox` over an `Item.List`, flush so the rows keep their full-width
             dividers — the shape every settings band in the console takes. -->
        <!-- `flex-1 min-h-0 overflow-hidden`: the bands clip at the column's floor rather
             than pushing the commit bar out of the frame. A console page scrolls here; the
             picture of it ends, which is the honest way for a fixed frame to say so. -->
        <div
          v-else
          class="flex min-w-0 flex-1 flex-col gap-(--spacing-sm) overflow-hidden"
        >
          <CardBox
            v-for="(band, i) in step.form"
            :key="band.title"
            :title="band.title"
            :padded="false"
            :style="bandDelay(i)"
            class="animate-content-enter motion-reduce:animate-none"
          >
            <template #content>
              <Item.List>
                <Item
                  v-for="row in band.rows"
                  :key="row.label"
                  size="small"
                >
                  <Item.Content>
                    <Item.Title>{{ row.label }}</Item.Title>
                  </Item.Content>
                  <Item.Actions>
                    <!-- A value the page reports, a state it reports, or a module you
                         switch — the three row endings a settings band has. -->
                    <span
                      v-if="row.value"
                      class="truncate text-body-sm text-(--text-muted)"
                      >{{ row.value }}</span
                    >
                    <Tag
                      v-else-if="row.tag"
                      :label="row.tag"
                      :severity="severity(row.tag)"
                      size="medium"
                    />
                    <Switch
                      v-else
                      :model-value="row.on"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>
            </template>
          </CardBox>
        </div>

        <!-- The commit bar: a raised card standing on the page's floor, naming what is
             pending before it offers to save it. IN FLOW (`mt-auto`), not absolute: the
             console's bar is sticky over a page that scrolls, and a still frame cannot
             scroll — parked over the content it would hide a band's only row and read as a
             bug. On the floor it is the same picture and can cover nothing. -->
        <div
          v-if="second && step.second.kind === 'save-bar'"
          class="mt-auto flex justify-center animate-content-enter motion-reduce:animate-none"
        >
          <CardBox class="max-w-full shadow-(--shadow-lg)">
            <template #content>
              <div class="flex min-w-0 items-center gap-(--spacing-lg)">
                <p class="m-0 flex min-w-0 items-start gap-(--spacing-xs) text-body-sm">
                  <i
                    class="pi pi-info-circle shrink-0 text-[length:inherit] leading-none text-(--text-muted)"
                  />
                  <span class="min-w-0 text-(--text-default)">
                    {{ step.second.label }}
                    <span class="text-(--text-muted)">{{ step.second.hint }}</span>
                  </span>
                </p>
                <div class="flex shrink-0 items-center gap-(--spacing-sm)">
                  <Button
                    label="Discard"
                    kind="outlined"
                    size="medium"
                  />
                  <Button
                    label="Save"
                    kind="primary"
                    size="medium"
                  />
                </div>
              </div>
            </template>
          </CardBox>
        </div>
      </div>

      <!-- ── THE SECOND MOVE, for a list tab ─────────────────────────────────────
           The create drawer its button opens, over a dimmed page. The two form tabs' half
           of this beat is the commit bar above, which is in flow rather than over the page. -->
      <template v-if="second && step.second.kind === 'drawer'">
        <!-- `z-30`, not `auto`: the parts under this overlay carry their own stacking —
               Button paints at `z-1` for its ghost layers and Table's head cells go to
               `z-20` for the sticky header — so an overlay at `auto` renders UNDER the page
               it covers. Both showed through the drawer before this. -->
        <div
          class="absolute inset-0 z-30 bg-(--bg-backdrop) animate-fade-in motion-reduce:animate-none"
        />
        <!-- `Panel` is the shell a Drawer teleports; here it is the shell itself, pinned
               to the frame's end edge. `--shape-flat` because it stands on three of the
               frame's own edges — a card radius would round a corner the frame already
               draws. -->
        <Panel
          size="small"
          class="absolute inset-y-0 right-0 z-30 w-[62%] rounded-(--shape-flat) animate-slide-in-right motion-reduce:animate-none"
        >
          <PanelHeader>
            <span class="min-w-0 truncate text-heading-xs text-(--text-default)">{{
              step.second.title
            }}</span>
            <IconButton
              icon="pi pi-times"
              aria-label="Close"
              kind="text"
              size="small"
              class="ml-auto shrink-0"
            />
          </PanelHeader>

          <!-- THE FORM IS THE REAL FORM. Every section is a `Section` of the console's own
               drawer, and every field renders the CONTROL that drawer renders — which is the
               whole point of being high fidelity here. A rule is not four text inputs: it is
               a name and a description, a phase picked from two blocks, a criteria row of
               variable / operator / argument, a behavior, and a status switch. A functions
               instance is a name, a function chosen from a list, and its arguments in a code
               editor. The field's `kind` (see the data module) picks the component, and
               `columns` is the one thing about layout the data carries — for the two sections
               that are a row rather than a stack. -->
          <PanelContent>
            <div class="flex flex-col gap-(--spacing-xl)">
              <section
                v-for="section in step.second.sections"
                :key="section.title"
                class="flex flex-col gap-(--spacing-sm)"
              >
                <span class="text-label-md text-(--text-default)">{{ section.title }}</span>
                <div
                  :data-columns="section.columns ?? 1"
                  class="grid items-end gap-(--spacing-sm) data-[columns=2]:grid-cols-2 data-[columns=3]:grid-cols-3"
                >
                  <template
                    v-for="field in section.fields"
                    :key="field.label"
                  >
                    <FieldText
                      v-if="field.kind === 'text'"
                      :label="field.label"
                      :model-value="field.value"
                      size="medium"
                      readonly
                    />
                    <FieldTextarea
                      v-else-if="field.kind === 'textarea'"
                      :label="field.label"
                      :model-value="field.value"
                      readonly
                    />
                    <!-- One option, and it is the selected one: a picture of a select shows what
                         it holds, and the list it would open is not in frame. -->
                    <FieldSelect
                      v-else-if="field.kind === 'select'"
                      :label="field.label"
                      :model-value="field.value"
                      :options="[{ value: field.value, label: field.value }]"
                      size="medium"
                      readonly
                    />
                    <FieldSwitch
                      v-else-if="field.kind === 'switch'"
                      :label="field.label"
                      :model-value="field.on"
                    />
                    <FieldRadioBlock
                      v-else-if="field.kind === 'radio'"
                      name="mock-phase"
                      :label="field.label"
                      :value="field.label"
                      :model-value="field.on ? field.label : ''"
                    />
                    <!-- The real drawer puts Monaco under a `Label` rather than inside a
                           FieldStack (a code editor is not a labelable control), so the
                           label is a Label and the editor is the design system's code
                           surface. -->
                    <div
                      v-else
                      class="flex min-w-0 flex-col gap-(--spacing-xxs)"
                    >
                      <Label>{{ field.label }}</Label>
                      <CodeBlock
                        :tabs="[
                          {
                            label: field.label,
                            value: field.label,
                            code: field.value,
                            language: 'json'
                          }
                        ]"
                      />
                    </div>
                  </template>
                </div>
              </section>
            </div>
          </PanelContent>

          <!-- The drawer's own scoped save — the one filled button on the screen. -->
          <PanelFooter>
            <Button
              :label="step.second.action"
              kind="primary"
              size="medium"
            />
          </PanelFooter>
        </Panel>
      </template>
    </div>
  </figure>
</template>
