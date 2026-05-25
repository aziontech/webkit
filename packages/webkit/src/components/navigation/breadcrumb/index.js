import BreadcrumbItem from '../breadcrumb-item/breadcrumb-item.vue'
import BreadcrumbRoot from './breadcrumb.vue'
import BreadcrumbList from './breadcrumb-list.vue'
import BreadcrumbSeparator from './breadcrumb-separator.vue'

const Breadcrumb = BreadcrumbRoot

Breadcrumb.Root = BreadcrumbRoot
Breadcrumb.List = BreadcrumbList
Breadcrumb.Item = BreadcrumbItem
Breadcrumb.Separator = BreadcrumbSeparator

export default Breadcrumb
