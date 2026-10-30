import Button from '@aziontech/webkit/button'
import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'
import FieldSelect from '@aziontech/webkit/field-select'
import FieldText from '@aziontech/webkit/field-text'
import FieldTextarea from '@aziontech/webkit/field-textarea'
import Hero from '@aziontech/webkit/hero'
import Topic from '@aziontech/webkit/topic'
import { ref } from 'vue'

import { editable } from '../../_shared/editable-content'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const components = {
  Button,
  FieldPhoneNumber,
  FieldSelect,
  FieldText,
  FieldTextarea,
  Hero,
  'Hero.Title': Hero.Title,
  Topic
}

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

const CLIENT_STRIP = [
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

const SALES_HIGHLIGHTS = [
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
]

const ATTACK_HIGHLIGHTS = [
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
]

const highlightsList = (
  items
) => `<ul class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-lg) self-start p-0 lg:col-start-1 lg:row-start-2">
${items
  .map(
    (item) => `      <li>
        <Topic :heading-level="2" icon="${item.icon}" title="${item.title}" description="${item.description}" />
      </li>`
  )
  .join('\n')}
    </ul>`

const asOptions = (labels) => labels.map((label) => ({ value: label, label }))

const optionsLine = (name, labels) =>
  `const ${name} = [\n${labels.map((label) => `  '${label}'`).join(',\n')}\n].map((label) => ({ value: label, label }))`

const CONTACT_IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'",
  "import FieldSelect from '@aziontech/webkit/field-select'",
  "import FieldText from '@aziontech/webkit/field-text'",
  "import FieldTextarea from '@aziontech/webkit/field-textarea'",
  "import Hero from '@aziontech/webkit/hero'",
  "import Topic from '@aziontech/webkit/topic'",
  "import { ref } from 'vue'",
  '',
  "const country = ref('US')",
  '',
  optionsLine('roles', ROLES)
]

const CONTACT_TEMPLATE = `<Hero
  kind="screen"
  max-width="5xl"
  align="center"
  :padded="false"
  carousel
  carousel-label="The teams our experts work with"
  :carousel-marks="[${CLIENT_STRIP.map((mark) => `'${mark}'`).join(', ')}]"
  bottom-height="clamp(7rem,16dvh,14rem)"
>
  <div class="grid grid-cols-1 gap-(--spacing-xxl) py-(--spacing-lg) lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-(--spacing-xl)">
    <Hero.Title
      eyebrow="Sales"
      eyebrow-prefix="//"
      title="Talk to our sales team"
      max-width="lg"
      class="min-w-0"
    >
      Get a custom demo, plan your migration, and explore plans and pricing built for your company.
    </Hero.Title>

    <div class="min-w-0 lg:row-span-2">
      <form novalidate class="flex flex-col gap-(--spacing-md)" @submit.prevent>
        <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-md) border-0 p-0">
          <legend class="sr-only">Contact sales</legend>

          <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
            <FieldText label="First name" input-id="contact-first-name" name="firstname" size="large" autocomplete="given-name" />
            <FieldText label="Last name" input-id="contact-last-name" name="lastname" size="large" autocomplete="family-name" />
          </div>

          <FieldText label="Company e-mail" input-id="contact-email" name="email" type="email" size="large" autocomplete="email" />

          <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
            <FieldSelect label="Role" input-id="contact-role" placeholder="Select your role" size="large" :options="roles" searchable />
            <FieldText label="Company" input-id="contact-company" name="company" size="large" autocomplete="organization" />
          </div>

          <FieldPhoneNumber v-model:country="country" label="Phone" input-id="contact-phone" name="mobilephone" />

          <FieldTextarea
            label="How can we help?"
            placeholder="Tell us about your current stack, your use case, and what you want to run on Azion."
            input-id="contact-message"
            name="message"
          />
        </fieldset>

        <div class="flex flex-col">
          <Button type="submit" label="Contact sales" kind="primary" size="large" />
        </div>
      </form>
    </div>

    ${highlightsList(SALES_HIGHLIGHTS)}
  </div>
</Hero>`

const INCIDENT_TEMPLATE = `<Hero
  kind="screen"
  max-width="5xl"
  align="center"
  :padded="false"
  carousel
  carousel-label="The teams our experts work with"
  :carousel-marks="[${CLIENT_STRIP.map((mark) => `'${mark}'`).join(', ')}]"
  bottom-height="clamp(7rem,16dvh,14rem)"
>
  <div class="grid grid-cols-1 gap-(--spacing-xxl) py-(--spacing-lg) lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-(--spacing-xl)">
    <Hero.Title
      eyebrow="Under Cyberattack?"
      eyebrow-prefix="//"
      title="Mitigating Cyberattacks"
      max-width="lg"
      class="min-w-0"
    >
      Our digital security team is available to provide immediate assistance.
    </Hero.Title>

    <div class="min-w-0 lg:row-span-2">
      <form novalidate class="flex flex-col gap-(--spacing-md)" @submit.prevent>
        <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-md) border-0 p-0">
          <legend class="sr-only">Request immediate contact</legend>

          <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
            <FieldText label="Name" input-id="incident-first-name" name="firstname" size="large" autocomplete="given-name" />
            <FieldText label="Last name" input-id="incident-last-name" name="lastname" size="large" autocomplete="family-name" />
          </div>

          <FieldText label="Business email" input-id="incident-email" name="email" type="email" size="large" autocomplete="email" />

          <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
            <FieldText label="Company" input-id="incident-company" name="company" size="large" autocomplete="organization" />
            <FieldText label="Website" input-id="incident-website" name="domain" type="url" size="large" autocomplete="url" />
          </div>

          <FieldPhoneNumber v-model:country="country" label="Phone" input-id="incident-phone" name="mobilephone" />
        </fieldset>

        <div class="flex flex-col">
          <Button type="submit" label="Request immediate contact" kind="primary" size="large" />
        </div>
      </form>
    </div>

    ${highlightsList(ATTACK_HIGHLIGHTS)}
  </div>
</Hero>`

const INCIDENT_IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'",
  "import FieldText from '@aziontech/webkit/field-text'",
  "import Hero from '@aziontech/webkit/hero'",
  "import Topic from '@aziontech/webkit/topic'",
  "import { ref } from 'vue'",
  '',
  "const country = ref('US')"
]

const meta = {
  title: 'Templates/Marketing/Heroes/HeroForm',
  excludeStories: ['CONTACT_SECTION'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const withSiteNavBar = (story) => ({
  components: { story },
  template:
    '<div><div aria-hidden="true" class="h-14 border-b border-(--border-default) bg-(--bg-canvas)" /><story /></div>'
})

export const ContactSplit = {
  decorators: [withSiteNavBar],
  ...editable(() => ({
    components,
    setup: () => ({ country: ref('US'), roles: asOptions(ROLES) }),
    template: CONTACT_TEMPLATE
  })),
  parameters: {
    docs: {
      source: { code: toSfc(CONTACT_IMPORTS, CONTACT_TEMPLATE) }
    }
  }
}

export const UnderAttack = {
  decorators: [withSiteNavBar],
  ...editable(() => ({
    components,
    setup: () => ({ country: ref('US') }),
    template: INCIDENT_TEMPLATE
  })),
  parameters: {
    docs: {
      description: {
        story:
          'The incident field set, for a team under attack: no role and no message, a website instead. The benefits under the description carry the attack figures (Under attack).'
      },
      source: { code: toSfc(INCIDENT_IMPORTS, INCIDENT_TEMPLATE) }
    }
  }
}

export const CONTACT_SECTION = {
  _id: 'hero-form',
  props: {
    eyebrow: 'Sales',
    highlight: '',
    title: 'Talk to our sales team',
    body: 'Get a custom demo, plan your migration, and explore plans and pricing built for your company.',
    fields: {
      firstName: {
        label: 'First name',
        placeholder: ''
      },
      lastName: {
        label: 'Last name',
        placeholder: '',
        required: true
      },
      email: {
        label: 'Work email',
        placeholder: 'name@company.com'
      },
      role: {
        label: 'Role',
        placeholder: 'Select your role',
        name: 'role',
        required: true
      },
      company: {
        label: 'Company',
        placeholder: '',
        required: true
      },
      phone: {
        label: 'Phone',
        placeholder: ''
      },
      message: {
        label: 'How can we help?',
        placeholder:
          'Tell us about your current stack, your use case, and what you want to run on Azion.',
        required: true
      }
    },
    roleOptions: ['Administrator', 'Advisor', 'Analyst', 'Architect'],
    submitLabel: 'Contact sales',
    defaultCountry: 'US',
    messages: {
      missing: 'This field is required.',
      invalidEmail: 'Enter a valid email address.',
      success: 'We will be in touch.',
      error: 'We could not send your message. Try again.'
    },
    endpoint:
      'https://api.hsforms.com/submissions/v3/integration/submit/5759082/a22128e2-cd17-4ed2-968a-52aa64800a87',
    pageName: 'Contact',
    consentText: '',
    hiddenFields: {
      form_action: 'contact_us',
      voce_gostaria_de_receber_novos_conteudos_por_whatsapp_: 'Não'
    },
    carouselLabel: 'Trusted by teams running critical workloads',
    carouselMarks: ['global-fashion-group', 'herospark', 'itau', 'nzn', 'netshoes', 'caixa']
  }
}

export const ContactSplitJson = {
  tags: ['!dev'],
  ...siteJsonStory(CONTACT_SECTION)
}
