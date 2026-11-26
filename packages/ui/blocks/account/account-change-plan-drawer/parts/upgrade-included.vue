<script setup lang="ts">
  import Link from '@aziontech/ui/link'
  import PlanFeatureList from '@aziontech/ui/plan-feature-list'
  import Separator from '@aziontech/ui/separator'

  import type { ChangePlanDrawerFeature } from '../account-change-plan-drawer.vue'

  export interface UpgradeIncludedProps {
    /** What the upgrade includes. */
    includedFeatures: ChangePlanDrawerFeature[]
  }

  defineProps<UpgradeIncludedProps>()

  const pricingLinks = [
    { label: 'Learn more about pricing', href: 'https://example.com/pricing' },
    { label: 'Compare plans', href: 'https://example.com/pricing#comparison' }
  ]
</script>

<template>
  <aside class="flex flex-col gap-(--spacing-md)">
    <div class="flex flex-col gap-(--spacing-xs)">
      <h3
        class="flex shrink-0 items-center px-(--spacing-xs) text-label-lg text-(--text-default) @3xl:py-(--spacing-sm)"
      >
        What's included
      </h3>
      <div class="px-(--spacing-xs)">
        <PlanFeatureList :items="includedFeatures" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <Separator />
      <div
        v-for="link in pricingLinks"
        :key="link.label"
        class="ms-(--spacing-xs) w-fit"
      >
        <Link
          :label="link.label"
          :href="link.href"
          target="_blank"
          size="small"
          class="w-full"
        />
      </div>
    </div>
  </aside>
</template>
