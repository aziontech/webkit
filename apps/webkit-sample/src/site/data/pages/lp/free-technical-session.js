import frost from '@aziontech/webkit/assets/frost-and-sullivan-extended-color.svg'
import frostReversed from '@aziontech/webkit/assets/frost-and-sullivan-extended-reversed.svg'
import g2 from '@aziontech/webkit/assets/g2-symbol-color.svg'
import gartner from '@aziontech/webkit/assets/gartner-extended-color.svg'
import gartnerReversed from '@aziontech/webkit/assets/gartner-extended-reversed.svg'
import gigaom from '@aziontech/webkit/assets/gigaom-extended-color.svg'
import gigaomReversed from '@aziontech/webkit/assets/gigaom-extended-reversed.svg'

import { gatedForm } from './_shared/gated-form.js'

const FORM_TITLE = 'Preencha as informações abaixo para uma conversa exclusiva'

const STACKS_NOTE =
  'Antes de qualquer recomendação, precisamos entender sua infraestrutura e stacks atuais'

const BLOG = 'https://www.azion.com/pt-br/blog/'

const article = (label, slug) => ({ label, href: `${BLOG}${slug}/`, external: true })

export default {
  lang: 'pt-BR',
  source: 'https://www.azion.com/pt-br/lp/free-technical-session/',
  sections: [
    {
      section: 'HeroForm',
      eyebrow: 'Sessão 1:1 com especialistas da Azion',
      title: 'Sessão técnica gratuita para reduzir custos e performance nas suas aplicações web',
      description:
        'Converse com especialistas da Azion para analisar, em detalhes, como sua aplicação web consome infraestrutura hoje e identificar ajustes que diminuem custos e aumentam velocidade.',
      ...gatedForm(FORM_TITLE)
    },
    {
      section: 'CapabilityGrid',
      title: 'Essa sessão é para empresas que:',
      columns: 4,
      items: [
        { title: 'Têm aplicações web com tráfego (site, e-commerce, app web, API etc.)', description: '' },
        { title: 'Utilizam cloud, data center próprio ou modelo híbrido', description: '' },
        {
          title:
            'Querem reduzir custos de infraestrutura (cloud + física) e ganhar performance, sem reescrever sua aplicação do zero',
          description: ''
        },
        {
          title:
            'Se você ainda não tem uma aplicação web em produção, esta sessão não é para você neste momento',
          description: ''
        }
      ]
    },
    {
      section: 'CapabilityGrid',
      title: 'O que vamos fazer juntos?',
      description: STACKS_NOTE,
      items: [
        {
          icon: 'ai ai-deploy-pillar',
          title: '1. Entender o seu cenário',
          description: 'Analisamos:',
          points: [
            'Como sua aplicação web está hoje (arquitetura, tráfego, picos, regiões de acesso);',
            'Infraestrutura e stacks em uso (cloud, on-premise, colocation, CDNs, WAF, cache, bancos de dados, etc.);',
            'Principais gargalos de custo, latência, disponibilidade e segurança.'
          ]
        },
        {
          icon: 'pi pi-save',
          title: '2. Mapear o fluxo de dados para encontrar desperdícios',
          description: 'Vamos:',
          points: [
            'Mapear o caminho do dado: do armazenamento ao processamento e à entrega para o usuário final;',
            'Identificar desperdícios de tráfego, recursos ociosos, redundâncias e pontos de falha;',
            'Enxergar onde a Azion pode assumir parte do trabalho da sua infraestrutura atual para reduzir custos.'
          ]
        },
        {
          icon: 'ai ai-waf-rules',
          title: '3. Otimizar cache, regras e lógica de entrega',
          description: 'Focamos em:',
          points: [
            'Analisar seu cache hit ratio (eficiência);',
            'Sugerir ajustes em regras, políticas e lógica de cache para otimizar velocidade e custos;',
            'Usar edge, observabilidade e automação para evitar tráfego e processamento desnecessários.'
          ]
        }
      ]
    },
    {
      section: 'CapabilityGrid',
      title: 'O que você leva da sessão?',
      description: STACKS_NOTE,
      items: [
        {
          icon: 'pi pi-book',
          title: 'Diagnóstico objetivo dos principais pontos de desperdício e risco',
          description: ''
        },
        {
          icon: 'pi pi-money-bill',
          title: 'Estimativa de economia baseada no seu cenário real e nas otimizações propostas',
          description: ''
        },
        {
          icon: 'ai ai-digital-certificates',
          title: 'Plano de ação sugerido para reduzir custos de cloud e infraestrutura física',
          description: ''
        }
      ]
    },
    {
      section: 'CapabilityGrid',
      title: 'Como funciona a agenda dessa sessão?',
      items: [
        { icon: 'ai ai-azion', title: 'Você preenche o formulário com acima', description: '' },
        {
          icon: 'pi pi-verified',
          title: 'Nosso time analisa se há fit técnico para gerar valor nessa sessão',
          description: ''
        },
        {
          icon: 'pi pi-link',
          title: 'Estando tudo ok, agendamos sua sessão técnica gratuita com um especialista Azion',
          description: ''
        }
      ]
    },
    {
      section: 'RecognitionMarquee',
      eyebrow: 'Reconhecimento de mercado',
      title: 'O que os especialistas dizem sobre a Azion',
      ariaLabel: 'Reconhecimentos de analistas',
      items: [
        {
          text: 'A Azion recebeu 7 nomeações distintas, conquistando a posição de Leader no relatório de CDN e High Performer em seis categorias de segurança e infraestrutura',
          name: 'G2 Winter 2026 Reports',
          jobTitle: '',
          firm: { name: 'G2', logo: g2, logoLight: g2 },
          action: article('Leia o artigo', 'azion-lider-g2-winter-reports-2026')
        },
        {
          text: 'A Azion foi nomeada Líder e identificada como a única plataforma cujas capacidades atendem todos os critérios-chave descritos no relatório',
          name: 'Radar GigaOms para Plataformas de Edge',
          jobTitle: '',
          firm: { name: 'GigaOm', logo: gigaomReversed, logoLight: gigaom },
          action: article(
            'Ler artigo',
            'azion-reconhecida-lider-de-mercado-fast-mover-relatorio-gigaom'
          )
        },
        {
          text: 'Clientes da Gartner afirmam que a Azion se destaca por oferecer uma abordagem consultiva para orquestração e ambientes de aplicação de Edge Computing',
          name: 'Panorama Competitivo da Gartner para CDN e Serviços de Infraestrutura Distribuída',
          jobTitle: '',
          firm: { name: 'Gartner', logo: gartnerReversed, logoLight: gartner },
          action: article('Ler artigo', 'azion-celebra-conquistas-2023')
        },
        {
          text: 'A plataforma da Azion é destacada por aumentar a agilidade dos negócios, capacitando desenvolvedores a construir e escalar suas aplicações',
          name: 'Prêmio de Melhores Práticas da Frost & Sullivan, Norte',
          jobTitle: '',
          firm: { name: 'Frost & Sullivan', logo: frostReversed, logoLight: frost },
          action: article('Ler artigo', 'azion-premio-frost-sullivan')
        }
      ]
    },
    {
      section: 'ClosingCallToAction',
      kind: 'panel',
      eyebrow: 'Muito Importante',
      title: 'O que a Azion NÃO é?',
      description:
        'Não vendemos cloud. Trabalhamos junto à sua infraestrutura existente, na borda, para tornar tudo mais eficiente e barato.'
    }
  ]
}
