import TabView from '@aziontech/webkit/tabview';
import TabPanel from '@aziontech/webkit/tabpanel';

export default {
  title: 'PrimeVue/TabView',
  component: TabView,
  tags: ['autodocs'],
  argTypes: {
    activeIndex: {
      control: 'number',
      description: 'Index of the active tab'
    },
    scrollable: {
      control: 'boolean',
      description: 'Whether tabs are scrollable'
    }
  }
};

export const Default = {
  render: () => ({
    components: { TabView, TabPanel },
    template: `
      <TabView>
        <TabPanel header="Header I">
          <p class="m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </TabPanel>
        <TabPanel header="Header II">
          <p class="m-0">Sed ut perspiciatis unde omnis iste natus error sit voluptatem.</p>
        </TabPanel>
        <TabPanel header="Header III">
          <p class="m-0">At vero eos et accusamus et iusto odio dignissimos ducimus.</p>
        </TabPanel>
      </TabView>
    `
  })
};

export const Disabled = {
  render: () => ({
    components: { TabView, TabPanel },
    template: `
      <TabView>
        <TabPanel header="Header I">
          <p class="m-0">Active tab content.</p>
        </TabPanel>
        <TabPanel header="Header II" :disabled="true">
          <p class="m-0">Disabled tab content.</p>
        </TabPanel>
        <TabPanel header="Header III">
          <p class="m-0">Active tab content.</p>
        </TabPanel>
      </TabView>
    `
  })
};

export const WithCustomHeader = {
  render: () => ({
    components: { TabView, TabPanel },
    template: `
      <TabView>
        <TabPanel>
          <template #header>
            <span class="flex items-center gap-2">
              <i class="pi pi-user"></i>
              <span>Profile</span>
            </span>
          </template>
          <p class="m-0">Profile content goes here.</p>
        </TabPanel>
        <TabPanel>
          <template #header>
            <span class="flex items-center gap-2">
              <i class="pi pi-bell"></i>
              <span>Notifications</span>
            </span>
          </template>
          <p class="m-0">Notifications content goes here.</p>
        </TabPanel>
      </TabView>
    `
  })
};
