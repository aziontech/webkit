---
title: Ícones
description: Biblioteca de ícones com Azion Icons e PrimeIcons para uso em suas aplicações.
navLabel: Ícones
order: 1
type: icon
---

# Ícones

> **Galeria de Ícones** — Navegue por todos os ícones disponíveis com galeria visual, busca e copiar para a área de transferência. <a href="https://icons-gallery.azion.app" target="_blank" rel="noopener noreferrer">Abrir Galeria de Ícones</a>

O Azion Design System inclui duas bibliotecas de ícones:

- **Azion Icons** - Ícones personalizados projetados para produtos Azion
- **PrimeIcons** - Biblioteca de ícones de uso geral do PrimeVue

## Instalação

Os ícones estão incluídos no pacote `@aziontech/icons`:

```bash
npm install @aziontech/icons
```

## Uso

### Ícones de Fonte

Use ícones como font icons com a classe apropriada:

```html
<!-- Ícone Azion -->
<i class="ai ai-azion"></i>

<!-- PrimeIcon -->
<i class="pi pi-home"></i>
```

### Ícones SVG

Importe ícones SVG diretamente para ter mais controle:

```js
import { aiAzion, piHome } from '@aziontech/icons/svg';
```

## Categorias de Ícones

### Azion Icons

Os ícones Azion estão organizados em categorias:

- **Ícones de Produto** - Ícones de produtos e serviços Azion
- **Ícones de Ação** - Ícones de ações comuns
- **Ícones de Status** - Ícones de status e notificações

### PrimeIcons

PrimeIcons fornece um conjunto abrangente de ícones de uso geral adequados para a maioria das necessidades de interface.

## Tamanhos

Os ícones herdam seu tamanho do tamanho da fonte de seu contêiner:

```html
<!-- Pequeno -->
<i class="ai ai-azion text-sm"></i>

<!-- Médio (padrão) -->
<i class="ai ai-azion text-base"></i>

<!-- Grande -->
<i class="ai ai-azion text-2xl"></i>
```

## Acessibilidade

Ao usar ícones sozinhos, forneça rótulos acessíveis:

```html
<!-- Botão com ícone e rótulo -->
<button aria-label="Configurações">
  <i class="pi pi-cog"></i>
</button>

<!-- Ícone decorativo (oculto para leitores de tela) -->
<i class="pi pi-star" aria-hidden="true"></i>
```

## Relacionado

- [Button](/pt/components/button) - Componente de botão com suporte a ícones
