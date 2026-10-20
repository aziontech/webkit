<script setup>
  import Button from '@aziontech/webkit/button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import { computed, ref } from 'vue'

  import ProductFirstUse from '../../components/home/ProductFirstUse.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { productEmptyStates, productOptions } from '../../lib/data/product-empty-states'

  const selected = ref(productEmptyStates[0].id)
  const current = computed(
    () =>
      productEmptyStates.find((product) => product.id === selected.value) ?? productEmptyStates[0]
  )

  const swapped = ref(false)

  const onProduct = (event, value) => {
    selected.value = value
    swapped.value = true
  }
</script>

<template>
  <AppLayout
    active=""
    :breadcrumb="[{ label: 'Empty states' }, { label: current.label }]"
  >
    <main class="layout-column-focused flex min-h-full flex-col">
      <div class="my-auto flex w-full flex-col gap-(--layout-section-gap) py-(--spacing-xl)">
        <div
          class="animate-content-enter motion-reduce:animate-none flex flex-col items-center gap-(--spacing-lg)"
        >
          <div class="flex max-w-(--container-2xl) flex-col items-center gap-(--spacing-xs)">
            <p class="text-center text-body-md text-(--text-muted)">Empty states</p>
            <h1 class="text-balance text-center text-heading-lg text-(--text-default)">
              What a product shows before it owns anything.
            </h1>
            <p class="text-pretty text-center text-body-sm text-(--text-muted)">
              What the product is, and the gates into it — each one opening the create flow that
              already owns it. Switch the product to see the same block asked in its own terms.
            </p>
          </div>

          <Dropdown
            placement="bottom"
            @select="onProduct"
          >
            <Dropdown.Trigger>
              <Button
                :label="current.label"
                :icon="current.icon"
                kind="outlined"
                size="medium"
              />
            </Dropdown.Trigger>

            <Dropdown.Group label="Product">
              <Dropdown.Option
                v-for="option in productOptions"
                :key="option.value"
                :value="option.value"
                :label="option.label"
                :selected="selected === option.value"
              >
                <template #left>
                  <i
                    :class="option.icon"
                    class="text-(--text-muted)"
                    aria-hidden="true"
                  />
                </template>
                <template
                  v-if="selected === option.value"
                  #right
                >
                  <i
                    class="pi pi-check text-(--text-default)"
                    aria-hidden="true"
                  />
                </template>
              </Dropdown.Option>
            </Dropdown.Group>
          </Dropdown>
        </div>

        <ProductFirstUse
          :key="current.id"
          :product="current"
          :enter="swapped"
        />
      </div>
    </main>
  </AppLayout>
</template>
