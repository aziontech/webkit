import CopyBlock from '@aziontech/webkit/copy-block';

export default {
  title: 'Components/CopyBlock',
  component: CopyBlock,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'The content to be copied to clipboard (required)'
    },
    label: {
      control: 'text',
      description: 'Label text displayed on the button. When omitted, renders as icon-only without border'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the copy button'
    }
  }
};

export const Default = {
  args: {
    value: 'ns1.aziondns.net',
    label: 'Copy'
  }
};

export const IconOnly = {
  args: {
    value: 'ns1.aziondns.net'
  }
};

export const Disabled = {
  args: {
    value: 'cannot-copy-this',
    label: 'Copy',
    disabled: true
  }
};
