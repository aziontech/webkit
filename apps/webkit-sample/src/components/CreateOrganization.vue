<script setup>
  // Create Organization — the console's creation flow for a new organization
  // (route /organizations/new), reached from the header's organization switcher.
  //
  // A focused creation shell (the `/navigation` skill): the console sidebar is
  // dropped so the single task owns the screen, and the only chrome is one
  // CreationHeader (back + brand + breadcrumb + account avatar). It is a PAGE,
  // not a modal, for the reason every other module create is: an organization has
  // a start and an end, and the URL has to be linkable and back-button-safe.
  //
  // Layout is the standard band stack (the `/form` Fields-separated approach
  // composed inside CardBox sections): each band puts its title + guidance on the
  // left and its field(s) on the right. Validation runs on submit only — an empty
  // required field reveals the amber `required` prompt, and a name that collides
  // with an organization the user already belongs to is the red `invalid` state,
  // because that one is a conflict rather than an omission. One `submitting` flag
  // locks the whole scope (the `/usability` Pattern 1): the fieldset and every
  // control go :disabled, Create shows :loading, the handler is guarded against
  // re-entrancy and released in `finally`.
  //
  // DISABLED YES, HELPER NO — the same rule Sign Up follows. While the scope is
  // locked the guidance lines are withheld and `aria-describedby` drops with them,
  // so nothing describes a field the user cannot type in and no input points at an
  // element that has left the DOM. A requirement sentence under a field that takes
  // no input instructs nobody, and the Create button's :loading is already the
  // message that a wait is happening. Same reasoning as the FieldSelect note below,
  // which is why those four selects mint no locked helper line either.
  //
  // What it creates is what onboarding creates — the same `createOrganization`,
  // so an organization has one shape whichever door it came through: the creator
  // is its OWNER and first Organization User, its status is `active`, and it holds
  // one workspace. Creating also ENTERS it, which is why the flow lands on the
  // console home rather than back where it started: the scope has changed, and
  // returning to a page still showing the old organization's rows would be a lie.
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import FieldSelect from '@aziontech/webkit/field-select'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { accountInitials } from '../accounts.js'
  import {
    additionalDataKeys,
    createOrganization,
    DEFAULT_WORKSPACE_NAME,
    orgAccents,
    statusOf,
    useOrganizations
  } from '../organizations.js'
  import CreationHeader from './ui/CreationHeader.vue'
  import OrgAvatar from './ui/OrgAvatar.vue'
  import OrgMarkPicker from './ui/OrgMarkPicker.vue'
  import PageHeading from './ui/PageHeading.vue'

  const route = useRoute()
  const router = useRouter()

  const { organizations } = useOrganizations()

  // The signed-in user, carried across the flow like every other creation page.
  // They will own what this flow creates.
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')
  const ownerName = computed(() => String(userEmail.value).split('@')[0])

  // A brand-new organization is active, here as at signup.
  const status = statusOf('active')

  const form = reactive({
    name: '',
    accent: orgAccents[0].value,
    workspace: DEFAULT_WORKSPACE_NAME,
    additionalData: Object.fromEntries(additionalDataKeys.map(({ key }) => [key, undefined]))
  })
  const errors = reactive({ name: '', workspace: '' })
  const submitting = ref(false)

  // Two names the user cannot tell apart in the switcher are two rows they will
  // pick the wrong one from, so a collision with an organization they already
  // belong to is refused here rather than deduped silently.
  const nameTaken = (value) =>
    organizations.value.some((org) => org.name.toLowerCase() === value.toLowerCase())

  // Submit-only. Emptiness is the discriminator between the amber `required`
  // prompt and the red `invalid` message.
  const validate = () => {
    const name = form.name.trim()
    errors.name = !name
      ? 'This field is required.'
      : nameTaken(name)
        ? 'You already belong to an organization with this name.'
        : ''
    errors.workspace = form.workspace.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.workspace
  }

  // The name is what the mark is generated from, so the picker (and the header
  // preview beside it) need something to paint before the field is filled.
  const previewName = computed(() => form.name.trim() || 'New organization')

  const answeredAdditionalData = () =>
    Object.fromEntries(Object.entries(form.additionalData).filter(([, value]) => Boolean(value)))

  const cancel = () => router.push({ path: '/home', query: { email: userEmail.value } })

  const submit = async () => {
    if (submitting.value) return // re-entrancy lock
    if (!validate()) return // feedback is now on the fields themselves

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      const organization = createOrganization({
        name: form.name.trim(),
        accent: form.accent,
        workspace: form.workspace.trim(),
        additionalData: answeredAdditionalData(),
        owner: { name: ownerName.value, email: userEmail.value }
      })
      toast.success(`${organization.name} created.`, {
        description: `You're now in it, as its owner. ${organization.workspaces[0].name} is ready for your first deploy.`
      })
      router.push({ path: '/home', query: { email: userEmail.value } })
    } catch (error) {
      toast.error('Could not create the organization.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false // release on success AND failure
    }
  }
</script>

<template>
  <div class="flex h-dvh flex-col bg-[var(--bg-canvas)]">
    <CreationHeader
      :breadcrumb="[{ label: 'Organizations' }, { label: 'Create Organization' }]"
      back-label="Back to console"
      @back="cancel"
      @navigate="cancel"
    />

    <main class="min-h-0 flex-1 overflow-auto">
      <form
        class="flex min-h-full flex-col"
        aria-labelledby="create-organization-title"
        novalidate
        @submit.prevent="submit"
      >
        <!-- Scrollable form body: the heading, then ONE element below it — the
             `<fieldset>` IS the bands wrapper, so it carries the band step and
             spaces its cards with the band gap (see src/styles/layout.css). -->
        <div class="layout-form-create layout-boundary flex flex-1 flex-col">
          <PageHeading
            title="Create Organization"
            description="An organization is the outermost thing you work inside: it owns the workspaces, and every resource deployed in them."
            title-id="create-organization-title"
          />

          <!-- One flag locks every control while the request is in flight. -->
          <fieldset
            class="layout-section-start mx-0 flex min-w-0 flex-col gap-[var(--layout-section-gap)] border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">Create organization</legend>

            <!-- Band: General — the name, and the mark generated from it. -->
            <CardBox>
              <template #content>
                <div
                  class="grid grid-cols-1 gap-[var(--spacing-lg)] md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
                >
                  <div class="flex min-w-0 flex-col gap-[var(--spacing-md)]">
                    <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                      <h2 class="text-heading-xs text-[var(--text-default)]">General</h2>
                      <p class="text-body-sm text-[var(--text-muted)]">
                        Name the organization and pick the colour of its mark. The mark itself is
                        generated from the name, so no two organizations look alike.
                      </p>
                    </div>

                    <!-- How the choice will read in the header — the one place
                         the name and the mark are seen together, every day. -->
                    <div class="flex min-w-0 flex-col gap-[var(--spacing-xs)]">
                      <p class="text-overline-sm text-[var(--text-muted)]">In the header</p>
                      <span
                        class="inline-flex min-w-0 max-w-[14rem] items-center gap-1.5 self-start rounded-[var(--shape-button)] border-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-canvas)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)]"
                      >
                        <OrgAvatar
                          :name="previewName"
                          :accent="form.accent"
                          size="small"
                        />
                        <span
                          class="min-w-0 truncate text-label-sm font-medium text-[var(--text-default)]"
                        >
                          {{ previewName }}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div class="flex w-full flex-col gap-[var(--spacing-lg)]">
                    <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                      <Label
                        for="organization-name"
                        required
                        >Name</Label
                      >
                      <InputText
                        id="organization-name"
                        v-model="form.name"
                        size="large"
                        class="w-full"
                        placeholder="Acme Inc."
                        autocomplete="off"
                        :required="!!errors.name && !form.name.trim()"
                        :invalid="!!errors.name && !!form.name.trim()"
                        :aria-describedby="
                          submitting
                            ? undefined
                            : errors.name
                              ? 'organization-name-error'
                              : 'organization-name-help'
                        "
                        @update:model-value="errors.name = ''"
                      />
                      <HelperText
                        v-if="errors.name && !submitting"
                        id="organization-name-error"
                        key="name-error"
                        :kind="form.name.trim() ? 'invalid' : 'required'"
                        :label="errors.name"
                      />
                      <HelperText
                        v-else-if="!submitting"
                        id="organization-name-help"
                        key="name-help"
                        label="Usually your company's name. Everyone you invite will see it."
                      />
                    </div>

                    <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                      <Label>Mark</Label>
                      <OrgMarkPicker
                        v-model="form.accent"
                        :disabled="submitting"
                      />
                    </div>
                  </div>
                </div>
              </template>
            </CardBox>

            <!-- Band: Owner — stated, not asked. An invitation can never carry
                 ownership, so an organization's owner is always whoever created
                 it, and that is the person filling this form. -->
            <CardBox>
              <template #content>
                <div
                  class="grid grid-cols-1 gap-[var(--spacing-lg)] md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
                >
                  <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                    <h2 class="text-heading-xs text-[var(--text-default)]">Owner</h2>
                    <p class="text-body-sm text-[var(--text-muted)]">
                      You create it, so you own it — and only an owner can delete an organization.
                      You can promote other organization users to owner later; invited users can
                      never be owners.
                    </p>
                  </div>

                  <div
                    class="flex flex-wrap items-center gap-x-[var(--spacing-sm)] gap-y-[var(--spacing-xs)]"
                  >
                    <Avatar
                      :label="accountInitials(ownerName)"
                      size="medium"
                      kind="square"
                    />
                    <span class="flex min-w-0 flex-1 flex-col">
                      <span class="truncate text-label-sm text-[var(--text-default)]">
                        {{ ownerName }}
                      </span>
                      <span class="truncate text-body-xs text-[var(--text-muted)]">
                        {{ userEmail }}
                      </span>
                    </span>
                    <Tag
                      label="Owner"
                      severity="accent"
                      size="medium"
                      icon="pi pi-key"
                    />
                    <Tag
                      :label="status.label"
                      :severity="status.severity"
                      size="medium"
                    />
                  </div>
                </div>
              </template>
            </CardBox>

            <!-- Band: First workspace. Every organization is created with one, so
                 there is somewhere to deploy on day one; Groups (which group
                 workspaces) come later, when there is more than one to group. -->
            <CardBox>
              <template #content>
                <div
                  class="grid grid-cols-1 gap-[var(--spacing-lg)] md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
                >
                  <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                    <h2 class="text-heading-xs text-[var(--text-default)]">First workspace</h2>
                    <p class="text-body-sm text-[var(--text-muted)]">
                      A workspace groups the resources of one context — a team, an environment, a
                      kind of application. You can add more, and group them, once the organization
                      exists.
                    </p>
                  </div>

                  <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                    <Label
                      for="organization-workspace"
                      required
                      >Name</Label
                    >
                    <InputText
                      id="organization-workspace"
                      v-model="form.workspace"
                      size="large"
                      class="w-full"
                      :placeholder="DEFAULT_WORKSPACE_NAME"
                      autocomplete="off"
                      :required="!!errors.workspace"
                      :aria-describedby="
                        submitting
                          ? undefined
                          : errors.workspace
                            ? 'organization-workspace-error'
                            : 'organization-workspace-help'
                      "
                      @update:model-value="errors.workspace = ''"
                    />
                    <HelperText
                      v-if="errors.workspace && !submitting"
                      id="organization-workspace-error"
                      key="workspace-error"
                      kind="required"
                      :label="errors.workspace"
                    />
                    <HelperText
                      v-else-if="!submitting"
                      id="organization-workspace-help"
                      key="workspace-help"
                      label="Where the organization's first workloads and resources will live."
                    />
                  </div>
                </div>
              </template>
            </CardBox>

            <!-- Band: additional data — the generic key–value model, one field per
                 key, each offering only that key's accepted values. Optional; an
                 unanswered key is absent rather than present-and-empty. -->
            <CardBox>
              <template #content>
                <div
                  class="grid grid-cols-1 gap-[var(--spacing-lg)] md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
                >
                  <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                    <h2 class="text-heading-xs text-[var(--text-default)]">
                      About the organization
                    </h2>
                    <p class="text-body-sm text-[var(--text-muted)]">
                      Optional. Stored with the organization as additional data, and used to shape
                      what we recommend inside it.
                    </p>
                  </div>

                  <div class="flex w-full flex-col gap-[var(--spacing-lg)]">
                    <!-- No :disabled here, deliberately — the enclosing
                         `<fieldset :disabled>` already blocks the trigger (it is
                         a native button, so an ancestor disabled fieldset covers
                         it), exactly as it covers the InputText fields above.
                         Passing the prop as well would make FieldSelect mint its
                         own helper line — a lock icon over "This field is
                         locked." — under all four selects for the 900ms of the
                         request: layout shift, and a claim of a permanent lock
                         for what is a transient wait the Create button's
                         :loading already states. -->
                    <FieldSelect
                      v-for="entry in additionalDataKeys"
                      :key="entry.key"
                      v-model="form.additionalData[entry.key]"
                      :label="entry.label"
                      :options="entry.values"
                      :input-id="`organization-${entry.key}`"
                      placeholder="Select an option"
                      size="large"
                    />
                  </div>
                </div>
              </template>
            </CardBox>
          </fieldset>
        </div>

        <!-- Sticky action bar, as on every creation page. The scope stays locked
             while the request is in flight. -->
        <footer
          class="sticky bottom-0 z-10 border-t-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface)]"
        >
          <div
            class="layout-form-create layout-boundary-inline flex items-center justify-end gap-[var(--spacing-sm)] py-[var(--spacing-md)]"
          >
            <Button
              type="button"
              label="Cancel"
              kind="outlined"
              size="medium"
              :disabled="submitting"
              @click="cancel"
            />
            <!-- webkit Button renders a native type="button" and does not forward
                 a type prop, so drive submit from its click event. -->
            <Button
              label="Create organization"
              kind="primary"
              size="medium"
              :loading="submitting"
              @click="submit"
            />
          </div>
        </footer>
      </form>
    </main>
  </div>
</template>
