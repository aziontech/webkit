import AzionSystemStatus from '@aziontech/webkit/azion-system-status';

export default {
  title: 'Components/AzionSystemStatus',
  component: AzionSystemStatus,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['operational', 'degraded', 'down', 'maintenance'],
      description: 'Current system status'
    },
    message: {
      control: 'text',
      description: 'Status message to display'
    },
    lastUpdated: {
      control: 'text',
      description: 'Last update timestamp'
    }
  }
};

export const Operational = {
  args: {
    status: 'operational',
    message: 'All systems operational'
  }
};

export const Degraded = {
  args: {
    status: 'degraded',
    message: 'Some services may be experiencing issues'
  }
};

export const Down = {
  args: {
    status: 'down',
    message: 'System is currently unavailable'
  }
};

export const Maintenance = {
  args: {
    status: 'maintenance',
    message: 'Scheduled maintenance in progress'
  }
};

export const WithTimestamp = {
  args: {
    status: 'operational',
    message: 'All systems operational',
    lastUpdated: '2024-01-15 10:30 UTC'
  }
};
