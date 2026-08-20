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
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import FieldRow from '../../components/form/FieldRow.vue'
  import CreatePage from '../../components/page/CreatePage.vue'
  import Section from '../../components/page/Section.vue'
  import OrgAvatar from '../../components/shell/OrgAvatar.vue'
  import OrgMarkPicker from '../../components/shell/OrgMarkPicker.vue'
  import { useBaseline } from '../../lib/behavior/forms'
  import { accountInitials } from '../../lib/state/accounts.js'
  import {
    additionalDataKeys,
    createOrganization,
    DEFAULT_WORKSPACE_NAME,
    orgAccents,
    statusOf,
    useOrganizations
  } from '../../lib/state/organizations.js'

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

  // The leave guard's trigger (ui/UnsavedChangesGuard.vue, mounted by CreatePage): dirty
  // while the form diverges from the state it opened on. `commit` re-snapshots it, and is
  // called on the way OUT of a successful create — the page's own navigation must not be
  // stopped by the guard that exists to protect the input that create just consumed.
  const { dirty, commit } = useBaseline(form)

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
      commit() // the create landed — the leave guard stands down
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
  <CreatePage
    :breadcrumb="[{ label: 'Organizations' }, { label: 'Create organization' }]"
    back-label="Back to console"
    title="Create organization"
    description="An organization is the outermost thing you work inside: it owns the workspaces, and every resource deployed in them."
    title-id="create-organization-title"
    :submitting="submitting"
    :dirty="dirty"
    save-label="Create organization"
    @cancel="cancel"
    @submit="submit"
  >
    <Section
      stacked
      :divided="false"
      title="General"
      hint="The mark is generated from the name, so no two organizations look alike — you only pick its colour."
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <FieldRow
              title="Name"
              description="Usually your company's name. Everyone you invite will see it."
              :message="submitting ? '' : errors.name"
              :message-kind="form.name.trim() ? 'invalid' : 'required'"
            >
              <template #default="{ messageId }">
                <InputText
                  v-model="form.name"
                  size="large"
                  class="w-full"
                  aria-label="Name"
                  placeholder="Acme Inc."
                  autocomplete="off"
                  :disabled="submitting"
                  :required="!!errors.name && !form.name.trim()"
                  :invalid="!!errors.name && !!form.name.trim()"
                  :aria-describedby="messageId"
                  @update:model-value="errors.name = ''"
                />
              </template>
            </FieldRow>

            <!-- The picker is a swatch row, not a 256px control, so the row stacks
                 and shows the result underneath: the header chip is the one place
                 the name and the mark are seen together, every day. -->
            <FieldRow
              kind="wide"
              title="Mark"
              description="How the organization is identified in the header and the switcher."
            >
              <div class="flex flex-col gap-(--spacing-md)">
                <OrgMarkPicker
                  v-model="form.accent"
                  :disabled="submitting"
                />
                <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                  <p class="text-overline-sm text-(--text-muted)">In the header</p>
                  <span
                    class="inline-flex min-w-0 max-w-[14rem] items-center gap-1.5 self-start rounded-(--shape-button) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-canvas) px-(--spacing-xs) py-(--spacing-xxs)"
                  >
                    <OrgAvatar
                      :name="previewName"
                      :accent="form.accent"
                      size="small"
                    />
                    <span class="min-w-0 truncate text-label-sm font-medium text-(--text-default)">
                      {{ previewName }}
                    </span>
                  </span>
                </div>
              </div>
            </FieldRow>
          </Item.List>
        </template>
      </CardBox>
    </Section>

    <!-- Stated, not asked. An invitation can never carry ownership, so an
         organization's owner is always whoever created it — the person filling in
         this form. -->
    <Section
      stacked
      :divided="false"
      title="Owner"
      hint="You create it, so you own it — and only an owner can delete an organization. You can promote other organization users to owner later; invited users can never be owners."
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <Item size="small">
              <Item.Media>
                <Avatar
                  :label="accountInitials(ownerName)"
                  size="medium"
                  kind="square"
                />
              </Item.Media>
              <Item.Content>
                <Item.Title>{{ ownerName }}</Item.Title>
                <Item.Description>{{ userEmail }}</Item.Description>
              </Item.Content>
              <Item.Actions class="justify-end">
                <Tag
                  label="Owner"
                  severity="primary"
                  size="medium"
                  icon="pi pi-key"
                />
                <Tag
                  :label="status.label"
                  :severity="status.severity"
                  size="medium"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </CardBox>
    </Section>

    <Section
      stacked
      :divided="false"
      title="First workspace"
      hint="A workspace groups the resources of one context — a team, an environment, a kind of application. You can add more, and group them, once the organization exists."
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <FieldRow
              title="Name"
              description="Where the organization's first workloads and resources will live."
              :message="submitting ? '' : errors.workspace"
              message-kind="required"
            >
              <template #default="{ messageId }">
                <InputText
                  v-model="form.workspace"
                  size="large"
                  class="w-full"
                  aria-label="Workspace name"
                  :placeholder="DEFAULT_WORKSPACE_NAME"
                  autocomplete="off"
                  :disabled="submitting"
                  :required="!!errors.workspace"
                  :aria-describedby="messageId"
                  @update:model-value="errors.workspace = ''"
                />
              </template>
            </FieldRow>
          </Item.List>
        </template>
      </CardBox>
    </Section>

    <!-- The generic key–value model, one row per key, each offering only that key's
         accepted values. Every one is optional and none carries a default worth
         showing at rest, so the whole band is the disclosure. -->
    <Section
      stacked
      collapsible
      :divided="false"
      icon="pi pi-cog"
      title="Advanced"
      hint="Stored with the organization as additional data, and used to shape what we recommend inside it."
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <FieldRow
              v-for="entry in additionalDataKeys"
              :key="entry.key"
              :title="entry.label"
            >
              <!-- No :disabled here, deliberately — the enclosing
                   `<fieldset :disabled>` already blocks the trigger (a native
                   button, so an ancestor disabled fieldset covers it). Passing the
                   prop as well would make Select mint its own "This field is
                   locked." helper line under all four for the 900ms of the request:
                   layout shift, and a claim of a permanent lock for what is a
                   transient wait the Create button's :loading already states. -->
              <Select
                v-model="form.additionalData[entry.key]"
                size="large"
                placeholder="Select an option"
                :display-value="
                  (value) => entry.values.find((option) => option.value === value)?.label ?? ''
                "
              >
                <Select.Trigger
                  class="w-full"
                  :aria-label="entry.label"
                />
                <Select.Content>
                  <Select.Option
                    v-for="option in entry.values"
                    :key="String(option.value)"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </FieldRow>
          </Item.List>
        </template>
      </CardBox>
    </Section>
  </CreatePage>
</template>
