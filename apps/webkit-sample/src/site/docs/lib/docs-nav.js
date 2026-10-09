import { menuLeaves, menuPath } from '@shared/lib/menu-tree.js'

export const docsNavSections = [
  {
    label: 'Getting Started',
    items: [
      {
        id: 'overview',
        label: 'Overview',
        href: '/site/docs'
      },
      {
        id: 'fundamentals',
        label: 'Fundamentals',
        kind: 'drill',
        href: '/site/docs/fundamentals',
        groups: [
          {
            label: 'Fundamentals',
            items: [
              {
                id: 'fundamentals-overview',
                label: 'Overview',
                href: '/site/docs/fundamentals'
              },
              {
                id: 'fundamentals-how-it-works',
                label: 'How Azion works'
              },
              {
                id: 'fundamentals-get-started',
                label: 'Get started',
                children: [
                  {
                    id: 'fundamentals-creating-account',
                    label: 'Create an account'
                  },
                  {
                    id: 'fundamentals-first-deploy',
                    label: 'First deploy',
                    href: '/site/docs/first-deploy'
                  },
                  {
                    id: 'fundamentals-migrate-to-azion',
                    label: 'Migrate to Azion'
                  }
                ]
              },
              {
                id: 'fundamentals-management',
                label: 'Management',
                children: [
                  {
                    id: 'fundamentals-accounts-teams-and-users',
                    label: 'Accounts, teams, and users'
                  },
                  {
                    id: 'fundamentals-management-accounts',
                    label: 'Accounts',
                    children: [
                      {
                        id: 'fundamentals-account-settings',
                        label: 'Account Settings'
                      },
                      {
                        id: 'fundamentals-accounts',
                        label: 'Accounts'
                      },
                      {
                        id: 'fundamentals-activity-history',
                        label: 'Activity History'
                      },
                      {
                        id: 'fundamentals-your-settings',
                        label: 'Your Settings'
                      }
                    ]
                  },
                  {
                    id: 'fundamentals-management-members-and-permissions',
                    label: 'Members and permissions',
                    children: [
                      {
                        id: 'fundamentals-teams-permissions',
                        label: 'Teams Permissions'
                      },
                      {
                        id: 'fundamentals-users-management',
                        label: 'Users Management'
                      }
                    ]
                  }
                ]
              },
              {
                id: 'fundamentals-billing',
                label: 'Billing',
                children: [
                  {
                    id: 'fundamentals-billing-and-subscriptions',
                    label: 'Billing'
                  },
                  {
                    id: 'fundamentals-pricing',
                    label: 'Pricing'
                  }
                ]
              },
              {
                id: 'fundamentals-security',
                label: 'Security',
                children: [
                  {
                    id: 'fundamentals-multi-factor-authentication',
                    label: 'Multi-Factor Authentication'
                  },
                  {
                    id: 'fundamentals-single-sign-on',
                    label: 'Single Sign-On'
                  },
                  {
                    id: 'fundamentals-social-login',
                    label: 'Social Login'
                  },
                  {
                    id: 'fundamentals-personal-tokens',
                    label: 'Personal Tokens'
                  },
                  {
                    id: 'fundamentals-account-lockout-policy',
                    label: 'Account Lockout Policy'
                  },
                  {
                    id: 'fundamentals-user-session-timeout',
                    label: 'User Session Timeout'
                  },
                  {
                    id: 'fundamentals-security-compliance',
                    label: 'Compliance',
                    children: [
                      {
                        id: 'fundamentals-pci-dss-certification',
                        label: 'PCI Compliance'
                      },
                      {
                        id: 'fundamentals-soc',
                        label: 'SOC Compliance'
                      },
                      {
                        id: 'fundamentals-shared-responsibility',
                        label: 'Shared Responsibility Model'
                      }
                    ]
                  }
                ]
              },
              {
                id: 'fundamentals-performance',
                label: 'Performance',
                children: [
                  {
                    id: 'fundamentals-test-speed',
                    label: 'Test speed'
                  },
                  {
                    id: 'fundamentals-minimize-downtime',
                    label: 'Minimize downtime'
                  },
                  {
                    id: 'fundamentals-maintenance-mode',
                    label: 'Maintenance mode'
                  }
                ]
              },
              {
                id: 'fundamentals-reference',
                label: 'Reference',
                children: [
                  {
                    id: 'fundamentals-http-status-codes',
                    label: 'HTTP status codes'
                  },
                  {
                    id: 'fundamentals-api-v4-migration',
                    label: 'API v4 Migration'
                  }
                ]
              },
              {
                id: 'fundamentals-agent-resources',
                label: 'Agent resources',
                children: [
                  {
                    id: 'fundamentals-agent-resources-agent-setup',
                    label: 'Agent Setup',
                    ref: true,
                    href: '/site/docs/agent-setup'
                  },
                  {
                    id: 'fundamentals-llms-txt',
                    label: 'llms.txt'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'agent-setup',
        label: 'Agent Setup',
        kind: 'drill',
        href: '/site/docs/agent-setup',
        groups: [
          {
            label: 'Agent Setup',
            items: [
              {
                id: 'agent-setup-overview',
                label: 'About Agent Setup',
                href: '/site/docs/agent-setup'
              },
              {
                id: 'agent-setup-claude-code',
                label: 'Claude Code',
                href: '/site/docs/agent-setup/claude-code'
              },
              {
                id: 'agent-setup-cursor',
                label: 'Cursor',
                href: '/site/docs/agent-setup/cursor'
              },
              {
                id: 'agent-setup-github-copilot',
                label: 'GitHub Copilot',
                href: '/site/docs/agent-setup/github-copilot'
              },
              {
                id: 'agent-setup-windsurf',
                label: 'Windsurf',
                href: '/site/docs/agent-setup/windsurf'
              },
              {
                id: 'agent-setup-codex',
                label: 'Codex',
                href: '/site/docs/agent-setup/codex'
              },
              {
                id: 'agent-setup-gemini-cli',
                label: 'Gemini CLI',
                href: '/site/docs/agent-setup/gemini-cli'
              },
              {
                id: 'agent-setup-opencode',
                label: 'OpenCode',
                href: '/site/docs/agent-setup/opencode'
              },
              {
                id: 'agent-setup-claude-desktop',
                label: 'Claude Desktop'
              },
              {
                id: 'agent-setup-warp',
                label: 'Warp'
              },
              {
                id: 'agent-setup-kiro',
                label: 'Kiro'
              }
            ]
          }
        ]
      },
      {
        id: 'use-cases',
        label: 'Use Cases',
        kind: 'drill',
        href: '/site/docs/use-cases',
        groups: [
          {
            label: 'Guides',
            items: [
              {
                id: 'guides',
                label: 'Overview',
                href: '/site/docs/use-cases'
              },
              {
                id: 'use-cases-build-and-run-applications',
                label: 'Build and run applications',
                children: [
                  {
                    id: 'use-cases-build-and-run-applications-getting-started',
                    label: 'Getting started',
                    children: [
                      {
                        id: 'guides-application-development-getting-started-work-with-rules-engine',
                        label: 'Create an application rule'
                      },
                      {
                        id: 'guides-application-development-getting-started-generate-rules-engine-rules-with-mcp',
                        label: 'Create Rules Engine rules with the MCP server'
                      },
                      {
                        id: 'guides-application-development-getting-started-build-an-application',
                        label: 'Enable Products on an application'
                      },
                      {
                        id: 'guides-application-development-getting-started-configure-ports',
                        label: 'Configure HTTP and HTTPS ports'
                      },
                      {
                        id: 'guides-application-development-getting-started-rules-engine',
                        label: 'Create request and response rules'
                      },
                      {
                        id: 'guides-application-development-getting-started-cross-origin-resource-sharing-cors',
                        label: 'Enable CORS on an application'
                      },
                      {
                        id: 'guides-application-development-getting-started-crossdomain-error-in-jw-player',
                        label: 'Troubleshoot crossdomain errors in JW Player'
                      },
                      {
                        id: 'guides-application-development-getting-started-hosting-edge-website',
                        label: 'Serve a status page from a function'
                      },
                      {
                        id: 'guides-application-development-getting-started-clone-applications',
                        label: 'Clone an application'
                      },
                      {
                        id: 'guides-application-development-getting-started-configure-main-settings',
                        label: 'How to configure main settings'
                      },
                      {
                        id: 'guides-application-development-getting-started-create-azion-custom-domain',
                        label: 'Create an Azion custom domain'
                      },
                      {
                        id: 'guides-application-development-getting-started-create-device-groups',
                        label: 'Create device groups'
                      },
                      {
                        id: 'guides-application-development-getting-started-customizing-error-response-page',
                        label: 'Customize an error page'
                      },
                      {
                        id: 'guides-application-development-getting-started-debug-rules',
                        label: 'Debug rules created with Rules Engine'
                      },
                      {
                        id: 'guides-application-development-getting-started-work-with-origins',
                        label: 'Connect an application to an origin'
                      },
                      {
                        id: 'guides-application-development-getting-started-sign-origin-requests-with-hmac',
                        label: 'Sign origin requests with HMAC'
                      },
                      {
                        id: 'guides-application-development-getting-started-set-the-host-header-and-path-prefix',
                        label: 'Set the Host header and path'
                      },
                      {
                        id: 'guides-application-development-getting-started-delete-applications',
                        label: 'Delete an application'
                      },
                      {
                        id: 'guides-application-development-getting-started-cors-errors',
                        label: 'Troubleshoot CORS policy errors'
                      },
                      {
                        id: 'guides-application-development-getting-started-instantiate-functions',
                        label: 'Instantiate a function on an application'
                      },
                      {
                        id: 'guides-application-development-getting-started-mitigating-a-vulnerability-httpoxy',
                        label: 'Mitigate the HTTPoxy vulnerability'
                      },
                      {
                        id: 'guides-application-development-getting-started-set-error-pages',
                        label: 'How to set error pages'
                      },
                      {
                        id: 'guides-application-development-getting-started-stage-applications-through-hosts-file',
                        label: 'Test an application through the hosts file'
                      }
                    ]
                  },
                  {
                    id: 'use-cases-build-and-run-applications-frameworks',
                    label: 'Frameworks',
                    children: [
                      {
                        id: 'guides-application-development-frameworks-htmx-boilerplate',
                        label: 'Deploy & Test HTMX on the Edge'
                      },
                      {
                        id: 'guides-application-development-frameworks-webpage-to-pdf-resume',
                        label: 'Deploy a Resume with Webpage to PDF'
                      },
                      {
                        id: 'guides-application-development-frameworks-butter-templates-collection',
                        label: 'Deploy a Web App with ButterCMS Templates'
                      },
                      {
                        id: 'guides-application-development-frameworks-clean-astro-sanity',
                        label: 'Deploy a Web App with Clean Astro + Sanity'
                      },
                      {
                        id: 'guides-application-development-frameworks-vuepress-templates-collection',
                        label: 'Deploy a Web App with VuePress Templates'
                      },
                      {
                        id: 'guides-application-development-frameworks-astro-ecommerce-collection',
                        label: 'Deploy an E-commerce with Astro Templates'
                      },
                      {
                        id: 'guides-application-development-frameworks-book-store-react',
                        label: 'Deploy an E-commerce with Book Store React'
                      },
                      {
                        id: 'guides-application-development-frameworks-eleventy-ecommerce-collection',
                        label: 'Deploy an E-commerce with Eleventy Templates'
                      },
                      {
                        id: 'guides-application-development-frameworks-gatsby-ecommerce-theme',
                        label: 'Deploy an E-commerce with Gatsby Theme'
                      },
                      {
                        id: 'guides-application-development-frameworks-hugo-ecommerce-collection',
                        label: 'Deploy an E-commerce with Hugo Templates'
                      },
                      {
                        id: 'guides-application-development-frameworks-jekyll-ecommerce-collection',
                        label: 'Deploy an E-commerce with Jekyll Templates'
                      },
                      {
                        id: 'guides-application-development-frameworks-next-js-ecommerce-collection',
                        label: 'Deploy an E-commerce with Next.js Templates'
                      },
                      {
                        id: 'guides-application-development-frameworks-devscard',
                        label: 'Deploy an Online Resume with DevsCard'
                      },
                      {
                        id: 'guides-application-development-frameworks-cosmic-simple-astro-blog',
                        label: 'Deploy Apps with Cosmic Simple Astro Blog'
                      },
                      {
                        id: 'guides-application-development-frameworks-cosmic-simple-next-blog',
                        label: 'Deploy Apps with Cosmic Simple Next.js Blog'
                      },
                      {
                        id: 'guides-application-development-frameworks-cosmic-agency-website',
                        label: 'Deploy Apps with CosmicJS Agency Website'
                      },
                      {
                        id: 'guides-application-development-frameworks-nextjs-static-boilerplate',
                        label: 'Deploy Apps with Next.js Static Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-preact-javascript-boilerplate',
                        label: 'Deploy Apps with Preact JavaScript Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-preact-typescript-boilerplate',
                        label: 'Deploy Apps with Preact TypeScript Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-angular-boilerplate',
                        label: 'Deploy Apps with the Angular Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-sqldatabase-starter-kit',
                        label: 'Deploy the SQL Database Starter Kit'
                      },
                      {
                        id: 'guides-application-development-frameworks-gatsby-boilerplate',
                        label: 'Deploy Apps with the Gatsby Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-qwik-minimal',
                        label: 'Deploy Apps with the Qwik Minimal Template'
                      },
                      {
                        id: 'guides-application-development-frameworks-stencil-boilerplate',
                        label: 'Deploy Apps with the Stencil Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-vue-vite-boilerplate',
                        label: 'Deploy Apps with the Vue3/Vite Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-neon-database-with-drizzle',
                        label: 'Deploy Neon Database Kit with Drizzle ORM'
                      },
                      {
                        id: 'guides-application-development-frameworks-dynamic-and-static-file-optimization-template',
                        label: 'Deploy the File Optimization Template'
                      },
                      {
                        id: 'guides-application-development-frameworks-upstash-rate-limiting',
                        label: 'Deploy the Upstash Rate Limit Template'
                      },
                      {
                        id: 'guides-application-development-frameworks-tidb-with-drizzle',
                        label: 'Deploy TiDB Starter Kit with Drizzle ORM'
                      },
                      {
                        id: 'guides-application-development-frameworks-turso-with-drizzle',
                        label: 'Deploy Turso Starter Kit with Drizzle ORM'
                      },
                      {
                        id: 'guides-application-development-frameworks-wordpress-edgeaccelerator',
                        label: 'Enhance WordPress with EdgeAccelerator'
                      },
                      {
                        id: 'guides-application-development-frameworks-get-started',
                        label: 'Get Started With OpenNext'
                      },
                      {
                        id: 'guides-application-development-frameworks-bot-manager-lite-and-tor-block-starter-kit',
                        label: 'Block bots and Tor exit nodes with a template'
                      },
                      {
                        id: 'guides-application-development-frameworks-angular',
                        label: 'Build with Angular'
                      },
                      {
                        id: 'guides-application-development-frameworks-astro',
                        label: 'Build with Astro'
                      },
                      {
                        id: 'guides-application-development-frameworks-docusaurus',
                        label: 'Build with Docusaurus'
                      },
                      {
                        id: 'guides-application-development-frameworks-eleventy',
                        label: 'Build with Eleventy'
                      },
                      {
                        id: 'guides-application-development-frameworks-gatsby',
                        label: 'Build with Gatsby'
                      },
                      {
                        id: 'guides-application-development-frameworks-hexo',
                        label: 'Build with Hexo'
                      },
                      {
                        id: 'guides-application-development-frameworks-hono',
                        label: 'Build with Hono'
                      },
                      {
                        id: 'guides-application-development-frameworks-hugo',
                        label: 'Build with Hugo'
                      },
                      {
                        id: 'guides-application-development-frameworks-jekyll',
                        label: 'Build with Jekyll'
                      },
                      {
                        id: 'guides-application-development-frameworks-next',
                        label: 'Build with Next.js'
                      },
                      {
                        id: 'guides-application-development-frameworks-nextal',
                        label: 'Build with Nextal'
                      },
                      {
                        id: 'guides-application-development-frameworks-react',
                        label: 'Build with React'
                      },
                      {
                        id: 'guides-application-development-frameworks-svelte',
                        label: 'Build with Svelte'
                      },
                      {
                        id: 'guides-application-development-frameworks-vite',
                        label: 'Build with VitePress'
                      },
                      {
                        id: 'guides-application-development-frameworks-vue',
                        label: 'Build with Vue'
                      },
                      {
                        id: 'guides-application-development-frameworks-data-stream-custom-template',
                        label: 'Create a custom template'
                      },
                      {
                        id: 'guides-application-development-frameworks-gatsby-blog-starter-kit',
                        label: 'How to deploy a blog based on Gatsby using a template'
                      },
                      {
                        id: 'guides-application-development-frameworks-astro-blog-starter-kit',
                        label: 'How to deploy an Astro blog using a template'
                      },
                      {
                        id: 'guides-application-development-frameworks-astro-boilerplate',
                        label: 'Deploy the Astro Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-hexo-boilerplate',
                        label: 'Deploy the Hexo Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-qwik-boilerplate',
                        label: 'Deploy the Qwik Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-react-boilerplate',
                        label: 'Deploy the React Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-vue-boilerplate',
                        label: 'Deploy the Vue Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-ai-inference-starter-kit',
                        label: 'Deploy the AI Inference Starter Kit template'
                      },
                      {
                        id: 'guides-application-development-frameworks-edge-application-proxy-template',
                        label: 'Deploy the Applications Proxy template'
                      },
                      {
                        id: 'guides-application-development-frameworks-azion-starter-kit',
                        label: 'How to deploy the Azion Starter Kit'
                      },
                      {
                        id: 'guides-application-development-frameworks-docusaurus-javascript-boilerplate',
                        label: 'How to deploy the Docusaurus JavaScript Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-docusaurus-typescript-boilerplate',
                        label: 'How to deploy the Docusaurus TypeScript Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-function-starter-kit',
                        label: 'Deploy the Function Starter Kit template'
                      },
                      {
                        id: 'guides-application-development-frameworks-hugo-boilerplate',
                        label: 'How to deploy the Hugo Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-image-optimization-template',
                        label: 'Deploy the Image Optimization template'
                      },
                      {
                        id: 'guides-application-development-frameworks-jekyll-boilerplate',
                        label: 'How to deploy the Jekyll Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-langgraph-ai-agent-boilerplate',
                        label: 'How to deploy the LangGraph AI Agent Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-mongodb-atlas',
                        label: 'How to deploy the MongoDB Atlas Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-nuxt-static-boilerplate',
                        label: 'How to deploy the Nuxt 3 Static Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-nuxt-content',
                        label: 'How to deploy the Nuxt Content template'
                      },
                      {
                        id: 'guides-application-development-frameworks-nuxt-notes',
                        label: 'How to deploy the Nuxt Notes template'
                      },
                      {
                        id: 'guides-application-development-frameworks-static-cache-template',
                        label: 'Deploy the Static Cache template'
                      },
                      {
                        id: 'guides-application-development-frameworks-vitepress-javascript-boilerplate',
                        label: 'How to deploy the VitePress JavaScript Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-vitepress-typescript-boilerplate',
                        label: 'How to deploy the VitePress TypeScript Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-vuepress-boilerplate',
                        label: 'How to deploy the VuePress Boilerplate'
                      },
                      {
                        id: 'guides-application-development-frameworks-bot-manager-lite-starter-kit',
                        label: 'Test Bot Manager Lite with the Starter Kit'
                      },
                      {
                        id: 'guides-application-development-frameworks-upstash-geolocation-edgedeploy',
                        label: 'How to use Upstash GeoLocation through Azion'
                      },
                      {
                        id: 'guides-application-development-frameworks-troubleshooting',
                        label: 'Troubleshoot an OpenNext application'
                      },
                      {
                        id: 'guides-application-development-frameworks-qstash-function-scheduler',
                        label: 'Use the QStash Function Scheduler'
                      }
                    ]
                  },
                  {
                    id: 'use-cases-build-and-run-applications-functions-and-runtime',
                    label: 'Functions and runtime',
                    children: [
                      {
                        id: 'guides-application-development-functions-and-runtime-restful-tasks-api-functions',
                        label: 'Build a RESTful tasks API'
                      },
                      {
                        id: 'guides-application-development-functions-and-runtime-firewall',
                        label: 'Run a function on a firewall'
                      },
                      {
                        id: 'guides-application-development-functions-and-runtime-webassembly-on-azion-platform',
                        label: 'Create a function with WebAssembly'
                      },
                      {
                        id: 'guides-application-development-functions-and-runtime-first-steps',
                        label: 'Write and test a function'
                      },
                      {
                        id: 'guides-application-development-functions-and-runtime-browserless-functions',
                        label: 'Build a screenshot API with Functions and Browserless'
                      },
                      {
                        id: 'guides-application-development-functions-and-runtime-api-builder',
                        label: 'Build an API function with ChatGPT'
                      },
                      {
                        id: 'guides-application-development-functions-and-runtime-debugging-functions-graphql',
                        label: 'Query function logs with GraphQL API'
                      },
                      {
                        id: 'guides-application-development-functions-and-runtime-stripe-webhooks-functions',
                        label: 'Build a Stripe webhook handler with Functions'
                      },
                      {
                        id: 'guides-application-development-functions-and-runtime-resend-email-functions',
                        label: 'Send transactional email with Resend and Functions'
                      },
                      {
                        id: 'guides-application-development-functions-and-runtime-serverless-functions',
                        label: 'Run a function on an application'
                      },
                      {
                        id: 'guides-application-development-functions-and-runtime-paywall-function-jwt',
                        label: 'Set up a paywall with the JWT function'
                      },
                      {
                        id: 'guides-application-development-functions-and-runtime-test-origin-with-functions',
                        label: 'Mirror production traffic to a test origin with Functions'
                      },
                      {
                        id: 'guides-application-development-functions-and-runtime-altcha',
                        label: 'Protect a route with an ALTCHA challenge'
                      },
                      {
                        id: 'guides-application-development-functions-and-runtime-file-upload-functions',
                        label: 'Implement file upload with Functions'
                      },
                      {
                        id: 'guides-application-development-functions-and-runtime-migrate-handler-patterns',
                        label: 'Migrate handler patterns in Functions'
                      },
                      {
                        id: 'guides-application-development-functions-and-runtime-deploy-function-with-cli',
                        label: 'Deploy a function with Azion CLI'
                      },
                      {
                        id: 'guides-application-development-functions-and-runtime-use-polyfills',
                        label: 'Use Node.js APIs through polyfills'
                      },
                      {
                        id: 'guides-application-development-functions-and-runtime-cache-a-function-response-with-the-cache-api',
                        label: "Cache a function's response with the Cache API"
                      },
                      {
                        id: 'guides-application-development-functions-and-runtime-run-a-function-on-one-path-and-roll-it-back',
                        label: 'Run a function on one path, and roll it back'
                      }
                    ]
                  },
                  {
                    id: 'use-cases-build-and-run-applications-data',
                    label: 'Data',
                    children: [
                      {
                        id: 'guides-application-development-data-create-and-modify-bucket',
                        label: 'Create a bucket'
                      },
                      {
                        id: 'guides-application-development-data-create-tables-sql-database',
                        label: 'Create tables and query data'
                      },
                      {
                        id: 'guides-application-development-data-sql-database-vector-search',
                        label: 'Build a semantic search with vector embeddings'
                      },
                      {
                        id: 'guides-application-development-data-import-data-sql-database',
                        label: 'Import data with the EdgeSQL Shell'
                      },
                      {
                        id: 'guides-application-development-data-install-edge-sql-shell',
                        label: 'Install the EdgeSQL Shell'
                      },
                      {
                        id: 'guides-application-development-data-manage-sql-database',
                        label: 'Create and manage databases'
                      },
                      {
                        id: 'guides-application-development-data-manage-with-functions',
                        label: 'Manage key-value data from a function'
                      },
                      {
                        id: 'guides-application-development-data-redis-compatibility',
                        label: 'Use KV Store with a Redis-compatible client'
                      },
                      {
                        id: 'guides-application-development-data-auth-layer-object-storage-functions',
                        label: 'Authenticate requests with Functions'
                      },
                      {
                        id: 'guides-application-development-data-retrieve-data-with-functions',
                        label: 'Query a database from a function'
                      },
                      {
                        id: 'guides-application-development-data-upload-and-download-objects-from-bucket',
                        label: 'Upload and download objects'
                      },
                      {
                        id: 'guides-application-development-data-use-bucket-as-origin',
                        label: 'Use a bucket as an application origin'
                      },
                      {
                        id: 'guides-application-development-data-use-s3-compatible-tools-with-object-storage',
                        label: 'Use S3-compatible tools with Object Storage'
                      },
                      {
                        id: 'guides-application-development-data-write-sql-database-rows-from-a-function',
                        label: 'Write rows to SQL Database from a function'
                      },
                      {
                        id: 'guides-application-development-data-deduplicate-webhook-deliveries-with-kv-store',
                        label: 'Deduplicate webhook deliveries with KV Store'
                      }
                    ]
                  },
                  {
                    id: 'use-cases-build-and-run-applications-integrations',
                    label: 'Integrations',
                    children: [
                      {
                        id: 'guides-application-development-integrations-bot-manager-lite-integration-kit',
                        label: 'Add Bot Manager Lite to a Firewall'
                      },
                      {
                        id: 'guides-application-development-integrations-install-an-integration',
                        label: 'Install an integration'
                      },
                      {
                        id: 'guides-application-development-integrations-update-an-integration',
                        label: 'Update an integration'
                      },
                      {
                        id: 'guides-application-development-integrations-ab-testing-marketplace',
                        label: 'Install the A/B Testing integration'
                      },
                      {
                        id: 'guides-application-development-integrations-add-request-id-header',
                        label: 'Install the Add Request ID integration'
                      },
                      {
                        id: 'guides-application-development-integrations-axur-cardstream',
                        label: 'Install the Cardstream integration'
                      },
                      {
                        id: 'guides-application-development-integrations-bot-manager-lite',
                        label: 'Install Bot Manager Lite'
                      },
                      {
                        id: 'guides-application-development-integrations-content-targeting-integration',
                        label: 'Install the Content Targeting integration'
                      },
                      {
                        id: 'guides-application-development-integrations-datadome-bot-protection',
                        label: 'Install the DataDome Bot Protection integration'
                      },
                      {
                        id: 'guides-application-development-integrations-hello-world',
                        label: 'Install the Hello World integration'
                      },
                      {
                        id: 'guides-application-development-integrations-ip-address-reputation',
                        label: 'Install the IP Address Reputation integration'
                      },
                      {
                        id: 'guides-application-development-integrations-limit-payload-size',
                        label: 'Install the Limit Payload Size integration'
                      },
                      {
                        id: 'guides-application-development-integrations-massive-redirect-integration',
                        label: 'Install the Massive Redirect integration'
                      },
                      {
                        id: 'guides-application-development-integrations-radware-bot-manager',
                        label: 'Install the Radware Bot Manager integration'
                      },
                      {
                        id: 'guides-application-development-integrations-scheduled-blocking',
                        label: 'Install the Scheduled Blocking integration'
                      },
                      {
                        id: 'guides-application-development-integrations-axur-leakstream',
                        label: 'Install the Leakstream integration'
                      },
                      {
                        id: 'guides-application-development-integrations-hcaptcha',
                        label: 'Install the hCaptcha integration'
                      },
                      {
                        id: 'guides-application-development-integrations-ipqs-phone-validation',
                        label: 'Install the Phone Validation integration'
                      },
                      {
                        id: 'guides-application-development-integrations-ipqs-url-validation',
                        label: 'Install the URL Validation integration'
                      },
                      {
                        id: 'guides-application-development-integrations-javascript-tag-js-tag',
                        label: 'Embed the JavaScript tag'
                      },
                      {
                        id: 'guides-application-development-integrations-jwt',
                        label: 'Install the JWT integration'
                      },
                      {
                        id: 'guides-application-development-integrations-recaptcha',
                        label: 'Install the reCAPTCHA integration'
                      },
                      {
                        id: 'guides-application-development-integrations-secure-token',
                        label: 'Install the Secure Token integration'
                      },
                      {
                        id: 'guides-application-development-integrations-upstash-rate-limiting-integration',
                        label: 'Install the Upstash Rate Limiting integration'
                      },
                      {
                        id: 'guides-application-development-integrations-waiting-room',
                        label: 'Install the Upstash Waiting Room integration'
                      },
                      {
                        id: 'guides-application-development-integrations-signed-cookies',
                        label: 'Install the Signed Cookies integration'
                      },
                      {
                        id: 'guides-application-development-integrations-process-request-data-into-headers',
                        label: 'Install the Process Request Data Into Headers integration'
                      },
                      {
                        id: 'guides-application-development-integrations-request-variation-controller',
                        label: 'Install the Request Variation Controller integration'
                      },
                      {
                        id: 'guides-application-development-integrations-send-event-to-endpoint',
                        label: 'Install the Send Event to Endpoint integration'
                      },
                      {
                        id: 'guides-application-development-integrations-send-messages-to-a-queue',
                        label: 'Install the Send messages to a queue integration'
                      },
                      {
                        id: 'guides-application-development-integrations-method-and-route-validator',
                        label: 'Install the Method and Route Validator integration'
                      },
                      {
                        id: 'guides-application-development-integrations-publish-a-message-to-upstash-qstash-from-a-function',
                        label: 'Publish a message to Upstash QStash from a function'
                      }
                    ]
                  },
                  {
                    id: 'use-cases-build-and-run-applications-automation',
                    label: 'Automation',
                    children: [
                      {
                        id: 'guides-application-development-automation-edge-services-first-steps',
                        label: 'Creating an Edge Service'
                      },
                      {
                        id: 'guides-application-development-automation-edge-node-first-steps',
                        label: 'Edge Node first steps'
                      },
                      {
                        id: 'guides-application-development-automation-authorize-an-edge-node',
                        label: 'How to authorize an edge node'
                      },
                      {
                        id: 'guides-application-development-automation-bind-service-node',
                        label: 'How to bind an edge service to an edge node'
                      },
                      {
                        id: 'guides-application-development-automation-create-edge-service',
                        label: 'How to create an edge service'
                      },
                      {
                        id: 'guides-application-development-automation-install-orchestrator-agent',
                        label: 'How to install Orchestrator Agent'
                      },
                      {
                        id: 'guides-application-development-automation-azion-github-app',
                        label: 'Manage the Azion GitHub App'
                      },
                      {
                        id: 'guides-application-development-automation-provision-files',
                        label: 'How to provision files'
                      },
                      {
                        id: 'guides-application-development-automation-run-mcp-server',
                        label: 'Run an MCP server on Azion'
                      },
                      {
                        id: 'guides-application-development-automation-deploy-static-site-with-mcp',
                        label: 'Deploy a static site with the MCP server'
                      },
                      {
                        id: 'guides-application-development-automation-search-azion-docs-with-mcp',
                        label: 'Search Azion docs with the MCP server'
                      },
                      {
                        id: 'guides-application-development-automation-troubleshoot-deployments-with-mcp',
                        label: 'Troubleshoot a deployment with the MCP server'
                      },
                      {
                        id: 'guides-application-development-automation-run-scripts',
                        label: 'How to run scripts on edge nodes'
                      },
                      {
                        id: 'guides-application-development-automation-unbind-service',
                        label: 'How to unbind an edge service'
                      },
                      {
                        id: 'guides-application-development-automation-uninstall-agent',
                        label: 'How to uninstall Orchestrator Agent'
                      },
                      {
                        id: 'guides-application-development-automation-watch-logs',
                        label: 'Watch Orchestrator logs'
                      },
                      {
                        id: 'guides-application-development-automation-work-with-variables',
                        label: 'How to work with variables'
                      },
                      {
                        id: 'guides-application-development-automation-import-an-existing-project-from-github',
                        label: 'Import a project from GitHub'
                      },
                      {
                        id: 'guides-application-development-automation-route-an-api-path-to-a-backend',
                        label: 'Route an API path to a backend from azion.config'
                      }
                    ]
                  }
                ]
              },
              {
                id: 'use-cases-improve-application-performance-and-reliability',
                label: 'Improve application performance and reliability',
                children: [
                  {
                    id: 'use-cases-improve-application-performance-and-reliability-cache-and-purge',
                    label: 'Cache and purge',
                    children: [
                      {
                        id: 'guides-application-performance-cache-and-purge-advanced-cache-key',
                        label: 'Configure Advanced Cache Key for an application'
                      },
                      {
                        id: 'guides-application-performance-cache-and-purge-cache-settings',
                        label: 'Configure cache policies for an application'
                      },
                      {
                        id: 'guides-application-performance-cache-and-purge-cache-post-and-options-responses',
                        label: 'Cache POST and OPTIONS responses'
                      },
                      {
                        id: 'guides-application-performance-cache-and-purge-tune-cache-settings',
                        label: 'Create a cache setting'
                      },
                      {
                        id: 'guides-application-performance-cache-and-purge-check-page-cache-time',
                        label: 'Check the cache status of a response'
                      },
                      {
                        id: 'guides-application-performance-cache-and-purge-purge-cached-content',
                        label: 'Purge cached content'
                      },
                      {
                        id: 'guides-application-performance-cache-and-purge-purge-on-publish',
                        label: 'Purge pages when the origin publishes a change'
                      },
                      {
                        id: 'guides-application-performance-cache-and-purge-test-cache-with-mcp',
                        label: 'Test cache behavior with the MCP server'
                      }
                    ]
                  },
                  {
                    id: 'use-cases-improve-application-performance-and-reliability-delivery-optimization',
                    label: 'Delivery optimization',
                    children: [
                      {
                        id: 'guides-application-performance-delivery-optimization-gzip-compression',
                        label: 'Compress application responses with gzip'
                      },
                      {
                        id: 'guides-application-performance-delivery-optimization-process-images',
                        label: 'Configure Image Processor on an application'
                      }
                    ]
                  },
                  {
                    id: 'use-cases-improve-application-performance-and-reliability-availability',
                    label: 'Availability',
                    children: [
                      {
                        id: 'guides-application-performance-availability-multiple-origins',
                        label: 'Balance traffic across multiple origins'
                      },
                      {
                        id: 'guides-application-performance-availability-add-a-backup-origin-to-a-connector',
                        label: 'Add a backup origin to a connector'
                      },
                      {
                        id: 'guides-application-performance-availability-shift-traffic-between-two-origins-by-weight',
                        label: 'Shift traffic between two origins by weight'
                      },
                      {
                        id: 'guides-application-performance-availability-show-your-own-page-when-no-origin-answers',
                        label: 'Show your own page when no origin answers'
                      },
                      {
                        id: 'guides-application-performance-availability-route-requests-by-country-or-continent',
                        label: 'Route requests by country or continent'
                      }
                    ]
                  }
                ]
              },
              {
                id: 'use-cases-build-and-run-ai-workloads',
                label: 'Build and run AI workloads',
                children: [
                  {
                    id: 'use-cases-build-and-run-ai-workloads-inference',
                    label: 'Inference',
                    children: [
                      {
                        id: 'guides-ai-inference-scan-uploads-with-ai-inference',
                        label: 'Scan file uploads with an AI Inference firewall function'
                      },
                      {
                        id: 'guides-ai-inference-call-a-model-on-ai-inference-from-a-function',
                        label: 'Call a model on AI Inference from a function'
                      }
                    ]
                  },
                  {
                    id: 'use-cases-build-and-run-ai-workloads-agents-and-rag',
                    label: 'Agents and RAG',
                    children: [
                      {
                        id: 'guides-ai-agents-and-rag-embed-documents-into-a-vector-table',
                        label: 'Embed documents into a vector table with AI Inference'
                      }
                    ]
                  }
                ]
              },
              {
                id: 'use-cases-secure-applications-and-networks',
                label: 'Secure applications and networks',
                children: [
                  {
                    id: 'use-cases-secure-applications-and-networks-firewall-and-waf',
                    label: 'Firewall and WAF',
                    children: [
                      {
                        id: 'guides-application-security-firewall-and-waf-waf-rules-for-specific-cookie',
                        label: 'Apply a WAF rule set to a specific cookie'
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-work-with-rules-engine',
                        label: 'Create a firewall rule'
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-how-to-check-your-waf-mode',
                        label: 'Check or change the WAF mode'
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-configure-waf-allowed-rules',
                        label: 'Create a WAF exception'
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-firewall-configure-main-settings',
                        label: "Set a firewall's main settings"
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-create-waf-rule-set',
                        label: 'Create and apply a WAF rule set'
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-how-to-find-waf-score',
                        label: 'Find the WAF score of a blocked request'
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-instantiate-functions',
                        label: 'Instantiate a function on a firewall'
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-tune-waf',
                        label: 'Tune a WAF rule set'
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-integrate-siems',
                        label: 'Stream WAF events to a SIEM'
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-how-to-update-your-firewall',
                        label: 'Move deprecated rule sets to a firewall'
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-mitigate-cve-2025-29927-nextjs',
                        label: 'Mitigate CVE-2025-29927 in Next.js'
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-firewall-protect-your-domain',
                        label: 'Bind a firewall to a workload'
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-rule-set-medium',
                        label: 'Create a rule set at medium sensitivity'
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-apply-rule-set',
                        label: 'Apply a rule set to every request'
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-switch-to-blocking',
                        label: 'Switch a rule set to blocking'
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-exempt-query-parameter',
                        label: 'Exempt one query string parameter'
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-exempt-request-header',
                        label: 'Exempt one request header'
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-raise-one-threat-family',
                        label: 'Raise the sensitivity of one threat family'
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-read-block-score',
                        label: 'Read the score of a blocked request'
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-config-file-binding',
                        label: 'Bind a rule set in azion.config.js'
                      },
                      {
                        id: 'guides-application-security-firewall-and-waf-apply-waf-and-rate-limit-to-one-path',
                        label: 'Apply WAF and a rate limit to one path'
                      }
                    ]
                  },
                  {
                    id: 'use-cases-secure-applications-and-networks-bots-and-network',
                    label: 'Bots and network',
                    children: [
                      {
                        id: 'guides-application-security-bots-and-network-blocklists-ip-addresses-edge',
                        label: 'Block requests by IP, ASN, or country'
                      },
                      {
                        id: 'guides-application-security-bots-and-network-block-tor-networks',
                        label: 'Block Tor exit nodes'
                      },
                      {
                        id: 'guides-application-security-bots-and-network-manage-bots',
                        label: 'Manage bots with Bot Manager'
                      },
                      {
                        id: 'guides-application-security-bots-and-network-monitor-and-calibrate-bot-manager',
                        label: 'Monitor and calibrate Bot Manager'
                      },
                      {
                        id: 'guides-application-security-bots-and-network-observation-mode',
                        label: 'Run Bot Manager in observation mode'
                      },
                      {
                        id: 'guides-application-security-bots-and-network-refuse-above-threshold',
                        label: 'Refuse requests above the threshold'
                      },
                      {
                        id: 'guides-application-security-bots-and-network-run-on-every-request',
                        label: 'Run Bot Manager on every request'
                      },
                      {
                        id: 'guides-application-security-bots-and-network-read-the-report-log',
                        label: 'Read the report log for one instance'
                      },
                      {
                        id: 'guides-application-security-bots-and-network-deny-countries',
                        label: 'Deny requests from a list of countries'
                      },
                      {
                        id: 'guides-application-security-bots-and-network-deny-asn',
                        label: 'Deny requests from one autonomous system'
                      },
                      {
                        id: 'guides-application-security-bots-and-network-guard-one-path',
                        label: 'Guard one path with a network list'
                      },
                      {
                        id: 'guides-application-security-bots-and-network-allowlist',
                        label: 'Allow only the addresses in a list'
                      },
                      {
                        id: 'guides-application-security-bots-and-network-rate-limit-list',
                        label: 'Rate-limit the addresses in a list'
                      },
                      {
                        id: 'guides-application-security-bots-and-network-temporary-block',
                        label: 'Block addresses until a date'
                      },
                      {
                        id: 'guides-application-security-bots-and-network-restrict-an-origin-to-azion-with-origin-ip-acl',
                        label: 'Restrict an origin to Azion with Origin IP ACL'
                      },
                      {
                        id: 'guides-application-security-bots-and-network-run-bot-manager-on-selected-paths',
                        label: 'Run Bot Manager on selected paths'
                      },
                      {
                        id: 'guides-application-security-bots-and-network-update-network-list-from-automation',
                        label: 'Update a network list from an automation'
                      }
                    ]
                  },
                  {
                    id: 'use-cases-secure-applications-and-networks-tls-and-certificates',
                    label: 'TLS and certificates',
                    children: [
                      {
                        id: 'guides-application-security-tls-and-certificates-digital-certificates',
                        label: 'Upload a digital certificate'
                      },
                      {
                        id: 'guides-application-security-tls-and-certificates-lets-encrypt-record',
                        label: "Add the Let's Encrypt TXT record"
                      },
                      {
                        id: 'guides-application-security-tls-and-certificates-associate-an-mtls-certificate',
                        label: 'Configure mTLS on a workload'
                      },
                      {
                        id: 'guides-application-security-tls-and-certificates-ciphers',
                        label: 'Set the TLS cipher suite'
                      },
                      {
                        id: 'guides-application-security-tls-and-certificates-how-to-generate-a-lets-encrypt-certificate',
                        label: "Request a Let's Encrypt certificate"
                      },
                      {
                        id: 'guides-application-security-tls-and-certificates-how-to-generate-a-lets-encrypt-certificate-via-api',
                        label: 'Request a certificate with the API'
                      },
                      {
                        id: 'guides-application-security-tls-and-certificates-post-quantum-cryptography',
                        label: 'Verify post-quantum key exchange'
                      },
                      {
                        id: 'guides-application-security-tls-and-certificates-redirect-http-to-https',
                        label: 'Redirect HTTP to HTTPS'
                      }
                    ]
                  },
                  {
                    id: 'use-cases-secure-applications-and-networks-dns',
                    label: 'DNS',
                    children: [
                      {
                        id: 'guides-application-security-dns-edge-dns-configure-main-settings',
                        label: 'Create, edit, or delete a zone'
                      },
                      {
                        id: 'guides-application-security-dns-add-records',
                        label: 'Add, edit, or delete a record'
                      },
                      {
                        id: 'guides-application-security-dns-access-root-domain',
                        label: 'Point an apex domain with ANAME'
                      },
                      {
                        id: 'guides-application-security-dns-load-balance-dns',
                        label: 'Weight records to balance traffic'
                      },
                      {
                        id: 'guides-application-security-dns-activate-dnssec',
                        label: 'Turn on DNSSEC for a zone'
                      },
                      {
                        id: 'guides-application-security-dns-cname-subdomain',
                        label: 'Point a subdomain with a CNAME record'
                      },
                      {
                        id: 'guides-application-security-dns-mx-records',
                        label: 'Receive mail with MX records'
                      },
                      {
                        id: 'guides-application-security-dns-txt-verification',
                        label: 'Verify a domain with a TXT record'
                      },
                      {
                        id: 'guides-application-security-dns-caa-record',
                        label: 'Restrict issuers with a CAA record'
                      },
                      {
                        id: 'guides-application-security-dns-wildcard-record',
                        label: 'Match subdomains with a wildcard record'
                      },
                      {
                        id: 'guides-application-security-dns-run-the-dig-command',
                        label: 'Query a zone with dig'
                      },
                      {
                        id: 'guides-application-security-dns-run-the-traceroute-command',
                        label: 'Trace the route to a host'
                      }
                    ]
                  },
                  {
                    id: 'use-cases-secure-applications-and-networks-access-and-compliance',
                    label: 'Access and compliance',
                    children: [
                      {
                        id: 'guides-application-security-access-and-compliance-microsoft-entra-automated-user-provisioning',
                        label: 'Provision Microsoft Entra users with SCIM'
                      },
                      {
                        id: 'guides-application-security-access-and-compliance-account-lockout-policy-logs',
                        label: 'Check Account Lockout Policy logs'
                      },
                      {
                        id: 'guides-application-security-access-and-compliance-configure-account-lockout-policy',
                        label: 'Configure Account Lockout Policy'
                      },
                      {
                        id: 'guides-application-security-access-and-compliance-configure-user-session-timeout',
                        label: 'Configure User Session Timeout'
                      },
                      {
                        id: 'guides-application-security-access-and-compliance-conditional-access-by-ip-address',
                        label: 'Manage conditional access by IP address'
                      },
                      {
                        id: 'guides-application-security-access-and-compliance-unlock-account-lockout-policy',
                        label: 'Unlock a user from Account Lockout Policy'
                      },
                      {
                        id: 'guides-application-security-access-and-compliance-sso-google-saml',
                        label: 'Configure Google SAML for SSO'
                      },
                      {
                        id: 'guides-application-security-access-and-compliance-sso-microsoft-entra-saml',
                        label: 'Configure Microsoft Entra SAML for SSO'
                      },
                      {
                        id: 'guides-application-security-access-and-compliance-sso-okta-saml',
                        label: 'Configure Okta SAML for SSO'
                      },
                      {
                        id: 'guides-application-security-access-and-compliance-verify-account-migration',
                        label: "Verify your account's API version"
                      }
                    ]
                  }
                ]
              },
              {
                id: 'use-cases-deliver-media-and-streaming-content',
                label: 'Deliver media and streaming content',
                children: [
                  {
                    id: 'use-cases-deliver-media-and-streaming-content-streaming',
                    label: 'Streaming',
                    children: [
                      {
                        id: 'guides-media-and-streaming-streaming-enforce-hls-cache',
                        label: 'Enforce HLS cache for live streaming'
                      },
                      {
                        id: 'guides-media-and-streaming-streaming-static-cache-videoteca-template',
                        label: 'Static Cache + Videoteca Player template'
                      },
                      {
                        id: 'guides-media-and-streaming-streaming-videofront-player',
                        label: 'Install the Videoteca Player integration'
                      },
                      {
                        id: 'guides-media-and-streaming-streaming-deliver-a-live-stream-from-live-ingest',
                        label: 'Deliver a live stream from Live Ingest'
                      },
                      {
                        id: 'guides-media-and-streaming-streaming-cache-an-on-demand-hls-library-by-file-extension',
                        label: 'Cache an on-demand HLS library by file extension'
                      }
                    ]
                  }
                ]
              },
              {
                id: 'use-cases-platform',
                label: 'Platform',
                children: [
                  {
                    id: 'use-cases-platform-migration',
                    label: 'Migration',
                    children: [
                      {
                        id: 'guides-migration-configure-a-domain',
                        label: 'Add a custom domain to a workload'
                      },
                      {
                        id: 'guides-migration-migrate-ns-to-azion',
                        label: 'Migrate nameservers to Azion'
                      },
                      {
                        id: 'guides-migration-point-domain-to-azion',
                        label: 'Point a domain to a workload'
                      },
                      {
                        id: 'guides-migration-akamai-migration-guide',
                        label: 'Migrate from Akamai to Azion'
                      },
                      {
                        id: 'guides-migration-aws-migration-guide',
                        label: 'Migrate from AWS to Azion'
                      },
                      {
                        id: 'guides-migration-cloudflare-migration-guide',
                        label: 'Migrate from Cloudflare to Azion'
                      },
                      {
                        id: 'guides-migration-fastly-migration-guide',
                        label: 'Migrate from Fastly to Azion'
                      },
                      {
                        id: 'guides-migration-vercel-migration-guide',
                        label: 'Migrate from Vercel to Azion'
                      },
                      {
                        id: 'use-cases-platform-migration-migrate-from-provider-v1-x-to-v2-0',
                        label: 'Migrate from provider v1.x to v2.0',
                        ref: true
                      }
                    ]
                  },
                  {
                    id: 'use-cases-platform-account-and-billing',
                    label: 'Account and billing',
                    children: [
                      {
                        id: 'guides-account-and-billing-getting-to-know-azion-console',
                        label: 'About Azion Console'
                      },
                      {
                        id: 'guides-account-and-billing-activity-history',
                        label: 'How to access Activity History'
                      },
                      {
                        id: 'guides-account-and-billing-how-to-access-azion-console',
                        label: 'Access Azion Console'
                      },
                      {
                        id: 'guides-account-and-billing-billing-and-subscriptions',
                        label: 'Manage billing and payment methods'
                      },
                      {
                        id: 'guides-account-and-billing-account-settings',
                        label: 'Configure account settings'
                      },
                      {
                        id: 'guides-account-and-billing-delete-account',
                        label: 'Delete your account'
                      },
                      {
                        id: 'guides-account-and-billing-multi-factor-authentication',
                        label: 'Enable multi-factor authentication'
                      },
                      {
                        id: 'guides-account-and-billing-personal-tokens',
                        label: 'Manage personal tokens'
                      },
                      {
                        id: 'guides-account-and-billing-teams-permissions',
                        label: 'Manage teams and permissions'
                      },
                      {
                        id: 'guides-account-and-billing-users-management',
                        label: 'Manage users'
                      },
                      {
                        id: 'guides-account-and-billing-create-button',
                        label: 'Use the + Create button'
                      },
                      {
                        id: 'guides-account-and-billing-sso',
                        label: 'Configure an identity provider for SSO'
                      }
                    ]
                  },
                  {
                    id: 'use-cases-platform-observability',
                    label: 'Observability',
                    children: [
                      {
                        id: 'guides-observability-azion-plugin-grafana-custom-dash',
                        label: 'Build a custom Grafana dashboard'
                      },
                      {
                        id: 'guides-observability-azion-plugin-grafana-customize-log-table',
                        label: 'Customize a Grafana log table'
                      },
                      {
                        id: 'guides-observability-query-workload-events',
                        label: 'Query HTTP request events'
                      },
                      {
                        id: 'guides-observability-query-function-console-events',
                        label: 'Query function console logs'
                      },
                      {
                        id: 'guides-observability-export-events-csv',
                        label: 'Export query results to CSV'
                      },
                      {
                        id: 'guides-observability-add-filters-events',
                        label: 'Filter events'
                      },
                      {
                        id: 'guides-observability-add-filters-metrics',
                        label: 'Filter a dashboard'
                      },
                      {
                        id: 'guides-observability-analyze-metrics',
                        label: "Export a chart's data and query"
                      },
                      {
                        id: 'guides-observability-break-down-requests-by-status-code',
                        label: 'Break down requests by status code'
                      },
                      {
                        id: 'guides-observability-measure-cache-offload',
                        label: 'Measure cache offload for a domain'
                      },
                      {
                        id: 'guides-observability-find-top-waf-threat-sources',
                        label: 'Find the top sources of WAF threats'
                      },
                      {
                        id: 'guides-observability-data-stream-associate-workloads',
                        label: 'Associate workloads with a stream'
                      },
                      {
                        id: 'guides-observability-configure-sampling',
                        label: 'Configure sampling on a stream'
                      },
                      {
                        id: 'guides-observability-debugging-functions-data-stream',
                        label: 'Debug functions with Data Stream'
                      },
                      {
                        id: 'guides-observability-query-top-attacks-with-graphql',
                        label: 'Find the top attacks with GraphQL'
                      },
                      {
                        id: 'guides-observability-generate-graphql-queries-with-mcp',
                        label: 'Generate GraphQL queries with the MCP server'
                      },
                      {
                        id: 'guides-observability-integrate-grafana',
                        label: 'Install the Azion plugin for Grafana'
                      },
                      {
                        id: 'guides-observability-graphql-aggregated-data',
                        label: 'Query aggregated data with GraphQL'
                      },
                      {
                        id: 'guides-observability-query-bot-manager-data-with-graphql',
                        label: 'Query Bot Manager data with GraphQL'
                      },
                      {
                        id: 'guides-observability-query-connected-users-data-with-graphql',
                        label: 'Query Live Ingest connected users'
                      },
                      {
                        id: 'guides-observability-query-graphql-postman',
                        label: 'Run GraphQL queries in Postman'
                      },
                      {
                        id: 'guides-observability-graphql-metadata',
                        label: 'Query GraphQL schema metadata'
                      },
                      {
                        id: 'guides-observability-query-applications-usage-data-with-graphql',
                        label: 'Query usage data from Applications'
                      },
                      {
                        id: 'guides-observability-query-data-stream-usage-data-with-graphql',
                        label: 'Query Data Stream usage data'
                      },
                      {
                        id: 'guides-observability-query-functions-usage-data-with-graphql',
                        label: 'Query usage data from Functions'
                      },
                      {
                        id: 'guides-observability-query-image-processor-usage-data-with-graphql',
                        label: 'Query usage data from Image Processor'
                      },
                      {
                        id: 'guides-observability-query-tiered-cache-usage-data-with-graphql',
                        label: 'Query usage data from Tiered Cache'
                      },
                      {
                        id: 'guides-observability-graphql-top-x-query',
                        label: 'Find the top values with GraphQL'
                      },
                      {
                        id: 'guides-observability-data-stream-set-payload',
                        label: 'Customize the HTTP POST payload'
                      },
                      {
                        id: 'guides-observability-delete-data-stream',
                        label: 'Edit, stop, or delete a stream'
                      },
                      {
                        id: 'guides-observability-understand-logs',
                        label: 'Read an event record'
                      },
                      {
                        id: 'guides-observability-endpoint-amazon-s3',
                        label: 'Send logs to Amazon S3'
                      },
                      {
                        id: 'guides-observability-endpoint-datadog',
                        label: 'Send logs to Datadog'
                      },
                      {
                        id: 'guides-observability-best-practices-grafana',
                        label: 'Build a Grafana query against Azion data'
                      },
                      {
                        id: 'guides-observability-endpoint-splunk',
                        label: 'Send logs to Splunk'
                      },
                      {
                        id: 'guides-observability-query-top-ips-attack-traffic-with-graphql',
                        label: 'Find the IPs behind attack traffic'
                      },
                      {
                        id: 'guides-observability-investigate-requests-graphql-api',
                        label: 'Investigate a request with the GraphQL API'
                      },
                      {
                        id: 'guides-observability-query-httpbreakdownmetrics-data-with-graphql',
                        label: 'Query the httpBreakdownMetrics dataset'
                      },
                      {
                        id: 'guides-observability-query-bot-manager-breakdown-data-with-graphql',
                        label: 'Query the top URLs bots reach with GraphQL'
                      },
                      {
                        id: 'guides-observability-endpoint-amazon-kinesis',
                        label: 'Send logs to AWS Kinesis Data Firehose'
                      },
                      {
                        id: 'guides-observability-endpoint-azure-blob',
                        label: 'Send logs to Azure Blob Storage'
                      },
                      {
                        id: 'guides-observability-endpoint-azure-monitor',
                        label: 'Send logs to Azure Monitor'
                      },
                      {
                        id: 'guides-observability-endpoint-elasticsearch',
                        label: 'Send logs to Elasticsearch'
                      },
                      {
                        id: 'guides-observability-endpoint-google-bigquery',
                        label: 'Send logs to Google BigQuery'
                      },
                      {
                        id: 'guides-observability-connector-azion-object-storage',
                        label: 'Send logs to Object Storage'
                      },
                      {
                        id: 'guides-observability-connector-standard-https-post',
                        label: 'Send logs to an HTTP endpoint'
                      },
                      {
                        id: 'guides-observability-endpoint-apache-kafka',
                        label: 'Send logs to Apache Kafka'
                      },
                      {
                        id: 'guides-observability-endpoint-ibm-qradar',
                        label: 'Send logs to IBM QRadar'
                      },
                      {
                        id: 'guides-observability-azion-plugin-grafana-pre-built-dash',
                        label: 'Import the pre-built Grafana dashboard'
                      },
                      {
                        id: 'guides-observability-data-transferred-dash',
                        label: 'Import the Data Transferred dashboard'
                      },
                      {
                        id: 'guides-observability-metrics-dash',
                        label: 'Import the Real-Time Metrics dashboard'
                      },
                      {
                        id: 'guides-observability-stream-request-and-waf-records-to-siem',
                        label: 'Stream request and WAF records to a SIEM'
                      },
                      {
                        id: 'guides-observability-query-edge-pulse-measurements-with-graphql',
                        label: 'Query Edge Pulse measurements with GraphQL'
                      },
                      {
                        id: 'guides-observability-add-the-edge-pulse-tag-to-your-pages',
                        label: 'Add the Edge Pulse tag to your pages'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'support',
        label: 'Support',
        kind: 'drill',
        href: '/site/docs/support',
        groups: [
          {
            label: 'Support',
            items: [
              {
                id: 'support-overview',
                label: 'Support guidelines',
                href: '/site/docs/support'
              },
              {
                id: 'support-open-tickets',
                label: 'Open a support ticket'
              },
              {
                id: 'support-status-and-maintenance',
                label: 'Azion status and maintenance'
              },
              {
                id: 'support-troubleshooting',
                label: 'Troubleshooting',
                children: [
                  {
                    id: 'support-gather-information',
                    label: 'Gather information for Azion Support'
                  },
                  {
                    id: 'support-diagnostic-headers',
                    label: 'Diagnostic response headers'
                  },
                  {
                    id: 'support-basic-troubleshooting',
                    label: 'Basic troubleshooting'
                  },
                  {
                    id: 'support-account-access',
                    label: 'Azion Console sign-in'
                  },
                  {
                    id: 'support-original-ip-header',
                    label: 'Send the client IP to the origin'
                  },
                  {
                    id: 'support-retrieve-azion-ip-ranges',
                    label: "Allow Azion's IP ranges at your origin"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'marketplace',
        label: 'Marketplace',
        kind: 'drill',
        href: '/site/docs/marketplace',
        groups: [
          {
            label: 'Marketplace',
            items: [
              {
                id: 'marketplace-overview',
                label: 'Overview',
                href: '/site/docs/marketplace'
              },
              {
                id: 'marketplace-first-steps',
                label: 'Quickstart'
              },
              {
                id: 'marketplace-how-it-works',
                label: 'How it works'
              },
              {
                id: 'marketplace-guides',
                label: 'Guides and tutorials'
              },
              {
                id: 'marketplace-reference',
                label: 'Reference',
                children: [
                  {
                    id: 'marketplace-integrations',
                    label: 'Integrations'
                  },
                  {
                    id: 'marketplace-templates',
                    label: 'Templates'
                  },
                  {
                    id: 'marketplace-permissions-marketplace',
                    label: 'Permissions'
                  }
                ]
              },
              {
                id: 'marketplace-sell-on-marketplace',
                label: 'Sell on Marketplace',
                children: [
                  {
                    id: 'marketplace-marketplace-seller-guide',
                    label: 'Seller requirements and fees'
                  },
                  {
                    id: 'marketplace-isv-signup',
                    label: 'Become a seller'
                  }
                ]
              },
              {
                id: 'marketplace-glossary',
                label: 'Glossary'
              },
              {
                id: 'marketplace-management',
                label: 'Management',
                children: [
                  {
                    id: 'marketplace-management-changelog',
                    label: 'Changelog',
                    ref: true,
                    href: '/site/docs/release-notes'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    label: 'Platform resources',
    items: [
      {
        id: 'workloads',
        label: 'Workloads',
        kind: 'drill',
        href: '/site/docs/workloads',
        groups: [
          {
            label: 'Workloads',
            items: [
              {
                id: 'workloads-overview',
                label: 'Overview',
                href: '/site/docs/workloads'
              },
              {
                id: 'workloads-quickstart',
                label: 'Quickstart'
              },
              {
                id: 'workloads-how-it-works',
                label: 'How it works'
              },
              {
                id: 'workloads-certificate-manager',
                label: 'Certificate Manager',
                children: [
                  {
                    id: 'workloads-certificate-manager-quickstart',
                    label: 'Quickstart'
                  },
                  {
                    id: 'workloads-certificate-manager-reference',
                    label: 'Reference',
                    children: [
                      {
                        id: 'workloads-certificate-manager-issuance-and-renewal',
                        label: 'Issuance and renewal'
                      },
                      {
                        id: 'workloads-certificate-manager-certificates',
                        label: 'Certificates'
                      }
                    ]
                  }
                ]
              },
              {
                id: 'workloads-custom-pages',
                label: 'Custom Pages',
                children: [
                  {
                    id: 'workloads-custom-pages-quickstart',
                    label: 'Quickstart'
                  },
                  {
                    id: 'workloads-custom-pages-reference',
                    label: 'Reference',
                    children: [
                      {
                        id: 'workloads-custom-pages-settings',
                        label: 'Settings'
                      },
                      {
                        id: 'workloads-custom-pages-error-responses',
                        label: 'Error Responses'
                      }
                    ]
                  }
                ]
              },
              {
                id: 'workloads-ddos-protection',
                label: 'DDoS Protection',
                children: [
                  {
                    id: 'workloads-ddos-protection-reference',
                    label: 'Reference',
                    children: [
                      {
                        id: 'workloads-ddos-protection-ddos-mitigation',
                        label: 'Attack mitigation'
                      }
                    ]
                  }
                ]
              },
              {
                id: 'workloads-guides',
                label: 'Guides and tutorials'
              },
              {
                id: 'workloads-reference',
                label: 'Reference',
                children: [
                  {
                    id: 'workloads-settings',
                    label: 'Settings'
                  },
                  {
                    id: 'workloads-mtls',
                    label: 'mTLS'
                  },
                  {
                    id: 'workloads-domains',
                    label: 'Domains'
                  }
                ]
              },
              {
                id: 'workloads-limits',
                label: 'Limits'
              },
              {
                id: 'workloads-best-practices',
                label: 'Best practices'
              },
              {
                id: 'workloads-troubleshooting',
                label: 'Troubleshooting'
              },
              {
                id: 'workloads-glossary',
                label: 'Glossary'
              },
              {
                id: 'workloads-management',
                label: 'Management',
                children: [
                  {
                    id: 'workloads-management-pricing',
                    label: 'Pricing',
                    ref: true
                  },
                  {
                    id: 'workloads-management-changelog',
                    label: 'Changelog',
                    ref: true,
                    href: '/site/docs/release-notes'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'applications',
        label: 'Applications',
        kind: 'drill',
        href: '/site/docs/applications',
        groups: [
          {
            label: 'Applications',
            items: [
              {
                id: 'applications-overview',
                label: 'Overview',
                href: '/site/docs/applications'
              },
              {
                id: 'applications-quickstart',
                label: 'Quickstart'
              },
              {
                id: 'applications-how-it-works',
                label: 'How it works'
              },
              {
                id: 'applications-cache',
                label: 'Cache',
                children: [
                  {
                    id: 'applications-cache-quickstart',
                    label: 'Quickstart'
                  },
                  {
                    id: 'applications-cache-reference',
                    label: 'Reference',
                    children: [
                      {
                        id: 'applications-cache-expiration-and-freshness',
                        label: 'Expiration and freshness'
                      },
                      {
                        id: 'applications-cache-cache-settings',
                        label: 'Settings'
                      },
                      {
                        id: 'applications-cache-cache-keys',
                        label: 'Cache keys'
                      },
                      {
                        id: 'applications-cache-real-time-purge',
                        label: 'Real-Time Purge'
                      },
                      {
                        id: 'applications-cache-tiered-cache',
                        label: 'Tiered Cache'
                      },
                      {
                        id: 'applications-cache-reference-runtime-api',
                        label: 'Runtime API',
                        ref: true
                      }
                    ]
                  }
                ]
              },
              {
                id: 'applications-application-accelerator',
                label: 'Application Accelerator',
                children: [
                  {
                    id: 'applications-application-accelerator-quickstart',
                    label: 'Quickstart'
                  },
                  {
                    id: 'applications-application-accelerator-reference',
                    label: 'Reference',
                    children: [
                      {
                        id: 'applications-application-accelerator-cache-variation',
                        label: 'Cache variation'
                      },
                      {
                        id: 'applications-application-accelerator-settings',
                        label: 'Settings'
                      }
                    ]
                  }
                ]
              },
              {
                id: 'applications-image-processor',
                label: 'Image Processor',
                children: [
                  {
                    id: 'applications-image-processor-quickstart',
                    label: 'Quickstart'
                  },
                  {
                    id: 'applications-image-processor-reference',
                    label: 'Reference',
                    children: [
                      {
                        id: 'applications-image-processor-image-delivery',
                        label: 'Image delivery'
                      },
                      {
                        id: 'applications-image-processor-url-parameters',
                        label: 'URL parameters'
                      },
                      {
                        id: 'applications-image-processor-settings',
                        label: 'Settings'
                      }
                    ]
                  }
                ]
              },
              {
                id: 'applications-guides',
                label: 'Guides and tutorials'
              },
              {
                id: 'applications-reference',
                label: 'Reference',
                children: [
                  {
                    id: 'applications-v3',
                    label: 'Applications | v3'
                  },
                  {
                    id: 'applications-main-settings',
                    label: 'Main Settings'
                  },
                  {
                    id: 'applications-device-groups',
                    label: 'Device Groups'
                  },
                  {
                    id: 'applications-main-settings-v3',
                    label: 'Main Settings | v3'
                  },
                  {
                    id: 'applications-rules-engine',
                    label: 'Rules Engine for Applications'
                  },
                  {
                    id: 'applications-websocket',
                    label: 'WebSocket Proxy'
                  },
                  {
                    id: 'applications-functions-instances',
                    label: 'Function instances'
                  },
                  {
                    id: 'applications-reference-functions',
                    label: 'Functions',
                    ref: true,
                    href: '/site/docs/functions'
                  }
                ]
              },
              {
                id: 'applications-limits',
                label: 'Limits'
              },
              {
                id: 'applications-best-practices',
                label: 'Best practices'
              },
              {
                id: 'applications-troubleshooting',
                label: 'Troubleshooting'
              },
              {
                id: 'applications-glossary',
                label: 'Glossary'
              },
              {
                id: 'applications-management',
                label: 'Management',
                children: [
                  {
                    id: 'applications-management-pricing',
                    label: 'Pricing',
                    ref: true
                  },
                  {
                    id: 'applications-management-changelog',
                    label: 'Changelog',
                    ref: true,
                    href: '/site/docs/release-notes'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'firewall',
        label: 'Firewall',
        kind: 'drill',
        href: '/site/docs/firewall',
        groups: [
          {
            label: 'Firewall',
            items: [
              {
                id: 'firewall-overview',
                label: 'Overview',
                href: '/site/docs/firewall'
              },
              {
                id: 'firewall-quickstart',
                label: 'Quickstart'
              },
              {
                id: 'firewall-how-it-works',
                label: 'How it works'
              },
              {
                id: 'firewall-waf',
                label: 'WAF',
                children: [
                  {
                    id: 'firewall-waf-quickstart',
                    label: 'Quickstart'
                  },
                  {
                    id: 'firewall-waf-reference',
                    label: 'Reference',
                    children: [
                      {
                        id: 'firewall-waf-scoring-and-modes',
                        label: 'Scoring and modes'
                      },
                      {
                        id: 'firewall-waf-rules-set',
                        label: 'Rule sets'
                      },
                      {
                        id: 'firewall-waf-custom-allowed-rules',
                        label: 'Exceptions'
                      }
                    ]
                  }
                ]
              },
              {
                id: 'firewall-network-shield',
                label: 'Network Shield',
                children: [
                  {
                    id: 'firewall-network-shield-quickstart',
                    label: 'Quickstart'
                  },
                  {
                    id: 'firewall-network-shield-reference',
                    label: 'Reference',
                    children: [
                      {
                        id: 'firewall-network-shield-list-matching',
                        label: 'List matching'
                      },
                      {
                        id: 'firewall-network-shield-network-lists',
                        label: 'Network Lists'
                      },
                      {
                        id: 'firewall-network-shield-reference-runtime-api',
                        label: 'Runtime API',
                        ref: true
                      }
                    ]
                  }
                ]
              },
              {
                id: 'firewall-bot-manager',
                label: 'Bot Manager',
                children: [
                  {
                    id: 'firewall-bot-manager-quickstart',
                    label: 'Quickstart'
                  },
                  {
                    id: 'firewall-bot-manager-reference',
                    label: 'Reference',
                    children: [
                      {
                        id: 'firewall-bot-manager-bot-scoring',
                        label: 'Bot scoring'
                      },
                      {
                        id: 'firewall-bot-manager-arguments',
                        label: 'Arguments'
                      },
                      {
                        id: 'firewall-bot-manager-logs',
                        label: 'Logs'
                      },
                      {
                        id: 'firewall-bot-manager-bot-manager-lite',
                        label: 'Bot Manager Lite'
                      }
                    ]
                  }
                ]
              },
              {
                id: 'firewall-guides',
                label: 'Guides and tutorials'
              },
              {
                id: 'firewall-reference',
                label: 'Reference',
                children: [
                  {
                    id: 'firewall-functions',
                    label: 'Functions for Firewall'
                  },
                  {
                    id: 'firewall-functions-instances',
                    label: 'Function instances for Firewall'
                  },
                  {
                    id: 'firewall-rules-engine',
                    label: 'Rules Engine for Firewall'
                  },
                  {
                    id: 'firewall-reference-functions',
                    label: 'Functions',
                    ref: true,
                    href: '/site/docs/functions'
                  }
                ]
              },
              {
                id: 'firewall-limits',
                label: 'Limits'
              },
              {
                id: 'firewall-best-practices',
                label: 'Best practices'
              },
              {
                id: 'firewall-troubleshooting',
                label: 'Troubleshooting'
              },
              {
                id: 'firewall-glossary',
                label: 'Glossary'
              },
              {
                id: 'firewall-management',
                label: 'Management',
                children: [
                  {
                    id: 'firewall-management-pricing',
                    label: 'Pricing',
                    ref: true
                  },
                  {
                    id: 'firewall-management-changelog',
                    label: 'Changelog',
                    ref: true,
                    href: '/site/docs/release-notes'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'functions',
        label: 'Functions',
        kind: 'drill',
        href: '/site/docs/functions',
        groups: [
          {
            label: 'Functions',
            items: [
              {
                id: 'functions-overview',
                label: 'Overview',
                href: '/site/docs/functions'
              },
              {
                id: 'functions-quickstart',
                label: 'Quickstart'
              },
              {
                id: 'functions-how-it-works',
                label: 'How it works'
              },
              {
                id: 'functions-features-and-capabilities',
                label: 'Features and capabilities',
                children: [
                  {
                    id: 'functions-local-development',
                    label: 'Local development'
                  },
                  {
                    id: 'functions-preview-deployment',
                    label: 'Preview deployment'
                  },
                  {
                    id: 'functions-code-editor',
                    label: 'Code editor'
                  },
                  {
                    id: 'functions-ai-integration',
                    label: 'ChatGPT integration'
                  }
                ]
              },
              {
                id: 'functions-guides',
                label: 'Guides and tutorials'
              },
              {
                id: 'functions-examples',
                label: 'Examples',
                children: [
                  {
                    id: 'functions-javascript-examples',
                    label: 'JavaScript examples'
                  },
                  {
                    id: 'functions-ab-testing',
                    label: 'A/B testing'
                  },
                  {
                    id: 'functions-adding-response-header',
                    label: 'Add a response header'
                  },
                  {
                    id: 'functions-deny-request',
                    label: 'Deny a request by country'
                  },
                  {
                    id: 'functions-cookie-value',
                    label: 'Extract a cookie value'
                  },
                  {
                    id: 'functions-general-firewall-example',
                    label: 'Functions on a firewall'
                  },
                  {
                    id: 'functions-hello-world',
                    label: 'Hello world'
                  },
                  {
                    id: 'functions-process-request-body',
                    label: 'Process a request body'
                  },
                  {
                    id: 'functions-redirect-requests',
                    label: 'Redirect all requests to one URL'
                  },
                  {
                    id: 'functions-respond-site',
                    label: 'Respond with another site'
                  },
                  {
                    id: 'functions-rest-apis',
                    label: 'REST APIs'
                  },
                  {
                    id: 'functions-return-html',
                    label: 'Return HTML'
                  },
                  {
                    id: 'functions-return-json',
                    label: 'Return JSON'
                  },
                  {
                    id: 'functions-using-args',
                    label: 'Using args'
                  }
                ]
              },
              {
                id: 'functions-reference',
                label: 'Reference',
                children: [
                  {
                    id: 'functions-environment-variables',
                    label: 'Environment variables'
                  },
                  {
                    id: 'functions-reference-function-instances',
                    label: 'Function instances',
                    ref: true
                  }
                ]
              },
              {
                id: 'functions-limits',
                label: 'Limits'
              },
              {
                id: 'functions-best-practices',
                label: 'Best practices'
              },
              {
                id: 'functions-troubleshooting',
                label: 'Troubleshooting'
              },
              {
                id: 'functions-glossary',
                label: 'Glossary'
              },
              {
                id: 'functions-management',
                label: 'Management',
                children: [
                  {
                    id: 'functions-management-pricing',
                    label: 'Pricing',
                    ref: true
                  },
                  {
                    id: 'functions-management-changelog',
                    label: 'Changelog',
                    ref: true,
                    href: '/site/docs/release-notes'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'connectors',
        label: 'Connectors',
        kind: 'drill',
        href: '/site/docs/connectors',
        groups: [
          {
            label: 'Connectors',
            items: [
              {
                id: 'connectors-overview',
                label: 'Overview',
                href: '/site/docs/connectors'
              },
              {
                id: 'connectors-quickstart',
                label: 'Quickstart'
              },
              {
                id: 'connectors-how-it-works',
                label: 'How it works'
              },
              {
                id: 'connectors-load-balancer',
                label: 'Load Balancer',
                children: [
                  {
                    id: 'connectors-load-balancer-quickstart',
                    label: 'Quickstart'
                  },
                  {
                    id: 'connectors-load-balancer-reference',
                    label: 'Reference',
                    children: [
                      {
                        id: 'connectors-load-balancer-balancing-methods',
                        label: 'Balancing methods'
                      }
                    ]
                  }
                ]
              },
              {
                id: 'connectors-origin-shield',
                label: 'Origin Shield',
                children: [
                  {
                    id: 'connectors-origin-shield-reference',
                    label: 'Reference',
                    children: [
                      {
                        id: 'connectors-origin-shield-origin-ip-acl-and-hmac',
                        label: 'Origin IP ACL and HMAC'
                      }
                    ]
                  }
                ]
              },
              {
                id: 'connectors-live-ingest',
                label: 'Live Ingest',
                children: [
                  {
                    id: 'connectors-live-ingest-reference',
                    label: 'Reference',
                    children: [
                      {
                        id: 'connectors-live-ingest-ingestion-and-delivery',
                        label: 'Ingestion and delivery'
                      }
                    ]
                  }
                ]
              },
              {
                id: 'connectors-guides',
                label: 'Guides and tutorials'
              },
              {
                id: 'connectors-reference',
                label: 'Reference',
                children: [
                  {
                    id: 'connectors-settings',
                    label: 'Settings'
                  },
                  {
                    id: 'connectors-sni-check',
                    label: 'SNI Check'
                  },
                  {
                    id: 'connectors-origins',
                    label: 'Origins'
                  }
                ]
              },
              {
                id: 'connectors-limits',
                label: 'Limits'
              },
              {
                id: 'connectors-best-practices',
                label: 'Best practices'
              },
              {
                id: 'connectors-troubleshooting',
                label: 'Troubleshooting'
              },
              {
                id: 'connectors-glossary',
                label: 'Glossary'
              },
              {
                id: 'connectors-management',
                label: 'Management',
                children: [
                  {
                    id: 'connectors-management-pricing',
                    label: 'Pricing',
                    ref: true
                  },
                  {
                    id: 'connectors-management-changelog',
                    label: 'Changelog',
                    ref: true,
                    href: '/site/docs/release-notes'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'ai-inference',
        label: 'AI Inference',
        kind: 'drill',
        href: '/site/docs/ai-inference',
        groups: [
          {
            label: 'AI Inference',
            items: [
              {
                id: 'ai-inference-overview',
                label: 'Overview',
                href: '/site/docs/ai-inference'
              },
              {
                id: 'ai-inference-quickstart',
                label: 'Quickstart'
              },
              {
                id: 'ai-inference-how-it-works',
                label: 'How it works'
              },
              {
                id: 'ai-inference-lora-fine-tune',
                label: 'LoRA Fine-Tune'
              },
              {
                id: 'ai-inference-guides',
                label: 'Guides and tutorials'
              },
              {
                id: 'ai-inference-reference',
                label: 'Reference',
                children: [
                  {
                    id: 'ai-inference-model-invocation',
                    label: 'Model invocation'
                  },
                  {
                    id: 'ai-inference-reference-runtime-api',
                    label: 'Runtime API',
                    ref: true
                  },
                  {
                    id: 'ai-inference-models',
                    label: 'AI models'
                  },
                  {
                    id: 'ai-inference-baai-bge-reranker-v2-m3',
                    label: 'BAAI/bge-reranker-v2-m3'
                  },
                  {
                    id: 'ai-inference-gpt-oss-20b',
                    label: 'GPT-OSS 20B'
                  },
                  {
                    id: 'ai-inference-internvl3',
                    label: 'InternVL3'
                  },
                  {
                    id: 'ai-inference-mistral-3-small',
                    label: 'Mistral 3 Small (24B AWQ)'
                  },
                  {
                    id: 'ai-inference-nanonets-ocr-s',
                    label: 'Nanonets-OCR-s'
                  },
                  {
                    id: 'ai-inference-qwen-2-5-vl-3b',
                    label: 'Qwen2.5 VL AWQ 3B'
                  },
                  {
                    id: 'ai-inference-qwen-2-5-vl-7b',
                    label: 'Qwen2.5 VL AWQ 7B'
                  },
                  {
                    id: 'ai-inference-qwen3-30ba3b',
                    label: 'Qwen3 30B A3B Instruct 2507 FP8'
                  },
                  {
                    id: 'ai-inference-qwen3-embedding-4b',
                    label: 'Qwen3 Embedding 4B'
                  }
                ]
              },
              {
                id: 'ai-inference-limits',
                label: 'Limits'
              },
              {
                id: 'ai-inference-best-practices',
                label: 'Best practices'
              },
              {
                id: 'ai-inference-glossary',
                label: 'Glossary'
              },
              {
                id: 'ai-inference-management',
                label: 'Management',
                children: [
                  {
                    id: 'ai-inference-management-pricing',
                    label: 'Pricing',
                    ref: true
                  },
                  {
                    id: 'ai-inference-management-changelog',
                    label: 'Changelog',
                    ref: true,
                    href: '/site/docs/release-notes'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'real-time-metrics',
        label: 'Real-Time Metrics',
        kind: 'drill',
        href: '/site/docs/real-time-metrics',
        groups: [
          {
            label: 'Real-Time Metrics',
            items: [
              {
                id: 'real-time-metrics-overview',
                label: 'Overview',
                href: '/site/docs/real-time-metrics'
              },
              {
                id: 'real-time-metrics-quickstart',
                label: 'Quickstart'
              },
              {
                id: 'real-time-metrics-how-it-works',
                label: 'How it works'
              },
              {
                id: 'real-time-metrics-guides',
                label: 'Guides and tutorials'
              },
              {
                id: 'real-time-metrics-reference',
                label: 'Reference',
                children: [
                  {
                    id: 'real-time-metrics-filters-and-time-range',
                    label: 'Filters and time range'
                  },
                  {
                    id: 'real-time-metrics-build-dashboards',
                    label: 'Build dashboards'
                  },
                  {
                    id: 'real-time-metrics-secure-dashboards',
                    label: 'Secure dashboards'
                  },
                  {
                    id: 'real-time-metrics-observe-dashboards',
                    label: 'Observe dashboards'
                  },
                  {
                    id: 'real-time-metrics-siem-azion',
                    label: 'SIEM Azion'
                  }
                ]
              },
              {
                id: 'real-time-metrics-limits',
                label: 'Limits'
              },
              {
                id: 'real-time-metrics-best-practices',
                label: 'Best practices'
              },
              {
                id: 'real-time-metrics-troubleshooting',
                label: 'Troubleshooting'
              },
              {
                id: 'real-time-metrics-glossary',
                label: 'Glossary'
              },
              {
                id: 'real-time-metrics-management',
                label: 'Management',
                children: [
                  {
                    id: 'real-time-metrics-management-pricing',
                    label: 'Pricing',
                    ref: true
                  },
                  {
                    id: 'real-time-metrics-management-changelog',
                    label: 'Changelog',
                    ref: true,
                    href: '/site/docs/release-notes'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'real-time-events',
        label: 'Real-Time Events',
        kind: 'drill',
        href: '/site/docs/real-time-events',
        groups: [
          {
            label: 'Real-Time Events',
            items: [
              {
                id: 'real-time-events-overview',
                label: 'Overview',
                href: '/site/docs/real-time-events'
              },
              {
                id: 'real-time-events-quickstart',
                label: 'Quickstart'
              },
              {
                id: 'real-time-events-how-it-works',
                label: 'How it works'
              },
              {
                id: 'real-time-events-guides',
                label: 'Guides and tutorials'
              },
              {
                id: 'real-time-events-reference',
                label: 'Reference',
                children: [
                  {
                    id: 'real-time-events-data-sources',
                    label: 'Data sources'
                  },
                  {
                    id: 'real-time-events-reference-graphql-api-fields',
                    label: 'GraphQL API fields',
                    ref: true
                  }
                ]
              },
              {
                id: 'real-time-events-limits',
                label: 'Limits'
              },
              {
                id: 'real-time-events-best-practices',
                label: 'Best practices'
              },
              {
                id: 'real-time-events-troubleshooting',
                label: 'Troubleshooting'
              },
              {
                id: 'real-time-events-glossary',
                label: 'Glossary'
              },
              {
                id: 'real-time-events-management',
                label: 'Management',
                children: [
                  {
                    id: 'real-time-events-management-pricing',
                    label: 'Pricing',
                    ref: true
                  },
                  {
                    id: 'real-time-events-management-changelog',
                    label: 'Changelog',
                    ref: true,
                    href: '/site/docs/release-notes'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'data-stream',
        label: 'Data Stream',
        kind: 'drill',
        href: '/site/docs/data-stream',
        groups: [
          {
            label: 'Data Stream',
            items: [
              {
                id: 'data-stream-overview',
                label: 'Overview',
                href: '/site/docs/data-stream'
              },
              {
                id: 'data-stream-quickstart',
                label: 'Quickstart'
              },
              {
                id: 'data-stream-how-it-works',
                label: 'How it works'
              },
              {
                id: 'data-stream-guides',
                label: 'Guides and tutorials'
              },
              {
                id: 'data-stream-reference',
                label: 'Reference',
                children: [
                  {
                    id: 'data-stream-stream-settings',
                    label: 'Stream settings'
                  },
                  {
                    id: 'data-stream-data-sources-and-variables',
                    label: 'Data sources and variables'
                  },
                  {
                    id: 'data-stream-templates-and-payload',
                    label: 'Templates and payload'
                  },
                  {
                    id: 'data-stream-endpoints',
                    label: 'Endpoints'
                  }
                ]
              },
              {
                id: 'data-stream-limits',
                label: 'Limits'
              },
              {
                id: 'data-stream-best-practices',
                label: 'Best practices'
              },
              {
                id: 'data-stream-troubleshooting',
                label: 'Troubleshooting'
              },
              {
                id: 'data-stream-glossary',
                label: 'Glossary'
              },
              {
                id: 'data-stream-management',
                label: 'Management',
                children: [
                  {
                    id: 'data-stream-management-pricing',
                    label: 'Pricing',
                    ref: true
                  },
                  {
                    id: 'data-stream-management-changelog',
                    label: 'Changelog',
                    ref: true,
                    href: '/site/docs/release-notes'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'edge-pulse',
        label: 'Edge Pulse',
        kind: 'drill',
        href: '/site/docs/edge-pulse',
        groups: [
          {
            label: 'Edge Pulse',
            items: [
              {
                id: 'edge-pulse-overview',
                label: 'Overview',
                href: '/site/docs/edge-pulse'
              },
              {
                id: 'edge-pulse-quickstart',
                label: 'Quickstart'
              },
              {
                id: 'edge-pulse-how-it-works',
                label: 'How it works'
              },
              {
                id: 'edge-pulse-reference',
                label: 'Reference',
                children: [
                  {
                    id: 'edge-pulse-javascript-tag',
                    label: 'JavaScript tag'
                  },
                  {
                    id: 'edge-pulse-reference-graphql-api-fields',
                    label: 'GraphQL API fields',
                    ref: true
                  }
                ]
              },
              {
                id: 'edge-pulse-glossary',
                label: 'Glossary'
              },
              {
                id: 'edge-pulse-management',
                label: 'Management',
                children: [
                  {
                    id: 'edge-pulse-management-pricing',
                    label: 'Pricing',
                    ref: true
                  },
                  {
                    id: 'edge-pulse-management-changelog',
                    label: 'Changelog',
                    ref: true,
                    href: '/site/docs/release-notes'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'edge-dns',
        label: 'Edge DNS',
        kind: 'drill',
        href: '/site/docs/edge-dns',
        groups: [
          {
            label: 'Edge DNS',
            items: [
              {
                id: 'edge-dns-overview',
                label: 'Overview',
                href: '/site/docs/edge-dns'
              },
              {
                id: 'edge-dns-quickstart',
                label: 'Quickstart'
              },
              {
                id: 'edge-dns-how-it-works',
                label: 'How it works'
              },
              {
                id: 'edge-dns-guides',
                label: 'Guides and tutorials'
              },
              {
                id: 'edge-dns-reference',
                label: 'Reference',
                children: [
                  {
                    id: 'edge-dns-zones-and-records',
                    label: 'Zones and records'
                  },
                  {
                    id: 'edge-dns-record-types',
                    label: 'Record types'
                  },
                  {
                    id: 'edge-dns-dnssec',
                    label: 'DNSSEC'
                  }
                ]
              },
              {
                id: 'edge-dns-limits',
                label: 'Limits'
              },
              {
                id: 'edge-dns-best-practices',
                label: 'Best practices'
              },
              {
                id: 'edge-dns-troubleshooting',
                label: 'Troubleshooting'
              },
              {
                id: 'edge-dns-glossary',
                label: 'Glossary'
              },
              {
                id: 'edge-dns-management',
                label: 'Management',
                children: [
                  {
                    id: 'edge-dns-management-pricing',
                    label: 'Pricing',
                    ref: true
                  },
                  {
                    id: 'edge-dns-management-changelog',
                    label: 'Changelog',
                    ref: true,
                    href: '/site/docs/release-notes'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'object-storage',
        label: 'Object Storage',
        kind: 'drill',
        href: '/site/docs/object-storage',
        groups: [
          {
            label: 'Object Storage',
            items: [
              {
                id: 'object-storage-overview',
                label: 'Overview',
                href: '/site/docs/object-storage'
              },
              {
                id: 'object-storage-quickstart',
                label: 'Quickstart'
              },
              {
                id: 'object-storage-how-it-works',
                label: 'How it works'
              },
              {
                id: 'object-storage-guides',
                label: 'Guides and tutorials'
              },
              {
                id: 'object-storage-reference',
                label: 'Reference',
                children: [
                  {
                    id: 'object-storage-buckets-and-objects',
                    label: 'Buckets and objects'
                  },
                  {
                    id: 'object-storage-s3-compatibility',
                    label: 'S3 compatibility'
                  },
                  {
                    id: 'object-storage-reference-runtime-api',
                    label: 'Runtime API',
                    ref: true
                  }
                ]
              },
              {
                id: 'object-storage-limits',
                label: 'Limits'
              },
              {
                id: 'object-storage-best-practices',
                label: 'Best practices'
              },
              {
                id: 'object-storage-troubleshooting',
                label: 'Troubleshooting'
              },
              {
                id: 'object-storage-glossary',
                label: 'Glossary'
              },
              {
                id: 'object-storage-management',
                label: 'Management',
                children: [
                  {
                    id: 'object-storage-management-pricing',
                    label: 'Pricing',
                    ref: true
                  },
                  {
                    id: 'object-storage-management-changelog',
                    label: 'Changelog',
                    ref: true,
                    href: '/site/docs/release-notes'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'sql-database',
        label: 'SQL Database',
        kind: 'drill',
        href: '/site/docs/sql-database',
        groups: [
          {
            label: 'SQL Database',
            items: [
              {
                id: 'sql-database-overview',
                label: 'Overview',
                href: '/site/docs/sql-database'
              },
              {
                id: 'sql-database-quickstart',
                label: 'Quickstart'
              },
              {
                id: 'sql-database-how-it-works',
                label: 'How it works'
              },
              {
                id: 'sql-database-guides',
                label: 'Guides and tutorials'
              },
              {
                id: 'sql-database-reference',
                label: 'Reference',
                children: [
                  {
                    id: 'sql-database-databases-and-queries',
                    label: 'Databases and queries'
                  },
                  {
                    id: 'sql-database-vector-search',
                    label: 'Vector search'
                  },
                  {
                    id: 'sql-database-edgesql-shell',
                    label: 'EdgeSQL Shell'
                  },
                  {
                    id: 'sql-database-reference-runtime-api',
                    label: 'Runtime API',
                    ref: true
                  }
                ]
              },
              {
                id: 'sql-database-limits',
                label: 'Limits'
              },
              {
                id: 'sql-database-best-practices',
                label: 'Best practices'
              },
              {
                id: 'sql-database-troubleshooting',
                label: 'Troubleshooting'
              },
              {
                id: 'sql-database-glossary',
                label: 'Glossary'
              },
              {
                id: 'sql-database-management',
                label: 'Management',
                children: [
                  {
                    id: 'sql-database-management-pricing',
                    label: 'Pricing',
                    ref: true
                  },
                  {
                    id: 'sql-database-management-changelog',
                    label: 'Changelog',
                    ref: true,
                    href: '/site/docs/release-notes'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'kv-store',
        label: 'KV Store',
        kind: 'drill',
        href: '/site/docs/kv-store',
        groups: [
          {
            label: 'KV Store',
            items: [
              {
                id: 'kv-store-overview',
                label: 'Overview',
                href: '/site/docs/kv-store'
              },
              {
                id: 'kv-store-quickstart',
                label: 'Quickstart'
              },
              {
                id: 'kv-store-how-it-works',
                label: 'How it works'
              },
              {
                id: 'kv-store-guides',
                label: 'Guides and tutorials'
              },
              {
                id: 'kv-store-reference',
                label: 'Reference',
                children: [
                  {
                    id: 'kv-store-namespaces',
                    label: 'Namespaces'
                  },
                  {
                    id: 'kv-store-reference-runtime-api',
                    label: 'Runtime API',
                    ref: true
                  }
                ]
              },
              {
                id: 'kv-store-limits',
                label: 'Limits'
              },
              {
                id: 'kv-store-best-practices',
                label: 'Best practices'
              },
              {
                id: 'kv-store-troubleshooting',
                label: 'Troubleshooting'
              },
              {
                id: 'kv-store-glossary',
                label: 'Glossary'
              },
              {
                id: 'kv-store-management',
                label: 'Management',
                children: [
                  {
                    id: 'kv-store-management-pricing',
                    label: 'Pricing',
                    ref: true
                  },
                  {
                    id: 'kv-store-management-changelog',
                    label: 'Changelog',
                    ref: true,
                    href: '/site/docs/release-notes'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    label: 'Management',
    items: [
      {
        id: 'services',
        label: 'Professional Services',
        kind: 'drill',
        href: '/site/docs/services',
        groups: [
          {
            label: 'Professional Services',
            items: [
              {
                id: 'services-overview',
                label: 'Overview',
                href: '/site/docs/services'
              },
              {
                id: 'services-best-practices-review',
                label: 'Best Practices Review'
              },
              {
                id: 'services-business-events-support',
                label: 'Business Events Support'
              },
              {
                id: 'services-instructor-led-training',
                label: 'Instructor-Led Training'
              },
              {
                id: 'services-integration-services',
                label: 'Integration Services'
              },
              {
                id: 'services-managed-configurations',
                label: 'Managed Configurations'
              },
              {
                id: 'services-security-response-team',
                label: 'Security Response Team'
              },
              {
                id: 'services-slack-channel',
                label: 'Slack Channel'
              },
              {
                id: 'services-technical-account-manager',
                label: 'Technical Account Manager'
              }
            ]
          }
        ]
      },
      {
        id: 'agreements',
        label: 'Agreements and Policies',
        kind: 'drill',
        href: '/site/docs/agreements',
        groups: [
          {
            label: 'Agreements and Policies',
            items: [
              {
                id: 'agreements-overview',
                label: 'Overview',
                href: '/site/docs/agreements'
              },
              {
                id: 'agreements-tos',
                label: 'Terms of Service'
              },
              {
                id: 'agreements-customer-agreement',
                label: 'Customer Agreement'
              },
              {
                id: 'agreements-sla',
                label: 'Service Level Agreement'
              },
              {
                id: 'agreements-privacy-policy',
                label: 'Privacy Policy'
              },
              {
                id: 'agreements-acceptable-use-policy',
                label: 'Acceptable Use Policy'
              },
              {
                id: 'agreements-azion-plans-terms-and-conditions',
                label: 'Terms and Conditions of Azion Plans'
              },
              {
                id: 'agreements-savings-plan-terms-and-conditions',
                label: 'Savings Plan Terms and Conditions'
              },
              {
                id: 'agreements-terms-and-conditions-of-reserved-capacity',
                label: 'Terms and Conditions of Reserved Capacity'
              },
              {
                id: 'agreements-azion-incentive-credits-terms-and-conditions',
                label: 'Terms and Conditions of Azion Incentive Credits'
              },
              {
                id: 'agreements-marketplace-agreement',
                label: 'Azion Marketplace Agreement'
              },
              {
                id: 'agreements-azion-affiliate-program-terms',
                label: 'Azion Affiliate Program Terms'
              },
              {
                id: 'agreements-faqs',
                label: 'Data Privacy FAQs'
              },
              {
                id: 'agreements-faq-azion-customers',
                label: 'Data Privacy FAQ – Customers'
              },
              {
                id: 'agreements-faq-end-users',
                label: 'Data Privacy FAQ – End Users'
              }
            ]
          },
          {
            label: 'Previous versions',
            items: [
              {
                id: 'agreements-terms-of-service',
                label: 'Terms of Service',
                children: [
                  {
                    id: 'agreements-tos-12-may-2026',
                    label: 'Terms of Service - May 12, 2026'
                  },
                  {
                    id: 'agreements-tos-29-august-2025',
                    label: 'Terms of Service - August 29, 2025'
                  },
                  {
                    id: 'agreements-tos-21-august-2025',
                    label: 'Terms of Service - August 21, 2025'
                  },
                  {
                    id: 'agreements-tos-9-july-2025',
                    label: 'Terms of Service - July 9, 2025'
                  },
                  {
                    id: 'agreements-tos-8-november-2024',
                    label: 'Terms of Service - November 8, 2024'
                  },
                  {
                    id: 'agreements-tos-29-august-2024',
                    label: 'Terms of Service - August 29, 2024'
                  },
                  {
                    id: 'agreements-tos-24-may-2024',
                    label: 'Terms of Service - May 24, 2024'
                  },
                  {
                    id: 'agreements-tos-15-march-2024',
                    label: 'Terms of Service - March 15, 2024'
                  },
                  {
                    id: 'agreements-tos-21-february-2024',
                    label: 'Terms of Service - February 21, 2024'
                  },
                  {
                    id: 'agreements-tos-18-september-2023',
                    label: 'Terms of Service - September 18, 2023'
                  },
                  {
                    id: 'agreements-tos-30-march-2023',
                    label: 'Terms of Service - March 30, 2023'
                  },
                  {
                    id: 'agreements-tos-3-march-2023',
                    label: 'Terms of Service - March 3, 2023'
                  },
                  {
                    id: 'agreements-tos-23-september-2022',
                    label: 'Terms of Service - September 23, 2022'
                  },
                  {
                    id: 'agreements-tos-10-november-2020',
                    label: 'Terms of Service - November 10, 2020'
                  },
                  {
                    id: 'agreements-tos-18-august-2020',
                    label: 'Terms of Service - August 18, 2020'
                  },
                  {
                    id: 'agreements-tos-15-may-2019',
                    label: 'Terms of Service - May 15, 2019'
                  },
                  {
                    id: 'agreements-tos-25-october-2017',
                    label: 'Terms of Service - 25 de Outubro de 2017'
                  },
                  {
                    id: 'agreements-tos-10-november-2016',
                    label: 'Terms of Service - November 10, 2016'
                  }
                ]
              },
              {
                id: 'agreements-customer-agreement-2',
                label: 'Customer Agreement',
                children: [
                  {
                    id: 'agreements-customer-agreement-28-july-2016',
                    label: 'Customer Agreement'
                  }
                ]
              },
              {
                id: 'agreements-service-level-agreement',
                label: 'Service Level Agreement',
                children: [
                  {
                    id: 'agreements-sla-25-may-2016',
                    label: 'Service Level Agreement'
                  }
                ]
              },
              {
                id: 'agreements-savings-plan-terms-and-conditions-2',
                label: 'Savings Plan Terms and Conditions',
                children: [
                  {
                    id: 'agreements-savings-plan-terms-and-conditions-10-july-2025',
                    label: 'Savings Plan Terms and Conditions - July 10, 2025'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'release-notes',
        label: 'Changelog',
        kind: 'drill',
        href: '/site/docs/release-notes',
        groups: [
          {
            label: 'Changelog',
            items: [
              {
                id: 'release-notes-overview',
                label: 'Overview',
                href: '/site/docs/release-notes'
              },
              {
                id: 'changelog-previous-year',
                label: 'Changelog previous years'
              }
            ]
          }
        ]
      },
      {
        id: 'status',
        label: 'Status',
        href: 'https://status.azion.com/',
        target: '_blank'
      }
    ]
  }
]

export const DOCS_HOME_ID = 'overview'

export const docsNavGroups = docsNavSections

/** Every destination row, without the rows that only point at another product's tree. */
export const docsLeaves = (nodes) => menuLeaves(nodes).filter((node) => !node.ref)

export const docsIdByRoute = new Map(
  docsLeaves(docsNavSections.flatMap((section) => section.items))
    .filter((item) => item.href)
    .map((item) => [item.href, item.id])
)

export const docsParentsOf = (id) =>
  menuPath(
    docsNavSections.flatMap((section) => section.items),
    id
  ) ?? []
