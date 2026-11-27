import type { VariablesDraft, VariablesVariable } from '../edit-variables.vue'

/** A table row: the variable with its Plain or Secret type for the filter. */
export type VariablesRow = VariablesVariable & { type: string }

export const SECRET_MASK = '••••••••'

export const withType = (variable: VariablesVariable): VariablesRow => ({
  ...variable,
  type: variable.secret ? 'Secret' : 'Plain'
})

export const touched = (
  variable: Omit<VariablesVariable, 'lastEditor' | 'lastEditorAvatar' | 'lastModified'>
): VariablesRow =>
  withType({
    ...variable,
    lastEditor: 'Jane Doe',
    lastEditorAvatar: '',
    lastModified: new Date()
  })

export const updateRow = (
  rows: VariablesRow[],
  id: string,
  [changed]: VariablesDraft[]
): VariablesRow[] =>
  rows.map((variable) =>
    variable.id === id
      ? touched({
          ...variable,
          ...changed,
          value: changed.secret && !changed.value ? variable.value : changed.value
        })
      : variable
  )

export const cloneKey = (rows: VariablesRow[], key: string): string => {
  const taken = new Set(rows.map((variable) => variable.key))
  let candidate = `${key}_COPY`
  let n = 1
  while (taken.has(candidate)) candidate = `${key}_COPY_${(n += 1)}`
  return candidate
}

export const insertAfter = (
  rows: VariablesRow[],
  id: string,
  copy: VariablesRow
): VariablesRow[] => {
  const index = rows.findIndex((variable) => variable.id === id)
  return [...rows.slice(0, index + 1), copy, ...rows.slice(index + 1)]
}
