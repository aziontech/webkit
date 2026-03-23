import SystemStatus from '@aziontech/webkit/site/system-status';

export default {
  title: 'Components/Site/SystemStatus',
  component: SystemStatus,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['operational', 'degraded', 'down', 'maintenance'],
      description: 'Current system status'
    }
  }
};

export const Operational = {
  args: {
    status: 'operational'
  }
};

export const Degraded = {
  args: {
    status: 'degraded'
  }
};

export const Maintenance = {
  args: {
    status: 'maintenance'
  }
};
