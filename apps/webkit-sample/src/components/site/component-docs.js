// Maps each Component Grid cell to its page on the deployed Webkit Storybook, so
// a cell's label links straight to that component's docs.
//
// The docs id is the Storybook autodocs slug — kebab-case of the story title
// (`Components/<Category>/<Name>`) + `--docs`. The Storybook category does NOT
// always match the grid's own section grouping: Dropdown lives under Navigation,
// Toast under Feedback, Spinner under Utils, and Divider / ScrollArea / Sidebar /
// GlobalHeader under Layout. Panel and PaginationButton have no dedicated docs
// page (Panel is shown compositionally; PaginationButton is a Paginator part), so
// they fall back to the closest page / the docs landing.
const STORYBOOK_BASE = 'https://dev-webkit.azion.app/?path=/docs/'

// Landing page used when a cell has no dedicated component docs page.
const DOCS_HOME = 'get-started--documentation'

// Cell name → Storybook docs id.
const DOCS_IDS = {
  // Actions
  Button: 'components-actions-button--docs',
  SplitButton: 'components-actions-split-button--docs',
  IconButton: 'components-actions-icon-button--docs',
  MiniButton: 'components-actions-mini-button--docs',
  CopyButton: 'components-actions-copy-button--docs',
  ButtonHighlight: 'components-actions-button-highlight--docs',
  SegmentedButton: 'components-actions-segmented-button--docs',

  // Inputs
  InputText: 'components-inputs-input-text--docs',
  InputNumber: 'components-inputs-input-number--docs',
  InputPassword: 'components-inputs-input-password--docs',
  Textarea: 'components-inputs-textarea--docs',
  Checkbox: 'components-inputs-checkbox--docs',
  RadioButton: 'components-inputs-radio-button--docs',
  Switch: 'components-inputs-switch--docs',
  Chip: 'components-inputs-chip--docs',
  Calendar: 'components-inputs-calendar--docs',
  ThemeSwitcher: 'components-inputs-theme-switcher--docs',
  Label: 'components-inputs-label--docs',
  HelperText: 'components-inputs-helper-text--docs',
  Select: 'components-inputs-select--docs',
  MultiSelect: 'components-inputs-multi-select--docs',
  InputGroup: 'components-inputs-input-group--docs',
  BoxGridSelection: 'components-inputs-box-grid-selection--docs',
  FieldText: 'components-inputs-field-text--docs',
  FieldPassword: 'components-inputs-field-password--docs',
  FieldTextarea: 'components-inputs-field-textarea--docs',
  FieldPhoneNumber: 'components-inputs-field-phone-number--docs',
  FieldInputGroup: 'components-inputs-field-input-group--docs',
  FieldTextSwitch: 'components-inputs-field-text-switch--docs',
  FieldCheckbox: 'components-inputs-field-checkbox--docs',
  FieldCheckboxBlock: 'components-inputs-field-checkbox-block--docs',
  FieldRadio: 'components-inputs-field-radio--docs',
  FieldRadioBlock: 'components-inputs-field-radio-block--docs',
  FieldSwitch: 'components-inputs-field-switch--docs',
  FieldSwitchBlock: 'components-inputs-field-switch-block--docs',

  // Content
  Avatar: 'components-content-avatar--docs',
  Badge: 'components-content-badge--docs',
  Brand: 'components-content-brand--docs',
  Currency: 'components-content-currency--docs',
  Overline: 'components-content-overline--docs',
  Tag: 'components-content-tag--docs',
  Accordion: 'components-content-accordion--docs',
  CardBox: 'components-content-card-box--docs',
  Item: 'components-content-item--docs',
  CardPricing: 'components-content-card-pricing--docs',
  Divider: 'components-layout-divider--docs',
  ScrollArea: 'components-layout-scroll-area--docs',

  // Feedback
  Skeleton: 'components-feedback-skeleton--docs',
  Spinner: 'utils-spinner--docs',
  StatusIndicator: 'components-feedback-status-indicator--docs',
  Message: 'components-feedback-message--docs',
  ProgressBar: 'components-feedback-progress-bar--docs',
  Panel: DOCS_HOME,
  EmptyState: 'components-feedback-empty-state--docs',

  // Overlay
  Tooltip: 'components-overlay-tooltip--docs',
  Dialog: 'components-overlay-dialog--docs',
  Drawer: 'components-overlay-drawer--docs',
  Popover: 'components-overlay-popover--docs',
  Dropdown: 'components-navigation-dropdown--docs',
  Toast: 'components-feedback-toast--docs',

  // Navigation
  Link: 'components-navigation-link--docs',
  MenuItem: 'components-navigation-menu-item--docs',
  Breadcrumb: 'components-navigation-breadcrumb--docs',
  TabView: 'components-navigation-tab-view--docs',
  Sidebar: 'components-layout-sidebar--docs',
  NavigationMenu: 'components-navigation-navigation-menu--docs',
  GlobalHeader: 'components-layout-global-header--docs',

  // Data
  PaginationButton: 'components-data-paginator--docs',
  Flow: 'components-data-flow--docs',
  Paginator: 'components-data-paginator--docs',
  Table: 'components-data-table--docs',
  PickList: 'components-data-pick-list--docs',

  // Code
  CodeBlock: 'components-code-code-block--docs',
  LogView: 'components-code-log-view--docs'
}

/**
 * The Storybook docs URL for a Component Grid cell, by its `name`. Falls back to
 * the docs landing page for names without a dedicated component page.
 */
export function componentDocsUrl(name) {
  return STORYBOOK_BASE + (DOCS_IDS[name] ?? DOCS_HOME)
}
