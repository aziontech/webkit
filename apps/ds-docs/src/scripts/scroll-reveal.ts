/**
 * Scroll reveal – content reveals as it enters the viewport.
 * Uses Motion's inView (Intersection Observer) + animate for efficiency.
 * @see https://motion.dev/docs/inview
 */

import { inView, animate } from 'motion';

const REVEAL_OPTIONS = {
  duration: 0.4,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

const RESET_OPTIONS = {
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

const INVIEW_OPTIONS = {
  amount: 'some' as const,
  margin: '0px 0px 40px 0px' as const,
};

const PENDING_CLASS = 'scroll-reveal-pending';

/** Selector for top-level content blocks (headings, paragraphs, lists, custom components, etc.) */
const BLOCK_SELECTOR = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'ul', 'ol', 'pre', 'blockquote', 'table', 'hr',
  'div', 'section', 'article', 'aside',
].map((tag) => `:scope > ${tag}`).join(', ');

/**
 * Find the root element that contains the main prose/content blocks.
 * - DocPageLayout (DocsShellLayout): .doc-content inside .docs-content-reveal
 * - DocsLayout (no shell): slot is direct under .docs-content-reveal, often inside .prose or a single div
 */
function getContentRoot(container: Element): Element | null {
  // 1) DocPageLayout / DocsShellLayout: content is in .doc-content
  const docContent = container.querySelector('.doc-content');
  if (docContent) {
    const direct = Array.from(docContent.children);
    if (direct.length === 1 && direct[0].matches('div, section, article, main')) {
      return direct[0];
    }
    return docContent;
  }

  // 2) DocsLayout: no .doc-content; slot is direct child(ren) of .docs-content-reveal (e.g. div.prose or multiple sections)
  const direct = Array.from(container.children);
  // Single wrapper (e.g. div.prose from foundations/index, get-started/index, tokens/index)
  if (direct.length === 1 && direct[0].matches('div, section, article, main')) {
    return direct[0];
  }
  // Multiple direct children: use container itself so :scope > * matches them
  if (direct.length > 0) {
    return container;
  }

  return null;
}

function getProseRevealElements(container: Element): Element[] {
  const root = getContentRoot(container);
  if (!root) return [];

  const nodes = root.querySelectorAll(BLOCK_SELECTOR);
  return Array.from(nodes);
}

/**
 * On component pages, content lives inside tab panels (.component-tabs__panel).
 * Collect top-level blocks from each panel's content area for scroll reveal.
 */
function getComponentPageRevealElements(container: Element): Element[] {
  const componentPage = container.querySelector('.component-page');
  if (!componentPage) return [];

  const panels = componentPage.querySelectorAll('.component-tabs__panel');
  const elements: Element[] = [];

  panels.forEach((panel) => {
    // Overview: .overview-content; Usage: .usage-content; API: .api-section; else first wrapper
    let contentRoot: Element | null =
      panel.querySelector('.overview-content') ||
      panel.querySelector('.usage-content') ||
      panel.querySelector('.api-section') ||
      panel.querySelector('.component-overview-tab') ||
      panel.querySelector('.component-usage-tab') ||
      panel.querySelector('.component-api-tab') ||
      panel.firstElementChild;
    if (!contentRoot) return;

    // Overview often has one wrapper (e.g. div.prose) from the slot; use its children so reveal is per block
    if (contentRoot.classList.contains('overview-content')) {
      const direct = Array.from(contentRoot.children);
      if (direct.length === 1 && direct[0].matches('div, section, article, main')) {
        contentRoot = direct[0];
      }
    }

    const blocks = contentRoot.querySelectorAll(BLOCK_SELECTOR);
    elements.push(...Array.from(blocks));
  });

  return elements;
}

/**
 * Components index page (and similar) use .tabs-container with [role="tabpanel"].
 * Collect direct content blocks (h1, p) plus blocks inside each tab panel for scroll reveal.
 */
function getTabsContainerRevealElements(container: Element): Element[] {
  const tabsContainer = container.querySelector('.tabs-container');
  if (!tabsContainer || container.querySelector('.component-page')) return [];

  const elements: Element[] = [];
  // Top-level blocks (h1, p), excluding the tabs container itself
  container.querySelectorAll(BLOCK_SELECTOR).forEach((el) => {
    if (!el.classList.contains('tabs-container')) elements.push(el);
  });

  const panels = tabsContainer.querySelectorAll('[role="tabpanel"]');
  panels.forEach((panel) => {
    const blocks = panel.querySelectorAll(BLOCK_SELECTOR);
    elements.push(...Array.from(blocks));
  });

  return elements;
}
function isInViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

/** True if the element is inside the currently visible tab panel (not hidden). */
function isInVisiblePanel(el: Element): boolean {
  const panel = el.closest('.component-tabs__panel');
  return panel !== null && !(panel as HTMLElement).hidden;
}

/** True if the element is inside a visible [role="tabpanel"] (e.g. .tabs-container on components index). */
function isInVisibleTabsPanel(el: Element): boolean {
  const panel = el.closest('[role="tabpanel"]');
  return panel !== null && !(panel as HTMLElement).hidden;
}

/** Reset element to initial (hidden) state so it can reveal again. */
function resetRevealElement(el: Element): void {
  const htmlEl = el as HTMLElement;
  htmlEl.classList.add(PENDING_CLASS);
  animate(el, { opacity: 0, y: 12 }, RESET_OPTIONS);
}

/** Get reveal elements for a single tab panel (by data-panel-id). Used when switching tabs. */
function getComponentPanelRevealElements(container: Element, panelId: string): Element[] {
  const panel = container.querySelector(
    `.component-page .component-tabs__panel[data-panel-id="${panelId}"]`
  );
  if (!panel) return [];

  let contentRoot: Element | null =
    panel.querySelector('.overview-content') ||
    panel.querySelector('.usage-content') ||
    panel.querySelector('.api-section') ||
    panel.querySelector('.component-overview-tab') ||
    panel.querySelector('.component-usage-tab') ||
    panel.querySelector('.component-api-tab') ||
    panel.firstElementChild;
  if (!contentRoot) return [];

  if (contentRoot.classList.contains('overview-content')) {
    const direct = Array.from(contentRoot.children);
    if (direct.length === 1 && direct[0].matches('div, section, article, main')) {
      contentRoot = direct[0];
    }
  }

  const blocks = contentRoot.querySelectorAll(BLOCK_SELECTOR);
  return Array.from(blocks);
}

function runScrollReveal() {
  const container = document.querySelector('.docs-content-reveal');
  if (!container) return;

  let elements: Element[] = [];
  let tabsContainerElements: Element[] = [];

  // Component pages: reveal blocks inside tab panels (Overview, Usage, API)
  const componentPageElements = getComponentPageRevealElements(container);
  if (componentPageElements.length > 0) {
    elements = componentPageElements;
  } else {
    // Components index (and similar): .tabs-container with Overview | Status panels
    tabsContainerElements = getTabsContainerRevealElements(container);
    if (tabsContainerElements.length > 0) {
      elements = tabsContainerElements;
    } else {
      elements = getProseRevealElements(container);

      if (elements.length === 0) {
        const componentBlocks = container.querySelectorAll('.component-page > *');
        if (componentBlocks.length > 0) {
          elements = Array.from(componentBlocks);
        } else {
          elements = Array.from(container.querySelectorAll(':scope > *'));
        }
      }
    }
  }

  elements.forEach((el) => {
    // On component/tabs pages, always animate the visible tab. Only skip in-view elements that are in a hidden panel.
    const isComponentPage = componentPageElements.length > 0;
    const isTabsIndexPage = tabsContainerElements.length > 0;
    if (isComponentPage) {
      if (isInViewport(el) && !isInVisiblePanel(el)) return;
    } else if (isTabsIndexPage) {
      if (isInViewport(el) && !isInVisibleTabsPanel(el)) return;
    } else {
      if (isInViewport(el)) return;
    }

    (el as HTMLElement).classList.add(PENDING_CLASS);
    inView(
      el,
      (target) => {
        (target as HTMLElement).classList.remove(PENDING_CLASS);
        animate(
          target,
          { opacity: [0, 1], y: [12, 0] },
          REVEAL_OPTIONS
        );
        // When element leaves viewport, reset so it can reveal again when scrolling back.
        return () => resetRevealElement(target);
      },
      INVIEW_OPTIONS
    );
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runScrollReveal);
} else {
  runScrollReveal();
}

/** Reset scroll reveal for the currently visible tab on component pages (so it can reveal again). */
function resetVisibleTabReveal() {
  const container = document.querySelector('.docs-content-reveal');
  if (!container) return;

  const hash = window.location.hash.slice(1);

  // Component pages: Overview | Usage | API
  if (container.querySelector('.component-page') && ['overview', 'usage', 'api'].includes(hash)) {
    requestAnimationFrame(() => {
      const elements = getComponentPanelRevealElements(container, hash);
      elements.forEach((el) => {
        resetRevealElement(el);
        if (isInViewport(el)) {
          (el as HTMLElement).classList.remove(PENDING_CLASS);
          animate(el, { opacity: [0, 1], y: [12, 0] }, REVEAL_OPTIONS);
        }
      });
    });
    return;
  }

  // Components index: Overview | Status
  const tabsContainer = container.querySelector('.tabs-container');
  if (tabsContainer && ['overview', 'status'].includes(hash)) {
    requestAnimationFrame(() => {
      const panel = tabsContainer.querySelector(`[role="tabpanel"][data-panel-id="${hash}"]`);
      if (!panel) return;
      const elements = Array.from(panel.querySelectorAll(BLOCK_SELECTOR));
      elements.forEach((el) => {
        resetRevealElement(el);
        if (isInViewport(el)) {
          (el as HTMLElement).classList.remove(PENDING_CLASS);
          animate(el, { opacity: [0, 1], y: [12, 0] }, REVEAL_OPTIONS);
        }
      });
    });
  }
}

window.addEventListener('hashchange', resetVisibleTabReveal);
