<script setup lang="ts">
  import { computed, ref, useAttrs, useId } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'
  import AttributeEditor, {
    type AttributeEditorItem,
    type AttributeEditorRowErrors
  } from '../attribute-editor/attribute-editor.vue'
  import Input from '../input/input.vue'

  export type TagEditorTag = {
    key: string
    value: string
    existing?: boolean
    markedForRemoval?: boolean
  }

  export type TagEditorErrors = ({ key?: string; value?: string } | undefined)[]

  defineOptions({
    name: 'TagEditor',
    inheritAttrs: false
  })

  interface Props {
    /** Tags being edited. Saved tags carry `existing`; Remove marks them `markedForRemoval` until Undo. Supports v-model:tags. */
    tags?: TagEditorTag[]
    /** Keys offered while typing a key, for example the keys already used in the account. */
    keySuggestions?: string[]
    /** Values offered per key while typing a value. */
    valueSuggestions?: Record<string, string[]>
    /** Most tags allowed; tags marked for removal do not count. */
    limit?: number
    /** Longest key allowed, in characters. */
    keyMaxLength?: number
    /** Longest value allowed, in characters. */
    valueMaxLength?: number
    /** Prefix reserved for the platform; keys may not start with it. Empty allows every prefix. */
    reservedPrefix?: string
    /** Server errors per row, aligned with `tags`; shown in place of the built-in checks. */
    errors?: TagEditorErrors
    /** Disables every control. */
    disabled?: boolean
    /** Accessible name of the list of tags. Empty uses the locale catalog. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    tags: () => [],
    keySuggestions: () => [],
    valueSuggestions: () => ({}),
    limit: 50,
    keyMaxLength: 128,
    valueMaxLength: 256,
    reservedPrefix: 'azion:',
    errors: () => [],
    disabled: false,
    ariaLabel: ''
  })

  const emit = defineEmits<{
    'update:tags': [tags: TagEditorTag[]]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ tagEditor: en.tagEditor })
  const baseId = useId()
  const checkEmpty = ref(false)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-tag-editor')

  const KEY_PATTERN = /^[\p{L}\p{N}\s+\-=._:/@]*$/u

  const definition = computed(() => [
    { key: 'key', label: t('tagEditor.key'), required: true },
    { key: 'value', label: t('tagEditor.value') }
  ])

  const active = computed(() => props.tags.filter((tag) => !tag.markedForRemoval))
  const marked = computed(() => props.tags.length - active.value.length)
  const left = computed(() => Math.max(props.limit - active.value.length, 0))

  const keyCounts = computed(() =>
    active.value.reduce((counts, tag) => {
      const key = tag.key.trim()
      if (key) counts.set(key, (counts.get(key) ?? 0) + 1)
      return counts
    }, new Map<string, number>())
  )

  const keyError = (tag: TagEditorTag) => {
    if (tag.markedForRemoval) return undefined
    const key = tag.key.trim()
    if (!key) return checkEmpty.value || tag.value.trim() ? t('tagEditor.keyRequired') : undefined
    if (props.reservedPrefix && key.toLowerCase().startsWith(props.reservedPrefix.toLowerCase()))
      return t('tagEditor.keyReserved', { prefix: props.reservedPrefix })
    if (key.length > props.keyMaxLength) return t('tagEditor.tooLong', { max: props.keyMaxLength })
    if (!KEY_PATTERN.test(key)) return t('tagEditor.keyInvalid')
    if ((keyCounts.value.get(key) ?? 0) > 1) return t('tagEditor.keyDuplicate')
    return undefined
  }

  const valueError = (tag: TagEditorTag) => {
    if (tag.markedForRemoval) return undefined
    if (tag.value.length > props.valueMaxLength)
      return t('tagEditor.tooLong', { max: props.valueMaxLength })
    return undefined
  }

  const rowErrors = computed<(AttributeEditorRowErrors | undefined)[]>(() =>
    props.tags.map((tag, index) => {
      const server = props.errors[index]
      const key = server?.key ?? keyError(tag)
      const value = server?.value ?? valueError(tag)
      return key || value ? { key, value } : undefined
    })
  )

  const asTag = (item: AttributeEditorItem) => item as unknown as TagEditorTag

  const setTags = (items: AttributeEditorItem[]) => emit('update:tags', items.map(asTag))

  const setRemoval = (index: number, markedForRemoval: boolean) => {
    const next = props.tags.map((tag, i) => (i === index ? { ...tag, markedForRemoval } : tag))
    emit('update:tags', next)
  }

  const newTag = () => ({ key: '', value: '' })

  const valueKeys = computed(() => Object.keys(props.valueSuggestions))

  const valueListId = (key: unknown) => {
    const index = valueKeys.value.indexOf(String(key ?? '').trim())
    return index >= 0 && props.valueSuggestions[valueKeys.value[index] as string]?.length
      ? `${baseId}-values-${index}`
      : undefined
  }

  const validate = () => {
    checkEmpty.value = true
    return props.tags.every(
      (tag, index) =>
        tag.markedForRemoval ||
        (!props.errors[index]?.key &&
          !props.errors[index]?.value &&
          !keyError(tag) &&
          !valueError(tag))
    )
  }

  defineExpose({ validate })
</script>

<template>
  <div
    v-bind="$attrs"
    class="flex w-full min-w-0 flex-col"
    :data-testid="testId"
  >
    <AttributeEditor
      :items="tags"
      :definition="definition"
      :errors="rowErrors"
      :new-item="newTag"
      :limit="limit + marked"
      :disabled="disabled"
      :add-button-label="t('tagEditor.add')"
      :remove-button-label="t('tagEditor.remove')"
      :empty="t('tagEditor.empty')"
      :aria-label="ariaLabel || t('tagEditor.label')"
      :data-testid="`${testId}__editor`"
      @update:items="setTags"
    >
      <template #cell-key="{ item, value, update }">
        <Input
          :model-value="String(value ?? '')"
          :placeholder="t('tagEditor.keyPlaceholder')"
          :disabled="disabled || Boolean(asTag(item).markedForRemoval)"
          :readonly="Boolean(asTag(item).existing)"
          :list="keySuggestions.length ? `${baseId}-keys` : undefined"
          autocomplete="off"
          :spellcheck="false"
          @update:model-value="update"
        />
      </template>
      <template #cell-value="{ item, value, update }">
        <Input
          :model-value="String(value ?? '')"
          :placeholder="t('tagEditor.valuePlaceholder')"
          :disabled="disabled || Boolean(asTag(item).markedForRemoval)"
          :list="valueListId(item['key'])"
          autocomplete="off"
          :spellcheck="false"
          @update:model-value="update"
        />
        <span
          v-if="asTag(item).markedForRemoval"
          class="text-body-sm text-(--text-muted)"
          :data-testid="`${testId}__marked`"
          >{{ t('tagEditor.markedForRemoval') }}</span
        >
      </template>
      <template #row-actions="{ item, index, remove, removable, removeLabel }">
        <Button
          v-if="asTag(item).markedForRemoval"
          :label="t('tagEditor.undo')"
          :aria-label="t('tagEditor.undoLabel', { index: index + 1 })"
          kind="transparent"
          size="medium"
          :disabled="disabled || left === 0"
          :data-testid="`${testId}__undo`"
          @click="setRemoval(index, false)"
        />
        <Tooltip
          v-else-if="removable"
          :text="removeLabel"
        >
          <IconButton
            icon="pi pi-trash"
            kind="outlined"
            size="medium"
            :ariaLabel="removeLabel"
            :data-testid="`${testId}__remove`"
            @click="(event) => (asTag(item).existing ? setRemoval(index, true) : remove(event))"
          />
        </Tooltip>
      </template>
      <template #limit>
        {{
          left === 0
            ? t('tagEditor.limitReached', { limit })
            : t('tagEditor.remaining', { count: left })
        }}
      </template>
    </AttributeEditor>
    <datalist
      v-if="keySuggestions.length"
      :id="`${baseId}-keys`"
    >
      <option
        v-for="suggestion in keySuggestions"
        :key="suggestion"
        :value="suggestion"
      />
    </datalist>
    <datalist
      v-for="(key, index) in valueKeys"
      :id="`${baseId}-values-${index}`"
      :key="key"
    >
      <option
        v-for="suggestion in valueSuggestions[key]"
        :key="suggestion"
        :value="suggestion"
      />
    </datalist>
  </div>
</template>
