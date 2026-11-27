import FilterMenuRoot from './filter-menu.vue'
import FilterMenuChipGroup from './filter-menu-chip-group/filter-menu-chip-group.vue'

interface FilterMenuStatic {
  ChipGroup: typeof FilterMenuChipGroup
}

const FilterMenu = FilterMenuRoot as typeof FilterMenuRoot & FilterMenuStatic
FilterMenu.ChipGroup = FilterMenuChipGroup

export default FilterMenu
export { FilterMenuChipGroup }
export type { FilterMenuProps } from './filter-menu.vue'
export type { FilterMenuChipGroupProps } from './filter-menu-chip-group/filter-menu-chip-group.vue'
export type {
  FilterMenuField,
  FilterMenuFieldType,
  FilterMenuModel,
  FilterMenuOption,
  FilterMenuRange,
  FilterMenuSize,
  FilterMenuValue
} from './types'
