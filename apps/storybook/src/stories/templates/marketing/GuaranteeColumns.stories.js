import ContentColumns from '@aziontech/webkit/content-columns'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const quoted = (text) => `'${text.replaceAll("'", "\\'")}'`

const objectLiteral = (item) => {
  const entries = Object.entries(item).map(([key, value]) => `${key}: ${quoted(value)}`)
  const inline = `  { ${entries.join(', ')} }`
  return inline.length <= 100
    ? inline
    : `  {\n${entries.map((entry) => `    ${entry}`).join(',\n')}\n  }`
}

const listLine = (name, items) => `const ${name} = [\n${items.map(objectLiteral).join(',\n')}\n]`

const PLATFORM_GUARANTEES = [
  {
    title: 'One platform, one bill',
    description:
      'Every product runs on the same network and the same account. Nothing to integrate, nothing to reconcile.'
  },
  {
    title: 'Provisioned in seconds',
    description:
      'A product is a capability you switch on, not infrastructure you size. Capacity follows the traffic.'
  },
  {
    title: 'Programmable end to end',
    description:
      'Every product answers to the same API, the same CLI and the same Terraform provider.'
  }
]

const PARTNER_REASONS = [
  {
    title: 'Agile',
    description:
      'Run code and deploy in minutes. From prototype to enterprise scale with NoOps, just code.'
  },
  {
    title: 'Diverse Use Cases',
    description:
      'Fraud detection, authentication and authorization, bot mitigation, and facial recognition, utilizing technologies such as visual computing and artificial intelligence executed at the edge.'
  },
  {
    title: 'Cost-Effective',
    description: 'Pricing is based on the edge resources and/or private edge locations in use.'
  }
]

const DEFAULT_IMPORTS = [
  "import ContentColumns from '@aziontech/webkit/content-columns'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  '',
  listLine('guarantees', PLATFORM_GUARANTEES)
]

const CENTERED_IMPORTS = [
  "import ContentColumns from '@aziontech/webkit/content-columns'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'",
  '',
  listLine('reasons', PARTNER_REASONS)
]

const components = {
  ContentColumns,
  FrameBox,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle
}

const DEFAULT_TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <FrameBox flush borders="y" marks="bottom">
    <ContentColumns
      eyebrow="The platform"
      title="Products, not infrastructure"
      description="Each one is a capability with an API, a console surface and a line on the same bill."
      :items="guarantees"
      :columns="3"
      class="p-(--spacing-xl)"
    />
  </FrameBox>
</SectionModule>`)

const CENTERED_TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle
      kind="centered"
      title="Why you should be a partner of the Azion Marketplace?"
      description="With the Azion Marketplace, we enable you to expand your revenue channels by offering edge-enabled solutions integrated into the Azion Edge Computing Platform. Azion is rapidly expanding the number of use cases covered by the Marketplace, which already include fraud detection, authentication and authorization, bot mitigation, and facial recognition, utilizing technologies such as visual computing and artificial intelligence executed at the edge."
    />
  </template>

  <FrameBox flush borders="y" marks="bottom">
    <ContentColumns :items="reasons" :columns="3" />
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Content/GuaranteeColumns',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The "three reasons" band: one headline and three columns, each a short point and the sentence that develops it, stating once what everything else on the page shares. Products and Solutions open their column with it right under the hero ("Products, not infrastructure", "Not a different stack"); Partners closes on it with a centred headline ("Why partner"). Built from `SectionModule`, `FrameBox`, `ContentColumns` and, for the centred headline, `SectionTitle`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => ({ guarantees: PLATFORM_GUARANTEES }),
    template: DEFAULT_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The Products page’s guarantees. `ContentColumns` sets its own eyebrowed, start-aligned headline over the columns, inside the frame.'
      },
      source: { code: toSfc(DEFAULT_IMPORTS, DEFAULT_TEMPLATE) }
    }
  }
}

export const Centered = {
  render: () => ({
    components,
    setup: () => ({ reasons: PARTNER_REASONS }),
    template: CENTERED_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The Partners page’s reasons. The headline moves out of the frame into a centred `SectionTitle` header, and `ContentColumns` carries the columns alone.'
      },
      source: { code: toSfc(CENTERED_IMPORTS, CENTERED_TEMPLATE) }
    }
  }
}
