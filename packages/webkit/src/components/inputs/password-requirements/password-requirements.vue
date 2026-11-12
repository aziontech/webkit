<script setup lang="ts">
  import { useElementSize } from '@vueuse/core'
  import { computed, ref, useAttrs, useId } from 'vue'

  import { type MessageKey } from '../../../composables/use-locale'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import { DEFAULT_PASSWORD_REQUIREMENTS, type PasswordRequirement } from './rules'

  defineOptions({
    name: 'PasswordRequirements',
    inheritAttrs: false
  })

  interface Props {
    /** Rules rendered as chips, one per entry. Defaults to the built-in rule set; an empty array renders only the caption. */
    requirements?: PasswordRequirement[]
    /** Caption that opens the row and names the group for assistive tech. Empty uses the locale catalog (`Must contain:`). */
    title?: string
    /** Password every rule is evaluated against; pass the PasswordInput value. */
    value?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    requirements: () => DEFAULT_PASSWORD_REQUIREMENTS,
    title: '',
    value: ''
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ passwordRequirements: en.passwordRequirements })
  const titleId = `password-requirements-${useId()}`

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-password-requirements'
  )

  const contentEl = ref<globalThis.HTMLElement | null>(null)
  const { height: contentHeight } = useElementSize(contentEl)
  const rowHeight = computed(() => (contentHeight.value ? `${contentHeight.value}px` : undefined))

  const builtInRules: readonly PasswordRequirement[] = DEFAULT_PASSWORD_REQUIREMENTS

  const evaluated = computed(() =>
    props.requirements.map((requirement: PasswordRequirement) => {
      const met =
        typeof requirement.test === 'function'
          ? requirement.test(props.value)
          : (requirement.test.global
              ? new RegExp(requirement.test.source, requirement.test.flags.replace('g', ''))
              : requirement.test
            ).test(props.value)

      const builtIn = builtInRules.includes(requirement) && requirement.key
      const label = builtIn
        ? t(`passwordRequirements.${requirement.key}` as MessageKey)
        : requirement.label
      return { key: requirement.key || requirement.label, label, met }
    })
  )
</script>

<template>
  <div
    v-bind="$attrs"
    role="group"
    :aria-labelledby="titleId"
    :data-testid="testId"
    :style="{ height: rowHeight }"
    class="w-full overflow-hidden transition-[height] duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
  >
    <div
      ref="contentEl"
      class="flex w-full flex-wrap content-center items-center gap-(--spacing-xs)"
    >
      <span
        :id="titleId"
        :data-testid="`${testId}__title`"
        class="shrink-0 leading-none text-label-sm text-(--text-default)"
      >
        {{ title || t('passwordRequirements.title') }}
      </span>
      <span
        v-for="requirement in evaluated"
        :key="requirement.key"
        :data-validated="requirement.met || null"
        :data-testid="`${testId}__chip`"
        class="inline-flex shrink-0 items-center justify-center min-h-5 p-(--spacing-xxs) rounded-(--shape-elements) leading-none text-label-sm transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none bg-(--bg-placeholder) text-(--text-muted) data-[validated]:bg-(--success) data-[validated]:text-(--text-default)"
      >
        <i
          :data-validated="requirement.met || null"
          class="pi pi-check flex h-[14px] w-0 shrink-0 -translate-x-1 rtl:translate-x-1 items-center justify-center overflow-hidden opacity-0 transition-[width,margin,translate,opacity] duration-fast-02 ease-productive-entrance motion-reduce:transition-none data-[validated]:me-(--spacing-xxs) data-[validated]:w-[14px] data-[validated]:translate-x-0 rtl:data-[validated]:translate-x-0 data-[validated]:opacity-100"
          aria-hidden="true"
        />
        {{ requirement.label
        }}<span
          class="sr-only"
          :data-testid="`${testId}__chip-state`"
          >,
          {{
            requirement.met ? t('passwordRequirements.met') : t('passwordRequirements.unmet')
          }}</span
        >
      </span>
    </div>
  </div>
</template>
