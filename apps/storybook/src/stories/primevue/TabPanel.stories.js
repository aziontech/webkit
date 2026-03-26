import TabView from '@aziontech/webkit/tabview';
import TabPanel from '@aziontech/webkit/tabpanel';

export default {
  title: 'PrimeVue/TabPanel',
  component: TabPanel,
  tags: ['autodocs']
};

export const Basic = {
  render: () => ({
    components: { TabView, TabPanel },
    template: `
      <TabView>
        <TabPanel header="Header I">
          <p class="m-0">Content for TabPanel I</p>
        </TabPanel>
        <TabPanel header="Header II">
          <p class="m-0">Content for TabPanel II</p>
        </TabPanel>
        <TabPanel header="Header III">
          <p class="m-0">Content for TabPanel III</p>
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
        <TabPanel header="Active">
          <p class="m-0">This tab is active.</p>
        </TabPanel>
        <TabPanel header="Disabled" :disabled="true">
          <p class="m-0">This tab is disabled.</p>
        </TabPanel>
        <TabPanel header="Active 2">
          <p class="m-0">This tab is also active.</p>
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
            <i class="pi pi-user mr-2"></i>
            <span>Profile</span>
          </template>
          <p class="m-0">Profile tab content.</p>
        </TabPanel>
        <TabPanel>
          <template #header>
            <i class="pi pi-bell mr-2"></i>
            <span>Notifications</span>
          </template>
          <p class="m-0">Notifications tab content.</p>
        </TabPanel>
      </TabView>
    `
  })
};
