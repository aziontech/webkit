<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Tag from '@aziontech/webkit/tag'
  import { computed, nextTick, ref } from 'vue'

  import SuccessMark from '../../../components/page/SuccessMark.vue'
  import { applicationOptions } from '../../../lib/behavior/application-binding'
  import { TEMPLATE_TARGETS } from '../../../lib/data/application-flows'
  import { integrationFor } from '../../../lib/data/template-integrations'

  const props = defineProps({
    /** The integration template being installed — what the card names and previews. */
    source: { type: Object, default: null },
    /** The answer already given, so coming BACK to this part shows it. */
    target: { type: Object, default: null },
    /** The flow-wide lock while the commit is in flight. */
    disabled: { type: Boolean, default: false }
  })

  const emit = defineEmits(['update:target'])

  const VISIBLE = 4

  const query = ref('')
  const naming = ref(false)
  const newName = ref('')
  const nameField = ref(null)

  const integration = computed(() => integrationFor(props.source?.slug) ?? null)

  const options = computed(() => applicationOptions.value)

  const matches = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return options.value
    return options.value.filter((option) =>
      [option.label, option.description].some((field) => (field ?? '').toLowerCase().includes(term))
    )
  })

  const visible = computed(() => matches.value.slice(0, VISIBLE))
  const hidden = computed(() => Math.max(0, matches.value.length - VISIBLE))

  const chosenName = computed(() => (props.target?.mode === 'existing' ? props.target.name : ''))

  const choose = (option) => emit('update:target', { mode: 'existing', name: option.value })

  const startNaming = () => {
    newName.value = query.value.trim() || props.source?.defaultName || ''
    naming.value = true
    nextTick(() => nameField.value?.focus?.())
  }

  const confirmNaming = () => {
    const name = newName.value.trim()
    if (!name) return
    emit('update:target', { mode: 'new', name })
  }

  const cancelNaming = () => {
    naming.value = false
    newName.value = ''
  }

  const onSearchEnter = () => {
    if (matches.value.length) {
      choose(matches.value[0])
      return
    }
    startNaming()
  }
</script>

<template>
  <CardBox
    :padded="false"
    title="Which application does this run on?"
  >
    <template #content>
      <div
        v-if="integration"
        class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-md)"
      >
        <p class="text-body-sm text-(--text-muted)">{{ integration.summary }}</p>
        <div class="flex flex-wrap gap-(--spacing-xxs)">
          <Tag
            v-for="record in integration.creates"
            :key="record"
            :label="record"
            severity="secondary"
            size="small"
          />
        </div>
      </div>

      <div
        class="flex flex-col gap-(--spacing-sm) border-b border-(--border-default) p-(--spacing-md)"
      >
        <InputText
          v-model="query"
          size="large"
          class="w-full"
          placeholder="Find application…"
          aria-label="Find application"
          autocomplete="off"
          :disabled="disabled"
          @keydown.enter.prevent="onSearchEnter"
        >
          <template #iconLeft>
            <i
              class="pi pi-search"
              aria-hidden="true"
            />
          </template>
        </InputText>

        <p
          v-if="hidden"
          class="text-body-sm text-(--text-muted)"
        >
          {{ hidden }} more — type to narrow.
        </p>

        <p
          v-else-if="!matches.length && options.length"
          class="text-body-sm text-(--text-muted)"
        >
          No application matches “{{ query.trim() }}”.
        </p>
      </div>

      <div
        v-if="naming"
        class="flex flex-col gap-(--spacing-sm) p-(--spacing-md)"
      >
        <p class="text-label-md text-(--text-default)">New application</p>
        <InputText
          ref="nameField"
          v-model="newName"
          size="large"
          class="w-full"
          placeholder="my-application"
          aria-label="New application name"
          autocomplete="off"
          :disabled="disabled"
          @keydown.enter.prevent="confirmNaming"
        />
        <p class="text-body-sm text-(--text-muted)">
          {{ TEMPLATE_TARGETS.new.description }}
        </p>
        <div class="flex items-center justify-end gap-(--spacing-sm)">
          <Button
            type="button"
            label="Back"
            kind="text"
            size="medium"
            :disabled="disabled"
            @click="cancelNaming"
          />
          <Button
            type="button"
            label="Continue"
            kind="primary"
            size="medium"
            :disabled="disabled || !newName.trim()"
            @click="confirmNaming"
          />
        </div>
      </div>

      <template v-else>
        <Item.List>
          <Item
            v-for="option in visible"
            :key="option.value"
            as-child
            size="small"
          >
            <button
              type="button"
              class="w-full text-left"
              :disabled="disabled"
              :aria-pressed="option.value === chosenName"
              @click="choose(option)"
            >
              <Item.Media>
                <span
                  class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                >
                  <i
                    class="ai ai-edge-application text-[1rem] leading-none text-(--text-default)"
                    aria-hidden="true"
                  />
                </span>
              </Item.Media>
              <Item.Content>
                <Item.Title>{{ option.label }}</Item.Title>
                <Item.Description>{{ option.description }}</Item.Description>
              </Item.Content>
              <Item.Actions>
                <SuccessMark
                  v-if="option.value === chosenName"
                  key="chosen"
                />
                <i
                  v-else
                  class="pi pi-chevron-right text-(--text-muted)"
                  aria-hidden="true"
                />
              </Item.Actions>
            </button>
          </Item>

          <Item
            as-child
            size="small"
          >
            <button
              type="button"
              class="w-full text-left"
              :disabled="disabled"
              :aria-pressed="target?.mode === 'new'"
              @click="startNaming"
            >
              <Item.Media>
                <span
                  class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                >
                  <i
                    :class="TEMPLATE_TARGETS.new.icon"
                    class="text-[1rem] leading-none text-(--text-default)"
                    aria-hidden="true"
                  />
                </span>
              </Item.Media>
              <Item.Content>
                <Item.Title>{{ TEMPLATE_TARGETS.new.title }}</Item.Title>
                <Item.Description>{{ TEMPLATE_TARGETS.new.description }}</Item.Description>
              </Item.Content>
              <Item.Actions>
                <SuccessMark
                  v-if="target?.mode === 'new'"
                  key="chosen-new"
                />
                <i
                  v-else
                  class="pi pi-chevron-right text-(--text-muted)"
                  aria-hidden="true"
                />
              </Item.Actions>
            </button>
          </Item>
        </Item.List>
      </template>
    </template>
  </CardBox>
</template>
