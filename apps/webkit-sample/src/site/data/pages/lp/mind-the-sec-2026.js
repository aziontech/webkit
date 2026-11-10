import { CLIENT_STRIP_RADWARE } from '@shared/ui/brand/strips.js'

import { campaignPage } from './_shared/campaign-page'
import { GPA_ENTERPRISE_PT_BR, quoteWall } from './_shared/lead-quotes'
import { specialistForm } from './_shared/pt-br-forms'

const EXPERT = 'Fale com um especialista'

const calendar = (event) => ({
  label: 'Save na sua agenda',
  href: `https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=${event}&tmsrc=wagner.santos%40azion.com`,
  external: true
})

const product = (icon, title, description, href) => ({ icon, title, description, href })

const PT_PRODUCTS = 'https://www.azion.com/pt-br/produtos/'

const PRIMITIVES = [
  {
    label: 'Computação',
    items: [
      product(
        'ai ai-edge-functions',
        'Functions',
        'Execute código serverless mais perto dos usuários',
        '/site/products/functions'
      ),
      product(
        'ai ai-durable-objects',
        'Durable Objects',
        'Computação stateful, distribuída globalmente',
        `${PT_PRODUCTS}durable-objects/`
      ),
      product(
        'ai ai-rules-engine',
        'Rules Engine',
        'Automatize o tratamento de requisições com regras programáveis',
        'https://www.azion.com/pt-br/documentacao/produtos/build/applications/rules-engine/'
      ),
      product(
        'ai ai-load-balancer',
        'Load Balancer',
        'Distribua o tráfego para performance e disponibilidade',
        '/site/products/load-balancer'
      ),
      product(
        'ai ai-image-processor',
        'Image Processor',
        'Otimize e transforme imagens em tempo real',
        '/site/products/image-processor'
      )
    ]
  },
  {
    label: 'AI',
    items: [
      product(
        'ai ai-edge-ai',
        'AI Inference',
        'Execute modelos de AI mais perto dos usuários',
        '/site/products/ai-inference'
      ),
      product(
        'ai ai-ai-gateway',
        'AI Gateway',
        'Proteja, gerencie e otimize o tráfego de AI',
        '/site/products/ai-gateway'
      )
    ]
  },
  {
    label: 'Dados',
    items: [
      product(
        'ai ai-edge-storage',
        'Object Storage',
        'Armazenamento escalável e durável para dados não estruturados',
        `${PT_PRODUCTS}object-storage/`
      ),
      product(
        'ai ai-edge-sql',
        'SQL Database',
        'Banco de dados relacional para aplicações distribuídas',
        '/site/products/sql-database'
      ),
      product(
        'ai ai-edge-kv',
        'KV Store',
        'Armazenamento chave-valor globalmente distribuído e de baixa latência',
        '/site/products/kv-store'
      ),
      product(
        'ai ai-tiered-cache',
        'Cache',
        'Acelere a entrega e reduza a carga na origem',
        '/site/products/cache'
      )
    ]
  },
  {
    label: 'Segurança',
    items: [
      product(
        'ai ai-edge-firewall',
        'Web Application Firewall',
        'Proteja aplicações humanas e de AI contra ameaças',
        '/site/products/web-application-firewall'
      ),
      product(
        'ai ai-azion-api',
        'API Gateway',
        'Proteja, gerencie e escale o tráfego de APIs',
        'https://www.azion.com/pt-br/documentacao/casos-de-uso/proteger-aplicacoes-e-redes/proteger-apis-publicas-contra-abuso/'
      ),
      product(
        'ai ai-bot-manager',
        'Bot Manager',
        'Detecte e bloqueie ameaças automatizadas instantaneamente',
        '/site/products/bot-manager'
      ),
      product(
        'ai ai-edge-dns',
        'DNS',
        'Hospede zonas DNS autoritativas com confiabilidade global',
        '/site/products/edge-dns'
      )
    ]
  }
]

const FAQ = [
  {
    question: 'Contra o que o Firewall da Azion protege?',
    answer:
      'O Firewall da Azion ajuda a proteger aplicações e API contra ataques web comuns como SQL injection, XSS, CSRF, inclusão remota de arquivos e abuso de protocolo. Ele combina proteções WAF gerenciadas com regras personalizadas e rate limiting para reduzir risco antes que o tráfego alcance sua infraestrutura.'
  },
  {
    question: 'Como o Network Shield protege minha origem?',
    answer:
      'O Network Shield ajuda a manter sua origem privada e mais difícil de ser acessada diretamente da internet pública. Você pode restringir acesso com URLs assinadas, IP allowlisting, conectividade em backbone privado e monitoramento de origem para reduzir exposição e melhorar a resiliência.'
  },
  {
    question: 'Qual é a diferença entre Firewall e Network Shield?',
    answer:
      'Firewall é o recurso de segurança unificado da Azion para proteger workloads em sua infraestrutura distribuída globalmente. Ele combina módulos como Web Application Firewall, Bot Manager, Network Shield e Functions. Network Shield é um desses módulos, focado em políticas programáveis de camada de rede para controlar quem pode acessar suas aplicações e de onde.'
  },
  {
    question: 'Posso criar lógica de segurança personalizada?',
    answer:
      'Sim. Você pode construir proteções personalizadas com Firewall Rules Engine e Functions usando atributos de requisição como headers, cookies, query strings, URI, IP, ASN e geolocalização. Isso permite bloquear, limitar taxa, retornar respostas personalizadas ou executar JavaScript em toda a rede distribuída.'
  },
  {
    question: 'Como o API Gateway melhora a segurança de API?',
    answer:
      'O API Gateway cria um ponto de entrada centralizado para tráfego de API, tornando mais fácil aplicar autenticação, roteamento, rate limiting e controles de requisição com consistência. Ele ajuda equipes de segurança e desenvolvedores a aplicar políticas em um único ponto enquanto melhora a visibilidade entre serviços.'
  },
  {
    question: 'Como funciona a detecção e remoção de ameaças com AI?',
    answer:
      'A Azion pode usar modelos de AI para analisar ativos digitais, detectar phishing, abuso e conteúdo malicioso e automatizar classificação e fluxos de resposta. Isso ajuda equipes de segurança a identificar ameaças mais rápido e coordenar ações de remoção em ambientes distribuídos.'
  },
  {
    question: 'Quais certificações a Azion fornece?',
    answer:
      'A Azion fornece certificações como SOC 2 Type 2 e PCI DSS para apoiar clientes com requisitos de segurança, governança e conformidade. Essas certificações ajudam a demonstrar controles operacionais para proteger aplicações, API e ativos digitais.'
  }
].map((item, index) => ({ value: `q${index + 1}`, ...item }))

export default campaignPage({
  lang: 'pt-BR',
  source: 'https://www.azion.com/pt-br/lp/mind-the-sec-2026/',
  hero: {
    eyebrow: 'Eventos',
    title: 'Azion no Mind The Sec 2026',
    description:
      'Aplicações de Agentic AI já estão em produção, muitas sem proteção adequada. Agentes acessam dados sensíveis e ferramentas capazes de executar ações via MCP, decidindo e agindo de forma autônoma. Se a entrega acelerou, a defesa precisa acelerar no mesmo ritmo.',
    ...specialistForm(EXPERT),
    carouselMarks: CLIENT_STRIP_RADWARE
  },
  capabilities: {
    items: [
      {
        icon: 'pi pi-cog',
        title: 'Segurança AI Native',
        description: 'Detecte bots e ataques automaticamente antes de atingirem sua aplicação'
      },
      {
        icon: 'pi pi-globe',
        title: 'Cobertura global',
        description: 'Proteja e distribua seu tráfego em mais de 100 localizações'
      },
      {
        icon: 'pi pi-bolt',
        title: 'Conformidade enterprise',
        description: 'Certificada nativamente para SOC 2 Type 2 / SOC 3, PCI e outras.'
      }
    ]
  },
  extra: [
    {
      section: 'MediaSplitStack',
      kind: 'alternating',
      title: 'Nossas Palestras Principais',
      bands: [
        {
          title: 'Segurança para Aplicações Geradas por Agentic AI',
          description:
            'Palco Tendências - Dia 15/09 às 12h. Julio Silvello, VP de Product Marketing, propõe segurança como primitiva da arquitetura agentic: programável e executada no mesmo plano do agente, não como camada posterior.',
          illustration: 'programmable-security',
          actions: [calendar('MHViZzM5ODgyMW5zZ3MwMDBoNDR2cm82dDQgd2FnbmVyLnNhbnRvc0Bhemlvbi5jb20')]
        },
        {
          title: 'Desafios da Operação de Segurança em Tempos de AI',
          description:
            'Painel Clientes - Dia 15/09 às 15h. Rafael Santos (CISO da Azion) debate com executivos de segurança da Exame, SENAC RS e iFood Pago sobre regulação, fraude, orçamento enxuto e governança de agentes autônomos.',
          illustration: 'stream-security-events-for-investigation-and-response',
          actions: [calendar('M2l0bXVmZGd0dTFpMnVwdWRvNXFlNjlldjMgd2FnbmVyLnNhbnRvc0Bhemlvbi5jb20')]
        },
        {
          title: 'PQC e mTLS: Protegendo APIs contra Ameaças Quânticas',
          description:
            'Palco Soluções - dia 15/09 às 16h30. Luis Artur Rossa, Principal PMM, mostra como ataques Harvest Now, Decrypt Later já interceptam tráfego hoje para quebrar quando o Dia Q chegar.',
          illustration: 'implement-api-gateway-security',
          actions: [calendar('NDJsMGxjN2IxYzB0YTZkNzFsMmZ2Zm1sZ20gd2FnbmVyLnNhbnRvc0Bhemlvbi5jb20')]
        }
      ]
    },
    {
      section: 'MediaSplitBand',
      title: 'Detecte ameaças antes de alcançarem sua aplicação',
      illustration: 'request-inspection',
      illustrationLabel: 'Ilustração',
      actions: [
        { label: 'Comece grátis', href: '/signup' },
        { label: EXPERT, href: '/site/contact' }
      ]
    },
    {
      section: 'MediaSplitStack',
      eyebrow: 'Seguro por padrão',
      title: 'A plataforma de segurança para aplicações modernas',
      bands: []
    },
    {
      section: 'ClientQuotes',
      eyebrow: 'Confiada por enterprises',
      title: 'Testada em campo nos maiores bancos e E-commerces',
      ariaLabel: 'Histórias de clientes',
      quotes: quoteWall(GPA_ENTERPRISE_PT_BR),
      actions: [
        { label: 'Clientes', href: '/site/success-cases', kind: 'secondary', trailing: true }
      ]
    },
    {
      section: 'PlatformDirectory',
      title: 'Todos os primitives de segurança que você precisa',
      groups: PRIMITIVES
    }
  ],
  faq: { title: 'Perguntas frequentes', items: FAQ }
})
