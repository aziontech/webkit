<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Tag from '@aziontech/webkit/tag'

  import { profileSourceControls as sourceControls } from '../sample'

  const MEDIA_TILE_CLASS =
    'flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)'
</script>

<template>
  <SettingsGroup
    label="Source control"
    hint="The Git providers this account builds applications from, connected at the provider and outside Save."
    anchor="source-control"
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <Item
            v-for="provider in sourceControls"
            :key="provider.key"
            size="small"
          >
            <Item.Media>
              <span :class="MEDIA_TILE_CLASS">
                <i
                  :class="[provider.icon, 'text-body-lg text-(--text-default)']"
                  aria-hidden="true"
                />
              </span>
            </Item.Media>
            <Item.Content>
              <Item.Title>
                {{ provider.name }}
                <Tag
                  v-if="provider.tag"
                  :label="provider.tag"
                  severity="success"
                  size="small"
                />
              </Item.Title>
              <Item.Description>{{ provider.description }}</Item.Description>
            </Item.Content>
            <Item.Actions>
              <Button
                :label="provider.action"
                :aria-label="`${provider.action} ${provider.name}`"
                variant="outline"
                size="medium"
                :icon="
                  provider.connected || !provider.href.startsWith('http')
                    ? undefined
                    : 'az az-external-link'
                "
                :href="provider.href"
                :target="provider.href.startsWith('http') ? '_blank' : undefined"
              />
            </Item.Actions>
          </Item>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
