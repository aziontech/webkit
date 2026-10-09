<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import FieldTextarea from '@aziontech/webkit/field-textarea'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tag from '@aziontech/webkit/tag'
  import { computed, nextTick, ref, useId, watch } from 'vue'

  import { versionStateMeta } from '../../lib/data/versioning'
  import { relativeTime } from '../../lib/format/relative-time'

  interface ChangeEntry {
    id: string
    text: string
    at: Date | string
    author?: string
    authorAvatar?: string
  }

  interface VersionEntry {
    id: string
    name: string
    state: string
    comment?: string
    author?: string
    authorAvatar?: string
    createdAt?: Date | string
    history?: ChangeEntry[]
  }

  interface Props {
    /** The version open on the page. */
    version: VersionEntry
    /** Built versions older than it, newest first. */
    earlier?: VersionEntry[]
    /** Id of the version the open one was copied from. */
    sourceId?: string
    /** Whether the open version can still be edited. */
    editable?: boolean
    /** Whether the description is still the one suggested from the tracked changes. */
    suggested?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    earlier: () => [],
    sourceId: '',
    editable: false,
    suggested: false
  })

  const emit = defineEmits<{
    'version-click': [event: MouseEvent, versionId: string]
  }>()

  const open = defineModel<boolean>('open', { default: false })
  const editing = defineModel<boolean>('editing', { default: false })
  const description = defineModel<string>('description', { default: '' })

  const OLDER_PAGE = 5

  const shown = ref(OLDER_PAGE)
  const expanded = ref(true)
  const draftText = ref('')
  const changesId = useId()
  const titleId = useId()
  const closeRef = ref(null)

  let returnFocus = null

  const changes = computed(() => props.version.history ?? [])
  const stateMeta = computed(() => versionStateMeta(props.version.state))
  const sourceName = computed(
    () => props.earlier.find((entry) => entry.id === props.sourceId)?.name ?? ''
  )
  const older = computed(() => props.earlier.slice(0, shown.value))
  const remaining = computed(() => props.earlier.length - older.value.length)
  const changesLabel = computed(() => {
    const count = changes.value.length
    return `${count} ${count === 1 ? 'change' : 'changes'}`
  })
  const showsChanges = computed(() => changes.value.length > 0 || props.editable)
  const helperText = computed(() =>
    props.suggested && changes.value.length
      ? `Suggested from ${changesLabel.value}. Edit it to describe the version in your own words.`
      : 'Shows in the version list and on the deployment.'
  )

  watch(
    editing,
    (isEditing) => {
      if (isEditing) draftText.value = description.value
    },
    { immediate: true }
  )

  watch(
    open,
    async (isOpen) => {
      if (isOpen) {
        returnFocus = globalThis.document?.activeElement ?? null
        await nextTick()
        closeRef.value?.$el?.focus?.()
        return
      }
      editing.value = false
      shown.value = OLDER_PAGE
      if (returnFocus?.isConnected) returnFocus.focus()
      returnFocus = null
    },
    { immediate: true }
  )

  const close = () => {
    open.value = false
  }

  const saveDescription = () => {
    description.value = draftText.value.trim()
    editing.value = false
  }
</script>

<template>
  <aside
    :inert="!open"
    :aria-labelledby="titleId"
    class="flex min-h-0 min-w-0 flex-1 flex-col bg-(--bg-surface)"
    data-testid="application-version-history"
    @keydown.esc="close"
  >
    <header
      class="flex min-h-14 shrink-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) py-(--spacing-xs) pl-(--spacing-lg) pr-(--spacing-sm)"
    >
      <h2
        :id="titleId"
        class="truncate text-label-lg text-(--text-default)"
      >
        Version history
      </h2>
      <IconButton
        ref="closeRef"
        icon="pi pi-times"
        kind="transparent"
        size="small"
        aria-label="Close version history"
        @click="close"
      />
    </header>
    <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-(--spacing-lg)">
      <ol class="flex flex-col">
        <li class="relative flex gap-(--spacing-sm) pb-(--spacing-lg)">
          <span
            v-if="showsChanges || older.length"
            class="absolute bottom-0 left-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
            aria-hidden="true"
          />
          <span
            class="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-(--accent) text-(--accent-contrast)"
            aria-hidden="true"
          >
            <i
              :class="stateMeta.icon || 'pi pi-code'"
              class="text-body-xs"
            />
          </span>
          <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs) pt-0.5">
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <span class="truncate text-label-md text-(--text-default)">
                {{ version.name }}
              </span>
              <span class="flex shrink-0">
                <Tag
                  :label="stateMeta.label"
                  :severity="stateMeta.severity"
                  size="small"
                />
              </span>
              <span
                v-if="editable && !editing"
                class="ml-auto shrink-0"
              >
                <IconButton
                  icon="pi pi-pencil"
                  kind="transparent"
                  size="small"
                  aria-label="Edit version info"
                  @click="editing = true"
                />
              </span>
            </div>
            <p class="text-label-sm text-(--text-muted)">Current version</p>

            <div
              v-if="editing"
              class="flex flex-col gap-(--spacing-sm) pt-(--spacing-xs)"
            >
              <FieldTextarea
                v-model="draftText"
                label="Description"
                placeholder="What changed in this version?"
                :helper-text="helperText"
              />
              <div class="flex justify-end gap-(--spacing-xs)">
                <Button
                  label="Cancel"
                  kind="outlined"
                  size="small"
                  @click="editing = false"
                />
                <Button
                  label="Save"
                  kind="primary"
                  size="small"
                  @click="saveDescription"
                />
              </div>
            </div>
            <template v-else>
              <p
                :data-empty="!description || null"
                class="text-body-sm text-(--text-default) data-empty:text-(--text-muted)"
              >
                {{ description || 'No description' }}
              </p>
              <span
                v-if="version.author || version.createdAt"
                class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
              >
                <span
                  v-if="version.author"
                  class="flex shrink-0"
                >
                  <Avatar
                    :src="version.authorAvatar || undefined"
                    :alt="version.author"
                    :label="version.author"
                    size="small"
                    kind="square"
                  />
                </span>
                <span class="truncate">
                  {{ version.author
                  }}<template v-if="version.author && version.createdAt"> · </template
                  >{{ relativeTime(version.createdAt) }}
                </span>
              </span>
            </template>
          </div>
        </li>

        <li
          v-if="showsChanges"
          class="relative flex flex-col pb-(--spacing-lg)"
        >
          <span
            v-if="older.length"
            class="absolute bottom-0 left-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
            aria-hidden="true"
          />
          <p
            v-if="!changes.length"
            class="flex gap-(--spacing-sm)"
          >
            <span
              class="relative flex size-7 shrink-0 items-center justify-center"
              aria-hidden="true"
            >
              <span class="size-2 rounded-full border border-(--border-strong) bg-(--bg-surface)" />
            </span>
            <span class="pt-1 text-body-sm text-(--text-muted)">
              <template v-if="sourceName">Copied from {{ sourceName }}. </template>No changes yet.
              Each change you save shows up here.
            </span>
          </p>
          <template v-else>
            <button
              type="button"
              :aria-expanded="expanded"
              :aria-controls="changesId"
              class="group flex w-full min-w-0 items-center gap-(--spacing-sm) rounded-(--shape-button) text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
              @click="expanded = !expanded"
            >
              <span
                class="relative flex size-7 shrink-0 items-center justify-center rounded-full border border-(--border-default) bg-(--bg-surface) text-(--text-default)"
                aria-hidden="true"
              >
                <i
                  class="pi pi-chevron-right text-body-xs transition-transform duration-fast-02 ease-productive-entrance group-aria-expanded:rotate-90 motion-reduce:transition-none"
                />
              </span>
              <span class="truncate text-label-md text-(--text-default) group-hover:underline">
                {{ changesLabel }}<template v-if="sourceName"> since {{ sourceName }}</template>
              </span>
            </button>
            <ol
              v-if="expanded"
              :id="changesId"
              class="flex flex-col gap-(--spacing-md) pt-(--spacing-md)"
            >
              <li
                v-for="change in changes"
                :key="change.id"
                class="flex gap-(--spacing-sm)"
              >
                <span
                  class="relative flex size-7 shrink-0 items-center justify-center"
                  aria-hidden="true"
                >
                  <span
                    class="size-2 rounded-full border border-(--border-strong) bg-(--bg-surface)"
                  />
                </span>
                <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs) pt-1">
                  <span class="text-body-sm text-(--text-default)">{{ change.text }}</span>
                  <span
                    class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
                  >
                    <span
                      v-if="change.author"
                      class="flex shrink-0"
                    >
                      <Avatar
                        :src="change.authorAvatar || undefined"
                        :alt="change.author"
                        :label="change.author"
                        size="small"
                        kind="square"
                      />
                    </span>
                    <span class="truncate">
                      {{ change.author }}<template v-if="change.author"> · </template
                      >{{ relativeTime(change.at) }}
                    </span>
                  </span>
                </div>
              </li>
            </ol>
          </template>
        </li>

        <li
          v-for="(entry, index) in older"
          :key="entry.id"
          class="relative flex pb-(--spacing-lg) last:pb-0"
        >
          <span
            v-if="index < older.length - 1"
            class="absolute bottom-0 left-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
            aria-hidden="true"
          />
          <button
            type="button"
            class="group flex w-full min-w-0 gap-(--spacing-sm) rounded-(--shape-button) text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
            @click="emit('version-click', $event, entry.id)"
          >
            <span
              class="relative flex size-7 shrink-0 items-center justify-center rounded-full border border-(--border-default) bg-(--bg-surface) text-(--text-default)"
              aria-hidden="true"
            >
              <i class="pi pi-code text-body-xs" />
            </span>
            <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs) pt-0.5">
              <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                <span class="truncate text-label-md text-(--text-default) group-hover:underline">
                  {{ entry.name }}
                </span>
                <span class="flex shrink-0">
                  <Tag
                    :label="versionStateMeta(entry.state).label"
                    :severity="versionStateMeta(entry.state).severity"
                    size="small"
                  />
                </span>
                <span
                  v-if="entry.id === sourceId"
                  class="flex shrink-0"
                >
                  <Tag
                    label="Source"
                    severity="info"
                    size="small"
                  />
                </span>
              </span>
              <span
                v-if="entry.comment"
                class="line-clamp-2 text-body-sm text-(--text-muted)"
              >
                {{ entry.comment }}
              </span>
              <span
                v-if="entry.author || entry.createdAt"
                class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
              >
                <span
                  v-if="entry.author"
                  class="flex shrink-0"
                >
                  <Avatar
                    :src="entry.authorAvatar || undefined"
                    :alt="entry.author"
                    :label="entry.author"
                    size="small"
                    kind="square"
                  />
                </span>
                <span class="truncate">
                  {{ entry.author }}<template v-if="entry.author && entry.createdAt"> · </template
                  >{{ relativeTime(entry.createdAt) }}
                </span>
              </span>
            </span>
          </button>
        </li>
      </ol>

      <div
        v-if="remaining"
        class="pt-(--spacing-sm)"
      >
        <Button
          label="Show older"
          kind="text"
          size="small"
          @click="shown += OLDER_PAGE"
        />
      </div>
    </div>
  </aside>
</template>
