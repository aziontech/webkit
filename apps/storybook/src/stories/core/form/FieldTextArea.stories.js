import FieldTextArea from '@aziontech/webkit/field-text-area';

export default {
  title: 'Core/Form/FieldTextArea',
  component: FieldTextArea,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission'
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the textarea'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text inside the textarea'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the textarea'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the textarea'
    },
    readonly: {
      control: 'boolean',
      description: 'Makes the textarea read-only'
    }
  }
};

export const Default = {
  args: {
    name: 'field-textarea-default',
    label: 'Text Area',
    placeholder: 'Enter your message...'
  }
};

export const Disabled = {
  args: {
    name: 'field-textarea-disabled',
    label: 'Disabled Text Area',
    placeholder: 'Cannot edit',
    disabled: true
  }
};

export const ReadOnly = {
  args: {
    name: 'field-textarea-readonly',
    label: 'Read-Only Text Area',
    value: 'This text cannot be edited.',
    readonly: true
  }
};

export const WithDescription = {
  args: {
    name: 'field-textarea-desc',
    label: 'Message',
    placeholder: 'Enter your message...',
    description: 'Write a detailed description of your request'
  }
};
