<script setup>
  import placeholderImage from '@aziontech/ui/assets/placeholder-image.svg'
  import Avatar from '@aziontech/ui/avatar'

  const variants = ['circle', 'square']
  const sizes = ['small', 'medium', 'large']
</script>

<template>
  <div class="flex flex-col gap-8">
    <section
      v-for="variant in variants"
      :key="variant"
      class="flex flex-col gap-4"
    >
      <h3 class="text-heading-sm text-(--text-default) capitalize">{{ variant }}</h3>
      <div class="flex flex-col gap-6">
        <div class="flex flex-wrap items-end gap-4">
          <span class="w-16 text-body-xs text-(--text-muted)">Text</span>
          <Avatar
            v-for="size in sizes"
            :key="'l-' + variant + size"
            :variant="variant"
            :size="size"
            label="AB"
          />
        </div>
        <div class="flex flex-wrap items-end gap-4">
          <span class="w-16 text-body-xs text-(--text-muted)">Icon</span>
          <Avatar
            v-for="size in sizes"
            :key="'i-' + variant + size"
            :variant="variant"
            :size="size"
          />
        </div>
        <div class="flex flex-wrap items-end gap-4">
          <span class="w-16 text-body-xs text-(--text-muted)">Image</span>
          <Avatar
            v-for="size in sizes"
            :key="'img-' + variant + size"
            :variant="variant"
            :size="size"
            :src="placeholderImage"
            alt="User portrait"
          />
        </div>
      </div>
    </section>
  </div>
</template>
