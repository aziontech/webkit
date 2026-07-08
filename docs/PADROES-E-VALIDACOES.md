# Catálogo completo — o que validamos (cada rule, hook, lint, skill e agent)

Este documento lista **literalmente cada item** do nosso sistema de padrões e validação,
com o que cada um faz e o que garante. Objetivo: **certeza total do que estamos validando**.

**Princípio:** o que **sugerimos** à IA e o que **bloqueamos** têm que ser a mesma coisa. A
IA cria o componente seguindo os padrões/specs; se algo foge (oscilação da IA *ou* erro
nosso), o merge é impedido. Duas frentes, mesma checagem:
- **Write-time** — hooks `.claude/hooks/*`, disparam a cada `Write`/`Edit` no pipeline; `exit 2` bloqueia.
- **CI** — `governance.yml` no pull request; barra o merge de todo mundo (IA ou humano).

Legenda de enforcement: 🔴 **bloqueante** · 🟡 **permissivo** (orienta, review confere — dívida a fechar).

Inventário: **23 rules · 7 hooks · 10 lints (ESLint) + stylelint · 13 skills · 10 agents · 7 jobs de CI.**

### A garantia mecânica: fonte única + meta-check

Para "sugerido = bloqueado" não depender de disciplina, existe **uma fonte** e **um teste que
falha o CI se elas divergirem**:

- **`.claude/hooks/_lib/standards.mjs`** — o **registro único**: cada standard (a rule que a
  IA segue) → sua enforcement (o gate que bloqueia), ou `reviewGated` explícito.
- **`.claude/hooks/_lib/authoring-checks.mjs`** — o **motor único** de checagem, consumido
  pelo hook write-time (`validate-authoring`) **e** pelo ratchet de CI (`check-authoring`) —
  os dois gates não conseguem divergir entre si.
- **`packages/webkit/test/standards/invariant.test.mjs`** (roda no job `toolkit`) — garante o
  invariante: toda rule tem entrada no registro; toda entrada aponta para uma rule que
  existe; toda entrada tem gate **ou** é `reviewGated` (sem lacuna silenciosa); todo check
  executável aponta para um standard enforçado write-time; e o hook e o ratchet usam o mesmo
  motor. **Se alguém adicionar sugestão sem trava — ou trava sem rule — o CI falha.**

---

## 1. RULES (23) — os padrões que definimos

Ficheiros em `.claude/rules/*.md`. Cada rule fixa uma decisão e diz quem a cobra.

### 1a. Fundacionais (11)

| # | Rule | O que exige | Enforçada por |
|---|---|---|---|
| 1 | `no-invention` | Nada além da spec: nenhuma prop/evento/slot/import que a spec não liste. | 🔴 validate-spec-compliance · validate-references |
| 2 | `prop-vocabulary` | Um nome/tipo/default por conceito: `kind`, `size` (`small\|medium\|large`), `disabled`/`loading`/`open`, boolean positivo sem `is/has`, texto opcional default `''`. Aliases banidos (`variant`, `sm/md/lg`, `closeable`, `isX`, `status`→`severity`…). | 🔴 validate-spec-compliance |
| 3 | `naming` | **Um** nome kebab nas 6 superfícies: spec, arquivo, export, `defineOptions.name` (PascalCase), `data-testid`, binding da story. | 🔴 validate-spec-compliance · validate-story-source |
| 4 | `imports` | Nome público **flat** (`@aziontech/webkit/<nome>`); a categoria vive só na pasta e na árvore do Storybook. | 🔴 validate-references |
| 5 | `compound-api` | Composição: `index.ts` compound (sub-componentes via `Object.assign`) + export `-root` tree-shakeable; sem `package.json` por componente. | 🟡 scaffolder + review |
| 6 | `styling` | Utilitários inline na raiz, variantes via `data-*`; **sem** preset de classe em JS, `<style>` ou CSS local. | 🔴 validate-tokens |
| 7 | `dependencies` | **Sem** lib externa de posicionamento/animação (`floating-ui`, `popper`, `tippy`, `gsap`, `framer-motion`, `@vueuse/motion`…). CSS + tokens + primitivos Vue. | 🔴 validate-references |
| 8 | `migration` | Nunca herdar artefato de fora (outro DS, Figma, Base UI/Reka/Radix/shadcn) como está — reescrever para nossas convenções. | 🟡 envelope dos agents |
| 9 | `storybook-source` | O painel "Show code" é um SFC que roda ao colar (via `toSfc`), tags PascalCase. | 🔴 validate-story-source |
| 10 | `release-types` | O conjunto tipo-de-commit → bump é **idêntico** em `commitlint`, todos os `.releaserc`, `CONTRIBUTING` e os comandos de PR. | 🔴 commitlint + .releaserc |
| 11 | `git-workflow` | Branch/PR sempre via `/create-branch` e `/open-pr`, base `dev` (nunca `main`); docs/rules em PR separado do código. | 🟡 comandos + processo |

### 1b. Construção (12) — a superfície do próprio componente

| # | Rule | O que exige | Enforçada por |
|---|---|---|---|
| 12 | `component-structure` | Layout de pastas fixo + ordem fixa do `<script setup>` (imports → defineOptions → tipos → props → emits → models → slots → inject → estado → computed → watch → funções → expose). | 🟡 scaffolder + review |
| 13 | `props` | `interface Props` tipada + `withDefaults` + JSDoc por prop; unions de variante exportadas; sem `any`; sem `class` em `defineProps`. | 🔴 validate-authoring · validate-spec-compliance · validate-tokens |
| 14 | `v-model` | Valor two-way **só** via `defineModel` (controlado + não-controlado num macro); modelo secundário nomeado. | 🔴 validate-authoring · check-authoring · lint prefer-define-model |
| 15 | `emits` | `defineEmits<{…}>()` tipado, nomes kebab; modelo emite o valor, ativação emite o evento DOM primeiro; sem evento-eco. | 🔴 validate-authoring · validate-spec-compliance |
| 16 | `slots` | `defineSlots<{…}>()` tipado, nomes kebab, fallback dentro do slot. | 🔴 validate-authoring · validate-spec-compliance |
| 17 | `composables` | Retorna refs/computed/funções (nunca `reactive()`), estado `readonly()` pra fora, args via `toValue`, cleanup em `onScopeDispose`; arquivo `.ts`; context composable p/ compound. | 🔴 validate-authoring |
| 18 | `root-element` | Dono da raiz: polimorfismo por `href` (não `as`), `inheritAttrs:false` + `$attrs` + `cn`, `defineExpose` mínimo. | 🟡 scaffolder + review (parte via validate-tokens/references) |
| 19 | `component-states` | Superfície de estados declarada e renderizada via `data-*` + componentes do DS (`Skeleton`, `EmptyState`); sem spinner/“vazio” ad-hoc. | 🟡 spec (state matrix) + review |
| 20 | `accessibility` | Role, mapa de teclado, foco (`useId`, focus-trap, restore), `motion-reduce:` em toda animação. | 🟡/🔴 eslint a11y (estático) + axe (comportamental, testes) |
| 21 | `testid` | `data-testid` na raiz derivado `<categoria>-<nome>` (`input-<nome>`), sobrescrevível. | 🔴 validate-spec-compliance |
| 22 | `deprecation` | Marca `@deprecated` (nomeando substituto + versão de remoção) → mantém 1 major → remove. | 🔴 lint no-deprecated-component (consumidor) |
| 23 | `bundle-budget` | `size-limit` por entry; tree-shaking intacto. | 🟡 config pronta; job de CI pendente |

---

## 2. HOOKS (7) — validação bloqueante no write-time

`.claude/hooks/*.mjs`, registrados em `.claude/settings.json`. Disparam a cada `Write`/`Edit`,
`exit 2` = bloqueado, fail-open em erro. Só barram violação **nova** (baseline-diff).

| # | Hook | Quando | O que **bloqueia** |
|---|---|---|---|
| 1 | `validate-tokens` | Pre `Write/Edit` em `packages/webkit/src` | HEX/RGB/HSL, palette Tailwind (`bg-gray-*`), tipografia crua (`text-sm`, `leading-*`, `tracking-*`, `font-family`), utilitário de cor externo (`text-color`, `surface-*`), `any`/`@ts-ignore`, `class` em `defineProps`, **preset de classe em JS** (`const kindClasses={}`), `<style>`, `@keyframes` local, `animate-[…]`/`duration-[…]` arbitrários. |
| 2 | `validate-references` | Pre `Write/Edit` | Import **fantasma** (path fora do `package.json#exports`), relativo que não resolve, pacote não instalado, **lib proibida** (posição/animação). |
| 3 | `validate-spec-compliance` | Post `Write/Edit` | `.vue` ≠ spec (props/eventos/slots que a spec não lista), **alias banido**, prefixo `is/has`, boolean negativo, união de `size` fora de ordem, **evento-eco**, evento camelCase, **default-drift** (default do código ≠ spec), animação fora do catálogo, `defineOptions.name`/`data-testid` divergentes. |
| 4 | `validate-story-source` | Pre `Write/Edit` em `*.stories.*` | Story sem `toSfc`/`source.code`, `docs` como função (não literal), `<template>` aninhado, tag kebab/minúscula, binding ≠ subpath do import. |
| 5 | `validate-authoring` **(novo)** | Pre `Write/Edit` em `packages/webkit/src` | `modelValue`+`update:modelValue` manual (→ `defineModel`), `defineProps({})`/`defineEmits([])` runtime (→ forma tipada), `<slot>` sem `defineSlots`, composable com `return reactive()` ou novo em `.js`, `@deprecated` sem substituto/versão. |
| 6 | `enforce-spec-exists` | Pre `Write` de `.vue` | Escrever componente **sem** spec aprovada + checksum válido (anti-adulteração). |
| 7 | `enforce-component-create` | Pre `Write` | Criar componente **fora** do pipeline `/component-create` (skill precisa estar no transcript). |

> `component-categories.mjs` é um helper compartilhado (lista de categorias), não um hook.

---

## 3. LINTS (10 ESLint) + stylelint — uso correto no consumidor / autoria

`packages/webkit/src/eslint-plugin` (publicado). Presets: `recommended` (correção=error,
sugestões=warn), `strict` (tudo error), `performance`.

| # | Regra ESLint | O que **pega** | recommended |
|---|---|---|---|
| 1 | `valid-import-path` | Typo no subpath (`@aziontech/webkit/buton`) — com **autofix** | error |
| 2 | `no-deep-internal-import` | Import de caminho interno (`@aziontech/webkit/src/**`) | error |
| 3 | `no-barrel-import` | `import { X } from '@aziontech/webkit'` (puxa o bundle inteiro) | error |
| 4 | `no-deprecated-component` | Import de componente marcado deprecated (sugere o substituto) | error |
| 5 | `no-hardcoded-color` | HEX/palette em `class`/`style` | warn |
| 6 | `prefer-tree-shakeable-root` | Compound importado quando só o root é usado (→ export `-root`) | warn |
| 7 | `no-whole-icon-set-import` | Binding do set de ícones inteiro (mata tree-shaking) | warn |
| 8 | `prefer-webkit-component` | Import de lib de UI externa onde há equivalente webkit (libs configuráveis pelo consumidor) | warn |
| 9 | `no-style-override` | `class`/`style` no tag de um componente webkit (escape via `styleSeam`/`allow`) | warn |
| 10 | `prefer-define-model` **(novo)** | Par manual `modelValue`+`update:modelValue` num `<script setup>` (→ `defineModel`) | warn |

**stylelint-config** (`src/stylelint-config.js`): bloqueia hex/rgb em CSS/SCSS.
**MCP** (guia proativo): responde o import/token/componente certo antes do erro (ver §5).

---

## 4. SKILLS (13) — as receitas executáveis (`.claude/skills/<nome>/SKILL.md`)

| # | Skill | O que faz |
|---|---|---|
| 1 | `spec-create` | Rascunha a `.specs/<nome>.md` interativamente (perguntas), como `draft`. |
| 2 | `spec-validate` | Valida a spec (schema, corpo, bloco Constraints), sela com checksum e vira `approved`. |
| 3 | `structure-decide` | Decide monolítico vs. composição (critério shadcn-vue). |
| 4 | `reuse-audit` | Varre composables/utils/siblings por lógica a reusar. |
| 5 | `figma-discover` | Puxa variáveis, regiões e estados de um frame do Figma (MCP). |
| 6 | `token-map` | Mapeia tokens do Figma → classes/`var(--*)` do DESIGN.md. |
| 7 | `component-scaffold` | Escreve o `.vue` (+ sub-componentes, `index.ts`, entrada de exports). |
| 8 | `storybook-write` | Escreve a story mínima e runnable (via `toSfc`). |
| 9 | `code-connect-write` | Escreve o mapping `<nome>.figma.ts` (pula se Code Connect não instalado). |
| 10 | `echo-report` | Re-lê tudo que foi escrito e faz diff independente contra a spec. |
| 11 | `validate-component` | Roda os gates: `lint` · `type-check` · `type-coverage` · `storybook:build`. |
| 12 | `add-animation` | Adiciona animação ao catálogo do theme (nunca inline). |
| 13 | `audit-fix` | Remedia advisories do `pnpm audit` com guardrail de semver. |

---

## 5. AGENTS (10) — os executores isolados (`.claude/agents/<nome>.md`)

Cada agente roda **uma** skill, vê só a spec + suas regras (sem histórico), e emite
`BLOCKED:` se algo falta (nunca chuta). As "regras" abaixo são o **envelope** injetado.

| # | Agent | Skill | Regras que carrega | Produz |
|---|---|---|---|---|
| 1 | `spec-author` | spec-create | tokens, naming, dependencies, migration, storybook | `.specs/<nome>.md` (draft) |
| 2 | `spec-validator` | spec-validate | tokens, naming | frontmatter da spec (status, checksum) |
| 3 | `structure-decider` | structure-decide | naming | 2 linhas (veredito) |
| 4 | `reuse-auditor` | reuse-audit | dependencies | JSON de sugestões |
| 5 | `figma-extractor` | figma-discover | migration | JSON de tokens |
| 6 | `token-mapper` | token-map | tokens | tabela de mapeamento |
| 7 | `scaffolder` | component-scaffold | **no-invention, naming, component-structure, props, prop-vocabulary, v-model, emits, slots, composables, root-element, component-states, styling, tokens, accessibility, testid, dependencies, migration** | `.vue` + sub-componentes + exports |
| 8 | `storybook-writer` | storybook-write | naming, tokens, storybook, no-invention | `<Nome>.stories.js` |
| 9 | `code-connect-writer` | code-connect-write | naming, migration | `<nome>.figma.ts` |
| 10 | `echo-reporter` | echo-report | naming, tokens, storybook | relatório (diff vs spec) |

> O `scaffolder` é o que mais carrega: recebe **o contrato de construção inteiro**, então não
> consegue adicionar prop fora da spec, usar nome não-canônico, hand-roll de `v-model`,
> cor hardcoded, ou pular o `data-testid`.

---

## 6. CI (`governance.yml`) — o gate do pull request

Todos required; curto-circuitam quando nada relevante mudou.

| # | Job | Faz |
|---|---|---|
| 1 | `lint` | ESLint (zero warnings) · Stylelint · Prettier |
| 2 | `types` | `vue-tsc` + type-coverage ≥ 95% |
| 3 | `toolkit` | testes do toolkit + catalog drift + **`check-authoring`** (o ratchet de autoria) |
| 4 | `security` | `pnpm audit` · TruffleHog (secret scan) · unused-deps |
| 5 | `build` | pack dry-run |
| 6 | `storybook` | build do Storybook |
| 7 | `governance-check` | gate de resumo: passa só se todos verdes ou skipped |

O **`check-authoring`** roda as **mesmas checagens do `validate-authoring`** sobre
`packages/webkit/src`, contra um baseline congelado, e **falha o PR em qualquer violação
nova** — inclusive de edição humana fora do pipeline.

---

## 7. Permissivo × Bloqueante (o que ainda NÃO trava sozinho)

🔴 **Bloqueante hoje:** no-invention, prop-vocabulary, naming, imports, styling,
dependencies, storybook-source, release-types, props, v-model, emits, slots, composables,
testid + todos os 7 hooks + o ratchet de CI + as 10 regras de lint no consumidor.

🟡 **Permissivo hoje (orienta, review/axe confere — dívida a fechar):** `component-structure`
(ordem do script), `root-element` (defineExpose/polimorfismo), `component-states` (state
matrix completa), acessibilidade **comportamental** (foco/teclado → `axe` nos testes),
`bundle-budget` (config pronta, job de CI pendente), `compound-api`/`migration`/`git-workflow`
(review/processo).

> Regra de ouro: **nenhum padrão está "pronto" sem uma trava automática que barre o merge.**
> Item permissivo é dívida, não proteção.

---

## 8. Exemplos `❌ / ✅` por padrão

### 8a. Criação (autoria do componente)

| Padrão | ❌ Evitar | ✅ Seguir | 🔒 Trava |
|---|---|---|---|
| Props | `defineProps({ variant:{type:String}, isDisabled:Boolean })` | `withDefaults(defineProps<Props>(), { kind:'primary', disabled:false })` | validate-authoring · spec-compliance · tokens |
| v-model | `props modelValue` + `emit('update:modelValue')` | `const model = defineModel<string>()` | validate-authoring · check-authoring · prefer-define-model |
| Emits | `defineEmits(['click'])` | `defineEmits<{ 'item-click':[e,item] }>()` | validate-authoring · spec-compliance |
| Slots | `<slot/>` sem `defineSlots` | `defineSlots<{ default():unknown }>()` | validate-authoring · spec-compliance |
| Composables | `return reactive({...})` | `return { value: readonly(v), set }` | validate-authoring |
| Estilo / tokens | `bg-[#f3652b]` · `text-blue-600` · `const kindClasses={}` | `data-[kind=primary]:bg-[var(--primary)]` inline | validate-tokens |
| Vocabulário | `variant` · `sm/md/lg` · `isDisabled` | `kind` · `small/medium/large` · `disabled` | spec-compliance |
| Nome / import | `import Chip from '@aziontech/webkit/chips'` | `import Chip from '@aziontech/webkit/chip'` | spec-compliance · story-source · references |
| data-testid | *(sem testid na raiz)* | `:data-testid="testId"` → `input-chip` | spec-compliance |
| Acessibilidade | `<div @click="...">` | `<button>` + `focus-visible` + `motion-reduce:` | eslint a11y (estático) + axe (testes) |

### 8b. Implementação (app consumindo o webkit)

| Padrão | ❌ Evitar | ✅ Seguir | 🔒 Trava |
|---|---|---|---|
| Preferir webkit | `import { Button } from 'lib-externa/button'` | `import Button from '@aziontech/webkit/button'` | prefer-webkit-component |
| Sem barrel | `import { Button } from '@aziontech/webkit'` | `import Button from '@aziontech/webkit/button'` | no-barrel-import |
| Sem interno / typo | `@aziontech/webkit/src/components/x` · `.../buton` | `@aziontech/webkit/button` | no-deep-internal-import · valid-import-path |
| Tree-shaking | `import Table` (compound) usando só o root | `import TableRoot from '@aziontech/webkit/table-root'` | prefer-tree-shakeable-root |
| Não sobrescrever estilo | `<Button class="p-8" />` | `<Button><MinhaMarcacao/></Button>` ou `styleSeam` | no-style-override |
| Sem deprecated | `import X from '@aziontech/webkit/empty-results-block'` | `import EmptyState from '@aziontech/webkit/empty-state'` | no-deprecated-component |
| Cor via token | `class="text-[#fff]"` | `class="text-[var(--text-default)]"` | no-hardcoded-color |
| Ícones | `import Icons from '@aziontech/icons'` | `import '@aziontech/icons'` *(side-effect)* | no-whole-icon-set-import |

---

## 9. Fluxo, ponta a ponta

```
CRIAÇÃO (pipeline da IA — write-time)
  spec ──► discovery ──► scaffold ──► story ──► validação
   🔒                      🔒           🔒         🔒
 enforce-spec-exists   validate-     validate-  lint/type/
 validate-compliance   authoring     story-src  coverage/build
                       tokens
                       references

ENTREGA (pull request — CI)
  PR ──► lint · types · toolkit(+ratchet) · security · build · storybook ──► review ──► merge
          🔒 check-authoring = mesma checagem do write-time                   🔒 2 aprovações
```

**Em uma frase:** a IA cria seguindo os padrões (injetados no scaffolder); qualquer desvio —
dela ou nosso — é barrado no write-time e de novo no PR pela mesma checagem; e o consumidor é
mantido no padrão pelo eslint-plugin + MCP no CI do app dele.
