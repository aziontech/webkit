import DataTable from '@aziontech/webkit/datatable';
import Column from '@aziontech/webkit/column';

export default {
  title: 'PrimeVue/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  argTypes: {
    paginator: {
      control: 'boolean',
      description: 'Enable pagination'
    },
    rows: {
      control: 'number',
      description: 'Number of rows per page'
    }
  }
};

export const Basic = {
  render: () => ({
    components: { DataTable, Column },
    data() {
      return {
        products: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          code: `P00${i + 1}`,
          name: `Product ${i + 1}`,
          category: `Category ${String.fromCharCode(65 + (i % 3))}`,
          price: Math.floor(Math.random() * 1000) + 100
        }))
      };
    },
    template: `
      <DataTable :value="products">
        <Column field="code" header="Code"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="price" header="Price"></Column>
      </DataTable>
    `
  })
};

export const WithPagination = {
  render: () => ({
    components: { DataTable, Column },
    data() {
      return {
        products: Array.from({ length: 50 }, (_, i) => ({
          id: i + 1,
          code: `P00${i + 1}`,
          name: `Product ${i + 1}`,
          price: Math.floor(Math.random() * 1000) + 100
        }))
      };
    },
    template: `
      <DataTable :value="products" :paginator="true" :rows="10">
        <Column field="code" header="Code"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="price" header="Price"></Column>
      </DataTable>
    `
  })
};

export const Sortable = {
  render: () => ({
    components: { DataTable, Column },
    data() {
      return {
        products: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `Product ${i + 1}`,
          price: Math.floor(Math.random() * 1000) + 100,
          quantity: Math.floor(Math.random() * 100)
        }))
      };
    },
    template: `
      <DataTable :value="products" :sortable="true">
        <Column field="name" header="Name" sortable></Column>
        <Column field="price" header="Price" sortable></Column>
        <Column field="quantity" header="Quantity" sortable></Column>
      </DataTable>
    `
  })
};
