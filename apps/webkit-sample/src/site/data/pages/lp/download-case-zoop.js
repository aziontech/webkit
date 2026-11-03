import { downloadCasePage } from './_shared/download-case.js'

export default {
  lang: 'pt-BR',
  source: 'https://www.azion.com/pt-br/lp/download-case-zoop/',
  sections: downloadCasePage({
    title: 'Como a Zoop alcançou performance em escala para pagamentos',
    description:
      'Estudo de caso que revela as decisões técnicas e de processo que reduziram latência, aumentaram disponibilidade e protegeram transações em picos de uso com infraestrutura distribuída.',
    bandTitle: 'Performance que transforma transações em crescimento sustentável',
    learn: [
      'Estratégias práticas — caching inteligente, aceleração de APIs, proteção de tráfego e execução de funções próximas aos usuários — e métricas reais alcançadas.',
      'CTOs, engenheiros de plataforma, líderes de produto e equipes de fintechs ou e‑commerce buscando reduzir abandono e escalar pagamentos.',
      'Porque performance e disponibilidade impactam diretamente conversão, receita e confiança em momentos críticos de pico.',
      'Checklist prático: mapear gargalos, migrar APIs para uma rede distribuída, implementar cache e failover, testar sob carga e monitorar em tempo real.'
    ]
  })
}
