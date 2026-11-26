import { computed, type ComputedRef, inject, type InjectionKey, provide, ref } from 'vue'

import { sampleProtocolSettings, sampleTrustedCas } from './sample'
import {
  type DeployToastText,
  type FieldProblems,
  useDeployOnSave,
  type UseDeployOnSaveReturn
} from './use-deploy-on-save'

export type ProtocolSettingsRecord = typeof sampleProtocolSettings

/** A trusted CA certificate the workload can verify clients against. */
export interface ProtocolsTrustedCa {
  /** The certificate id. */
  value: string
  /** The certificate name. */
  label: string
  /** When the certificate expires. */
  expires: string
}

export interface ProtocolsSettingsContext extends UseDeployOnSaveReturn<ProtocolSettingsRecord> {
  /** HTTPS is on and mutual authentication is on. */
  armed: ComputedRef<boolean>
  /** The trusted CA certificates of the account. */
  trustedCas: ComputedRef<ProtocolsTrustedCa[]>
  /** Turns HTTPS on or off; off also turns HTTP/3 and mutual authentication off. */
  setHttps: (value: boolean) => void
  /** Turns HTTP/3 on or off; on also turns HTTPS on. */
  setHttp3: (value: boolean) => void
  /** Picks a trusted CA certificate. */
  pickCa: (value: string) => void
  /** Adds an uploaded certificate to the account and picks it. */
  addCa: (value: string) => void
}

const ProtocolsSettingsInjectionKey: InjectionKey<ProtocolsSettingsContext> =
  Symbol('ProtocolsSettings')

function checkProtocols(form: ProtocolSettingsRecord, armed: boolean, problems: FieldProblems) {
  if (!form.httpPorts.length) {
    problems.httpPorts = { type: 'required', message: 'Select at least one HTTP port.' }
  }
  if (form.useHttps && !form.httpsPorts.length) {
    problems.httpsPorts = { type: 'required', message: 'Select at least one HTTPS port.' }
  }
  if (form.useHttp3 && !form.http3Ports.length) {
    problems.http3Ports = { type: 'required', message: 'Select at least one HTTP/3 port.' }
  }
  if (armed && !form.trustedCa) {
    problems.trustedCa = {
      type: 'required',
      message: 'Mutual authentication needs a trusted CA certificate.'
    }
  }
}

export function provideProtocolsSettings(): ProtocolsSettingsContext {
  const draft = useDeployOnSave(sampleProtocolSettings, {
    toastId: 'protocols-deploy',
    fieldPrefix: 'protocols',
    fieldOrder: ['httpPorts', 'httpsPorts', 'http3Ports', 'trustedCa'],
    check: (problems) => checkProtocols(draft.form, armed.value, problems),
    loading: (): DeployToastText => ({
      title: 'Deploying storefront…',
      description: 'Clients keep connecting with the current settings until it finishes.'
    }),
    success: (): DeployToastText => ({
      title: 'storefront is live.',
      description: armed.value
        ? 'Production now asks every client for a certificate.'
        : 'Production answers on the new ports and TLS settings.'
    })
  })
  const { form, clear } = draft
  const armed = computed(() => form.useHttps && form.mtls)
  const cas = ref<ProtocolsTrustedCa[]>(structuredClone(sampleTrustedCas))

  const setHttps = (value: boolean) => {
    form.useHttps = value
    if (!value) {
      form.useHttp3 = false
      form.mtls = false
    }
  }
  const setHttp3 = (value: boolean) => {
    form.useHttp3 = value
    if (value) form.useHttps = true
  }
  const pickCa = (value: string) => {
    form.trustedCa = value
    clear('trustedCa')
  }
  const addCa = (value: string) => {
    cas.value = [...cas.value, { value, label: value, expires: 'Added now' }]
    pickCa(value)
  }

  const context: ProtocolsSettingsContext = {
    ...draft,
    armed,
    trustedCas: computed(() => cas.value),
    setHttps,
    setHttp3,
    pickCa,
    addCa
  }
  provide(ProtocolsSettingsInjectionKey, context)
  return context
}

export function useProtocolsSettingsContext(): ProtocolsSettingsContext {
  const context = inject(ProtocolsSettingsInjectionKey, null)
  if (!context) {
    throw new Error('useProtocolsSettingsContext must be used within ProtocolsPage.')
  }
  return context
}
