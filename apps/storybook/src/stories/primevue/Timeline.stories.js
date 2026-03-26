import Timeline from '@aziontech/webkit/timeline';

export default {
  title: 'PrimeVue/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  argTypes: {
    align: {
      control: 'select',
      options: ['left', 'right', 'alternate'],
      description: 'Position of the timeline markers'
    },
    layout: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Orientation of the timeline'
    }
  }
};

export const Basic = {
  render: () => ({
    components: { Timeline },
    data() {
      return {
        events: [
          { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0' },
          { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
          { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-envelope', color: '#FF9800' },
          { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
        ]
      };
    },
    template: `
      <Timeline :value="events">
        <template #content="slotProps">
          {{ slotProps.item.status }}
        </template>
      </Timeline>
    `
  })
};

export const Opposite = {
  render: () => ({
    components: { Timeline },
    data() {
      return {
        events: [
          { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0' },
          { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
          { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-envelope', color: '#FF9800' },
          { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
        ]
      };
    },
    template: `
      <Timeline :value="events">
        <template #content="slotProps">
          <small class="p-text-secondary">{{ slotProps.item.date }}</small><br />
          {{ slotProps.item.status }}
        </template>
        <template #opposite="slotProps">
          <small class="p-text-secondary">{{ slotProps.item.date }}</small>
        </template>
      </Timeline>
    `
  })
};

export const Horizontal = {
  render: () => ({
    components: { Timeline },
    data() {
      return {
        events: [
          { status: 'Ordered', icon: 'pi pi-shopping-cart' },
          { status: 'Processing', icon: 'pi pi-cog' },
          { status: 'Shipped', icon: 'pi pi-envelope' },
          { status: 'Delivered', icon: 'pi pi-check' }
        ]
      };
    },
    template: `
      <Timeline :value="events" layout="horizontal">
        <template #content="slotProps">
          {{ slotProps.item.status }}
        </template>
      </Timeline>
    `
  })
};
