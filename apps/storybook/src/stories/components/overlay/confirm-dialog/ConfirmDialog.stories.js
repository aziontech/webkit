import ConfirmDialog from '@aziontech/webkit/confirm-dialog'

import Example0 from '../../../../../../../packages/webkit/examples/confirm-dialog/default.vue'
import source0 from '../../../../../../../packages/webkit/examples/confirm-dialog/default.vue?raw'
import Example1 from '../../../../../../../packages/webkit/examples/confirm-dialog/discard-changes.vue'
import source1 from '../../../../../../../packages/webkit/examples/confirm-dialog/discard-changes.vue?raw'
import Example2 from '../../../../../../../packages/webkit/examples/confirm-dialog/run-again.vue'
import source2 from '../../../../../../../packages/webkit/examples/confirm-dialog/run-again.vue?raw'
import Example3 from '../../../../../../../packages/webkit/examples/confirm-dialog/save-or-discard.vue'
import source3 from '../../../../../../../packages/webkit/examples/confirm-dialog/save-or-discard.vue?raw'

export default {
  title: 'Components/Primitives/Overlay/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' },
      description: {
        component:
          'A small confirmation dialog: a title with a close button, one sentence of description, and a Cancel plus a confirm button whose `kind` says how destructive the outcome is (`danger` for a removal or a discard, `primary` for a commit). The unsaved-changes guard uses the same shell; the `actions` slot replaces the two buttons when the guard can also save. Built from `Dialog`, `Panel` parts and `Button`.'
      }
    }
  }
}

export const Confirm = {
  render: () => ({ components: { Example: Example0 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'A removal: title, one sentence of what happens, Cancel and a danger confirm button; closed behind a visible trigger.'
      },
      source: { code: source0 }
    }
  }
}

export const DiscardChanges = {
  render: () => ({ components: { Example: Example1 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'The unsaved-changes guard on a form that cannot be saved from the dialog: Keep editing returns to the form and the danger Discard changes leaves it.'
      },
      source: { code: source1 }
    }
  }
}

export const RunAgain = {
  render: () => ({ components: { Example: Example2 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'A commit rather than a removal, so the confirm button is primary (`kind="primary"`).'
      },
      source: { code: source2 }
    }
  }
}

export const SaveOrDiscard = {
  render: () => ({ components: { Example: Example3 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'The guard on a form that can be saved from the dialog: the `actions` slot replaces the two buttons with Keep editing, an outlined Discard changes and a primary Save changes.'
      },
      source: { code: source3 }
    }
  }
}
