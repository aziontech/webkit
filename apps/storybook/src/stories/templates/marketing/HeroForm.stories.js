import Button from '@aziontech/webkit/button'
import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'
import FieldSelect from '@aziontech/webkit/field-select'
import FieldText from '@aziontech/webkit/field-text'
import FieldTextarea from '@aziontech/webkit/field-textarea'
import Hero from '@aziontech/webkit/hero'
import { ref } from 'vue'

import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const components = {
  Button,
  FieldPhoneNumber,
  FieldSelect,
  FieldText,
  FieldTextarea,
  Hero,
  'Hero.Title': Hero.Title
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

const asOptions = (labels) => labels.map((label) => ({ value: label, label }))

const optionsLine = (name, labels) =>
  `const ${name} = [\n${labels.map((label) => `  '${label}'`).join(',\n')}\n].map((label) => ({ value: label, label }))`

const LINK_CLASS =
  'underline underline-offset-2 transition-colors hover:text-(--text-default) focus-visible:rounded-(--shape-flat) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none'

const CONTACT_IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'",
  "import FieldSelect from '@aziontech/webkit/field-select'",
  "import FieldText from '@aziontech/webkit/field-text'",
  "import FieldTextarea from '@aziontech/webkit/field-textarea'",
  "import Hero from '@aziontech/webkit/hero'",
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
  carousel-label="The teams our specialists work with"
  :carousel-marks="[${CLIENT_STRIP.map((mark) => `'${mark}'`).join(', ')}]"
  offset="3.5rem"
  bottom-height="clamp(7rem,16dvh,14rem)"
>
  <div class="grid grid-cols-1 gap-(--spacing-xxl) py-(--spacing-lg) lg:grid-cols-2">
    <Hero.Title
      title="Talk to our Specialists"
      max-width="lg"
      class="min-w-0"
      sticky
    >
      We are here to help and provide guidance on performance, security, and AI-native workloads.
      Feel free to give us a call at
      <a href="tel:+18333329466" class="${LINK_CLASS}">+1 833-332-9466</a>, use our live chat or submit your inquiry on the form.

      <template #actions>
        <Button label="Talk to Support" kind="secondary" size="large" />
        <Button
          label="Under CyberAttack?"
          kind="outlined"
          size="large"
          href="https://www.azion.com/en/lp/under-attack-mitigation/"
          target="_blank"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </Hero.Title>

    <div class="min-w-0">
      <form novalidate class="flex flex-col gap-(--spacing-md)" @submit.prevent>
        <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-md) border-0 p-0">
          <legend class="sr-only">Talk to our Specialists</legend>

          <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
            <FieldText label="First name" input-id="contact-first-name" name="firstname" size="large" autocomplete="given-name" />
            <FieldText label="Last name" input-id="contact-last-name" name="lastname" size="large" autocomplete="family-name" />
          </div>

          <FieldText label="E-mail" input-id="contact-email" name="email" type="email" size="large" autocomplete="email" />

          <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
            <FieldSelect label="Role" input-id="contact-role" placeholder="Select your Role" size="large" :options="roles" />
            <FieldText label="Company" input-id="contact-company" name="company" size="large" autocomplete="organization" />
          </div>

          <FieldPhoneNumber v-model:country="country" label="Phone" input-id="contact-phone" name="mobilephone" />

          <FieldTextarea label="Message" input-id="contact-message" name="message" />
        </fieldset>

        <div class="flex justify-start">
          <button type="submit" class="sr-only" tabindex="-1" aria-hidden="true">Send</button>
          <Button label="Send" kind="secondary" size="large" />
        </div>
      </form>
    </div>
  </div>
</Hero>`

const meta = {
  title: 'Templates/Marketing/Heroes/HeroForm',
  excludeStories: ['CONTACT_SECTION'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
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
  render: () => ({
    components,
    setup: () => ({ country: ref('US'), roles: asOptions(ROLES) }),
    template: CONTACT_TEMPLATE
  }),
  parameters: {
    docs: {
      source: { code: toSfc(CONTACT_IMPORTS, CONTACT_TEMPLATE) }
    }
  }
}

export const CONTACT_SECTION = {
  _id: 'hero-form',
  props: {
    highlight: '',
    title: 'Talk to our specialists',
    body: 'We are here to help and provide guidance on performance, security and AI-native workloads. Call us at [+1 833-332-9466](tel:+18333329466), use our live chat or send your inquiry on the form.',
    primaryAction: {
      label: 'Talk to Support',
      href: 'https://tickets.azion.com/en/support/login',
      target: '_blank'
    },
    secondaryAction: {
      label: 'Under cyberattack?',
      href: 'https://www.azion.com/en/lp/under-attack-mitigation/',
      target: '_blank'
    },
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
        label: 'Message',
        placeholder: 'How can we help?',
        required: true
      }
    },
    roleOptions: ['Administrator', 'Advisor', 'Analyst', 'Architect'],
    submitLabel: 'Send',
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
    carouselLabel: 'Trusted by mission-critical workloads',
    carouselMarks: ['global-fashion-group', 'herospark', 'itau', 'nzn', 'netshoes', 'caixa']
  }
}

export const ContactSplitJson = {
  tags: ['!dev'],
  ...siteJsonStory(CONTACT_SECTION)
}
