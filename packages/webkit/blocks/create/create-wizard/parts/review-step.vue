<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import Subheader from '@aziontech/webkit/subheader'
  import Tag from '@aziontech/webkit/tag'

  import { consumers, PREVIEW } from '../lib/access-list'

  export interface ReviewStepProps {
    /** The list name. */
    name: string
    /** The label of the list type. */
    typeLabel: string
    /** The label of the entries field of that type. */
    listLabel: string
    /** The entries, without duplicates. */
    entries: string[]
    /** The policy picked, empty for none. */
    choice: string
    /** The picked policy has IP filtering off. */
    moduleMissing?: boolean
    /** IP filtering is turned on with the list. */
    enableModule?: boolean
  }

  withDefaults(defineProps<ReviewStepProps>(), { moduleMissing: false, enableModule: false })

  const emit = defineEmits<{
    /** Edit was pressed on a section; carries the step to go back to. */
    edit: [step: string]
  }>()
</script>

<template>
  <section class="flex min-w-0 flex-col gap-(--layout-section-gap)">
    <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
      <Subheader
        title="Where it runs"
        size="small"
      >
        <template #actions>
          <Button
            type="button"
            label="Edit"
            variant="outline"
            size="small"
            aria-label="Edit where it runs"
            @click="emit('edit', 'where-it-runs')"
          />
        </template>
      </Subheader>
      <Alert
        key="alert-1"
        v-if="!choice"
        severity="warning"
      >
        Bound to no policy. The list is created, but no rule can match on it until a policy uses it.
      </Alert>
      <Alert
        key="alert-2"
        v-else-if="moduleMissing && !enableModule"
        severity="warning"
      >
        IP filtering is off on {{ choice }}, so no rule reads this list until it is on.
      </Alert>
      <Alert
        key="alert-3"
        severity="success"
      >
        Runs on {{ choice }}.
      </Alert>
    </section>

    <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
      <Subheader
        title="What gets created"
        description="Each value is sent as the property named under it."
        size="small"
      >
        <template #actions>
          <Button
            type="button"
            label="Edit"
            variant="outline"
            size="small"
            aria-label="Edit list settings"
            @click="emit('edit', 'settings')"
          />
        </template>
      </Subheader>
      <Card :padded="false">
        <template #default>
          <Item.List>
            <Item>
              <Item.Content>
                <Item.Title>Name</Item.Title>
                <Item.Description>name</Item.Description>
              </Item.Content>
              <Item.Actions>
                <span class="max-w-80 truncate text-label-sm text-(--text-default)">{{
                  name
                }}</span>
                <Button
                  type="button"
                  label="Edit"
                  variant="ghost"
                  size="small"
                  aria-label="Edit name"
                  @click="emit('edit', 'general')"
                />
              </Item.Actions>
            </Item>
            <Item>
              <Item.Content>
                <Item.Title>Type</Item.Title>
                <Item.Description>type</Item.Description>
              </Item.Content>
              <Item.Actions>
                <span class="text-label-sm text-(--text-default)">{{ typeLabel }}</span>
              </Item.Actions>
            </Item>
            <Item>
              <Item.Content>
                <Item.Title>{{ listLabel }}</Item.Title>
                <Item.Description>items</Item.Description>
                <ul
                  class="m-0 mt-(--spacing-xs) flex list-none flex-wrap gap-(--spacing-2xs) p-0"
                  :aria-label="`${entries.length} entries`"
                >
                  <li
                    v-for="entry in entries.slice(0, PREVIEW)"
                    :key="entry"
                  >
                    <Tag
                      :label="entry"
                      severity="neutral"
                      size="small"
                    />
                  </li>
                  <li
                    v-if="entries.length > PREVIEW"
                    class="text-label-sm text-(--text-muted)"
                  >
                    and {{ entries.length - PREVIEW }} more
                  </li>
                </ul>
              </Item.Content>
              <Item.Actions>
                <span class="text-label-sm text-(--text-default)"
                  >{{ entries.length }} {{ entries.length === 1 ? 'entry' : 'entries' }}</span
                >
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </Card>
    </section>

    <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
      <Subheader
        title="What can reference it"
        description="Everything that can point at this list once it exists, and the field that carries the reference."
        size="small"
      />
      <Card :padded="false">
        <template #default>
          <Item.List>
            <Item
              v-for="row in consumers"
              :key="row.by"
            >
              <Item.Content>
                <Item.Title>{{ row.by }}</Item.Title>
                <Item.Description>{{ row.path }}</Item.Description>
              </Item.Content>
              <Item.Actions>
                <Tag
                  :label="row.as"
                  severity="neutral"
                  size="small"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </Card>
    </section>
  </section>
</template>
