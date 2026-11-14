import { defineComponent, h, type PropType, type VNode } from 'vue'

export type FormValueItem = string | number | boolean | null | undefined | object

const serialize = (value: FormValueItem): string | null => {
  if (value === null || value === undefined || value === false) return null
  if (value === true) return 'on'
  return typeof value === 'object' ? JSON.stringify(value) : String(value)
}

export const FormValue = defineComponent({
  name: 'FormValue',
  props: {
    name: { type: String, default: '' },
    value: {
      type: [String, Number, Boolean, Object, Array] as PropType<FormValueItem | FormValueItem[]>,
      default: undefined
    },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    form: { type: String, default: undefined }
  },
  setup(props) {
    return () => {
      if (!props.name) return null
      const values = (Array.isArray(props.value) ? props.value : [props.value])
        .map(serialize)
        .filter((value): value is string => value !== null && value !== '')
      const nodes: VNode[] = values.map((value, index) =>
        h('input', {
          key: `${index}:${value}`,
          type: 'hidden',
          name: props.name,
          value,
          disabled: props.disabled,
          form: props.form,
          'data-slot': 'form-value'
        })
      )
      if (props.required && !values.length && !props.disabled) {
        nodes.push(
          h('input', {
            key: 'required',
            type: 'text',
            value: '',
            required: true,
            tabindex: -1,
            'aria-hidden': 'true',
            form: props.form,
            'data-slot': 'form-value-required',
            class:
              'pointer-events-none absolute inset-0 m-0 size-full appearance-none border-0 p-0 opacity-0'
          })
        )
      }
      return nodes
    }
  }
})
