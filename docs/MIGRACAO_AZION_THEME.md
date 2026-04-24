# Guia de Migracao para `@aziontech/theme`

Este documento descreve como migrar componentes que hoje usam:

- classes padrao do Tailwind (`text-gray-...`, `bg-neutral-...`, etc.);
- cores hardcoded em HEX (`#f3652b`, `#ef4444`, etc.);

para os tokens semanticos do `@aziontech/theme`, com fallback para o valor mais proximo quando nao existir token semantico equivalente.

---

## Objetivo da migracao

Padronizar o visual com tokens de design, garantindo:

- consistencia entre componentes;
- suporte a light/dark mode via tema;
- manutencao mais simples (evitar "hex espalhado").

---

## Estrategia recomendada

1. Preferir token semantico (`text-base`, `bg-surface`, `border-subtle`, etc.).
2. Se nao existir token semantico para o caso, usar token primitivo (`orange-500`, `neutral-700`, etc.).
3. Se ainda nao houver token adequado, usar valor aproximado temporario e abrir tarefa de tokenizacao.
4. Evitar novos hex hardcoded em componentes.

---

## Pre-requisitos

- Tema carregado no app:
  - `import '@aziontech/theme'`
- Root com classe do tema:
  - `<div class="azion">...</div>`
- Para dark mode:
  - `.azion.azion-dark` e/ou `.dark`

---

## Opcoes de integracao com Tailwind

## 1) Preset (cores via `colors.text.*`, `colors.background.*`, `colors.border.*`)

```js
import { preset } from '@aziontech/theme/tokens';

export default {
  presets: [preset],
  darkMode: 'class',
};
```

Exemplo de uso (com prefixo de grupo de cor):

- `text-text-default`
- `bg-background-surface`
- `border-border-subtle`

## 2) Plugin de utilitarios semanticos diretos (recomendado para migracao)

```js
import { tokenUtilities } from '@aziontech/theme/tokens';

export default {
  plugins: [
    tokenUtilities({
      darkSelector: '.dark',
      extraDarkSelectors: ['.azion.azion-dark'],
    }),
  ],
};
```

Exemplo de uso (classes diretas):

- `text-base`, `text-muted`, `text-link`
- `bg-surface`, `bg-canvas`, `bg-primary`
- `border-base`, `border-subtle`, `border-danger`

> Observacao: o repositorio tambem expoe plugin com classes como `text-default`/`bg-surface`. Mantenha um padrao unico no projeto para evitar mistura.

---

## Mapeamento pratico (Tailwind padrao -> Azion Theme)

## Texto

- `text-gray-900`, `text-neutral-900` -> `text-base` (ou `text-default` no padrao alternativo)
- `text-gray-600`, `text-neutral-600` -> `text-muted`
- `text-blue-600` -> `text-link`
- `text-orange-500` -> `text-primary`
- `hover:text-orange-600` -> `hover:text-primary-hover`
- `text-red-600` -> `text-danger`
- `text-green-600` -> `text-success`
- `text-yellow-600` -> `text-warning`

## Background

- `bg-white` -> `bg-surface`
- `bg-gray-50`, `bg-neutral-50` -> `bg-surface-overlay`
- `bg-gray-100`, `bg-neutral-100` -> `bg-canvas`
- `bg-orange-500` -> `bg-primary`
- `hover:bg-orange-600` -> `hover:bg-primary-hover`
- `bg-red-200` -> `bg-danger`
- `bg-green-200` -> `bg-success`
- `bg-yellow-200` -> `bg-warning`

## Border

- `border-gray-200`, `border-neutral-200` -> `border-subtle`
- `border-gray-100`, `border-neutral-100` -> `border-base`
- `border-black` -> `border-strong`
- `border-orange-500` -> `border-primary`
- `hover:border-orange-600` -> `hover:border-primary-hover`
- `border-red-600` -> `border-danger`
- `border-green-600` -> `border-success`
- `border-yellow-600` -> `border-warning`

---

## Mapeamento de HEX comum -> tokens sugeridos

- `#fe601f` / `#f3652b` -> `orange-500` (preferir semantico `text-primary`, `bg-primary`, `border-primary`)
- `#d95522` / `#d94a03` -> `orange-600` (preferir `*-primary-hover`)
- `#ef4444` -> `red-500` (ou semantico de danger)
- `#dc2626` -> `red-600` (ou semantico de danger)
- `#22c55e` -> `green-500` (ou semantico de success)
- `#16a34a` -> `green-600` (ou semantico de success)
- `#eab308` -> `yellow-500` (ou semantico de warning)
- `#ca8a04` -> `yellow-600` (ou semantico de warning)
- `#13131a` -> `slate-950` (avaliar `bg-canvas`/`bg-surface` no contexto)
- `#353040` -> `slate-900` (avaliar `border-subtle` no contexto)
- `#b5b1f4` -> `violet-300`
- `#8a84ec` -> `violet-500`

> Regra: quando for estado semantico (erro/sucesso/aviso/primario/link), prefira token semantico; para branding/ilustracao, primitivo pode ser aceitavel.

---

## Processo de migracao por componente

1. Identificar classes e hex no componente.
2. Classificar cada cor por intencao:
   - base/muted/link/primary/danger/success/warning/surface/canvas/border.
3. Substituir por token semantico.
4. Se nao houver equivalente, usar primitivo mais proximo.
5. Validar light/dark.
6. Atualizar Storybook com estados relevantes.

---

## Exemplo de migracao

## Antes

```vue
<button
  class="bg-[#f3652b] hover:bg-[#d95522] text-white border border-[#353040]"
>
  Acao
</button>
```

## Depois (semantico)

```vue
<button
  class="bg-primary hover:bg-primary-hover text-base border border-subtle"
>
  Acao
</button>
```

## Depois (fallback primitivo, se semantico nao cobrir)

```vue
<button
  class="bg-orange-500 hover:bg-orange-600 text-base border border-slate-900"
>
  Acao
</button>
```

---

## Casos especiais

- SVGs/ilustracoes de marca: nem toda cor deve virar token semantico; branding pode ficar em token primitivo.
- Markdown renderizado (string HTML): evitar hex embutido em string; extrair para classe utilitaria.
- Estados de validacao: usar `danger/success/warning` semantico, nao `red-*` direto.
- Componentes legados com muita variacao: migrar por prioridade visual (botoes, inputs, alertas, superficies).

---

## Criterio para "token mais semelhante"

Quando nao houver token semantico:

1. Mantem tonalidade (ex.: orange -> orange).
2. Mantem contraste no contexto (texto/borda/fundo).
3. Mantem hierarquia de estado (hover geralmente +1 shade no escuro ou no claro conforme padrao do tema).
4. Garante legibilidade WCAG minima para texto.

---

## Checklist de validacao

- [ ] Sem hex hardcoded novo em `.vue/.ts/.scss` (exceto assets/ilustracoes justificadas).
- [ ] Estados hover/focus/disabled usam token.
- [ ] Light mode validado.
- [ ] Dark mode validado (`.dark` e/ou `.azion.azion-dark`).
- [ ] Storybook atualizado para estados principais.
- [ ] Sem regressao visual em componentes criticos.

---

## Auditoria rapida (comandos uteis)

```bash
# Encontrar hex hardcoded
rg "#[0-9a-fA-F]{3,8}" packages/webkit/src

# Encontrar classes Tailwind de cor legadas comuns
rg "text-(gray|neutral|red|green|yellow|orange|blue)-|bg-(gray|neutral|red|green|yellow|orange|blue)-|border-(gray|neutral|red|green|yellow|orange|blue)-" packages/webkit/src
```

---

## Plano sugerido de rollout

1. Fase 1 (alto impacto): botoes, inputs, alertas, badges.
2. Fase 2: tabelas, cards, paineis e componentes de layout.
3. Fase 3: markdown renderizado e componentes especiais.
4. Fase 4: limpeza final + lint/auditoria + stories.

---

## Convencao final recomendada

- Para UI de produto: token semantico primeiro.
- Para branding/arte: primitivo controlado.
- Evitar duplicidade de abordagem dentro do mesmo componente.
- Documentar excecoes no Storybook.
