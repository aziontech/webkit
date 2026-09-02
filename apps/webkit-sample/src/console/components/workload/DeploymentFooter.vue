<script setup>
  // DeploymentFooter — what is deployed on this workload, as the FOOTER of its main card.
  //
  // ── WHY IT IS A FOOTER AND NOT A CARD ──
  //
  // It has been both. It started as an "Active Deployment" band at the top of the Overview,
  // then became a card of its own beside the topology. Neither placement was right, for the
  // same reason: a deployment is not a peer of the workload, it is the workload's current
  // state — so a second card asked the reader to hold two objects where there is one. The
  // workload's card says what it IS (its address, its id, its domains, when it was made);
  // its footer says what is running on it right now. One card, read top to bottom.
  //
  // So this component draws no box. Its parent (./WorkloadSummary.vue) owns the footer
  // region — the top rule, the recessed fill, the card's own bottom corners — and this
  // fills it.
  //
  // ── WHAT A DEPLOYMENT SETTING IS ──
  //
  // The nested panel is the STRATEGY the deployment applied
  // (../../lib/data/deployment-strategies.js), the reusable half of Azion's own request:
  //
  //   POST /v4/workspace/workloads/{workload_id}/deployments
  //   { name, active, current, strategy: { type, attributes: { application, firewall, custom_page } } }
  //
  // Not a second concept invented here. A setting is authored once in the Deployments
  // module's create drawer and applied by many deployments, and this reads that very store
  // through the projection the release composer reads (`deploymentSettings` in
  // ../../lib/data/releases.js). Create one in that drawer and it appears here; delete one
  // and it leaves. There is no fixture behind this file.
  //
  // A workload can publish into MORE THAN ONE — every third one does, one per environment —
  // which is why the panel holds a list of blocks and not a single grid.
  //
  // ── WHAT IT DOES NOT SHOW ──
  //
  // The reference this composition follows opens with a "Recommendations" row of upsell
  // cards. There is no Azion equivalent, and inventing three would be exactly the parallel
  // fixture the strategy store exists to prevent. This reports the record and stops.
  import Accordion from '@aziontech/webkit/accordion'
  import Avatar from '@aziontech/webkit/avatar'
  import Chip from '@aziontech/webkit/chip'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import { applicationIdByName } from '@shared/lib/applications'
  import { computed } from 'vue'

  import { customPageIdByName } from '../../lib/data/custom-pages'
  import {
    bindingPolicyLabel,
    strategyTypeLabel,
    versionPolicyLabel
  } from '../../lib/data/deployment-strategies'
  import { statusMeta } from '../../lib/data/deployments'
  import { firewallIdByName } from '../../lib/data/firewalls'
  import { relativeTime } from '../../lib/format/relative-time'

  const props = defineProps({
    /**
     * The deployment currently live on this workload — a row of the shared history
     * (@shared/lib/deployment-history.js): `{ versionId, status, environment, deployedAt,
     * author, authorAvatar }`. Absent renders no facts.
     */
    deployment: { type: Object, default: null },
    /**
     * The settings it was published with — projected `deploymentSettings` entries
     * (../../lib/data/releases.js), already filtered to this workload by the page.
     */
    settings: { type: Array, default: () => [] },
    /** Carried into the settings links so the demo keeps the signed-in email. */
    email: { type: String, default: '' }
  })

  // One panel, so its value is a constant rather than a prop: nothing outside this file
  // addresses it. It arrives OPEN — the settings are the point of the footer, and a
  // disclosure that hides its own subject on arrival is a control the reader has to press
  // before the card says anything. The Accordion is there so a reader who has read them
  // once can fold them away, not so the card starts empty.
  const PANEL = 'deployment-settings'

  // What a CLOSED panel still says: how many settings published this deployment.
  const settingsSummary = computed(() =>
    props.settings.length === 1 ? '1 setting' : `${props.settings.length} settings`
  )

  // WHEN AND WHO, as one line — "1 hour ago by Robson Junior". A deploy is read RELATIVE,
  // unlike the workload's own Created date on the card above, which is absolute ("Sep 1"):
  // how long ago the last deploy landed is the question, and a clock time makes the reader
  // do the subtraction.
  const deployedAgo = computed(() => relativeTime(props.deployment?.deployedAt))

  // Emails and dotted handles → a readable name, the same normalization every author cell
  // in the console applies, so a person is spelled one way across it.
  const deployerName = computed(() => {
    const raw = String(props.deployment?.author ?? '').trim()
    if (!raw) return ''
    const local = raw.includes('@') ? raw.slice(0, raw.indexOf('@')) : raw
    return local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  })

  // `strategy.attributes.application` is nullable, and empty has a MEANING rather than
  // being missing data: the setting pins no application, so it binds whichever one the
  // deploy is for. That is how Azion Default works and how a setting stays reusable from
  // every resource page — so it is stated, not printed as "Not bound".
  const applicationLabel = (settings) =>
    settings.bindings.application || 'The application being deployed'

  // EVERY BINDING IS A REFERENCE, so every bound binding is a LINK.
  //
  // A setting binds by NAME (that is the key everywhere in this console — the provisioning
  // log narrates it, `bindingsLine` prints it, `namesFor` resolves versions from it), and a
  // link needs an id, so each kind resolves its own name → id and hands back the route to
  // that resource's page. Those are the same three routes the topology's nodes open, so a
  // firewall reached from the diagram and one reached from the settings that bound it land
  // on the same screen.
  //
  // `null` means "no page to open": either nothing is bound, or the binding names a
  // resource this sample does not seed (a setting authored in the drawer with a brand-new
  // name). The second case still shows the name — it is a fact — just not as a link.
  const BINDING_ROUTE = {
    application: (name) => {
      const id = applicationIdByName(name)
      return id ? `/applications/${id}` : ''
    },
    firewall: (name) => {
      const id = firewallIdByName(name)
      return id ? `/firewall/${id}/settings` : ''
    },
    customPage: (name) => {
      const id = customPageIdByName(name)
      return id ? `/custom-pages/${id}/settings` : ''
    }
  }

  const bindingLink = (kind, name) => {
    if (!name) return null
    const path = BINDING_ROUTE[kind]?.(name) ?? ''
    return path ? { path, query: { name, email: props.email } } : null
  }
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm) p-(--spacing-md)">
    <!-- THE DEPLOYMENT IS ONE LINE, AND THE VERSION IS THE LINK.
         
         It was a three-cell fact grid here (version · environment · status). That was a
         second reading of a record this card does not own: a deployment has its own page
         (/deployments/:versionId) where those facts and its whole log live, so restating
         three of them on the workload's card asked the reader to compare two partial
         views of the same thing. What the card actually owes them is WHICH version is
         live, whether it is healthy, when it landed and who pushed it — and a way in.
         
         So: the label, the version as a router-link, the status, and "1 hour ago by
         Robson Junior" with the face last, the same shape the Created cell uses above.
         Everything else is one click away instead of duplicated.
         
         NO BLUE. Every reference on this card wears the same quiet clothes — full ink, a
         muted underline that firms to full ink on hover — whether it opens the live site or
         another page of the console. `--text-link` was here first, on the argument that
         in-app navigation is a different kind of link from an outbound one; on a card whose
         subject is already a link that argument just paints half the references a second
         colour, and the underline says "link" perfectly well without one. -->
    <div class="flex flex-wrap items-center gap-x-(--spacing-sm) gap-y-(--spacing-xxs)">
      <span class="text-label-md text-(--text-default)">Deployment</span>

      <template v-if="deployment">
        <router-link
          :to="{ path: `/deployments/${deployment.versionId}`, query: { email } }"
          class="flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm tabular-nums text-(--text-default) underline decoration-(--text-muted) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:decoration-(--text-default) motion-reduce:transition-none"
        >
          <span class="truncate">{{ deployment.versionId }}</span>
          <i
            class="pi pi-arrow-up-right shrink-0 text-[0.85em]"
            aria-hidden="true"
          />
        </router-link>

        <StatusIndicator
          :severity="statusMeta(deployment.status).severity"
          :loading="statusMeta(deployment.status).loading"
          :label="deployment.status"
        />

        <div
          v-if="deployedAgo"
          class="flex min-w-0 items-center gap-(--spacing-xs)"
        >
          <span class="truncate text-body-sm text-(--text-muted)">
            {{ deployedAgo }}<template v-if="deployerName"> by {{ deployerName }}</template>
          </span>
          <Avatar
            v-if="deployerName"
            :src="deployment.authorAvatar || undefined"
            :alt="deployerName"
            :label="deployerName"
            size="small"
            kind="square"
            class="shrink-0"
          />
        </div>
      </template>
    </div>

    <!-- A DISCLOSURE, not a static block: a workload can publish into several settings and
         each one is six facts deep, so a reader who has taken them in once can fold the
         whole panel away and leave the footer reporting the live version alone. Open on
         arrival — the Accordion is a way OUT of the detail, not a gate in front of it.

         `arrow-position="left"` so the chevron leads its title instead of sitting at the
         far end of a full-width header, and the count rides that header so a closed panel
         still says how much is behind it. -->
    <Accordion
      v-if="settings.length"
      type="single"
      collapsible
      size="medium"
      arrow-position="left"
      :default-value="PANEL"
      class="overflow-clip rounded-(--shape-card) border border-(--border-muted) bg-(--bg-surface)"
    >
      <Accordion.Item
        :value="PANEL"
        class="border-b-0"
      >
        <!-- `level="3"`: it names a part of the card's footer, under the page's own
             section headings, so the document outline stays honest. -->
        <Accordion.Trigger :level="3">
          <span class="flex min-w-0 flex-1 items-center gap-(--spacing-sm)">
            <span class="truncate text-label-sm text-(--text-muted)">Deployment Settings</span>
            <span class="shrink-0 text-label-sm text-(--text-muted)">{{ settingsSummary }}</span>
          </span>
        </Accordion.Trigger>

        <Accordion.Content>
          <!-- Padding lives on the blocks, never on Content: Content is the animated box,
               and padding there is what the collapse interpolates against. -->
          <div
            v-for="(setting, index) in settings"
            :key="setting.id"
            class="flex flex-col gap-(--spacing-sm) px-(--spacing-md) pt-(--spacing-md) pb-(--spacing-md)"
            :class="index > 0 ? 'border-t border-(--border-muted)' : ''"
          >
            <!-- The setting names itself, with what a reader needs to trust the block: is it
             active (an inactive setting can apply no deployment), is it the platform's own,
             and which environments it publishes into. -->
            <div class="flex flex-wrap items-center gap-x-(--spacing-sm) gap-y-(--spacing-xxs)">
              <span class="text-label-md text-(--text-default)">{{ setting.name }}</span>
              <Tag
                :severity="setting.status === 'Active' ? 'success' : 'secondary'"
                :label="setting.status"
                size="small"
              />
              <Tag
                v-if="setting.system"
                severity="info"
                label="Platform"
                size="small"
              />
              <Chip
                v-for="environment in setting.environmentNames"
                :key="environment"
                kind="outlined"
                size="small"
                :label="environment"
              />
            </div>
            <p
              v-if="setting.description"
              class="text-body-xs text-(--text-muted)"
            >
              {{ setting.description }}
            </p>

            <!-- BINDINGS — what the deployment serves, and every one of them a way to get
                 there. They were flat text (and a dot for the two optional ones), which made
                 the three resources a deployment is actually made of the only names on this
                 page a reader could not follow. -->
            <div class="grid grid-cols-2 gap-(--spacing-sm) sm:grid-cols-3">
              <div class="flex min-w-0 flex-col items-start gap-(--spacing-xxs)">
                <span class="text-label-sm text-(--text-muted)">Application</span>
                <div class="flex min-h-7 min-w-0 items-center">
                  <!-- Bound and addressable → a link. Bound but unknown to this sample → the
                       name, which is still the fact. Unbound → the STATE, which is what
                       StatusIndicator is for. -->
                  <router-link
                    v-if="bindingLink('application', setting.bindings.application)"
                    :to="bindingLink('application', setting.bindings.application)"
                    class="flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm text-(--text-default) underline decoration-(--text-muted) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:decoration-(--text-default) motion-reduce:transition-none"
                  >
                    <span class="truncate">{{ setting.bindings.application }}</span>
                    <i
                      class="pi pi-arrow-up-right shrink-0 text-[0.85em]"
                      aria-hidden="true"
                    />
                  </router-link>
                  <span
                    v-else-if="setting.bindings.application"
                    class="truncate text-body-sm text-(--text-default)"
                  >
                    {{ setting.bindings.application }}
                  </span>
                  <span
                    v-else
                    class="truncate text-body-sm text-(--text-muted)"
                  >
                    {{ applicationLabel(setting) }}
                  </span>
                </div>
              </div>
              <div class="flex min-w-0 flex-col items-start gap-(--spacing-xxs)">
                <span class="text-label-sm text-(--text-muted)">Firewall</span>
                <div class="flex min-h-7 min-w-0 items-center">
                  <!-- Bound and addressable → a link. Bound but unknown to this sample → the
                       name, which is still the fact. Unbound → the STATE, which is what
                       StatusIndicator is for. -->
                  <router-link
                    v-if="bindingLink('firewall', setting.bindings.firewall)"
                    :to="bindingLink('firewall', setting.bindings.firewall)"
                    class="flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm text-(--text-default) underline decoration-(--text-muted) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:decoration-(--text-default) motion-reduce:transition-none"
                  >
                    <span class="truncate">{{ setting.bindings.firewall }}</span>
                    <i
                      class="pi pi-arrow-up-right shrink-0 text-[0.85em]"
                      aria-hidden="true"
                    />
                  </router-link>
                  <span
                    v-else-if="setting.bindings.firewall"
                    class="truncate text-body-sm text-(--text-default)"
                  >
                    {{ setting.bindings.firewall }}
                  </span>
                  <StatusIndicator
                    v-else
                    severity="neutral"
                    label="Not bound"
                  />
                </div>
              </div>
              <div class="flex min-w-0 flex-col items-start gap-(--spacing-xxs)">
                <span class="text-label-sm text-(--text-muted)">Custom Page</span>
                <div class="flex min-h-7 min-w-0 items-center">
                  <!-- Bound and addressable → a link. Bound but unknown to this sample → the
                       name, which is still the fact. Unbound → the STATE, which is what
                       StatusIndicator is for. -->
                  <router-link
                    v-if="bindingLink('customPage', setting.bindings.customPage)"
                    :to="bindingLink('customPage', setting.bindings.customPage)"
                    class="flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm text-(--text-default) underline decoration-(--text-muted) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:decoration-(--text-default) motion-reduce:transition-none"
                  >
                    <span class="truncate">{{ setting.bindings.customPage }}</span>
                    <i
                      class="pi pi-arrow-up-right shrink-0 text-[0.85em]"
                      aria-hidden="true"
                    />
                  </router-link>
                  <span
                    v-else-if="setting.bindings.customPage"
                    class="truncate text-body-sm text-(--text-default)"
                  >
                    {{ setting.bindings.customPage }}
                  </span>
                  <StatusIndicator
                    v-else
                    severity="neutral"
                    label="Not bound"
                  />
                </div>
              </div>
            </div>

            <!-- ROUTING — how the versions it publishes reach those resources. Its own grid
             under a rule, because it answers a different question from the bindings above
             and a six-cell block would read as one list of unrelated facts. -->
            <div
              class="grid grid-cols-2 gap-(--spacing-sm) border-t border-(--border-muted) pt-(--spacing-sm) sm:grid-cols-3"
            >
              <div class="flex min-w-0 flex-col items-start gap-(--spacing-xxs)">
                <span class="text-label-sm text-(--text-muted)">Type</span>
                <span class="truncate text-body-sm text-(--text-default)">
                  {{ strategyTypeLabel(setting.type) }}
                </span>
              </div>
              <div class="flex min-w-0 flex-col items-start gap-(--spacing-xxs)">
                <span class="text-label-sm text-(--text-muted)">Binding policy</span>
                <span class="truncate text-body-sm text-(--text-default)">
                  {{ bindingPolicyLabel(setting.bindingPolicy) }}
                </span>
              </div>
              <div class="flex min-w-0 flex-col items-start gap-(--spacing-xxs)">
                <span class="text-label-sm text-(--text-muted)">Version policy</span>
                <span class="truncate text-body-sm text-(--text-default)">
                  {{ versionPolicyLabel(setting.versionPolicy) }}
                </span>
              </div>
            </div>

            <!-- The way out. A setting is a resource of its own — authored, listed and edited
             in the Deployments module — so the block that reports it says where it lives
             instead of being a dead end. -->
            <router-link
              :to="{ path: '/deployments', query: { tab: 'settings', email } }"
              class="flex w-fit min-w-0 items-center gap-(--spacing-xxs) text-label-sm text-(--text-default) underline decoration-(--text-muted) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:decoration-(--text-default) motion-reduce:transition-none"
            >
              <span class="truncate">Open in Deployment Settings</span>
              <i
                class="pi pi-arrow-up-right shrink-0 text-[0.85em]"
                aria-hidden="true"
              />
            </router-link>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>

    <!-- A workload nothing has deployed into yet is a real state, so it says so rather
         than leaving the footer looking unfinished. -->
    <p
      v-if="!settings.length"
      class="text-body-sm text-(--text-muted)"
    >
      This workload does not deploy with any Deployment setting yet.
    </p>
  </div>
</template>
