<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import GlobalHeader from '@aziontech/webkit/global-header'
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <GlobalHeader
      aria-label="Console"
      class="shrink-0"
    >
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
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <Button
          label="Documentation"
          kind="outlined"
          size="medium"
          icon="pi pi-book"
          href="/docs"
        />
      </GlobalHeader.Right>
    </GlobalHeader>

    <main class="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
      <div class="layout-column-site flex flex-1 flex-col lg:min-h-0">
        <div class="flex flex-1 flex-col py-(--spacing-xl) lg:min-h-0 lg:overflow-y-auto">
          <div class="m-auto flex w-full flex-col items-center gap-(--spacing-md)">
            <div class="flex w-full flex-col items-center">
              <Card
                class="w-full max-w-(--container-sm)"
                :padded="false"
              >
                <template #content>
                  <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)">
                    <header class="flex flex-col gap-(--spacing-xxs)">
                      <h1 class="text-heading-sm text-(--text-default)">Check your inbox</h1>
                      <p class="text-body-sm text-(--text-muted)">
                        We sent a verification link to myemail@example.com. Check your inbox or spam
                        folder and follow the instructions.
                      </p>
                    </header>

                    <div class="flex items-center gap-(--spacing-xs)">
                      <p class="text-body-sm text-(--text-default)">Didn't receive the email?</p>
                      <a
                        class="text-link text-body-sm"
                        href="#"
                        @click.prevent
                        >Resend Email</a
                      >
                    </div>

                    <Button
                      label="Return to sign in"
                      kind="secondary"
                      size="large"
                      class="w-full"
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
