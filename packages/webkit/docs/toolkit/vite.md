# `@aziontech/webkit/vite` — optional Vite config

```ts
import { webkitViteConfig } from '@aziontech/webkit/vite'
```

`webkitViteConfig` is a partial Vite config, typed (`types/vite/index.d.ts`), so it type-checks in a
`vite.config.ts`. Today it holds one setting:

```ts
{
  optimizeDeps: {
    include: ['vee-validate']
  }
}
```

## What it is for

It makes Vite pre-bundle `vee-validate` when the dev server starts. Without it, Vite discovers the
package on the first page that imports it, optimizes it again and reloads the page; until that
reload two copies can be loaded, and `vee-validate` keeps its form context in module state, so a
field from one copy does not find the form from the other.

You need it only when **your app** uses `vee-validate`. WebKit's components do not import it (form
controls bind with `v-model`, see the `webkit-form` skill), `init` does not write it, and an app
without `vee-validate` can ignore this entry. A production build (`vite build`) is not affected.

## Use

Merge it rather than spread it, so your own `optimizeDeps` keeps its entries:

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig, mergeConfig } from 'vite'
import { webkitViteConfig } from '@aziontech/webkit/vite'

export default mergeConfig(webkitViteConfig, defineConfig({ plugins: [vue()] }))
```

`mergeConfig` concatenates arrays, so `optimizeDeps.include` ends up with `vee-validate` plus yours.
Spreading (`{ ...webkitViteConfig, optimizeDeps: { … } }`) would drop it.
