<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item-root'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { ref } from 'vue'

  import type { VersionDetailVersion } from '../detail-version.vue'
  import { tagFor } from '../detail-version-states'

  export interface VersionHistoryProps {
    /** Resource name, used in the version links. */
    resourceName: string
    /** Id of the version the page is on. */
    viewedId: string
    /** The current version the history starts on. */
    version: VersionDetailVersion
    /** The built versions older than the current one, newest first. */
    earlier: VersionDetailVersion[]
    /** The current version description. */
    description: string
  }

  defineProps<VersionHistoryProps>()

  const relativeTime = useLocale().formatRelativeTime
  const ago = (value: Date | string) => (value ? relativeTime(new Date(value)) : '')

  const emit = defineEmits<{
    save: [event: MouseEvent]
  }>()

  const historyExpanded = defineModel<boolean>('open', { required: true })
  const editing = defineModel<boolean>('editing', { required: true })
  const draftText = defineModel<string>('draftText', { required: true })

  const shown = ref(5)

  const VERSION_LINK_CLASS = 'flex w-full min-w-0 gap-(--spacing-sm) text-start'
</script>

<template>
  <aside
    :inert="!historyExpanded"
    aria-labelledby="version-history-title"
    class="flex min-h-0 min-w-0 flex-1 flex-col bg-(--bg-surface)"
    data-testid="version-detail-history"
  >
    <header
      class="flex min-h-14 shrink-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) py-(--spacing-xs) ps-(--spacing-lg) pe-(--spacing-sm)"
    >
      <h2
        id="version-history-title"
        class="truncate text-label-lg text-(--text-default)"
      >
        Version history
      </h2>
      <IconButton
        icon="az az-x"
        variant="ghost"
        size="small"
        aria-label="Close version history"
        @click="historyExpanded = false"
      />
    </header>
    <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-(--spacing-lg)">
      <ol class="flex flex-col">
        <li class="relative flex gap-(--spacing-sm) pb-(--spacing-lg)">
          <span
            class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
            aria-hidden="true"
          />
          <span
            class="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-(--accent) text-(--accent-foreground)"
            aria-hidden="true"
          >
            <i
              :class="version.state === 'draft' ? 'az az-file-pen' : 'az az-code'"
              class="text-body-xs"
            />
          </span>
          <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs) pt-0.5">
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <span class="truncate text-label-md text-(--text-default)">
                {{ version.name }}
              </span>
              <span class="flex shrink-0">
                <Tag
                  :label="tagFor(version).label"
                  :variant="tagFor(version).variant"
                  :severity="tagFor(version).severity"
                  size="small"
                />
              </span>
              <span
                v-if="version.state === 'draft' && !editing"
                class="ms-auto shrink-0"
              >
                <IconButton
                  icon="az az-pencil"
                  variant="ghost"
                  size="small"
                  aria-label="Edit version info"
                  @click="
                    () => {
                      draftText = description
                      editing = true
                    }
                  "
                />
              </span>
            </div>
            <p class="text-label-sm text-(--text-muted)">Current version</p>

            <div
              v-if="version.state === 'draft' && editing"
              class="flex flex-col gap-(--spacing-sm) pt-(--spacing-xs)"
            >
              <Field>
                <Field.Label>Description</Field.Label>
                <Textarea
                  v-model="draftText"
                  placeholder="What changed in this version?"
                />
                <Field.Description
                  >Shows in the version list and on the deployment.</Field.Description
                >
              </Field>
              <div class="flex justify-end gap-(--spacing-xs)">
                <Button
                  label="Cancel"
                  variant="outline"
                  size="small"
                  @click="editing = false"
                />
                <Button
                  label="Save"
                  variant="primary"
                  size="small"
                  @click="(event: MouseEvent) => emit('save', event)"
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
                class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
              >
                <span class="flex shrink-0">
                  <Avatar
                    :alt="version.author"
                    :label="version.author"
                    size="small"
                    variant="square"
                  />
                </span>
                <span class="truncate">{{ version.author }} · {{ ago(version.createdAt) }}</span>
              </span>
            </template>
          </div>
        </li>

        <li
          v-if="version.state === 'draft'"
          class="relative flex flex-col pb-(--spacing-lg)"
        >
          <span
            class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
            aria-hidden="true"
          />
          <p class="flex gap-(--spacing-sm)">
            <span
              class="relative flex size-7 shrink-0 items-center justify-center"
              aria-hidden="true"
            >
              <span class="size-2 rounded-full border border-(--border-strong) bg-(--bg-surface)" />
            </span>
            <span class="pt-1 text-body-sm text-(--text-muted)">
              No changes yet. Each change you save shows up here.
            </span>
          </p>
        </li>

        <li
          v-for="(entry, index) in earlier.slice(0, shown)"
          :key="entry.id"
          class="relative flex pb-(--spacing-lg) last:pb-0"
        >
          <span
            v-if="index < earlier.slice(0, shown).length - 1"
            class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
            aria-hidden="true"
          />
          <Item
            :href="`/resources/${resourceName}/versions/${entry.name}`"
            :aria-current="entry.id === viewedId ? 'page' : undefined"
            variant="inline"
          >
            <span :class="VERSION_LINK_CLASS">
              <span
                class="relative flex size-7 shrink-0 items-center justify-center rounded-full border border-(--border-default) bg-(--bg-surface) text-(--text-default)"
                aria-hidden="true"
              >
                <i class="az az-code text-body-xs" />
              </span>
              <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs) pt-0.5">
                <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <span
                    class="truncate text-label-md text-(--text-default) group-hover/item:underline"
                  >
                    {{ entry.name }}
                  </span>
                  <span class="flex shrink-0">
                    <Tag
                      :label="tagFor(entry).label"
                      :variant="tagFor(entry).variant"
                      :severity="tagFor(entry).severity"
                      size="small"
                    />
                  </span>
                  <span
                    v-if="entry.id === viewedId"
                    class="flex shrink-0"
                  >
                    <Tag
                      label="Viewing"
                      severity="info"
                      size="small"
                    />
                  </span>
                </span>
                <span class="line-clamp-2 text-body-sm text-(--text-muted)">
                  {{ entry.comment }}
                </span>
                <span
                  class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
                >
                  <span class="flex shrink-0">
                    <Avatar
                      :alt="entry.author"
                      :label="entry.author"
                      size="small"
                      variant="square"
                    />
                  </span>
                  <span class="truncate">{{ entry.author }} · {{ ago(entry.createdAt) }}</span>
                </span>
              </span>
            </span>
          </Item>
        </li>
      </ol>

      <div
        v-if="earlier.length > shown"
        class="pt-(--spacing-sm)"
      >
        <Button
          label="Show older"
          variant="ghost"
          size="small"
          @click="shown += 5"
        />
      </div>
    </div>
  </aside>
</template>
