export interface DropdownMenuGroupNode {
  type: 'group'
  label: string
}

export interface DropdownMenuItemNode {
  type: 'item'
  label: string
  value?: string
  selected?: boolean
  disabled?: boolean
  icon?: string
  href?: string
  target?: '_self' | '_blank'
}

export interface DropdownMenuSeparatorNode {
  type: 'separator'
}

export type DropdownMenuNode =
  | DropdownMenuGroupNode
  | DropdownMenuItemNode
  | DropdownMenuSeparatorNode

export interface DropdownMenuItemOptions {
  value?: string
  selected?: boolean
  disabled?: boolean
  icon?: string
  href?: string
  target?: '_self' | '_blank'
}

export interface DropdownMenuSection {
  /** Optional group label; omitted for an unlabeled block (Figma top section). */
  label?: string
  items: Array<DropdownMenuItemNode | DropdownMenuSeparatorNode>
}

/** Single group header row. */
export function dropdownMenuGroup(label: string): DropdownMenuGroupNode {
  return { type: 'group', label }
}

/** Action row inside the menu panel. */
export function dropdownMenuItem(
  label: string,
  options: DropdownMenuItemOptions = {}
): DropdownMenuItemNode {
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
export function dropdownMenuSeparator(): DropdownMenuSeparatorNode {
  return { type: 'separator' }
}

/**
 * Builds a flat node list from sections, inserting separators between sections
 * (matches Figma `DropdownMenu` multi-group layout).
 */
export function buildDropdownMenuSections(sections: DropdownMenuSection[]): DropdownMenuNode[] {
  const nodes: DropdownMenuNode[] = []

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
export function dropdownMenuGroupWithItems(
  label: string,
  items: DropdownMenuItemNode[]
): DropdownMenuNode[] {
  return [dropdownMenuGroup(label), ...items]
}
