import Button from '@aziontech/webkit/button'
import Dialog from '@aziontech/webkit/dialog'
import DialogClose from '@aziontech/webkit/dialog-close'
import DialogContent from '@aziontech/webkit/dialog-content'
import DialogDescription from '@aziontech/webkit/dialog-description'
import DialogOverlay from '@aziontech/webkit/dialog-overlay'
import DialogPortal from '@aziontech/webkit/dialog-portal'
import DialogTitle from '@aziontech/webkit/dialog-title'
import DialogTrigger from '@aziontech/webkit/dialog-trigger'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import { ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const components = {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  PanelContent,
  PanelFooter,
  PanelHeader
}

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import Dialog from '@aziontech/webkit/dialog'",
  "import DialogClose from '@aziontech/webkit/dialog-close'",
  "import DialogContent from '@aziontech/webkit/dialog-content'",
  "import DialogDescription from '@aziontech/webkit/dialog-description'",
  "import DialogOverlay from '@aziontech/webkit/dialog-overlay'",
  "import DialogPortal from '@aziontech/webkit/dialog-portal'",
  "import DialogTitle from '@aziontech/webkit/dialog-title'",
  "import DialogTrigger from '@aziontech/webkit/dialog-trigger'",
  "import PanelContent from '@aziontech/webkit/panel-content'",
  "import PanelFooter from '@aziontech/webkit/panel-footer'",
  "import PanelHeader from '@aziontech/webkit/panel-header'",
  "import { ref } from 'vue'",
  '',
  'const open = ref(false)'
]

const dialog = ({ trigger, title, body, actions }) => `<Dialog v-model:open="open" size="small">
  <DialogTrigger>
    ${trigger}
  </DialogTrigger>
  <DialogPortal>
    <DialogOverlay />
    <DialogContent>
      <PanelHeader class="w-full">
        <DialogTitle>${title}</DialogTitle>
        <DialogClose />
      </PanelHeader>
      <PanelContent>
        <DialogDescription class="m-0 text-body-sm text-(--text-muted)">
          ${body}
        </DialogDescription>
      </PanelContent>
      <PanelFooter class="flex-col md:flex-row md:justify-end">
${indent(actions, 4)}
      </PanelFooter>
    </DialogContent>
  </DialogPortal>
</Dialog>`

const CONFIRM_TEMPLATE = dialog({
  trigger: '<Button label="Remove domain" kind="outlined" size="medium" />',
  title: 'Remove domain',
  body: 'shop.example.com stops answering for this workload once you save. Traffic already pointed at it gets no response.',
  actions: `<Button class="w-full md:w-auto" label="Cancel" kind="text" size="medium" @click="open = false" />
<Button class="w-full md:w-auto" label="Remove Domain" kind="danger" size="medium" @click="open = false" />`
})

const REPURGE_TEMPLATE = dialog({
  trigger: '<Button label="Repurge" kind="outlined" size="medium" />',
  title: 'Repurge cached content?',
  body: 'This purges the same 2 URLs from the Cache layer again. Each object is fetched from your origin on its next request.',
  actions: `<Button class="w-full md:w-auto" label="Cancel" kind="text" size="medium" @click="open = false" />
<Button class="w-full md:w-auto" label="Repurge" kind="primary" size="medium" @click="open = false" />`
})

const DISCARD_TEMPLATE = dialog({
  trigger: '<Button label="Leave page" kind="outlined" size="medium" />',
  title: 'Unsaved changes',
  body: "This page has changes you haven't saved. If you leave now, they're discarded.",
  actions: `<Button class="w-full md:w-auto" label="Keep editing" kind="text" size="medium" @click="open = false" />
<Button class="w-full md:w-auto" label="Discard changes" kind="danger" size="medium" @click="open = false" />`
})

const SAVE_TEMPLATE = dialog({
  trigger: '<Button label="Switch tab" kind="outlined" size="medium" />',
  title: 'Unsaved changes',
  body: "This page has changes that haven't been saved yet. Save them before you leave, or discard them and continue.",
  actions: `<Button class="w-full md:w-auto" label="Keep editing" kind="text" size="medium" @click="open = false" />
<Button class="w-full md:w-auto" label="Discard changes" kind="outlined" size="medium" @click="open = false" />
<Button class="w-full md:w-auto" label="Save changes" kind="primary" size="medium" @click="open = false" />`
})

const meta = {
  title: 'Templates/Platform/Overlays/ConfirmDialog',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The console small confirmation dialog: a title with a close button, one sentence of description, and a Cancel plus a confirm button whose kind says how destructive the outcome is (danger for a removal, primary for a commit). The Remove domain confirmation on a workload’s Settings tab and the Repurge confirmation on Real-Time Purge render it, and the unsaved-changes guard shows the same shell when a dirty form is left (with a Save changes button when the form can be saved from there, as on the Firewall tabs). Built from `Dialog` with `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogTitle`, `DialogDescription` and `DialogClose`, `PanelHeader`, `PanelContent`, `PanelFooter` and `Button`; closed by default behind a visible trigger.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Confirm = {
  render: () => ({
    components,
    setup: () => ({ open: ref(false) }),
    template: CONFIRM_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Remove domain on a workload: a danger confirm button beside a text Cancel, with the description naming the domain and its consequence.'
      },
      source: { code: toSfc(IMPORTS, CONFIRM_TEMPLATE) }
    }
  }
}

export const DiscardChanges = {
  render: () => ({
    components,
    setup: () => ({ open: ref(false) }),
    template: DISCARD_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The unsaved-changes guard on a form that cannot be saved from the dialog: Keep editing returns to the form and the danger Discard changes leaves it.'
      },
      source: { code: toSfc(IMPORTS, DISCARD_TEMPLATE) }
    }
  }
}

export const Repurge = {
  render: () => ({
    components,
    setup: () => ({ open: ref(false) }),
    template: REPURGE_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Repurge on Real-Time Purge: a commit rather than a removal, so the confirm button is primary; the description counts what is purged again and from which layer.'
      },
      source: { code: toSfc(IMPORTS, REPURGE_TEMPLATE) }
    }
  }
}

export const SaveOrDiscard = {
  render: () => ({
    components,
    setup: () => ({ open: ref(false) }),
    template: SAVE_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The guard on a form that can be saved from the dialog, as when leaving a dirty Firewall tab: Discard changes drops to outlined and a primary Save changes saves before leaving.'
      },
      source: { code: toSfc(IMPORTS, SAVE_TEMPLATE) }
    }
  }
}
