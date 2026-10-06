<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'

  import Section from '../page/Section.vue'

  interface Props {
    binding: Record<string, unknown>
    host: Record<string, unknown>
    application?: string
    disabled?: boolean
  }

  withDefaults(defineProps<Props>(), {
    application: '',
    disabled: false
  })

  defineEmits<{
    change: []
  }>()
</script>

<template>
  <Section
    stacked
    :divided="false"
    :title="host.noun.charAt(0).toUpperCase() + host.noun.slice(1)"
    hint="Where this runs once the Rules Engine puts it to work."
  >
    <CardBox :padded="false">
      <template #content>
        <Item.List>
          <Item size="small">
            <Item.Media>
              <span
                class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  :class="application ? 'ai ai-edge-application' : 'pi pi-minus-circle'"
                  class="text-body-md leading-none"
                  :data-unbound="application ? null : true"
                  aria-hidden="true"
                />
              </span>
            </Item.Media>
            <Item.Content>
              <Item.Title>{{ application || `Not bound to ${host.noun === 'application' ? 'an' : 'a'} ${host.noun}` }}</Item.Title>
              <Item.Description>
                {{
                  application
                    ? 'The rule that puts it to work is written here when you save.'
                    : binding.unboundNote
                }}
              </Item.Description>
            </Item.Content>
            <Item.Actions>
              <Button
                type="button"
                :label="application ? 'Change' : `Choose ${host.noun}`"
                kind="text"
                size="medium"
                :disabled="disabled"
                @click="$emit('change')"
              />
            </Item.Actions>
          </Item>
        </Item.List>
      </template>
    </CardBox>
  </Section>
</template>
