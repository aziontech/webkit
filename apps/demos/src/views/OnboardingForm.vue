<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Progress from '@aziontech/webkit/progress'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'

  const accents = [
    {
      value: 'orange',
      label: 'Orange',
      ariaLabel: 'Orange mark',
      colors: ['var(--color-orange-200)', 'var(--color-orange-700)', 'var(--color-yellow-400)']
    },
    {
      value: 'yellow',
      label: 'Yellow',
      ariaLabel: 'Yellow mark',
      colors: ['var(--color-yellow-200)', 'var(--color-orange-600)', 'var(--color-yellow-600)']
    },
    {
      value: 'red',
      label: 'Red',
      ariaLabel: 'Red mark',
      colors: ['var(--color-red-200)', 'var(--color-red-700)', 'var(--color-orange-500)']
    },
    {
      value: 'green',
      label: 'Green',
      ariaLabel: 'Green mark',
      colors: ['var(--color-green-200)', 'var(--color-green-700)', 'var(--color-blue-500)']
    },
    {
      value: 'blue',
      label: 'Blue',
      ariaLabel: 'Blue mark',
      colors: ['var(--color-blue-200)', 'var(--color-blue-700)', 'var(--color-violet-500)']
    },
    {
      value: 'violet',
      label: 'Violet',
      ariaLabel: 'Violet mark',
      colors: ['var(--color-violet-200)', 'var(--color-violet-700)', 'var(--color-blue-500)']
    },
    {
      value: 'gray',
      label: 'Gray',
      ariaLabel: 'Gray mark',
      colors: ['var(--color-gray-200)', 'var(--color-gray-700)', 'var(--color-slate-500)']
    }
  ]
  const email = 'myemail@example.com'

  const fullName = ref('')
  const organizationName = ref('')
  const accent = ref('orange')
  const submitted = ref(false)
  const router = useRouter()
  const next = () => {
    submitted.value = true
    if (fullName.value.trim() && organizationName.value.trim()) router.push('/onboarding/plan')
  }

  const accountInitials = (name) => {
    const words = String(name ?? '')
      .trim()
      .split(/\s+/)
      .filter((word) => /^[\p{L}\p{N}]/u.test(word))
    if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase()
    return (words[0] ?? '').slice(0, 2).toUpperCase()
  }

  const previewName = computed(() => organizationName.value.trim() || 'Your organization')
  const ownerName = computed(() => fullName.value.trim() || email.split('@')[0])
  const accentColors = computed(
    () => (accents.find((item) => item.value === accent.value) ?? accents[0]).colors
  )
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
      <GlobalHeader.Center />
      <GlobalHeader.End>
        <Button
          label="Documentation"
          kind="outlined"
          size="medium"
          icon="ai ai-book"
          href="https://example.com/docs"
        />
      </GlobalHeader.End>
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
                :value="1"
                :max="3"
                size="small"
                kind="flat"
                class="shrink-0"
                aria-label="Step 1 of 3"
              />

              <div
                class="transition-[height] duration-moderate-02 ease-productive-entrance data-resizing:overflow-hidden motion-reduce:transition-none"
              >
                <form
                  class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)"
                  aria-labelledby="onboarding-title"
                  novalidate
                  @submit.prevent="next"
                >
                  <header class="flex flex-col gap-(--spacing-xs)">
                    <div class="flex flex-col gap-(--spacing-xxs)">
                      <p class="text-label-sm text-(--text-muted)">Step 1 of 3</p>
                      <h1
                        id="onboarding-title"
                        tabindex="-1"
                        class="text-heading-sm text-(--text-default) focus:outline-none"
                      >
                        Create your organization
                      </h1>
                    </div>
                    <p class="text-body-sm text-(--text-muted)">
                      Everything you deploy lives inside an organization. Yours is created once,
                      here, and you can invite people into it afterwards.
                    </p>
                  </header>

                  <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0">
                    <legend class="sr-only">Create your organization</legend>

                    <div class="animate-fade-in motion-reduce:animate-none">
                      <div class="flex flex-col gap-(--spacing-lg)">
                        <Field :required="submitted && !fullName.trim()">
                          <Field.Label>Your full name</Field.Label>
                          <Input
                            v-model="fullName"
                            name="fullName"
                            size="large"
                            placeholder="Jane Doe"
                            autocomplete="name"
                          />
                          <Field.Description>{{
                            submitted && !fullName.trim()
                              ? 'This field is required.'
                              : 'How the app will greet you.'
                          }}</Field.Description>
                        </Field>

                        <Field :required="submitted && !organizationName.trim()">
                          <Field.Label>Organization name</Field.Label>
                          <Input
                            v-model="organizationName"
                            name="organizationName"
                            size="large"
                            placeholder="Acme Inc."
                          />
                          <Field.Description>{{
                            submitted && !organizationName.trim()
                              ? 'This field is required.'
                              : 'Usually your company. Everyone you invite will see it.'
                          }}</Field.Description>
                        </Field>

                        <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-xs) border-0 p-0">
                          <Field.Legend kind="label">Organization mark</Field.Legend>
                          <RadioGroup
                            v-model="accent"
                            kind="card"
                            orientation="horizontal"
                            :options="accents"
                            aria-label="Organization mark"
                            class="w-full"
                          >
                            <template #option="{ option }">
                              <span class="flex flex-col items-center gap-(--spacing-xs)">
                                <Avatar
                                  :label="previewName"
                                  :alt="option.label"
                                  :colors="option.colors"
                                  pattern="marble"
                                  size="medium"
                                  kind="square"
                                />
                                <span class="text-body-xs text-(--text-muted)">{{
                                  option.label
                                }}</span>
                              </span>
                            </template>
                          </RadioGroup>
                          <HelperText
                            label="Generated from the organization's name. Select its color."
                          />
                        </fieldset>
                      </div>
                    </div>
                  </fieldset>

                  <div class="flex items-center gap-(--spacing-sm)">
                    <div class="flex flex-1">
                      <Button
                        label="Continue"
                        kind="primary"
                        size="large"
                        class="w-full"
                        type="submit"
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
                    :alt="previewName"
                    :colors="accentColors"
                    pattern="marble"
                    size="small"
                    kind="square"
                    class="shrink-0"
                  />
                  <span class="min-w-0 truncate text-label-md font-medium text-(--text-default)">
                    {{ previewName }}
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
                      :label="accountInitials(ownerName)"
                      size="medium"
                      kind="square"
                    />
                    <span class="flex min-w-0 flex-col">
                      <span class="truncate text-label-sm text-(--text-default)">{{
                        ownerName
                      }}</span>
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
                      <p class="truncate text-heading-sm text-(--text-default)">
                        Hello, {{ ownerName }}
                      </p>
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
