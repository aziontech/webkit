<script setup>
  // WHERE the release goes: the Deployment settings it is published into.
  //
  // These are the settings authored in ./DeploymentSettingsDrawer.vue — the STRATEGY that
  // binds an application and, optionally, a firewall and a custom page. One store
  // (src/lib/deployment-strategies.js), so a setting created in that drawer is a target
  // here, and one deleted there is gone from here.
  //
  // A setting is REUSABLE: every workload that deploys with it is affected the moment a
  // release goes live. So this is not a "pick a destination" list. Each row states the two
  // things the operator needs to consent: what the setting BINDS, and how far it reaches.
  //
  // ROWS ARE CHECKBOXES, not links: publishing into three environments at once is the
  // normal case for a Workload bound to one Deployment setting per environment. They are
  // real ARIA checkboxes with Enter and Space, because a div that only answers to a
  // mouse is not a control.
  //
  // GROUPS carry the reason a row is what it is. Two of the three are selectable; the third
  // holds the INACTIVE settings, which no deployment can apply (the drawer's own rule). They
  // render as a stated blocker with the link to where that can be changed, never as a row
  // that silently does nothing. A setting pinned to a DIFFERENT application never renders at
  // all: it is not a target the operator can act on, and a permanently dead row teaches
  // nothing.
  import Button from '@aziontech/webkit/button'
  import InputText from '@aziontech/webkit/input-text'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  import { bindingsLine } from '../../lib/data/releases'

  const props = defineProps({
    // `[{ key, label, selectable, notice, action, items: [deploymentSettings] }]`
    groups: { type: Array, default: () => [] },
    // Ids currently selected.
    selected: { type: Array, default: () => [] },
    // How many rows exist before the search narrows them, for the field's placeholder.
    total: { type: Number, default: 0 },
    // The blast-radius lookup is still loading, so the Workloads line is not yet known.
    impactLoading: { type: Boolean, default: false },
    // Selection is inert while the release deploys.
    disabled: { type: Boolean, default: false }
  })

  const emit = defineEmits(['toggle', 'select-all', 'clear', 'group-action'])

  const search = defineModel('search', { type: String, default: '' })

  // How many environment tags a row shows before the rest collapse into one chip. Three
  // is what fits the row at its narrowest supported width.
  const ENV_LIMIT = 3

  const selectableCount = computed(() =>
    props.groups
      .filter((group) => group.selectable)
      .reduce((total, group) => total + group.items.length, 0)
  )

  const isSelected = (id) => props.selected.includes(id)

  const onKeydown = (event, id) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    emit('toggle', id)
  }

  const envNames = (settings) => settings.environmentNames
  const extraEnvs = (settings) => envNames(settings).slice(ENV_LIMIT)

  // How far this row reaches. A setting nobody deploys with yet reaches nothing, and says
  // so: the release is still created, it just serves nothing until a workload deploys with
  // it.
  const workloadsLine = (settings) => {
    const count = settings.workloadsCount
    if (!count) return 'No workloads deploy with it yet'
    return `${count} ${count === 1 ? 'workload' : 'workloads'} affected`
  }
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
    <!-- The explanation comes BEFORE the list it governs: selecting one row is not a
         local choice, and the reader needs to know that before they select. -->
    <p class="text-body-sm text-(--text-muted)">
      A Deployment setting binds an application, and optionally a firewall and a custom page.
      Selecting one deploys into every environment and workload that uses it.
    </p>

    <div class="flex flex-wrap items-center gap-(--spacing-sm)">
      <InputText
        v-model="search"
        size="large"
        :placeholder="`Search ${total} Deployment settings`"
        aria-label="Search Deployment settings"
        class="min-w-36 grow basis-(--container-2xs)"
      >
        <template #iconLeft>
          <i
            class="pi pi-search"
            aria-hidden="true"
          />
        </template>
      </InputText>

      <div class="flex shrink-0 items-center gap-(--spacing-xs)">
        <span class="text-body-sm text-(--text-muted)">{{ selected.length }} selected</span>
        <Button
          label="Select all"
          kind="text"
          size="small"
          :disabled="disabled || selected.length === selectableCount"
          @click="emit('select-all')"
        />
        <Button
          label="Clear"
          kind="text"
          size="small"
          :disabled="disabled || !selected.length"
          @click="emit('clear')"
        />
      </div>
    </div>

    <!-- Nothing survived the search. One sentence and the way back, never a bare
         "no results". -->
    <div
      v-if="!groups.length"
      class="flex min-w-0 flex-col items-start gap-(--spacing-xs) rounded-(--shape-elements) border border-(length:--border-width-default) border-dashed border-(--border-muted) p-(--spacing-md)"
    >
      <p class="text-body-sm text-(--text-muted)">No Deployment settings match this search.</p>
      <Button
        label="Clear search"
        kind="text"
        size="small"
        @click="search = ''"
      />
    </div>

    <!-- The list scrolls inside itself: the page already carries the topology and the
         impact tree, and a list that grows the page pushes both out of view. -->
    <div
      v-else
      class="flex max-h-(--container-2xs) min-w-0 flex-col gap-(--spacing-md) overflow-y-auto"
    >
      <section
        v-for="group in groups"
        :key="group.key"
        class="flex min-w-0 flex-col gap-(--spacing-xs)"
      >
        <p class="text-label-sm text-(--text-muted)">{{ group.label }}</p>

        <!-- SELECTABLE rows -->
        <template v-if="group.selectable">
          <div
            v-for="settings in group.items"
            :key="settings.id"
            role="checkbox"
            :tabindex="disabled ? -1 : 0"
            :aria-checked="isSelected(settings.id)"
            :aria-disabled="disabled || undefined"
            :data-selected="isSelected(settings.id) || null"
            class="flex min-w-0 cursor-pointer items-start justify-between gap-(--spacing-sm) rounded-(--shape-elements) border border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) p-(--spacing-sm) transition-colors duration-150 ease-out hover:border-(--border-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-selected:border-(--primary) data-selected:bg-(--bg-selected) motion-reduce:transition-none"
            @click="emit('toggle', settings.id)"
            @keydown="onKeydown($event, settings.id)"
          >
            <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                <i
                  class="ai ai-deploy-pillar shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="truncate text-label-md text-(--text-default)">
                  {{ settings.name }}
                </span>
              </span>

              <!-- What the setting binds. This is the release's own content, so it reads as
                   a sentence rather than three tags competing with the environments. -->
              <span class="truncate text-body-xs text-(--text-muted)">
                {{ bindingsLine(settings) }}
              </span>

              <span class="flex min-w-0 flex-wrap items-center gap-(--spacing-xxs)">
                <Tag
                  v-for="name in envNames(settings).slice(0, ENV_LIMIT)"
                  :key="name"
                  :label="name"
                  severity="secondary"
                  size="small"
                />
                <Tooltip
                  v-if="extraEnvs(settings).length"
                  :text="extraEnvs(settings).join(', ')"
                >
                  <Tag
                    :label="`+${extraEnvs(settings).length}`"
                    severity="secondary"
                    size="small"
                  />
                </Tooltip>
              </span>

              <!-- The blast radius of this row. It loads with the impact lookup, so it
                   reserves its line rather than appearing late and shifting the row. -->
              <Skeleton
                v-if="impactLoading"
                width="var(--size-32)"
                height="var(--size-4)"
              />
              <span
                v-else
                class="text-body-xs text-(--text-muted)"
              >
                {{ workloadsLine(settings) }}
              </span>
            </span>

            <!-- The platform's own setting is marked as such: it is the one row nobody in
                 this workspace authored. -->
            <Tag
              v-if="settings.system"
              label="Azion"
              severity="secondary"
              size="medium"
              class="shrink-0"
            />
          </div>
        </template>

        <!-- NON-SELECTABLE rows: the blocker is stated, and the action that clears it is
             right there. Dashed, so the row reads as an outline of a target rather than
             a target. -->
        <template v-else>
          <div
            v-for="settings in group.items"
            :key="settings.id"
            class="flex min-w-0 flex-col gap-(--spacing-xs) rounded-(--shape-elements) border border-(length:--border-width-default) border-dashed border-(--border-muted) p-(--spacing-sm)"
          >
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <i
                class="pi pi-exclamation-circle shrink-0 text-(--warning-contrast)"
                aria-hidden="true"
              />
              <span class="truncate text-label-md text-(--text-default)">
                {{ settings.name }}
              </span>
              <Tag
                label="Inactive"
                severity="secondary"
                size="small"
                class="shrink-0"
              />
            </span>
            <p class="text-body-sm text-(--text-muted)">{{ group.notice }}</p>
            <Button
              class="self-start"
              :label="group.action"
              kind="text"
              size="small"
              icon="pi pi-external-link"
              @click="emit('group-action', group.key, settings)"
            />
          </div>
        </template>
      </section>
    </div>
  </div>
</template>
