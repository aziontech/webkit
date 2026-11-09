import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import CardPricing from '@aziontech/webkit/card-pricing'
import Divider from '@aziontech/webkit/divider'
import Drawer from '@aziontech/webkit/drawer'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerDescription from '@aziontech/webkit/drawer-description'
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
import {
  CHANGE_PLAN_DRAWER,
  CHANGE_PLAN_IMPORTS,
  CHANGE_PLAN_SCRIPT,
  PLAN_UPGRADE_DRAWER,
  UPGRADE_IMPORTS,
  upgradeScript,
  useChangePlanFlow
} from './_billing-markup'

const TEMPLATE = `<Button label="Change Plan" kind="outlined" size="medium" @click="changePlanOpen = true" />

${CHANGE_PLAN_DRAWER}

${PLAN_UPGRADE_DRAWER}`

const IMPORTS = [
  ...[...UPGRADE_IMPORTS, ...CHANGE_PLAN_IMPORTS].sort(),
  "import { computed, reactive, ref, watch } from 'vue'",
  '',
  ...CHANGE_PLAN_SCRIPT,
  '',
  ...upgradeScript(['upgradeOpen.value = false', 'changePlanOpen.value = false'])
]

const components = {
  Button,
  CardBox,
  CardPricing,
  Divider,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
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
  title: 'Templates/Platform/Account/ChangePlanDrawer',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Change plan drawer the Billing page opens from its Subscription Plan card: a Monthly or Yearly switch over the Hobby, Pro and Enterprise `CardPricing` cards, each with its feature list and one action, on an account that is on Hobby. Continue with Pro opens the Upgrade to Pro drawer on top of it, and Contact sales closes it. Built from `Drawer`, `PanelHeader`, `PanelContent`, `SegmentedButton`, `CardPricing` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => useChangePlanFlow(),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Closed behind the Billing page’s Change Plan button; Yearly is selected, Hobby carries the Current plan tag and its action is disabled.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
