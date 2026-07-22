<script setup>
  import catalog from '@aziontech/icons/catalog'
  import colorCatalog from '@aziontech/icons/color-catalog'
  import { ref } from 'vue'

  // Same order as App.vue's iconsList so index i maps to the i-th <li>.
  const icons = [...catalog, ...colorCatalog]

  const input = ref('')

  function searchIcons() {
    const filter = input.value.toUpperCase()

    const ul = document.getElementById('myUL')
    const li = ul.getElementsByTagName('li')

    for (let i = 0; i < li.length; i++) {
      const icon = icons[i]
      const nameMatch = icon.name.toUpperCase().indexOf(filter) > -1
      const keywordMatch = icon.keywords.toUpperCase().indexOf(filter) > -1

      if (nameMatch || keywordMatch) {
        li[i].style.display = ''
      } else {
        li[i].style.display = 'none'
      }
    }
  }
</script>

<template>
  <div class="input-container">
    <i class="pi pi-search"></i>
    <input
      class="w-full"
      autofocus
      type="text"
      v-on:keyup="searchIcons()"
      id="searchInput"
      v-model="input"
      :placeholder="`Search by keywords in ${icons.length} icons...`"
    />
  </div>
</template>

<style scoped>
  #searchInput {
    @apply h-12 pl-10 box-border text-xs;
  }
</style>
