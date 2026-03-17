<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import type { PropMetadata, PropsValues } from './types';
import PlaygroundTextControl from './PlaygroundTextControl.vue';
import PlaygroundBooleanControl from './PlaygroundBooleanControl.vue';
import PlaygroundNumberControl from './PlaygroundNumberControl.vue';
import PlaygroundSelectControl from './PlaygroundSelectControl.vue';
import { t } from '@/lib/i18n';
import { getDefaultLanguage } from '@/config';

/**
 * PlaygroundPropControl
 *
 * Dynamic control renderer that selects the appropriate
 * control component based on the prop metadata.
 */

interface Props {
  name: string;
  metadata: PropMetadata;
  modelValue: unknown;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: unknown];
}>();

// Determine which control to render based on metadata
const controlType = computed(() => props.metadata.control);

// Language for icon help text (detect from URL: /pt/ → pt)
const language = ref(getDefaultLanguage());
onMounted(() => {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/pt')) {
    language.value = 'pt';
  }
});
const iconHelpViewFull = computed(() => t('playground.iconHelpViewFull', language.value));
const iconHelpIconList = computed(() => t('playground.iconHelpIconList', language.value));
</script>

<template>
  <div class="w-full">
    <!-- Text Control -->
    <div v-if="controlType === 'text'" class="flex flex-col gap-1">
      <PlaygroundTextControl
        :name="name"
        :metadata="metadata as any"
        :model-value="(modelValue as string)"
        @update:model-value="emit('update:modelValue', $event)"
      />
      <span v-if="name === 'icon'" class="text-xs text-muted">
        {{ iconHelpViewFull }}
        <a
          href="https://icons-gallery.azion.app/"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-default transition-colors"
        >{{ iconHelpIconList }}</a>
      </span>
    </div>

    <!-- Boolean Control -->
    <PlaygroundBooleanControl
      v-else-if="controlType === 'boolean'"
      :name="name"
      :metadata="metadata as any"
      :model-value="(modelValue as boolean)"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <!-- Number Control -->
    <PlaygroundNumberControl
      v-else-if="controlType === 'number'"
      :name="name"
      :metadata="metadata as any"
      :model-value="(modelValue as number)"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <!-- Select Control -->
    <PlaygroundSelectControl
      v-else-if="controlType === 'select'"
      :name="name"
      :metadata="metadata as any"
      :model-value="(modelValue as string)"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <!-- Fallback for unknown control types -->
    <div v-else class="p-2 bg-amber-100 rounded-md">
      <span class="text-xs text-muted">
        Unknown control type: {{ controlType }}
      </span>
    </div>
  </div>
</template>
