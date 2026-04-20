<script setup lang="ts">
import { computed } from 'vue';
import AzButton from '../demo/AzButton.vue';
import BlockToastDemo from '../demo/BlockToastDemo.vue';

/**
 * ComponentPreview
 * 
 * Renders a component preview based on a code string.
 * Parses simple Vue-like syntax to extract props and content.
 */

interface Props {
  /** Code string like '<AzButton variant="primary">Click me</AzButton>' */
  code: string;
  /** Component name to render */
  componentName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  componentName: 'AzButton',
});

/**
 * Parse a Vue-like template string to extract props and slot content
 * Supports AzButton and BlockToastDemo tags.
 */
function parseCodeString(code: string, componentName: string): { props: Record<string, unknown>; slotContent: string } {
  const result: { props: Record<string, unknown>; slotContent: string } = {
    props: {},
    slotContent: '',
  };

  if (!code) return result;

  const tagName = componentName;
  // Allow opening tag to span multiple lines
  const tagRegex = new RegExp(`<${tagName}([\\s\\S]*?)\\s*\\/?>`, 'i');
  const tagMatch = code.trim().match(tagRegex);
  if (!tagMatch) return result;

  const propsString = tagMatch[1].replace(/\s+/g, ' ').trim();

  // Boolean attributes (component-specific)
  const booleanProps: string[] = [];
  if (tagName === 'AzButton') {
    ['disabled', 'loading', 'fullWidth'].forEach((p) => {
      if (new RegExp(`\\b${p}\\b`, 'i').test(propsString)) booleanProps.push(p);
    });
  } else if (tagName === 'BlockToastDemo') {
    ['autoClose', 'showProgress'].forEach((p) => {
      if (new RegExp(`\\b${p}\\b`, 'i').test(propsString)) booleanProps.push(p);
    });
  }
  booleanProps.forEach((prop) => {
    result.props[prop] = true;
  });

  // key="value" and :key="value" and key={number} and key={true|false}
  const valueRegex = /(\w+)=(["'])([^"']*)\2|:?(\w+)=\{(\d+)\}|:?(\w+)=\{(true|false)\}/g;
  let m;
  while ((m = valueRegex.exec(propsString)) !== null) {
    const key = (m[1] || m[4] || m[6]) as string;
    let value: string | number | boolean | undefined;
    if (m[3] !== undefined) value = m[3];
    else if (m[5] !== undefined) value = Number(m[5]);
    else if (m[7] !== undefined) value = m[7] === 'true';
    if (key && value !== undefined) {
      result.props[key] = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value;
    }
  }

  // Slot content for AzButton: <AzButton ...>content</AzButton>
  const closeTag = new RegExp(`</${tagName}\\s*>`, 'i');
  const contentMatch = code.trim().match(new RegExp(`>\\s*([^<]*)\\s*</${tagName}`, 'is'));
  if (contentMatch) {
    result.slotContent = contentMatch[1].trim();
  }

  return result;
}

const parsed = computed(() => parseCodeString(props.code, props.componentName));

// Map component names to their actual components
const componentMap: Record<string, unknown> = {
  AzButton,
  BlockToastDemo,
};

const componentToRender = computed(() => {
  return componentMap[props.componentName] || AzButton;
});
</script>

<template>
  <div class="inline-flex items-center justify-center">
    <component
      :is="componentToRender"
      v-bind="parsed.props"
    >
      {{ parsed.slotContent }}
    </component>
  </div>
</template>
