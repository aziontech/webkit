import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import Default from '../../../../examples/timeline/default.vue'
import Groups from '../../../../examples/timeline/groups.vue'
import Loading from '../../../../examples/timeline/loading.vue'
import WithMarker from '../../../../examples/timeline/with-marker.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import ConfigProvider from '../../provider/config-provider/config-provider.vue'
import { useTimelineContext } from './composables/use-timeline-context'
import Timeline, { TimelineGroup, TimelineItem } from './index'
import TimelineRoot from './timeline.vue'

const NOW = Date.UTC(2026, 10, 21, 16, 0, 0)

const items = () => [
  h(TimelineItem, {
    title: 'SLA breached',
    severity: 'danger',
    icon: 'az az-clock',
    actor: 'System',
    time: '2026-11-21T15:30:00Z'
  }),
  h(TimelineItem, { title: 'Ticket opened', description: 'Duplicate charge.' })
]

function mount(props: Record<string, unknown> = {}, children = items) {
  return render({
    render: () =>
      h(ConfigProvider, { now: NOW, timeZone: 'UTC', locale: 'en-US' }, () =>
        h(TimelineRoot, props, children)
      )
  })
}

describe('Timeline', () => {
  it('exposes Item and Group on the compound', () => {
    expect(Timeline.Item).toBe(TimelineItem)
    expect(Timeline.Group).toBe(TimelineGroup)
  })

  it('renders an ordered list named by the locale catalog, with own test ids', () => {
    const { getByTestId, getAllByTestId } = mount()
    const root = getByTestId('timeline')
    expect(root.tagName).toBe('OL')
    expect(root.getAttribute('aria-label')).toBe('Activity')
    expect(root.dataset.orientation).toBe('vertical')
    expect(getAllByTestId('timeline-item')).toHaveLength(2)
    expect(getAllByTestId('timeline-item')[0].tagName).toBe('LI')
  })

  it('lets the consumer data-testid and aria-label win', () => {
    const { getByTestId } = mount({
      'data-testid': 'ticket-activity',
      ariaLabel: 'Ticket activity'
    })
    expect(getByTestId('ticket-activity').getAttribute('aria-label')).toBe('Ticket activity')
  })

  it('mirrors size on the root and on every item', () => {
    const { getByTestId, getAllByTestId } = mount({ size: 'small' })
    expect(getByTestId('timeline').dataset.size).toBe('small')
    for (const item of getAllByTestId('timeline-item')) expect(item.dataset.size).toBe('small')
  })

  it('renders title, description, actor and time, and the severity and marker kind', () => {
    const { getAllByTestId, getByText, container } = mount()
    const [breach, opened] = getAllByTestId('timeline-item')
    expect(breach.dataset.severity).toBe('danger')
    expect(breach.dataset.marker).toBe('icon')
    expect(breach.querySelector('[data-testid="timeline-item__marker"] i')?.classList).toContain(
      'az-clock'
    )
    expect(getByText('SLA breached').dataset.slot).toBe('timeline-title')
    expect(breach.querySelector('bdi')?.textContent).toBe('System')
    expect(breach.querySelector('time')?.getAttribute('datetime')).toBe('2026-11-21T15:30:00.000Z')
    expect(opened.dataset.severity).toBe('neutral')
    expect(opened.dataset.marker).toBe('dot')
    expect(opened.querySelector('time')).toBeNull()
    expect(opened.querySelector('[data-slot="timeline-meta"]')).toBeNull()
    expect(getByText('Duplicate charge.').dataset.slot).toBe('timeline-description')
    expect(container.querySelectorAll('[data-slot="timeline-body"]')).toHaveLength(0)
  })

  it('passes timeFormat to every Timestamp', () => {
    const { getAllByTestId } = mount({ timeFormat: 'relative' })
    expect(getAllByTestId('timestamp')[0].dataset.format).toBe('relative')
  })

  it('hides the marker column from assistive technology', () => {
    const { getAllByTestId } = mount()
    const marker = getAllByTestId('timeline-item__marker')[0]
    expect(marker.parentElement?.getAttribute('aria-hidden')).toBe('true')
    expect(marker.parentElement?.querySelector('[data-slot="timeline-connector"]')).not.toBeNull()
  })

  it('renders the marker slot in place of the dot', () => {
    const { getAllByTestId } = render(WithMarker)
    const item = getAllByTestId('timeline-item')[0]
    expect(item.dataset.marker).toBe('custom')
    expect(
      item.querySelector('[data-testid="timeline-item__marker"] [data-testid="avatar"]')
    ).not.toBeNull()
  })

  it('renders the default slot as the body', () => {
    const body = render(Default).getAllByTestId('timeline-item')[2]
    expect(body.querySelector('[data-slot="timeline-body"]')?.textContent).toContain(
      'Billing queue'
    )
  })

  it('groups items under a label that names the nested list', () => {
    const { getAllByTestId } = render(Groups)
    const groups = getAllByTestId('timeline-group')
    expect(groups).toHaveLength(2)
    const label = groups[0].querySelector<HTMLElement>('[data-testid="timeline-group__label"]')!
    expect(label.textContent).toBe('November 21, 2026')
    const list = groups[0].querySelector('ol')!
    expect(list.getAttribute('aria-labelledby')).toBe(label.id)
    expect(list.querySelectorAll(':scope > li[data-slot="timeline-item"]')).toHaveLength(2)
  })

  it('shows placeholders and a hidden loading label while loading, and hides the slot', () => {
    const { getByTestId, getAllByTestId, queryByText, getByText } = mount({ loading: true })
    const root = getByTestId('timeline')
    expect(root.getAttribute('aria-busy')).toBe('true')
    expect(root.dataset.loading).toBe('true')
    expect(getAllByTestId('timeline__loading')).toHaveLength(3)
    for (const row of getAllByTestId('timeline__loading'))
      expect(row.getAttribute('aria-hidden')).toBe('true')
    expect(getByText('Loading activity').classList).toContain('sr-only')
    expect(queryByText('SLA breached')).toBeNull()
  })

  it('uses loadingLabel over the catalog', () => {
    const { getByText } = mount({ loading: true, loadingLabel: 'Loading ticket history' })
    expect(getByText('Loading ticket history')).toBeTruthy()
  })

  it('is not busy when not loading', () => {
    const { getByTestId } = mount()
    expect(getByTestId('timeline').hasAttribute('aria-busy')).toBe(false)
  })

  it('throws when a part is used outside a Timeline', () => {
    const Loose = defineComponent({ setup: () => () => h(TimelineItem, { title: 'Loose' }) })
    expect(() => render(Loose)).toThrow('useTimelineContext must be used within a Timeline.')
  })

  it('exports its context so an app can write its own part', () => {
    let size = ''
    const Part = defineComponent({
      setup() {
        size = useTimelineContext().size.value
        return () => h('li', 'custom')
      }
    })
    mount({ size: 'small' }, () => [h(Part)])
    expect(size).toBe('small')
  })

  it('keeps its structure under dir="rtl"', () => {
    const { getAllByTestId } = render({
      render: () =>
        h('div', { dir: 'rtl' }, [
          h(ConfigProvider, { now: NOW, timeZone: 'UTC', locale: 'en-US' }, () =>
            h(TimelineRoot, {}, items)
          )
        ])
    })
    const item = getAllByTestId('timeline-item')[0]
    expect(item.firstElementChild?.getAttribute('aria-hidden')).toBe('true')
    expect(item.className).toContain('gap-x-(--spacing-sm)')
    expect(item.className).not.toMatch(/\b(ml|mr|pl|pr|left|right)-/)
  })

  it('has no axe violations', async () => {
    await expectNoA11yViolations(render(Default).container)
    await expectNoA11yViolations(render(Groups).container)
    await expectNoA11yViolations(render(Loading).container)
    await expectNoA11yViolations(render(WithMarker).container)
  })
})
