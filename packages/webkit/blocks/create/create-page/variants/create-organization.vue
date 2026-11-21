<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Kbd from '@aziontech/webkit/kbd'
  import PageHeader from '@aziontech/webkit/page-header'
  import RadioGroup from '@aziontech/webkit/radio-group-root'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onMounted, reactive, ref } from 'vue'

  import CreationHeader from '../parts/creation-header.vue'
  import DiscardDialog from '../parts/discard-dialog.vue'
  import { useCreateForm } from '../use-create-form'

  interface MarkOption {
    value: string
    label: string
    ariaLabel: string
    colors: string[]
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

  const MARKS: MarkOption[] = [
    {
      value: 'orange',
      label: 'Orange',
      ariaLabel: 'Orange mark',
      colors: ['var(--primary)', 'var(--warning)', 'var(--brand-blue)']
    },
    {
      value: 'yellow',
      label: 'Yellow',
      ariaLabel: 'Yellow mark',
      colors: ['var(--warning-border)', 'var(--warning)', 'var(--warning-foreground)']
    },
    {
      value: 'red',
      label: 'Red',
      ariaLabel: 'Red mark',
      colors: ['var(--danger-border)', 'var(--danger)', 'var(--danger-foreground)']
    },
    {
      value: 'green',
      label: 'Green',
      ariaLabel: 'Green mark',
      colors: ['var(--success-border)', 'var(--success)', 'var(--success-foreground)']
    },
    {
      value: 'blue',
      label: 'Blue',
      ariaLabel: 'Blue mark',
      colors: ['var(--info-border)', 'var(--info)', 'var(--accent)']
    },
    {
      value: 'gray',
      label: 'Gray',
      ariaLabel: 'Gray mark',
      colors: ['var(--border-strong)', 'var(--text-muted)', 'var(--text-default)']
    }
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
    mark: 'orange',
    workspace: DEFAULT_WORKSPACE,
    companySize: '',
    industry: ''
  })
  const errors = reactive<{
    name: string
    nameKind: 'helper' | 'invalid' | 'required'
    workspace: string
  }>({
    name: '',
    nameKind: 'required',
    workspace: ''
  })
  const advancedOpen = ref(false)

  const initials = (value: string) =>
    value
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase()

  const previewName = computed(() => form.name.trim() || 'New organization')
  const markColors = computed(
    () => (MARKS.find((mark) => mark.value === form.mark) ?? MARKS[0]).colors
  )
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

  const nameEl = ref<InstanceType<typeof Input> | null>(null)

  const formEl = ref<HTMLFormElement | null>(null)

  const { guard, submitting, submitButton, leave, submit } = useCreateForm({
    source: () => form,
    formEl,
    shortcutLabel: 'Create organization',
    validate,
    onCreated: () =>
      toast.success(`${form.name.trim()} created.`, {
        description: `You are now in it, as its owner. ${form.workspace.trim()} is ready for your first deploy.`
      }),
    failureTitle: 'Could not create the organization.'
  })

  onMounted(() => nameEl.value?.focus())

  const HEADER_PREVIEW_CLASS =
    'inline-flex min-w-0 max-w-(--container-3xs) items-center gap-(--spacing-xs) self-start rounded-(--shape-button) border border-(--border-muted) bg-(--bg-canvas) px-(--spacing-xs) ' +
    'py-(--spacing-2xs)'
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <CreationHeader
      back-label="Back to console"
      :breadcrumb="breadcrumb"
      account-label="JD"
      account-alt="Jane Doe"
      @back="leave"
    />

    <main class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col">
      <form
        ref="formEl"
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

              <SettingsGroup
                label="General"
                hint="The mark identifies the organization in the header and the switcher, next to its name."
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        stackable
                        title="Name"
                        description="Usually your company's name. Everyone you invite sees it."
                      >
                        <Input
                          ref="nameEl"
                          v-model="form.name"
                          size="large"
                          class="w-full"
                          aria-label="Name"
                          placeholder="Acme Inc."
                          autocomplete="off"
                          :disabled="submitting"
                          required
                          :invalid="!!errors.name"
                          :aria-describedby="
                            errors.name ? 'create-organization-name-message' : undefined
                          "
                          @update:model-value="errors.name = ''"
                        />
                        <FieldError
                          v-if="errors.name"
                          id="create-organization-name-message"
                          >{{ errors.name }}</FieldError
                        >
                      </SettingsRow>
                      <SettingsRow
                        title="Mark"
                        description="How the organization is identified in the header and the switcher."
                        variant="stacked"
                      >
                        <div class="flex w-full min-w-0 flex-col gap-(--spacing-md)">
                          <RadioGroup
                            v-model="form.mark"
                            variant="card"
                            orientation="horizontal"
                            :options="MARKS"
                            :disabled="submitting"
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
                                  variant="square"
                                />
                                <span class="text-body-xs text-(--text-muted)">{{
                                  option.label
                                }}</span>
                              </span>
                            </template>
                          </RadioGroup>
                          <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                            <p class="m-0 text-overline-sm text-(--text-muted)">In the header</p>
                            <span
                              :class="HEADER_PREVIEW_CLASS"
                              data-testid="create-organization__preview"
                            >
                              <span
                                aria-hidden="true"
                                class="inline-flex shrink-0"
                              >
                                <Avatar
                                  :label="previewName"
                                  :colors="markColors"
                                  pattern="marble"
                                  size="small"
                                  variant="square"
                                />
                              </span>
                              <span class="min-w-0 truncate text-label-sm text-(--text-default)">
                                {{ previewName }}
                              </span>
                            </span>
                          </div>
                        </div>
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsGroup>

              <SettingsGroup
                label="Owner"
                hint="You create it, so you own it. Only an owner can delete an organization."
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <Item size="small">
                        <Item.Media>
                          <Avatar
                            :label="initials(OWNER.name)"
                            :alt="OWNER.name"
                            size="medium"
                            variant="square"
                          />
                        </Item.Media>
                        <Item.Content>
                          <Item.Title>{{ OWNER.name }}</Item.Title>
                          <Item.Description>{{ OWNER.email }}</Item.Description>
                        </Item.Content>
                        <Item.Actions>
                          <Tag
                            label="Owner"
                            variant="primary"
                            size="medium"
                            icon="az az-key"
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
              </SettingsGroup>

              <SettingsGroup
                label="First workspace"
                hint="A workspace groups the resources of one context, such as a team, an environment or a kind of application."
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        stackable
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
                          required
                          :invalid="!!errors.workspace"
                          :aria-describedby="
                            errors.workspace ? 'create-organization-workspace-message' : undefined
                          "
                          @update:model-value="errors.workspace = ''"
                        />
                        <FieldError
                          v-if="errors.workspace"
                          id="create-organization-workspace-message"
                          >{{ errors.workspace }}</FieldError
                        >
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsGroup>

              <SettingsGroup
                v-model:open="advancedOpen"
                label="Advanced"
                hint="Stored with the organization and used to shape what we recommend inside it."
                icon="az az-settings"
                collapsible
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        stackable
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
                            <Select.Item
                              v-for="option in question.options"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </Select.Item>
                          </Select.Content>
                        </Select>
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsGroup>
            </fieldset>
          </div>
          <SaveBar variant="centered">
            <template #actions>
              <Button
                type="button"
                label="Cancel"
                variant="outline"
                size="medium"
                :disabled="submitting"
                @click="leave"
              />
              <Button
                variant="primary"
                size="medium"
                v-bind="submitButton"
              >
                Create Organization
                <Kbd
                  meta
                  key-name="enter"
                  size="small"
                  aria-hidden="true"
                />
              </Button>
            </template>
          </SaveBar>
        </div>
      </form>
    </main>
    <DiscardDialog :guard="guard" />
  </div>
</template>
