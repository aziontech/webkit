<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { cn } from '../../../utils/cn'
  import { directionalIconClass } from '../../../utils/directional-icons'
  import DropdownMenu from '../dropdown-menu'
  import BreadcrumbItem from './breadcrumb-item/breadcrumb-item.vue'
  import BreadcrumbList from './breadcrumb-list.vue'
  import BreadcrumbSeparator from './breadcrumb-separator.vue'
  import { useBreadcrumbCollapse } from './composables/use-breadcrumb-collapse'

  defineOptions({
    name: 'Breadcrumb',
    inheritAttrs: false
  })

  export interface BreadcrumbItemData {
    label: string
    href?: string
    showIcon?: boolean
    icon?: string
    active?: boolean
  }

  export interface BreadcrumbProps {
    /** Ordered path segments; the last entry is the current page when `active` is omitted. */
    items?: BreadcrumbItemData[]
    /** Accessible name of the navigation landmark; empty uses the locale catalog (`Breadcrumb`). */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<BreadcrumbProps>(), {
    items: () => [],
    ariaLabel: ''
  })

  const emit = defineEmits<{
    navigate: [event: MouseEvent, href: string]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ breadcrumb: en.breadcrumb })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'breadcrumb')

  const navEl = ref<globalThis.HTMLElement | null>(null)
  const isCollapsed = useBreadcrumbCollapse(navEl)

  const resolvedItems = computed(() =>
    props.items.map((item, index) => {
      const isLast = index === props.items.length - 1
      const active = item.active ?? isLast

      return {
        ...item,
        active,
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

  const onItemClick = (event: MouseEvent, href: string) => {
    emit('navigate', event, href)
  }

  const onOverflowSelect = (
    event: globalThis.MouseEvent | globalThis.KeyboardEvent,
    value: string | number
  ) => {
    const href = typeof value === 'string' ? value : undefined
    if (href) {
      onItemClick(event as MouseEvent, href)
    }
  }
</script>

<template>
  <nav
    ref="navEl"
    v-bind="attrs"
    :class="
      cn(
        '-ms-(--spacing-xs) inline-flex w-full min-w-0 items-center',
        attrs.class as string | undefined
      )
    "
    :aria-label="ariaLabel || t('breadcrumb.label')"
    :data-testid="testId"
  >
    <template v-if="items.length">
      <BreadcrumbList :data-testid="`${testId}__list`">
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
                :active="item.active"
                :show-icon="item.showIcon"
                :icon="item.icon"
                :data-testid="`${testId}__item-${index}`"
                @click="(event) => !item.active && onItemClick(event, item.href ?? '#')"
              />
            </li>
            <BreadcrumbSeparator
              v-if="index < resolvedItems.length - 1"
              :data-testid="`${testId}__separator-${index}`"
            />
          </template>
        </template>

        <template v-else-if="firstItem">
          <li
            class="inline-flex items-center"
            :data-testid="`${testId}__segment-0-mobile`"
          >
            <BreadcrumbItem
              :label="firstItem.label"
              :href="firstItem.href"
              :active="firstItem.active && !showDistinctEnds"
              :show-icon="firstItem.showIcon"
              :icon="firstItem.icon"
              :data-testid="`${testId}__item-0`"
              @click="(event) => !firstItem.active && onItemClick(event, firstItem.href ?? '#')"
            />
          </li>

          <template v-if="hasMiddleItems">
            <BreadcrumbSeparator :data-testid="`${testId}__separator-overflow-before`" />

            <li
              class="inline-flex items-center"
              :data-testid="`${testId}__segment-overflow`"
            >
              <DropdownMenu
                :data-testid="`${testId}__overflow-menu`"
                @select="onOverflowSelect"
              >
                <DropdownMenu.Trigger
                  :aria-label="t('breadcrumb.showHidden')"
                  :data-testid="`${testId}__overflow-trigger`"
                  class="relative h-7 min-w-7 items-center justify-center rounded-(--shape-button) px-(--spacing-xs) text-button-md text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-mask) active:bg-(--bg-active) motion-reduce:transition-none"
                >
                  <i
                    class="az az-ellipsis size-[0.875rem]! shrink-0 text-[0.875rem]! leading-none"
                    aria-hidden="true"
                  />
                  <span
                    aria-hidden="true"
                    data-slot="touch-target"
                    class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    v-for="(item, index) in middleItems"
                    :key="`${item.label}-${index}`"
                    :value="item.href ?? '#'"
                    :href="item.href ?? '#'"
                    :label="item.label"
                    :data-testid="`${testId}__overflow-item-${index}`"
                  >
                    <template
                      v-if="item.showIcon && item.icon"
                      #leading
                    >
                      <i
                        :class="[item.icon, directionalIconClass(item.icon)]"
                        class="size-[0.875rem]! shrink-0 text-[0.875rem]! leading-none"
                        aria-hidden="true"
                      />
                    </template>
                  </DropdownMenu.Item>
                </DropdownMenu.Group>
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
                :active="lastItem.active"
                :show-icon="lastItem.showIcon"
                :icon="lastItem.icon"
                class="text-(--text-default)"
                :data-testid="`${testId}__item-last`"
                @click="(event) => !lastItem.active && onItemClick(event, lastItem.href ?? '#')"
              />
            </li>
          </template>
        </template>
      </BreadcrumbList>
    </template>
    <slot v-else />
  </nav>
</template>
