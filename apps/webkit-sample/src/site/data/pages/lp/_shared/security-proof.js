export const CLIENTS_ACTION = {
  label: 'Clientes',
  href: 'https://www.azion.com/pt-br/casos-de-sucesso/',
  kind: 'secondary',
  trailing: true
}

const PRODUCTS = 'https://www.azion.com/pt-br/produtos/'
const DOCS = 'https://www.azion.com/pt-br/documentacao/'

const product = (icon, title, description, href) => ({ icon, title, description, href })

export const SECURITY_PRIMITIVES = [
  {
    label: 'Computação',
    items: [
      product(
        'ai ai-edge-functions',
        'Functions',
        'Execute código serverless mais perto dos usuários',
        `${PRODUCTS}functions/`
      ),
      product(
        'ai ai-durable-objects',
        'Durable Objects',
        'Computação stateful, distribuída globalmente',
        `${PRODUCTS}durable-objects/`
      ),
      product(
        'ai ai-rules-engine',
        'Rules Engine',
        'Automatize o tratamento de requisições com regras programáveis',
        `${DOCS}produtos/build/applications/rules-engine/`
      ),
      product(
        'ai ai-load-balancer',
        'Load Balancer',
        'Distribua o tráfego para performance e disponibilidade',
        `${PRODUCTS}load-balancer/`
      ),
      product(
        'ai ai-image-processor',
        'Image Processor',
        'Otimize e transforme imagens em tempo real',
        `${PRODUCTS}image-processor/`
      )
    ]
  },
  {
    label: 'AI',
    items: [
      product(
        'ai ai-edge-ai',
        'AI Inference',
        'Execute modelos de AI mais perto dos usuários',
        `${PRODUCTS}ai-inference/`
      ),
      product(
        'ai ai-ai-gateway',
        'AI Gateway',
        'Proteja, gerencie e otimize o tráfego de AI',
        `${PRODUCTS}ai-gateway/`
      )
    ]
  },
  {
    label: 'Dados',
    items: [
      product(
        'ai ai-edge-storage',
        'Object Storage',
        'Armazenamento escalável e durável para dados não estruturados',
        `${PRODUCTS}object-storage/`
      ),
      product(
        'ai ai-edge-sql',
        'SQL Database',
        'Banco de dados relacional para aplicações distribuídas',
        `${PRODUCTS}sql-database/`
      ),
      product(
        'ai ai-edge-kv',
        'KV Store',
        'Armazenamento chave-valor globalmente distribuído e de baixa latência',
        `${PRODUCTS}kv-store/`
      ),
      product(
        'ai ai-tiered-cache',
        'Cache',
        'Acelere a entrega e reduza a carga na origem',
        `${PRODUCTS}cache/`
      )
    ]
  },
  {
    label: 'Segurança',
    items: [
      product(
        'ai ai-edge-firewall',
        'Web Application Firewall',
        'Proteja aplicações humanas e de AI contra ameaças',
        `${PRODUCTS}web-application-firewall/`
      ),
      product(
        'ai ai-azion-api',
        'API Gateway',
        'Proteja, gerencie e escale o tráfego de APIs',
        `${DOCS}casos-de-uso/proteger-aplicacoes-e-redes/proteger-apis-publicas-contra-abuso/`
      ),
      product(
        'ai ai-bot-manager',
        'Bot Manager',
        'Detecte e bloqueie ameaças automatizadas instantaneamente',
        `${PRODUCTS}bot-manager/`
      ),
      product(
        'ai ai-edge-dns',
        'DNS',
        'Hospede zonas DNS autoritativas com confiabilidade global',
        `${PRODUCTS}edge-dns/`
      )
    ]
  }
]
