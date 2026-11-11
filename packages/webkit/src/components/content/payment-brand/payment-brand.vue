<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'

  export type PaymentBrandId =
    | 'visa'
    | 'mastercard'
    | 'amex'
    | 'diners'
    | 'jcb'
    | 'discover'
    | 'elo'
    | 'hipercard'
    | 'unionpay'
    | 'unknown'

  export type PaymentBrandSize = 'small' | 'medium'

  defineOptions({
    name: 'PaymentBrand',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** The card network as the payment API names it (`visa`, `mastercard`, `amex`, `American Express`, `diners`, `jcb`…). Unknown values draw the generic card glyph. */
      brand?: string
      /** Plate size: `small` 20 × 32 px for dense tables, `medium` 28 × 40 px for rows and forms. */
      size?: PaymentBrandSize
      /** Accessible name. Empty uses the brand's name (`Visa`), or the catalog's `Card` for an unknown brand. */
      label?: string
      /** Hide the plate from assistive technology when the text next to it already names the brand. */
      decorative?: boolean
    }>(),
    {
      brand: '',
      size: 'medium',
      label: undefined,
      decorative: false
    }
  )

  const NAMES: Record<Exclude<PaymentBrandId, 'unknown'>, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    diners: 'Diners Club',
    jcb: 'JCB',
    discover: 'Discover',
    elo: 'Elo',
    hipercard: 'Hipercard',
    unionpay: 'UnionPay'
  }

  const ALIASES: Record<string, PaymentBrandId> = {
    americanexpress: 'amex',
    master: 'mastercard',
    dinersclub: 'diners'
  }

  const DRAWN = new Set<PaymentBrandId>(['visa', 'mastercard', 'amex', 'diners', 'jcb'])

  const attrs = useAttrs()
  const { t } = useTranslate({ paymentBrand: en.paymentBrand })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-payment-brand'
  )

  const id = computed<PaymentBrandId>(() => {
    const key = props.brand
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, '')
    if (Object.hasOwn(NAMES, key)) return key as PaymentBrandId
    return Object.hasOwn(ALIASES, key) ? ALIASES[key] : 'unknown'
  })

  const glyph = computed<'mark' | 'generic'>(() => (DRAWN.has(id.value) ? 'mark' : 'generic'))

  const name = computed<string>(() => {
    if (props.label) return props.label
    if (id.value === 'unknown') return t('paymentBrand.unknown')
    return NAMES[id.value]
  })
</script>

<template>
  <span
    v-bind="$attrs"
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : name"
    :aria-hidden="decorative ? 'true' : undefined"
    :data-testid="testId"
    :data-brand="id"
    :data-size="size"
    :data-glyph="glyph"
    :class="attrs.class"
    class="inline-flex shrink-0 items-center justify-center overflow-clip rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) text-(--text-default) data-[size=medium]:h-7 data-[size=medium]:w-10 data-[size=small]:h-5 data-[size=small]:w-8 [&>svg]:block [&>svg]:h-auto [&>svg]:w-3/5 [&>svg]:max-h-4/5"
  >
    <svg
      v-if="id === 'visa'"
      viewBox="0 0 22 7"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M11.3779 2.22887C11.3653 3.2001 12.2598 3.74205 12.9337 4.0643C13.626 4.3949 13.8585 4.60693 13.8558 4.90261C13.8506 5.35508 13.3036 5.5548 12.7916 5.56255C11.8985 5.57613 11.3792 5.3259 10.9663 5.13665L10.6446 6.61416C11.0588 6.80147 11.8258 6.96483 12.6211 6.972C14.4881 6.972 15.7095 6.06757 15.7162 4.66529C15.7235 2.8856 13.2078 2.7871 13.225 1.99163C13.2309 1.75042 13.4655 1.49302 13.9794 1.42758C14.2337 1.39452 14.9359 1.36922 15.7321 1.729L16.0445 0.299482C15.6164 0.146494 15.0661 0 14.381 0C12.6238 0 11.3878 0.916747 11.3779 2.22887ZM19.047 0.123132C18.7061 0.123132 18.4188 0.318289 18.2906 0.617771L15.6237 6.867H17.4893L17.8606 5.8601H20.1403L20.3557 6.867H22L20.5651 0.123132H19.047ZM19.308 1.9449L19.8464 4.4773H18.3719L19.308 1.9449ZM9.11591 0.123217L7.64534 6.86692H9.42313L10.893 0.123048L9.11591 0.123217ZM6.48596 0.123217L4.63555 4.71328L3.88704 0.810398C3.79921 0.374711 3.45237 0.123132 3.0672 0.123132H0.0423672L0 0.318964C0.620984 0.451204 1.32653 0.664494 1.75398 0.892711C2.01558 1.03212 2.09017 1.15399 2.17611 1.48526L3.59382 6.867H5.4725L8.35278 0.123132L6.48596 0.123217Z"
        fill="currentColor"
      />
    </svg>
    <svg
      v-else-if="id === 'mastercard'"
      viewBox="3.5 2.5 17 11"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="9"
        cy="8"
        r="5"
        fill="currentColor"
      />
      <circle
        cx="15"
        cy="8"
        r="5"
        fill="currentColor"
        fill-opacity="0.5"
      />
    </svg>
    <svg
      v-else-if="id === 'amex'"
      viewBox="13.6 2.4 10.6 11.2"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="m13.7641 13.3939v-5.7014l10.1475.0091v1.5749l-1.1729 1.2534 1.1729 1.2649v1.6083h-1.8726l-.9952-1.0982-.9881 1.1023zM14.2373 2.632h2.4461l.8591 1.9508v-1.9508h3.0198l.5208 1.4616.5225-1.4616h2.3059v5.7014h-12.1865z"
        fill="currentColor"
      />
      <path
        d="m14.4418 12.7688v-4.4489h3.7723v1.0249h-2.5509v.6957h2.4901v1.0078h-2.4901v.6833h2.5509v1.0372zM18.1953 12.7688l2.0873-2.227-2.0874-2.2218h1.6156l1.2755 1.41 1.2791-1.41h1.5462v.035l-2.0429 2.1868 2.0429 2.1639v.0631h-1.5617l-1.2981-1.4242-1.2848 1.4242zM14.7005 3.2514l-1.974 4.4452h1.3539l.3724-.8902h2.0179l.3722.8902h1.3876l-1.9658-4.4452zm.1696 2.5574.592-1.4151.5916 1.4151zM18.212 7.6957v-4.4451l1.9031.0065.9793 2.7327.9856-2.7393h1.8316v4.4451l-1.1786.0104v-3.0533l-1.1126 3.0429h-1.0758l-1.1356-3.0533v3.0533z"
        class="fill-(--bg-surface)"
      />
    </svg>
    <svg
      v-else-if="id === 'diners'"
      viewBox="4.4 2 15.2 12.1"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M10.0021 2.0518v-.016h4v.016c3.1354.2294 5.5621 2.8402 5.5621 5.984s-2.4267 5.7546-5.5621 5.984v.016h-4v-.016C6.8667 13.7904 4.44 11.1796 4.44 8.0358s2.4267-5.7546 5.5621-5.984z"
        fill="currentColor"
      />
      <path
        d="M11.6021 11.4278c1.4353-.5103 2.394-1.8687 2.394-3.392s-.9587-2.8817-2.394-3.392zM9.2021 4.6438c-1.4353.5103-2.394 1.8687-2.394 3.392s.9587 2.8817 2.394 3.392zM10.4021 13.2358c-2.8719 0-5.2-2.3281-5.2-5.2s2.3281-5.2 5.2-5.2 5.2 2.3281 5.2 5.2-2.3281 5.2-5.2 5.2z"
        class="fill-(--bg-surface)"
      />
    </svg>
    <svg
      v-else-if="id === 'jcb'"
      viewBox="0 0 23 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M.2054 16h4.5178c1.0278 0 2.2589-1.1947 2.2589-2.1333V0H2.4643C1.4365 0 .2054 1.1947.2054 3.2zM8.1116 16h4.5179c1.0278 0 2.2589-1.1947 2.2589-2.1333V0h-4.5179C9.3427 0 8.1116 1.1947 8.1116 3.2zM16.0179 16h4.5178c1.0279 0 2.259-1.1947 2.259-2.1333V0h-4.5179c-1.0278 0-2.2589 1.1947-2.2589 3.2z"
        fill="currentColor"
      />
      <path
        d="M2.7692 10.816c-.8673.0002-1.7304-.1147-2.5638-.3413V9.3013c.6467.3777 1.386.5908 2.1459.6187.8697 0 1.3554-.576 1.3554-1.3654V5.333h2.146v3.2213c0 1.2587-.7003 2.2614-3.0835 2.2614zM8.1116 6.08c.6551-.5973 1.7846-.9707 3.6143-.8853.9939.0426 2.033.32 2.033.32v1.184c-.5943-.3395-1.2623-.5474-1.954-.608-1.3892-.1174-2.2363.6186-2.2363 1.9093s.8471 2.0267 2.2363 1.92c.692-.0661 1.3597-.2775 1.954-.6187v1.1734s-1.0391.288-2.033.3306c-1.8297.0854-2.9592-.288-3.6143-.8853zM21.6652 9.28c0 .8533-.7003 1.3867-1.6377 1.3867h-4.0096V5.3333h3.6481l.2598.0107c.8245.0427 1.4344.5013 1.4344 1.2907 0 .6186-.4179 1.152-1.1746 1.28v.032c.8358.0533 1.4796.5546 1.4796 1.3333zm-2.8801-3.104a1 1 0 0 0-.1469-.0107h-1.3553v1.344h1.5022c.2823-.064.5195-.3093.5195-.672s-.2372-.608-.5195-.6613zm.1694 2.176a1 1 0 0 0-.1807-.0107h-1.4909v1.4614h1.4909l.1807-.0214c.2824-.064.5196-.3413.5196-.7146s-.2259-.64-.5196-.7147z"
        class="fill-(--bg-surface)"
      />
    </svg>
    <svg
      v-else
      viewBox="0 0 24 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="1"
        y="1"
        width="22"
        height="14"
        rx="2"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <rect
        x="1"
        y="4"
        width="22"
        height="3"
        fill="currentColor"
      />
      <rect
        x="4"
        y="10"
        width="6"
        height="1.5"
        rx=".75"
        fill="currentColor"
      />
    </svg>
  </span>
</template>
