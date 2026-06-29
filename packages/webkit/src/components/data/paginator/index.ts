/**
 * Compound API — each sub-component stays available as its own import
 * (`@aziontech/webkit/pagination-button`, ...) and is also attached to the
 * root for dot-notation usage: `<Paginator.Button>`, `<Paginator.Info>`,
 * `<Paginator.PageSize>`.
 *
 * This is a `.ts` file so vue-tsc generates the adjacent `index.d.ts`, giving
 * `<Paginator.Button>` full type-checking. `Object.assign` keeps one source of
 * truth; the explicit `CompoundPaginator` annotation lets declaration emit
 * reference the sub-component types instead of expanding the root's private
 * `Props`. See `.claude/rules/compound-api.md`.
 */
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
