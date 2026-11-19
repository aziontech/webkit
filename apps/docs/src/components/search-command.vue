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

  const words = (title: string) => title.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  const keywordsOf = (title: string, hint: string, extra: string[] = []) => [
    words(title),
    ...extra,
    ...extra.map((alias) => alias.replace(/-/g, ' ')),
    hint
  ]

  const groups = computed(() => [
    {
      heading: t.value.foundations,
      items: FOUNDATIONS.map((page) => ({
        to: `/foundations/${page.slug}`,
        title: page.title,
        hint: page.summary,
        keywords: keywordsOf(page.title, page.summary)
      }))
    },
    {
      heading: t.value.assets,
      items: [
        {
          to: '/assets#brand',
          title: t.value.brand,
          hint: t.value.brandLead,
          keywords: keywordsOf(t.value.brand, t.value.brandLead)
        },
        {
          to: '/assets#illustrations',
          title: t.value.illustrations,
          hint: t.value.illustrationsLead,
          keywords: keywordsOf(t.value.illustrations, t.value.illustrationsLead)
        }
      ]
    },
    {
      heading: t.value.components,
      items: index.components.map((item) => ({
        to: `/components/${item.name}`,
        title: item.title,
        hint: item.purpose,
        keywords: keywordsOf(item.title, item.purpose, item.aliases)
      }))
    },
    {
      heading: t.value.blocks,
      items: index.blocks.map((block) => ({
        to: `/blocks/${block.id}`,
        title: block.title,
        hint: block.summary,
        keywords: keywordsOf(block.title, block.summary)
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
