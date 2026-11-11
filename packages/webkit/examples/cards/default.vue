<script setup>
  import Cards from '@aziontech/webkit/cards'
  import Tag from '@aziontech/webkit/tag'

  const applications = [
    {
      id: 'app-1',
      name: 'storefront',
      status: 'Active',
      domain: 'shop.example.com',
      requests: '1.2M'
    },
    {
      id: 'app-2',
      name: 'checkout',
      status: 'Active',
      domain: 'pay.example.com',
      requests: '310K'
    },
    { id: 'app-3', name: 'blog', status: 'Inactive', domain: 'blog.example.com', requests: '0' },
    { id: 'app-4', name: 'docs', status: 'Active', domain: 'docs.example.com', requests: '88K' }
  ]
</script>

<template>
  <Cards :items="applications">
    <template #header="{ item }">{{ item.name }}</template>
    <template #default="{ item }">
      <dl class="grid grid-cols-[auto_1fr] gap-x-(--spacing-sm) gap-y-(--spacing-xxs)">
        <dt class="text-(--text-muted)">Status</dt>
        <dd>
          <Tag
            :label="item.status"
            :severity="item.status === 'Active' ? 'success' : 'secondary'"
            size="small"
          />
        </dd>
        <dt class="text-(--text-muted)">Domain</dt>
        <dd class="truncate">
          <bdi>{{ item.domain }}</bdi>
        </dd>
        <dt class="text-(--text-muted)">Requests</dt>
        <dd class="tabular-nums">{{ item.requests }}</dd>
      </dl>
    </template>
  </Cards>
</template>
