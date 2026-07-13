// Template catalog. Each template carries its preview metadata plus a
// `settings` array describing the template-specific fields shown under
// "Template Settings" on the deploy screen — this is what changes from one
// template to the next. A field: { name, label, placeholder, description,
// required }.

export const templates = {
  "nuxt-ecommerce": {
    slug: "nuxt-ecommerce",
    title: "Nuxt Ecommerce",
    description: "Starter kit for high-performance commerce with Nuxt.",
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
    title: "Vue Boilerplate",
    description: "Deploy a Vue.js single-page application directly on the edge.",
    framework: "vue",
    repoOwner: "aziontech",
    repoPath: "templates/vue",
    defaultRepoName: "vue-boilerplate",
    settings: [],
  },
};

export const DEFAULT_TEMPLATE = "nuxt-ecommerce";

export const getTemplate = (slug) =>
  templates[slug] || templates[DEFAULT_TEMPLATE];
