<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import AppHeader from '@aziontech/webkit/app-header'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import { computed, ref } from 'vue'

  const client = {
    name: 'Acme Deploy',
    initials: 'AD',
    publisher: 'Acme Inc.',
    site: 'deploy.example.com',
    redirect: 'https://deploy.example.com/oauth/callback'
  }

  const account = { name: 'Jane Doe', initials: 'JD', email: 'jane.doe@example.com' }

  const scopes = [
    {
      id: 'profile',
      icon: 'az az-user',
      title: 'Read your profile',
      description: 'Your name, email address and avatar.'
    },
    {
      id: 'workloads:read',
      icon: 'az az-globe',
      title: 'Read your workloads',
      description: 'Names, domains and status. Not their settings or secrets.'
    },
    {
      id: 'applications:deploy',
      icon: 'az az-upload',
      title: 'Deploy your applications',
      description: 'Create and publish new versions of the applications in this account.'
    }
  ]

  const pending = ref<'' | 'allow' | 'deny'>('')
  const outcome = ref<'' | 'allowed' | 'denied'>('')

  const settled = computed(() => !!outcome.value)

  const respond = (answer: 'allow' | 'deny') => {
    if (pending.value || settled.value) return
    pending.value = answer
    setTimeout(() => {
      pending.value = ''
      outcome.value = answer === 'allow' ? 'allowed' : 'denied'
    }, 600)
  }
</script>
<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <AppHeader
      aria-label="Console"
      class="shrink-0"
    >
      <AppHeader.Brand
        href="/home"
        aria-label="Azion home"
      >
        <Brand
          variant="default"
          size="small"
        />
      </AppHeader.Brand>
      <AppHeader.Center />
      <AppHeader.End>
        <Button
          label="Documentation"
          variant="outline"
          size="medium"
          icon="az az-book"
          href="/docs"
        />
      </AppHeader.End>
    </AppHeader>

    <main class="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
      <div class="layout-column-site flex flex-1 flex-col lg:min-h-0">
        <div class="flex flex-1 flex-col py-(--spacing-xl) lg:min-h-0 lg:overflow-y-auto">
          <div
            class="m-auto flex w-full flex-col items-center gap-(--spacing-md) transition-[translate,opacity] duration-slow-01 ease-expressive-entrance starting:-translate-x-6 starting:opacity-0 rtl:starting:translate-x-6 motion-reduce:transition-none"
          >
            <div class="flex w-full flex-col items-center">
              <Card
                class="w-full max-w-(--container-sm)"
                :padded="false"
              >
                <template #default>
                  <section
                    class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)"
                    aria-labelledby="oauth-consent-title"
                  >
                    <div class="flex items-center gap-(--spacing-sm)">
                      <Avatar
                        variant="square"
                        size="large"
                        :label="client.initials"
                        :alt="client.name"
                      />
                      <PageHeader
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

                    <div class="flex flex-col gap-(--spacing-xs)">
                      <h2 class="text-label-md text-(--text-muted)">Signed in as</h2>
                      <Item
                        variant="outline"
                        size="small"
                      >
                        <Item.Media>
                          <Avatar
                            :label="account.initials"
                            size="medium"
                          />
                        </Item.Media>
                        <Item.Content>
                          <Item.Title>{{ account.name }}</Item.Title>
                          <Item.Description>{{ account.email }}</Item.Description>
                        </Item.Content>
                        <Item.Actions>
                          <Button
                            label="Switch account"
                            variant="outline"
                            size="small"
                            href="/login?prompt=select_account"
                            :disabled="!!pending || settled"
                          />
                        </Item.Actions>
                      </Item>
                    </div>

                    <div class="flex flex-col gap-(--spacing-xs)">
                      <h2
                        id="oauth-consent-scopes"
                        class="text-label-md text-(--text-muted)"
                      >
                        {{ client.name }} will be able to
                      </h2>
                      <Item.List aria-labelledby="oauth-consent-scopes">
                        <Item
                          v-for="scope in scopes"
                          :key="scope.id"
                          size="small"
                          role="listitem"
                        >
                          <Item.Media type="icon">
                            <i
                              :class="scope.icon"
                              aria-hidden="true"
                            />
                          </Item.Media>
                          <Item.Content>
                            <Item.Title>{{ scope.title }}</Item.Title>
                            <Item.Description>{{ scope.description }}</Item.Description>
                          </Item.Content>
                        </Item>
                      </Item.List>
                    </div>

                    <p class="text-body-sm text-(--text-muted)">
                      Allowing sends you back to
                      <span class="text-body-code-sm break-all text-(--text-default)">{{
                        client.redirect
                      }}</span
                      >. You can revoke access at any time in
                      <a
                        class="text-link"
                        href="/account/authorized-apps"
                        >Authorized apps</a
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
                </template>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
