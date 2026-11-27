<script setup lang="ts">
  import type { NavPaletteGroup } from '../../../../composables/use-app-navigation'
  import Command from '../../../overlay/command/command.vue'
  import CommandEmpty from '../../../overlay/command/command-empty/command-empty.vue'
  import CommandGroup from '../../../overlay/command/command-group/command-group.vue'
  import CommandInput from '../../../overlay/command/command-input/command-input.vue'
  import CommandItem from '../../../overlay/command/command-item/command-item.vue'
  import CommandList from '../../../overlay/command/command-list/command-list.vue'

  defineOptions({ name: 'ConsoleLayoutPalette' })

  interface Props {
    /** Placeholder of the palette's input. */
    placeholder: string
    /** Heading of a group that has none. */
    pagesLabel: string
    /** Text shown when nothing matches. */
    noMatchLabel: string
    /** The navigation pages, grouped. */
    groups: NavPaletteGroup[]
    /** Prefix of the value each page item carries. */
    valuePrefix: string
  }

  defineProps<Props>()

  const emit = defineEmits<{
    /** An item was chosen. */
    select: [event: MouseEvent | KeyboardEvent, value: string | number]
    /** The query changed. */
    query: [value: unknown]
  }>()

  const open = defineModel<boolean>('open', { default: false })

  defineSlots<{
    /** Extra groups listed before the pages. */
    search(): unknown
  }>()
</script>

<template>
  <Command
    v-model:open="open"
    @select="(event, value) => emit('select', event, value)"
  >
    <CommandInput
      :placeholder="placeholder"
      @update:model-value="emit('query', $event)"
    />
    <CommandList>
      <slot name="search" />
      <CommandGroup
        v-for="group in groups"
        :key="group.key"
        :label="group.heading || pagesLabel"
      >
        <CommandItem
          v-for="item in group.items"
          :key="item.id"
          :value="valuePrefix + item.id"
        >
          <template
            v-if="item.icon"
            #leading
          >
            <i
              :class="item.icon"
              aria-hidden="true"
            />
          </template>
          {{ item.label }}
        </CommandItem>
      </CommandGroup>
      <CommandEmpty>{{ noMatchLabel }}</CommandEmpty>
    </CommandList>
  </Command>
</template>
