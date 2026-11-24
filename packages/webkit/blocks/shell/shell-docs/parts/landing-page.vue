<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CopyPromptButton from '@aziontech/webkit/copy-prompt-button'
  import DocAgentCard from '@aziontech/webkit/doc-agent-card'
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocHero from '@aziontech/webkit/doc-hero'
  import DocPreviousNext from '@aziontech/webkit/doc-previous-next'
  import DocProse from '@aziontech/webkit/doc-prose'
  import Link from '@aziontech/webkit/link'

  import { useShellDocsPage } from '../composables/use-shell-docs-page'
  import {
    attacks,
    compliance,
    followAlong,
    interfaces,
    objectives,
    prompt,
    templates
  } from '../landing-data'

  useShellDocsPage('overview')
</script>

<template>
  <article class="layout-column layout-boundary-inline flex flex-col pb-(--spacing-2xl)">
    <DocHero
      title="Welcome to Azion Docs"
      description="We make every application fast and reliable. Deploy on a global network with enterprise-grade security and no cold starts."
    >
      <template #actions>
        <Button
          label="Get started"
          variant="primary"
          size="large"
          href="/docs/get-started"
        />
        <CopyPromptButton :value="prompt" />
      </template>
      <template #note>
        The prompt hands your coding agent the CLI, live docs over MCP, and this project linked.
      </template>
    </DocHero>

    <DocProse>
      <div class="flex flex-col gap-(--spacing-2xl)">
        <section
          aria-labelledby="start-by-interface"
          class="flex flex-col"
        >
          <DocHeading :level="2">Start by interface</DocHeading>
          <p>
            Hand the Console to a coding agent, or drive it yourself: visually, from the terminal,
            or over the API.
          </p>
          <DocAgentCard
            :prompt="prompt"
            action-href="/docs/agent-setup"
          />
          <DocCardGroup :columns="3">
            <DocCard
              v-for="item in interfaces"
              :key="item.title"
              :title="item.title"
              :icon="item.icon"
              :link-label="item.link"
              :href="item.href"
              >{{ item.text }}</DocCard
            >
          </DocCardGroup>
        </section>

        <section
          aria-labelledby="start-by-objective"
          class="flex flex-col"
        >
          <DocHeading :level="2">Start by objective</DocHeading>
          <p>Build something, make it faster, lock it down, or run AI on it.</p>
          <DocCardGroup :columns="2">
            <DocCard
              v-for="item in objectives"
              :key="item.title"
              :title="item.title"
              :icon="item.icon"
              :href="item.href"
              >{{ item.text }}</DocCard
            >
            <div class="sm:col-span-2">
              <DocCard
                title="Explore use cases"
                icon="az az-sitemap"
                href="/docs/customer-use-cases-section"
                >Validated designs that show how Azion products combine to solve each use case,
                grouped by solution.</DocCard
              >
            </div>
          </DocCardGroup>
          <p>
            Also useful:
            <Link
              inline
              href="/docs/observe"
              >Observe</Link
            >
          </p>
        </section>

        <section
          aria-labelledby="templates"
          class="flex flex-col"
        >
          <DocHeading :level="2">Ready-made templates</DocHeading>
          <p>Deploy in one step, with CI/CD already wired up.</p>
          <DocCardGroup
            :columns="4"
            :mobile-columns="2"
          >
            <DocCard
              v-for="item in templates"
              :key="item.title"
              :title="item.title"
              :icon="item.icon"
              :href="item.href"
            />
          </DocCardGroup>
          <p>
            Also useful:
            <Link
              inline
              href="/docs/get-started/first-deploy"
              >First deploy</Link
            >,
            <Link
              inline
              href="/docs/frameworks-compatibility"
              >Frameworks compatibility</Link
            >
          </p>
        </section>

        <section
          aria-labelledby="stop-attacks"
          class="flex flex-col"
        >
          <DocHeading :level="2">Stop attacks</DocHeading>
          <p>
            Everything you need to protect applications, APIs, and the traffic that reaches them.
          </p>
          <DocCardGroup :columns="3">
            <DocCard
              v-for="item in attacks"
              :key="item.title"
              :title="item.title"
              :icon="item.icon"
              :href="item.href"
              >{{ item.text }}</DocCard
            >
          </DocCardGroup>
          <p>
            Reference, when you need the details:
            <Link
              inline
              href="/docs/ddos-protection"
              >DDoS Protection</Link
            >,
            <Link
              inline
              href="/docs/waf-rule-sets"
              >WAF Rule Sets</Link
            >,
            <Link
              inline
              href="/docs/bot-manager"
              >Bot Manager</Link
            >
          </p>
        </section>

        <section
          aria-labelledby="compliance"
          class="flex flex-col"
        >
          <DocHeading :level="2">Assess risk and prove compliance</DocHeading>
          <p>
            What the platform covers, what stays with you, and where the evidence lives when an
            auditor asks for it.
          </p>
          <DocCardGroup :columns="3">
            <DocCard
              v-for="item in compliance"
              :key="item.title"
              :title="item.title"
              :icon="item.icon"
              :href="item.href"
              >{{ item.text }}</DocCard
            >
          </DocCardGroup>
        </section>

        <section
          aria-labelledby="follow-along"
          class="flex flex-col"
        >
          <DocHeading :level="2">Follow along</DocHeading>
          <p>
            Release notes as things ship, plus the blog, the YouTube channel, and the Discord where
            questions get answered.
          </p>
          <DocCardGroup :columns="3">
            <DocCard
              v-for="item in followAlong"
              :key="item.title"
              :title="item.title"
              :icon="item.icon"
              :link-label="item.link"
              :target="item.target"
              :href="item.href"
              >{{ item.text
              }}<span
                v-if="item.target === '_blank'"
                class="sr-only"
              >
                (opens in a new tab)</span
              ></DocCard
            >
            <div class="lg:col-span-2">
              <DocCard
                title="Style guide"
                icon="az az-pencil"
                href="/docs/style-guide"
                >How Azion writes documentation: voice, structure, and conventions.</DocCard
              >
            </div>
          </DocCardGroup>
        </section>
      </div>
    </DocProse>
    <div class="mt-(--spacing-2xl)">
      <DocPreviousNext :next="{ label: 'Agent setup', href: '/docs/agent-setup' }" />
    </div>
  </article>
</template>
