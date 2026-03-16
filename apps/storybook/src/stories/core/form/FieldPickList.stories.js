import FieldPickList from '@aziontech/webkit/field-pick-list';

export default {
  title: 'Core/Form/FieldPickList',
  component: FieldPickList,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission'
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the pick list'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the pick list'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the pick list'
    }
  }
};

export const Default = {
  args: {
    name: 'field-picklist-default',
    label: 'Pick List'
  }
};

export const Disabled = {
  args: {
    name: 'field-picklist-disabled',
    label: 'Disabled Pick List',
    disabled: true
  }
};

export const WithDescription = {
  args: {
    name: 'field-picklist-desc',
    label: 'Select Items',
    description: 'Move items between available and selected lists'
  }
};
