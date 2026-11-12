# `@aziontech/webkit/vite` — deprecated

```ts
import { webkitViteConfig } from '@aziontech/webkit/vite'
```

**Deprecated since 6.0, removed in 7.0.** WebKit no longer depends on `vee-validate`: no component,
block or example imports it (form controls bind with `v-model` inside `Field`, see the
`webkit-form` skill), so the package dropped it from `dependencies` and this entry has nothing of
WebKit's to pre-bundle. It keeps working unchanged until 7.0.

`webkitViteConfig` is a partial Vite config:

```ts
{
  optimizeDeps: {
    include: ['vee-validate']
  }
}
```

## Replacement

An app that uses `vee-validate` itself installs it and pre-bundles it in its own config, so Vite
does not discover it on the first page that imports it and reload with a second copy (`vee-validate`
keeps its form context in module state, so a field from one copy would not find the form from the
other):

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: { include: ['vee-validate'] }
})
```

An app without `vee-validate` removes the `webkitViteConfig` import and its `mergeConfig` call.
