import FieldTextIcon from '@aziontech/webkit/field-text-icon';

export default {
  title: 'Core/Form/FieldTextIcon',
  component: FieldTextIcon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission (required)'
    },
    value: {
      control: 'text',
      description: 'Initial value of the input'
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the input'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text inside the input'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the input'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input'
    },
    readonly: {
      control: 'boolean',
      description: 'Makes the input read-only'
    },
    icon: {
      control: 'text',
      description: 'Icon class to display (e.g., "pi pi-search")'
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Position of the icon (left or right)'
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required'
    }
  }
};

export const Default = {
  args: {
    name: 'field-text-icon-default',
    label: 'Text Field with Icon',
    placeholder: 'Enter text...',
    icon: 'pi pi-search'
  }
};

export const Disabled = {
  args: {
    name: 'field-text-icon-disabled',
    label: 'Disabled Field with Icon',
    placeholder: 'Cannot edit',
    disabled: true,
    icon: 'pi pi-search'
  }
};

export const WithDescription = {
  args: {
    name: 'field-text-icon-desc',
    label: 'Search',
    placeholder: 'Search...',
    description: 'Type to search for items',
    icon: 'pi pi-search'
  }
};

export const Required = {
  args: {
    name: 'field-text-icon-required',
    label: 'Required Field',
    placeholder: 'This field is required...',
    required: true,
    icon: 'pi pi-search'
  }
};

export const IconLeft = {
  args: {
    name: 'field-text-icon-left',
    label: 'Icon on Left',
    placeholder: 'Search...',
    icon: 'pi pi-search',
    iconPosition: 'left'
  }
};

export const IconRight = {
  args: {
    name: 'field-text-icon-right',
    label: 'Icon on Right',
    placeholder: 'Enter email...',
    icon: 'pi pi-envelope',
    iconPosition: 'right'
  }
};

export const Readonly = {
  args: {
    name: 'field-text-icon-readonly',
    label: 'Read-only Field',
    value: 'Pre-filled value',
    readonly: true,
    icon: 'pi pi-lock'
  }
};
