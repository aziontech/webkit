<script setup>
  import { ref } from 'vue'
  import icons from '@aziontech/icons/catalog'

  let input = ref('')

  function searchIcons() {
    let filter = input.value.toUpperCase()

    let ul = document.getElementById('myUL')
    let li = ul.getElementsByTagName('li')

    for (let i = 0; i < li.length; i++) {
      let icon = icons[i]
      let nameMatch = icon.name.toUpperCase().indexOf(filter) > -1
      let keywordMatch = icon.keywords.toUpperCase().indexOf(filter) > -1

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
