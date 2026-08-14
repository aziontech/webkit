export const curve = {
  'productive-entrance': 'cubic-bezier(0.39, 0.57, 0.56, 1)',
  'productive-exit': 'cubic-bezier(0.55, 0.09, 0.68, 0.53)',
  'expressive-entrance': 'cubic-bezier(0.17, 0.84, 0.44, 1)',
  'expressive-exit': 'cubic-bezier(0.95, 0.05, 0.8, 0.04)'
}

export const duration = {
  'fast-01': '70ms',
  'fast-02': '110ms',
  'moderate-01': '150ms',
  'moderate-02': '240ms',
  'slow-01': '400ms',
  'slow-02': '700ms',
  'slow-03': '1100ms',
  'slow-04': '2100ms'
}

export const animate = {
  spin: 'spin 1s linear infinite',
  ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  bounce: 'bounce 1s infinite',
  shimmer: 'shimmer 1.6s linear infinite',
  blink: 'blink 1s step-end infinite',
  'fade-in': 'fadeIn 220ms ease-in-out',
  'fade-out': 'fadeOut 220ms ease-in-out',
  'slide-down': 'slideDown 220ms ease-in-out',
  'highlight-fade': `highlight ${duration['slow-03']} ease-in forwards`,
  // The two arrivals, and they are a pair — see the note above their keyframes.
  // `page-enter` is the route transition; `content-enter` is content settling inside a
  // page already on screen. Both take `moderate-02` + `productive-entrance`: the
  // pairing the system already uses for a panel of content arriving, so a page and the
  // components on it move as one system.
  'page-enter': `pageEnter ${duration['moderate-02']} ${curve['productive-entrance']}`,
  // `backwards` so a staggered follower holds its offset through the delay instead of
  // showing the landed state and then jumping back to its start.
  'content-enter': `contentEnter ${duration['moderate-02']} ${curve['productive-entrance']} var(--content-enter-delay, 0s) backwards`,
  'popup-scale-in': `popupScaleIn ${duration['moderate-01']} ${curve['productive-entrance']}`,
  'popup-scale-out': `popupScaleOut ${duration['fast-02']} ${curve['productive-exit']}`,
  'slide-in-left': `slideInLeft ${duration['moderate-02']} ${curve['productive-entrance']}`,
  'slide-out-left': `slideOutLeft ${duration['moderate-01']} ${curve['productive-exit']}`,
  'slide-in-right': `slideInRight ${duration['moderate-02']} ${curve['productive-entrance']}`,
  'slide-out-right': `slideOutRight ${duration['moderate-01']} ${curve['productive-exit']}`,
  'progress-indeterminate': `progressIndeterminate ${duration['slow-04']} ${curve['productive-entrance']} infinite`,
  'progress-indeterminate-short': `progressIndeterminateShort ${duration['slow-04']} ${curve['expressive-entrance']} ${duration['slow-03']} infinite`,
  // `linear` (not a curve token) for the same reason as spin/shimmer: an endlessly
  // looping animation must not accelerate, or the seam between repeats is visible.
  'flow-dash': `flowDash ${duration['slow-02']} linear infinite`,
  'illustration-rim-sweep': `illustrationRimSweep ${duration['slow-04']} linear infinite`,
  // The ambient pair behind the illustrated chat window. `9s` is deliberately off the duration
  // scale — like `spin`, `pulse`, `shimmer` and `blink` above, which are also literals: that
  // scale tops out at 2.1s because it budgets UI transitions, and an ambient loop that runs
  // forever in the corner of a page is not one. At 9s the transcript delivers a message every
  // 2.25s, which reads as a conversation rather than as a ticker.
  //
  // Not `linear`, unlike every other endless loop here: this one is four discrete steps with
  // holds between them, so there is no continuous motion to keep even — each slide is a small UI
  // movement in its own right and takes the entrance curve.
  //
  // The two MUST share a duration — the pop is phase-locked to the scroll by a per-message
  // negative delay, so a change to one is a change to both.
  'illustration-chat-scroll': `illustrationChatScroll 9s ${curve['productive-entrance']} infinite`,
  'illustration-chat-pop': `illustrationChatPop 9s ${curve['expressive-entrance']} infinite`
}

export const useWhen = {
  'page-enter':
    'A page arriving on a route change — on the CONTENT ZONE only, never the shell. The chrome is the same before and after, and sliding it announces a reload that did not happen. Key it on the route path so a component serving several paths still replays it. Nothing inside the page may animate on mount at the same time: the two run in lockstep and read as one element travelling on a diagonal.',
  'content-enter':
    'Content settling INSIDE a page that is already on screen — a loading window resolving, a filtered list swapping, a step changing. Never on first paint of a page whose own entrance is already running (use it after that entrance, or after a wire). Stagger a follower with --content-enter-delay.',
  spin: 'Indeterminate circular spinners (loading icons).',
  ping: 'One-off attention ring radiating from a small element (notification dot).',
  pulse: 'Skeleton/placeholder opacity pulse while content loads.',
  bounce: 'Playful attention bounce (scroll-down hints); use sparingly.',
  shimmer: 'Skeleton shimmer sweep while content loads.',
  blink: 'Text caret / terminal cursor blink.',
  'fade-in': 'Content or backdrop appearing in place (no directional origin).',
  'fade-out': 'Content or backdrop leaving in place (pair of fade-in).',
  'slide-down': 'Vertical disclosure expanding (accordion panel, expandable row).',
  'highlight-fade': 'Row/item briefly highlighted after an update (recently changed).',
  'popup-scale-in':
    'Anchored overlays opening (dropdown, popover, tooltip, menu); set --popup-origin.',
  'popup-scale-out': 'Anchored overlays closing (pair of popup-scale-in).',
  'slide-in-left':
    'Left-anchored panel entering (sidebar, navigation drawer). Wrap the v-if region in a Vue Transition with enter-active-class.',
  'slide-out-left':
    'Left-anchored panel leaving (pair of slide-in-left; use as leave-active-class).',
  'slide-in-right': 'Right-anchored panel entering (settings/detail drawer).',
  'slide-out-right': 'Right-anchored panel leaving (pair of slide-in-right).',
  'progress-indeterminate': 'Indeterminate linear progress bar (primary sweep).',
  'progress-indeterminate-short': 'Indeterminate linear progress bar (secondary short sweep).',
  'flow-dash':
    'Flowing connection along an SVG connector stroke in a node-based / network diagram. Set a stroke-dasharray whose cycle divides 24 (e.g. 4 4) so the loop is seamless.',
  'illustration-rim-sweep':
    'Rim light travelling around an illustration on hover. Apply through the .illustration-rim-sweep utility, which re-declares the ramp stack the angle drives; paused by default and set running from the hovered ancestor.',
  'illustration-chat-scroll':
    'A conversation advancing bottom-to-top inside an illustrated window, one message per step. Apply to a track exactly twice the height of its clipped viewport (h-[200%]) holding four EQUAL-height messages per screenful, repeated in the second half — each step is then one message and the loop lands on an identical frame, with no seam.',
  'illustration-chat-pop':
    'Each message landing at the bottom of that scroll. Same duration as illustration-chat-scroll, with a negative animation-delay per message (-6.75s / -4.5s / -2.25s / 0s for the four) so its 4% pop fires on the step boundary, with the message standing still and in view.'
}

export default { animate, curve, duration, useWhen }
