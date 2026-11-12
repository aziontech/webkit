<script setup>
  import ArticleBody from '@aziontech/webkit/article-body'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
</script>

<template>
  <ArticleBody
    eyebrow="Blog"
    :banner="placeholderImage"
    body="## Challenge&#10;&#10;Magalu is the most innovative retail company in LATAM.&#10;&#10;## Solution&#10;&#10;Magalu counts on Azion’s platform to evolve its security posture.&#10;&#10;## Results and Impact&#10;&#10;Magalu simplified security operations by blocking millions of threats per year."
    :article="{
      title: 'Magalu Ensures High Availability at Scale with Azion',
      description:
        'Explore how Magalu enhances cybersecurity with Azion’s Firewall and WAF, improving threat intelligence and bot management in retail.',
      date: 'FEB 4, 2022',
      readTime: '5 min read',
      href: 'https://www.azion.com/en/success-case/magalu/'
    }"
    :trail="[
      { label: 'Success cases', href: '/success-cases' },
      { label: 'Retail', href: '/success-cases?industry=Retail' },
      { label: 'Magalu Ensures High Availability at Scale with Azion', current: true }
    ]"
    :share="{
      title: 'Share this article',
      copyLink: 'Copy link',
      shareX: 'Share on X',
      shareLinkedIn: 'Share on LinkedIn'
    }"
    :community="{
      title: 'Community',
      links: [
        {
          label: 'Join us on Discord',
          href: 'https://discord.com/invite/Yp9N7RMVZy',
          icon: 'pi pi-discord'
        },
        { label: 'Read our blog posts', href: '/blog', icon: 'pi pi-comment' },
        { label: 'Follow us on X', href: 'https://twitter.com/aziontech', icon: 'ai ai-x' }
      ]
    }"
    :copy-page="{
      label: 'Copy page',
      menu: [
        { value: 'link', label: 'Get page link', icon: 'pi pi-link' },
        { value: 'markdown', label: 'View page as markdown', icon: 'pi pi-eye' }
      ]
    }"
  />
</template>
