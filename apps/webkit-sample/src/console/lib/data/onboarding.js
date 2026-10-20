export const onboardingSteps = [
  {
    id: 'organization',
    title: 'Create your organization',
    description:
      'Everything you deploy on Azion lives inside an organization. Yours is created once, here, and you can invite people into it afterwards.'
  },
  {
    id: 'plan',
    title: 'Select your plan',
    description:
      'What you are building decides the plan. You can change it later from Billing. Nothing here is locked in.'
  },
  {
    id: 'profile',
    title: 'Tell us about your work',
    description:
      'Two answers, and they only shape what we recommend you next. Neither changes your plan or what you can do.'
  }
]

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

export const profileDataKeys = {
  usage: 'usage',
  role: 'role',
  session: 'onboarding_session'
}
