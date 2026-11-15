import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import Default from '../../../../examples/status-code/default.vue'
import RequestLog from '../../../../examples/status-code/request-log.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import StatusCode from './status-code.vue'

describe('StatusCode', () => {
  it('renders the fallback data-testid with a dash and the invalid class when empty', () => {
    const { getByTestId, queryByTestId } = render(StatusCode)

    const root = getByTestId('content-status-code')
    expect(root).toHaveAttribute('data-status-class', 'invalid')
    expect(root).toHaveAttribute('data-severity', 'secondary')
    expect(root).toHaveAttribute('data-size', 'medium')
    expect(getByTestId('content-status-code__code')).toHaveTextContent('—')
    expect(queryByTestId('content-status-code__method')).toBeNull()
  })

  it('lets a consumer data-testid win and derives the part ids from it', () => {
    const { getByTestId, queryByTestId } = render(StatusCode, {
      props: { code: 200, method: 'get' },
      attrs: { 'data-testid': 'request-status' }
    })

    expect(getByTestId('request-status')).toBeInTheDocument()
    expect(getByTestId('request-status__method')).toHaveTextContent('GET')
    expect(getByTestId('request-status__code')).toHaveTextContent('200')
    expect(queryByTestId('content-status-code')).toBeNull()
  })

  it.each([
    [101, 'informational', 'secondary'],
    [200, 'success', 'secondary'],
    ['204', 'success', 'secondary'],
    [304, 'redirect', 'secondary'],
    [404, 'client-error', 'warning'],
    ['429', 'client-error', 'warning'],
    [503, 'server-error', 'danger'],
    [42, 'invalid', 'secondary'],
    [600, 'invalid', 'secondary'],
    ['ok', 'invalid', 'secondary']
  ] as const)('maps %s to the %s class and the %s severity', (code, statusClass, severity) => {
    const { getByTestId } = render(StatusCode, { props: { code } })

    const root = getByTestId('content-status-code')
    expect(root).toHaveAttribute('data-status-class', statusClass)
    expect(root).toHaveAttribute('data-severity', severity)
    expect(getByTestId('content-status-code__code')).toHaveTextContent(String(code))
  })

  it('marks only an invalid code as invalid', () => {
    const valid = render(StatusCode, { props: { code: 404 } })
    expect(valid.getByTestId('content-status-code__code')).not.toHaveAttribute('data-invalid')
    valid.unmount()

    const invalid = render(StatusCode, { props: { code: 'n/a' } })
    expect(invalid.getByTestId('content-status-code__code')).toHaveAttribute('data-invalid')
  })

  it.each(['small', 'medium'] as const)('forwards size %s to the tag', (size) => {
    const { getByTestId } = render(StatusCode, { props: { code: 200, size } })

    expect(getByTestId('content-status-code')).toHaveAttribute('data-size', size)
  })

  it('reads as method then code, isolated left to right', () => {
    const { getByTestId } = render(StatusCode, { props: { code: 503, method: ' post ' } })

    const root = getByTestId('content-status-code')
    expect(root).toHaveAttribute('dir', 'ltr')
    expect(root).toHaveTextContent(/^POST\s*503$/)
  })

  it('renders 1,000 codes in one list', () => {
    const codes = Array.from({ length: 1000 }, (_, i) => [200, 301, 404, 503][i % 4])
    const List = defineComponent({
      setup: () => () =>
        h(
          'div',
          codes.map((code, i) => h(StatusCode, { key: i, code, method: 'GET' }))
        )
    })
    const started = performance.now()
    const { getAllByTestId } = render(List)
    const elapsed = performance.now() - started

    expect(getAllByTestId('content-status-code')).toHaveLength(1000)
    expect(elapsed).toBeLessThan(2000)
  })

  it('has no axe violations in the examples', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
    const log = render(RequestLog)
    await expectNoA11yViolations(log.container)
  })
})
