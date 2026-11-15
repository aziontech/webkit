import Pagination from './pagination.vue'
import PaginationButton from './pagination-button/pagination-button.vue'
import PaginationDescription from './pagination-description/pagination-description.vue'
import PaginationPageSize from './pagination-page-size/pagination-page-size.vue'

type CompoundPagination = typeof Pagination & {
  Button: typeof PaginationButton
  Description: typeof PaginationDescription
  PageSize: typeof PaginationPageSize
}

const PaginationRoot = Object.assign(Pagination, {
  Button: PaginationButton,
  Description: PaginationDescription,
  PageSize: PaginationPageSize
}) as CompoundPagination

export default PaginationRoot
export type { PaginationButtonKind } from './pagination-button/pagination-button.vue'
