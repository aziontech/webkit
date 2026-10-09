Developers told us they wanted the experience of developing on a web platform to be like working locally. We have worked hard to create and improve tools that make that possible. Here’s what’s new and how these updates accelerate automation, deployment, and scalability.

### 🚀 Azion CLI: Your Terminal, Supercharged

Install the CLI in seconds:

*Terminal window*

Terminal window

```shell
# For macOS (Homebrew)
brew install azion

# For Linux (APT)

curl -o azioncli.deb https://github.com/aziontech/azion/releases/download/3.1.0/azion_3.1.0_linux_386.deb

sudo apt install ./azioncli.deb

# For Windows (Winget)
winget install aziontech.azion
```

Once installed, you can:

- **Initialize projects** (with best-practice templates).
- **Automate deployments** via CI/CD.
- **Manage everything** via IaC (with Terraform or YAML).
- **Build and test locally** with full support for Node.js, frameworks, and polyfills.

Example: Instantly starting a Next.js edge application

*Terminal window*

Terminal window

```shell
azion init
```

Pick your desired template from the list—the CLI will handle the rest and have you up and running in no time.

Want to go serverless with your own edge function?

*Terminal window*

Terminal window

```shell
azion create edge-function --name myEdgeFunction --code pathtoyourfile.js --active true
```

See the [CLI docs for more commands →](https://www.azion.com/en/documentation/products/azion-cli/overview/)

---

### 📦 Azion Bundler 5.1: Build, Optimize, and Ship Twice as Fast

Azion Bundler isn’t just for JavaScript—it’s your fast lane for Next.js, Vue, Angular, Gatsby, and more.  Behind the scenes, it applies polyfills to Node APIs, ensuring your code runs with no extra effort on the Azion Web Platform.

**Why use it?**

- 2x faster builds.
- Optimized for edge: 9x smaller bundles, smarter polyfills.
- Compatible with popular modern frameworks.

### Kickstart your deployment—the CLI and Bundler make it simple to take your existing app live

Inside your existing project folder, use the command below to link your project to an edge application:

*Terminal window*

Terminal window

```shell
azion link
```

You’ll be prompted to choose a preset, which will be used to generate the `azion.config.mjs`. In this example, it’s **Astro**.

The CLI will guide you through the rest of the process. In less than five minutes, your application can be up and running on the Azion Web Platform.

A Custom `azion.config.mjs` will be generated automatically. This contains the build settings the Bundler uses for your application.

```javascript
export default {
  build: {
    preset: 'astro',
    polyfills: true,
    worker: false
  },
  origin: [
    {
      name: 'origin-storage-default',
      type: 'object_storage'
    }
  ],
  rules: {
    request: [
      {
        name: 'Set Storage Origin for All Requests',
        match: '^\\/',
        behavior: {
          setOrigin: {
            name: 'origin-storage-default',
            type: 'object_storage'
          }
        }
      },
      {
        name: 'Deliver Static Assets',
        match: '.(css|js|ttf|woff|woff2|pdf|svg|jpg|jpeg|gif|bmp|png|ico|mp4|json|xml|html)$',
        behavior: {
          setOrigin: {
            name: 'origin-storage-default',
            type: 'object_storage'
          },
          deliver: true
        }
      },
      {
        name: 'Redirect to index.html',
        match: '.*/$',
        behavior: {
          rewrite: '${uri}index.html'
        }
      },
      {
        name: 'Redirect to index.html for Subpaths',
        match: '^(?!.*\\/$)(?![\\s\\S]*\\.[a-zA-Z0-9]+$).*',
        behavior: {
          rewrite: '${uri}/index.html'
        }
      }
    ]
  },
  functions: [
    {
      name: 'handler',
      path: '.edge/worker.js'
    }
  ]
}
```

Bundler is open source—jump in to explore, fork, or contribute on [GitHub](https://github.com/aziontech/bundler)

---

### 💡Build, Integrate, and Deploy: Templates, Tools & CI/CD Made Easy

- **Deploy instantly from dozens of templates:** E-commerce, blog, API, full-stack SSR, and more.
- **Leverage integrations:** Plug into Sanity, Cosmic, ButterCMS, Turso, or bring your own RESTful CMS or database.
- **Automation:** Integrate CLI commands in GitHub Actions, GitLab CI, Jenkins, etc.

**Deploy a template:**

1. Login to [Console](https://console.azion.com).
2. Click the **+ Create** button.
3. Choose your favorite template (Next.js, Astro, Docussaurus).
4. Connect your GitHub Account.
5. Click “Deploy”

**CI/CD is auto-configured. Focus on your code, not the pipeline.**

#### 💖 AI Web App Builders + Azion: Deploy Applications in Seconds

Easily build with tools like [Lovable](https://lovable.dev/), add your code to GitHub, and deploy to the Azion Web Platform in just a few clicks.

1. Create your code with Lovable and connect it to your GitHub account.
2. In [Console](https://console.azion.com) Click the **+ Create** button.
3. Select Import from Github.
4. Select your repository.
5. Choose an application name and Preset (in this case, React).

[Deploy your Lovable app on Azion](https://www.youtube.com/embed/-rHe_9B9hZk?si=w7v6M-iAu3Vx8v69)

When you deploy, your edge application gets a ready-to-use Azion domain like `xxxxxxxxxx.map.azionedge.net`— Want to use your existing domain? You can add your [own domain anytime](https://www.azion.com/en/documentation/products/guides/point-domain-to-azion/).

---

### 📚 Simplify Service Interactions with Azion Lib

Introducing [Azion Lib](https://www.azion.com/en/documentation/products/azion-lib/overview/), a comprehensive set of libraries designed to simplify your interaction with the Azion Web Platform. Instead of requiring you to manually handle HTTP calls or deal with complex requests, the libraries handle the communication details with the platform. Azion Lib allows you to manage settings or query metrics through intuitive methods.

```typescript
import createClient from 'azion/applications'
import { createApplication, getApplications, getApplication } from 'azion/applications'
;(async () => {
  const client = createClient({ token: 'your-api-token', options: { debug: true } })

  // Create an application
  const { data: newApp } = await createApplication({
    data: { name: 'My Edge App', delivery_protocol: 'http,https', application_acceleration: true }
  })
  console.log('Created application:', newApp)

  // List applications
  const { data: apps } = await getApplications({ params: { page: 1, page_size: 5 } })
  console.log('Applications:', apps)

  // Retrieve a specific application
  const applicationId = 12345 // Replace with your application ID
  const { data: app } = await getApplication(applicationId, { debug: true })
  console.log('Application details:', app)
})()
```

---

### 🌐 Domains Made Easy

Instantly share apps with a readable domain (FQDN) like:

```
https://(myproject).azion.app
```

Support for adding friendly app domains to Azion Console is coming soon!

---

### 🔑 Meet API v4: Event-Driven, Ultra Fast, Easy Auth

Our new API v4 lets you automate and integrate securely and at scale:

- **JWT/Bearer authentication.**
- **Activity History** via GraphQL for full auditability.
- **Workload resource model** so you can orchestrate distributed edge apps as a single entity.
- **Async/event-driven core**: resilient and high-performant.

**API v4** is launching in waves starting May 2025! Stay tuned and up-to-date with our [release notes.](https://www.azion.com/en/documentation/products/release-notes/)

---

### 🤓 Ready to Dive In? Resources For Developers

- [Azion Web Platform Overview](https://www.azion.com/en/documentation/products/azion-platform-overview/): Get to know our platform.
- [Azion Templates](https://www.azion.com/en/documentation/products/marketplace/templates/): Explore our templates, designed to get you running your apps faster.
- [Azion CLI Reference](https://www.azion.com/en/documentation/products/azion-cli/overview/): Full command breakdown, IaC samples, and more.
- [Bundler](https://github.com/aziontech/bundler): Our open source, edge-optimized Bundler—build, optimize, and ship apps fast with modern framework support.
- [Azion Lib](https://www.azion.com/en/documentation/products/azion-lib/overview/): Discover ready-to-use functions and helpers for common edge use cases—just import and go.
- [DevTools](https://www.azion.com/en/documentation/devtools/): Our tools to help you develop, test quickly, and deploy confidently.
- [Azion API Reference](https://api.azion.com/?_gl=1*1ujaozt*_gcl_au*MTkzOTExNjUyOC4xNzQ1MzM4NDY2LjEzMzAxMjI3NDEuMTc0NTg1MDc5OC4xNzQ1ODUwOTcz): All endpoints, schemas, and security models—ready for Postman or code.

---

### The Azion Platform Means True Freedom For Developers

- **Open source tools:** Contribute or fork as needed.
- **No lock-in:** Azion supports WinterCG APIs to ensure open standards and avoid vendor lock-in.
- **Native IaC:** Terraform provider, full API, CLI automation.
- **Seamless scaling:** Your logic, global, zero cold-start.

Build, secure, and scale applications everywhere, your way, and faster than ever. **Get started →** [docs.azion.com](https://docs.azion.com/)

---

**Questions? Suggestions?**  Join the Azion Discord, open issues on GitHub, or reach us through [our community channels](https://discord.com/invite/Yp9N7RMVZy).
