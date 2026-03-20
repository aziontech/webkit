/**
 * Component Status Data
 * 
 * Centralized data source for tracking component progress across design and code.
 * This data drives the Components Status table in the documentation.
 */

/**
 * Progress status types for design and code tracking
 */
export type ProgressStatus = 
  | 'done' 
  | 'documenting' 
  | 'queued' 
  | 'handoff' 
  | 'planned' 
  | 'not-started';

/**
 * Component status item structure
 */
export interface ComponentStatusItem {
  /** Display name of the component */
  name: string;
  /** URL-friendly identifier */
  slug: string;
  /** Link to component documentation */
  href: string;
  /** Design progress status */
  designStatus: ProgressStatus;
  /** Code progress status */
  codeStatus: ProgressStatus;
  /** Version when launched (null if not launched) */
  launchVersion: string | null;
  /** Whether this is a planned component (not yet in development) */
  planned: boolean;
  /** Category for grouping */
  category: string;
}

/**
 * Configuration for progress status badges
 * Maps status to display label and semantic styling
 */
export const PROGRESS_STATUS_CONFIG: Record<ProgressStatus, {
  label: string;
  semanticClass: string;
  description: string;
}> = {
  done: {
    label: 'Done',
    semanticClass: 'success',
    description: 'Completed and ready for use',
  },
  documenting: {
    label: 'Documenting',
    semanticClass: 'info',
    description: 'Currently being documented',
  },
  queued: {
    label: 'Queued',
    semanticClass: 'warning',
    description: 'Waiting to be worked on',
  },
  handoff: {
    label: 'Handoff',
    semanticClass: 'accent',
    description: 'Ready for handoff to development',
  },
  planned: {
    label: 'Planned',
    semanticClass: 'neutral',
    description: 'Planned for future development',
  },
  'not-started': {
    label: 'Not started',
    semanticClass: 'neutral',
    description: 'Not yet started',
  },
};

/**
 * Component status data
 * 
 * This is the source of truth for the Components Status table.
 * Initial baseline: All components set to 'queued' status.
 */
export const componentStatusData: ComponentStatusItem[] = [
  // Form Components
  { name: 'AutoComplete', slug: 'autocomplete', href: '/components/autocomplete/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'Calendar', slug: 'calendar', href: '/components/calendar/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'CascadeSelect', slug: 'cascadeselect', href: '/components/cascadeselect/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'Checkbox', slug: 'checkbox', href: '/components/checkbox/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'Chips', slug: 'chips', href: '/components/chips/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'ColorPicker', slug: 'colorpicker', href: '/components/colorpicker/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'Dropdown', slug: 'dropdown', href: '/components/dropdown/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'Editor', slug: 'editor', href: '/components/editor/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'FloatLabel', slug: 'floatlabel', href: '/components/floatlabel/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'IconField', slug: 'iconfield', href: '/components/iconfield/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'InputGroup', slug: 'inputgroup', href: '/components/inputgroup/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'InputMask', slug: 'inputmask', href: '/components/inputmask/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'InputNumber', slug: 'inputnumber', href: '/components/inputnumber/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'InputOtp', slug: 'inputotp', href: '/components/inputotp/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'InputSwitch', slug: 'inputswitch', href: '/components/inputswitch/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'InputText', slug: 'inputtext', href: '/components/inputtext/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'Knob', slug: 'knob', href: '/components/knob/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'Listbox', slug: 'listbox', href: '/components/listbox/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'MultiSelect', slug: 'multiselect', href: '/components/multiselect/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'Password', slug: 'password', href: '/components/password/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'RadioButton', slug: 'radiobutton', href: '/components/radiobutton/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'Rating', slug: 'rating', href: '/components/rating/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'SelectButton', slug: 'selectbutton', href: '/components/selectbutton/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'Slider', slug: 'slider', href: '/components/slider/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'Textarea', slug: 'textarea', href: '/components/textarea/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'ToggleButton', slug: 'togglebutton', href: '/components/togglebutton/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'TreeSelect', slug: 'treeselect', href: '/components/treeselect/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },
  { name: 'TriStateCheckbox', slug: 'tristatecheckbox', href: '/components/tristatecheckbox/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'form' },

  // Button Components
  { name: 'Button', slug: 'button', href: '/components/button/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'button' },
  { name: 'Speed Dial', slug: 'speed-dial', href: '/components/speed-dial/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'button' },
  { name: 'SplitButton', slug: 'splitbutton', href: '/components/splitbutton/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'button' },

  // Data Components
  { name: 'DataTable', slug: 'datatable', href: '/components/datatable/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'data' },
  { name: 'DataView', slug: 'dataview', href: '/components/dataview/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'data' },
  { name: 'OrderList', slug: 'orderlist', href: '/components/orderlist/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'data' },
  { name: 'Org Chart', slug: 'org-chart', href: '/components/org-chart/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'data' },
  { name: 'Paginator', slug: 'paginator', href: '/components/paginator/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'data' },
  { name: 'PickList', slug: 'picklist', href: '/components/picklist/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'data' },
  { name: 'Tree', slug: 'tree', href: '/components/tree/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'data' },
  { name: 'TreeTable', slug: 'treetable', href: '/components/treetable/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'data' },
  { name: 'Timeline', slug: 'timeline', href: '/components/timeline/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'data' },
  { name: 'VirtualScroller', slug: 'virtualscroller', href: '/components/virtualscroller/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'data' },

  // Panel Components
  { name: 'Accordion', slug: 'accordion', href: '/components/accordion/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'panel' },
  { name: 'Card', slug: 'card', href: '/components/card/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'panel' },
  { name: 'Deferred', slug: 'deferred', href: '/components/deferred/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'panel' },
  { name: 'Divider', slug: 'divider', href: '/components/divider/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'panel' },
  { name: 'Fieldset', slug: 'fieldset', href: '/components/fieldset/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'panel' },
  { name: 'Panel', slug: 'panel', href: '/components/panel/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'panel' },
  { name: 'ScrollPanel', slug: 'scrollpanel', href: '/components/scrollpanel/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'panel' },
  { name: 'Splitter', slug: 'splitter', href: '/components/splitter/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'panel' },
  { name: 'Stepper', slug: 'stepper', href: '/components/stepper/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'panel' },
  { name: 'TabView', slug: 'tabview', href: '/components/tabview/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'panel' },
  { name: 'Toolbar', slug: 'toolbar', href: '/components/toolbar/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'panel' },

  // Overlay Components
  { name: 'ConfirmDialog', slug: 'confirmdialog', href: '/components/confirmdialog/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'overlay' },
  { name: 'ConfirmPopup', slug: 'confirmpopup', href: '/components/confirmpopup/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'overlay' },
  { name: 'Dialog', slug: 'dialog', href: '/components/dialog/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'overlay' },
  { name: 'DynamicDialog', slug: 'dynamicdialog', href: '/components/dynamicdialog/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'overlay' },
  { name: 'OverlayPanel', slug: 'overlaypanel', href: '/components/overlaypanel/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'overlay' },
  { name: 'Sidebar', slug: 'sidebar', href: '/components/sidebar/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'overlay' },
  { name: 'Tooltip', slug: 'tooltip', href: '/components/tooltip/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'overlay' },

  // File Components
  { name: 'Upload', slug: 'upload', href: '/components/upload/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'file' },

  // Menu Components
  { name: 'Breadcrumb', slug: 'breadcrumb', href: '/components/breadcrumb/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'menu' },
  { name: 'ContextMenu', slug: 'contextmenu', href: '/components/contextmenu/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'menu' },
  { name: 'Dock', slug: 'dock', href: '/components/dock/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'menu' },
  { name: 'Menu', slug: 'menu', href: '/components/menu/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'menu' },
  { name: 'Menubar', slug: 'menubar', href: '/components/menubar/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'menu' },
  { name: 'MegaMenu', slug: 'megamenu', href: '/components/megamenu/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'menu' },
  { name: 'PanelMenu', slug: 'panelmenu', href: '/components/panelmenu/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'menu' },
  { name: 'Steps', slug: 'steps', href: '/components/steps/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'menu' },
  { name: 'TabMenu', slug: 'tabmenu', href: '/components/tabmenu/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'menu' },
  { name: 'TieredMenu', slug: 'tieredmenu', href: '/components/tieredmenu/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'menu' },

  // Chart Components
  { name: 'Chart.js', slug: 'chart-js', href: '/components/chart-js/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'chart' },

  // Messages Components
  { name: 'Message', slug: 'message', href: '/components/message/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'messages' },
  { name: 'InlineMessage', slug: 'inlinemessage', href: '/components/inlinemessage/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'messages' },
  { name: 'Toast', slug: 'toast', href: '/components/toast/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'messages' },

  // Media Components
  { name: 'Carousel', slug: 'carousel', href: '/components/carousel/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'media' },
  { name: 'Galleria', slug: 'galleria', href: '/components/galleria/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'media' },
  { name: 'Image', slug: 'image', href: '/components/image/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'media' },

  // Misc Components
  { name: 'Avatar', slug: 'avatar', href: '/components/avatar/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'misc' },
  { name: 'Badge', slug: 'badge', href: '/components/badge/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'misc' },
  { name: 'BlockUI', slug: 'blockui', href: '/components/blockui/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'misc' },
  { name: 'Chip', slug: 'chip', href: '/components/chip/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'misc' },
  { name: 'FocusTrap', slug: 'focustrap', href: '/components/focustrap/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'misc' },
  { name: 'Inplace', slug: 'inplace', href: '/components/inplace/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'misc' },
  { name: 'MeterGroup', slug: 'metergroup', href: '/components/metergroup/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'misc' },
  { name: 'ScrollTop', slug: 'scrolltop', href: '/components/scrolltop/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'misc' },
  { name: 'Skeleton', slug: 'skeleton', href: '/components/skeleton/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'misc' },
  { name: 'ProgressBar', slug: 'progressbar', href: '/components/progressbar/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'misc' },
  { name: 'ProgressSpinner', slug: 'progressspinner', href: '/components/progressspinner/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'misc' },
  { name: 'AnimateOnScroll', slug: 'animateonscroll', href: '/components/animateonscroll/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'misc' },
  { name: 'Ripple', slug: 'ripple', href: '/components/ripple/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'misc' },
  { name: 'StyleClass', slug: 'styleclass', href: '/components/styleclass/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'misc' },
  { name: 'Tag', slug: 'tag', href: '/components/tag/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'misc' },
  { name: 'Terminal', slug: 'terminal', href: '/components/terminal/', designStatus: 'queued', codeStatus: 'queued', launchVersion: null, planned: false, category: 'misc' },
];

/**
 * Get components grouped by launch status
 */
export function getComponentsByLaunchStatus() {
  return {
    launched: componentStatusData.filter(c => c.launchVersion !== null),
    inProgress: componentStatusData.filter(c => c.launchVersion === null && !c.planned),
    planned: componentStatusData.filter(c => c.planned === true),
  };
}

/**
 * Get components sorted by status priority
 * Launched components first, then in-progress, then planned
 */
export function getComponentsSorted(): ComponentStatusItem[] {
  const { launched, inProgress, planned } = getComponentsByLaunchStatus();
  return [...launched, ...inProgress, ...planned];
}

/**
 * Get unique launch versions from the data
 */
export function getLaunchVersions(): string[] {
  const versions = new Set<string>();
  componentStatusData.forEach(c => {
    if (c.launchVersion) {
      versions.add(c.launchVersion);
    }
  });
  return Array.from(versions).sort();
}

/**
 * Get unique categories from the data
 */
export function getCategories(): string[] {
  const categories = new Set<string>();
  componentStatusData.forEach(c => {
    if (c.category) {
      categories.add(c.category);
    }
  });
  return Array.from(categories).sort();
}

/**
 * Get components grouped by category
 */
export function getComponentsByCategory(): Record<string, ComponentStatusItem[]> {
  const grouped: Record<string, ComponentStatusItem[]> = {};
  componentStatusData.forEach(c => {
    if (!grouped[c.category]) {
      grouped[c.category] = [];
    }
    grouped[c.category].push(c);
  });
  return grouped;
}
