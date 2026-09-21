<script setup>
  import { curve, duration } from '@aziontech/theme/animations'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputGroup, { InputGroupAddon } from '@aziontech/webkit/input-group'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { provisionDeployment, resourceChain } from '../../lib/data/provisioning'
  import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import GitProviderConnect from '../../components/creation/GitProviderConnect.vue'
  import UploadedProject from '../../components/creation/UploadedProject.vue'
  import DeploymentFlow from '../../components/deployment/DeploymentFlow.vue'
  import UnsavedChangesGuard from '../../components/form/UnsavedChangesGuard.vue'
  import TemplatePreview from '../../components/marketplace/TemplatePreview.vue'
  import CreationHeader from '../../components/page/CreationHeader.vue'
  import { useBaseline } from '../../lib/behavior/forms'
  import { defaultRootFile, picksRootFile } from '../../lib/behavior/project-upload'
  import { FRAMEWORKS, markFilterFor } from '../../lib/data/frameworks'
  import { getTemplate } from '../../lib/data/templates.js'
  import { droppedProjectFor } from '../../lib/state/dropped-project'
  import { gitAccounts, gitConnected } from '../../lib/state/git-provider'
  import DeploySuccess from '../applications/wizard/DeploySuccess.vue'

  const route = useRoute()
  const router = useRouter()

  // Carry the signed-in user across the flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // A deploy starts from one of three sources: a catalog template (?template=slug), an
  // existing Git repository (?repo=name&owner=account), or a project the reader handed us
  // from their own machine (?upload=name). The last two synthesize a template-shaped
  // source (no template-specific settings) so the rest of the flow — preview, form,
  // deployment, success — is identical.
  const isRepoImport = computed(() => Boolean(route.query.repo))
  const isUpload = computed(() => Boolean(route.query.upload))

  const template = computed(() => {
    if (isUpload.value) {
      const name = String(route.query.upload)
      const framework = String(route.query.framework || '')
      return {
        slug: `upload:${name}`,
        title: name,
        description: 'Deploy this project straight from your machine.',
        framework,
        icon: framework ? '' : 'pi pi-folder',
        requiresRepository: false,
        defaultRepoName: name,
        settings: []
      }
    }
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

  // THE MARK OF THE THING BEING DEPLOYED — the template's own glyph when it authors one
  // (the Azion templates do, since no framework stands behind them), otherwise the logo of
  // the framework it scaffolds. Either way it is the mark the reader just clicked: the
  // catalog card for a template, the repository row for an import
  // (../resources/creation/GitImporter.vue, which carries the stack across in `framework`).
  // A repository with no framework resolves to nothing and the card falls back to the
  // Azion mark, which is the honest answer — we do not know what it is built with.
  const templateMark = computed(() => {
    const framework = FRAMEWORKS.find((entry) => entry.tech === template.value.framework)
    const icon = template.value.icon || framework?.icon || ''
    return { icon, markClass: markFilterFor(icon) }
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
  const breadcrumbSource = computed(() => {
    if (isUpload.value) return 'Upload a Project'
    return isRepoImport.value ? 'Import from Git' : 'Start from a Template'
  })

  const breadcrumbItems = computed(() => [
    { label: breadcrumbSource.value },
    { label: template.value.title, current: true }
  ])
  const onBreadcrumbNavigate = () => goToCreationCenter()

  // ── DOES THIS DEPLOY GO THROUGH A REPOSITORY? ──
  //
  // Three answers, and only one of them is the reader's:
  //
  //   `none`      an AZION TEMPLATE has no project to copy — its settings ARE the template
  //               (../../lib/data/templates.js → `requiresRepository`). Asking it to
  //               authorize a provider would be asking for a clone that never happens, and
  //               the application wizard has always known this
  //               (../applications/CreateApplication.vue); this page did not, so Azion
  //               Proxy opened on a connect wall and a preview reading "Cloning from
  //               Github".
  //   `required`  a REPOSITORY IMPORT is a repository. There is nothing to deploy without
  //               it, so the provider is the source, not a preference.
  //   `optional`  a FRAMEWORK STARTER, which is the case this whole choice exists for.
  //               Cloning it into the reader's account is the better deploy — Azion watches
  //               it and ships every push — but it is not what makes the code deployable.
  //               A reader who does not want Azion holding a GitHub token, or who is trying
  //               the platform before they commit an account to it, deploys the code once
  //               and connects later. Binding a provider is a capability, not a toll.
  const repositoryMode = computed(() => {
    if (template.value.requiresRepository === false) return 'none'
    if (isRepoImport.value) return 'required'
    return 'optional'
  })

  // The reader took the `optional` fork the other way. Reset whenever another template is
  // opened in place — the choice was about the template they were looking at.
  const skipGit = ref(false)

  const usesGit = computed(() => repositoryMode.value !== 'none' && !skipGit.value)

  // Git scope: the account or organization the repository will be created under. The
  // roster is the ACCOUNT's linked Git accounts (../../lib/state/git-provider.js), which is
  // also what the Creation Center's importer lists. It used to be three names hard-coded
  // here, so this page offered a choice of accounts to a reader who had connected none.
  //
  // A repo import arrives with its owner on the URL (that is the account it was listed
  // from); a template deploy starts on the first linked account.
  const scope = ref(String(route.query.owner || ''))

  watch(
    gitAccounts,
    (accounts) => {
      if (!accounts.length) return
      if (accounts.some((account) => account.value === scope.value)) return
      scope.value = accounts[0].value
    },
    { immediate: true }
  )

  // Repository visibility. Public is the default ("lock out"); flipping the
  // switch off makes the repository private ("lock in").
  const isPublic = ref(true)

  // ONE FIELD, TWO JOBS. It names the thing being deployed; when a repository is created
  // it is also that repository's name, and the visibility toggle beside it applies. With
  // no repository there is nothing to make public or private, so the field is just the
  // project's name.
  const repoLabel = computed(() => {
    if (!usesGit.value) return 'Project Name'
    return isPublic.value ? 'Public Repository Name' : 'Private Repository Name'
  })
  const repoPlaceholder = computed(() => (usesGit.value ? 'my-repository' : 'my-project'))

  // What the form says it is about to do, which is a different act in each mode.
  const formIntro = computed(() => {
    if (repositoryMode.value === 'none') {
      return isUpload.value
        ? 'Azion deploys these files once. Connect a Git provider later to ship every push automatically.'
        : 'Azion provisions this template directly. There is no repository to connect.'
    }
    if (!usesGit.value) {
      return 'Azion deploys this code once. Connect a Git provider later to ship every push automatically.'
    }
    return 'Azion deploys from this repository and ships every push automatically.'
  })

  // ── THE PROJECT THE READER DROPPED ──
  //
  // The name and the framework came across on the URL; the FILES came across in the store,
  // because a `File` has no query-string form (../../lib/state/dropped-project.js says why).
  // A reload therefore keeps the form and loses the listing, which is the honest outcome —
  // the browser no longer holds the files, so the screen falls back to what a template
  // deploy shows and the reader can drop the project again to get the listing back.
  const dropped = computed(() =>
    isUpload.value ? droppedProjectFor(String(route.query.upload)) : null
  )

  const picksRoot = computed(() =>
    picksRootFile({ files: dropped.value?.files ?? [], framework: template.value.framework })
  )

  // Which dropped file answers `GET /`. Seeded with the drop's own best answer
  // (`index.html` when there is one) and re-seeded whenever another project is opened in
  // place, so the previous drop's root never carries into the next one's form.
  const rootFile = ref(defaultRootFile(dropped.value?.files))

  const settingsTitle = computed(() => {
    if (!isUpload.value) return 'Template Settings'
    return dropped.value ? 'Project Files' : 'Project Settings'
  })
  const settingsEmpty = computed(() =>
    isUpload.value
      ? 'This project needs no additional settings.'
      : 'This template has no additional settings.'
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
    rootFile.value = defaultRootFile(dropped.value?.files)
    Object.keys(settingsValues).forEach((k) => delete settingsValues[k])
    t.settings.forEach((s) => (settingsValues[s.name] = ''))

    // Only a TEMPLATE has a settings schema to go and get. An upload's fields are the
    // files already sitting in memory, so running the placeholder here would reserve
    // space for a fetch that never happens and delay a listing we can draw immediately.
    if (settingsTimer) clearTimeout(settingsTimer)
    if (isUpload.value) {
      settingsLoading.value = false
      return
    }
    settingsLoading.value = true
    settingsTimer = setTimeout(() => {
      settingsLoading.value = false
    }, 900)
  }
  initFromTemplate(template.value)

  // The leave guard's trigger (ui/UnsavedChangesGuard.vue). The baseline is taken AFTER the
  // first seed, so the values the template itself supplies are the starting point and not
  // an edit — and it is re-taken whenever another template is opened in place, or switching
  // templates would read as unsaved work the reader never typed.
  const { dirty, commit } = useBaseline(() => ({
    repoName: repoName.value,
    rootFile: rootFile.value,
    ...settingsValues
  }))
  watch(
    () => template.value.slug,
    () => {
      skipGit.value = false
      initFromTemplate(template.value)
      commit()
    }
  )

  // Deploy is enabled once the repo name, the site's root, and every required setting are
  // filled. The root counts as required exactly when it is asked for — a static drop has
  // nothing else that can answer `GET /`, and a framework drop is never asked.
  const canDeploy = computed(() => {
    if (!repoName.value.trim()) return false
    if (picksRoot.value && !rootFile.value) return false
    return template.value.settings
      .filter((s) => s.required)
      .every((s) => (settingsValues[s.name] || '').trim())
  })

  // Flow status: form -> deploying -> success. The deployment card runs its own
  // internal states and emits `finished`, which advances us to the success view.
  const status = ref('form')

  // WHAT THE FLOW SHOWS, which is not always where the reader has got to. `status` is
  // their progress; connecting a Git provider is a PRECONDITION of the first phase, and
  // the account either meets it or does not.
  //
  // A template's code is cloned into a repository of the reader's own, so the form cannot
  // ask for a repository name and a scope before there is an account for the repository to
  // live in. A reader who came through the Creation Center's importer connected there, and
  // this page opens straight on the form. A reader who came off a TEMPLATE card never
  // passed through it: they used to land on a Scope Select offering three accounts nobody
  // had linked, and a Deploy button that would have created a repository nowhere. Now they
  // get the same connect card the importer shows, then the same flow.
  const phase = computed(() =>
    status.value === 'form' && usesGit.value && !gitConnected.value ? 'connect' : status.value
  )

  // Why the connection is being asked for, in the terms of the thing being deployed.
  const connectDescription = computed(
    () =>
      `Azion clones ${template.value.title} into a repository in your account, then deploys from it on every push.`
  )

  // WHAT THE RUN SAYS IT IS DOING while the logs spin up. The card's default story is a
  // GitHub clone (../../components/deployment/DeploymentFlow.vue), which is right whenever
  // one happens; a deploy with no repository is one subject and no destination, so it
  // describes itself and leaves the second chip undrawn.
  const deploySplash = computed(() =>
    usesGit.value
      ? null
      : {
          verb: 'Deploying',
          icon: templateMark.value.icon || 'pi pi-cloud-upload',
          from: template.value.title
        }
  )

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
  // for it — scrolling back and forth between the preview and the steps to watch
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
      scope: usesGit.value ? scope.value : undefined,
      framework: template.value.framework,
      isPublic: isPublic.value,
      templateTitle: template.value.title,
      // A cloned template leaves a repository behind; an uploaded or dropped project does
      // not, and the application it creates is updated from the reader's own terminal.
      source: usesGit.value ? 'git' : 'cli'
    })
    status.value = 'success'
  }
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <UnsavedChangesGuard :dirty="dirty && phase === 'form'" />

    <!-- Single creation header: back + brand + breadcrumb (hidden on success). -->
    <CreationHeader
      :show-back="phase !== 'success'"
      :breadcrumb="phase !== 'success' ? breadcrumbItems : []"
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
        class="layout-column-focused relative flex flex-col items-center gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-xxl)"
      >
        <!-- Preview strip for the form/deploy phases. On success it gives way
             to the in-card preview shown on the Congratulations card. -->
        <Transition
          @before-enter="onBeforeEnter"
          @before-leave="onBeforeLeave"
          enter-from-class="opacity-0 translate-y-(--spacing-lg)"
          leave-to-class="opacity-0 -translate-y-(--spacing-md)"
        >
          <TemplatePreview
            v-if="phase !== 'success'"
            class="max-w-none! motion-reduce:transition-none! motion-reduce:transform-none!"
            :title="template.title"
            :description="template.description"
            :icon="templateMark.icon"
            :mark-class="templateMark.markClass"
            :cloned="usesGit"
            :repo-owner="template.repoOwner"
            :repo-path="template.repoPath"
          />
        </Transition>

        <Transition
          mode="out-in"
          @before-enter="onBeforeEnter"
          @enter="onPhaseEnter"
          @before-leave="onBeforeLeave"
          enter-from-class="opacity-0 translate-y-(--spacing-lg)"
          leave-to-class="opacity-0 -translate-y-(--spacing-md)"
        >
          <div
            :key="phase"
            class="flex w-full flex-col items-center gap-(--spacing-xl) motion-reduce:transition-none! motion-reduce:transform-none!"
          >
            <!-- No Git provider connected: the flow's first step is connecting one, on
                 the same card the Creation Center's importer shows. The template preview
                 above stays put, so the reader can still see what they picked while being
                 asked for the one thing the deploy cannot be done without. -->
            <template v-if="phase === 'connect'">
              <GitProviderConnect
                class="w-full"
                title="Connect a Git provider"
                :description="connectDescription"
              >
                <!-- THE OTHER WAY THROUGH. Connecting buys push-to-deploy; it does not buy
                     the deploy itself, so refusing it cannot be the end of the flow. Text
                     kind, not a second solid button: the two are not equal offers — one is
                     what we recommend, the other is what we allow. -->
                <template
                  v-if="repositoryMode === 'optional'"
                  #alternative
                >
                  <Button
                    label="Continue without Git"
                    kind="text"
                    size="large"
                    @click="skipGit = true"
                  />
                </template>
              </GitProviderConnect>

              <!-- The way out of the step, same control the form phase carries. -->
              <Button
                label="Browse Templates"
                kind="outlined"
                size="medium"
                @click="goToCreationCenter"
              />
            </template>

            <!-- Configure repository + template settings -->
            <template v-else-if="phase === 'form'">
              <!-- Configuration card -->
              <CardBox class="w-full">
                <template #content>
                  <div class="flex flex-col gap-(--spacing-lg)">
                    <div class="flex flex-col gap-(--spacing-xxs)">
                      <h2 class="text-heading-xs text-(--text-default)">Deploy your project</h2>
                      <p class="text-body-sm text-pretty text-(--text-muted)">
                        {{ formIntro }}
                      </p>
                    </div>

                    <!-- Scope + repository name — a PAIR only when a repository is being
                         created. With none, the scope has nothing to own and the
                         visibility switch has nothing to hide, so the grid collapses to the
                         one field that still means something: what to call this. -->
                    <div
                      class="grid grid-cols-1 items-start gap-(--spacing-lg)"
                      :class="usesGit ? 'sm:grid-cols-2' : ''"
                    >
                      <div
                        v-if="usesGit"
                        class="flex flex-col gap-(--spacing-xs)"
                      >
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
                          :display-value="
                            (v) => gitAccounts.find((s) => s.value === v)?.label ?? ''
                          "
                        >
                          <Select.Trigger />
                          <Select.Content>
                            <Select.Option
                              v-for="s in gitAccounts"
                              :key="s.value"
                              :value="s.value"
                            >
                              {{ s.label }}
                            </Select.Option>
                          </Select.Content>
                        </Select>
                      </div>

                      <div class="flex flex-col gap-(--spacing-xs)">
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
                            :placeholder="repoPlaceholder"
                            class="flex-1"
                            :disabled="submitting"
                          />
                          <InputGroupAddon v-if="usesGit">
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
                    <h3 class="text-heading-xxs text-(--text-default)">{{ settingsTitle }}</h3>
                    <!-- While the template's settings schema loads, reserve the
                         layout with Skeleton placeholders (label + field +
                         helper text) so nothing jumps when it resolves. -->
                    <div
                      v-if="settingsLoading"
                      class="flex flex-col gap-(--spacing-lg)"
                      aria-busy="true"
                    >
                      <div
                        v-for="n in skeletonFieldCount"
                        :key="n"
                        class="flex flex-col gap-(--spacing-xs)"
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
                      class="flex flex-col gap-(--spacing-lg)"
                    >
                      <div
                        v-for="field in template.settings"
                        :key="field.name"
                        class="flex flex-col gap-(--spacing-xs)"
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
                    <!-- An UPLOAD's settings are its files: what arrived, and which one
                         answers `GET /`. This is the branch a dropped project lands in —
                         `template.settings` is empty for one by construction, so without
                         it the reader named a project over a blank panel. It falls through
                         to the line below when the listing did not survive a reload. -->
                    <UploadedProject
                      v-else-if="dropped"
                      v-model="rootFile"
                      :files="dropped.files"
                      :truncated="dropped.truncated"
                      :framework="template.framework"
                      :disabled="submitting"
                    />
                    <p
                      v-else
                      class="text-body-sm text-(--text-muted)"
                    >
                      {{ settingsEmpty }}
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
            <template v-else-if="phase === 'deploying'">
              <DeploymentFlow
                :repo-owner="template.repoOwner"
                :repo-path="template.repoPath"
                :scope="scope"
                :splash="deploySplash"
                @finished="onDeployFinished"
              />
            </template>

            <!-- Success: the same outcome record every other create in the console ends
                 on (../applications/wizard/DeploySuccess.vue). -->
            <template v-else>
              <DeploySuccess
                title="Congratulations!"
                lead="You just deployed a new application"
                :resources="createdResources"
                :scope="scope"
                :domain="provisioned?.workload?.domain ?? ''"
                @manage="manageWorkload"
              />
            </template>
          </div>
        </Transition>
      </div>
    </main>
  </div>
</template>
