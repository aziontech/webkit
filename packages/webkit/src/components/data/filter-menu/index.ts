import FilterMenuRoot from './filter-menu.vue'
import FilterMenuChips from './filter-menu-chips/filter-menu-chips.vue'

interface FilterMenuStatic {
  Chips: typeof FilterMenuChips
}

const FilterMenu = FilterMenuRoot as typeof FilterMenuRoot & FilterMenuStatic
FilterMenu.Chips = FilterMenuChips

export default FilterMenu
export { FilterMenuChips }
export type {
  FilterMenuField,
  FilterMenuFieldType,
  FilterMenuModel,
  FilterMenuOption,
  FilterMenuRange,
  FilterMenuSize,
  FilterMenuValue
} from './types'
