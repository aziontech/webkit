import { inject, type InjectionKey, provide } from 'vue'

import { sampleCacheSetting } from './sample'
import {
  type DeployToastText,
  type FieldProblems,
  useDeployOnSave,
  type UseDeployOnSaveReturn
} from './use-deploy-on-save'

export type CacheSettingRecord = typeof sampleCacheSetting

export type CacheSettingsContext = UseDeployOnSaveReturn<CacheSettingRecord>

const CacheSettingsInjectionKey: InjectionKey<CacheSettingsContext> = Symbol('CacheSettings')

const varies = (behavior: string) => ['allowlist', 'denylist'].includes(behavior)

function checkCacheSetting(form: CacheSettingRecord, problems: FieldProblems): void {
  if (!form.name.trim()) {
    problems.name = { type: 'required', message: 'Enter a name for this cache setting.' }
  } else if (!/^[a-z0-9-]+$/.test(form.name.trim())) {
    problems.name = {
      type: 'invalid',
      message: 'Use lowercase letters, numbers and hyphens only.'
    }
  }
  if (form.edgeBehavior === 'override' && form.edgeMaxAge < 60) {
    problems.edgeMaxAge = {
      type: 'invalid',
      message: 'The edge keeps an object for at least 60 seconds.'
    }
  }
  if (varies(form.queryStringBehavior) && !form.queryStringFields.trim()) {
    problems.queryStringFields = {
      type: 'required',
      message: 'List at least one query string field.'
    }
  }
  if (varies(form.cookieBehavior) && !form.cookieNames.trim()) {
    problems.cookieNames = { type: 'required', message: 'List at least one cookie name.' }
  }
}

export function provideCacheSettings(): CacheSettingsContext {
  const settings = useDeployOnSave(sampleCacheSetting, {
    toastId: 'cache-settings-deploy',
    fieldPrefix: 'cache',
    fieldOrder: ['name', 'edgeMaxAge', 'queryStringFields', 'cookieNames'],
    check: (problems) => checkCacheSetting(settings.form, problems),
    loading: (): DeployToastText => ({
      title: `Deploying ${settings.form.name}…`,
      description: 'storefront-app keeps serving the current cache rules until it finishes.'
    }),
    success: (): DeployToastText => ({
      title: `${settings.form.name} is live.`,
      description: 'Production caches with the new rules from now on.'
    })
  })
  provide(CacheSettingsInjectionKey, settings)
  return settings
}

export function useCacheSettingsContext(): CacheSettingsContext {
  const context = inject(CacheSettingsInjectionKey, null)
  if (!context) throw new Error('useCacheSettingsContext must be used within CacheSettingsPage.')
  return context
}
