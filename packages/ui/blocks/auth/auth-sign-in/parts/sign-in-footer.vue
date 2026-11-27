<script setup lang="ts">
  import Link from '@aziontech/ui/link'

  export interface SignInFooterProps {
    /** The question before the link. */
    prompt: string
    /** The text of the link. */
    linkLabel: string
    /** Where the link leads. */
    linkHref: string
    /** Shows the terms line. */
    showTerms?: boolean
    /** The words of the terms line. */
    terms?: { agreeStart: string; terms: string; and: string; privacy: string }
    /** The terms of service page. */
    termsHref?: string
    /** The privacy policy page. */
    privacyHref?: string
  }

  withDefaults(defineProps<SignInFooterProps>(), {
    showTerms: true,
    terms: () => ({
      agreeStart: 'By continuing, I agree to the',
      terms: 'terms of service',
      and: 'and',
      privacy: 'privacy policy'
    }),
    termsHref: 'https://example.com/terms',
    privacyHref: 'https://example.com/privacy'
  })
</script>

<template>
  <div class="flex w-full max-w-(--container-sm) flex-col items-center gap-(--spacing-sm)">
    <div class="flex items-center justify-center gap-(--spacing-xs)">
      <p class="text-body-xs text-(--text-default)">{{ prompt }}</p>
      <span class="text-body-xs">
        <Link
          inline
          :href="linkHref"
          >{{ linkLabel }}</Link
        >
      </span>
    </div>

    <p
      v-if="showTerms"
      class="text-center text-body-xs text-(--text-muted)"
    >
      {{ terms.agreeStart }}
      <Link
        inline
        :href="termsHref"
        target="_blank"
        >{{ terms.terms }}</Link
      >
      {{ terms.and }}
      <Link
        inline
        :href="privacyHref"
        target="_blank"
        >{{ terms.privacy }}</Link
      >.
    </p>
  </div>
</template>
