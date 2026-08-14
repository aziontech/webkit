<script setup>
  /**
   * NavItem — the site's product link row (Figma: Azion.com › NavigationItem,
   * node 8239:6965).
   *
   * A registration-framed product glyph, then the product's name over one line of
   * what it does.
   *
   * HOVER is a surface, not an inversion. The Figma variant flips the icon square to
   * white with a black glyph, which lights up a 30px box and leaves the line the
   * pointer is actually on unmarked. Instead the whole row takes a soft `--bg-hover`
   * plate with a hairline and a `card` radius, and the glyph goes brand — so the
   * hovered TARGET is what changes, at the size of the target. The plate is pulled
   * wider than the content on both sides so it reads as a row highlight rather than
   * a box drawn around the text — by its own padding PLUS its 1px border, which is
   * what keeps the glyph on the same column as the heading above it. Leave the border
   * out of that sum and every row sits 1px right of the column it belongs to.
   *
   * The row is a LINK when it has somewhere to go and a plain row otherwise: the
   * hover state is bound to the `group` class, which is only applied when `href`
   * is set, so a row that cannot be clicked never answers the pointer. Internal
   * destinations route through RouterLink so the app never reloads.
   */
  import { computed } from 'vue'
  import { RouterLink } from 'vue-router'

  const props = defineProps({
    // Icon font class for the product glyph, e.g. 'ai ai-edge-functions'.
    icon: {
      type: String,
      default: ''
    },
    // Product name — the row's first line.
    title: {
      type: String,
      default: ''
    },
    // One line of what the product does.
    description: {
      type: String,
      default: ''
    },
    // Destination. Empty renders a non-interactive row.
    href: {
      type: String,
      default: ''
    }
  })

  const isInternal = computed(() => props.href.startsWith('/'))
  const tag = computed(() => {
    if (!props.href) return 'div'
    return isInternal.value ? RouterLink : 'a'
  })
  const destination = computed(() => {
    if (!props.href) return {}
    return isInternal.value ? { to: props.href } : { href: props.href }
  })
</script>

<template>
  <component
    :is="tag"
    v-bind="destination"
    :class="href ? 'group' : ''"
    class="mx-[calc((var(--spacing-xs)+1px)*-1)] flex min-h-11 items-center gap-[var(--spacing-md)] rounded-[var(--shape-card)] border border-transparent p-[var(--spacing-xs)] transition-colors duration-fast-02 ease-productive-entrance hover:border-[var(--border-default)] hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] motion-reduce:transition-none"
  >
    <!-- The registration frame: a dashed hairline with a 4px inset, exactly the
         marker the rest of the site draws around a placed element. It holds still
         under the pointer — the plate behind the row is what answers it. -->
    <span
      class="flex shrink-0 items-center border border-dashed border-[var(--border-default)] p-[var(--spacing-xxs)]"
    >
      <span
        class="flex size-[30px] items-center justify-center bg-[var(--bg-surface-raised)]"
      >
        <i
          :class="[
            icon,
            'text-body-md text-[var(--text-default)] transition-colors duration-fast-02 ease-productive-entrance group-hover:text-[var(--primary)] motion-reduce:transition-none'
          ]"
          aria-hidden="true"
        />
      </span>
    </span>

    <span class="flex min-w-0 flex-1 flex-col justify-center gap-[var(--spacing-xxs)] break-words">
      <span class="text-label-sm leading-none text-[var(--text-default)]">{{ title }}</span>
      <span
        v-if="description"
        class="text-body-xs text-[var(--text-muted)]"
        >{{ description }}</span
      >
    </span>
  </component>
</template>
