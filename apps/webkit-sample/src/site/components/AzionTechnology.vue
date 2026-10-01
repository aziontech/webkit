<script setup>
  import { BUILD_CTA, successStory } from '../data/solutions.js'
  import SolutionPage from './SolutionPage.vue'

  const HERO = {
    eyebrow: 'Technology',
    title: 'Build high-performance applications',
    description:
      'Develop modern applications with high-performance APIs and microservices on distributed infrastructure. Ensure low latency, scalability during traffic spikes, and advanced security for serverless applications, reducing operational complexity and bringing processing closer to users.',
    art: {
      name: 'implement-api-gateway-security',
      alt: 'API Gateway Security Architecture Diagram'
    }
  }

  const CAPABILITIES = [
    {
      icon: 'pi pi-bolt',
      title: 'API performance',
      description:
        'Build high-performance APIs and microservices with low latency and automatic scalability, maintaining consistency even during traffic spikes.'
    },
    {
      icon: 'pi pi-shield',
      title: 'API security',
      description:
        'Protect APIs and services with multilayer security integrated into distributed infrastructure, with automated threat detection and real-time monitoring.'
    },
    {
      icon: 'pi pi-code',
      title: 'Modern development',
      description:
        'Create serverless applications using your preferred frameworks, running code closer to users while simplifying deployments and operations.'
    }
  ]

  const ARCHITECTURE = {
    title: 'Implement API Gateway security on distributed infrastructure',
    illustration: 'implement-api-gateway-security',
    alt: 'API Gateway Security Architecture Diagram',
    href: 'https://www.azion.com/en/documentation/architectures/api-gateways/implement-api-gateways-security/'
  }

  const STORIES = {
    eyebrow: 'Success Stories',
    title: 'The Infrastructure Behind Leading Tech Companies',
    items: [
      successStory(
        'Tech',
        'Contabilizei improves the performance of its accounting platform by 73% and reduces front-end costs by 96% by creating advanced caching rules with Azion',
        'contabilizei/'
      ),
      successStory(
        'Tech',
        'GetNinjas processes 70% of requests on distributed infrastructure while supporting 60% monthly growth',
        'getninjas/'
      )
    ]
  }

  const RESOURCES = {
    title: 'Guides and Resources',
    items: [
      {
        eyebrow: 'Documentation',
        title: 'New at Azion? Start your Azion journey seamlessly',
        description: 'This documentation will guide you through your first steps with Azion.',
        action: 'Read documentation',
        href: '/site/docs'
      },
      {
        eyebrow: 'Documentation',
        title: 'Build modern applications with Functions',
        description: 'Learn how to create serverless functions that run closer to users.',
        action: 'Read documentation',
        href: 'https://www.azion.com/en/documentation/products/build/edge-application/edge-functions/'
      },
      {
        eyebrow: 'Documentation',
        title: 'SQL Database for modern applications',
        description:
          'Discover how to leverage SQL Database to build data-driven applications on distributed infrastructure.',
        action: 'Read documentation',
        href: 'https://www.azion.com/en/documentation/products/store/edge-sql/'
      }
    ]
  }
</script>

<template>
  <SolutionPage
    :hero="HERO"
    :capabilities="CAPABILITIES"
    :architecture="ARCHITECTURE"
    :stories="STORIES"
    :resources="RESOURCES"
    compliance
    primitives-title="Primitives that Scale with You"
    :network="false"
    :cta="BUILD_CTA"
  />
</template>
