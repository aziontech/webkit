import Quote from '@aziontech/webkit/site/quote';

export default { 
  title: '[tech debit] Site to Webkit/Quote',
  component: Quote,
  tags: ['autodocs'],
  argTypes: {
    testimonial: {
      control: 'text',
      description: 'Quote testimonial text'
    },
    source: {
      control: 'text',
      description: 'Quote source/author'
    },
    logo: {
      control: 'text',
      description: 'Logo image URL'
    }
  }
};

export const Default = {
  args: {
    testimonial: 'Azion has transformed our edge computing capabilities with exceptional performance.',
    source: 'John Doe, CTO at TechCorp'
  }
};

export const WithLogo = {
  args: {
    testimonial: 'The best CDN solution we have ever used. Global reach with local performance.',
    source: 'Jane Smith, Infrastructure Lead',
    logo: 'https://www.azion.com/assets/images/partners/logo-example.svg'
  }
};
