<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import LazyNodes from '../../../composables/use-lazy-chunks/lib/lazy-nodes'
  import { safeHref } from '../../../utils/safe-href'
  import Button from '../../action/button/button.vue'
  import Item from '../../content/item/item.vue'
  import ItemContent from '../../content/item/item-content.vue'
  import ItemDescription from '../../content/item/item-description.vue'
  import ItemList from '../../content/item/item-list.vue'
  import ItemTitle from '../../content/item/item-title.vue'
  import Table from '../../data/table/table.vue'
  import TableBody from '../../data/table/table-body/table-body.vue'
  import TableCell from '../../data/table/table-cell/table-cell.vue'
  import TableFooter from '../../data/table/table-footer/table-footer.vue'
  import TableHeadCell from '../../data/table/table-head-cell/table-head-cell.vue'
  import TableHeader from '../../data/table/table-header/table-header.vue'
  import TableRow from '../../data/table/table-row/table-row.vue'
  import Module from '../../layout/module/module.vue'
  import type { ModuleHeaderAction } from '../../layout/module-header/module-header.vue'
  import ModuleHeader from '../../layout/module-header/module-header.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'

  defineOptions({
    name: 'ListingTableSection',
    inheritAttrs: false
  })

  export type { ModuleHeaderAction }

  /** Flex weight of a column. */
  export type ListingTableSectionColumnGrow = 1 | 2 | 3

  /** Text alignment of a column. */
  export type ListingTableSectionColumnAlign = 'start' | 'end'

  /** One column of the listing, left to right. */
  export type ListingTableSectionColumn = {
    /** Key of the row value the column shows. */
    key: string
    /** Header text of the column. */
    label: string
    /** Flex weight of the column. */
    grow?: ListingTableSectionColumnGrow
    /** Text alignment of the column. */
    align?: ListingTableSectionColumnAlign
  }

  /** One linked row of the listing. */
  export type ListingTableSectionRow = {
    /** Destination the row links to. */
    href: string
    /** Text of each cell, keyed by column key. */
    values: Record<string, string>
  }

  export interface ListingTableSectionProps {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Headline of the band, rendered by the left-aligned section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** The columns left to right; each is `{ key, label, grow?, align? }` where `key` picks the row value, `grow` is the flex weight (1, 2 or 3) and `align` is `start` or `end`. The first column names the row and the second describes it on phones. */
    columns?: ListingTableSectionColumn[]
    /** The linked rows, in order; each is `{ href, values }` where `values` maps a column key to its text. */
    data?: ListingTableSectionRow[]
    /** Outlined button into the full listing, in the table footer; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent. */
    primaryAction?: ModuleHeaderAction
  }

  const props = withDefaults(defineProps<ListingTableSectionProps>(), {
    anchor: '',
    title: '',
    columns: () => [],
    data: () => [],
    primaryAction: undefined
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'listing-table-section'
  )

  const hasRows = computed(() => props.data.length > 0 && props.columns.length > 0)

  const titleKey = computed(() => props.columns[0]?.key ?? '')

  const descriptionKey = computed(() => props.columns[1]?.key ?? '')

  const lastIndex = computed(() => props.columns.length - 1)

  const followRow = (event: MouseEvent): void => {
    const target = event.target as Element | null
    if (!target || target.closest('a, button')) return
    if (window.getSelection()?.toString()) return
    const link = (event.currentTarget as Element | null)?.querySelector('a[href]')
    link?.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey
      })
    )
  }
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-2xl)"
  >
    <Module
      v-if="hasRows"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="title"
        #header
      >
        <ModuleHeader
          align="start"
          :title="title"
        />
      </template>

      <RegistrationFrame
        flush
        borders="y"
        marks="bottom"
      >
        <div class="sm:hidden">
          <ItemList>
            <LazyNodes :row-height="76">
              <Item
                v-for="row in data"
                :key="row.href"
                role="listitem"
                class="relative px-(--spacing-xl)! py-(--spacing-lg)! hover:bg-(--bg-hover)"
              >
                <ItemContent class="gap-(--spacing-xs)">
                  <ItemTitle>
                    <a
                      :href="safeHref(row.href) ?? undefined"
                      class="text-pretty text-label-lg text-(--text-default) after:absolute after:inset-0 after:content-['']"
                    >
                      {{ row.values[titleKey] }}
                    </a>
                  </ItemTitle>
                  <ItemDescription
                    v-if="descriptionKey && row.values[descriptionKey]"
                    class="line-clamp-none! text-overline-sm! text-pretty"
                  >
                    {{ row.values[descriptionKey] }}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </LazyNodes>
          </ItemList>
          <div
            v-if="primaryAction"
            class="flex border-t border-(--border-default) px-(--spacing-xl) py-(--spacing-lg)"
          >
            <Button
              :label="primaryAction.label"
              :href="primaryAction.href"
              variant="outline"
              size="large"
              :icon="primaryAction.trailing ? 'az az-chevron-right' : ''"
              icon-position="trailing"
              :animated="Boolean(primaryAction.trailing)"
              class="w-full"
            />
          </div>
        </div>

        <Table class="max-sm:hidden!">
          <TableHeader>
            <TableRow>
              <TableHeadCell
                v-for="(column, index) in columns"
                :key="column.key"
                :grow="column.grow"
                :align="column.align"
                class="data-[first]:ps-(--spacing-xl)! data-[last]:pe-(--spacing-xl)!"
                :data-first="index === 0 || null"
                :data-last="index === lastIndex || null"
              >
                <span class="text-overline-md text-(--text-muted)">{{ column.label }}</span>
              </TableHeadCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            <LazyNodes :row-height="56">
              <TableRow
                v-for="row in data"
                :key="row.href"
                class="cursor-pointer hover:[--table-row-bg:var(--bg-hover)]!"
                @click="followRow"
              >
                <TableCell
                  v-for="(column, index) in columns"
                  :key="column.key"
                  :grow="column.grow"
                  :align="column.align"
                  :principal="index === 0"
                  class="py-(--spacing-lg)! data-[first]:ps-(--spacing-xl)! data-[last]:pe-(--spacing-xl)! data-[value]:text-overline-sm! data-[value]:text-(--text-muted)"
                  :data-first="index === 0 || null"
                  :data-last="index === lastIndex || null"
                  :data-value="index > 0 || null"
                >
                  <a
                    v-if="index === 0"
                    :href="safeHref(row.href) ?? undefined"
                    class="text-label-lg text-(--text-default)"
                    >{{ row.values[column.key] }}</a
                  >
                  <span
                    v-else
                    class="min-w-0 truncate"
                    :title="row.values[column.key]"
                    >{{ row.values[column.key] }}</span
                  >
                </TableCell>
              </TableRow>
            </LazyNodes>
          </TableBody>

          <template
            v-if="primaryAction"
            #footer
          >
            <TableFooter>
              <div class="flex justify-end px-(--spacing-xl) py-(--spacing-lg)">
                <Button
                  :label="primaryAction.label"
                  :href="primaryAction.href"
                  variant="outline"
                  size="large"
                  :icon="primaryAction.trailing ? 'az az-chevron-right' : ''"
                  icon-position="trailing"
                  :animated="Boolean(primaryAction.trailing)"
                />
              </div>
            </TableFooter>
          </template>
        </Table>
      </RegistrationFrame>
    </Module>
  </section>
</template>
