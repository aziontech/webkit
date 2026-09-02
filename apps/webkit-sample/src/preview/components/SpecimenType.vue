<script setup>
  // THE TYPE SPECIMEN — every row is the token, rendered by the token.
  //
  // The samples are not screenshots or approximations: each row applies the real generated
  // class, so what the slide shows IS what a component gets. That is the point of a specimen
  // in a design-system deck — if a token changed and this slide did not, the slide would be
  // lying, and here it cannot.
  //
  // The right column states what the token bundles. A text style in this system is not a font
  // size: family, size, line height, tracking and case travel together under one name, which
  // is why a component never sets five properties to typeset a heading.
  //
  // ONE SAMPLE STRING for every row. A specimen that changes its words per size measures the
  // words, not the type.
  import Overline from '@aziontech/webkit/overline'

  const SAMPLE = 'Move to the edge'

  // `class` here is the datum, not a style preset: the row exists to demonstrate that exact
  // utility. The spec column is the compiled result, in px at this canvas' pinned step.
  const LADDER = [
    { class: 'text-heading-2xl', token: 'heading-2xl', spec: 'Sora 56 / 70 · 400' },
    { class: 'text-big-number-lg', token: 'big-number-lg', spec: 'Proto Mono 56 / 70 · 400' },
    { class: 'text-heading-xl', token: 'heading-xl', spec: 'Sora 36 / 45 · 400' },
    { class: 'text-heading-md', token: 'heading-md', spec: 'Sora 24 / 30 · 400' },
    { class: 'text-heading-sm', token: 'heading-sm', spec: 'Sora 18 / 24.75 · 400' },
    { class: 'text-body-lg', token: 'body-lg', spec: 'Sora 18 / 24.75 · 400' },
    { class: 'text-body-md', token: 'body-md', spec: 'Sora 16 / 22 · 400' },
    { class: 'text-label-md', token: 'label-md', spec: 'Sora 14 / 21 · 400' },
    {
      class: 'text-overline-md',
      token: 'overline-md',
      spec: 'Proto Mono 14 / 19.25 · +1.6 · caps'
    },
    { class: 'text-label-code-md', token: 'label-code-md', spec: 'Roboto Mono 14 / 14' }
  ]

  defineProps({
    slide: { type: Object, required: true }
  })
</script>

<template>
  <div class="flex h-full flex-col">
    <header
      class="flex shrink-0 flex-col gap-(--spacing-md) border-b border-(--border-default) px-(--spacing-xxl) py-(--spacing-xl)"
    >
      <Overline
        prefix="//"
        show-cursor
        >{{ slide.eyebrow }}</Overline
      >
      <h2 class="m-0 text-balance text-heading-xl text-(--text-default)">{{ slide.headline }}</h2>
      <p class="m-0 max-w-(--container-3xl) text-pretty text-body-md text-(--text-muted)">
        {{ slide.description }}
      </p>
    </header>

    <div class="flex flex-1 flex-col justify-center px-(--spacing-xxl)">
      <div
        v-for="row in LADDER"
        :key="row.token"
        class="flex items-baseline justify-between gap-(--spacing-xl) border-t border-(--border-muted) py-(--spacing-xs) first:border-t-0"
      >
        <!-- The sample. `truncate` keeps the longest step from pushing the spec column off the
             frame; at 56px the string fits, and a token that ever stopped fitting should be
             visible as a clip rather than as a silently reflowed slide. -->
        <span
          :class="row.class"
          class="truncate text-(--text-default)"
          >{{ SAMPLE }}</span
        >
        <span class="flex shrink-0 items-baseline gap-(--spacing-lg)">
          <code class="text-label-code-md text-(--primary)">{{ row.token }}</code>
          <span class="w-72 text-right text-label-md text-(--text-muted)">{{ row.spec }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
