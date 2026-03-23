# @aziontech/webkit --> storybook

This is the Storybook documentation application for the `@aziontech/webkit` component library. It provides interactive documentation and development environment for all webkit components.

## Technology Stack

- **Storybook 8.x** - Component documentation tool;
- **Vue 3.5.x** - Frontend framework;
- **Vite 6.x** - Build tool;
- **PrimeVue 3.47.2** - UI component library;
- **PrimeFlex 3.3.1** - CSS utility library;
- **Tailwind CSS 3.4.x** - Utility-first CSS;
- **azion-theme 1.18.3** - Azion custom theming;
- **vee-validate 4.15.x** - Form validation;

## Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js 18.x or higher
- pnpm 10.x or higher

### Installation

From the root of the monorepo:

```bash
pnpm install
```

### Running Storybook

To start the Storybook development server:

```bash
# From the root
pnpm storybook:dev

# Or from this directory
pnpm dev
```

The Storybook will be available at `http://localhost:6006`.

### Building Storybook

To build a static version of the Storybook:

```bash
# From the root
pnpm storybook:build

# Or from this directory
pnpm build
```

The static files will be generated in the `dist` directory.

### Previewing Built Storybook

To preview the built Storybook:

```bash
pnpm preview
```

## Project Structure

```
apps/storybook/
├── .storybook/
│   ├── main.js              # Main Storybook configuration
│   └── preview.js           # Global decorators and parameters
├── src/
│   ├── stories/
│   │   ├── core/
│   │   │   ├── form/        # Form component stories
│   │   │   │   ├── FieldText.stories.js
│   │   │   │   ├── FieldDropdown.stories.js
│   │   │   │   └── ...      # Other form field stories
│   │   │   └── SelectorBlock.stories.js
│   │   └── components/
│   │       └── AzionSystemStatus.stories.js
│   └── styles/
│       └── preview.css      # Global styles
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Component Categories

### Form Components

All form components are located under `Core/Form/` in the Storybook sidebar:

- FieldText - Basic text input
- FieldTextArea - Multi-line text input
- FieldDropdown - Select dropdown
- FieldDropdownIcon - Dropdown with icons
- FieldDropdownLazyLoader - Lazy-loading dropdown
- FieldDropdownLazyLoaderDynamic - Dynamic lazy dropdown
- FieldDropdownLazyLoaderWithFilter - Lazy dropdown with filter
- FieldDropdownMultiSelectLazyLoader - Multi-select lazy dropdown
- FieldCheckboxBlock - Checkbox with label
- FieldRadioBlock - Radio button with label
- FieldSwitch - Toggle switch
- FieldSwitchBlock - Switch with label block
- FieldGroupCheckbox - Checkbox group
- FieldGroupRadio - Radio button group
- FieldGroupSwitch - Switch group
- FieldMultiSelect - Multi-select dropdown
- FieldNumber - Number input
- FieldPhoneNumber - Phone number input
- FieldPhoneNumberCountry - Phone with country selector
- FieldAutoComplete - Autocomplete input
- FieldPickList - Pick list component
- FieldInputGroup - Input with addons
- FieldTextIcon - Text input with icon
- FieldTextPassword - Password input
- FieldTextPrivacy - Privacy-sensitive input
- Label - Form label component

### Core Components

- SelectorBlock - Selection block component

### UI Components

- AzionSystemStatus - System status indicator

## Writing Stories

Stories are written using the Component Story Format (CSF). Here's an example:

```javascript
import FieldText from '@aziontech/webkit/field-text';

export default {
  title: 'Core/Form/FieldText',
  component: FieldText,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
    disabled: { control: 'boolean' }
  }
};

export const Default = {
  args: {
    name: 'field-text',
    label: 'Text Field',
    placeholder: 'Enter text...'
  }
};
```

## Adding New Stories

1. Create a new file in the appropriate directory under `src/stories/`
2. Name the file following the pattern: `ComponentName.stories.js`
3. Import the component from `@aziontech/webkit`
4. Define the default export with title, component, and argTypes
5. Export named story variants

## Testing Components

Storybook provides interactive controls for testing different prop combinations. Use the Controls panel to modify props in real-time.

## Documentation

Each component has auto-generated documentation (via `autodocs` tag) that shows:
- Component description
- Available props and their types
- Default values
- Usage examples

## Related Documentation

- [Storybook Documentation](https://storybook.js.org/docs)
- [Vue 3 Documentation](https://vuejs.org/)
- [PrimeVue Documentation](https://primevue.org/)
- [VeeValidate Documentation](https://vee-validate.logaretm.com/)

## License

MIT
