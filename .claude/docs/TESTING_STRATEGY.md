# Proposta — Estratégia de testes para `packages/webkit`

> **Status:** proposta (draft) — pendente de aprovação antes da Fase 0.
> **Escopo:** apenas `packages/webkit`. `packages/theme` e `packages/icons` ficam de fora desta proposta.

## 1. Contexto

Hoje `packages/webkit` tem **157 componentes**, **77 stories**, **76 specs** e **zero testes**. A CI roda apenas lint, type-check, type-coverage (95 %) e `storybook:build` ([`.github/workflows/governance.yml`](../../.github/workflows/governance.yml)). O hook `/component-verify` (skill [`validate-component`](../skills/validate-component/SKILL.md)) também não roda testes — só os mesmos comandos da CI. Chromatic (`@chromatic-com/storybook` 5.0.1) e `@storybook/addon-a11y` estão **instalados mas não fiados** em nenhum workflow.

A consequência: regressões de comportamento (props, eventos, foco, ARIA, ordem de teclado, animação) só são pegas em revisão visual ou em produção. Os hooks de spec-compliance ([`validate-spec-compliance.mjs`](../hooks/validate-spec-compliance.mjs)) garantem que `.vue` declara o que o `.specs/<name>.md` promete, mas não garantem que **funciona**.

O objetivo desta proposta é estabelecer uma estratégia de testes **em camadas, pragmática e progressiva** que:

1. reaproveite o que já existe (stories + Storybook 8 + Chromatic);
2. cubra os quatro eixos pedidos (unit, integração, visual regression, a11y) sem virar cerimônia;
3. integre na CI sem dobrar o tempo de pipeline.

## 2. Princípio diretor — **a story é o fixture**

Em vez de manter dois mundos (stories + tests separados), tratamos cada `*.stories.js` como o fixture canônico. Storybook 8 já roda essas stories como teste via **Portable Stories** (`composeStories`) — o mesmo arquivo serve para documentação, visual regression (Chromatic), interaction test (`play()`) e unit test (importado no Vitest). Isso elimina duplicação e torna a barra de entrada de cada componente:

> "tem story + tem `play()` para os fluxos críticos + tem `<name>.test.ts` com o smoke."

## 3. A estratégia em 4 camadas

### Camada 1 — Unit (Vitest + Portable Stories)

**Stack:**

- `vitest` + `@vitest/browser` (modo browser com Playwright provider — necessário porque os componentes dependem de CSS real, `getBoundingClientRect`, foco do DOM e CSS anchor positioning, e a [regra de dependências](../rules/dependencies.md) proíbe libs de positioning)
- `@vue/test-utils` (mount programático quando a story não basta)
- `@storybook/vue3-vite` (já instalado) + `@storybook/test` (já 8.6.15) para `composeStories`

**Convenção:**

- Arquivo de teste **colocado** ao lado do componente: `packages/webkit/src/components/<category>/<name>/<name>.test.ts`
- Importa stories do mesmo nome via `composeStories` — sem reescrever fixtures
- Testa: contrato de props (tipos), eventos disparados, valores default, slots renderizados, atributos `data-*` corretos, compound API (`Foo.Bar` resolve), import standalone (`<name>-root`) tree-shakeable
- **Não testa:** aparência (Chromatic faz), implementação interna (CSS pseudo-classes, ordem de classes Tailwind)

**Barra mínima por componente:**

```ts
import { composeStories } from '@storybook/vue3-vite'
import { render } from '@testing-library/vue'
import * as stories from '<path>/Button.stories'

const { Default, Disabled } = composeStories(stories)

it('renders default with kind=primary', () => {
  const { getByRole } = render(Default())
  expect(getByRole('button')).toHaveAttribute('data-kind', 'primary')
})

it('does not emit click when disabled', async () => {
  // ...
})
```

### Camada 2 — Integração / interação (`play()` no Storybook + Vitest browser)

**Stack:** mesma da Camada 1 — `play()` functions já são suportadas por `@storybook/test` (userEvent + expect embutidos) e rodam no Vitest browser via `composeStories`.

**Convenção:**

- Toda story de **fluxo interativo** (toggle, focus trap, keyboard navigation, compound state) ganha um `play()` que documenta o fluxo
- O `play()` vira teste de integração **automaticamente** quando rodamos a Camada 1 — sem novo runner, sem novo CI step
- Foco em: ordem de Tab, Escape fecha overlay, Enter/Space ativa, ARIA states (`aria-expanded`, `aria-selected`), foco trap em modais, scroll lock
- Stories com `play()` que já existem: `ScrollArea.stories.js`, `NavigationMenu.stories.js` — viram os primeiros casos de Camada 2

### Camada 3 — Visual regression (Chromatic, já instalado)

**Stack:** `@chromatic-com/storybook` 5.0.1 (já em `package.json` raiz)

**Convenção:**

- Wirar Chromatic em um workflow GitHub Actions separado (`.github/workflows/chromatic.yml`), disparado em PR e push para `dev`
- Sem snapshot local — Chromatic detecta diff visual contra a baseline da `dev`
- Aprovação visual = parte do code review (Chromatic comenta no PR)
- Cobertura natural: as 77 stories existentes viram baseline na primeira run. Componentes novos entram na baseline assim que a story é criada (já requerido pelo [`component-scaffold`](../skills/component-scaffold/SKILL.md))

### Camada 4 — Acessibilidade (axe-core via Vitest browser)

**Stack:**

- `@storybook/addon-a11y` (já instalado) — feedback visual no painel para o autor
- `axe-core` + `@axe-core/playwright` no Vitest browser — runtime obrigatório
- Recomendado: integrar dentro da Camada 1 com `expect.toHaveNoViolations()` por story (alternativa: `@storybook/test-runner` dedicado, mais lento)

**Convenção:**

- Cada `composeStories` rodada na Camada 1 também roda `axe` na árvore renderizada
- Regras desabilitadas precisam de **justificativa explícita** na story (`parameters.a11y.config.rules`) — alinha com o padrão já visto em `Button.stories.js`

## 4. Onde a estratégia toca o repo

Edits previstos (alto nível, **não** parte deste PR — entram na PR da Fase 0):

| Caminho | Mudança |
|---|---|
| `packages/webkit/package.json` | Adicionar `vitest`, `@vitest/browser`, `@vue/test-utils`, `@testing-library/vue`, `@axe-core/playwright`, `playwright` em `devDependencies`; scripts `test`, `test:watch`, `test:a11y` |
| `packages/webkit/vitest.config.ts` *(novo)* | Config Vitest com browser provider Playwright; alias `@aziontech/webkit/*` apontando para `src/`; setup file |
| `packages/webkit/src/test/setup.ts` *(novo)* | Matchers globais (`toHaveNoViolations`), registro de componentes raiz, eventuais polyfills |
| `packages/webkit/src/components/**/<name>.test.ts` *(novos, incrementais)* | Um por componente — não 157 de uma vez, ver Rollout |
| `apps/storybook/.storybook/preview.js` | `parameters.a11y` default sem desabilitar regras; habilitar addon globalmente |
| `.github/workflows/test.yml` *(novo)* | Job paralelo ao `governance.yml`; roda `pnpm webkit:test` em PRs |
| `.github/workflows/chromatic.yml` *(novo)* | Job dedicado para visual regression |
| `.claude/skills/validate-component/SKILL.md` | Adicionar `pnpm webkit:test --filter <name>` no `/component-verify` |
| `.claude/skills/component-scaffold/SKILL.md` | Gerar `<name>.test.ts` mínimo (smoke + `composeStories(Default)`) junto com `.vue` + story |
| `.claude/rules/testing.md` *(novo)* | "toda story interativa tem `play()`; todo componente novo tem `<name>.test.ts` com pelo menos smoke + a11y" |
| `CONTRIBUTING.md` | Seção curta apontando para `testing.md` |

Arquivos de **referência** (consulta apenas):

- [`apps/icons-gallery/tests/unit/iconDownload.spec.js`](../../apps/icons-gallery/tests/unit/iconDownload.spec.js) — único exemplo de Vitest no monorepo hoje; serve de inspiração mas é jsdom puro (não suficiente para webkit)

## 5. Rollout (não fazer tudo de uma vez)

| Fase | Escopo | Critério de saída |
|---|---|---|
| **0 — Infra** | Vitest + browser mode + setup + 1 componente piloto (Button — já tem `parameters.a11y` declarado) | `pnpm webkit:test` verde local + CI; doc em `testing.md` |
| **1 — Componentes novos** | Toda spec nova entra com `<name>.test.ts` (smoke + a11y). Novo hook irmão de `enforce-spec-exists.mjs` | 100 % dos componentes criados pós-merge têm teste |
| **2 — Backfill prioritário** | Top 20 componentes mais usados (Button, Input, Modal, Table, Dropdown — calibrar com uso real) | Cobertura mínima desses 20 + Chromatic wired |
| **3 — Backfill restante** | Os outros 137 componentes, em PRs de ~5 | Eventual 100 % de smoke + Chromatic |
| **4 — A11y bar** | Habilitar `expect.toHaveNoViolations()` como **erro** (não warning) | CI quebra em violação axe |

Cada fase é **mergível e revertível**. Fase 0 é a única que precisa de aprovação cuidadosa — fixa as escolhas de stack.

## 6. Decisões pendentes (antes da Fase 0)

1. **Vitest browser mode (Playwright provider) vs jsdom puro.** Recomendação: **browser mode**. Sem ele, componentes com `getBoundingClientRect`, foco, CSS anchor positioning e `<Teleport>` precisam de mocks frágeis. Custo: ~30 s a mais por job CI e dependência do Playwright instalado.
2. **Test ao lado do `.vue` vs `__tests__/`.** Recomendação: **ao lado**. Segue o padrão de specs (um por componente) e facilita o `component-scaffold` emitir tudo junto.
3. **Chromatic em workflow próprio vs dentro do `governance.yml`.** Recomendação: **workflow próprio**. Chromatic tem cota mensal e budget de tempo independente; manter isolado evita travar PRs urgentes se a cota estourar.
4. **a11y bloqueante desde Fase 0 ou só na Fase 4.** Recomendação: **warning até Fase 3, falha bloqueante na Fase 4**. Evita travar o backfill em violações pré-existentes.

## 7. Verificação da Fase 0 (quando for executada)

```bash
# instalação
pnpm install

# rodar testes locais
pnpm webkit:test          # roda Vitest no piloto (Button)
pnpm webkit:test:a11y     # roda axe via Playwright nas stories do piloto

# storybook + chromatic
pnpm storybook:dev        # confirma que addon-a11y mostra resultados no painel
pnpm chromatic --project-token=... --only-changed   # confirma snapshot da baseline

# CI
# - push para a branch de Fase 0 dispara test.yml + chromatic.yml
# - governance.yml continua passando (nada removido)
```

**Critério de sucesso da Fase 0:** Button (piloto) tem `*.test.ts` cobrindo Default, Disabled e variantes de `kind`; `play()` cobrindo focus/click; Chromatic com baseline; CI verde em ~+1 min sobre o tempo atual.

## 8. Próximo passo

Se a proposta for aprovada como está: abrir uma branch `feat/<issue>-testing-strategy-phase-0` com **apenas a Fase 0** (infra + piloto Button + `testing.md` + dois workflows novos). Sem tocar nos outros 156 componentes. PR pequeno, mergível, reversível — e a partir dele a Fase 1 (gate em componentes novos) entra como hook na PR seguinte.
