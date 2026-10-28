import g2 from '@aziontech/webkit/assets/g2-symbol-color.svg'

import type { LandingPage } from '.'
import { SIGNUP } from './_shared/pt-br-forms'

const DOCS = 'https://www.azion.com/pt-br/documentacao/'
const WAF_DOCS = `${DOCS}produtos/secure/firewall/web-application-firewall/`

const external = (label: string, href: string) => ({
  label,
  href,
  trailing: true,
  external: true
})

const FAQ = [
  {
    value: 'sob-ataque',
    question: 'Estou sob ataque. O que devo fazer?',
    answer: '',
    body: [
      {
        type: 'p' as const,
        segments: [{ text: 'Seu sistema está sob ataque agora? Obtenha ajuda especializada imediata.' }]
      },
      { type: 'p' as const, segments: [{ text: 'O que acontece a seguir:' }] },
      {
        type: 'ul' as const,
        items: [
          [{ text: 'Conecte-se com nossos especialistas em segurança instantaneamente' }],
          [{ text: 'Análise de ataque em tempo real e identificação de ameaças' }],
          [{ text: 'Regras de segurança personalizadas implementadas para bloquear o ataque' }],
          [{ text: 'Proteção avançada ativada imediatamente' }]
        ]
      },
      {
        type: 'p' as const,
        segments: [{ text: 'Não espere - cada segundo conta durante um ataque ativo.' }]
      },
      {
        type: 'p' as const,
        segments: [
          {
            text: 'OBTENHA SUPORTE DE EMERGÊNCIA AGORA',
            href: 'https://www.azion.com/pt-br/lp/emergencia-ataque-cibernetico/',
            external: true
          }
        ]
      }
    ]
  },
  {
    value: 'o-que-e',
    question: 'O que é um web application firewall e como funciona?',
    answer:
      'Um web application firewall (WAF) é uma solução de segurança que monitora, filtra e bloqueia o tráfego HTTP/HTTPS entre uma aplicação web e a internet. Funciona analisando cada requisição contra um conjunto de regras para detectar e prevenir ataques como injeção SQL, cross-site scripting (XSS) e outras ameaças OWASP Top 10. O Azion WAF opera na camada de aplicação (Camada 7) em uma rede distribuída globalmente, inspecionando o tráfego antes que chegue aos seus servidores de origem com latência inferior a 10ms.'
  },
  {
    value: 'waf-vs-firewall',
    question: 'Qual é a diferença entre um WAF e um firewall tradicional?',
    answer:
      'Firewalls tradicionais operam na camada de rede (Camada 3-4) e filtram o tráfego com base em endereços IP, portas e protocolos. Um WAF opera na camada de aplicação (Camada 7) e entende os protocolos HTTP/HTTPS, analisando conteúdo de requisições, cabeçalhos, cookies e payloads para detectar ataques específicos de aplicações. Enquanto firewalls de rede protegem a infraestrutura, WAFs protegem especificamente aplicações web contra ameaças como injeção SQL, XSS e exploits zero-day que firewalls tradicionais não conseguem detectar.'
  },
  {
    value: 'implantacao',
    question: 'Quanto tempo leva para implantar um WAF?',
    answer:
      'O Azion WAF pode ser implantado em menos de 30 minutos sem provisionamento de hardware ou configuração complexa necessária. Simplesmente configure seu DNS para apontar para a rede da Azion, ative a proteção WAF no console e selecione suas regras de segurança. Comece no Modo de Aprendizagem para observar padrões de tráfego, ajuste os níveis de sensibilidade para eliminar falsos positivos e depois mude para o Modo de Bloqueio. Ao contrário de soluções WAF tradicionais que levam semanas ou meses para implementar, o Azion WAF fornece proteção imediata com configuração mínima.'
  },
  {
    value: 'owasp',
    question: 'O Azion WAF protege contra vulnerabilidades OWASP Top 10?',
    answer:
      'Sim, o Azion WAF fornece proteção abrangente contra todas as ameaças OWASP Top 10 incluindo injeção SQL, cross-site scripting (XSS), autenticação quebrada, exposição de dados sensíveis, entidades externas XML (XXE), controle de acesso quebrado, configurações de segurança incorretas, cross-site request forgery (CSRF), desserialização insegura e componentes com vulnerabilidades conhecidas. Nossos conjuntos de regras são continuamente atualizados com a mais recente inteligência de ameaças e assinaturas de vulnerabilidades zero-day para proteger contra ataques emergentes.'
  },
  {
    value: 'tipos-de-ataque',
    question: 'Que tipos de ataques um web application firewall pode prevenir?',
    answer:
      'O Azion WAF combinado com regras do Azion Firewall previne uma ampla gama de ataques incluindo injeção SQL, cross-site scripting (XSS), entidades externas XML (XXE), inclusão remota de arquivos (RFI), inclusão local de arquivos (LFI), injeção de comandos, path traversal, cross-site request forgery (CSRF), server-side request forgery (SSRF), redirecionamentos inseguros e exploits zero-day. Para APIs, o Azion WAF defende contra ataques de injeção, autorização quebrada em nível de objeto (BOLA), exposição excessiva de dados em requisições, falta de limitação de taxa, autorização quebrada em nível de função (BFLA), consumo ilimitado de recursos e server-side request forgery (SSRF). Também protege contra ataques de bots, credential stuffing, abuso de API e ataques DDoS de camada de aplicação. Nossos algoritmos inteligentes de pontuação de risco detectam tanto assinaturas de ataques conhecidas quanto padrões de comportamento anômalos para proteger aplicações modernas e legadas.'
  },
  {
    value: 'custo',
    question: 'Quanto custa um web application firewall?',
    answer:
      'O Azion WAF usa preços transparentes baseados em uso onde você paga apenas pelas requisições analisadas pelo WAF. Comece com $300 em créditos gratuitos para testar o serviço sem cartão de crédito necessário. Os preços escalam com seu volume de tráfego, sem taxas ocultas, custos de infraestrutura ou dependência de fornecedor. Nossa arquitetura de edge computing distribuída elimina a necessidade de infraestrutura em nuvem centralizada, reduzindo custos e latência. Planos empresariais incluem desenvolvimento de regras personalizadas, suporte dedicado e descontos por volume. A maioria dos clientes economiza 40-60% em comparação com soluções WAF empresariais tradicionais enquanto eliminam completamente os custos de gerenciamento de infraestrutura.'
  },
  {
    value: 'cdn-ou-balanceador',
    question: 'Preciso de um WAF se já tenho um CDN ou balanceador de carga?',
    answer:
      'Sim, CDNs e balanceadores de carga não fornecem segurança de camada de aplicação contra ataques web. Enquanto CDNs otimizam a entrega de conteúdo e balanceadores de carga distribuem o tráfego, eles não podem detectar ou bloquear injeção SQL, XSS ou outras ameaças OWASP Top 10. O Azion WAF se integra diretamente com nossa plataforma CDN e edge computing, fornecendo segurança abrangente sem adicionar latência. Você obtém tanto otimização de desempenho quanto proteção de nível empresarial em uma única plataforma, com eventos de segurança analisados antes que as requisições cheguem aos seus servidores de origem.'
  }
]

export default {
  lang: 'pt-BR',
  source: 'https://www.azion.com/pt-br/lp/teste-web-application-firewall/',
  sections: [
    {
      section: 'Heroes',
      kind: 'copy-beside-art',
      eyebrow: 'PROTEGER',
      title: 'Web Application Firewall',
      description:
        'Proteção de nível empresarial contra ataques OWASP Top 10, ameaças zero-day e vulnerabilidades emergentes.',
      actions: [
        { label: 'COMECE GRÁTIS', href: SIGNUP, kind: 'secondary', external: true },
        { label: 'DOCS', href: WAF_DOCS, kind: 'outlined', external: true }
      ],
      art: { name: 'implement-api-gateway-security', alt: 'Web Application Firewall' }
    },
    {
      section: 'StatsBand',
      items: [
        { value: '100', suffix: '%', label: 'Mitigação baseada em OWASP Top 10' },
        { value: '99.9', suffix: '%', label: 'precisão na detecção de ataques' },
        { value: '30', suffix: '%', label: 'redução média de custos comparado a outros' }
      ]
    },
    {
      section: 'CapabilityGrid',
      title: 'DDoS integrado, sem configuração adicional',
      description: 'Alta resiliência para lidar com ataques massivos.',
      items: [
        {
          icon: 'pi pi-lock',
          title: 'Bloqueie ataques antes que cheguem à sua infraestrutura',
          description:
            'Bloqueie requisições maliciosas com detecção global de ameaças e inteligência em tempo real. Proteja-se contra injeção SQL, XSS, RFI e exploits zero-day.'
        },
        {
          icon: 'pi pi-dollar',
          title: 'Reduza significativamente seus custos',
          description:
            'Preços baseados em uso sem taxas ocultas, custos de infraestrutura nem dependência de fornecedor.'
        },
        {
          icon: 'pi pi-clock',
          title: 'Implemente em minutos, não em meses',
          description:
            'Implantação imediata sem hardware para provisionar, configuração complexa nem manutenção.'
        },
        {
          icon: 'pi pi-chart-line',
          title: 'Escale automaticamente conforme o tráfego',
          description:
            'Arquitetura global distribuída escala automaticamente sem mudanças de configuração.'
        },
        {
          icon: 'pi pi-sliders-h',
          title: 'Otimize a proteção sem impactar a produção',
          description:
            'Alterne entre modos de Aprendizagem e Bloqueio. Defina sensibilidade em cinco camadas e crie exceções personalizadas.'
        },
        {
          icon: 'pi pi-chart-line',
          title: 'Visibilidade em tempo real',
          description:
            'Transmita eventos de segurança para SIEMs e plataformas de analytics com inteligência de ameaças e pontuação de risco.'
        }
      ]
    },
    {
      section: 'MediaSplitBand',
      title:
        'Azion é reconhecida como High Performer na categoria Web Application Firewall nos Relatórios de Inverno 2026 do G2.',
      description:
        'Avaliado com 4.5/5 estrelas por profissionais de segurança em todo o mundo pela facilidade de uso, desempenho e suporte ao cliente.',
      image: { src: g2, alt: 'G2', width: 160, height: 160 },
      actions: [external('Ver mais', 'https://www.g2.com/products/azion/reviews#reviews')]
    },
    {
      section: 'MediaSplitStack',
      title: 'Segurança sem complexidade',
      description: 'Fácil de usar, com suporte de classe mundial.',
      bands: [
        {
          title: 'Proteção pronta para uso com regras personalizáveis',
          description:
            'Ative regras predefinidas para ataques comuns e ajuste a proteção em cinco níveis de sensibilidade. Execute múltiplos perfis de WAF por aplicação para ajustar precisamente o que é bloqueado.',
          illustration: 'enable-owasp-protection-with-customizable-rules',
          illustrationLabel: 'Ajuste do limite de sensibilidade por tipo de ameaça.',
          actions: [external('Docs', WAF_DOCS)]
        },
        {
          title: 'Detecte ataques mais rápido do que nunca',
          description:
            'Quase 99% de todos os eventos e logs estão disponíveis em menos de 40 segundos em qualquer interface: APIs, GraphQL, dashboards e seu SIEM usando Data Stream. Nossa rede distribuída proprietária escala automaticamente e oferece visibilidade em tempo real para sua equipe de segurança. Isso é exatamente o que fornecemos.',
          illustration: 'stream-security-events-for-investigation-and-response',
          illustrationLabel: 'Integrações de terceiros com visibilidade em tempo real.'
        },
        {
          title: 'Analise ameaças com pontuação inteligente de risco',
          description:
            'Inspecione tráfego HTTP, HTTPS com algoritmos que pontuam cada requisição com base em padrões de comportamento e assinaturas de ameaças. Detecte vulnerabilidades zero-day e ataques OWASP Top 10 com precisão. Use o Modo de Aprendizagem para ajustar regras e eliminar falsos positivos antes de implantar em produção.',
          illustration: 'programmable-security',
          illustrationLabel: 'Análise de ameaças programável com regras condicionais.',
          actions: [
            external('Aprenda Como', `${DOCS}produtos/guias/como-verificar-modo-do-seu-waf/`)
          ]
        },
        {
          title: 'Bloqueie ameaças com visibilidade em tempo real',
          description:
            'Bloqueie ameaças instantaneamente em localizações globais distribuídas antes que requisições maliciosas cheguem aos seus servidores de origem. Crie Custom Allowed Rules para incluir liberações de padrões de tráfego legítimos. Transmita eventos de segurança em tempo real via Data Stream para seu SIEM, Splunk, Datadog ou plataformas de análise personalizadas para maior visibilidade e resposta automática a incidentes.',
          illustration: 'custom-allowed-rules',
          illustrationLabel: 'Integrações de terceiros com visibilidade em tempo real.',
          actions: [external('Comece Grátis', SIGNUP)]
        }
      ]
    },
    {
      section: 'ResourceGrid',
      eyebrow: '',
      title: 'Proteja aplicações modernas, tradicionais e híbridas',
      actions: [],
      items: [
        {
          title: 'E-commerce e plataformas de pagamento',
          description:
            'Proteja dados de clientes e transações de pagamento contra injeção SQL, XSS e ataques de skimming de cartões. Atenda aos requisitos de compliance PCI-DSS com proteção WAF de nível empresarial e registro de auditoria detalhado.',
          href: '/site/solutions/retail'
        },
        {
          title: 'API gateways e microsserviços',
          description:
            'Proteja APIs REST e GraphQL contra ataques de injeção, autenticação quebrada e exposição excessiva de dados. Aplique limitação de taxa e regras personalizadas para proteger serviços backend e prevenir abuso de API.',
          href: `${DOCS}casos-de-uso/proteger-aplicacoes-e-redes/proteger-apis-publicas-contra-abuso/`
        },
        {
          title: 'Serviços financeiros e aplicações bancárias',
          description:
            'Defenda-se contra ataques sofisticados direcionados a dados financeiros com detecção avançada de ameaças e bloqueio em tempo real. Mantenha a conformidade com regulamentações do setor enquanto protege informações sensíveis de clientes.',
          href: '/site/solutions/financial-services'
        },
        {
          title: 'Plataformas SaaS e aplicações web',
          description:
            'Proteja aplicações SaaS multi-tenant contra ameaças OWASP Top 10 sem impactar o desempenho. Escale a segurança automaticamente conforme sua base de usuários cresce com proteção global distribuída.',
          href: `${DOCS}casos-de-uso/construir-e-executar-aplicacoes/modernizar-uma-aplicacao-monolitica-sem-reescreve-la/`
        }
      ]
    },
    { section: 'FaqSection', title: 'Perguntas Frequentes', items: FAQ },
    {
      section: 'ClosingCallToAction',
      kind: 'panel',
      title: 'Construa suas aplicações de forma inteligente',
      description: 'Acesse todos os produtos agora.',
      actions: [{ label: 'Comece Grátis', href: SIGNUP, kind: 'secondary', external: true }]
    }
  ]
} satisfies LandingPage
