<script setup>
  import Menu from '@aziontech/webkit/menu'
  import { computed, ref } from 'vue'

  const groups = [
    {
      label: 'Build',
      items: [
        {
          id: 'applications',
          label: 'Applications',
          icon: 'pi pi-th-large',
          href: '/applications'
        },
        { id: 'functions', label: 'Functions', icon: 'pi pi-code', href: '/functions' }
      ]
    },
    {
      label: 'Secure',
      items: [
        { id: 'firewall', label: 'Firewall', icon: 'pi pi-shield', href: '/firewall' },
        { id: 'certificates', label: 'Certificates', icon: 'pi pi-lock', href: '/certificates' }
      ]
    }
  ]

  const routePath = ref('/applications')

  const activeId = computed(
    () =>
      groups.flatMap((group) => group.items).find((node) => node.href === routePath.value)?.id ?? ''
  )

  const push = (href) => {
    routePath.value = href
  }

  const navigate = (event, node) => {
    if (!node.href || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
    event.preventDefault()
    push(node.href)
  }
</script>

<template>
  <div class="flex w-[264px] flex-col gap-(--spacing-sm)">
    <Menu
      :groups="groups"
      :active-id="activeId"
      aria-label="Console navigation"
      @navigate="navigate"
    />
    <p
      class="px-(--spacing-sm) text-body-sm text-(--text-muted)"
      data-testid="client-routing-path"
    >
      Route: {{ routePath }}
    </p>
  </div>
</template>
