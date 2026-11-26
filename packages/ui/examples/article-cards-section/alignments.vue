<script setup>
  import ArticleCardsSection from '@aziontech/webkit/article-cards-section'
  import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'
  import netshoesExtendedReversed from '@aziontech/webkit/assets/netshoes-extended-reversed.svg'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
  import rennerExtendedColor from '@aziontech/webkit/assets/renner-extended-color.svg'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <ArticleCardsSection
      align="start"
      title="Related articles"
      aria-label="Related articles"
      :items="[
        {
          id: 'how-to-reduce-ai-agent-latency',
          href: '/blog/how-to-reduce-ai-agent-latency',
          title: 'How do you reduce AI agent latency?',
          description:
            'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state.',
          meta: 'SEP 23, 2026 • 8 min read',
          image: placeholderImage
        },
        {
          id: 'cloudflare-alternatives-and-competitors',
          href: '/blog/cloudflare-alternatives-and-competitors',
          title: 'Best Cloudflare alternatives and competitors',
          description:
            'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting.',
          meta: 'SEP 22, 2026 • 13 min read',
          image: placeholderImage
        },
        {
          id: 'which-azion-plan-is-right-for-your-project',
          href: '/blog/which-azion-plan-is-right-for-your-project',
          title: 'Which Azion plan is right for your project?',
          description: 'Compare Azion’s Hobby, Pro, and Enterprise plans.',
          meta: 'SEP 22, 2026 • 7 min read',
          image: placeholderImage
        }
      ]"
    />
    <ArticleCardsSection
      align="center"
      eyebrow="Success cases"
      title="When our customers succeed, we succeed"
      aria-label="When our customers succeed, we succeed"
      :items="[
        {
          id: 'netshoes',
          href: '/success-cases/netshoes',
          title: 'Netshoes blocks 4M+ threats in 6 months with Azion WAF',
          description:
            'Netshoes strengthened its e-commerce security and improved the shopping experience.',
          meta: 'FEB 4, 2022 • 4 min read',
          mark: {
            name: 'Netshoes',
            logo: netshoesExtendedReversed
          }
        },
        {
          id: 'renner',
          href: '/success-cases/renner',
          title: 'Lojas Renner optimizes its online shopping journey with Azion',
          description: 'Faster product pages allowed Renner to scale its e-commerce platform.',
          meta: 'AUG 10, 2021 • 4 min read',
          mark: { name: 'Renner', logo: rennerExtendedColor }
        },
        {
          id: 'gpa',
          href: '/success-cases/gpa',
          title: 'GPA solved a cyberattack and reduced costs by 30%',
          description:
            'Grupo Pão de Açúcar (GPA) solved a targeted DNS attack and reduced costs by 30%.',
          meta: 'MAY 6, 2025 • 4 min read',
          mark: { name: 'GPA', logo: gpaExtendedReversed }
        }
      ]"
    />
  </div>
</template>
