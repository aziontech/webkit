<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { cn } from '../../../utils/cn'
  import Button from '../../actions/button/button.vue'
  import CardBox from '../../content/card-box/card-box.vue'
  import Item from '../../content/item/item.vue'
  import ItemActions from '../../content/item/item-actions.vue'
  import ItemContent from '../../content/item/item-content.vue'
  import ItemDescription from '../../content/item/item-description.vue'
  import ItemTitle from '../../content/item/item-title.vue'
  import type { BoxGridSelectionItem } from '../../inputs/box-grid-selection/box-grid-selection.vue'
  import BoxGridSelection from '../../inputs/box-grid-selection/box-grid-selection.vue'
  import FieldCheckbox from '../../inputs/field-checkbox/field-checkbox.vue'
  import InputText from '../../inputs/input-text/input-text.vue'
  import Tag from '../../tag/tag.vue'

  defineOptions({
    name: 'OnboardingForm',
    inheritAttrs: false
  })

  interface Props {
    /** Page title above the form sections. */
    title?: string
    /** Label above the plan summary card. */
    planLabel?: string
    /** Selected plan name in the summary card. */
    planTitle?: string
    /** Price badge text beside the plan title. */
    planPrice?: string
    /** Supporting copy under the plan title. */
    planDescription?: string
    /** Label for the plan change action button. */
    changeLabel?: string
    /** Label for the usage intent grid. */
    usageLabel?: string
    /** When true, appends a required indicator to the usage label. */
    usageRequired?: boolean
    /** Selected usage option (v-model). */
    usageValue?: string | number
    /** Options for BoxGridSelection. */
    usageItems: BoxGridSelectionItem[]
    /** Label for the full name field. */
    fullNameLabel?: string
    /** When true, appends a required indicator to the full name label. */
    fullNameRequired?: boolean
    /** Full name value (v-model). */
    fullName?: string
    /** Placeholder for the full name input. */
    fullNamePlaceholder?: string
    /** Label for the scheduling checkbox. */
    scheduleLabel?: string
    /** Whether the scheduling checkbox is checked (v-model). */
    scheduleOnboarding?: boolean
    /** Primary submit button label. */
    continueLabel?: string
    /** Disables the continue button. */
    continueDisabled?: boolean
    /** Disables all interactive fields in the template. */
    disabled?: boolean
    /** Footer prompt before the contact link. */
    footerPrefix?: string
    /** Footer contact link label. */
    footerLinkLabel?: string
    /** Footer contact link URL. */
    footerLinkHref?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: 'Your first global deployment is seconds away',
    planLabel: 'Plan Selected',
    planTitle: 'Hobby',
    planPrice: 'Free',
    planDescription: 'For professional or commercial workloads.',
    changeLabel: 'Change',
    usageLabel: 'How are you planning to use Azion?',
    usageRequired: true,
    usageValue: undefined,
    fullNameLabel: 'Your Full Name',
    fullNameRequired: true,
    fullName: '',
    fullNamePlaceholder: 'John Doe',
    scheduleLabel: 'Schedule an onboarding session with an Azion expert',
    scheduleOnboarding: true,
    continueLabel: 'Continue',
    continueDisabled: false,
    disabled: false,
    footerPrefix: 'Have enterprise requirements?',
    footerLinkLabel: 'Get in touch',
    footerLinkHref: '#'
  })

  const emit = defineEmits<{
    'update:usageValue': [value: string | number]
    'update:fullName': [value: string]
    'update:scheduleOnboarding': [value: boolean]
    'change-click': [event: MouseEvent]
    'continue-click': [event: MouseEvent]
    'footer-link-click': [event: MouseEvent]
  }>()

  defineSlots<{
    plan(): unknown
    footer(): unknown
  }>()

  const attrs = useAttrs()
  const headingId = useId()
  const usageFieldId = useId()
  const fullNameFieldId = useId()
  const scheduleFieldId = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'templates-onboarding-form'
  )

  const usageModel = computed({
    get: () => props.usageValue,
    set: (value: string | number) => emit('update:usageValue', value)
  })

  const fullNameModel = computed({
    get: () => props.fullName,
    set: (value: string) => emit('update:fullName', value)
  })

  const scheduleModel = computed({
    get: () => props.scheduleOnboarding,
    set: (value: boolean) => emit('update:scheduleOnboarding', value)
  })

  const onChangeClick = (event: MouseEvent) => emit('change-click', event)
  const onFormSubmit = (event: globalThis.SubmitEvent) =>
    emit('continue-click', event as unknown as MouseEvent)
  const onFooterLinkClick = (event: MouseEvent) => emit('footer-link-click', event)

  const rootClass = computed(() =>
    cn('flex w-full max-w-[var(--container-lg)] flex-col', attrs.class as string | undefined)
  )
</script>

<template>
  <form
    v-bind="$attrs"
    :class="rootClass"
    :data-testid="testId"
    :data-disabled="disabled || null"
    :aria-labelledby="headingId"
    @submit.prevent="onFormSubmit"
  >
    <CardBox
      class="w-full"
      :padded="false"
      :data-testid="`${testId}__card`"
    >
      <template #content>
        <div
          class="flex w-full flex-col gap-[var(--spacing-xl)] p-[var(--spacing-xl)]"
          :data-testid="`${testId}__body`"
        >
          <h1
            :id="headingId"
            class="text-center text-heading-md text-[var(--text-default)] [word-break:break-word]"
            :data-testid="`${testId}__title`"
          >
            {{ title }}
          </h1>

          <section
            class="flex w-full flex-col gap-[var(--spacing-xxs)]"
            :data-testid="`${testId}__plan-section`"
          >
            <p
              class="text-body-sm text-[var(--text-muted)]"
              :data-testid="`${testId}__plan-label`"
            >
              {{ planLabel }}
            </p>

            <slot name="plan">
              <Item
                kind="outline"
                size="medium"
                :data-testid="`${testId}__plan-card`"
              >
                <ItemContent>
                  <div class="flex flex-wrap items-center gap-[var(--spacing-xs)]">
                    <ItemTitle :data-testid="`${testId}__plan-title`">
                      {{ planTitle }}
                    </ItemTitle>
                    <Tag
                      :label="planPrice"
                      severity="secondary"
                      :data-testid="`${testId}__plan-price`"
                    />
                  </div>
                  <ItemDescription :data-testid="`${testId}__plan-description`">
                    {{ planDescription }}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    :label="changeLabel"
                    kind="outlined"
                    size="small"
                    :disabled="disabled"
                    :data-testid="`${testId}__plan-change`"
                    @click="onChangeClick"
                  />
                </ItemActions>
              </Item>
            </slot>
          </section>

          <section
            class="flex w-full flex-col gap-[var(--spacing-xxs)]"
            :data-testid="`${testId}__usage-section`"
          >
            <label
              :id="`${usageFieldId}-label`"
              :for="usageFieldId"
              class="text-body-sm text-[var(--text-muted)]"
              :data-testid="`${testId}__usage-label`"
            >
              {{ usageLabel }}
              <span
                v-if="usageRequired"
                class="text-[var(--primary)]"
                aria-hidden="true"
              >
                *
              </span>
            </label>
            <BoxGridSelection
              :id="usageFieldId"
              v-model="usageModel"
              :items="usageItems"
              :disabled="disabled"
              :aria-labelledby="`${usageFieldId}-label`"
              :aria-required="usageRequired || undefined"
              class="w-full"
              :data-testid="`${testId}__usage`"
            />
          </section>

          <section
            class="flex w-full flex-col gap-[var(--spacing-xxs)]"
            :data-testid="`${testId}__full-name-section`"
          >
            <label
              :id="`${fullNameFieldId}-label`"
              :for="fullNameFieldId"
              class="text-body-sm text-[var(--text-muted)]"
              :data-testid="`${testId}__full-name-label`"
            >
              {{ fullNameLabel }}
              <span
                v-if="fullNameRequired"
                class="text-[var(--primary)]"
                aria-hidden="true"
              >
                *
              </span>
            </label>
            <InputText
              :id="fullNameFieldId"
              v-model="fullNameModel"
              :placeholder="fullNamePlaceholder"
              :disabled="disabled"
              size="large"
              class="w-full"
              :aria-labelledby="`${fullNameFieldId}-label`"
              :aria-required="fullNameRequired || undefined"
              :data-testid="`${testId}__full-name`"
            />
          </section>

          <FieldCheckbox
            v-model="scheduleModel"
            :label="scheduleLabel"
            :input-id="scheduleFieldId"
            :disabled="disabled"
            :data-testid="`${testId}__schedule`"
          />

          <Button
            type="submit"
            :label="continueLabel"
            kind="primary"
            size="large"
            class="w-full"
            :disabled="disabled || continueDisabled"
            :data-testid="`${testId}__continue`"
          />
        </div>
      </template>

      <template #footer>
        <slot name="footer">
          <p
            class="w-full text-center text-body-sm text-[var(--text-muted)] [word-break:break-word]"
            :data-testid="`${testId}__footer`"
          >
            {{ footerPrefix }}
            <a
              :href="footerLinkHref"
              class="text-[var(--text-link)] transition-colors duration-fast-02 ease-productive-entrance hover:text-[var(--text-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] motion-reduce:transition-none"
              :data-testid="`${testId}__footer-link`"
              @click="onFooterLinkClick"
            >
              {{ footerLinkLabel }}
            </a>
            with our team.
          </p>
        </slot>
      </template>
    </CardBox>
  </form>
</template>
