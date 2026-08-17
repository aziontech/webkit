<script setup>
  // The blast radius of the release being composed: which Deployment settings it lands on,
  // through which environments, onto which workloads, and how many domains those workloads
  // answer for.
  //
  // This panel exists because a Deployment setting is REUSABLE. "Deploy" here is never one
  // destination — it is every environment and workload that deploys with the selected
  // settings, and the reader cannot consent to that without seeing it. So the panel is not
  // decoration: it is the thing that makes the deploy button honest.
  //
  // TWO VIEWS OF THE SAME TREE, because the two questions it answers are different:
  //
  //   Tree   how deep does this go, and what is under what. A dense, scannable list; the
  //          hierarchy is drawn by the connector RAIL (borders only), the same anatomy the
  //          Menu component uses for a nested navigation tree (.specs/menu.md): one indent
  //          step per level, an elbow from the parent's column to the child's row edge, and
  //          a continuation line for every child that is not the last. Nothing else marks
  //          the structure — no bullets, no boxes, no per-level type sizes.
  //   Nodes  how does it CONNECT. One Flow diagram per setting, with real connectors from
  //          the setting to each environment it publishes into. Wide, so it scrolls inside
  //          its own container rather than widening the page.
  //
  // FOUR STATES, in order, and each one is real:
  //
  //   nothing selected  there is no radius to compute yet
  //   loading           the workload bindings are still being read
  //   unavailable       the lookup failed or is partial. The deploy is still allowed —
  //                     blocking a deploy because a preview failed would be worse — so the
  //                     panel says exactly what is unknown and offers Retry
  //   ready             the tree, or the diagram. The one-sentence total is the card's
  //                     footer, not part of either view
  import Button from '@aziontech/webkit/button'
  import Flow from '@aziontech/webkit/flow'
  import FlowAnchor from '@aziontech/webkit/flow-anchor'
  import Message from '@aziontech/webkit/message'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Spinner from '@aziontech/webkit/spinner'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  const props = defineProps({
    // 'empty' | 'loading' | 'unavailable' | 'ready'
    state: { type: String, default: 'empty' },
    // `[{ id, name, domainsCount, environments: [{ id, name, workloadsCount, workloads:
    //    [{ id, name, domainsCount }] }] }]`
    tree: { type: Array, default: () => [] },
    // Why the impact is unavailable: 'fetch_failed' | 'partial'
    reason: { type: String, default: '' },
    // How many targets are selected, for the unavailable state's footer.
    settingsCount: { type: Number, default: 0 }
  })

  const emit = defineEmits(['retry'])

  // Which view is rendered: 'tree' | 'nodes'. Owned by the PARENT so the switch can sit in
  // the card's header, where a view switch belongs, instead of inside the content it
  // switches.
  const view = defineModel('view', { type: String, default: 'tree' })

  const unavailableMessage = computed(() => {
    if (props.reason === 'partial') {
      return 'The workloads list was truncated, so these numbers may be incomplete. You can still deploy.'
    }
    return 'The workloads that deploy with these settings could not be read, so the impact is unknown. Retry, or deploy without the preview.'
  })

  const plural = (count, singular, pluralWord) => `${count} ${count === 1 ? singular : pluralWord}`
</script>

<template>
  <!-- One indent step and one rail column for the whole tree, held in two custom properties
       so the elbow can never come unstuck from the rows it connects. Both tokens are fixed
       at every breakpoint (unlike --spacing-lg / --spacing-xl, which would drift the elbow
       as the viewport grows). -->
  <div
    class="flex min-w-0 flex-col gap-[var(--spacing-sm)]"
    style="--tree-rail: var(--spacing-sm); --tree-indent: calc(var(--spacing-sm) * 2)"
  >
    <!-- NOTHING SELECTED -->
    <p
      v-if="state === 'empty'"
      class="text-body-sm text-[var(--text-muted)]"
    >
      Select Deployment settings to see what this release reaches.
    </p>

    <!-- LOADING: the shape of the answer, so the panel does not jump when it arrives. -->
    <div
      v-else-if="state === 'loading'"
      class="flex min-w-0 flex-col gap-[var(--spacing-sm)]"
    >
      <span class="flex items-center gap-[var(--spacing-xs)]">
        <Spinner class="size-4 shrink-0 text-[var(--text-muted)]" />
        <span class="text-body-sm text-[var(--text-muted)]">Computing impact…</span>
      </span>
      <Skeleton height="var(--size-4)" />
      <Skeleton
        height="var(--size-4)"
        width="80%"
      />
      <Skeleton
        height="var(--size-4)"
        width="60%"
      />
    </div>

    <!-- UNAVAILABLE: what is unknown, that the deploy still works, and Retry. -->
    <div
      v-else-if="state === 'unavailable'"
      class="flex min-w-0 flex-col items-start gap-[var(--spacing-sm)]"
    >
      <Message
        severity="warning"
        size="small"
        :label="unavailableMessage"
      />
      <span class="text-body-xs text-[var(--text-muted)]">
        {{ plural(settingsCount, 'Deployment setting', 'Deployment settings') }} selected
      </span>
      <Button
        label="Retry"
        kind="outlined"
        size="small"
        icon="pi pi-refresh"
        @click="emit('retry')"
      />
    </div>

    <!-- READY -->
    <template v-else>
      <Message
        v-if="reason === 'partial'"
        severity="warning"
        size="small"
        label="The workloads list was truncated, so these numbers may be incomplete."
      />

      <!-- ── TREE ────────────────────────────────────────────────────────────
           The rail is the only thing that says what is under what: an elbow on each
           row's ::before running from the parent's column to this row's left edge, and
           a continuation on its ::after for every row that is not the last. The elbow
           is half a row tall so its horizontal leg meets the row's centre line, and it
           stops at the row's box edge — never over the row itself, where it would be
           painted under a hover surface and read as a glitch. -->
      <ul
        v-if="view === 'tree'"
        class="m-0 flex min-w-0 list-none flex-col p-0"
      >
        <li
          v-for="settings in tree"
          :key="settings.id"
          class="flex min-w-0 flex-col"
        >
          <!-- Depth 0: the deploy target. -->
          <span
            class="flex min-h-8 min-w-0 items-center justify-between gap-[var(--spacing-xs)] pr-[var(--spacing-xxs)]"
          >
            <span class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
              <i
                class="ai ai-deploy-pillar shrink-0 text-[var(--text-muted)]"
                aria-hidden="true"
              />
              <span class="truncate text-label-md text-[var(--text-default)]">
                {{ settings.name }}
              </span>
            </span>
            <span class="shrink-0 text-body-xs tabular-nums text-[var(--text-muted)]">
              {{ plural(settings.domainsCount, 'domain', 'domains') }}
            </span>
          </span>

          <!-- A target nothing deploys with yet: the release is still created, it just
               serves nothing until a workload uses that setting. Said, not left blank. -->
          <p
            v-if="!settings.environments.length"
            class="pl-[var(--tree-indent)] text-body-xs text-[var(--text-muted)]"
          >
            No workloads deploy with this setting yet.
          </p>

          <ul
            v-else
            class="m-0 flex min-w-0 list-none flex-col p-0 pl-[var(--tree-indent)]"
          >
            <li
              v-for="environment in settings.environments"
              :key="environment.id"
              class="relative flex min-w-0 flex-col before:absolute before:top-0 before:-left-[var(--tree-rail)] before:h-4 before:w-[var(--tree-rail)] before:rounded-bl-[var(--shape-elements)] before:border-b before:border-l before:border-[var(--border-default)] before:content-[''] after:absolute after:top-4 after:bottom-0 after:-left-[var(--tree-rail)] after:border-l after:border-[var(--border-default)] after:content-[''] last:after:hidden"
            >
              <!-- Depth 1: the environment. -->
              <span
                class="flex min-h-8 min-w-0 items-center justify-between gap-[var(--spacing-xs)] pr-[var(--spacing-xxs)]"
              >
                <span class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                  <i
                    class="pi pi-sitemap shrink-0 text-[var(--text-muted)]"
                    aria-hidden="true"
                  />
                  <span class="truncate text-label-md text-[var(--text-default)]">
                    {{ environment.name }}
                  </span>
                </span>
                <span class="shrink-0 text-body-xs tabular-nums text-[var(--text-muted)]">
                  {{ plural(environment.workloadsCount, 'workload', 'workloads') }}
                </span>
              </span>

              <ul class="m-0 flex min-w-0 list-none flex-col p-0 pl-[var(--tree-indent)]">
                <li
                  v-for="workload in environment.workloads"
                  :key="workload.id"
                  class="relative flex min-w-0 before:absolute before:top-0 before:-left-[var(--tree-rail)] before:h-4 before:w-[var(--tree-rail)] before:rounded-bl-[var(--shape-elements)] before:border-b before:border-l before:border-[var(--border-default)] before:content-[''] after:absolute after:top-4 after:bottom-0 after:-left-[var(--tree-rail)] after:border-l after:border-[var(--border-default)] after:content-[''] last:after:hidden"
                >
                  <!-- Depth 2: the workloads that will serve it. -->
                  <span
                    class="flex min-h-8 min-w-0 flex-1 items-center justify-between gap-[var(--spacing-xs)] pr-[var(--spacing-xxs)]"
                  >
                    <span class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                      <i
                        class="ai ai-workloads shrink-0 text-[var(--text-muted)]"
                        aria-hidden="true"
                      />
                      <span class="truncate text-label-md text-[var(--text-muted)]">
                        {{ workload.name }}
                      </span>
                    </span>
                    <span class="shrink-0 text-body-xs tabular-nums text-[var(--text-muted)]">
                      {{ plural(workload.domainsCount, 'domain', 'domains') }}
                    </span>
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>

      <!-- ── NODES ───────────────────────────────────────────────────────────
           One diagram per setting: the setting, then a connector to each environment it
           publishes into, with that environment's workloads inside the node. Two steps,
           not three, and that is a correctness constraint rather than a simplification:
           Flow connects every branch of one step to every branch of the next, so putting
           workloads in a third step would draw every workload under every environment.
           Flow scrolls horizontally inside its own box, so a wide diagram never widens
           the page. -->
      <div
        v-else
        class="flex min-w-0 flex-col gap-[var(--spacing-md)]"
      >
        <Flow
          v-for="settings in tree"
          :key="settings.id"
          align="start"
          class="p-0"
        >
          <Flow.Node unstyled>
            <FlowAnchor>
              <span
                class="flex min-w-0 flex-col gap-[var(--spacing-xxs)] rounded-[var(--shape-card)] border border-[length:var(--border-width-default)] border-[var(--border-default)] bg-[var(--bg-surface-raised)] px-[var(--spacing-sm)] py-[var(--spacing-xs)]"
              >
                <span class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                  <i
                    class="ai ai-deploy-pillar shrink-0 text-[var(--text-muted)]"
                    aria-hidden="true"
                  />
                  <span class="truncate text-label-md text-[var(--text-default)]">
                    {{ settings.name }}
                  </span>
                </span>
                <span class="text-body-xs tabular-nums text-[var(--text-muted)]">
                  {{ plural(settings.domainsCount, 'domain', 'domains') }}
                </span>
              </span>
            </FlowAnchor>
          </Flow.Node>

          <!-- Nothing bound yet: the chain ends here, and the node says why rather than
               the diagram ending on a stub. -->
          <Flow.Node
            v-if="!settings.environments.length"
            terminal
            unstyled
          >
            <FlowAnchor>
              <span
                class="flex rounded-[var(--shape-card)] border border-[length:var(--border-width-default)] border-dashed border-[var(--border-muted)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-body-xs text-[var(--text-muted)]"
              >
                No workloads yet
              </span>
            </FlowAnchor>
          </Flow.Node>

          <Flow.Parallel
            v-else
            align="start"
          >
            <Flow.Node
              v-for="environment in settings.environments"
              :key="environment.id"
              terminal
              unstyled
            >
              <FlowAnchor>
                <span
                  class="flex min-w-0 max-w-[var(--container-3xs)] flex-col gap-[var(--spacing-xs)] rounded-[var(--shape-card)] border border-[length:var(--border-width-default)] border-[var(--border-default)] bg-[var(--bg-surface)] px-[var(--spacing-sm)] py-[var(--spacing-xs)]"
                >
                  <span class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                    <i
                      class="pi pi-sitemap shrink-0 text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                    <span class="truncate text-label-md text-[var(--text-default)]">
                      {{ environment.name }}
                    </span>
                    <Tag
                      :label="String(environment.workloadsCount)"
                      severity="secondary"
                      size="small"
                    />
                  </span>

                  <!-- Names only. The per-workload domain split is the TREE's job; here the
                       diagram is about what connects to what, and a diagram that has to
                       scroll to show a count is worse at both. The setting node already
                       carries the domain total. -->
                  <span class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                    <span
                      v-for="workload in environment.workloads"
                      :key="workload.id"
                      class="flex min-w-0 items-center gap-[var(--spacing-xs)]"
                    >
                      <i
                        class="ai ai-workloads shrink-0 text-[var(--text-muted)]"
                        aria-hidden="true"
                      />
                      <span class="truncate text-body-sm text-[var(--text-muted)]">
                        {{ workload.name }}
                      </span>
                    </span>
                  </span>
                </span>
              </FlowAnchor>
            </Flow.Node>
          </Flow.Parallel>
        </Flow>
      </div>

      <!-- The one-sentence total is NOT here: it belongs to the card's footer, which is the
           region a card already has for a total, and it reads the same whichever view drew
           the structure above it. See ../ReleaseComposer.vue § the Impact card. -->
    </template>
  </div>
</template>
