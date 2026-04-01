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
- **Optional blinking cursor**: Perfect for terminal-like or code-focused interfaces
- **Preset prefixes**: Choose from \`//\`, \`<>\`, or \`</>\`

### Usage
Use Overline for:
- Section headers and categorization
- Labels above titles or cards
- Terminal-style interfaces with cursor
- Code-related UI elements

\`\`\`vue
<Overline>SECTION LABEL</Overline>
<Overline showCursor prefix="//">TERMINAL OUTPUT</Overline>
<Overline prefix="<>">CODE LABEL</Overline>
\`\`\`
`
      }
    }
  },
  argTypes: {
    showCursor: {
      control: 'boolean',
      description: 'Show blinking cursor at the end of the text',
      defaultValue: false,
      table: {
        defaultValue: { summary: 'false' }
      }
    },
    prefix: {
      control: 'select',
      options: ['', '//', '<>', '</>'],
      description: 'Preset prefix before the label',
      defaultValue: '',
      table: {
        defaultValue: { summary: '""' }
      }
    }
  }
};

export const Default = {
  args: {},
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: '<Overline v-bind="args">OVERLINE TEXT</Overline>'
  })
};

export const WithCursor = {
  args: {
    showCursor: true,
    prefix: '//'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: `
        <Overline v-bind="args">OVERLINE TEXT</Overline>
    `
  })
};

export const CursorWithoutPrefix = {
  args: {
    showCursor: true,
    prefix: ''
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: `
        <Overline v-bind="args">NO PREFIX</Overline>
    `
  })
};

export const PrefixDoubleSlash = {
  args: {
    prefix: '//'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: '<Overline v-bind="args">COMMENT STYLE</Overline>'
  })
};

export const PrefixAngleBrackets = {
  args: {
    prefix: '<>'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: '<Overline v-bind="args">CODE LABEL</Overline>'
  })
};

export const PrefixClosingTag = {
  args: {
    prefix: '</>'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: '<Overline v-bind="args">CLOSING TAG</Overline>'
  })
};
