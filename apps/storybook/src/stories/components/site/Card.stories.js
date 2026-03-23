import Card from '@aziontech/webkit/site/card';

export default {
  title: 'Components/Site/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Card title'
    },
    descriptionRawMarkdown: {
      control: 'text',
      description: 'Markdown formatted description'
    },
    href: {
      control: 'text',
      description: 'Link URL for the card'
    },
    label: {
      control: 'text',
      description: 'Button label text'
    },
    theme: {
      control: 'select',
      options: ['default'],
      description: 'Card theme (only "default" is available)'
    },
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: 'Card variant style'
    },
    icon: {
      control: 'text',
      description: 'Icon class for outline variant'
    },
    target: {
      control: 'select',
      options: ['_blank', '_self'],
      description: 'Link target'
    }
  }
};

export const Default = {
  args: {
    title: 'Card Title',
    descriptionRawMarkdown: 'This is a card description with some text content.'
  }
};

export const WithLink = {
  args: {
    title: 'Card with Link',
    descriptionRawMarkdown: 'Click the button to learn more.',
    href: 'https://azion.com',
    label: 'Learn more'
  }
};

export const Outline = {
  args: {
    title: 'Outline Card',
    descriptionRawMarkdown: 'This is an **outline** variant with *markdown* support.',
    variant: 'outline',
    icon: 'pi pi-check'
  }
};

export const OutlineWithLongText = {
  args: {
    title: 'Feature Highlight',
    descriptionRawMarkdown: 'This variant supports **markdown** formatting and includes an icon for visual emphasis.',
    variant: 'outline',
    icon: 'pi pi-star'
  }
};

export const WithExternalLink = {
  args: {
    title: 'External Resource',
    descriptionRawMarkdown: 'Opens in a new tab',
    href: 'https://docs.azion.com',
    label: 'Read Documentation',
    target: '_blank'
  }
};
