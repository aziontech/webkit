import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import HelpPanel, { HelpPanelFooter, HelpPanelGroup, HelpPanelHeader } from './index'

const FeatureItem = defineComponent({
  components: {
    HelpPanel,
    HelpPanelHeader,
    HelpPanelGroup,
    HelpPanelFooter
  },
  props: {
    loading: { type: Boolean, default: false }
  },
  template: `
    <HelpPanel aria-label="Help: Workloads" :loading="loading">
      <HelpPanelHeader
        title="Workloads"
        description="Where your domains meet the applications that answer them."
      />
      <HelpPanelGroup title="What is a workload?">
        <p>A workload binds one or more domains to an application.</p>
      </HelpPanelGroup>
      <HelpPanelGroup title="Who can edit it?">
        <p>Anyone with the Workloads permission.</p>
      </HelpPanelGroup>
      <HelpPanelFooter>
        <a href="https://www.azion.com/en/documentation/">Workloads documentation</a>
        <a href="https://www.azion.com/en/documentation/">Domains and certificates</a>
      </HelpPanelFooter>
    </HelpPanel>
  `
})

describe('HelpPanel', () => {
  describe('compound API', () => {
    it('attaches every part to the root for dot-notation', () => {
      expect(HelpPanel.Header).toBe(HelpPanelHeader)
      expect(HelpPanel.Group).toBe(HelpPanelGroup)
      expect(HelpPanel.Footer).toBe(HelpPanelFooter)
    })

    it('no longer carries a tutorial mode; TutorialPanel owns tutorials', () => {
      expect('Tutorial' in HelpPanel).toBe(false)
      expect('Task' in HelpPanel).toBe(false)
    })
  })

  describe('render', () => {
    it('exposes the fallback data-testid', () => {
      const view = render(HelpPanel)
      expect(view.getByTestId('help-panel')).toBeTruthy()
    })

    it('lets a consumer override data-testid', () => {
      const view = render(HelpPanel, { attrs: { 'data-testid': 'custom-help' } })
      expect(view.getByTestId('custom-help')).toBeTruthy()
      expect(view.queryByTestId('help-panel')).toBeNull()
    })

    it('renders a complementary landmark named by ariaLabel', () => {
      const view = render(FeatureItem)
      expect(view.getByRole('complementary', { name: 'Help: Workloads' })).toBeTruthy()
    })

    it('defaults the landmark name to Help', () => {
      const view = render(HelpPanel)
      expect(view.getByRole('complementary', { name: 'Help' })).toBeTruthy()
    })
  })

  describe('loading', () => {
    it('replaces the content with hidden skeleton lines and sets aria-busy', () => {
      const view = render(FeatureItem, { props: { loading: true } })
      const root = view.getByTestId('help-panel')
      expect(root.getAttribute('aria-busy')).toBe('true')
      expect(root.hasAttribute('data-loading')).toBe(true)
      const placeholder = view.getByTestId('help-panel__loading')
      expect(placeholder.getAttribute('aria-hidden')).toBe('true')
      expect(view.queryByTestId('help-panel-header')).toBeNull()
      expect(view.getByRole('complementary', { name: 'Help: Workloads' })).toBeTruthy()
    })

    it('renders the content and no aria-busy when not loading', () => {
      const view = render(FeatureItem)
      const root = view.getByTestId('help-panel')
      expect(root.hasAttribute('aria-busy')).toBe(false)
      expect(root.hasAttribute('data-loading')).toBe(false)
      expect(view.queryByTestId('help-panel__loading')).toBeNull()
    })
  })

  describe('topic', () => {
    it('renders the header heading and description', () => {
      const view = render(FeatureItem)
      expect(view.getByRole('heading', { level: 2, name: 'Workloads' })).toBeTruthy()
      expect(
        view.getByText('Where your domains meet the applications that answer them.')
      ).toBeTruthy()
    })

    it('labels each section by its heading', () => {
      const view = render(FeatureItem)
      expect(view.getByRole('region', { name: 'What is a workload?' })).toBeTruthy()
      expect(view.getByRole('region', { name: 'Who can edit it?' })).toBeTruthy()
      expect(view.getAllByTestId('help-panel-group')).toHaveLength(2)
    })

    it('renders the links under a Learn more heading', () => {
      const view = render(FeatureItem)
      const links = view.getByRole('region', { name: 'Learn more' })
      expect(links.getAttribute('data-testid')).toBe('help-panel-footer')
      expect(links.querySelectorAll('a')).toHaveLength(2)
    })

    it('renders no section heading when the title is empty', () => {
      const view = render(HelpPanelGroup, { slots: { default: '<p>Body</p>' } })
      expect(view.queryByRole('heading')).toBeNull()
      expect(view.getByTestId('help-panel-group').hasAttribute('aria-labelledby')).toBe(false)
    })
  })

  describe('a11y', () => {
    it('has no axe violations on a help topic', async () => {
      const { container } = render(FeatureItem)
      await expectNoA11yViolations(container)
    })

    it('has no axe violations while loading', async () => {
      const { container } = render(FeatureItem, { props: { loading: true } })
      await expectNoA11yViolations(container)
    })
  })

  describe('on devices', () => {
    it('is a named container for the content of the panel it sits in', () => {
      const view = render(HelpPanel)

      expect(view.getByTestId('help-panel').className).toContain('@container/help-panel')
    })
  })
})
