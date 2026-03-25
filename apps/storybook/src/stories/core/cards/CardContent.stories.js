import CardContent from '@aziontech/webkit/card-content';

export default {
  title: 'Core/Cards/CardContent',
  component: CardContent,
  tags: ['autodocs'],
  argTypes: {
    overline: {
      control: 'text',
      description: 'Small label text displayed above the title'
    },
    title: {
      control: 'text',
      description: 'Card title'
    },
    description: {
      control: 'text',
      description: 'Card description text'
    },
    descriptionRawMarkdown: {
      control: 'text',
      description: 'Markdown content for description (takes precedence over description)'
    },
    icon: {
      control: 'text',
      description: 'Icon class name (e.g., "pi pi-check")'
    },
    link: {
      control: 'text',
      description: 'URL for the link button'
    },
    linkText: {
      control: 'text',
      description: 'Text for the link button (default: "Learn more")'
    },
    showRoundedBorder: {
      control: 'boolean',
      description: 'Show decorative bullet corners'
    },
    group: {
      control: 'boolean',
      description: 'Part of a card group'
    },
    isLast: {
      control: 'boolean',
      description: 'Is the last card in a group'
    },
    isLargeScreen: {
      control: 'boolean',
      description: 'Is large screen viewport'
    },
    isInLastRow: {
      control: 'boolean',
      description: 'Is in the last row of a card group'
    },
    showRightBullets: {
      control: 'boolean',
      description: 'Show right side bullet corners'
    }
  }
};

export const Default = {
  args: {
    title: 'Card Title',
    description: 'This is a description of the card content. It can contain additional information about the card.'
  },
  render: (args) => ({
    components: { CardContent },
    setup() {
      return { args };
    },
    template: `
      <CardContent v-bind="args" />
    `
  })
};

export const WithOverline = {
  args: {
    overline: 'FEATURE',
    title: 'Advanced Analytics',
    description: 'Gain insights with our powerful analytics dashboard. Track metrics and visualize data in real-time.'
  },
  render: (args) => ({
    components: { CardContent },
    setup() {
      return { args };
    },
    template: `
      <CardContent v-bind="args" />
    `
  })
};

export const WithIcon = {
  args: {
    icon: 'pi pi-shield',
    title: 'Security First',
    description: 'Enterprise-grade security with end-to-end encryption and compliance certifications.'
  },
  render: (args) => ({
    components: { CardContent },
    setup() {
      return { args };
    },
    template: `
      <CardContent v-bind="args" />
    `
  })
};

export const WithLink = {
  args: {
    overline: 'SOLUTION',
    title: 'Edge Computing',
    description: 'Deploy your applications at the edge for ultra-low latency responses.',
    link: '#',
    linkText: 'Learn more'
  },
  render: (args) => ({
    components: { CardContent },
    setup() {
      return { args };
    },
    template: `
      <CardContent v-bind="args" />
    `
  })
};

export const WithMarkdown = {
  args: {
    title: 'Markdown Content',
    descriptionRawMarkdown: 'This description supports **bold text**, *italic*, and `code snippets`.\\n\\n- List item 1\\n- List item 2\\n\\n> Blockquote example'
  },
  render: (args) => ({
    components: { CardContent },
    setup() {
      return { args };
    },
    template: `
      <CardContent v-bind="args" />
    `
  })
};

export const CompleteCard = {
  args: {
    overline: 'PRODUCT',
    icon: 'pi pi-bolt',
    title: 'Lightning Fast CDN',
    description: 'Deliver content at the speed of light with our global content delivery network.',
    link: '#',
    linkText: 'Get started'
  },
  render: (args) => ({
    components: { CardContent },
    setup() {
      return { args };
    },
    template: `
      <CardContent v-bind="args" />
    `
  })
};

export const WithBullets = {
  args: {
    title: 'Card with Bullet Corners',
    description: 'This card displays decorative bullet corners for special visual grouping.',
    showRoundedBorder: true,
    showRightBullets: true
  },
  render: (args) => ({
    components: { CardContent },
    setup() {
      return { args };
    },
    template: `
      <CardContent v-bind="args" />
    `
  })
};
