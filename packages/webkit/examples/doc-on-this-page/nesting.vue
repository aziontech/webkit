<script setup>
  import DocOnThisPage from '@aziontech/webkit/doc-on-this-page'
</script>

<template>
  <div class="max-w-64">
    <DocOnThisPage
      :items="[
        { id: 'overview', text: 'Overview', depth: 2 },
        { id: 'templates', text: 'Templates', depth: 3 },
        { id: 'presets', text: 'Framework presets', depth: 3 },
        { id: 'domains', text: 'Domains', depth: 2 },
        { id: 'certificates', text: 'Certificates', depth: 3 }
      ]"
      active-id="presets"
      :groups="[
        {
          label: 'Repository',
          links: [
            { label: 'View source', href: 'https://github.com/aziontech', icon: 'pi pi-github' }
          ]
        },
        {
          label: 'Community',
          links: [
            { label: 'Discord', href: 'https://discord.gg', icon: 'pi pi-comments' },
            { label: 'Forum', href: 'https://forum.example', icon: 'pi pi-users' }
          ]
        }
      ]"
    />
  </div>
</template>
