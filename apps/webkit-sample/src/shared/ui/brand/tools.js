// Tool marks for the site's "Your Stack, Your Way" strip.
//
// The counterpart to `clients/index.js`: same entry shape ({ name, logo, artwork }),
// same `<img src>` resolution through Vite, read by the same `BrandCarousel` —
// so the two strips on the home page are one component with two lists, not two
// implementations of a marquee.
//
// This list is the FRAMEWORKS, CLOUDS, MODEL PROVIDERS AND DATA TOOLS a workload
// already uses, in the order the site states them. It is a claim about
// compatibility, not a client list, which is why it lives beside the client
// registry rather than inside it — a name here has never been an Azion customer,
// and a name there is not something you build with.
//
// `artwork` classifies each file by the fills it actually declares, the same way
// the client registry does:
//   'dark'  — `fill="currentColor"`, which has no inherited colour inside an <img>
//             and therefore resolves to BLACK; inverted on the dark theme.
//   'color' — the mark ships its own brand colours and is never filtered.
//
// In practice the strip is rendered `monochrome`, which flattens every mark to one
// silhouette regardless — but the classification stays correct here so the list can
// be placed honestly on a surface that does not.
import angular from './clients/angular.svg'
import anthropic from './clients/anthropic.svg'
import astro from './clients/astro.svg'
import aws from './clients/aws.svg'
import azure from './clients/azure.svg'
import docusaurus from './clients/docusaurus.svg'
import drizzle from './clients/drizzle.svg'
import elastic from './clients/elastic.svg'
import eleventy from './clients/eleventy.svg'
import equinix from './clients/equinix.svg'
import gatsby from './clients/gatsby.svg'
import gcp from './clients/gcp.svg'
import github from './clients/github.svg'
import grafana from './clients/grafana.svg'
import graphql from './clients/graphql.svg'
import groq from './clients/groq.svg'
import hexo from './clients/hexo.svg'
import hono from './clients/hono.svg'
import hugo from './clients/hugo.svg'
import jekyll from './clients/jekyll.svg'
import kafka from './clients/kafka.svg'
import nextjs from './clients/nextjs.svg'
import nodejs from './clients/node.js.svg'
import nuxt from './clients/nuxt.svg'
import openai from './clients/openai.svg'
import preact from './clients/preact.svg'
import qwik from './clients/qwik.svg'
import react from './clients/react.svg'
import remix from './clients/remix.svg'
import sqlite from './clients/sqlite.svg'
import terraform from './clients/terraform.svg'
import vite from './clients/vite.svg'
import vitepress from './clients/vitepress.svg'
import vue from './clients/vue.svg'
import workersCloudflare from './clients/workers-cf.svg'

export const TOOLS = [
  { name: 'Angular', logo: angular, artwork: 'dark' },
  { name: 'Astro', logo: astro, artwork: 'dark' },
  { name: 'NextJS', logo: nextjs, artwork: 'dark' },
  { name: 'Nuxt', logo: nuxt, artwork: 'dark' },
  { name: 'Preact', logo: preact, artwork: 'dark' },
  { name: 'Docusaurus', logo: docusaurus, artwork: 'dark' },
  { name: 'Eleventy', logo: eleventy, artwork: 'dark' },
  { name: 'Gatsby', logo: gatsby, artwork: 'dark' },
  { name: 'Jekyll', logo: jekyll, artwork: 'dark' },
  { name: 'Vue', logo: vue, artwork: 'dark' },
  { name: 'Graphql', logo: graphql, artwork: 'dark' },
  { name: 'Vite', logo: vite, artwork: 'dark' },
  { name: 'Terraform', logo: terraform, artwork: 'dark' },
  { name: 'AWS', logo: aws, artwork: 'dark' },
  { name: 'GCP', logo: gcp, artwork: 'dark' },
  { name: 'Azure', logo: azure, artwork: 'dark' },
  // Two flat brand colours (#231F20 + a red accent) rather than currentColor.
  { name: 'Equinix', logo: equinix, artwork: 'color' },
  { name: 'Anthropic', logo: anthropic, artwork: 'color' },
  { name: 'OpenAI', logo: openai, artwork: 'dark' },
  { name: 'Groq', logo: groq, artwork: 'color' },
  { name: 'Grafana', logo: grafana, artwork: 'dark' },
  { name: 'Elastic', logo: elastic, artwork: 'dark' },
  { name: 'Kafka', logo: kafka, artwork: 'color' },
  // An embedded raster, so it carries its own colours and cannot be inverted safely.
  { name: 'React', logo: react, artwork: 'color' },
  { name: 'Drizzle', logo: drizzle, artwork: 'color' }
]

// ── The product pages' strip ──────────────────────────────────────────────
// The SAME COMPONENT, a DIFFERENT CLAIM. `TOOLS` above is the home page's list, in the
// home page's order. This is the one azion.com runs under every PRODUCT page's hero —
// thirty names, in the source's order, and it is stated separately rather than folded
// into `TOOLS` for the reason the file's header gives about the two registries: a list
// here is a claim a specific page makes, and widening the home page's strip by ten marks
// to serve a product page would change a page nobody asked to change.
//
// Ten of these have no `TOOLS` entry even though their artwork has always been in
// `clients/`. Classified by the fills each file declares, exactly as above: a
// `currentColor` mark resolves to black inside an <img> ('dark'); a mark that ships its
// own palette, a gradient, or an embedded raster is 'color' and is never filtered.
export const PRODUCT_STACK = [
  { name: 'Next.js', logo: nextjs, artwork: 'dark' },
  { name: 'Astro', logo: astro, artwork: 'dark' },
  { name: 'React', logo: react, artwork: 'color' },
  { name: 'Vue', logo: vue, artwork: 'dark' },
  { name: 'Angular', logo: angular, artwork: 'dark' },
  { name: 'Nuxt', logo: nuxt, artwork: 'dark' },
  { name: 'Gatsby', logo: gatsby, artwork: 'dark' },
  { name: 'Hugo', logo: hugo, artwork: 'dark' },
  { name: 'Preact', logo: preact, artwork: 'dark' },
  { name: 'Remix', logo: remix, artwork: 'dark' },
  { name: 'Qwik', logo: qwik, artwork: 'dark' },
  { name: 'Vite', logo: vite, artwork: 'dark' },
  { name: 'VitePress', logo: vitepress, artwork: 'dark' },
  { name: 'Docusaurus', logo: docusaurus, artwork: 'dark' },
  { name: 'Eleventy', logo: eleventy, artwork: 'dark' },
  { name: 'Hexo', logo: hexo, artwork: 'dark' },
  { name: 'Jekyll', logo: jekyll, artwork: 'dark' },
  { name: 'Hono', logo: hono, artwork: 'dark' },
  // A flat brand green (#83CD29), so it keeps its own colour.
  { name: 'Node.js', logo: nodejs, artwork: 'color' },
  { name: 'AWS', logo: aws, artwork: 'dark' },
  { name: 'GCP', logo: gcp, artwork: 'dark' },
  { name: 'Azure', logo: azure, artwork: 'dark' },
  // Four gradient fills.
  { name: 'Workers Cloudflare', logo: workersCloudflare, artwork: 'color' },
  { name: 'Terraform', logo: terraform, artwork: 'dark' },
  // An embedded raster pattern, so it cannot be inverted safely.
  { name: 'GitHub', logo: github, artwork: 'color' },
  { name: 'OpenAI', logo: openai, artwork: 'dark' },
  { name: 'Anthropic', logo: anthropic, artwork: 'color' },
  { name: 'Groq', logo: groq, artwork: 'color' },
  { name: 'SQLite', logo: sqlite, artwork: 'dark' },
  { name: 'Drizzle', logo: drizzle, artwork: 'color' }
]
