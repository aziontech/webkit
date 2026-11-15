<script setup lang="ts">
  import Button from '../../../action/button/button.vue'
  import Switch from '../../../input/switch/switch.vue'
  import Card from '../../card/card.vue'
  import Tag from '../../tag/tag.vue'
  import ConsoleMockupShell, {
    type ConsoleMockupShellFade,
    type ConsoleMockupShellVariant
  } from '../parts/console-mockup-shell.vue'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'

  defineOptions({ name: 'WorkloadDomainsWidget' })

  interface Props {
    /** How the mockup is plated. */
    variant?: ConsoleMockupShellVariant
    /** Draw the console bar over the body. */
    chrome?: boolean
    /** Design width of the frame from `md` up. */
    width?: number
    /** Edge the mockup fades out along. */
    fade?: ConsoleMockupShellFade
    /** Whether this widget is the one showing. */
    active?: boolean
  }

  withDefaults(defineProps<Props>(), {
    variant: 'window',
    chrome: true,
    width: 860,
    fade: 'none',
    active: true
  })

  interface DomainRow {
    domain: string
    kind: string
    certificate: string
    environment: string
  }

  const ROWS: DomainRow[] = [
    {
      domain: 'storefront.azion.app',
      kind: 'Azion domain',
      certificate: 'Azion certificate',
      environment: 'Production'
    },
    {
      domain: 'shop.example.com',
      kind: 'Custom domain',
      certificate: 'Let’s Encrypt',
      environment: 'Production'
    },
    {
      domain: 'staging.shop.example.com',
      kind: 'Custom domain',
      certificate: 'Let’s Encrypt',
      environment: 'Staging'
    }
  ]
</script>

<template>
  <ConsoleMockupShell
    :variant="variant"
    :chrome="chrome"
    :width="width"
    :fade="fade"
    :active="active"
    title="Workloads › storefront-prod › Settings"
  >
    <div class="flex h-full flex-col justify-center p-(--spacing-lg)">
      <ConsoleMockupShellItem :order="0">
        <Card
          :padded="false"
          class="w-full overflow-hidden"
        >
          <template #header>
            <h3 class="m-0 truncate text-heading-xs text-(--text-default)">Domains</h3>
            <span class="ms-auto inline-flex shrink-0">
              <Button
                label="Add Domain"
                variant="outline"
                size="medium"
                icon="ai ai-plus"
              />
            </span>
          </template>

          <template #default>
            <ConsoleMockupShellItem
              v-for="(row, index) in ROWS"
              :key="row.domain"
              :order="1 + index"
            >
              <div
                class="flex items-center gap-(--spacing-sm) border-b border-(--border-muted) px-(--spacing-md) py-(--spacing-sm)"
              >
                <i
                  class="ai ai-domains shrink-0 text-body-md leading-none text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="flex min-w-0 flex-col">
                  <span class="truncate text-body-sm text-(--text-default)">{{ row.domain }}</span>
                  <span class="truncate text-label-sm text-(--text-muted)">{{ row.kind }}</span>
                </span>
                <span class="ms-auto hidden shrink-0 items-center gap-(--spacing-xs) md:flex">
                  <Tag
                    :label="row.environment"
                    severity="neutral"
                    size="small"
                  />
                  <Tag
                    :label="row.certificate"
                    severity="success"
                    size="small"
                  />
                  <Tag
                    label="TLS 1.3"
                    severity="neutral"
                    size="small"
                  />
                </span>
              </div>
            </ConsoleMockupShellItem>

            <ConsoleMockupShellItem :order="1 + ROWS.length">
              <div class="flex items-center gap-(--spacing-sm) px-(--spacing-md) py-(--spacing-sm)">
                <span class="flex min-w-0 flex-col">
                  <span class="truncate text-body-sm text-(--text-default)">
                    Mutual authentication
                  </span>
                  <span class="truncate text-label-sm text-(--text-muted)">
                    Require a client certificate verified against a Trusted CA.
                  </span>
                </span>
                <span class="ms-auto inline-flex shrink-0">
                  <Switch
                    :model-value="true"
                    aria-label="Mutual authentication"
                  />
                </span>
              </div>
            </ConsoleMockupShellItem>
          </template>
        </Card>
      </ConsoleMockupShellItem>
    </div>
  </ConsoleMockupShell>
</template>
