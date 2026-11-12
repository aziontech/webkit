<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import Label from '@aziontech/webkit/label'
  import Progress from '@aziontech/webkit/progress'
  import RadioCards from '@aziontech/webkit/radio-cards'
  import Switch from '@aziontech/webkit/switch'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const usageOptions = [
    { value: 'personal', label: 'Personal' },
    { value: 'work', label: 'Work' },
    { value: 'study', label: 'Study' }
  ]
  const roleOptions = [
    { value: 'software_developer', label: 'Software developer' },
    { value: 'devops_engineer', label: 'DevOps engineer' },
    { value: 'infrastructure_analyst', label: 'Infrastructure analyst' },
    { value: 'network_engineer', label: 'Network engineer' },
    { value: 'security_specialist', label: 'Security specialist' },
    { value: 'data_engineer', label: 'Data engineer' },
    { value: 'ai_ml_engineer', label: 'AI/ML engineer' },
    { value: 'iot_engineer', label: 'IoT engineer' },
    { value: 'team_lead', label: 'Team lead' },
    { value: 'other', label: 'Other' }
  ]

  const usage = ref()
  const role = ref()
  const session = ref(false)
  const submitted = ref(false)
  const creating = ref(false)
  const outcome = ref('')

  const router = useRouter()

  const createOrganization = () => {
    if (creating.value) return
    submitted.value = true
    outcome.value = ''
    if (!usage.value || !role.value) return
    creating.value = true
    setTimeout(() => {
      creating.value = false
      outcome.value = navigator.onLine ? 'created' : 'failed'
      if (outcome.value === 'created') setTimeout(() => router.push('/resources'), 1200)
    }, 900)
  }
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <GlobalHeader
      aria-label="Console"
      class="shrink-0"
    >
      <GlobalHeader.Brand>
        <a
          href="/"
          aria-label="Azion home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Brand
            kind="default"
            size="small"
          />
        </a>
      </GlobalHeader.Brand>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <Button
          label="Documentation"
          kind="outlined"
          size="medium"
          icon="pi pi-book"
          href="https://example.com/docs"
        />
      </GlobalHeader.Right>
    </GlobalHeader>

    <main class="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
      <div
        class="mx-auto grid w-full max-w-(--container-7xl) flex-1 grid-cols-1 items-center gap-(--spacing-xxl) px-(--layout-boundary-inline) py-(--spacing-xl) lg:min-h-0 lg:grid-cols-2 lg:items-start lg:overflow-y-auto lg:px-(--spacing-xl)"
      >
        <div class="mx-auto flex w-full max-w-(--container-xl) flex-col lg:my-auto">
          <Card
            :padded="false"
            class="w-full"
          >
            <template #content>
              <Progress
                :value="3"
                :max="3"
                size="small"
                shape="flat"
                class="shrink-0"
                aria-label="Step 3 of 3"
              />

              <div
                class="transition-[height] duration-moderate-02 ease-productive-entrance data-resizing:overflow-hidden motion-reduce:transition-none"
              >
                <form
                  class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)"
                  aria-labelledby="onboarding-title"
                  novalidate
                  @submit.prevent="createOrganization"
                >
                  <header class="flex flex-col gap-(--spacing-xs)">
                    <div class="flex flex-col gap-(--spacing-xxs)">
                      <p class="text-label-sm text-(--text-muted)">Step 3 of 3</p>
                      <h1
                        id="onboarding-title"
                        tabindex="-1"
                        class="text-heading-sm text-(--text-default) focus:outline-none"
                      >
                        Tell us about your work
                      </h1>
                    </div>
                    <p class="text-body-sm text-(--text-muted)">
                      Two answers, and they only shape what we recommend you next. Neither changes
                      your plan or what you can do.
                    </p>
                  </header>

                  <Alert
                    v-if="outcome === 'failed'"
                    key="failed"
                    severity="danger"
                    size="small"
                    label="The organization wasn't created. Check your connection, then retry. Your answers are kept."
                  >
                    <template #action>
                      <Button
                        label="Retry"
                        kind="secondary"
                        size="small"
                        @click="createOrganization"
                      />
                    </template>
                  </Alert>
                  <Alert
                    v-else-if="outcome === 'created'"
                    key="created"
                    severity="success"
                    size="small"
                    label="Organization created."
                  />

                  <fieldset
                    class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
                    :disabled="creating"
                  >
                    <legend class="sr-only">Tell us about your work</legend>

                    <div class="animate-fade-in motion-reduce:animate-none">
                      <div class="flex flex-col gap-(--spacing-lg)">
                        <div class="flex flex-col gap-(--spacing-xs)">
                          <Label :required="submitted && !usage"
                            >How are you planning to use the platform?</Label
                          >
                          <RadioCards
                            v-model="usage"
                            :items="usageOptions"
                            aria-label="How are you planning to use the platform?"
                          />
                          <HelperText
                            v-if="submitted && !usage"
                            kind="required"
                            label="Select one to continue."
                          />
                        </div>

                        <div class="flex flex-col gap-(--spacing-xs)">
                          <Label :required="submitted && !role"
                            >What best describes your role?</Label
                          >
                          <RadioCards
                            v-model="role"
                            :items="roleOptions"
                            aria-label="What best describes your role?"
                          />
                          <HelperText
                            v-if="submitted && !role"
                            kind="required"
                            label="Select one to continue."
                          />
                        </div>

                        <Field.Label>
                          <Field orientation="horizontal">
                            <Switch v-model="session" />
                            <Field.Content>
                              <Field.Title
                                >Schedule an onboarding session with an expert</Field.Title
                              >
                              <Field.Description
                                >A 30-minute call to create your first project. We'll email you to
                                schedule it.</Field.Description
                              >
                            </Field.Content>
                          </Field>
                        </Field.Label>
                      </div>
                    </div>
                  </fieldset>

                  <div class="flex items-center gap-(--spacing-sm)">
                    <Button
                      label="Back"
                      kind="outlined"
                      size="large"
                      :disabled="creating"
                      @click="router.push('/onboarding/plan')"
                    />
                    <div class="flex flex-1">
                      <Button
                        label="Create Organization"
                        kind="primary"
                        size="large"
                        class="w-full"
                        type="submit"
                        :loading="creating"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </template>
          </Card>
        </div>

        <div class="lg:sticky lg:top-(--spacing-xl) lg:my-auto lg:-me-(--spacing-xl)">
          <div
            class="relative hidden h-[calc(100dvh-12rem)] max-h-(--container-xl) min-h-(--container-sm) overflow-hidden mask-r-from-72% mask-b-from-80% lg:block"
          >
            <figure
              class="pointer-events-none absolute inset-y-0 start-0 m-0 flex w-(--container-3xl) flex-col overflow-hidden rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) select-none"
              aria-hidden="true"
            >
              <div
                class="flex h-(--size-14) shrink-0 items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-(--border-muted) px-(--spacing-md)"
              >
                <span
                  class="size-(--size-5) shrink-0 rounded-(--shape-elements) bg-(--bg-placeholder)"
                />

                <span class="shrink-0 text-body-sm text-(--text-muted)">/</span>

                <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <Avatar
                    src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2080%2080%22%20fill%3D%22none%22%3E%3Cdefs%3E%3Cfilter%20id%3D%22blur%22%20filterUnits%3D%22userSpaceOnUse%22%20color-interpolation-filters%3D%22sRGB%22%3E%3CfeGaussianBlur%20stdDeviation%3D%227%22%20%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%2280%22%20height%3D%2280%22%20fill%3D%22%23F8CA3A%22%20%2F%3E%3Cpath%20filter%3D%22url(%23blur)%22%20transform%3D%22translate(0%200)%20rotate(-280%2040%2040)%20scale(1.2)%22%20fill%3D%22%23FFCFB3%22%20d%3D%22M32.414%2059.35L50.376%2070.5H72.5v-71H33.728L26.5%2013.381l19.057%2027.08L32.414%2059.35z%22%20%2F%3E%3Cpath%20filter%3D%22url(%23blur)%22%20transform%3D%22translate(0%200)%20rotate(-240%2040%2040)%20scale(1.2)%22%20fill%3D%22%23B03C02%22%20style%3D%22mix-blend-mode%3A%20overlay%22%20d%3D%22M22.216%2024L0%2046.75l14.108%2038.129L78%2086l-3.081-59.276-22.378%204.005%2012.972%2020.186-23.35%2027.395L22.215%2024z%22%20%2F%3E%3C%2Fsvg%3E"
                    alt="Your organization"
                    size="small"
                    kind="square"
                    class="shrink-0"
                  />
                  <span class="min-w-0 truncate text-label-md font-medium text-(--text-default)">
                    Your organization
                  </span>
                </span>

                <span class="shrink-0 text-body-sm text-(--text-muted)">/</span>

                <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <Avatar
                    label="MW"
                    size="small"
                    kind="square"
                    class="shrink-0"
                  />
                  <span class="min-w-0 truncate text-label-md font-medium text-(--text-default)">
                    My Workspace
                  </span>
                </span>

                <span class="ms-auto flex shrink-0 items-center gap-(--spacing-sm)">
                  <span
                    class="h-(--size-8) w-(--size-20) rounded-(--shape-button) bg-(--bg-placeholder)"
                  />
                  <span
                    class="h-(--size-8) w-(--size-20) rounded-(--shape-button) bg-(--bg-placeholder)"
                  />
                  <span class="size-(--size-8) rounded-(--shape-button) bg-(--bg-placeholder)" />
                </span>
              </div>

              <div class="flex min-h-0 flex-1">
                <div
                  class="flex w-(--size-60) shrink-0 flex-col gap-(--spacing-md) overflow-hidden border-e-(length:--border-width-default) border-(--border-muted) p-(--spacing-md)"
                >
                  <span
                    class="h-(--size-9) w-full shrink-0 rounded-(--shape-button) bg-(--bg-placeholder)"
                  />

                  <div class="flex shrink-0 flex-col gap-(--spacing-sm)">
                    <span
                      v-for="width in ['58%', '76%', '48%', '66%']"
                      :key="width"
                      class="flex items-center gap-(--spacing-sm)"
                    >
                      <span
                        class="size-(--size-4) shrink-0 rounded-(--shape-elements) bg-(--bg-placeholder)"
                      />
                      <span
                        class="h-(--size-2) rounded-(--shape-elements) bg-(--bg-placeholder)"
                        :style="{ width }"
                      />
                    </span>
                  </div>

                  <span class="h-px w-full shrink-0 bg-(--border-muted)" />

                  <div class="flex shrink-0 flex-col gap-(--spacing-sm)">
                    <span class="h-1.5 w-[28%] rounded-(--shape-elements) bg-(--bg-placeholder)" />
                    <span
                      v-for="width in ['70%', '44%', '80%', '54%']"
                      :key="width"
                      class="flex items-center gap-(--spacing-sm)"
                    >
                      <span
                        class="size-(--size-4) shrink-0 rounded-(--shape-elements) bg-(--bg-placeholder)"
                      />
                      <span
                        class="h-(--size-2) rounded-(--shape-elements) bg-(--bg-placeholder)"
                        :style="{ width }"
                      />
                    </span>
                  </div>

                  <div class="flex shrink-0 flex-col gap-(--spacing-sm)">
                    <span class="h-1.5 w-[28%] rounded-(--shape-elements) bg-(--bg-placeholder)" />
                    <span
                      v-for="width in ['62%', '78%', '50%']"
                      :key="width"
                      class="flex items-center gap-(--spacing-sm)"
                    >
                      <span
                        class="size-(--size-4) shrink-0 rounded-(--shape-elements) bg-(--bg-placeholder)"
                      />
                      <span
                        class="h-(--size-2) rounded-(--shape-elements) bg-(--bg-placeholder)"
                        :style="{ width }"
                      />
                    </span>
                  </div>

                  <div
                    class="mt-auto flex min-w-0 shrink-0 items-center gap-(--spacing-xs) border-t-(length:--border-width-default) border-(--border-muted) pt-(--spacing-md)"
                  >
                    <Avatar
                      label="MY"
                      size="medium"
                      kind="square"
                    />
                    <span class="flex min-w-0 flex-col">
                      <span class="truncate text-label-sm text-(--text-default)">myemail</span>
                      <span class="truncate text-body-xs text-(--text-muted)"
                        >myemail@example.com</span
                      >
                    </span>
                  </div>
                </div>

                <div class="min-w-0 flex-1 overflow-hidden bg-(--bg-canvas)">
                  <div
                    class="flex min-h-(--container-2xl) flex-col gap-(--spacing-lg) p-(--spacing-lg)"
                  >
                    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                      <p class="truncate text-heading-sm text-(--text-default)">Hello, myemail</p>
                      <p class="truncate text-body-sm text-(--text-muted)">
                        My Workspace · no projects yet
                      </p>
                    </div>

                    <div class="grid grid-cols-4 gap-(--spacing-md)">
                      <span
                        v-for="tile in 4"
                        :key="tile"
                        class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) p-(--spacing-md)"
                      >
                        <span
                          class="h-(--size-2) w-2/3 rounded-(--shape-elements) bg-(--bg-placeholder)"
                        />
                        <span
                          class="h-(--size-3) w-1/2 rounded-(--shape-elements) bg-(--bg-placeholder)"
                        />
                      </span>
                    </div>

                    <div
                      class="flex flex-1 flex-col rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface)"
                    >
                      <span
                        class="flex shrink-0 items-center justify-between border-b-(length:--border-width-default) border-(--border-muted) p-(--spacing-md)"
                      >
                        <span
                          class="h-(--size-2) w-[28%] rounded-(--shape-elements) bg-(--bg-placeholder)"
                        />
                        <span
                          class="h-(--size-8) w-(--size-24) rounded-(--shape-button) bg-(--bg-placeholder)"
                        />
                      </span>
                      <span
                        v-for="row in 7"
                        :key="row"
                        class="flex shrink-0 items-center gap-(--spacing-lg) px-(--spacing-md) py-(--spacing-md)"
                      >
                        <span
                          class="h-(--size-2) flex-1 rounded-(--shape-elements) bg-(--bg-placeholder)"
                        />
                        <span
                          class="h-(--size-2) w-[18%] rounded-(--shape-elements) bg-(--bg-placeholder)"
                        />
                        <span
                          class="h-(--size-2) w-[10%] rounded-(--shape-elements) bg-(--bg-placeholder)"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </figure>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
