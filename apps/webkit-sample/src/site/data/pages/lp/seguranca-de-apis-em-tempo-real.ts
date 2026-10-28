import type { LandingPage } from '.'
import { PT_BR_FORM_MESSAGES, SIGNUP } from './_shared/pt-br-forms'

const FORM_TITLE = 'Preencha as informações para acessar o conteúdo'

export default {
  lang: 'pt-BR',
  source: 'https://www.azion.com/pt-br/lp/seguranca-de-apis-em-tempo-real/',
  sections: [
    {
      section: 'HeroForm',
      eyebrow: 'EBOOK',
      title: 'Como Proteger APIs em Tempo Real',
      description:
        'Ataques a APIs evoluem mais rápido do que a capacidade de muitas equipes de correlacionar eventos entre diferentes ferramentas.',
      paragraphs: [
        'Neste whitepaper, descubra como unificar proteção, observabilidade e segurança programável para detectar ameaças mais cedo, responder com rapidez e reduzir a complexidade operacional da segurança de APIs.'
      ],
      formTitle: FORM_TITLE,
      formLabel: FORM_TITLE,
      fields: ['phone', 'role'],
      country: 'BR',
      labels: {
        firstName: 'Nome:',
        lastName: 'Sobrenome:',
        email: 'E-mail:',
        phone: 'Telefone',
        role: 'Cargo:',
        rolePlaceholder: 'Selecione seu cargo',
        company: 'Empresa:',
        submit: 'Enviar'
      },
      messages: PT_BR_FORM_MESSAGES,
      carouselMarks: []
    },
    {
      section: 'CapabilityGrid',
      title: 'O que você encontrará neste ebook',
      columns: 4,
      items: [
        {
          title: 'O que você vai aprender',
          description:
            'Como proteger APIs com WAF, proteção contra bots, rate limiting, observabilidade e segurança programável em uma arquitetura distribuída.'
        },
        {
          title: 'Para quem é',
          description:
            'Arquitetos de Segurança, DevSecOps, SREs, Platform Engineers, CISOs e equipes responsáveis pela proteção de aplicações e APIs.'
        },
        {
          title: 'Por que isso importa',
          description:
            'Unificar proteção e observabilidade acelera a detecção, investigação e resposta a incidentes, reduzindo a complexidade operacional.'
        },
        {
          title: 'O que muda',
          description:
            'Sua equipe passa a aplicar controles distribuídos e responder a ameaças antes que o tráfego alcance a infraestrutura de origem.'
        }
      ]
    },
    {
      section: 'ClosingCallToAction',
      kind: 'panel',
      title: 'Construa suas aplicações de forma inteligente',
      description: 'Acesse todos os produtos agora.',
      actions: [{ label: 'Comece Grátis', href: SIGNUP, kind: 'secondary', external: true }]
    }
  ]
} satisfies LandingPage
