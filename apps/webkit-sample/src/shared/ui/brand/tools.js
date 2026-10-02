// Tool marks for the site's "Your Stack, Your Way" strip.
//
// The counterpart to `clients/index.js`: same entry shape ({ name, logo, artwork }),
// same `<img src>` resolution through Vite, read by the same `Ticker` —
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
import angular from '@aziontech/webkit/assets/angular-symbol-mono.svg'
import anthropic from '@aziontech/webkit/assets/anthropic-extended-mono.svg'
import astro from '@aziontech/webkit/assets/astro-symbol-mono.svg'
import aws from '@aziontech/webkit/assets/aws-extended-mono.svg'
import azure from '@aziontech/webkit/assets/azure-symbol-mono.svg'
import docusaurus from '@aziontech/webkit/assets/docusaurus-symbol-mono.svg'
import drizzle from '@aziontech/webkit/assets/drizzle-extended-color.svg'
import elastic from '@aziontech/webkit/assets/elastic-symbol-mono.svg'
import eleventy from '@aziontech/webkit/assets/eleventy-symbol-mono.svg'
import equinix from '@aziontech/webkit/assets/equinix-extended-color.svg'
import gatsby from '@aziontech/webkit/assets/gatsby-symbol-mono.svg'
import gcp from '@aziontech/webkit/assets/gcp-symbol-mono.svg'
import github from '@aziontech/webkit/assets/github-symbol-mono.svg'
import grafana from '@aziontech/webkit/assets/grafana-symbol-mono.svg'
import graphql from '@aziontech/webkit/assets/graphql-symbol-mono.svg'
import groq from '@aziontech/webkit/assets/groq-extended-mono.svg'
import hexo from '@aziontech/webkit/assets/hexo-symbol-mono.svg'
import hono from '@aziontech/webkit/assets/hono-symbol-mono.svg'
import hugo from '@aziontech/webkit/assets/hugo-symbol-mono.svg'
import jekyll from '@aziontech/webkit/assets/jekyll-symbol-mono.svg'
import kafka from '@aziontech/webkit/assets/kafka-extended-mono.svg'
import nextjs from '@aziontech/webkit/assets/nextjs-symbol-mono.svg'
import nodejs from '@aziontech/webkit/assets/nodejs-symbol-color.svg'
import nuxt from '@aziontech/webkit/assets/nuxt-extended-mono.svg'
import openai from '@aziontech/webkit/assets/openai-symbol-mono.svg'
import preact from '@aziontech/webkit/assets/preact-symbol-mono.svg'
import qwik from '@aziontech/webkit/assets/qwik-symbol-mono.svg'
import react from '@aziontech/webkit/assets/react-symbol-mono.svg'
import remix from '@aziontech/webkit/assets/remix-symbol-mono.svg'
import sqlite from '@aziontech/webkit/assets/sqlite-symbol-mono.svg'
import terraform from '@aziontech/webkit/assets/terraform-symbol-mono.svg'
import vite from '@aziontech/webkit/assets/vite-symbol-mono.svg'
import vitepress from '@aziontech/webkit/assets/vitepress-symbol-mono.svg'
import vue from '@aziontech/webkit/assets/vue-symbol-mono.svg'
import workersCloudflare from '@aziontech/webkit/assets/workers-cf-symbol-color.svg'

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
