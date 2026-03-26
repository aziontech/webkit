import TabMenu from '@aziontech/webkit/tabmenu';

export default {
  title: 'PrimeVue/TabMenu',
  component: TabMenu,
  tags: ['autodocs']
};

export const Basic = {
  args: {
    model: [
      { label: 'Home', icon: 'pi pi-home', to: '/' },
      { label: 'Calendar', icon: 'pi pi-calendar', to: '/calendar' },
      { label: 'Settings', icon: 'pi pi-cog', to: '/settings' }
    ]
  }
};

export const WithActiveIndex = {
  args: {
    activeIndex: 1,
    model: [
      { label: 'Dashboard', icon: 'pi pi-th-large' },
      { label: 'Analytics', icon: 'pi pi-chart-bar' },
      { label: 'Reports', icon: 'pi pi-file' }
    ]
  }
};

export const WithoutIcons = {
  args: {
    model: [
      { label: 'Overview' },
      { label: 'Details' },
      { label: 'History' },
      { label: 'Settings' }
    ]
  }
};
