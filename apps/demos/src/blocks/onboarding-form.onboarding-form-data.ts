import type { OnboardingFormAddress, OnboardingFormBillingPeriod } from './onboarding-form.vue'

/** One organization mark the first step offers. */
export interface Accent {
  value: string
  label: string
  ariaLabel: string
  colors: string[]
}

export const accents: Accent[] = [
  {
    value: 'orange',
    label: 'Orange',
    ariaLabel: 'Orange mark',
    colors: ['var(--primary)', 'var(--primary)', 'var(--warning)']
  },
  {
    value: 'yellow',
    label: 'Yellow',
    ariaLabel: 'Yellow mark',
    colors: ['var(--warning)', 'var(--warning)', 'var(--warning-mark)']
  },
  {
    value: 'red',
    label: 'Red',
    ariaLabel: 'Red mark',
    colors: ['var(--danger)', 'var(--danger)', 'var(--danger-mark)']
  },
  {
    value: 'green',
    label: 'Green',
    ariaLabel: 'Green mark',
    colors: ['var(--success)', 'var(--success)', 'var(--success-mark)']
  },
  {
    value: 'blue',
    label: 'Blue',
    ariaLabel: 'Blue mark',
    colors: ['var(--info)', 'var(--info)', 'var(--info-mark)']
  },
  {
    value: 'violet',
    label: 'Violet',
    ariaLabel: 'Violet mark',
    colors: ['var(--chart-series-3)', 'var(--chart-series-3)', 'var(--chart-series-8)']
  },
  {
    value: 'gray',
    label: 'Gray',
    ariaLabel: 'Gray mark',
    colors: ['var(--bg-selected)', 'var(--text-muted)', 'var(--text-disabled)']
  }
]

export const accountInitials = (name: string) => {
  const words = String(name ?? '')
    .trim()
    .split(/\s+/)
    .filter((word) => /^[\p{L}\p{N}]/u.test(word))
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase()
  return (words[0] ?? '').slice(0, 2).toUpperCase()
}

export const pricingLinks = [
  {
    label: 'Learn more about pricing',
    href: 'https://example.com/pricing'
  },
  {
    label: 'Compare plans',
    href: 'https://example.com/pricing#comparison'
  }
]

export const periods: { value: OnboardingFormBillingPeriod; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
]

export const blankAddress: OnboardingFormAddress = {
  country: undefined,
  postalCode: '',
  state: undefined,
  city: undefined,
  line1: '',
  line2: ''
}
export const blankCard = {
  holder: '',
  country: undefined as string | undefined,
  number: '',
  expiry: '',
  code: ''
}

export const usageOptions = [
  { value: 'personal', label: 'Personal' },
  { value: 'work', label: 'Work' },
  { value: 'study', label: 'Study' }
]
export const roleOptions = [
  { value: 'software_developer', label: 'Software developer' },
  { value: 'devops_engineer', label: 'DevOps engineer' },
  { value: 'infrastructure_analyst', label: 'Infrastructure analyst' },
  { value: 'network_engineer', label: 'Network engineer' },
  { value: 'security_specialist', label: 'Security specialist' },
  { value: 'data_engineer', label: 'Data engineer' },
  { value: 'ai_ml_engineer', label: 'AI/ML engineer' },
  { value: 'iot_engineer', label: 'IoT engineer' },
  { value: 'team_lead', label: 'Team lead' },
  { value: 'other', label: 'Other' }
]
