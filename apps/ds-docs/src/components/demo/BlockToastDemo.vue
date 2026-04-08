<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

/**
 * BlockToastDemo – Toast block for docs
 *
 * Displays a single toast with title, description, icon, action/link, close button,
 * and a progress bar showing the auto-close timer.
 */

type Variant = 'success' | 'error';

interface Props {
  variant?: Variant;
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  durationMs?: number;
  /** When false, toast stays visible and timer does not run (e.g. for Playground) */
  autoClose?: boolean;
  /** When false, progress bar is hidden */
  showProgress?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'success',
  title: 'Success',
  description: 'Your changes have been saved successfully.',
  actionText: 'View details',
  actionHref: '#',
  durationMs: 5000,
  autoClose: true,
  showProgress: true,
});

const emit = defineEmits<{
  close: [];
}>();

const progress = ref(100);
const isVisible = ref(true);
let intervalId: ReturnType<typeof setInterval> | null = null;

const variantStyles = computed(() => {
  if (props.variant === 'error') {
    return {
      wrapper: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      iconClass: 'pi pi-times-circle',
      title: 'text-red-900',
      description: 'text-red-800',
      action: 'text-red-700 hover:text-red-900 font-medium',
      progressBg: 'bg-red-200',
      progressFill: 'bg-red-600',
    };
  }
  return {
    wrapper: 'bg-emerald-50 border-emerald-200',
    icon: 'text-emerald-600',
    iconClass: 'pi pi-check-circle',
    title: 'text-emerald-900',
    description: 'text-emerald-800',
    action: 'text-emerald-700 hover:text-emerald-900 font-medium',
    progressBg: 'bg-emerald-200',
    progressFill: 'bg-emerald-600',
  };
});

function startTimer() {
  const step = 50;
  const stepPercent = (step / props.durationMs) * 100;
  intervalId = setInterval(() => {
    progress.value = Math.max(0, progress.value - stepPercent);
    if (progress.value <= 0 && intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      isVisible.value = false;
      emit('close');
    }
  }, step);
}

function handleClose() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  isVisible.value = false;
  emit('close');
}

onMounted(() => {
  if (props.autoClose) startTimer();
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <div
    v-if="isVisible"
    :class="[
      'rounded-lg border shadow-sm overflow-hidden min-w-[320px] max-w-[400px]',
      variantStyles.wrapper,
    ]"
    role="alert"
  >
    <div class="p-4 flex gap-3">
      <div :class="['shrink-0 text-xl', variantStyles.icon]" aria-hidden="true">
        <i :class="variantStyles.iconClass" />
      </div>
      <div class="flex-1 min-w-0">
        <p :class="['font-medium text-sm', variantStyles.title]">
          {{ title }}
        </p>
        <p v-if="description" :class="['text-sm mt-0.5', variantStyles.description]">
          {{ description }}
        </p>
        <div class="mt-3 flex items-center gap-3">
          <a
            v-if="actionText"
            :href="actionHref"
            :class="['text-sm underline underline-offset-2', variantStyles.action]"
            @click.prevent
          >
            {{ actionText }}
          </a>
          <button
            type="button"
            class="ml-auto p-1 rounded hover:bg-black/5 text-current opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close"
            @click="handleClose"
          >
            <i class="pi pi-times text-sm" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="showProgress"
      :class="['h-1', variantStyles.progressBg]"
    >
      <div
        :class="['h-full transition-all duration-75 ease-linear', variantStyles.progressFill]"
        :style="{ width: `${progress}%` }"
        role="progressbar"
        :aria-valuenow="Math.round(progress)"
        aria-valuemin="0"
        aria-valuemax="100"
      />
    </div>
  </div>
</template>
