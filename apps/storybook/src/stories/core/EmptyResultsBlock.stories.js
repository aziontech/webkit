import EmptyResultsBlock from '@aziontech/webkit/empty-results-block';

export default {
  title: 'Core/EmptyResultsBlock',
  component: EmptyResultsBlock,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Main title of the empty state'
    },
    description: {
      control: 'text',
      description: 'Description text below the title'
    },
    createButtonLabel: {
      control: 'text',
      description: 'Label for the create button (optional)'
    },
    disabledList: {
      control: 'boolean',
      description: 'Disable the create button'
    },
    inTabs: {
      control: 'boolean',
      description: 'Adjust styling for use within tabs'
    },
    noBorder: {
      control: 'boolean',
      description: 'Remove border from container'
    },
    noShowBorderTop: {
      control: 'boolean',
      description: 'Remove top border radius'
    },
    showLearnMoreButton: {
      control: 'boolean',
      description: 'Show the learn more button'
    },
    documentationService: {
      action: 'documentation clicked',
      description: 'Function to open documentation'
    }
  }
};

export const Default = {
  args: {
    title: 'No items yet',
    description: 'Create your first item to get started.',
    createButtonLabel: 'Create Item'
  }
};

export const DisabledButton = {
  args: {
    title: 'No results',
    description: 'You do not have permission to create items.',
    createButtonLabel: 'Create Item',
    disabledList: true
  }
};

export const NoBorder = {
  args: {
    title: 'No border variant',
    description: 'This variant has no border.',
    createButtonLabel: 'Create',
    noBorder: true
  }
};
