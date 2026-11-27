import LinkDirectory from './link-directory.vue'
import LinkDirectoryColumn from './link-directory-column/link-directory-column.vue'
import LinkDirectoryItem from './link-directory-item/link-directory-item.vue'

type CompoundLinkDirectory = typeof LinkDirectory & {
  Column: typeof LinkDirectoryColumn
  Item: typeof LinkDirectoryItem
}

const LinkDirectoryRoot = Object.assign(LinkDirectory, {
  Column: LinkDirectoryColumn,
  Item: LinkDirectoryItem
}) as CompoundLinkDirectory

export default LinkDirectoryRoot
export { LinkDirectoryColumn, LinkDirectoryItem }
export type { LinkDirectoryColumns, LinkDirectoryMobileColumns } from './link-directory.vue'
export type { LinkDirectoryProps } from './link-directory.vue'
export type { LinkDirectoryColumnProps } from './link-directory-column/link-directory-column.vue'
export type { LinkDirectoryItemTarget } from './link-directory-item/link-directory-item.vue'
export type { LinkDirectoryItemProps } from './link-directory-item/link-directory-item.vue'
