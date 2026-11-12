<script setup>
  import CardPricing from '@aziontech/webkit/card-pricing'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <CardPricing
    plan-title="Pro"
    pricing-details="Billed annually or $25/mo billed monthly."
    slot-position="middle"
    kind="contained"
    show-tag
    tag-label="Popular"
    value="20"
    prefix="$"
    suffix="/ mon"
  >
    <ul class="m-0 flex list-none flex-col gap-2 p-0 text-body-sm text-(--text-default)">
      <li class="flex items-center gap-2">
        <i
          class="pi pi-check text-(--primary)"
          aria-hidden="true"
        />
        Unlimited rules engine
      </li>
      <li class="flex items-center gap-2">
        <i
          class="pi pi-check text-(--primary)"
          aria-hidden="true"
        />
        Global edge deployment
      </li>
      <li class="flex items-center gap-2">
        <i
          class="pi pi-check text-(--primary)"
          aria-hidden="true"
        />
        Advanced observability
      </li>
      <li class="flex items-center gap-2">
        <i
          class="pi pi-check text-(--primary)"
          aria-hidden="true"
        />
        24/7 support
      </li>
    </ul>
    <template #actions>
      <Button
        label="Start with Pro"
        kind="primary"
        size="large"
        class="w-full"
      />
    </template>
  </CardPricing>
</template>
