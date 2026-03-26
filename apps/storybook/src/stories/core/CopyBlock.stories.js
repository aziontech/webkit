import CopyBlock from '@aziontech/webkit/copy-block';
import { ref } from 'vue';

export default {
  title: 'Core/CopyBlock',
  component: CopyBlock,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'The content to be copied to clipboard (required)'
    },
    label: {
      control: 'text',
      description: 'Label text displayed on the button'
    },
    outlined: {
      control: 'boolean',
      description: 'Button with border (default: true)'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the copy button'
    },
    isCopyVisible: {
      control: 'boolean',
      description: 'Controls the visibility of the copy button via opacity'
    },
    copiedLabel: {
      control: 'text',
      description: 'Text displayed after copying (default: "Copied")'
    }
  }
};

export const Default = {
  args: {
    value: 'ns1.aziondns.net'
  }
};

export const WithLabel = {
  args: {
    value: 'ns1.aziondns.net',
    label: 'Copy'
  }
};

export const WithoutBorder = {
  args: {
    value: 'ns1.aziondns.net',
    outlined: false
  }
};

export const Disabled = {
  args: {
    value: 'cannot-copy-this',
    label: 'Copy',
    disabled: true
  }
};

export const VisibleOnHover = {
  render: (args) => ({
    components: { CopyBlock },
    setup() {
      const isHovered = ref(false);
      return { args, isHovered };
    },
    template: `
      <div
        class="flex items-center gap-2 p-3 border rounded-md cursor-default"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        <span>ns1.aziondns.net</span>
        <CopyBlock v-bind="args" :isCopyVisible="isHovered" />
      </div>
    `
  }),
  args: {
    value: 'ns1.aziondns.net'
  }
};
