# ButtonCopy — Design Spec

> Gerado automaticamente por `/design-sync` em 2026-03-28T00:00:00.000Z (fresh run).
> Fonte: `packages/webkit/src/components/buttons/button-copy/button-copy.vue`

---

## Visão Geral

Botão de copiar para clipboard com feedback visual. Ao clicar, o ícone alterna de **pi-copy** → **pi-check** por 2 segundos e o label troca para o `copiedLabel`. Wraps `primevue/button` com `outlined` e `text` props exclusivos entre si.

---

## Props

| Prop | Tipo | Default | Role | Descrição |
|------|------|---------|------|-----------|
| `value` | String | — | content | Texto copiado para o clipboard (obrigatório) |
| `label` | String | — | content | Label exibido no botão (opcional) |
| `iconPos` | String | `'left'` | variant-driver | Posição do ícone: `left` \| `right` |
| `size` | String | `''` | variant-driver | Tamanho: `''` (Default) \| `'small'` \| `'large'` |
| `outlined` | Boolean | `true` | variant-driver | `true` = outlined; `false` = text-only |
| `disabled` | Boolean | `false` | state-driver | Estado desabilitado |
| `isCopyVisible` | Boolean | `true` | state-driver | Controla visibilidade via opacity |
| `copiedLabel` | String | `'Copied'` | content | Label após copiar |

---

## Estado Computado

| Computed | Tipo | Descrição |
|----------|------|-----------|
| `copied` | Boolean | `true` por 2s após clique. Alterna ícone e label. |
| `icon` | String | `'pi pi-copy'` (default) \| `'pi pi-check'` (copied) |
| `labelText` | String \| undefined | Troca `label` por `copiedLabel` quando copied=true |

---

## Ícones

O componente usa dois ícones da **Azion Icons library** (PrimeIcons):

| Estado | PrimeIcon class | Azion Icon | Figma node |
|--------|----------------|------------|------------|
| Default | `pi pi-copy` | `pi-copy` | `400:899` no arquivo `t97pXRs7xME3SJDs5iZ5RF` |
| Copied | `pi pi-check` | `pi-check` | — |

Tamanho: **14×14px**. Posição controlada por `iconPos` (left/right).

---

## Variantes

### Dimensões por tamanho

| Size | Height | Padding H | Padding V | Gap icon↔label |
|------|--------|-----------|-----------|----------------|
| Default (`''`) | 36px | 16px | 8px | 8px |
| Small | 28px | 12px | 6px | 6px |
| Large | 44px | 20px | 10px | 8px |

### Estilos por modo

| Prop | Background | Border | Text color |
|------|-----------|--------|-----------|
| `outlined=true` | transparent | 1px solid `--border-primary` | `--text-primary` |
| `outlined=false` | transparent | none | `--text-primary` |

### Estados

| State | Visual |
|-------|--------|
| Default | ícone pi-copy; label normal |
| Copied | ícone pi-check; label = copiedLabel; 2s timeout |
| Disabled | opacity 50% (aplicada via Tailwind `opacity-50`) |
| Hidden | opacity 0% (`isCopyVisible=false`, classe `opacity-0`) |

---

## Tokens Resolvidos

### Light mode

| CSS Var | Hex |
|---------|-----|
| `--text-primary` | `#fe601f` |
| `--text-default` | `#171717` |
| `--text-muted` | `#525252` |
| `--background-surface` | `#ffffff` |
| `--background-primary` | `#fe601f` |
| `--border-default` | `#f5f5f5` |
| `--border-primary` | `#fe601f` |

### Dark mode

| CSS Var | Hex |
|---------|-----|
| `--text-primary` | `#fe601f` |
| `--text-default` | `#fafafa` |
| `--text-muted` | `#a3a3a3` |
| `--background-surface` | `#171717` |
| `--background-primary` | `#fe601f` |
| `--border-default` | `#262626` |
| `--border-primary` | `#fe601f` |

---

## Matriz de Variantes (17 combinações)

| Outlined | Size | IconPos | State |
|----------|------|---------|-------|
| True | Default | Left | Default |
| True | Default | Left | Copied |
| True | Default | Left | Disabled |
| True | Default | Right | Default |
| True | Default | Right | Copied |
| True | Default | Right | Disabled |
| True | Small | Left | Default |
| True | Small | Left | Copied |
| True | Small | Left | Disabled |
| True | Large | Left | Default |
| True | Large | Left | Copied |
| True | Large | Left | Disabled |
| False | Default | Left | Default |
| False | Default | Left | Copied |
| False | Default | Left | Disabled |
| False | Small | Left | Default |
| False | Large | Left | Default |

---

## Estrutura de Layers no Figma

```
ButtonCopy (component set)
  └── [Outlined=True, Size=Default, IconPos=Left, State=Default] (component)
        └── Container (frame, Auto Layout Horizontal, gap=8)
              ├── Icon (instance → Azion Icons/pi-copy, 14×14)
              └── Label (text, opcional)
```

Quando `State=Copied`:
```
              ├── Icon (instance → Azion Icons/pi-check, 14×14)
              └── Label (text = copiedLabel)
```

---

## Stories

| Story | Configuração chave |
|-------|-------------------|
| Default | outlined=true, sem label |
| WithLabel | label='Copy URL', outlined=true |
| TextOnly | label='Copy', outlined=false |
| Disabled | disabled=true |
| CustomCopiedLabel | copiedLabel='Copied!' |
| HiddenByDefault | isCopyVisible=false |
| CopyAPIKey | label='Copy API Key', copiedLabel='Key Copied!' |
| IconRight | iconPos='right', label='Copy' |
