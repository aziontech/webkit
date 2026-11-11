<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Stepper from '@aziontech/webkit/stepper'
  import { computed, nextTick, ref } from 'vue'

  const breadcrumb = [{ label: 'Projects', href: '/projects' }, { label: 'Create Project' }]
  const wizardSteps = [
    { id: 'where', label: 'Where it runs', description: 'Select or create a Service.' },
    { id: 'method', label: 'Select a method' },
    { id: 'source', label: 'Select a source' },
    { id: 'configure', label: 'Create and deploy' }
  ]
  const services = [
    { value: 'service-01', label: 'service-01', description: 'service-01.example.com' },
    { value: 'service-02', label: 'service-02', description: 'service-02.example.com' },
    { value: 'service-03', label: 'service-03', description: 'service-03.example.com' },
    { value: 'service-04', label: 'service-04', description: 'service-04.example.com' },
    { value: 'service-05', label: 'service-05', description: 'service-05.example.com' },
    { value: 'service-06', label: 'service-06', description: 'service-06.example.com' },
    { value: 'service-07', label: 'service-07', description: 'service-07.example.com' },
    { value: 'service-08', label: 'service-08', description: 'service-08.example.com' },
    { value: 'service-09', label: 'service-09', description: 'service-09.example.com' },
    { value: 'service-10', label: 'service-10', description: 'service-10.example.com' },
    { value: 'service-11', label: 'service-11', description: 'service-11.example.com' },
    { value: 'service-12', label: 'service-12', description: 'service-12.example.com' },
    { value: 'service-13', label: 'service-13', description: 'service-13.example.com' },
    { value: 'service-14', label: 'service-14', description: 'service-14.example.com' },
    { value: 'service-15', label: 'service-15', description: 'service-15.example.com' },
    { value: 'service-16', label: 'service-16', description: 'service-16.example.com' },
    { value: 'service-17', label: 'service-17', description: 'service-17.example.com' },
    { value: 'service-18', label: 'service-18', description: 'service-18.example.com' },
    { value: 'service-19', label: 'service-19', description: 'service-19.example.com' },
    { value: 'service-20', label: 'service-20', description: 'service-20.example.com' },
    { value: 'web-prod', label: 'web-prod', description: 'www.example.com' },
    { value: 'web-br-prod', label: 'web-br-prod', description: 'www.example.com.br' },
    { value: 'stage-preview', label: 'stage-preview', description: '*-preview.example.com' },
    { value: 'campaign-landing', label: 'campaign-landing', description: 'campaign.example.com' },
    { value: 'docs-prod', label: 'docs-prod', description: 'docs.example.com' }
  ]
  const methods = [
    {
      id: 'git',
      icon: 'ai ai-github',
      title: 'Import from Git',
      description:
        'Deploy from a repository you already have. Connect the Git account that owns it and select the repository to import.'
    },
    {
      id: 'cli',
      icon: 'pi pi-code',
      title: 'Sync with the CLI',
      description:
        'Create the project now and push to it from your own terminal. The CLI links the local folder, builds it with your framework preset, and keeps its config file in sync. No repository required.'
    },
    {
      id: 'template',
      icon: 'pi pi-objects-column',
      title: 'Start from a template',
      description:
        'Clone a framework starter already wired to build and deploy. Next, Astro, Vue, Nuxt, and more.'
    }
  ]
  const VISIBLE = 6

  const stepIndex = ref(0)
  const steps = computed(() =>
    wizardSteps.map((entry, position) => ({
      value: entry.id,
      title: entry.label,
      description: entry.description ?? '',
      state: position < stepIndex.value ? 'complete' : 'upcoming',
      disabled: position > stepIndex.value
    }))
  )

  const current = computed({
    get: () => wizardSteps[stepIndex.value].id,
    set: (value) => {
      const position = wizardSteps.findIndex((entry) => entry.id === value)
      if (position !== -1 && position < stepIndex.value) stepIndex.value = position
    }
  })

  const goBack = () => {
    if (stepIndex.value > 0) stepIndex.value -= 1
  }

  const service = ref('')
  const whereAnswered = ref(false)
  const query = ref('')
  const creating = ref(false)
  const newName = ref('')
  const nameField = ref(null)

  const matches = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return services
    return services.filter((option) =>
      [option.label, option.description].some((field) => field.toLowerCase().includes(term))
    )
  })
  const visible = computed(() => {
    const head = matches.value.slice(0, VISIBLE)
    if (!service.value || head.some((option) => option.value === service.value)) return head
    const picked = matches.value.find((option) => option.value === service.value)
    return picked ? [picked, ...head.slice(0, VISIBLE - 1)] : head
  })
  const hidden = computed(() => Math.max(0, matches.value.length - visible.value.length))

  const answerWhere = () => {
    whereAnswered.value = true
    stepIndex.value = 1
  }

  const choose = (option) => {
    service.value = option.value
    answerWhere()
  }

  const skip = () => {
    service.value = ''
    answerWhere()
  }

  const startCreating = () => {
    newName.value = query.value.trim()
    creating.value = true
    nextTick(() => nameField.value?.focus?.())
  }

  const cancelCreating = () => {
    creating.value = false
    newName.value = ''
  }

  const confirmCreating = () => {
    const name = newName.value.trim()
    if (!name) return
    creating.value = false
    service.value = name
    answerWhere()
  }

  const onSearchEnter = () => {
    if (matches.value.length) {
      choose(matches.value[0])
      return
    }
    startCreating()
  }

  const nextLabel = computed(() => {
    if (stepIndex.value === 1) return ''
    if (stepIndex.value === 0) return whereAnswered.value ? 'Next' : ''
    return 'Next'
  })

  const advance = () => {
    if (stepIndex.value === 0 && whereAnswered.value) stepIndex.value = 1
  }
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Left>
        <IconButton
          icon="pi pi-chevron-left"
          aria-label="Back to Projects"
          kind="outlined"
          size="small"
        />
        <GlobalHeader.Brand>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
          >
            <Brand
              kind="default"
              size="small"
            />
          </a>
        </GlobalHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            kind="square"
          />
        </button>
      </GlobalHeader.Right>
    </GlobalHeader>

    <div class="flex min-h-0 flex-1">
      <aside
        class="hidden h-full w-64 shrink-0 overflow-auto border-e border-(--border-default) px-(--spacing-md) py-(--layout-section-gap) md:block"
      >
        <div class="flex h-full">
          <Stepper
            v-model="current"
            aria-label="Create Project"
            class="w-full"
          >
            <Stepper.Step
              v-for="entry in steps"
              :key="entry.value"
              :value="entry.value"
              :title="entry.title"
              :description="entry.value === current ? entry.description : ''"
              :state="entry.state"
              :disabled="entry.disabled"
            />
          </Stepper>
        </div>
      </aside>

      <main
        class="animate-page-enter motion-reduce:animate-none flex min-h-0 min-w-0 flex-1 flex-col"
      >
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-labelledby="create-project-title"
          novalidate
          @submit.prevent="advance"
        >
          <div class="min-h-0 flex-1 overflow-y-auto scrollbar-gutter-both">
            <div class="flex min-h-full flex-col pb-(--layout-section-gap)">
              <div
                v-if="stepIndex !== 0"
                class="layout-column-form layout-boundary-inline pb-(--spacing-md) pt-(--spacing-lg)"
              >
                <PageHeader
                  title="Create Project"
                  description="A project is the code the platform runs, and the configuration it runs with. Select where the code comes from and name it. The last step creates it and deploys it to the service you selected."
                  size="small"
                  title-id="create-project-title"
                />
              </div>

              <p
                class="layout-column-form layout-boundary-inline pb-(--spacing-sm) text-label-sm text-(--text-muted) md:hidden"
              >
                Step {{ Math.min(stepIndex + 1, steps.length) }} of {{ steps.length }}
              </p>

              <fieldset
                class="layout-column-form layout-boundary-inline flex min-w-0 flex-col border-0 p-0 pt-(--layout-section-gap)"
              >
                <legend class="sr-only">Create Project</legend>

                <div class="relative">
                  <div
                    :key="current"
                    class="flex min-w-0 flex-col motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    <section
                      v-if="stepIndex === 0"
                      data-wide
                      class="mx-auto flex w-full max-w-(--container-2xs) flex-col items-center gap-(--spacing-lg) data-wide:max-w-(--container-md)"
                      aria-labelledby="create-project-host-title"
                    >
                      <header class="flex flex-col items-center gap-(--spacing-xs) text-center">
                        <span
                          class="flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                        >
                          <i
                            class="pi pi-box text-body-lg leading-none text-(--text-default)"
                            aria-hidden="true"
                          />
                        </span>
                        <h1
                          id="create-project-host-title"
                          class="text-heading-xs text-(--text-default)"
                        >
                          Create Project
                        </h1>
                        <p class="text-body-sm text-(--text-muted)">Select a service to continue</p>
                      </header>

                      <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                        <Input
                          v-model="query"
                          size="large"
                          class="w-full"
                          placeholder="Search services"
                          aria-label="Search services"
                          autocomplete="off"
                          @keydown.enter.prevent="onSearchEnter"
                        />

                        <div
                          v-if="creating"
                          class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
                        >
                          <Field>
                            <Field.Label>New service</Field.Label>
                            <Input
                              ref="nameField"
                              v-model="newName"
                              size="large"
                              placeholder="my-service"
                              @keydown.enter.prevent="confirmCreating"
                            />
                          </Field>
                          <div class="flex items-center justify-end gap-(--spacing-sm)">
                            <Button
                              type="button"
                              label="Back"
                              kind="transparent"
                              size="medium"
                              @click="cancelCreating"
                            />
                            <Button
                              type="button"
                              label="Continue"
                              kind="primary"
                              size="medium"
                              :disabled="!newName.trim()"
                              @click="confirmCreating"
                            />
                          </div>
                        </div>

                        <div
                          v-else
                          class="flex flex-col"
                        >
                          <Item
                            v-for="option in visible"
                            :key="option.value"
                            as-child
                            size="small"
                          >
                            <button
                              type="button"
                              class="w-full text-start data-[selected]:bg-(--bg-selected)"
                              :aria-pressed="service === option.value"
                              :data-selected="service === option.value || null"
                              @click="choose(option)"
                            >
                              <Item.Media>
                                <i
                                  class="pi pi-server text-body-md leading-none text-(--text-muted)"
                                  aria-hidden="true"
                                />
                              </Item.Media>
                              <Item.Content>
                                <Item.Title>{{ option.label }}</Item.Title>
                              </Item.Content>
                              <Item.Actions>
                                <i
                                  v-if="service === option.value"
                                  class="pi pi-check text-body-sm leading-none text-(--text-default)"
                                  aria-hidden="true"
                                />
                              </Item.Actions>
                            </button>
                          </Item>

                          <p
                            v-if="hidden"
                            class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
                          >
                            {{ hidden }} more. Type to narrow the list.
                          </p>
                          <p
                            v-else-if="!matches.length"
                            class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
                          >
                            No service matches “{{ query.trim() }}”.
                          </p>

                          <Item
                            as-child
                            size="small"
                          >
                            <button
                              type="button"
                              class="w-full text-start"
                              @click="startCreating"
                            >
                              <Item.Media>
                                <i
                                  class="pi pi-plus text-body-sm leading-none text-(--text-muted)"
                                  aria-hidden="true"
                                />
                              </Item.Media>
                              <Item.Content>
                                <Item.Title>Create Service</Item.Title>
                              </Item.Content>
                            </button>
                          </Item>
                        </div>
                      </div>

                      <div class="flex flex-col items-center gap-(--spacing-xxs)">
                        <Button
                          type="button"
                          label="Continue without a service"
                          kind="transparent"
                          size="small"
                          @click="skip"
                        />
                      </div>
                    </section>

                    <Card
                      v-else
                      :padded="false"
                      title="How do you want to start?"
                    >
                      <template #content>
                        <Item.List>
                          <Item
                            v-for="method in methods"
                            :key="method.id"
                            as-child
                            size="small"
                          >
                            <button
                              type="button"
                              class="w-full text-start"
                            >
                              <Item.Media>
                                <span
                                  class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                                >
                                  <i
                                    :class="method.icon"
                                    class="text-body-md leading-none text-(--text-default)"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Item.Media>
                              <Item.Content>
                                <Item.Title>{{ method.title }}</Item.Title>
                                <Item.Description>{{ method.description }}</Item.Description>
                              </Item.Content>
                              <Item.Actions>
                                <i
                                  class="pi pi-chevron-right text-(--text-muted)"
                                  aria-hidden="true"
                                />
                              </Item.Actions>
                            </button>
                          </Item>
                        </Item.List>
                      </template>
                    </Card>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>

          <SaveBar
            v-if="stepIndex > 0 || nextLabel"
            kind="fade"
          >
            <template
              v-if="stepIndex > 0"
              #leading
            >
              <Button
                type="button"
                label="Back"
                kind="outlined"
                size="medium"
                @click="goBack"
              />
            </template>
            <template #actions>
              <Button
                v-if="nextLabel"
                :label="nextLabel"
                kind="primary"
                size="medium"
                type="submit"
              />
            </template>
          </SaveBar>
        </form>
      </main>
    </div>
  </div>
</template>
