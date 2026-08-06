<script setup>
  // The dependencies of one composed resource — the Functions, Connectors, Network
  // Lists and WAF rules that an Application, a Firewall or a Custom Page references.
  //
  // They are DETECTED, not asked: the operator chose an Application version, and these
  // came with it. That is what makes a detected row locked — the resource is a fact of
  // that version, so only its VERSION is a choice. The one exception is the "Include
  // dependencies" block, where the operator adds what a Function reaches at runtime and
  // no detector can see; those rows are theirs, so they can be removed.
  //
  // ONE GROUP PER TYPE, as an Accordion: a release with two Functions and three
  // Connectors is six version decisions, and a flat list of six buries which parent
  // each belongs to. The group header states the count while collapsed, so a reader who
  // never opens it still knows what the release carries (a collapsed row that hides its
  // own value is a trap, not a simplification).
  //
  // SHARED dependencies (a Connector referenced by both the Application and a Custom
  // Page) carry ONE version across the whole release: two versions of one Connector in
  // one release is not a thing the platform can serve. The row states that it is shared;
  // the reason it matters is said once, above the rows, rather than repeated per row.
  import Accordion from '@aziontech/webkit/accordion'
  import Badge from '@aziontech/webkit/badge'
  import Button from '@aziontech/webkit/button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import Message from '@aziontech/webkit/message'
  import Spinner from '@aziontech/webkit/spinner'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref, watch } from 'vue'

  import {
    resourceIcon,
    resourceLabel,
    resourceName,
    resourceNoun,
    resourceNounPlural
  } from '../../lib/releases'
  import ResourceVersionField from './ResourceVersionField.vue'

  const props = defineProps({
    // One entry per dependency type this parent can own:
    // `{ type, rows: [{ resourceId, versionId, locked, sharedWith: [] }], addOptions: [] }`
    groups: { type: Array, default: () => [] },
    // Detection is in flight for the parent resource.
    detecting: { type: Boolean, default: false },
    // What is being detected, named. Falls back to the generic sentence.
    detectingLabel: { type: String, default: 'Detecting dependencies…' },
    // Whether rows can be added and removed by hand (the Include dependencies block).
    allowAdd: { type: Boolean, default: false },
    // The whole block is inert while the release deploys.
    disabled: { type: Boolean, default: false }
  })

  const emit = defineEmits(['update-version', 'set-resource', 'add', 'remove', 'build'])

  // Which groups are open. DETECTED dependencies start CLOSED: they are what the platform
  // resolved from the version the operator chose, and a release with three parents holding a
  // dozen of them opens as a wall of version fields nobody reads. Each group header states
  // its type and its count, which is what a reader needs to decide whether to open it — a
  // collapsed row that hides its own value would be a trap, one that states it is a summary.
  //
  // The Include block is the exception and opens: the only thing inside it is the action that
  // fills it, and an Add button behind a collapsed row is an action nobody finds.
  const openGroups = ref([])
  watch(
    () => `${props.allowAdd}:${props.groups.map((group) => group.type).join('|')}`,
    () => {
      openGroups.value = props.allowAdd ? props.groups.map((group) => group.type) : []
    },
    { immediate: true }
  )

  const sharedIn = (group) => group.rows.filter((row) => row.sharedWith?.length > 0)
</script>

<template>
  <!-- THE FRAME IS THE HOST'S. This renders the groups and nothing around them, because the
       same content sits in two different cards: a nested "Dependencies" card inside a
       resource's card (./ReleaseTopologyTree.vue) and its own top-level "Include
       dependencies" card (../ReleaseComposer.vue). Each host owns its card, its title and its
       count — a `framed` prop here would be one component rendering two different chromes. -->
  <!-- Detection is a state of the whole block: until it answers, the groups below are not yet
       the truth about this version. -->
  <div
    v-if="detecting"
    class="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)]"
  >
    <Spinner class="size-4 shrink-0 text-[var(--text-muted)]" />
    <span class="text-body-sm text-[var(--text-muted)]">{{ detectingLabel }}</span>
  </div>

  <Accordion
    v-else
    v-model:value="openGroups"
    type="multiple"
  >
    <Accordion.Item
      v-for="group in groups"
      :key="group.type"
      :value="group.type"
    >
      <Accordion.Trigger>
        <span class="flex flex-1 items-center gap-[var(--spacing-xs)]">
          <i
            :class="[resourceIcon(group.type), 'shrink-0 text-[var(--text-muted)]']"
            aria-hidden="true"
          />
          <span class="truncate text-label-md text-[var(--text-default)]">
            {{ resourceLabel(group.type) }}
          </span>
          <!-- A BADGE, not a tag: this is a COUNT on a label, which is what a badge is for
               (a tag states a state). `medium` (24px) still rides the 32px row without setting
               the row's height, and `warning` is the one severity this screen gives a count —
               the number is what the operator has to review, so it is the thing that catches
               the eye. -->
          <Badge
            :label="String(group.rows.length)"
            severity="warning"
            size="medium"
          />
        </span>
      </Accordion.Trigger>

      <Accordion.Content>
        <!-- The webkit Accordion pads its TRIGGER (`px-[var(--spacing-md)]`, so the row's
                 hover surface still spans the full width) and deliberately leaves its PANEL
                 flush, because only the consumer knows what goes in there. So the panel's
                 inset is ours to set, and it is the trigger's own: the rows inside line up
                 with the group label above them instead of starting at the card's border.
                 One spacing step above (the trigger's bottom border already separates the
                 two, so the panel only needs air) and a full step below, so the last row does
                 not sit on the next group's border. -->
        <div
          class="flex min-w-0 flex-col gap-[var(--spacing-sm)] px-[var(--spacing-md)] pt-[var(--spacing-sm)] pb-[var(--spacing-md)]"
        >
          <!-- The shared caveat, said once for the group instead of on every row it
                 applies to. -->
          <Message
            v-if="sharedIn(group).length"
            severity="info"
            size="small"
            label="A shared dependency deploys at one version. Changing it here changes it under every resource in this release that references it."
          />

          <p
            v-if="!group.rows.length"
            class="text-body-sm text-[var(--text-muted)]"
          >
            This release references no {{ resourceNounPlural(group.type) }}.
          </p>

          <div
            v-for="(row, index) in group.rows"
            :key="`${group.type}-${row.resourceId || index}`"
            class="flex min-w-0 flex-col gap-[var(--spacing-xs)] rounded-[var(--shape-elements)] border border-[length:var(--border-width-default)] border-[var(--border-muted)] p-[var(--spacing-sm)]"
          >
            <!-- The row's own header exists only when it has something to say: that
                   the dependency is shared, or that the operator can remove it. -->
            <div
              v-if="row.sharedWith?.length || allowAdd"
              class="flex min-w-0 items-center justify-between gap-[var(--spacing-xs)]"
            >
              <Tooltip
                v-if="row.sharedWith?.length"
                :text="`Also referenced by ${row.sharedWith.join(' and ')}.`"
              >
                <Tag
                  label="Shared"
                  severity="info"
                  size="medium"
                  icon="pi pi-link"
                />
              </Tooltip>
              <span v-else />

              <Tooltip
                key="tooltip-2"
                v-if="allowAdd"
                text="Remove from this release"
              >
                <IconButton
                  icon="pi pi-times"
                  kind="text"
                  size="small"
                  :disabled="disabled"
                  :aria-label="`Remove ${resourceName(group.type, row.resourceId) || resourceLabel(group.type)} from this release`"
                  @click="emit('remove', group.type, index)"
                />
              </Tooltip>
            </div>

            <ResourceVersionField
              :type="group.type"
              :resource-id="row.resourceId"
              :version-id="row.versionId"
              :fixed="row.locked"
              :disabled="disabled"
              @update:resource-id="emit('set-resource', group.type, index, $event)"
              @update:version-id="emit('update-version', group.type, index, $event)"
              @build="(type, id) => emit('build', type, id)"
            />
          </div>

          <!-- Adding is picking WHICH one, so the choice happens in the menu rather
                 than in an empty row the operator then has to fill in. -->
          <Dropdown
            v-if="allowAdd && group.addOptions?.length"
            placement="bottom-start"
            @select="(event, value) => emit('add', group.type, value)"
          >
            <Dropdown.Trigger>
              <Button
                class="self-start"
                :label="`Add ${resourceNoun(group.type)}`"
                kind="outlined"
                size="small"
                icon="pi pi-plus"
                :disabled="disabled"
              />
            </Dropdown.Trigger>
            <Dropdown.Group>
              <Dropdown.Option
                v-for="option in group.addOptions"
                :key="option.value"
                :value="option.value"
                :label="option.label"
              />
            </Dropdown.Group>
          </Dropdown>

          <!-- Nothing left to add: the reason, instead of a disabled button. A dead
                 control with no sentence beside it reads as a bug. -->
          <p
            v-else-if="allowAdd"
            class="text-body-sm text-[var(--text-muted)]"
          >
            Every {{ resourceNounPlural(group.type) }} in this workspace is already in this release.
          </p>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
</template>
