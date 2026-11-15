import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import ApprovalFailed from '../../../blocks/ai/ai-action-approval/variants/error.vue'
import AiChatDrawer from '../../../blocks/ai/ai-chat-drawer/ai-chat-drawer.vue'

afterEach(() => cleanup())
describe('ai', () => {
  it('ai-action-approval Failed: says what failed and offers Retry', async () => {
    const view = render(ApprovalFailed)
    await waitFor(() =>
      expect(view.container.textContent).toContain('still serves the previous version')
    )
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    await waitFor(() =>
      expect(view.container.textContent).not.toContain('failed while uploading the build')
    )
  })

  it('ai-chat-drawer opens the assistant from Agent without dimming the page', async () => {
    const view = render(AiChatDrawer)
    await fireEvent.click(view.getByRole('button', { name: 'Agent' }))
    await waitFor(() => expect(document.querySelector('[role="dialog"]')).not.toBeNull())
    expect(document.querySelector('[data-testid$="__backdrop"]')).toBeNull()
  })
})
