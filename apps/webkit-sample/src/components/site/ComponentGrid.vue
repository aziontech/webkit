<script setup>
  // The "Component Grid" layer of the Webkit Hub home: a 3D-tilted plane showcasing
  // real @aziontech/webkit components. Each component sits in a ComponentGridCell
  // that highlights it on hover/focus (dashed accent ring + floating label),
  // recreating the Figma "Grid 3D Transform" frame. Components are rendered
  // display-only — the grid demonstrates the library, it is not a working console.
  import Avatar from '@aziontech/webkit/avatar'
  import Badge from '@aziontech/webkit/badge'
  import Button from '@aziontech/webkit/button'
  import Chip from '@aziontech/webkit/chip'
  import CodeBlock from '@aziontech/webkit/code-block'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Message from '@aziontech/webkit/message'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Switch from '@aziontech/webkit/switch'
  import TabView from '@aziontech/webkit/tab-view'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  import ComponentGridCell from './ComponentGridCell.vue'

  // Static display state for the showcased components.
  const switchOn = ref(true)
  const search = ref('edge-function')
  const view = ref('grid')
  const viewOptions = [
    { label: 'Grid', value: 'grid' },
    { label: 'List', value: 'list' }
  ]
  const tab = ref('overview')
  const codeTabs = [
    {
      label: 'main.js',
      value: 'main',
      language: 'javascript',
      code: "export default async function (request) {\n  return new Response('Hello from the edge')\n}"
    }
  ]
</script>

<template>
  <div class="perspective relative">
    <div class="plane grid grid-cols-2 gap-x-[var(--spacing-xl)] gap-y-[var(--spacing-xxl)] md:grid-cols-3">
      <ComponentGridCell name="Button">
        <Button
          label="Deploy"
          kind="primary"
          size="medium"
        />
      </ComponentGridCell>

      <ComponentGridCell name="SegmentedButton">
        <SegmentedButton
          v-model="view"
          :options="viewOptions"
          aria-label="View"
        />
      </ComponentGridCell>

      <ComponentGridCell name="Tag">
        <Tag
          label="Production"
          severity="success"
          size="medium"
        />
      </ComponentGridCell>

      <ComponentGridCell name="Switch">
        <Switch
          v-model="switchOn"
          aria-label="Enable edge cache"
        />
      </ComponentGridCell>

      <ComponentGridCell name="Chip">
        <Chip label="edge-function" />
      </ComponentGridCell>

      <ComponentGridCell name="Avatar">
        <Avatar
          label="Ana Souza"
          size="medium"
          kind="square"
        />
      </ComponentGridCell>

      <ComponentGridCell name="InputText">
        <InputText
          v-model="search"
          size="medium"
          aria-label="Search components"
          placeholder="Search"
          class="w-full"
        />
      </ComponentGridCell>

      <ComponentGridCell name="Badge">
        <Badge
          label="99"
          severity="danger"
          size="medium"
        />
      </ComponentGridCell>

      <ComponentGridCell name="IconButton">
        <IconButton
          icon="pi pi-bolt"
          kind="outlined"
          aria-label="Run"
        />
      </ComponentGridCell>

      <ComponentGridCell name="Message">
        <Message
          severity="info"
          title="Deploy started"
        />
      </ComponentGridCell>

      <ComponentGridCell name="TabView">
        <TabView v-model:value="tab">
          <TabView.List>
            <TabView.Item
              value="overview"
              label="Overview"
            />
            <TabView.Item
              value="metrics"
              label="Metrics"
            />
          </TabView.List>
          <TabView.Content>
            <TabView.Panel value="overview" />
            <TabView.Panel value="metrics" />
          </TabView.Content>
        </TabView>
      </ComponentGridCell>

      <ComponentGridCell
        name="CodeBlock"
        class="col-span-2 md:col-span-1"
      >
        <CodeBlock
          :tabs="codeTabs"
          :show-line-numbers="false"
          class="w-full"
        />
      </ComponentGridCell>
    </div>
  </div>
</template>

<style scoped>
  /* 3D perspective plane. Geometry (perspective/rotate) has no theme token, so it
     lives here; every color/spacing/shape token stays in the template classes. */
  .perspective {
    perspective: 1600px;
    perspective-origin: 60% 20%;
  }

  .plane {
    transform: rotateX(26deg) rotateZ(-16deg) scale(0.96);
    transform-style: preserve-3d;
  }

  @media (prefers-reduced-motion: reduce) {
    .plane {
      transform: none;
    }
  }
</style>
