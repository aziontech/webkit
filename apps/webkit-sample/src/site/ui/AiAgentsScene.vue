<script setup>
  // AiAgentsScene — "your agents build here": the five AI coding agents on the left, gathered
  // onto one spine, into Azion, and out as a running conversation.
  //
  // Hand-composed rather than a registered `<Illustration name="…">` asset, for two reasons.
  // The marks are other companies' brand logos, which the design system does not ship (see
  // AgentMark) — `IllustrationBox`/`Illustration` expose slots for exactly this. And the scene
  // is wider than the shared illustration canvas (170), which every registered asset is authored
  // against so the assets line up with each other in a grid; a composition that does not fit
  // belongs at the call site instead of bending the canvas for everyone.
  //
  // Everything else is webkit parts at their normal sizes — the same connectors, node, box and
  // window every other illustration on this site is drawn from — so it still reads as one family
  // with the three assets beside it.
  import Illustration from '@aziontech/webkit/illustration'
  import IllustrationBox from '@aziontech/webkit/illustration-box'
  import IllustrationConnector from '@aziontech/webkit/illustration-connector'
  import IllustrationNode from '@aziontech/webkit/illustration-node'
  import IllustrationWindow from '@aziontech/webkit/illustration-window'
  import AgentMark from '@shared/ui/brand/AgentMark.vue'

  // The column of agents, on a 26px pitch: a 20px mark plus 6px of air. Five of them span 124 of
  // the scene's 128, centred, which puts the middle agent on the centre line the spine, the hub
  // and the window all sit on.
  const AGENTS = ['claude', 'cursor', 'windsurf', 'codex', 'opencode']
  const PITCH = 26
  const TOP = 2
</script>

<template>
  <!-- The scene is 274 × 128: agents (20) + their run (24) + spine + hub (64) + link (14) +
       window (128). Height is the canvas height, so it sits at the same scale as its neighbours. -->
  <Illustration
    size="large"
    class="h-[var(--illustration-canvas-height)] w-[274px] max-w-full shrink-0"
  >
    <span class="relative block h-full w-full">
      <!-- The agents, bare marks in `mono` — they are nodes in a drawing here, not a logo row. -->
      <span
        v-for="(agent, index) in AGENTS"
        :key="agent"
        class="absolute left-0 flex size-5 items-center justify-center text-[var(--text-muted)]"
        :style="{ top: `${TOP + index * PITCH}px` }"
      >
        <AgentMark
          :name="agent"
          mono
          class="size-full"
        />
      </span>

      <!-- Each agent's own run to the spine… -->
      <IllustrationConnector
        v-for="(agent, index) in AGENTS"
        :key="`run-${agent}`"
        kind="dashed"
        class="absolute left-[24px]"
        :style="{
          top: `${TOP + index * PITCH + 8}px`,
          '--illustration-connector-length': '18px'
        }"
      />

      <!-- …the spine that gathers them, drawn once, top agent to bottom agent… -->
      <IllustrationConnector
        orientation="vertical"
        class="absolute left-[42px] top-[12px]"
        :style="{ '--illustration-connector-length': '104px' }"
      />

      <!-- …and the one lit hop out of it: the traffic that actually reaches Azion. -->
      <IllustrationNode
        active
        class="absolute left-[40px] top-[60px]"
      />
      <IllustrationConnector
        kind="dashed"
        active
        animated
        class="absolute left-[48px] top-[62px]"
        :style="{ '--illustration-connector-length': '20px' }"
      />

      <IllustrationBox
        size="medium"
        active
        icon="ai ai-azion"
        class="absolute left-[68px] top-1/2 -translate-y-1/2 text-[var(--primary)]"
      />

      <IllustrationConnector
        kind="dashed"
        active
        animated
        class="absolute left-[132px] top-[62px]"
        :style="{ '--illustration-connector-length': '14px' }"
      />

      <IllustrationWindow
        kind="chat"
        size="large"
        active
        class="absolute right-0 top-1/2 -translate-y-1/2"
      />
    </span>
  </Illustration>
</template>
