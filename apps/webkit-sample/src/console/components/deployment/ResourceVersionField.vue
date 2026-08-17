<script setup>
  // The one field pair of a release: WHICH resource, and WHICH version of it.
  //
  // Every row of the deployment topology is this component — the Application card, the
  // Firewall card, and every dependency row under them — so a version is chosen the
  // same way wherever it appears. The two differ only in what is already settled:
  //
  //   a composed singleton  both halves are a choice (the Application card lets the
  //                         operator swap the Application itself)
  //   a detected dependency `fixed`: the resource came with the parent's version, so it
  //                         is REPORTED with a lock and only the version is a choice
  //
  // THE VERSION SELECT has two kinds of answer, and they are different commitments:
  //
  //   Track latest Ready  the sentinel (lib/releases.js § LATEST_READY). Resolves when
  //                       the release deploys, so it is still correct next week.
  //   A pinned version    this exact snapshot, forever. Grouped under its own heading
  //                       so the choice between "newest" and "this one" is visible
  //                       rather than something the reader infers from option order.
  //
  // NO READY VERSION is a blocker, not a warning: a resource with nothing deployable
  // cannot go into traffic, so the field says what is wrong and offers the one action
  // that fixes it (build a version), and the page's deploy gate reads the same fact.
  import Button from '@aziontech/webkit/button'
  import HelperText from '@aziontech/webkit/helper-text'
  import Label from '@aziontech/webkit/label'
  import Select from '@aziontech/webkit/select'
  import Tag from '@aziontech/webkit/tag'
  import { computed, useId } from 'vue'

  import {
    hasDeployableVersion,
    LATEST_READY,
    resourceLabel,
    resourceName,
    resourceOptions,
    versionOptions
  } from '../../lib/data/releases'
  import { relativeTime } from '../../lib/format/relative-time'

  const props = defineProps({
    // The resource type this field composes (`application`, `function`, …).
    type: { type: String, required: true },
    // The chosen resource id.
    resourceId: { type: String, default: '' },
    // The chosen version id, or the LATEST_READY sentinel.
    versionId: { type: String, default: '' },
    // A detected dependency: the resource is a fact of the parent's version, so it is
    // reported with a lock instead of offered as a Select.
    fixed: { type: Boolean, default: false },
    // The whole pair is inert: this resource is kept from the active release, or the
    // release is being deployed.
    disabled: { type: Boolean, default: false }
  })

  const emit = defineEmits(['update:resourceId', 'update:versionId', 'build'])

  // One id namespace per instance: a release renders a dozen of these at once, and each
  // Label has to point at its own control.
  const scope = useId()
  const resourceFieldId = `${scope}-resource`
  const versionFieldId = `${scope}-version`

  const label = computed(() => resourceLabel(props.type))
  const options = computed(() => resourceOptions(props.type))
  const versions = computed(() => versionOptions(props.type, props.resourceId))
  const deployable = computed(() => hasDeployableVersion(props.type, props.resourceId))
  const name = computed(() => resourceName(props.type, props.resourceId))

  const resourceDisplay = (value) =>
    options.value.find((option) => option.value === value)?.label ?? ''

  // The sentinel reads as what it does, not as its raw value: the trigger says "latest
  // Ready" so a reader scanning the composed release sees a policy, not an id.
  const versionDisplay = (value) => {
    if (value === LATEST_READY) return 'latest Ready'
    return versions.value.find((option) => option.value === value)?.label ?? value
  }
</script>

<template>
  <!-- The pair sits on one row from `sm` up, and stacks below it: two Selects side by
       side at 320px are two truncated Selects. -->
  <div class="grid min-w-0 gap-[var(--spacing-sm)] sm:grid-cols-2">
    <div class="flex min-w-0 flex-col gap-[var(--spacing-xs)]">
      <Label
        :for="fixed ? undefined : resourceFieldId"
        :required="!fixed"
        >Resource</Label
      >

      <!-- FIXED: the resource is reported. A box that looks like a field and reads as
           one, with the lock saying why it does not open — rather than a disabled
           Select, which invites the click that does nothing. -->
      <div
        v-if="fixed"
        class="flex min-h-9 min-w-0 items-center justify-between gap-[var(--spacing-xs)] rounded-[var(--shape-elements)] border border-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface-raised)] px-[var(--spacing-sm)]"
      >
        <span class="truncate text-body-sm text-[var(--text-default)]">{{ name }}</span>
        <i
          class="pi pi-lock shrink-0 text-[var(--text-muted)]"
          aria-hidden="true"
        />
      </div>

      <Select
        v-else
        :model-value="resourceId"
        size="large"
        class="w-full"
        :placeholder="`Select ${label.toLowerCase()}`"
        :disabled="disabled"
        :display-value="resourceDisplay"
        @update:model-value="emit('update:resourceId', $event)"
      >
        <Select.Trigger :id="resourceFieldId" />
        <Select.Content>
          <Select.Option
            v-for="option in options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </Select.Option>
        </Select.Content>
      </Select>
    </div>

    <div class="flex min-w-0 flex-col gap-[var(--spacing-xs)]">
      <!-- No required marker: a version is always required and always answered (the
           tracking sentinel is the default), so "(Required)" on every one of a dozen rows
           would be a dozen repetitions that tell the reader nothing. When a version IS
           missing, the message row below says so. -->
      <Label :for="versionFieldId">Version</Label>

      <Select
        :model-value="versionId"
        size="large"
        class="w-full"
        placeholder="Select a version"
        :disabled="disabled || !deployable"
        :required="!versionId"
        :display-value="versionDisplay"
        @update:model-value="emit('update:versionId', $event)"
      >
        <Select.Trigger
          :id="versionFieldId"
          :aria-describedby="`${versionFieldId}-message`"
        />
        <Select.Content>
          <!-- The policy option leads, ungrouped: it is not one of the versions, it is
               the choice not to pin one. Each option is ONE line — the component gives a
               row 32px, so a second line inside it would be clipped — with the version's
               age in the trailing slot, where the Current tag also lands. -->
          <Select.Option
            :value="LATEST_READY"
            icon="pi pi-sync"
          >
            Track latest Ready
            <template #tag>
              <span class="shrink-0 text-body-xs text-[var(--text-muted)]">
                resolves at deploy
              </span>
            </template>
          </Select.Option>

          <Select.Group label="Pin a ready version">
            <Select.Option
              v-for="option in versions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
              <template #tag>
                <span class="flex shrink-0 items-center gap-[var(--spacing-xs)]">
                  <Tag
                    v-if="option.isCurrent"
                    label="Current"
                    severity="success"
                    size="medium"
                  />
                  <span class="text-body-xs text-[var(--text-muted)]">
                    {{ relativeTime(option.createdAt) }}
                  </span>
                </span>
              </template>
            </Select.Option>
          </Select.Group>
        </Select.Content>
      </Select>

      <!-- The message row appears only when there is something to say: the resource
           cannot be deployed at all, or the version is still unanswered. At rest it is
           silent. A release renders a dozen of these fields, and a resting helper on each
           one ("Only Ready versions can be deployed.") is a dozen copies of a sentence
           the reader stops seeing after the first. -->
      <HelperText
        key="helper-text-1"
        v-if="!deployable"
        :id="`${versionFieldId}-message`"
        kind="invalid"
        :label="`${name || label} has no Ready version, so it cannot be deployed.`"
      />
      <HelperText
        key="helper-text-2"
        v-else-if="!versionId"
        :id="`${versionFieldId}-message`"
        kind="required"
        label="Select the version to deploy."
      />

      <!-- The action that unblocks the row, offered where the problem is stated. -->
      <Button
        v-if="!deployable"
        class="self-start"
        label="Build a version"
        kind="text"
        size="small"
        icon="pi pi-external-link"
        @click="emit('build', type, resourceId)"
      />
    </div>
  </div>
</template>
