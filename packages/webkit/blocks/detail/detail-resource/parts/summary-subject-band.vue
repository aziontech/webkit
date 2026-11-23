<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import Tooltip from '@aziontech/webkit/tooltip'

  /** One item of the actions menu. */
  export interface SummaryMenuItem {
    /** The value the menu emits. */
    value: string
    /** The item label. */
    label: string
    /** The leading glyph class. */
    icon: string
  }

  export interface SummarySubjectBandProps {
    /** The glyph before the subject. */
    icon: string
    /** The primary link label. */
    label?: string
    /** Where the primary link goes. */
    href?: string
    /** Where the primary link goes, named in its tooltip. */
    destination?: string
    /** The address Visit opens in a new tab; empty draws no Visit. */
    visit?: string
    /** The accessible name and tooltip of the actions menu. */
    actionsLabel: string
    /** The groups of the actions menu. */
    menu: SummaryMenuItem[][]
    /** Whether the items of the actions menu carry their glyph. */
    showMenuIcons?: boolean
    /** Whether the band is a container query container. */
    container?: boolean
  }

  withDefaults(defineProps<SummarySubjectBandProps>(), {
    label: '',
    href: '',
    destination: '',
    visit: '',
    showMenuIcons: true,
    container: true
  })

  const emit = defineEmits<{
    select: [event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue]
  }>()

  defineSlots<{
    subject?(): unknown
    'subject-trailing'?(): unknown
    actions?(): unknown
  }>()
</script>

<template>
  <div
    :class="container && '@container/band'"
    class="flex min-h-(--size-14) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) px-(--spacing-md) py-(--spacing-xs)"
  >
    <div class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)">
      <i
        :class="icon"
        class="shrink-0 text-body-lg text-(--text-muted)"
        aria-hidden="true"
      />
      <slot name="subject">
        <div class="flex min-w-0">
          <TableCellLink
            :label="label"
            :href="href"
            :destination="destination"
          />
        </div>
      </slot>
      <slot name="subject-trailing" />
    </div>

    <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
      <Button
        v-if="visit"
        label="Visit"
        aria-label="Visit (opens in a new tab)"
        :href="visit"
        target="_blank"
        variant="secondary"
        size="medium"
        icon="az az-external-link"
      />
      <slot name="actions" />
      <DropdownMenu
        side="bottom"
        align="end"
        @select="(event, value) => emit('select', event, value)"
      >
        <DropdownMenu.Trigger>
          <Tooltip :content="actionsLabel">
            <IconButton
              icon="az az-ellipsis"
              variant="outline"
              size="medium"
              :aria-label="actionsLabel"
            />
          </Tooltip>
        </DropdownMenu.Trigger>
        <DropdownMenu.Group
          v-for="(group, index) in menu"
          :key="index"
        >
          <DropdownMenu.Item
            v-for="item in group"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          >
            <template
              v-if="showMenuIcons"
              #leading
            >
              <i
                :class="item.icon"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu>
    </div>
  </div>
</template>
