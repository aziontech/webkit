import Breadcrumb from '@aziontech/webkit/site/breadcrumb'

export default {
  title: 'Components/Site/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
      description: 'Array of breadcrumb items with label, url, and target properties'
    }
  }
};

export const Default = {
  args: {
    data: [
      { label: 'Home', url: '/' },
      { label: 'Products', url: '/products' },
      { label: 'Edge Computing', url: '/products/edge-computing' }
    ]
  }
};

export const WithTarget = {
  args: {
    data: [
      { label: 'Home', url: '/' },
      { label: 'Documentation', url: 'https://docs.azion.com', target: '_blank' },
      { label: 'API Reference' }
    ]
  }
};

export const SingleItem = {
  args: {
    data: [
      { label: 'Dashboard' }
    ]
  }
};
