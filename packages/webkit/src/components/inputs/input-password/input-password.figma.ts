import figma, { html } from '@figma/code-connect/html'

const FIGMA_NODE = 'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3714-10788'

figma.connect(FIGMA_NODE, {
  label: 'InputPassword',
  imports: ['import InputPassword from "@aziontech/webkit/inputs/input-password"'],
  props: {
    placeholder: figma.string('placeholder'),
    disabled: figma.boolean('disabled'),
    invalid: figma.boolean('invalid'),
    toggleable: figma.boolean('toggleable')
  },
  example: ({ placeholder, disabled, invalid, toggleable }) => html`
    <input-password
      placeholder=${placeholder}
      :disabled=${disabled}
      :invalid=${invalid}
      :toggleable=${toggleable}
      autocomplete="current-password"
    />
  `
})
