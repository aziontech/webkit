// Maps each Component Grid cell to its page on the deployed Webkit Storybook, so
// a cell's label links straight to that component's docs.
//
// The docs id is the Storybook autodocs slug: kebab-joined path of the story
// title (`Components/<Category>/<Name>`) with the NAME LEFT UNSPLIT, plus the
// `--documentation` suffix — so `Components/Actions/SplitButton` is
// `components-actions-splitbutton--documentation`, not `…-split-button--docs`.
//
// Every id below was generated from the live index at
// https://webkit.azion.app/index.json — do not hand-write one. To refresh:
//   curl -s https://webkit.azion.app/index.json | node -e "…entries → type==='docs'"
//
// The Storybook category does NOT always match this grid's section grouping:
// Dropdown / Menu live under Navigation, Toast under Feedback, Spinner under
// Utils. A handful of shipped components have no docs page yet (Illustration,
// PasswordRequirements, ResizablePanel, Panel) — they are absent from the map,
// `hasComponentDocs` reports false, and the cell renders its name as plain text
// instead of a link that would dump the reader on the docs landing page.
const STORYBOOK_BASE = 'https://webkit.azion.app/?path=/docs/'

// Landing page used when a cell has no dedicated component docs page.
const DOCS_HOME = 'get-started--documentation'

// Cell name → Storybook docs id.
const DOCS_IDS = {
  // Actions
  Button: 'components-actions-button--documentation',
  ButtonHighlight: 'components-actions-buttonhighlight--documentation',
  CopyButton: 'components-actions-copybutton--documentation',
  IconButton: 'components-actions-iconbutton--documentation',
  MiniButton: 'components-actions-minibutton--documentation',
  SegmentedButton: 'components-actions-segmentedbutton--documentation',
  SplitButton: 'components-actions-splitbutton--documentation',

  // Inputs
  BoxGridSelection: 'components-inputs-boxgridselection--documentation',
  Calendar: 'components-inputs-calendar--documentation',
  Checkbox: 'components-inputs-checkbox--documentation',
  Chip: 'components-inputs-chip--documentation',
  FieldCheckbox: 'components-inputs-fieldcheckbox--documentation',
  FieldCheckboxBlock: 'components-inputs-fieldcheckboxblock--documentation',
  FieldInputGroup: 'components-inputs-fieldinputgroup--documentation',
  FieldPassword: 'components-inputs-fieldpassword--documentation',
  FieldPhoneNumber: 'components-inputs-fieldphonenumber--documentation',
  FieldRadio: 'components-inputs-fieldradio--documentation',
  FieldRadioBlock: 'components-inputs-fieldradioblock--documentation',
  FieldSelect: 'components-inputs-fieldselect--documentation',
  FieldSwitch: 'components-inputs-fieldswitch--documentation',
  FieldSwitchBlock: 'components-inputs-fieldswitchblock--documentation',
  FieldText: 'components-inputs-fieldtext--documentation',
  FieldTextSwitch: 'components-inputs-fieldtextswitch--documentation',
  FieldTextarea: 'components-inputs-fieldtextarea--documentation',
  HelperText: 'components-inputs-helpertext--documentation',
  Hint: 'components-inputs-hint--documentation',
  InputGroup: 'components-inputs-inputgroup--documentation',
  InputNumber: 'components-inputs-inputnumber--documentation',
  InputPassword: 'components-inputs-inputpassword--documentation',
  InputText: 'components-inputs-inputtext--documentation',
  Label: 'components-inputs-label--documentation',
  MultiSelect: 'components-inputs-multiselect--documentation',
  RadioButton: 'components-inputs-radiobutton--documentation',
  Select: 'components-inputs-select--documentation',
  Switch: 'components-inputs-switch--documentation',
  Textarea: 'components-inputs-textarea--documentation',
  ThemeSwitcher: 'components-inputs-themeswitcher--documentation',

  // Content
  Accordion: 'components-content-accordion--documentation',
  Avatar: 'components-content-avatar--documentation',
  AzionLogo: 'components-content-azionlogo--documentation',
  Badge: 'components-content-badge--documentation',
  Brand: 'components-content-brand--documentation',
  CardBox: 'components-content-cardbox--documentation',
  CardPricing: 'components-content-cardpricing--documentation',
  Currency: 'components-content-currency--documentation',
  HeroTitle: 'components-content-herotitle--documentation',
  Item: 'components-content-item--documentation',
  Kbd: 'components-content-kbd--documentation',
  Overline: 'components-content-overline--documentation',
  SectionTitle: 'components-content-sectiontitle--documentation',
  Tag: 'components-content-tag--documentation',

  // Feedback
  EmptyState: 'components-feedback-emptystate--documentation',
  Message: 'components-feedback-message--documentation',
  ProgressBar: 'components-feedback-progressbar--documentation',
  Skeleton: 'components-feedback-skeleton--documentation',
  StatusIndicator: 'components-feedback-statusindicator--documentation',
  Toast: 'components-feedback-toast--documentation',
  Spinner: 'utils-spinner--documentation',

  // Layout
  Divider: 'components-layout-divider--documentation',
  Footer: 'components-layout-footer--documentation',
  FrameBox: 'components-layout-framebox--documentation',
  GlobalHeader: 'components-layout-globalheader--documentation',
  ScrollArea: 'components-layout-scrollarea--documentation',
  SectionGap: 'components-layout-sectiongap--documentation',
  Sidebar: 'components-layout-sidebar--documentation',

  // Overlay
  CommandMenu: 'components-overlay-commandmenu--documentation',
  Dialog: 'components-overlay-dialog--documentation',
  Drawer: 'components-overlay-drawer--documentation',
  Popover: 'components-overlay-popover--documentation',
  Tooltip: 'components-overlay-tooltip--documentation',

  // Navigation
  Breadcrumb: 'components-navigation-breadcrumb--documentation',
  BreadcrumbItem: 'components-navigation-breadcrumbitem--documentation',
  Dropdown: 'components-navigation-dropdown--documentation',
  Link: 'components-navigation-link--documentation',
  Menu: 'components-navigation-menu--documentation',
  MenuItem: 'components-navigation-menu--documentation',
  NavigationMenu: 'components-navigation-navigationmenu--documentation',
  TabView: 'components-navigation-tabview--documentation',

  // Data
  Flow: 'components-data-flow--documentation',
  PaginationButton: 'components-data-paginator--documentation',
  Paginator: 'components-data-paginator--documentation',
  PickList: 'components-data-picklist--documentation',
  Table: 'components-data-table--documentation',

  // Code
  CodeBlock: 'components-code-codeblock--documentation',
  LogView: 'components-code-logview--documentation'
}

/**
 * Whether this cell has a dedicated Storybook docs page. False for components
 * that ship but are not documented yet — the cell then shows a plain label.
 */
export function hasComponentDocs(name) {
  return name in DOCS_IDS
}

/**
 * The Storybook docs URL for a Component Grid cell, by its `name`. Falls back to
 * the docs landing page for names without a dedicated component page.
 */
export function componentDocsUrl(name) {
  return STORYBOOK_BASE + (DOCS_IDS[name] ?? DOCS_HOME)
}
