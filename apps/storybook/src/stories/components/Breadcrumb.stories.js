import Breadcrumb from '@aziontech/webkit/breadcrumb';

export default {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
    home: {
      control: 'object',
      description: 'Home item configuration'
    },
    model: {
      control: 'object',
      description: 'Array of breadcrumb items'
    }
  }
};

export const Default = {
  args: {
    home: { icon: 'pi pi-home', to: '/' },
    model: [
      { label: 'Components' },
      { label: 'Breadcrumb' }
    ]
  }
};

export const WithLabels = {
  args: {
    home: { label: 'Home', to: '/' },
    model: [
      { label: 'Electronics', to: '/electronics' },
      { label: 'Computers', to: '/electronics/computers' },
      { label: 'Laptops' }
    ]
  }
};

export const WithIcons = {
  args: {
    home: { icon: 'pi pi-home', to: '/' },
    model: [
      { label: 'Files', icon: 'pi pi-folder', to: '/files' },
      { label: 'Documents', icon: 'pi pi-file', to: '/files/documents' },
      { label: 'Report.pdf', icon: 'pi pi-file-pdf' }
    ]
  }
};

export const Custom = {
  render: () => ({
    components: { Breadcrumb },
    template: `
      <Breadcrumb :home="{ icon: 'pi pi-home' }" :model="[
        { label: 'Category' },
        { label: 'Product', icon: 'pi pi-box' },
        { label: 'Details' }
      ]">
        <template #item="{ item }">
          <a :class="item.label" class="flex items-center">
            <span :class="item.icon" v-if="item.icon"></span>
            <span>{{ item.label }}</span>
          </a>
        </template>
      </Breadcrumb>
    `
  })
};
