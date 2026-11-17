<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Tag from '@aziontech/webkit/tag'
  import { computed, reactive, ref } from 'vue'

  interface TemplateSetting {
    name: string
    label: string
    placeholder: string
    description: string
    required: boolean
  }

  const breadcrumb = [{ label: 'Start from a template' }, { label: 'Origin Proxy', active: true }]
  const service = 'service-01'
  const settings: TemplateSetting[] = [
    {
      name: 'originAddress',
      label: 'Origin address',
      placeholder: 'origin.example.com',
      description: 'The host requests are forwarded to. A hostname or an IP address.',
      required: true
    },
    {
      name: 'hostHeader',
      label: 'Host header',
      placeholder: '${host}',
      description: 'Sent to the origin on every request. Leave the default to pass yours through.',
      required: false
    }
  ]

  const values = reactive<Record<string, string>>(
    Object.fromEntries(settings.map((setting) => [setting.name, '']))
  )
  const submitted = ref(false)

  const errorOf = (setting: TemplateSetting) =>
    submitted.value && setting.required && !(values[setting.name] ?? '').trim()
      ? 'This field is required.'
      : ''

  const preview = computed(() => {
    const origin = (values['originAddress'] ?? '').trim()
    const header = (values['hostHeader'] ?? '').trim()
    return {
      origin: { name: service + '-origin', address: origin || 'not set yet' },
      rule: {
        name: 'Proxy every path',
        description: 'Fetches every request through the ' + service + '-origin origin.'
      },
      behaviors: ['Set origin', ...(header ? ['Add request header'] : []), 'Deliver']
    }
  })

  const install = () => {
    submitted.value = true
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
                  class="az az-arrow-right-left text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>

              <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-md)">
                <div class="flex w-full min-w-0 flex-col overflow-hidden">
                  <span class="flex items-center gap-(--spacing-xs)">
                    <span class="truncate text-heading-2xs text-(--text-default)"
                      >Origin Proxy</span
                    >
                  </span>
                  <span class="text-body-xs text-(--text-muted)">
                    Front an origin you already run. The service receives the traffic and passes it
                    on.
                  </span>
                </div>

                <div class="flex w-full flex-col gap-(--spacing-2xs)">
                  <span class="truncate text-body-2xs text-(--text-muted)">Adds to</span>
                  <span
                    class="flex h-5 items-center gap-(--spacing-2xs) text-label-sm text-(--text-default)"
                  >
                    <i
                      class="az az-server text-[length:inherit] leading-none"
                      aria-hidden="true"
                    />
                    {{ service }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <div
          data-phase="install"
          class="flex w-full flex-col items-center gap-(--spacing-xl)"
        >
          <Card class="w-full">
            <template #default>
              <div class="flex flex-col gap-(--spacing-lg)">
                <div class="flex flex-col gap-(--spacing-2xs)">
                  <h1 class="text-heading-xs text-(--text-default)">Configure Origin Proxy</h1>
                  <p class="text-body-sm text-pretty text-(--text-muted)">
                    An integration template adds records and a rule to a service you already run.
                    Nothing is cloned and nothing builds.
                  </p>
                </div>

                <Field
                  v-for="setting in settings"
                  :key="setting.name"
                  :required="!!errorOf(setting)"
                >
                  <Field.Label :for="'setting-' + setting.name">{{ setting.label }}</Field.Label>
                  <Input
                    :id="'setting-' + setting.name"
                    v-model="values[setting.name]"
                    size="large"
                    :placeholder="setting.placeholder"
                  />
                  <Field.Description>{{
                    errorOf(setting) || setting.description
                  }}</Field.Description>
                </Field>
              </div>
            </template>
          </Card>

          <Card
            :padded="false"
            title="What gets added"
            class="w-full"
          >
            <template #default>
              <p
                class="border-b border-(--border-default) p-(--spacing-md) text-body-sm text-(--text-muted)"
              >
                These land on {{ service }}. The rule opens in its rules for you to save.
              </p>

              <div
                class="flex flex-col gap-(--spacing-sm) border-b border-(--border-default) p-(--spacing-md)"
              >
                <p class="text-label-sm text-(--text-default)">Records</p>
                <p class="text-body-sm text-(--text-muted)">
                  Origin
                  <span class="text-(--text-default)">{{ preview.origin.name }}</span>
                  →
                  {{ preview.origin.address }}
                </p>
              </div>

              <Item.List>
                <Item size="small">
                  <Item.Media>
                    <span
                      class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                    >
                      <i
                        class="az az-sliders-horizontal text-body-md leading-none text-(--text-default)"
                        aria-hidden="true"
                      />
                    </span>
                  </Item.Media>
                  <Item.Content>
                    <Item.Title>{{ preview.rule.name }}</Item.Title>
                    <Item.Description>{{ preview.rule.description }}</Item.Description>
                  </Item.Content>
                  <Item.Actions>
                    <Tag
                      label="Request phase"
                      severity="neutral"
                      size="small"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>

              <ul
                class="m-0 flex list-none flex-wrap gap-(--spacing-2xs) p-(--spacing-md) pt-0"
                aria-label="Behaviors"
              >
                <li
                  v-for="behavior in preview.behaviors"
                  :key="behavior"
                >
                  <Tag
                    :label="behavior"
                    severity="neutral"
                    size="small"
                  />
                </li>
              </ul>
            </template>

            <template #footer>
              <Button
                class="w-full"
                :label="'Add to ' + service"
                variant="primary"
                size="large"
                @click="install"
              />
            </template>
          </Card>

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
