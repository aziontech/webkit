import herospark from '@aziontech/webkit/assets/herospark-extended-color.svg'
import magalu from '@aziontech/webkit/assets/magalu-extended-color.svg'
import zoop from '@aziontech/webkit/assets/zoop-extended-color.svg'
import type { QuoteTabsItem } from '@aziontech/webkit/quote-tabs'

export type SupportLevel = 'full' | 'partial' | 'none'

export interface AlternativeGuide {
  rival: string
  hero: { eyebrow: string; title: string; description: string; art: string }
  why: { eyebrow: string; title: string }
  reasons: { icon: string; title: string; description: string }[]
  quotes: QuoteTabsItem[]
  comparison: { eyebrow: string; title: string }
  capabilities: {
    title: string
    rows: {
      capability: string
      definition?: string
      azion: SupportLevel
      competitor: SupportLevel
    }[]
  }[]
  mapping: { title: string; description: string }
  faq: { value: string; question: string; answer: string }[]
}

export const TRUST_MARKS = [
  'global-fashion-group',
  'herospark',
  'itau',
  'renner',
  'madeiramadeira',
  'magalu',
  'nzn',
  'netshoes',
  'caixa',
  'fourbank',
  'agibank',
  'prime-video',
  'america-movil',
  'axur',
  'contabilizei',
  'dafiti',
  'exame',
  'gpa'
]

const CLIENT_QUOTES = {
  magalu: {
    logo: magalu,
    clientName: 'Magalu',
    text: 'A Azion nos protegeu de ciberataques sofisticados e nos possibilitou modernizar nossa infraestrutura, reduzir custos e disponibilizar as melhores experiências de compra a milhões de clientes em toda a América Latina.',
    name: 'Allan Monteiro',
    jobTitle: 'CISO e Head de Tecnologia no Magalu'
  },
  dafiti: {
    mark: 'dafiti',
    clientName: 'Dafiti',
    text: 'Uma das melhores soluções de CDN e WAF que já usei. Fácil de implementar e integrar, com velocidade e baixa latência que fazem real diferença para nossos clientes.',
    name: 'Julian H',
    jobTitle: 'Gerente de IT OPS, SRE & SEC na Dafiti'
  },
  contabilizei: {
    mark: 'contabilizei',
    text: 'Eu gosto muito da profundidade das regras de cache que posso aplicar no edge. Existem coisas que não conseguiríamos fazer usando soluções de outros fornecedores. Em termos de performance, conformidade com as regras e padrões de entrega da Contabilizei, estamos muito satisfeitos com o desempenho da Azion.',
    name: 'Marcelo Pacheco',
    jobTitle: 'Especialista DevOps na Contabilizei'
  },
  axur: {
    mark: 'axur',
    text: 'Com a Azion, escalamos modelos proprietários de AI sem gerenciar infraestrutura, inspecionando milhões de sites por dia e automatizando o takedown de ameaças mais rápido do mercado.',
    name: 'Fabio Ramos',
    jobTitle: 'CEO da Axur'
  },
  herospark: {
    logo: herospark,
    clientName: 'HeroSpark',
    text: 'A Azion transformou nossas operações, reduzindo custos e melhorando a performance, além de liberar mais de 200 horas por mês para o desenvolvimento estratégico.',
    name: 'Mateus Leonardi',
    jobTitle: 'CTO da HeroSpark'
  },
  zoop: {
    logo: zoop,
    clientName: 'Zoop',
    text: 'A Azion entregou a proteção avançada e a performance superior de que precisávamos, com implementação rápida e resultados imediatos.',
    name: 'Ismael Aguilar',
    jobTitle: 'Gerente de Segurança da Informação na Zoop'
  }
} satisfies Record<string, QuoteTabsItem>

const quotesLedBy = (lead: keyof typeof CLIENT_QUOTES): QuoteTabsItem[] => [
  CLIENT_QUOTES[lead],
  ...Object.entries(CLIENT_QUOTES)
    .filter(([key]) => key !== lead)
    .map(([, quote]) => quote)
]

export const AKAMAI_GUIDE: AlternativeGuide = {
  rival: 'Akamai',
  hero: {
    eyebrow: 'Guia de alternativas',
    title: 'Alternativa à Akamai: guia para mudar para a Azion',
    description:
      'Veja onde cada produto da Akamai se encaixa na Azion: Ion, Cloudlets, EdgeWorkers, EdgeKV, Edge DNS e proteções WAAP como Akamai WAF, API Security e Bot Manager. Depois, mova uma property por vez enquanto a Akamai segue servindo produção.',
    art: 'azion-to-akamai'
  },
  why: {
    eyebrow: 'Por que a Azion',
    title: 'Por que times trocam a Akamai para a Azion'
  },
  reasons: [
    {
      icon: 'pi pi-bolt',
      title: 'Pule a espera pela ativação da property',
      description:
        'Uma mudança de entrega ou segurança na Akamai exige nova versão de property e espera pela ativação. Na Azion você edita a regra no Rules Engine e ela propaga por mais de 100 data centers em segundos. Um ajuste de cache vai ao ar no momento em que você salva.'
    },
    {
      icon: 'pi pi-shield',
      title: 'WAAP em um contrato só',
      description:
        'App & API Protector, Bot Manager e Prolexic têm termos e faturas separados. Na Azion você usa Web Application Firewall, Bot Manager, DDoS Protection e Network Shield em um contrato, com um conjunto de regras e um stream de logs.'
    },
    {
      icon: 'pi pi-code',
      title: 'Reescreva a lógica dos Cloudlets como código seu',
      description:
        'O comportamento dos Cloudlets vive dentro do modelo da Akamai e em nenhum outro lugar. Reconstrua no Rules Engine e leve EdgeWorkers e Akamai Functions para Functions, onde seu JavaScript e WebAssembly rodam perto dos usuários, sem cold start.'
    },
    {
      icon: 'pi pi-dollar',
      title: 'Leia o preço antes de falar com o comercial',
      description:
        'Preços públicos de pagamento por uso, sem contrato mínimo e sem professional services obrigatório. Comece com US$ 300 em créditos e rode uma carga real antes de assinar qualquer coisa.'
    },
    {
      icon: 'pi pi-comments',
      title: 'Fale com um engenheiro em minutos',
      description:
        'Abra um ticket, mande um e-mail ou entre em uma call. O compromisso de primeira resposta começa em 15 minutos, em português, espanhol ou inglês, e um Security Response Team entra com você enquanto o ataque acontece.'
    },
    {
      icon: 'pi pi-sync',
      title: 'Rode as duas plataformas em paralelo',
      description:
        'Mova uma property por vez. Valide entrega, regras, políticas de segurança e observabilidade na Azion enquanto a Akamai ainda serve produção, e então vire o DNS com o rollback escrito.'
    }
  ],
  quotes: quotesLedBy('magalu'),
  comparison: {
    eyebrow: 'Comparação',
    title: 'Como a Azion se compara com a Akamai'
  },
  capabilities: [
    {
      title: 'Plataforma',
      rows: [
        {
          capability: 'Entrega, computação, storage e segurança em uma plataforma',
          definition:
            'Entrega, computação, armazenamento e segurança rodam em uma plataforma, com um único modelo de configuração.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Um único console para todos os fluxos de trabalho',
          definition:
            'Configurar, publicar e monitorar todos os produtos a partir da mesma interface.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Mudanças de configuração e regras no ar em segundos',
          definition: 'Quanto tempo uma alteração leva para valer em todas as localidades da rede.',
          azion: 'full',
          competitor: 'partial'
        }
      ]
    },
    {
      title: 'Computação',
      rows: [
        {
          capability: 'Runtime JavaScript e WebAssembly',
          definition: 'Executar código de aplicação perto dos usuários com APIs padrão da web.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Execução de funções sem cold start',
          definition: 'Funções que respondem à primeira requisição sem atraso de inicialização.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Inferência de AI na plataforma',
          definition: 'Executar modelos de AI na rede do provedor, perto dos usuários.',
          azion: 'full',
          competitor: 'full'
        }
      ]
    },
    {
      title: 'Armazenamento',
      rows: [
        {
          capability: 'Armazenamento chave-valor distribuído',
          definition:
            'Leituras de baixa latência para configurações, flags e sessões replicadas perto dos usuários.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Object storage compatível com S3',
          definition:
            'Armazenamento de arquivos e objetos acessível pelas APIs e ferramentas do S3.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Banco de dados SQL distribuído com busca vetorial',
          definition:
            'Um banco relacional replicado perto dos usuários, com busca por similaridade para aplicações de AI.',
          azion: 'full',
          competitor: 'none'
        }
      ]
    },
    {
      title: 'Segurança',
      rows: [
        {
          capability: 'WAF gerenciado para aplicações e APIs',
          definition: 'Regras gerenciadas que bloqueiam ataques a aplicações e APIs.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Descoberta e proteção de APIs',
          definition: 'Encontrar as APIs expostas e aplicar regras de segurança a cada uma.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Gerenciamento de bots',
          definition: 'Detectar e bloquear tráfego automatizado antes que ele chegue à aplicação.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Proteção DDoS inclusa na entrega',
          definition:
            'Absorver ataques volumétricos e de aplicação sem contratar um produto à parte.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Firewall de rede',
          definition: 'Filtrar tráfego por IP, rede e localização antes da camada de aplicação.',
          azion: 'full',
          competitor: 'full'
        }
      ]
    },
    {
      title: 'Entrega e rede',
      rows: [
        {
          capability: 'Cache em camadas e alívio de origem',
          definition:
            'Camadas intermediárias de cache que reduzem as requisições que chegam à origem.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Otimização de imagem e vídeo',
          definition:
            'Redimensionar, comprimir e converter mídia na entrega, sem processar na origem.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'DNS autoritativo e balanceamento de carga',
          definition:
            'Responder pelos registros DNS dos seus domínios e distribuir o tráfego entre origens saudáveis.',
          azion: 'full',
          competitor: 'full'
        }
      ]
    },
    {
      title: 'Observabilidade',
      rows: [
        {
          capability: 'Métricas em tempo real e busca de eventos',
          definition:
            'Painéis ao vivo de tráfego, desempenho e segurança, com consulta aos eventos de cada requisição.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Streaming de logs e monitoramento de usuário real',
          definition:
            'Enviar logs em tempo real para outras ferramentas e medir o desempenho percebido no navegador.',
          azion: 'full',
          competitor: 'full'
        }
      ]
    },
    {
      title: 'Comercial',
      rows: [
        {
          capability: 'Preço por uso publicado',
          definition: 'Preço por unidade publicado, para saber antes quanto um mês vai custar.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Começar sem professional services obrigatório',
          definition:
            'Contratar e entrar em produção sem um projeto obrigatório de serviços profissionais.',
          azion: 'full',
          competitor: 'partial'
        }
      ]
    }
  ],
  mapping: {
    title: 'Mapeie os serviços da Akamai para a Azion',
    description:
      'Propriedades de entrega da Akamai mapeiam para Applications, Application Accelerator e Cache. Cloudlets mapeiam para Rules Engine, Applications, Load Balancer e Firewall. EdgeWorkers e Akamai Functions mapeiam para Functions, EdgeKV para KV Store, DataStream para Data Stream, e DNS e tráfego mapeiam para Edge DNS e Load Balancer. As proteções WAAP da Akamai, incluindo WAF, API Security e anti-bot, mapeiam para Azion WAF, Firewall e Bot Manager.'
  },
  faq: [
    {
      value: 'a-azion-e-uma-boa-alternativa',
      question: 'A Azion é uma boa alternativa à Akamai?',
      answer:
        'Sim. A Azion é uma alternativa à Akamai: substitui a segurança WAAP da Akamai (WAF, API Security e anti-bot), a entrega, a computação e o object storage por uma plataforma só. Preços transparentes de pagamento por uso e $300 em créditos gratuitos ajudam a avaliar a troca.'
    },
    {
      value: 'como-os-servicos-de-entrega-da',
      question: 'Como os serviços de entrega da Akamai mapeiam para a Azion?',
      answer:
        'Akamai Ion mapeia para Applications, Application Accelerator e Cache da Azion. API Acceleration mapeia para Application Accelerator e Cache, enquanto Adaptive Media Delivery, Download Delivery, Dedicated Delivery e Cloud Wrapper mapeiam para Applications, Cache, Object Storage e Tiered Cache.'
    },
    {
      value: 'o-que-substitui-akamai-cloudlets',
      question: 'O que substitui Akamai Cloudlets?',
      answer:
        'Akamai Cloudlets mapeiam para Rules Engine, Applications, Load Balancer e Firewall da Azion. Redirecionamentos, controle de tráfego, releases em fases, tratamento de URLs, controle de acesso e segmentação podem ser recriados com regras de aplicação e segurança da Azion.'
    },
    {
      value: 'como-edgeworkers-e-akamai-functions-mapeiam',
      question: 'Como EdgeWorkers e Akamai Functions mapeiam para a Azion?',
      answer:
        'EdgeWorkers e Akamai Functions mapeiam para Azion Functions. Revise lógica de roteamento, headers, acesso a dados e dependências externas de cada função, depois valide o comportamento em paralelo antes de transferir tráfego de produção.'
    },
    {
      value: 'como-os-produtos-de-storage-da',
      question: 'Como os produtos de storage da Akamai mapeiam para a Azion?',
      answer:
        'EdgeKV mapeia para Azion KV Store. NetStorage e Akamai Object Storage mapeiam para Azion Object Storage, enquanto dependências de MySQL ou PostgreSQL gerenciados podem mapear para SQL Database quando o workload exige dados relacionais.'
    },
    {
      value: 'como-os-produtos-de-seguranca-da',
      question: 'Como os produtos de segurança da Akamai mapeiam para a Azion?',
      answer:
        'Os produtos WAAP da Akamai mapeiam para equivalentes da Azion. App and API Protector (Akamai WAF) mapeia para Firewall, Web Application Firewall, DDoS Protection e Bot Manager. A proteção anti-bot do Akamai Bot Manager mapeia para o Azion Bot Manager, Prolexic para DDoS Protection e Network Shield, e Akamai API Security para Firewall, WAF e Applications.'
    },
    {
      value: 'comparando-akamai-vs-cloudflare-por-que',
      question: 'Comparando Akamai vs Cloudflare, por que considerar a Azion?',
      answer:
        'Equipes que avaliam Akamai vs Cloudflare costumam incluir também a Azion na lista, porque ela unifica entrega, funções, storage, WAF, API security, anti-bot e proteção DDoS em uma única plataforma com preços transparentes. Há guias técnicos disponíveis tanto para workloads da Akamai quanto da Cloudflare.'
    },
    {
      value: 'como-dns-e-direcionamento-de-trafego',
      question: 'Como DNS e direcionamento de tráfego mapeiam para a Azion?',
      answer:
        'Akamai Edge DNS, DNS Manager, DNS Infrastructure, Global Traffic Management, NodeBalancers e Cloudlets de balanceamento mapeiam para Edge DNS e Load Balancer da Azion, com regras em Applications e Rules Engine quando necessário.'
    },
    {
      value: 'o-que-substitui-as-ferramentas-de',
      question: 'O que substitui as ferramentas de observabilidade da Akamai?',
      answer:
        'Akamai TrafficPeak mapeia para Real-Time Metrics, Real-Time Events e Data Stream. DataStream mapeia para Data Stream, enquanto mPulse mapeia para Edge Pulse e Real-Time Metrics para visibilidade de experiência e performance.'
    },
    {
      value: 'posso-rodar-akamai-e-azion-em',
      question: 'Posso rodar Akamai e Azion em paralelo?',
      answer:
        'Sim. Você pode operar as duas plataformas em paralelo, validar entrega, DNS, funções, storage, políticas de segurança e observabilidade, e fazer o cutover dos domínios gradualmente com etapas de rollback documentadas.'
    }
  ]
}

export const FASTLY_GUIDE: AlternativeGuide = {
  rival: 'Fastly',
  hero: {
    eyebrow: 'Guia de alternativas',
    title: 'Alternativa à Fastly: guia para mudar para a Azion',
    description:
      'Troque VCL pelo Rules Engine e leve entrega, Compute, Next-Gen WAF (NGWAF), proteção DDoS, TLS e logs da Fastly para a Azion. Reconstrua um serviço por vez e faça o cutover enquanto a Fastly segue servindo produção.',
    art: 'azion-to-fastly'
  },
  why: {
    eyebrow: 'Por que a Azion',
    title: 'Por que times trocam a Fastly para a Azion'
  },
  reasons: [
    {
      icon: 'pi pi-code',
      title: 'Lógica de entrega sem VCL',
      description:
        'VCL é um dialeto que o time precisa aprender e manter alguém dedicado. O Rules Engine resolve redirects, chaves de cache, headers e escolha de origem pelo console ou pela API, e suas mudanças propagam em segundos.'
    },
    {
      icon: 'pi pi-bolt',
      title: 'Computação na plataforma que serve seu tráfego',
      description:
        'O código de Compute compilado para WebAssembly mapeia para Functions, que divide a plataforma com cache e entrega. Seu JavaScript e WebAssembly rodam sem cold start, e você administra um serviço.'
    },
    {
      icon: 'pi pi-shield',
      title: 'Uma stack de segurança, um contrato',
      description:
        'O Next-Gen WAF chegou por aquisição e continua como produto próprio, com console próprio. Na Azion, Web Application Firewall, Bot Manager, DDoS Protection e Firewall dividem um conjunto de regras, um stream de logs e um contrato.'
    },
    {
      icon: 'pi pi-sitemap',
      title: 'Menos fornecedores no caminho da requisição',
      description:
        'A Fastly não entrega DNS autoritativo, SQL database nem monitoramento de usuário real, então você segue pagando outro fornecedor por cada um. Edge DNS, SQL Database e Edge Pulse já vêm na plataforma.'
    },
    {
      icon: 'pi pi-dollar',
      title: 'Custo total de propriedade menor',
      description:
        'Preços públicos de pagamento por uso para entrega, computação, storage e segurança, sem compromisso mínimo e sem cobrança de egress entre serviços Azion.'
    },
    {
      icon: 'pi pi-sync',
      title: 'Faça o cutover serviço a serviço',
      description:
        'Mantenha a Fastly servindo produção enquanto reconstrói um serviço na Azion. Valide certificados, comportamento de cache, logs e regras de WAF, e mova os domínios no seu ritmo.'
    }
  ],
  quotes: quotesLedBy('contabilizei'),
  comparison: {
    eyebrow: 'Comparação',
    title: 'Como a Azion se compara com a Fastly'
  },
  capabilities: [
    {
      title: 'Plataforma',
      rows: [
        {
          capability: 'Entrega, computação, storage e segurança em uma plataforma',
          definition:
            'Entrega, computação, armazenamento e segurança rodam em uma plataforma, com um único modelo de configuração.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Um único console para todos os fluxos de trabalho',
          definition:
            'Configurar, publicar e monitorar todos os produtos a partir da mesma interface.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Mudanças de configuração e regras no ar em segundos',
          definition: 'Quanto tempo uma alteração leva para valer em todas as localidades da rede.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Regras de entrega configuráveis sem escrever VCL',
          definition:
            'Definir cache, roteamento e cabeçalhos por regras, sem programar em Varnish Configuration Language.',
          azion: 'full',
          competitor: 'partial'
        }
      ]
    },
    {
      title: 'Computação',
      rows: [
        {
          capability: 'Runtime JavaScript e WebAssembly',
          definition: 'Executar código de aplicação perto dos usuários com APIs padrão da web.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Execução de funções sem cold start',
          definition: 'Funções que respondem à primeira requisição sem atraso de inicialização.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Inferência de AI na plataforma',
          definition: 'Executar modelos de AI na rede do provedor, perto dos usuários.',
          azion: 'full',
          competitor: 'partial'
        }
      ]
    },
    {
      title: 'Armazenamento',
      rows: [
        {
          capability: 'Armazenamento chave-valor distribuído',
          definition:
            'Leituras de baixa latência para configurações, flags e sessões replicadas perto dos usuários.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Object storage compatível com S3',
          definition:
            'Armazenamento de arquivos e objetos acessível pelas APIs e ferramentas do S3.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Banco de dados SQL distribuído com busca vetorial',
          definition:
            'Um banco relacional replicado perto dos usuários, com busca por similaridade para aplicações de AI.',
          azion: 'full',
          competitor: 'none'
        }
      ]
    },
    {
      title: 'Segurança',
      rows: [
        {
          capability: 'WAF gerenciado para aplicações e APIs',
          definition: 'Regras gerenciadas que bloqueiam ataques a aplicações e APIs.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Descoberta e proteção de APIs',
          definition: 'Encontrar as APIs expostas e aplicar regras de segurança a cada uma.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Gerenciamento de bots',
          definition: 'Detectar e bloquear tráfego automatizado antes que ele chegue à aplicação.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Proteção DDoS inclusa na entrega',
          definition:
            'Absorver ataques volumétricos e de aplicação sem contratar um produto à parte.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Firewall de rede',
          definition: 'Filtrar tráfego por IP, rede e localização antes da camada de aplicação.',
          azion: 'full',
          competitor: 'partial'
        }
      ]
    },
    {
      title: 'Entrega e rede',
      rows: [
        {
          capability: 'Cache em camadas e alívio de origem',
          definition:
            'Camadas intermediárias de cache que reduzem as requisições que chegam à origem.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Otimização de imagem e vídeo',
          definition:
            'Redimensionar, comprimir e converter mídia na entrega, sem processar na origem.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'DNS autoritativo',
          definition: 'Hospedar e responder pelos registros DNS dos seus domínios.',
          azion: 'full',
          competitor: 'none'
        },
        {
          capability: 'Balanceamento de carga entre origens multi-cloud',
          definition:
            'Distribuir o tráfego entre origens em diferentes provedores de nuvem ou on-premises.',
          azion: 'full',
          competitor: 'partial'
        }
      ]
    },
    {
      title: 'Observabilidade',
      rows: [
        {
          capability: 'Métricas em tempo real e busca de eventos',
          definition:
            'Painéis ao vivo de tráfego, desempenho e segurança, com consulta aos eventos de cada requisição.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Streaming de logs para ferramentas de terceiros',
          definition: 'Enviar logs em tempo real para o seu SIEM ou data lake.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Monitoramento de usuário real',
          definition: 'Medir o desempenho que os usuários percebem no navegador.',
          azion: 'full',
          competitor: 'none'
        }
      ]
    },
    {
      title: 'Comercial',
      rows: [
        {
          capability: 'Preço por uso publicado',
          definition: 'Preço por unidade publicado, para saber antes quanto um mês vai custar.',
          azion: 'full',
          competitor: 'full'
        }
      ]
    }
  ],
  mapping: {
    title: 'Troque por equivalência de serviços',
    description:
      'Os principais recursos da Fastly têm equivalentes diretos na Azion. Full-Site Delivery mapeia para Applications, Compute para Functions, Edge Data Storage para KV Store, High Volume Logging para Data Stream, Log Explorer & Insights para Real-Time Events e Platform TLS, TLS Service Options e Certainly para Certificate Manager.'
  },
  faq: [
    {
      value: 'a-azion-e-uma-boa-alternativa',
      question: 'A Azion é uma boa alternativa à Fastly?',
      answer:
        'Sim. A Azion é uma alternativa à Fastly, e combina entrega CDN, computação, storage, WAF, gerenciamento de bots e proteção DDoS em uma plataforma só. Caminhos compatíveis para Compute, Edge Data Storage e Next-Gen WAF facilitam a transição, com $300 em créditos gratuitos para validar.'
    },
    {
      value: 'como-o-full-site-delivery-da',
      question: 'Como o Full-Site Delivery da Fastly mapeia para a Azion?',
      answer:
        'Full-Site Delivery mapeia para Azion Applications. Origens, regras de roteamento, políticas de cache, cabeçalhos e comportamentos de entrega podem ser configurados na plataforma web da Azion para manter a lógica de entrega existente.'
    },
    {
      value: 'qual-e-o-equivalente-do-fastly',
      question: 'Qual é o equivalente do Fastly Compute?',
      answer:
        'Fastly Compute mapeia para Azion Functions. As Functions executam lógica na infraestrutura distribuída da Azion com escala sem cold starts, usando padrões web modernos para adaptar código distribuído.'
    },
    {
      value: 'como-os-dados-da-edge-data',
      question: 'Como os dados da Edge Data Storage mapeiam para a Azion?',
      answer:
        'Edge Data Storage mapeia para Azion KV Store. O KV Store atende casos de uso de dados key-value distribuídos, como configuração dinâmica, flags, sessões leves e dados consultados por Functions.'
    },
    {
      value: 'como-ficam-cache-tiering-e-otimizacao',
      question: 'Como ficam cache, tiering e otimização de mídia?',
      answer:
        'Cache Reservation, Cache APIs e Media Shield podem ser traduzidos para recursos de Cache e Tiered Cache da Azion. Image Optimizer mapeia para Image Processor para transformação e otimização de imagens.'
    },
    {
      value: 'como-tls-e-certificados-mapeiam-para',
      question: 'Como TLS e certificados mapeiam para a Azion?',
      answer:
        'Platform TLS, TLS Service Options e Certainly mapeiam para Certificate Manager. Você pode automatizar certificados, associá-los às suas aplicações e validar a configuração antes do corte de DNS.'
    },
    {
      value: 'o-que-substitui-high-volume-logging',
      question: 'O que substitui High Volume Logging e Log Explorer & Insights?',
      answer:
        'High Volume Logging mapeia para Data Stream, permitindo enviar logs para destinos externos. Log Explorer & Insights mapeia para Real-Time Events, enquanto Domain Inspector e Origin Inspector se relacionam a Real-Time Metrics.'
    },
    {
      value: 'como-regras-de-waf-bots-e',
      question: 'Como regras de WAF, bots e rate limiting mapeiam para a Azion?',
      answer:
        'Fastly Next-Gen WAF (NGWAF) mapeia para Azion Web Application Firewall, Bot Management mapeia para Bot Manager, Edge Rate Limiting pode ser implementado com Firewall e a proteção DDoS da Fastly tem equivalente na proteção DDoS da Azion.'
    },
    {
      value: 'comparando-fastly-vs-cloudflare-por-que',
      question: 'Comparando Fastly vs Cloudflare, por que considerar a Azion?',
      answer:
        'Equipes que avaliam Fastly vs Cloudflare costumam incluir também a Azion na lista, porque ela combina performance de CDN, funções programáveis sem cold starts, WAF e proteção DDoS integrados, e preços de pagamento por uso transparentes em uma única plataforma. Há guias técnicos disponíveis tanto para workloads da Fastly quanto da Cloudflare.'
    },
    {
      value: 'posso-rodar-fastly-e-azion-em',
      question: 'Posso rodar Fastly e Azion em paralelo?',
      answer:
        'Sim. Você pode operar as duas plataformas em paralelo e transferir o tráfego gradualmente por DNS. Essa abordagem permite comparar comportamento, validar cache, TLS, logs e segurança antes do corte definitivo.'
    }
  ]
}

export const AWS_GUIDE: AlternativeGuide = {
  rival: 'AWS',
  hero: {
    eyebrow: 'Guia de alternativas',
    title: 'Alternativa à AWS: guia para mudar para a Azion',
    description:
      'Veja onde cada serviço da AWS se encaixa na Azion: CloudFront, Lambda@Edge, Lambda, S3, DynamoDB, Route 53, AWS WAF e Shield. Implante em uma URL gerada pela Azion, valide a aplicação e só então aponte o Route 53, com o rollback escrito.',
    art: 'azion-to-aws'
  },
  why: {
    eyebrow: 'Por que a Azion',
    title: 'Por que times trocam a AWS para a Azion'
  },
  reasons: [
    {
      icon: 'pi pi-sitemap',
      title: 'Uma plataforma no lugar de uma dezena de serviços',
      description:
        'Na AWS, entrega, funções, storage, WAF, DNS e métricas são serviços separados, cada um com sua configuração e sua linha na fatura. Na Azion, Applications, Functions, Object Storage, Firewall, Edge DNS e Real-Time Metrics vivem em um console e uma API.'
    },
    {
      icon: 'pi pi-bolt',
      title: 'Lógica de requisição sem cold start',
      description:
        'CloudFront Functions e Lambda@Edge mapeiam para Functions, que dividem a plataforma com cache e entrega. Seu JavaScript e WebAssembly rodam perto dos usuários, sem cold start, e você administra um serviço só.'
    },
    {
      icon: 'pi pi-shield',
      title: 'Segurança que vem com a entrega',
      description:
        'AWS WAF, Bot Control e Shield Advanced são contratados e configurados à parte. Na Azion, Web Application Firewall, Bot Manager, DDoS Protection e Network Shield dividem um conjunto de regras, um stream de logs e um contrato.'
    },
    {
      icon: 'pi pi-dollar',
      title: 'Uma fatura que você lê antes do fim do mês',
      description:
        'Preços públicos de pagamento por uso para entrega, computação, storage e segurança, sem cobrança de egress entre serviços Azion. Comece com US$ 300 em créditos e rode uma carga real antes de assinar qualquer coisa.'
    },
    {
      icon: 'pi pi-comments',
      title: 'Fale com um engenheiro em minutos',
      description:
        'Abra um ticket, mande um e-mail ou entre em uma call. O compromisso de primeira resposta começa em 15 minutos, em português, espanhol ou inglês, e um Security Response Team entra com você enquanto o ataque acontece.'
    },
    {
      icon: 'pi pi-sync',
      title: 'Migre uma aplicação por vez',
      description:
        'Implante em uma URL gerada pela Azion e valide roteamento, funções, dados e segurança enquanto a AWS segue servindo produção. Depois atualize o Route 53, acompanhe o tráfego e mantenha o rollback documentado.'
    }
  ],
  quotes: quotesLedBy('herospark'),
  comparison: {
    eyebrow: 'Comparação',
    title: 'Como a Azion se compara com a AWS'
  },
  capabilities: [
    {
      title: 'Plataforma',
      rows: [
        {
          capability: 'Entrega, computação, storage e segurança em uma plataforma',
          definition:
            'Entrega, computação, armazenamento e segurança rodam em uma plataforma, com um único modelo de configuração.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Um único console para todos os fluxos de trabalho',
          definition:
            'Configurar, publicar e monitorar todos os produtos a partir da mesma interface.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Mudanças de configuração e regras no ar em segundos',
          definition: 'Quanto tempo uma alteração leva para valer em todas as localidades da rede.',
          azion: 'full',
          competitor: 'partial'
        }
      ]
    },
    {
      title: 'Computação',
      rows: [
        {
          capability: 'Runtime JavaScript e WebAssembly',
          definition: 'Executar código de aplicação perto dos usuários com APIs padrão da web.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Execução de funções sem cold start',
          definition: 'Funções que respondem à primeira requisição sem atraso de inicialização.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Inferência de AI na plataforma',
          definition: 'Executar modelos de AI na rede do provedor, perto dos usuários.',
          azion: 'full',
          competitor: 'full'
        }
      ]
    },
    {
      title: 'Armazenamento',
      rows: [
        {
          capability: 'Armazenamento chave-valor distribuído',
          definition:
            'Leituras de baixa latência para configurações, flags e sessões replicadas perto dos usuários.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Object storage compatível com S3',
          definition:
            'Armazenamento de arquivos e objetos acessível pelas APIs e ferramentas do S3.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Banco de dados SQL distribuído com busca vetorial',
          definition:
            'Um banco relacional replicado perto dos usuários, com busca por similaridade para aplicações de AI.',
          azion: 'full',
          competitor: 'partial'
        }
      ]
    },
    {
      title: 'Segurança',
      rows: [
        {
          capability: 'WAF gerenciado para aplicações e APIs',
          definition: 'Regras gerenciadas que bloqueiam ataques a aplicações e APIs.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Descoberta e proteção de APIs',
          definition: 'Encontrar as APIs expostas e aplicar regras de segurança a cada uma.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Gerenciamento de bots',
          definition: 'Detectar e bloquear tráfego automatizado antes que ele chegue à aplicação.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Proteção DDoS inclusa na entrega',
          definition:
            'Absorver ataques volumétricos e de aplicação sem contratar um produto à parte.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Firewall de rede',
          definition: 'Filtrar tráfego por IP, rede e localização antes da camada de aplicação.',
          azion: 'full',
          competitor: 'full'
        }
      ]
    },
    {
      title: 'Entrega e rede',
      rows: [
        {
          capability: 'Cache em camadas e alívio de origem',
          definition:
            'Camadas intermediárias de cache que reduzem as requisições que chegam à origem.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Otimização de imagem e vídeo',
          definition:
            'Redimensionar, comprimir e converter mídia na entrega, sem processar na origem.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'DNS autoritativo e balanceamento de carga',
          definition:
            'Responder pelos registros DNS dos seus domínios e distribuir o tráfego entre origens saudáveis.',
          azion: 'full',
          competitor: 'full'
        }
      ]
    },
    {
      title: 'Observabilidade',
      rows: [
        {
          capability: 'Métricas em tempo real e busca de eventos',
          definition:
            'Painéis ao vivo de tráfego, desempenho e segurança, com consulta aos eventos de cada requisição.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Streaming de logs para ferramentas de terceiros',
          definition: 'Enviar logs em tempo real para o seu SIEM ou data lake.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Monitoramento de usuário real',
          definition: 'Medir o desempenho que os usuários percebem no navegador.',
          azion: 'full',
          competitor: 'full'
        }
      ]
    },
    {
      title: 'Comercial',
      rows: [
        {
          capability: 'Preço por uso publicado',
          definition: 'Preço por unidade publicado, para saber antes quanto um mês vai custar.',
          azion: 'full',
          competitor: 'full'
        }
      ]
    }
  ],
  mapping: {
    title: 'Mapeie os serviços da AWS para a Azion',
    description:
      'Amazon CloudFront mapeia para Applications, com Cache Behaviors no Rules Engine, Origin Shield em Tiered Cache e Invalidation em Real-Time Purge. CloudFront Functions, Lambda@Edge e AWS Lambda mapeiam para Functions, S3 para Object Storage, DynamoDB para KV Store, Route 53 para Edge DNS, AWS WAF e Shield para Firewall e DDoS Protection, e CloudWatch para Real-Time Metrics e Real-Time Events.'
  },
  faq: [
    {
      value: 'a-azion-e-uma-boa-alternativa',
      question: 'A Azion é uma boa alternativa à AWS?',
      answer:
        'Sim. A Azion substitui CloudFront, Lambda@Edge, S3, DynamoDB, Route 53, AWS WAF e Shield por uma plataforma só de entrega, computação, storage e segurança. Preços transparentes de pagamento por uso e $300 em créditos gratuitos ajudam a avaliar a troca.'
    },
    {
      value: 'como-o-amazon-cloudfront-mapeia',
      question: 'Como o Amazon CloudFront mapeia para a Azion?',
      answer:
        'CloudFront Distributions mapeiam para Applications e Alternate Domain Names para Workloads. Cache Behaviors e Response Headers Policies mapeiam para o Rules Engine, Cache Policies para Cache, Origin Shield para Tiered Cache e Invalidation para Real-Time Purge.'
    },
    {
      value: 'qual-e-o-equivalente-de-lambda-edge',
      question: 'Qual é o equivalente de Lambda@Edge e CloudFront Functions?',
      answer:
        'Os dois mapeiam para Functions for Applications. Redirecionamentos, rewrites, headers e normalização de cache key rodam em Functions, e a lógica de segurança que hoje vive em Lambda@Edge, como validação de requisição e autenticação, mapeia para Functions for Firewall.'
    },
    {
      value: 'o-que-substitui-aws-lambda-e-api-gateway',
      question: 'O que substitui AWS Lambda e Amazon API Gateway?',
      answer:
        'AWS Lambda mapeia para Functions for Applications. Amazon API Gateway mapeia para Applications com Functions, e a validação de requisição e o throttling do API Gateway mapeiam para Rules Engine e Firewall.'
    },
    {
      value: 'como-os-servicos-de-storage-e-dados',
      question: 'Como os serviços de storage e banco de dados da AWS mapeiam para a Azion?',
      answer:
        'Amazon S3 mapeia para Object Storage, e S3 Static Website Hosting para Object Storage com Applications. Transformações de imagem com S3 Object Lambda mapeiam para Image Processor com Functions, Aurora DSQL para SQL Database, e DynamoDB e DynamoDB Global Tables para KV Store.'
    },
    {
      value: 'como-os-produtos-de-seguranca-da',
      question: 'Como os produtos de segurança da AWS mapeiam para a Azion?',
      answer:
        'AWS WAF mapeia para Web Application Firewall, as Managed Rules para WAF Rule Sets, Bot Control para Bot Manager e IP Sets para Network Lists. Rate-Based Rules mapeiam para Rules Engine com Network Shield, AWS Shield Standard e Advanced para DDoS Protection, e AWS Network Firewall para Network Shield.'
    },
    {
      value: 'como-dns-certificados-e-balanceamento',
      question: 'Como DNS, certificados e balanceamento de carga mapeiam para a Azion?',
      answer:
        'Amazon Route 53 mapeia para Edge DNS. AWS Certificate Manager e AWS Private CA mapeiam para Certificate Manager, com mTLS para autenticação de cliente por certificado. Elastic Load Balancing, Application Load Balancer e Network Load Balancer mapeiam para Load Balancer.'
    },
    {
      value: 'o-que-substitui-o-amazon-cloudwatch',
      question: 'O que substitui o Amazon CloudWatch?',
      answer:
        'CloudWatch Metrics mapeia para Real-Time Metrics. CloudWatch Logs, Logs Insights e AWS X-Ray mapeiam para Real-Time Events, Amazon Data Firehose para Data Stream e CloudWatch RUM para Edge Pulse.'
    },
    {
      value: 'como-bedrock-e-sagemaker-mapeiam',
      question: 'Como Amazon Bedrock e SageMaker mapeiam para a Azion?',
      answer:
        'A inferência de foundation models no Amazon Bedrock e os endpoints de inferência em tempo real do SageMaker mapeiam para AI Inference. O fine-tuning do Bedrock mapeia para LoRA Fine-Tune, e modelos importados com Custom Model Import mapeiam para AI Inference com LoRA Fine-Tune.'
    },
    {
      value: 'posso-rodar-aws-e-azion-em',
      question: 'Posso rodar AWS e Azion em paralelo?',
      answer:
        'Sim. Implante cada aplicação em uma URL gerada pela Azion, valide roteamento, funções, dados, segurança e observabilidade, e então atualize o Route 53 para apontar para a Azion, monitorando o tráfego de produção com os passos de rollback documentados.'
    }
  ]
}
