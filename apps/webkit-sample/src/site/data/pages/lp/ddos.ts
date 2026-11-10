import type { LandingPage } from '.'
import { campaignClosing, campaignCompliance } from './_shared/campaign-page'
import { caseCard } from './_shared/case-card.js'
import { pageSpecialistForm } from './_shared/pt-br-forms'

const CASES = 'https://www.azion.com/pt-br/casos-de-sucesso/'

const successCase = (key: string, slug: string, title: string, meta: string) => ({
  ...caseCard(key, { title, meta }),
  href: `${CASES}${slug}/`,
  external: true,
  actionLabel: 'Ver caso de sucesso'
})

const page: LandingPage = {
  lang: 'pt-BR',
  source: 'https://www.azion.com/pt-br/lp/ddos/',
  sections: [
    {
      section: 'HeroForm',
      eyebrow: 'Azion DDoS Protection',
      title: 'Proteção DDoS Gratuita e Ilimitada',
      description:
        'Proteja-se contra qualquer tamanho de ataque DDoS sem custo adicional, mantendo seus serviços online sempre seguros e acessíveis.',
      ...pageSpecialistForm('Obtenha defesa avançada contra DDoS')
    },
    {
      section: 'CapabilityGrid',
      eyebrow: 'DDoS Protection',
      title: 'Proteção contra ataques DDoS',
      description:
        'Proteção DDoS aprovada por especialistas em segurança de bancos, e-commerces, tecnologia e de outros setores.',
      columns: 4,
      items: [
        {
          icon: 'pi pi-check',
          title: 'Detecção e mitigação avançadas',
          description:
            'Proteção DDoS completa nas camadas de rede, transporte, apresentação e aplicação contra ataques multicamadas em evolução no edge da rede.'
        },
        {
          icon: 'pi pi-check',
          title: 'Flexibilidade',
          description:
            'Proteção para os seus sites, aplicações, APIs e redes, sejam elas hospedadas em ambientes multi-cloud, on-premises ou híbridos.'
        },
        {
          icon: 'pi pi-check',
          title: 'Ajustado automaticamente',
          description:
            'A rede definida por software da Azion detecta e bloqueia instantaneamente o tráfego malicioso, com 100% de garantia estabelecida por SLA.'
        },
        {
          icon: 'pi pi-check',
          title: 'Resposta rápida',
          description: 'Apoio e experiência de missão crítica antes, durante e após um ataque.'
        }
      ]
    },
    {
      section: 'StatsBand',
      eyebrow: 'RESULTADOS COM A AZION',
      title: 'Quando nossos clientes têm sucesso, nós temos sucesso',
      actions: [{ label: 'Ver casos de sucesso', href: CASES, kind: 'text', trailing: true }],
      items: [
        { value: '100%', label: 'de disponibilidade garantida por SLA' },
        { value: '265 bi', label: 'ataques bloqueados desde 2022' },
        { value: '<5 seg', label: 'para ativação da proteção de DDoS' }
      ]
    },
    {
      section: 'ArticleCards',
      kind: 'left',
      ariaLabel: 'Quando nossos clientes têm sucesso, nós temos sucesso',
      items: [
        successCase(
          'case-fourbank',
          'fourbank',
          'FourBank protege suas aplicações e APIs contra ataques DDoS adicionando uma camada de segurança programável no Edge',
          'Tecnologia'
        ),
        successCase(
          'case-netshoes',
          'netshoes',
          'Netshoes bloqueia automaticamente mais de 4 milhões de ameaças em seis meses utilizando o Azion WAF',
          'Varejo'
        ),
        successCase(
          'case-digimais',
          'digimais',
          'Digimais aprimora segurança bancária digital com o Azion Edge Firewall, protegendo contra ataques DDoS, zero trust e SQL injection.',
          'Finança'
        )
      ]
    },
    campaignCompliance('pt-BR'),
    campaignClosing('pt-BR')
  ]
}

export default page
