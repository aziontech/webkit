import CardBox from '@aziontech/webkit/card-box';

export default {
  title: 'Core/Cards/CardBox',
  component: CardBox,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Card title displayed in the header'
    }
  }
};

export const Default = {
  args: {
    title: 'Card Title'
  },
  render: (args) => ({
    components: { CardBox },
    setup() {
      return { args };
    },
    template: `
      <CardBox v-bind="args">
        <template #content>
          <p class="text-body-md text-default p-4">
            This is the card content. You can place any content here including text, forms, or other components.
          </p>
        </template>
      </CardBox>
    `
  })
};

export const WithHeaderAction = {
  args: {
    title: 'Settings'
  },
  render: (args) => ({
    components: { CardBox },
    setup() {
      return { args };
    },
    template: `
      <CardBox v-bind="args">
        <template #header-action>
          <button class="text-primary text-sm hover:text-primaryHover transition-colors">
            Edit
          </button>
        </template>
        <template #content>
          <div class="p-4">
            <p class="text-body-sm text-muted">
              Hover over the card to see the header action appear.
            </p>
          </div>
        </template>
      </CardBox>
    `
  })
};

export const WithFooter = {
  args: {
    title: 'Confirm Action'
  },
  render: (args) => ({
    components: { CardBox },
    setup() {
      return { args };
    },
    template: `
      <CardBox v-bind="args">
        <template #content>
          <div class="p-4">
            <p class="text-body-md text-default">
              Are you sure you want to proceed with this action? This cannot be undone.
            </p>
          </div>
        </template>
        <template #footer>
          <div class="flex gap-3">
            <button class="px-4 py-2 text-body-sm text-muted hover:text-default transition-colors">
              Cancel
            </button>
            <button class="px-4 py-2 text-body-sm bg-primary text-white rounded hover:bg-primaryHover transition-colors">
              Confirm
            </button>
          </div>
        </template>
      </CardBox>
    `
  })
};

export const CompleteCard = {
  args: {
    title: 'User Profile'
  },
  render: (args) => ({
    components: { CardBox },
    setup() {
      return { args };
    },
    template: `
      <CardBox v-bind="args">
        <template #header-action>
          <button class="text-primary text-sm hover:text-primaryHover transition-colors flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>
        </template>
        <template #content>
          <div class="p-4 flex flex-col gap-elements-base">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <span class="text-2xl font-bold text-white">JD</span>
              </div>
              <div>
                <h3 class="text-body-md font-semibold text-default">John Doe</h3>
                <p class="text-body-sm text-muted">john.doe@example.com</p>
              </div>
            </div>
            <div class="border-t border-default pt-3">
              <p class="text-body-sm text-muted">
                Member since January 2024
              </p>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-between w-full">
            <button class="px-4 py-2 text-body-sm text-danger hover:text-dangerHover transition-colors">
              Delete Account
            </button>
            <button class="px-4 py-2 text-body-sm bg-primary text-white rounded hover:bg-primaryHover transition-colors">
              Save Changes
            </button>
          </div>
        </template>
      </CardBox>
    `
  })
};
