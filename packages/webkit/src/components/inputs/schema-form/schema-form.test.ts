import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import CustomField from '../../../../examples/schema-form/custom-field.vue'
import Default from '../../../../examples/schema-form/default.vue'
import WithValidation from '../../../../examples/schema-form/with-validation.vue'
import { en, provideLocale } from '../../../composables/use-locale'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import { buildNodes, seedDefaults, validateNode } from './schema'
import SchemaForm from './schema-form.vue'

const schema = {
  type: 'object' as const,
  required: ['name', 'region'],
  properties: {
    name: { type: 'string' as const, title: 'Name', minLength: 3, pattern: '^[a-z-]+$' },
    region: { type: 'string' as const, title: 'Region', enum: ['sa-east', 'us-east'] },
    timeout: {
      type: 'integer' as const,
      title: 'Timeout',
      description: 'In milliseconds.',
      minimum: 100,
      default: 3000
    },
    debug: { type: 'boolean' as const, title: 'Debug', default: false },
    paths: { type: 'array' as const, title: 'Paths', items: { type: 'string' as const } },
    origin: {
      type: 'object' as const,
      title: 'Origin',
      required: ['host'],
      properties: { host: { type: 'string' as const, title: 'Host' } }
    }
  }
}

const lastValue = (emitted: Record<string, unknown[][]>) =>
  emitted['update:modelValue']?.at(-1)?.[0] as Record<string, unknown> | undefined

describe('SchemaForm schema helpers', () => {
  it('maps types to widgets, infers types and orders keys', () => {
    const nodes = buildNodes(
      {
        properties: {
          a: { default: 1.5 },
          b: { enum: ['x'] },
          c: { type: 'array', items: { type: 'object', properties: {} } },
          d: { type: 'string', 'x-multiline': true }
        }
      },
      { '': { order: ['d'] }, b: { hidden: true } }
    )
    expect(nodes.map((n) => [n.key, n.widget])).toEqual([
      ['d', 'textarea'],
      ['a', 'number'],
      ['c', 'json']
    ])
  })

  it('seeds defaults only where the value has none', () => {
    const nodes = buildNodes(schema)
    expect(seedDefaults(nodes, { timeout: 10 })).toEqual({ timeout: 10, debug: false })
    expect(seedDefaults(nodes, { timeout: 10, debug: true })).toBeNull()
  })

  it('validates the supported keywords', () => {
    const [name, region, timeout, , paths] = buildNodes(schema)
    expect(validateNode(name!, undefined)).toEqual({ key: 'required' })
    expect(validateNode(name!, 'ab')).toEqual({ key: 'minLength', params: { min: 3 } })
    expect(validateNode(name!, 'ABC')).toEqual({ key: 'pattern' })
    expect(validateNode(region!, 'eu')).toEqual({ key: 'enum' })
    expect(validateNode(timeout!, undefined, '12x')).toEqual({ key: 'integer' })
    expect(validateNode(timeout!, 50)).toEqual({ key: 'minimum', params: { min: 100 } })
    expect(validateNode(timeout!, 1.5)).toEqual({ key: 'integer' })
    expect(validateNode(paths!, ['a'])).toBeNull()
  })
})

describe('SchemaForm', () => {
  it('renders one labelled Field per property and a fieldset per object', async () => {
    const view = render(SchemaForm, { props: { schema } })
    await nextTick()
    expect(view.getByLabelText(/Name/)).toBeTruthy()
    expect(view.getByRole('switch', { name: /Debug/ })).toBeTruthy()
    expect(view.getByRole('group', { name: 'Origin' }).tagName).toBe('FIELDSET')
    expect(view.getByLabelText(/Host/)).toBeTruthy()
    const timeout = view.getByLabelText(/Timeout/) as HTMLInputElement
    expect(timeout.getAttribute('inputmode')).toBe('numeric')
    expect(timeout.getAttribute('aria-describedby')).toBeTruthy()
  })

  it('seeds defaults into v-model and writes typed values', async () => {
    const view = render(SchemaForm, { props: { schema, modelValue: {} } })
    expect(lastValue(view.emitted())).toEqual({ timeout: 3000, debug: false })
    await view.rerender({ modelValue: lastValue(view.emitted()) })
    await fireEvent.update(view.getByLabelText(/Timeout/), '250')
    expect(lastValue(view.emitted())).toMatchObject({ timeout: 250 })
    await fireEvent.update(view.getByLabelText(/Paths/), '/a\n\n /b ')
    expect(lastValue(view.emitted())).toMatchObject({ paths: ['/a', '/b'] })
    await fireEvent.update(view.getByLabelText(/Host/), 'origin.example.com')
    expect(lastValue(view.emitted())).toMatchObject({ origin: { host: 'origin.example.com' } })
  })

  it('removes the key when a field is emptied', async () => {
    const view = render(SchemaForm, { props: { schema, modelValue: { name: 'edge' } } })
    await fireEvent.update(view.getByLabelText(/Name/), '')
    expect(lastValue(view.emitted())).not.toHaveProperty('name')
  })

  it('shows a field message after the field is left, not before', async () => {
    const model = ref<Record<string, unknown>>({})
    const view = render(
      defineComponent(
        () => () =>
          h(SchemaForm, {
            schema,
            modelValue: model.value,
            'onUpdate:modelValue': (v: Record<string, unknown>) => (model.value = v)
          })
      )
    )
    const name = view.getByLabelText(/Name/)
    await fireEvent.update(name, 'ab')
    expect(view.queryByText('Use at least 3 characters.')).toBeNull()
    await fireEvent.focusOut(name)
    expect(view.getByText('Use at least 3 characters.')).toBeTruthy()
    expect(name.getAttribute('aria-invalid')).toBe('true')
    await fireEvent.update(name, 'abc')
    expect(view.queryByText('Use at least 3 characters.')).toBeNull()
  })

  it('keeps unparsable number text and reports it', async () => {
    const view = render(SchemaForm, {
      props: { schema, modelValue: { timeout: 3000, debug: false } }
    })
    const timeout = view.getByLabelText(/Timeout/) as HTMLInputElement
    await fireEvent.update(timeout, '12x')
    await fireEvent.focusOut(timeout)
    expect(timeout.value).toBe('12x')
    expect(view.getByText('Enter a whole number.')).toBeTruthy()
    expect(lastValue(view.emitted())).not.toHaveProperty('timeout')
  })

  it('validate() shows every message in submit mode and focuses the first invalid field', async () => {
    const form = ref<InstanceType<typeof SchemaForm> | null>(null)
    const view = render(
      defineComponent(
        () => () => h(SchemaForm, { ref: form, schema, validateOn: 'submit', modelValue: {} })
      )
    )
    await fireEvent.focusOut(view.getByLabelText(/Name/))
    expect(view.queryByText('This field is required.')).toBeNull()
    const result = await form.value!.validate()
    expect(result.valid).toBe(false)
    expect(Object.keys(result.errors)).toEqual(['name', 'region', 'origin.host'])
    expect(view.getAllByText('This field is required.')).toHaveLength(3)
    await waitFor(() => expect(document.activeElement).toBe(view.getByLabelText(/Name/)))
    form.value!.clearValidation()
    await nextTick()
    expect(view.queryByText('This field is required.')).toBeNull()
  })

  it('shows server errors by path until the field is edited', async () => {
    const view = render(SchemaForm, {
      props: {
        schema,
        modelValue: { origin: { host: 'a' } },
        errors: { 'origin.host': 'This host does not answer.' }
      }
    })
    const host = view.getByLabelText(/Host/)
    expect(view.getByText('This host does not answer.')).toBeTruthy()
    expect(host.getAttribute('aria-invalid')).toBe('true')
    await fireEvent.update(host, 'b')
    expect(view.queryByText('This host does not answer.')).toBeNull()
  })

  it('replaces a control through a field:<path> slot and keeps the label', async () => {
    const view = render(SchemaForm, {
      props: { schema, modelValue: {} },
      slots: {
        'field:region': (scope: { setValue: (v: unknown) => void; required: boolean }) =>
          h(
            'button',
            {
              type: 'button',
              'data-required': String(scope.required),
              onClick: () => scope.setValue('us-east')
            },
            'Pick us-east'
          )
      }
    })
    const button = view.getByText('Pick us-east')
    expect(button.getAttribute('data-required')).toBe('true')
    expect(view.getByText('Region')).toBeTruthy()
    await fireEvent.click(button)
    expect(lastValue(view.emitted())).toMatchObject({ region: 'us-east' })
  })

  it('disables or locks every field', () => {
    const view = render(SchemaForm, { props: { schema, disabled: true, readonly: true } })
    expect(view.getByTestId('input-schema-form').hasAttribute('data-disabled')).toBe(true)
    expect((view.getByLabelText(/Name/) as HTMLInputElement).readOnly).toBe(true)
    expect(view.getByRole('switch', { name: /Debug/ }).hasAttribute('disabled')).toBe(true)
  })

  it('uses the locale catalog for built-in messages', async () => {
    const Wrapper = defineComponent(() => {
      provideLocale({ locale: 'pt-BR', catalogs: { en, ...LOCALES } })
      return () => h(SchemaForm, { schema, modelValue: {} })
    })
    const view = render(Wrapper)
    await fireEvent.focusOut(view.getByLabelText(/Name/))
    expect(view.getByText('Este campo é obrigatório.')).toBeTruthy()
  })

  it('renders under rtl', () => {
    const view = render(
      defineComponent(() => () => h('div', { dir: 'rtl' }, [h(SchemaForm, { schema })]))
    )
    expect(view.getByTestId('input-schema-form')).toBeTruthy()
  })

  it.each([
    ['Default', Default],
    ['WithValidation', WithValidation],
    ['CustomField', CustomField]
  ])('the %s example has no axe violations', async (_name, Example) => {
    const { container } = render(Example)
    await expectNoA11yViolations(container)
  })

  it('has no axe violations with messages showing', async () => {
    const form = ref<InstanceType<typeof SchemaForm> | null>(null)
    const { container } = render(
      defineComponent(() => () => h(SchemaForm, { ref: form, schema, modelValue: {} }))
    )
    await form.value!.validate()
    await nextTick()
    await expectNoA11yViolations(container)
  })
})
