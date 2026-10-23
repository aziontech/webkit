<script setup lang="ts">
  import Tag from '@aziontech/webkit/tag'

  import MockupElevator from '../MockupElevator.vue'
  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'KvStoreSecurityListFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the elevator runs only while it is. */
    hover?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true

  const ROWS = [
    { key: 'ip:203.0.113.24', type: 'String', expiration: 'EX 86400' },
    { key: 'ip:198.51.100.7', type: 'String', expiration: 'EX 86400' },
    { key: 'asn:64500', type: 'JSON', expiration: 'No expiration' },
    { key: 'ua:sqlmap/1.7', type: 'String', expiration: 'No expiration' },
    { key: 'ip:192.0.2.181', type: 'String', expiration: 'EX 3600' },
    { key: 'sig:cve-2024-3400', type: 'JSON', expiration: 'No expiration' },
    { key: 'ip:203.0.113.90', type: 'String', expiration: 'EX 86400' },
    { key: 'token:revoked:4f1c', type: 'JSON', expiration: 'EX 3600' }
  ]
</script>

<template>
  <ShellMockup
    kind="bare"
    shell="legacy"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div class="flex h-full flex-col py-(--spacing-xs)">
      <MockupPart
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
                class="pi pi-key shrink-0 text-body-md leading-none text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="truncate text-body-sm text-(--text-default)">
                {{ ROWS[index].key }}
              </span>
              <span class="ml-auto flex shrink-0 items-center gap-(--spacing-xs)">
                <Tag
                  :label="ROWS[index].type"
                  severity="secondary"
                  size="small"
                />
                <Tag
                  :label="ROWS[index].expiration"
                  :severity="ROWS[index].expiration === 'No expiration' ? 'secondary' : 'warning'"
                  size="small"
                />
              </span>
            </div>
          </template>
        </MockupElevator>
      </MockupPart>
    </div>
  </ShellMockup>
</template>
