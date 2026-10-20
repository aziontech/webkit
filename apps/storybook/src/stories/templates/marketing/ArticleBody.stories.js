import Breadcrumb from '@aziontech/webkit/breadcrumb'
import Divider from '@aziontech/webkit/divider'
import DocOnThisPage from '@aziontech/webkit/doc-on-this-page'
import DocProse from '@aziontech/webkit/doc-prose'
import FrameBox from '@aziontech/webkit/frame-box'
import HeroTitle from '@aziontech/webkit/hero-title'
import IconButton from '@aziontech/webkit/icon-button'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionModule from '@aziontech/webkit/section-module'
import SplitButton from '@aziontech/webkit/split-button'
import Tooltip from '@aziontech/webkit/tooltip'

import { each, indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import Breadcrumb from '@aziontech/webkit/breadcrumb'",
  "import Divider from '@aziontech/webkit/divider'",
  "import DocOnThisPage from '@aziontech/webkit/doc-on-this-page'",
  "import DocProse from '@aziontech/webkit/doc-prose'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import HeroTitle from '@aziontech/webkit/hero-title'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import SectionContainer from '@aziontech/webkit/section-container'",
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SplitButton from '@aziontech/webkit/split-button'",
  "import Tooltip from '@aziontech/webkit/tooltip'"
]

const components = {
  Breadcrumb,
  Divider,
  DocOnThisPage,
  DocProse,
  FrameBox,
  HeroTitle,
  IconButton,
  SectionContainer,
  SectionModule,
  SplitButton,
  Tooltip
}

const ARTICLE = {
  title: 'Magalu Ensures High Availability at Scale with Azion',
  description:
    "Explore how Magalu enhances cybersecurity with Azion's Firewall and WAF, improving threat intelligence and bot management in retail.",
  date: 'FEB 4, 2022',
  readTime: '5 min read',
  href: 'https://www.azion.com/en/success-case/magalu/'
}

const TRAIL = [
  { label: 'Success cases', href: '/success-cases' },
  { label: 'Retail', href: '/success-cases?industry=Retail' },
  { label: ARTICLE.title, current: true }
]

const SHARE = {
  title: 'Share this article',
  actions: [
    { label: 'Copy link', icon: 'pi pi-link' },
    {
      label: 'Share on X',
      icon: 'ai ai-x',
      href: `https://x.com/intent/tweet?url=${ARTICLE.href}&via=aziontech`
    },
    {
      label: 'Share on LinkedIn',
      icon: 'pi pi-linkedin',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(ARTICLE.href)}`
    }
  ]
}

const COMMUNITY = {
  title: 'Community',
  links: [
    {
      label: 'Join us on Discord',
      href: 'https://discord.com/invite/Yp9N7RMVZy',
      icon: 'pi pi-discord'
    },
    { label: 'Read our blog posts', href: '/blog', icon: 'pi pi-comment' },
    { label: 'Follow us on X', href: 'https://twitter.com/aziontech', icon: 'ai ai-x' }
  ]
}

const COPY_PAGE = {
  label: 'Copy page',
  menu: [
    { value: 'link', label: 'Get page link', icon: 'pi pi-link' },
    { value: 'markdown', label: 'View page as markdown', icon: 'pi pi-eye' },
    { value: 'google', label: 'Open in Google AI', icon: 'pi pi-external-link' },
    { value: 'perplexity', label: 'Open in Perplexity', icon: 'pi pi-external-link' },
    { value: 'claude', label: 'Open in Claude', icon: 'pi pi-external-link' },
    { value: 'chatgpt', label: 'Open in ChatGPT', icon: 'pi pi-external-link' },
    { value: 'grok', label: 'Open in Grok', icon: 'pi pi-external-link' }
  ]
}

const HEADINGS = [
  { id: 'challenge', text: 'Challenge', depth: 2 },
  { id: 'solution', text: 'Solution', depth: 2 },
  { id: 'results-and-impact', text: 'Results and Impact', depth: 2 }
]

const PROSE = `<h2 id="challenge">Challenge</h2>
<p>
  Magalu is the most innovative retail company in LATAM[1]. With 1.76 billion USD in digital sales in 2021[2]— an increase of 22% in comparison with 2020—Magalu has the largest Brazilian retail ecosystem, which includes:
</p>
<ul>
  <li>Magalu’s e-commerce platform;</li>
  <li>App Magalu, with over 50,000,000 installs on Google Play;</li>
  <li>Magalu Marketplace; and</li>
  <li>tens of companies and business units like Netshoes, KaBuM!, and more.</li>
</ul>
<p>
  Having Magalu’s global-scale applications available at all times requires scalable zero-trust security solutions to contain threats, such as DDoS attacks and malicious bots. In addition, retail sites experience 200% more fraud on big holiday shopping days[3], demanding more effective monitoring of domains to prevent phishing attacks, in line with their strong compliance policies.
</p>

<h2 id="solution">Solution</h2>
<p>
  Magalu counts on Azion’s platform to evolve its complex security posture through edge-native, real-time firewall and analytics solutions, empowering Magalu’s SOC squad with granular access control, a fine-grained bot management platform, automated threat blocking, and more.
</p>

<h2 id="results-and-impact">Results and Impact</h2>
<p>
  Through the automated features and resources provided by Azion’s platform, Magalu simplified security operations by blocking millions of web application threats per year via WAF, as well as bad bots using Bot Manager. Moreover, these solutions help Magalu’s security experts to dedicate efforts on other complex and strategic issues, optimizing productivity and man-hour costs.
</p>`

const objectLiteral = (entry) =>
  `{ ${Object.entries(entry)
    .map(([key, value]) => `${key}: ${typeof value === 'string' ? `'${value}'` : value}`)
    .join(', ')} }`

const arrayLiteral = (entries, depth) =>
  `[\n${indent(entries.map(objectLiteral).join(',\n'), depth + 1)}\n${indent(']', depth)}`

const shareAction = (action) => `<Tooltip text="${action.label}">
  <IconButton
    kind="outlined"
    size="medium"
    icon="${action.icon}"
    aria-label="${action.label}"${action.href ? `\n    href="${action.href}"\n    target="_blank"` : ''}
  />
</Tooltip>`

const communityLink = (link) => {
  const external = !link.href.startsWith('/')
  return `<li>
  <a
    href="${link.href}"${external ? '\n    target="_blank"\n    rel="noopener"' : ''}
    class="flex items-center gap-(--spacing-sm) rounded-(--shape-flat) py-(--spacing-xxs) text-body-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none"
  >
    <i class="${link.icon} w-4 shrink-0 text-center leading-none" aria-hidden="true" />
    ${link.label}
  </a>
</li>`
}

const TEMPLATE = `<SectionContainer max-width="site">
  <SectionModule :divided="false" :padded="false">
    <FrameBox flush borders="y" marks="all">
      <div
        aria-hidden="true"
        class="relative aspect-3/1 overflow-hidden bg-(--bg-canvas) lg:aspect-4/1"
      >
        <div class="absolute inset-x-0 top-1/2 aspect-video -translate-y-1/2">
          <img src="/media/blog/banner.svg" alt="" class="block size-full max-w-none" />
        </div>
      </div>
    </FrameBox>
    <FrameBox flush borders="y" marks="all">
      <div
        class="grid gap-(--spacing-xl) p-(--spacing-xl) pb-(--spacing-xxl) lg:grid-cols-[minmax(0,1fr)_minmax(0,var(--container-2xl))_minmax(0,1fr)] lg:grid-rows-[auto_auto_1fr]"
      >
        <header class="flex min-w-0 flex-col gap-(--spacing-lg) lg:col-start-2">
          <Breadcrumb
            :items="${arrayLiteral(TRAIL, 6)}"
          />
          <HeroTitle
            size="medium"
            max-width="2xl"
            title="${ARTICLE.title}"
            description="${ARTICLE.description}"
          />
          <div class="flex items-center gap-(--spacing-sm)">
            <div
              class="flex min-w-0 flex-col gap-(--spacing-xs) data-signed:h-12 data-signed:justify-between data-signed:gap-0"
            >
              <p class="m-0 text-body-sm text-(--text-muted)">
                ${ARTICLE.date} • ${ARTICLE.readTime}
              </p>
            </div>
          </div>
        </header>

        <Divider class="lg:col-start-2" />

        <article class="min-w-0 lg:col-start-2 [&_h2]:scroll-mt-(--spacing-xxl)">
          <DocProse>
${indent(PROSE, 6)}
          </DocProse>
        </article>

        <aside class="hidden lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:block">
          <div
            class="sticky top-[calc(3.5rem+var(--spacing-xl))] flex max-h-[calc(100dvh-3.5rem-var(--spacing-xl))] flex-col gap-(--spacing-xl) overflow-y-auto pb-(--spacing-lg)"
          >
            <section class="flex flex-col gap-(--spacing-sm)" aria-label="${SHARE.title}">
              <p class="m-0 text-heading-xs text-(--text-default)">${SHARE.title}</p>
              <div class="flex items-center gap-(--spacing-sm)">
${each(SHARE.actions, shareAction, 8)}
              </div>
            </section>

            <section class="flex flex-col gap-(--spacing-sm)" aria-label="${COMMUNITY.title}">
              <p class="m-0 text-heading-xs text-(--text-default)">${COMMUNITY.title}</p>
              <ul role="list" class="m-0 flex list-none flex-col gap-(--spacing-xs) p-0">
${each(COMMUNITY.links, communityLink, 8)}
              </ul>
            </section>

            <SplitButton
              kind="outlined"
              size="medium"
              icon="pi pi-copy"
              label="${COPY_PAGE.label}"
              :model="${arrayLiteral(COPY_PAGE.menu, 7)}"
              class="self-start"
            />
          </div>
        </aside>

        <aside class="hidden lg:col-start-3 lg:row-span-3 lg:row-start-1 lg:block">
          <div
            class="sticky top-[calc(3.5rem+var(--spacing-xl))] max-h-[calc(100dvh-3.5rem-var(--spacing-xl))] overflow-y-auto pb-(--spacing-lg)"
          >
            <DocOnThisPage
              :items="${arrayLiteral(HEADINGS, 7)}"
              active-id="${HEADINGS[0].id}"
            />
          </div>
        </aside>
      </div>
    </FrameBox>
  </SectionModule>
</SectionContainer>`

const meta = {
  title: 'Templates/Marketing/Content/ArticleBody',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The reading page of an article: a brand banner over a three-column grid, with the share, community and Copy page rail on the left, the breadcrumb, headline, byline and prose down the middle at a reading measure, and the “On this page” outline on the right. Both rails stick under the header and fold away below `lg`, leaving the column alone. It opens the page itself, so it carries its own `SectionContainer` rather than sitting in the page column. Every blog post (/blog/:slug) and every success story (/success-cases/:slug) opens with it. Built from `SectionContainer`, `SectionModule`, `FrameBox`, `Breadcrumb`, `HeroTitle`, `Divider`, `DocProse`, `Tooltip`, `IconButton`, `SplitButton` and `DocOnThisPage`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const SuccessStory = {
  render: () => ({ components, template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Magalu success story under Success cases › Retail. A story has no author, so the byline is the date and read time alone, and it has no feed, so the share group drops the RSS action. The outline lists the three sections the prose opens with, the first one active.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
