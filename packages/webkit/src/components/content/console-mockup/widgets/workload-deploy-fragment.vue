<script setup lang="ts">
  import Spinner from '../../../feedback/spinner/spinner.vue'
  import ConsoleMockupShell from '../parts/console-mockup-shell.vue'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupElevator from '../parts/mockup-elevator.vue'

  defineOptions({ name: 'WorkloadDeployFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the elevator runs only while it is. */
    hovered?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true, hover: false })

  const EVENTS = [
    { icon: 'az az-settings', label: 'Build started', note: 'vue preset' },
    { icon: 'az az-box', label: 'Bundle produced', note: '1.4 MB' },
    { icon: 'az az-cloud-upload', label: 'Assets uploaded', note: '214 objects' },
    { icon: 'az az-functions', label: 'Functions bundled', note: '2 functions' },
    { icon: 'az az-globe', label: 'Propagating', note: '100+ locations' },
    { icon: 'az az-lock', label: 'Certificates verified', note: 'TLS 1.3' },
    { icon: 'az az-bolt', label: 'Cache warmed', note: 'storefront-prod' },
    { icon: 'az az-circle-check', label: 'Live everywhere', note: '18s total' }
  ]
</script>

<template>
  <ConsoleMockupShell
    variant="bare"
    :chrome="false"
    :active="active"
    :width="480"
    :mobile-width="360"
  >
    <div class="flex h-full flex-col gap-(--spacing-sm) p-(--spacing-xs)">
      <ConsoleMockupShellItem :order="0">
        <div
          class="flex items-center gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm)"
        >
          <i
            class="az az-cloud-upload shrink-0 text-body-md leading-none text-(--text-muted)"
            aria-hidden="true"
          />
          <span class="flex min-w-0 flex-col">
            <span class="truncate text-body-sm text-(--text-default)">Deploying v42</span>
            <span class="truncate text-label-sm text-(--text-muted)">storefront-prod</span>
          </span>
          <Spinner class="ms-auto size-6 shrink-0 text-(--text-default)" />
        </div>
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem
        :order="1"
        class="min-h-0 flex-1"
      >
        <MockupElevator
          :count="EVENTS.length"
          :active="hovered"
        >
          <template #default="{ index }">
            <div
              class="flex items-center gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm)"
            >
              <i
                :class="EVENTS[index].icon"
                class="shrink-0 text-body-sm leading-none text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="truncate text-body-sm text-(--text-default)">
                {{ EVENTS[index].label }}
              </span>
              <span class="ms-auto truncate text-label-sm text-(--text-muted)">
                {{ EVENTS[index].note }}
              </span>
            </div>
          </template>
        </MockupElevator>
      </ConsoleMockupShellItem>
    </div>
  </ConsoleMockupShell>
</template>
