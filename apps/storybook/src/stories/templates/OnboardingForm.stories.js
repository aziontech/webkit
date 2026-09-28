import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import FieldCheckbox from '@aziontech/webkit/field-checkbox'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Tag from '@aziontech/webkit/tag'
import { ref } from 'vue'

import { toSfc } from '../_shared/story-source'

const usageItems = [
  { value: 'learn', label: 'Learn', ariaLabel: 'Learn usage intent' },
  { value: 'personal', label: 'Personal Project', ariaLabel: 'Personal project usage intent' },
  { value: 'work', label: 'Work', ariaLabel: 'Work usage intent' }
]

const IMPORT = [
  "import BoxGridSelection from '@aziontech/webkit/box-grid-selection'",
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import FieldCheckbox from '@aziontech/webkit/field-checkbox'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Item from '@aziontech/webkit/item'",
  "import Tag from '@aziontech/webkit/tag'",
  "import { ref } from 'vue'",
  '',
  'const usageItems = [',
  "  { value: 'learn', label: 'Learn', ariaLabel: 'Learn usage intent' },",
  "  { value: 'personal', label: 'Personal Project', ariaLabel: 'Personal project usage intent' },",
  "  { value: 'work', label: 'Work', ariaLabel: 'Work usage intent' }",
  ']',
  "const usageValue = ref('personal')",
  "const fullName = ref('')",
  'const scheduleOnboarding = ref(true)'
]

const FORM_TEMPLATE = `<form class="flex w-full max-w-(--container-lg) flex-col" aria-labelledby="onboarding-title" @submit.prevent>
  <CardBox class="w-full" :padded="false">
    <template #content>
      <div class="flex w-full flex-col gap-(--spacing-xl) p-(--spacing-xl)">
        <h1 id="onboarding-title" class="text-center text-heading-md text-(--text-default) [word-break:break-word]">
          Your first global deployment is seconds away
        </h1>

        <section class="flex w-full flex-col gap-(--spacing-xxs)">
          <p class="text-body-sm text-(--text-muted)">Plan Selected</p>
          <Item kind="outline" size="medium">
            <Item.Content>
              <div class="flex flex-wrap items-center gap-(--spacing-xs)">
                <Item.Title>Hobby</Item.Title>
                <Tag label="Free" severity="secondary" />
              </div>
              <Item.Description>For professional or commercial workloads.</Item.Description>
            </Item.Content>
            <Item.Actions>
              <Button label="Change" kind="outlined" size="small" />
            </Item.Actions>
          </Item>
        </section>

        <section class="flex w-full flex-col gap-(--spacing-xxs)">
          <label id="usage-label" for="usage" class="text-body-sm text-(--text-muted)">
            How are you planning to use Azion?
            <span class="text-(--primary)" aria-hidden="true">*</span>
          </label>
          <BoxGridSelection
            id="usage"
            v-model="usageValue"
            :items="usageItems"
            aria-labelledby="usage-label"
            aria-required="true"
            class="w-full"
          />
        </section>

        <section class="flex w-full flex-col gap-(--spacing-xxs)">
          <label id="full-name-label" for="full-name" class="text-body-sm text-(--text-muted)">
            Your Full Name
            <span class="text-(--primary)" aria-hidden="true">*</span>
          </label>
          <InputText
            id="full-name"
            v-model="fullName"
            placeholder="John Doe"
            size="large"
            aria-labelledby="full-name-label"
            aria-required="true"
            class="w-full"
          />
        </section>

        <FieldCheckbox
          v-model="scheduleOnboarding"
          label="Schedule an onboarding session with an Azion expert"
          input-id="schedule-onboarding"
        />

        <Button type="submit" label="Continue" kind="primary" size="large" class="w-full" />
      </div>
    </template>

    <template #footer>
      <p class="w-full text-center text-body-sm text-(--text-muted) [word-break:break-word]">
        Have enterprise requirements?
        <a
          href="#"
          class="text-(--text-link) transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
        >
          Get in touch
        </a>
        with our team.
      </p>
    </template>
  </CardBox>
</form>`

// Dot-notation sub-tags are registered by their exact name so Storybook's
// runtime-compiled string template resolves them; a real SFC resolves them off
// the imported compound root.
const components = {
  BoxGridSelection,
  Button,
  CardBox,
  FieldCheckbox,
  InputText,
  Item,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Description': Item.Description,
  'Item.Actions': Item.Actions,
  Tag
}

/** @type {import('@storybook/vue3').Meta<typeof CardBox>} */
const meta = {
  title: 'Templates/OnboardingForm',
  component: CardBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'Post-signup onboarding form composed from `CardBox`, `Item`, `Tag`, `BoxGridSelection`, `InputText`, `FieldCheckbox` and `Button`: plan summary, usage intent grid, full name field, expert-session checkbox, primary continue action, and enterprise footer CTA.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {},
  args: {}
}

export default meta

/** @type {import('@storybook/vue3').StoryObj<typeof CardBox>} */
export const Default = {
  render: () => ({
    components,
    setup() {
      const usageValue = ref('personal')
      const fullName = ref('')
      const scheduleOnboarding = ref(true)
      return { usageItems, usageValue, fullName, scheduleOnboarding }
    },
    template: FORM_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Onboarding form as shown in the post-signup deployment flow, with the usage grid, name field and checkbox bound to local state.'
      },
      source: { code: toSfc(IMPORT, FORM_TEMPLATE) }
    }
  }
}
