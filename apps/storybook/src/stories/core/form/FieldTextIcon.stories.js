import FieldTextIcon from '@aziontech/webkit/field-text-icon';

export default {
  title: 'Core/Form/FieldTextIcon',
  component: FieldTextIcon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission'
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
    required: {
      control: 'boolean',
      description: 'Marks the field as required'
    },
    icon: {
      control: 'text',
      description: 'Icon class to display'
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
