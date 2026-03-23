import Menu from '@aziontech/webkit/menu';
import Button from '@aziontech/webkit/button';
import { ref } from 'vue';

export default {
  title: 'Core/PrimeVue/Menu',
  component: Menu,
  tags: ['autodocs']
};

export const Basic = {
  render: () => ({
    components: { Menu, Button },
    setup() {
      const menu = ref();
      const items = ref([
        { label: 'New', icon: 'pi pi-plus' },
        { label: 'Open', icon: 'pi pi-folder' },
        { separator: true },
        { label: 'Quit', icon: 'pi pi-power-off' }
      ]);

      const toggle = (event) => {
        menu.value.toggle(event);
      };

      return { menu, items, toggle };
    },
    template: `
      <div>
        <Button type="button" label="Toggle" @click="toggle" aria-haspopup="true" aria-controls="menu" />
        <Menu ref="menu" id="menu" :model="items" :popup="true" />
      </div>
    `
  })
};

export const Nested = {
  render: () => ({
    components: { Menu, Button },
    setup() {
      const menu = ref();
      const items = ref([
        {
          label: 'File',
          items: [
            { label: 'New', icon: 'pi pi-plus' },
            { label: 'Open', icon: 'pi pi-folder' }
          ]
        },
        {
          label: 'Edit',
          items: [
            { label: 'Copy', icon: 'pi pi-copy' },
            { label: 'Cut', icon: 'pi pi-scissors' }
          ]
        }
      ]);

      const toggle = (event) => {
        menu.value.toggle(event);
      };

      return { menu, items, toggle };
    },
    template: `
      <div>
        <Button type="button" label="Toggle Nested Menu" @click="toggle" />
        <Menu ref="menu" :model="items" :popup="true" />
      </div>
    `
  })
};
