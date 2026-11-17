# vue-tsc 3.3.14: the upstream issue (draft, not filed)

M2.10 row 82. WebKit pins around this regression (`VUE_TSC_KNOWN_GOOD` and `VUE_TSC_BROKEN` in
`src/cli/toolchain.js`, the `webkit init` advice, the `webkit doctor` warning, the
`component-attr-double-slash` authoring check, `MIGRATION_V6.md`), but nobody has reported it to
`vuejs/language-tools`. Filing it is an outward-facing step, so it waits for the owner. Before
filing, run the repro below once with `vue-tsc@3.3.14` and with the latest release, and drop the
issue if the latest release already passes.

## Where we saw it

- `b9b694d3b`: vue-tsc / `@vue/language-core` 3.3.14 types every template expression after a static
  attribute containing `//` on a component as a ref ("Property 'value' does not exist").
- `00b130d85`: in a builder's app (language-core 3.3.14), `prefix="//"` on a component tag swallowed
  the `v-for` scope of the template below it (TS2304 on `section` and `sectionIndex`); WebKit's own
  check passed on 3.3.8. 3.3.13 is the last release we know to be good.

## Draft

**Title:** `//` inside a static attribute on a component breaks type-checking of the rest of the
template (3.3.14)

**Versions:** vue-tsc 3.3.14, @vue/language-core 3.3.14, vue 3.5, typescript 5.9. 3.3.13 is not
affected.

**Repro** (`App.vue` in a fresh `npm create vite@latest -- --template vue-ts` app):

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import Child from './Child.vue'

  const items = ref([{ id: 'a', label: 'A' }])
</script>

<template>
  <Child href="https://example.com/docs" />
  <ul>
    <li
      v-for="item in items"
      :key="item.id"
    >
      {{ item.label }}
    </li>
  </ul>
</template>
```

`Child.vue` declares `defineProps<{ href?: string }>()` and renders an anchor.

**Expected:** `vue-tsc --noEmit` passes, as it does on 3.3.13.

**Actual:** errors on the expressions after the `Child` tag: `item` is not found (TS2304), or a
value is typed as a ref ("Property 'value' does not exist"). Replacing the static attribute with a
binding (`:href="url"` with `const url = 'https://example.com/docs'`) or moving the tag below the
list makes the errors go away, which suggests the `//` in the attribute value is read as the start
of a line comment in the generated virtual code.

**Workaround we ship:** pin `vue-tsc` to 3.3.13, and bind any attribute value that contains `//`
from a script constant.
