import type { EditResourceProject } from './edit-resource.vue'
import type { PolicyModuleField, PolicySettingsRecord } from './parts/policy-groups.vue'

export const sampleProject: EditResourceProject = {
  name: 'web-app',
  active: true,
  modules: {
    compression: true,
    caching: true,
    device_detection: false,
    custom_code: true,
    image_optimization: false,
    load_balancing: false,
    web_socket_proxy: false
  }
}

export const sampleProjectDraft: Partial<EditResourceProject> = {
  modules: { ...sampleProject.modules, device_detection: true }
}

export const sampleStaleProject: EditResourceProject = {
  ...sampleProject,
  modules: { ...sampleProject.modules, image_optimization: true }
}

export const samplePolicyTabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'rules', label: 'Rules' },
  { value: 'main-settings', label: 'Settings' }
]

export const samplePolicyModules: PolicyModuleField[] = [
  {
    key: 'ddos',
    title: 'DDoS Protection',
    description: 'Absorbs volumetric attacks at the network layer.',
    locked: true
  },
  {
    key: 'request-inspection',
    title: 'Request Inspection',
    description: 'Inspects each request and blocks the OWASP Top 10 attack classes.'
  },
  {
    key: 'ip-blocking',
    title: 'IP Blocking',
    description: 'Blocks traffic by country, ASN or IP range using access lists.'
  },
  {
    key: 'bot-protection',
    title: 'Bot Protection',
    description: 'Scores automated traffic and challenges the requests that fail.'
  },
  {
    key: 'custom-code',
    title: 'Custom Code',
    description: 'Runs your own code inside the policy, before the request is served.'
  }
]

export const samplePolicy: PolicySettingsRecord = {
  name: 'production-policy',
  active: true,
  debugRules: false,
  modules: ['ddos', 'request-inspection', 'ip-blocking', 'bot-protection']
}
