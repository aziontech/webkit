<script setup>
  import { curve, duration } from '@aziontech/theme/animations'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputGroup, { InputGroupAddon } from '@aziontech/webkit/input-group'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Label from '@aziontech/webkit/label'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { useBaseline } from '../lib/forms'
  import { provisionDeployment, resourceChain } from '../lib/provisioning'
  import { getTemplate } from '../templates.js'
  import CreationHeader from './ui/CreationHeader.vue'
  import DeploymentFlow from './ui/DeploymentFlow.vue'
  import TemplatePreview from './ui/TemplatePreview.vue'
  import UnsavedChangesGuard from './ui/UnsavedChangesGuard.vue'

  const route = useRoute()
  const router = useRouter()

  // Carry the signed-in user across the flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // A deploy starts either from a catalog template (?template=slug) or from
  // importing an existing Git repository (?repo=name&owner=account). A repo import
  // synthesizes a template-shaped source (no template-specific settings) so the
  // rest of the flow — preview, form, deployment, success — is identical.
  const isRepoImport = computed(() => Boolean(route.query.repo))

  const template = computed(() => {
    if (isRepoImport.value) {
      const name = String(route.query.repo)
      const owner = String(route.query.owner || 'gab-az')
      return {
        slug: `repo:${owner}/${name}`,
        title: name,
        description: `Import and deploy the ${name} repository directly from GitHub.`,
        framework: String(route.query.framework || ''),
        repoOwner: owner,
        repoPath: name,
        defaultRepoName: name,
        settings: []
      }
    }
    return getTemplate(route.query.template)
  })

  const goToCreationCenter = () =>
    router.push({ path: '/create', query: { email: userEmail.value } })

  // "Manage" opens the workload the deploy just created — the entry point of the
  // provisioned chain (see onDeployFinished).
  const manageWorkload = () =>
    router.push({
      path: `/workloads/${provisioned.value?.workload.id ?? ''}`,
      query: { email: userEmail.value, name: provisioned.value?.workload.name }
    })

  // Breadcrumb trail: clickable root back to the Creation Center, then the
  // current template as the active (last) crumb.
  const breadcrumbItems = computed(() => [
    { label: isRepoImport.value ? 'Import from Git' : 'Start from a Template' },
    { label: template.value.title, current: true }
  ])
  const onBreadcrumbNavigate = () => goToCreationCenter()

  // Git scope (account / organization the repo will be created under).
  const scopes = [
    { label: 'gab-az', value: 'gab-az' },
    { label: 'aziontech', value: 'aziontech' },
    { label: 'azion-templates', value: 'azion-templates' }
  ]
  const scope = ref(scopes[0].value)

  // Repository visibility. Public is the default ("lock out"); flipping the
  // switch off makes the repository private ("lock in").
  const isPublic = ref(true)
  const repoLabel = computed(() =>
    isPublic.value ? 'Public Repository Name' : 'Private Repository Name'
  )

  // Repo name + template-specific setting values are seeded from the template
  // and reset whenever a different template is opened in place.
  const repoName = ref('')
  const settingsValues = reactive({})

  // Entering a template (or switching to another one in place) briefly "fetches"
  // its per-template settings schema — while it loads we swap the fields for
  // Skeleton placeholders so the layout never jumps.
  const settingsLoading = ref(false)
  let settingsTimer = null

  // Number of Skeleton rows to reserve while the settings load; at least two so
  // the placeholder reads as a form even for templates with no extra fields.
  const skeletonFieldCount = computed(() => Math.max(template.value.settings.length, 2))

  const initFromTemplate = (t) => {
    repoName.value = t.defaultRepoName
    Object.keys(settingsValues).forEach((k) => delete settingsValues[k])
    t.settings.forEach((s) => (settingsValues[s.name] = ''))

    settingsLoading.value = true
    if (settingsTimer) clearTimeout(settingsTimer)
    settingsTimer = setTimeout(() => {
      settingsLoading.value = false
    }, 900)
  }
  initFromTemplate(template.value)

  // The leave guard's trigger (ui/UnsavedChangesGuard.vue). The baseline is taken AFTER the
  // first seed, so the values the template itself supplies are the starting point and not
  // an edit — and it is re-taken whenever another template is opened in place, or switching
  // templates would read as unsaved work the reader never typed.
  const { dirty, commit } = useBaseline(() => ({ repoName: repoName.value, ...settingsValues }))
  watch(
    () => template.value.slug,
    () => {
      initFromTemplate(template.value)
      commit()
    }
  )

  // Deploy is enabled once the repo name and every required setting are filled.
  const canDeploy = computed(() => {
    if (!repoName.value.trim()) return false
    return template.value.settings
      .filter((s) => s.required)
      .every((s) => (settingsValues[s.name] || '').trim())
  })

  // Flow status: form -> deploying -> success. The deployment card runs its own
  // internal states and emits `finished`, which advances us to the success view.
  const status = ref('form')

  // Brief loading state on the Deploy button before the deployment view opens.
  const submitting = ref(false)
  let submitTimer = null

  const runDeploy = () => {
    if (!canDeploy.value || submitting.value) return
    submitting.value = true
    submitTimer = setTimeout(() => {
      status.value = 'deploying'
      submitting.value = false
    }, 1500)
  }

  onBeforeUnmount(() => {
    if (submitTimer) clearTimeout(submitTimer)
    if (settingsTimer) clearTimeout(settingsTimer)
  })

  // Phase cross-fade motion. Timing comes from the theme's motion primitives
  // (animate.js): moderate-in / fast-out durations + productive entrance/exit
  // curves. Only timing goes inline — transform + opacity live in the Transition
  // classes (design.md Drawer pattern); a reduced-motion important class disables
  // it. Set imperatively per direction so out-in picks the right curve.
  const timing = (d, c) => `opacity ${d} ${c}, transform ${d} ${c}`
  const onBeforeEnter = (el) => {
    el.style.transition = timing(duration['moderate-02'], curve['productive-entrance'])
  }
  const onBeforeLeave = (el) => {
    el.style.transition = timing(duration['fast-02'], curve['productive-exit'])
  }

  // --- The deploy phase's scroll anchor -------------------------------------
  // Starting a deploy parks the deployment card at the top of the scroll box. The
  // template preview above it and the card together are taller than the viewport,
  // so without this the flow starts running below the fold and the user has to hunt
  // for it — scrolling back and forth between the thumbnail and the steps to watch
  // their own deploy. The preview has done its job by then; the steps are the page.
  //
  // Same shape as ErrorValidation's recovery anchor: measured against the SCROLL
  // CONTAINER (so it is right however far the page is already scrolled) and parked
  // one --spacing-lg below the top edge, which `scrollIntoView` cannot express.
  // Driven from the phase Transition's `enter` hook rather than a `watch`, because
  // `mode="out-in"` mounts the new phase only after the old one has left — at
  // `enter` the element is in the DOM and already at its final layout, so the scroll
  // and the fade run together instead of the page jumping after it settles.
  const ANCHOR_OFFSET = 24 // --spacing-lg of breathing room above the card
  const flowScroll = ref(null)

  const prefersReducedMotion = () =>
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const onPhaseEnter = (el) => {
    if (status.value !== 'deploying') return
    const container = flowScroll.value
    if (!container) return
    const top =
      container.scrollTop +
      el.getBoundingClientRect().top -
      container.getBoundingClientRect().top -
      ANCHOR_OFFSET
    container.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth'
    })
  }

  // A finished deploy provisions the resource chain — Workload → Application →
  // Connector → Storage (src/lib/provisioning.js) — so the created resources are
  // immediately real for the rest of the console: they show up in the Workloads /
  // Applications / Object Storage lists, and "Manage" opens the new workload.
  const provisioned = ref(null)
  const createdResources = computed(() =>
    provisioned.value ? resourceChain(provisioned.value) : []
  )

  const onDeployFinished = () => {
    provisioned.value = provisionDeployment({
      repoName: repoName.value,
      scope: scope.value,
      framework: template.value.framework,
      isPublic: isPublic.value,
      templateTitle: template.value.title
    })
    status.value = 'success'
  }

  // Post-deploy "Next Steps" shown on the success screen.
  const nextSteps = [
    {
      icon: 'pi pi-globe',
      title: 'Customize Domain',
      description: 'Associate a custom domain and subdomains to Azion to handle user access.'
    },
    {
      icon: 'pi pi-sitemap',
      title: 'Point Traffic',
      description:
        'Redirect the traffic of a domain to Azion and take advantage of the distributed network.'
    },
    {
      icon: 'pi pi-chart-line',
      title: 'View Analytics',
      description: 'Gain powerful insights into your performance, availability, and security.'
    }
  ]
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-[var(--bg-canvas)]">
    <UnsavedChangesGuard :dirty="dirty && status === 'form'" />

    <!-- Single creation header: back + brand + breadcrumb (hidden on success). -->
    <CreationHeader
      :show-back="status !== 'success'"
      :breadcrumb="status !== 'success' ? breadcrumbItems : []"
      back-label="Back to Creation Center"
      @back="goToCreationCenter"
      @navigate="onBreadcrumbNavigate"
    />

    <!-- Centered single-column flow. Phases cross-fade with a translate-y
         offset using the theme easing tokens. -->
    <main
      ref="flowScroll"
      class="animate-page-enter motion-reduce:animate-none relative min-w-0 flex-1 overflow-auto"
    >
      <!-- Success is the one moment in the flow worth marking as ours: a linear
           primary glow on the content background behind the card — not on the
           card, which keeps its own surface and borders untinted. The column
           below is `relative z-10` so it paints over the wash. -->
      <span
        v-if="status === 'success'"
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 top-0 h-[560px] animate-fade-in bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_22%,transparent)_0%,color-mix(in_srgb,var(--primary)_7%,transparent)_45%,transparent_100%)] motion-reduce:animate-none"
      />

      <!-- One measure for the whole flow: the FOCUSED column (`.layout-column-focused`
           — 1024px), which is what a single-task page takes everywhere else in the
           console, and what the Congratulations card is measured for.

           It used to widen on success (752px → 1024px) so the success card's two-up
           box had room to split. But the split is driven by the `lg:` viewport
           variant, not by the column, so it lands either way — and the swap fired at
           the exact moment the flow finished, re-laying the page out under the card
           that was fading in. A phase change is not a reason for the page to change
           width. -->
      <div
        class="layout-column-focused relative z-10 flex flex-col items-center gap-[var(--spacing-xl)] px-[var(--spacing-md)] py-[var(--spacing-xxl)]"
      >
        <!-- Preview strip for the form/deploy phases. On success it gives way
             to the in-card preview shown on the Congratulations card. -->
        <Transition
          @before-enter="onBeforeEnter"
          @before-leave="onBeforeLeave"
          enter-from-class="opacity-0 translate-y-[var(--spacing-lg)]"
          leave-to-class="opacity-0 -translate-y-[var(--spacing-md)]"
        >
          <TemplatePreview
            v-if="status !== 'success'"
            class="!max-w-none motion-reduce:!transition-none motion-reduce:!transform-none"
            :title="template.title"
            :description="template.description"
            :repo-owner="template.repoOwner"
            :repo-path="template.repoPath"
            thumbnail="/template-nextjs-thumb.png"
          />
        </Transition>

        <Transition
          mode="out-in"
          @before-enter="onBeforeEnter"
          @enter="onPhaseEnter"
          @before-leave="onBeforeLeave"
          enter-from-class="opacity-0 translate-y-[var(--spacing-lg)]"
          leave-to-class="opacity-0 -translate-y-[var(--spacing-md)]"
        >
          <div
            :key="status"
            class="flex w-full flex-col items-center gap-[var(--spacing-xl)] motion-reduce:!transition-none motion-reduce:!transform-none"
          >
            <!-- Configure repository + template settings -->
            <template v-if="status === 'form'">
              <!-- Configuration card -->
              <CardBox class="w-full">
                <template #content>
                  <div class="flex flex-col gap-[var(--spacing-lg)]">
                    <p class="text-body-sm text-pretty text-[var(--text-muted)]">
                      Configure your Git repository to integrate your codebase and automate
                      deployments directly from your version control system.
                    </p>

                    <!-- Scope + repository name -->
                    <div
                      class="grid grid-cols-1 items-start gap-[var(--spacing-lg)] sm:grid-cols-2"
                    >
                      <div class="flex flex-col gap-[var(--spacing-xs)]">
                        <Label
                          label="Scope"
                          required
                          for="scope"
                        />
                        <Select
                          v-model="scope"
                          size="large"
                          placeholder="Select a scope"
                          :disabled="submitting"
                          :display-value="(v) => scopes.find((s) => s.value === v)?.label ?? ''"
                        >
                          <Select.Trigger />
                          <Select.Content>
                            <Select.Option
                              v-for="s in scopes"
                              :key="s.value"
                              :value="s.value"
                            >
                              {{ s.label }}
                            </Select.Option>
                          </Select.Content>
                        </Select>
                      </div>

                      <div class="flex flex-col gap-[var(--spacing-xs)]">
                        <Label
                          :label="repoLabel"
                          required
                          for="repoName"
                        />
                        <!-- Repo name joined with the visibility toggle in a
                             single InputGroup: the input is the leading control
                             and the trailing addon carries the privacy Switch
                             (lock / lock-open). The group's `size` matches the
                             InputText's so both land on the same 40px height. -->
                        <InputGroup
                          size="large"
                          :disabled="submitting"
                        >
                          <InputText
                            id="repoName"
                            v-model="repoName"
                            size="large"
                            placeholder="my-repository"
                            class="flex-1"
                            :disabled="submitting"
                          />
                          <InputGroupAddon>
                            <Tooltip text="Toggle repository visibility (public or private)">
                              <Switch
                                v-model="isPublic"
                                kind="privacy"
                                :disabled="submitting"
                                :aria-label="
                                  isPublic
                                    ? 'Repository is public — toggle to make it private'
                                    : 'Repository is private — toggle to make it public'
                                "
                              />
                            </Tooltip>
                          </InputGroupAddon>
                        </InputGroup>
                      </div>
                    </div>

                    <!-- Template-specific settings -->
                    <p class="text-heading-xxs text-[var(--text-default)]">Template Settings</p>
                    <!-- While the template's settings schema loads, reserve the
                         layout with Skeleton placeholders (label + field +
                         helper text) so nothing jumps when it resolves. -->
                    <div
                      v-if="settingsLoading"
                      class="flex flex-col gap-[var(--spacing-lg)]"
                      aria-busy="true"
                    >
                      <div
                        v-for="n in skeletonFieldCount"
                        :key="n"
                        class="flex flex-col gap-[var(--spacing-xs)]"
                      >
                        <Skeleton
                          width="30%"
                          height="1rem"
                        />
                        <Skeleton
                          width="100%"
                          height="2rem"
                        />
                        <Skeleton
                          width="55%"
                          height="0.75rem"
                        />
                      </div>
                    </div>
                    <div
                      v-else-if="template.settings.length"
                      class="flex flex-col gap-[var(--spacing-lg)]"
                    >
                      <div
                        v-for="field in template.settings"
                        :key="field.name"
                        class="flex flex-col gap-[var(--spacing-xs)]"
                      >
                        <!-- Field triad: the Label's required tag is persistent
                             (bound to the schema, not to submit); guidance is a
                             HelperText, not a bare <small>. Deploy is gated on
                             canDeploy (error prevention), so there is no red
                             required-error state to surface here. -->
                        <Label
                          :label="field.label"
                          :required="field.required"
                          :for="field.name"
                        />
                        <InputText
                          :id="field.name"
                          v-model="settingsValues[field.name]"
                          size="large"
                          :placeholder="field.placeholder"
                          :disabled="submitting"
                          :aria-describedby="field.description ? `${field.name}-helper` : undefined"
                        />
                        <HelperText
                          v-if="field.description"
                          :id="`${field.name}-helper`"
                          :label="field.description"
                        />
                      </div>
                    </div>
                    <p
                      v-else
                      class="text-body-sm text-[var(--text-muted)]"
                    >
                      This template has no additional settings.
                    </p>
                  </div>
                </template>

                <template #footer>
                  <Button
                    class="w-full"
                    label="Deploy"
                    kind="primary"
                    size="large"
                    :disabled="!canDeploy"
                    :loading="submitting"
                    @click="runDeploy"
                  />
                </template>
              </CardBox>

              <!-- Browse other templates -->
              <Button
                label="Browse Templates"
                kind="outlined"
                size="medium"
                @click="goToCreationCenter"
              />
            </template>

            <!-- Deploy in progress: only the Deployment card renders here -->
            <template v-else-if="status === 'deploying'">
              <DeploymentFlow
                :repo-owner="template.repoOwner"
                :repo-path="template.repoPath"
                :scope="scope"
                @finished="onDeployFinished"
              />
            </template>

            <!-- Success: Congratulations + deployed preview + Next Steps -->
            <template v-else>
              <!-- The congratulation is the page's own heading, on the canvas
                   and on the glow — not a card header. It announces the outcome;
                   the card below is the record of it. Sized like a first-level
                   page title, since the chrome carries no breadcrumb here. -->
              <header class="flex w-full flex-col gap-[var(--spacing-xxs)]">
                <h1 class="text-balance text-heading-lg text-[var(--text-default)]">
                  Congratulations!
                </h1>
                <p
                  class="flex flex-wrap items-center gap-[var(--spacing-xs)] text-body-sm text-[var(--text-muted)]"
                >
                  You just deployed a new application into
                  <Tag
                    :label="scope"
                    severity="secondary"
                    icon="pi pi-github"
                  />
                </p>
              </header>

              <CardBox class="w-full">
                <template #content>
                  <div class="flex flex-col gap-[var(--spacing-lg)]">
                    <!-- What was shipped, in one horizontal box: the deployed
                         page on the left, the chain it provisioned on the right
                         (Workload → Application → Connector → Storage, in
                         creation order — the same records back the workload's
                         deployment topology). Side by side because they are two
                         readings of one outcome: what the user sees, and what
                         Azion built to serve it. Stacks below `lg`, where the
                         two halves would each be too narrow to read. -->
                    <CardBox :padded="false">
                      <template #content>
                        <div class="flex flex-col lg:flex-row">
                          <!-- Deployed application preview -->
                          <div
                            class="min-h-[220px] w-full overflow-hidden bg-[var(--bg-surface-raised)] lg:min-h-[320px] lg:w-1/2"
                          >
                            <img
                              src="/template-nextjs-thumb.png"
                              alt=""
                              class="size-full object-cover"
                            />
                          </div>

                          <!-- Resources created -->
                          <div
                            class="flex w-full min-w-0 flex-col border-t border-[var(--border-default)] lg:w-1/2 lg:border-l lg:border-t-0"
                          >
                            <p
                              class="flex min-h-14 shrink-0 items-center border-b border-[var(--border-default)] px-[var(--spacing-sm)] text-label-sm text-[var(--text-default)]"
                            >
                              Resources Created
                            </p>
                            <Item.List>
                              <Item
                                v-for="resource in createdResources"
                                :key="resource.key"
                                size="small"
                              >
                                <Item.Media>
                                  <span
                                    class="flex size-8 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface)]"
                                  >
                                    <i
                                      :class="resource.icon"
                                      class="text-[14px] leading-none text-[var(--text-default)]"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </Item.Media>
                                <Item.Content>
                                  <Item.Title>{{ resource.name }}</Item.Title>
                                  <Item.Description>
                                    {{ resource.kind }} · {{ resource.reference }}
                                  </Item.Description>
                                </Item.Content>
                                <Item.Actions>
                                  <Tag
                                    label="Created"
                                    severity="success"
                                    size="small"
                                  />
                                </Item.Actions>
                              </Item>
                            </Item.List>
                          </div>
                        </div>
                      </template>
                    </CardBox>

                    <!-- Next Steps — its own box under the horizontal one: not
                         part of what just happened, but what to do next. -->
                    <CardBox :padded="false">
                      <template #content>
                        <p
                          class="flex min-h-14 shrink-0 items-center border-b border-[var(--border-default)] px-[var(--spacing-sm)] text-label-sm text-[var(--text-default)]"
                        >
                          Next Steps
                        </p>
                        <Item.List>
                          <!-- as-child: the row shell (layout + hover/active
                               ghost + focus ring) is merged onto the anchor,
                               so each Next Step is one real navigable <a>
                               instead of a <div> wrapping a link. -->
                          <Item
                            v-for="step in nextSteps"
                            :key="step.title"
                            as-child
                            size="small"
                          >
                            <a
                              href="https://www.azion.com/en/documentation/"
                              target="_blank"
                              rel="noopener"
                              class="text-left no-underline"
                            >
                              <Item.Media>
                                <span
                                  class="flex size-8 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface)]"
                                >
                                  <i
                                    :class="step.icon"
                                    class="text-[14px] leading-none text-[var(--text-default)]"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Item.Media>
                              <Item.Content>
                                <Item.Title>{{ step.title }}</Item.Title>
                                <Item.Description>{{ step.description }}</Item.Description>
                              </Item.Content>
                              <Item.Actions>
                                <i
                                  class="pi pi-chevron-right text-[var(--text-muted)]"
                                  aria-hidden="true"
                                />
                              </Item.Actions>
                            </a>
                          </Item>
                        </Item.List>
                      </template>
                    </CardBox>
                  </div>
                </template>

                <template #footer>
                  <!-- Manage opens the created workload — the chain's entry
                       point — instead of dropping back on the home page. -->
                  <Button
                    class="w-full"
                    label="Manage"
                    kind="secondary"
                    size="large"
                    icon="pi pi-arrow-right"
                    @click="manageWorkload"
                  />
                </template>
              </CardBox>
            </template>
          </div>
        </Transition>
      </div>
    </main>
  </div>
</template>
