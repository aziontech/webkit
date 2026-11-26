import type { SelectOptionItem } from '@aziontech/webkit/select'

export const optionLabel =
  (options: SelectOptionItem<string | number>[]) => (value: string | number) =>
    options.find((option) => option.value === value)?.label ?? String(value)
