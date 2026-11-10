export const WITH_LINK_SECTION = {
  _id: 'faq-section',
  props: {
    anchor: 'faq',
    title: 'Frequently asked questions',
    items: [
      {
        question: 'What types of storefronts can I build and deploy on Azion?',
        answer:
          'You can build and deploy storefronts, marketplaces, campaign pages, and supporting retail apps. Any web app or website runs on Azion. The platform also covers much of the backend, for static and dynamic workloads on a distributed architecture.'
      },
      {
        question: 'Which frameworks are compatible?',
        answer:
          'Azion is compatible with modern frameworks such as Next.js, React, Vue, Astro, Angular, Nuxt, Svelte, and others, so you can reuse your current stack without a full rewrite. See the full [frameworks compatibility list](/en/documentation/products/devtools/azion-edge-runtime/frameworks-compatibility/).'
      },
      {
        question: 'How do preview deployments work?',
        answer:
          'You can validate storefront changes in preview environments before release, share results across teams, and promote approved versions to production with a controlled workflow.'
      }
    ]
  }
}

export const PLAIN_SECTION = {
  _id: 'faq-section',
  props: {
    anchor: 'faq',
    title: 'Frequently asked questions',
    items: [
      {
        question: 'What are Functions?',
        answer:
          'Azion Functions runs JavaScript and TypeScript in the request flow of an application or a firewall, across 100+ data centers, with no cold starts. A Rules Engine rule calls the function, and it answers with a Response. There is no server to provision or scale.'
      },
      {
        question: 'Are there cold starts?',
        answer:
          'No. Each function runs in a V8 isolate, so the first request performs like every request after it. That matters most for user-facing APIs, authentication and inference.'
      },
      {
        question: 'Which languages and frameworks are supported?',
        answer:
          'JavaScript and TypeScript, plus WebAssembly through the WebAssembly API. The runtime follows web standards such as fetch, Streams and Web Crypto, and can import 68 Node.js modules. azion init ships 25 presets, including Next.js, Nuxt, React, Vue, Astro, Angular, Svelte, Qwik and Hono.'
      }
    ]
  }
}

export const RICH_ANSWERS_SECTION = {
  _id: 'faq-section',
  props: {
    anchor: 'faq',
    title: 'Frequently asked questions',
    items: [
      {
        question: 'What is GDPR?',
        answer:
          "The General Data Protection Regulation (GDPR) is a data privacy law implemented by the European Union. It went into effect on May 25, 2018, and is considered one of the world's leading data privacy legislations.\n\nThe goal of GDPR is to honor the privacy of persons residing in the EU, by protecting their:\n\n- Right to be informed\n- Right of access\n- Right to rectification\n- Right to erasure\n- Right to restriction of processing\n- Right to data portability\n- Right to object\n- Right to avoid automated decision-making"
      },
      {
        question: 'Why is GDPR necessary?',
        answer:
          "A majority of the businesses using Azion either reside in the EU or have customers there. We are honoring our responsibility to comply with the rights of the recipients living in the EU.\n\nGDPR compliance is not only an obligation for Azion, but also for many of the businesses using Azion. Azion's compliance allows even more businesses to build their operations on top of Azion's infrastructure without compromises to privacy or compliance."
      },
      {
        question: 'Who audited Azion?',
        answer:
          'Unlike SOC 2 or ISO 27001, GDPR is not a best practice standard but rather a law. Because of this, most companies self-audit to align their operations and technology with the GDPR controls. Azion followed this approach.\n\nAzion also uses [Vanta](https://vanta.com) to monitor all GDPR controls and organize evidence for compliance.'
      },
      {
        question: 'How do I get a signed DPA?',
        answer:
          'A GDPR Article 28 Data Processing Addendum is in force for every Azion account. It is pre-signed by Azion and fully executed once you sign up, so there is no separate counter-signature step.\n\nYou can download the signed copy from the Documents page (login required). The unsigned reference version is our public DPA.'
      }
    ]
  }
}
