<script setup>
  import Card from '@aziontech/webkit/card'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingRow from '@aziontech/webkit/setting-row'
  import Switch from '@aziontech/webkit/switch'
  import { reactive } from 'vue'

  const form = reactive({ ttl: '', stale: false })
</script>

<template>
  <Card :padded="false">
    <template #content>
      <Item.List>
        <SettingRow
          title="Cache TTL"
          description="How long the edge keeps a copy of a response, in seconds."
          hint="The edge serves the cached copy until this many seconds pass, then asks the origin again. A Cache-Control max-age header from the origin takes precedence when it is lower. Use 0 to revalidate every request."
        >
          <Input
            v-model="form.ttl"
            size="large"
            class="w-full"
            aria-label="Cache TTL"
            inputmode="numeric"
            placeholder="3600"
          />
        </SettingRow>
        <SettingRow
          title="Serve stale content"
          description="Keep answering with the cached copy while the origin is down."
          hint="When the origin times out or returns a 5xx error, the edge answers with the last cached copy instead of the error. The copy is refreshed as soon as the origin responds again."
          kind="compact"
        >
          <Switch
            v-model="form.stale"
            aria-label="Serve stale content"
          />
        </SettingRow>
      </Item.List>
    </template>
  </Card>
</template>
