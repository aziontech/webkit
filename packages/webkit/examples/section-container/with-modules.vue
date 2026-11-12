<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
</script>

<template>
  <SectionContainer max-width="site">
    <SectionModule
      :divided="false"
      eyebrow="Platform"
      title="The first module opens on the rule above it"
      description='Its top edge is already drawn — by the hero&apos;s border-b, or by whatever frame the column sits in — so it passes :divided="false" and draws none of its own.'
    >
      <p class="m-0 text-body-md text-(--text-muted)">Module body, padded by the module.</p>
    </SectionModule>

    <SectionModule
      title="Every module after it divides itself"
      description="One rule per seam, drawn by the lower of the two bands."
    >
      <p class="m-0 text-body-md text-(--text-muted)">Module body.</p>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      :padded="false"
      title="A module with an edge-to-edge body"
      description='With :padded="false" the body runs to the column&apos;s own rules, for a grid that pads its own cells.'
    >
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">
        Body owning its inset.
      </div>
    </SectionModule>
  </SectionContainer>
</template>
