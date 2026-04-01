# PrimeVue Abstraction via Webkit — Abordagens Possíveis

## Problema

O console-kit importa diretamente do PrimeVue em ~102 arquivos (useToast, useDialog, Dialog, Toast, FilterMatchMode, etc.). Queremos que o **webkit seja a única interface** com o PrimeVue, permitindo:

- Remover `primevue` do `package.json` do console-kit
- Flexibilidade para trocar/atualizar PrimeVue sem impactar consumidores
- Padronizar a API de serviços (toast, dialog) em todos os projetos Azion

## Como o PrimeVue funciona internamente

```
Plugin (ToastService)          Composable (useToast)         Component (Toast)
       │                              │                            │
       ▼                              ▼                            ▼
  app.provide(Symbol, svc)      inject(Symbol) → svc        ToastEventBus.on('add')
       │                              │                            │
       └──────────────────────────────┘                            │
                    │                                              │
                    ▼                                              │
              svc.add(msg)  ──→  ToastEventBus.emit('add') ───────┘
```

- Cada serviço usa um `Symbol` único como chave de inject
- Serviços são stateless — delegam para um EventBus interno
- Composables (`useToast`, `useDialog`) apenas fazem `inject(Symbol)`

---

## Abordagem 1: Re-export Direto

Webkit apenas re-exporta tudo do PrimeVue sem nenhuma modificação.

```js
// @aziontech/webkit/use-toast
export { useToast } from 'primevue/usetoast'

// @aziontech/webkit/use-dialog
export { useDialog } from 'primevue/usedialog'

// @aziontech/webkit/toast-service
export { default as ToastService } from 'primevue/toastservice'

// @aziontech/webkit/dialog-service
export { default as DialogService } from 'primevue/dialogservice'
```

**Console-kit main.js:**
```js
import PrimeVueConfig from '@aziontech/webkit/primevue-config'
import ToastService from '@aziontech/webkit/toast-service'
import DialogService from '@aziontech/webkit/dialog-service'
import { Tooltip } from '@aziontech/webkit/tooltip'

app.use(PrimeVueConfig)
app.use(ToastService)
app.use(DialogService)
app.directive('tooltip', Tooltip)
```

| Pros | Contras |
|------|---------|
| Zero complexidade | Console-kit ainda precisa saber dos plugins individualmente |
| Sem risco de quebra | Nao abstrai nada — so muda o import path |
| Facil de implementar | Se trocar PrimeVue, todos os consumidores quebram |
| API identica | Nao agrega valor real alem de centralizar versao |

**Esforco:** Baixo |
**Abstracao:** Nenhuma

---

## Abordagem 2: Plugin Unificado (Facade)

Webkit expoe um unico plugin que encapsula toda a configuracao do PrimeVue.

```js
// @aziontech/webkit/plugin
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice'
import Tooltip from 'primevue/tooltip'

export const WebkitPlugin = {
  install(app, options = {}) {
    app.use(PrimeVue, options)
    app.use(ToastService)
    app.use(DialogService)
    app.directive('tooltip', Tooltip)
  }
}
```

**Console-kit main.js:**
```js
import { WebkitPlugin } from '@aziontech/webkit/plugin'

app.use(WebkitPlugin)
```

Composables continuam sendo re-exports:
```js
import { useToast } from '@aziontech/webkit/use-toast'
import { useDialog } from '@aziontech/webkit/use-dialog'
```

| Pros | Contras |
|------|---------|
| Setup simplificado (1 linha) | Composables ainda sao re-exports diretos |
| Esconde quais plugins sao necessarios | Menos transparencia sobre o que e registrado |
| Facil adicionar/remover servicos centralmente | Se trocar PrimeVue, composables ainda quebram |

**Esforco:** Baixo |
**Abstracao:** Parcial (setup sim, composables nao)

---

## Abordagem 3: Composables Wrapper (API Controlada)

Webkit cria seus **proprios composables** que internamente delegam para o PrimeVue, mas expoe uma API controlada.

```js
// @aziontech/webkit/use-toast
import { useToast as usePrimeToast } from 'primevue/usetoast'

export function useToast() {
  const toast = usePrimeToast()

  return {
    // API original (backward-compatible)
    add: (options) => toast.add(options),
    remove: (options) => toast.remove(options),
    removeAll: () => toast.removeAllGroups(),

    // Atalhos semanticos
    success: (detail, life = 5000) =>
      toast.add({ severity: 'success', summary: 'Success', detail, life }),
    error: (detail) =>
      toast.add({ severity: 'error', summary: 'Error', detail, life: 0 }),
    warn: (detail, life = 5000) =>
      toast.add({ severity: 'warn', summary: 'Warning', detail, life }),
    info: (detail, life = 5000) =>
      toast.add({ severity: 'info', summary: 'Info', detail, life }),
  }
}
```

```js
// @aziontech/webkit/use-dialog
import { useDialog as usePrimeDialog } from 'primevue/usedialog'

export function useDialog() {
  return usePrimeDialog()
}
```

| Pros | Contras |
|------|---------|
| API controlada pelo webkit | Mais codigo para manter |
| Atalhos uteis (success/error/warn) | Precisa manter paridade com PrimeVue |
| Trocar PrimeVue = mudar so os wrappers | |
| Backward-compatible (API original + extras) | |

**Esforco:** Medio |
**Abstracao:** Alta nos composables

---

## Abordagem 4: Provide/Inject Proprio (Full Abstraction)

Webkit cria seu **proprio sistema de provide/inject** com Symbols proprios, desacoplando completamente do PrimeVue.

```js
// @aziontech/webkit/plugin
const WebkitToastSymbol = Symbol('WebkitToast')
const WebkitDialogSymbol = Symbol('WebkitDialog')

export const WebkitPlugin = {
  install(app, options = {}) {
    app.use(PrimeVue, options)
    app.use(ToastService)
    app.use(DialogService)
    app.directive('tooltip', Tooltip)

    // Servicos webkit com Symbols proprios
    const toastService = {
      add: (opts) => app.config.globalProperties.$toast.add(opts),
      remove: (opts) => app.config.globalProperties.$toast.remove(opts),
      removeAll: () => app.config.globalProperties.$toast.removeAllGroups(),
      success: (detail, life = 5000) =>
        app.config.globalProperties.$toast.add({ severity: 'success', summary: 'Success', detail, life }),
      error: (detail) =>
        app.config.globalProperties.$toast.add({ severity: 'error', summary: 'Error', detail, life: 0 }),
      warn: (detail, life = 5000) =>
        app.config.globalProperties.$toast.add({ severity: 'warn', summary: 'Warning', detail, life }),
      info: (detail, life = 5000) =>
        app.config.globalProperties.$toast.add({ severity: 'info', summary: 'Info', detail, life }),
    }

    app.provide(WebkitToastSymbol, toastService)
    app.provide(WebkitDialogSymbol, app.config.globalProperties.$dialog)
  }
}
```

```js
// @aziontech/webkit/use-toast
import { inject } from 'vue'
const WebkitToastSymbol = Symbol.for('WebkitToast')

export function useToast() {
  const toast = inject(WebkitToastSymbol)
  if (!toast) throw new Error('WebkitPlugin is not installed!')
  return toast
}
```

| Pros | Contras |
|------|---------|
| Desacoplamento total do PrimeVue | Complexidade significativamente maior |
| Pode trocar PrimeVue sem mudar nenhum consumidor | Over-engineering para o cenario atual |
| Symbols proprios = controle total | Precisa manter 2 camadas de provide/inject |
| API totalmente customizavel | Problema com Symbol duplicado (veja abaixo) |

**Problema critico:** Os componentes wrapper do webkit (Toast.vue, Dialog.vue) internamente importam do PrimeVue, que escuta o EventBus original. Se os composables webkit usarem Symbols diferentes dos do PrimeVue, a comunicacao entre o `useToast()` do consumidor e o componente `<Toast>` do webkit **quebra**. Seria necessario registrar **ambos** os Symbols (PrimeVue + Webkit) apontando para o mesmo servico, ou reescrever os componentes — complexidade alta sem ganho proporcional.

**Esforco:** Alto |
**Abstracao:** Total (mas com complexidade desnecessaria)

---

## Abordagem 5: Hybrid — Plugin + Wrappers (Recomendada)

Combina o melhor das abordagens 2 e 3.

```js
// @aziontech/webkit/plugin
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice'
import Tooltip from 'primevue/tooltip'

export const WebkitPlugin = {
  install(app, options = {}) {
    app.use(PrimeVue, options)
    app.use(ToastService)
    app.use(DialogService)
    app.directive('tooltip', Tooltip)
  }
}
```

```js
// @aziontech/webkit/use-toast
import { useToast as usePrimeToast } from 'primevue/usetoast'

export function useToast() {
  const toast = usePrimeToast()

  return {
    ...toast,
    success: (detail, life = 5000) =>
      toast.add({ severity: 'success', summary: 'Success', detail, life }),
    error: (detail) =>
      toast.add({ severity: 'error', summary: 'Error', detail, life: 0 }),
    warn: (detail, life = 5000) =>
      toast.add({ severity: 'warn', summary: 'Warning', detail, life }),
    info: (detail, life = 5000) =>
      toast.add({ severity: 'info', summary: 'Info', detail, life }),
  }
}
```

```js
// @aziontech/webkit/use-dialog
import { useDialog as usePrimeDialog } from 'primevue/usedialog'

export function useDialog() {
  return usePrimeDialog()
}
```

```js
// @aziontech/webkit/api
export { FilterMatchMode } from 'primevue/api'
```

**Console-kit main.js:**
```js
import { WebkitPlugin } from '@aziontech/webkit/plugin'

app.use(WebkitPlugin)
```

**Console-kit componentes (zero mudanca na logica):**
```js
import { useToast } from '@aziontech/webkit/use-toast'

const toast = useToast()
toast.add({ severity: 'success', detail: 'OK', life: 3000 }) // funciona igual
toast.success('OK')  // atalho novo (adocao gradual, opcional)
```

| Pros | Contras |
|------|---------|
| 1 linha no setup | Composables wrapper = um pouco mais de manutencao |
| API original 100% compativel | Atalhos sao opcionais |
| Atalhos semanticos disponiveis | |
| Migracao mecanica no console-kit | |
| Se trocar PrimeVue, muda so os wrappers | |
| Usa os mesmos Symbols internos (sem conflito) | |

**Esforco:** Baixo-Medio |
**Abstracao:** Boa

---

## Comparativo Geral

| Criterio | 1. Re-export | 2. Plugin | 3. Wrappers | 4. Full Abstraction | 5. Hybrid |
|----------|:-----------:|:---------:|:-----------:|:-------------------:|:---------:|
| Esforco de implementacao | Baixo | Baixo | Medio | Alto | Baixo-Medio |
| Mudancas no console-kit | So imports | imports + main | imports + main | imports + main | imports + main |
| Abstracao real | Nenhuma | Parcial | Alta | Total | Boa |
| Risco de quebra | Zero | Zero | Baixo | Alto | Baixo |
| Facilidade de trocar PrimeVue | Dificil | Dificil | Possivel | Facil | Possivel |
| API estendida (atalhos) | Nao | Nao | Sim | Sim | Sim |
| Manutencao futura | Minima | Minima | Media | Alta | Baixa-Media |
| Componentes continuam funcionando | Sim | Sim | Sim | Problema* | Sim |

*Abordagem 4 tem conflito de Symbols entre os composables webkit e os componentes PrimeVue internos.

---

## Recomendacao: Abordagem 5 (Hybrid)

A Abordagem 5 oferece o melhor equilibrio porque:

1. **Plugin**: 1 linha no main.js, esconde a complexidade de registrar PrimeVue + 2 servicos + 1 diretiva
2. **Wrappers**: mantém API original (`toast.add()`) e adiciona atalhos (`toast.success()`) — adocao gradual
3. **Sem conflito**: usa os mesmos Symbols do PrimeVue internamente, entao componentes `<Toast>` e `<DynamicDialog>` continuam funcionando
4. **Migracao mecanica**: console-kit so troca import paths, sem mudar logica
5. **Futuro-proof**: se precisar trocar PrimeVue, muda so os wrappers no webkit — consumidores nao sao afetados

A Abordagem 4 (Full Abstraction) so faz sentido se houver planos **concretos** de substituir o PrimeVue por outra lib — caso contrario, e over-engineering.
