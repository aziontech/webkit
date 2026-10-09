<script setup lang="ts">
  import FrameBox from '@aziontech/webkit/frame-box'
  import ItemContent from '@aziontech/webkit/item-content'
  import ItemDescription from '@aziontech/webkit/item-description'
  import ItemList from '@aziontech/webkit/item-list'
  import Item from '@aziontech/webkit/item-root'
  import ItemTitle from '@aziontech/webkit/item-title'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import TableBody from '@aziontech/webkit/table-body'
  import TableCell from '@aziontech/webkit/table-cell'
  import TableFooter from '@aziontech/webkit/table-footer'
  import TableHeadCell from '@aziontech/webkit/table-head-cell'
  import TableHeader from '@aziontech/webkit/table-header'
  import Table from '@aziontech/webkit/table-root'
  import TableRow from '@aziontech/webkit/table-row'
  import { computed } from 'vue'

  import { useSiteLink } from '../../composables/use-site-link'
  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'ListingTable' })

  export interface ListingColumn {
    /** Key of the row value the column shows. */
    key: string
    /** Column header. */
    label: string
    /** Share of the free width the column takes. */
    grow?: 1 | 2 | 3
    /** Horizontal alignment of the column. */
    align?: 'start' | 'end'
  }

  export interface ListingRow {
    /** Destination of the row; the first column links to it. */
    href: string
    /** The row's values, keyed by column. */
    values: Record<string, string>
  }

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Headline over the table. */
    title: string
    /** Columns, left to right; the first names the row and the second describes it on phones. */
    columns: ListingColumn[]
    /** Linked rows, top to bottom. */
    rows: ListingRow[]
    /** Outlined action under the rows, leading to the full listing. */
    action?: SiteAction | null
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    action: null
  })

  const { follow } = useSiteLink()

  const nameKey = computed(() => props.columns[0]?.key ?? '')
  const detailKey = computed(() => props.columns[1]?.key ?? '')
  const footerAction = computed<SiteAction | null>(() =>
    props.action ? { kind: 'outlined', size: 'large', trailing: true, ...props.action } : null
  )
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
    class="scroll-mt-(--spacing-xxl)"
  >
    <template #header>
      <SectionTitle
        kind="left"
        :title="title"
      />
    </template>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <div class="sm:hidden">
        <ItemList>
          <Item
            v-for="row in rows"
            :key="row.href"
            class="relative px-(--spacing-xl)! py-(--spacing-lg)! hover:bg-(--bg-hover)"
          >
            <ItemContent class="gap-(--spacing-xs)">
              <ItemTitle>
                <a
                  :href="row.href"
                  class="text-pretty text-label-lg text-(--text-default) after:absolute after:inset-0 after:content-['']"
                  @click="follow($event, row.href)"
                >
                  {{ row.values[nameKey] }}
                </a>
              </ItemTitle>
              <ItemDescription
                v-if="detailKey"
                class="line-clamp-none! text-pretty"
              >
                {{ row.values[detailKey] }}
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemList>
        <div
          v-if="footerAction"
          class="flex border-t border-(--border-default) px-(--spacing-xl) py-(--spacing-lg) [&>*]:w-full"
        >
          <SectionAction :action="footerAction" />
        </div>
      </div>

      <Table class="max-sm:hidden!">
        <TableHeader>
          <TableRow>
            <TableHeadCell
              v-for="(column, index) in columns"
              :key="column.key"
              :grow="column.grow ?? 1"
              :align="column.align ?? 'start'"
              :data-edge="index === 0 ? 'start' : index === columns.length - 1 ? 'end' : null"
              class="data-[edge=end]:pr-(--spacing-xl)! data-[edge=start]:pl-(--spacing-xl)!"
            >
              <span class="text-overline-md text-(--text-muted)">{{ column.label }}</span>
            </TableHeadCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow
            v-for="row in rows"
            :key="row.href"
            class="cursor-pointer hover:[--table-row-bg:var(--bg-canvas)]"
            @click="follow($event, row.href)"
          >
            <TableCell
              v-for="(column, index) in columns"
              :key="column.key"
              :grow="column.grow ?? 1"
              :align="column.align ?? 'start'"
              :principal="index === 0"
              :data-edge="index === 0 ? 'start' : index === columns.length - 1 ? 'end' : null"
              class="py-(--spacing-lg)! text-(--text-muted) data-[edge=end]:pr-(--spacing-xl)! data-[edge=start]:pl-(--spacing-xl)!"
            >
              <a
                v-if="index === 0"
                :href="row.href"
                class="text-label-lg text-(--text-default)"
                @click.stop="follow($event, row.href)"
              >
                {{ row.values[column.key] }}
              </a>
              <template v-else>
                {{ row.values[column.key] }}
              </template>
            </TableCell>
          </TableRow>
        </TableBody>

        <template
          v-if="footerAction"
          #footer
        >
          <TableFooter>
            <div class="flex justify-end px-(--spacing-xl) py-(--spacing-lg)">
              <SectionAction :action="footerAction" />
            </div>
          </TableFooter>
        </template>
      </Table>
    </FrameBox>
  </SectionModule>
</template>
