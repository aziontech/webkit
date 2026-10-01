<script setup>
  import { BUILD_CTA, LEARNING_CENTER, quotesLedBy } from '../data/solutions.js'
  import SolutionPage from './SolutionPage.vue'

  const HERO = {
    eyebrow: 'Financial services',
    title: 'Accelerate financial services with security and compliance',
    description:
      'High availability, low latency, and advanced security for financial applications and APIs on distributed infrastructure. Reduce cloud costs, reliance on legacy CDNs, and operational complexity with continuous compliance.'
  }

  const CAPABILITIES = [
    {
      icon: 'pi pi-server',
      title: 'High availability',
      description:
        'Ensure operational continuity for latency-sensitive financial applications and APIs, with automatic scalability and real-time responses, even during transaction peaks.'
    },
    {
      icon: 'pi pi-shield',
      title: 'Advanced security',
      description:
        'Protect financial data and transactions with multilayer security integrated into the application, mitigating API attacks, DDoS, and bots without increasing operational complexity.'
    },
    {
      icon: 'pi pi-check-circle',
      title: 'Continuous compliance',
      description:
        'Meet regulatory requirements with consistent security policies and continuous auditing across distributed environments, without compromising performance or development agility.'
    }
  ]

  const ARCHITECTURE = {
    title: 'Protect financial applications with advanced security on distributed infrastructure',
    illustration: 'protect-financial-applications',
    alt: 'Web application and API protection architecture diagram for the financial sector, showing security layers from edge to origin.',
    href: 'https://www.azion.com/en/documentation/architectures/edge-firewall/web-application-and-api-protection-waap/'
  }

  const RESOURCES = {
    title: 'Guides and Resources',
    description:
      'Documentation, articles, and customer stories on building secure, compliant financial applications on distributed infrastructure.',
    items: [
      {
        title: 'New at Azion? Start your Azion journey seamlessly',
        description: 'This documentation will guide you through your first steps with Azion.',
        href: '/site/docs'
      },
      LEARNING_CENTER,
      {
        title: 'How Technology Can Help You Comply with Regulations for Fintech',
        description:
          'Distributed infrastructure provides robust security, regulatory compliance, and intelligent monitoring for reliable, scalable operations.',
        href: 'https://www.azion.com/en/blog/how-technology-can-help-comply-with-regulations-for-fintech/'
      },
      {
        title: 'How Justa is evolving its technology to meet modern digital demands',
        description:
          'Discover how Justa uses the Azion Web Platform to optimize security and performance in PIX and QR Code transactions.',
        href: 'https://www.azion.com/en/blog/how-justa-has-been-evolving-its-technology-to-meet-modern-digital-demands/'
      }
    ]
  }
</script>

<template>
  <SolutionPage
    :hero="HERO"
    :capabilities="CAPABILITIES"
    :architecture="ARCHITECTURE"
    :quotes="quotesLedBy('zoop')"
    :resources="RESOURCES"
    compliance
    primitives-title="Primitives that Scale with You"
    :network="false"
    :cta="BUILD_CTA"
  />
</template>
