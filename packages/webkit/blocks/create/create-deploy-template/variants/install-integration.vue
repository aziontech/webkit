<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Kbd from '@aziontech/webkit/kbd'
  import Tag from '@aziontech/webkit/tag'
  import { toAriaKeyshortcuts, useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import { computed, onMounted, reactive, ref } from 'vue'

  import CreateDeployTemplate from '../create-deploy-template.vue'
  import { sampleIntegration } from '../sample'

  interface TemplateSetting {
    name: string
    label: string
    placeholder: string
    description: string
    required: boolean
  }

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

  const guard = useUnsavedChanges(() => values)
  const discardDialog = guard.dialogProps
  const discardLabels = guard.labels

  const onLeave = () => guard.confirmLeave()

  const panelEl = ref<HTMLElement | null>(null)

  useShortcuts({
    keys: 'meta+enter',
    label: 'Add to ' + service,
    group: 'Page',
    element: panelEl,
    handler: install
  })

  onMounted(() =>
    panelEl.value
      ?.querySelector<HTMLElement>(
        '[role="combobox"], input:not([type="hidden"]), textarea, select'
      )
      ?.focus()
  )
</script>

<template>
  <CreateDeployTemplate
    :template="sampleIntegration"
    @back="onLeave"
  >
    <template #details>
      <span class="truncate text-body-2xs text-(--text-muted)">Adds to</span>
      <span class="flex h-5 items-center gap-(--spacing-2xs) text-label-sm text-(--text-default)">
        <i
          class="az az-server text-[length:inherit] leading-none"
          aria-hidden="true"
        />
        {{ service }}
      </span>
    </template>
    <template #default>
      <div
        ref="panelEl"
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
                :required="setting.required"
                :invalid="!!errorOf(setting)"
              >
                <Field.Label :for="'setting-' + setting.name">{{ setting.label }}</Field.Label>
                <Input
                  :id="'setting-' + setting.name"
                  v-model="values[setting.name]"
                  size="large"
                  :placeholder="setting.placeholder"
                />
                <Field.Description>{{ errorOf(setting) || setting.description }}</Field.Description>
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
              variant="primary"
              size="large"
              :aria-keyshortcuts="toAriaKeyshortcuts('meta+enter')"
              @click="install"
            >
              Add to {{ service }}
              <Kbd
                meta
                key-name="enter"
                size="small"
                aria-hidden="true"
              />
            </Button>
          </template>
        </Card>

        <Button
          label="Browse templates"
          variant="outline"
          size="medium"
        />
      </div>
    </template>
  </CreateDeployTemplate>
  <ConfirmDialog
    v-bind="discardDialog"
    data-testid="unsaved-changes-dialog"
  >
    <template #actions>
      <Button
        :label="discardLabels.keepEditing"
        variant="ghost"
        size="medium"
        data-autofocus
        @click="guard.keepEditing"
      />
      <Button
        :label="discardLabels.discard"
        variant="danger"
        size="medium"
        @click="guard.discardAndLeave"
      />
    </template>
  </ConfirmDialog>
</template>
