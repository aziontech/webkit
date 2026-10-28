import { CLIENTS } from '@aziontech/webkit/assets/client-registry'
import gdprBadge from '@aziontech/webkit/assets/gdpr-symbol-color.svg'
import lgpdBadge from '@aziontech/webkit/assets/lgpd-symbol-color.svg'
import pciDssBadge from '@aziontech/webkit/assets/pci-dss-symbol-color.svg'
import socBadge from '@aziontech/webkit/assets/soc-symbol-color.svg'
import { CLIENT_STRIP_RADWARE } from '@shared/ui/brand/strips.js'

import { AREZZO, AXUR, CONTABILIZEI, CREFISA } from '../../clients.js'

const registered = (name) => CLIENTS.find((client) => client.name === name) ?? { name }

const wallItem = (client) => ({ alt: client.name, src: client.logo ?? '', client })

const EMPLOYEE_RANGES = ['1-200', '201-1000', '1000+'].map((range) => ({
  value: range,
  label: range
}))

export default {
  lang: 'pt-BR',
  source: 'https://www.azion.com/pt-br/lp/secure-ddos-form/',
  sections: [
    {
      section: 'HeroForm',
      eyebrow: 'Segurança',
      title: 'Proteção DDoS que detecta e mitiga ataques em menos de 3 segundos',
      description:
        'Segurança automatizada nas camadas 3, 4, 6 e 7 com SLA de 100% de disponibilidade. Largura de banda ilimitada de proteção.',
      formTitle: 'Fale com um especialista',
      carouselMarks: CLIENT_STRIP_RADWARE,
      carouselLabel: '',
      roles: EMPLOYEE_RANGES,
      country: 'BR',
      labels: {
        firstName: 'Nome:',
        lastName: 'Sobrenome:',
        email: 'E-mail:',
        role: 'Número de Funcionários',
        rolePlaceholder: 'Selecione',
        company: 'Empresa:',
        phone: 'Telefone',
        message: 'Mensagem',
        submit: 'FALE COM UM ESPECIALISTA'
      },
      messages: {
        required: 'Preencha esse campo obrigatório.',
        invalidEmail: 'O e-mail deve ser formatado corretamente',
        success: 'Obrigado por enviar o formulário.',
        error: 'Não foi possível enviar o formulário.',
        errorDescription: 'Verifique sua conexão e tente novamente.',
        retry: 'Tentar novamente'
      }
    },
    {
      section: 'MediaSplitBand',
      title: 'Detecte ameaças antes de alcançarem sua aplicação',
      illustration: 'request-inspection',
      actions: [
        { label: 'Comece grátis', href: '/signup' },
        { label: 'Fale com um especialista', href: '/site/contact' }
      ]
    },
    {
      section: 'CapabilityGrid',
      items: [
        {
          icon: 'pi pi-sparkles',
          title: 'Segurança AI Native',
          description: 'Detecte bots e ataques automaticamente antes de atingirem sua aplicação'
        },
        {
          icon: 'pi pi-globe',
          title: 'Cobertura global',
          description: 'Proteja e distribua seu tráfego em mais de 100 localizações'
        },
        {
          icon: 'pi pi-verified',
          title: 'Conformidade enterprise',
          description: 'Certificada nativamente para SOC 2 Type 2 / SOC 3, PCI e outras.'
        }
      ]
    },
    {
      section: 'MediaSplitStack',
      kind: 'alternating',
      eyebrow: 'Seguro por padrão',
      title: 'A plataforma de segurança para aplicações modernas',
      bands: []
    },
    {
      section: 'ComplianceBadges',
      eyebrow: 'A gente cobre isso para você',
      title: 'Conforme suas necessidades atuais e futuras',
      description: '',
      ariaLabel: 'Certificações de conformidade',
      certifications: [
        { label: 'SOC 2 Type 2', badge: socBadge, alt: 'Selo AICPA SOC 2 Type 2' },
        { label: 'SOC 3', badge: socBadge, alt: 'Selo AICPA SOC 3' },
        { label: 'PCI DSS', badge: pciDssBadge, alt: 'Selo PCI DSS' },
        { label: 'GDPR', badge: gdprBadge, alt: 'GDPR' },
        { label: 'LGPD', badge: lgpdBadge, alt: 'Selo LGPD' }
      ],
      more: null
    },
    {
      section: 'LogoWallQuote',
      eyebrow: 'Confiada por enterprises',
      title: 'Testada em campo nos maiores bancos e E-commerces',
      ariaLabel: 'Bancos e e-commerces que usam a Azion',
      items: [
        wallItem(registered('NZN')),
        wallItem(AXUR),
        wallItem(registered('Radware')),
        wallItem(AREZZO),
        wallItem(CONTABILIZEI),
        wallItem(registered('Magalu')),
        wallItem(registered('Fourbank')),
        wallItem(CREFISA),
        wallItem(registered('Netshoes')),
        wallItem(registered('Dafiti')),
        wallItem(registered('Global Fashion Group'))
      ],
      quote: {
        text: '"A Azion nos protegeu de ciberataques sofisticados e nos possibilitou modernizar nossa infraestrutura, reduzir custos e disponibilizar as melhores experiências de compra a milhões de clientes em toda a América Latina."',
        name: 'Allan Monteiro',
        jobTitle: 'CISO & Head of Technology',
        client: registered('GPA')
      },
      actions: [
        { label: 'Clientes', href: '/site/success-cases', kind: 'secondary', trailing: true }
      ]
    },
    {
      section: 'PlatformDirectory',
      title: 'Todos os primitives de segurança que você precisa',
      ariaLabel: 'Primitives de segurança da Azion',
      groups: [
        {
          label: 'Computação',
          items: [
            {
              icon: 'ai ai-edge-functions',
              title: 'Functions',
              description: 'Execute código serverless mais perto dos usuários',
              href: '/site/products/functions'
            },
            {
              icon: 'ai ai-durable-objects',
              title: 'Durable Objects',
              description: 'Computação stateful, distribuída globalmente',
              href: 'https://www.azion.com/pt-br/produtos/durable-objects/'
            },
            {
              icon: 'ai ai-rules-engine',
              title: 'Rules Engine',
              description: 'Automatize o tratamento de requisições com regras programáveis',
              href: 'https://www.azion.com/pt-br/documentacao/produtos/build/applications/rules-engine/'
            },
            {
              icon: 'ai ai-load-balancer',
              title: 'Load Balancer',
              description: 'Distribua o tráfego para performance e disponibilidade',
              href: '/site/products/load-balancer'
            },
            {
              icon: 'ai ai-image-processor',
              title: 'Image Processor',
              description: 'Otimize e transforme imagens em tempo real',
              href: '/site/products/image-processor'
            }
          ]
        },
        {
          label: 'AI',
          items: [
            {
              icon: 'ai ai-edge-ai',
              title: 'AI Inference',
              description: 'Execute modelos de AI mais perto dos usuários',
              href: '/site/products/ai-inference'
            },
            {
              icon: 'ai ai-ai-gateway',
              title: 'AI Gateway',
              description: 'Proteja, gerencie e otimize o tráfego de AI',
              href: '/site/products/ai-gateway'
            }
          ]
        },
        {
          label: 'Dados',
          items: [
            {
              icon: 'ai ai-edge-storage',
              title: 'Object Storage',
              description: 'Armazenamento escalável e durável para dados não estruturados',
              href: 'https://www.azion.com/pt-br/produtos/object-storage/'
            },
            {
              icon: 'ai ai-edge-sql',
              title: 'SQL Database',
              description: 'Banco de dados relacional para aplicações distribuídas',
              href: '/site/products/sql-database'
            },
            {
              icon: 'ai ai-edge-kv',
              title: 'KV Store',
              description: 'Armazenamento chave-valor globalmente distribuído e de baixa latência',
              href: '/site/products/kv-store'
            },
            {
              icon: 'ai ai-tiered-cache',
              title: 'Cache',
              description: 'Acelere a entrega e reduza a carga na origem',
              href: '/site/products/cache'
            }
          ]
        },
        {
          label: 'Segurança',
          items: [
            {
              icon: 'ai ai-edge-firewall',
              title: 'Web Application Firewall',
              description: 'Proteja aplicações humanas e de AI contra ameaças',
              href: '/site/products/waf'
            },
            {
              icon: 'ai ai-azion-api',
              title: 'API Gateway',
              description: 'Proteja, gerencie e escale o tráfego de APIs',
              href: 'https://www.azion.com/pt-br/documentacao/casos-de-uso/proteger-aplicacoes-e-redes/proteger-apis-publicas-contra-abuso/'
            },
            {
              icon: 'ai ai-bot-manager',
              title: 'Bot Manager',
              description: 'Detecte e bloqueie ameaças automatizadas instantaneamente',
              href: '/site/products/bot-manager'
            },
            {
              icon: 'ai ai-edge-dns',
              title: 'DNS',
              description: 'Hospede zonas DNS autoritativas com confiabilidade global',
              href: '/site/products/edge-dns'
            }
          ]
        }
      ]
    },
    {
      section: 'FaqSection',
      title: 'Perguntas frequentes',
      items: [
        {
          value: 'firewall',
          question: 'Contra o que o Firewall da Azion protege?',
          answer:
            'O Firewall da Azion ajuda a proteger aplicações e API contra ataques web comuns como SQL injection, XSS, CSRF, inclusão remota de arquivos e abuso de protocolo. Ele combina proteções WAF gerenciadas com regras personalizadas e rate limiting para reduzir risco antes que o tráfego alcance sua infraestrutura.'
        },
        {
          value: 'network-shield',
          question: 'Como o Network Shield protege minha origem?',
          answer:
            'O Network Shield ajuda a manter sua origem privada e mais difícil de ser acessada diretamente da internet pública. Você pode restringir acesso com URLs assinadas, IP allowlisting, conectividade em backbone privado e monitoramento de origem para reduzir exposição e melhorar a resiliência.'
        },
        {
          value: 'firewall-vs-network-shield',
          question: 'Qual é a diferença entre Firewall e Network Shield?',
          answer:
            'Firewall é o recurso de segurança unificado da Azion para proteger workloads em sua infraestrutura distribuída globalmente. Ele combina módulos como Web Application Firewall, Bot Manager, Network Shield e Functions. Network Shield é um desses módulos, focado em políticas programáveis de camada de rede para controlar quem pode acessar suas aplicações e de onde.'
        },
        {
          value: 'custom-logic',
          question: 'Posso criar lógica de segurança personalizada?',
          answer:
            'Sim. Você pode construir proteções personalizadas com Firewall Rules Engine e Functions usando atributos de requisição como headers, cookies, query strings, URI, IP, ASN e geolocalização. Isso permite bloquear, limitar taxa, retornar respostas personalizadas ou executar JavaScript em toda a rede distribuída.'
        },
        {
          value: 'api-gateway',
          question: 'Como o API Gateway melhora a segurança de API?',
          answer:
            'O API Gateway cria um ponto de entrada centralizado para tráfego de API, tornando mais fácil aplicar autenticação, roteamento, rate limiting e controles de requisição com consistência. Ele ajuda equipes de segurança e desenvolvedores a aplicar políticas em um único ponto enquanto melhora a visibilidade entre serviços.'
        },
        {
          value: 'ai-threat-detection',
          question: 'Como funciona a detecção e remoção de ameaças com AI?',
          answer:
            'A Azion pode usar modelos de AI para analisar ativos digitais, detectar phishing, abuso e conteúdo malicioso e automatizar classificação e fluxos de resposta. Isso ajuda equipes de segurança a identificar ameaças mais rápido e coordenar ações de remoção em ambientes distribuídos.'
        },
        {
          value: 'certifications',
          question: 'Quais certificações a Azion fornece?',
          answer:
            'A Azion fornece certificações como SOC 2 Type 2 e PCI DSS para apoiar clientes com requisitos de segurança, governança e conformidade. Essas certificações ajudam a demonstrar controles operacionais para proteger aplicações, API e ativos digitais.'
        }
      ]
    },
    {
      section: 'ClosingCallToAction',
      kind: 'split',
      eyebrow: 'Proteger',
      title: 'Proteção nativa.',
      titleMuted: 'Sempre ativa.',
      description:
        'Ganhe proteção mais forte, menos exposição a ataques e menos sobrecarga operacional.',
      actions: [{ label: 'Comece grátis', href: '/signup', kind: 'secondary' }],
      aside: { label: 'Fale com um especialista', href: '/site/contact' }
    }
  ]
}
