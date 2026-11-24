<script setup lang="ts">
  import { useElementSize } from '@vueuse/core'
  import {
    computed,
    inject,
    onBeforeUnmount,
    onScopeDispose,
    ref,
    useAttrs,
    useId,
    watch
  } from 'vue'

  import { type MessageKey } from '../../../composables/use-locale'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { FieldInjectionKey } from '../field/injection-key'
  import { DEFAULT_PASSWORD_REQUIREMENTS, type PasswordRequirementsRule } from './rules'

  defineOptions({
    name: 'PasswordRequirements',
    inheritAttrs: false
  })

  interface Props {
    /** Rules rendered as chips, one per entry. Defaults to the built-in rule set; an empty array renders only the caption. */
    requirements?: PasswordRequirementsRule[]
    /** Caption that opens the row and names the group for assistive tech. Empty uses the locale catalog (`Must contain:`). */
    title?: string
    /** Password every rule is evaluated against; pass the PasswordInput value. */
    value?: string
  }
  export type PasswordRequirementsProps = Props

  const props = withDefaults(defineProps<Props>(), {
    requirements: () => DEFAULT_PASSWORD_REQUIREMENTS,
    title: '',
    value: ''
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ passwordRequirements: en.passwordRequirements })
  const titleId = `password-requirements-${useId()}`
  const rulesId = `${titleId}-rules`
  const field = inject(FieldInjectionKey, null)
  if (field) onBeforeUnmount(field.register('description', rulesId))

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'password-requirements'
  )

  const contentEl = ref<globalThis.HTMLElement | null>(null)
  const { height: contentHeight } = useElementSize(contentEl)
  const rowHeight = computed(() => (contentHeight.value ? `${contentHeight.value}px` : undefined))

  const builtInRules: readonly PasswordRequirementsRule[] = DEFAULT_PASSWORD_REQUIREMENTS

  const evaluated = computed(() =>
    props.requirements.map((requirement: PasswordRequirementsRule) => {
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

  const progress = ref('')
  let progressTimer: ReturnType<typeof setTimeout> | undefined
  watch(
    () => props.value,
    () => {
      clearTimeout(progressTimer)
      progressTimer = setTimeout(() => {
        const met = evaluated.value.filter((requirement) => requirement.met).length
        progress.value = t('passwordRequirements.progress', { met, total: evaluated.value.length })
      }, 1000)
    }
  )
  onScopeDispose(() => clearTimeout(progressTimer))

  const CHIP_CLASS =
    'inline-flex shrink-0 items-center justify-center min-h-5 p-(--spacing-2xs) rounded-(--shape-control) leading-none text-label-sm transition-colors duration-fast-02 ' +
    'ease-productive-entrance motion-reduce:transition-none bg-(--bg-placeholder) text-(--text-muted) ' +
    'data-[validated]:bg-(--success) data-[validated]:text-(--text-default)'

  const CHIP_CHECK_CLASS =
    'az az-check flex h-[14px] w-0 shrink-0 -translate-x-1 rtl:translate-x-1 ' +
    'items-center justify-center overflow-hidden opacity-0 transition-[width,margin,translate,opacity] duration-fast-02 ease-productive-entrance ' +
    'motion-reduce:transition-none ' +
    'data-[validated]:me-(--spacing-2xs) data-[validated]:w-[14px] data-[validated]:translate-x-0 ' +
    'rtl:data-[validated]:translate-x-0 ' +
    'data-[validated]:opacity-100'
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
      :id="rulesId"
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
        :class="CHIP_CLASS"
      >
        <i
          :data-validated="requirement.met || null"
          :class="CHIP_CHECK_CLASS"
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
    <span
      role="status"
      class="sr-only"
      :data-testid="`${testId}__progress`"
      >{{ progress }}</span
    >
  </div>
</template>
