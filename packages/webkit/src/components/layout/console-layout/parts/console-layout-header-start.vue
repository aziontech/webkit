<script setup lang="ts">
  import {
    Comment,
    computed,
    Fragment,
    type FunctionalComponent,
    h,
    isVNode,
    Text,
    type VNode
  } from 'vue'

  import type { AppLinkTarget } from '../../../../composables/use-app-navigation'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import Brand from '../../../content/brand/brand.vue'
  import type { BreadcrumbItemData } from '../../../navigation/breadcrumb/breadcrumb.vue'
  import Breadcrumb from '../../../navigation/breadcrumb/breadcrumb.vue'
  import BreadcrumbItem from '../../../navigation/breadcrumb/breadcrumb-item/breadcrumb-item.vue'
  import BreadcrumbList from '../../../navigation/breadcrumb/breadcrumb-list.vue'
  import BreadcrumbSeparator from '../../../navigation/breadcrumb/breadcrumb-separator.vue'
  import Tooltip from '../../../overlay/tooltip/tooltip.vue'
  import AppHeaderBrand from '../../app-header/app-header-brand.vue'
  import type { ConsoleLayoutTrail } from '../injection-key'

  defineOptions({ name: 'ConsoleLayoutHeaderStart' })

  interface Props {
    /** Whether the layout is compact. */
    compact: boolean
    /** Where the brand mark links. */
    home: string
    /** Accessible name of the brand link. */
    homeLabel: string
    /** Accessible name of the control that opens the navigation drawer. */
    openNavigationLabel: string
    /** The trail the current page registered, if any. */
    trail: ConsoleLayoutTrail | null
    /** The trail from the layout's breadcrumbs prop. */
    breadcrumbs: BreadcrumbItemData[]
    /** Resolves the href of a crumb. */
    hrefOf: (link: AppLinkTarget) => string | undefined
    /** Follows a crumb with the app's router. */
    follow: (event: Event, link: AppLinkTarget) => void
    /** Test id of the layout that owns the header. */
    layoutTestId: string
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    /** The control that opens the navigation drawer was pressed. */
    'open-navigation': [event: MouseEvent]
  }>()

  defineSlots<{
    /** Content at the start of the header, before the breadcrumbs. */
    'header-leading'(): unknown
    /** A composed trail that replaces the one built from the breadcrumbs prop. */
    breadcrumbs(): unknown
  }>()

  const activeCrumbs = computed(() => (props.trail ? props.trail.items() : props.breadcrumbs))

  const crumbItems = computed(() =>
    activeCrumbs.value.map((crumb) => {
      const href = props.hrefOf(crumb)
      return href ? { label: crumb.label, href } : { label: crumb.label }
    })
  )

  const pageControl = computed(() => Boolean(props.trail?.hasControl()))

  const controlNodes = (children: unknown): VNode[] =>
    (Array.isArray(children) ? children : [children]).flatMap((child) => {
      if (!isVNode(child) || child.type === Comment || child.type === Text) return []
      if (child.type === Fragment) return controlNodes(child.children)
      return [child]
    })

  const PageCrumbControls: FunctionalComponent = () =>
    controlNodes(props.trail?.control()).flatMap((node, index) => [
      ...(index ? [h(BreadcrumbSeparator, { key: `separator-${index}` })] : []),
      h('li', { key: `control-${index}`, class: 'inline-flex min-w-0 items-center' }, [node])
    ])

  const onCrumbNavigate = (event: globalThis.MouseEvent, href: string) => {
    const crumb = activeCrumbs.value.find((entry) => props.hrefOf(entry) === href)
    if (crumb) props.follow(event, crumb)
  }

  const onPageCrumbClick = (event: globalThis.MouseEvent, crumb: BreadcrumbItemData) => {
    if (props.hrefOf(crumb)) props.follow(event, crumb)
  }
</script>

<template>
  <div class="flex min-w-0 items-center justify-start gap-(--spacing-xs)">
    <template v-if="compact">
      <Tooltip
        :content="openNavigationLabel"
        side="bottom"
      >
        <IconButton
          icon="az az-menu"
          :ariaLabel="openNavigationLabel"
          variant="outline"
          size="medium"
          @click="emit('open-navigation', $event)"
        />
      </Tooltip>
      <AppHeaderBrand
        v-if="!pageControl"
        :href="home"
        :aria-label="homeLabel"
        class="@max-xs:hidden px-(--spacing-2xs)"
      >
        <Brand
          variant="default"
          size="small"
        />
      </AppHeaderBrand>
    </template>
    <slot name="header-leading" />
    <div
      v-if="compact && pageControl"
      :data-testid="`${layoutTestId}__page-control`"
      class="-ms-(--spacing-xs) flex w-fit min-w-0 shrink"
    >
      <Breadcrumb class="ms-0 w-full">
        <BreadcrumbList>
          <PageCrumbControls />
        </BreadcrumbList>
      </Breadcrumb>
    </div>
    <div
      v-else-if="!compact && pageControl"
      class="-ms-(--spacing-xs) flex w-fit min-w-0 shrink"
    >
      <Breadcrumb class="ms-0 w-full">
        <BreadcrumbList>
          <template
            v-for="(crumb, index) in activeCrumbs"
            :key="`${crumb.label}-${index}`"
          >
            <li class="inline-flex items-center">
              <BreadcrumbItem
                :label="crumb.label"
                :href="hrefOf(crumb) ?? '#'"
                @click="(event) => onPageCrumbClick(event, crumb)"
              />
            </li>
            <BreadcrumbSeparator />
          </template>
          <PageCrumbControls />
        </BreadcrumbList>
      </Breadcrumb>
    </div>
    <div
      v-else-if="!compact && !trail && $slots['breadcrumbs']"
      class="-ms-(--spacing-xs) flex w-fit min-w-0 shrink *:ms-0"
    >
      <slot name="breadcrumbs" />
    </div>
    <div
      v-else-if="!compact && crumbItems.length"
      class="-ms-(--spacing-xs) flex w-fit min-w-0 shrink"
    >
      <Breadcrumb
        :items="crumbItems"
        class="ms-0 w-full"
        @navigate="onCrumbNavigate"
      />
    </div>
  </div>
</template>
