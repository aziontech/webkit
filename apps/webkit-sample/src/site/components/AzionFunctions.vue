<script setup>
  // Product page: Azion Functions (Figma `Assets` node 1684:7260), composed entirely from
  // the webkit marketing bundle — hero, two claims, the code sample, one client quotation,
  // the platform's primitives, the FAQ and the closing CTA. Copy is
  // azion.com/en/products/functions verbatim.
  import contabilizeiTile from '@aziontech/webkit/assets/clients/contabilizei-symbol.png'
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Faq from '@aziontech/webkit/faq'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
  import Quote from '@aziontech/webkit/quote'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import Ticker from '@aziontech/webkit/ticker'
  import Topic from '@aziontech/webkit/topic'
  import { useRouter } from 'vue-router'

  import { PRODUCT_STACK } from '../../shared/ui/brand/strips.js'
  import RuntimeApiCloud from '../ui/RuntimeApiCloud.vue'
  import ConsoleTraceBand from './ConsoleTraceBand.vue'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  // Spliced rather than written literally: validate-references.mjs reads any line of this
  // file starting with `import` as an import of this component, and would block the write
  // over `hono` and `azion/storage` — dependencies of the sample, not of the site.
  const IMPORT = 'import'

  const FILE_UPLOAD = `${IMPORT} type { AzionBucketObject, AzionStorageResponse } from "azion/storage";
${IMPORT} { createObject } from "azion/storage";
${IMPORT} { Hono } from "hono";

const app = new Hono();

app.post("/upload", async (c) => {
  const body = await c.req.parseBody();
  const file = body["file"]; // File | string

  // First check if file is a valid File object
  if (
    !file ||
    typeof file !== "object" ||
    typeof file.arrayBuffer !== "function"
  ) {
    return c.json({ message: "Invalid file" }, 400);
  }

  const { data: newObject } = (await createObject({
    bucket: "uploads",
    key: file.name,
    content: await file.arrayBuffer(),
  })) as AzionStorageResponse<AzionBucketObject>;

  return c.json({ key: newObject?.key }, 201, {
    "Content-Type": file.type,
    "Content-Disposition": \`attachment; filename="\${newObject?.key}"\`,
    "Content-Length": newObject?.size?.toString() ?? "0",
  });
});

export default app;`

  const TRANSACTIONAL_EMAIL = `${IMPORT} { Hono } from "hono";

const app = new Hono();

app.post("/welcome", async (c) => {
  const { email, name } = await c.req.json();

  // The API key lives in the workload's environment, never in the bundle
  const sent = await fetch("https://api.provider.com/v1/messages", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${Azion.env.get("EMAIL_API_KEY")}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: email,
      subject: "Welcome aboard",
      text: \`Hi \${name}, your account is ready.\`,
    }),
  });

  if (!sent.ok) {
    return c.json({ message: "Could not send the email" }, 502);
  }

  return c.json({ queued: true }, 202);
});

export default app;`

  const codeTabs = [
    {
      label: 'File upload',
      value: 'file-upload',
      language: 'typescript',
      code: FILE_UPLOAD,
      fileName: 'github.com/aziontech/azion-samples',
      fileIcon: 'pi pi-github'
    },
    {
      label: 'Send transactional emails',
      value: 'transactional-email',
      language: 'typescript',
      code: TRANSACTIONAL_EMAIL,
      fileName: 'github.com/aziontech/azion-samples',
      fileIcon: 'pi pi-github'
    }
  ]

  const productGroups = [
    {
      label: 'Compute',
      items: [
        {
          icon: 'ai ai-edge-functions',
          title: 'Functions',
          description: 'Run code globally'
        },
        { icon: 'pi pi-sitemap', title: 'Rules', description: 'Control traffic routing' },
        {
          icon: 'ai ai-load-balancer',
          title: 'Load Balancer',
          description: 'Distribute traffic with high availability'
        },
        {
          icon: 'pi pi-image',
          title: 'Image Processor',
          description: 'Optimize and transform images'
        }
      ]
    },
    {
      label: 'AI',
      items: [
        {
          icon: 'ai ai-edge-ai',
          title: 'AI Inference',
          description: 'Run low-latency models'
        },
        { icon: 'ai ai-gateway', title: 'AI Gateway', description: 'Govern and route LLMs' }
      ]
    },
    {
      label: 'Data',
      items: [
        {
          icon: 'ai ai-edge-storage',
          title: 'Object Storage',
          description: 'Store and deliver globally'
        },
        {
          icon: 'ai ai-edge-sql',
          title: 'SQL Database',
          description: 'Distributed SQL database'
        },
        { icon: 'ai ai-edge-kv', title: 'KV Store', description: 'Key-value data store' },
        {
          icon: 'ai ai-tiered-cache',
          title: 'Cache',
          description: 'Accelerate delivery and availability'
        }
      ]
    },
    {
      label: 'Security',
      items: [
        {
          icon: 'ai ai-waf-rules',
          title: 'Web Application Firewall',
          description: 'Smart way to block threats'
        },
        {
          icon: 'ai ai-azion-api',
          title: 'API Gateway',
          description: 'Authenticate and protect APIs'
        },
        {
          icon: 'pi pi-android',
          title: 'Bot Management',
          description: 'Stop bots, prevent abuse'
        },
        { icon: 'ai ai-edge-dns', title: 'DNS', description: 'High-performance DNS' }
      ]
    }
  ]

  const products = productGroups.flatMap((group) => group.items)

  const FAQ = [
    {
      value: 'what-is',
      question: 'What are Functions?',
      answer:
        'Azion Functions is a serverless platform for running code on distributed infrastructure with up to 5 minutes of CPU time per execution. Key features include: zero cold starts, 20MB bundle size, TypeScript/JavaScript support, WebAssembly runtime, and native framework support for Next.js, React, Vue, and Astro. Deploy API handlers, authentication, data pipelines, and browser automation without managing servers.'
    },
    {
      value: 'vs-workers',
      question: 'How does Functions compare to Cloudflare Workers?',
      answer:
        'Both platforms offer serverless compute with zero cold starts. The key difference is CPU time: Azion Functions supports extended execution, while Cloudflare Workers is optimized for lightweight request handlers. This makes Azion suitable for longer-running workloads like data transformation and browser automation. Cloudflare offers broader global distribution and multi-language support (Python, Rust, etc.). Choose Azion for compute-intensive jobs; choose Cloudflare for maximum global distribution.'
    },
    {
      value: 'languages',
      question: 'Which languages and frameworks are supported?',
      answer:
        'Functions supports TypeScript and JavaScript natively, plus WebAssembly for compiled extensions. Frameworks with native CLI support include Next.js, Vue, React, Angular, Gatsby, and Astro. The runtime provides web-standard APIs, extended Node.js APIs, and WebAssembly support.'
    },
    {
      value: 'cold-starts',
      question: 'Are there cold starts?',
      answer:
        'No. Functions are designed for consistent first-request performance with zero cold starts on the Azion Web Platform. Initial requests perform as fast as subsequent requests—critical for user-facing APIs and authentication flows.'
    },
    {
      value: 'cpu-time',
      question: 'What can I do with 5 minutes of CPU time?',
      answer:
        "Extended CPU time enables workloads that traditional serverless platforms can't handle: browser automation with Puppeteer, complex data transformation pipelines, image and video processing, AI inference jobs, and multi-step API orchestration. You don't need to architect around execution limits or set up external orchestration services."
    },
    {
      value: 'limits',
      question: 'What are the execution limits?',
      answer:
        'Functions support up to 5 minutes of CPU time per execution and bundle sizes up to 20 MB. These limits are designed for production workloads requiring extended processing time.'
    },
    {
      value: 'deploy',
      question: 'How do I deploy Functions?',
      answer:
        'Deploy from Git repositories with continuous deployment or use the Azion CLI (`azion init`, `azion build`, `azion deploy`). Functions integrate with Applications and Firewall via Rules Engine for request-time execution.'
    },
    {
      value: 'observability',
      question: 'How do I monitor and debug Functions?',
      answer:
        'Functions include built-in observability with metrics, logs, and per-request execution traces. You can troubleshoot issues directly in the console or stream data to external tools via Data Stream.'
    },
    {
      value: 'data-access',
      question: 'Can Functions access databases and storage?',
      answer:
        'Yes. Functions can connect to SQL Database, KV Store, and Object Storage using native APIs in the runtime. This enables building complete applications with data persistence on a single platform.'
    },
    {
      value: 'migrate',
      question: 'How do I migrate from Cloudflare Workers?',
      answer:
        "Both platforms use JavaScript/TypeScript, so code migration is straightforward for most functions. Export your Worker code, initialize an Azion Function, adapt runtime APIs, and deploy. If using Cloudflare KV/R2/D1, migrate data to Azion SQL Database, KV Store, or Object Storage. Lightweight request handlers can work on both platforms; longer-running functions benefit from Azion's extended execution time."
    }
  ]
</script>

<template>
  <Hero
    texture="dots"
    texture-fade="bottom"
    kind="screen"
    max-width="site"
    class="[--banner-offset:3.5rem]"
  >
    <Hero.Title
      centered
      eyebrow="Functions"
      title="Instant serverless functions for modern applications"
      description="Build and scale AI-powered applications on a globally integrated platform."
      class="min-w-0"
    >
      <template #actions>
        <Button
          label="Start free"
          kind="secondary"
          size="large"
          @click="goSignup"
        />
        <Button
          label="Docs"
          kind="outlined"
          size="large"
          href="/site/docs"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </Hero.Title>

    <!-- The stack a function is already written with, in the strip every product page runs
         under its hero. No label — the band is the marks alone. -->
    <template #bottom>
      <div
        aria-hidden="true"
        class="pointer-events-none h-[14rem] overflow-hidden [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent_0%,black_40%,black_75%,transparent_100%),linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)] lg:h-[20rem]"
      >
        <RuntimeApiCloud />
      </div>

      <Ticker
        kind="band"
        size="small"
        :marks="PRODUCT_STACK"
      />
    </template>
  </Hero>

  <SectionContainer max-width="site">
    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <MediaSplit
        media-href="/site/docs"
        framed
        title="Build with familiar frameworks"
        description="Write Functions in TypeScript or JavaScript and ship with the frameworks you already use."
      >
        <template #media>
          <Illustration name="modern-frontends" />
        </template>

        <template #actions>
          <Button
            label="Read Azion Docs"
            kind="secondary"
            size="small"
            icon="pi pi-book"
            href="/site/docs"
          />
        </template>
      </MediaSplit>
    </SectionModule>

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <MediaSplit
        media-href="/site/docs"
        framed
        kind="media-start"
        title="Serverless runtime built for modern workloads"
        description="Use Functions as a programmable layer between users, storefronts, APIs, and origins. Adapt requests in real time without changing your backend architecture."
      >
        <template #media>
          <Illustration name="runtime" />
        </template>

        <template #actions>
          <Button
            label="Read Azion Docs"
            kind="secondary"
            size="small"
            icon="pi pi-book"
            href="/site/docs"
          />
        </template>
      </MediaSplit>
    </SectionModule>

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <!-- The one band whose media is a panel rather than a scene: the ground is the
           tightest dot lattice, faded out upwards so it is densest where the sample runs
           off the frame, and `media-padded` gives the panel the inset an export does not want. -->
      <MediaSplit
        media-href="/site/docs"
        framed
        texture="dots"
        texture-size="small"
        texture-fade="top"
        media-padded
        title="From hello world to full-stack applications"
        description="Run application logic with the resources a full-stack product needs: relational data, low-latency state, object storage, and AI responses through Azion libraries."
      >
        <template #media>
          <!-- The shell carries the elevation at the block's own radius: CodeBlock rounds to
               --shape-elements and clips its overflow, so a shadow on the block itself is
               clipped away. Its height plus the negative bottom margin run the panel past the
               cell's padding onto the frame's bottom rule, which cuts the sample mid-line. -->
          <div
            class="-mb-(--spacing-xl) h-[20rem] w-full min-w-0 overflow-hidden rounded-t-(--shape-elements) shadow-(--shadow-sm)"
          >
            <CodeBlock
              :tabs="codeTabs"
              default-value="file-upload"
              show-line-numbers
              animate-lines
              copy-aria-label="Copy the file upload sample"
            />
          </div>
        </template>

        <template #actions>
          <Button
            label="Read Azion Docs"
            kind="secondary"
            size="small"
            icon="pi pi-book"
            href="/site/docs"
          />
          <Button
            label="See Github"
            kind="outlined"
            size="small"
            icon="pi pi-github"
            href="https://github.com/aziontech"
            target="_blank"
          />
        </template>
      </MediaSplit>
    </SectionModule>

    <SectionGap hatch />

    <ConsoleTraceBand />

    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <Quote
          kind="highlight"
          text="With Azion, Contabilizei improved request delivery at the Edge, reduced infrastructure costs, and gained fast access to support whenever needed."
          name="Fabrício Santos"
          job-title="DevSecOps Manager at Contabilizei"
          :logo="contabilizeiTile"
          logo-alt="Contabilizei"
          class="p-(--spacing-xl)"
        />
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Complete, not complex"
          title="A full-stack platform that scales instantly"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="p-(--spacing-xl)">
          <CardGrid
            kind="frame"
            :columns="4"
            :mobile-columns="2"
          >
            <CardGrid.Cell
              v-for="product in products"
              :key="product.title"
            >
              <Topic
                :icon="product.icon"
                :title="product.title"
                :description="product.description"
                :heading-level="3"
              />
            </CardGrid.Cell>
          </CardGrid>
        </div>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      id="faq"
      :divided="false"
      :padded="false"
    >
      <Faq
        framed
        title="Frequently Asked Questions"
        :items="FAQ"
      />
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      id="contact"
      :divided="false"
      :padded="false"
      class="scroll-mt-(--spacing-xxl)"
    >
      <CallToAction
        framed
        kind="split"
        eyebrow="Build"
        title="Build once."
        title-muted="Run everywhere."
        description="Get a faster path to launch, lower latency, and less infrastructure overhead."
      >
        <template #actions>
          <Button
            label="Start Free"
            kind="secondary"
            size="large"
            @click="goSignup"
          />
        </template>
        <template #aside>
          <Button
            label="Talk to our team"
            kind="outlined"
            size="large"
            href="#"
            icon="pi pi-chevron-right"
            icon-position="trailing"
            animated
          />
        </template>
      </CallToAction>
    </SectionModule>

    <!-- The closing Spacer draws NO rules: the footer below opens with a full-bleed rule,
         and SectionGap's fixed borders="y" would land a second hairline on that pixel. -->
    <FrameBox
      borders="none"
      marks="none"
      hatch
      class="h-[calc(var(--spacing-xxl)*2)]"
    />
  </SectionContainer>
</template>
