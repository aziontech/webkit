<script setup>
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

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')
  const ownerName = computed(() => String(userEmail.value).split('@')[0])

  const status = statusOf('active')

  const form = reactive({
    name: '',
    accent: orgAccents[0].value,
    workspace: DEFAULT_WORKSPACE_NAME,
    additionalData: Object.fromEntries(additionalDataKeys.map(({ key }) => [key, undefined]))
  })
  const errors = reactive({ name: '', workspace: '' })
  const submitting = ref(false)

  const { dirty, commit } = useBaseline(form)

  const nameTaken = (value) =>
    organizations.value.some((org) => org.name.toLowerCase() === value.toLowerCase())

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

  const previewName = computed(() => form.name.trim() || 'New organization')

  const answeredAdditionalData = () =>
    Object.fromEntries(Object.entries(form.additionalData).filter(([, value]) => Boolean(value)))

  const cancel = () => router.push({ path: '/home', query: { email: userEmail.value } })

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

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
      commit()
      router.push({ path: '/home', query: { email: userEmail.value } })
    } catch (error) {
      toast.error('Could not create the organization.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <CreatePage
    :breadcrumb="[{ label: 'Organizations' }, { label: 'Create Organization' }]"
    back-label="Back to console"
    title="Create Organization"
    description="An organization is the outermost thing you work inside: it owns the workspaces, and every resource deployed in them."
    title-id="create-organization-title"
    :submitting="submitting"
    :dirty="dirty"
    save-label="Create Organization"
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
                    class="inline-flex min-w-0 max-w-(--size-56) items-center gap-1.5 self-start rounded-(--shape-button) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-canvas) px-(--spacing-xs) py-(--spacing-xxs)"
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

    <Section
      stacked
      :divided="false"
      title="Owner"
      hint="You create it, so you own it, and only an owner can delete an organization."
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
      hint="A workspace groups the resources of one context, such as a team, an environment or a kind of application."
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <FieldRow
              title="Name"
              description="Where the organization's first workloads and resources will live. More workspaces can be added, and grouped, once the organization exists."
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
