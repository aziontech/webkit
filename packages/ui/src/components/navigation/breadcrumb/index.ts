import BreadcrumbRoot from './breadcrumb.vue'
import BreadcrumbItem from './breadcrumb-item/breadcrumb-item.vue'
import BreadcrumbList from './breadcrumb-list.vue'
import BreadcrumbSeparator from './breadcrumb-separator.vue'

type CompoundBreadcrumb = typeof BreadcrumbRoot & {
  List: typeof BreadcrumbList
  Item: typeof BreadcrumbItem
  Separator: typeof BreadcrumbSeparator
}

const Breadcrumb = Object.assign(BreadcrumbRoot, {
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Separator: BreadcrumbSeparator
}) as CompoundBreadcrumb

export default Breadcrumb
export type { BreadcrumbItemData } from './breadcrumb.vue'
export type { BreadcrumbProps } from './breadcrumb.vue'
export type { BreadcrumbItemProps } from './breadcrumb-item/breadcrumb-item.vue'
