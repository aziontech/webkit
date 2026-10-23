import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import FieldSelect from '@aziontech/webkit/field-select'
import FieldText from '@aziontech/webkit/field-text'
import Message from '@aziontech/webkit/message'

import { toSfc } from '../../_shared/story-source'
import { CARD_IMPORTS, cardScript, paymentMethodCard, useCard } from './_billing-markup'

const imports = (editing) => [
  ...CARD_IMPORTS,
  "import { reactive, ref } from 'vue'",
  '',
  ...cardScript(editing)
]

const DEFAULT_TEMPLATE = paymentMethodCard()

const DISABLED_TEMPLATE = paymentMethodCard('true')

const components = { Button, CardBox, FieldSelect, FieldText, Message }

const meta = {
  title: 'Templates/Platform/Account/PaymentMethodCard',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Payment Method card of the Upgrade to Pro drawer: the card on file as one bordered row with the Visa plate, the last four digits and a Change action, which swaps the row for the card form until Cancel or Update. The drawer disables it while the upgrade is submitting. Built from `CardBox`, `FieldText`, `FieldSelect`, `Message` and `Button`; the Visa plate is the console’s inline brand mark, since webkit ships no card-brand asset.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, setup: () => useCard(), template: DEFAULT_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story: 'The card on file, ending with 8888; Change opens the card form.'
      },
      source: { code: toSfc(imports(false), DEFAULT_TEMPLATE) }
    }
  }
}

export const Editing = {
  render: () => ({ components, setup: () => useCard(true), template: DEFAULT_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'After Change: cardholder, country, number, expiry and security code over the PCI notice, with Cancel and Update stacked below sm.'
      },
      source: { code: toSfc(imports(true), DEFAULT_TEMPLATE) }
    }
  }
}

export const Disabled = {
  render: () => ({ components, setup: () => useCard(), template: DISABLED_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story: 'While the upgrade submits, the Change action is disabled.'
      },
      source: { code: toSfc(imports(false), DISABLED_TEMPLATE) }
    }
  }
}
