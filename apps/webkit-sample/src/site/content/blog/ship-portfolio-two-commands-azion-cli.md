It sat in my backlog for a long time, mostly because I expected the infrastructure work to be a slog. The part I was dreading—hosting, caching, DNS—turned out to be basically two commands.

My portfolio had been a “next weekend” project for so long. But I finally shipped it, and the whole thing took less time than picking a font.

```
azion init
azion deploy
```

That’s the entire deployment story. Here’s exactly what happened in between.

## The setup

I didn’t want to design anything from scratch. I wanted a résumé website that looked decent, worked on a phone, and printed to a clean PDF.

Azion has a template for that: [DevsCard](https://www.azion.com/en/marketplace/). It’s an Astro project that builds your online and paper résumé from a handful of TypeScript data files. No components to write, no CSS to fight.

First, install the [Azion CLI](https://www.azion.com/en/documentation/products/build/develop-with-azion/cli/):

```
curl -fsSL https://raw.githubusercontent.com/aziontech/azion/refs/heads/main/scripts/install.sh | bash
```

It’s also on Homebrew, WinGet, and Chocolatey, and ships as deb, rpm, and apk packages. Then log in once with `azion login`.

## 01 — azion init: pick a template, get a project

This is the part I expected to be tedious. It wasn’t. The CLI only asks three things:

```
? Your application's name: devscard-my-portfolio
? Choose a preset: Astro
? Choose a template: Devscard

Template successfully fetched
Installing application dependencies
Template successfully configured
```

Astro, Next.js, Vue, React, Angular, Vite, Hexo, and plain static sites are all in the preset list.

From there it clones the template, installs dependencies with whatever package manager it detects, and generates the platform configuration for you.

That configuration lands in an `azion.config` file, and it’s worth opening—it’s the part most people expect to write by hand:

```js
module.exports = {
  build: { preset: 'astro', polyfills: true },
  storage: [
    { name: 'devscard-my-portfolio', dir: './dist', workloadsAccess: 'read_only' }
  ],
  applications: [
    {
      name: 'devscard-my-portfolio',
      cache: [
        { browser: { maxAgeSeconds: 7200 }, edge: { maxAgeSeconds: 7200 } }
      ],
      rules: { /* static delivery + index.html fallbacks */ }
    }
  ]
}
```

Storage, cache policy, and routing rules: already written. I didn’t touch any of it.

When `init` finishes it offers to start a local dev server or deploy right away. I said no to both, because I wanted to put my own name on it first.

## Making it mine

Everything you edit lives in `src/data/`. Each file is a plain object:

| File | What’s in it |
|---|---|
| `src/data/config.ts` | Page title, meta description, locale, date format, favicon |
| `src/data/sections/main-section.data.ts` | Name, role, contact details, social links, bio |
| `src/data/sections/experience-section.data.ts` | Job history, with dates and per-role descriptions |
| `src/data/sections/skills-section.data.ts` | Skill groups and proficiency levels |
| `src/data/sections/portfolio-section.data.ts` | Projects, screenshots, and links |

The template ships with a fictional name—swap it for yours:

```ts
const mainSectionData = {
  fullName: 'Mark Freeman',
  role: 'Senior React Developer',
  details: [
    { label: 'Email', value: 'mark.freeman.dev@gmail.com' },
    { label: 'From', value: 'Warsaw, Poland' },
  ],
  tags: [{ name: 'Open for freelance' }],
}
```

Images go in `src/assets/`. Replace `my-image.jpeg` with your own photo, swap the project screenshots, and you’re done. Set `visible: false` on any section you don’t want.

## 02 — azion dev: check it before you ship it

```
azion dev
```

This builds the project and runs it on the same runtime that will serve it in production. What you see locally is what deploys. Pass `--port` if something else already owns the default.

I went back and forth here a few times, fixing a job title, cropping a screenshot, hiding the “Favorites” section. Edit, reload, move on.

## 03 — azion deploy: one command, every resource

The CLI builds the project, then provisions everything the site needs:

```
$ azion deploy

Created Bucket devscard-my-portfolio
Uploading source files
Upload completed successfully!
Created Application devscard-my-portfolio with ID 111111111
Created Cache Settings for Application
Created Rules Engine for Application
Created Workload devscard-my-portfolio with ID 1111111111

Your application is being deployed to all Azion Locations and it might take a few minutes.

Your Application was deployed successfully

To visualize your application access the Domain: https://myportfoliodomain.map.azionedge.net
```

A storage bucket, an application with its cache policy and routing rules, and a workload with a live URL—no dashboard clicking, no YAML to learn first.

The resource IDs get written to `azion/azion.json`, so the next `azion deploy` updates those same resources instead of creating new ones. Future deployments also purge the cache automatically.

To put my own domain on it:

```
azion update workloads \
  --workload-id 1111111111 \
  --domains portfolio.mydomain.com
```

Point the DNS at it and you’re live.

### Prefer the Console? Same template, no terminal.

Open the [Azion Console](https://console.azion.com/login), go to the templates library, and launch DevsCard. The Console connects to your GitHub account, creates a repository from the template, and deploys it. Every push to `main` redeploys automatically.

DevsCard also ships with a deploy button, which is the shortest path of all.

**CLI path — local iteration.** `azion dev` gives you a fast edit-reload loop before anything goes out, and deploys are a command you can drop into CI.

**Console path — Git-based deploys.** Nothing to install. Push to `main` and it redeploys. Good if you’d rather edit in the browser or on someone else’s machine.

Both end up in the same place. The CLI and the Console operate on the same resources, so you can start in one and continue in the other.

## A few flags worth knowing

| Command | What it does |
|---|---|
| `azion init --name my-site` | Skip the name prompt |
| `azion init --auto` | Run the whole flow with no questions, deploy included |
| `azion deploy --sync` | Reconcile local `azion.json` with what’s actually on the platform |
| `azion deploy --dry-run` | Simulate the deploy without changing anything |
| `azion logs http` | Watch HTTP event logs once traffic starts arriving |

## What I’d tell past me

The friction was never the writing. It was the hour of configuring hosting, caching, and DNS before a single page was visible.

`azion init` removed the setup. `azion dev` kept the iteration loop local and fast. `azion deploy` handled provisioning, upload, and distribution in one pass.

Two commands, one weekend afternoon, and the site runs on a distributed architecture, served from data centers close to whoever opens it.

Pick a template and go. [Azion CLI reference](https://www.azion.com/en/documentation/products/build/develop-with-azion/cli/) · [DevsCard guide](https://www.azion.com/en/documentation/products/marketplace/templates/)

---

None of this cost Patrick anything. DevsCard, the CLI, the Console—all of it ran on Hobby, Azion Platform’s free plan. Here’s what else that same plan covers.

## Build for Free on Azion’s Hobby Plan

[Hobby](https://www.azion.com/en/pricing/) is Azion’s free plan for personal projects, POCs, and experimentation. Get GA products and features included in the [Azion Platform](https://www.azion.com/en/) offering, within plan limits—no infrastructure setup required.

### What’s included

- [Functions](https://www.azion.com/en/products/functions/) for application logic, with no cold starts
- [Object Storage](https://www.azion.com/en/products/object-storage/) for files and unstructured data
- [Image Processor](https://www.azion.com/en/products/image-processor/) to optimize images automatically
- [DDoS Protection and WAF](https://www.azion.com/en/products/web-application-firewall/) to secure your projects
- Azion’s distributed infrastructure, with 100+ data centers, to run and deliver your applications

[SQL Database](https://www.azion.com/en/products/sql-database/), [KV Store](https://www.azion.com/en/products/kv-store/), and [AI Inference](https://www.azion.com/en/products/ai-inference/) are available in Preview—request access through a support ticket, subject to approval.

### Fastest way to start: templates

Pick a template from the [Marketplace](https://www.azion.com/en/marketplace/)—résumé, blog, portfolio, AI agent, e-commerce prototype—connect your GitHub account, and deploy in minutes. Prefer to start from scratch? Use the [Azion CLI](https://www.azion.com/en/documentation/products/build/develop-with-azion/cli/).

### How it works

1. [Create your free account](https://console.azion.com/signup)
2. Choose a template and connect GitHub, or start your own project with the CLI
3. Deploy from the Console or run `azion deploy`
4. Watch the logs until the application is live

No region to choose, no server to provision.

### When you outgrow Hobby

When your application is ready for production, or consistently reaches plan limits, Pro is the next step—same platform, higher limits, on-demand billing. For larger-scale needs, Enterprise offers custom terms, reserved capacity, and advanced support.

[Start free →](https://console.azion.com/signup)

#### FAQ

**How long can I use Hobby?** Through learning, experimentation, and validation—including POCs—as long as the application isn’t in production and stays within plan limits.

**What happens if I exceed the limits?** You’ll need to upgrade to Pro, or your account may face restrictions.

**Do I need to build from scratch?** No—templates cover different project types and cut setup work.
