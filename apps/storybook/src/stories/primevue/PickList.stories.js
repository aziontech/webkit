import PickList from '@aziontech/webkit/picklist'
import { ref } from 'vue'

export default {
  title: 'PrimeVue/PickList',
  component: PickList,
  tags: ['autodocs'],
  argTypes: {
    showSourceControls: { control: 'boolean', description: 'Shows reorder controls in source list' },
    showTargetControls: { control: 'boolean', description: 'Shows reorder controls in target list' }
  }
}

export const Default = {
  render: () => ({
    components: { PickList },
    setup() {
      const value = ref([
        [
          { name: 'Item 1' },
          { name: 'Item 2' },
          { name: 'Item 3' },
          { name: 'Item 4' },
          { name: 'Item 5' }
        ],
        [
          { name: 'Item 6' }
        ]
      ])
      return { value }
    },
    template: `
      <PickList v-model="value" dataKey="name" breakpoint="1400px">
        <template #sourceheader>Available</template>
        <template #targetheader>Selected</template>
        <template #item="{ item }">
          <span>{{ item.name }}</span>
        </template>
      </PickList>
    `
  })
}
