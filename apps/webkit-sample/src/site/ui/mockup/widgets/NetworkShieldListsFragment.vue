<script setup lang="ts">
  import Tag from '@aziontech/webkit/tag'

  import MockupElevator from '../MockupElevator.vue'
  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'NetworkShieldListsFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the elevator runs only while it is. */
    hover?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true

  const ROWS = [
    { name: 'qa-p-nl-ip', id: '56585', type: 'IP/CIDR' },
    { name: 'qa-nl-countries', id: '56398', type: 'Countries' },
    { name: 'qa-rt-nl-draft', id: '56530', type: 'IP/CIDR' },
    { name: 'qa-nl-syntax', id: '56410', type: 'IP/CIDR' },
    { name: 'qa-qb-nl-ctry', id: '56786', type: 'Countries' },
    { name: 'qa-nl-ipcidr', id: '56396', type: 'IP/CIDR' },
    { name: 'qa-qd-nl', id: '56778', type: 'IP/CIDR' },
    { name: 'qa-ld-nl', id: '56726', type: 'IP/CIDR' }
  ]
</script>

<template>
  <ShellMockup
    kind="bare"
    shell="legacy"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="360"
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
                class="ai ai-network-lists shrink-0 text-body-md leading-none text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="flex min-w-0 flex-col">
                <span class="truncate text-body-sm text-(--text-default)">
                  {{ ROWS[index].name }}
                </span>
                <span class="text-body-xs text-(--text-muted)">{{ ROWS[index].id }}</span>
              </span>
              <span class="ml-auto flex shrink-0 items-center">
                <Tag
                  :label="ROWS[index].type"
                  severity="secondary"
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
