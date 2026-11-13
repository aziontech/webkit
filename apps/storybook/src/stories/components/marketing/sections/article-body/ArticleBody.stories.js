import ArticleBody from '@aziontech/webkit/article-body'

import { toSfc } from '../../../../_shared/story-source'
import { SITE_SECTION } from '../../../../templates/marketing/_sections/article-body'

const IMPORT = "import ArticleBody from '@aziontech/webkit/article-body'"

const object = (summary) => ({
  category: 'props',
  type: { summary },
  defaultValue: { summary: 'undefined' }
})

/** @type {import('@storybook/vue3').Meta<typeof ArticleBody>} */
const meta = {
  title: 'Components/Marketing/Sections/ArticleBody',
  component: ArticleBody,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          'The reading page of an article: a brand banner over a three-column grid — the share, community and copy-page rail on the left, the breadcrumb, headline, byline and prose down the middle, and the "On this page" outline on the right. The prose arrives as markdown, and its `##` / `###` headings feed the outline. It is a page section — the site places it from a `{ _id: \'article-body\', props }` entry and binds `props` straight onto it — and it carries its own `section-container`, composing `section-module`, `frame-box`, `breadcrumb`, `hero-title`, `divider`, `doc-prose`, `tooltip`, `icon-button`, `split-button` and `doc-on-this-page`.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    eyebrow: {
      control: 'text',
      description: 'Overline above the headline.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    article: {
      control: 'object',
      description:
        'The piece being read: its `title` (the page h1), `description`, `date`, `readTime` and canonical `href`.',
      table: { category: 'props', type: { summary: 'ArticleBodyArticle' } }
    },
    trail: {
      control: 'object',
      description:
        'The breadcrumb over the headline, each a `label` and an `href`, the last one marked `current`.',
      table: {
        category: 'props',
        type: { summary: 'ArticleBodyCrumb[]' },
        defaultValue: { summary: '[]' }
      }
    },
    body: {
      control: 'text',
      description: 'The article as markdown; its `##` and `###` headings feed the outline.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    banner: {
      control: 'text',
      description: 'URL of the image over the masthead; the banner frame is omitted when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    share: {
      control: 'object',
      description:
        'Labels of the share group: its `title`, `copyLink`, `shareX` and `shareLinkedIn`; the group is omitted when absent.',
      table: object('ArticleBodyShare')
    },
    community: {
      control: 'object',
      description:
        'The community group: a `title` and `links`, each a `label`, an `href` and an `icon`; omitted when absent.',
      table: object('ArticleBodyCommunity')
    },
    copyPage: {
      control: 'object',
      description:
        'The copy-page split button: its `label` and a `menu` of entries, each a `value`, a `label` and an `icon`; omitted when absent.',
      table: object('ArticleBodyCopyPage')
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { ArticleBody },
  setup() {
    return { args }
  },
  template: '<ArticleBody v-bind="args" />'
})

const DEFAULT_MARKUP = `<ArticleBody
  eyebrow="Blog"
  banner="/media/blog/banner.svg"
  body="## Challenge&#10;&#10;Magalu is the most innovative retail company in LATAM.&#10;&#10;## Solution&#10;&#10;Magalu counts on Azion’s platform to evolve its security posture.&#10;&#10;## Results and Impact&#10;&#10;Magalu simplified security operations by blocking millions of threats per year."
  :article="{
    title: 'Magalu Ensures High Availability at Scale with Azion',
    description: 'Explore how Magalu enhances cybersecurity with Azion’s Firewall and WAF, improving threat intelligence and bot management in retail.',
    date: 'FEB 4, 2022',
    readTime: '5 min read',
    href: 'https://www.azion.com/en/success-case/magalu/'
  }"
  :trail="[
    { label: 'Success cases', href: '/success-cases' },
    { label: 'Retail', href: '/success-cases?industry=Retail' },
    { label: 'Magalu Ensures High Availability at Scale with Azion', current: true }
  ]"
  :share="{ title: 'Share this article', copyLink: 'Copy link', shareX: 'Share on X', shareLinkedIn: 'Share on LinkedIn' }"
  :community="{
    title: 'Community',
    links: [
      { label: 'Join us on Discord', href: 'https://discord.com/invite/Yp9N7RMVZy', icon: 'pi pi-discord' },
      { label: 'Read our blog posts', href: '/blog', icon: 'pi pi-comment' },
      { label: 'Follow us on X', href: 'https://twitter.com/aziontech', icon: 'ai ai-x' }
    ]
  }"
  :copy-page="{
    label: 'Copy page',
    menu: [
      { value: 'link', label: 'Get page link', icon: 'pi pi-link' },
      { value: 'markdown', label: 'View page as markdown', icon: 'pi pi-eye' }
    ]
  }"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof ArticleBody>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The Magalu success story. Edit the `body` markdown in the Controls panel — its headings re-feed the outline; drop `share`, `community` and `copyPage` and the left rail goes away.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
