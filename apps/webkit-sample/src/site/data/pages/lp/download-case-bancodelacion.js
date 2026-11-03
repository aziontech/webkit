import { downloadCasePage } from './_shared/download-case.js'

export default {
  lang: 'pt-BR',
  source: 'https://www.azion.com/pt-br/lp/download-case-bancodelacion/',
  sections: downloadCasePage({
    title: 'Como o Banco de la Nación acelerou serviços digitais e reduziu custos',
    description:
      'Estudo de caso que revela as decisões técnicas e de processo que reduziram latência, aumentaram disponibilidade e protegeram transações em picos de uso com infraestrutura distribuída',
    bandTitle: 'Velocidade e economia que tornam o digital competitivo',
    learn: [
      'Aprenda a identificar gargalos em canais bancários, reduzir custos com cache/roteamento e proteger aplicações sem perder velocidade.',
      'Indicado para diretores de TI, gerentes digitais e product owners que precisam escalar serviços bancários com eficiência.',
      'Menos latência e custo aumentam conversão, confiança do usuário e viabilidade operacional.',
      'Mapear tráfego, ativar cache e balanceamento inteligente, aplicar políticas de segurança e medir resultados.'
    ]
  })
}
