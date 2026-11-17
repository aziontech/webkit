import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import AsyncSubmit from '../../../blocks/state/async-submit/async-submit.vue'
import FormValidation from '../../../blocks/state/form-validation/form-validation.vue'
import { sampleReloadedOrigins } from '../../../blocks/state/form-validation/sample'
import SectionRejected from '../../../blocks/state/form-validation/variants/section-rejected.vue'
import PageSkeleton from '../../../blocks/state/page-skeleton/page-skeleton.vue'

afterEach(() => cleanup())
describe('state async-submit and form-validation', () => {
  it('async-submit: no simulation panel, Deploy emits deploy and loading shows the run', async () => {
    const view = render(AsyncSubmit)
    expect(view.queryByRole('complementary', { name: 'Scenario simulation' })).toBeNull()
    expect(view.getByRole('heading', { level: 1, name: 'Deploy web-app' })).toBeTruthy()
    await fireEvent.click(view.getByRole('button', { name: 'Deploy' }))
    const deploy = view.emitted<unknown[]>('deploy')
    expect(deploy).toHaveLength(1)
    expect(deploy![0]![0]).toBeInstanceOf(MouseEvent)
    expect(view.container.textContent).not.toContain('Deploying')
    await view.rerender({
      loading: true,
      steps: [
        { id: 'build', title: 'Compile bundle', status: 'running', lines: [] },
        { id: 'publish', title: 'Publish', status: 'pending', lines: [] }
      ]
    })
    await waitFor(() => expect(view.container.textContent).toContain('Deploying'))
    expect(view.container.textContent).toContain('0/2 steps')
    expect(view.container.textContent).toContain('Compile bundle')
    view.unmount()
  })

  it('async-submit: the failure shows the given reason and Redeploy emits redeploy', async () => {
    const view = render(AsyncSubmit, {
      props: {
        error: 'The build ran out of memory.',
        steps: [{ id: 'build', title: 'Build', status: 'error', lines: [] }]
      }
    })
    expect(view.container.textContent).toContain('The build ran out of memory.')
    expect(view.container.textContent).toContain('Failed on build')
    await fireEvent.click(view.getAllByRole('button', { name: 'Redeploy' })[0]!)
    expect(view.emitted<unknown[]>('redeploy')![0]![0]).toBeInstanceOf(MouseEvent)
    view.unmount()
  })

  it('form-validation: a valid draft emits submit with its values and sends no fake request', async () => {
    const view = render(FormValidation, {
      props: {
        defaultValues: {
          key: 'API_BASE_URL',
          value: 'https://api.example.com/v2',
          environment: 'Production'
        }
      }
    })
    await fireEvent.click(view.getByRole('button', { name: 'Create' }))
    const submit = view.emitted<unknown[]>('submit')
    expect(submit).toHaveLength(1)
    expect(submit![0]![0]).toBeInstanceOf(Event)
    expect(submit![0]![1]).toEqual({
      key: 'API_BASE_URL',
      value: 'https://api.example.com/v2',
      environment: 'Production',
      description: ''
    })
    expect(view.getByRole('form').getAttribute('aria-busy')).toBe('false')
    await view.rerender({ takenKey: 'API_BASE_URL' })
    expect(view.container.textContent).toContain('A variable named API_BASE_URL already exists.')
  })

  it('form-validation: an empty submit shows the field messages and emits nothing', async () => {
    const view = render(FormValidation)
    await fireEvent.click(view.getByRole('button', { name: 'Create' }))
    expect(view.emitted<unknown[]>('submit')).toBeUndefined()
    expect(view.container.textContent).toContain('Select an environment.')
  })

  it('form-validation: required shows from the start and a failed submit adds a Field.Error under the kept description', async () => {
    const view = render(FormValidation, { props: { defaultValues: { key: 'api token' } } })
    const key = view.getByRole('textbox', { name: /Key/ })
    expect(key.getAttribute('aria-required')).toBe('true')
    expect(key.getAttribute('aria-invalid')).not.toBe('true')
    expect(view.queryAllByTestId('field-error')).toHaveLength(0)
    await fireEvent.click(view.getByRole('button', { name: 'Create' }))
    await waitFor(() => expect(key.getAttribute('aria-invalid')).toBe('true'))
    const errors = view.getAllByTestId('field-error')
    expect(errors.map((error) => error.textContent?.trim())).toEqual([
      'Use uppercase letters, digits and underscores, starting with a letter.',
      'This field is required.',
      'Select an environment.'
    ])
    expect(errors[0]!.querySelector('.az-circle-alert')).not.toBeNull()
    const descriptions = view.getAllByTestId('field-description').map((d) => d.textContent?.trim())
    expect(descriptions).toContain(
      'Uppercase letters, digits and underscores, for example API_TOKEN.'
    )
    expect(descriptions).toContain('Where this variable is available.')
    expect(key.getAttribute('aria-describedby')).toContain(errors[0]!.id)
    await fireEvent.update(key, 'API_TOKEN')
    await waitFor(() => expect(key.getAttribute('aria-invalid')).not.toBe('true'))
    expect(view.getAllByTestId('field-error')).toHaveLength(2)
  })

  it('form-validation SectionRejected: Reload origins emits, and a reloaded list flags the origin', async () => {
    const view = render(SectionRejected)
    expect(view.queryByRole('complementary', { name: 'Scenario simulation' })).toBeNull()
    expect(view.getByRole('link', { name: 'Services' })).toBeTruthy()
    expect(view.container.textContent).toContain('This origin no longer exists.')
    await fireEvent.click(view.getByRole('button', { name: 'Reload origins' }))
    expect(view.emitted<unknown[]>('reload-origins')![0]![0]).toBeInstanceOf(MouseEvent)
    await view.rerender({ origins: sampleReloadedOrigins, originError: '' })
    await waitFor(() =>
      expect(view.container.textContent).toContain('Select an origin to continue.')
    )
    expect(view.container.textContent).not.toContain('This origin no longer exists.')
  })

  it('page-skeleton: the status region reads the label it is given', () => {
    const view = render(PageSkeleton, { props: { label: 'Loading the workloads.' } })
    expect(view.getByRole('status').textContent).toContain('Loading the workloads.')
  })
})
