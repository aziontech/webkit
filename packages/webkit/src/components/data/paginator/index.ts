// Compound API (see .claude/rules/compound-api.md). The explicit
// CompoundPaginator annotation makes declaration emit reference the
// sub-component types instead of expanding the root's private Props.
import PaginationButton from './pagination-button/pagination-button.vue'
import Paginator from './paginator.vue'
import PaginatorInfo from './paginator-info/paginator-info.vue'
import PaginatorPageSize from './paginator-page-size/paginator-page-size.vue'

type CompoundPaginator = typeof Paginator & {
  Button: typeof PaginationButton
  Info: typeof PaginatorInfo
  PageSize: typeof PaginatorPageSize
}

const PaginatorRoot = Object.assign(Paginator, {
  Button: PaginationButton,
  Info: PaginatorInfo,
  PageSize: PaginatorPageSize
}) as CompoundPaginator

export default PaginatorRoot
