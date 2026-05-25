/** Single group header row. */
export function dropdownMenuGroup(label) {
  return { type: 'group', label }
}
/** Action row inside the menu panel. */
export function dropdownMenuItem(label, options = {}) {
  return {
    type: 'item',
    label,
    value: options.value,
    selected: options.selected,
    disabled: options.disabled,
    icon: options.icon,
    href: options.href,
    target: options.target
  }
}
/** Horizontal divider between blocks. */
export function dropdownMenuSeparator() {
  return { type: 'separator' }
}
/**
 * Builds a flat node list from sections, inserting separators between sections
 * (matches Figma `DropdownMenu` multi-group layout).
 */
export function buildDropdownMenuSections(sections) {
  const nodes = []
  sections.forEach((section, index) => {
    if (index > 0) {
      nodes.push(dropdownMenuSeparator())
    }
    if (section.label) {
      nodes.push(dropdownMenuGroup(section.label))
    }
    section.items.forEach((item) => {
      nodes.push(item)
    })
  })
  return nodes
}
/**
 * Convenience: group label followed by item nodes.
 */
export function dropdownMenuGroupWithItems(label, items) {
  return [dropdownMenuGroup(label), ...items]
}
