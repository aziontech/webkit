/**
 * Dropdown Positioning Composable
 *
 * Provides automatic positioning detection for dropdown menus
 * to prevent viewport overflow and ensure the dropdown remains fully visible.
 */

import { ref, computed, type Ref, type ComputedRef } from 'vue';

export type DropdownPosition = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export interface DropdownPositionOptions {
  /** Minimum distance from viewport edge in pixels */
  viewportPadding?: number;
  /** Estimated dropdown height (used before rendering) */
  estimatedHeight?: number;
  /** Default position when there is enough space */
  defaultPosition?: DropdownPosition;
}

export interface DropdownPositionResult {
  /** Calculated position for the dropdown */
  position: Ref<DropdownPosition>;
  /** CSS classes to apply to the dropdown */
  dropdownClasses: ComputedRef<string>;
  /** Update position based on current trigger position */
  updatePosition: () => void;
  /** Reset position to default */
  resetPosition: () => void;
}

const DEFAULT_PADDING = 8;
const DEFAULT_ESTIMATED_HEIGHT = 200;

/**
 * Composable for automatic dropdown positioning
 *
 * @param triggerRef - Reference to the trigger element
 * @param dropdownRef - Reference to the dropdown element
 * @param options - Positioning options
 * @returns Position state and methods
 */
export function useDropdownPosition(
  triggerRef: Ref<HTMLElement | null>,
  dropdownRef: Ref<HTMLElement | null>,
  options: DropdownPositionOptions = {}
): DropdownPositionResult {
  const {
    viewportPadding = DEFAULT_PADDING,
    estimatedHeight = DEFAULT_ESTIMATED_HEIGHT,
    defaultPosition = 'bottom-start',
  } = options;

  const position = ref<DropdownPosition>(defaultPosition);

  /**
   * Calculate available space in each direction
   */
  function getAvailableSpace(): {
    bottom: number;
    top: number;
    left: number;
    right: number;
  } {
    if (!triggerRef.value) {
      return { bottom: 0, top: 0, left: 0, right: 0 };
    }

    const triggerRect = triggerRef.value.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    return {
      bottom: viewportHeight - triggerRect.bottom - viewportPadding,
      top: triggerRect.top - viewportPadding,
      left: triggerRect.left - viewportPadding,
      right: viewportWidth - triggerRect.right - viewportPadding,
    };
  }

  /**
   * Get the actual dropdown height if rendered, otherwise use estimate
   */
  function getDropdownHeight(): number {
    if (dropdownRef.value) {
      return dropdownRef.value.offsetHeight;
    }
    return estimatedHeight;
  }

  /**
   * Get the actual dropdown width if rendered, otherwise use estimate
   */
  function getDropdownWidth(): number {
    if (dropdownRef.value) {
      return dropdownRef.value.offsetWidth;
    }
    return 150; // Default minimum width estimate
  }

  /**
   * Determine the best position based on available space
   */
  function calculatePosition(): DropdownPosition {
    const space = getAvailableSpace();
    const dropdownHeight = getDropdownHeight();
    const dropdownWidth = getDropdownWidth();

    // Check if we need to flip vertically
    const fitsBelow = space.bottom >= dropdownHeight;
    const fitsAbove = space.top >= dropdownHeight;

    // Check if we need to flip horizontally
    const fitsRight = space.right >= dropdownWidth;
    const fitsLeft = space.left >= dropdownWidth;

    // Determine vertical position
    let vertical: 'bottom' | 'top';
    if (fitsBelow) {
      vertical = 'bottom';
    } else if (fitsAbove) {
      vertical = 'top';
    } else {
      // If neither fits perfectly, choose the side with more space
      vertical = space.bottom > space.top ? 'bottom' : 'top';
    }

    // Determine horizontal alignment
    let horizontal: 'start' | 'end';
    if (fitsRight) {
      horizontal = 'start';
    } else if (fitsLeft) {
      horizontal = 'end';
    } else {
      // If neither fits perfectly, choose the side with more space
      horizontal = space.right > space.left ? 'start' : 'end';
    }

    return `${vertical}-${horizontal}` as DropdownPosition;
  }

  /**
   * Update position based on current trigger position
   */
  function updatePosition(): void {
    position.value = calculatePosition();
  }

  /**
   * Reset position to default
   */
  function resetPosition(): void {
    position.value = defaultPosition;
  }

  // Compute CSS classes based on position
  const dropdownClasses = computed(() => {
    const classes: string[] = [];

    // Vertical position
    if (position.value.startsWith('top')) {
      classes.push('dropdown--above');
    } else {
      classes.push('dropdown--below');
    }

    // Horizontal alignment
    if (position.value.endsWith('end')) {
      classes.push('dropdown--align-end');
    } else {
      classes.push('dropdown--align-start');
    }

    return classes.join(' ');
  });

  return {
    position,
    dropdownClasses,
    updatePosition,
    resetPosition,
  };
}
