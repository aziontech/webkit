<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'

  import MockupPart from '../MockupPart.vue'
  import ShellMockup, { type ShellMockupFade, type ShellMockupKind } from '../ShellMockup.vue'

  defineOptions({ name: 'WorkloadDomainsWidget' })

  interface Props {
    /** How the mockup is plated. */
    kind?: ShellMockupKind
    /** Draw the console bar over the body. */
    chrome?: boolean
    /** Design width of the frame from `md` up. */
    width?: number
    /** Edge the mockup fades out along. */
    fade?: ShellMockupFade
    /** Whether this widget is the one showing. */
    active?: boolean
  }

  withDefaults(defineProps<Props>(), {
    kind: 'window',
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
  <ShellMockup
    :kind="kind"
    :chrome="chrome"
    :width="width"
    :fade="fade"
    :active="active"
    title="Workloads › storefront-prod › Settings"
  >
    <div class="flex h-full flex-col gap-(--spacing-md) p-(--spacing-lg)">
      <MockupPart :order="0">
        <div class="flex items-center gap-(--spacing-sm)">
          <div class="flex min-w-0 flex-col">
            <h3 class="m-0 truncate text-heading-xs text-(--text-default)">Domains</h3>
            <p class="m-0 truncate text-body-sm text-(--text-muted)">
              The addresses this workload answers on, and the certificate each one is served with.
            </p>
          </div>
          <span class="ml-auto inline-flex shrink-0">
            <Button
              label="Add Domain"
              kind="outlined"
              size="medium"
              icon="pi pi-plus"
            />
          </span>
        </div>
      </MockupPart>

      <div
        class="flex flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
      >
        <MockupPart
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
            <span class="ml-auto hidden shrink-0 items-center gap-(--spacing-xs) md:flex">
              <Tag
                :label="row.environment"
                severity="secondary"
                size="small"
              />
              <Tag
                :label="row.certificate"
                severity="success"
                size="small"
              />
              <Tag
                label="TLS 1.3"
                severity="secondary"
                size="small"
              />
            </span>
          </div>
        </MockupPart>

        <MockupPart :order="1 + ROWS.length">
          <div class="flex items-center gap-(--spacing-sm) px-(--spacing-md) py-(--spacing-sm)">
            <span class="flex min-w-0 flex-col">
              <span class="truncate text-body-sm text-(--text-default)">Mutual authentication</span>
              <span class="truncate text-label-sm text-(--text-muted)">
                Require a client certificate verified against a Trusted CA.
              </span>
            </span>
            <span class="ml-auto inline-flex shrink-0">
              <Switch
                :model-value="true"
                aria-label="Mutual authentication"
              />
            </span>
          </div>
        </MockupPart>
      </div>
    </div>
  </ShellMockup>
</template>
