<script setup lang="ts">
  import { inject } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Accordion from '../../../content/accordion/accordion.vue'
  import AccordionContent from '../../../content/accordion/accordion-content/accordion-content.vue'
  import AccordionItem from '../../../content/accordion/accordion-item/accordion-item.vue'
  import AccordionTrigger from '../../../content/accordion/accordion-trigger/accordion-trigger.vue'
  import FieldDescription from '../../field/field-description/field-description.vue'
  import FieldGroup from '../../field/field-group/field-group.vue'
  import FieldLegend from '../../field/field-legend/field-legend.vue'
  import FieldSet from '../../field/field-set/field-set.vue'
  import { SchemaFormInjectionKey } from '../injection-key'
  import type { SchemaFormNode } from '../schema'
  import SchemaFormCollection from './schema-form-collection.vue'
  import SchemaFormField from './schema-form-field.vue'

  defineOptions({ name: 'SchemaFormNodes', inheritAttrs: false })

  defineProps<{ nodes: SchemaFormNode[] }>()

  const ctx = inject(SchemaFormInjectionKey)
  if (!ctx) throw new Error('SchemaFormNodes must be used inside SchemaForm.')
  const { testId, openSections } = ctx
  const { t } = useTranslate({ schemaForm: en.schemaForm })

  const toggleSection = (node: SchemaFormNode, next: unknown) => {
    if (next === node.path) openSections.add(node.path)
    else openSections.delete(node.path)
  }
</script>

<template>
  <template
    v-for="node in nodes"
    :key="node.path"
  >
    <FieldSet
      key="fieldset"
      v-if="node.widget === 'fieldset'"
      :data-path="node.path"
      :data-testid="`${testId}__set`"
    >
      <FieldLegend>{{ node.label }}</FieldLegend>
      <FieldDescription v-if="node.description">{{ node.description }}</FieldDescription>
      <FieldGroup>
        <SchemaFormNodes :nodes="node.children" />
      </FieldGroup>
    </FieldSet>
    <FieldSet
      key="section"
      v-else-if="node.widget === 'section' && !node.collapsed"
      :data-path="node.path"
      data-widget="section"
      :data-testid="`${testId}__section`"
    >
      <FieldLegend>{{ node.label || t('schemaForm.advanced') }}</FieldLegend>
      <FieldDescription v-if="node.description">{{ node.description }}</FieldDescription>
      <FieldGroup>
        <SchemaFormNodes :nodes="node.children" />
      </FieldGroup>
    </FieldSet>
    <Accordion
      v-else-if="node.widget === 'section'"
      :model-value="openSections.has(node.path) ? node.path : null"
      :data-path="node.path"
      data-widget="section"
      :data-testid="`${testId}__section`"
      @update:model-value="toggleSection(node, $event)"
    >
      <AccordionItem :value="node.path">
        <AccordionTrigger>{{ node.label || t('schemaForm.advanced') }}</AccordionTrigger>
        <AccordionContent :padded="false">
          <div
            class="flex min-w-0 flex-col gap-(--spacing-md) pb-(--spacing-md) text-(--text-default)"
          >
            <p
              v-if="node.description"
              class="m-0 text-body-sm text-(--text-muted)"
            >
              {{ node.description }}
            </p>
            <FieldGroup>
              <SchemaFormNodes :nodes="node.children" />
            </FieldGroup>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    <SchemaFormCollection
      key="collection"
      v-else-if="node.widget === 'repeat' || node.widget === 'map'"
      :node="node"
    />
    <SchemaFormField
      v-else
      :node="node"
    />
  </template>
</template>
