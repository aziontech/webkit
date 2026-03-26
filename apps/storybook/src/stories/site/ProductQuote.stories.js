import ProductQuote from '@aziontech/webkit/site/product-quote';

export default {
  title: '[tech debit] Site to Webkit/ProductQuote',
  component: ProductQuote,
  tags: ['autodocs'],
  argTypes: {
    quote: {
      control: 'text',
      description: 'Quote text'
    },
    author: {
      control: 'text',
      description: 'Author name'
    },
    role: {
      control: 'text',
      description: 'Author role/title'
    }
  }
};

export const Default = {
  args: {
    quote: 'Edge computing has never been more accessible. Azion makes it simple.',
    author: 'Sarah Johnson',
    role: 'VP of Engineering, TechStart'
  }
};
