import type { LandingPage } from '.'
import { specialistForm } from './_shared/pt-br-forms'

export default {
  lang: 'pt-BR',
  source: 'https://www.azion.com/pt-br/lp/programa-creditos-retail/',
  sections: [
    {
      section: 'HeroForm',
      eyebrow: 'Acelere Seu E-commerce com Créditos Azion',
      title: 'Teste a Plataforma Azion com Créditos Exclusivos',
      description:
        'Otimize o desempenho do seu checkout e proteja suas transações críticas com o Programa de Crédito de Incentivo da Azion. Com créditos exclusivos por 3 meses, você pode testar a plataforma em produção real e validar como melhorar a performance, a confiabilidade e a segurança do seu e-commerce.',
      paragraphs: [
        {
          lead: 'Checkout mais rápido e confiável:',
          text: 'Reduza latência e aumente conversões.'
        },
        {
          lead: 'Proteção contra instabilidades:',
          text: 'Sustente altos volumes de tráfego sem degradação.'
        },
        {
          lead: 'Economia de infraestrutura:',
          text: 'Reduza custos com overprovisioning e otimize recursos.'
        }
      ],
      ...specialistForm('Fale com um Especialista'),
      carouselMarks: []
    },
    {
      section: 'CapabilityGrid',
      eyebrow: 'Benefícios Exclusivos para Clientes de Retail',
      title: 'A Azion atua como uma camada distribuída entre usuários e sua infraestrutura',
      description:
        'A Azion processa, protege e acelera requisições antes que elas cheguem à sua origem, preservando capacidade, estabilidade e performance. Isso permite:',
      items: [
        {
          icon: 'pi pi-car',
          title: 'Aceleração distribuída de checkout e APIs',
          description:
            'Reduza latência e evite saturação do backend processando requisições mais próximas do usuário.'
        },
        {
          icon: 'pi pi-lock',
          title: 'Proteção inteligente contra bots e abuso',
          description:
            'Implemente proteção avançada e rate limiting inteligente sem impactar usuários legítimos ou conversão.'
        },
        {
          icon: 'pi pi-check',
          title: 'Cache programável para conteúdo dinâmico',
          description:
            'Acelere inclusive fluxos críticos como carrinho, sessões e personalização, preservando consistência e integridade.'
        },
        {
          icon: 'pi pi-box',
          title: 'Otimização automática de performance',
          description:
            'Otimize imagens, conteúdo e requisições automaticamente para melhorar performance e reduzir carga na infraestrutura.'
        },
        {
          icon: 'pi pi-lock',
          title: 'Segurança integrada sem impacto de performance',
          description:
            'Proteja aplicações e APIs sem adicionar latência, proxies complexos ou mudanças na aplicação.'
        },
        {
          icon: 'pi pi-home',
          title: 'Experimentação e personalização sem impacto na origem',
          description:
            'Execute lógica, experimentos e personalização na borda, preservando capacidade da infraestrutura central.'
        }
      ]
    },
    {
      section: 'CapabilityGrid',
      title: 'Benefícios Exclusivos para Clientes de Retail',
      items: [
        {
          icon: 'pi pi-database',
          title: 'Reserva de Capacidade',
          description: '',
          points: ['Assegura o desempenho ideal durante períodos de alto tráfego.']
        },
        {
          icon: 'pi pi-money-bill',
          title: 'Savings Plan',
          description: 'Descontos de até 78% para compromissos de longo prazo.'
        },
        {
          icon: 'pi pi-shield',
          title: 'Proteção de Receita',
          description: 'Evite perdas silenciosas de conversão e maximize o ROI de suas campanhas.'
        }
      ]
    },
    {
      section: 'CapabilityGrid',
      title: 'Como Funciona?',
      items: [
        {
          icon: 'pi pi-money-bill',
          title: 'Receba Créditos',
          description: 'Teste a plataforma Azion com 3 meses de créditos exclusivos.'
        },
        {
          icon: 'pi pi-check',
          title: 'Experimente e Valide',
          description:
            'Veja os resultados em campanhas reais, como redução de latência e aumento de conversões.'
        },
        {
          icon: 'pi pi-star',
          title: 'Garanta Performance',
          description:
            'Ative sua Reserva de Capacidade para continuar crescendo com segurança e eficiência.'
        }
      ]
    },
    {
      section: 'CapabilityGrid',
      title: 'Por que Escolher a Azion?',
      columns: 4,
      items: [
        {
          icon: 'pi pi-check',
          title: 'Validação sem risco',
          description: 'Experimente a plataforma com créditos antes de se comprometer.'
        },
        {
          icon: 'pi pi-spinner',
          title: 'Resultados rápidos',
          description: 'Teste durante sua próxima campanha e veja o impacto imediato.'
        },
        {
          icon: 'pi pi-star',
          title: 'Casos comprovados',
          description:
            'Clientes como Lojas Renner, Dafiti e MadeiraMadeira já validaram resultados impressionantes.'
        },
        {
          title: 'Integração simples',
          description:
            'Funciona como uma camada de aceleração e proteção sobre sua infraestrutura atual, sem necessidade de re-arquitetura.'
        }
      ]
    },
    { section: 'ClosingCallToAction', kind: 'frame' }
  ]
} satisfies LandingPage
