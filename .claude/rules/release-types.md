# Rule: release types — um único conjunto de tipos em commitlint, `.releaserc`, CONTRIBUTING e commands

O conjunto de `type`s de Conventional Commit e o **bump de versão** de cada um são versionados em quatro lugares. Eles **têm que ser idênticos**. Quando divergem, o commitlint aceita um commit que o `semantic-release` silenciosamente ignora (ou vice-versa), e os fluxos `/open-pr` / `/create-branch` passam a oferecer um type que não gera o release esperado. Esta regra é o que o reviewer cobra em PR: _"should match release and commit lint"_.

## A regra (invariante)

A lista de types aceitos e o type→bump devem ser **iguais** nestes quatro pontos:

| Arquivo | O que define |
|---|---|
| [`commitlint.config.js`](../../commitlint.config.js) (`type-enum`) | quais types passam no `commit-msg` |
| `packages/*/.releaserc` (`releaseRules`) | o bump de cada type — em **todos** os pacotes: [`webkit`](../../packages/webkit/.releaserc), [`theme`](../../packages/theme/.releaserc), [`icons`](../../packages/icons/.releaserc) |
| [`CONTRIBUTING.md`](../../CONTRIBUTING.md) § Commit convention | a tabela type → bump, documentada para humanos |
| [`open-pr.md`](../commands/open-pr.md) + [`create-branch.md`](../commands/create-branch.md) | a lista de types que os fluxos inferem/oferecem |

## Conjunto canônico (hoje)

- `feat` → **minor**
- `fix` / `hotfix` / `chore` / `docs` / `style` / `refactor` / `perf` → **patch**
- `test` / `ci` / `revert` → `release: false` (sem bump; permitidos para higiene)
- `!` após o type ou rodapé `BREAKING CHANGE:` → **major**

Cada type é listado **explicitamente** no `releaseRules` de cada `.releaserc` — não dependa do default implícito do preset `conventionalcommits`. Um type sem regra explícita é uma divergência esperando para acontecer.

## Ao adicionar, remover ou re-mapear um type

Faça as quatro edições **no mesmo PR**:

1. `commitlint.config.js` → `type-enum`.
2. **Todos** os `packages/*/.releaserc` → `releaseRules` (webkit, theme, icons). Não esqueça nenhum pacote.
3. `CONTRIBUTING.md` → a tabela type → bump e a nota de enforcement.
4. `open-pr.md` + `create-branch.md` → a lista de types e o mapeamento de bump.

Sem release? Use `{ "type": "<x>", "release": false }` no `releaseRules` (não omita o type).

## Detalhes do `@semantic-release/commit-analyzer` que importam

- O `releaseRules` custom é avaliado **antes** do `DEFAULT_RELEASE_RULES`; o default só entra quando **nenhuma** regra custom casa (`isUndefined`).
- Uma regra custom com `release: false` retorna `false` (não `undefined`), então **suprime** o default. É assim que `revert` fica sem release, em vez de cair no default `{ revert: true } → patch`.
- A regra `{ "breaking": true, "release": "major" }` fica **sempre por último** no array. Por causa do `compareReleaseTypes`, uma regra `release: false` anterior não rebaixa um commit breaking — `major` ainda vence.
- O analyzer também filtra por path: um commit só conta para o release de um pacote se tocar arquivos sob `packages/<scope>/`.

## O que não fazer

- Não adicionar um type ao comando ou ao commitlint sem adicioná-lo aos três `.releaserc`.
- Não mexer só no `.releaserc` do `webkit` e esquecer `theme` / `icons`.
- Não confiar no default do preset para um type — liste-o explicitamente.
- Não deixar `CONTRIBUTING.md` descrevendo um bump diferente do que o `releaseRules` produz.

## Por que essa regra existe

O `/open-pr` e o `/create-branch` listavam `perf` / `test` / `ci` / `revert`, e o `commitlint` os aceitava, mas os `.releaserc` só enumeravam sete types + breaking. `perf` só dava patch pelo default do preset e `test`/`ci`/`revert` não apareciam — uma divergência que rendeu `CHANGES_REQUESTED`. Tornar os quatro pontos idênticos e explícitos elimina a classe inteira de bug.
