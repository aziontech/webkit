<script setup lang="ts">
  import Spinner from '@aziontech/webkit/spinner'

  import MockupElevator from '../MockupElevator.vue'
  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'WorkloadDeployFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the elevator runs only while it is. */
    hover?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true

  const EVENTS = [
    { icon: 'pi pi-cog', label: 'Build started', note: 'vue preset' },
    { icon: 'pi pi-box', label: 'Bundle produced', note: '1.4 MB' },
    { icon: 'pi pi-cloud-upload', label: 'Assets uploaded', note: '214 objects' },
    { icon: 'ai ai-edge-functions', label: 'Functions bundled', note: '2 functions' },
    { icon: 'pi pi-globe', label: 'Propagating', note: '100+ locations' },
    { icon: 'pi pi-lock', label: 'Certificates verified', note: 'TLS 1.3' },
    { icon: 'pi pi-bolt', label: 'Cache warmed', note: 'storefront-prod' },
    { icon: 'pi pi-check-circle', label: 'Live everywhere', note: '18s total' }
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
    <div class="flex h-full flex-col gap-(--spacing-sm) p-(--spacing-xs)">
      <MockupPart :order="0">
        <div
          class="flex items-center gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm)"
        >
          <i
            class="pi pi-cloud-upload shrink-0 text-body-md leading-none text-(--text-muted)"
            aria-hidden="true"
          />
          <span class="flex min-w-0 flex-col">
            <span class="truncate text-body-sm text-(--text-default)">Deploying v42</span>
            <span class="truncate text-label-sm text-(--text-muted)">storefront-prod</span>
          </span>
          <Spinner class="ml-auto size-6 shrink-0 text-(--text-default)" />
        </div>
      </MockupPart>

      <MockupPart
        :order="1"
        class="min-h-0 flex-1"
      >
        <MockupElevator
          :count="EVENTS.length"
          :active="hover || !canHover"
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
              <span class="ml-auto truncate text-label-sm text-(--text-muted)">
                {{ EVENTS[index].note }}
              </span>
            </div>
          </template>
        </MockupElevator>
      </MockupPart>
    </div>
  </ShellMockup>
</template>
