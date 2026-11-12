<script setup lang="ts">
  import Command from '@aziontech/webkit/command'
  import CommandEmpty from '@aziontech/webkit/command-empty'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandItem from '@aziontech/webkit/command-item'
  import CommandList from '@aziontech/webkit/command-list'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  import { index } from '../lib/data'
  import { FOUNDATIONS } from '../lib/foundations'
  import { messages } from '../lib/i18n'

  const open = defineModel<boolean>('open', { default: false })
  const router = useRouter()
  const t = messages

  const groups = computed(() => [
    {
      heading: t.value.foundations,
      items: FOUNDATIONS.map((page) => ({
        to: `/foundations/${page.slug}`,
        title: page.title,
        hint: page.summary
      }))
    },
    {
      heading: t.value.components,
      items: index.components.map((item) => ({
        to: `/components/${item.name}`,
        title: item.title,
        hint: item.purpose
      }))
    },
    {
      heading: t.value.blocks,
      items: index.blocks.map((block) => ({
        to: `/blocks/${block.id}`,
        title: block.title,
        hint: block.summary
      }))
    }
  ])

  function onSelect(_event: unknown, value: string | number) {
    open.value = false
    router.push(String(value))
  }
</script>

<template>
  <Command
    v-model:open="open"
    shortcut="meta+k"
    @select="onSelect"
  >
    <CommandInput :placeholder="t.searchPlaceholder" />
    <CommandList>
      <CommandEmpty>{{ t.noResults }}</CommandEmpty>
      <CommandGroup
        v-for="group in groups"
        :key="group.heading"
        :heading="group.heading"
      >
        <CommandItem
          v-for="item in group.items"
          :key="item.to"
          :value="item.to"
        >
          <span class="flex min-w-0 flex-col">
            <span class="text-label-md text-(--text-default)">{{ item.title }}</span>
            <span class="truncate text-body-xs text-(--text-muted)">{{ item.hint }}</span>
          </span>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>
