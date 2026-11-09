<script setup lang="ts">
  import Tag from '../../../tag/tag.vue'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'
  import MockupElevator from '../parts/mockup-elevator.vue'

  defineOptions({ name: 'WorkloadDomainFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the elevator runs only while it is. */
    hover?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true

  const ROWS = [
    { domain: 'storefront.azion.app', certificate: 'Azion certificate' },
    { domain: 'shop.example.com', certificate: 'Let’s Encrypt' },
    { domain: 'staging.shop.example.com', certificate: 'Let’s Encrypt' },
    { domain: 'api.example.com', certificate: 'Let’s Encrypt' },
    { domain: 'cdn.example.com', certificate: 'Let’s Encrypt' },
    { domain: 'checkout.example.com', certificate: 'Let’s Encrypt' },
    { domain: 'docs.example.com', certificate: 'Let’s Encrypt' },
    { domain: 'status.example.com', certificate: 'Let’s Encrypt' }
  ]
</script>

<template>
  <ShellMockup
    kind="bare"
    :chrome="false"
    :active="active"
    :width="480"
    :mobile-width="360"
  >
    <div class="flex h-full flex-col p-(--spacing-xs)">
      <ShellMockupPart
        :order="0"
        class="min-h-0 flex-1"
      >
        <MockupElevator
          :count="ROWS.length"
          :active="hover || !canHover"
        >
          <template #default="{ index }">
            <div
              class="flex items-center gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm)"
            >
              <i
                class="ai ai-domains shrink-0 text-body-md leading-none text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="truncate text-body-sm text-(--text-default)">
                {{ ROWS[index].domain }}
              </span>
              <span class="ml-auto flex shrink-0 items-center gap-(--spacing-xs)">
                <Tag
                  :label="ROWS[index].certificate"
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
          </template>
        </MockupElevator>
      </ShellMockupPart>
    </div>
  </ShellMockup>
</template>
