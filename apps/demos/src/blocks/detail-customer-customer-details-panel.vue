<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import CopyButton from '@aziontech/ui/copy-button'
  import KeyValueList from '@aziontech/ui/key-value-list'
  import Link from '@aziontech/ui/link'
  import Rating from '@aziontech/ui/rating'
  import Skeleton from '@aziontech/ui/skeleton'
  import Tag from '@aziontech/ui/tag'
  import { useLocale } from '@aziontech/ui/use-locale'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  import type { DetailCustomerCustomer, DetailCustomerSatisfaction } from './detail-customer.vue'

  export interface CustomerDetailsPanelProps {
    /** The customer; undefined while loading. */
    customer?: DetailCustomerCustomer
    /** Their satisfaction surveys; undefined while loading. */
    satisfaction?: DetailCustomerSatisfaction
    /** A fixed reference time for the local time; left out, the real clock reads after mount. */
    now?: string | number | Date
    /** Skeletons stand in for the values. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<CustomerDetailsPanelProps>(), {
    customer: undefined,
    satisfaction: undefined,
    now: undefined,
    loading: false
  })

  const { formatDate, formatNumber, plural } = useLocale()

  const tick = ref<number | undefined>(undefined)
  let timer: ReturnType<typeof setInterval> | undefined
  const mounted = ref(false)
  onMounted(() => {
    mounted.value = true
    tick.value = Date.now()
    timer = setInterval(() => (tick.value = Date.now()), 60_000)
  })
  onBeforeUnmount(() => clearInterval(timer))

  const localTime = computed(() => {
    const at = props.now ?? tick.value
    if (at === undefined || !props.customer) return ''
    return formatDate(at, { timeStyle: 'short', timeZone: props.customer.timeZone })
  })
  const since = computed(() =>
    props.customer
      ? formatDate(props.customer.customerSince, {
          dateStyle: 'long',
          timeZone: props.now === undefined && mounted.value ? undefined : 'UTC'
        })
      : ''
  )
  const score = computed(() =>
    formatNumber(props.satisfaction?.average ?? 0, { maximumFractionDigits: 1 })
  )
  const surveys = computed(() =>
    plural(props.satisfaction?.surveys ?? 0, { one: '{count} survey', other: '{count} surveys' })
  )
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
    <Card title="Details">
      <KeyValueList
        :loading="loading"
        aria-label="Customer details"
      >
        <KeyValueList.Item label="Email">
          <template v-if="customer">
            <bdi class="min-w-0 truncate">{{ customer.email }}</bdi>
            <CopyButton
              :value="customer.email"
              aria-label="Copy email"
              size="small"
            />
          </template>
        </KeyValueList.Item>
        <KeyValueList.Item label="Phone">
          <template v-if="customer?.phone">
            <bdi dir="ltr">{{ customer.phone }}</bdi>
            <CopyButton
              :value="customer.phone"
              aria-label="Copy phone number"
              size="small"
            />
          </template>
        </KeyValueList.Item>
        <KeyValueList.Item label="Local time">
          <template v-if="customer">
            <bdi v-if="localTime">{{ localTime }}</bdi>
            <span class="text-(--text-muted)"
              ><bdi dir="ltr">{{ customer.timeZone }}</bdi></span
            >
          </template>
        </KeyValueList.Item>
        <KeyValueList.Item label="Language">
          <template v-if="customer">{{ customer.language }}</template>
        </KeyValueList.Item>
        <KeyValueList.Item label="Organization">
          <template v-if="customer">
            <Link
              v-if="customer.organizationHref"
              :href="customer.organizationHref"
              inline
            >
              <bdi>{{ customer.organization }}</bdi>
            </Link>
            <bdi v-else>{{ customer.organization }}</bdi>
          </template>
        </KeyValueList.Item>
        <KeyValueList.Item label="Tags">
          <ul
            v-if="customer?.tags.length"
            class="flex min-w-0 flex-wrap gap-(--spacing-2xs)"
            aria-label="Tags"
          >
            <li
              v-for="tag in customer.tags"
              :key="tag"
            >
              <Tag
                :label="tag"
                severity="neutral"
                size="small"
              />
            </li>
          </ul>
        </KeyValueList.Item>
        <KeyValueList.Item label="Customer since">
          <template v-if="customer">{{ since }}</template>
        </KeyValueList.Item>
      </KeyValueList>
    </Card>

    <Card title="Satisfaction">
      <Skeleton
        v-if="loading"
        width="12rem"
        height="1.25rem"
      />
      <div
        v-else-if="satisfaction && satisfaction.surveys > 0"
        class="flex flex-wrap items-center gap-(--spacing-xs)"
      >
        <Rating
          :model-value="satisfaction.average"
          readonly
          size="small"
        />
        <p class="text-body-sm text-(--text-muted)">{{ score }} out of 5 from {{ surveys }}</p>
      </div>
      <p
        v-else
        class="text-body-sm text-(--text-muted)"
      >
        No ratings yet
      </p>
    </Card>
  </div>
</template>
