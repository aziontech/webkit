import Pagination from './pagination.vue'
import PaginationButton from './pagination-button/pagination-button.vue'
import PaginationInfo from './pagination-info/pagination-info.vue'
import PaginationPageSize from './pagination-page-size/pagination-page-size.vue'

type CompoundPagination = typeof Pagination & {
  Button: typeof PaginationButton
  Info: typeof PaginationInfo
  PageSize: typeof PaginationPageSize
}

const PaginationRoot = Object.assign(Pagination, {
  Button: PaginationButton,
  Info: PaginationInfo,
  PageSize: PaginationPageSize
}) as CompoundPagination

export default PaginationRoot
