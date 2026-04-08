---
title: Instalação
description: Instale o Azion Design System em seu projeto
type: guide
category: installation
language: pt
translatedFrom: en
translationStatus: complete
---

## Requisitos

- Node.js 18 ou superior
- npm, yarn ou pnpm

## Instalar Pacotes

O Azion Design System é composto por três pacotes principais:

```bash
# Usando npm
npm install @aziontech/components @aziontech/icons @aziontech/theme

# Usando yarn
yarn add @aziontech/components @aziontech/icons @aziontech/theme

# Usando pnpm
pnpm add @aziontech/components @aziontech/icons @aziontech/theme
```

### Pacotes

| Pacote | Descrição |
|--------|-----------|
| `@aziontech/components` | Componentes Vue.js |
| `@aziontech/icons` | Biblioteca de ícones |
| `@aziontech/theme` | Design tokens e estilos base |

## Configuração

### 1. Importar Estilos

Importe os estilos base no seu arquivo de entrada principal:

```javascript
// main.js ou main.ts
import '@aziontech/theme/styles.css';
```

### 2. Registrar Componentes (Opcional)

Para registrar todos os componentes globalmente:

```javascript
// main.js ou main.ts
import { createApp } from 'vue';
import AzionComponents from '@aziontech/components';
import App from './App.vue';

const app = createApp(App);
app.use(AzionComponents);
app.mount('#app');
```

### 3. Importação Sob Demanda

Para melhor performance, importe componentes individualmente:

```vue
<script setup>
import { Button, Input } from '@aziontech/components';
</script>

<template>
  <Button variant="primary">Enviar</Button>
  <Input v-model="value" placeholder="Digite algo..." />
</template>
```

## Frameworks Suportados

O Azion Design System é construído com Vue 3 e funciona com:

- Vue 3.x
- Nuxt 3.x
- Vite

## Solução de Problemas

### Erro de Importação

Se você encontrar erros de importação, verifique se o `@aziontech/theme` está instalado corretamente:

```bash
npm ls @aziontech/theme
```

### Estilos Não Aplicados

Certifique-se de importar os estilos antes de usar os componentes:

```javascript
import '@aziontech/theme/styles.css';
// Depois importe os componentes
import { Button } from '@aziontech/components';
```

## Próximos Passos

- [Início Rápido](/pt/get-started) - Comece a usar os componentes
- [Componentes](/pt/components) - Explore a biblioteca de componentes
- [Fundamentos](/pt/foundations) - Conheça os princípios de design
