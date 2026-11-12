import BreadcrumbItem from '../breadcrumb-item/breadcrumb-item.vue'
import BreadcrumbRoot from './breadcrumb.vue'
import BreadcrumbList from './breadcrumb-list.vue'
import BreadcrumbSeparator from './breadcrumb-separator.vue'

type CompoundBreadcrumb = typeof BreadcrumbRoot & {
  Root: typeof BreadcrumbRoot
  List: typeof BreadcrumbList
  Item: typeof BreadcrumbItem
  Separator: typeof BreadcrumbSeparator
}

const Breadcrumb = Object.assign(BreadcrumbRoot, {
  Root: BreadcrumbRoot,
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Separator: BreadcrumbSeparator
}) as CompoundBreadcrumb

export default Breadcrumb
export type { BreadcrumbItemData } from './breadcrumb.vue'
