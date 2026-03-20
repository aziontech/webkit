import SplitButton from '@aziontech/webkit/splitbutton';

export default {
  title: 'Core/PrimeVue/SplitButton',
  component: SplitButton,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Button label'
    },
    severity: {
      control: 'select',
      options: [undefined, 'secondary', 'success', 'info', 'warning', 'danger', 'contrast'],
      description: 'Severity type'
    }
  }
};

export const Basic = {
  args: {
    label: 'Save',
    model: [
      { label: 'Update', icon: 'pi pi-refresh' },
      { label: 'Delete', icon: 'pi pi-times' }
    ]
  }
};

export const Severities = {
  render: () => ({
    components: { SplitButton },
    data() {
      return {
        items: [
          { label: 'Update', icon: 'pi pi-refresh' },
          { label: 'Delete', icon: 'pi pi-times' }
        ]
      };
    },
    template: `
      <div class="flex flex-wrap gap-2">
        <SplitButton label="Primary" :model="items" />
        <SplitButton label="Secondary" :model="items" severity="secondary" />
        <SplitButton label="Success" :model="items" severity="success" />
        <SplitButton label="Info" :model="items" severity="info" />
      </div>
    `
  })
};

export const Outlined = {
  args: {
    label: 'Save',
    outlined: true,
    model: [
      { label: 'Save As', icon: 'pi pi-save' },
      { label: 'Export', icon: 'pi pi-download' }
    ]
  }
};
