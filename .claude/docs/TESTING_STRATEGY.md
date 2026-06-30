# Estratégia de testes para `packages/webkit`

> **Status:** em execução — Fase 0 sendo entregue em waves na PR [#703](https://github.com/aziontech/webkit/pull/703) (branch `docs/testing-strategy-proposal`).
> **Escopo:** apenas `packages/webkit`. `packages/theme` e `packages/icons` ficam de fora.
> **Histórico:** começou como proposta (draft) → aprovada → execução em waves. As decisões da seção 6 estão fixadas; as seções 9 (progresso) e 10 (benefícios por ferramenta) refletem o estado atual.

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

## 6. Decisões fixadas

1. **Vitest browser mode (Playwright provider) — fixada.** Sem ele, componentes com `getBoundingClientRect`, foco, CSS anchor positioning e `<Teleport>` precisam de mocks frágeis. Custo aceito: ~30 s a mais por job CI e dependência do Playwright instalado.
2. **Test ao lado do `.vue` — fixada.** Segue o padrão de specs (um por componente) e facilita o `component-scaffold` emitir tudo junto.
3. **Chromatic em workflow próprio — fixada.** Chromatic tem cota mensal e budget de tempo independente; manter isolado evita travar PRs urgentes se a cota estourar.
4. **a11y bloqueante só na Fase 4 — fixada.** Warning até a Fase 3, falha bloqueante na Fase 4. Evita travar o backfill em violações pré-existentes.

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

A Fase 0 está sendo entregue na PR [#703](https://github.com/aziontech/webkit/pull/703), em waves pequenas e mergíveis (ver seção 9). Após o merge, a Fase 1 (gate em componentes novos via `enforce-test-exists.mjs`) já estará ativa — Fase 2 (backfill prioritário) abre como branch nova.

## 9. Progresso (Fases 0 + 1, execução em waves)

A entrega vem em **7 waves** sequenciais na PR #703. Cada wave é um commit isolado, mergível em teoria, com verificação verde local antes de prosseguir.

| Wave | Escopo | Status | Commit | Tipo |
|------|--------|--------|--------|------|
| 1 | Infra Vitest — `vitest`/`@vitest/browser`/`playwright`/`@testing-library/vue`/`@vue/test-utils` em devDeps; `vitest.config.ts` com browser mode (Chromium headless) + alias `@aziontech/webkit` → `@aziontech/webkit.dev`; `src/test/setup.ts`; scripts `test`/`test:watch` em webkit; aliases no root. | ✅ mergeada | `130ebf36` | `chore` |
| 2 | Button pilot — `button.test.ts` com 19 testes: render (button/anchor/data-testid/5 kinds/3 sizes), disabled (atributo nativo + `aria-disabled` + `data-disabled` + click suprimido), loading (`aria-busy` + spinner testid + click suprimido), click handler (`MouseEvent`), e a11y via `axe-core` direto em Default/Disabled/Anchor. | ✅ mergeada | `ebea0c25` | `test` |
| 3 | Button pilot — `play()` em Default (click + Tab + Enter/Space, asserting `onClick` chamado 3x) e Disabled (click suprimido + `aria-disabled`); teste roda essas stories via `composeStories(...).run()`. Deps `@storybook/test` + `@storybook/vue3` em webkit. | ✅ mergeada | `811c424a` | `test` |
| 3.5 | Fix fora do plano original — `@storybook/addon-interactions` instalado em `apps/storybook` e registrado em `.storybook/main.js` (em SB 8 não vem mais embutido no `addon-essentials`). Painel **Interactions** passa a aparecer no canvas. | ✅ mergeada | `8804806a` | `chore` |
| 4 | CI workflow `test.yml` — roda `pnpm webkit:test` em PRs/push para `dev`/`main`, com setup pnpm + Node + `npx playwright install --with-deps chromium`. Paralelo ao `governance.yml`. | ⏸️ próxima | — | `ci` |
| 5 | CI workflow `chromatic.yml` — visual regression em workflow próprio. Pré-requisito: secret `CHROMATIC_PROJECT_TOKEN` no repo (ação humana). | ⏸️ a fazer | — | `ci` |
| 6 | Regra `.claude/rules/testing.md` + atualização das skills `validate-component` (passa a rodar `pnpm webkit:test --filter <name>` no `/component-verify`) e `component-scaffold` (gera `<name>.test.ts` mínimo) + nota em `CONTRIBUTING.md`. | ⏸️ a fazer | — | `docs` |
| 7 | Hook `enforce-test-exists.mjs` — gate PreToolUse bloqueando `.vue` novo sem `<name>.test.ts` ao lado; modelado em `enforce-spec-exists.mjs`; whitelist `legacy-components.json`; registro em `.claude/settings.json`. | ⏸️ a fazer | — | `chore` |

**Verificação local atual:** `cd packages/webkit && ./node_modules/.bin/vitest run` → `21 passed (21)` em ~1.5–3 s.

### Ajustes que apareceram durante a execução (não estavam no plano original)

| Ajuste | Por quê |
|---|---|
| `vitest-axe` removido, substituído por `axe-core` direto + helper local `expectNoA11yViolations` | `vitest-axe@0.1.0` usa `createRequire` do `node:module`, que não existe no browser env do Vitest |
| `define: { 'process.env.NODE_ENV': "'test'" }` em `vitest.config.ts` | `@testing-library/vue` lê `process.env.NODE_ENV` e quebra no browser sem polyfill |
| `afterEach(cleanup)` registrado em `src/test/setup.ts` | Em browser mode o cleanup automático do testing-library não dispara; sem isso, DOM acumula entre testes |
| Alias `@aziontech/webkit` → `@aziontech/webkit.dev` (não para `./src`) | Mantém a mesma resolução do Storybook, permitindo que `composeStories` resolva o subpath `@aziontech/webkit/button` consistentemente |
| Globals do ESLint estendidos no root (`Element`, `HTMLButtonElement`, `KeyboardEvent`, etc.) | Flat config não aceita `/* eslint-env browser */`; sem isso o `lint-staged` quebra no commit |
| `**/__screenshots__/` no `.gitignore` | Vitest browser mode escreve screenshots em failures; regeneráveis, não devem ser commitadas |
| `@storybook/addon-interactions` adicionado explicitamente | `addon-essentials@8.6.x` não inclui mais o `addon-interactions` (separado no SB 8) — painel Interactions não aparecia |

## 10. Benefícios por ferramenta

Cada peça do stack ganhou lugar pela **razão específica** abaixo — não por hype, e nem por familiaridade.

### Runner — `vitest@^2.1.9`

- **Vite-nativo:** mesma resolução, alias e plugins do Storybook (que também é vite). Zero divergência de build entre "como vejo no navegador" e "como o teste vê".
- **API estável (Vitest 2.x):** browser mode estável, compatível com `@vitest/browser` e o ecossistema `@vue/test-utils` 2.4.
- **Watch mode rápido:** rebuild incremental via HMR do Vite — typing-cycle de teste fica abaixo de 1 s.
- **`it.each` + `describe` aninhados:** matriz de variantes (`kind` × `size`) cabe em poucas linhas — ver seção `rendering` do `button.test.ts`.

### Ambiente — `@vitest/browser` + `playwright` (Chromium headless)

- **Render real:** CSS de verdade, layout real, `getBoundingClientRect` honesto, focus nativo. Indispensável para componentes que dependem de CSS anchor positioning, `<Teleport>`, foco visível e medidas computadas — coisas que jsdom mente sobre.
- **Coerente com a regra de dependências:** a [`dependencies.md`](../rules/dependencies.md) proíbe `floating-ui`/`popper`; o que mantém a integridade dessa proibição é **testar no DOM real**. Mocks para `getBoundingClientRect` em jsdom escondem o problema.
- **Mesma plataforma da Camada 3 (Chromatic):** baseline visual e teste comportamental rodam no mesmo motor — divergência improvável.
- **Custo bem definido:** ~30 s extra por job CI + um download Chromium de ~150 MB cacheado pelo runner.

### Mount — `@testing-library/vue` + `@vue/test-utils`

- **Queries por papel (`getByRole`, `getByLabelText`):** força o teste a olhar para a árvore acessível, não para classes/internals. Se o teste passa, screen reader também vê.
- **`emitted()`:** asserções de evento Vue idiomáticas, sem mock de função no callsite.
- **`@vue/test-utils` quando preciso:** acesso ao vm/`.props()` quando uma asserção comportamental simplesmente não cabe (raro, mas existe).

### Stories como fixture — `@storybook/vue3` + `@storybook/test` + `composeStories`

- **Uma única fonte de verdade:** props/args/render moram em `*.stories.js` e são consumidos por docs, Chromatic, painel Interactions **e** unit test. Sem duplicação.
- **`play()` documenta e testa ao mesmo tempo:** o fluxo de uso aparece no painel Interactions (revisor visualiza) e roda em vitest via `Story.run()` (CI valida). Mesmo `expect`, mesmo `userEvent`, mesma asserção.
- **`fn()` (mock instrumentado do `@storybook/test`):** captura chamadas e aparece no painel Actions/Interactions — sem reinventar spies.
- **Migração barata:** stories que já existem só ganham um `play()` quando o fluxo justificar.

### A11y — `axe-core` direto (com `@storybook/addon-a11y` no Storybook)

- **`axe-core` standalone funciona no browser e no jsdom:** roda dentro da suite Vitest sem wrapper de Node. Custo zero de setup.
- **`@storybook/addon-a11y` (já instalado) entrega painel visual no Storybook:** autor de componente vê violações em tempo real enquanto desenvolve, antes mesmo de escrever o teste.
- **Regras desabilitadas precisam de comentário na story:** mesmo padrão que `Button.stories.js` já segue (`parameters.a11y.config.rules` enumera regras com flag explícita). Auditável.
- **Por que **não** `vitest-axe`:** quebra em browser mode (`createRequire` é Node-only). Helper local de 4 linhas resolve sem dependência transitiva frágil.

### Visual regression — `@chromatic-com/storybook` (em workflow próprio)

- **Sem snapshot local:** baseline mora no serviço, não no repo. Sem PRs gigantes para revisar diff de pixel.
- **Stories são a unidade de baseline:** cada story vira um snapshot — `Default`, `Types`, `Sizes`, `Loading`, `Icon`, `Disabled` no Button são 6 baselines sem esforço extra.
- **TurboSnap (`--only-changed`):** só renderiza stories afetadas pelo diff — corta ~80 % do custo na maior parte das PRs.
- **Worflow isolado:** se a cota mensal estoura, PRs urgentes (lint/types) continuam mergeando — só Chromatic falha.

### Painel Interactions — `@storybook/addon-interactions`

- **Replay step-by-step do `play()`:** revisor pode "rebobinar" até qualquer step, vendo o canvas no estado intermediário. Bug em `Tab → Enter` fica visível.
- **Mesmas asserções da CI:** o `expect(args.onClick).toHaveBeenCalledTimes(3)` que falha no painel também falha no vitest. Sem dois mundos.

### Hooks de governance — `enforce-spec-exists.mjs` (modelo) → `enforce-test-exists.mjs` (Wave 7)

- **Gate no PreToolUse:** uma vez ativo, `Write` de `.vue` novo sem `.test.ts` ao lado é bloqueado antes de o arquivo ser criado. Não precisa esperar CI.
- **Whitelist em `_lib/legacy-components.json`:** componentes legados ficam isentos até serem migrados — sem big-bang.
- **Determinístico e local:** mesma lógica que já garante spec-compliance. Sem novo runtime, sem novo serviço.
