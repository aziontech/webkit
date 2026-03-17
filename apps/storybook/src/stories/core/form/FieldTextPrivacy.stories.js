import FieldTextPrivacy from '@aziontech/webkit/field-text-privacy';

export default {
  title: 'Core/Form/FieldTextPrivacy',
  component: FieldTextPrivacy,
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
    sensitive: {
      control: 'boolean',
      description: 'Marks the field as containing sensitive data'
    },
    aditionalError: {
      control: 'text',
      description: 'Additional error message to display'
    },
    isPublic: {
      control: 'boolean',
      description: 'Whether the field value is public or private'
    }
  }
};

export const Default = {
  args: {
    name: 'field-text-privacy-default',
    label: 'Private Field',
    placeholder: 'Enter private data...'
  }
};

export const Disabled = {
  args: {
    name: 'field-text-privacy-disabled',
    label: 'Disabled Privacy Field',
    placeholder: 'Cannot edit',
    disabled: true
  }
};

export const WithDescription = {
  args: {
    name: 'field-text-privacy-desc',
    label: 'Private Data',
    placeholder: 'Enter private data...',
    description: 'This data will be kept private'
  }
};

export const Public = {
  args: {
    name: 'field-text-privacy-public',
    label: 'Public Field',
    placeholder: 'Enter public data...',
    isPublic: true,
    description: 'This data is public'
  }
};

export const Private = {
  args: {
    name: 'field-text-privacy-private',
    label: 'Private Field',
    placeholder: 'Enter private data...',
    isPublic: false,
    description: 'This data is private'
  }
};

export const Sensitive = {
  args: {
    name: 'field-text-privacy-sensitive',
    label: 'Sensitive Privacy Field',
    placeholder: 'Enter sensitive data...',
    sensitive: true
  }
};

export const WithError = {
  args: {
    name: 'field-text-privacy-error',
    label: 'Privacy Field with Error',
    placeholder: 'Enter data...',
    aditionalError: 'This field has an error'
  }
};

export const Readonly = {
  args: {
    name: 'field-text-privacy-readonly',
    label: 'Read-only Privacy Field',
    value: 'Pre-filled private value',
    readonly: true
  }
};
