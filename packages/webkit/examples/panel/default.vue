<script setup>
  import Button from '@aziontech/webkit/button'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Panel from '@aziontech/webkit/panel-root'
</script>

<template>
  <Panel size="medium">
    <PanelHeader>
      <h2 class="text-heading-sm text-(--text-default)">Cache settings</h2>
    </PanelHeader>
    <PanelContent>
      <p class="text-body-sm text-(--text-muted)">
        Objects are cached at the edge for the TTL set on each rule.
      </p>
    </PanelContent>
    <PanelFooter>
      <Button
        label="Cancel"
        variant="outline"
      />
      <Button
        label="Save"
        variant="primary"
      />
    </PanelFooter>
  </Panel>
</template>
