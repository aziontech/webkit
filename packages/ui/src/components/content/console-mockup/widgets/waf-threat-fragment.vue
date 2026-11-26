<script setup lang="ts">
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupScrollFrames } from '../composables/use-mockup-scroll-frames'
  import { openAndPick, option } from '../lib/pick-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupScrollColumn from '../parts/mockup-scroll-column.vue'
  import MockupSelect from '../parts/mockup-select.vue'
  import ModuleSwitchCard from '../parts/module-switch-card.vue'

  defineOptions({ name: 'WafThreatFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; SQL Injection's sensitivity is picked from its list and File Upload is switched on while it is, and back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const THREATS = [
    {
      key: 'sql-injection',
      title: 'SQL Injection',
      description:
        'Detect attempts to insert a SQL query via the input data from the client to the application.'
    },
    {
      key: 'remote-file-inclusion',
      title: 'Remote File Inclusions (RFI)',
      description:
        'Detect attempts to include a remote file, usually through a script on the web server.'
    },
    {
      key: 'directory-traversal',
      title: 'Directory Traversal',
      description:
        'Prevent exploiting insufficient security sanitizing of user-supplied input file names, so that characters representing "traverse to parent directory" are passed through to the file APIs.'
    },
    {
      key: 'cross-site-scripting',
      title: 'Cross-Site Scripting (XSS)',
      description: 'Prevents the injection of client-side scripts into pages viewed by visitors.'
    },
    {
      key: 'file-upload',
      title: 'File Upload',
      description: 'Detect attempts to upload files.'
    },
    {
      key: 'evading-tricks',
      title: 'Evading Tricks',
      description: 'Prevent the use of encoding tricks to evade protection mechanisms.'
    }
  ]

  const SENSITIVITIES = [
    'Sensitivity Highest',
    'Sensitivity High',
    'Sensitivity Medium',
    'Sensitivity Low',
    'Sensitivity Lowest'
  ]

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    focused: boolean
    open: boolean
    highlight: number
    raised: boolean
    anchor: number
    upload: boolean
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'sensitivity', x: 0.82, y: 2.4 }
  const TRIGGER: MockupCursorTarget = { key: 'sensitivity', x: 0.35, y: 0.6 }
  const SWITCH: MockupCursorTarget = { key: 'upload', x: 0.6, y: 0.6 }

  const REST = {
    cursor: IDLE,
    press: false,
    focused: false,
    open: false,
    highlight: -1,
    raised: false,
    anchor: 0,
    upload: false
  }

  const RAISED = { ...REST, raised: true }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    ...openAndPick(
      REST,
      TRIGGER,
      [
        [2, 160, 300],
        [1, 460, 420]
      ],
      { raised: true }
    ),
    { ...RAISED, cursor: option(1), focused: true, forward: 200, back: 260 },
    { ...RAISED, cursor: option(1), anchor: 2, forward: 360, back: 420 },
    { ...RAISED, cursor: option(1), anchor: 4, forward: 650, back: 420 },
    { ...RAISED, cursor: SWITCH, anchor: 4, forward: 520, back: 420 },
    { ...RAISED, cursor: SWITCH, anchor: 4, press: true, forward: 520, back: 120 },
    { ...RAISED, cursor: SWITCH, anchor: 4, press: true, upload: true, forward: 120, back: 160 },
    { ...RAISED, cursor: SWITCH, anchor: 4, upload: true, forward: 160, back: 120 }
  ]

  const { frame, bindColumn } = useMockupScrollFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered,
    stepOnTouch: true
  })

  const enabled = (key: string) => key !== 'file-upload' || frame.value.upload

  const sensitivity = (key: string) =>
    key === 'sql-injection' && frame.value.raised ? 'Sensitivity High' : 'Sensitivity Medium'

  const picking = (key: string) => key === 'sql-injection'
</script>

<template>
  <MockupScrollColumn
    :ref="bindColumn"
    shell="legacy"
    class="[--console-mockup-fade-edge:20%] [--console-mockup-fade-start:74%]"
    column-class="flex flex-col gap-(--spacing-sm)"
    :active="active"
    :anchor="frame.anchor || null"
    :lead="28"
    observe
    :cursor="frame.cursor"
    cursor-name="Alex"
    :pressed="frame.press"
  >
    <span class="text-label-md text-(--text-default)">Threat Type Configuration</span>

    <ConsoleMockupShellItem
      v-for="(threat, index) in THREATS"
      :key="threat.key"
      :order="Math.min(index, 3)"
      :data-state="picking(threat.key) && frame.open ? 'open' : 'closed'"
      class="relative data-[state=open]:z-1"
      data-anchor
    >
      <ModuleSwitchCard
        :title="threat.title"
        :description="threat.description"
        :checked="enabled(threat.key)"
        :cursor-key="threat.key === 'file-upload' ? 'upload' : undefined"
      >
        <span class="mt-(--spacing-xs) flex">
          <MockupSelect
            :value="sensitivity(threat.key)"
            :options="picking(threat.key) ? SENSITIVITIES : []"
            :open="picking(threat.key) && frame.open"
            :highlighted-index="picking(threat.key) ? frame.highlight : -1"
            :focused="picking(threat.key) && frame.focused"
            :data-cursor="picking(threat.key) ? 'sensitivity' : undefined"
            :aria-label="`${threat.title} sensitivity`"
          />
        </span>
      </ModuleSwitchCard>
    </ConsoleMockupShellItem>
  </MockupScrollColumn>
</template>
