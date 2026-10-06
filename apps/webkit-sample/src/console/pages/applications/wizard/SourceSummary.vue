<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import AzionLogoMin from '@aziontech/webkit/svg/azion/min'

  interface Props {
    source?: Record<string, unknown>
    repository?: Record<string, unknown>
    changeable?: boolean
    disabled?: boolean
  }

  withDefaults(defineProps<Props>(), {
    source: null,
    repository: null,
    changeable: true,
    disabled: false
  })

  defineEmits<{
    change: [value: unknown]
  }>()
</script>

<template>
  <CardBox
    v-if="source"
    :padded="false"
  >
    <template #content>
      <Item.List>
        <Item size="small">
          <Item.Media>
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
            >
              <AzionLogoMin
                v-if="source.vendor === 'Azion'"
                class="h-4 w-auto shrink-0"
                aria-hidden="true"
              />
              <i
                v-else
                :class="source.icon"
                class="text-body-md leading-none text-(--text-default)"
                aria-hidden="true"
              />
            </span>
          </Item.Media>
          <Item.Content>
            <Item.Title>{{ source.title }}</Item.Title>
            <Item.Description>{{ source.description }}</Item.Description>
          </Item.Content>
          <Item.Actions v-if="changeable">
            <Button
              type="button"
              label="Change"
              kind="text"
              size="small"
              :disabled="disabled"
              @click="$emit('change', 'source')"
            />
          </Item.Actions>
        </Item>

        <Item
          v-if="repository?.name"
          size="small"
        >
          <Item.Media>
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
            >
              <i
                class="pi pi-github text-body-md leading-none text-(--text-default)"
                aria-hidden="true"
              />
            </span>
          </Item.Media>
          <Item.Content>
            <Item.Title>{{ repository.owner }}/{{ repository.name }}</Item.Title>
            <Item.Description>
              {{
                repository.mode === 'new'
                  ? `A new ${repository.visibility} repository, created from the template.`
                  : 'An existing repository of yours, deployed as it is.'
              }}
            </Item.Description>
          </Item.Content>
          <Item.Actions v-if="changeable">
            <Button
              type="button"
              label="Change"
              kind="text"
              size="small"
              :disabled="disabled"
              @click="$emit('change', 'repository')"
            />
          </Item.Actions>
        </Item>
      </Item.List>
    </template>
  </CardBox>
</template>
