# Rule: git workflow — branches e PRs sempre via `/create-branch` e `/open-pr`

Quando o usuário pedir para **criar uma branch** ou **abrir/fazer um PR** — em qualquer frase, slash command ou linguagem natural ("abre um PR", "manda pro PR", "cria uma branch pra isso") — siga os fluxos canônicos. **Não improvise** os passos de git/PR.

| Intenção do usuário | Fluxo a seguir |
|---|---|
| Criar branch nova | [`/create-branch`](../commands/create-branch.md) |
| Commitar + push + abrir PR | [`/open-pr`](../commands/open-pr.md) |

Esses commands são a **fonte da verdade** do processo. Esta regra existe só para garantir que eles sejam acionados mesmo quando o usuário não digita a slash explicitamente.

## Convenções (já embutidas nos fluxos — repetidas aqui porque são inegociáveis)

- **Base sempre `dev`.** Branch sai de `origin/dev`, PR aponta para `dev`. **Nunca** `main`, nunca branch a partir de `main`.
- **Nome da branch:** kebab-case `<type>/<ISSUE>-<slug>` (ou `<type>/<slug>` sem issue). `type` vem do mesmo enum do Conventional Commits ([`CONTRIBUTING.md`](../../CONTRIBUTING.md) § Commit convention / [`commitlint.config.js`](../../commitlint.config.js)). Esse enum precisa bater com todo `packages/*/.releaserc` — ver [`release-types.md`](./release-types.md).
- **Commit:** Conventional Commits, header commitlint-válido. **Nunca** adicionar `Co-Authored-By` nem rodapé de atribuição ("Generated with Claude"). **Nunca** `--no-verify` para pular o commitlint.
- **Commitar/push só como parte do `/open-pr`** — rodar o command é a autorização. Não commitar mudanças não relacionadas.
- **Docs/rules compartilhados em PR separado de código.** Se o diff misturar código com `.claude/rules/*`, `.claude/skills/*`, `.specs/_template.md` etc., separar em outro PR. O `.specs/<name>.md` do próprio componente fica junto do componente.

## O que não fazer

- Não rodar `git checkout -b`, `git commit`, `git push` ou `gh pr create` "na mão" fora desses fluxos quando o pedido for criar branch / abrir PR.
- Não abrir PR direto de `main` ou `dev`.
- Não marcar uma mudança como breaking sem confirmar com o usuário antes.
