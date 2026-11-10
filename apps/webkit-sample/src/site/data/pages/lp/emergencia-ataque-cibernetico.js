import { campaignPage } from './_shared/campaign-page'
import { PT_BR_FORM_MESSAGES } from './_shared/pt-br-forms'

export default campaignPage({
  lang: 'pt-BR',
  source: 'https://www.azion.com/pt-br/lp/emergencia-ataque-cibernetico/',
  hero: {
    kind: 'incident',
    eyebrow: 'Mitigação de Ataques Cibernéticos',
    title: 'Sua empresa está sob ataque cibernético?',
    description: 'Nossa equipe de segurança digital está disponível para prestar auxílio imediato.',
    highlights: [
      {
        icon: 'pi pi-user',
        title: 'Resposta de Emergência',
        description:
          'Mobilizamos todos os recursos necessários para bloquear o ataque e minimizar danos.'
      },
      {
        icon: 'pi pi-shield',
        title: 'Monitoramento e Análise em Tempo Real',
        description: 'Rastreamos o comportamento do ataque e respondemos de forma eficaz e ágil.'
      },
      {
        icon: 'pi pi-box',
        title: 'Soluções Personalizadas',
        description:
          'Não importa o tipo de ataque—DDoS, ransomware, injeções de código ou qualquer outra ameaça.'
      }
    ],
    formLabel: 'Sua empresa está sob ataque cibernético?',
    country: 'BR',
    labels: {
      firstName: 'Nome',
      lastName: 'Sobrenome',
      email: 'E-mail corporativo',
      company: 'Empresa',
      website: 'Site',
      phone: 'Telefone',
      submit: 'Solicitar contato imediato'
    },
    messages: PT_BR_FORM_MESSAGES
  },
  capabilities: {
    eyebrow: 'Mitigação de ataques',
    title: 'Sua Linha Direta para Mitigação Imediata de Ataques.',
    items: [
      {
        icon: 'pi pi-server',
        title: 'Infraestrutura Resiliente',
        description:
          'Nossas soluções são construídas para escalar automaticamente em resposta ao volume e intensidade do ataque.'
      },
      {
        icon: 'pi pi-shield',
        title: 'Mitigação Proativa',
        description:
          'Além de responder ao ataque em curso, implementamos medidas proativas para prevenir futuras tentativas de violação'
      },
      {
        icon: 'pi pi-headphones',
        title: 'Suporte 24/7',
        description:
          'Nossa equipe de suporte está sempre disponível para orientar, monitorar e ajustar as estratégias de defesa conforme necessário.'
      }
    ]
  }
})
