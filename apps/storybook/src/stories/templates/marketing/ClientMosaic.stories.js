import agibankExtendedReversed from '@aziontech/webkit/assets/agibank-extended-reversed.svg'
import dafitiExtendedMono from '@aziontech/webkit/assets/dafiti-extended-mono.svg'
import exameExtendedMono from '@aziontech/webkit/assets/exame-extended-mono.svg'
import fourbankExtendedReversed from '@aziontech/webkit/assets/fourbank-extended-reversed.svg'
import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'
import gpaPhoto from '@aziontech/webkit/assets/gpa-photo.jpg'
import netshoesExtendedColor from '@aziontech/webkit/assets/netshoes-extended-color.svg'
import netshoesPhoto from '@aziontech/webkit/assets/netshoes-photo.jpg'
import nznExtendedReversed from '@aziontech/webkit/assets/nzn-extended-reversed.svg'
import rennerExtendedReversed from '@aziontech/webkit/assets/renner-extended-reversed.svg'
import BentoGrid from '@aziontech/webkit/bento-grid'
import FrameBox from '@aziontech/webkit/frame-box'
import MiniButton from '@aziontech/webkit/mini-button'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'

import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
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
      label="Learn more"
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

const meta = {
  title: 'Templates/Marketing/Social Proof/ClientMosaic',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Client stories as a mosaic of tiles on one hairline grid with no gutter: eight clients, each linking to its success case. Two tiles carry a story headline over the client’s own photograph, under a scrim that ends on the canvas so the headline keeps its contrast, and close on a “Learn more” link; the rest are the client’s logo, centred, and the whole tile is the link. Logos on the canvas are drawn as one flat ink that follows the theme; on the white and orange fills they are pinned to black. Home carries it after the analyst recognitions. Built from `SectionModule`, `FrameBox`, `BentoGrid` (`BentoGrid.Cell`) and `MiniButton`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, setup, template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Home’s mosaic, four columns (two on mobile): Netshoes leads as a two-by-two story tile, GPA runs down two rows as the second, and six logo tiles fill the rest, Dafiti on white and Fourbank and NZN on the brand orange.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
