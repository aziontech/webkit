# Estratégia de testes para `packages/webkit`

> **Status:** em execução. Fase 0 (infra + piloto Button) sendo entregue em waves na PR [#703](https://github.com/aziontech/webkit/pull/703).
> **Escopo:** apenas `packages/webkit`.

## 1. Contexto

Hoje `packages/webkit` tem **157 componentes**, **77 stories**, **76 specs** e **zero testes**. A CI só roda lint + type-check + storybook:build. Os hooks de spec-compliance garantem que o `.vue` declara o que o `.specs/<name>.md` promete — mas não garantem que **funciona**. Regressões de comportamento, foco, ARIA e visual só são pegas em revisão ou em produção.

## 2. Princípio diretor — a story é o fixture

Cada `*.stories.js` é a fonte única: a mesma story serve para documentação, visual regression, interaction test e unit test. Sem manter dois mundos.

## 3. O que cada camada testa e o valor que entrega

### Camada 1 — Unit

**O que testa.** O contrato do componente em isolamento: props, eventos emitidos, slots renderizados, atributos ARIA, comportamento quando `disabled`/`loading`.

**Ferramentas.** Vitest (browser mode) + `@vitest/browser` com provider Playwright Chromium + `@testing-library/vue` + `composeStories` do `@storybook/vue3`.

**Bug que impede.** `disabled` deixa passar o click. Evento `click` renomeado para `pressed` quebra silenciosamente todas as telas que importam o componente.

**Valor.** Refactor seguro, doc executável, MTTR menor em incidente (1 `it()` reproduzindo, fix, merge).

### Camada 2 — Integração (`play()`)

**O que testa.** Fluxos multi-passo: abrir/fechar overlay com `Escape`, navegar com `Tab`, ativar com `Enter`/`Space`, focus trap em Modal, scroll lock em Drawer.

**Ferramentas.** `play()` nas stories com `userEvent` + `expect` de `@storybook/test` + `@storybook/addon-interactions` (painel Interactions) + `composeStories(...).run()` para execução em CI via Vitest.

**Bug que impede.** Dropdown não fecha no `Escape`. `Tab` vaza do Modal. Switch reage ao clique mas não ao teclado. Tipicamente descoberto por usuários com teclado/leitor de tela, não em screenshot.

**Valor.** A11y comportamental. Story vira demo guiada do componente no painel Interactions — quando o fluxo quebra, o painel mostra vermelho. Doc é o teste.

### Camada 3 — Visual regression (Chromatic)

**O que testa.** Como o componente aparece em pixel, em cada story, em viewports e temas.

**Ferramentas.** Chromatic (build de Storybook + diff visual) acionado pelo workflow `.github/workflows/chromatic.yml` em cada PR.

**Bug que impede.** Mexer em `--shape-button` no theme e quebrar o `border-radius` de 30 componentes sem querer. Upgrade de Tailwind muda comportamento de uma utility.

**Valor.** Confiança para mexer em tokens. Code review visual incorporado ao PR (Chromatic comenta com antes/depois). 77 stories existentes viram baseline automática.

### Camada 4 — Acessibilidade (axe-core)

**O que testa.** Violações WCAG 2.1 AA estáticas no HTML renderizado: contraste, `<button>` sem nome acessível, `<img>` sem alt, `aria-*` inválido.

**Ferramentas.** `axe-core` rodando dentro do Vitest browser mode + helper local `expectNoA11yViolations` + `@storybook/addon-a11y` (mesmas regras visíveis no painel A11y do Storybook).

**Bug que impede.** IconButton sem `aria-label`. `<div>` clicável em vez de `<button>`. Link com texto "clique aqui". Problemas que bloqueariam audit em contrato enterprise/setor público.

**Valor.** Risco regulatório controlado. Engineer sem experiência em a11y consegue acertar — o teste diz o que está errado e por quê.

### Camada 5 — Governance (gate em PreToolUse)

**O que testa.** Que componente novo não nasce sem teste — `Write` de `<name>.vue` sem `<name>.test.ts` ao lado é bloqueado antes do arquivo existir.

**Ferramentas.** Hook `enforce-test-exists.mjs` (PreToolUse em `Write|Edit|MultiEdit`) + whitelist `.claude/hooks/_lib/legacy-components.json` + skill `component-scaffold` (emite `.test.ts` ao gerar `.vue`).

**Bug que impede.** Erosão da barra ao longo do tempo. "Só dessa vez sem teste" repetido 50 vezes vira cobertura de 30 %.

**Valor.** Disciplina sem policiamento humano. Whitelist `legacy-components.json` mantém os 156 componentes existentes isentos até serem migrados — sem big-bang.

### Resumo

| Tipo de regressão | Quem pega |
|---|---|
| Prop renomeada, evento removido, default mudado | Camada 1 |
| `disabled` deixa de suprimir click | Camada 1 |
| `Escape` não fecha overlay, `Tab` escapa do Modal | Camada 2 |
| `border-radius` de 30 componentes mudou sem querer | Camada 3 |
| Contraste insuficiente, `aria-*` inválido | Camada 4 |
| Componente novo entra no repo sem teste | Camada 5 |
