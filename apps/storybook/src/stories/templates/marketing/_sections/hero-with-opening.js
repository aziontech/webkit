const SIX = {
  eyebrow: 'AI Gateway',
  title: 'One gateway for all your AI applications',
  description:
    'Route requests to AI Inference and third-party providers, fall back when a model fails, and keep keys, limits, and usage logs in one place, with no proxy servers to run.',
  items: [
    {
      icon: 'ai ai-azion-api',
      title: 'One endpoint for every model',
      description:
        'Apps send OpenAI-format requests with a model alias. Change the model behind an alias once, and every app follows.'
    },
    {
      icon: 'pi pi-replay',
      title: 'Fallback when a provider fails',
      description:
        'Each alias lists its models in order. When a call errors or times out, the gateway moves to the next one.'
    },
    {
      icon: 'pi pi-key',
      title: 'Provider keys stay server-side',
      description:
        'Provider keys live in secret environment variables. Each team gets its own gateway key, stored only as a SHA-256 hash.'
    },
    {
      icon: 'ai ai-edge-firewall',
      title: 'Abuse blocked before it costs tokens',
      description:
        'Firewall applies WAF, rate limits, and DDoS Protection before requests reach the gateway, so blocked traffic never reaches a model.'
    },
    {
      icon: 'ai ai-tiered-cache',
      title: 'Repeated prompts served from cache',
      description:
        'Callers opt in per request. A matching prompt gets a stored response, with no model call and no tokens spent.'
    },
    {
      icon: 'pi pi-list',
      title: 'Every call on the record',
      description:
        'Each call logs the team, model, fallback, cache result, and tokens used. Stream the logs to your SIEM or data warehouse.'
    }
  ]
}

const THREE = {
  eyebrow: 'Firewall',
  title: 'Programmable firewall for distributed applications',
  description:
    'Protect users, applications, and networks with rules you program, from layer 3 to layer 7.',
  items: [
    {
      icon: 'pi pi-shield',
      title: 'Programmable rule engine',
      description:
        'Define custom rules and behaviors across OSI layers L3-L7 to control traffic before it reaches your applications.'
    },
    {
      icon: 'pi pi-code',
      title: 'Extensible with Functions',
      description:
        'Run custom JavaScript security code and marketplace integrations on Azion’s distributed infrastructure.'
    },
    {
      icon: 'pi pi-sync',
      title: 'Real-time synchronization',
      description:
        'Rules sync automatically across every data center. SIEM integration keeps threat intelligence flowing.'
    }
  ]
}

const ACTIONS = {
  primaryAction: {
    label: 'Start for free',
    href: 'https://console.azion.com/signup/'
  },
  secondaryAction: {
    label: 'Docs',
    href: 'https://www.azion.com/en/documentation/',
    trailing: true
  }
}

export const SIX_SECTION = {
  _id: 'hero-with-opening',
  props: {
    eyebrow: SIX.eyebrow,
    title: SIX.title,
    description: SIX.description,
    ...ACTIONS,
    items: SIX.items
  }
}

export const THREE_SECTION = {
  _id: 'hero-with-opening',
  props: {
    eyebrow: THREE.eyebrow,
    title: THREE.title,
    description: THREE.description,
    ...ACTIONS,
    items: THREE.items
  }
}
