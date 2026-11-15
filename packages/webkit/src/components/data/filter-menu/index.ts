import FilterMenuRoot from './filter-menu.vue'
import FilterMenuChipGroup from './filter-menu-chip-group/filter-menu-chip-group.vue'

interface FilterMenuStatic {
  ChipGroup: typeof FilterMenuChipGroup
}

const FilterMenu = FilterMenuRoot as typeof FilterMenuRoot & FilterMenuStatic
FilterMenu.ChipGroup = FilterMenuChipGroup

export default FilterMenu
export { FilterMenuChipGroup }
export type {
  FilterMenuField,
  FilterMenuFieldKind,
  FilterMenuModel,
  FilterMenuOption,
  FilterMenuRange,
  FilterMenuSize,
  FilterMenuValue
} from './types'
