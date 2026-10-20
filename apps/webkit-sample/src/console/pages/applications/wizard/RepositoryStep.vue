<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import EmptyState from '@aziontech/webkit/empty-state'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputGroupAddon from '@aziontech/webkit/input-group-addon'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'

  import FieldStack from '../../../components/form/FieldStack.vue'
  import SuccessMark from '../../../components/page/SuccessMark.vue'
  import { ADD_ACCOUNT, useGitAccount } from '../../../lib/behavior/git-account'
  import { useScrollFade } from '../../../lib/behavior/scroll-fade'
  import { GIT_REPOSITORIES } from '../../../lib/data/git-repositories'

  interface Props {
    source?: Record<string, unknown>
    repository?: Record<string, unknown>
    errors?: Record<string, unknown>
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    source: null,
    repository: null,
    errors: () => ({}),
    disabled: false
  })

  const emit = defineEmits<{
    'update:repository': [next: unknown]
  }>()

  const { connected, connecting, reposLoading, scopes, scope, connect, selectScope } =
    useGitAccount()

  const MODES = [
    { label: 'New repository', value: 'new' },
    { label: 'Existing repository', value: 'existing' }
  ]

  const mode = ref(props.repository?.mode ?? 'new')
  const repoName = ref(props.repository?.name ?? props.source?.defaultName ?? '')
  const isPublic = ref(props.repository?.visibility !== 'private')
  const existingName = ref(props.repository?.mode === 'existing' ? props.repository.name : '')
  const search = ref('')

  if (props.repository) connected.value = true

  const { scroller, fadeStyle } = useScrollFade({ max: 32 })

  const filteredRepos = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return GIT_REPOSITORIES
    return GIT_REPOSITORIES.filter((repo) => repo.name.toLowerCase().includes(q))
  })

  const target = computed(() =>
    mode.value === 'new'
      ? {
          mode: 'new',
          owner: scope.value,
          name: repoName.value.trim(),
          visibility: isPublic.value ? 'public' : 'private'
        }
      : { mode: 'existing', owner: scope.value, name: existingName.value, visibility: '' }
  )

  watch(
    [connected, target],
    ([isConnected, next]) => {
      if (isConnected) emit('update:repository', next)
    },
    { immediate: true, deep: true }
  )

  const onSelectScope = (value) => {
    selectScope(value)
    existingName.value = ''
  }
</script>

<template>
  <CardBox
    v-if="!connected"
    key="connect"
    title="Repository"
  >
    <template #content>
      <EmptyState
        icon="pi pi-github"
        size="medium"
        title="Connect a Git account"
        :description="`Azion copies ${source?.title ?? 'the template'} into a repository you own and deploys every push to it. Authorize once. The account stays available for the applications you create later.`"
        class="rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised)"
      >
        <template #actions>
          <Button
            type="button"
            label="Connect GitHub"
            icon="pi pi-github"
            kind="secondary"
            size="large"
            :loading="connecting"
            :disabled="disabled"
            @click="connect"
          />
        </template>
      </EmptyState>
    </template>
  </CardBox>

  <CardBox
    v-else
    key="repository"
    :padded="false"
    title="Repository"
  >
    <template #content>
      <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
        <SegmentedButton
          v-model="mode"
          :options="MODES"
          size="large"
          fluid
          aria-label="Where the template is cloned"
        />

        <FieldStack
          label="Account"
          required
          hint="The GitHub account or organization Azion works in."
          description="Adding one authorizes it and switches to it."
        >
          <template #default="{ controlId, describedBy }">
            <Select
              :model-value="scope"
              size="large"
              class="w-full"
              :disabled="disabled"
              :display-value="(v) => scopes.find((s) => s.value === v)?.label ?? ''"
              @update:model-value="onSelectScope"
            >
              <Select.Trigger
                :id="controlId"
                :aria-describedby="describedBy"
              >
                <template #iconLeft>
                  <i
                    class="pi pi-github shrink-0 text-body-md leading-none text-(--text-default)"
                    aria-hidden="true"
                  />
                </template>
              </Select.Trigger>
              <Select.Content>
                <Select.Option
                  v-for="s in scopes"
                  :key="s.value"
                  :value="s.value"
                >
                  {{ s.label }}
                </Select.Option>
                <Select.Option
                  :value="ADD_ACCOUNT"
                  icon="pi pi-plus-circle"
                >
                  Add GitHub account
                </Select.Option>
              </Select.Content>
            </Select>
          </template>
        </FieldStack>

        <FieldStack
          v-if="mode === 'new'"
          label="Repository name"
          required
          description="Created in the account you select. Lowercase letters, numbers, and hyphens."
          :message="errors.repository"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <InputGroupRoot
              size="large"
              :disabled="disabled"
            >
              <InputText
                :id="controlId"
                v-model="repoName"
                size="large"
                class="flex-1"
                placeholder="my-repository"
                :disabled="disabled"
                :required="!!errors.repository"
                :aria-describedby="describedBy"
              />
              <InputGroupAddon>
                <Tooltip text="Make the repository public or private.">
                  <Switch
                    v-model="isPublic"
                    kind="privacy"
                    :disabled="disabled"
                    :aria-label="
                      isPublic
                        ? 'Repository is public. Make it private.'
                        : 'Repository is private. Make it public.'
                    "
                  />
                </Tooltip>
              </InputGroupAddon>
            </InputGroupRoot>
          </template>
        </FieldStack>

        <div
          v-else
          :data-field-invalid="errors.repository || null"
          class="flex flex-col gap-(--spacing-xs)"
        >
          <InputText
            v-model="search"
            size="large"
            class="w-full"
            placeholder="Search repositories"
            aria-label="Search repositories"
            :disabled="disabled"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>

          <HelperText
            v-if="errors.repository"
            kind="required"
            >{{ errors.repository }}</HelperText
          >
        </div>
      </div>

      <template v-if="mode === 'existing'">
        <div
          ref="scroller"
          :style="fadeStyle"
          class="max-h-(--size-80) scroll-py-(--spacing-md) overflow-y-auto overscroll-contain border-t border-(--border-default)"
        >
          <Item.List
            v-if="reposLoading"
            key="repos-loading"
            aria-busy="true"
          >
            <Item
              v-for="n in 4"
              :key="`repo-skeleton-${n}`"
              size="small"
            >
              <Item.Media>
                <Skeleton
                  kind="shape"
                  width="2rem"
                  height="2rem"
                />
              </Item.Media>
              <Item.Content class="gap-(--spacing-xs)">
                <Skeleton
                  width="40%"
                  height="0.875rem"
                />
                <Skeleton
                  width="25%"
                  height="0.75rem"
                />
              </Item.Content>
            </Item>
          </Item.List>

          <Item.List
            v-else-if="filteredRepos.length"
            key="repos-list"
          >
            <Item
              v-for="repo in filteredRepos"
              :key="repo.name"
              as-child
              size="small"
            >
              <button
                type="button"
                class="w-full text-left"
                :disabled="disabled"
                :aria-pressed="repo.name === existingName"
                @click="existingName = repo.name"
              >
                <Item.Media>
                  <span
                    class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                  >
                    <i
                      :class="repo.icon"
                      class="text-body-md leading-none text-(--text-default)"
                      aria-hidden="true"
                    />
                  </span>
                </Item.Media>
                <Item.Content>
                  <Item.Title>{{ repo.name }}</Item.Title>
                  <Item.Description class="flex items-center gap-(--spacing-xxs) text-body-xs">
                    <i
                      class="pi pi-history"
                      aria-hidden="true"
                    />
                    {{ repo.age }}
                  </Item.Description>
                </Item.Content>
                <Item.Actions>
                  <SuccessMark
                    v-if="repo.name === existingName"
                    key="chosen"
                  />
                </Item.Actions>
              </button>
            </Item>
          </Item.List>

          <p
            v-else
            class="px-(--spacing-md) py-(--spacing-lg) text-center text-body-sm text-(--text-muted)"
          >
            No repositories match “{{ search }}”.
          </p>
        </div>
      </template>
    </template>
  </CardBox>
</template>
