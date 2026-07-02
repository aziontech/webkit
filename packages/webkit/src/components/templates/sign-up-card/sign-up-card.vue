<script setup>
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'

  defineOptions({
    name: 'SignUpCard',
    inheritAttrs: false
  })

  const emit = defineEmits([
    'github-click',
    'google-click',
    'email-click',
    'sign-in-click',
    'terms-click',
    'privacy-click'
  ])

  defineProps({
    title: {
      type: String,
      default: 'Sign Up for a Free Account'
    },
    subtitle: {
      type: String,
      default: 'US$ 300 credit to use over 12 months, no credit card is required.'
    },
    githubLabel: {
      type: String,
      default: 'Continue with Github'
    },
    googleLabel: {
      type: String,
      default: 'Continue with Google'
    },
    emailLabel: {
      type: String,
      default: 'Sign Up with Work Email'
    },
    signInPrompt: {
      type: String,
      default: 'Already have an account?'
    },
    signInLabel: {
      type: String,
      default: 'Sign in'
    },
    termsHref: {
      type: String,
      default: '#'
    },
    privacyHref: {
      type: String,
      default: '#'
    },
    signInHref: {
      type: String,
      default: '#'
    },
    showGithub: {
      type: Boolean,
      default: true
    },
    showGoogle: {
      type: Boolean,
      default: true
    }
  })

  const attrs = useAttrs()

  const testId = computed(() => attrs['data-testid'] ?? 'template-sign-up-card')

  const rootClass = computed(() => {
    const classes = [
      'flex w-full max-w-[var(--container-sm)] flex-col items-center gap-[var(--spacing-xs)]'
    ]

    if (attrs.class) {
      classes.push(attrs.class)
    }

    return classes
  })

  const cardClass = [
    'flex w-full shrink-0 flex-col items-start overflow-clip',
    'rounded-[var(--shape-card)] border border-[length:var(--border-width-default,1px)]',
    'border-[var(--border-default)] bg-[var(--bg-surface)]'
  ]

  const contentClass = [
    'flex w-full shrink-0 flex-col items-start gap-[var(--spacing-xl)]',
    'px-[var(--spacing-xl)] py-[var(--spacing-xl)]'
  ]

  const headerClass = [
    'flex w-full max-w-[var(--container-sm)] shrink-0 flex-col items-start',
    'gap-[var(--spacing-xs)] [word-break:break-word]'
  ]

  const titleClass = 'text-heading-sm w-full text-[var(--text-default)] [word-break:break-word]'

  const subtitleClass = 'text-body-sm w-full text-[var(--text-muted)] [word-break:break-word]'

  const actionsClass = ['flex w-full shrink-0 flex-col items-start gap-[var(--spacing-xl)]']

  const socialClass = 'flex w-full shrink-0 flex-col items-start gap-[var(--spacing-sm)]'

  const dividerClass = [
    'm-0 w-full shrink-0 border-0',
    'border-t border-[length:var(--border-width-default,1px)] border-t-[var(--border-default)]'
  ]

  const legalClass =
    'text-body-sm w-full shrink-0 text-center text-[var(--text-muted)] [word-break:break-word]'

  const linkClass =
    'text-[var(--text-link)] transition-colors hover:text-[var(--text-default)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring-color)] rounded-[var(--shape-button)]'

  const footerClass = 'flex w-full shrink-0 items-center justify-center gap-[var(--spacing-xs)]'

  const footerPromptClass =
    'text-body-sm shrink-0 text-center text-[var(--text-muted)] whitespace-nowrap'

  const signInLinkClass = [
    'text-body-sm inline-flex h-10 shrink-0 items-center text-[var(--text-link)]',
    'rounded-[var(--shape-button)] transition-colors hover:text-[var(--text-default)]',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring-color)]'
  ]

  const onGithubClick = (event) => emit('github-click', event)
  const onGoogleClick = (event) => emit('google-click', event)
  const onEmailClick = (event) => emit('email-click', event)
  const onSignInClick = (event) => emit('sign-in-click', event)
  const onTermsClick = (event) => emit('terms-click', event)
  const onPrivacyClick = (event) => emit('privacy-click', event)
</script>

<template>
  <div
    :class="rootClass"
    :data-testid="testId"
  >
    <article
      :class="cardClass"
      :data-testid="`${testId}__card`"
    >
      <div
        :class="contentClass"
        :data-testid="`${testId}__content`"
      >
        <header
          :class="headerClass"
          :data-testid="`${testId}__header`"
        >
          <h2
            :class="titleClass"
            :data-testid="`${testId}__title`"
          >
            {{ title }}
          </h2>
          <p
            v-if="subtitle"
            :class="subtitleClass"
            :data-testid="`${testId}__subtitle`"
          >
            {{ subtitle }}
          </p>
        </header>

        <div
          :class="actionsClass"
          :data-testid="`${testId}__actions`"
        >
          <div
            v-if="showGithub || showGoogle"
            :class="socialClass"
            :data-testid="`${testId}__social`"
          >
            <Button
              v-if="showGithub"
              key="github"
              :label="githubLabel"
              kind="outlined"
              size="large"
              icon="pi pi-github"
              class="w-full"
              :data-testid="`${testId}__github`"
              @click="onGithubClick"
            />
            <Button
              v-if="showGoogle"
              key="google"
              :label="googleLabel"
              kind="outlined"
              size="large"
              icon="ai-cor ai-google"
              class="w-full"
              :data-testid="`${testId}__google`"
              @click="onGoogleClick"
            />
          </div>

          <hr
            v-if="showGithub || showGoogle"
            :class="dividerClass"
            :data-testid="`${testId}__divider`"
          />

          <Button
            :label="emailLabel"
            kind="primary"
            size="large"
            class="w-full"
            :data-testid="`${testId}__email`"
            @click="onEmailClick"
          />
        </div>

        <p
          :class="legalClass"
          :data-testid="`${testId}__legal`"
        >
          By signing up, you agree to the
          <a
            :href="termsHref"
            :class="linkClass"
            :data-testid="`${testId}__terms`"
            @click="onTermsClick"
          >
            Terms of Service
          </a>
          and
          <a
            :href="privacyHref"
            :class="linkClass"
            :data-testid="`${testId}__privacy`"
            @click="onPrivacyClick"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </article>

    <div
      :class="footerClass"
      :data-testid="`${testId}__footer`"
    >
      <p :class="footerPromptClass">
        {{ signInPrompt }}
      </p>
      <a
        :href="signInHref"
        :class="signInLinkClass"
        :data-testid="`${testId}__sign-in`"
        @click="onSignInClick"
      >
        {{ signInLabel }}
      </a>
    </div>
  </div>
</template>
