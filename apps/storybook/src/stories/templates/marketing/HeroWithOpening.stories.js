import Button from '@aziontech/webkit/button'
import CardGrid from '@aziontech/webkit/card-grid'
import FrameBox from '@aziontech/webkit/frame-box'
import Hero from '@aziontech/webkit/hero'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import Topic from '@aziontech/webkit/topic'

import { editable } from '../../_shared/editable-content'
import { each, indent } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import Hero from '@aziontech/webkit/hero'",
  "import SectionContainer from '@aziontech/webkit/section-container'",
  "import SectionGap from '@aziontech/webkit/section-gap'",
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import Topic from '@aziontech/webkit/topic'"
]

const components = {
  Button,
  CardGrid,
  'CardGrid.Cell': CardGrid.Cell,
  FrameBox,
  Hero,
  'Hero.Title': Hero.Title,
  SectionContainer,
  SectionGap,
  SectionModule,
  Topic
}

const TITLE_WIDTH = { short: 'xl', long: '4xl' }

const SIX = {
  titleLength: 'short',
  eyebrow: 'AI Gateway',
  title: 'One gateway for all your AI applications',
  description:
    'Route requests to AI Inference and third-party providers, fall back when a model fails, and keep keys, limits, and usage logs in one place, with no proxy servers to run.',
  arguments: [
    {
      icon: 'ai ai-azion-api',
      title: 'One endpoint for every model',
      description:
        'Apps send OpenAI-format requests with a model alias. Change the model behind an alias once, and every app follows.'
    },
    {
      icon: 'pi pi-replay',
      title: 'Fallback when a provider fails',
      description:
        'Each alias lists its models in order. When a call errors or times out, the gateway moves to the next one.'
    },
    {
      icon: 'pi pi-key',
      title: 'Provider keys stay server-side',
      description:
        'Provider keys live in secret environment variables. Each team gets its own gateway key, stored only as a SHA-256 hash.'
    },
    {
      icon: 'ai ai-edge-firewall',
      title: 'Abuse blocked before it costs tokens',
      description:
        'Firewall applies WAF, rate limits, and DDoS Protection before requests reach the gateway, so blocked traffic never reaches a model.'
    },
    {
      icon: 'ai ai-tiered-cache',
      title: 'Repeated prompts served from cache',
      description:
        'Callers opt in per request. A matching prompt gets a stored response, with no model call and no tokens spent.'
    },
    {
      icon: 'pi pi-list',
      title: 'Every call on the record',
      description:
        'Each call logs the team, model, fallback, cache result, and tokens used. Stream the logs to your SIEM or data warehouse.'
    }
  ]
}

const THREE = {
  titleLength: 'long',
  eyebrow: 'Firewall',
  title: 'Programmable firewall for distributed applications',
  description:
    'Protect users, applications, and networks with rules you program, from layer 3 to layer 7.',
  arguments: [
    {
      icon: 'pi pi-shield',
      title: 'Programmable rule engine',
      description:
        'Define custom rules and behaviors across OSI layers L3-L7 to control traffic before it reaches your applications.'
    },
    {
      icon: 'pi pi-code',
      title: 'Extensible with Functions',
      description:
        'Run custom JavaScript security code and marketplace integrations on Azion’s distributed infrastructure.'
    },
    {
      icon: 'pi pi-sync',
      title: 'Real-time synchronization',
      description:
        'Rules sync automatically across every data center. SIEM integration keeps threat intelligence flowing.'
    }
  ]
}

const ACTIONS = `<template #actions>
  <Button
    label="Start free"
    kind="secondary"
    size="large"
    href="/signup"
  />
  <Button
    label="Docs"
    kind="outlined"
    size="large"
    href="/docs"
    icon="pi pi-chevron-right"
    icon-position="trailing"
    animated
  />
</template>`

const cell = (item) => `<CardGrid.Cell kind="canvas">
  <Topic
    :heading-level="2"
    icon="${item.icon}"
    title="${item.title}"
    description="${item.description}"
  />
</CardGrid.Cell>`

const heroWithOpening = (page) => `<Hero
  kind="band"
  max-width="5xl"
  size="large"
>
  <Hero.Title
    centered
    max-width="${TITLE_WIDTH[page.titleLength]}"
    eyebrow="${page.eyebrow}"
    title="${page.title}"
    description="${page.description}"
  >
${indent(ACTIONS, 2)}
  </Hero.Title>
</Hero>

<SectionContainer max-width="site">
  <SectionModule :divided="false" :padded="false">
    <FrameBox flush borders="y" marks="bottom">
      <CardGrid flush kind="frame" :columns="3">
${each(page.arguments, cell, 4)}
      </CardGrid>
    </FrameBox>
  </SectionModule>

  <SectionGap hatch />
</SectionContainer>`

const SIX_TEMPLATE = heroWithOpening(SIX)
const THREE_TEMPLATE = heroWithOpening(THREE)

const ACTION_PROPS = {
  primaryAction: {
    label: 'Start free',
    href: 'https://console.azion.com/signup/'
  },
  secondaryAction: {
    label: 'Docs',
    href: 'https://www.azion.com/en/documentation/'
  }
}

const sectionOf = (page) => ({
  _id: 'hero-with-opening',
  props: {
    eyebrow: page.eyebrow,
    title: page.title,
    description: page.description,
    ...ACTION_PROPS,
    items: page.arguments
  }
})

const meta = {
  title: 'Templates/Marketing/Heroes/HeroWithOpening',
  excludeStories: ['SIX_SECTION', 'THREE_SECTION'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const SixArguments = {
  ...editable(() => ({ components, template: SIX_TEMPLATE })),
  parameters: {
    docs: {
      description: {
        story:
          'Six arguments in two rows of three, for a page that argues on breadth. The headline is short, so it keeps the narrow column and breaks early.'
      },
      source: { code: toSfc(IMPORTS, SIX_TEMPLATE) }
    }
  }
}

export const SIX_SECTION = sectionOf(SIX)

export const SixArgumentsJson = {
  tags: ['!dev'],
  ...siteJsonStory(SIX_SECTION)
}

export const ThreeArguments = {
  ...editable(() => ({ components, template: THREE_TEMPLATE })),
  parameters: {
    docs: {
      description: {
        story:
          'Three arguments in one row, for a page that argues on a few strong claims. The headline is long, so its column widens and it breaks into two lines instead of three.'
      },
      source: { code: toSfc(IMPORTS, THREE_TEMPLATE) }
    }
  }
}

export const THREE_SECTION = sectionOf(THREE)

export const ThreeArgumentsJson = {
  tags: ['!dev'],
  ...siteJsonStory(THREE_SECTION)
}
