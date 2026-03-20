import Card from '@aziontech/webkit/card';

export default {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs']
};

export const Default = {
  render: () => ({
    components: { Card },
    template: `
      <Card>
        <template #title>Simple Card</template>
        <template #content>
          <p class="m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </template>
      </Card>
    `
  })
};

export const WithSubtitle = {
  render: () => ({
    components: { Card },
    template: `
      <Card>
        <template #title>Card Title</template>
        <template #subtitle>Card Subtitle</template>
        <template #content>
          <p class="m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </template>
      </Card>
    `
  })
};

export const WithHeader = {
  render: () => ({
    components: { Card },
    template: `
      <Card>
        <template #header>
          <img alt="header" src="https://primefaces.org/cdn/primevue/images/card-header.jpg" class="w-full" />
        </template>
        <template #title>Advanced Card</template>
        <template #subtitle>With Image Header</template>
        <template #content>
          <p class="m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </template>
        <template #footer>
          <div class="flex gap-4 mt-1">
            <button class="p-button p-component p-button-secondary">Cancel</button>
            <button class="p-button p-component">Save</button>
          </div>
        </template>
      </Card>
    `
  })
};

export const WithFooter = {
  render: () => ({
    components: { Card },
    template: `
      <Card>
        <template #title>Card with Actions</template>
        <template #content>
          <p class="m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </template>
        <template #footer>
          <div class="flex justify-end gap-2">
            <button class="p-button p-component p-button-text p-button-secondary">Cancel</button>
            <button class="p-button p-component">Confirm</button>
          </div>
        </template>
      </Card>
    `
  })
};
