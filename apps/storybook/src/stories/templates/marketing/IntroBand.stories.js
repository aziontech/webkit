import Button from '@aziontech/webkit/button'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'

import { COLUMN_IMPORTS, each, inColumn } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'"
]

const components = { Button, SectionContainer, SectionGap, SectionModule }

const ASK_AI_QUERY = encodeURIComponent(
  "Summarize in plain language the key security practices described in Azion's GDPR at https://www.azion.com/en/gdpr"
)

const ASK_AI_LINKS = [
  { label: 'ChatGPT', href: `https://chatgpt.com/?q=${ASK_AI_QUERY}` },
  { label: 'Claude', href: `https://claude.ai/new?q=${ASK_AI_QUERY}` },
  { label: 'Gemini', href: `https://www.google.com/search?udm=50&aep=11&q=${ASK_AI_QUERY}` },
  { label: 'Perplexity', href: `https://www.perplexity.ai/search?q=${ASK_AI_QUERY}` }
]

const INTRO_TEMPLATE = inColumn(`<SectionModule
  :divided="false"
  :padded="false"
  eyebrow="Expertise em conformidade"
  title="Estamos comprometidos em garantir que nossos clientes e parceiros globais possam atender a diversos requisitos de conformidade"
  description="Segurança e Conformidade são responsabilidades compartilhadas entre a Azion e o cliente. Esse modelo compartilhado pode ajudar a aliviar o fardo operacional do cliente, pois a Azion opera, gerencia e controla os componentes desde o sistema operacional e camada de virtualização, incluindo atualizações e patches de segurança, até a segurança física das instalações onde o serviço opera."
>
  <template #actions>
    <Button
      label="Ver Matriz de Responsabilidade"
      kind="secondary"
      size="large"
      href="https://www.azion.com/pt-br/documentacao/responsabilidade-compartilhada/"
    />
  </template>
</SectionModule>`)

const TOOLS_TEMPLATE = inColumn(`<SectionModule
  :divided="false"
  title="Ask AI to explain"
  description="Get a concise, human-readable summary of this security page."
>
  <div class="flex flex-wrap gap-(--spacing-sm)">
${each(
  ASK_AI_LINKS,
  (tool) => `<Button
  label="${tool.label}"
  kind="secondary"
  size="small"
  icon="pi pi-sparkles"
  href="${tool.href}"
  target="_blank"
/>`,
  2
)}
  </div>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Content/IntroBand',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A band of words with no media: an overline, a headline and a long description set at the start edge, then a row of actions. It opens the framed column of a trust page, where the page has something to explain before it shows anything. Compliance opens with it, under its hero, before the certification badges; GDPR opens with a small row of links that hand the page to an AI assistant to summarize. Built from `SectionModule` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Intro = {
  render: () => ({ components, template: INTRO_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'From the Compliance page: the module’s own `left` header carries the eyebrow, the headline and the shared-responsibility paragraph, with one large action to the responsibility matrix in its actions row, which goes full width below `sm`. The body is left unpadded and empty, so the header’s bottom rule closes the band.'
      },
      source: { code: toSfc(IMPORTS, INTRO_TEMPLATE) }
    }
  }
}

export const Tools = {
  render: () => ({ components, template: TOOLS_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'From the GDPR page: a headline and one line, then the padded body holds a wrapping row of small secondary buttons, one per AI assistant, each opening that tool in a new tab with a prompt asking it to summarize the page.'
      },
      source: { code: toSfc(IMPORTS, TOOLS_TEMPLATE) }
    }
  }
}
