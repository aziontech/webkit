<script setup>
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <MediaSplit
      eyebrow="grid"
      title="The default: a drafting lattice."
      description="Square rules faded radially to nothing before the cell's edges, so a scene has a ground and the seam stays the only hard line."
      texture="grid"
    >
      <template #media>
        <Illustration name="quick-start-with-templates" />
      </template>
    </MediaSplit>
    <MediaSplit
      eyebrow="dots"
      title="The quiet one."
      description="A dot lattice, the calmest of the four — reach for it when the scene above it is already busy. This one is at the tightest pitch."
      texture="dots"
      texture-size="small"
    >
      <template #media>
        <Illustration name="quick-start-with-templates" />
      </template>
    </MediaSplit>
    <MediaSplit
      eyebrow="dither"
      title="A density ramp."
      description="Ordered dithering that thins out along an axis, so the ground reads as a gradient made of ink rather than of light."
      texture="dither"
      texture-fade="edges"
    >
      <template #media>
        <Illustration name="quick-start-with-templates" />
      </template>
    </MediaSplit>
    <MediaSplit
      eyebrow="pixelate"
      title="Light pooling under the media."
      description="The loudest ground: a pixelated wash in the brand accent, with two crests travelling under it."
      texture="pixelate"
    >
      <template #media>
        <Illustration name="quick-start-with-templates" />
      </template>
    </MediaSplit>
    <MediaSplit
      eyebrow="none"
      title="The bare cell."
      description="No ground at all, for a band whose media already fills its half with something opaque."
      texture="none"
    >
      <template #media>
        <Illustration name="quick-start-with-templates" />
      </template>
    </MediaSplit>
  </div>
</template>
