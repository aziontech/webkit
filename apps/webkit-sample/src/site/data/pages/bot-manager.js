import { markRaw } from 'vue'

import { productWidget } from '../../ui/product-widget'
import {
  PLATFORM_DIRECTORY,
  PRODUCT_DOCS,
  PRODUCT_HERO_ACTIONS,
  PRODUCT_SECURITY_CLOSING
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const BotManagerMetricsFragment = productWidget('bot-manager-metrics')
const BotManagerRuleFragment = productWidget('bot-manager-rule')
const BotManagerTrafficFragment = productWidget('bot-manager-traffic')

const PILLARS = [
  {
    icon: 'pi pi-lock',
    title: 'Stop fraud before it happens',
    description:
      'Block credential stuffing, account takeover, and payment fraud with intent-based detection. Protect customer accounts and cut financial losses.'
  },
  {
    icon: 'pi pi-shield',
    title: 'Defend against brute-force attacks',
    description: 'Scoring and adaptive mitigation make brute-force attacks costly and slow.'
  },
  {
    icon: 'pi pi-eye',
    title: 'Control scraping and crawling',
    description:
      'Stop unauthorized content extraction. Granular policies tell legitimate crawlers from malicious scrapers.'
  }
]

const USE_CASES = [
  {
    icon: 'pi pi-shopping-cart',
    title: 'Stop inventory hoarding and scalping bots',
    description:
      'Detect scalper bots and credential stuffing in real time, keeping checkout open for real customers during flash sales and product drops.',
    href: '/site/solutions/retail'
  },
  {
    icon: 'ai ai-azion-api',
    title: 'Block automated abuse of your APIs and AI Agents',
    description:
      'Detect scripted requests and bot-driven abuse against REST and GraphQL endpoints before they drain compute or expose data.',
    href: '/site/solutions/ai'
  },
  {
    icon: 'pi pi-credit-card',
    title: 'Stop card testing and account takeover',
    description:
      'Detect bots probing stolen cards and credentials on financial apps to cut fraud losses and chargebacks.',
    href: '/site/solutions/financial-services'
  },
  {
    icon: 'pi pi-sitemap',
    title: 'Protect multi-tenant apps at scale',
    description:
      'Apply intent-based bot detection across multi-tenant SaaS environments, with policies that scale automatically as traffic grows.',
    href: '/site/solutions/technology'
  }
]

const FAQ = [
  {
    value: 'what-is',
    question: 'What is Bot Manager and how does it work?',
    answer:
      'Azion Bot Manager is an advanced bot detection and mitigation solution that uses machine learning and Reputation Intelligence to protect applications from automated attacks. It analyzes behavioral parameters per request including device fingerprints, browser signatures, network patterns, and request behaviors. Each request receives a score based on these parameters, and when the score exceeds your defined threshold, Bot Manager executes a predetermined action (allow, deny, redirect, CAPTCHA challenge, etc.). The solution classifies bots by intent — distinguishing between good bots (search engines), bad bots (credential stuffing, scraping), and legitimate human traffic — enabling granular policy enforcement.'
  },
  {
    value: 'vs-traditional',
    question: 'How does Bot Manager differ from traditional bot protection?',
    answer:
      'Traditional bot protection relies on static rules and signature-based detection, which attackers easily bypass. Azion Bot Manager uses intent-based behavioral analysis powered by machine learning. Instead of just identifying bots, Bot Manager determines what each bot is trying to do — credential stuffing, scraping, account takeover, or legitimate crawling. This intent-based approach allows you to apply different policies for different threats. Additionally, Bot Manager analyzes behavioral parameters in real time, continuously learning from attack patterns to improve detection accuracy and reduce false positives.'
  },
  {
    value: 'attack-types',
    question: 'What types of attacks does Bot Manager prevent?',
    answer:
      'Bot Manager protects against a comprehensive range of automated attacks: Credential stuffing: automated login attempts using stolen credentials Account takeover: unauthorized access to user accounts Brute force attacks: systematic password guessing attempts Web scraping: unauthorized content and data extraction Inventory hoarding: automated purchase of limited inventory Payment fraud: automated testing of stolen payment cards Vulnerability scanning: automated probing for security weaknesses API abuse: excessive or malicious API requests The solution uses behavioral modeling to detect both known attack patterns and emerging threats.'
  },
  {
    value: 'deploy-time',
    question: 'How long does it take to deploy Bot Manager?',
    answer:
      'Bot Manager can be deployed in minutes on the Azion platform. The basic setup involves: Enable Bot Manager in your Firewall configuration Configure detection thresholds and mitigation actions Apply the policy to your domains For the comprehensive Bot Manager add-on, contact our Sales team for subscription details. Alternatively, you can start immediately with Bot Manager Lite from the Marketplace. Once deployed, the solution starts protecting your applications immediately, with machine learning models continuously improving detection accuracy over time.'
  },
  {
    value: 'false-positives',
    question: 'Will Bot Manager block legitimate users or good bots?',
    answer:
      'Bot Manager is designed to minimize false positives through advanced machine learning and intent-based classification. The solution automatically identifies good bots (search engines, monitoring tools, social media crawlers) based on verified User-Agents and behavioral patterns, allowing them to proceed while blocking malicious automation. For legitimate human users, Bot Manager analyzes behavioral parameters to distinguish real users from sophisticated bots. You can also integrate the Azion SDK into web and mobile applications to further reduce false positives. Additionally, you can customize thresholds and actions based on your specific business needs and risk tolerance.'
  },
  {
    value: 'mitigation-actions',
    question: 'What mitigation actions are available?',
    answer:
      'Bot Manager offers 7 flexible mitigation actions that you can configure based on threat severity: Allow: permit the request to proceed Deny: return a 403 Forbidden response Drop: terminate the request without response Redirect: send the request to a different URL (including CAPTCHA challenges) Custom HTML: deliver customized HTML content Random delay: introduce 1-10 second delays to increase attack costs Hold connection: keep the connection open for 1 minute before dropping You can apply different actions for different bot types and threat levels, enabling granular control over your security posture.'
  },
  {
    value: 'monitoring',
    question: 'How can I monitor and analyze bot traffic?',
    answer:
      "Bot Manager gives you full visibility through Azion's monitoring tools: Real-Time Metrics: view bot traffic distribution, CAPTCHA solve rates, top attacking IPs, geographic attack origins, and classification breakdowns Real-Time Events: access detailed logs for forensic analysis and pattern identification Data Stream: export logs to your SIEM, big data platforms, or stream processing tools These tools enable you to track attack trends, identify threat sources, calibrate detection rules, and continuously optimize your bot protection policies."
  },
  {
    value: 'customize',
    question: 'Can I customize Bot Manager for my specific needs?',
    answer:
      "Yes. Bot Manager is configurable to match your business requirements: Configure detection thresholds based on your risk tolerance Define different actions for different threat types Disable specific detection rules if they don't apply to your use case Integrate custom Network Lists for IP reputation scoring Use the Azion SDK for enhanced device identification Combine with other Azion security products (WAF, DDoS Protection, Network Shield) You can also use Real-Time Events to observe traffic patterns and calibrate rules before enforcing blocking actions, ensuring optimal protection without impacting legitimate users."
  }
]

export const BOT_MANAGER_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'short',
    eyebrow: 'Bot Manager',
    title: 'Stop bots before they reach your applications',
    description:
      'Detect and stop malicious automation with machine learning, intent classification, and flexible mitigation policies.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: PILLARS },
  {
    section: 'FeatureWidgets',
    anchor: 'built-in',
    eyebrow: 'Built in',
    title: 'Bot defense inside the firewall',
    description:
      'The rule that sends a path to Bot Manager, the classification of every request and the dashboards that track it live in the firewall you already run.',
    actions: PRODUCT_HERO_ACTIONS,
    columns: 3,
    items: [
      {
        icon: 'pi pi-dollar',
        title: 'Reduce infrastructure costs',
        description:
          'Block automated traffic before it reaches your origin and cut bandwidth, compute, and operating costs.',
        scene: { component: markRaw(BotManagerRuleFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-users',
        title: 'Preserve legitimate user experience',
        description:
          'Tell humans and good bots apart from malicious automation to keep false positives low.',
        scene: { component: markRaw(BotManagerTrafficFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-chart-bar',
        title: 'See bot traffic as it happens',
        description:
          'Track bot behavior and attack trends in real time, and tune your defenses as they change.',
        scene: { component: markRaw(BotManagerMetricsFragment) },
        href: PRODUCT_DOCS
      }
    ]
  },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    bands: [
      {
        title: 'Detect bots with precision',
        description:
          'Detect bots in real time with machine learning that evaluates device fingerprints, browser behavior, and network reputation. Use SDKs for web and mobile apps to reduce false positives.',
        href: PRODUCT_DOCS,
        illustration: 'detect-and-classify',
        illustrationLabel: 'Bot Manager classifying traffic as a bad bot, a good bot or a human',
        actions: [{ label: 'Docs', href: PRODUCT_DOCS }]
      },
      {
        title: 'Flexible mitigation actions',
        description:
          'Choose from 7 mitigation actions: block, challenge, rate limit, redirect, custom HTML, random delay, and connection hold. Adjust enforcement by risk level to protect critical flows while preserving legitimate traffic.',
        href: '/site/products/web-application-firewall',
        illustration: 'mitigation-actions',
        illustrationLabel: 'A scored request answered with rate limit, challenge or block',
        actions: [{ label: 'WAF', href: '/site/products/web-application-firewall' }]
      }
    ]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'Protect critical agentic applications and APIs',
    description:
      'Put Bot Manager in front of any login, checkout or API and stop malicious automation on Azion’s distributed infrastructure, before it reaches your origin. Teams use it to:',
    action: { label: 'Docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('magalu') },
  PLATFORM_DIRECTORY,
  { section: 'FaqSection', items: FAQ },
  PRODUCT_SECURITY_CLOSING
]
