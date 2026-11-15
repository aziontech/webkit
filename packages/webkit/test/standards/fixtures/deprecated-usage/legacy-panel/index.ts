import LegacyPanelRoot from './legacy-panel.vue'
import LegacyPanelItem from './legacy-panel-item.vue'

interface LegacyPanelStatic {
  Item: typeof LegacyPanelItem
  /** @deprecated since 6.0 — use LegacyPanel.Item. Removed in 7.0. */
  Option: typeof LegacyPanelItem
}

const LegacyPanel = LegacyPanelRoot as typeof LegacyPanelRoot & LegacyPanelStatic
LegacyPanel.Item = LegacyPanelItem
LegacyPanel.Option = LegacyPanelItem

export default LegacyPanel
