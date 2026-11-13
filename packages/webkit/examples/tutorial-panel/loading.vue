<script setup>
  import TutorialPanel from '@aziontech/webkit/tutorial-panel'
</script>

<template>
  <div class="max-w-(--container-xs) rounded-(--shape-card) border border-(--border-default)">
    <TutorialPanel.Provider>
      <TutorialPanel loading />
    </TutorialPanel.Provider>
  </div>
</template>
