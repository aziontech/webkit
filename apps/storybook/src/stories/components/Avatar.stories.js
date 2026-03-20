import Avatar from '@aziontech/webkit/avatar';

export default {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Displays a label inside the avatar'
    },
    icon: {
      control: 'text',
      description: 'Icon class name'
    },
    image: {
      control: 'text',
      description: 'Image source URL'
    },
    size: {
      control: 'select',
      options: ['normal', 'large', 'xlarge'],
      description: 'Size of the avatar'
    },
    shape: {
      control: 'select',
      options: ['square', 'circle'],
      description: 'Shape of the avatar'
    }
  }
};

export const Label = {
  args: {
    label: 'JS'
  }
};

export const Icon = {
  args: {
    icon: 'pi pi-user',
    size: 'large'
  }
};

export const Image = {
  args: {
    image: 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png',
    size: 'xlarge'
  }
};

export const Shapes = {
  render: () => ({
    components: { Avatar },
    template: `
      <div class="flex gap-4">
        <Avatar label="A" shape="circle" />
        <Avatar label="B" shape="square" />
      </div>
    `
  })
};

export const Sizes = {
  render: () => ({
    components: { Avatar },
    template: `
      <div class="flex items-end gap-4">
        <Avatar label="A" size="normal" />
        <Avatar label="B" size="large" />
        <Avatar label="C" size="xlarge" />
      </div>
    `
  })
};

export const Group = {
  render: () => ({
    components: { Avatar },
    template: `
      <div class="flex">
        <Avatar label="A" class="mr-[-1rem]" shape="circle" />
        <Avatar label="B" class="mr-[-1rem]" shape="circle" />
        <Avatar label="C" class="mr-[-1rem]" shape="circle" />
        <Avatar label="+2" shape="circle" />
      </div>
    `
  })
};
