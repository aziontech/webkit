import Calendar from '@aziontech/webkit/calendar'
import { ref } from 'vue'

export default {
  title: 'PrimeVue/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text', description: 'Placeholder text' },
    showIcon: { control: 'boolean', description: 'Shows a calendar icon' },
    showTime: { control: 'boolean', description: 'Shows time picker' },
    disabled: { control: 'boolean', description: 'Disables the component' },
    inline: { control: 'boolean', description: 'Renders inline calendar' }
  }
}

export const Default = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref(null)
      return { value }
    },
    template: `<Calendar v-model="value" placeholder="Select a date" />`
  })
}

export const WithIcon = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref(null)
      return { value }
    },
    template: `<Calendar v-model="value" showIcon placeholder="Select a date" />`
  })
}

export const DateRange = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref(null)
      return { value }
    },
    template: `<Calendar v-model="value" selectionMode="range" placeholder="Select date range" />`
  })
}

export const WithTime = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref(null)
      return { value }
    },
    template: `<Calendar v-model="value" showTime placeholder="Select date and time" />`
  })
}

export const Inline = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref(null)
      return { value }
    },
    template: `<Calendar v-model="value" inline />`
  })
}
