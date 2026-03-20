import Toolbar from '@aziontech/webkit/toolbar';
import Button from '@aziontech/webkit/button';

export default {
  title: 'Components/Toolbar',
  component: Toolbar,
  tags: ['autodocs']
};

export const Default = {
  render: () => ({
    components: { Toolbar, Button },
    template: `
      <Toolbar>
        <template #start>
          <Button label="New" icon="pi pi-plus" class="mr-2" />
          <Button label="Open" icon="pi pi-folder" severity="secondary" />
        </template>
        <template #end>
          <Button icon="pi pi-search" class="mr-2" />
          <Button icon="pi pi-calendar" severity="secondary" />
        </template>
      </Toolbar>
    `
  })
};

export const WithCenter = {
  render: () => ({
    components: { Toolbar, Button },
    template: `
      <Toolbar>
        <template #start>
          <Button icon="pi pi-plus" label="Add" />
        </template>
        <template #center>
          <div class="flex gap-2">
            <Button icon="pi pi-align-left" severity="secondary" />
            <Button icon="pi pi-align-center" severity="secondary" />
            <Button icon="pi pi-align-right" severity="secondary" />
          </div>
        </template>
        <template #end>
          <Button icon="pi pi-save" label="Save" />
        </template>
      </Toolbar>
    `
  })
};

export const Simple = {
  render: () => ({
    components: { Toolbar, Button },
    template: `
      <Toolbar>
        <template #start>
          <Button icon="pi pi-menu" severity="secondary" text />
        </template>
        <template #end>
          <Button icon="pi pi-user" severity="secondary" text />
        </template>
      </Toolbar>
    `
  })
};
