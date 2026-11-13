# Brand marks

> Client, analyst and framework marks drawn as theme-aware SVG.

Pass the name where a component asks for a mark (`Ticker` `marks`, `QuoteTabs` and `QuoteCarousel` `mark`, `ClientQuotes` `mark`); the label is the accessible name.

60 names. These are the only values the components accept. An unknown name is not drawn as a mark: `Ticker` prints it as a typographic wordmark, the quote components show no mark. The MCP tool `list_assets({ kind: "brandMarks" })` returns the same list (with a `query` to filter), and `catalog.json#assets.brandMarks` points at it as data.

Used by: [ClientQuotes](../components/client-quotes.md), [Hero](../components/hero.md), [HeroBand](../components/hero-band.md), [HeroCopyOnTopArt](../components/hero-copy-on-top-art.md), [HeroForm](../components/hero-form.md), [HeroWithOpening](../components/hero-with-opening.md), [QuoteCarousel](../components/quote-carousel.md), [QuoteTabs](../components/quote-tabs.md), [SitePage](../components/site-page.md), [TemplateGallery](../components/template-gallery.md), [Ticker](../components/ticker.md).

## Usage

```vue
<script setup>
  import Ticker from '@aziontech/webkit/ticker'
</script>

<template>
  <Ticker :marks="['itau', 'magalu', 'netshoes']" />
</template>
```

## Names

| Name | Description |
| --- | --- |
| `agibank` | Agibank |
| `america-movil` | América Móvil |
| `angular` | Angular |
| `anthropic` | Anthropic |
| `astro` | Astro |
| `aws` | AWS |
| `axur` | Axur |
| `azure` | Azure |
| `caixa` | Caixa |
| `coca-cola` | Coca-Cola |
| `contabilizei` | Contabilizei |
| `dafiti` | Dafiti |
| `docusaurus` | Docusaurus |
| `drizzle` | Drizzle |
| `elastic` | Elastic |
| `eleventy` | Eleventy |
| `equinix` | Equinix |
| `exame` | Exame |
| `forrester` | Forrester |
| `fourbank` | Fourbank |
| `frost-and-sullivan` | Frost & Sullivan |
| `g2` | G2 |
| `gartner` | Gartner |
| `gatsby` | Gatsby |
| `gcp` | Google Cloud |
| `gigaom` | GigaOm |
| `github` | GitHub |
| `global-fashion-group` | Global Fashion Group |
| `gpa` | GPA |
| `grafana` | Grafana |
| `graphql` | GraphQL |
| `groq` | Groq |
| `herospark` | HeroSpark |
| `hexo` | Hexo |
| `hono` | Hono |
| `hugo` | Hugo |
| `itau` | Itaú |
| `jekyll` | Jekyll |
| `kafka` | Kafka |
| `madeiramadeira` | MadeiraMadeira |
| `magalu` | Magalu |
| `netshoes` | Netshoes |
| `nextjs` | Next.js |
| `nodejs` | Node.js |
| `nuxt` | Nuxt |
| `nzn` | NZN |
| `openai` | OpenAI |
| `preact` | Preact |
| `prime-video` | Prime Video |
| `qwik` | Qwik |
| `radware` | Radware |
| `react` | React |
| `remix` | Remix |
| `renner` | Renner |
| `sqlite` | SQLite |
| `terraform` | Terraform |
| `vite` | Vite |
| `vitepress` | VitePress |
| `vue` | Vue |
| `workers-cloudflare` | Cloudflare Workers |
