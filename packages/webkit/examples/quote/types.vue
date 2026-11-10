<script setup>
  import magaluLogo from '@aziontech/webkit/assets/magalu-extended-color.svg'
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
      photo="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face"
      :logo="magaluLogo"
    />
  </div>
</template>
