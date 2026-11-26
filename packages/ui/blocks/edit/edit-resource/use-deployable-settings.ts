import {
  computed,
  type ComputedRef,
  inject,
  type InjectionKey,
  nextTick,
  provide,
  readonly,
  type Ref,
  ref,
  watch
} from 'vue'

import {
  type DeployableDomainRow,
  sampleDeployableDomains,
  sampleDeployableResource
} from './sample'
import { useSettingsDraft, type UseSettingsDraftReturn } from './use-settings-draft'

export type DeployableResourceRecord = typeof sampleDeployableResource

export interface DeployableSettingsContext extends UseSettingsDraftReturn<DeployableResourceRecord> {
  /** Save found the Name empty. */
  nameError: Readonly<Ref<boolean>>
  /** HTTPS or HTTP/3 is on. */
  secure: ComputedRef<boolean>
  /** HTTPS is on and mutual authentication is on. */
  armed: ComputedRef<boolean>
  /** The domains the resource answers on. */
  domains: ComputedRef<DeployableDomainRow[]>
  /** Turns HTTPS on or off; off also turns HTTP/3 off. */
  setHttps: (value: boolean) => void
  /** Turns HTTP/3 on or off; on also turns HTTPS on. */
  setHttp3: (value: boolean) => void
  /** Removes one domain from the resource. */
  removeDomain: (id: string) => void
}

const DeployableSettingsInjectionKey: InjectionKey<DeployableSettingsContext> =
  Symbol('DeployableSettings')

export function provideDeployableSettings(): DeployableSettingsContext {
  const nameError = ref(false)
  const validate = () => {
    if (draft.form.name.trim()) return true
    nameError.value = true
    nextTick(() => document.getElementById('resource-name')?.focus())
    return false
  }
  const draft = useSettingsDraft(sampleDeployableResource, { validate })
  const { form } = draft
  const rows = ref<DeployableDomainRow[]>(structuredClone(sampleDeployableDomains))

  watch(
    () => form.name,
    () => {
      nameError.value = false
    }
  )

  const context: DeployableSettingsContext = {
    ...draft,
    nameError: readonly(nameError),
    secure: computed(() => form.protocols.useHttps || form.protocols.useHttp3),
    armed: computed(() => form.protocols.useHttps && form.mtls.enabled),
    domains: computed(() => rows.value),
    setHttps: (value) => {
      form.protocols.useHttps = value
      if (!value) form.protocols.useHttp3 = false
    },
    setHttp3: (value) => {
      form.protocols.useHttp3 = value
      if (value) form.protocols.useHttps = true
    },
    removeDomain: (id) => {
      rows.value = rows.value.filter((domain) => domain.id !== id)
    }
  }
  provide(DeployableSettingsInjectionKey, context)
  return context
}

export function useDeployableSettingsContext(): DeployableSettingsContext {
  const context = inject(DeployableSettingsInjectionKey, null)
  if (!context) {
    throw new Error('useDeployableSettingsContext must be used within DeployableSettingsPage.')
  }
  return context
}
