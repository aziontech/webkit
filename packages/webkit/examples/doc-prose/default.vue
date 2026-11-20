<script setup>
  import DocProse from '@aziontech/webkit/doc-prose'
</script>

<template>
  <DocProse>
    <h2>Deploy an application</h2>
    <p>
      Templates are ready-made projects that go live in a few clicks. You don't need any local
      tooling, and the <a href="https://www.azion.com/en/documentation/">template's guide</a> lists
      what each one needs.
    </p>
    <h3>What you get</h3>
    <ul>
      <li>A <strong>workload</strong> bound to its own Azion domain</li>
      <li>An edge application built from your <code>azion.config.js</code></li>
      <li>A certificate issued and renewed for you</li>
    </ul>
    <ol>
      <li>Pick a template</li>
      <li>Fill in the fields it asks for</li>
      <li>Deploy</li>
    </ol>
    <blockquote>
      <p>The first request to a location is a cache miss. Warm-up is per location, not global.</p>
    </blockquote>
    <h4>Build command</h4>
    <p>
      An h4 is a label inside a section rather than a new section, so it shares the base gap of the
      prose around it and carries its level on weight instead.
    </p>
    <hr />
    <p>A section break above resets the reader before the next part of the page.</p>
  </DocProse>
</template>
