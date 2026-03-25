import ButtonCopy from '@aziontech/webkit/button-copy';

export default {
  title: 'Components/Buttons/ButtonCopy',
  component: ButtonCopy,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Text value to copy to clipboard (required)'
    },
    label: {
      control: 'text',
      description: 'Text displayed on the button'
    },
    size: {
      control: 'select',
      options: ['', 'small', 'large'],
      description: 'Button size'
    },
    copiedLabel: {
      control: 'text',
      description: 'Text displayed after copying'
    },
    outlined: {
      control: 'boolean',
      description: 'Whether the button is outlined'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled'
    },
    isCopyVisible: {
      control: 'boolean',
      description: 'Whether the copy button is visible'
    }
  }
};

export const Default = {
  args: {
    value: 'Text to copy',
    size: '',
    outlined: true
  }
};

export const WithLabel = {
  args: {
    value: 'https://example.com/api/endpoint',
    label: 'Copy URL',
    size: '',
    outlined: true
  }
};

export const TextOnly = {
  args: {
    value: 'Copy this text',
    label: 'Copy',
    size: '',
    outlined: false
  }
};

export const Disabled = {
  args: {
    value: 'Cannot copy this',
    label: 'Copy',
    disabled: true
  }
};

export const CustomCopiedLabel = {
  args: {
    value: 'Success message',
    label: 'Copy',
    size: '',
    copiedLabel: 'Copied!',
    outlined: true
  }
};

export const HiddenByDefault = {
  args: {
    value: 'Hover to reveal',
    label: 'Copy',
    isCopyVisible: false,
    outlined: true
  }
};

export const CopyAPIKey = {
  args: {
    value: 'sk-api-key-12345-abcde-67890-fghij',
    label: 'Copy API Key',
    size: '',
    copiedLabel: 'Key Copied!',
    outlined: true
  }
};
