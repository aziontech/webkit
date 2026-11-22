<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../../components/action/button/button.vue'
  import IconButton from '../../../components/action/icon-button/icon-button.vue'
  import CodeBlock from '../../../components/code/code-block/code-block.vue'
  import Field from '../../../components/input/field/field.vue'
  import FieldLabel from '../../../components/input/field/field-label/field-label.vue'
  import RadioGroup from '../../../components/input/radio-group/radio-group.vue'
  import Select from '../../../components/input/select/select.vue'
  import SelectTrigger from '../../../components/input/select/select-trigger/select-trigger.vue'
  import Textarea from '../../../components/input/textarea/textarea.vue'
  import Panel from '../../../components/overlay/panel/panel.vue'
  import PanelBody from '../../../components/overlay/panel/panel-body.vue'
  import PanelFooter from '../../../components/overlay/panel/panel-footer.vue'
  import PanelHeader from '../../../components/overlay/panel/panel-header.vue'
  import type { ConsoleApplicationSecondMove } from './console-application-data'

  defineOptions({ name: 'ConsoleApplicationDrawer', inheritAttrs: false })

  interface Props {
    /** The drawer the second move opens. */
    drawer: Extract<ConsoleApplicationSecondMove, { kind: 'drawer' }>
    /** Plays the slide-in. */
    animated?: boolean
  }

  withDefaults(defineProps<Props>(), { animated: true })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'console-application-drawer'
  )

  function displayAs(value: string): () => string {
    return () => value
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-animated="animated || null"
    :data-testid="testId"
    class="absolute inset-y-0 end-0 flex w-[62%] data-animated:animate-slide-in-end motion-reduce:animate-none"
  >
    <Panel
      data-fluid
      class="h-full max-h-none rounded-(--shape-flat) border-y-0 border-e-0"
    >
      <PanelHeader>
        <span class="min-w-0 truncate text-heading-xs text-(--text-default)">{{
          drawer.title
        }}</span>
        <IconButton
          icon="az az-x"
          aria-label="Close"
          variant="ghost"
          size="small"
          class="shrink-0"
        />
      </PanelHeader>
      <PanelBody>
        <div class="flex flex-col gap-(--spacing-xl)">
          <section
            v-for="section in drawer.sections"
            :key="section.title"
            class="flex flex-col gap-(--spacing-sm)"
          >
            <span class="text-label-md text-(--text-default)">{{ section.title }}</span>
            <div
              :data-columns="section.columns ?? 1"
              class="grid items-end gap-(--spacing-sm) data-[columns=2]:grid-cols-2 data-[columns=3]:grid-cols-3"
            >
              <template
                v-for="field in section.fields"
                :key="field.label"
              >
                <RadioGroup
                  v-if="field.kind === 'choice'"
                  :model-value="field.value"
                  variant="card"
                  orientation="horizontal"
                  :options="field.options.map((option) => ({ value: option, label: option }))"
                  :aria-label="field.label"
                />
                <Field
                  key="field-1"
                  v-else-if="field.kind === 'switch'"
                  orientation="horizontal"
                >
                  <Switch
                    :model-value="field.on"
                    :aria-label="field.label"
                  />
                  <FieldLabel>{{ field.label }}</FieldLabel>
                </Field>
                <Field
                  key="field-2"
                  v-else
                >
                  <FieldLabel>{{ field.label }}</FieldLabel>
                  <Input
                    v-if="field.kind === 'text'"
                    :model-value="field.value"
                    size="medium"
                    readonly
                  />
                  <Textarea
                    v-else-if="field.kind === 'textarea'"
                    :model-value="field.value"
                    readonly
                  />
                  <Select
                    v-else-if="field.kind === 'select'"
                    :model-value="field.value"
                    :display-value="displayAs(field.value)"
                    size="medium"
                  >
                    <SelectTrigger
                      class="w-full"
                      :aria-label="field.label"
                    />
                  </Select>
                  <CodeBlock
                    v-else
                    :tabs="[
                      {
                        label: field.label,
                        value: field.label,
                        code: field.value,
                        language: 'json'
                      }
                    ]"
                    :copyable="false"
                  />
                </Field>
              </template>
            </div>
          </section>
        </div>
      </PanelBody>
      <PanelFooter>
        <Button
          :label="drawer.action"
          variant="primary"
          size="medium"
        />
      </PanelFooter>
    </Panel>
  </div>
</template>
