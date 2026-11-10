const DOCS_HREF = 'https://www.azion.com/en/documentation/devtools/'

const CAPABILITIES = [
  {
    href: DOCS_HREF,
    title: 'Automated deployment via Git or CLI',
    description:
      'Run one command from the project you already have, or connect the repository and let every push to the branch ship itself.'
  },
  {
    href: DOCS_HREF,
    title: 'Compatibility with modern web frameworks',
    description:
      'Next, Nuxt, Astro, Svelte and twenty more build through a preset the CLI detects, so the config file stays this short.'
  },
  {
    href: DOCS_HREF,
    title: 'APIs for automation and integration',
    description:
      'Everything the console does is a call you can make yourself, so a workload can be created by the pipeline that needed it.'
  },
  {
    href: DOCS_HREF,
    title: 'Infrastructure as code with Terraform',
    description:
      'Declare workloads, applications and domains in the provider and apply them under the same review as the rest of your estate.'
  },
  {
    href: DOCS_HREF,
    title: 'Metrics and events via GraphQL API',
    description:
      'Query the same numbers the console charts, from one endpoint, so a dashboard you already run can carry the platform too.'
  }
]

const SAMPLES = [
  {
    label: 'deploy.sh',
    value: 'deploy',
    language: 'bash',
    fileName: 'deploy.sh',
    fileIcon: 'ai ai-azion-cli',
    code: `# Ship the project in front of you
azion deploy

# Or link the repo once, and every push to main deploys
azion link --preset next
git push origin main

# Then roll back if it should not have gone out
azion rollback --to previous`
  },
  {
    label: 'azion.config.js',
    value: 'config',
    language: 'javascript',
    fileName: 'azion.config.js',
    fileIcon: 'ai-cor ai-js',
    code: `${'import'} { defineConfig } from 'azion'

export default defineConfig({
  build: {
    entry: 'src/index.ts',
    worker: true,
    preset: 'next'
  },
  functions: [
    { name: 'storefront', path: '.edge/worker.js' }
  ]
})`
  },
  {
    label: 'create-workload.sh',
    value: 'api',
    language: 'bash',
    fileName: 'create-workload.sh',
    fileIcon: 'ai ai-azion-cli',
    code: `# Create the workload the pipeline just built for
curl -X POST https://api.azion.com/v4/workloads \\
  -H "Authorization: Token $AZION_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "storefront",
    "domains": ["storefront.example.com"]
  }'`
  },
  {
    label: 'main.tf',
    value: 'terraform',
    language: 'hcl',
    fileName: 'main.tf',
    fileIcon: 'ai-cor ai-terraform',
    code: `resource "azion_application" "storefront" {
  name                    = "storefront"
  edge_functions          = true
  application_accelerator = true
}

resource "azion_workload" "storefront" {
  name    = "storefront"
  domains = ["storefront.example.com"]

  application {
    id = azion_application.storefront.id
  }
}`
  },
  {
    label: 'requests.graphql',
    value: 'metrics',
    language: 'graphql',
    fileName: 'requests.graphql',
    fileIcon: 'ai-cor ai-graphql',
    code: `query RequestsByStatus($begin: DateTime!, $end: DateTime!) {
  httpMetrics(
    limit: 100
    filter: { tsRange: { begin: $begin, end: $end } }
    groupBy: [status]
  ) {
    status
    requests: sum(field: requests)
    p95: percentile(field: requestTime, percentile: 95)
  }
}`
  }
]

export const SITE_SECTION = {
  _id: 'sticky-scroll-code',
  props: {
    eyebrow: 'Ship It',
    title: 'Everything You Need to Build and Deploy',
    description:
      'Deploy from Git or the CLI, automate with APIs and Terraform, and query every metric over GraphQL. One platform carries your web app from the first push to the traffic it serves.',
    items: CAPABILITIES.map(({ title, description, href }, index) => ({
      title,
      description,
      action: { label: 'Docs', href, trailing: true },
      code: {
        fileName: SAMPLES[index].fileName,
        fileIcon: SAMPLES[index].fileIcon,
        language: SAMPLES[index].language,
        code: SAMPLES[index].code,
        copyAriaLabel: `Copy the ${SAMPLES[index].fileName} sample`
      }
    }))
  }
}
