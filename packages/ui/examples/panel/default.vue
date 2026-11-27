<script setup>
  import Button from '@aziontech/ui/button'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import Panel from '@aziontech/ui/panel-root'
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
        variant="outline"
      />
      <Button
        label="Save"
        variant="primary"
      />
    </PanelFooter>
  </Panel>
</template>
