import FieldPickList from '@aziontech/webkit/field-pick-list';

export default {
  title: 'Core/Form/FieldPickList',
  component: FieldPickList,
  tags: ['autodocs'],
  argTypes: {
    dataKey: {
      control: 'text',
      description: 'Unique key property for each item (required)'
    },
    title: {
      control: 'text',
      description: 'Title displayed in the pick list headers'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the pick list'
    },
    dataPick: {
      control: 'object',
      description: 'Initial data as [[sourceItems], [targetItems]]'
    },
    service: {
      control: false,
      description: 'Async function for loading additional data'
    }
  }
};

const sampleSourceItems = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
  { id: '3', name: 'Item 3' }
];

const sampleTargetItems = [
  { id: '4', name: 'Item 4' }
];

export const Default = {
  args: {
    dataKey: 'id',
    title: 'Items',
    dataPick: [sampleSourceItems, sampleTargetItems]
  }
};

export const Disabled = {
  args: {
    dataKey: 'id',
    title: 'Items',
    dataPick: [sampleSourceItems, sampleTargetItems],
    disabled: true
  }
};

export const Empty = {
  args: {
    dataKey: 'id',
    title: 'Items',
    dataPick: [[], []]
  }
};
