import Divider from '@aziontech/webkit/divider';

export default {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Alignment of the content'
    },
    layout: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the divider'
    },
    type: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted'],
      description: 'Border style'
    }
  }
};

export const Horizontal = {
  render: () => ({
    components: { Divider },
    template: `
      <div>
        <p class="m-0">Content above divider</p>
        <Divider />
        <p class="m-0">Content below divider</p>
      </div>
    `
  })
};

export const Vertical = {
  render: () => ({
    components: { Divider },
    template: `
      <div class="flex">
        <p class="m-0 pr-4">Left content</p>
        <Divider layout="vertical" />
        <p class="m-0 pl-4">Right content</p>
      </div>
    `
  })
};

export const WithContent = {
  render: () => ({
    components: { Divider },
    template: `
      <div>
        <p class="m-0">Section 1</p>
        <Divider align="center">
          <span class="p-tag">Centered</span>
        </Divider>
        <p class="m-0">Section 2</p>
        <Divider align="left">
          <span class="p-tag">Left</span>
        </Divider>
        <p class="m-0">Section 3</p>
        <Divider align="right">
          <span class="p-tag">Right</span>
        </Divider>
        <p class="m-0">Section 4</p>
      </div>
    `
  })
};

export const Dashed = {
  render: () => ({
    components: { Divider },
    template: `
      <div>
        <p class="m-0">Above dashed divider</p>
        <Divider type="dashed" />
        <p class="m-0">Below dashed divider</p>
      </div>
    `
  })
};
