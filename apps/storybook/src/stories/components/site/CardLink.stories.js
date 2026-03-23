import CardLink from '@aziontech/webkit/site/card-link';

export default {
  title: 'Components/Site/CardLink',
  component: CardLink,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Card label'
    },
    title: {
      control: 'text',
      description: 'Card title'
    },
    description: {
      control: 'text',
      description: 'Card description'
    },
    href: {
      control: 'text',
      description: 'Link URL'
    },
    icon: {
      control: 'text',
      description: 'Icon class (e.g., pi pi-sun)'
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
    label: '',
    title: 'Documentation',
    description: 'Explore our comprehensive guides and tutorials.',
    href: '/docs',
    icon: 'pi-sun',
    target: '_self'
  }
};
