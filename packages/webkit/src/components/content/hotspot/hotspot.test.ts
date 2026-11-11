import { userEvent } from '@storybook/test'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import { TutorialPanelProvider } from '../tutorial-panel'
import type { Tutorial } from '../tutorial-panel/injection-key'
import Hotspot from './hotspot.vue'

const tutorials: Tutorial[] = [
  {
    id: 'guide',
    title: 'Guide',
    tasks: [
      {
        title: 'Task one',
        steps: [
          { title: 'First', content: 'Do the first thing.', hotspotId: 'a' },
          { title: 'Second', content: 'Do the second thing.', hotspotId: 'b' }
        ]
      }
    ]
  }
]

const Host = defineComponent({
  components: { TutorialPanelProvider, Hotspot },
  props: {
    active: { type: String, default: null },
    step: { type: Number, default: 0 }
  },
  setup(props) {
    const current = ref(props.active)
    const at = ref(props.step)
    return { tutorials, current, at }
  },
  template: `
    <TutorialPanelProvider v-model:active="current" v-model:step="at" :tutorials="tutorials">
      <Hotspot hotspot-id="a"><button type="button">Alpha</button></Hotspot>
      <Hotspot hotspot-id="b"><button type="button">Beta</button></Hotspot>
      <Hotspot hotspot-id="z"><button type="button">Other</button></Hotspot>
    </TutorialPanelProvider>
  `
})

const tick = async () => {
  await nextTick()
  await nextTick()
}

const markers = () =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-testid="content-hotspot__marker"]'))

describe('Hotspot', () => {
  it('renders no marker while no tutorial runs', () => {
    render(Host)
    expect(markers()).toHaveLength(0)
  })

  it('shows a marker only beside the running tutorial’s steps, the current one open and pulsing', async () => {
    const { container } = render(Host, { props: { active: 'guide', step: 1 } })
    await tick()
    expect(markers()).toHaveLength(2)
    const current = container.querySelector('[data-current]') as HTMLElement
    expect(current.textContent).toContain('Beta')
    expect(current.querySelector('.animate-ping')).not.toBeNull()
    expect(markers()[1]?.getAttribute('aria-label')).toBe('Tutorial step: Second')
    expect(markers()[1]?.getAttribute('aria-expanded')).toBe('true')
    const panel = document.querySelector('[data-testid="content-hotspot__popover__panel"]')
    expect(panel?.textContent).toContain('Step 2 of 2')
    expect(panel?.textContent).toContain('Task one')
    expect(panel?.textContent).toContain('Finish')
    expect(panel?.textContent).toContain('Previous')
  })

  it('opens from the keyboard on Enter on a marker', async () => {
    render(Host, { props: { active: 'guide', step: 1 } })
    await tick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await tick()
    const marker = markers()[0] as HTMLElement
    marker.focus()
    await userEvent.keyboard('{Enter}')
    await tick()
    const panel = document.querySelector('[data-testid="content-hotspot__popover__panel"]')
    expect(panel?.textContent).toContain('First')
    expect(panel?.textContent).not.toContain('Previous')
  })

  it('places the marker before the content with side="start"', async () => {
    const { getByRole, container } = render({
      components: { TutorialPanelProvider, Hotspot },
      setup: () => ({ tutorials }),
      template: `
        <TutorialPanelProvider :tutorials="tutorials" active="guide" :step="0">
          <Hotspot hotspot-id="a" side="start"><button type="button">Alpha</button></Hotspot>
        </TutorialPanelProvider>
      `
    })
    await tick()
    const marker = container.querySelector<HTMLElement>(
      '[data-testid="content-hotspot__marker"]'
    ) as HTMLElement
    const button = getByRole('button', { name: 'Alpha' })
    expect(marker.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('has no axe violations', async () => {
    const { container } = render(Host, { props: { active: 'guide', step: 0 } })
    await tick()
    await expectNoA11yViolations(container)
  })
})
