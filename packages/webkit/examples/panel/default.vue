<script setup>
  import Button from '@aziontech/webkit/button'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Panel from '@aziontech/webkit/panel-root'
</script>

<template>
  <Panel size="medium">
    <PanelHeader>
      <h2 class="text-heading-sm text-(--text-default)">Cache settings</h2>
    </PanelHeader>
    <PanelBody>
      <p class="text-body-sm text-(--text-muted)">
        Objects are cached at the edge for the TTL set on each rule.
      </p>
    </PanelBody>
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
