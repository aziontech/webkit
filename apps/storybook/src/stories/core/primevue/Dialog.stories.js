import Dialog from '@aziontech/webkit/dialog';
import Button from '@aziontech/webkit/button';
import { ref } from 'vue';

export default {
  title: 'Core/PrimeVue/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    visible: {
      control: 'boolean',
      description: 'Visibility of the dialog'
    },
    header: {
      control: 'text',
      description: 'Title content of the dialog'
    },
    modal: {
      control: 'boolean',
      description: 'Whether the dialog is modal'
    },
    closable: {
      control: 'boolean',
      description: 'Whether the dialog can be closed'
    }
  }
};

export const Basic = {
  render: () => ({
    components: { Dialog, Button },
    setup() {
      const visible = ref(false);
      return { visible };
    },
    template: `
      <div>
        <Button label="Show Dialog" @click="visible = true" />
        <Dialog v-model:visible="visible" header="Dialog Title">
          <p class="m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Dialog>
      </div>
    `
  })
};

export const Modal = {
  render: () => ({
    components: { Dialog, Button },
    setup() {
      const visible = ref(false);
      return { visible };
    },
    template: `
      <div>
        <Button label="Show Modal Dialog" @click="visible = true" />
        <Dialog v-model:visible="visible" header="Modal Dialog" :modal="true">
          <p class="m-0">This is a modal dialog. Click outside to close it.</p>
        </Dialog>
      </div>
    `
  })
};

export const WithoutHeader = {
  render: () => ({
    components: { Dialog, Button },
    setup() {
      const visible = ref(false);
      return { visible };
    },
    template: `
      <div>
        <Button label="Show Dialog" @click="visible = true" />
        <Dialog v-model:visible="visible" :showHeader="false">
          <p class="m-0">This dialog has no header.</p>
        </Dialog>
      </div>
    `
  })
};

export const WithFooter = {
  render: () => ({
    components: { Dialog, Button },
    setup() {
      const visible = ref(false);
      return { visible };
    },
    template: `
      <div>
        <Button label="Show Dialog" @click="visible = true" />
        <Dialog v-model:visible="visible" header="Confirmation" :modal="true">
          <p class="m-0">Are you sure you want to proceed?</p>
          <template #footer>
            <Button label="Cancel" icon="pi pi-times" severity="secondary" @click="visible = false" text />
            <Button label="Confirm" icon="pi pi-check" @click="visible = false" autofocus />
          </template>
        </Dialog>
      </div>
    `
  })
};
