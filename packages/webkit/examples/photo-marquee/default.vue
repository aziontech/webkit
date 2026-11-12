<script setup>
  import PhotoMarquee from '@aziontech/webkit/photo-marquee'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
</script>

<template>
  <PhotoMarquee
    title="Work at Azion"
    description="The Azion Way of Life pairs high performance with autonomy, authenticity, and enjoyment. You manage your own routine and answer for outcomes, working with teammates across countries and cultures. There's no dress code: what counts is the ideas, energy, and integrity you bring."
    description-width="wide"
    aria-label="Azion offices"
    :photos="[
      {
        src: placeholderImage + '#office-desks',
        alt: 'An open-plan office with a fern-lined shelf and a person working at a shared desk',
        width: 1066,
        height: 1600
      },
      {
        src: placeholderImage + '#office-lounge',
        alt: 'A lounge corridor with a sofa and two sling chairs along a wall of windows',
        width: 1600,
        height: 1066
      },
      {
        src: placeholderImage + '#team-talk',
        alt: 'A team member giving a talk in front of a screen while colleagues listen with laptops',
        width: 900,
        height: 1600
      },
      {
        src: placeholderImage + '#office-window-bar',
        alt: 'One person reading on a window bench while two colleagues talk at a window counter',
        width: 1066,
        height: 1600
      },
      {
        src: placeholderImage + '#office-shelves',
        alt: 'Shelves of ferns and collectible figures beside a glass-walled meeting room',
        width: 1600,
        height: 1066
      },
      {
        src: placeholderImage + '#office-private-room',
        alt: 'A wood-panelled meeting room with a person working on a laptop by the window',
        width: 1600,
        height: 1066
      }
    ]"
  />
</template>
