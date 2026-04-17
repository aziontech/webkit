<script setup lang="ts">

/**
 * MetadataLinks Component
 * 
 * Displays links to external resources like source code, Storybook, and Figma.
 * Used in component documentation headers.
 */

interface Props {
  source?: string;
  storybook?: string;
  figma?: string;
}

const props = defineProps<Props>();

interface LinkItem {
  href: string;
  label: string;
  iconClass: string;
}

const links: LinkItem[] = [];

if (props.source) {
  links.push({ href: props.source, label: 'Source', iconClass: 'pi pi-github' });
}
if (props.storybook) {
  links.push({ href: props.storybook, label: 'Storybook', iconClass: 'pi pi-book' });
}
if (props.figma) {
  links.push({ href: props.figma, label: 'Figma', iconClass: 'pi pi-palette' });
}
</script>

<template>
  <div v-if="links.length > 0" class="metadata-links font-mono flex gap-1">
    <a
      v-for="link in links"
      :key="link.href"
      :href="link.href"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex px-1.5 py-1.5 items-center leading-none text-default text-link group rounded-md"
    >
      <i class="mr-1.5" :class="link.iconClass" aria-hidden="true"></i>
      <span class="group-hover:underline text-xs">{{ link.label }}</span>
    </a>
  </div>
</template>

