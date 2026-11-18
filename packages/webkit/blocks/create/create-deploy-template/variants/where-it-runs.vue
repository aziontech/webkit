<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import { computed, nextTick, ref } from 'vue'

  interface ServiceOption {
    value: string
    label: string
    description: string
  }

  const breadcrumb = [
    { label: 'Start from a template' },
    { label: 'Nuxt E-commerce', active: true }
  ]
  const services: ServiceOption[] = [
    { value: 'service-01', label: 'service-01', description: 'service-01.example.com' },
    { value: 'service-02', label: 'service-02', description: 'service-02.example.com' },
    { value: 'service-03', label: 'service-03', description: 'service-03.example.com' },
    { value: 'service-04', label: 'service-04', description: 'service-04.example.com' },
    { value: 'service-05', label: 'service-05', description: 'service-05.example.com' },
    { value: 'service-06', label: 'service-06', description: 'service-06.example.com' },
    { value: 'service-07', label: 'service-07', description: 'service-07.example.com' },
    { value: 'web-prod', label: 'web-prod', description: 'www.example.com' },
    { value: 'web-eu-prod', label: 'web-eu-prod', description: 'eu.example.com' },
    { value: 'stage-preview', label: 'stage-preview', description: '*-preview.example.com' },
    { value: 'campaign-landing', label: 'campaign-landing', description: 'campaign.example.com' },
    { value: 'docs-prod', label: 'docs-prod', description: 'docs.example.com' }
  ]
  const VISIBLE = 6

  const phase = ref<'where' | 'connect'>('where')
  const service = ref('')
  const query = ref('')
  const creating = ref(false)
  const newName = ref('')
  const nameFieldEl = ref<InstanceType<typeof Input> | null>(null)

  const matches = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return services
    return services.filter((option) =>
      [option.label, option.description].some((field) => field.toLowerCase().includes(term))
    )
  })
  const visible = computed(() => {
    const head = matches.value.slice(0, VISIBLE)
    if (!service.value || head.some((option) => option.value === service.value)) return head
    const picked = matches.value.find((option) => option.value === service.value)
    return picked ? [picked, ...head.slice(0, VISIBLE - 1)] : head
  })
  const hidden = computed(() => Math.max(0, matches.value.length - visible.value.length))
  const runsOn = computed(() =>
    service.value
      ? 'Nuxt E-commerce is cloned into a repository in your account, then deployed to ' +
        service.value +
        ' on every push.'
      : 'Nuxt E-commerce is cloned into a repository in your account, then deployed from it on every push.'
  )

  const choose = (value: string) => {
    service.value = value
    phase.value = 'connect'
  }

  const startCreating = () => {
    newName.value = query.value.trim()
    creating.value = true
    nextTick(() => nameFieldEl.value?.focus())
  }

  const cancelCreating = () => {
    creating.value = false
    newName.value = ''
  }

  const confirmCreating = () => {
    const name = newName.value.trim()
    if (!name) return
    creating.value = false
    choose(name)
  }

  const onSearchEnter = () => {
    if (matches.value.length) {
      choose(matches.value[0].value)
      return
    }
    startCreating()
  }
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <AppHeader aria-label="Console">
      <AppHeader.Start>
        <IconButton
          icon="az az-chevron-left"
          aria-label="Back to Creation Center"
          variant="outline"
          size="small"
        />
        <AppHeader.Brand
          href="/home"
          aria-label="Azion home"
        >
          <Brand
            variant="default"
            size="small"
          />
        </AppHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </AppHeader.Start>
      <AppHeader.Center />
      <AppHeader.End>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            variant="square"
          />
        </button>
      </AppHeader.End>
    </AppHeader>

    <main
      class="animate-page-enter motion-reduce:animate-none relative min-w-0 flex-1 overflow-auto"
    >
      <div
        class="layout-column-focused relative flex min-h-full flex-col items-center gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-2xl)"
      >
        <Card class="w-full">
          <template #default>
            <div class="flex w-full items-start gap-(--spacing-md)">
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  class="az-color az-nuxt text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>

              <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-md)">
                <div class="flex w-full min-w-0 flex-col overflow-hidden">
                  <span class="flex items-center gap-(--spacing-xs)">
                    <span class="truncate text-heading-2xs text-(--text-default)"
                      >Nuxt E-commerce</span
                    >
                  </span>
                  <span class="text-body-xs text-(--text-muted)">
                    Launch a Nuxt e-commerce or content app in a few steps.
                  </span>
                </div>

                <div class="flex w-full flex-col gap-(--spacing-2xs)">
                  <span class="truncate text-body-2xs text-(--text-muted)"
                    >Cloning from GitHub</span
                  >
                  <div class="flex items-center gap-(--spacing-md)">
                    <span
                      class="flex h-5 items-center gap-(--spacing-2xs) text-label-sm text-(--text-default)"
                    >
                      <i
                        class="az az-github text-[length:inherit] leading-none"
                        aria-hidden="true"
                      />
                      acme
                    </span>
                    <span
                      class="flex h-5 items-center gap-(--spacing-2xs) text-label-sm text-(--text-muted)"
                    >
                      <i
                        class="az az-folder text-[length:inherit] leading-none"
                        aria-hidden="true"
                      />
                      templates/nuxt-ecommerce
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <section
          v-if="phase === 'where'"
          data-phase="where"
          class="flex w-full flex-col gap-(--spacing-xl)"
          aria-labelledby="deploy-template-where-title"
        >
          <Card class="w-full">
            <template #default>
              <div class="flex flex-col gap-(--spacing-lg)">
                <div class="flex flex-col gap-(--spacing-2xs)">
                  <h1
                    id="deploy-template-where-title"
                    class="text-heading-xs text-(--text-default)"
                  >
                    Where it runs
                  </h1>
                  <p class="text-body-sm text-pretty text-(--text-muted)">
                    Select the service that serves the project. Each deploy goes live on it.
                  </p>
                </div>

                <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                  <Input
                    v-model="query"
                    size="large"
                    class="w-full"
                    placeholder="Search services"
                    aria-label="Search services"
                    autocomplete="off"
                    @keydown.enter.prevent="onSearchEnter"
                  />

                  <div
                    v-if="creating"
                    class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
                  >
                    <Field>
                      <Field.Label>New service</Field.Label>
                      <Input
                        ref="nameFieldEl"
                        v-model="newName"
                        size="large"
                        placeholder="my-service"
                        @keydown.enter.prevent="confirmCreating"
                      />
                    </Field>
                    <div class="flex items-center justify-end gap-(--spacing-sm)">
                      <Button
                        type="button"
                        label="Back"
                        variant="ghost"
                        size="medium"
                        @click="cancelCreating"
                      />
                      <Button
                        type="button"
                        label="Continue"
                        variant="primary"
                        size="medium"
                        :disabled="!newName.trim()"
                        @click="confirmCreating"
                      />
                    </div>
                  </div>

                  <div
                    v-else
                    class="flex flex-col"
                  >
                    <Item
                      v-for="option in visible"
                      :key="option.value"
                      size="small"
                      clickable
                      :aria-pressed="service === option.value"
                      @click="choose(option.value)"
                    >
                      <Item.Media>
                        <i
                          class="az az-server text-body-md leading-none text-(--text-muted)"
                          aria-hidden="true"
                        />
                      </Item.Media>
                      <Item.Content>
                        <Item.Title>{{ option.label }}</Item.Title>
                        <Item.Description>{{ option.description }}</Item.Description>
                      </Item.Content>
                      <Item.Actions>
                        <i
                          v-if="service === option.value"
                          class="az az-check text-body-sm leading-none text-(--text-default)"
                          aria-hidden="true"
                        />
                      </Item.Actions>
                    </Item>

                    <p
                      v-if="hidden"
                      class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
                    >
                      {{ hidden }} more. Type to narrow the list.
                    </p>
                    <p
                      v-else-if="!matches.length"
                      class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
                    >
                      No service matches “{{ query.trim() }}”.
                    </p>

                    <Item
                      size="small"
                      clickable
                      @click="startCreating"
                    >
                      <Item.Media>
                        <i
                          class="az az-plus text-body-sm leading-none text-(--text-muted)"
                          aria-hidden="true"
                        />
                      </Item.Media>
                      <Item.Content>
                        <Item.Title>Create Service</Item.Title>
                      </Item.Content>
                    </Item>
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <div class="flex justify-center">
            <Button
              type="button"
              label="Continue without a service"
              variant="ghost"
              size="small"
              @click="choose('')"
            />
          </div>
        </section>

        <div
          v-else
          data-phase="connect"
          class="flex w-full flex-col items-center gap-(--spacing-xl) data-[phase=success]:my-auto motion-reduce:transition-none! motion-reduce:transform-none!"
        >
          <EmptyState
            bordered
            size="medium"
            title="Connect a Git provider"
            :description="runsOn"
            class="w-full"
          >
            <template #icon>
              <span class="relative flex size-10 items-center justify-center">
                <span
                  aria-hidden="true"
                  class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-5"
                />
                <span
                  aria-hidden="true"
                  class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
                />
                <span
                  class="relative flex size-10 items-center justify-center rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface)"
                >
                  <i
                    class="az az-github text-body-md leading-none text-(--text-default)"
                    aria-hidden="true"
                  />
                </span>
              </span>
            </template>
            <template #actions>
              <Button
                label="Continue with GitHub"
                icon="az az-github"
                variant="secondary"
                size="large"
              />
              <Button
                label="Continue without Git"
                variant="ghost"
                size="large"
              />
              <Link
                label="Manage connected providers"
                href="#"
                size="large"
              />
            </template>
          </EmptyState>

          <Button
            label="Browse templates"
            variant="outline"
            size="medium"
          />
        </div>
      </div>
    </main>
  </div>
</template>
