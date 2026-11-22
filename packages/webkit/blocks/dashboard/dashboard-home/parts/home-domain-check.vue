<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Input from '@aziontech/webkit/input'
  import Popover from '@aziontech/webkit/popover'
  import Spinner from '@aziontech/webkit/spinner'
  import { computed, onScopeDispose, reactive, ref, watch } from 'vue'

  import type { HomeDashboardDomainAvailability } from '../dashboard-home.vue'
  import { sampleRegisteredDomains } from '../sample'

  export interface HomeDomainCheckProps {
    /** Answer to the last check-domain event; shown once its name matches the field. */
    domainAvailability?: HomeDashboardDomainAvailability
  }

  const props = withDefaults(defineProps<HomeDomainCheckProps>(), {
    domainAvailability: undefined
  })

  const emit = defineEmits<{
    'check-domain': [name: string]
    'register-domain': [event: MouseEvent, name: string]
  }>()

  const DOMAIN_SHAPE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9-]+)*\.[a-z]{2,}$/i
  const CHECK_DEBOUNCE_MS = 900

  const domain = ref('')
  const check = reactive({ open: false, pending: false, name: '' })
  const sampleVerdict = ref<HomeDashboardDomainAvailability | null>(null)
  const verdict = computed(() => {
    const answer = props.domainAvailability ?? sampleVerdict.value
    return !check.pending && answer?.name === check.name ? answer : null
  })
  const fieldWidth = ref(0)
  let checkTimer: ReturnType<typeof globalThis.setTimeout> | undefined

  const measureField = (event: Event) => {
    const form = (event.target as Element | null)?.closest?.('form')
    if (form) fieldWidth.value = Math.round(form.offsetWidth)
  }

  watch(domain, (value) => {
    globalThis.clearTimeout(checkTimer)
    const next = value.trim().toLowerCase()
    if (!DOMAIN_SHAPE.test(next)) {
      check.open = false
      check.pending = false
      return
    }
    check.open = true
    check.pending = true
    check.name = next
    checkTimer = globalThis.setTimeout(() => {
      check.pending = false
      if (props.domainAvailability === undefined)
        sampleVerdict.value = { name: next, registered: sampleRegisteredDomains.includes(next) }
      emit('check-domain', next)
    }, CHECK_DEBOUNCE_MS)
  })

  onScopeDispose(() => globalThis.clearTimeout(checkTimer))

  const onCheckOpen = (value: boolean) => {
    if (!value) check.open = false
  }
</script>

<template>
  <Popover
    :open="check.open"
    side="bottom"
    align="start"
    :side-offset="8"
    class="w-full"
    @update:open="onCheckOpen"
  >
    <Popover.Trigger class="w-full">
      <form
        class="w-full"
        @submit.prevent
      >
        <Input
          v-model="domain"
          placeholder="Type in your domain"
          size="medium"
          aria-label="Domain to add"
          @input="measureField"
        />
      </form>
    </Popover.Trigger>

    <Popover.Content>
      <div
        class="overflow-hidden transition-[height] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
        :style="fieldWidth ? { width: fieldWidth + 'px' } : {}"
      >
        <Transition
          mode="out-in"
          enter-active-class="animate-fade-in motion-reduce:animate-none"
          leave-active-class="animate-fade-out motion-reduce:animate-none"
        >
          <div
            v-if="!verdict"
            key="checking"
            class="flex items-center justify-center gap-(--spacing-xs) p-(--spacing-sm) text-center text-body-sm text-(--text-muted)"
          >
            <div class="contents text-(--text-muted)">
              <Spinner class="shrink-0" />
            </div>
            Checking {{ check.name }}...
          </div>

          <div
            v-else
            key="verdict"
            class="flex flex-col gap-(--spacing-sm) p-(--spacing-sm)"
          >
            <p class="text-body-sm text-(--text-default)">
              <template v-if="verdict.registered">
                {{ check.name }} is already registered. Try another name.
              </template>
              <template v-else>
                {{ check.name }} is available. We register it and issue the certificate.
              </template>
            </p>
            <Button
              v-if="!verdict.registered"
              label="Register"
              variant="secondary"
              size="medium"
              class="w-full"
              @click="(event) => emit('register-domain', event, check.name)"
            />
          </div>
        </Transition>
      </div>
    </Popover.Content>
  </Popover>
</template>
