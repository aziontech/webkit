# Storybook Stories - Missing Required Props Analysis

## Summary

This analysis compares the required props defined in Vue components at `packages/webkit/src/core/form/` with the props provided in Storybook stories at `apps/storybook/src/stories/core/form/`. Multiple stories are missing required props, which would cause Vue warnings and potentially break component functionality.

---

## Complete Required Props by Component

| Component | Required Props |
|-----------|---------------|
| field-auto-complete | `name` |
| field-checkbox-block | `nameField`, `name` |
| field-dropdown | `name` |
| field-dropdown-icon | `name` |
| field-dropdown-lazy-loader | `name`, `service`, `loadService` |
| field-dropdown-lazy-loader-dynamic | `name`, `service`, `loadService` |
| field-dropdown-lazy-loader-with-filter | `name`, `service`, `loadService` |
| field-dropdown-multi-select-lazy-loader | `name`, `service`, `loadService` |
| field-group-checkbox | `options` |
| field-group-radio | `options`, `nameField` |
| field-group-switch | `options` |
| field-input-group | `name` |
| field-multi-select | `name` |
| field-number | `name` |
| field-phone-number | none |
| field-phone-number-country | `listCountriesPhoneService` |
| field-pick-list | `dataKey` |
| field-radio-block | `nameField`, `name` |
| field-switch | `name` |
| field-switch-block | `nameField`, `name` |
| field-text | `name` |
| field-text-area | `name`, `label` |
| field-text-icon | `name` |
| field-text-password | `name` |
| field-text-privacy | `name` |
| label | `label` |

---

## Issues Found

### 1. FieldCheckboxBlock.stories.js

**Component:** [`field-checkbox-block.vue`](packages/webkit/src/core/form/field-checkbox-block/field-checkbox-block.vue:34)

**Missing Required Props:**
| Prop | Type | Description |
|------|------|-------------|
| `nameField` | String | Required for vee-validate field binding |

**Current Story Args:**
```javascript
args: {
  name: 'field-checkbox-default',
  label: 'Accept terms and conditions'
}
```

**Should Be:**
```javascript
args: {
  name: 'field-checkbox-default',
  nameField: 'field-checkbox-default', // Required - field name for form validation
  label: 'Accept terms and conditions'
}
```

---

### 2. FieldRadioBlock.stories.js

**Component:** [`field-radio-block.vue`](packages/webkit/src/core/form/field-radio-block/field-radio-block.vue:36)

**Missing Required Props:**
| Prop | Type | Description |
|------|------|-------------|
| `nameField` | String | Required for vee-validate field binding |

**Current Story Args:**
```javascript
args: {
  name: 'field-radio-block-default',
  label: 'Select this option'
}
```

**Should Be:**
```javascript
args: {
  name: 'field-radio-block-default',
  nameField: 'field-radio-block-field', // Required - field name for form validation
  label: 'Select this option'
}
```

---

### 3. FieldSwitchBlock.stories.js

**Component:** [`field-switch-block.vue`](packages/webkit/src/core/form/field-switch-block/field-switch-block.vue:37)

**Missing Required Props:**
| Prop | Type | Description |
|------|------|-------------|
| `nameField` | String | Required for vee-validate field binding |

**Current Story Args:**
```javascript
args: {
  name: 'field-switch-block-default',
  label: 'Toggle Switch Block'
}
```

**Should Be:**
```javascript
args: {
  name: 'field-switch-block-default',
  nameField: 'field-switch-block-field', // Required - field name for form validation
  label: 'Toggle Switch Block'
}
```

---

### 4. FieldGroupRadio.stories.js

**Component:** [`field-group-radio.vue`](packages/webkit/src/core/form/field-group-radio/field-group-radio.vue:11)

**Missing Required Props:**
| Prop | Type | Description |
|------|------|-------------|
| `nameField` | String | Required - field name for vee-validate binding |

**Incorrect Props:**
| Prop | Issue |
|------|-------|
| `name` | This prop does NOT exist on FieldGroupRadio - should be removed from argTypes |

**Current Story Args:**
```javascript
args: {
  name: 'field-group-radio-default',
  label: 'Select One Option',
  options: radioOptions
}
```

**Should Be:**
```javascript
args: {
  nameField: 'field-group-radio-field', // Required - field name for form validation
  label: 'Select One Option',
  options: radioOptions
}
```

**Note:** Also need to update options structure - see FieldGroupCheckbox section.

---

### 5. FieldGroupCheckbox.stories.js

**Component:** [`field-group-checkbox.vue`](packages/webkit/src/core/form/field-group-checkbox/field-group-checkbox.vue:8)

**Incorrect Props:**
| Prop | Issue |
|------|-------|
| `name` | This prop does NOT exist on FieldGroupCheckbox - should be removed from argTypes |

**Options Structure Issue:**

The `options` prop requires a specific structure for checkbox blocks. Each option needs:
- `nameField` - for vee-validate binding
- `title` or `label` - display text
- Other FieldCheckboxBlock props

**Current options:**
```javascript
const checkboxOptions = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' }
];
```

**Should Be:**
```javascript
const checkboxOptions = [
  { nameField: 'option-a', title: 'Option A', value: 'a' },
  { nameField: 'option-b', title: 'Option B', value: 'b' },
  { nameField: 'option-c', title: 'Option C', value: 'c' }
];
```

---

### 6. FieldGroupSwitch.stories.js

**Component:** [`field-group-switch.vue`](packages/webkit/src/core/form/field-group-switch/field-group-switch.vue:8)

**Incorrect Props:**
| Prop | Issue |
|------|-------|
| `name` | This prop does NOT exist on FieldGroupSwitch - should be removed from argTypes |

**Options Structure Issue:**

Similar to FieldGroupCheckbox, the `options` prop requires a specific structure for switch blocks. Each option needs:
- `nameField` - for vee-validate binding
- `title` or `label` - display text

**Current options:**
```javascript
const switchOptions = [
  { label: 'Enable Notifications', value: 'notifications' },
  { label: 'Enable Dark Mode', value: 'darkMode' },
  { label: 'Enable Auto-save', value: 'autoSave' }
];
```

**Should Be:**
```javascript
const switchOptions = [
  { nameField: 'enable-notifications', title: 'Enable Notifications', value: 'notifications' },
  { nameField: 'enable-dark-mode', title: 'Enable Dark Mode', value: 'darkMode' },
  { nameField: 'enable-auto-save', title: 'Enable Auto-save', value: 'autoSave' }
];
```

---

### 7. FieldPickList.stories.js

**Component:** [`field-pick-list.vue`](packages/webkit/src/core/form/field-pick-list/field-pick-list.vue:95)

**Missing Required Props:**
| Prop | Type | Description |
|------|------|-------------|
| `dataKey` | String | Required - unique key for each item in the pick list |

**Incorrect Props:**
| Prop | Issue |
|------|-------|
| `name` | This prop does NOT exist on FieldPickList |
| `label` | This prop does NOT exist on FieldPickList - should use `title` |
| `description` | This prop does NOT exist on FieldPickList |

**Current Story Args:**
```javascript
args: {
  name: 'field-picklist-default',
  label: 'Pick List'
}
```

**Should Be:**
```javascript
args: {
  dataKey: 'id', // Required - unique identifier key
  title: 'Items', // Optional - displayed in header
  dataPick: [[], []] // Optional - initial data
}
```

---

### 8. FieldPhoneNumberCountry.stories.js

**Component:** [`field-phone-number-country.vue`](packages/webkit/src/core/form/field-phone-number-country/field-phone-number-country.vue:6)

**Missing Required Props:**
| Prop | Type | Description |
|------|------|-------------|
| `listCountriesPhoneService` | Function | Required - async function that returns country list |

**Incorrect Props:**
| Prop | Issue |
|------|-------|
| `name` | This prop does NOT exist on FieldPhoneNumberCountry |
| `label` | This prop is passed through $attrs to FieldPhoneNumber |
| `placeholder` | This prop is passed through $attrs to FieldPhoneNumber |
| `description` | This prop is passed through $attrs to FieldPhoneNumber |
| `disabled` | This prop is passed through $attrs to FieldPhoneNumber |

**Current Story Args:**
```javascript
args: {
  name: 'field-phone-country-default',
  label: 'Phone Number with Country',
  placeholder: 'Enter phone number...'
}
```

**Should Be:**
```javascript
const mockCountriesService = async () => [
  { labelFormat: 'US +1', value: '+1' },
  { labelFormat: 'BR +55', value: '+55' },
  { labelFormat: 'UK +44', value: '+44' }
];

args: {
  listCountriesPhoneService: mockCountriesService, // Required - service function
  label: 'Phone Number with Country',
  placeholder: 'Enter phone number...'
}
```

---

### 9. FieldDropdownLazyLoader.stories.js

**Component:** [`field-dropdown-lazy-loader.vue`](packages/webkit/src/core/form/field-dropdown-lazy-loader/field-dropdown-lazy-loader.vue:10)

**Missing Required Props:**
| Prop | Type | Description |
|------|------|-------------|
| `service` | Function | Required - async function to fetch options |
| `loadService` | Function | Required - async function for initial load |

**Current Story Args:**
```javascript
args: {
  name: 'field-dropdown-lazy-default',
  label: 'Lazy Loading Dropdown',
  placeholder: 'Select an option...'
}
```

**Should Be:**
```javascript
const mockService = async (page) => {
  // Mock implementation returning paginated results
  return { data: [], total: 0 };
};

const mockLoadService = async () => {
  // Mock implementation for initial load
  return [];
};

args: {
  name: 'field-dropdown-lazy-default',
  label: 'Lazy Loading Dropdown',
  placeholder: 'Select an option...',
  service: mockService,        // Required
  loadService: mockLoadService // Required
}
```

---

### 10. FieldDropdownLazyLoaderDynamic.stories.js

**Component:** [`field-dropdown-lazy-loader-dynamic.vue`](packages/webkit/src/core/form/field-dropdown-lazy-loader-dynamic/field-dropdown-lazy-loader-dynamic.vue:112)

**Missing Required Props:**
| Prop | Type | Description |
|------|------|-------------|
| `service` | Function | Required - async function to fetch options |
| `loadService` | Function | Required - async function for initial load |

**Same fix as FieldDropdownLazyLoader.stories.js above.**

---

### 11. FieldDropdownLazyLoaderWithFilter.stories.js

**Component:** [`field-dropdown-lazy-loader-with-filter.vue`](packages/webkit/src/core/form/field-dropdown-lazy-loader-with-filter/field-dropdown-lazy-loader-with-filter.vue:122)

**Missing Required Props:**
| Prop | Type | Description |
|------|------|-------------|
| `service` | Function | Required - async function to fetch options |
| `loadService` | Function | Required - async function for initial load |

**Same fix as FieldDropdownLazyLoader.stories.js above.**

---

### 12. FieldDropdownMultiSelectLazyLoader.stories.js

**Component:** [`field-dropdown-multi-select-lazy-loader.vue`](packages/webkit/src/core/form/field-dropdown-multi-select-lazy-loader/field-dropdown-multi-select-lazy-loader.vue:10)

**Missing Required Props:**
| Prop | Type | Description |
|------|------|-------------|
| `service` | Function | Required - async function to fetch options |
| `loadService` | Function | Required - async function for initial load |

**Same fix as FieldDropdownLazyLoader.stories.js above.**

---

## Components Without Issues

The following stories correctly provide all required props:

| Story | Component | Required Props | Status |
|-------|-----------|----------------|--------|
| FieldAutoComplete.stories.js | `name` | ✅ Provided |
| FieldDropdown.stories.js | `name` | ✅ Provided |
| FieldDropdownIcon.stories.js | `name` | ✅ Provided |
| FieldDropdownLazyLoader.stories.js | `name` | ✅ Provided |
| FieldDropdownLazyLoaderDynamic.stories.js | `name` | ✅ Provided |
| FieldDropdownLazyLoaderWithFilter.stories.js | `name` | ✅ Provided |
| FieldDropdownMultiSelectLazyLoader.stories.js | `name` | ✅ Provided |
| FieldInputGroup.stories.js | `name` | ✅ Provided |
| FieldMultiSelect.stories.js | `name` | ✅ Provided |
| FieldNumber.stories.js | `name` | ✅ Provided |
| FieldPhoneNumber.stories.js | none | ✅ No required props |
| FieldSwitch.stories.js | `name` | ✅ Provided |
| FieldText.stories.js | `name` | ✅ Provided |
| FieldTextArea.stories.js | `name`, `label` | ✅ Both provided |
| FieldTextIcon.stories.js | `name` | ✅ Provided |
| FieldTextPassword.stories.js | `name` | ✅ Provided |
| FieldTextPrivacy.stories.js | `name` | ✅ Provided |
| Label.stories.js | none | ✅ No required props |

---

## Recommended Actions

1. **FieldCheckboxBlock.stories.js** - Add `nameField` prop to all stories
2. **FieldRadioBlock.stories.js** - Add `nameField` prop to all stories
3. **FieldSwitchBlock.stories.js** - Add `nameField` prop to all stories
4. **FieldGroupRadio.stories.js** - Add `nameField` prop, fix options structure
5. **FieldGroupCheckbox.stories.js** - Fix options structure with `nameField` for each option
6. **FieldGroupSwitch.stories.js** - Fix options structure with `nameField` for each option
7. **FieldPickList.stories.js** - Add `dataKey` prop, remove non-existent props
8. **FieldPhoneNumberCountry.stories.js** - Add `listCountriesPhoneService` function prop
9. **FieldDropdownLazyLoader.stories.js** - Add `service` and `loadService` function props
10. **FieldDropdownLazyLoaderDynamic.stories.js** - Add `service` and `loadService` function props
11. **FieldDropdownLazyLoaderWithFilter.stories.js** - Add `service` and `loadService` function props
12. **FieldDropdownMultiSelectLazyLoader.stories.js** - Add `service` and `loadService` function props

---

## Prop Naming Convention

Based on the codebase analysis:

- `name` - Used for DOM element ID and name attribute
- `nameField` - Used for vee-validate field binding (form validation)
- These are often different values, especially in block components that wrap multiple form elements
