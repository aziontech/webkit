<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import { useOverlayMobile } from '../../overlay/composables/use-overlay-mobile'
  import DropdownMenu from '../../overlay/dropdown-menu/dropdown-menu.vue'
  import DropdownMenuContent from '../../overlay/dropdown-menu/dropdown-menu-content.vue'
  import DropdownMenuItem from '../../overlay/dropdown-menu/dropdown-menu-item.vue'
  import DropdownMenuTrigger from '../../overlay/dropdown-menu/dropdown-menu-trigger.vue'
  import BreadcrumbItem from '../breadcrumb-item/breadcrumb-item.vue'
  import BreadcrumbList from './breadcrumb-list.vue'
  import BreadcrumbSeparator from './breadcrumb-separator.vue'

  defineOptions({
    name: 'Breadcrumb',
    inheritAttrs: false
  })

  export interface BreadcrumbItemData {
    label: string
    href?: string
    showIcon?: boolean
    icon?: string
    current?: boolean
  }

  interface Props {
    /** Ordered path segments; the last entry is the current page when `current` is omitted. */
    items?: BreadcrumbItemData[]
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => []
  })

  const emit = defineEmits<{
    navigate: [href: string]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-breadcrumb'
  )

  const isCollapsed = useOverlayMobile()

  const resolvedItems = computed(() =>
    props.items.map((item, index) => {
      const isLast = index === props.items.length - 1
      const current = item.current ?? isLast

      return {
        ...item,
        current,
        href: item.href ?? '#'
      }
    })
  )

  const firstItem = computed(() => resolvedItems.value[0])
  const lastItem = computed(() => resolvedItems.value[resolvedItems.value.length - 1])
  const middleItems = computed(() =>
    resolvedItems.value.length > 2 ? resolvedItems.value.slice(1, -1) : []
  )

  const hasMiddleItems = computed(() => middleItems.value.length > 0)
  const showDistinctEnds = computed(
    () => resolvedItems.value.length > 1 && firstItem.value !== lastItem.value
  )

  const handleItemClick = (href: string) => {
    emit('navigate', href)
  }

  const onOverflowSelect = (href: string | undefined) => {
    if (href) {
      handleItemClick(href)
    }
  }
</script>

<template>
  <nav
    v-bind="attrs"
    :class="cn('inline-flex w-full items-center', attrs.class as string | undefined)"
    aria-label="Breadcrumb"
    :data-testid="testId"
  >
    <template v-if="items.length">
      <BreadcrumbList :data-testid="`${testId}__list`">
        <!-- Desktop: full trail -->
        <template v-if="!isCollapsed">
          <template
            v-for="(item, index) in resolvedItems"
            :key="`full-${item.label}-${index}`"
          >
            <li
              class="inline-flex items-center"
              :data-testid="`${testId}__segment-${index}`"
            >
              <BreadcrumbItem
                :label="item.label"
                :href="item.href"
                :current="item.current"
                :show-icon="item.showIcon"
                :icon="item.icon"
                :class="item.current ? 'text-[var(--text-default)]' : undefined"
                :data-testid="`${testId}__item-${index}`"
                @click="() => !item.current && handleItemClick(item.href ?? '#')"
              />
            </li>
            <BreadcrumbSeparator
              v-if="index < resolvedItems.length - 1"
              :data-testid="`${testId}__separator-${index}`"
            />
          </template>
        </template>

        <!-- Mobile: first + overflow menu + current -->
        <template v-else-if="firstItem">
          <li
            class="inline-flex items-center"
            :data-testid="`${testId}__segment-0-mobile`"
          >
            <BreadcrumbItem
              :label="firstItem.label"
              :href="firstItem.href"
              :current="firstItem.current && !showDistinctEnds"
              :show-icon="firstItem.showIcon"
              :icon="firstItem.icon"
              :class="
                firstItem.current && !showDistinctEnds ? 'text-[var(--text-default)]' : undefined
              "
              :data-testid="`${testId}__item-0`"
              @click="() => !firstItem.current && handleItemClick(firstItem.href ?? '#')"
            />
          </li>

          <template v-if="hasMiddleItems">
            <BreadcrumbSeparator :data-testid="`${testId}__separator-overflow-before`" />

            <li
              class="inline-flex items-center"
              :data-testid="`${testId}__segment-overflow`"
            >
              <DropdownMenu :data-testid="`${testId}__overflow-menu`">
                <DropdownMenuTrigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    aria-label="Show pages in between"
                    ariaLabel="Show pages in between"
                    kind="transparent"
                    size="small"
                    :data-testid="`${testId}__overflow-trigger`"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    v-for="(item, index) in middleItems"
                    :key="`${item.label}-${index}`"
                    :label="item.label"
                    :value="item.href"
                    :href="item.href"
                    :icon="item.showIcon ? item.icon : undefined"
                    :data-testid="`${testId}__overflow-item-${index}`"
                    @select="onOverflowSelect"
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </template>

          <template v-if="showDistinctEnds">
            <BreadcrumbSeparator :data-testid="`${testId}__separator-overflow-after`" />

            <li
              class="inline-flex items-center"
              :data-testid="`${testId}__segment-last-mobile`"
            >
              <BreadcrumbItem
                :label="lastItem.label"
                :href="lastItem.href"
                :current="lastItem.current"
                :show-icon="lastItem.showIcon"
                :icon="lastItem.icon"
                class="text-[var(--text-default)]"
                :data-testid="`${testId}__item-last`"
                @click="() => !lastItem.current && handleItemClick(lastItem.href ?? '#')"
              />
            </li>
          </template>
        </template>
      </BreadcrumbList>
    </template>
    <slot v-else />
  </nav>
</template>
