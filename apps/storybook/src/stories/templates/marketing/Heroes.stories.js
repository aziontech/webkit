import Button from '@aziontech/webkit/button'
import Flow from '@aziontech/webkit/flow'
import Hero from '@aziontech/webkit/hero'
import Illustration from '@aziontech/webkit/illustration'
import Tag from '@aziontech/webkit/tag'

import { each, indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const BUTTON_IMPORT = "import Button from '@aziontech/webkit/button'"
const FLOW_IMPORT = "import Flow from '@aziontech/webkit/flow'"
const HERO_IMPORT = "import Hero from '@aziontech/webkit/hero'"
const ILLUSTRATION_IMPORT = "import Illustration from '@aziontech/webkit/illustration'"
const TAG_IMPORT = "import Tag from '@aziontech/webkit/tag'"

const components = {
  Button,
  Flow,
  'Flow.Anchor': Flow.Anchor,
  'Flow.Node': Flow.Node,
  'Flow.Parallel': Flow.Parallel,
  Hero,
  'Hero.Title': Hero.Title,
  Illustration,
  Tag
}

const CLIENT_STRIP = [
  'global-fashion-group',
  'herospark',
  'itau',
  'nzn',
  'netshoes',
  'caixa',
  'agibank',
  'prime-video',
  'america-movil',
  'gpa',
  'fourbank'
]

const RETAIL_CLIENT_STRIP = [
  'global-fashion-group',
  'netshoes',
  'dafiti',
  'magalu',
  'renner',
  'gpa',
  'america-movil',
  'madeiramadeira',
  'nzn'
]

const START_FREE = { label: 'Start Free', kind: 'secondary', href: '/signup' }
const START_FREE_LOWER = { label: 'Start free', kind: 'secondary', href: '/signup' }
const SPECIALIST = {
  label: 'Talk to a Specialist',
  kind: 'outlined',
  href: '#contact',
  trailing: true
}
const SPECIALIST_PAGE = {
  label: 'Talk to a Specialist',
  kind: 'outlined',
  href: '/contact',
  trailing: true
}
const SPECIALIST_PLAIN = { label: 'Talk to a Specialist', kind: 'outlined' }
const SEE_ARTICLES = { label: 'See articles', kind: 'secondary', href: '#subjects' }
const DOCS = { label: 'Docs', kind: 'outlined', href: '/docs', trailing: true }

const marks = (names, depth) =>
  `[\n${indent(names.map((name) => `'${name}'`).join(',\n'), depth + 1)}\n${indent(']', depth)}`

const button = ({ label, kind, href, trailing }) =>
  [
    '<Button',
    `  label="${label}"`,
    `  kind="${kind}"`,
    '  size="large"',
    ...(href ? [`  href="${href}"`] : []),
    ...(trailing
      ? ['  icon="pi pi-chevron-right"', '  icon-position="trailing"', '  animated']
      : []),
    '/>'
  ].join('\n')

const actions = (buttons) => `<template #actions>\n${each(buttons, button, 1)}\n</template>`

const WORKLOAD_LEVELS = [
  [
    {
      eyebrow: 'Domain',
      icon: 'ai ai-domains',
      title: 'shop.example.com',
      label: 'Public',
      severity: 'info'
    },
    {
      eyebrow: 'Domain',
      icon: 'ai ai-domains',
      title: 'api.example.com',
      label: 'Public',
      severity: 'info'
    }
  ],
  [
    {
      eyebrow: 'Workload',
      icon: 'ai ai-workloads',
      title: 'shop-prod',
      label: 'Live',
      severity: 'success',
      lit: true
    }
  ],
  [
    {
      eyebrow: 'Application',
      icon: 'ai ai-edge-application',
      title: 'storefront',
      label: 'Active',
      severity: 'success'
    },
    {
      eyebrow: 'Firewall',
      icon: 'ai ai-edge-firewall',
      title: 'edge-rules',
      label: 'Active',
      severity: 'success'
    }
  ]
]

const NODE_CLASS =
  'flex w-full flex-col rounded-(--shape-card) border-solid border-[length:var(--border-width-default,1px)] border-(--border-default) bg-(--bg-surface) shadow-(--shadow-xs) transition-colors duration-moderate-01 ease-productive-entrance hover:border-(--border-strong) has-[:focus-visible]:border-(--border-strong) motion-reduce:transition-none'

const LIT_NODE_CLASS = `${NODE_CLASS} relative border-(--primary) before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:shadow-[-22px_0_44px_-16px_var(--accent),22px_0_44px_-16px_var(--primary),0_0_20px_-8px_var(--primary)] before:content-['']`

const workloadNode = (node) => `<Flow.Node
  unstyled
  class="${node.lit ? LIT_NODE_CLASS : NODE_CLASS}"
>
  <Flow.Anchor>
    <div class="flex w-full items-center gap-(--spacing-xxs) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-xxs)">
      <i
        class="${node.icon} shrink-0 text-label-sm leading-none text-(--text-muted)"
        aria-hidden="true"
      />
      <span class="truncate text-label-sm text-(--text-muted)">${node.eyebrow}</span>
      <Tag
        class="ml-auto shrink-0"
        severity="${node.severity}"
        label="${node.label}"
        size="small"
      />
    </div>
  </Flow.Anchor>
  <div class="flex min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-sm)">
    <span class="min-w-0 truncate text-label-sm text-(--text-default)">${node.title}</span>
  </div>
</Flow.Node>`

const workloadLevel = (nodes) => `<Flow.Parallel
  align="start"
  class="min-w-0 flex-1 @4xl:min-w-[15rem]"
>
${each(nodes, workloadNode, 1)}
</Flow.Parallel>`

const CENTERED_CAROUSEL_TEMPLATE = `<Hero
  kind="screen"
  align="center"
  max-width="site"
  texture="dots"
  texture-fade="top"
  carousel
  carousel-label="Trusted by mission-critical workloads"
  :carousel-marks="${marks(CLIENT_STRIP, 1)}"
>
  <Hero.Title
    centered
    max-width="xl"
    highlight="Invisible Infrastructure"
    title="for the Speed of AI"
    description="Compute, AI, data, security, and observability primitives that run autonomously and scale instantly on 100+ data centers worldwide. One platform, from idea to mission-critical."
  >
${indent(actions([START_FREE, SPECIALIST]), 2)}
  </Hero.Title>
</Hero>`

const TITLE_BAND_TEMPLATE = `<Hero
  kind="band"
  max-width="5xl"
  size="large"
  carousel
  carousel-label="Trusted by mission-critical workloads"
  :carousel-marks="${marks(CLIENT_STRIP, 1)}"
>
  <Hero.Title
    centered
    title="Learning Center"
    description="Practical knowledge to speed up, secure, and scale applications."
  >
${indent(actions([SEE_ARTICLES, SPECIALIST_PAGE]), 2)}
  </Hero.Title>
</Hero>`

const PIXEL_FLOOR_TEMPLATE = `<Hero
  kind="screen"
  floor-texture="pixelate"
  floor-texture-size="small"
  max-width="full"
  :bordered="false"
  carousel
  carousel-label="Trusted by mission-critical workloads"
  :carousel-marks="${marks(CLIENT_STRIP, 1)}"
  class="[--banner-offset:3.5rem] [--banner-floor-bg:var(--bg-surface)] [--texture-pool-a:95%_64%] [--texture-pool-b:-2%_38%]"
>
  <Hero.Title
    title="Build and deploy AI agents and applications in seconds"
    description="Run AI models close to users on highly distributed infrastructure for scalable, low-latency, and cost-effective inference while preserving data locality."
  >
${indent(actions([START_FREE, SPECIALIST_PLAIN]), 2)}
  </Hero.Title>
</Hero>`

const COPY_BESIDE_ART_TEMPLATE = `<Hero
  max-width="5xl"
  kind="screen"
  media-align="end"
  carousel
  carousel-label="Trusted by mission-critical workloads"
  :carousel-marks="${marks(RETAIL_CLIENT_STRIP, 1)}"
  offset="3.5rem"
>
  <Hero.Title
    max-width="xl"
    eyebrow="Application Performance and Reliability"
    eyebrow-prefix="//"
    title="Make your applications fast and always reliable"
    description="Serve websites, web apps, and APIs from Azion's globally distributed infrastructure, keep them online when an origin fails, and cut origin load and egress costs during your biggest traffic peaks."
  >
${indent(actions([START_FREE, SPECIALIST]), 2)}
  </Hero.Title>

  <template #media>
    <Illustration
      name="improve-application-performance-and-reliability"
      aria-label="A website served through Azion, scoring 99 on performance"
      class="md:w-(--hero-art-width) md:max-w-none md:shrink-0 md:-me-(--hero-art-bleed)"
      style="--hero-art-width: 161.45%; --hero-art-bleed: 35.73%"
    />
  </template>
</Hero>`

const COPY_ON_TOP_ART_TEMPLATE = `<Hero
  kind="screen"
  align="center"
  max-width="site"
  texture="dots"
  texture-size="small"
  texture-fade="top"
  class="[--banner-offset:3.5rem]"
>
  <Hero.Title
    centered
    eyebrow="Workloads"
    title="Put your application on the edge in seconds"
    description="A workload is the hostname, the certificate and the routing that make an application reachable. Create one and it is live in every Azion location — no servers to size, no regions to pick."
  >
${indent(actions([START_FREE_LOWER, DOCS]), 2)}
  </Hero.Title>

  <template #bottom>
    <div class="@container">
      <div
        class="flex animate-content-enter justify-center pb-(--spacing-xxl) motion-reduce:animate-none [--content-enter-delay:120ms] @max-2xl:[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
      >
        <Flow
          align="center"
          class="w-[40rem] shrink-0 @4xl:w-(--container-3xl) [&>div]:w-full"
        >
${each(WORKLOAD_LEVELS, workloadLevel, 5)}
        </Flow>
      </div>
    </div>
  </template>
</Hero>`

const meta = {
  title: 'Templates/Marketing/Heroes/Hero',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The opening band of a marketing page: the page’s h1 and its actions, full-bleed above the framed column, with the backdrop, strip or art that frames them. Each story is the hero one family of sample pages opens with. The home page and every solution page (Retail, Web Apps, AI Workloads, Security, Performance, Streaming, Financial Services, Technology) open on the centered band with the client strip on its floor. Learning opens on a large title band, AI Inference on the pixelate field, the Workloads copy sits on top of its topology, and the copy-beside-art band is the solution pages’ former opening. Built from `Hero`, `Hero.Title`, `Button`, `Illustration` and, for the Workloads scene, `Flow` and `Tag`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const CenteredCarousel = {
  render: () => ({ components, template: CENTERED_CAROUSEL_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The home page’s hero: one screen tall, a dot field fading in from the top, the highlighted headline centered, and the eleven-client strip with its overline standing on the floor. The solution pages run the same band with their own copy and client list.'
      },
      source: { code: toSfc([BUTTON_IMPORT, HERO_IMPORT], CENTERED_CAROUSEL_TEMPLATE) }
    }
  }
}

export const TitleBand = {
  render: () => ({ components, template: TITLE_BAND_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Learning Center hero: a padded band rather than a screen, at `size="large"` so it opens with twice the band’s usual rhythm above and below, the title, a one-line description and two actions centered, and the client strip on its floor. Use it where the page is a list or a catalogue and a full viewport of title would push the first entry below the fold.'
      },
      source: { code: toSfc([BUTTON_IMPORT, HERO_IMPORT], TITLE_BAND_TEMPLATE) }
    }
  }
}

export const PixelFloor = {
  render: () => ({ components, template: PIXEL_FLOOR_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The AI Inference copy over an animated pixelate field standing on the floor under the client strip, at the small texture size, with the copy left-aligned. Light bands drift across the field and stop under reduced motion. `--banner-floor-bg` sets one plinth under the floor and the strip, and `--texture-pool-a` and `-b` place the light in the field.'
      },
      source: { code: toSfc([BUTTON_IMPORT, HERO_IMPORT], PIXEL_FLOOR_TEMPLATE) }
    }
  }
}

export const CopyBesideArt = {
  render: () => ({ components, template: COPY_BESIDE_ART_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Copy beside a horizontal asset, with the client strip on the floor: the solution pages’ former opening, kept as SolutionArtHero, with the Performance page’s copy, art and retail client strip. The copy keeps the leading column and the illustration bleeds past the container edge from `md` up: `--hero-art-width` and `--hero-art-bleed` are the values the sample computes for this scene so its drawn part fills the column.'
      },
      source: {
        code: toSfc([BUTTON_IMPORT, HERO_IMPORT, ILLUSTRATION_IMPORT], COPY_BESIDE_ART_TEMPLATE)
      }
    }
  }
}

export const CopyOnTopArt = {
  render: () => ({ components, template: COPY_ON_TOP_ART_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Workloads copy on top, with the workload’s topology standing in the `bottom` window under it: two domains feeding the lit workload, which binds an application and a firewall, on a dot field that fades in from the top. The copy centers in the space above the scene. The scene shows at every width: from a 56rem band it is drawn at full size, below that the cards narrow so the diagram fits a tablet, and on a phone the window crops both sides around the centred workload and the cut edges fade out. The widths are container queries on the band itself, not the viewport. Flow measures its connectors from the laid-out nodes, so the scene is resized, never scaled. It is built from `Flow`, `Flow.Parallel`, `Flow.Node` and `Flow.Anchor` with a `Tag` per node.'
      },
      source: {
        code: toSfc([BUTTON_IMPORT, FLOW_IMPORT, HERO_IMPORT, TAG_IMPORT], COPY_ON_TOP_ART_TEMPLATE)
      }
    }
  }
}
