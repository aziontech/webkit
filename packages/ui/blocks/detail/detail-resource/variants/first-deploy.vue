<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import Link from '@aziontech/ui/link'

  import FirstDeployServiceCard from '../parts/first-deploy-service-card.vue'
  import SummaryFact from '../parts/summary-fact.vue'
  import SummaryFacts from '../parts/summary-facts.vue'
  import SummaryStateBand from '../parts/summary-state-band.vue'
  import SummarySubjectBand from '../parts/summary-subject-band.vue'
  import { firstDeployServices } from '../sample'

  const menu = [[{ value: 'settings', label: 'Settings', icon: 'az az-settings' }]]
  const pending = [
    { label: 'Deployment', empty: 'None' },
    { label: 'Domains', empty: 'None' },
    { label: 'Status', empty: 'Not deployed' },
    { label: 'Created', empty: 'Not yet' }
  ]
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
    <Card :padded="false">
      <template #default>
        <SummarySubjectBand
          icon="az az-globe"
          actions-label="Resource actions"
          :menu="menu"
        >
          <template #subject>
            <span class="truncate text-body-sm text-(--text-muted)">Not deployed yet</span>
          </template>
        </SummarySubjectBand>

        <SummaryFacts>
          <SummaryFact
            v-for="fact in pending"
            :key="fact.label"
            :label="fact.label"
            :empty="fact.empty"
            value-class=""
            class="lg:col-span-2"
          />

          <SummaryFact
            label="Source"
            value-class="flex-wrap gap-x-(--spacing-sm)"
            class="lg:col-span-2"
          >
            <Link
              href="#connect-repository"
              size="small"
              label="Connect Git repository"
            />
            <div class="flex min-w-0 items-center gap-(--spacing-2xs)">
              <i
                class="az az-cloud-upload shrink-0 text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="truncate text-body-sm text-(--text-default)">Project upload</span>
            </div>
          </SummaryFact>

          <SummaryFact
            label="Framework"
            class="lg:col-span-2"
          >
            <i
              class="az-color az-nuxt shrink-0 text-body-lg"
              aria-hidden="true"
            />
            <span class="truncate text-body-sm text-(--text-default)">Nuxt</span>
          </SummaryFact>
        </SummaryFacts>

        <SummaryStateBand docs="https://example.com/docs/cli">
          <p
            class="min-w-0 flex-1 basis-(--container-2xs) text-pretty text-body-sm text-(--text-muted)"
          >
            To deploy to Production, drop your project anywhere on this page, connect Git, or run
            <code class="font-(family-name:--font-code) text-body-sm text-(--text-default)"
              >platform deploy</code
            >
            via the CLI.
          </p>
        </SummaryStateBand>
      </template>
    </Card>

    <FirstDeployServiceCard
      v-for="service in firstDeployServices"
      :key="service.id"
      :service="service"
    />
  </div>
</template>
