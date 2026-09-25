import { ref, onMounted, onUnmounted } from 'vue';

const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
};

function getBreakpoint(width) {
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
}

export function useViewport() {
  const breakpoint = ref('desktop');

  function update() {
    breakpoint.value = getBreakpoint(window.innerWidth);
  }

  onMounted(() => {
    update();
    window.addEventListener('resize', update);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', update);
  });

  return { breakpoint };
}
