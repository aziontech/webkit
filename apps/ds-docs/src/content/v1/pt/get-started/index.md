---
title: Começar
description: Comece a usar o Azion Design System
type: guide
language: pt
translatedFrom: en
translationStatus: complete
---

## Bem-vindo

Bem-vindo à documentação do Azion Design System. Este guia irá ajudá-lo a começar a usar nossos componentes e design tokens em seus projetos.

## Instalação

Instale os pacotes do design system usando seu gerenciador de pacotes preferido:

```bash
npm install @aziontech/components @aziontech/icons @aziontech/theme
```

## Início Rápido

1. Importe o CSS no seu arquivo de entrada principal:

```javascript
import '@aziontech/theme/styles.css';
```

2. Importe e use os componentes:

```vue
<script setup>
import { Button, Input } from '@aziontech/components';
</script>

<template>
  <Button variant="primary">Clique aqui</Button>
</template>
```

## Próximos Passos

- Explore nossa biblioteca de [Componentes](/pt/components)
- Conheça nossos [Fundamentos](/pt/foundations) e princípios de design
- Navegue pela nossa coleção de [Ícones](/pt/icons)
