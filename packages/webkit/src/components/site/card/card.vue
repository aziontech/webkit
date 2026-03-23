<template>
  <template v-if="variant === 'outline'">
      <PrimeCard unstyled :pt="outlineCardPT">
        <template #content>
          <div class="flex gap-2">
            <span
              v-if="icon"
              :class="icon"
              class="text-orange-500 text-lg md:text-xl flex-shrink-0"
            ></span>
            <div class="flex flex-col gap-2">
              <h3 class="display-5-mobile md:display-5 text-white font-sora">{{ title }}</h3>
              <div
                v-if="descriptionRawMarkdown"
                class="body-2 text-neutral-400 leading-relaxed font-sora"
                v-html="parsedMarkdown"
              />
            </div>
          </div>
        </template>
      </PrimeCard>
  </template>

  <template v-else>
    <template v-if="href && href.length > 0">
      <PrimeCard
        unstyled
        :pt="defaultCardWithHoverPT"
        class="group transition-colors"
      >
        <template #content>
          <div class="flex flex-col gap-3 h-full">
            <div class="flex flex-col gap-2 font-sora flex-grow">
              <h5 :class="innerStyleWithHover[theme].title">{{ title }}</h5>
              <div
                v-if="descriptionRawMarkdown"
                :class="innerStyleWithHover[theme].description"
                v-html="parsedMarkdown"
              />
            </div>
            <div class="mt-auto">
              <Button
                :label="label || 'Learn more'"
                size="small"
                type="linkSecondary"
                :href="href"
                customClass="px-0 bg-transparent"
              />
            </div>
          </div>
        </template>
      </PrimeCard>
    </template>

    <template v-else>
      <PrimeCard unstyled :pt="defaultCardPT">
        <template #content>
          <div class="flex flex-col gap-3 h-full">
            <div class="flex flex-col gap-2 font-sora flex-grow">
              <p :class="innerStyle[theme].title">{{ title }}</p>
              <div
                v-if="descriptionRawMarkdown"
                :class="innerStyle[theme].description"
                v-html="parsedMarkdown"
              />
              <p
                v-else
                :class="innerStyle[theme].description"
              >
                {{ description }}
              </p>
            </div>
          </div>
        </template>
      </PrimeCard>
    </template>
  </template>
</template>

<script setup>
  import { computed } from 'vue'
  import PrimeCard from 'primevue/card'
  import Button from '../button'
  import { parseMarkdown } from '../../../services/markdown/markdown-service'

  const props = defineProps({
    label: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    href: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      options: ['default'],
      default: 'default'
    },
    target: {
      type: String,
      options: ['_blank', '_self'],
      default: '_self'
    },
    variant: {
      type: String,
      options: ['default', 'outline'],
      default: 'default'
    },
    icon: {
      type: String,
      default: ''
    },
    descriptionRawMarkdown: {
      type: String,
      default: ''
    }
  })

  const parsedMarkdown = computed(() => {
    if (props.descriptionRawMarkdown) {
      return parseMarkdown(props.descriptionRawMarkdown)
    }
    return ''
  })

  const innerStyle = {
    default: {
      title: 'display-5 text-neutral-100',
      description: 'text-xs text-neutral-400'
    }
  }

  const innerStyleWithHover = {
    default: {
      title: 'display-5 text-neutral-100 group-hover:text-violet-300',
      description: 'text-xs text-neutral-400'
    }
  }

  const outlineCardPT = {
    root: {
      class: [
        'p-1 border hover:bg-neutral-900 transition-colors duration-150 border-neutral-900 relative',
        'after:content-[\'\'] after:bg-neutral-400 after:w-1 after:h-1 after:absolute after:top-0 after:right-0 after:block',
        'before:content-[\'\'] before:bg-neutral-400 before:w-1 before:h-1 before:absolute before:top-0 before:left-0 before:block'
      ]
    },
    body: {
      class: [
        'h-full w-full p-6',
        'before:content-[\'\'] before:bg-neutral-400 before:w-1 before:h-1 before:absolute before:bottom-0 before:left-0 before:block',
        'after:content-[\'\'] after:bg-neutral-400 after:w-1 after:h-1 after:absolute after:bottom-0 after:right-0 after:block'
      ]
    },
    content: {
      class: 'p-0'
    }
  }

  const outlineCardPTWithHover = {
    root: {
      class: [
        'p-1 border group-hover:bg-neutral-900 transition-colors duration-150 border-neutral-900 relative',
        'after:content-[\'\'] after:bg-neutral-400 after:w-1 after:h-1 after:absolute after:top-0 after:right-0 after:block',
        'before:content-[\'\'] before:bg-neutral-400 before:w-1 before:h-1 before:absolute before:top-0 before:left-0 before:block'
      ]
    },
    body: {
      class: [
        'h-full w-full p-6',
        'before:content-[\'\'] before:bg-neutral-400 before:w-1 before:h-1 before:absolute before:bottom-0 before:left-0 before:block',
        'after:content-[\'\'] after:bg-neutral-400 after:w-1 after:h-1 after:absolute after:bottom-0 after:right-0 after:block'
      ]
    },
    content: {
      class: 'p-0'
    }
  }

  const defaultCardPT = {
    root: {
      class: 'w-full h-full bg-neutral-900 rounded-md flex flex-col'
    },
    body: {
      class: 'p-3 md:p-6 flex-1'
    },
    content: {
      class: 'p-0 h-full'
    }
  }

  const defaultCardWithHoverPT = {
    root: {
      class: 'w-full h-full bg-neutral-900 rounded-md group-hover:bg-neutral-800 transition-colors flex flex-col'
    },
    body: {
      class: 'p-3 md:p-6 flex-1'
    },
    content: {
      class: 'p-0 h-full'
    }
  }
</script>
