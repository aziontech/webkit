<script setup>
  // GITPROVIDERCONNECT — "no Git provider connected yet", and the control that connects one.
  //
  // TWO FLOWS REACH THIS STATE, which is why it is a component and not markup inside one
  // of them:
  //
  //   • IMPORT A REPOSITORY (../../pages/resources/creation/GitImporter.vue) — there is
  //     nothing to list until a provider is connected, so this IS the pane.
  //   • DEPLOY A TEMPLATE (../../pages/marketplace/DeployTemplate.vue) — the template's
  //     code is cloned INTO a repository of the reader's own, so the flow cannot ask for
  //     a repository name before it knows where the repository would live. The connect
  //     step comes first, then the same form as always.
  //
  // The second one is the reason this exists. A reader who starts from a template never
  // passes through the importer, so the deploy page used to open on a Scope Select listing
  // three accounts from a fixture — offering a choice of accounts to someone who had not
  // connected any.
  //
  // The connection itself is not this component's: it lives in the account-level store
  // (../../lib/state/git-provider.js), so connecting here is connecting everywhere, and a
  // reader who connects on the deploy page finds the importer already connected.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Link from '@aziontech/webkit/link'

  import { connectGitProvider, GIT_PROVIDER, gitConnecting } from '../../lib/state/git-provider'

  defineProps({
    /** Heading. Each flow says what the connection is FOR in its own terms. */
    title: { type: String, default: 'Connect your repository' },
    /** One line under it, same reason. */
    description: {
      type: String,
      default: 'Choose a Git provider to connect your repository and start the deployment process.'
    }
  })

  // The host may want to act on the new connection (the deploy form selects the scope the
  // handshake returns); the state itself is already in the store either way.
  const emit = defineEmits(['connected'])

  const connect = async () => {
    const scope = await connectGitProvider()
    emit('connected', scope)
  }
</script>

<template>
  <!-- A solid CardBox framing a dashed, raised EmptyState surface (per Figma): the card is
       the page's box, the dashed inner surface is the thing that is missing. -->
  <CardBox>
    <template #content>
      <EmptyState
        size="medium"
        :title="title"
        :description="description"
        class="rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised)"
      >
        <template #icon>
          <!-- Featured icon: a solid provider tile framed by two concentric
               translucent squares. -->
          <span class="relative flex size-10 items-center justify-center">
            <span
              aria-hidden="true"
              class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-(--border-strong) bg-(--bg-canvas) opacity-5"
            />
            <span
              aria-hidden="true"
              class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
            />
            <span
              class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)"
            >
              <i
                :class="GIT_PROVIDER.icon"
                class="text-[1rem] leading-none text-(--text-default)"
                aria-hidden="true"
              />
            </span>
          </span>
        </template>
        <template #actions>
          <Button
            :label="`Continue with ${GIT_PROVIDER.label}`"
            :icon="GIT_PROVIDER.icon"
            kind="secondary"
            size="large"
            :loading="gitConnecting"
            @click="connect"
          />
          <!-- Same `size` as the Button above it: the two are one stacked action
               group, so they sit on one step of the ramp (h-10 / text-button-lg)
               rather than two. -->
          <Link
            label="Manage connected providers"
            href="#"
            size="large"
            @click.prevent
          />
        </template>
      </EmptyState>
    </template>
  </CardBox>
</template>
