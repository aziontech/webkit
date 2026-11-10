<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import StickyScrollCode from '@aziontech/webkit/sticky-scroll-code'

  const items = [
    {
      title: 'Automated deployment via Git or CLI',
      description:
        'Run one command from the project you already have, or connect the repository and let every push to the branch ship itself.',
      action: {
        label: 'Docs',
        href: 'https://www.azion.com/en/documentation/devtools/',
        trailing: true
      },
      code: {
        fileName: 'deploy.sh',
        fileIcon: 'ai ai-azion-cli',
        language: 'bash',
        code: '# Ship the project in front of you\nazion deploy\n\n# Or link the repo once, and every push to main deploys\nazion link --preset next\ngit push origin main\n\n# Then roll back if it should not have gone out\nazion rollback --to previous',
        copyAriaLabel: 'Copy the deploy.sh sample'
      }
    },
    {
      title: 'Compatibility with modern web frameworks',
      description:
        'Next, Nuxt, Astro, Svelte and twenty more build through a preset the CLI detects, so the config file stays this short.',
      action: {
        label: 'Docs',
        href: 'https://www.azion.com/en/documentation/devtools/',
        trailing: true
      },
      code: {
        fileName: 'azion.config.js',
        fileIcon: 'ai-cor ai-js',
        language: 'javascript',
        code: "import { defineConfig } from 'azion'\n\nexport default defineConfig({\n  build: {\n    entry: 'src/index.ts',\n    worker: true,\n    preset: 'next'\n  },\n  functions: [\n    { name: 'storefront', path: '.edge/worker.js' }\n  ]\n})",
        copyAriaLabel: 'Copy the azion.config.js sample'
      }
    },
    {
      title: 'APIs for automation and integration',
      description:
        'Everything the console does is a call you can make yourself, so a workload can be created by the pipeline that needed it.',
      action: {
        label: 'Docs',
        href: 'https://www.azion.com/en/documentation/devtools/',
        trailing: true
      },
      code: {
        fileName: 'create-workload.sh',
        fileIcon: 'ai ai-azion-cli',
        language: 'bash',
        code: '# Create the workload the pipeline just built for\ncurl -X POST https://api.azion.com/v4/workloads \\\n  -H "Authorization: Token $AZION_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "name": "storefront",\n    "domains": ["storefront.example.com"]\n  }\'',
        copyAriaLabel: 'Copy the create-workload.sh sample'
      }
    },
    {
      title: 'Infrastructure as code with Terraform',
      description:
        'Declare workloads, applications and domains in the provider and apply them under the same review as the rest of your estate.',
      action: {
        label: 'Docs',
        href: 'https://www.azion.com/en/documentation/devtools/',
        trailing: true
      },
      code: {
        fileName: 'main.tf',
        fileIcon: 'ai-cor ai-terraform',
        language: 'hcl',
        code: 'resource "azion_application" "storefront" {\n  name                    = "storefront"\n  edge_functions          = true\n  application_accelerator = true\n}\n\nresource "azion_workload" "storefront" {\n  name    = "storefront"\n  domains = ["storefront.example.com"]\n\n  application {\n    id = azion_application.storefront.id\n  }\n}',
        copyAriaLabel: 'Copy the main.tf sample'
      }
    },
    {
      title: 'Metrics and events via GraphQL API',
      description:
        'Query the same numbers the console charts, from one endpoint, so a dashboard you already run can carry the platform too.',
      action: {
        label: 'Docs',
        href: 'https://www.azion.com/en/documentation/devtools/',
        trailing: true
      },
      code: {
        fileName: 'requests.graphql',
        fileIcon: 'ai-cor ai-graphql',
        language: 'graphql',
        code: 'query RequestsByStatus($begin: DateTime!, $end: DateTime!) {\n  httpMetrics(\n    limit: 100\n    filter: { tsRange: { begin: $begin, end: $end } }\n    groupBy: [status]\n  ) {\n    status\n    requests: sum(field: requests)\n    p95: percentile(field: requestTime, percentile: 95)\n  }\n}',
        copyAriaLabel: 'Copy the requests.graphql sample'
      }
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <StickyScrollCode
      eyebrow="Ship It"
      title="Everything You Need to Build and Deploy"
      description="Deploy from Git or the CLI, automate with APIs and Terraform, and query every metric over GraphQL. One platform carries your web app from the first push to the traffic it serves."
      :items="items"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
