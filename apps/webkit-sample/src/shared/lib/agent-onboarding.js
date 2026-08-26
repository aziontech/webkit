// Agent onboarding — the one prompt, and the tools it is meant to be pasted into.
//
// Three surfaces offer this: the copy-prompt button (ui/CopyPromptButton.vue, on the site and
// the docs home), the first-access card (console/HomeEmptyState.vue) and the same card at
// the foot of the populated Overview's usage rail (console/Home.vue). They MUST hand over
// the same text — a prompt that drifts between places is that many different onboardings,
// and the reader has no way to tell which one they got. So it lives here, once, and every
// surface imports it.
//
// It is written as instructions to an agent, not as marketing: an imperative per
// clause, the docs URL first so the agent reads before it writes, and the deliverable
// named at the end (build + deploy commands) so the agent knows when it is done.

import { computed, ref } from 'vue'

/** The setup prompt copied to the clipboard. */
export const AGENT_SETUP_PROMPT =
  'Set up this project to deploy on Azion. Read https://www.azion.com/en/documentation/, ' +
  'install the Azion CLI, scaffold an azion.config.js for an application, and wire up ' +
  'the build + deploy commands so I can ship to the edge.'

/**
 * The AI coding tools this onboarding targets, in the order they read best in a row.
 * Names match the marks `site/ui/AgentMark.vue` can draw.
 */
export const AGENT_TOOLS = ['claude', 'cursor', 'windsurf', 'codex', 'opencode']

// ── DISMISSAL ──
//
// The offer is guidance, and guidance the reader has acted on (or decided against)
// has to be able to leave the layout and STAY gone. `CopyPromptButton` removes itself
// on the click and emits `close`; whether it comes back is deliberately not its
// decision (see the note in that file). This is that decision, in the one place every
// surface can share it.
//
// It is ONE flag for the whole onboarding, not one per screen. The card in the populated
// Overview's rail and the card on a first access are the same offer — dismissing it on
// one and meeting it again on the other is the console telling the reader their answer
// did not count.
//
// localStorage, like the theme, the sidebar and the sample version (src/theme.js,
// src/sidebar.js, lib/sample-mode.js): in the console this is a user preference or
// `additional_data` on the organization; here it is the same fact with a smaller
// backing store, and it has to survive a reload or "dismiss" means "until you press
// F5". A module-level ref so every mounted surface reacts to the same click.
//
// It starts DISMISSED. The offer is the one block on these screens that is an offer
// and not the product, so the sample opens on the layout without it and the reader
// asks for it — the "Agent onboarding" switch in the preset panel — rather than
// clearing it away before they can read anything else. That makes the absence the
// default and the presence a choice, so the key has to record BOTH answers: an
// absent entry is "never asked" and reads as dismissed, and restoring writes the
// explicit `false` instead of deleting the key (deleting it would fall straight back
// to the default and the switch would not move).
const DISMISS_KEY = 'webkit-sample-agent-onboarding-dismissed'

const readDismissed = () => {
  if (typeof localStorage === 'undefined') return true
  return localStorage.getItem(DISMISS_KEY) !== 'false'
}

const dismissed = ref(readDismissed())

/**
 * Whether the agent onboarding pill still has a place in the layout.
 *
 * Pages bind `agentOnboardingVisible` to `v-if` and call `dismissAgentOnboarding()`
 * from the pill's `close` — never the raw flag, so the polarity reads the same at
 * every call site (positive polarity, per the prop vocabulary the DS uses).
 */
export function useAgentOnboarding() {
  return {
    agentOnboardingVisible: computed(() => !dismissed.value),
    dismissAgentOnboarding,
    restoreAgentOnboarding
  }
}

/** Take it out of the layout, for good. */
export function dismissAgentOnboarding() {
  dismissed.value = true
  if (typeof localStorage !== 'undefined') localStorage.setItem(DISMISS_KEY, 'true')
}

/** Put it back — the prototype's way out of a decision with no console UI to undo it. */
export function restoreAgentOnboarding() {
  dismissed.value = false
  // Written, not deleted: an absent entry means "never asked", which is dismissed.
  if (typeof localStorage !== 'undefined') localStorage.setItem(DISMISS_KEY, 'false')
}
