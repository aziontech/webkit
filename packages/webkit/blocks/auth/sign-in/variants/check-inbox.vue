<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import PageHeader from '@aziontech/webkit/page-header'
  import { onScopeDispose, ref } from 'vue'

  const resending = ref(false)
  const resent = ref(false)
  let resendTimer: ReturnType<typeof setTimeout> | undefined

  onScopeDispose(() => clearTimeout(resendTimer))

  const resend = () => {
    resending.value = true
    resent.value = false
    clearTimeout(resendTimer)
    resendTimer = setTimeout(() => {
      resending.value = false
      resent.value = true
    }, 600)
  }
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <AppHeader
      aria-label="Console"
      class="shrink-0"
    >
      <AppHeader.Brand>
        <a
          href="/home"
          aria-label="Azion home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Brand
            variant="default"
            size="small"
          />
        </a>
      </AppHeader.Brand>
      <AppHeader.Center />
      <AppHeader.End>
        <Button
          label="Documentation"
          variant="outline"
          size="medium"
          icon="ai ai-book"
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
                  <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)">
                    <PageHeader
                      title="Check your inbox"
                      description="We sent a verification link to jane.doe@example.com. Check your inbox or spam folder and follow the instructions."
                    />

                    <Alert
                      v-if="resent"
                      severity="success"
                      size="small"
                      label="We sent another link to jane.doe@example.com."
                    />

                    <div class="flex items-center gap-(--spacing-xs)">
                      <p class="text-body-sm text-(--text-default)">Didn't receive the email?</p>
                      <Button
                        type="button"
                        label="Resend email"
                        variant="link"
                        :loading="resending"
                        @click="resend"
                      />
                    </div>

                    <Button
                      label="Return to sign in"
                      variant="secondary"
                      size="large"
                      class="w-full"
                      href="/login"
                    />
                  </div>
                </template>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
