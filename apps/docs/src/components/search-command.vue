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
  import { searchKeywords } from '../lib/search'

  const open = defineModel<boolean>('open', { default: false })
  const router = useRouter()
  const t = messages

  const groups = computed(() => [
    {
      heading: t.value.foundations,
      items: FOUNDATIONS.map((page) => ({
        to: `/foundations/${page.slug}`,
        title: page.title,
        hint: page.summary,
        keywords: searchKeywords(page.title, page.summary)
      }))
    },
    {
      heading: t.value.assets,
      items: [
        {
          to: '/assets#brand',
          title: t.value.brand,
          hint: t.value.brandLead,
          keywords: searchKeywords(t.value.brand, t.value.brandLead)
        },
        {
          to: '/assets#illustrations',
          title: t.value.illustrations,
          hint: t.value.illustrationsLead,
          keywords: searchKeywords(t.value.illustrations, t.value.illustrationsLead)
        }
      ]
    },
    {
      heading: t.value.components,
      items: index.components.map((item) => ({
        to: `/components/${item.name}`,
        title: item.title,
        hint: item.purpose,
        keywords: searchKeywords(item.title, item.purpose, item.aliases)
      }))
    },
    {
      heading: t.value.blocks,
      items: index.blocks.map((block) => ({
        to: `/blocks/${block.id}`,
        title: block.title,
        hint: block.summary,
        keywords: searchKeywords(block.title, block.summary)
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
    <CommandList class="max-sm:max-h-[calc(100dvh-8rem)]">
      <CommandEmpty>{{ t.noResults }}</CommandEmpty>
      <CommandGroup
        v-for="group in groups"
        :key="group.heading"
        :label="group.heading"
      >
        <CommandItem
          v-for="item in group.items"
          :key="item.to"
          :value="item.to"
          :keywords="item.keywords"
        >
          {{ item.title }}
          <template #trailing>
            <span
              class="hidden max-w-56 truncate text-body-xs text-(--text-muted) sm:block md:max-w-80"
              >{{ item.hint }}</span
            >
          </template>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>
