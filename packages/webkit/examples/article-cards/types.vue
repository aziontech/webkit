<script setup>
  import ArticleCards from '@aziontech/webkit/article-cards'
  import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'
  import netshoesExtendedReversed from '@aziontech/webkit/assets/netshoes-extended-reversed.svg'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
  import rennerExtendedColor from '@aziontech/webkit/assets/renner-extended-color.svg'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <ArticleCards
      kind="left"
      title="Related Articles"
      aria-label="Related Articles"
      :items="[
        {
          key: 'how-to-reduce-ai-agent-latency',
          href: '/blog/how-to-reduce-ai-agent-latency',
          title: 'How Do You Reduce AI Agent Latency?',
          description:
            'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state.',
          meta: 'SEP 23, 2026 • 8 min read',
          image: placeholderImage
        },
        {
          key: 'cloudflare-alternatives-and-competitors',
          href: '/blog/cloudflare-alternatives-and-competitors',
          title: 'Best Cloudflare Alternatives and Competitors',
          description:
            'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting.',
          meta: 'SEP 22, 2026 • 13 min read',
          image: placeholderImage
        },
        {
          key: 'which-azion-plan-is-right-for-your-project',
          href: '/blog/which-azion-plan-is-right-for-your-project',
          title: 'Which Azion Plan Is Right for Your Project?',
          description: 'Compare Azion’s Hobby, Pro, and Enterprise plans.',
          meta: 'SEP 22, 2026 • 7 min read',
          image: placeholderImage
        }
      ]"
    />
    <ArticleCards
      kind="centered"
      eyebrow="Success cases"
      title="When our customers succeed, we succeed"
      aria-label="When our customers succeed, we succeed"
      :items="[
        {
          key: 'netshoes',
          href: '/success-cases/netshoes',
          title: 'Netshoes Blocks 4M+ Threats in 6 Months with Azion WAF',
          description:
            'Netshoes strengthened its e-commerce security and improved the shopping experience.',
          meta: 'FEB 4, 2022 • 4 min read',
          mark: {
            name: 'Netshoes',
            logo: netshoesExtendedReversed
          }
        },
        {
          key: 'renner',
          href: '/success-cases/renner',
          title: 'Lojas Renner Optimizes Online Shopping Journey with Azion',
          description: 'Faster product pages allowed Renner to scale its e-commerce platform.',
          meta: 'AUG 10, 2021 • 4 min read',
          mark: { name: 'Renner', logo: rennerExtendedColor }
        },
        {
          key: 'gpa',
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
