<script setup>
  // PART 3, TEMPLATE FLOW — WHERE THE CLONE LANDS. Only for a FRAMEWORK STARTER.
  //
  // ── WHY THIS PART EXISTS AT ALL ──
  //
  // Choosing "Next.js Boilerplate" does not deploy Azion's copy of that project. It copies
  // the starter into the reader's OWN GitHub account and deploys from there, so every push
  // after this one is theirs to make. A copy needs an authorized account and somewhere to
  // land, and neither is a thing the Configure part can ask for: a connect is a GATE, and
  // a gate sitting above the required Name field is a form the reader cannot submit and
  // cannot see why.
  //
  // An AZION template never reaches this part. Azion Proxy and Azion Static Site have no
  // project to copy — their settings are the template — so the wizard drops this part for
  // them and the rail goes from four back to three
  // (../../../lib/data/templates.js → `requiresRepository`).
  //
  // ── THE TWO ANSWERS ──
  //
  // NEW is the default, because it is the reason somebody picked a template: they have no
  // project yet. It asks the three things creating a repository asks for — the account, the
  // name, and whether it is public — with the name seeded from the template so the common
  // case is already answered.
  //
  // EXISTING is the other real case and is not a fallback: a reader who prepared an empty
  // repository (or is re-deploying a starter they already cloned) should not be forced to
  // create a second one beside it.
  //
  // Unlike the two CHOOSING parts before it, this one keeps the bar's Next. A row click
  // cannot be the advance here: half of this part is typed, so advancing on a click would
  // fire for one answer and not the other, and the reader would learn two rules for one
  // flow. The wizard validates on that press (../CreateApplication.vue → `validate`).
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import EmptyState from '@aziontech/webkit/empty-state'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputGroup, { InputGroupAddon } from '@aziontech/webkit/input-group'
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

  const props = defineProps({
    // The chosen template. Read for its name — the repository is seeded with what the
    // template calls itself, which is what the reader would have typed.
    source: { type: Object, default: null },
    // The answer already given, so coming BACK to this part shows it instead of a reset
    // form. Null until the reader has been here.
    repository: { type: Object, default: null },
    // Per-field messages from the wizard's validation, filled on the advance attempt.
    errors: { type: Object, default: () => ({}) },
    // The flow-wide lock while the commit is in flight.
    disabled: { type: Boolean, default: false }
  })

  const emit = defineEmits(['update:repository'])

  // The connect, the account switcher and the beat before the rows arrive — shared with
  // the git-import part, which asks GitHub for the same authorization for the other
  // reason (../../../lib/behavior/git-account.js).
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

  // A reader who has been here already is past the connect: their answer is the proof the
  // account was authorized, so returning to this part must not ask for it a second time.
  if (props.repository) connected.value = true

  // 32px, half a row — the band both other lists in this flow keep, and for the same
  // reason (../TemplateSourceStep.vue explains it).
  const { scroller, fadeStyle } = useScrollFade({ max: 32 })

  const filteredRepos = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return GIT_REPOSITORIES
    return GIT_REPOSITORIES.filter((repo) => repo.name.toLowerCase().includes(q))
  })

  // ONE SHAPE for both answers, so the parts after this one — the summary, the deploy's
  // clone story, the provisioning call — never learn which half of this part filled it in.
  // A new repository carries its visibility; an existing one is whatever it already is,
  // and this flow does not get to change that.
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

  // The answer travels up on every change rather than on the advance: the wizard owns it,
  // the summary on the next part draws it, and the leave guard counts it as input the
  // reader would lose. Only once connected — an account nobody authorized cannot own a
  // repository.
  watch(
    [connected, target],
    ([isConnected, next]) => {
      if (isConnected) emit('update:repository', next)
    },
    { immediate: true, deep: true }
  )

  // Switching or adding an account drops the chosen row: it belonged to the account being
  // left behind, and keeping it would point the deploy at a repository the new one does
  // not have.
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
      <!-- The dashed, raised surface this console gives every connect-a-provider empty
           state, so the two places in this flow that ask for a Git account look like the
           same ask (../wizard/GitSourceStep.vue is the other). What differs is the
           SENTENCE: that one imports code the reader has, this one puts code they do not
           have yet into their account, and a reader authorizing an account deserves to
           read which of the two is about to happen. -->
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
        <!-- WHICH OF THE TWO. A segmented control and not two cards: it is one question
             with two answers, and the answer decides what the rest of this card is.
             `fluid` and not `class="w-full"`: the class only stretched the ROOT, leaving
             the two answers hugging their labels at its left edge with dead space beside
             them. The prop stretches both — the bar takes the card's width and the two
             answers divide it, so the question reads as wide as the fields under it. -->
        <SegmentedButton
          v-model="mode"
          :options="MODES"
          size="large"
          fluid
          aria-label="Where the template is cloned"
        />

        <!-- The account owns both answers — it is where a new repository is created and
             where an existing one is browsed — so it stays above the split rather than
             being asked twice. -->
        <FieldStack
          label="Account"
          required
          hint="The GitHub account or organization Azion works in. Adding one authorizes it and switches to it."
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
              <!-- The id and the description ride on the TRIGGER, which is the element the
                   label points at and the thing that takes focus — the Select root is a
                   wrapper, and an id on it would label nothing. -->
              <Select.Trigger
                :id="controlId"
                :aria-describedby="describedBy"
              >
                <template #iconLeft>
                  <i
                    class="pi pi-github shrink-0 text-[1rem] leading-none text-(--text-default)"
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

        <!-- NEW — the name, and whether the world can read it. The visibility rides in the
             field's trailing addon rather than as a switch of its own: it is a property OF
             this repository, and the deploy screen this flow replaces joined them the same
             way (../../marketplace/DeployTemplate.vue). -->
        <FieldStack
          v-if="mode === 'new'"
          label="Repository name"
          required
          description="Created in the account you select. Lowercase letters, numbers, and hyphens."
          :message="errors.repository"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <InputGroup
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
            </InputGroup>
          </template>
        </FieldStack>

        <!-- EXISTING — the same search this flow's other lists carry, over the same rows
             the git-import part browses. The list itself is below, outside this padded
             column, so it can scroll against the card's own edges. -->
        <!-- The search and the message are the ANCHOR for this branch: the list is not a
             field, so it has no FieldStack to carry `data-field-invalid` on its behalf, and
             a failed advance still has to land the reader somewhere they can act (see
             ../../../lib/behavior/reveal-invalid.js). The caret goes into the search, which
             is how the rows below get narrowed to the one they meant. -->
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

          <!-- The list is not a field, so it has no FieldStack to carry a message. It
               rides ABOVE the rows and not under them: the list scrolls inside the card
               and runs past the fold, so a message at its foot would land off-screen on
               the very press that produced it — measured, the card's bottom edge sits
               below the viewport with the rows loaded. -->
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
          class="max-h-[20rem] scroll-py-(--spacing-md) overflow-y-auto overscroll-contain border-t border-(--border-default)"
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
              <!-- Item.Content stacks flush by design — a real row's two lines space
                   themselves through their line-height, which a fixed-height Skeleton
                   has none of. -->
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
                      class="text-[1rem] leading-none text-(--text-default)"
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
                  <!-- The chosen row wears the same success mark the progress and the
                       deploy pipeline use, so "this one is settled" looks identical
                       wherever the reader meets it in this flow. -->
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
