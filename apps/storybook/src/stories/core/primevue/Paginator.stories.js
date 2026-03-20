import Paginator from '@aziontech/webkit/paginator';

export default {
  title: 'Core/PrimeVue/Paginator',
  component: Paginator,
  tags: ['autodocs'],
  argTypes: {
    totalRecords: {
      control: 'number',
      description: 'Total number of records'
    },
    rows: {
      control: 'number',
      description: 'Number of rows per page'
    }
  }
};

export const Basic = {
  args: {
    totalRecords: 100,
    rows: 10,
    first: 0
  }
};

export const WithDropdown = {
  args: {
    totalRecords: 120,
    rows: 10,
    rowsPerPageOptions: [10, 20, 30, 50]
  }
};

export const CustomTemplate = {
  args: {
    totalRecords: 100,
    rows: 10,
    template: 'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
    currentPageReportTemplate: 'Showing {first} to {last} of {totalRecords} entries'
  }
};
