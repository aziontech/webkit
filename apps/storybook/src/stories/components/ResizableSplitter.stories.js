import ResizableSplitter from '@aziontech/webkit/resizable-splitter';

export default {
  title: 'Components/ResizableSplitter',
  component: ResizableSplitter,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    panelSizes: {
      control: 'object',
      description: 'Initial sizes of the panels in percentages [panelA, panelB]'
    },
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Direction of the split'
    },
    minSize: {
      control: 'object',
      description: 'Minimum sizes for each panel in percentages [minA, minB]'
    },
    maxSize: {
      control: 'object',
      description: 'Maximum sizes for each panel in percentages [maxA, maxB]'
    },
    initialTopPanelPercent: {
      control: 'number',
      description: 'Initial size of top/left panel in percent (overrides panelSizes)'
    },
    initialTopPanelPixels: {
      control: 'number',
      description: 'Initial size of top/left panel in pixels'
    }
  }
};

export const Horizontal = {
  args: {
    panelSizes: [50, 50],
    direction: 'horizontal',
    minSize: [20, 20],
    maxSize: [80, 80]
  },
  render: (args) => ({
    components: { ResizableSplitter },
    setup() {
      return { args };
    },
    template: `
      <div style="height: 500px; width: 100%;">
        <ResizableSplitter v-bind="args">
          <template #panel-a>
            <div style="height: 100%; background: #1a1a1a; display: flex; align-items: center; justify-content: center;">
              <h3>Panel A (Top)</h3>
            </div>
          </template>
          <template #panel-b>
            <div style="height: 100%; background: #2a2a2a; display: flex; align-items: center; justify-content: center;">
              <h3>Panel B (Bottom)</h3>
            </div>
          </template>
        </ResizableSplitter>
      </div>
    `
  })
};

export const Vertical = {
  args: {
    panelSizes: [30, 70],
    direction: 'vertical',
    minSize: [15, 15],
    maxSize: [85, 85]
  },
  render: (args) => ({
    components: { ResizableSplitter },
    setup() {
      return { args };
    },
    template: `
      <div style="height: 500px; width: 100%;">
        <ResizableSplitter v-bind="args">
          <template #panel-a>
            <div style="height: 100%; background: #1a1a1a; display: flex; align-items: center; justify-content: center;">
              <h3>Panel A (Left)</h3>
            </div>
          </template>
          <template #panel-b>
            <div style="height: 100%; background: #2a2a2a; display: flex; align-items: center; justify-content: center;">
              <h3>Panel B (Right)</h3>
            </div>
          </template>
        </ResizableSplitter>
      </div>
    `
  })
};

export const CustomInitialSize = {
  args: {
    direction: 'vertical',
    initialTopPanelPixels: 250
  },
  render: (args) => ({
    components: { ResizableSplitter },
    setup() {
      return { args };
    },
    template: `
      <div style="height: 500px; width: 100%;">
        <ResizableSplitter v-bind="args">
          <template #panel-a>
            <div style="height: 100%; background: #1a1a1a; padding: 20px; overflow: auto;">
              <h3>Sidebar (250px initial)</h3>
              <p>This panel starts with a fixed width of 250px.</p>
            </div>
          </template>
          <template #panel-b>
            <div style="height: 100%; background: #2a2a2a; padding: 20px; display: flex; align-items: center; justify-content: center;">
              <div>
                <h3>Main Content</h3>
                <p>Drag the splitter to resize panels.</p>
              </div>
            </div>
          </template>
        </ResizableSplitter>
      </div>
    `
  })
};

export const ConstrainedSizes = {
  args: {
    direction: 'vertical',
    panelSizes: [40, 60],
    minSize: [30, 40],
    maxSize: [60, 70]
  },
  render: (args) => ({
    components: { ResizableSplitter },
    setup() {
      return { args };
    },
    template: `
      <div style="height: 500px; width: 100%;">
        <ResizableSplitter v-bind="args">
          <template #panel-a>
            <div style="height: 100%; background: #1a1a1a; padding: 20px;">
              <h3>Constrained Panel A</h3>
              <p>Min: 30% | Max: 60%</p>
            </div>
          </template>
          <template #panel-b>
            <div style="height: 100%; background: #2a2a2a; padding: 20px; display: flex; align-items: center; justify-content: center;">
              <div>
                <h3>Constrained Panel B</h3>
                <p>Min: 40% | Max: 70%</p>
              </div>
            </div>
          </template>
        </ResizableSplitter>
      </div>
    `
  })
};
