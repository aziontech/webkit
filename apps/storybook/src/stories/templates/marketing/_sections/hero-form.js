const ROLES = [
  'Administrator',
  'Advisor',
  'Analyst',
  'Architect',
  'Assistant',
  'Auditor',
  'Buyer',
  'CDO - Chief Data Officer',
  'CDO - Chief Digital Officer',
  'CEO – Chief Executive Officer',
  'CFO – Chief Financial Officer',
  'CHRO – Chief Human Resources Officer',
  'CIO - Chief Information Officer',
  'CISO - Chief Information Security Officer',
  'CMO – Chief Marketing Officer',
  'Consultant',
  'Controller',
  'COO – Chief Operating Officer',
  'Coordinator',
  'CPO - Chief Product Owner',
  'CRO - Chief Revenue Officer',
  'CTO - Chief Technology Officer',
  'CXO - Chief Experience officer',
  'Dean',
  'Designer',
  'Developer',
  'Director',
  'Engineer',
  'Expert',
  'Founder',
  'Head',
  'Manager',
  'Owner',
  'Partner',
  'President',
  'Secretary',
  'Specialist',
  'Superintendent',
  'Supervisor',
  'Vice President'
]

const CAROUSEL_MARKS = [
  'global-fashion-group',
  'herospark',
  'itau',
  'nzn',
  'netshoes',
  'caixa',
  'agibank',
  'prime-video',
  'america-movil',
  'gpa',
  'fourbank'
]

const MESSAGES = {
  missing: 'This field is required.',
  invalidEmail: 'Enter a valid email address.',
  success: 'We will be in touch.',
  error: 'We could not send your message. Try again.'
}

export const CONTACT_SECTION = {
  _id: 'hero-form',
  props: {
    eyebrow: 'Sales',
    highlight: '',
    title: 'Talk to our sales team',
    description:
      'Get a custom demo, plan your migration, and explore plans and pricing built for your company.',
    items: [
      {
        icon: 'ai ai-edge-ai',
        title: 'Build AI applications',
        description: 'Run AI agents and inference close to your users.'
      },
      {
        icon: 'ai ai-build-pillar',
        title: 'Modernize applications',
        description: 'Go from commit to a live URL in minutes.'
      },
      {
        icon: 'ai ai-secure-pillar',
        title: 'Protect applications and APIs',
        description: 'Block DDoS attacks, malicious bots, and API abuse.'
      },
      {
        icon: 'ai ai-app-accelerator',
        title: 'Speed up every workload',
        description: '100+ data centers, with a 30 ms median latency.'
      }
    ],
    formAriaLabel: 'Contact sales',
    fields: [
      { name: 'firstname', kind: 'text', label: 'First name', half: true, required: true },
      { name: 'lastname', kind: 'text', label: 'Last name', half: true, required: true },
      {
        name: 'email',
        kind: 'email',
        label: 'Work email',
        placeholder: 'name@company.com',
        required: true
      },
      {
        name: 'role',
        kind: 'select',
        label: 'Role',
        placeholder: 'Select your role',
        half: true,
        required: true,
        options: ROLES
      },
      { name: 'company', kind: 'text', label: 'Company', half: true, required: true },
      { name: 'mobilephone', kind: 'phone', label: 'Phone', country: 'US', required: true },
      {
        name: 'message',
        kind: 'textarea',
        label: 'How can we help?',
        placeholder:
          'Tell us about your current stack, your use case, and what you want to run on Azion.',
        required: true
      }
    ],
    submitLabel: 'Contact sales',
    messages: MESSAGES,
    carouselLabel: 'Trusted by teams running critical workloads',
    carouselMarks: CAROUSEL_MARKS
  },
  submission: {
    endpoint:
      'https://api.hsforms.com/submissions/v3/integration/submit/5759082/a22128e2-cd17-4ed2-968a-52aa64800a87',
    pageName: 'Contact',
    hiddenFields: {
      form_action: 'contact_us',
      voce_gostaria_de_receber_novos_conteudos_por_whatsapp_: 'Não'
    }
  }
}

export const UNDER_ATTACK_SECTION = {
  _id: 'hero-form',
  props: {
    eyebrow: 'Under Cyberattack?',
    highlight: '',
    title: 'Mitigating Cyberattacks',
    description: 'Our digital security team is available to provide immediate assistance.',
    items: [
      {
        icon: 'ai ai-security-team',
        title: 'Help before you become a customer',
        description: 'Emergency mitigation for an attack in progress.'
      },
      {
        icon: 'ai ai-secure-pillar',
        title: '265B attacks blocked',
        description: 'Stopped on the Azion network since 2022.'
      },
      {
        icon: 'ai ai-build-pillar',
        title: '35B functions a month',
        description: 'Edge functions run every month for security controls.'
      },
      {
        icon: 'ai ai-app-accelerator',
        title: '+90% of requests served instantly',
        description: 'Customer requests answered close to your users.'
      }
    ],
    formAriaLabel: 'Request immediate contact',
    fields: [
      { name: 'firstname', kind: 'text', label: 'Name', half: true, required: true },
      { name: 'lastname', kind: 'text', label: 'Last name', half: true, required: true },
      { name: 'email', kind: 'email', label: 'Business email', required: true },
      { name: 'company', kind: 'text', label: 'Company', half: true, required: true },
      { name: 'domain', kind: 'text', label: 'Website', half: true },
      { name: 'mobilephone', kind: 'phone', label: 'Phone', country: 'US', required: true }
    ],
    submitLabel: 'Request immediate contact',
    messages: MESSAGES,
    carouselLabel: 'Trusted by teams running critical workloads',
    carouselMarks: CAROUSEL_MARKS
  }
}
