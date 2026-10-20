<script setup>
  import AuthColumn from '../../components/auth/AuthColumn.vue'
</script>

<template>
  <AuthColumn>
    <RouterView v-slot="{ Component, route }">
      <Transition
        mode="out-in"
        enter-active-class="transition-opacity duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          :key="route.path"
          class="flex w-full flex-col items-center"
        >
          <component :is="Component" />
        </div>
      </Transition>
    </RouterView>
  </AuthColumn>
</template>
