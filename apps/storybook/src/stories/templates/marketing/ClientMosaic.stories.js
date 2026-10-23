import agibankExtendedReversed from '@aziontech/webkit/assets/agibank-extended-reversed.svg'
import dafitiExtendedMono from '@aziontech/webkit/assets/dafiti-extended-mono.svg'
import dafitiExtendedReversed from '@aziontech/webkit/assets/dafiti-extended-reversed.svg'
import exameExtendedMono from '@aziontech/webkit/assets/exame-extended-mono.svg'
import fourbankExtendedReversed from '@aziontech/webkit/assets/fourbank-extended-reversed.svg'
import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'
import gpaPhoto from '@aziontech/webkit/assets/gpa-photo.jpg'
import madeiramadeiraExtendedReversed from '@aziontech/webkit/assets/madeiramadeira-extended-reversed.svg'
import magaluExtendedColor from '@aziontech/webkit/assets/magalu-extended-color.svg'
import netshoesExtendedColor from '@aziontech/webkit/assets/netshoes-extended-color.svg'
import netshoesPhoto from '@aziontech/webkit/assets/netshoes-photo.jpg'
import nznExtendedReversed from '@aziontech/webkit/assets/nzn-extended-reversed.svg'
import rennerExtendedReversed from '@aziontech/webkit/assets/renner-extended-reversed.svg'
import BentoGrid from '@aziontech/webkit/bento-grid'
import FrameBox from '@aziontech/webkit/frame-box'
import LogoWall from '@aziontech/webkit/logo-wall'
import MiniButton from '@aziontech/webkit/mini-button'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'

import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import agibankExtendedReversed from '@aziontech/webkit/assets/agibank-extended-reversed.svg'",
  "import dafitiExtendedMono from '@aziontech/webkit/assets/dafiti-extended-mono.svg'",
  "import exameExtendedMono from '@aziontech/webkit/assets/exame-extended-mono.svg'",
  "import fourbankExtendedReversed from '@aziontech/webkit/assets/fourbank-extended-reversed.svg'",
  "import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'",
  "import gpaPhoto from '@aziontech/webkit/assets/gpa-photo.jpg'",
  "import netshoesExtendedColor from '@aziontech/webkit/assets/netshoes-extended-color.svg'",
  "import netshoesPhoto from '@aziontech/webkit/assets/netshoes-photo.jpg'",
  "import nznExtendedReversed from '@aziontech/webkit/assets/nzn-extended-reversed.svg'",
  "import rennerExtendedReversed from '@aziontech/webkit/assets/renner-extended-reversed.svg'",
  "import BentoGrid from '@aziontech/webkit/bento-grid'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import MiniButton from '@aziontech/webkit/mini-button'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'"
]

const components = {
  BentoGrid,
  'BentoGrid.Cell': BentoGrid.Cell,
  FrameBox,
  MiniButton,
  SectionContainer,
  SectionGap,
  SectionModule
}

const setup = () => ({
  agibankExtendedReversed,
  dafitiExtendedMono,
  exameExtendedMono,
  fourbankExtendedReversed,
  gpaExtendedReversed,
  gpaPhoto,
  netshoesExtendedColor,
  netshoesPhoto,
  nznExtendedReversed,
  rennerExtendedReversed
})

const MONOCHROME = 'brightness-0 [[data-theme=dark]_&]:invert'
const KNOCKOUT = 'brightness-0'

const CELLS = [
  {
    name: 'Netshoes',
    span: '2',
    rows: '2',
    fill: 'surface',
    logo: 'netshoesExtendedColor',
    filter: MONOCHROME,
    mark: 'relative z-10 h-6 w-auto max-w-32 object-contain object-left',
    photo: 'netshoesPhoto',
    story: 'Netshoes automatically blocks more than 4 million threats in six months',
    storyClass: 'text-heading-md',
    href: 'https://www.azion.com/en/success-case/netshoes/'
  },
  {
    name: 'Dafiti',
    span: '1',
    rows: '1',
    fill: 'white',
    logo: 'dafitiExtendedMono',
    filter: KNOCKOUT,
    mark: 'relative z-10 h-8 w-auto max-w-36 object-contain',
    href: 'https://www.azion.com/en/success-case/dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application/'
  },
  {
    name: 'Agibank',
    span: '1',
    rows: '1',
    fill: 'canvas',
    logo: 'agibankExtendedReversed',
    filter: MONOCHROME,
    mark: 'relative z-10 h-8 w-auto max-w-36 object-contain',
    href: 'https://www.azion.com/en/success-case/agibank/'
  },
  {
    name: 'Renner',
    span: '1',
    rows: '1',
    fill: 'canvas',
    logo: 'rennerExtendedReversed',
    filter: MONOCHROME,
    mark: 'relative z-10 h-8 w-auto max-w-36 object-contain',
    href: 'https://www.azion.com/en/success-case/renner/'
  },
  {
    name: 'GPA',
    span: '1',
    rows: '2',
    fill: 'surface',
    logo: 'gpaExtendedReversed',
    filter: MONOCHROME,
    mark: 'relative z-10 h-9 w-auto max-w-32 object-contain object-left',
    photo: 'gpaPhoto',
    story: 'Grupo Pão de Açúcar (GPA) stops a cyberattack and reduces costs by 30%',
    storyClass: 'text-pretty text-body-lg',
    href: 'https://www.azion.com/en/success-case/gpa-solved-cyberattack/'
  },
  {
    name: 'Fourbank',
    span: '1',
    rows: '1',
    fill: 'primary',
    logo: 'fourbankExtendedReversed',
    filter: KNOCKOUT,
    mark: 'relative z-10 h-8 w-auto max-w-36 object-contain',
    href: 'https://www.azion.com/en/success-case/fourbank/'
  },
  {
    name: 'Exame',
    span: '1',
    rows: '1',
    fill: 'canvas',
    logo: 'exameExtendedMono',
    filter: MONOCHROME,
    mark: 'relative z-10 h-8 w-auto max-w-36 object-contain',
    href: 'https://www.azion.com/en/success-case/exame/'
  },
  {
    name: 'NZN',
    span: '1',
    rows: '1',
    fill: 'primary',
    logo: 'nznExtendedReversed',
    filter: KNOCKOUT,
    mark: 'relative z-10 h-8 w-auto max-w-36 object-contain',
    href: 'https://www.azion.com/en/success-case/nzn/nzn-creates-more-than-100-edge-applications-and-reduces-their-websites-loading-time-by-50-using-the-azion-platform/'
  }
]

const FACE =
  'relative flex h-full min-w-0 flex-col overflow-hidden p-(--spacing-xl) transition-colors duration-fast-02 ease-productive-entrance focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none data-[fill=canvas]:bg-(--bg-canvas) data-[fill=canvas]:hover:bg-(--bg-surface-raised) data-[fill=primary]:bg-(--primary) data-[fill=primary]:hover:bg-(--color-orange-600) data-[fill=surface]:bg-(--bg-surface) data-[fill=white]:bg-(--color-base-white)'

const clientMark = (cell) => `<img
  :src="${cell.logo}"
  alt="${cell.name}"
  decoding="async"
  class="${cell.mark} ${cell.filter}"
/>`

const storyFace = (cell) => `<div
  data-fill="${cell.fill}"
  class="${FACE} justify-between gap-(--spacing-xl)"
>
  <img
    :src="${cell.photo}"
    alt=""
    aria-hidden="true"
    decoding="async"
    loading="lazy"
    class="absolute inset-0 z-0 h-full w-full object-cover"
  />
  <div
    aria-hidden="true"
    class="absolute inset-0 z-0 [background-image:linear-gradient(to_top,var(--bg-canvas)_0%,color-mix(in_srgb,var(--bg-canvas)_90%,transparent)_38%,color-mix(in_srgb,var(--bg-canvas)_46%,transparent)_70%,color-mix(in_srgb,var(--bg-canvas)_16%,transparent)_100%)]"
  />

${indent(clientMark(cell))}

  <div class="relative z-10 flex flex-col items-start gap-(--spacing-md)">
    <p class="m-0 text-(--text-default) ${cell.storyClass}">
      ${cell.story}
    </p>
    <MiniButton
      label="Read the case study"
      show-icon
      icon="pi pi-angle-right"
      href="${cell.href}"
    />
  </div>
</div>`

const markFace = (cell) => `<a
  href="${cell.href}"
  data-fill="${cell.fill}"
  class="${FACE} items-center justify-center"
>
${indent(clientMark(cell))}
</a>`

const TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <FrameBox flush borders="y" marks="all">
    <BentoGrid flush :columns="4" :mobile-columns="2" aria-label="Client stories">
${each(
  CELLS,
  (cell) => `<BentoGrid.Cell
  span="${cell.span}"
  rows="${cell.rows}"
  kind="none"
  :padded="false"
  class="min-h-[clamp(180px,18vw,240px)]"
>
${indent(cell.story ? storyFace(cell) : markFace(cell))}
</BentoGrid.Cell>`,
  3
)}
    </BentoGrid>
  </FrameBox>
</SectionModule>`)

const COLUMNS_IMPORTS = [
  "import dafitiExtendedReversed from '@aziontech/webkit/assets/dafiti-extended-reversed.svg'",
  "import madeiramadeiraExtendedReversed from '@aziontech/webkit/assets/madeiramadeira-extended-reversed.svg'",
  "import magaluExtendedColor from '@aziontech/webkit/assets/magalu-extended-color.svg'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import LogoWall from '@aziontech/webkit/logo-wall'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'"
]

const columnsComponents = {
  FrameBox,
  LogoWall,
  SectionContainer,
  SectionGap,
  SectionModule
}

const columnsSetup = () => ({
  dafitiExtendedReversed,
  madeiramadeiraExtendedReversed,
  magaluExtendedColor
})

const COLUMN_MARK = 'h-7 w-auto max-w-full object-contain sm:max-w-40'

const COLUMN_CELLS = [
  {
    name: 'Magalu',
    logo: 'magaluExtendedColor',
    filter: MONOCHROME,
    base: '#0e89ff',
    glow: '#0e89ff',
    ink: 'var(--color-base-white)',
    story:
      "Explore how Magalu enhances cybersecurity with Azion's Firewall and WAF, improving threat intelligence and bot management in retail.",
    href: 'https://www.azion.com/en/success-case/magalu/'
  },
  {
    name: 'Dafiti',
    logo: 'dafitiExtendedReversed',
    filter: KNOCKOUT,
    base: '#ffffff',
    glow: '#ffffff',
    ink: 'var(--color-base-black)',
    story:
      'Dafiti modernized its digital architecture to deliver faster, scalable, and resilient experiences for millions of consumers across Latin America.',
    href: 'https://www.azion.com/en/success-case/dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application/'
  },
  {
    name: 'MadeiraMadeira',
    logo: 'madeiramadeiraExtendedReversed',
    filter: MONOCHROME,
    base: '#ff9014',
    glow: '#ff9014',
    ink: 'var(--color-base-white)',
    story:
      'Faster product delivery and scalable infrastructure allowed MadeiraMadeira to support massive traffic growth during major e-commerce campaigns.',
    href: 'https://www.azion.com/en/success-case/madeiramadeira/'
  }
]

const columnFace = (cell) =>
  `--wall-face: radial-gradient(354px 354px at -15% -15%, ${cell.glow}, transparent 70%), radial-gradient(354px 354px at 45% 115%, ${cell.glow}, transparent 70%), ${cell.base}; --wall-ink: ${cell.ink}`

const COLUMN_WALL =
  '[&_[role=list]]:grid-cols-1! [&_a]:[background:var(--wall-face)] [&_a]:[--text-default:var(--wall-ink)] group-hover/card:[&_a]:before:opacity-100 group-hover/card:[&_a>span:first-child]:-translate-y-(--spacing-sm) group-hover/card:[&_a>span:last-child]:translate-y-0 group-hover/card:[&_a>span:last-child]:opacity-100'

const COLUMN_STORY =
  'relative isolate flex-1 bg-(--bg-canvas) p-(--spacing-lg) before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-(--bg-hover) before:opacity-0 before:transition-opacity before:duration-moderate-01 before:ease-productive-entrance group-hover/card:before:opacity-100 motion-reduce:before:transition-none'

const columnCell = (cell) => `<FrameBox role="listitem" borders="none" marks="all">
  <div class="group/card flex h-full flex-col gap-px bg-(--border-default)">
    <LogoWall
      kind="rectangle"
      aria-label="${cell.name}"
      link-label="Read story"
      :items="[{ src: ${cell.logo}, alt: '${cell.name}', href: '${cell.href}' }]"
      style="${columnFace(cell)}"
      class="${COLUMN_WALL}"
    >
      <template #mark>
        <img
          :src="${cell.logo}"
          alt="${cell.name}"
          decoding="async"
          class="${COLUMN_MARK} ${cell.filter}"
        />
      </template>
    </LogoWall>
    <a
      href="${cell.href}"
      tabindex="-1"
      aria-hidden="true"
      class="${COLUMN_STORY}"
    >
      <p class="m-0 text-balance text-heading-sm text-(--text-default)">
        ${cell.story}
      </p>
    </a>
  </div>
</FrameBox>`

const COLUMNS_TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <FrameBox flush borders="y" marks="none">
    <div
      role="list"
      aria-label="Featured success stories"
      class="grid gap-px bg-(--border-default) lg:grid-cols-3"
    >
${each(COLUMN_CELLS, columnCell, 3)}
    </div>
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Social Proof/ClientMosaic',
  excludeStories: ['SITE_SECTION', 'COLUMNS_SECTION'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, setup, template: TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}

export const Columns = {
  render: () => ({
    components: columnsComponents,
    setup: columnsSetup,
    template: COLUMNS_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'One framed column per client story: a branded tile with the client mark drawn flat, over the story headline. Hovering a column lifts the mark and reveals the Read story link. The Success Cases page uses this layout under its hero.'
      },
      source: { code: toSfc(COLUMNS_IMPORTS, COLUMNS_TEMPLATE) }
    }
  }
}

export const SITE_SECTION = {
  _id: 'client-mosaic',
  props: {
    ariaLabel: 'Client stories',
    linkLabel: 'Read the case study',
    stories: [
      {
        logo: '/marketing-components/logos/netshoes-extended-color.svg',
        logoAlt: 'Netshoes',
        photo: '/marketing-components/photos/netshoes.jpg',
        text: 'Netshoes automatically blocks more than 4 million threats in six months',
        href: 'https://www.azion.com/en/success-case/netshoes/'
      },
      {
        logo: '/marketing-components/logos/gpa-extended-reversed.svg',
        logoAlt: 'GPA',
        photo: '/marketing-components/photos/gpa.jpg',
        text: 'Grupo Pão de Açúcar (GPA) stops a cyberattack and reduces costs by 30%',
        href: 'https://www.azion.com/en/success-case/gpa-solved-cyberattack/'
      }
    ],
    logos: [
      {
        logo: '/marketing-components/logos/dafiti-extended-mono.svg',
        logoAlt: 'Dafiti',
        href: 'https://www.azion.com/en/success-case/dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application/'
      },
      {
        logo: '/marketing-components/logos/agibank-extended-reversed.svg',
        logoAlt: 'Agibank',
        href: 'https://www.azion.com/en/success-case/agibank/'
      },
      {
        logo: '/marketing-components/logos/renner-extended-reversed.svg',
        logoAlt: 'Renner',
        href: 'https://www.azion.com/en/success-case/renner/'
      },
      {
        logo: '/marketing-components/logos/fourbank-extended-reversed.svg',
        logoAlt: 'Fourbank',
        href: 'https://www.azion.com/en/success-case/fourbank/'
      }
    ]
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}

export const COLUMNS_SECTION = {
  _id: 'client-mosaic',
  props: {
    kind: 'columns',
    ariaLabel: 'Featured success stories',
    storyLabel: 'Read story',
    cells: [
      {
        name: 'Magalu',
        logo: '/marketing-components/logos/magalu-extended-color.svg',
        href: 'https://www.azion.com/en/success-case/magalu/',
        story:
          "Explore how Magalu enhances cybersecurity with Azion's Firewall and WAF, improving threat intelligence and bot management in retail.",
        brand: { base: '#0e89ff', glow: '#0e89ff' }
      },
      {
        name: 'Dafiti',
        logo: '/marketing-components/logos/dafiti-extended-reversed.svg',
        href: 'https://www.azion.com/en/success-case/dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application/',
        story:
          'Dafiti modernized its digital architecture to deliver faster, scalable, and resilient experiences for millions of consumers across Latin America.',
        brand: { base: '#ffffff', glow: '#ffffff', ink: 'dark' }
      },
      {
        name: 'MadeiraMadeira',
        logo: '/marketing-components/logos/madeiramadeira-extended-reversed.svg',
        href: 'https://www.azion.com/en/success-case/madeiramadeira/',
        story:
          'Faster product delivery and scalable infrastructure allowed MadeiraMadeira to support massive traffic growth during major e-commerce campaigns.',
        brand: { base: '#ff9014', glow: '#ff9014' }
      }
    ]
  }
}

export const ColumnsJson = {
  tags: ['!dev'],
  ...siteJsonStory(COLUMNS_SECTION)
}
