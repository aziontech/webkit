import type { ModuleHeaderAction } from '../../layout/module-header/module-header.vue'

/** Button variant of a header button of a page section. */
export type SectionActionVariant = 'secondary' | 'outline'

/** A header button of a page section, with its variant. */
export interface SectionAction extends ModuleHeaderAction {
  /** Button variant. */
  variant: SectionActionVariant
}

const shown = (action: ModuleHeaderAction | undefined): action is ModuleHeaderAction =>
  Boolean(action?.label && action.href)

export function sectionActions(
  primary: ModuleHeaderAction | undefined,
  secondary: ModuleHeaderAction | undefined,
  primaryVariant: SectionActionVariant = 'secondary'
): SectionAction[] {
  const actions: SectionAction[] = []
  if (shown(primary)) actions.push({ ...primary, variant: primaryVariant })
  if (shown(secondary)) actions.push({ ...secondary, variant: 'outline' })
  return actions
}
