import Sidebar from '@aziontech/webkit/sidebar';
import Button from '@aziontech/webkit/button';
import { ref } from 'vue';

export default {
  title: 'PrimeVue/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      description: 'Position of the sidebar'
    },
    visible: {
      control: 'boolean',
      description: 'Visibility of the sidebar'
    }
  }
};

export const Left = {
  render: () => ({
    components: { Sidebar, Button },
    setup() {
      const visible = ref(false);
      return { visible };
    },
    template: `
      <div>
        <Button icon="pi pi-arrow-right" @click="visible = true" />
        <Sidebar v-model:visible="visible" header="Left Sidebar">
          <p class="m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Sidebar>
      </div>
    `
  })
};

export const Right = {
  render: () => ({
    components: { Sidebar, Button },
    setup() {
      const visible = ref(false);
      return { visible };
    },
    template: `
      <div>
        <Button icon="pi pi-arrow-left" @click="visible = true" />
        <Sidebar v-model:visible="visible" position="right" header="Right Sidebar">
          <p class="m-0">This sidebar opens from the right.</p>
        </Sidebar>
      </div>
    `
  })
};

export const Top = {
  render: () => ({
    components: { Sidebar, Button },
    setup() {
      const visible = ref(false);
      return { visible };
    },
    template: `
      <div>
        <Button icon="pi pi-arrow-down" @click="visible = true" />
        <Sidebar v-model:visible="visible" position="top" header="Top Sidebar">
          <p class="m-0">This sidebar opens from the top.</p>
        </Sidebar>
      </div>
    `
  })
};

export const Bottom = {
  render: () => ({
    components: { Sidebar, Button },
    setup() {
      const visible = ref(false);
      return { visible };
    },
    template: `
      <div>
        <Button icon="pi pi-arrow-up" @click="visible = true" />
        <Sidebar v-model:visible="visible" position="bottom" header="Bottom Sidebar">
          <p class="m-0">This sidebar opens from the bottom.</p>
        </Sidebar>
      </div>
    `
  })
};
