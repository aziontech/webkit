import CardContent from '@aziontech/webkit/site/card-content';

export default {
  title: 'Components/Site/CardContent',
  component: CardContent,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Card title'
    },
    description: {
      control: 'text',
      description: 'Card description'
    },
    overline: {
      control: 'text',
      description: 'Overline text above title'
    },
    link: {
      control: 'text',
      description: 'Link URL'
    },
    buttonLabel: {
      control: 'text',
      description: 'Button label text'
    }
  }
};

export const Default = {
  args: {
    title: 'Edge Functions',
    description: 'Run serverless functions at the edge for ultra-low latency responses.',
    overline: 'Serverless',
    link: '/products/edge-functions',
    buttonLabel: 'Learn more'
  }
};
