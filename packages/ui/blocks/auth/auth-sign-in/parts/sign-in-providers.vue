<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Separator from '@aziontech/ui/separator'
  import Skeleton from '@aziontech/ui/skeleton'

  import type { SignInMethod, SignInProvider } from '../auth-sign-in.vue'
  import type { SignInCopy } from '../lib/sign-in-copy'
  import LastUsedTag from './last-used-tag.vue'

  export interface SignInProvidersProps {
    /** The card copy in the app's language. */
    copy: SignInCopy
    /** Skeleton bars hold the place of the providers. */
    loading?: boolean
    /** The method that carries the Last used tag. */
    lastUsed?: SignInMethod | ''
  }

  withDefaults(defineProps<SignInProvidersProps>(), { loading: false, lastUsed: '' })

  const emit = defineEmits<{
    'provider-click': [event: MouseEvent, provider: SignInProvider]
  }>()

  const providers: { id: SignInProvider; icon: string; label: keyof SignInCopy }[] = [
    { id: 'google', icon: 'az-color az-google', label: 'continueWithGoogle' },
    { id: 'github', icon: 'az az-github', label: 'continueWithGithub' }
  ]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg) pb-(--spacing-lg)">
    <div
      v-if="loading"
      role="status"
      :aria-label="copy.preparingProviders"
      class="flex flex-col gap-(--spacing-sm)"
    >
      <Skeleton height="2.5rem" />
      <Skeleton height="2.5rem" />
    </div>
    <div
      v-else
      class="flex flex-col gap-(--spacing-sm)"
    >
      <div
        v-for="provider in providers"
        :key="provider.id"
        class="relative"
      >
        <Button
          type="button"
          :label="copy[provider.label]"
          variant="outline"
          size="large"
          :icon="provider.icon"
          class="w-full"
          @click="(event: MouseEvent) => emit('provider-click', event, provider.id)"
        />
        <LastUsedTag
          v-if="lastUsed === provider.id"
          :label="copy.lastUsed"
        />
      </div>
    </div>

    <Separator :label="copy.or" />
  </div>
</template>
