import Button from '@aziontech/webkit/button'
import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'
import FieldSelect from '@aziontech/webkit/field-select'
import FieldText from '@aziontech/webkit/field-text'
import FieldTextarea from '@aziontech/webkit/field-textarea'
import Hero from '@aziontech/webkit/hero'
import { ref } from 'vue'

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
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The opening band of a lead-capture page, where the form IS the page’s purpose: the hero copy on one side and the form on the other, above the fold. The Contact page opens this way. Built from `Hero`, `Hero.Title`, the `Field*` controls and `Button`; the validation, submit and toast wiring the sample pages add is left to the consumer.'
      },
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
      description: {
        story:
          'The Contact page: a sticky title with the phone line in its description, the form in the second column of the default slot, and the client strip on the band’s floor. The band is unpadded and centred so the two columns sit in the middle of the viewport. `offset` is the sticky site nav’s height: it takes the nav out of the screen height and holds the title that far plus `--spacing-xl` from the top, which is where the form starts, so the headline and the form’s first row sit on one line. The canvas draws an empty bar of that height where the nav would be; without it the title would rest a nav’s height below the form.'
      },
      source: { code: toSfc(CONTACT_IMPORTS, CONTACT_TEMPLATE) }
    }
  }
}
