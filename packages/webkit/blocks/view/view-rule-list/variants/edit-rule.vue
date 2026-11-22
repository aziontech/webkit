<script setup lang="ts">
  import { useRuleEditing } from '../composables/use-rule-editing'
  import RuleBuilderDrawer from '../parts/rule-builder-drawer.vue'
  import ViewRuleList from '../view-rule-list.vue'

  const {
    rules,
    saving,
    builderOpen,
    editingRule,
    newRulePhase,
    onSave,
    openRule,
    addRule,
    applyRule
  } = useRuleEditing()
</script>

<template>
  <ViewRuleList
    :rules="rules"
    :saving="saving"
    @edit="(_event, row) => openRule(row)"
    @create="(_event, phase) => addRule(phase)"
    @save="onSave"
  />

  <RuleBuilderDrawer
    v-model:open="builderOpen"
    :seed="editingRule"
    :new-phase="newRulePhase"
    @apply="applyRule"
  />
</template>
