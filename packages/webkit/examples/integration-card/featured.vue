<script setup>
  import IntegrationCard from '@aziontech/webkit/integration-card'
  import { ref } from 'vue'

  const opened = ref('')

  const featured = [
    {
      id: 'split-testing',
      name: 'Split Testing',
      vendor: 'Acme Inc.',
      logo: 'az az-percentage',
      context: 'Application',
      description: 'Send a share of the traffic to a second version and compare the results.'
    },
    {
      id: 'bot-shield',
      name: 'Bot Shield',
      vendor: 'Acme Inc.',
      logo: 'az az-shield',
      context: 'Firewall',
      description:
        'Score every request and block the automated traffic before it reaches the origin.'
    },
    {
      id: 'request-signer',
      name: 'Request Signer',
      vendor: 'Acme Inc.',
      logo: 'az az-key',
      context: 'Firewall',
      description:
        'Sign every request with a rotating key, so the origin only answers signed traffic.'
    }
  ]
</script>

<template>
  <section
    class="flex w-full flex-col gap-(--spacing-sm)"
    aria-labelledby="card-featured-heading"
  >
    <h2
      id="card-featured-heading"
      class="text-heading-2xs text-(--text-default)"
    >
      Featured
    </h2>
    <ul class="m-0 grid list-none grid-cols-1 gap-(--spacing-md) p-0 sm:grid-cols-3">
      <li
        v-for="item in featured"
        :key="item.id"
        class="flex min-w-0"
      >
        <IntegrationCard
          class="w-full"
          featured
          :title="item.name"
          :vendor="item.vendor"
          :logo="item.logo"
          :description="item.description"
          :badges="[{ label: item.context }]"
          @select="opened = item.name"
        />
      </li>
    </ul>
    <p
      class="m-0 text-body-xs text-(--text-muted)"
      role="status"
    >
      {{ opened ? `Opened ${opened}` : '' }}
    </p>
  </section>
</template>
