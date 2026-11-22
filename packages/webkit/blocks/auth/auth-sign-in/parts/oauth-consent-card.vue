<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import { computed, onScopeDispose, ref } from 'vue'

  import { oauthClient as client, oauthScopes as scopes, signedInAccount } from '../sample'
  import AuthCard from './auth-card.vue'
  import ScopeList from './scope-list.vue'
  import SignedInAs from './signed-in-as.vue'

  const pending = ref<'' | 'allow' | 'deny'>('')
  const outcome = ref<'' | 'allowed' | 'denied'>('')
  let timer: ReturnType<typeof setTimeout> | undefined

  onScopeDispose(() => clearTimeout(timer))

  const settled = computed(() => !!outcome.value)

  const respond = (answer: 'allow' | 'deny') => {
    if (pending.value || settled.value) return
    pending.value = answer
    timer = setTimeout(() => {
      pending.value = ''
      outcome.value = answer === 'allow' ? 'allowed' : 'denied'
    }, 600)
  }
</script>

<template>
  <AuthCard>
    <section
      class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)"
      aria-labelledby="oauth-consent-title"
    >
      <div class="flex flex-col items-start gap-(--spacing-md)">
        <Avatar
          variant="square"
          size="large"
          :label="client.initials"
          :alt="client.name"
        />
        <PageHeader
          class="w-full"
          title-id="oauth-consent-title"
          :title="`Authorize ${client.name}`"
          :description="`${client.name} by ${client.publisher} (${client.site}) wants to access your account.`"
        />
      </div>

      <Alert
        key="alert-1"
        v-if="outcome === 'allowed'"
        severity="success"
        size="small"
        :label="`Access granted. Returning to ${client.name}.`"
      />
      <Alert
        key="alert-2"
        v-else-if="outcome === 'denied'"
        severity="info"
        size="small"
        :label="`Access denied. Returning to ${client.name} with no access to your account.`"
      />

      <SignedInAs
        :account="signedInAccount"
        :disabled="!!pending || settled"
      />

      <ScopeList
        heading-id="oauth-consent-scopes"
        :client="client.name"
        :scopes="scopes"
      />

      <p class="text-body-sm text-(--text-muted)">
        Allowing sends you back to
        <span class="text-body-code-sm break-words text-(--text-default)">{{
          client.redirect
        }}</span
        >. You can revoke access at any time in
        <Link
          inline
          href="/account/authorized-apps"
          >Authorized apps</Link
        >.
      </p>

      <div class="grid grid-cols-2 gap-(--spacing-sm)">
        <Button
          label="Deny"
          variant="secondary"
          size="large"
          class="w-full"
          :loading="pending === 'deny'"
          :disabled="pending === 'allow' || settled"
          @click="respond('deny')"
        />
        <Button
          label="Allow"
          variant="primary"
          size="large"
          class="w-full"
          :loading="pending === 'allow'"
          :disabled="pending === 'deny' || settled"
          @click="respond('allow')"
        />
      </div>
    </section>
  </AuthCard>
</template>
