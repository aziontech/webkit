<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Diagram from '@aziontech/webkit/diagram'
  import DocCallout from '@aziontech/webkit/doc-callout'
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
  import DocFrame from '@aziontech/webkit/doc-frame'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocPreviousNext from '@aziontech/webkit/doc-previous-next'
  import DocProse from '@aziontech/webkit/doc-prose'
  import Link from '@aziontech/webkit/link'

  const crumbs = [{ label: 'Applications', href: '/docs/applications' }, { label: 'Overview' }]

  const metaActions = [
    { value: 'copy', label: 'Copy as Markdown', icon: 'az az-copy' },
    { value: 'markdown', label: 'View as Markdown', icon: 'az az-eye' },
    {
      value: 'agent-setup',
      label: 'Agent setup',
      icon: 'az az-microchip-ai',
      href: '/docs/agent-setup'
    }
  ]

  const ruleTabs = [
    {
      label: 'JSON',
      value: 'json',
      language: 'json',
      code:
        '{\n  "name": "Cache images",\n  "active": true,\n' +
        '  "criteria": [[{ "variable": "${uri}", "operator": "starts_with", "argument": "/images" }]],\n' +
        '  "behaviors": [{ "type": "set_cache_policy", "attributes": { "value": 1020 } }]\n}'
    }
  ]

  const scope = [
    { term: 'Phases', text: 'Request rules run before the origin, response rules after it.' },
    { term: 'Origins', text: 'A connector names where a request goes when the cache misses.' },
    { term: 'Functions', text: 'An instance runs your code on the request or the response.' },
    { term: 'Limits', text: 'Up to 1,000 rules per application, evaluated in order.' }
  ]
</script>

<template>
  <article
    class="layout-column-content layout-boundary-inline flex flex-col gap-(--spacing-lg) pt-(--spacing-md) pb-(--spacing-2xl)"
  >
    <DocPageHeader
      title="Applications"
      description="Route requests to your origins, cache responses, and run code with the rules of an Application."
      :breadcrumbs="crumbs"
      last-updated="2026-11-11"
      :meta-actions="metaActions"
    />
    <DocProse>
      <DocCallout variant="info">
        Rolling out: this page describes API v4. Accounts still on v3 keep the previous reference.
      </DocCallout>
      <p>
        An application holds the rules a
        <Link
          inline
          href="/docs/workloads"
          >workload</Link
        >
        applies to every request: where it goes, what is cached and which
        <Link
          inline
          href="/docs/functions"
          >function</Link
        >
        runs.
      </p>
      <div
        data-doc-chrome
        class="flex flex-wrap gap-(--spacing-sm)"
      >
        <Button
          label="Quickstart"
          variant="primary"
          size="medium"
          href="/docs/applications/quickstart"
        />
        <Button
          label="Applications reference"
          variant="secondary"
          size="medium"
          href="/docs/reference/applications"
        />
      </div>

      <DocHeading
        anchor="request-path"
        :level="2"
        >Request path</DocHeading
      >
      <DocFrame caption="A request through a workload, its firewall and its application">
        <Diagram name="applications" />
      </DocFrame>

      <DocHeading
        anchor="rule-structure"
        :level="2"
        >Rule structure</DocHeading
      >
      <p>
        Send the rule below to
        <code>POST /v4/workspace/applications/&lt;id&gt;/request_rules</code> to create it.
      </p>
      <CodeBlock
        :tabs="ruleTabs"
        default-value="json"
      />

      <DocHeading
        anchor="scope-and-limits"
        :level="2"
        >Scope and limits</DocHeading
      >
      <ul>
        <li
          v-for="item in scope"
          :key="item.term"
        >
          <strong>{{ item.term }}.</strong> {{ item.text }}
        </li>
      </ul>

      <DocHeading
        anchor="next-steps"
        :level="2"
        >Next steps</DocHeading
      >
      <DocCardGroup :columns="2">
        <DocCard
          title="Quickstart"
          icon="az az-bolt"
          href="/docs/applications/quickstart"
          >Create an application and bind it to a workload.</DocCard
        >
        <DocCard
          title="Rules Engine"
          icon="az az-sliders-horizontal"
          href="/docs/applications/rules-engine"
          >Criteria and behaviors, phase by phase.</DocCard
        >
      </DocCardGroup>
    </DocProse>
    <DocPreviousNext :next="{ label: 'Quickstart', href: '/docs/applications/quickstart' }" />
  </article>
</template>
