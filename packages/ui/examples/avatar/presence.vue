<script setup>
  import placeholderImage from '@aziontech/ui/assets/placeholder-image.svg'
  import Avatar from '@aziontech/ui/avatar'

  const people = [
    { name: 'Jane Doe', presence: 'online' },
    { name: 'John Smith', presence: 'away' },
    { name: 'Priya Patel', presence: 'busy' },
    { name: 'Sam Lee', presence: 'offline' }
  ]
  const sizes = ['small', 'medium', 'large']
</script>

<template>
  <div class="flex flex-col gap-6">
    <ul class="flex flex-col gap-3">
      <li
        v-for="person in people"
        :key="person.name"
        class="flex items-center gap-3"
      >
        <Avatar
          :label="person.name"
          :alt="person.name"
          :presence="person.presence"
        />
        <span class="text-body-sm text-(--text-default)">{{ person.name }}</span>
      </li>
    </ul>
    <div class="flex flex-wrap items-end gap-4">
      <Avatar
        v-for="size in sizes"
        :key="'image-' + size"
        :src="placeholderImage"
        alt="Jane Doe"
        :size="size"
        presence="online"
      />
      <Avatar
        v-for="size in sizes"
        :key="'square-' + size"
        label="Acme Inc."
        alt="Acme support"
        variant="square"
        :size="size"
        presence="busy"
      />
    </div>
  </div>
</template>
