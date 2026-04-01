import Overline from '@aziontech/webkit/overline';

export default {
  title: 'Core/Overline',
  component: Overline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
The **Overline** component is a typographic element used to display uppercase labels with a monospace font.
It's commonly used for section headers, labels, and categorization text in the Azion design system.

### Features
- **Multiple color variants**: default, primary, muted, and black
- **Multiple sizes**: xs, sm, and lg
- **Optional blinking cursor**: Perfect for terminal-like or code-focused interfaces
- **Optional prefix**: Add a prefix before the main label (e.g., \`//\`, \`>>>\`)

### Usage
Use Overline for:
- Section headers and categorization
- Labels above titles or cards
- Terminal-style interfaces with cursor
- Code-related UI elements

\`\`\`vue
<Overline color="primary" size="sm">SECTION LABEL</Overline>
<Overline showCursor prefix="//">TERMINAL OUTPUT</Overline>
\`\`\`
`
      }
    }
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'primary', 'muted', 'black'],
      description: 'Text color variant',
      defaultValue: 'primary',
      table: {
        defaultValue: { summary: 'primary' }
      }
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'lg'],
      description: 'Text size',
      defaultValue: 'xs',
      table: {
        defaultValue: { summary: 'xs' }
      }
    },
    showCursor: {
      control: 'boolean',
      description: 'Show blinking cursor at the end of the text',
      defaultValue: false,
      table: {
        defaultValue: { summary: 'false' }
      }
    },
    prefix: {
      control: 'text',
      description: 'Prefix text before the label (e.g., "//", ">>>")',
      defaultValue: '',
      table: {
        defaultValue: { summary: '""' }
      }
    }
  }
};

export const Default = {
  args: {
    color: 'default'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: '<Overline v-bind="args">OVERLINE TEXT</Overline>'
  })
};

export const Primary = {
  args: {
    color: 'primary'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: '<Overline v-bind="args">OVERLINE TEXT</Overline>'
  })
};

export const Muted = {
  args: {
    color: 'muted'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: '<Overline v-bind="args">OVERLINE TEXT</Overline>'
  })
};

export const Black = {
  args: {
    color: 'black'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: '<Overline v-bind="args">OVERLINE TEXT</Overline>'
  })
};

export const SizeXS = {
  args: {
    size: 'xs'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: '<Overline v-bind="args">EXTRA SMALL OVERLINE</Overline>'
  })
};

export const SizeSM = {
  args: {
    size: 'sm'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: '<Overline v-bind="args">SMALL OVERLINE</Overline>'
  })
};

export const SizeLG = {
  args: {
    size: 'lg'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: '<Overline v-bind="args">LARGE OVERLINE</Overline>'
  })
};

export const WithCursor = {
  args: {
    color: 'primary',
    size: 'sm',
    showCursor: true,
    prefix: '//'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: `
      <div class="bg-gray-900 p-4 rounded">
        <Overline v-bind="args">OVERLINE TEXT</Overline>
      </div>
    `
  })
};

export const CursorWithoutPrefix = {
  args: {
    color: 'primary',
    size: 'sm',
    showCursor: true,
    prefix: ''
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: `
      <div class="bg-gray-900 p-4 rounded">
        <Overline v-bind="args">NO PREFIX</Overline>
      </div>
    `
  })
};

export const CursorCustomPrefix = {
  args: {
    color: 'primary',
    size: 'sm',
    showCursor: true,
    prefix: '>>>'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: `
      <div class="bg-gray-900 p-4 rounded">
        <Overline v-bind="args">CUSTOM PREFIX</Overline>
      </div>
    `
  })
};
