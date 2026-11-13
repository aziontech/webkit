<script setup>
  import Button from '@aziontech/webkit/button'
  import Panel from '@aziontech/webkit/panel'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
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
        kind="outlined"
      />
      <Button
        label="Save"
        kind="primary"
      />
    </PanelFooter>
  </Panel>
</template>
