import Toast from '@aziontech/webkit/toast';
import Button from '@aziontech/webkit/button';
import { useToast } from 'primevue/usetoast';

export default {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'center', 'top-center', 'bottom-center'],
      description: 'Position of the toast'
    }
  }
};

export const Basic = {
  render: () => ({
    components: { Toast, Button },
    setup() {
      const toast = useToast();

      const showSuccess = () => {
        toast.add({ severity: 'success', summary: 'Success', detail: 'Message Content', life: 3000 });
      };

      const showInfo = () => {
        toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
      };

      const showWarn = () => {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Message Content', life: 3000 });
      };

      const showError = () => {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Message Content', life: 3000 });
      };

      return { showSuccess, showInfo, showWarn, showError };
    },
    template: `
      <div>
        <Toast />
        <div class="flex gap-2">
          <Button label="Success" severity="success" @click="showSuccess" />
          <Button label="Info" severity="info" @click="showInfo" />
          <Button label="Warn" severity="warning" @click="showWarn" />
          <Button label="Error" severity="danger" @click="showError" />
        </div>
      </div>
    `
  })
};

export const Positions = {
  render: () => ({
    components: { Toast, Button },
    setup() {
      const toast = useToast();

      const showTopLeft = () => {
        toast.add({ severity: 'info', summary: 'Top Left', detail: 'Message Content', group: 'tl' });
      };

      const showBottomRight = () => {
        toast.add({ severity: 'info', summary: 'Bottom Right', detail: 'Message Content', group: 'br' });
      };

      return { showTopLeft, showBottomRight };
    },
    template: `
      <div>
        <Toast position="top-left" group="tl" />
        <Toast position="bottom-right" group="br" />
        <div class="flex gap-2">
          <Button label="Top Left" @click="showTopLeft" />
          <Button label="Bottom Right" @click="showBottomRight" />
        </div>
      </div>
    `
  })
};
