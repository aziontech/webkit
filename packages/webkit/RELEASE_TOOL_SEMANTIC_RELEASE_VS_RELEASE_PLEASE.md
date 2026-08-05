# Ferramenta de Release na Azion — Semantic Release vs. Release Please

|                        |                                                                                                           |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| **Tipo**               | Documento executivo de decisão técnica                                                                    |
| **Público**            | CTO · Diretoria de Arquitetura · Time de Delivery                                                         |
| **Autor**              | Robson Júnior — Front-end / Design System (Webkit)                                                        |
| **Data**               | 2026-07-28                                                                                                |
| **Status**             | Para apreciação e decisão                                                                                 |
| **Piloto em produção** | Repositório `webkit` (Design System) — migrado no PR [#798](https://github.com/aziontech/webkit/pull/798) |

---

## 1. Sumário executivo

Avaliamos as duas ferramentas de automação de release baseadas em Conventional Commits — **Semantic Release** (comunidade) e **Release Please** (Google) — sob as regras de governança vigentes na Azion: **2 aprovações obrigatórias na `main` e proibição de bypass por bots**.

Onde os fluxos das duas ferramentas se equivalem em aprovações, o critério de decisão passa a ser outro: **quem gere o ciclo de release — uma pessoa ou a ferramenta**.

**Recomendação: adotar o Release Please como ferramenta padrão de release.**

Os motivos, em uma linha cada:

1. **Compliance por construção.** O Release Please devolve versão e changelog ao repositório **através de um Pull Request comum**, que passa pelas mesmas 2 aprovações e checks de qualquer PR. O Semantic Release, no seu desenho clássico, exige que um bot faça push direto na `main` — exatamente o bypass que nossa policy proíbe.
2. **Ordem correta das operações.** No Release Please, o repositório é atualizado **antes** da publicação (o merge do Release PR é o gatilho). No Semantic Release sem bypass, a publicação no registry acontece **antes** do sync do repositório — uma janela em que o `package.json` da `main` mente sobre a versão publicada.
3. **A ferramenta opera o ciclo — não uma pessoa.** O Release PR é, na prática, um branch de integração automatizado: criado, acumulado (versão, changelog, SemVer mais forte do lote) e encerrado pela própria automação a cada corte, entregando `1 × N` sem operação manual. Alcançar o mesmo com Semantic Release exige um branch de integração **gerido à mão** (Flow 02) — criação, corte e reciclagem viram tarefa recorrente de um humano.
4. **Menos peças móveis.** Um arquivo de manifesto substitui a cadeia de plugins (`@semantic-release/git`, `/changelog`, `/npm`, `/github`, …). Suporte nativo a monorepo — já operando com 3 pacotes no piloto.

O custo da troca é conhecido e mitigado: o parser do Release Please é estrito (não aceita `headerPattern` custom via regex). Encontramos esse limite em produção — um PR com título prefixado `[NO-ISSUE] fix: …` não gerou release — e o resolvemos na origem com um guard de commitlint, sem tocar na ferramenta (seção 7).

---

## 2. O que compõe um release

Release **não é apenas publicar um pacote em um registry**. O ciclo completo que qualquer ferramenta precisa cobrir:

1. **Cálculo da versão** (SemVer) a partir dos commits desde o último release (Conventional Commits: `fix` → patch, `feat` → minor, breaking → major);
2. **Devolução da versão ao projeto** — atualização de `package.json#version` e `CHANGELOG.md` na `main`. **Este passo é inegociável**: sem ele, o repositório e o registry divergem, e a `main` deixa de ser a fonte da verdade sobre o que está em produção;
3. **Tag git + GitHub Release** — o registro imutável do ponto de corte;
4. **Publicação / distribuição** (npm, CDN, etc.).

**O gatilho do processo:** merge de PRs na branch `main`, após os checks de validação obrigatórios.

É no **passo 2** que as duas ferramentas divergem estruturalmente — e é ele que colide com nossa governança.

---

## 3. Restrições de governança (o problema a resolver)

As branch protection rules da `main`:

| Policy                        | Efeito sobre a automação de release                                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **2 aprovações obrigatórias** | Todo PR — inclusive de bots — precisa de 2 aprovações humanas para mergear.                                                                                        |
| **Bypass proibido**           | Nenhum bot pode commitar/pushar diretamente na `main`. O bot do Semantic Release **não pode** fazer o commit que atualiza `package.json#version` e `CHANGELOG.md`. |

Essas duas regras não são negociáveis — são requisito de compliance. A pergunta correta não é "qual ferramenta é melhor no geral", e sim **"qual ferramenta entrega o ciclo completo de release dentro dessas regras, com o menor atrito"**.

---

## 4. Modelos de operação

### Semantic Release — release por merge (`1 × 1`)

Ferramenta da comunidade open source (org `semantic-release`), arquitetura de plugins. Roda no CI a cada push na branch observada: analisa os commits, calcula a versão, publica no registry e — **via plugin `@semantic-release/git`** — commita a versão e o changelog de volta na branch. Cada merge produz um release: `1 × 1`, sempre — agrupar (`1 × N`) exige interpor um branch de integração **gerido manualmente** (Flow 02) ou scripts sob medida.

### Release Please — Release PR acumulativo (`1 × 1` e `1 × N`)

Ferramenta mantida pelo Google (org `googleapis`) — é a mesma que versiona e publica as client libraries oficiais do Google. Opera com um **Release PR permanente**: a cada merge na `main`, a action atualiza esse PR com o bump de versão calculado e o changelog acumulado, sempre respeitando o SemVer mais forte do lote. **O merge do Release PR é o release**: gera tag, GitHub Release e dispara a publicação.

- Mergeou o Release PR a cada feature → comportamento `1 × 1`;
- Deixou acumular e mergeou quando quiser cortar → `1 × N`.

O time ganha controle de cadência sem perder automação.

---

## 5. Cenários testados

### 5.1 — Semantic Release, Flow 01 (auto-commit do bot) — ❌ Reprovado

1. Commit `feat`/`fix` → 2 aprovações → merge na `main`
2. Release (publicação no registry)
3. Bot pusha commit na `main` atualizando `package.json#version` e `CHANGELOG.md`

> **Veredito: inviável.** O passo 3 exige **bypass permanente** das branch protection rules para o `bot-semantic-release` — violação direta da policy. Não há configuração que contorne isso: é o desenho da ferramenta.

### 5.2 — Semantic Release, Flow 02 (branch de integração manual) — ⚠️ Alcança `1 × N`, ao custo de gestão humana

1. **Criação manual de um branch de integração** — as features passam a mergear nele, não na `main`
2. Commits `feat`/`fix` → aprovações → merges no branch de integração
3. **Abertura manual do PR de release** (integração → `main`) → aprovações → merge
4. Release (publicação no registry)
5. Semantic Release ainda abre o **PR de sync** de `package.json#version` / `CHANGELOG.md` → aprovações → merge com "skip release"

> **Veredito: funciona — com um operador humano no meio.** Este fluxo entrega `1 × N` e **empata com o Release Please em aprovações** — a diferença não está aí. Está em **quem gere o ciclo**: criar o branch a cada ciclo, acompanhar o acúmulo, decidir e montar o corte, encerrar/reciclar o branch depois — tudo vira tarefa recorrente de uma pessoa (ou de scripts sob medida, que também precisam de dono). Automatizar esse branch fixo com o próprio Semantic Release apenas reintroduz o auto-commit/bypass reprovado no Flow 01. E o sync pós-release (passo 5) continua existindo, com sua lógica de "skip release".

### 5.3 — Semantic Release, Flow 03 (direto na `main` + PR de sincronização) — ⚠️ Funciona, mas improdutivo

1. Commit `feat`/`fix` **direto para a `main`** → 2 aprovações → merge
2. Release (publicação no registry)
3. Semantic Release abre um **segundo PR** com `package.json#version` e `CHANGELOG.md`
4. Mais 2 aprovações para aceitar o sync
5. Merge do sync configurado para **pular o release** (senão dispara novo ciclo)

> **Veredito: compliance atendido, gestão pós-fato.** Todo release arrasta um segundo PR de sincronização — burocracia que não protege nada, só corrige o repositório **depois** que o release já saiu. Entre a publicação (passo 2) e o sync (passos 3–5), o registry diz `4.1.0` e a `main` diz `4.0.3`. O "skip release" adiciona lógica frágil ao pipeline — e o modelo segue `1 × 1`: cada merge força um ciclo completo desses.

### 5.4 — Release Please, Flow 01 — ✅ Aprovado

1. Commit `feat`/`fix` → 2 aprovações → merge na `main`
2. Release Please **atualiza o Release PR** (versão + changelog), acumulando os merges e respeitando o SemVer mais forte
3. 2 aprovações no Release PR → merge
4. Release: tag + GitHub Release + publicação/distribuição

> **Veredito: aprovado.** É o Flow 02 do Semantic Release — **com a ferramenta no lugar do operador**. O Release PR é um branch de integração automatizado: criado, atualizado a cada merge e encerrado no corte pela própria automação, já carregando versão e changelog (nenhum sync pós-release). Nenhum bypass; é um PR comum, auditável, que roda todos os required checks — o **gate antes** da publicação. O papel humano fica restrito ao que deve ser: revisar e decidir o momento do corte.

---

## 6. Comparativo consolidado

| Critério                                            | Semantic Release                                                                                      | Release Please                                                                                                 |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Modelo de release**                               | `1 × 1` nativo; `1 × N` só via branch de integração manual (Flow 02)                                  | `1 × 1` **e** `1 × N` nativos (Release PR acumulativo)                                                         |
| **Gestão do ciclo de release**                      | **Humana** — criar, acompanhar, cortar e reciclar o branch de integração; absorver o sync pós-release | **Da ferramenta** — Release PR criado, atualizado e encerrado pela automação; o humano revisa e decide o corte |
| **Devolução de versão ao repo**                     | Auto-commit do bot (exige bypass) **ou** PR de sync pós-release                                       | Nativa — embutida no próprio Release PR                                                                        |
| **Ordem das operações**                             | Publica no registry **antes**, sincroniza o repo **depois**                                           | Sincroniza o repo **antes** (merge do Release PR), publica **depois**                                          |
| **Compatível com "2 approves + sem bypass"**        | ❌ Flow 01 / ⚠️ Flows 02–03, com gestão manual e sync pós-fato                                        | ✅ Por construção                                                                                              |
| **Aprovações por corte**                            | Equivalentes no melhor fluxo de cada uma (Flow 02)                                                    | Equivalentes — o diferencial é a operação do ciclo, não a contagem                                             |
| **Controle de cadência de release**                 | Só via branch de integração manual                                                                    | Nativo — o merge do Release PR é a decisão                                                                     |
| **Configuração**                                    | Um plugin por preocupação (`git`, `changelog`, `npm`, `github`, …)                                    | Um JSON de manifesto                                                                                           |
| **Monorepo**                                        | Plugins de comunidade (`multi-semantic-release`)                                                      | Nativo — paths e componentes por pacote                                                                        |
| **Versão em arquivos extras** (ex.: `catalog.json`) | Plugin/script custom                                                                                  | Declarativo (`extra-files` no manifesto)                                                                       |
| **Parser de commits**                               | Flexível — `headerPattern` via regex                                                                  | Estrito — espec Conventional Commits pura                                                                      |
| **Bump customizado por tipo** (`chore` → patch)     | Sim (`releaseRules`)                                                                                  | Não — fixo: `feat` → minor, `fix` → patch, breaking → major                                                    |
| **Escape hatch de versão explícita**                | Config/CLI                                                                                            | Footer `Release-As: x.y.z` no commit                                                                           |
| **Mantenedor**                                      | Comunidade (org `semantic-release`)                                                                   | Google (org `googleapis`)                                                                                      |

Sobre a linha "parser": a flexibilidade do Semantic Release tem um custo escondido — um `headerPattern` custom **quebra a semântica pura do Conventional Commits** (`type(scope): description`) e obriga a manter o mesmo regex sincronizado em cada ferramenta da esteira (commitlint, release tool, geradores de changelog). A rigidez do Release Please força um único padrão de ponta a ponta — e o desvio que tínhamos (prefixo `[ISSUE-XXXX|NO-ISSUE]` no título) foi mais barato de corrigir na convenção do que de sustentar no parser (seção 7).

---

## 7. Riscos conhecidos do Release Please — e mitigações comprovadas em produção

### 7.1 — Títulos fora do padrão são ignorados **em silêncio**

**O risco.** O parser do Release Please não é configurável. Um commit cujo header não comece com o type (`fix:`, `feat(escopo):`) é invisível para a ferramenta — não gera erro, **simplesmente não gera release**. Alguns times da Azion usam o padrão `[ISSUE-XXXX|NO-ISSUE] type(scope): description`, que cai exatamente nesse caso.

**Aconteceu no piloto.** Como os merges na `main` são squash (PR [#795](https://github.com/aziontech/webkit/pull/795)), o título do PR vira o header do commit. O PR [#804](https://github.com/aziontech/webkit/pull/804) entrou como `[NO-ISSUE] fix: use @aziontech/theme/animations imports…` — um `fix` legítimo que **não produziu release nenhum**, sem qualquer aviso.

**A mitigação (já mergeada, PR [#809](https://github.com/aziontech/webkit/pull/809)).** Corrigimos na origem, via commitlint — o mesmo gate que já valida todo commit/PR:

- Header com tag de ticket à esquerda (`[QUALQUER-COISA] type: …`) é **rejeitado** com mensagem explicando o motivo;
- A tag de ticket **migrou para o subject**: `fix(webkit): [ENG-1234] descrição` — rastreabilidade preservada, parser satisfeito;
- Sem ticket → sem tag (`[NO-ISSUE]` deixou de existir: eram caracteres mortos).

Resultado: o risco é estrutural, mas a mitigação custa um arquivo de configuração que já possuímos em todos os repos — e passa a valer para qualquer time que adote o padrão.

### 7.2 — Nem todo type gera release

No Release Please, apenas `feat`, `fix` e breaking changes (`!` ou `BREAKING CHANGE:`) produzem release. `chore`, `docs`, `refactor`, `ci`, etc. são aceitos, entram no próximo corte, mas **não bumpam versão sozinhos** — e isso não é configurável (diferente do `releaseRules` do Semantic Release).

**Mitigação:** convenção documentada — _"se precisa chegar em produção, o commit é `fix` ou `feat`"_; para versão explícita, o footer `Release-As: x.y.z`. No piloto isso está formalizado como regra interna (`release-types.md`), com o mapeamento type → release idêntico em commitlint, config, documentação de contribuição e tooling.

### 7.3 — O Release PR precisa de manutenção de permissões

O Release PR é um PR de bot: para rodar os required checks e para que o merge dispare os workflows de publicação, a action usa um token (PAT) dedicado. É um secret a gerir por repositório — custo pequeno e único, já resolvido no piloto.

---

## 8. Recomendação e próximos passos

**Adotar o Release Please como ferramenta padrão de release** para repositórios sob branch protection com "2 aprovações + sem bypass" — na prática, todos os repositórios de produto.

| Decisão proposta    | Detalhe                                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------------------- |
| Ferramenta          | `googleapis/release-please-action` (Release PR model)                                                     |
| Convenção de commit | Conventional Commits estrito; ticket no subject (`type(scope): [ABC-123] descrição`); guard no commitlint |
| Merge strategy      | Squash merge (título do PR = commit; título commitlint-válido obrigatório)                                |
| Cadência            | A critério de cada time — o merge do Release PR é a decisão de corte (`1 × 1` ou `1 × N`)                 |

**Próximos passos sugeridos:**

1. Validação desta proposta por CTO / Arquitetura / Delivery;
2. Formalizar o padrão de commit corporativo (com a posição da tag de ticket) junto aos times que hoje usam prefixo à esquerda;
3. Empacotar a configuração do piloto (workflow + manifesto + commitlint) como template interno de adoção;
4. Rollout gradual por repositório, começando pelos que hoje dependem de bypass de bot.

---

## Apêndice A — Evidências do piloto (repositório `webkit`)

O `webkit` (monorepo do Design System: `@aziontech/webkit`, `@aziontech/theme`, `@aziontech/icons`) opera com Release Please em produção desde o PR #798.

| Evidência                                          | Referência                                                                                                                                 |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Migração semantic-release → release-please         | PR [#798](https://github.com/aziontech/webkit/pull/798) — `ci: replace semantic-release with release-please (Release PR model)`            |
| Adoção de squash merge (título do PR = commit)     | PR [#795](https://github.com/aziontech/webkit/pull/795)                                                                                    |
| Incidente do prefixo (fix sem release, silencioso) | PR [#804](https://github.com/aziontech/webkit/pull/804) — commit `b3795d2f` na `main`: `[NO-ISSUE] fix: …`                                 |
| Guard de parseabilidade no commitlint              | PR [#809](https://github.com/aziontech/webkit/pull/809) — `ci: reject leading ticket tags in commit headers`                               |
| Release PR acumulativo vivo, agora                 | PR [#810](https://github.com/aziontech/webkit/pull/810) — `chore: release main` (aberto, acumulando merges)                                |
| Config de monorepo (3 pacotes, 1 Release PR)       | [`release-please-config.json`](../../release-please-config.json) — `separate-pull-requests: false`, `extra-files` bumpando `catalog.json`  |
| Workflow (Release PR + tags + publish)             | [`.github/workflows/release-please.yml`](../../.github/workflows/release-please.yml) → publica via `package-*.yml` em `release: published` |
| Contrato type → release (4 superfícies alinhadas)  | [`.claude/rules/release-types.md`](../../.claude/rules/release-types.md) + [`commitlint.config.js`](../../commitlint.config.js)            |

## Apêndice B — Glossário rápido

- **`1 × 1`** — um release para cada merge na `main`.
- **`1 × N`** — um release agrupando N merges na `main`.
- **Branch de integração** — branch intermediário onde as features acumulam antes de um corte para a `main`. No Semantic Release (Flow 02) é criado, gerido e reciclado por um humano; no Release Please esse papel é do Release PR, gerido pela automação.
- **Release PR** — Pull Request permanente, mantido pela automação, contendo o bump de versão e o changelog acumulados; seu merge executa o release.
- **Bypass** — permissão para contornar branch protection rules (proibida pela nossa policy).
- **Squash merge** — os commits do PR viram um único commit na `main`, cujo header é o título do PR.
