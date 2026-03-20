import FieldTextArea from '@aziontech/webkit/field-text-area';

export default {
  title: 'Core/Form/FieldTextArea',
  component: FieldTextArea,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission (required)'
    },
    value: {
      control: 'text',
      description: 'Initial value of the textarea'
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the textarea (required)'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text inside the textarea'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the textarea'
    },
    rows: {
      control: 'number',
      description: 'Number of visible text lines'
    },
    cols: {
      control: 'number',
      description: 'Visible width of the textarea'
    },
    autoResize: {
      control: 'boolean',
      description: 'Automatically resize the textarea to fit content'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the textarea'
    },
    icon: {
      control: 'text',
      description: 'Icon class to display'
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Position of the icon'
    },
    sensitive: {
      control: 'boolean',
      description: 'Marks the field as containing sensitive data'
    },
    additionalError: {
      control: 'text',
      description: 'Additional error message to display'
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading skeleton'
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
    disabled: true
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

export const AutoResize = {
  args: {
    name: 'field-textarea-autoresize',
    label: 'Auto-resize Text Area',
    placeholder: 'Type to see the textarea grow...',
    autoResize: true,
    rows: 3
  }
};

export const WithRowsAndCols = {
  args: {
    name: 'field-textarea-dimensions',
    label: 'Fixed Size Text Area',
    placeholder: 'Enter your message...',
    rows: 6,
    cols: 40
  }
};

export const WithError = {
  args: {
    name: 'field-textarea-error',
    label: 'Text Area with Error',
    placeholder: 'Enter your message...',
    additionalError: 'This field has an error'
  }
};

export const Loading = {
  args: {
    name: 'field-textarea-loading',
    label: 'Loading Text Area',
    loading: true
  }
};

export const Sensitive = {
  args: {
    name: 'field-textarea-sensitive',
    label: 'Sensitive Text Area',
    placeholder: 'Enter sensitive information...',
    sensitive: true,
    description: 'This field contains sensitive information'
  }
};
