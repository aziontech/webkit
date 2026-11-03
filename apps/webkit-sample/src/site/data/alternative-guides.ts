import herospark from '@aziontech/webkit/assets/herospark-extended-color.svg'
import zoop from '@aziontech/webkit/assets/zoop-extended-color.svg'
import type { QuoteTabsItem } from '@aziontech/webkit/quote-tabs'

import type { SiteFaqItem, SiteTopic } from '../ui/sections'

export type SupportLevel = 'full' | 'partial' | 'none'

export interface AlternativeGuide {
  rival: string
  hero: { eyebrow: string; title: string; description: string; art?: string }
  why: string
  reasons: SiteTopic[]
  quotes: QuoteTabsItem[]
  comparison: string
  capabilities: { capability: string; azion: SupportLevel; rival: SupportLevel }[]
  mapping: {
    title: string
    description: string
    illustrationLabel: string
    action: { label: string; href: string }
  }
  faq: SiteFaqItem[]
}

export const TRUST_MARKS = [
  'agibank',
  'radware',
  'america-movil',
  'gpa',
  'fourbank',
  'global-fashion-group',
  'herospark',
  'itau',
  'magalu',
  'madeiramadeira',
  'renner',
  'netshoes',
  'coca-cola',
  'prime-video',
  'dafiti',
  'caixa',
  'exame',
  'nzn'
]

export const AKAMAI_GUIDE: AlternativeGuide = {
  rival: 'Akamai',
  hero: {
    eyebrow: 'Comparativo: alternativa à Akamai',
    title: 'Com a Akamai, você compra produtos e assume a integração.',
    description:
      'Décadas de aquisições, com consoles, APIs e ciclos de ativação separados. Com a Azion, você opera uma plataforma. Menos complexidade. Mais velocidade, controle e capacidade de inovar.',
    art: 'azion-to-akamai'
  },
  why: 'A Akamai chama de plataforma. Quem integra é o cliente.',
  reasons: [
    {
      icon: 'pi pi-sitemap',
      title: 'Uma plataforma, não um portfólio',
      description:
        'As stacks da Akamai vieram de décadas de aquisições e são integradas só em parte. Na Azion, todos os produtos compartilham uma arquitetura e um fluxo de requisição.'
    },
    {
      icon: 'pi pi-bolt',
      title: 'Um modelo de operação para todos os produtos',
      description:
        'Cada produto da Akamai tem seu próprio console, API e ciclo de ativação. Na Azion, mudanças de regra vão ao ar em mais de 100 data centers em segundos.'
    },
    {
      icon: 'pi pi-code',
      title: 'Modernize sem comprar mais um produto',
      description:
        'A computação da Akamai se divide entre EdgeWorkers, Akamai Functions e Akamai Cloud. Na Azion, Functions, Rules Engine e AI Inference rodam juntos, sem cold start.'
    },
    {
      icon: 'pi pi-shield',
      title: 'Segurança no mesmo fluxo da requisição',
      description:
        'A proteção da Akamai está espalhada por módulos adquiridos. O Firewall da Azion combina WAF, DDoS Protection, Bot Manager e Network Shield, e inspeciona cada requisição primeiro.'
    },
    {
      icon: 'pi pi-dollar',
      title: 'Todos os produtos em todos os planos',
      description:
        'A Akamai cota pacotes interdependentes, muitas vezes por parceiros. A Azion coloca todos os produtos em todos os planos, com preço fixo, sob demanda ou por compromisso.'
    },
    {
      icon: 'pi pi-sync',
      title: 'Rode as duas plataformas em paralelo',
      description:
        'Valide uma property na Azion enquanto a Akamai serve a produção e vire o DNS com o rollback escrito.'
    }
  ],
  quotes: [
    {
      mark: 'gpa',
      text: 'A Azion nos protegeu de ciberataques sofisticados e nos possibilitou modernizar nossa infraestrutura, reduzir custos e disponibilizar as melhores experiências de compra a milhões de clientes em toda a América Latina.',
      name: 'Allan Monteiro',
      jobTitle: 'CISO & Head of Technology'
    },
    {
      mark: 'axur',
      text: 'Com a Azion, escalamos nossos modelos proprietários de AI sem nos preocupar com infraestrutura. Inspecionamos milhões de websites por dia e fazemos o takedown mais rápido do mercado.',
      name: 'Fabio Ramos',
      jobTitle: 'CEO'
    },
    {
      logo: zoop,
      clientName: 'Zoop',
      text: 'Como Gerente de Segurança da Informação, posso afirmar que a Azion entregou exatamente o que nossa organização precisava: uma solução que combina proteção avançada com desempenho superior. A implementação foi surpreendentemente rápida e os resultados foram imediatos.',
      name: 'Ismael Aguilar',
      jobTitle: 'Gerente de Segurança da Informação na Zoop'
    },
    {
      logo: herospark,
      clientName: 'HeroSpark',
      text: 'Nossa parceria com a Azion transformou nossas operações. Reduzimos custos e melhoramos a performance, recuperando mais de 200 horas mensais para focar em desenvolvimento estratégico.',
      name: 'Mateus Leonardi',
      jobTitle: 'CTO na HeroSpark'
    },
    {
      mark: 'contabilizei',
      text: 'Eu gosto muito da profundidade das regras de cache que posso aplicar no edge. Existem coisas que não conseguiríamos fazer usando soluções de outros fornecedores. Em termos de performance, conformidade com as regras e padrões de entrega da Contabilizei, estamos muito satisfeitos com o desempenho da Azion.',
      name: 'Marcelo Pacheco',
      jobTitle: 'Especialista DevOps na Contabilizei'
    },
    {
      mark: 'global-fashion-group',
      text: 'Uma das melhores soluções de CDN e WAF que já usei. Fácil de implementar e integrar, com velocidade e baixa latência que fazem real diferença para nossos clientes.',
      name: 'Julian H',
      jobTitle: 'Gerente de IT OPS, SRE & SEC na Dafiti'
    }
  ],
  comparison: 'Como a Azion se compara com a Akamai',
  capabilities: [
    {
      capability: 'Entrega, computação, storage e segurança em uma plataforma',
      azion: 'full',
      rival: 'partial'
    },
    {
      capability: 'Um só modelo de operação em console, API, CLI e Terraform',
      azion: 'full',
      rival: 'partial'
    },
    {
      capability: 'Mudanças de configuração e regras no ar em segundos',
      azion: 'full',
      rival: 'partial'
    },
    { capability: 'Runtime JavaScript e WebAssembly', azion: 'full', rival: 'full' },
    { capability: 'Execução de funções sem cold start', azion: 'full', rival: 'partial' },
    { capability: 'Inferência de AI na plataforma', azion: 'full', rival: 'full' },
    { capability: 'Store chave-valor distribuído', azion: 'full', rival: 'full' },
    { capability: 'Object storage compatível com S3', azion: 'full', rival: 'full' },
    { capability: 'SQL database distribuído com busca vetorial', azion: 'full', rival: 'none' },
    { capability: 'WAF gerenciado para aplicações e APIs', azion: 'full', rival: 'full' },
    { capability: 'Descoberta e proteção de APIs', azion: 'full', rival: 'full' },
    { capability: 'Gerenciamento de bots', azion: 'full', rival: 'full' },
    { capability: 'Proteção DDoS inclusa na entrega', azion: 'full', rival: 'partial' },
    { capability: 'Firewall de rede', azion: 'full', rival: 'full' },
    { capability: 'Cache em camadas e alívio de origem', azion: 'full', rival: 'full' },
    { capability: 'Otimização de imagem e vídeo', azion: 'full', rival: 'full' },
    { capability: 'DNS autoritativo e balanceamento de carga', azion: 'full', rival: 'full' },
    { capability: 'Métricas em tempo real e busca de eventos', azion: 'full', rival: 'partial' },
    {
      capability: 'Streaming de logs e monitoramento de usuário real',
      azion: 'full',
      rival: 'full'
    },
    { capability: 'Todos os produtos e recursos em todos os planos', azion: 'full', rival: 'none' },
    { capability: 'Preço pay-as-you-go publicado', azion: 'full', rival: 'partial' },
    { capability: 'Começar sem professional services obrigatório', azion: 'full', rival: 'partial' }
  ],
  mapping: {
    title: 'Mapeie os workstreams da Akamai para a Azion',
    description:
      'Properties de entrega mapeiam para Applications e Cache, e Cloudlets para Rules Engine. EdgeWorkers vão para Functions, EdgeKV para KV Store, o DNS da Akamai para Edge DNS e as proteções WAAP para Firewall, WAF e Bot Manager.',
    illustrationLabel: 'Mapeamento de arquitetura da Akamai para a Azion',
    action: {
      label: 'Guia técnico completo',
      href: 'https://www.azion.com/pt-br/documentacao/produtos/guias/akamai-guia-migracao/'
    }
  },
  faq: [
    {
      value: 'a-azion-e-uma-boa',
      question: 'A Azion é uma boa alternativa à Akamai?',
      answer:
        'Sim. A Azion está entre os principais concorrentes e alternativas à Akamai. Em vez de integrar um portfólio de produtos, você opera uma plataforma que substitui entrega, computação, object storage e segurança WAAP da Akamai (WAF, API Security e anti-bot). Todos os produtos estão em todos os planos, com preços transparentes de pagamento por uso e $300 em créditos gratuitos para avaliar a troca.'
    },
    {
      value: 'qual-a-diferenca-entre-a',
      question: 'Qual a diferença entre a arquitetura da Azion e a da Akamai?',
      answer:
        'Entrega, segurança e cloud da Akamai vêm de stacks separadas, cada uma com seu próprio console, fluxo, API e ciclo de ativação. A Azion é uma só plataforma definida por software: computação, segurança, entrega e observabilidade rodam em um único fluxo para cada requisição, e Console, API, CLI e Terraform compartilham o mesmo modelo de operação.'
    },
    {
      value: 'como-os-servicos-de-entrega',
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
      value: 'como-edgeworkers-e-akamai-functions',
      question: 'Como EdgeWorkers e Akamai Functions mapeiam para a Azion?',
      answer:
        'EdgeWorkers e Akamai Functions mapeiam para Azion Functions. Revise lógica de roteamento, headers, acesso a dados e dependências externas de cada função, depois valide o comportamento em paralelo antes de transferir tráfego de produção.'
    },
    {
      value: 'como-os-produtos-de-storage',
      question: 'Como os produtos de storage da Akamai mapeiam para a Azion?',
      answer:
        'EdgeKV mapeia para Azion KV Store. NetStorage e Akamai Object Storage mapeiam para Azion Object Storage, enquanto dependências de MySQL ou PostgreSQL gerenciados podem mapear para SQL Database quando o workload exige dados relacionais.'
    },
    {
      value: 'como-os-produtos-de-seguranca',
      question: 'Como os produtos de segurança da Akamai mapeiam para a Azion?',
      answer:
        'Os produtos WAAP da Akamai mapeiam para equivalentes da Azion. App and API Protector (Akamai WAF) mapeia para Firewall, Web Application Firewall, DDoS Protection e Bot Manager. A proteção anti-bot do Akamai Bot Manager mapeia para o Azion Bot Manager, Prolexic para DDoS Protection e Network Shield, e Akamai API Security para Firewall, WAF e Applications.'
    },
    {
      value: 'como-os-precos-da-azion',
      question: 'Como os preços da Azion se comparam com os da Akamai?',
      answer:
        'A Akamai cota entrega e segurança em pacotes de produtos interdependentes, muitas vezes por meio de parceiros e serviços. A Azion inclui todos os produtos em todos os planos, com preço fixo, sob demanda ou por compromisso, e publica preços de pagamento por uso que você consulta antes de falar com o comercial.'
    },
    {
      value: 'comparando-akamai-vs-cloudflare-por',
      question: 'Comparando Akamai vs Cloudflare, por que considerar a Azion?',
      answer:
        'Equipes que avaliam Akamai vs Cloudflare costumam incluir também a Azion na lista, porque ela unifica entrega, funções, storage, WAF, API security, anti-bot e proteção DDoS em uma única plataforma com preços transparentes. Há guias técnicos disponíveis tanto para workloads da Akamai quanto da Cloudflare.'
    },
    {
      value: 'como-dns-e-direcionamento-de',
      question: 'Como DNS e direcionamento de tráfego mapeiam para a Azion?',
      answer:
        'Akamai Edge DNS, DNS Manager, DNS Infrastructure, Global Traffic Management, NodeBalancers e Cloudlets de balanceamento mapeiam para Edge DNS e Load Balancer da Azion, com regras em Applications e Rules Engine quando necessário.'
    },
    {
      value: 'o-que-substitui-as-ferramentas',
      question: 'O que substitui as ferramentas de observabilidade da Akamai?',
      answer:
        'Akamai TrafficPeak mapeia para Real-Time Metrics, Real-Time Events e Data Stream. DataStream mapeia para Data Stream, enquanto mPulse mapeia para Edge Pulse e Real-Time Metrics para visibilidade de experiência e performance.'
    },
    {
      value: 'posso-rodar-akamai-e-azion',
      question: 'Posso rodar Akamai e Azion em paralelo?',
      answer:
        'Sim. Você pode operar as duas plataformas em paralelo, validar entrega, DNS, funções, storage, políticas de segurança e observabilidade, e fazer o cutover dos domínios gradualmente com etapas de rollback documentadas.'
    }
  ]
}

export const CLOUDFLARE_GUIDE: AlternativeGuide = {
  rival: 'Cloudflare',
  hero: {
    eyebrow: 'Comparativo: alternativa à Cloudflare',
    title: 'Na Cloudflare, o que você recebe depende do plano que você paga.',
    description:
      'Prioridade de roteamento, recursos, logs e suporte mudam conforme o plano. A plataforma da Azion é a mesma em todos os planos. Todos os produtos e recursos, roteamento e failover, e dados em tempo real, desde o plano gratuito.',
    art: 'azion-to-cloudflare'
  },
  why: 'A Azion oferece mais de uma forma de se recuperar',
  reasons: [
    {
      icon: 'pi pi-dollar',
      title: 'Três formas de pagar',
      description:
        'Na Cloudflare, o preço salta de US$ 250 por mês no Business para cerca de US$ 3.000+ no Enterprise. A Azion oferece plano de valor fixo, preço sob demanda com limites de gasto ou descontos por compromisso.'
    },
    {
      icon: 'pi pi-lock-open',
      title: 'Todos os recursos em todos os planos',
      description:
        'Bot Management e API Shield exigem um contrato Enterprise na Cloudflare. A Azion inclui todos os produtos e recursos em todos os planos, com preços sob demanda publicados.'
    },
    {
      icon: 'pi pi-sitemap',
      title: 'Falhas ficam isoladas',
      description:
        'Na Cloudflare, uma mudança de configuração chega à rede inteira em segundos. A Azion roda em mais de 100 data centers dentro de redes de ISPs, e cada localização é seu próprio domínio de falha.'
    },
    {
      icon: 'pi pi-replay',
      title: 'Recuperação sem esperar o BGP',
      description:
        'A Cloudflare anuncia os mesmos IPs anycast em todas as suas localizações, então, quando uma falha, a recuperação espera o BGP convergir na internet. Na Azion, o Edge DNS direciona os usuários para localizações disponíveis, com failover em todos os planos.'
    },
    {
      icon: 'pi pi-comments',
      title: 'Resposta em minutos',
      description:
        'O Enterprise Premium da Cloudflare tem meta de resposta a P1 em menos de uma hora. O suporte Enterprise e Mission-Critical da Azion funciona 24×7, com resposta inicial em minutos para indisponibilidades críticas.'
    },
    {
      icon: 'pi pi-chart-line',
      title: 'Dados em tempo real em todos os planos',
      description:
        'Na Cloudflare, logs e recursos mudam conforme o plano. Na Azion, Real-Time Metrics, Real-Time Events e Data Stream vêm em todos os planos, desde o plano gratuito.'
    }
  ],
  quotes: [
    {
      mark: 'global-fashion-group',
      text: 'Uma das melhores soluções de CDN e WAF que já usei. Fácil de implementar e integrar, com velocidade e baixa latência que fazem real diferença para nossos clientes.',
      name: 'Julian H.',
      jobTitle: 'Gerente de IT OPS, SRE & SEC na Dafiti'
    },
    {
      mark: 'axur',
      text: 'Com a Azion, escalamos nossos modelos proprietários de AI sem nos preocupar com infraestrutura. Inspecionamos milhões de websites por dia e fazemos o takedown mais rápido do mercado.',
      name: 'Fabio Ramos',
      jobTitle: 'CEO'
    },
    {
      logo: zoop,
      clientName: 'Zoop',
      text: 'A Azion entregou exatamente o que precisávamos: proteção avançada com desempenho superior. A implementação foi surpreendentemente rápida e os resultados foram imediatos.',
      name: 'Ismael Aguilar',
      jobTitle: 'Gerente de Segurança da Informação na Zoop'
    },
    {
      logo: herospark,
      clientName: 'HeroSpark',
      text: 'Nossa parceria com a Azion transformou nossas operações. Reduzimos custos e melhoramos a performance, recuperando mais de 200 horas mensais para focar em desenvolvimento estratégico.',
      name: 'Mateus Leonardi',
      jobTitle: 'CTO na HeroSpark'
    },
    {
      mark: 'contabilizei',
      text: 'Gosto muito da profundidade das regras de cache que posso aplicar. Há coisas que não conseguiríamos fazer com outros fornecedores. Em performance e conformidade com nossos padrões de entrega, estamos muito satisfeitos com a Azion.',
      name: 'Marcelo Pacheco',
      jobTitle: 'Especialista DevOps na Contabilizei'
    },
    {
      mark: 'gpa',
      text: 'A Azion nos protegeu de ciberataques sofisticados e nos possibilitou modernizar nossa infraestrutura, reduzir custos e disponibilizar as melhores experiências de compra a milhões de clientes em toda a América Latina.',
      name: 'Allan Monteiro',
      jobTitle: 'CISO & Head of Technology'
    }
  ],
  comparison: 'Como a Azion se compara com a Cloudflare',
  capabilities: [
    {
      capability: 'Entrega, computação, storage e segurança em uma plataforma',
      azion: 'full',
      rival: 'full'
    },
    { capability: 'Um único console para todos os workstreams', azion: 'full', rival: 'full' },
    {
      capability: 'Mudanças de configuração e regras no ar em segundos',
      azion: 'full',
      rival: 'full'
    },
    { capability: 'Runtime JavaScript e WebAssembly', azion: 'full', rival: 'full' },
    { capability: 'Execução de funções sem cold start', azion: 'full', rival: 'full' },
    {
      capability: 'Execução de funções acima de 30 segundos de CPU',
      azion: 'full',
      rival: 'partial'
    },
    { capability: 'Inferência de AI na plataforma', azion: 'full', rival: 'full' },
    { capability: 'Store chave-valor distribuído', azion: 'full', rival: 'full' },
    { capability: 'Object storage compatível com S3', azion: 'full', rival: 'full' },
    {
      capability: 'SQL distribuído com ACID e busca vetorial em um só produto',
      azion: 'full',
      rival: 'partial'
    },
    { capability: 'WAF gerenciado para aplicações e APIs', azion: 'full', rival: 'full' },
    {
      capability: 'Descoberta e proteção de APIs sem plano enterprise',
      azion: 'full',
      rival: 'partial'
    },
    { capability: 'Gerenciamento de bots sem plano enterprise', azion: 'full', rival: 'partial' },
    { capability: 'Proteção DDoS inclusa na entrega', azion: 'full', rival: 'full' },
    { capability: 'Firewall de rede', azion: 'full', rival: 'full' },
    { capability: 'Cache em camadas e alívio de origem', azion: 'full', rival: 'full' },
    { capability: 'Otimização de imagem e vídeo', azion: 'full', rival: 'full' },
    { capability: 'DNS autoritativo e balanceamento de carga', azion: 'full', rival: 'full' },
    {
      capability: 'Balanceamento de carga e failover incluídos em todos os planos',
      azion: 'full',
      rival: 'partial'
    },
    { capability: 'Métricas em tempo real e busca de eventos', azion: 'full', rival: 'full' },
    { capability: 'Streaming de logs sem plano enterprise', azion: 'full', rival: 'partial' },
    { capability: 'Monitoramento de usuário real', azion: 'full', rival: 'full' },
    {
      capability: 'Sem cobrança de egress entre serviços da plataforma',
      azion: 'full',
      rival: 'full'
    },
    { capability: 'Preço pay-as-you-go publicado', azion: 'full', rival: 'partial' },
    { capability: 'Todos os produtos e recursos em todos os planos', azion: 'full', rival: 'none' },
    {
      capability: 'Primeira resposta em menos de 15 minutos no suporte Enterprise',
      azion: 'full',
      rival: 'partial'
    }
  ],
  mapping: {
    title: 'Troque sem reescrever seu código',
    description:
      'Código de Workers roda em Functions com mudanças mínimas, KV mapeia para KV Store e buckets do R2 sincronizam com Object Storage via APIs compatíveis com S3. Regras de WAF e configurações de DDoS mapeiam para WAF, DDoS Protection e Firewall.',
    illustrationLabel: 'Mapeamento de arquitetura Cloudflare para Azion',
    action: {
      label: 'Guia técnico completo',
      href: 'https://www.azion.com/pt-br/documentacao/produtos/guias/cloudflare-guia-migracao/'
    }
  },
  faq: [
    {
      value: 'a-azion-e-uma-boa',
      question: 'A Azion é uma boa alternativa à Cloudflare?',
      answer:
        'Sim. A Azion está entre as principais alternativas e concorrentes da Cloudflare, com APIs compatíveis para Workers, KV e R2, além de WAF, proteção DDoS e gerenciamento de bots integrados em uma só plataforma. Todos os produtos e recursos estão em todos os planos, e $300 em créditos gratuitos facilitam avaliar a troca.'
    },
    {
      value: 'o-kv-store-e-compativel',
      question: 'O KV Store é compatível com o Cloudflare Workers KV?',
      answer:
        'Sim. O KV Store fornece uma API compatível com o Cloudflare Workers KV, facilitando mover aplicações existentes ou o uso de padrões familiares.'
    },
    {
      value: 'como-o-codigo-de-workers',
      question: 'Como o código de Workers mapeia para Azion Functions?',
      answer:
        'As Azion Functions suportam TypeScript e JavaScript com APIs web padrão e polyfills de Node.js. Você pode fazer deploy usando a CLI da Azion, integração com Git com deploy contínuo, ou frameworks como Next.js, Vue, React, Angular, Gatsby e Astro. A maioria do código de Workers requer mudanças mínimas.'
    },
    {
      value: 'quais-sao-os-limites-de',
      question: 'Quais são os limites de tempo de execução das Azion Functions?',
      answer:
        'As Functions suportam até 5 minutos de tempo de CPU por execução e tamanhos de bundle de até 20 MB, em comparação com o limite de 30 segundos de tempo de CPU da Cloudflare. Isso permite executar workloads complexos sem dividir a lógica entre múltiplas funções.'
    },
    {
      value: 'existem-cold-starts-nas-azion',
      question: 'Existem cold starts nas Azion Functions?',
      answer:
        'Não. As Azion Functions executam imediatamente na infraestrutura distribuída sem latência de cold start. Você tem performance consistente na primeira requisição sem os atrasos imprevisíveis comuns em plataformas serverless.'
    },
    {
      value: 'qual-latencia-posso-esperar-globalmente',
      question: 'Qual latência posso esperar globalmente?',
      answer:
        'Latência inferior a 30 ms em mais de 120 localizações ao redor do mundo. A arquitetura distribuída da Azion garante tempos de resposta rápidos para usuários em qualquer lugar, com roteamento automático para a localização edge mais próxima.'
    },
    {
      value: 'como-a-azion-se-recupera',
      question:
        'Como a Azion se recupera da falha de uma localização em comparação com a Cloudflare?',
      answer:
        'Quando uma localização da Cloudflare falha, a recuperação depende do BGP: as redes da internet precisam convergir em uma nova rota, o que pode levar de segundos a minutos e está fora do controle da Cloudflare, e o BGP não consegue conter uma configuração errada. Na Azion, o BGP é uma camada de roteamento, não a única. Cada localização é seu próprio domínio de falha, o Edge DNS desvia os usuários de localizações indisponíveis, balanceamento de carga e failover redirecionam o tráfego em todos os planos, e o stale cache mantém o conteúdo no ar quando a origem falha.'
    },
    {
      value: 'como-os-precos-se-comparam',
      question: 'Como os preços se comparam à Cloudflare?',
      answer:
        'O plano Business da Cloudflare custa US$ 250 por mês, enquanto o Enterprise não tem preço público e começa em torno de US$ 3.000. Na Azion, você escolhe como pagar: um plano de valor fixo com uso incluído, preço sob demanda com limites de gasto configuráveis ou descontos por compromisso com Reserved Capacity e Savings Plans. Todos os produtos e recursos estão em todos os planos, sem cobrança de egress entre serviços, e você recebe $300 em créditos gratuitos válidos por 365 dias para começar a testar.'
    },
    {
      value: 'o-que-substitui-o-waf',
      question: 'O que substitui o WAF e a proteção DDoS da Cloudflare?',
      answer:
        'As regras do WAF da Cloudflare mapeiam para o Web Application Firewall da Azion, e a proteção DDoS está incluída nativamente na rede da Azion. Políticas de filtragem de tráfego do Cloudflare Gateway podem ser recriadas com o Firewall e o Network Shield da Azion. A Cloudflare exige um contrato Enterprise para Bot Management e API Shield; na Azion, o Bot Manager e todos os outros produtos estão disponíveis em todos os planos.'
    },
    {
      value: 'como-o-cloudflare-r2-mapeia',
      question: 'Como o Cloudflare R2 mapeia para o Azion Object Storage?',
      answer:
        'Buckets do Cloudflare R2 sincronizam com o Azion Object Storage por meio de APIs compatíveis com S3, então suas ferramentas e SDKs atuais continuam funcionando. Transfira objetos com tooling S3 padrão, valide os padrões de acesso e atualize os endpoints da aplicação, sem taxas de egresso entre serviços da Azion.'
    },
    {
      value: 'existe-vendor-lock-in-com',
      question: 'Existe vendor lock-in com a Azion?',
      answer:
        'Não. A Azion utiliza APIs compatíveis com S3 para Object Storage, APIs web padrão para Functions e padrões de código portáveis. Você pode sair a qualquer momento sem dependências proprietárias ou contratos obrigatórios que o travem.'
    },
    {
      value: 'qual-suporte-esta-disponivel-durante',
      question: 'Qual suporte está disponível durante a mudança?',
      answer:
        'Documentação, guias técnicos passo a passo e referências cobrem cada workstream, e você recebe $300 em créditos gratuitos válidos por 365 dias, sem necessidade de cartão de crédito. O suporte Enterprise e Mission-Critical adiciona atendimento 24×7, acesso direto aos engenheiros de P&D em horário comercial e primeira resposta em menos de 15 minutos para indisponibilidades críticas para o negócio, contra menos de uma hora no suporte Enterprise Premium da Cloudflare.'
    },
    {
      value: 'posso-rodar-ambas-as-plataformas',
      question: 'Posso rodar ambas as plataformas em paralelo?',
      answer:
        'Sim. Você pode rodar Cloudflare e Azion simultaneamente e transferir tráfego gradualmente usando configuração DNS. Isso permite testes, validação e uma transição suave sem interrupção do serviço.'
    }
  ]
}

export const FASTLY_GUIDE: AlternativeGuide = {
  rival: 'Fastly',
  hero: {
    eyebrow: 'Comparativo: alternativa à Fastly',
    title: 'A Fastly é uma CDN programável com produtos ao redor.',
    description:
      'Uma rede concentrada em poucos data centers, mais produtos separados. A Azion é uma plataforma programável para rodar a aplicação inteira. Mais distribuição. Mais integração. Menos produtos para gerenciar.',
    art: 'azion-to-fastly'
  },
  why: 'A Fastly construiu uma CDN rápida. A Azion construiu uma plataforma completa.',
  reasons: [
    {
      icon: 'pi pi-globe',
      title: 'Computação e segurança onde as requisições começam',
      description:
        'A Fastly concentra o tráfego em menos data centers, maiores. A Azion roda computação e segurança perto dos usuários, com menor latência e menos exposição.'
    },
    {
      icon: 'pi pi-th-large',
      title: 'Uma arquitetura, não três produtos',
      description:
        'Entrega em VCL, Compute em WebAssembly e segurança da Signal Sciences têm modelos próprios. Na Azion, tudo compartilha uma arquitetura, sem cold start.'
    },
    {
      icon: 'pi pi-shield',
      title: 'Segurança em cada requisição',
      description:
        'A Fastly vende WAF, DDoS, Bot Management e API Security separadamente. Na Azion, eles trabalham juntos em cada requisição, com um só conjunto de políticas.'
    },
    {
      icon: 'pi pi-code',
      title: 'Lógica de entrega sem VCL',
      description:
        'O Rules Engine cuida de redirecionamentos, chaves de cache, headers e seleção de origem sem linguagem proprietária, e as mudanças vão ao ar em segundos.'
    },
    {
      icon: 'pi pi-dollar',
      title: 'Um modelo comercial alinhado ao uso',
      description:
        'A Fastly vende Deliver, Compute, Security e Observability como pacotes separados. A Azion publica preços de pagamento por uso para a plataforma inteira.'
    },
    {
      icon: 'pi pi-sync',
      title: 'Faça o cutover serviço a serviço',
      description:
        'Reconstrua um serviço na Azion enquanto a Fastly serve a produção e mova os domínios no seu ritmo.'
    }
  ],
  quotes: [
    {
      mark: 'contabilizei',
      text: 'Nós na Contabilizei conseguimos estabelecer uma parceria muito boa, já que podemos acionar a Azion sempre que necessário, rapidamente, entrando em contato direto com a equipe de suporte. Functions nos permitiu otimizar a entrega de requisições no Edge, economizando dinheiro e recursos de infraestrutura.',
      name: 'Fabrício Santos',
      jobTitle: 'Gerente DevSecOps na Contabilizei'
    },
    {
      mark: 'axur',
      text: 'Com a Azion, escalamos nossos modelos proprietários de AI sem nos preocupar com infraestrutura. Inspecionamos milhões de websites por dia e fazemos o takedown mais rápido do mercado.',
      name: 'Fabio Ramos',
      jobTitle: 'CEO'
    },
    {
      logo: zoop,
      clientName: 'Zoop',
      text: 'A Azion entregou exatamente o que precisávamos: proteção avançada com desempenho superior. A implementação foi surpreendentemente rápida e os resultados foram imediatos.',
      name: 'Ismael Aguilar',
      jobTitle: 'Gerente de Segurança da Informação na Zoop'
    },
    {
      logo: herospark,
      clientName: 'HeroSpark',
      text: 'Nossa parceria com a Azion transformou nossas operações. Reduzimos custos e melhoramos a performance, recuperando mais de 200 horas mensais para focar em desenvolvimento estratégico.',
      name: 'Mateus Leonardi',
      jobTitle: 'CTO na HeroSpark'
    },
    {
      mark: 'gpa',
      text: 'A Azion nos protegeu de ciberataques sofisticados e nos possibilitou modernizar nossa infraestrutura, reduzir custos e disponibilizar as melhores experiências de compra a milhões de clientes em toda a América Latina.',
      name: 'Allan Monteiro',
      jobTitle: 'CISO & Head of Technology'
    },
    {
      mark: 'global-fashion-group',
      text: 'Uma das melhores soluções de CDN e WAF que já usei. Fácil de implementar e integrar, com velocidade e baixa latência que fazem real diferença para nossos clientes.',
      name: 'Julian H.',
      jobTitle: 'Gerente de IT OPS, SRE & SEC na Dafiti'
    }
  ],
  comparison: 'Como a Azion se compara com a Fastly',
  capabilities: [
    {
      capability: 'Entrega, computação, storage e segurança em uma plataforma',
      azion: 'full',
      rival: 'partial'
    },
    {
      capability: 'Um só modelo de operação em console, API, CLI e Terraform',
      azion: 'full',
      rival: 'partial'
    },
    {
      capability: 'Mudanças de configuração e regras no ar em segundos',
      azion: 'full',
      rival: 'full'
    },
    {
      capability: 'Regras de entrega configuráveis sem escrever VCL',
      azion: 'full',
      rival: 'partial'
    },
    { capability: 'Runtime JavaScript e WebAssembly', azion: 'full', rival: 'full' },
    { capability: 'Execução de funções sem cold start', azion: 'full', rival: 'full' },
    { capability: 'Inferência de AI na plataforma', azion: 'full', rival: 'partial' },
    { capability: 'Store chave-valor distribuído', azion: 'full', rival: 'full' },
    { capability: 'Object storage compatível com S3', azion: 'full', rival: 'full' },
    { capability: 'SQL database distribuído com busca vetorial', azion: 'full', rival: 'none' },
    { capability: 'WAF gerenciado para aplicações e APIs', azion: 'full', rival: 'full' },
    { capability: 'Descoberta e proteção de APIs', azion: 'full', rival: 'partial' },
    { capability: 'Gerenciamento de bots', azion: 'full', rival: 'full' },
    { capability: 'Proteção DDoS inclusa na entrega', azion: 'full', rival: 'full' },
    { capability: 'Firewall de rede', azion: 'full', rival: 'partial' },
    { capability: 'Cache em camadas e alívio de origem', azion: 'full', rival: 'full' },
    { capability: 'Otimização de imagem e vídeo', azion: 'full', rival: 'partial' },
    { capability: 'DNS autoritativo', azion: 'full', rival: 'none' },
    {
      capability: 'Balanceamento de carga entre origens multi-cloud',
      azion: 'full',
      rival: 'partial'
    },
    { capability: 'Métricas em tempo real e busca de eventos', azion: 'full', rival: 'full' },
    { capability: 'Streaming de logs para ferramentas de terceiros', azion: 'full', rival: 'full' },
    { capability: 'Monitoramento de usuário real', azion: 'full', rival: 'none' },
    { capability: 'Todos os produtos e recursos em todos os planos', azion: 'full', rival: 'none' },
    { capability: 'Preço pay-as-you-go publicado', azion: 'full', rival: 'full' }
  ],
  mapping: {
    title: 'Troque por equivalência de serviços',
    description:
      'Lógica em VCL mapeia para Rules Engine, Compute para Functions, Edge Data Storage para KV Store e Next-Gen WAF para WAF. Leve também TLS e logs, e faça o cutover pelo DNS.',
    illustrationLabel: 'Mapeamento da Fastly para a Azion',
    action: {
      label: 'Guia técnico completo',
      href: 'https://www.azion.com/pt-br/documentacao/produtos/guias/fastly-guia-migracao/'
    }
  },
  faq: [
    {
      value: 'a-azion-e-uma-boa',
      question: 'A Azion é uma boa alternativa à Fastly?',
      answer:
        'Sim. A Azion é uma das principais alternativas à Fastly. A Fastly é uma CDN programável com produtos ao redor; a Azion é uma plataforma programável para rodar a aplicação inteira, com entrega de CDN, computação, storage, WAF, gerenciamento de bots e proteção DDoS em uma só arquitetura. Caminhos compatíveis para Compute, Edge Data Storage e Next-Gen WAF tornam a transição simples, com $300 em créditos gratuitos para validá-la.'
    },
    {
      value: 'qual-a-diferenca-entre-a',
      question: 'Qual a diferença entre a rede da Azion e a da Fastly?',
      answer:
        'A estratégia da Fastly se apoia em menos data centers, maiores e mais concentrados, então o processamento muitas vezes acontece longe de onde o tráfego se origina. A Azion roda em uma infraestrutura altamente distribuída, perto de usuários e dispositivos, então computação e segurança rodam onde as requisições se originam, com menor latência e menos exposição.'
    },
    {
      value: 'como-o-full-site-delivery',
      question: 'Como o Full-Site Delivery da Fastly mapeia para a Azion?',
      answer:
        'Full-Site Delivery mapeia para Azion Applications. Origens, regras de roteamento, políticas de cache, cabeçalhos e comportamentos de entrega podem ser configurados na plataforma web da Azion para manter a lógica de entrega existente.'
    },
    {
      value: 'qual-e-o-equivalente-do',
      question: 'Qual é o equivalente do Fastly Compute?',
      answer:
        'Fastly Compute mapeia para Azion Functions. As Functions executam lógica na infraestrutura distribuída da Azion com escala sem cold starts, usando padrões web modernos para adaptar código distribuído.'
    },
    {
      value: 'como-os-dados-da-edge',
      question: 'Como os dados da Edge Data Storage mapeiam para a Azion?',
      answer:
        'Edge Data Storage mapeia para Azion KV Store. O KV Store atende casos de uso de dados key-value distribuídos, como configuração dinâmica, flags, sessões leves e dados consultados por Functions.'
    },
    {
      value: 'como-ficam-cache-tiering-e',
      question: 'Como ficam cache, tiering e otimização de mídia?',
      answer:
        'Cache Reservation, Cache APIs e Media Shield podem ser traduzidos para recursos de Cache e Tiered Cache da Azion. Image Optimizer mapeia para Image Processor para transformação e otimização de imagens.'
    },
    {
      value: 'como-tls-e-certificados-mapeiam',
      question: 'Como TLS e certificados mapeiam para a Azion?',
      answer:
        'Platform TLS, TLS Service Options e Certainly mapeiam para Certificate Manager. Você pode automatizar certificados, associá-los às suas aplicações e validar a configuração antes do corte de DNS.'
    },
    {
      value: 'o-que-substitui-high-volume',
      question: 'O que substitui High Volume Logging e Log Explorer & Insights?',
      answer:
        'High Volume Logging mapeia para Data Stream, permitindo enviar logs para destinos externos. Log Explorer & Insights mapeia para Real-Time Events, enquanto Domain Inspector e Origin Inspector se relacionam a Real-Time Metrics.'
    },
    {
      value: 'como-os-precos-da-azion',
      question: 'Como os preços da Azion se comparam com os da Fastly?',
      answer:
        'A Fastly vende Deliver, Compute, Security e Observability como pacotes separados, e recursos enterprise importantes ficam atrás do "fale com vendas". A Azion usa um modelo comercial alinhado ao uso, com preços de pagamento por uso publicados e capacidades integradas, em vez de mais um SKU para cada necessidade.'
    },
    {
      value: 'como-regras-de-waf-bots',
      question: 'Como regras de WAF, bots e rate limiting mapeiam para a Azion?',
      answer:
        'Fastly Next-Gen WAF (NGWAF) mapeia para Azion Web Application Firewall, Bot Management mapeia para Bot Manager, Edge Rate Limiting pode ser implementado com Firewall e a proteção DDoS da Fastly tem equivalente na proteção DDoS da Azion.'
    },
    {
      value: 'comparando-fastly-vs-cloudflare-por',
      question: 'Comparando Fastly vs Cloudflare, por que considerar a Azion?',
      answer:
        'Equipes que avaliam Fastly vs Cloudflare costumam incluir também a Azion na lista, porque ela combina performance de CDN, funções programáveis sem cold starts, WAF e proteção DDoS integrados, e preços de pagamento por uso transparentes em uma única plataforma. Há guias técnicos disponíveis tanto para workloads da Fastly quanto da Cloudflare.'
    },
    {
      value: 'posso-rodar-fastly-e-azion',
      question: 'Posso rodar Fastly e Azion em paralelo?',
      answer:
        'Sim. Você pode operar as duas plataformas em paralelo e transferir o tráfego gradualmente por DNS. Essa abordagem permite comparar comportamento, validar cache, TLS, logs e segurança antes do corte definitivo.'
    }
  ]
}

export const AWS_GUIDE: AlternativeGuide = {
  rival: 'AWS',
  hero: {
    eyebrow: 'Comparativo: alternativa à AWS',
    title: 'A AWS vende serviços. Seu time vira o integrador.',
    description:
      'Cada capacidade é um serviço separado, com sua própria configuração, limites e fatura. A Azion entrega uma só plataforma, distribuída por padrão. Uma configuração, uma fatura, segurança incluída e suporte no seu idioma.',
    art: 'azion-to-aws'
  },
  why: 'A AWS entrega as peças. A Azion entrega a plataforma.',
  reasons: [
    {
      icon: 'pi pi-th-large',
      title: 'Uma plataforma, uma fatura',
      description:
        'Na AWS, entrega, segurança, DNS e código são serviços e faturas separados. A Azion roda tudo em uma plataforma, com uma só fatura.'
    },
    {
      icon: 'pi pi-check',
      title: 'Sem regiões para escolher ou replicar',
      description:
        'Sobreviver à falha de uma região da AWS pode dobrar o custo. A Azion roda em mais de 100 data centers, com balanceamento de carga e failover em todos os planos.'
    },
    {
      icon: 'pi pi-shield',
      title: 'Proteção DDoS sem contrato separado',
      description:
        'O AWS Shield Advanced exige contrato de um ano. A Azion inclui DDoS Protection, WAF e proteção de rede em todos os planos, mitigando ataques em menos de 3 segundos.'
    },
    {
      icon: 'pi pi-headphones',
      title: 'Suporte que não cresce com a sua fatura',
      description:
        'A AWS cobra o suporte como um percentual da sua fatura. O suporte Enterprise da Azion funciona 24×7 em português, espanhol e inglês, com resposta em menos de 15 minutos.'
    },
    {
      icon: 'pi pi-bolt',
      title: 'Sem cold start e sem provisioned concurrency',
      description:
        'As funções começam na chegada da requisição, com até 5 minutos de CPU por execução. Nada para pré-aquecer ou reservar.'
    },
    {
      icon: 'pi pi-sync',
      title: 'Mantenha a AWS onde ela ainda faz sentido',
      description:
        'Mova entrega e segurança primeiro, com as origens ainda na AWS. Load Balancer e Connectors mantêm origens multi-cloud no lugar.'
    }
  ],
  quotes: [
    {
      mark: 'contabilizei',
      text: 'Nós na Contabilizei conseguimos estabelecer uma parceria muito boa, já que podemos acionar a Azion sempre que necessário, rapidamente, entrando em contato direto com a equipe de suporte. Functions nos permitiu otimizar a entrega de requisições no Edge, economizando dinheiro e recursos de infraestrutura.',
      name: 'Fabrício Santos',
      jobTitle: 'Gerente DevSecOps na Contabilizei'
    },
    {
      mark: 'axur',
      text: 'Com a Azion, escalamos nossos modelos proprietários de AI sem nos preocupar com infraestrutura. Inspecionamos milhões de websites por dia e fazemos o takedown mais rápido do mercado.',
      name: 'Fabio Ramos',
      jobTitle: 'CEO'
    },
    {
      logo: zoop,
      clientName: 'Zoop',
      text: 'A Azion entregou exatamente o que precisávamos: proteção avançada com desempenho superior. A implementação foi surpreendentemente rápida e os resultados foram imediatos.',
      name: 'Ismael Aguilar',
      jobTitle: 'Gerente de Segurança da Informação na Zoop'
    },
    {
      logo: herospark,
      clientName: 'HeroSpark',
      text: 'Nossa parceria com a Azion transformou nossas operações. Reduzimos custos e melhoramos a performance, recuperando mais de 200 horas mensais para focar em desenvolvimento estratégico.',
      name: 'Mateus Leonardi',
      jobTitle: 'CTO na HeroSpark'
    },
    {
      mark: 'gpa',
      text: 'A Azion nos protegeu de ciberataques sofisticados e nos possibilitou modernizar nossa infraestrutura, reduzir custos e disponibilizar as melhores experiências de compra a milhões de clientes em toda a América Latina.',
      name: 'Allan Monteiro',
      jobTitle: 'CISO & Head of Technology'
    },
    {
      mark: 'global-fashion-group',
      text: 'Uma das melhores soluções de CDN e WAF que já usei. Fácil de implementar e integrar, com velocidade e baixa latência que fazem real diferença para nossos clientes.',
      name: 'Julian H.',
      jobTitle: 'Gerente de IT OPS, SRE & SEC na Dafiti'
    }
  ],
  comparison: 'Como a Azion se compara com a AWS',
  capabilities: [
    {
      capability: 'Entrega, computação, storage e segurança em uma plataforma',
      azion: 'full',
      rival: 'partial'
    },
    { capability: 'Um único console para todos os workstreams', azion: 'full', rival: 'partial' },
    {
      capability: 'Mudanças de configuração e regras no ar em segundos',
      azion: 'full',
      rival: 'partial'
    },
    { capability: 'Sem regiões para escolher ou replicar', azion: 'full', rival: 'partial' },
    { capability: 'Runtime JavaScript e WebAssembly', azion: 'full', rival: 'partial' },
    { capability: 'Execução de funções sem cold start', azion: 'full', rival: 'partial' },
    { capability: 'Escala sem provisioned concurrency', azion: 'full', rival: 'partial' },
    { capability: 'Inferência de AI na plataforma', azion: 'full', rival: 'full' },
    { capability: 'Store chave-valor distribuído', azion: 'full', rival: 'full' },
    { capability: 'Object storage compatível com S3', azion: 'full', rival: 'full' },
    { capability: 'SQL database distribuído com busca vetorial', azion: 'full', rival: 'partial' },
    { capability: 'WAF gerenciado para aplicações e APIs', azion: 'full', rival: 'full' },
    { capability: 'Descoberta e proteção de APIs', azion: 'full', rival: 'partial' },
    { capability: 'Gerenciamento de bots', azion: 'full', rival: 'full' },
    { capability: 'Proteção DDoS inclusa na entrega', azion: 'full', rival: 'partial' },
    { capability: 'Firewall de rede', azion: 'full', rival: 'full' },
    { capability: 'Cache em camadas e alívio de origem', azion: 'full', rival: 'full' },
    { capability: 'Otimização de imagem e vídeo', azion: 'full', rival: 'partial' },
    { capability: 'DNS autoritativo e balanceamento de carga', azion: 'full', rival: 'full' },
    {
      capability: 'Balanceamento de carga e failover incluídos em todos os planos',
      azion: 'full',
      rival: 'partial'
    },
    { capability: 'Métricas em tempo real e busca de eventos', azion: 'full', rival: 'partial' },
    { capability: 'Streaming de logs para ferramentas de terceiros', azion: 'full', rival: 'full' },
    { capability: 'Monitoramento de usuário real', azion: 'full', rival: 'full' },
    { capability: 'Suporte 24×7 em português, espanhol e inglês', azion: 'full', rival: 'partial' },
    {
      capability: 'Sem cobrança de egress entre serviços da plataforma',
      azion: 'full',
      rival: 'none'
    },
    { capability: 'Preço pay-as-you-go publicado', azion: 'full', rival: 'full' }
  ],
  mapping: {
    title: 'Troque sem re-arquitetura',
    description:
      'Behaviors do CloudFront viram regras do Rules Engine, Lambda vai para Functions, S3 sincroniza com Object Storage e DynamoDB mapeia para KV Store. AWS WAF e Shield mapeiam para WAF e DDoS Protection.',
    illustrationLabel: 'Mapeamento de arquitetura AWS para Azion',
    action: {
      label: 'Guia técnico completo',
      href: 'https://www.azion.com/pt-br/documentacao/produtos/guias/aws-guia-migracao/'
    }
  },
  faq: [
    {
      value: 'a-azion-e-uma-boa',
      question: 'A Azion é uma boa alternativa à AWS?',
      answer:
        'Sim. A AWS entrega serviços separados que o seu time integra, cada um com sua própria configuração, limites e fatura. A Azion entrega uma só plataforma para entrega, segurança, código e observabilidade, distribuída por padrão em mais de 100 data centers, com todos os produtos em todos os planos e uma única fatura.'
    },
    {
      value: 'como-as-distribuicoes-do-cloudfront',
      question: 'Como as distribuições do CloudFront mapeiam para Azion Applications?',
      answer:
        'As distribuições do CloudFront mapeiam para Azion Applications com capacidades equivalentes. Os comportamentos de cache mapeiam para regras do Rules Engine, as origens se configuram como endpoints e os certificados TLS são gerenciados através do Certificate Manager. Sua lógica de roteamento e políticas de cache seguem valendo.'
    },
    {
      value: 'qual-e-o-equivalente-do',
      question: 'Qual é o equivalente do Lambda e Lambda@Edge?',
      answer:
        'As funções do AWS Lambda e Lambda@Edge mapeiam para Azion Functions. Functions suporta TypeScript e JavaScript com APIs web padrão e polyfills de Node.js. Você obtém até 5 minutos de tempo de CPU por execução e zero cold starts, melhorando as limitações do Lambda.'
    },
    {
      value: 'como-os-buckets-s3-mapeiam',
      question: 'Como os buckets S3 mapeiam para a Azion?',
      answer:
        'Os buckets S3 mapeiam para Azion Object Storage usando APIs compatíveis com S3. Seu código e ferramentas existentes funcionam com mudanças mínimas. Object Storage se integra nativamente com Applications para entrega edge e Functions para lógica de transformação.'
    },
    {
      value: 'existe-um-equivalente-ao-dynamodb',
      question: 'Existe um equivalente ao DynamoDB?',
      answer:
        'Sim. Azion KV Store fornece um banco de dados key-value serverless similar ao DynamoDB. Para dados relacionais, SQL Database oferece SQL distribuído com compliance ACID e réplicas de leitura globais, capacidades que requerem múltiplos serviços AWS para alcançar.'
    },
    {
      value: 'como-os-precos-se-comparam',
      question: 'Como os preços se comparam à AWS?',
      answer:
        'A Azion oferece preços transparentes de pagamento por uso sem taxas de egresso entre serviços. Você paga apenas pelo que usa sem custos ocultos de transferência de dados. Comece com $300 em créditos gratuitos válidos por 365 dias, sem cartão de crédito requerido.'
    },
    {
      value: 'como-o-azion-object-storage',
      question: 'Como o Azion Object Storage se compara aos preços do AWS S3?',
      answer:
        'O Azion Object Storage é um dos principais concorrentes do S3, com APIs compatíveis com S3 e sem taxas de egresso entre serviços da Azion. Enquanto os preços do AWS S3 somam cobranças por camadas de armazenamento, requisições e transferência de dados, a Azion oferece storage com pagamento por uso transparente que se integra nativamente com entrega e computação.'
    },
    {
      value: 'posso-rodar-ambas-as-plataformas',
      question: 'Posso rodar ambas as plataformas ao mesmo tempo?',
      answer:
        'Sim. Você pode rodar AWS e Azion simultaneamente e transferir tráfego gradualmente usando configuração DNS. Isso permite testes, validação e uma transição suave sem interrupção do serviço.'
    },
    {
      value: 'como-a-azion-lida-com',
      question: 'Como a Azion lida com a falha de uma região em comparação com a AWS?',
      answer:
        'Na AWS, as aplicações rodam nas regiões que você escolhe, e sobreviver à falha de uma região é projeto seu; a própria orientação da AWS diz que isso pode dobrar o custo. A Azion roda entrega, segurança e código em mais de 100 data centers, sem regiões para escolher ou replicar, e balanceamento de carga e failover estão incluídos em todos os planos.'
    },
    {
      value: 'e-as-regras-de-waf',
      question: 'E as regras de WAF e segurança?',
      answer:
        'As regras do AWS WAF mapeiam para o Web Application Firewall e o Firewall da Azion. Conjuntos de regras gerenciadas, regras customizadas, rate limiting e detecção de bots têm equivalentes. O DDoS Protection, papel que o AWS Shield cumpre na AWS, está incluído em todos os planos e mitiga ataques em menos de 3 segundos, sem contrato separado, compromisso anual ou cobrança por recurso.'
    },
    {
      value: 'como-o-route-53-dns',
      question: 'Como o Route 53 DNS mapeia para a Azion?',
      answer:
        'As zonas hospedadas do Route 53 mapeiam para Azion Edge DNS. Importe seus registros, valide a propagação e depois atualize seu registrador de domínio para usar os nameservers da Azion. Health checks e políticas de roteamento têm capacidades equivalentes.'
    },
    {
      value: 'como-o-suporte-da-azion',
      question: 'Como o suporte da Azion se compara com o AWS Support?',
      answer:
        'A AWS cobra o suporte como um percentual de toda a sua fatura da AWS, e os casos de suporte não são atendidos em português ou espanhol. O suporte Enterprise da Azion funciona 24×7 em português, espanhol e inglês, com primeira resposta em menos de 15 minutos para indisponibilidades críticas e acesso direto aos engenheiros que constroem a plataforma.'
    }
  ]
}

export const F5_GUIDE: AlternativeGuide = {
  rival: 'F5',
  hero: {
    eyebrow: 'Comparativo: alternativa à F5',
    title: 'A F5 vende "every app, anywhere" com um portfólio que ainda roda espalhado.',
    description:
      'BIG-IP, NGINX, Shape e Volterra nasceram separados e ainda carregam tecnologias diferentes. A Azion entrega uma só plataforma para rodar todas as aplicações. Sem appliances. Sem remendos. Sem décadas de legado.'
  },
  why: 'Um logo não transforma quatro arquiteturas em uma plataforma.',
  reasons: [
    {
      icon: 'pi pi-sitemap',
      title: 'Uma arquitetura, não quatro',
      description:
        'BIG-IP, NGINX e Volterra vieram de gerações e aquisições diferentes. Na Azion, computação, segurança, entrega e observabilidade compartilham uma arquitetura.'
    },
    {
      icon: 'pi pi-cog',
      title: 'Um só modelo para todos os times',
      description:
        'Cada linha de produto da F5 exige ferramentas e habilidades próprias. Na Azion, Console, API, CLI e Terraform compartilham um modelo para todos os times.'
    },
    {
      icon: 'pi pi-code',
      title: 'Modernize sem carregar o passado',
      description:
        'A F5 ainda precisa preservar uma enorme base de appliances. A lógica dos seus iRules vai para Rules Engine e Functions, feitos para aplicações e APIs modernas.'
    },
    {
      icon: 'pi pi-server',
      title: 'Sem appliances para comprar ou substituir',
      description:
        'Hardware, licenças e professional services somam custo em cada etapa. A Azion é um serviço gerenciado, sem appliances para instalar ou atualizar.'
    },
    {
      icon: 'pi pi-dollar',
      title: 'Orçamento sem matriz de licenças',
      description:
        'O orçamento na F5 depende do licenciamento, do pacote e da capacidade. A Azion publica preços sob demanda, com Reserved Capacity e Savings Plans para compromissos.'
    },
    {
      icon: 'pi pi-sync',
      title: 'Mova uma aplicação por vez',
      description:
        'Coloque a Azion na frente das aplicações que o BIG-IP serve hoje, valide e mova o tráfego em etapas.'
    }
  ],
  quotes: [
    {
      mark: 'gpa',
      text: 'A Azion nos protegeu de ciberataques sofisticados e nos possibilitou modernizar nossa infraestrutura, reduzir custos e disponibilizar as melhores experiências de compra a milhões de clientes em toda a América Latina.',
      name: 'Allan Monteiro',
      jobTitle: 'CISO & Head of Technology'
    },
    {
      mark: 'axur',
      text: 'Com a Azion, escalamos nossos modelos proprietários de AI sem nos preocupar com infraestrutura. Inspecionamos milhões de websites por dia e fazemos o takedown mais rápido do mercado.',
      name: 'Fabio Ramos',
      jobTitle: 'CEO'
    },
    {
      logo: zoop,
      clientName: 'Zoop',
      text: 'A Azion entregou exatamente o que precisávamos: proteção avançada com desempenho superior. A implementação foi surpreendentemente rápida e os resultados foram imediatos.',
      name: 'Ismael Aguilar',
      jobTitle: 'Gerente de Segurança da Informação na Zoop'
    },
    {
      logo: herospark,
      clientName: 'HeroSpark',
      text: 'Nossa parceria com a Azion transformou nossas operações. Reduzimos custos e melhoramos a performance, recuperando mais de 200 horas mensais para focar em desenvolvimento estratégico.',
      name: 'Mateus Leonardi',
      jobTitle: 'CTO na HeroSpark'
    },
    {
      mark: 'contabilizei',
      text: 'Gosto muito da profundidade das regras de cache que posso aplicar. Há coisas que não conseguiríamos fazer com outros fornecedores. Em performance e conformidade com nossos padrões de entrega, estamos muito satisfeitos com a Azion.',
      name: 'Marcelo Pacheco',
      jobTitle: 'Especialista DevOps na Contabilizei'
    },
    {
      mark: 'global-fashion-group',
      text: 'Uma das melhores soluções de CDN e WAF que já usei. Fácil de implementar e integrar, com velocidade e baixa latência que fazem real diferença para nossos clientes.',
      name: 'Julian H.',
      jobTitle: 'Gerente de IT OPS, SRE & SEC na Dafiti'
    }
  ],
  comparison: 'Como a Azion se compara com a F5',
  capabilities: [
    {
      capability: 'Entrega, computação, storage e segurança em uma plataforma',
      azion: 'full',
      rival: 'partial'
    },
    {
      capability: 'Um só modelo de operação em console, API, CLI e Terraform',
      azion: 'full',
      rival: 'partial'
    },
    {
      capability: 'Totalmente gerenciada, sem appliances para dimensionar ou atualizar',
      azion: 'full',
      rival: 'partial'
    },
    {
      capability: 'Balanceamento de carga, health checks e failover',
      azion: 'full',
      rival: 'full'
    },
    {
      capability: 'DNS autoritativo e direcionamento global de tráfego',
      azion: 'full',
      rival: 'full'
    },
    { capability: 'Lógica programável de requisição e resposta', azion: 'full', rival: 'full' },
    { capability: 'Funções serverless sem cold start', azion: 'full', rival: 'partial' },
    { capability: 'Inferência de AI na plataforma', azion: 'full', rival: 'partial' },
    { capability: 'Store chave-valor distribuído', azion: 'full', rival: 'none' },
    { capability: 'Object storage compatível com S3', azion: 'full', rival: 'none' },
    { capability: 'Entrega de conteúdo e cache', azion: 'full', rival: 'full' },
    { capability: 'WAF gerenciado para aplicações e APIs', azion: 'full', rival: 'full' },
    { capability: 'Descoberta e proteção de APIs', azion: 'full', rival: 'full' },
    { capability: 'Gerenciamento de bots', azion: 'full', rival: 'full' },
    { capability: 'Proteção DDoS', azion: 'full', rival: 'full' },
    { capability: 'Firewall de rede', azion: 'full', rival: 'full' },
    { capability: 'Métricas em tempo real e busca de eventos', azion: 'full', rival: 'full' },
    { capability: 'Streaming de logs para ferramentas de terceiros', azion: 'full', rival: 'full' },
    { capability: 'Preços sob demanda publicados', azion: 'full', rival: 'partial' },
    { capability: 'Todos os produtos e recursos em todos os planos', azion: 'full', rival: 'none' }
  ],
  mapping: {
    title: 'Mapeie as cargas da F5 para a Azion',
    description:
      'Virtual servers e pools do BIG-IP LTM mapeiam para Applications e Load Balancer, iRules para Rules Engine e Functions, e Advanced WAF e Distributed Cloud WAAP para Firewall e WAF. O BIG-IP DNS mapeia para Edge DNS.',
    illustrationLabel: 'Mapeamento de arquitetura da F5 para a Azion',
    action: {
      label: 'Documentação da plataforma',
      href: 'https://www.azion.com/pt-br/documentacao/produtos/visao-geral-da-plataforma-da-azion/'
    }
  },
  faq: [
    {
      value: 'a-azion-e-uma-boa',
      question: 'A Azion é uma boa alternativa à F5?',
      answer:
        'Sim. A Azion é uma alternativa forte à F5 para times que querem trocar appliances e um portfólio de vários produtos por uma plataforma gerenciada. Balanceamento de carga, lógica programável de requisição, WAF, gerenciamento de bots, proteção DDoS, DNS e observabilidade rodam na mesma arquitetura, em mais de 100 data centers, com preços sob demanda publicados e $300 em créditos gratuitos para avaliar a troca.'
    },
    {
      value: 'qual-a-diferenca-entre-a',
      question: 'Qual a diferença entre a arquitetura da Azion e a da F5?',
      answer:
        'O BIG-IP nasceu como appliance, o NGINX como software e o Volterra como SaaS distribuído, então hardware, appliances virtuais, software, cloud e SaaS da F5 compartilham um logo, mas não uma arquitetura. A Azion é uma só plataforma distribuída e definida por software, com computação, segurança, entrega e observabilidade integradas e um só modelo de operação para todos os times.'
    },
    {
      value: 'como-o-balanceamento-de-carga',
      question: 'Como o balanceamento de carga e os iRules do BIG-IP mapeiam para a Azion?',
      answer:
        'Virtual servers, pools e health monitors do BIG-IP LTM mapeiam para Applications e Load Balancer. A lógica de iRules para redirecionamentos, alteração de headers e roteamento mapeia para Rules Engine, e a lógica que precisa de código mapeia para Functions, escrita em JavaScript ou TypeScript em vez de TCL.'
    },
    {
      value: 'o-que-substitui-big-ip',
      question:
        'O que substitui BIG-IP Advanced WAF, NGINX App Protect e F5 Distributed Cloud WAAP?',
      answer:
        'Eles mapeiam para o Firewall da Azion: Web Application Firewall para ataques a aplicações e APIs, Bot Manager para tráfego automatizado, e DDoS Protection e Network Shield para ataques volumétricos e de camada de rede. O Firewall processa cada requisição primeiro, no mesmo fluxo da aplicação. Comece as regras do WAF em Learning mode para ajustar exceções antes de aplicá-las.'
    },
    {
      value: 'como-o-big-ip-dns',
      question: 'Como o BIG-IP DNS e o gerenciamento global de tráfego mapeiam para a Azion?',
      answer:
        'Zonas e wide IPs do BIG-IP DNS mapeiam para Edge DNS, e o direcionamento global de tráfego e o failover mapeiam para Load Balancer. Balanceamento de carga e failover estão incluídos em todos os planos.'
    },
    {
      value: 'preciso-comprar-ou-operar-appliances',
      question: 'Preciso comprar ou operar appliances na Azion?',
      answer:
        'Não. A Azion é um serviço gerenciado em mais de 100 data centers. Não há hardware nem appliance virtual para comprar, instalar, dimensionar, atualizar ou substituir, e a capacidade acompanha o tráfego, não as licenças.'
    },
    {
      value: 'como-os-precos-da-azion',
      question: 'Como os preços da Azion se comparam com os da F5?',
      answer:
        'A F5 oferece licenciamento perpétuo, por assinatura e por utilização, e o orçamento depende do modelo de implantação, do pacote de produtos e da capacidade. A Azion oferece preços sob demanda publicados, planos com uso incluído e descontos por compromisso com Reserved Capacity e Savings Plans, com todos os produtos em todos os planos.'
    },
    {
      value: 'posso-manter-a-f5-enquanto',
      question: 'Posso manter a F5 enquanto mudo para a Azion?',
      answer:
        'Sim. Coloque a Azion na frente das aplicações que o BIG-IP ou o NGINX servem hoje, valide entrega, políticas de WAF e roteamento na Azion e mova o tráfego em etapas. Mantenha a F5 onde ela ainda faz sentido até que cada aplicação esteja pronta para o cutover.'
    },
    {
      value: 'o-que-devo-validar-antes',
      question: 'O que devo validar antes do cutover?',
      answer:
        'Valide o roteamento para a origem e os health checks, os certificados TLS, o comportamento dos iRules traduzidos, as políticas de WAF e de bots, os registros de DNS e o failover, e a entrega de logs para suas ferramentas de monitoramento antes de mover o tráfego de produção.'
    }
  ]
}

export const IMPERVA_GUIDE: AlternativeGuide = {
  rival: 'Imperva',
  hero: {
    eyebrow: 'Comparativo: alternativa à Imperva',
    title: 'A Imperva é uma camada de segurança na frente das suas aplicações.',
    description:
      'As aplicações continuam rodando em outro lugar, e custo, logs e tempos de resposta dependem do contrato. A Azion roda, protege e observa a aplicação em uma só plataforma. Preços publicados. Todos os produtos em todos os planos.'
  },
  why: 'A Imperva protege suas aplicações. A Azion roda e protege.',
  reasons: [
    {
      icon: 'pi pi-sitemap',
      title: 'Rode a aplicação, não só proteja',
      description:
        'A Imperva é um reverse proxy na frente de aplicações que rodam em outro lugar. Na Azion, o código roda sem cold start ao lado de WAF e DDoS Protection.'
    },
    {
      icon: 'pi pi-server',
      title: 'Sem appliances para aposentar',
      description:
        'Os appliances WAF Gateway da Imperva têm data de fim de venda. O WAF da Azion é um módulo gerenciado do Firewall, sem hardware para dimensionar ou substituir.'
    },
    {
      icon: 'pi pi-dollar',
      title: 'Preços que você lê antes de assinar',
      description:
        'A Imperva não tem tabela de preços pública e cobra excedente acima dos volumes licenciados. A Azion publica preços, com limites de gasto configuráveis no uso sob demanda.'
    },
    {
      icon: 'pi pi-chart-line',
      title: 'Logs em até um minuto, em todos os planos',
      description:
        'Os logs de acesso da Imperva costumam chegar em até 10 minutos. Em todos os planos da Azion, o Data Stream envia logs pelo menos a cada 60 segundos.'
    },
    {
      icon: 'pi pi-headphones',
      title: 'Primeira resposta em minutos',
      description:
        'A Imperva dá a problemas críticos uma primeira resposta em 2 horas. O suporte Enterprise da Azion responde a indisponibilidades críticas em menos de 15 minutos, 24×7.'
    },
    {
      icon: 'pi pi-sync',
      title: 'Mova um site por vez',
      description:
        'Rode as regras do WAF em Learning mode na Azion enquanto a Imperva protege a produção, e vire o DNS com o rollback pronto.'
    }
  ],
  quotes: [
    {
      mark: 'gpa',
      text: 'A Azion nos protegeu de ciberataques sofisticados e nos possibilitou modernizar nossa infraestrutura, reduzir custos e disponibilizar as melhores experiências de compra a milhões de clientes em toda a América Latina.',
      name: 'Allan Monteiro',
      jobTitle: 'CISO & Head of Technology'
    },
    {
      mark: 'axur',
      text: 'Com a Azion, escalamos nossos modelos proprietários de AI sem nos preocupar com infraestrutura. Inspecionamos milhões de websites por dia e fazemos o takedown mais rápido do mercado.',
      name: 'Fabio Ramos',
      jobTitle: 'CEO'
    },
    {
      logo: zoop,
      clientName: 'Zoop',
      text: 'A Azion entregou exatamente o que precisávamos: proteção avançada com desempenho superior. A implementação foi surpreendentemente rápida e os resultados foram imediatos.',
      name: 'Ismael Aguilar',
      jobTitle: 'Gerente de Segurança da Informação na Zoop'
    },
    {
      logo: herospark,
      clientName: 'HeroSpark',
      text: 'Nossa parceria com a Azion transformou nossas operações. Reduzimos custos e melhoramos a performance, recuperando mais de 200 horas mensais para focar em desenvolvimento estratégico.',
      name: 'Mateus Leonardi',
      jobTitle: 'CTO na HeroSpark'
    },
    {
      mark: 'contabilizei',
      text: 'Gosto muito da profundidade das regras de cache que posso aplicar. Há coisas que não conseguiríamos fazer com outros fornecedores. Em performance e conformidade com nossos padrões de entrega, estamos muito satisfeitos com a Azion.',
      name: 'Marcelo Pacheco',
      jobTitle: 'Especialista DevOps na Contabilizei'
    },
    {
      mark: 'global-fashion-group',
      text: 'Uma das melhores soluções de CDN e WAF que já usei. Fácil de implementar e integrar, com velocidade e baixa latência que fazem real diferença para nossos clientes.',
      name: 'Julian H.',
      jobTitle: 'Gerente de IT OPS, SRE & SEC na Dafiti'
    }
  ],
  comparison: 'Como a Azion se compara com a Imperva',
  capabilities: [
    {
      capability: 'Entrega, computação, storage e segurança em uma plataforma',
      azion: 'full',
      rival: 'partial'
    },
    {
      capability: 'Funções serverless no mesmo fluxo de requisição, sem cold start',
      azion: 'full',
      rival: 'none'
    },
    { capability: 'Inferência de AI na plataforma', azion: 'full', rival: 'none' },
    { capability: 'Store chave-valor distribuído', azion: 'full', rival: 'none' },
    { capability: 'Object storage compatível com S3', azion: 'full', rival: 'none' },
    { capability: 'WAF gerenciado para aplicações e APIs', azion: 'full', rival: 'full' },
    { capability: 'Descoberta e proteção de APIs', azion: 'full', rival: 'full' },
    { capability: 'Gerenciamento de bots', azion: 'full', rival: 'full' },
    { capability: 'Proteção DDoS para aplicações e redes', azion: 'full', rival: 'full' },
    { capability: 'Entrega de conteúdo e cache', azion: 'full', rival: 'full' },
    { capability: 'DNS autoritativo', azion: 'full', rival: 'full' },
    {
      capability: 'Balanceamento de carga e failover em todos os planos',
      azion: 'full',
      rival: 'partial'
    },
    {
      capability: 'Métricas em tempo real e busca de eventos em todos os planos',
      azion: 'full',
      rival: 'partial'
    },
    {
      capability: 'Streaming de logs para ferramentas de terceiros em até 60 segundos',
      azion: 'full',
      rival: 'partial'
    },
    { capability: 'Preços publicados', azion: 'full', rival: 'none' },
    { capability: 'Todos os produtos e recursos em todos os planos', azion: 'full', rival: 'none' },
    {
      capability: 'Limites de gasto configuráveis em vez de cobrança de excedente',
      azion: 'full',
      rival: 'none'
    },
    {
      capability: 'Primeira resposta em menos de 15 minutos para indisponibilidades críticas',
      azion: 'full',
      rival: 'partial'
    },
    {
      capability: 'Suporte por telefone 24×7 em português, inglês e espanhol',
      azion: 'full',
      rival: 'partial'
    }
  ],
  mapping: {
    title: 'Mapeie os serviços da Imperva para a Azion',
    description:
      'Políticas do Cloud WAF e do WAF Gateway mapeiam para Firewall e WAF, DDoS Protection para DDoS Protection e Network Shield, e Advanced Bot Protection para Bot Manager. CDN, DNS e logs para SIEM mapeiam para Cache, Edge DNS e Data Stream.',
    illustrationLabel: 'Mapeamento de arquitetura da Imperva para a Azion',
    action: {
      label: 'Documentação do Firewall',
      href: 'https://www.azion.com/pt-br/documentacao/produtos/secure/firewall/'
    }
  },
  faq: [
    {
      value: 'a-azion-e-uma-boa',
      question: 'A Azion é uma boa alternativa à Imperva?',
      answer:
        'Sim. A Azion é uma alternativa forte à Imperva para times que querem rodar e proteger aplicações em uma só plataforma. WAF, DDoS Protection, Bot Manager e proteção de APIs rodam no mesmo fluxo de requisição que Applications, Functions e Edge DNS, em mais de 100 data centers, com preços publicados e $300 em créditos gratuitos para avaliar a troca.'
    },
    {
      value: 'qual-a-diferenca-entre-a',
      question: 'Qual a diferença entre a arquitetura da Azion e a da Imperva?',
      answer:
        'A rede da Imperva é uma infraestrutura de reverse proxy na frente de aplicações que rodam em outro provedor. Na Azion, Applications, Functions, Firewall e Edge DNS rodam em um único fluxo de requisição, então você entrega, roda e protege a aplicação no mesmo lugar, com o código rodando ao lado do WAF e sem cold start.'
    },
    {
      value: 'como-o-imperva-cloud-waf',
      question: 'Como o Imperva Cloud WAF e o WAF Gateway mapeiam para a Azion?',
      answer:
        'O Imperva Cloud WAF mapeia para o Web Application Firewall da Azion, configurado por regras de Firewall. As políticas dos appliances WAF Gateway vão para o mesmo WAF gerenciado, e você deixa de dimensionar, atualizar e substituir hardware. Comece as regras em Learning mode para ajustar exceções antes de aplicá-las.'
    },
    {
      value: 'o-que-substitui-o-imperva',
      question: 'O que substitui o Imperva DDoS Protection e o Advanced Bot Protection?',
      answer:
        'O Imperva DDoS Protection para sites e redes mapeia para DDoS Protection e Network Shield da Azion, que ficam sempre ativos e mitigam ataques em menos de 3 segundos. O Advanced Bot Protection mapeia para Bot Manager, e o API Security mapeia para regras de Firewall e WAF nos seus endpoints de API.'
    },
    {
      value: 'como-a-cdn-o-dns',
      question: 'Como a CDN, o DNS e o balanceamento de carga da Imperva mapeiam para a Azion?',
      answer:
        'O cache da CDN da Imperva mapeia para Applications e Cache, o DNS da Imperva mapeia para Edge DNS e o balanceamento de carga mapeia para Load Balancer. Balanceamento de carga e failover estão incluídos em todos os planos.'
    },
    {
      value: 'como-a-entrega-de-logs',
      question: 'Como a entrega de logs se compara com a da Imperva?',
      answer:
        'Na Imperva, a integração de logs com SIEM depende da assinatura, os logs de acesso costumam chegar em até 10 minutos e podem levar 30 ou mais, e os logs aguardando download ficam guardados por 48 horas. A Azion inclui Real-Time Metrics, Real-Time Events e Data Stream em todos os planos, e o Data Stream envia logs para o destino que você escolher pelo menos a cada 60 segundos.'
    },
    {
      value: 'como-os-precos-da-azion',
      question: 'Como os preços da Azion se comparam com os da Imperva?',
      answer:
        'A Imperva não tem tabela de preços pública. O Cloud WAF é licenciado por banda, no percentil 95 do tráfego, e proteção contra bots, de APIs e DDoS de rede têm volumes licenciados próprios, com o uso acima deles cobrado como excedente. A Azion publica seus preços, oferece um plano Pro de valor fixo e uso sob demanda com limites de gasto configuráveis, e inclui todos os produtos e recursos em todos os planos, inclusive balanceamento de carga e failover.'
    },
    {
      value: 'quao-rapido-e-o-suporte',
      question: 'Quão rápido é o suporte da Azion em comparação com o da Imperva?',
      answer:
        'A Imperva dá aos problemas críticos de cloud uma primeira resposta em 2 horas, e uma resposta em 30 minutos exige extras pagos, como um Technical Account Manager. O suporte padrão cobre horário comercial e quatro contatos autorizados. O suporte Enterprise e Mission-Critical da Azion oferece primeira resposta em menos de 15 minutos para indisponibilidades críticas para o negócio, suporte por telefone 24×7 em português, inglês e espanhol e acesso 8×5 aos engenheiros de P&D.'
    },
    {
      value: 'posso-rodar-imperva-e-azion',
      question: 'Posso rodar Imperva e Azion em paralelo?',
      answer:
        'Sim. Reconstrua políticas de WAF, regras de bots, configurações de DDoS e registros de DNS na Azion enquanto a Imperva segue protegendo a produção. Valide as detecções no Real-Time Events e mova os sites em etapas, com passos de rollback documentados.'
    },
    {
      value: 'o-que-devo-validar-antes',
      question: 'O que devo validar antes do cutover de DNS?',
      answer:
        'Valide o roteamento para a origem e os certificados, as regras e exceções do WAF, as políticas de bots e rate limiting, a proteção dos endpoints de API, a entrega de logs para o seu SIEM e os alertas antes de mover o tráfego de produção.'
    }
  ]
}

export const VERCEL_GUIDE: AlternativeGuide = {
  rival: 'Vercel',
  hero: {
    eyebrow: 'Comparativo: alternativa à Vercel',
    title: 'A Vercel roda seu código em uma região por padrão.',
    description:
      'O plano decide quantas regiões a mais você pode adicionar, e cada assento extra de desenvolvedor é cobrado. A Azion roda computação, dados e segurança perto dos usuários, por padrão. Sem regiões para gerenciar. Usuários ilimitados e SSO em todos os planos.',
    art: 'azion-to-vercel'
  },
  why: 'A Vercel faz o deploy do frontend. A Azion roda a aplicação.',
  reasons: [
    {
      icon: 'pi pi-globe',
      title: 'Sem regiões para escolher ou desbloquear',
      description:
        'As funções da Vercel rodam em uma única região por padrão. A Azion roda funções, cache e segurança em mais de 100 data centers, perto dos usuários.'
    },
    {
      icon: 'pi pi-replay',
      title: 'Failover em todos os planos',
      description:
        'Failover de funções entre regiões é recurso Enterprise na Vercel. Na Azion, o Edge DNS desvia de localizações com falha e o stale cache mantém o conteúdo no ar.'
    },
    {
      icon: 'pi pi-database',
      title: 'Dados na mesma plataforma do seu código',
      description:
        'Os bancos de dados da Vercel vêm de parceiros do Marketplace. A Azion roda Functions ao lado de Object Storage, SQL Database, KV Store e AI Inference.'
    },
    {
      icon: 'pi pi-check',
      title: 'Regras gerenciadas de WAF em todos os planos',
      description:
        'Regras OWASP gerenciadas não estão nos planos Hobby e Pro da Vercel. Na Azion, regras gerenciadas de WAF e o Activity History vêm em todos os planos.'
    },
    {
      icon: 'pi pi-users',
      title: 'Pague pelo uso, não por assento',
      description:
        'A Vercel cobra cada assento extra de desenvolvedor, e SAML SSO é add-on pago. A Azion inclui usuários ilimitados e SAML SSO em todos os planos.'
    },
    {
      icon: 'pi pi-sync',
      title: 'Mova um projeto por vez',
      description:
        'Reconstrua um projeto na Azion e compare com a produção. A Vercel segue servindo até você mover o domínio.'
    }
  ],
  quotes: [
    {
      mark: 'contabilizei',
      text: 'Nós na Contabilizei conseguimos estabelecer uma parceria muito boa, já que podemos acionar a Azion sempre que necessário, rapidamente, entrando em contato direto com a equipe de suporte. Functions nos permitiu otimizar a entrega de requisições no Edge, economizando dinheiro e recursos de infraestrutura.',
      name: 'Fabrício Santos',
      jobTitle: 'Gerente DevSecOps na Contabilizei'
    },
    {
      mark: 'axur',
      text: 'Com a Azion, escalamos nossos modelos proprietários de AI sem nos preocupar com infraestrutura. Inspecionamos milhões de websites por dia e fazemos o takedown mais rápido do mercado.',
      name: 'Fabio Ramos',
      jobTitle: 'CEO'
    },
    {
      logo: zoop,
      clientName: 'Zoop',
      text: 'A Azion entregou exatamente o que precisávamos: proteção avançada com desempenho superior. A implementação foi surpreendentemente rápida e os resultados foram imediatos.',
      name: 'Ismael Aguilar',
      jobTitle: 'Gerente de Segurança da Informação na Zoop'
    },
    {
      logo: herospark,
      clientName: 'HeroSpark',
      text: 'Nossa parceria com a Azion transformou nossas operações. Reduzimos custos e melhoramos a performance, recuperando mais de 200 horas mensais para focar em desenvolvimento estratégico.',
      name: 'Mateus Leonardi',
      jobTitle: 'CTO na HeroSpark'
    },
    {
      mark: 'gpa',
      text: 'A Azion nos protegeu de ciberataques sofisticados e nos possibilitou modernizar nossa infraestrutura, reduzir custos e disponibilizar as melhores experiências de compra a milhões de clientes em toda a América Latina.',
      name: 'Allan Monteiro',
      jobTitle: 'CISO & Head of Technology'
    },
    {
      mark: 'global-fashion-group',
      text: 'Uma das melhores soluções de CDN e WAF que já usei. Fácil de implementar e integrar, com velocidade e baixa latência que fazem real diferença para nossos clientes.',
      name: 'Julian H.',
      jobTitle: 'Gerente de IT OPS, SRE & SEC na Dafiti'
    }
  ],
  comparison: 'Como a Azion se compara com a Vercel',
  capabilities: [
    {
      capability: 'Entrega, computação, storage e segurança em uma plataforma',
      azion: 'full',
      rival: 'partial'
    },
    { capability: 'Builds conectados ao Git e preview deployments', azion: 'full', rival: 'full' },
    {
      capability: 'Regras de entrega alteradas sem novo deploy da aplicação',
      azion: 'full',
      rival: 'partial'
    },
    { capability: 'Runtime JavaScript e WebAssembly', azion: 'full', rival: 'full' },
    { capability: 'Execução de funções sem cold start', azion: 'full', rival: 'partial' },
    {
      capability: 'Funções distribuídas por padrão, sem regiões para escolher',
      azion: 'full',
      rival: 'partial'
    },
    {
      capability: 'Failover automático de funções em todos os planos',
      azion: 'full',
      rival: 'partial'
    },
    { capability: 'Inferência de AI na plataforma', azion: 'full', rival: 'partial' },
    { capability: 'Store chave-valor distribuído', azion: 'full', rival: 'partial' },
    { capability: 'Object storage compatível com S3', azion: 'full', rival: 'partial' },
    { capability: 'SQL database distribuído com busca vetorial', azion: 'full', rival: 'none' },
    { capability: 'Regras gerenciadas de WAF em todos os planos', azion: 'full', rival: 'partial' },
    { capability: 'Descoberta e proteção de APIs', azion: 'full', rival: 'partial' },
    { capability: 'Gerenciamento de bots', azion: 'full', rival: 'full' },
    { capability: 'Proteção DDoS inclusa na entrega', azion: 'full', rival: 'full' },
    { capability: 'Firewall de rede', azion: 'full', rival: 'none' },
    { capability: 'Cache em camadas e alívio de origem', azion: 'full', rival: 'partial' },
    { capability: 'Otimização de imagem e vídeo', azion: 'full', rival: 'partial' },
    { capability: 'DNS autoritativo', azion: 'full', rival: 'full' },
    {
      capability: 'Balanceamento de carga entre origens multi-cloud',
      azion: 'full',
      rival: 'none'
    },
    {
      capability: 'Acelerar e proteger origens hospedadas fora da plataforma',
      azion: 'full',
      rival: 'none'
    },
    { capability: 'Métricas em tempo real e busca de eventos', azion: 'full', rival: 'full' },
    { capability: 'Streaming de logs para ferramentas de terceiros', azion: 'full', rival: 'full' },
    { capability: 'Monitoramento de usuário real', azion: 'full', rival: 'full' },
    {
      capability: 'Usuários ilimitados e SAML SSO em todos os planos',
      azion: 'full',
      rival: 'partial'
    },
    {
      capability: 'Logs de auditoria da conta em todos os planos',
      azion: 'full',
      rival: 'partial'
    },
    { capability: 'Preço pay-as-you-go publicado', azion: 'full', rival: 'full' }
  ],
  mapping: {
    title: 'Mova a entrega de aplicações sem interromper releases',
    description:
      'Projetos mapeiam para Applications e Functions, Blob para Object Storage, Edge Config para KV Store e o Firewall da Vercel para Firewall e WAF. Reconstrua redirects, rewrites e DNS antes de mover os domínios.',
    illustrationLabel: 'Mapeamento de arquitetura da Vercel para a Azion',
    action: {
      label: 'Guia técnico completo',
      href: 'https://www.azion.com/pt-br/documentacao/produtos/guias/vercel-guia-migracao/'
    }
  },
  faq: [
    {
      value: 'a-azion-e-uma-boa',
      question: 'A Azion é uma boa alternativa à Vercel?',
      answer:
        'Sim. A Vercel faz o deploy do frontend em algumas regiões da AWS; a Azion roda a aplicação inteira. Você tem entrega de aplicações, funções distribuídas, object storage, dados chave-valor, SQL Database, segurança, DNS, analytics e observabilidade na Azion Web Platform, com escala sem cold start e sem regiões para gerenciar.'
    },
    {
      value: 'como-projetos-da-vercel-mapeiam',
      question: 'Como projetos da Vercel mapeiam para a Azion?',
      answer:
        'Projetos e deployments de produção da Vercel mapeiam para Azion Applications e Functions. O comportamento de cache CDN, redirects, rewrites, headers e roteamento pode ser reconstruído com Applications, Cache e Rules Engine.'
    },
    {
      value: 'o-que-substitui-vercel-preview',
      question: 'O que substitui Vercel Preview Deployments?',
      answer:
        'Fluxos de preview podem ser reconstruídos com Azion Preview Deployment e Azion CLI. Use esses recursos para validar URLs não produtivas, comportamento de aplicações, funções e configuração antes da promoção.'
    },
    {
      value: 'qual-e-o-equivalente-de',
      question: 'Qual é o equivalente de Vercel Functions e Fluid Compute?',
      answer:
        'Vercel Functions e workloads de Fluid Compute mapeiam para Azion Functions. Equipes podem traduzir lógica server-side, rotas de API, variáveis de ambiente e integrações backend para Functions e validar o comportamento antes do cutover de domínios.'
    },
    {
      value: 'como-a-azion-lida-com',
      question: 'Como a Azion lida com regiões e failover em comparação com a Vercel?',
      answer:
        'As funções da Vercel rodam em uma única região por padrão, o plano decide quantas regiões você pode adicionar, e o failover automático para outra região é um recurso Enterprise. A Azion roda funções em mais de 100 data centers, sem regiões para escolher ou desbloquear, e balanceamento de carga e failover estão incluídos em todos os planos.'
    },
    {
      value: 'como-vercel-blob-e-edge',
      question: 'Como Vercel Blob e Edge Config mapeiam para a Azion?',
      answer:
        'Vercel Blob mapeia para Azion Object Storage para arquivos de aplicação, uploads, documentos, imagens e vídeos. Edge Config mapeia para KV Store para leituras de baixa latência, como feature flags, experimentos, redirects e configuração.'
    },
    {
      value: 'como-workloads-de-ia-da',
      question: 'Como workloads de IA da Vercel mapeiam para a Azion?',
      answer:
        'Padrões de AI Cloud, AI SDK e AI Gateway mapeiam para AI Inference, Azion AI Client, Azion Lib e Functions conforme a arquitetura da aplicação, roteamento de modelos, streaming e requisitos de observabilidade.'
    },
    {
      value: 'como-recursos-de-seguranca-da',
      question: 'Como recursos de segurança da Vercel mapeiam para a Azion?',
      answer:
        'Vercel Firewall mapeia para Azion Firewall e Rules Engine. Web Application Firewall mapeia para Azion Web Application Firewall, controles de bots para Bot Manager, proteção de deployments para Firewall e Network Lists, e postura DDoS para DDoS Protection e Network Shield. Regras gerenciadas de WAF e DDoS Protection estão incluídas em todos os planos.'
    },
    {
      value: 'como-dominios-dns-e-certificados',
      question: 'Como domínios, DNS e certificados da Vercel mapeiam para a Azion?',
      answer:
        'Domínios personalizados, registros DNS, nameservers e fluxos de certificados podem ser reconstruídos com Azion Domains, Edge DNS e Certificate Manager. Valide emissão de certificados e roteamento antes de mover o tráfego de produção.'
    },
    {
      value: 'o-que-substitui-vercel-observability',
      question: 'O que substitui Vercel Observability, Speed Insights e Web Analytics?',
      answer:
        'Vercel Observability mapeia para Real-Time Metrics, Real-Time Events e Data Stream. Speed Insights e Web Analytics mapeiam para Edge Pulse e Real-Time Metrics para visibilidade de experiência de usuário e tráfego.'
    },
    {
      value: 'como-os-precos-da-azion',
      question: 'Como os preços da Azion se comparam com os da Vercel para times?',
      answer:
        'A Vercel cobra cada assento adicional de desenvolvedor, e SAML SSO, HIPAA BAA e IPs estáticos são add-ons pagos. A Azion inclui usuários ilimitados e SAML SSO em todos os planos, com preço fixo, sob demanda ou por compromisso para você escolher.'
    },
    {
      value: 'quao-rapido-e-o-suporte',
      question: 'Quão rápido é o suporte da Azion em comparação com o da Vercel?',
      answer:
        'Mesmo no Enterprise da Vercel, um caso crítico tem meta de primeira resposta em 2 horas com o suporte Premium, ou 4 horas úteis com o Standard. No suporte Enterprise e Mission-Critical da Azion, indisponibilidades críticas para o negócio recebem primeira resposta em menos de 15 minutos.'
    },
    {
      value: 'posso-rodar-vercel-e-azion',
      question: 'Posso rodar Vercel e Azion em paralelo?',
      answer:
        'Sim. Você pode reconstruir entrega, funções, storage, segurança, DNS, TLS e observabilidade na Azion enquanto mantém a Vercel ativa, e depois mover domínios de produção gradualmente após a validação.'
    }
  ]
}
