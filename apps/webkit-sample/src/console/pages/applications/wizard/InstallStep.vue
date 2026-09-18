<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import FieldStack from '../../../components/form/FieldStack.vue'
  import { behaviorLabel } from '../../../lib/data/rules-engine'
  import { integrationPreview } from '../../../lib/data/template-integrations'
  import { useCreateForm } from './form-context'

  const props = defineProps({
    /** The integration template being installed. */
    source: { type: Object, default: null },
    /** The gate's answer — `{ mode: 'existing', name }`. */
    target: { type: Object, default: null },
    /** The flow-wide lock while the commit is in flight. */
    disabled: { type: Boolean, default: false }
  })

  const { form, errors } = useCreateForm()

  const settings = computed(() => props.source?.settings ?? [])

  const preview = computed(() =>
    integrationPreview(props.source?.slug, form.settings, props.target?.name ?? 'application')
  )

  const behaviorSummary = (behavior) => {
    if (behavior.target) return `${behaviorLabel(behavior.type)} — ${behavior.target}`
    return behaviorLabel(behavior.type)
  }
</script>

<template>
  <CardBox
    v-if="settings.length"
    key="settings"
    :padded="false"
    :title="`Configure ${source?.title ?? 'the template'}`"
  >
    <template #content>
      <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
        <FieldStack
          v-for="setting in settings"
          :key="setting.name"
          :label="setting.label"
          :required="!!setting.required"
          :description="setting.description"
          :message="errors[setting.name]"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <InputText
              :id="controlId"
              v-model="form.settings[setting.name]"
              size="large"
              class="w-full"
              :placeholder="setting.placeholder"
              :disabled="disabled"
              :required="!!errors[setting.name]"
              :aria-describedby="describedBy"
            />
          </template>
        </FieldStack>
      </div>
    </template>
  </CardBox>

  <CardBox
    v-if="preview"
    key="preview"
    :padded="false"
    class="mt-(--layout-section-gap)"
    title="What gets added"
  >
    <template #content>
      <p
        class="border-b border-(--border-default) p-(--spacing-md) text-body-sm text-(--text-muted)"
      >
        These land on {{ target?.name ?? 'the application' }}. The rule opens in its Rules Engine
        for you to save.
      </p>

      <div
        v-if="preview.connector || preview.cachePolicy"
        class="flex flex-col gap-(--spacing-sm) border-b border-(--border-default) p-(--spacing-md)"
      >
        <p class="text-label-sm text-(--text-default)">Records</p>
        <div class="flex flex-col gap-(--spacing-xxs)">
          <p
            v-if="preview.connector"
            class="text-body-sm text-(--text-muted)"
          >
            Connector
            <span class="text-(--text-default)">{{ preview.connector.name }}</span>
            →
            {{ preview.connector.address || preview.connector.bucket || 'not set yet' }}
          </p>
          <p
            v-if="preview.cachePolicy"
            class="text-body-sm text-(--text-muted)"
          >
            Cache policy
            <span class="text-(--text-default)">{{ preview.cachePolicy.name }}</span>
          </p>
        </div>
      </div>

      <Item.List>
        <Item size="small">
          <Item.Media>
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
            >
              <i
                class="pi pi-sliders-h text-[1rem] leading-none text-(--text-default)"
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
              severity="secondary"
              size="small"
            />
          </Item.Actions>
        </Item>
      </Item.List>

      <div class="flex flex-wrap gap-(--spacing-xxs) p-(--spacing-md) pt-0">
        <Tag
          v-for="(behavior, index) in preview.rule.behaviors"
          :key="`${behavior.type}-${index}`"
          :label="behaviorSummary(behavior)"
          severity="secondary"
          size="small"
        />
      </div>
    </template>
  </CardBox>
</template>
