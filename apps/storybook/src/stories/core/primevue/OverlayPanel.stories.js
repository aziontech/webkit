import OverlayPanel from '@aziontech/webkit/overlaypanel';
import Button from '@aziontech/webkit/button';
import { ref } from 'vue';

export default {
  title: 'Core/PrimeVue/OverlayPanel',
  component: OverlayPanel,
  tags: ['autodocs']
};

export const Basic = {
  render: () => ({
    components: { OverlayPanel, Button },
    setup() {
      const op = ref();
      const toggle = (event) => {
        op.value.toggle(event);
      };
      return { op, toggle };
    },
    template: `
      <div>
        <Button label="Toggle Overlay" @click="toggle" />
        <OverlayPanel ref="op">
          <p class="m-0">This is an overlay panel content.</p>
        </OverlayPanel>
      </div>
    `
  })
};

export const WithContent = {
  render: () => ({
    components: { OverlayPanel, Button },
    setup() {
      const op = ref();
      const toggle = (event) => {
        op.value.toggle(event);
      };
      return { op, toggle };
    },
    template: `
      <div>
        <Button label="Show Details" icon="pi pi-info-circle" @click="toggle" />
        <OverlayPanel ref="op" class="p-4">
          <h4 class="mt-0">Details</h4>
          <p class="m-0">This panel can contain any content including forms, images, or other components.</p>
        </OverlayPanel>
      </div>
    `
  })
};
