<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText, { type HelperTextKind } from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import RadioButton from '@aziontech/webkit/radio-button'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref } from 'vue'

  interface MarkOption {
    value: string
    label: string
    icon: string
  }

  interface ExtraQuestion {
    key: 'companySize' | 'industry'
    label: string
    options: { value: string; label: string }[]
  }

  const breadcrumb = [{ label: 'Organizations' }, { label: 'Create Organization' }]
  const OWNER = { name: 'Jane Doe', email: 'jane.doe@example.com' }
  const EXISTING_ORGANIZATIONS = ['Acme Inc.', 'Acme Labs']
  const DEFAULT_WORKSPACE = 'Default workspace'
  const SAVE_FAILURES = 0

  const MARKS: MarkOption[] = [
    { value: 'initials', label: 'Initials', icon: '' },
    { value: 'building', label: 'Building', icon: 'pi pi-building' },
    { value: 'globe', label: 'Globe', icon: 'pi pi-globe' },
    { value: 'bolt', label: 'Bolt', icon: 'pi pi-bolt' },
    { value: 'cloud', label: 'Cloud', icon: 'pi pi-cloud' },
    { value: 'star', label: 'Star', icon: 'pi pi-star' }
  ]

  const EXTRA: ExtraQuestion[] = [
    {
      key: 'companySize',
      label: 'Company size',
      options: [
        { value: '1-10', label: '1 to 10 people' },
        { value: '11-50', label: '11 to 50 people' },
        { value: '51-200', label: '51 to 200 people' },
        { value: '201-1000', label: '201 to 1,000 people' },
        { value: '1000+', label: 'More than 1,000 people' }
      ]
    },
    {
      key: 'industry',
      label: 'Industry',
      options: [
        { value: 'ecommerce', label: 'Ecommerce and retail' },
        { value: 'financial', label: 'Financial services' },
        { value: 'media', label: 'Media and streaming' },
        { value: 'saas', label: 'Software and technology' },
        { value: 'gaming', label: 'Gaming' },
        { value: 'other', label: 'Other' }
      ]
    }
  ]

  const form = reactive({
    name: '',
    mark: 'initials',
    workspace: DEFAULT_WORKSPACE,
    companySize: '',
    industry: ''
  })
  const errors = reactive<{ name: string; nameKind: HelperTextKind; workspace: string }>({
    name: '',
    nameKind: 'required',
    workspace: ''
  })
  const advancedOpen = ref(false)
  const submitting = ref(false)
  let failuresLeft = SAVE_FAILURES

  const initials = (value: string) =>
    value
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase()

  const previewName = computed(() => form.name.trim() || 'New organization')
  const markIcon = (value: string) => MARKS.find((mark) => mark.value === value)?.icon ?? ''
  const optionLabel = (question: ExtraQuestion) => (value: string) =>
    question.options.find((option) => option.value === value)?.label ?? ''

  const validate = () => {
    const name = form.name.trim()
    if (!name) {
      errors.nameKind = 'required'
      errors.name = 'This field is required.'
    } else if (EXISTING_ORGANIZATIONS.some((org) => org.toLowerCase() === name.toLowerCase())) {
      errors.nameKind = 'invalid'
      errors.name = 'You already belong to an organization with this name.'
    } else {
      errors.name = ''
    }
    errors.workspace = form.workspace.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.workspace
  }

  const createOrganization = () =>
    new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (failuresLeft > 0) {
          failuresLeft -= 1
          reject(new Error('The service did not answer. Check your connection and try again.'))
          return
        }
        resolve()
      }, 900)
    })

  const submit = async () => {
    if (submitting.value || !validate()) return
    submitting.value = true
    try {
      await createOrganization()
      toast.success(`${form.name.trim()} created.`, {
        description: `You are now in it, as its owner. ${form.workspace.trim()} is ready for your first deploy.`
      })
    } catch (error) {
      toast.error('Could not create the organization.', {
        description: error instanceof Error ? error.message : 'Try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Left>
        <IconButton
          icon="pi pi-chevron-left"
          aria-label="Back to console"
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
            label="JD"
            alt="Jane Doe"
            size="medium"
            kind="square"
          />
        </button>
      </GlobalHeader.Right>
    </GlobalHeader>

    <main class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col">
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-labelledby="create-organization-title"
        novalidate
        @submit.prevent="submit"
      >
        <div class="flex min-h-0 flex-1 flex-col overflow-auto">
          <div
            class="layout-column-form layout-boundary-inline flex flex-1 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeader
              title="Create Organization"
              description="An organization is the outermost space you work in: it owns the workspaces and every resource deployed in them."
              size="small"
              title-id="create-organization-title"
            />

            <fieldset
              class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Create Organization</legend>

              <SettingsSection
                title="General"
                hint="The mark identifies the organization in the header and the switcher, next to its name."
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Name"
                        description="Usually your company's name. Everyone you invite sees it."
                      >
                        <Input
                          v-model="form.name"
                          size="large"
                          class="w-full"
                          aria-label="Name"
                          placeholder="Acme Inc."
                          autocomplete="off"
                          :disabled="submitting"
                          :required="!!errors.name && errors.nameKind === 'required'"
                          :invalid="!!errors.name && errors.nameKind === 'invalid'"
                          :aria-describedby="
                            errors.name ? 'create-organization-name-message' : undefined
                          "
                          @update:model-value="errors.name = ''"
                        />
                        <HelperText
                          v-if="errors.name"
                          id="create-organization-name-message"
                          :kind="errors.nameKind"
                          :label="errors.name"
                        />
                      </SettingRow>
                      <SettingRow
                        title="Mark"
                        description="How the organization is identified in the header and the switcher."
                        kind="stacked"
                      >
                        <div class="flex w-full min-w-0 flex-col gap-(--spacing-md)">
                          <fieldset
                            class="m-0 grid min-w-0 grid-cols-2 gap-(--spacing-sm) border-0 p-0 sm:grid-cols-3"
                          >
                            <legend class="sr-only">Organization mark</legend>
                            <Field.Label
                              v-for="mark in MARKS"
                              :key="mark.value"
                            >
                              <Field
                                orientation="horizontal"
                                :disabled="submitting"
                              >
                                <RadioButton
                                  v-model="form.mark"
                                  :value="mark.value"
                                  name="organization-mark"
                                  :input-id="'organization-mark-' + mark.value"
                                />
                                <Field.Content>
                                  <Field.Title>
                                    <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                                      <span
                                        aria-hidden="true"
                                        class="inline-flex shrink-0"
                                      >
                                        <Avatar
                                          :label="mark.icon ? '' : initials(previewName)"
                                          :icon="mark.icon"
                                          size="small"
                                          kind="square"
                                        />
                                      </span>
                                      <span class="truncate">{{ mark.label }}</span>
                                    </span>
                                  </Field.Title>
                                </Field.Content>
                              </Field>
                            </Field.Label>
                          </fieldset>
                          <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                            <p class="m-0 text-overline-sm text-(--text-muted)">In the header</p>
                            <span
                              class="inline-flex min-w-0 max-w-(--container-3xs) items-center gap-(--spacing-xs) self-start rounded-(--shape-button) border border-(--border-muted) bg-(--bg-canvas) px-(--spacing-xs) py-(--spacing-xxs)"
                              data-testid="create-organization__preview"
                            >
                              <span
                                aria-hidden="true"
                                class="inline-flex shrink-0"
                              >
                                <Avatar
                                  :label="markIcon(form.mark) ? '' : initials(previewName)"
                                  :icon="markIcon(form.mark)"
                                  size="small"
                                  kind="square"
                                />
                              </span>
                              <span class="min-w-0 truncate text-label-sm text-(--text-default)">
                                {{ previewName }}
                              </span>
                            </span>
                          </div>
                        </div>
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Owner"
                hint="You create it, so you own it. Only an owner can delete an organization."
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <Item size="small">
                        <Item.Media>
                          <Avatar
                            :label="initials(OWNER.name)"
                            :alt="OWNER.name"
                            size="medium"
                            kind="square"
                          />
                        </Item.Media>
                        <Item.Content>
                          <Item.Title>{{ OWNER.name }}</Item.Title>
                          <Item.Description>{{ OWNER.email }}</Item.Description>
                        </Item.Content>
                        <Item.Actions>
                          <Tag
                            label="Owner"
                            severity="primary"
                            size="medium"
                            icon="pi pi-key"
                          />
                          <Tag
                            label="Active"
                            severity="success"
                            size="medium"
                          />
                        </Item.Actions>
                      </Item>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="First workspace"
                hint="A workspace groups the resources of one context, such as a team, an environment or a kind of application."
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Name"
                        description="Where the organization's first workloads and resources live. You can add more workspaces once the organization exists."
                      >
                        <Input
                          v-model="form.workspace"
                          size="large"
                          class="w-full"
                          aria-label="Workspace name"
                          :placeholder="DEFAULT_WORKSPACE"
                          autocomplete="off"
                          :disabled="submitting"
                          :required="!!errors.workspace"
                          :aria-describedby="
                            errors.workspace ? 'create-organization-workspace-message' : undefined
                          "
                          @update:model-value="errors.workspace = ''"
                        />
                        <HelperText
                          v-if="errors.workspace"
                          id="create-organization-workspace-message"
                          kind="required"
                          :label="errors.workspace"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                v-model:open="advancedOpen"
                title="Advanced"
                hint="Stored with the organization and used to shape what we recommend inside it."
                icon="pi pi-cog"
                collapsible
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        v-for="question in EXTRA"
                        :key="question.key"
                        :title="question.label"
                      >
                        <Select
                          v-model="form[question.key]"
                          size="large"
                          placeholder="Select an option"
                          :disabled="submitting"
                          :display-value="optionLabel(question)"
                        >
                          <Select.Trigger
                            class="w-full"
                            :aria-label="question.label"
                          />
                          <Select.Content>
                            <Select.Option
                              v-for="option in question.options"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </Select.Option>
                          </Select.Content>
                        </Select>
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
            </fieldset>
          </div>
          <SaveBar kind="centered">
            <template #actions>
              <Button
                type="button"
                label="Cancel"
                kind="outlined"
                size="medium"
                :disabled="submitting"
              />
              <Button
                label="Create Organization"
                kind="primary"
                size="medium"
                type="submit"
                :loading="submitting"
              />
            </template>
          </SaveBar>
        </div>
      </form>
    </main>
  </div>
</template>
