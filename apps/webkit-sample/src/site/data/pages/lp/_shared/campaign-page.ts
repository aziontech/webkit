import { CAMPAIGN_CLIENT_STRIP, CLIENT_STRIP_LABEL } from '@shared/ui/brand/strips.js'

import type { PageSection } from '../../../../ui/sections'
import { CERTIFICATIONS } from '../../../certifications.js'
import { PRODUCT_CLOSING } from '../../../product-pages.js'
import type { LandingPage } from '..'
import { ANALYST_FIRMS as FIRMS } from './analyst-firms.js'
import { caseCard } from './case-card.js'
import { SIGNUP } from './pt-br-forms'

type Props = Record<string, unknown>

type CampaignLang = Exclude<LandingPage['lang'], 'es'>

export interface CampaignPage {
  lang: CampaignLang
  source: string
  /** HeroForm props; a page with no form passes a whole section, such as Heroes. */
  hero: Props & { title: string; section?: string }
  /** ArticleCards props over the shared success cases. */
  cases?: Props
  /** CapabilityGrid props: what the campaign offers. */
  capabilities?: Props
  /** The page's own bands, between the capabilities and the stats. */
  extra?: PageSection[]
  /** RecognitionMarquee props over the shared analyst quotes. */
  analysts?: Props
  /** FaqSection props, right before the close. */
  faq?: Props
}

const PROOF: Record<CampaignLang, Record<string, Props>> = {
  'pt-BR': {
    strip: { carouselLabel: 'Empresas que confiam na Azion' },
    cases: {
      eyebrow: 'Resultados com a Azion',
      title: 'Quando nossos clientes têm sucesso, nós temos sucesso',
      ariaLabel: 'Resultados com a Azion',
      items: [
        caseCard('case-fourbank', {
          title:
            'FourBank protege suas aplicações e APIs contra ataques DDoS adicionando uma camada de segurança programável no Edge',
          meta: 'Tecnologia'
        }),
        caseCard('case-netshoes', {
          title:
            'Netshoes bloqueia automaticamente mais de 4 milhões de ameaças em seis meses utilizando o Azion WAF',
          meta: 'Varejo'
        }),
        caseCard('case-digimais', {
          title:
            'Digimais aprimora segurança bancária digital com o Azion Edge Firewall, protegendo contra ataques DDoS, zero trust e SQL injection.',
          meta: 'Finança'
        })
      ]
    },
    stats: {
      items: [
        {
          value: '35',
          suffix: 'bi',
          label: 'de edge functions executadas mensalmente para controles de segurança'
        },
        { value: '265', suffix: 'bi', label: 'de ataques bloqueados desde 2022' },
        {
          prefix: '+',
          value: '90',
          suffix: '%',
          label: 'das requisições dos clientes atendidas instantaneamente'
        }
      ]
    },
    analysts: {
      eyebrow: 'Reconhecimento de mercado',
      title: 'O que os analistas dizem sobre a Azion',
      ariaLabel: 'O que os analistas dizem sobre a Azion',
      items: [
        {
          text: 'A Azion foi nomeada Líder em CDN e Alto Desempenho em 6 categorias de segurança no G2 Winter 2026 Reports.',
          name: 'G2 Winter 2026 Reports',
          jobTitle: '',
          firm: FIRMS.g2
        },
        {
          text: 'A Azion foi nomeada Líder e identificada como a única plataforma construída especificamente para Edge Computing cujas capacidades atendem todos os critérios-chave descritos no relatório.',
          name: 'Radar GigaOms para Plataformas de Edge.',
          jobTitle: '',
          firm: FIRMS.gigaom
        },
        {
          text: 'Clientes da Gartner afirmam que a Azion se destaca por oferecer uma abordagem consultiva para orquestração e ambientes de aplicação de Edge Computing.',
          name: 'Panorama Competitivo da Gartner para CDN e Serviços de Edge Computing.',
          jobTitle: '',
          firm: FIRMS.gartner
        },
        {
          text: 'A plataforma de Edge Computing da Azion é destacada por aumentar a agilidade dos negócios, capacitando desenvolvedores a construir e escalar suas aplicações.',
          name: 'Prêmio de Melhores Práticas da Frost & Sullivan, Norte.',
          jobTitle: '',
          firm: FIRMS.frost
        }
      ]
    },
    compliance: {
      eyebrow: 'Compliance',
      title: 'Confiança construída com as certificações mais rigorosas do mercado',
      description:
        'A Azion adere a rigorosos padrões de segurança, disponibilidade e privacidade para que os clientes possam adotar nossos serviços com confiança.',
      ariaLabel: 'Certificações de compliance',
      certifications: CERTIFICATIONS,
      more: { label: 'Ver todas certificações', href: '/site/compliance' }
    },
    closing: {
      kind: 'primary',
      title: 'Construa, execute e proteja aplicações em qualquer lugar.',
      description:
        'Lançamentos mais rápidos, menor latência e menos sobrecarga de infraestrutura desde o primeiro dia.',
      actions: [
        { label: 'Comece grátis', href: SIGNUP, kind: 'secondary', external: true },
        { label: 'Docs', href: '/site/docs', kind: 'outlined', trailing: true }
      ]
    }
  },
  en: {
    strip: { carouselLabel: CLIENT_STRIP_LABEL },
    cases: {
      eyebrow: 'Success cases',
      title: 'When our customers succeed, we succeed',
      ariaLabel: 'Success cases',
      items: [
        caseCard('case-fourbank', {
          title: 'FourBank Protects Apps & APIs from DDoS with Azion',
          description:
            'FourBank protects its applications and APIs against DDoS attacks by adding a programmable security layer at the web platform',
          meta: 'Tech'
        }),
        caseCard('case-netshoes', {
          title: 'Netshoes Blocks 4M+ Threats in 6 Months with Azion WAF',
          description:
            'Netshoes automatically blocked more than 4 million threats in six months using Azion WAF',
          meta: 'Retail'
        }),
        caseCard('case-digimais', {
          title: 'Digimais Safeguards Its Digital Bank with Azion Firewall',
          description:
            'Digimais uses Azion’s Firewall to safeguard online access to its digital bank and ensure the highest level of service availability',
          meta: 'Financial'
        })
      ]
    },
    stats: {
      items: [
        {
          value: '35',
          suffix: 'B',
          label: 'edge functions run every month for security controls'
        },
        { value: '265', suffix: 'B', label: 'attacks blocked on the Azion network since 2022' },
        { prefix: '+', value: '90', suffix: '%', label: 'of requests served instantly' }
      ]
    },
    analysts: {
      eyebrow: 'Analysts',
      title: 'What analysts say about Azion',
      ariaLabel: 'What analysts say about Azion',
      items: [
        {
          text: 'Azion is a Leader in CDN & High Performer in 6 security categories in the G2 Winter 2026 Reports.',
          name: 'G2 Winter 2026 Reports',
          jobTitle: '',
          firm: FIRMS.g2
        },
        {
          text: 'Azion was named a Leader and identified as the only purpose-built edge platform whose capabilities meet all of the key criteria outlined in the report.',
          name: 'GigaOm Radar for Edge Platforms',
          jobTitle: '',
          firm: FIRMS.gigaom
        },
        {
          text: 'Gartner clients note that Azion excels at providing a consultative approach to orchestration and serverless edge application environments.',
          name: 'Gartner Competitive Landscape for CDN and Edge Services',
          jobTitle: '',
          firm: FIRMS.gartner
        },
        {
          text: "Frost & Sullivan pointed out that Azion's serverless edge platform increases business agility by empowering developers to build and scale their applications.",
          name: 'Frost & Sullivan Best Practices Award, North',
          jobTitle: '',
          firm: FIRMS.frost
        }
      ]
    },
    compliance: {},
    closing: PRODUCT_CLOSING
  }
}

export const campaignCompliance = (lang: CampaignLang): PageSection => ({
  section: 'ComplianceBadges',
  ...PROOF[lang].compliance
})

export const campaignClosing = (lang: CampaignLang): PageSection => ({
  section: 'ClosingCallToAction',
  ...PROOF[lang].closing
})

const heroOf = (page: CampaignPage): PageSection => {
  if (page.hero.section && page.hero.section !== 'HeroForm') {
    return { ...page.hero, section: page.hero.section }
  }
  const marks = page.hero.carouselMarks as string[] | undefined
  return {
    ...page.hero,
    section: 'HeroForm',
    carouselMarks: marks?.length ? marks : CAMPAIGN_CLIENT_STRIP,
    carouselLabel: page.hero.carouselLabel || PROOF[page.lang].strip.carouselLabel
  }
}

export const campaignPage = (page: CampaignPage): LandingPage => {
  const proof = PROOF[page.lang]
  return {
    lang: page.lang,
    source: page.source,
    sections: [
      heroOf(page),
      { section: 'ArticleCards', kind: 'centered', ...proof.cases, ...page.cases },
      ...(page.capabilities ? [{ section: 'CapabilityGrid', ...page.capabilities }] : []),
      ...(page.extra ?? []),
      { section: 'StatsBand', ...proof.stats },
      { section: 'RecognitionMarquee', ...proof.analysts, ...page.analysts },
      campaignCompliance(page.lang),
      ...(page.faq ? [{ section: 'FaqSection', ...page.faq }] : []),
      campaignClosing(page.lang)
    ]
  }
}
