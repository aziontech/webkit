<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import BreadcrumbItem from '../breadcrumb-item/breadcrumb-item.vue'
  import Dropdown from '../dropdown'
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
    navigate: [event: MouseEvent, href: string]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-breadcrumb'
  )

  const isCollapsed = useBreadcrumbCollapse()

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

  const handleItemClick = (event: MouseEvent, href: string) => {
    emit('navigate', event, href)
  }

  const onOverflowSelect = (
    event: globalThis.MouseEvent | globalThis.KeyboardEvent,
    value: string | number
  ) => {
    const href = typeof value === 'string' ? value : undefined
    if (href) {
      handleItemClick(event as MouseEvent, href)
    }
  }
</script>

<template>
  <nav
    v-bind="attrs"
    :class="cn('inline-flex w-full min-w-0 items-center', attrs.class as string | undefined)"
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
                :class="item.current ? 'text-(--text-default)' : undefined"
                :data-testid="`${testId}__item-${index}`"
                @click="(event) => !item.current && handleItemClick(event, item.href ?? '#')"
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
              :class="firstItem.current && !showDistinctEnds ? 'text-(--text-default)' : undefined"
              :data-testid="`${testId}__item-0`"
              @click="
                (event) => !firstItem.current && handleItemClick(event, firstItem.href ?? '#')
              "
            />
          </li>

          <template v-if="hasMiddleItems">
            <BreadcrumbSeparator :data-testid="`${testId}__separator-overflow-before`" />

            <li
              class="inline-flex items-center"
              :data-testid="`${testId}__segment-overflow`"
            >
              <!-- `select` is the DROPDOWN's event, not the option's: `Dropdown.Option`
                   forwards its activation to the root through the injected context, and the
                   root is what emits `select(event, value)`. Bound to the option — where it
                   sat until now — the listener never fired, so picking a collapsed crumb
                   below `md` did nothing at all: the menu closed and the reader stayed on
                   the page. That is the whole trail on a phone, since the collapsed shape
                   is the only one a narrow bar renders. -->
              <Dropdown
                :data-testid="`${testId}__overflow-menu`"
                @select="onOverflowSelect"
              >
                <!-- The Trigger is itself role="button"; the icon is decorative
                     content. Nesting a real button here trips axe
                     nested-interactive. Styled to match a transparent/small
                     IconButton with the same tokens. -->
                <Dropdown.Trigger
                  aria-label="Show pages in between"
                  :data-testid="`${testId}__overflow-trigger`"
                  class="h-7 min-w-7 items-center justify-center rounded-(--shape-button) px-(--spacing-xs) text-button-md text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-mask) active:bg-(--bg-active) motion-reduce:transition-none"
                >
                  <i
                    class="pi pi-ellipsis-h size-[0.875rem]! shrink-0 text-[0.875rem]! leading-none"
                    aria-hidden="true"
                  />
                </Dropdown.Trigger>
                <Dropdown.Group>
                  <Dropdown.Option
                    v-for="(item, index) in middleItems"
                    :key="`${item.label}-${index}`"
                    :value="item.href ?? '#'"
                    :label="item.label"
                    :data-testid="`${testId}__overflow-item-${index}`"
                  >
                    <template
                      v-if="item.showIcon && item.icon"
                      #left
                    >
                      <i
                        :class="item.icon"
                        class="size-[0.875rem]! shrink-0 text-[0.875rem]! leading-none"
                        aria-hidden="true"
                      />
                    </template>
                  </Dropdown.Option>
                </Dropdown.Group>
              </Dropdown>
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
                class="text-(--text-default)"
                :data-testid="`${testId}__item-last`"
                @click="
                  (event) => !lastItem.current && handleItemClick(event, lastItem.href ?? '#')
                "
              />
            </li>
          </template>
        </template>
      </BreadcrumbList>
    </template>
    <slot v-else />
  </nav>
</template>
