<script setup>
  import Button from '@aziontech/webkit/button'
  import CopyButton from '@aziontech/webkit/copy-button'

  const anchorUrl = globalThis.location.href.split('#')[0] + '#payment-methods'
</script>

<template>
  <header class="group/heading flex flex-col">
    <div class="flex flex-wrap items-start justify-between gap-(--spacing-md) px-(--spacing-xs)">
      <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
        <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
          <h2
            id="payment-methods"
            data-size="medium"
            class="scroll-mt-(--spacing-xl) text-balance data-[size=medium]:text-heading-xs data-[size=medium]:text-(--text-default) data-[size=small]:text-label-md data-[size=small]:text-(--text-muted)"
          >
            Payment methods
          </h2>
          <span
            class="shrink-0 opacity-0 transition-opacity duration-150 ease-out group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
          >
            <CopyButton
              :value="anchorUrl"
              kind="transparent"
              size="small"
              aria-label="Copy link to the Payment methods section"
              copied-label="Link copied"
            />
          </span>
        </div>
        <p class="text-pretty text-body-sm text-(--text-muted)">
          Every card on the account. Invoices are charged to the default one.
        </p>
      </div>
      <div
        class="flex w-full shrink-0 flex-wrap items-center gap-(--spacing-xs) md:w-auto md:max-w-full"
      >
        <Button
          label="Add payment method"
          kind="outlined"
          size="medium"
          icon="pi pi-plus"
        />
      </div>
    </div>
  </header>
</template>
