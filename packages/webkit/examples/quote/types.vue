<script setup>
  import magaluLogo from '@aziontech/webkit/assets/magalu-extended-color.svg'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
  import Quote from '@aziontech/webkit/quote'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <Quote
      kind="inline"
      text="Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks."
      name="Allan Monteiro"
      job-title="CISO & Head of Technology at Magalu"
      :logo="magaluLogo"
    />
    <Quote
      kind="signed"
      text="Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks."
      name="Allan Monteiro"
      job-title="CISO & Head of Technology at Magalu"
      :logo="magaluLogo"
    />
    <Quote
      kind="highlight"
      text="Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks."
      name="Allan Monteiro"
      job-title="CISO & Head of Technology at Magalu"
      :photo="placeholderImage"
      :logo="magaluLogo"
    />
  </div>
</template>
