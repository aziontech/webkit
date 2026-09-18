<script setup>
  // DeploymentFooter — the Deployment Settings this workload publishes with, as the FOOTER
  // of its main card.
  //
  // ── WHY IT IS A FOOTER AND NOT A CARD ──
  //
  // It has been both. It started as an "Active Deployment" band at the top of the Overview,
  // then became a card of its own beside the topology. Neither placement was right, for the
  // same reason: a deployment setting is not a peer of the workload, it is part of how the
  // workload publishes — so a second card asked the reader to hold two objects where there
  // is one. The workload's card says what it IS (its address, its id, its domains, when it
  // was made); its footer says what it publishes with.
  //
  // So this component draws no box. Its parent (./WorkloadSummary.vue) owns the footer
  // region — the top rule, the recessed fill, the card's own bottom corners — and this
  // fills it.
  //
  // ── ONE ROW, NOT TWO ──
  //
  // It used to open with a "Deployment 1213268515 · Ready · 1 hour ago by …" line above the
  // settings disclosure. That line is the deployment REPORTED TWICE: the same record is the
  // subject of the Deployments tab one click away, and of its own page, both of which say
  // more about it than a summary line can. Worse, an environment with nothing deployed into
  // it yet left the word "Deployment" alone on a row with no facts after it. So the footer
  // is the disclosure and nothing else.
  //
  // ── WHAT A DEPLOYMENT SETTING IS ──
  //
  // The panel is the STRATEGY a deployment applies
  // (../../lib/data/deployment-strategies.js), the reusable half of Azion's own request:
  //
  //   POST /v4/workspace/workloads/{workload_id}/deployments
  //   { name, active, current, strategy: { type, attributes: { application, firewall, custom_page } } }
  //
  // `strategy` is an OBJECT there, not a list — which is why this takes one setting and not
  // an array. A deployment applies exactly one, so a release is 1:1 with a setting. What a
  // workload can have several of is ENVIRONMENTS, each with its own current deployment and
  // therefore its own setting; the card's environment picker is what moves between them.
  //
  // Not a second concept invented here. A setting is authored once in the Deployments
  // module's create drawer and applied by many deployments, and this reads that very store
  // through the projection the release composer reads (`deploymentSettings` in
  // ../../lib/data/releases.js). Create one in that drawer and it appears here; delete one
  // and it leaves. There is no fixture behind this file.
  import Accordion from '@aziontech/webkit/accordion'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  import { bindingPolicyLabel, versionPolicyLabel } from '../../lib/data/deployment-strategies'

  const props = defineProps({
    /**
     * The ONE setting it was published with — a projected `deploymentSettings` entry
     * (../../lib/data/releases.js), for the environment the card is reporting.
     */
    // NEVER EMPTY: every deployment applies a Deployment setting, falling back to Azion
    // Default when it binds nothing of its own (../../lib/data/releases.js). There is no
    // "deploys with nothing" state to render — and never two at once: `strategy` is an
    // object in the deployment request, so a release is 1:1 with a setting. A workload
    // holding several settings is a workload holding several ENVIRONMENTS, which the
    // card's own selector moves between.
    setting: { type: Object, default: null },
    /** Carried into the settings links so the demo keeps the signed-in email. */
    email: { type: String, default: '' }
  })

  // One panel, so its value is a constant rather than a prop: nothing outside this file
  // addresses it.
  const PANEL = 'deployment-settings'

  // WHAT THE CLOSED ROW SAYS, on its right end — the same place the deployment page's
  // own settings disclosure puts it: the record this deployment applied, by name.
  const settingsLabel = computed(() => props.setting?.name ?? '')

  // WHAT THE PANEL REPORTS: the ROUTING POLICY, and only that — the same two fields
  // the deployment page's own settings disclosure lists.
  //
  // It used to report the whole record here: the name with its Active / Platform tags
  // and environment chips, its description, the three resources it binds, and its type.
  // That was a second full reading of a record whose home is the Deployments module —
  // and the bindings in particular are already named by the topology on this very page.
  // The row above links to the record; this says how the versions it publishes bind.
  const policyFields = computed(() =>
    props.setting
      ? [
          { label: 'Binding policy', value: bindingPolicyLabel(props.setting.bindingPolicy) },
          { label: 'Version policy', value: versionPolicyLabel(props.setting.versionPolicy) }
        ]
      : []
  )
</script>

<template>
  <!-- ── Deployment Settings ──────────────────────────────────────────────────
       THE SAME DISCLOSURE THE DEPLOYMENT PAGE DRAWS, because it reports the same
       thing: the strategy a deployment applied. There it sits on the detail card's
       bottom edge; here it sits on the workload card's, and the two rows are the
       same row — chevron first, the region's name in full ink, and the record it
       opens on the far right.

       FLUSH, not a bordered box nested inside the footer. It was one: a rounded
       card with its own border and `--bg-surface` fill, inset inside a band that is
       already inset — a third box inside the second box inside the card. It draws no
       rule of its own either: the footer region it fills already has a top border
       (./WorkloadSummary.vue), and a second one on this element is two rules on one
       edge. `--accordion-inset` puts the trigger on the card's own left margin.

       CLOSED ON ARRIVAL, for the reason the deployment page's is: the routing policy
       is the answer to a second question ("how does it publish?") that only some
       readers ask, and the closed row already names the record behind it. -->
  <Accordion
    v-if="setting"
    class="[--accordion-inset:var(--spacing-md)]"
    type="single"
    arrow-position="left"
    collapsible
  >
    <Accordion.Item
      :value="PANEL"
      class="border-b-0"
    >
      <!-- `relative` scopes the layer below to the TRIGGER ROW, so the link cannot
           drift onto the open panel. -->
      <div class="relative">
        <!-- `level="3"`: it names a part of the card's footer, under the page's own
             section headings, so the document outline stays honest. -->
        <Accordion.Trigger :level="3">
          <span class="flex min-h-12 flex-1 items-center gap-(--spacing-sm)">
            <span class="text-label-md text-(--text-default)">Deployment Settings</span>
          </span>
        </Accordion.Trigger>

        <!-- THE WAY OUT, on the row itself. A setting is a resource of its own —
             authored, listed and edited in the Deployments module — so the row that
             reports it says where it lives instead of being a dead end, and it says
             so where the deployment page says it: the record's name, then the 12px
             `pi-external-link`, and a tooltip naming the page it opens.

             It cannot sit INSIDE the trigger: that is a `<button>`, and an anchor
             nested in one is invalid markup the browser takes apart. Layered on top
             instead, with `pointer-events-none` on the layer and `auto` on the link,
             so every other pixel of the row still hits the disclosure. -->
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex max-w-[calc(100%-12rem)] items-center pr-(--spacing-md)"
        >
          <Tooltip
            class="pointer-events-auto"
            :text="`Open ${settingsLabel} in Deployment Settings`"
          >
            <router-link
              :to="{ path: '/deployments', query: { tab: 'settings', email } }"
              class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm text-(--text-default) no-underline"
            >
              <span class="truncate underline-offset-2 group-hover/link:underline">
                {{ settingsLabel }}
              </span>
              <i
                class="pi pi-external-link shrink-0 text-body-xs leading-none"
                aria-hidden="true"
              />
            </router-link>
          </Tooltip>
        </div>
      </div>

      <Accordion.Content>
        <!-- Padding lives on the blocks, never on Content: Content is the animated box,
             and padding there is what the collapse interpolates against.

             The two policy fields and nothing else — the same pair console-kit's own
             DeploymentSettingCard reports. The record's name is on the trigger row, and
             what it BINDS is the topology diagram further down this page: repeating the
             application, firewall and custom page here was the same three facts twice. -->
        <div
          class="grid grid-cols-1 gap-(--spacing-lg) px-(--spacing-md) pt-(--spacing-xs) pb-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3"
        >
          <div
            v-for="field in policyFields"
            :key="field.label"
            class="flex min-w-0 flex-col gap-(--spacing-xxs)"
          >
            <span class="text-label-sm text-(--text-muted)">{{ field.label }}</span>
            <span class="truncate text-body-sm text-(--text-default)">{{ field.value }}</span>
          </div>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
</template>
