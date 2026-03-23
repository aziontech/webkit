import Tag from '@aziontech/webkit/site/tag';

export default {
  title: 'Components/Site/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Tag label text'
    },
    icon: {
      control: 'text',
      description: 'Icon class (e.g., pi pi-check)'
    }
  }
};

export const Default = {
  args: {
    label: 'Active'
  }
};

export const WithCustomIcon = {
  args: {
    label: 'Verified',
    icon: 'pi pi-check-circle'
  }
};

export const Feature = {
  args: {
    label: 'New Feature',
    icon: 'pi pi-star'
  }
};

export const Status = {
  args: {
    label: 'Beta',
    icon: 'pi pi-bolt'
  }
};
