import DataTable from '@aziontech/webkit/datatable';
import Column from '@aziontech/webkit/column';

export default {
  title: 'PrimeVue/Column',
  component: Column,
  tags: ['autodocs']
};

export const Basic = {
  render: () => ({
    components: { DataTable, Column },
    data() {
      return {
        products: [
          { id: 1, code: 'P001', name: 'Product 1', category: 'Category A', price: 100 },
          { id: 2, code: 'P002', name: 'Product 2', category: 'Category B', price: 200 },
          { id: 3, code: 'P003', name: 'Product 3', category: 'Category A', price: 150 }
        ]
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

export const Sortable = {
  render: () => ({
    components: { DataTable, Column },
    data() {
      return {
        products: [
          { id: 1, code: 'P001', name: 'Laptop', price: 1000 },
          { id: 2, code: 'P002', name: 'Mouse', price: 50 },
          { id: 3, code: 'P003', name: 'Keyboard', price: 150 }
        ]
      };
    },
    template: `
      <DataTable :value="products">
        <Column field="code" header="Code" sortable></Column>
        <Column field="name" header="Name" sortable></Column>
        <Column field="price" header="Price" sortable></Column>
      </DataTable>
    `
  })
};

export const WithTemplate = {
  render: () => ({
    components: { DataTable, Column },
    data() {
      return {
        products: [
          { id: 1, name: 'Product 1', status: 'INSTOCK' },
          { id: 2, name: 'Product 2', status: 'OUTOFSTOCK' },
          { id: 3, name: 'Product 3', status: 'INSTOCK' }
        ]
      };
    },
    template: `
      <DataTable :value="products">
        <Column field="name" header="Name"></Column>
        <Column field="status" header="Status">
          <template #body="slotProps">
            <span :class="{'text-green-500': slotProps.data.status === 'INSTOCK', 'text-red-500': slotProps.data.status === 'OUTOFSTOCK'}">
              {{ slotProps.data.status }}
            </span>
          </template>
        </Column>
      </DataTable>
    `
  })
};
