# [PROPOSTA] Release Tool - Semantic Release VS Release Please

Preciso de um documento oficial e executivo com comparaçao entre `Semantic Release` e `Release Please`.
Esse documento será utilizado para apresentar para nosso CTO e time de Delivery onde temos também Diretores de Arquitetura.

**Pelo o que é composto um release ?**

Um release é mais do que publicar um pacote em algum registry.
É fundamental ter o step de devolução de versão para o projeto

**O que é o trigger para Release ?**

- PRs abertos para branch main
- Checks de validações

**Antes VS hoje:**

Antes o Semantic Release era `1 x 1` _(um release para um merge, respeitando sempre o SemVer)_
Hoje com Release Please podemos ter `1 x 1` e `1 x N` _(um release para múltiplos merges)_
Mas, na minha humilde opinião, como falamos aquele dia eu tu eo gui.. eu acho esse fluxo melhor. Já que tu achou uma lib que faz, pode ser o fator de convencimento.

**Relembrando as seguintes motivações dessa update na implementação:**

- temos policy rule que exige 2 aproves
- temos policy rule que não pode dar bypass _(bot do semantc release nao pode fazer commit atualizando package.json#version)_

## Cenários testados

### Com Semantic Release

#### FLOW 01

1. commit feat/fix
2. 2 aproves
3. merge
4. release
5. bot push branch main atualizando o `pacakge.json#version`, `CHANGELOG.md`

> OBS: O que trava nesse processo é o commit na main que precisa do bypass para o `bot-semantic-release`

#### FLOW 02

1. criação manual do branch de integração (não tendo merge)
2. commit feat/fix
3. merges
4. abertura do PR de release
5. release
6. semantic release abre outro pr atualizando bot push branch main atualizando o `pacakge.json#version`, `CHANGELOG.md`
7. 2 aproves para aceitar o update `pacakge.json#version`, `CHANGELOG.md`
8. Skip release

> OBS: O que é não é produtivo nesse processo é a gestão de release que precisa ser feito por um humano entre criação de branch, fechamento ou implementar um semantic release nesse branch fixo, o que voltaria para

#### FLOW 03

1. commit feat/fix (direto para main)
2. 2 aproves
3. merge
4. release
5. semantic release abre outro pr atualizando bot push branch main atualizando o `pacakge.json#version`, `CHANGELOG.md`
6. +v2 aproves para aceitar o update `pacakge.json#version`, `CHANGELOG.md`
7. Skip release

> OBS: O que é não é produtivo nesse processo de reabertura do segundo projeto para fazer o sync dos arquivos necessários, pois faz um release necessários 2 prs assim somando 4 aproves.

#### O que é bom no semantic release?

- possibilide de matchs através de regex para configurar headerpattern

> porém isso quebra a semantica do commit(commit lint) "type(scope): description", pois na Azion alguns times tem o padrão "[ISSUE-XXXX|NO-ISSUE] type(scope): description"

#### O que é ruim no semantic?

- Depende de um auto-commit para o projeto ter um sync de ponta a ponta
- Sem auto commit acaba sendo `1 x 1`
- Alta complexidade para fazer `1 x N` (provavelmente via precisar de um bash)
- Alta complexidade para implementação de convenções (cada questão é um plugin)

### Com Release Please

#### FLOW 01

1. commit feat/fix
2. 2 aproves
3. merge
4. release please abre outro pr atualizando bot push branch main atualizando o `pacakge.json#version`, `CHANGELOG.md`. Esse PR é um watch que vai acumulando os merges da main respeitando o mais forte SemVer
5. 2 aproves para aceitar o update `pacakge.json#version`, `CHANGELOG.md`
6. Release / Distribuição

> apenas com um fluxo resolvemos nossos problemas de compliance + aproves

#### O que é bom no release please?

- não precisa de diferentes plugins para update de `pacakge.json#version`, `CHANGELOG.md`
- configuração simplificada
- 100% respeitável commit lint (nao a ferramenta commit lint mas a especificação "type(scope): description")
- é do Google

#### O que é ruim no release please?

- comparando com Semantic Release não faz parser via regex de headerPattern
- caso queira usar headerTitle fora do padrão irá obrigar uma nottation no body do commit
