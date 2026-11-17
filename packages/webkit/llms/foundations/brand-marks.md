# Brand marks

> Client, analyst and framework marks drawn as theme-aware SVG.

Pass the name where a component asks for a mark (`Marquee` `marks`, `QuoteTabs` `mark`, `ClientQuotesSection` `mark`); the label is the accessible name. A `wordmark` entry is a brand whose terms do not let WebKit ship its logo (Splunk, Google BigQuery, Amazon S3 and Kinesis, Zoop, G2 badges, Rust, Datadog in a one-ink row): it renders as its label in plain text, in WebKit type and colour, until its owner grants the logo.

69 names. These are the only values the components accept. An unknown name is not drawn as a mark: `Marquee` prints it as a typographic wordmark, the quote components show no mark. The MCP tool `list_assets({ kind: "brandMarks" })` returns the same list (with a `query` to filter), and `catalog.json#assets.brandMarks` points at it as data.

Used by: [ClientQuotesSection](../components/client-quotes-section.md), [Hero](../components/hero.md), [HeroFormSection](../components/hero-form-section.md), [HeroSection](../components/hero-section.md), [Marquee](../components/marquee.md), [QuoteTabs](../components/quote-tabs.md), [SitePage](../components/site-page.md), [TemplateGallerySection](../components/template-gallery-section.md).

## Usage

```vue
<script setup>
  import Marquee from '@aziontech/webkit/marquee'
</script>

<template>
  <Marquee :marks="['itau', 'magalu', 'netshoes']" />
</template>
```

## Names

| Name | Description | Drawn as |
| --- | --- | --- |
| `agibank` | Agibank | Mark |
| `amazon-kinesis` | Amazon Kinesis | Text wordmark |
| `amazon-s3` | Amazon S3 | Text wordmark |
| `america-movil` | América Móvil | Mark |
| `angular` | Angular | Mark |
| `anthropic` | Anthropic | Mark |
| `astro` | Astro | Mark |
| `aws` | AWS | Mark |
| `axur` | Axur | Mark |
| `azure` | Azure | Mark |
| `bigquery` | Google BigQuery | Text wordmark |
| `caixa` | Caixa | Mark |
| `cloudflare-workers` | Cloudflare Workers | Mark |
| `coca-cola` | Coca-Cola | Mark |
| `contabilizei` | Contabilizei | Mark |
| `dafiti` | Dafiti | Mark |
| `datadog` | Datadog | Text wordmark |
| `docusaurus` | Docusaurus | Mark |
| `drizzle` | Drizzle | Mark |
| `elastic` | Elastic | Mark |
| `eleventy` | Eleventy | Mark |
| `equinix` | Equinix | Mark |
| `exame` | Exame | Mark |
| `forrester` | Forrester | Mark |
| `fourbank` | Fourbank | Mark |
| `frost-and-sullivan` | Frost & Sullivan | Mark |
| `g2` | G2 | Mark |
| `g2-high-performer` | G2 High Performer | Text wordmark |
| `g2-leader` | G2 Leader | Text wordmark |
| `gartner` | Gartner | Mark |
| `gatsby` | Gatsby | Mark |
| `gcp` | Google Cloud | Mark |
| `gigaom` | GigaOm | Mark |
| `github` | GitHub | Mark |
| `global-fashion-group` | Global Fashion Group | Mark |
| `gpa` | GPA | Mark |
| `grafana` | Grafana | Mark |
| `graphql` | GraphQL | Mark |
| `groq` | Groq | Mark |
| `herospark` | HeroSpark | Mark |
| `hexo` | Hexo | Mark |
| `hono` | Hono | Mark |
| `hugo` | Hugo | Mark |
| `itau` | Itaú | Mark |
| `jekyll` | Jekyll | Mark |
| `kafka` | Kafka | Mark |
| `madeiramadeira` | MadeiraMadeira | Mark |
| `magalu` | Magalu | Mark |
| `netshoes` | Netshoes | Mark |
| `nextjs` | Next.js | Mark |
| `nodejs` | Node.js | Mark |
| `nuxt` | Nuxt | Mark |
| `nzn` | NZN | Mark |
| `openai` | OpenAI | Mark |
| `preact` | Preact | Mark |
| `prime-video` | Prime Video | Mark |
| `qwik` | Qwik | Mark |
| `radware` | Radware | Mark |
| `react` | React | Mark |
| `remix` | Remix | Mark |
| `renner` | Renner | Mark |
| `rust` | Rust | Text wordmark |
| `splunk` | Splunk | Text wordmark |
| `sqlite` | SQLite | Mark |
| `terraform` | Terraform | Mark |
| `vite` | Vite | Mark |
| `vitepress` | VitePress | Mark |
| `vue` | Vue | Mark |
| `zoop` | Zoop | Text wordmark |
