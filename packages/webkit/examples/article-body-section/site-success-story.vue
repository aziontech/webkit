<script setup>
  import ArticleBodySection from '@aziontech/webkit/article-body-section'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'

  const article = {
    title: 'Magalu Ensures High Availability at Scale with Azion',
    description:
      "Explore how Magalu enhances cybersecurity with Azion's Firewall and WAF, improving threat intelligence and bot management in retail.",
    date: 'FEB 4, 2022',
    readTime: '5 min read',
    href: 'https://www.azion.com/en/success-case/magalu/'
  }

  const trail = [
    {
      label: 'Success cases',
      href: '/success-cases'
    },
    {
      label: 'Retail',
      href: '/success-cases?industry=Retail'
    },
    {
      label: 'Magalu Ensures High Availability at Scale with Azion',
      active: true
    }
  ]

  const body =
    '## Challenge\n\nMagalu is the most innovative retail company in LATAM[1]. With 1.76 billion USD in digital sales in 2021[2]— an increase of 22% in comparison with 2020—Magalu has the largest Brazilian retail ecosystem, which includes:\n\n- Magalu’s e-commerce platform;\n- App Magalu, with over 50,000,000 installs on Google Play;\n- Magalu Marketplace; and\n- tens of companies and business units like Netshoes, KaBuM!, and more.\n\nHaving Magalu’s global-scale applications available at all times requires scalable zero-trust security solutions to contain threats, such as DDoS attacks and malicious bots. In addition, retail sites experience 200% more fraud on big holiday shopping days[3], demanding more effective monitoring of domains to prevent phishing attacks, in line with their strong compliance policies.\n\n## Solution\n\nMagalu counts on Azion’s platform to evolve its complex security posture through distributed, real-time firewall and analytics solutions, giving Magalu’s SOC squad granular access control, a fine-grained bot management platform, automated threat blocking, and more.\n\n## Results and Impact\n\nThrough the automated features and resources provided by Azion’s platform, Magalu simplified security operations by blocking millions of web application threats per year via WAF, as well as bad bots using Bot Manager. Moreover, these solutions help Magalu’s security experts to dedicate efforts on other complex and strategic issues, optimizing productivity and man-hour costs.'

  const share = {
    title: 'Share this article',
    copyLink: 'Copy link',
    shareX: 'Share on X',
    shareLinkedIn: 'Share on LinkedIn'
  }

  const community = {
    title: 'Community',
    links: [
      {
        label: 'Join us on Discord',
        href: 'https://discord.com/invite/Yp9N7RMVZy',
        icon: 'ai ai-discord'
      },
      {
        label: 'Read our blog posts',
        href: '/blog',
        icon: 'ai ai-comment'
      },
      {
        label: 'Follow us on X',
        href: 'https://twitter.com/aziontech',
        icon: 'ai ai-x-brand'
      }
    ]
  }

  const copyPage = {
    label: 'Copy page',
    menu: [
      {
        value: 'link',
        label: 'Get page link',
        icon: 'ai ai-link'
      },
      {
        value: 'markdown',
        label: 'View page as markdown',
        icon: 'ai ai-eye'
      },
      {
        value: 'google',
        label: 'Open in Google AI',
        icon: 'ai ai-external-link'
      },
      {
        value: 'perplexity',
        label: 'Open in Perplexity',
        icon: 'ai ai-external-link'
      },
      {
        value: 'claude',
        label: 'Open in Claude',
        icon: 'ai ai-external-link'
      },
      {
        value: 'chatgpt',
        label: 'Open in ChatGPT',
        icon: 'ai ai-external-link'
      },
      {
        value: 'grok',
        label: 'Open in Grok',
        icon: 'ai ai-external-link'
      }
    ]
  }
</script>

<template>
  <ArticleBodySection
    eyebrow="Blog"
    :article="article"
    :trail="trail"
    :body="body"
    :banner="placeholderImage"
    :share="share"
    :community="community"
    :copy-page="copyPage"
  />
</template>
