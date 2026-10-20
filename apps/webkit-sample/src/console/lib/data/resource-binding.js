export const defaultResourceBinding = (overrides = {}) => ({
  mode: 'existing',
  existing: '',
  name: '',
  ...overrides
})

export const resourceBindingName = (binding) =>
  binding?.mode === 'new'
    ? String(binding.name ?? '').trim()
    : String(binding?.existing ?? '').trim()

export const resourceBindingIsExisting = (binding) => binding?.mode !== 'new'
