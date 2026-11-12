<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import ComparisonTable from '@aziontech/webkit/comparison-table'

  const competitor = {
    name: 'Vercel',
    logo: '/marketing-components/competitors/vercel-extended-reversed.svg',
    logoLight: '/marketing-components/competitors/vercel-extended-mono.svg'
  }

  const groups = [
    {
      title: 'Platform',
      rows: [
        {
          capability: 'Delivery, compute, storage, and security on one platform',
          definition:
            'Delivery, compute, storage, and security run on one platform with one configuration model.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Git-connected builds and preview deployments',
          definition:
            'Building from a Git push, with a preview URL for each branch before release.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Delivery rules changed without redeploying the application',
          definition: 'Changing cache, routing, and header rules without shipping a new build.',
          azion: 'full',
          competitor: 'partial'
        }
      ]
    },
    {
      title: 'Compute',
      rows: [
        {
          capability: 'JavaScript and WebAssembly runtime',
          definition: 'Running application code close to users on web-standard APIs.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Cold-start-free function execution',
          definition: 'Functions that answer the first request without a startup delay.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'AI inference on the platform',
          definition: 'Running AI models on the provider’s network, close to users.',
          azion: 'full',
          competitor: 'partial'
        }
      ]
    },
    {
      title: 'Storage',
      rows: [
        {
          capability: 'Distributed key-value store',
          definition:
            'Low-latency reads for configuration, flags, and sessions replicated close to users.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'S3-compatible object storage',
          definition: 'S3-compatible storage for files and objects.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Distributed SQL database with vector search',
          definition:
            'A relational database replicated close to users, with similarity search for AI applications.',
          azion: 'full',
          competitor: 'none'
        }
      ]
    },
    {
      title: 'Security',
      rows: [
        {
          capability: 'Managed WAF for applications and APIs',
          definition: 'Managed rules that block attacks on applications and APIs.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'API discovery and protection',
          definition: 'Finding the APIs you expose and applying security rules to each one.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Bot management',
          definition: 'Detecting and blocking automated traffic before it reaches the application.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'DDoS protection included with delivery',
          definition:
            'Absorbing volumetric and application-layer attacks without buying a separate product.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Network-layer firewall',
          definition: 'Filtering traffic by IP, network, and location below the application layer.',
          azion: 'full',
          competitor: 'none'
        }
      ]
    },
    {
      title: 'Delivery and networking',
      rows: [
        {
          capability: 'Tiered caching and origin offload',
          definition: 'Intermediate cache layers that cut the requests reaching your origin.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Image and video optimization',
          definition:
            'Resizing, compressing, and converting media on delivery instead of at the origin.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Authoritative DNS',
          definition: 'Hosting and answering the DNS records of your domains.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Load balancing across multi-cloud origins',
          definition:
            'Spreading traffic across origins on different cloud providers or on premises.',
          azion: 'full',
          competitor: 'none'
        },
        {
          capability: 'Accelerate and protect origins hosted elsewhere',
          definition:
            'Putting delivery, caching, and security in front of an application that runs on another provider.',
          azion: 'full',
          competitor: 'none'
        }
      ]
    },
    {
      title: 'Observability',
      rows: [
        {
          capability: 'Real-time metrics and event search',
          definition:
            'Live traffic, performance, and security dashboards, with a query over the events of each request.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Log streaming to third-party tools',
          definition: 'Sending logs in real time to your SIEM or data lake.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Real-user monitoring',
          definition: 'Measuring the performance users experience in the browser.',
          azion: 'full',
          competitor: 'full'
        }
      ]
    },
    {
      title: 'Commercial',
      rows: [
        {
          capability: 'Published pay-as-you-go pricing',
          definition: 'Per-unit prices published up front, so you know what a month will cost.',
          azion: 'full',
          competitor: 'full'
        }
      ]
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <ComparisonTable
      eyebrow="Comparison"
      title="How Azion compares with Vercel"
      caption="How Azion compares with Vercel"
      column-label="Capability"
      full-label="Full support"
      partial-label="Partial support"
      none-label="Not available"
      :competitor="competitor"
      :groups="groups"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
