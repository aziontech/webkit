import Chip from '@aziontech/webkit/chip';

export default {
  title: 'Core/PrimeVue/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Text to display'
    },
    icon: {
      control: 'text',
      description: 'Icon class name'
    },
    image: {
      control: 'text',
      description: 'Image source URL'
    },
    removable: {
      control: 'boolean',
      description: 'Whether the chip is removable'
    }
  }
};

export const Basic = {
  args: {
    label: 'New'
  }
};

export const WithIcon = {
  args: {
    label: 'Twitter',
    icon: 'pi pi-twitter'
  }
};

export const WithImage = {
  args: {
    label: 'Wade Cooper',
    image: 'https://primefaces.org/cdn/primevue/images/avatar/wade.png'
  }
};

export const Removable = {
  args: {
    label: 'Action',
    icon: 'pi pi-check',
    removable: true
  }
};

export const IconOnly = {
  args: {
    icon: 'pi pi-bell'
  }
};

export const MultipleChips = {
  render: () => ({
    components: { Chip },
    template: `
      <div class="flex flex-wrap gap-2">
        <Chip label="Apple" />
        <Chip label="Banana" icon="pi pi-check" />
        <Chip label="Orange" removable />
        <Chip label="Grape" image="https://primefaces.org/cdn/primevue/images/avatar/wade.png" removable />
      </div>
    `
  })
};
