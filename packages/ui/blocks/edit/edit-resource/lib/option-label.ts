import type { SelectOptionItem } from '@aziontech/ui/select'

export const optionLabel =
  (options: SelectOptionItem<string | number>[]) => (value: string | number) =>
    options.find((option) => option.value === value)?.label ?? String(value)
