<script setup>
// azion system status button
import PrimeButton from 'primevue/button'
import { ref, computed, onMounted } from 'vue'

const STATUS_PAGE = {
  none: 'operational',
  minor: 'minor-outage',
  major: 'partial-outage',
  critical: 'major-outage',
  maintenance: 'maintenance'
}

const STATUS_PAGE_COLORS = {
  none: '#8bc249',
  minor: '#fec111',
  major: '#f3652b',
  critical: '#ff4141',
  maintenance: '#6e7cf7'
}

const OPERATIONAL_STATUS = {
  indicator: 'none',
  description: 'All Systems Operational'
}

const STATUS_API_BASE_URL = 'https://status.azion.com/api/v2'

async function fetchStatusApi(endpoint) {
  const response = await fetch(`${STATUS_API_BASE_URL}${endpoint}`, {
    method: 'GET'
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

const error = ref(false)
const status = ref('')
const label = ref('')
const link = ref('https://status.azion.com')
const color = ref(STATUS_PAGE_COLORS.none)

const colorStatus = computed(() => ({ color: color.value }))

function redirectToLink() {
  window.open(link.value, '_blank')
}

async function fetchComponentsStatus() {
  return fetchStatusApi('/components.json')
}

async function fetchStatusPage() {
  const data = await fetchStatusApi('/status.json')

  if (data && data.status) {
    return {
      indicator: data.status.indicator,
      description: data.status.description
    }
  }

  return OPERATIONAL_STATUS
}

async function checkComponentStatus() {
  try {
    const data = await fetchComponentsStatus()
    const components = data?.components || []

    const checkComponents = (component) =>
      component.status !== 'operational' && component.status !== 'partial_outage'
    const hasImpactedComponent = components.some(checkComponents)

    const statusResult = await getStatus(hasImpactedComponent)
    updateSystemStatus(statusResult)
  } catch (err) {
    error.value = true
    // eslint-disable-next-line no-console
    console.error(err)
  }
}

async function getStatus(checkStatusPage) {
  if (checkStatusPage) {
    return fetchStatusPage()
  }

  return OPERATIONAL_STATUS
}

function updateSystemStatus({ indicator, description }) {
  status.value = STATUS_PAGE[indicator]
  color.value = STATUS_PAGE_COLORS[indicator]
  label.value = description
}

onMounted(() => {
  checkComponentStatus()
})
</script>

<template>
  <PrimeButton
    outlined
    class="surface-section min-w-fit hover:surface-hover whitespace-nowrap"
    icon="pi pi-circle-fill"
    size="small"
    v-show="!error"
    :label="label"
    :loading="!label"
    :pt="{
      root: { class: 'h-8 flex-row items-center' },
      label: { class: 'font-normal text-sm min-w-[9rem]' },
      icon: { style: colorStatus, class: 'text-xs' }
    }"
    @click="redirectToLink"
  />
</template>
