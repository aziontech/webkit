<script setup>
  import SiteFooter from '@aziontech/webkit/site-footer'

  const columns = [
    {
      title: 'Products',
      links: [
        {
          label: 'Functions',
          href: '#'
        },
        {
          label: 'Cache',
          href: '#'
        },
        {
          label: 'Object Storage',
          href: '#'
        },
        {
          label: 'SQL Database',
          href: '#'
        },
        {
          label: 'WAF',
          href: '#'
        },
        {
          label: 'Edge DNS',
          href: '#'
        },
        {
          label: 'Data Stream',
          href: '#'
        }
      ]
    },
    {
      title: 'Solutions',
      links: [
        {
          label: 'Web Apps',
          href: '#'
        },
        {
          label: 'AI',
          href: '#'
        },
        {
          label: 'Application Security',
          href: '#'
        },
        {
          label: 'Financial Services',
          href: '#'
        },
        {
          label: 'Retail',
          href: '#'
        },
        {
          label: 'Technology',
          href: '#'
        }
      ]
    },
    {
      title: 'Developers',
      links: [
        {
          label: 'Docs',
          href: '#'
        },
        {
          label: 'API Reference',
          href: '#'
        },
        {
          label: 'Dev Tools',
          href: '#'
        },
        {
          label: 'Release Notes',
          href: '#'
        },
        {
          label: 'Marketplace',
          href: '#'
        },
        {
          label: 'Status',
          href: '#'
        }
      ]
    },
    {
      title: 'Company',
      links: [
        {
          label: 'About',
          href: '#'
        },
        {
          label: 'Customers',
          href: '#'
        },
        {
          label: 'Partners',
          href: '#'
        },
        {
          label: 'Careers',
          href: '#'
        },
        {
          label: 'Blog',
          href: '#'
        },
        {
          label: 'Contact',
          href: '#'
        }
      ]
    }
  ]

  const socials = [
    {
      icon: 'pi pi-github',
      label: 'Azion on GitHub',
      href: 'https://github.com/aziontech'
    },
    {
      icon: 'pi pi-linkedin',
      label: 'Azion on LinkedIn',
      href: 'https://www.linkedin.com/company/aziontech'
    },
    {
      icon: 'pi pi-youtube',
      label: 'Azion on YouTube',
      href: 'https://www.youtube.com/aziontech'
    },
    {
      icon: 'ai ai-x',
      label: 'Azion on X',
      href: 'https://x.com/aziontech'
    },
    {
      icon: 'pi pi-instagram',
      label: 'Azion on Instagram',
      href: 'https://www.instagram.com/aziontech'
    },
    {
      icon: 'pi pi-discord',
      label: 'Azion on Discord',
      href: 'https://discord.gg/azion'
    },
    {
      icon: 'pi pi-reddit',
      label: 'Azion on Reddit',
      href: 'https://www.reddit.com/r/aziontech'
    }
  ]

  const languages = ['EN', 'PT-BR', 'ES']
</script>

<template>
  <SiteFooter
    kind="site"
    aria-label="Footer"
    home="#"
    home-aria-label="Azion home"
    :columns="columns"
    :socials="socials"
    status-label="All Systems Operational"
    :languages="languages"
    language-aria-label="Language"
  />
</template>
