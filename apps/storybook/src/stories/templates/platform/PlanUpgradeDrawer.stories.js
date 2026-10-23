import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Divider from '@aziontech/webkit/divider'
import Drawer from '@aziontech/webkit/drawer'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/drawer-portal'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import FieldCheckbox from '@aziontech/webkit/field-checkbox'
import FieldSelect from '@aziontech/webkit/field-select'
import FieldText from '@aziontech/webkit/field-text'
import Link from '@aziontech/webkit/link'
import Message from '@aziontech/webkit/message'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import SegmentedButton from '@aziontech/webkit/segmented-button'

import { toSfc } from '../../_shared/story-source'
import { PLAN_UPGRADE_DRAWER, UPGRADE_IMPORTS, upgradeScript, useUpgrade } from './_billing-markup'

const TEMPLATE = `<Button label="Upgrade to Pro" kind="primary" size="medium" @click="upgradeOpen = true" />

${PLAN_UPGRADE_DRAWER}`

const IMPORTS = [
  ...[...UPGRADE_IMPORTS].sort(),
  "import { reactive, ref, watch } from 'vue'",
  '',
  ...upgradeScript(['upgradeOpen.value = false'])
]

const components = {
  Button,
  CardBox,
  Divider,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  FieldCheckbox,
  FieldSelect,
  FieldText,
  Link,
  Message,
  PanelContent,
  PanelFooter,
  PanelHeader,
  SegmentedButton
}

const meta = {
  title: 'Templates/Platform/Account/PlanUpgradeDrawer',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Upgrade to Pro checkout drawer, opened from the Billing page’s Upgrade to Pro card and from Continue with Pro in the Change plan drawer: what the plan includes beside a Charged summary with its own Monthly or Yearly switch, the Payment Method card and the billing address, over a Cancel and Upgrade footer. Built from `Drawer`, `PanelHeader`, `PanelContent`, `PanelFooter`, `CardBox`, `SegmentedButton`, `Divider`, `Link`, `FieldText`, `FieldSelect`, `FieldCheckbox`, `Message` and `Button`; the Visa plate is the console’s inline brand mark.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => useUpgrade(),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Closed behind the Billing page’s Upgrade to Pro button; Upgrade shows its loading state for a moment and closes the drawer.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
