// Template catalog. Each template carries its preview metadata plus a
// `settings` array describing the template-specific fields shown under
// "Template Settings" on the deploy screen — this is what changes from one
// template to the next. A field: { name, label, placeholder, description,
// required }. Titles/descriptions mirror the Creation Center cards so the deploy
// screen reflects exactly the template that was clicked.

export const templates = {
  "next-boilerplate": {
    slug: "next-boilerplate",
    title: "Next.js Boilerplate",
    description:
      "Deploy a full-stack Next.js application to the edge in a few steps.",
    framework: "next",
    repoOwner: "aziontech",
    repoPath: "templates/nextjs",
    defaultRepoName: "nextjs-boilerplate",
    settings: [],
  },

  "nuxt-ecommerce": {
    slug: "nuxt-ecommerce",
    title: "Nuxt E-commerce",
    description: "Launch a Nuxt e-commerce or content app on the edge.",
    framework: "nuxt",
    repoOwner: "aziontech",
    repoPath: "templates/nuxt-ecommerce",
    defaultRepoName: "nuxt-ecommerce",
    settings: [
      {
        name: "shopifyAccessToken",
        label: "Shopify Access Token",
        placeholder: "Access Token",
        description:
          "You can find this token in Credentials on Shopify Project Configurations.",
        required: true,
      },
      {
        name: "shopifyRevalidationSecret",
        label: "Shopify Revalidation Secret",
        placeholder: "Revalidation Secret",
        description:
          "You can find this secret in Credentials on Shopify Project Configurations.",
      },
      {
        name: "shopifyStoreDomain",
        label: "Shopify Store Domain",
        placeholder: "https://your-shopify-store-subdomain.myshopify.com",
        description: "Your Shopify Store Domain",
      },
    ],
  },

  "turso-starter": {
    slug: "turso-starter",
    title: "Turso Starter Kit",
    description:
      "Integrate a Turso database, built with Turso's LibSQL SDK, into an edge application.",
    framework: "nextjs",
    repoOwner: "aziontech",
    repoPath: "templates/turso-starter",
    defaultRepoName: "turso-starter-kit",
    settings: [
      {
        name: "tursoDatabaseUrl",
        label: "Turso Database URL",
        placeholder: "libsql://your-database.turso.io",
        description: "The libSQL connection URL for your Turso database.",
        required: true,
      },
      {
        name: "tursoAuthToken",
        label: "Turso Auth Token",
        placeholder: "Auth Token",
        description: "Generate a token with `turso db tokens create`.",
        required: true,
      },
    ],
  },

  "react-boilerplate": {
    slug: "react-boilerplate",
    title: "React Boilerplate",
    description: "Automate your React.js deployment process on the edge.",
    framework: "react",
    repoOwner: "aziontech",
    repoPath: "templates/react",
    defaultRepoName: "react-boilerplate",
    settings: [],
  },

  "vue-boilerplate": {
    slug: "vue-boilerplate",
    title: "Vue.js Quick Setup",
    description:
      "A lightweight template to rapidly build Vue.js applications on the edge.",
    framework: "vue",
    repoOwner: "aziontech",
    repoPath: "templates/vue",
    defaultRepoName: "vue-boilerplate",
    settings: [],
  },

  "angular-boilerplate": {
    slug: "angular-boilerplate",
    title: "Angular Boilerplate",
    description: "Automate your Angular deployment process with this template.",
    framework: "angular",
    repoOwner: "aziontech",
    repoPath: "templates/angular",
    defaultRepoName: "angular-boilerplate",
    settings: [],
  },

  "astro-starter": {
    slug: "astro-starter",
    title: "Astro Starter",
    description: "Ship a content-driven Astro site that renders at the edge.",
    framework: "astro",
    repoOwner: "aziontech",
    repoPath: "templates/astro",
    defaultRepoName: "astro-starter",
    settings: [],
  },

  "svelte-boilerplate": {
    slug: "svelte-boilerplate",
    title: "Svelte Boilerplate",
    description:
      "Accelerate the deployment of Svelte applications to run on the edge.",
    framework: "svelte",
    repoOwner: "aziontech",
    repoPath: "templates/svelte",
    defaultRepoName: "svelte-boilerplate",
    settings: [],
  },

  "solidjs-starter": {
    slug: "solidjs-starter",
    title: "SolidJS Starter",
    description: "Build a fine-grained reactive SolidJS app on the edge.",
    framework: "solidjs",
    repoOwner: "aziontech",
    repoPath: "templates/solidjs",
    defaultRepoName: "solidjs-starter",
    settings: [],
  },

  "redwood-boilerplate": {
    slug: "redwood-boilerplate",
    title: "RedwoodJS Boilerplate",
    description: "Deploy a full-stack RedwoodJS application on the edge.",
    framework: "redwood",
    repoOwner: "aziontech",
    repoPath: "templates/redwood",
    defaultRepoName: "redwood-boilerplate",
    settings: [],
  },

  "flutter-web": {
    slug: "flutter-web",
    title: "Flutter Web",
    description: "Serve a cross-platform Flutter web build from the edge.",
    framework: "flutter",
    repoOwner: "aziontech",
    repoPath: "templates/flutter",
    defaultRepoName: "flutter-web",
    settings: [],
  },
};

export const DEFAULT_TEMPLATE = "nuxt-ecommerce";

export const getTemplate = (slug) =>
  templates[slug] || templates[DEFAULT_TEMPLATE];
