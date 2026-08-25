<script setup>
  // The "Component Grid" — every top-level @aziontech/webkit component, live and
  // fully interactive, plotted into the NINE library categories the package itself
  // is organised by (Actions, Inputs, Content, Feedback, Overlay, Navigation,
  // Layout, Data, Code) — the same taxonomy as `src/components/<category>/` and
  // the Storybook tree, so a category here is the category there.
  //
  // Overlay collects the layered/floating surfaces (Dialog, Drawer, Popover,
  // Tooltip, Dropdown, CommandMenu, Toast); Layout collects the structural ones
  // (Divider, FrameBox, SectionGap, ScrollArea, ResizablePanel) and the shells
  // (Sidebar, GlobalHeader, Footer) — the last two used to sit under Navigation,
  // which disagreed with both the source tree and Storybook; Code collects the
  // source/log surfaces (CodeBlock, LogView).
  //
  // Each component sits in a bordered ComponentGridCell that names it and links to
  // its Storybook page. When `category` is set, only that category's section
  // renders (the Hub drives one category per view); left empty, every section
  // renders. Category ids match the Hub sidebar's "Components" items (actions,
  // inputs, content, feedback, overlay, navigation, layout, data, code).
  //
  // Usage snippets are the canonical minimal forms from each component's Storybook
  // Default story, so the grid can never drift from what ships.
  import Accordion from '@aziontech/webkit/accordion'
  import Avatar from '@aziontech/webkit/avatar'
  import Badge from '@aziontech/webkit/badge'
  import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import BreadcrumbItem from '@aziontech/webkit/breadcrumb-item'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Calendar from '@aziontech/webkit/calendar'
  import CardBox from '@aziontech/webkit/card-box'
  import CardPricing from '@aziontech/webkit/card-pricing'
  import Checkbox from '@aziontech/webkit/checkbox'
  import Chip from '@aziontech/webkit/chip'
  import CodeBlock from '@aziontech/webkit/code-block'
  import CommandMenu from '@aziontech/webkit/command-menu'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Currency from '@aziontech/webkit/currency'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DialogTrigger from '@aziontech/webkit/dialog-trigger'
  import Divider from '@aziontech/webkit/divider'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FieldCheckbox from '@aziontech/webkit/field-checkbox'
  import FieldCheckboxBlock from '@aziontech/webkit/field-checkbox-block'
  import FieldInputGroup from '@aziontech/webkit/field-input-group'
  import FieldPassword from '@aziontech/webkit/field-password'
  import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'
  import FieldRadio from '@aziontech/webkit/field-radio'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import FieldSelect from '@aziontech/webkit/field-select'
  import FieldSwitch from '@aziontech/webkit/field-switch'
  import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
  import FieldText from '@aziontech/webkit/field-text'
  import FieldTextSwitch from '@aziontech/webkit/field-text-switch'
  import FieldTextarea from '@aziontech/webkit/field-textarea'
  import Flow from '@aziontech/webkit/flow'
  import Footer from '@aziontech/webkit/footer'
  import FrameBox from '@aziontech/webkit/frame-box'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import HeroTitle from '@aziontech/webkit/hero-title'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputGroup from '@aziontech/webkit/input-group'
  import InputGroupAddon from '@aziontech/webkit/input-group-addon'
  import InputNumber from '@aziontech/webkit/input-number'
  import InputPassword from '@aziontech/webkit/input-password'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Kbd from '@aziontech/webkit/kbd'
  import Label from '@aziontech/webkit/label'
  import Link from '@aziontech/webkit/link'
  import LogView from '@aziontech/webkit/log-view'
  import LogViewContent from '@aziontech/webkit/log-view-content'
  import LogViewHeader from '@aziontech/webkit/log-view-header'
  import Menu from '@aziontech/webkit/menu'
  import MenuItem from '@aziontech/webkit/menu-item'
  import Message from '@aziontech/webkit/message'
  import MiniButton from '@aziontech/webkit/mini-button'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
  import Overline from '@aziontech/webkit/overline'
  import PaginationButton from '@aziontech/webkit/pagination-button'
  import Paginator from '@aziontech/webkit/paginator'
  import Panel from '@aziontech/webkit/panel'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PickList from '@aziontech/webkit/pick-list'
  import Popover from '@aziontech/webkit/popover'
  import PopoverClose from '@aziontech/webkit/popover-close'
  import PopoverContent from '@aziontech/webkit/popover-content'
  import PopoverHeader from '@aziontech/webkit/popover-header'
  import PopoverTitle from '@aziontech/webkit/popover-title'
  import PopoverTrigger from '@aziontech/webkit/popover-trigger'
  import ProgressBar from '@aziontech/webkit/progress-bar'
  import RadioButton from '@aziontech/webkit/radio-button'
  import ResizablePanel from '@aziontech/webkit/resizable-panel'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionTitle from '@aziontech/webkit/section-title'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Select from '@aziontech/webkit/select'
  import Sidebar from '@aziontech/webkit/sidebar'
  import SidebarGroup from '@aziontech/webkit/sidebar-group'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Spinner from '@aziontech/webkit/spinner'
  import SplitButton from '@aziontech/webkit/split-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import AzionLogo from '@aziontech/webkit/svg/azion/default'
  import Switch from '@aziontech/webkit/switch'
  import TabView from '@aziontech/webkit/tab-view'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  import ComponentGridCell from './ComponentGridCell.vue'

  // When `category` is set the grid renders just that one category's section — so
  // the Hub sidebar can drive a single category into its own content view. Left
  // empty, every category renders. Ids: actions, inputs, content, feedback,
  // overlay, navigation, layout, data, code.
  const props = defineProps({
    category: { type: String, default: '' }
  })
  const showCategory = (id) => !props.category || props.category === id

  // ── Actions ───────────────────────────────────────────────────────────────
  const splitItems = [
    { label: 'Save and continue', value: 'save-continue' },
    { label: 'Save as draft', value: 'save-draft' }
  ]
  const segmentedValue = ref('option-1')
  const segmentedOptions = [
    { label: 'Grid', value: 'option-1' },
    { label: 'List', value: 'option-2' },
    { label: 'Map', value: 'option-3' }
  ]

  // ── Inputs ────────────────────────────────────────────────────────────────
  const inputTextValue = ref('edge-function')
  const inputNumberValue = ref(10)
  const inputPasswordValue = ref('')
  const textareaValue = ref('')
  const checkboxValue = ref(true)
  const radioValue = ref('a')
  const switchValue = ref(true)
  const calendarRange = ref(null)
  const selectValue = ref('')
  const selectOptions = [
    { value: 'opt-1', label: 'Option 1' },
    { value: 'opt-2', label: 'Option 2' },
    { value: 'opt-3', label: 'Option 3' }
  ]
  const multiSelectValue = ref([])
  const multiSelectOptions = [
    { value: 'opt-1', label: 'Option 1' },
    { value: 'opt-2', label: 'Option 2' },
    { value: 'opt-3', label: 'Option 3' }
  ]
  const boxGridValue = ref('option1')
  const boxGridItems = [
    { value: 'option1', icon: 'pi pi-check', label: 'Option One', description: 'First option' },
    { value: 'option2', icon: 'pi pi-times', label: 'Option Two', description: 'Second option' },
    { value: 'option3', icon: 'pi pi-star', label: 'Option Three', description: 'Third option' }
  ]
  const themeSwitcherValue = ref('system')
  const fieldSelectValue = ref('')
  const fieldSelectOptions = [
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
    { value: 'us-west-2', label: 'US West (Oregon)' },
    { value: 'eu-west-1', label: 'EU (Ireland)' }
  ]
  const fieldTextValue = ref('')
  const fieldPasswordValue = ref('')
  const fieldTextareaValue = ref('')
  const fieldPhoneValue = ref('')
  const fieldPhoneCountry = ref('BR')
  const fieldCheckboxValue = ref(false)
  const fieldCheckboxBlockValue = ref(false)
  const fieldRadioValue = ref('option1')
  const fieldRadioBlockValue = ref('plan-a')
  const fieldSwitchValue = ref(false)
  const fieldSwitchBlockValue = ref(false)
  const fieldInputGroupValue = ref('')
  const fieldTextSwitchValue = ref('')
  const fieldTextSwitchEnabled = ref(true)

  // ── Feedback ──────────────────────────────────────────────────────────────
  const commandMenuOpen = ref(false)
  const dialogOpen = ref(false)
  const drawerOpen = ref(false)
  const showToast = () =>
    toast('Event has been created', { description: 'Sunday, December 03, 2023 at 9:00 AM' })

  // ── Navigation ────────────────────────────────────────────────────────────
  const crumbs = [
    { label: 'Home', href: '#', showIcon: true, icon: 'pi pi-home' },
    { label: 'Edge Functions', href: '#' },
    { label: 'my-function', current: true }
  ]
  const panelBasis = ref(200)
  const tabValue = ref('overview')

  // ── Data ──────────────────────────────────────────────────────────────────
  const codeTabs = [
    {
      label: 'main.js',
      value: 'main',
      language: 'javascript',
      code: "export default async function (request) {\n  return new Response('Hello from the edge')\n}"
    }
  ]
  const tableItems = [
    { id: '1001', name: 'Workload Alpha', status: 'Active', editor: 'user1@example.com' },
    { id: '1002', name: 'Workload Bravo', status: 'Inactive', editor: 'user2@example.com' },
    { id: '1003', name: 'Workload Charlie', status: 'Degraded', editor: 'user3@example.com' }
  ]
  const logSearch = ref('')
  const logWarningsOnly = ref(false)
  const logLines = [
    { id: '1', time: '13:47:33', type: 'text', message: 'Deploy started successfully!' },
    { id: '2', time: '13:47:41', type: 'success', message: 'Build finished' },
    {
      id: '3',
      time: '13:47:42',
      type: 'folder',
      message: 'dist/index.js',
      folderType: 'asset',
      size: '12.4 kB',
      gzipSize: '4.1 kB'
    },
    { id: '4', time: '13:47:43', type: 'warning', message: 'Bundle larger than recommended' }
  ]
  const pickListModel = ref([
    [
      { id: 1, label: 'Edge Functions' },
      { id: 2, label: 'WAF' },
      { id: 3, label: 'Image Processor' }
    ],
    [{ id: 4, label: 'Cache' }]
  ])
</script>

<template>
  <div class="relative flex w-full flex-col gap-(--spacing-xl)">
    <!-- ── Actions ──────────────────────────────────────────────────────── -->
    <section
      v-if="showCategory('actions')"
      class="flex flex-col gap-(--spacing-sm)"
    >
      <div
        v-if="!category"
        class="flex items-baseline justify-between gap-(--spacing-sm) px-(--spacing-xxs)"
      >
        <h3 class="text-overline-sm uppercase tracking-widest text-(--text-muted)">Actions</h3>
        <span class="text-body-xs text-(--text-muted)">Buttons &amp; triggers</span>
      </div>
      <div class="grid w-full grid-cols-2 gap-0 md:grid-cols-4">
        <ComponentGridCell name="Button">
          <Button
            kind="primary"
            size="large"
            label="Button"
          />
        </ComponentGridCell>

        <ComponentGridCell name="SplitButton">
          <SplitButton
            kind="primary"
            size="large"
            label="Save"
            icon="pi pi-check"
            :model="splitItems"
          />
        </ComponentGridCell>

        <ComponentGridCell name="IconButton">
          <IconButton
            kind="primary"
            size="large"
            icon="pi pi-plus"
            aria-label="Add"
          />
        </ComponentGridCell>

        <ComponentGridCell name="MiniButton">
          <MiniButton
            size="large"
            label="Learn More"
            href="#"
          />
        </ComponentGridCell>

        <ComponentGridCell name="CopyButton">
          <CopyButton
            value="https://example.com/deploy/abc123"
            aria-label="Copy URL"
          />
        </ComponentGridCell>

        <ComponentGridCell name="ButtonHighlight">
          <ButtonHighlight
            size="large"
            label="Ask Azion"
            icon="pi pi-sparkles"
          />
        </ComponentGridCell>

        <ComponentGridCell name="SegmentedButton">
          <SegmentedButton
            v-model="segmentedValue"
            :options="segmentedOptions"
            aria-label="View"
          />
        </ComponentGridCell>
      </div>
    </section>

    <!-- ── Inputs ───────────────────────────────────────────────────────── -->
    <section
      v-if="showCategory('inputs')"
      class="flex flex-col gap-(--spacing-sm)"
    >
      <div
        v-if="!category"
        class="flex items-baseline justify-between gap-(--spacing-sm) px-(--spacing-xxs)"
      >
        <h3 class="text-overline-sm uppercase tracking-widest text-(--text-muted)">Inputs</h3>
        <span class="text-body-xs text-(--text-muted)">Fields &amp; controls</span>
      </div>
      <div class="grid w-full grid-cols-2 gap-0 md:grid-cols-4">
        <ComponentGridCell name="InputText">
          <InputText
            v-model="inputTextValue"
            placeholder="Type something"
            class="w-full"
          />
        </ComponentGridCell>

        <ComponentGridCell name="InputNumber">
          <InputNumber
            v-model="inputNumberValue"
            :min="0"
            :max="100"
            :step="1"
            placeholder="Quantity"
            class="w-full"
          />
        </ComponentGridCell>

        <ComponentGridCell name="InputPassword">
          <InputPassword
            v-model="inputPasswordValue"
            placeholder="Enter your password"
            autocomplete="current-password"
            class="w-full"
          />
        </ComponentGridCell>

        <ComponentGridCell name="Textarea">
          <Textarea
            v-model="textareaValue"
            placeholder="Write your message"
            class="w-full"
          />
        </ComponentGridCell>

        <ComponentGridCell name="Checkbox">
          <Checkbox
            v-model="checkboxValue"
            binary
            input-id="grid-checkbox"
            aria-label="Toggle option"
          />
        </ComponentGridCell>

        <ComponentGridCell name="RadioButton">
          <RadioButton
            v-model="radioValue"
            name="grid-radio"
            value="a"
            input-id="grid-radio-a"
            aria-label="Option A"
          />
        </ComponentGridCell>

        <ComponentGridCell name="Switch">
          <Switch
            v-model="switchValue"
            aria-label="Toggle setting"
          />
        </ComponentGridCell>

        <ComponentGridCell name="Chip">
          <Chip
            label="edge-function"
            size="medium"
          />
        </ComponentGridCell>

        <ComponentGridCell name="Calendar">
          <Calendar
            v-model="calendarRange"
            mode="range"
            clearable
          />
        </ComponentGridCell>

        <ComponentGridCell name="ThemeSwitcher">
          <ThemeSwitcher
            v-model:value="themeSwitcherValue"
            aria-label="Theme"
          />
        </ComponentGridCell>

        <ComponentGridCell name="Label">
          <Label
            label="Label"
            required
          />
        </ComponentGridCell>

        <ComponentGridCell name="HelperText">
          <HelperText
            kind="helper"
            label="Helper Text"
          />
        </ComponentGridCell>

        <ComponentGridCell name="Hint">
          <Hint text="Values are encrypted at rest and never displayed again after saving." />
        </ComponentGridCell>

        <ComponentGridCell name="Select">
          <div class="w-full">
            <Select
              v-model="selectValue"
              placeholder="Select an option"
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Option
                  v-for="o in selectOptions"
                  :key="o.value"
                  :value="o.value"
                >
                  {{ o.label }}
                </Select.Option>
              </Select.Content>
            </Select>
          </div>
        </ComponentGridCell>

        <ComponentGridCell name="MultiSelect">
          <div class="w-full">
            <MultiSelect
              v-model="multiSelectValue"
              placeholder="Select options"
            >
              <MultiSelect.Trigger />
              <MultiSelect.Content>
                <MultiSelect.Option
                  v-for="o in multiSelectOptions"
                  :key="o.value"
                  :value="o.value"
                >
                  {{ o.label }}
                </MultiSelect.Option>
              </MultiSelect.Content>
            </MultiSelect>
          </div>
        </ComponentGridCell>

        <ComponentGridCell name="InputGroup">
          <InputGroup class="w-full">
            <InputGroupAddon>https://</InputGroupAddon>
            <input
              placeholder="domain"
              class="h-full min-w-0 flex-1 border-0 bg-(--bg-surface) px-(--spacing-md) text-label-sm text-(--text-default) outline-none placeholder:text-(--text-muted) focus:ring-0"
            />
            <InputGroupAddon>.com</InputGroupAddon>
          </InputGroup>
        </ComponentGridCell>

        <ComponentGridCell
          name="BoxGridSelection"
          span="full"
        >
          <BoxGridSelection
            v-model="boxGridValue"
            :items="boxGridItems"
            class="w-full"
          />
        </ComponentGridCell>

        <ComponentGridCell name="FieldText">
          <FieldText
            v-model="fieldTextValue"
            label="Email"
            placeholder="you@example.com"
            helper-text="We'll never share your email."
            class="w-full"
          />
        </ComponentGridCell>

        <ComponentGridCell name="FieldPassword">
          <FieldPassword
            v-model="fieldPasswordValue"
            label="Password"
            placeholder="Enter your password"
            helper-text="At least 8 characters."
            class="w-full"
          />
        </ComponentGridCell>

        <ComponentGridCell name="FieldTextarea">
          <FieldTextarea
            v-model="fieldTextareaValue"
            label="Message"
            placeholder="Write your message"
            helper-text="Up to 500 characters."
            class="w-full"
          />
        </ComponentGridCell>

        <ComponentGridCell name="FieldSelect">
          <FieldSelect
            v-model="fieldSelectValue"
            label="Region"
            placeholder="Choose a region"
            helper-text="Choose the closest region for lowest latency."
            :options="fieldSelectOptions"
            class="w-full"
          />
        </ComponentGridCell>

        <ComponentGridCell name="FieldPhoneNumber">
          <FieldPhoneNumber
            v-model="fieldPhoneValue"
            v-model:country="fieldPhoneCountry"
            label="Phone"
            helper-text="We'll send the verification code here."
            class="w-full"
          />
        </ComponentGridCell>

        <ComponentGridCell name="FieldInputGroup">
          <FieldInputGroup
            v-model="fieldInputGroupValue"
            label="Website"
            placeholder="mysite"
            helper-text="Enter the domain without the scheme."
            class="w-full"
          >
            <template #left>https://</template>
            <template #right>.com</template>
          </FieldInputGroup>
        </ComponentGridCell>

        <ComponentGridCell name="FieldTextSwitch">
          <FieldTextSwitch
            v-model="fieldTextSwitchValue"
            v-model:enabled="fieldTextSwitchEnabled"
            label="Custom domain"
            placeholder="mysite.com"
            helper-text="Only used while enabled."
            class="w-full"
          />
        </ComponentGridCell>

        <ComponentGridCell name="FieldCheckbox">
          <FieldCheckbox
            v-model="fieldCheckboxValue"
            label="Checkbox label"
            description="Checkbox description"
          />
        </ComponentGridCell>

        <ComponentGridCell name="FieldCheckboxBlock">
          <FieldCheckboxBlock
            v-model="fieldCheckboxBlockValue"
            label="Enable feature"
            description="Turns this feature on for your project."
            class="w-full"
          />
        </ComponentGridCell>

        <ComponentGridCell name="FieldRadio">
          <FieldRadio
            v-model="fieldRadioValue"
            name="grid-field-radio"
            value="option1"
            label="Radio label"
            description="Radio description"
          />
        </ComponentGridCell>

        <ComponentGridCell name="FieldRadioBlock">
          <FieldRadioBlock
            v-model="fieldRadioBlockValue"
            name="grid-plan"
            value="plan-a"
            label="Standard plan"
            description="Up to 5 projects and 10 GB storage."
            class="w-full"
          />
        </ComponentGridCell>

        <ComponentGridCell name="FieldSwitch">
          <FieldSwitch
            v-model="fieldSwitchValue"
            label="Switch label"
            description="Switch description"
          />
        </ComponentGridCell>

        <ComponentGridCell name="FieldSwitchBlock">
          <FieldSwitchBlock
            v-model="fieldSwitchBlockValue"
            label="Switch label"
            description="Switch description"
            class="w-full"
          />
        </ComponentGridCell>
      </div>
    </section>

    <!-- ── Content ──────────────────────────────────────────────────────── -->
    <section
      v-if="showCategory('content')"
      class="flex flex-col gap-(--spacing-sm)"
    >
      <div
        v-if="!category"
        class="flex items-baseline justify-between gap-(--spacing-sm) px-(--spacing-xxs)"
      >
        <h3 class="text-overline-sm uppercase tracking-widest text-(--text-muted)">Content</h3>
        <span class="text-body-xs text-(--text-muted)">Identity, status &amp; display</span>
      </div>
      <div class="grid w-full grid-cols-2 gap-0 md:grid-cols-4">
        <ComponentGridCell name="Avatar">
          <Avatar
            label="AB"
            kind="circle"
            size="large"
          />
        </ComponentGridCell>

        <ComponentGridCell name="Badge">
          <Badge
            label="99"
            severity="danger"
            size="medium"
          />
        </ComponentGridCell>

        <ComponentGridCell name="Brand">
          <Brand kind="default" />
        </ComponentGridCell>

        <ComponentGridCell name="Currency">
          <Currency
            value="20"
            prefix="$"
            suffix="per month"
            size="medium"
          />
        </ComponentGridCell>

        <ComponentGridCell name="Overline">
          <Overline prefix="//">OVERLINE TEXT</Overline>
        </ComponentGridCell>

        <ComponentGridCell name="Tag">
          <div class="flex flex-col items-center gap-(--spacing-xs)">
            <Tag
              label="Production"
              severity="success"
              size="medium"
              icon="pi pi-check"
              rounded
            />
            <Tag
              label="Beta"
              severity="info"
              size="medium"
            />
            <Tag
              label="Failed"
              severity="danger"
              size="medium"
            />
          </div>
        </ComponentGridCell>

        <ComponentGridCell name="Accordion">
          <Accordion
            type="single"
            collapsible
            default-value="overview"
            size="large"
            class="w-full"
          >
            <Accordion.Item value="overview">
              <Accordion.Trigger>What is Azion?</Accordion.Trigger>
              <Accordion.Content
                >Azion runs your code at the edge, close to users.</Accordion.Content
              >
            </Accordion.Item>
            <Accordion.Item value="pricing">
              <Accordion.Trigger>How does pricing work?</Accordion.Trigger>
              <Accordion.Content
                >Pay only for what you use, with no upfront cost.</Accordion.Content
              >
            </Accordion.Item>
          </Accordion>
        </ComponentGridCell>

        <ComponentGridCell name="CardBox">
          <CardBox
            title="Card Title"
            class="w-full"
          >
            <template #content>
              <p class="text-body-sm text-(--text-muted)">
                Card body content. Place forms, tables, or any markup in the content slot.
              </p>
            </template>
          </CardBox>
        </ComponentGridCell>

        <ComponentGridCell name="Item">
          <Item
            kind="outline"
            class="w-full"
          >
            <Item.Media kind="icon">
              <i
                class="ai ai-edge-firewall"
                aria-hidden="true"
              />
            </Item.Media>
            <Item.Content>
              <Item.Title>Security Alert</Item.Title>
              <Item.Description>New login detected from unknown device.</Item.Description>
            </Item.Content>
            <Item.Actions>
              <Button
                label="Review"
                kind="outlined"
                size="large"
              />
            </Item.Actions>
          </Item>
        </ComponentGridCell>

        <ComponentGridCell name="AzionLogo">
          <AzionLogo class="h-8 w-auto text-(--text-default)" />
        </ComponentGridCell>

        <ComponentGridCell name="Kbd">
          <div class="flex items-center gap-(--spacing-xs)">
            <Kbd meta>K</Kbd>
            <Kbd
              shift
              size="small"
              >Enter</Kbd
            >
            <Kbd size="small">Esc</Kbd>
          </div>
        </ComponentGridCell>

        <ComponentGridCell
          name="HeroTitle"
          span="wide"
        >
          <HeroTitle
            eyebrow="Webkit"
            highlight="One design system."
            title="Every component, ready to compose."
            description="Tokens, accessibility and dark mode, built in."
          />
        </ComponentGridCell>

        <ComponentGridCell
          name="SectionTitle"
          span="wide"
        >
          <SectionTitle
            kind="left"
            eyebrow="Foundations"
            title="Built on tokens"
            description="Every value a component paints comes from the theme."
            class="w-full"
          />
        </ComponentGridCell>

        <ComponentGridCell name="CardPricing">
          <CardPricing
            plan-title="Pro"
            pricing-details="Billed annually or $25/mo billed monthly."
            slot-position="bottom"
            kind="contained"
            value="20"
            prefix="$"
            suffix="per month"
            action-label="Choose Pro"
            class="w-full max-w-[420px]"
          />
        </ComponentGridCell>
      </div>
    </section>

    <!-- ── Feedback ─────────────────────────────────────────────────────── -->
    <section
      v-if="showCategory('feedback')"
      class="flex flex-col gap-(--spacing-sm)"
    >
      <div
        v-if="!category"
        class="flex items-baseline justify-between gap-(--spacing-sm) px-(--spacing-xxs)"
      >
        <h3 class="text-overline-sm uppercase tracking-widest text-(--text-muted)">Feedback</h3>
        <span class="text-body-xs text-(--text-muted)">Messages &amp; progress</span>
      </div>
      <div class="grid w-full grid-cols-2 gap-0 md:grid-cols-4">
        <ComponentGridCell name="Skeleton">
          <Skeleton
            kind="shape"
            width="160px"
            height="80px"
            animated
          />
        </ComponentGridCell>

        <ComponentGridCell name="Spinner">
          <Spinner class="size-6 text-(--text-default)" />
        </ComponentGridCell>

        <ComponentGridCell name="StatusIndicator">
          <StatusIndicator
            severity="success"
            label="Status"
          />
        </ComponentGridCell>

        <ComponentGridCell name="Message">
          <Message
            severity="info"
            label="Deploy started. Your edge function is rolling out to every point of presence."
            action-label="View"
            class="w-full"
          />
        </ComponentGridCell>

        <ComponentGridCell name="ProgressBar">
          <div class="flex w-full flex-col gap-(--spacing-md)">
            <ProgressBar
              :value="68"
              size="large"
              shape="rounded"
            />
            <ProgressBar
              indeterminate
              size="large"
              shape="rounded"
            />
          </div>
        </ComponentGridCell>

        <ComponentGridCell name="Panel">
          <Panel
            size="large"
            class="w-full"
          >
            <PanelHeader>Panel title</PanelHeader>
            <PanelContent>Body content composed by the consumer.</PanelContent>
            <PanelFooter class="justify-end">
              <Button
                label="Save"
                kind="primary"
                size="large"
              />
            </PanelFooter>
          </Panel>
        </ComponentGridCell>

        <ComponentGridCell name="EmptyState">
          <EmptyState
            title="No resource yet"
            description="Get started by creating your first resource."
          >
            <template #actions>
              <div class="flex gap-(--spacing-sm)">
                <Button
                  kind="secondary"
                  label="Secondary"
                />
                <Button
                  kind="outlined"
                  label="Create Item"
                />
              </div>
              <MiniButton
                label="View Documentation"
                icon="pi pi-arrow-right"
                size="large"
                href="#"
              />
            </template>
          </EmptyState>
        </ComponentGridCell>
      </div>
    </section>

    <!-- ── Overlay ──────────────────────────────────────────────────────── -->
    <section
      v-if="showCategory('overlay')"
      class="flex flex-col gap-(--spacing-sm)"
    >
      <div
        v-if="!category"
        class="flex items-baseline justify-between gap-(--spacing-sm) px-(--spacing-xxs)"
      >
        <h3 class="text-overline-sm uppercase tracking-widest text-(--text-muted)">Overlay</h3>
        <span class="text-body-xs text-(--text-muted)">Layered, floating surfaces</span>
      </div>
      <div class="grid w-full grid-cols-2 gap-0 md:grid-cols-4">
        <ComponentGridCell name="Tooltip">
          <Tooltip
            text="This is a Tooltip"
            placement="top"
          >
            <Button
              label="Hover me"
              kind="outlined"
              size="large"
            />
          </Tooltip>
        </ComponentGridCell>

        <ComponentGridCell name="Dialog">
          <Dialog
            v-model:open="dialogOpen"
            dismissible
            size="large"
          >
            <DialogTrigger>
              <Button
                label="Open dialog"
                kind="primary"
              />
            </DialogTrigger>
            <DialogPortal>
              <DialogOverlay />
              <DialogContent>
                <PanelHeader class="w-full">
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogClose />
                </PanelHeader>
                <PanelContent>
                  <DialogDescription>
                    Modal content. Uses the shared Panel header, body, and footer regions.
                  </DialogDescription>
                </PanelContent>
                <PanelFooter class="flex-col md:flex-row md:justify-end">
                  <Button
                    class="w-full md:w-auto"
                    label="Cancel"
                    kind="outlined"
                    @click="dialogOpen = false"
                  />
                  <Button
                    class="w-full md:w-auto"
                    label="Save"
                    kind="primary"
                  />
                </PanelFooter>
              </DialogContent>
            </DialogPortal>
          </Dialog>
        </ComponentGridCell>

        <ComponentGridCell name="Drawer">
          <Drawer
            v-model:open="drawerOpen"
            dismissible
            side="right"
            size="large"
          >
            <DrawerTrigger>
              <Button
                label="Open drawer"
                kind="primary"
              />
            </DrawerTrigger>
            <DrawerPortal>
              <DrawerOverlay />
              <DrawerContent>
                <PanelHeader class="w-full">
                  <DrawerTitle>Drawer Title</DrawerTitle>
                  <DrawerClose />
                </PanelHeader>
                <PanelContent>
                  <DrawerDescription>
                    Side panel content. Uses the same Panel regions as Dialog.
                  </DrawerDescription>
                </PanelContent>
                <PanelFooter class="flex-col md:flex-row md:justify-end">
                  <Button
                    class="w-full md:w-auto"
                    label="Cancel"
                    kind="outlined"
                    @click="drawerOpen = false"
                  />
                  <Button
                    class="w-full md:w-auto"
                    label="Save"
                    kind="primary"
                  />
                </PanelFooter>
              </DrawerContent>
            </DrawerPortal>
          </Drawer>
        </ComponentGridCell>

        <ComponentGridCell name="Popover">
          <Popover>
            <PopoverTrigger>
              <Button
                kind="secondary"
                label="Open popover"
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle>Popover title</PopoverTitle>
                <PopoverClose />
              </PopoverHeader>
              <div class="p-(--spacing-md) text-body-sm text-(--text-default)">
                This content is rendered inside the popover panel.
              </div>
            </PopoverContent>
          </Popover>
        </ComponentGridCell>

        <ComponentGridCell name="Dropdown">
          <Dropdown>
            <Dropdown.Trigger>
              <Button
                label="Actions"
                kind="outlined"
                size="large"
              />
            </Dropdown.Trigger>
            <Dropdown.Group>
              <Dropdown.Option
                value="rename"
                label="Rename"
              />
              <Dropdown.Option
                value="duplicate"
                label="Duplicate"
              />
            </Dropdown.Group>
            <Dropdown.Group>
              <Dropdown.Option
                value="delete"
                label="Delete"
              />
            </Dropdown.Group>
          </Dropdown>
        </ComponentGridCell>

        <ComponentGridCell name="Toast">
          <div class="flex flex-col items-center">
            <Toaster position="bottom-right" />
            <Button
              label="Show toast"
              @click="showToast"
            />
          </div>
        </ComponentGridCell>

        <ComponentGridCell
          name="CommandMenu"
          span="wide"
        >
          <div class="flex w-full flex-col items-center gap-(--spacing-sm)">
            <Button
              label="Open command palette"
              kind="outlined"
              icon="pi pi-search"
              @click="commandMenuOpen = true"
            />
            <span
              class="inline-flex items-center gap-(--spacing-xxs) text-body-xs text-(--text-muted)"
            >
              or press
              <Kbd
                meta
                size="small"
                >K</Kbd
              >
            </span>
            <CommandMenu
              v-model:open="commandMenuOpen"
              aria-label="Command palette"
            >
              <CommandMenu.Input placeholder="Search commands…" />
              <CommandMenu.List>
                <CommandMenu.Group heading="Suggestions">
                  <CommandMenu.Item value="deploy">Deploy Project</CommandMenu.Item>
                  <CommandMenu.Item value="new-app">Create application</CommandMenu.Item>
                  <CommandMenu.Item value="settings">Go to Settings</CommandMenu.Item>
                </CommandMenu.Group>
                <CommandMenu.Separator />
                <CommandMenu.Group heading="Commands">
                  <CommandMenu.Item
                    value="search"
                    shortcut="meta+k"
                    >Search Everything</CommandMenu.Item
                  >
                  <CommandMenu.Item
                    value="toggle-theme"
                    shortcut="meta+shift+l"
                    >Toggle Theme</CommandMenu.Item
                  >
                </CommandMenu.Group>
                <CommandMenu.Empty>No matching command.</CommandMenu.Empty>
              </CommandMenu.List>
            </CommandMenu>
          </div>
        </ComponentGridCell>
      </div>
    </section>

    <!-- ── Navigation ───────────────────────────────────────────────────── -->
    <section
      v-if="showCategory('navigation')"
      class="flex flex-col gap-(--spacing-sm)"
    >
      <div
        v-if="!category"
        class="flex items-baseline justify-between gap-(--spacing-sm) px-(--spacing-xxs)"
      >
        <h3 class="text-overline-sm uppercase tracking-widest text-(--text-muted)">Navigation</h3>
        <span class="text-body-xs text-(--text-muted)">Wayfinding, menus &amp; shells</span>
      </div>
      <div class="grid w-full grid-cols-2 gap-0 md:grid-cols-4">
        <ComponentGridCell name="Link">
          <Link
            label="Learn More"
            size="large"
            href="#"
          />
        </ComponentGridCell>

        <ComponentGridCell name="MenuItem">
          <ul class="m-0 w-[220px] list-none p-0">
            <MenuItem
              kind="option"
              label="Option 1"
              icon="pi pi-home"
            />
            <MenuItem
              kind="option"
              label="Option 2"
              icon="pi pi-cog"
            />
          </ul>
        </ComponentGridCell>

        <ComponentGridCell name="Breadcrumb">
          <Breadcrumb :items="crumbs" />
        </ComponentGridCell>

        <ComponentGridCell name="TabView">
          <TabView
            v-model:value="tabValue"
            class="w-full"
          >
            <TabView.List>
              <TabView.Item
                value="overview"
                label="Overview"
              />
              <TabView.Item
                value="metrics"
                label="Metrics"
              />
            </TabView.List>
            <TabView.Content class="mt-(--spacing-sm)">
              <TabView.Panel value="overview">
                <p class="text-body-sm text-(--text-muted)">Overview content.</p>
              </TabView.Panel>
              <TabView.Panel value="metrics">
                <p class="text-body-sm text-(--text-muted)">Metrics content.</p>
              </TabView.Panel>
            </TabView.Content>
          </TabView>
        </ComponentGridCell>

        <ComponentGridCell
          name="NavigationMenu"
          span="full"
        >
          <NavigationMenu
            aria-label="Sections"
            class="flex w-full items-center gap-(--spacing-sm)"
          >
            <NavigationMenu.List>
              <NavigationMenu.Item value="solutions">
                <NavigationMenu.Trigger>Solutions</NavigationMenu.Trigger>
                <NavigationMenu.Content class="w-full p-0">
                  <NavigationMenu.List label="By use case">
                    <NavigationMenu.Item
                      layout="entry"
                      href="#"
                      description="Accelerate development"
                      close-on-click
                    >
                      Development
                    </NavigationMenu.Item>
                  </NavigationMenu.List>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Trigger href="#">Pricing</NavigationMenu.Trigger>
              </NavigationMenu.Item>
            </NavigationMenu.List>
            <NavigationMenu.Portal>
              <NavigationMenu.Positioner
                side="bottom"
                align="start"
                :side-offset="12"
              >
                <NavigationMenu.Popup>
                  <NavigationMenu.Arrow />
                  <NavigationMenu.Viewport />
                </NavigationMenu.Popup>
              </NavigationMenu.Positioner>
            </NavigationMenu.Portal>
          </NavigationMenu>
        </ComponentGridCell>

        <ComponentGridCell name="BreadcrumbItem">
          <div class="flex items-center gap-(--spacing-xs)">
            <BreadcrumbItem
              label="Workloads"
              href="#"
            />
            <BreadcrumbItem
              label="Current Page"
              current
            />
          </div>
        </ComponentGridCell>

        <ComponentGridCell
          name="Menu"
          span="wide"
        >
          <!-- The drill-down stack: activating `Settings` pushes its level in place,
               moves focus to the Back row, and takes the level that is not current out
               of the tab order. The host clips with `overflow-clip`, NOT `overflow-hidden`:
               the leaving level is absolutely positioned outside the box, so a hidden host
               becomes a scroll container and the browser scrolls it to reveal the newly
               focused row — shifting the whole menu sideways. `clip` never scrolls. -->
          <div class="w-full max-w-[264px] overflow-clip">
            <Menu aria-label="Console navigation">
              <Menu.Back />
              <Menu.Group label="Account">
                <Menu.Item
                  label="Overview"
                  icon="pi pi-home"
                  href="#"
                  selected
                />
                <Menu.Sub>
                  <Menu.SubTrigger
                    label="Settings"
                    kind="drill"
                  />
                  <Menu.SubContent>
                    <Menu.Item
                      label="General"
                      icon=""
                      href="#"
                    />
                    <Menu.Item
                      label="Members"
                      icon=""
                      href="#"
                    />
                    <Menu.Item
                      label="Billing"
                      icon=""
                      href="#"
                    />
                  </Menu.SubContent>
                </Menu.Sub>
              </Menu.Group>
            </Menu>
          </div>
        </ComponentGridCell>
      </div>
    </section>

    <!-- ── Layout ───────────────────────────────────────────────────────── -->
    <section
      v-if="showCategory('layout')"
      class="flex flex-col gap-(--spacing-sm)"
    >
      <div
        v-if="!category"
        class="flex items-baseline justify-between gap-(--spacing-sm) px-(--spacing-xxs)"
      >
        <h3 class="text-overline-sm uppercase tracking-widest text-(--text-muted)">Layout</h3>
        <span class="text-body-xs text-(--text-muted)">Structure, frames &amp; shells</span>
      </div>
      <div class="grid w-full grid-cols-2 gap-0 md:grid-cols-4">
        <ComponentGridCell name="Divider">
          <Divider
            orientation="horizontal"
            label="OR"
            class="w-full"
          />
        </ComponentGridCell>

        <ComponentGridCell name="SectionGap">
          <div class="w-full">
            <FrameBox borders="y">
              <div class="p-(--spacing-sm) text-center text-body-xs text-(--text-muted)">
                Section above
              </div>
            </FrameBox>
            <SectionGap size="medium" />
            <FrameBox
              flush
              marks="bottom"
              borders="y"
            >
              <div class="p-(--spacing-sm) text-center text-body-xs text-(--text-muted)">
                Section below
              </div>
            </FrameBox>
          </div>
        </ComponentGridCell>

        <ComponentGridCell name="FrameBox">
          <FrameBox class="w-full">
            <div class="p-(--spacing-md) text-center text-body-sm text-(--text-muted)">
              Framed content
            </div>
          </FrameBox>
        </ComponentGridCell>

        <ComponentGridCell name="ScrollArea">
          <ScrollArea
            orientation="vertical"
            aria-label="Scrollable content"
            class="h-[180px] w-full rounded-(--shape-elements) border border-(--border-default) p-(--spacing-md) text-body-sm text-(--text-default)"
          >
            <div class="h-[420px]">
              Long content that scrolls vertically inside the area — add enough content to exceed
              the fixed height so the custom scrollbar appears.
            </div>
          </ScrollArea>
        </ComponentGridCell>

        <ComponentGridCell name="Sidebar">
          <Sidebar
            aria-label="Application"
            class="h-[280px] w-full"
          >
            <SidebarGroup>
              <MenuItem
                label="Home"
                icon="pi pi-home"
                href="#"
                selected
              />
              <MenuItem
                label="Marketplace"
                icon="pi pi-shopping-cart"
                href="#"
              />
            </SidebarGroup>
            <SidebarGroup label="Build">
              <MenuItem
                label="Applications"
                icon="pi pi-th-large"
                href="#"
              />
              <MenuItem
                label="Variables"
                icon="pi pi-sliders-h"
                href="#"
              />
            </SidebarGroup>
          </Sidebar>
        </ComponentGridCell>

        <ComponentGridCell
          name="ResizablePanel"
          span="wide"
        >
          <!-- Drag the divider, or focus it and use the arrow keys. The left pane is
               flexible (no basis), so it absorbs whatever the sized pane leaves. -->
          <ResizablePanel
            orientation="horizontal"
            aria-label="Workspace"
            class="h-[180px] w-full rounded-(--shape-elements) border border-(--border-default)"
          >
            <ResizablePanel.Pane
              aria-label="Document"
              class="p-(--spacing-sm) text-body-xs text-(--text-muted)"
            >
              Flexible
            </ResizablePanel.Pane>
            <ResizablePanel.Handle aria-label="Resize the panel" />
            <ResizablePanel.Pane
              v-model:basis="panelBasis"
              :min="96"
              :max="320"
              aria-label="Panel"
              class="p-(--spacing-sm) text-body-xs text-(--text-muted)"
            >
              Sized
            </ResizablePanel.Pane>
          </ResizablePanel>
        </ComponentGridCell>

        <ComponentGridCell
          name="GlobalHeader"
          span="full"
        >
          <GlobalHeader
            aria-label="Global header"
            class="w-full"
          >
            <GlobalHeader.Left>
              <GlobalHeader.Brand>
                <a
                  href="#"
                  aria-label="Azion home"
                >
                  <AzionLogo />
                </a>
              </GlobalHeader.Brand>
            </GlobalHeader.Left>
            <GlobalHeader.Middle />
            <GlobalHeader.Right />
          </GlobalHeader>
        </ComponentGridCell>

        <ComponentGridCell
          name="Footer"
          span="full"
        >
          <Footer
            aria-label="Footer"
            class="w-full"
          >
            <Footer.Column title="Products">
              <Footer.Link href="#">Applications</Footer.Link>
              <Footer.Link href="#">Workloads</Footer.Link>
            </Footer.Column>
            <Footer.Column title="Developers">
              <Footer.Link href="#">Documentation</Footer.Link>
              <Footer.Link href="#">Marketplace</Footer.Link>
            </Footer.Column>
            <Footer.Column title="Company">
              <Footer.Link href="#">About</Footer.Link>
              <Footer.Link href="#">Careers</Footer.Link>
            </Footer.Column>
            <Footer.Column title="Support">
              <Footer.Link href="#">Help Center</Footer.Link>
              <Footer.Link href="#">Status</Footer.Link>
            </Footer.Column>
            <template #status>
              <StatusIndicator
                severity="success"
                label="All systems operational"
              />
            </template>
            <template #brand>
              <Brand size="large" />
            </template>
            <template #tagline>The web platform for modern workloads</template>
          </Footer>
        </ComponentGridCell>
      </div>
    </section>

    <!-- ── Data ─────────────────────────────────────────────────────────── -->
    <section
      v-if="showCategory('data')"
      class="flex flex-col gap-(--spacing-sm)"
    >
      <div
        v-if="!category"
        class="flex items-baseline justify-between gap-(--spacing-sm) px-(--spacing-xxs)"
      >
        <h3 class="text-overline-sm uppercase tracking-widest text-(--text-muted)">Data</h3>
        <span class="text-body-xs text-(--text-muted)">Tables &amp; display</span>
      </div>
      <div class="grid w-full grid-cols-2 gap-0 md:grid-cols-4">
        <ComponentGridCell name="PaginationButton">
          <PaginationButton
            kind="number"
            selected
          >
            1
          </PaginationButton>
        </ComponentGridCell>

        <ComponentGridCell name="Flow">
          <Flow align="center">
            <Flow.Node>Source</Flow.Node>
            <Flow.Node>Transform</Flow.Node>
            <Flow.Node>Deliver</Flow.Node>
          </Flow>
        </ComponentGridCell>

        <ComponentGridCell
          name="Paginator"
          span="full"
        >
          <Paginator class="w-full">
            <template #info>
              <Paginator.Info>Showing 1 to 10 of 20 entries</Paginator.Info>
            </template>
            <Paginator.Button
              kind="previous"
              disabled
            >
              Previous
            </Paginator.Button>
            <Paginator.Button
              kind="number"
              selected
            >
              1
            </Paginator.Button>
            <Paginator.Button kind="number">2</Paginator.Button>
            <Paginator.Button kind="number">3</Paginator.Button>
            <Paginator.Button kind="more" />
            <Paginator.Button kind="next">Next</Paginator.Button>
            <template #controls>
              <Paginator.PageSize
                :model-value="10"
                :options="[10, 25, 50, 100]"
              />
            </template>
          </Paginator>
        </ComponentGridCell>

        <ComponentGridCell
          name="Table"
          span="full"
        >
          <Table
            border
            class="w-full"
          >
            <Table.Header>
              <Table.Row>
                <Table.HeadCell principal>Name</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Last Editor</Table.HeadCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row
                v-for="item in tableItems"
                :key="item.id"
              >
                <Table.Cell principal>
                  <span class="min-w-0 flex-1 truncate">{{ item.name }}</span>
                </Table.Cell>
                <Table.Cell>
                  <span class="min-w-0 flex-1 truncate">{{ item.status }}</span>
                </Table.Cell>
                <Table.Cell>
                  <span class="min-w-0 flex-1 truncate">{{ item.editor }}</span>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </ComponentGridCell>

        <ComponentGridCell
          name="PickList"
          span="full"
        >
          <PickList
            v-model="pickListModel"
            data-key="id"
            class="w-full"
          >
            <PickList.Source title="Available">
              <template #item="{ item }">{{ item.label }}</template>
            </PickList.Source>
            <PickList.Controls />
            <PickList.Target title="Selected">
              <template #item="{ item }">{{ item.label }}</template>
            </PickList.Target>
          </PickList>
        </ComponentGridCell>
      </div>
    </section>

    <!-- ── Code ─────────────────────────────────────────────────────────── -->
    <section
      v-if="showCategory('code')"
      class="flex flex-col gap-(--spacing-sm)"
    >
      <div
        v-if="!category"
        class="flex items-baseline justify-between gap-(--spacing-sm) px-(--spacing-xxs)"
      >
        <h3 class="text-overline-sm uppercase tracking-widest text-(--text-muted)">Code</h3>
        <span class="text-body-xs text-(--text-muted)">Source &amp; log surfaces</span>
      </div>
      <div class="grid w-full grid-cols-2 gap-0 md:grid-cols-4">
        <ComponentGridCell
          name="CodeBlock"
          span="full"
        >
          <CodeBlock
            :tabs="codeTabs"
            default-value="main"
            :show-line-numbers="false"
            class="w-full"
          />
        </ComponentGridCell>

        <ComponentGridCell
          name="LogView"
          span="full"
        >
          <LogView
            v-model:search="logSearch"
            v-model:warnings-only="logWarningsOnly"
            :lines="logLines"
            class="h-[360px] w-full"
          >
            <LogViewHeader />
            <LogViewContent />
          </LogView>
        </ComponentGridCell>
      </div>
    </section>
  </div>
</template>
