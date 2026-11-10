<script setup>
  import Hero from '@aziontech/webkit/hero'
  import Illustration from '@aziontech/webkit/illustration'
</script>

<template>
  <div>
    <Hero
      kind="screen"
      max-width="site"
    >
      <template #background>
        <div class="flex h-full items-center justify-end">
          <div class="w-full mask-l-from-50% md:w-3/5">
            <Illustration name="global-network" />
          </div>
        </div>
      </template>

      <Hero.Title
        eyebrow="#background"
        eyebrow-prefix="//"
        title="The network behind the copy"
        description="A scene in the art half of the band, behind the copy."
      />
    </Hero>

    <Hero
      kind="screen"
      max-width="site"
      class="[--banner-top-height:44%]"
    >
      <template #top>
        <div
          class="mx-auto w-full max-w-(--container-3xl) pt-(--spacing-xl) mask-b-from-45% mask-b-to-80%"
        >
          <Illustration name="low-latency" />
        </div>
      </template>

      <Hero.Title
        centered
        eyebrow="#top"
        eyebrow-prefix="//"
        title="Closer to every user"
        description="A scene framed by the window on the band's top edge. The window clips it, so only the part it frames shows above the copy."
      />
    </Hero>

    <Hero
      kind="screen"
      max-width="site"
    >
      <Hero.Title
        eyebrow="#media"
        eyebrow-prefix="//"
        title="Build on the framework you already use"
        description="A scene beside the copy. From md up the column splits in two; below md the scene stacks under the copy."
      />

      <template #media>
        <Illustration name="build-applications" />
      </template>
    </Hero>
  </div>
</template>
