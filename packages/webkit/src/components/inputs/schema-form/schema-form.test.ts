import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import CustomField from '../../../../examples/schema-form/custom-field.vue'
import Default from '../../../../examples/schema-form/default.vue'
import DynamicFields from '../../../../examples/schema-form/dynamic-fields.vue'
import RequestSchema from '../../../../examples/schema-form/request-schema.vue'
import WithValidation from '../../../../examples/schema-form/with-validation.vue'
import { en, provideLocale } from '../../../composables/use-locale'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import { buildNodes, expand, getAt, seedDefaults, setAt, validateNode } from './schema'
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
    ['CustomField', CustomField],
    ['DynamicFields', DynamicFields],
    ['RequestSchema', RequestSchema]
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

const bound = (props: Record<string, unknown>, start: Record<string, unknown> = {}) => {
  const model = ref<Record<string, unknown>>(start)
  const form = ref<InstanceType<typeof SchemaForm> | null>(null)
  const view = render(
    defineComponent(
      () => () =>
        h(SchemaForm, {
          ref: form,
          ...props,
          modelValue: model.value,
          'onUpdate:modelValue': (v: Record<string, unknown>) => (model.value = v)
        })
    )
  )
  return { view, model, form }
}

describe('SchemaForm paths and expansion', () => {
  it('reads and writes through array indexes', () => {
    const value = { rules: [{ path: '/a' }, { path: '/b' }] }
    expect(getAt(value, 'rules.1.path')).toBe('/b')
    expect(setAt(value, 'rules.0.path', '/x')).toEqual({ rules: [{ path: '/x' }, { path: '/b' }] })
    expect(setAt(value, 'rules.0.path', undefined)).toEqual({ rules: [{}, { path: '/b' }] })
    expect(value.rules[0]).toEqual({ path: '/a' })
  })

  it('lists the fields a when predicate and an unchosen variant hide', () => {
    const nodes = buildNodes(
      {
        properties: {
          on: { type: 'boolean' },
          ttl: { type: 'integer' },
          auth: {
            discriminator: { propertyName: 'kind' },
            oneOf: [
              { properties: { kind: { const: 'a' }, token: { type: 'string' } } },
              { properties: { kind: { const: 'b' }, user: { type: 'string' } } }
            ]
          }
        }
      },
      { ttl: { when: (value) => value.on === true } }
    )
    const view = expand(nodes, { on: false, auth: { kind: 'a' } })
    expect(view.hidden.sort()).toEqual(['auth.user', 'ttl'])
  })
})

describe('SchemaForm conditional fields', () => {
  const conditional = {
    type: 'object' as const,
    properties: {
      cache: { type: 'boolean' as const, title: 'Cache', default: false },
      ttl: { type: 'integer' as const, title: 'TTL', minimum: 60, default: 3600 }
    },
    required: ['ttl']
  }
  const ui = { ttl: { when: (value: Record<string, unknown>) => value.cache === true } }

  it('hides a field, leaves it out of the value and brings it back with its value', async () => {
    const { view, model } = bound({ schema: conditional, ui })
    await nextTick()
    expect(view.queryByLabelText(/TTL/)).toBeNull()
    expect(model.value).toEqual({ cache: false })
    await fireEvent.click(view.getByRole('switch', { name: /Cache/ }))
    await waitFor(() => expect(view.getByLabelText(/TTL/)).toBeTruthy())
    expect(model.value).toEqual({ cache: true, ttl: 3600 })
    await fireEvent.update(view.getByLabelText(/TTL/), '120')
    await fireEvent.click(view.getByRole('switch', { name: /Cache/ }))
    await nextTick()
    expect(model.value).toEqual({ cache: false })
    await fireEvent.click(view.getByRole('switch', { name: /Cache/ }))
    await nextTick()
    expect(model.value).toEqual({ cache: true, ttl: 120 })
  })

  it('does not validate a hidden required field', async () => {
    const { form } = bound({ schema: conditional, ui }, { cache: false })
    await nextTick()
    const result = await form.value!.validate()
    expect(result).toEqual({ valid: true, errors: {} })
  })
})

describe('SchemaForm option loaders', () => {
  const options = [
    { value: 'o1', label: 'origin.example.com' },
    { value: 'o2', label: 'assets.example.com' }
  ]

  it('loads options on mount, searches through the loader and writes the value', async () => {
    const calls: string[] = []
    const load = async (query: string) => {
      calls.push(query)
      return options.filter((option) => option.label.includes(query))
    }
    const { view, model } = bound({
      schema: { type: 'object', properties: { origin: { type: 'string', title: 'Origin' } } },
      ui: { origin: { options: load } }
    })
    await waitFor(() => expect(calls).toEqual(['']))
    const input = view.getByLabelText(/Origin/) as HTMLInputElement
    expect(input.getAttribute('role')).toBe('combobox')
    await fireEvent.update(input, 'assets')
    await waitFor(() => expect(calls).toEqual(['', 'assets']), { timeout: 1500 })
    const option = await waitFor(() => {
      const row = document.querySelector('[role="option"]')
      expect(row?.textContent).toContain('assets.example.com')
      return row as HTMLElement
    })
    await fireEvent.click(option)
    await waitFor(() => expect(model.value).toEqual({ origin: 'o2' }))
  })

  it('selects several values for an array', async () => {
    const { view, model } = bound({
      schema: {
        type: 'object',
        properties: {
          origins: { type: 'array', title: 'Origins', items: { type: 'string' } }
        }
      },
      ui: { origins: { options: async () => options } }
    })
    const field = view.getByTestId('input-schema-form__field')
    expect(field.getAttribute('data-widget')).toBe('multiselect')
    await fireEvent.click(view.getByRole('combobox'))
    const first = await waitFor(() => {
      const row = Array.from(document.querySelectorAll('[role="option"]')).find((el) =>
        el.textContent?.includes('origin.example.com')
      )
      expect(row).toBeTruthy()
      return row as HTMLElement
    })
    await fireEvent.click(first)
    await waitFor(() => expect(model.value).toEqual({ origins: ['o1'] }))
  })

  it('tells the user when the loader fails', async () => {
    const { view } = bound({
      schema: { type: 'object', properties: { origin: { type: 'string', title: 'Origin' } } },
      ui: { origin: { options: () => Promise.reject(new Error('offline')) } }
    })
    await fireEvent.update(view.getByLabelText(/Origin/), 'x')
    await waitFor(() => expect(document.body.textContent).toContain("Couldn't load the options."), {
      timeout: 1500
    })
  })
})

describe('SchemaForm repeat', () => {
  const repeat = {
    type: 'object' as const,
    properties: {
      rules: {
        type: 'array' as const,
        title: 'Rules',
        items: {
          type: 'object' as const,
          title: 'Rule',
          required: ['path'],
          properties: {
            path: { type: 'string' as const, title: 'Path', default: '/' },
            behavior: { type: 'string' as const, title: 'Behavior', enum: ['cache', 'redirect'] },
            target: { type: 'string' as const, title: 'Target' }
          }
        }
      }
    }
  }
  const ui = {
    rules: { widget: 'repeat' as const },
    'rules.*.target': {
      when: (_value: Record<string, unknown>, rule: Record<string, unknown>) =>
        rule.behavior === 'redirect'
    }
  }

  it('keeps arrays of objects as JSON unless the repeat widget is asked for', () => {
    const [node] = buildNodes(repeat)
    expect(node!.widget).toBe('json')
    expect(buildNodes(repeat, ui)[0]!.widget).toBe('repeat')
  })

  it('adds, edits and removes items as fieldsets', async () => {
    const { view, model } = bound({ schema: repeat, ui })
    await nextTick()
    expect(view.getByRole('group', { name: 'Rules' }).tagName).toBe('FIELDSET')
    await fireEvent.click(view.getByRole('button', { name: /Add/ }))
    await waitFor(() => expect(model.value).toEqual({ rules: [{ path: '/' }] }))
    expect(view.getByRole('group', { name: 'Rule 1' })).toBeTruthy()
    const path = view.getByLabelText(/Path/) as HTMLInputElement
    path.focus()
    await fireEvent.update(path, '/images')
    expect(model.value).toEqual({ rules: [{ path: '/images' }] })
    await nextTick()
    expect(document.activeElement).toBe(view.getByLabelText(/Path/))
    expect(view.queryByLabelText(/Target/)).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: /Add/ }))
    await waitFor(() => expect(view.getAllByLabelText(/Path/)).toHaveLength(2))
    await fireEvent.click(view.getAllByRole('button', { name: /Remove/ })[0]!)
    await waitFor(() => expect(model.value).toEqual({ rules: [{ path: '/' }] }))
  })

  it('seeds item defaults and validates item fields by indexed path', async () => {
    const { view, form, model } = bound({ schema: repeat, ui }, { rules: [{ behavior: 'cache' }] })
    await nextTick()
    expect(model.value).toEqual({ rules: [{ behavior: 'cache', path: '/' }] })
    await fireEvent.update(view.getByLabelText(/Path/), '')
    expect(model.value).toEqual({ rules: [{ behavior: 'cache' }] })
    const failed = await form.value!.validate()
    expect(failed.errors).toEqual({ 'rules.0.path': 'This field is required.' })
  })
})

describe('SchemaForm OpenAPI keywords', () => {
  it('renders oneOf with a discriminator as a choice and the chosen variant', async () => {
    const { view, model } = bound(
      {
        schema: {
          type: 'object',
          properties: {
            auth: {
              title: 'Authentication',
              discriminator: { propertyName: 'method' },
              oneOf: [
                {
                  title: 'API token',
                  properties: {
                    method: { const: 'token' },
                    token: { type: 'string', title: 'Token' }
                  }
                },
                {
                  title: 'Basic',
                  properties: {
                    method: { const: 'basic' },
                    user: { type: 'string', title: 'User' }
                  }
                }
              ]
            }
          }
        }
      },
      { auth: { method: 'basic', user: 'jane.doe' } }
    )
    await nextTick()
    expect(view.getByRole('group', { name: 'Authentication' })).toBeTruthy()
    expect(view.getByLabelText(/User/)).toBeTruthy()
    expect(view.queryByLabelText(/Token/)).toBeNull()
    expect(view.getByRole('combobox', { name: /method/ }).textContent).toContain('Basic')
    await fireEvent.click(view.getByRole('combobox', { name: /method/ }))
    const token = await waitFor(() => {
      const row = Array.from(document.querySelectorAll('[role="option"]')).find((el) =>
        el.textContent?.includes('API token')
      )
      expect(row).toBeTruthy()
      return row as HTMLElement
    })
    await fireEvent.click(token)
    await waitFor(() => expect(model.value).toEqual({ auth: { method: 'token' } }))
    expect(view.getByLabelText(/Token/)).toBeTruthy()
  })

  it('edits a string map as key and value rows and flags duplicate keys', async () => {
    const { view, model, form } = bound(
      {
        schema: {
          type: 'object',
          properties: {
            headers: { type: 'object', title: 'Headers', additionalProperties: { type: 'string' } }
          }
        }
      },
      { headers: { 'X-Team': 'platform' } }
    )
    await nextTick()
    expect(view.getByTestId('input-schema-form__set').getAttribute('data-widget')).toBe('map')
    expect((view.getByDisplayValue('X-Team') as HTMLInputElement).value).toBe('X-Team')
    await fireEvent.click(view.getByRole('button', { name: /Add/ }))
    expect(model.value).toEqual({ headers: { 'X-Team': 'platform' } })
    const keys = view.getAllByLabelText('Key')
    await fireEvent.update(keys[1]!, 'X-Team')
    await waitFor(() => expect(view.getByText('Each key must be unique.')).toBeTruthy())
    const result = await form.value!.validate()
    expect(result.errors).toEqual({ headers: 'Each key must be unique.' })
    await fireEvent.update(view.getAllByLabelText('Key')[1]!, 'X-Env')
    await fireEvent.update(view.getAllByLabelText('Value')[1]!, 'prod')
    expect(model.value).toEqual({ headers: { 'X-Team': 'platform', 'X-Env': 'prod' } })
  })

  it('checks email, uri and date formats', async () => {
    const nodes = buildNodes({
      properties: {
        email: { type: 'string', format: 'email' },
        url: { type: 'string', format: 'uri' },
        day: { type: 'string', format: 'date' }
      }
    })
    const [email, url, day] = nodes
    expect(validateNode(email!, 'jane.doe')).toEqual({ key: 'email' })
    expect(validateNode(email!, 'jane.doe@example.com')).toBeNull()
    expect(validateNode(url!, 'example.com')).toEqual({ key: 'uri' })
    expect(validateNode(url!, 'https://example.com/docs')).toBeNull()
    expect(validateNode(day!, '2026-02-30')).toEqual({ key: 'date' })
    expect(validateNode(day!, '2026-02-28')).toBeNull()
    const view = render(SchemaForm, {
      props: {
        schema: { properties: { email: { type: 'string', title: 'Email', format: 'email' } } }
      }
    })
    expect((view.getByLabelText(/Email/) as HTMLInputElement).type).toBe('email')
  })

  it('renders writeOnly as a password field that omits the key when empty', async () => {
    const { view, model } = bound({
      schema: {
        type: 'object',
        properties: { secret: { type: 'string', title: 'Secret', writeOnly: true } }
      }
    })
    const secret = view.getByLabelText(/Secret/) as HTMLInputElement
    expect(secret.type).toBe('password')
    expect(secret.placeholder).toBe('Leave empty to keep the current value')
    await fireEvent.update(secret, 's3cret')
    expect(model.value).toEqual({ secret: 's3cret' })
    await fireEvent.update(secret, '')
    expect(model.value).toEqual({})
  })
})

describe('SchemaForm sections', () => {
  const sectioned = {
    type: 'object' as const,
    required: ['retries'],
    properties: {
      name: { type: 'string' as const, title: 'Name' },
      region: { type: 'string' as const, title: 'Region' },
      retries: { type: 'integer' as const, title: 'Retries', minimum: 1 }
    }
  }
  const ui = {
    '': {
      sections: [
        { title: 'Placement', keys: ['region'] },
        { keys: ['retries'], collapsed: true }
      ]
    }
  }

  it('groups keys under a legend and folds the collapsed one', async () => {
    const view = render(SchemaForm, { props: { schema: sectioned, ui } })
    await nextTick()
    expect(view.getByRole('group', { name: 'Placement' }).tagName).toBe('FIELDSET')
    const trigger = view.getByRole('button', { name: 'Advanced settings' })
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(view.queryByLabelText(/Retries/)).toBeNull()
    await fireEvent.click(trigger)
    await waitFor(() => expect(view.getByLabelText(/Retries/)).toBeTruthy())
  })

  it('opens a folded section when validate() lands on it', async () => {
    const { view, form } = bound({ schema: sectioned, ui })
    await nextTick()
    const result = await form.value!.validate()
    expect(Object.keys(result.errors)).toEqual(['retries'])
    await waitFor(() => expect(document.activeElement).toBe(view.getByLabelText(/Retries/)))
  })
})
