import AskAISplitButton from '@aziontech/webkit/site/ask-ai-split-button';

export default {
  title: 'Components/Site/AskAISplitButton',
  component: AskAISplitButton,
  tags: ['autodocs'],
  argTypes: {
    lang: {
      control: 'select',
      options: ['en', 'pt-br', 'es'],
      description: 'Language for the button and menu labels. Menu items include descriptions that are displayed below each label in the dropdown menu.',
      table: {
        defaultValue: { summary: 'en' },
        type: { summary: 'string' }
      }
    }
  },
  parameters: {
    docs: {
      description: {
        component: `
A split button component that allows users to copy page content or open it in various AI tools.

**Menu Item Structure:**
Each menu item displays:
- **Icon** (left side)
- **Label** (main text in white)
- **Description** (secondary text below label in gray)

When you click the dropdown arrow (▼), the menu shows 7 options with descriptions:

**English Menu Items:**
| Icon | Label | Description |
|------|-------|-------------|
| 📋 | Get page link | Get the URL of this page |
| ↗️ | View page as markdown | Open the markdown file of this page |
| ↗️ | Open in Google AI | Ask Google AI about this page |
| ↗️ | Open in Perplexity | Ask Perplexity about this page |
| ↗️ | Open in Claude | Ask Claude about this page |
| ↗️ | Open in ChatGPT | Ask ChatGPT about this page |
| ↗️ | Open in Grok | Ask Grok about this page |

All labels and descriptions automatically translate based on the \`lang\` prop.
        `
      }
    }
  }
};

export const Default = {
  args: {
    lang: 'en'
  },
  parameters: {
    docs: {
      description: {
        story: `
**English Version - Click the dropdown arrow ▼ to see the menu**

The dropdown menu will display each item with:
- **Get page link** (description: "Get the URL of this page")
- **View page as markdown** (description: "Open the markdown file of this page")
- **Open in Google AI** (description: "Ask Google AI about this page")
- **Open in Perplexity** (description: "Ask Perplexity about this page")
- **Open in Claude** (description: "Ask Claude about this page")
- **Open in ChatGPT** (description: "Ask ChatGPT about this page")
- **Open in Grok** (description: "Ask Grok about this page")

*Main button: "Copy page" → changes to "Copied!" for 2 seconds after click*
        `
      }
    }
  }
};

export const Portuguese = {
  args: {
    lang: 'pt-br'
  },
  parameters: {
    docs: {
      description: {
        story: `
**Portuguese (Brazil) Version - Clique na seta dropdown ▼ para ver o menu**

O menu dropdown mostrará cada item com descrição:
- **Obter link da página** (descrição: "Obter o URL da página")
- **Visualizar página como markdown** (descrição: "Abrir o arquivo markdown da página")
- **Abrir no Google AI** (descrição: "Pergunte ao Google AI sobre esta página")
- **Abrir no Perplexity** (descrição: "Pergunte ao Perplexity sobre esta página")
- **Abrir no Claude** (descrição: "Pergunte ao Claude sobre esta página")
- **Abrir no ChatGPT** (descrição: "Pergunte ao ChatGPT sobre esta página")
- **Abrir no Grok** (descrição: "Pergunte ao Grok sobre esta página")

*Botão principal: "Copiar página" → muda para "Copiado!" após clicar*
        `
      }
    }
  }
};

export const Spanish = {
  args: {
    lang: 'es'
  },
  parameters: {
    docs: {
      description: {
        story: `
**Spanish Version - Haga clic en la flecha desplegable ▼ para ver el menú**

El menú desplegable mostrará cada elemento con descripción:
- **Obtener link de la página** (descripción: "Obtener el URL de la página")
- **Visualizar página como markdown** (descripción: "Abrir el archivo markdown de la página")
- **Abrir en Google AI** (descripción: "Pregunte al Google AI sobre esta página")
- **Abrir en Perplexity** (descripción: "Pregunte al Perplexity sobre esta página")
- **Abrir en Claude** (descripción: "Pregunte al Claude sobre esta página")
- **Abrir en ChatGPT** (descripción: "Pregunte al ChatGPT sobre esta página")
- **Abrir en Grok** (descripción: "Pregunte al Grok sobre esta página")

*Botón principal: "Copiar página" → cambia a "¡Copiado!" después de hacer clic*
        `
      }
    }
  }
};