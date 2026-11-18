# Size budgets in the 6.0 clean break

The written reason for every size budget 6.0 raised, and the budgets it lowered, as the bundle-budget rule asks (`.claude/rules/bundle-budget.md`). Sizes are gzip, measured by `scripts/check-size.mjs`. The PR that merges 6.0 into `main` pastes the `Budget-raise:` lines below into its body, which is what `check-size-ratchet.mjs` reads.

Budget-raise: site-layout 75.05 KB → 76.25 KB (measured 76.14 KB): 6.0 approved proposals merged in v6/prop (CodeBlock line diffs, Command ranked search and Kbd keys in the shell search).
Budget-raise: doc-layout 65 KB → 68.3 KB (measured 68.19 KB): 6.0 approved proposals merged in v6/prop (CodeBlock line diffs, Command ranked search and Kbd keys in the docs search).
Budget-raise: doc-markdown 23.85 KB → 24.7 KB (measured 24.57 KB): 6.0 DocTooltip folded into HoverCard, which DocMarkdown renders for the MDX Tooltip tag (v6/docs), and 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: search-trigger 9 KB → 9.35 KB (measured 9.21 KB): 6.0 approved proposals merged in v6/prop (Kbd keys list).
Budget-raise: password-requirements 3.7 KB → 3.9 KB (measured 3.78 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: doc-code-group 30 KB → 31.55 KB (measured 31.44 KB): 6.0 approved proposals merged in v6/prop (CodeBlock computes unified and split line diffs).
Budget-raise: doc-page-header 28.65 KB → 30.35 KB (measured 30.24 KB): 6.0 approved proposals merged in v6/prop (CodeBlock line diffs in the copy-page menu, DropdownMenu sub-menus).
Budget-raise: logo-wall 4.5 KB → 4.7 KB (measured 4.57 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: carousel-root 3.85 KB → 4 KB (measured 3.90 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: site-page 7.6 KB → 8.05 KB (measured 7.95 KB): 6.0 marketing near-copies folded into the page sections (v6/mkt).
Budget-raise: quote 15 KB → 15.2 KB (measured 15.07 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: quote-tabs 23.6 KB → 23.85 KB (measured 23.72 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: marquee 7.65 KB → 7.8 KB (measured 7.69 KB): A15 text wordmarks for brands whose terms refuse their logo, in the brand-mark registry (owner 2026-11-17).
Budget-raise: quote-tabs 23.85 KB → 24.05 KB (measured 23.91 KB): A15 text wordmarks for brands whose terms refuse their logo, in the brand-mark registry (owner 2026-11-17).
Budget-raise: client-quotes-section 26.4 KB → 26.6 KB (measured 26.47 KB): A15 text wordmarks for brands whose terms refuse their logo, in the brand-mark registry, through QuoteTabs (owner 2026-11-17).
Budget-raise: doc-markdown 25.9 KB → 26 KB (measured 25.94 KB): the owner decisions of 2026-11-17 (AU1/AU2 field error icon and tokens, AU4 pause messages, C-07 AvatarGroup messages in the shared catalogs) grew it past a budget with no headroom.
Budget-raise: doc-code-group 32.85 KB → 32.95 KB (measured 32.85 KB): the owner decisions of 2026-11-17 (AU1/AU2 field error icon and tokens, AU4 pause messages, C-07 AvatarGroup messages in the shared catalogs) grew it past a budget with no headroom.
Budget-raise: article-highlight-section 11.7 KB → 11.8 KB (measured 11.71 KB): the owner decisions of 2026-11-17 (AU1/AU2 field error icon and tokens, AU4 pause messages, C-07 AvatarGroup messages in the shared catalogs) grew it past a budget with no headroom.
Budget-raise: template-gallery-section 28.35 KB → 28.45 KB (measured 28.37 KB): the owner decisions of 2026-11-17 (AU1/AU2 field error icon and tokens, AU4 pause messages, C-07 AvatarGroup messages in the shared catalogs) grew it past a budget with no headroom.
Budget-raise: architecture-tabs-section 22 KB → 22.1 KB (measured 22.00 KB): the owner decisions of 2026-11-17 (AU1/AU2 field error icon and tokens, AU4 pause messages, C-07 AvatarGroup messages in the shared catalogs) grew it past a budget with no headroom.
Budget-raise: locales-es 10.5 KB → 10.6 KB (measured 10.52 KB): the owner decisions of 2026-11-17 (AU1/AU2 field error icon and tokens, AU4 pause messages, C-07 AvatarGroup messages in the shared catalogs) grew it past a budget with no headroom.
Budget-raise: css-button 10.75 KB → 10.85 KB (measured 10.77 KB): the theme stylesheet gained the finite settle variants of the decorative loops (WCAG 2.2.2, owner decision on the round-2 audit).
Budget-raise: css-button 10.65 KB → 10.75 KB (measured 10.67 KB): the theme stylesheet every app loads gained --text-danger (AU2) and the four diverging chart steps (B05).
Budget-raise: network-section 26.55 KB → 26.65 KB (measured 26.57 KB): the network map packets and PoP pulse now settle within five seconds (WCAG 2.2.2), a finite run per ray.
Budget-raise: logo-wall-section 23.6 KB → 23.7 KB (measured 23.60 KB): the brand text wordmarks (A15) in the shared brand-mark registry.
Budget-raise: doc-page-header 30.6 KB → 30.7 KB (measured 30.62 KB): the shared overlay trigger host now attaches its own click and keydown listeners so a trigger never drops a click made in the mount tick (A13, ROADMAP M2.10 row 73), and the owner decisions of 2026-11-17 grew the shared catalogs.
Budget-raise: article-body-section 45 KB → 45.1 KB (measured 45.03 KB): the shared overlay trigger host now attaches its own click and keydown listeners so a trigger never drops a click made in the mount tick (A13, ROADMAP M2.10 row 73), and the owner decisions of 2026-11-17 grew the shared catalogs.
Budget-raise: competitor-comparison-section 24.65 KB → 24.75 KB (measured 24.70 KB): the shared overlay trigger host now attaches its own click and keydown listeners so a trigger never drops a click made in the mount tick (A13, ROADMAP M2.10 row 73), and the owner decisions of 2026-11-17 grew the shared catalogs.
Budget-raise: plan-comparison-section 37.15 KB → 37.25 KB (measured 37.17 KB): the shared overlay trigger host now attaches its own click and keydown listeners so a trigger never drops a click made in the mount tick (A13, ROADMAP M2.10 row 73), and the owner decisions of 2026-11-17 grew the shared catalogs.
Budget-raise: timestamp 19.1 KB → 19.25 KB (measured 19.17 KB): the shared overlay trigger host now attaches its own click and keydown listeners so a trigger never drops a click made in the mount tick (A13, ROADMAP M2.10 row 73), and the owner decisions of 2026-11-17 grew the shared catalogs.
Budget-raise: hotspot 12.9 KB → 13 KB (measured 12.94 KB): the shared overlay trigger host now attaches its own click and keydown listeners so a trigger never drops a click made in the mount tick (A13, ROADMAP M2.10 row 73), and the owner decisions of 2026-11-17 grew the shared catalogs.
Budget-raise: topology-diagram 27.85 KB → 27.95 KB (measured 27.87 KB): the shared overlay trigger host now attaches its own click and keydown listeners so a trigger never drops a click made in the mount tick (A13, ROADMAP M2.10 row 73), and the owner decisions of 2026-11-17 grew the shared catalogs.
Budget-raise: overflow-count 14.2 KB → 14.3 KB (measured 14.25 KB): the shared overlay trigger host now attaches its own click and keydown listeners so a trigger never drops a click made in the mount tick (A13, ROADMAP M2.10 row 73), and the owner decisions of 2026-11-17 grew the shared catalogs.
Budget-raise: table-cell-link 18.95 KB → 19.05 KB (measured 19.01 KB): the shared overlay trigger host now attaches its own click and keydown listeners so a trigger never drops a click made in the mount tick (A13, ROADMAP M2.10 row 73), and the owner decisions of 2026-11-17 grew the shared catalogs.
Budget-raise: table-cell-tags 15.25 KB → 15.35 KB (measured 15.31 KB): the shared overlay trigger host now attaches its own click and keydown listeners so a trigger never drops a click made in the mount tick (A13, ROADMAP M2.10 row 73), and the owner decisions of 2026-11-17 grew the shared catalogs.
Budget-raise: filter-menu 35.95 KB → 36.05 KB (measured 35.98 KB): the shared overlay trigger host now attaches its own click and keydown listeners so a trigger never drops a click made in the mount tick (A13, ROADMAP M2.10 row 73), and the owner decisions of 2026-11-17 grew the shared catalogs.
Budget-raise: filter-menu-root 32.2 KB → 32.3 KB (measured 32.24 KB): the shared overlay trigger host now attaches its own click and keydown listeners so a trigger never drops a click made in the mount tick (A13, ROADMAP M2.10 row 73), and the owner decisions of 2026-11-17 grew the shared catalogs.
Budget-raise: split-button 15.25 KB → 15.35 KB (measured 15.27 KB): the shared overlay trigger host now attaches its own click and keydown listeners so a trigger never drops a click made in the mount tick (A13, ROADMAP M2.10 row 73), and the owner decisions of 2026-11-17 grew the shared catalogs.
Budget-raise: breadcrumb 25.3 KB → 25.4 KB (measured 25.32 KB): the shared overlay trigger host now attaches its own click and keydown listeners so a trigger never drops a click made in the mount tick (A13, ROADMAP M2.10 row 73), and the owner decisions of 2026-11-17 grew the shared catalogs.
Budget-raise: breadcrumb-root 25.25 KB → 25.35 KB (measured 25.29 KB): the shared overlay trigger host now attaches its own click and keydown listeners so a trigger never drops a click made in the mount tick (A13, ROADMAP M2.10 row 73), and the owner decisions of 2026-11-17 grew the shared catalogs.
Budget-raise: console-application-scene 114.1 KB → 115.4 KB (measured 115.28 KB): 6.0 approved proposals merged in v6/prop (CodeBlock line diffs, Table live tail, DropdownMenu sub-menus).
Budget-raise: console-trace-scene 67 KB → 68.75 KB (measured 68.64 KB): 6.0 approved proposals merged in v6/prop (Trace minimap zoom, span events and slowest flag).
Budget-raise: article-body 43.05 KB → 44.3 KB (measured 44.16 KB): 6.0 approved proposals merged in v6/prop (CodeBlock line diffs).
Budget-raise: article-cards 5.6 KB → 5.85 KB (measured 5.72 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: article-highlight 11.45 KB → 11.65 KB (measured 11.51 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: hero-band 7.7 KB → 12 KB (measured 11.88 KB): 6.0 marketing near-copies folded in (v6/mkt, +1.01 KB) and 6.0 B11 (components follow the device locale, read on mount); the 7.7 KB budget was set from the entry chunk alone; this is the gate's measure (entry plus its static imports).
Budget-raise: console-panel 21.25 KB → 21.4 KB (measured 21.28 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: media-split-band 6.95 KB → 15.6 KB (measured 15.49 KB): 6.0 marketing near-copies folded in (v6/mkt, +0.75 KB); the 6.95 KB budget was set from the entry chunk alone; this is the gate's measure (entry plus its static imports).
Budget-raise: feature-scroll 8.65 KB → 17.35 KB (measured 17.21 KB): 6.0 marketing near-copies folded in (v6/mkt, +0.56 KB); the 8.65 KB budget was set from the entry chunk alone; this is the gate's measure (entry plus its static imports).
Budget-raise: network-section 26.25 KB → 26.5 KB (measured 26.38 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: feature-tabs 50.9 KB → 54 KB (measured 53.87 KB): 6.0 approved proposals merged in v6/prop (CodeBlock line diffs) and the v6/nav and v6/table merges.
Budget-raise: closing-call-to-action 6.15 KB → 9.1 KB (measured 8.99 KB): 6.0 marketing near-copies folded in (v6/mkt, +0.91 KB); the 6.15 KB budget was set from the entry chunk alone; this is the gate's measure (entry plus its static imports).
Budget-raise: chart-tooltip 2.6 KB → 2.85 KB (measured 2.75 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: chart-card 4.95 KB → 5.15 KB (measured 5.01 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: chart-card-drag-handle 1.9 KB → 2.15 KB (measured 2.03 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: chart-card-resize-handle 2.5 KB → 2.75 KB (measured 2.62 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: board 3.5 KB → 3.75 KB (measured 3.62 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: tracker 5.75 KB → 5.95 KB (measured 5.82 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: severity-tag 1.65 KB → 1.85 KB (measured 1.75 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: help-panel 3 KB → 3.15 KB (measured 3.01 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: file-dropzone 4.65 KB → 4.85 KB (measured 4.71 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: webkit-provider 10.6 KB → 10.9 KB (measured 10.79 KB): 6.0 approved proposals merged in v6/prop (locale strings of the new features) and 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: locales-pt-BR 9.75 KB → 10.05 KB (measured 9.92 KB): 6.0 approved proposals merged in v6/prop (strings of the new features).
Budget-raise: locales-es 10.05 KB → 10.2 KB (measured 10.06 KB): 6.0 approved proposals merged in v6/prop (strings of the new features).
Budget-raise: code-block 29.6 KB → 31.1 KB (measured 30.97 KB): 6.0 approved proposals merged in v6/prop (CodeBlock computes unified and split line diffs from an original).
Budget-raise: trace 18.45 KB → 20.65 KB (measured 20.55 KB): 6.0 approved proposals merged in v6/prop (Trace minimap zoom, span events and slowest flag).
Budget-raise: ai-loading 2.5 KB → 2.6 KB (measured 2.50 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: chat-message-actions 1.5 KB → 1.7 KB (measured 1.58 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: prompt-input 7 KB → 7.15 KB (measured 7.02 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: reasoning 4.5 KB → 4.65 KB (measured 4.51 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: streaming-response 33.1 KB → 34.85 KB (measured 34.73 KB): 6.0 approved proposals merged in v6/prop (CodeBlock line diffs).
Budget-raise: response-branches 4.0 KB → 4.15 KB (measured 4.05 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: code-editor 10.4 KB → 10.6 KB (measured 10.46 KB): 6.0 CodeEditor plain diff marks added and removed lines in its gutters (v6/fc), and 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: button-group 14.9 KB → 15.35 KB (measured 15.22 KB): 6.0 approved proposals merged in v6/prop (DropdownMenu sub-menus and checkbox and radio options).
Budget-raise: combobox 12.55 KB → 12.8 KB (measured 12.67 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: schema-form 56.75 KB → 60.45 KB (measured 60.33 KB): 6.0 approved proposals merged in v6/prop (MultiSelect chips, typed filter and create row; Textarea autogrow; Alert title).
Budget-raise: use-unsaved-changes 1.75 KB → 1.95 KB (measured 1.81 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: payment-brand 4.84 KB → 5 KB (measured 4.88 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: qr-code 4.39 KB → 4.55 KB (measured 4.41 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: otp-input 3.2 KB → 3.45 KB (measured 3.33 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: table-cell-actions 10.9 KB → 11.3 KB (measured 11.16 KB): 6.0 approved proposals merged in v6/prop (DropdownMenu sub-menus and checkbox and radio options).
Budget-raise: filter-menu 26.8 KB → 35.15 KB (measured 35.05 KB): 0.78 KB over the pre-6.0 34.27 KB from 6.0 B11 (components follow the device locale, read on mount) and FilterMenu.Chips reading the table's filter fields (v6/table); the 26.8 KB budget was set from the entry chunk alone; this is the gate's measure (entry plus its static imports).
Budget-raise: filter-menu-root 23.05 KB → 31.45 KB (measured 31.35 KB): 0.28 KB over the pre-6.0 31.07 KB from 6.0 B11 (components follow the device locale, read on mount) and v6/inputs; the 23.05 KB budget was set from the entry chunk alone; this is the gate's measure (entry plus its static imports).
Budget-raise: filter-menu-chips 21.35 KB → 21.45 KB (measured 21.35 KB): 6.0 one filter slot: FilterMenu.Chips reads the table's filter fields (v6/table), and 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: split-button 13.3 KB → 15.1 KB (measured 14.99 KB): 6.0 approved proposals merged in v6/prop (DropdownMenu sub-menus and checkbox and radio options).
Budget-raise: avatar 12 KB → 12.25 KB (measured 12.15 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: kbd 2.15 KB → 2.35 KB (measured 2.21 KB): 6.0 approved proposals merged in v6/prop (Kbd arrow and Return keys and a keys list).
Budget-raise: log-view-root 12.75 KB → 12.95 KB (measured 12.81 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: log-view-header 4.95 KB → 5.15 KB (measured 5.05 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: table 17.35 KB → 49.3 KB (measured 49.17 KB): the v6/table DataTable split shrank it 91.04 → 49.17 KB; the 17.35 KB budget was set from the entry chunk alone; this is the gate's measure (entry plus its static imports).
Budget-raise: table-search 3.3 KB → 3.4 KB (measured 3.30 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: table-filter 2.3 KB → 6.35 KB (measured 6.23 KB): the v6/table one-filter-slot change shrank it 19.8 → 6.23 KB; the 2.3 KB budget was set from the entry chunk alone; this is the gate's measure (entry plus its static imports).
Budget-raise: table-live-button 3.75 KB → 3.95 KB (measured 3.81 KB): new in v6/prop (Table live tail); grew with 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: status-indicator 2.1 KB → 2.25 KB (measured 2.12 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: toast 10.35 KB → 10.6 KB (measured 10.49 KB): 6.0 approved proposals merged in v6/prop (toast.progress follows a known percentage).
Budget-raise: toast-root 10.05 KB → 10.3 KB (measured 10.18 KB): 6.0 approved proposals merged in v6/prop (toast.progress follows a known percentage).
Budget-raise: number-input 3.15 KB → 3.3 KB (measured 3.16 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: multi-select-root 3.3 KB → 3.5 KB (measured 3.39 KB): 6.0 approved proposals merged in v6/prop (MultiSelect chips, typed filter, create row and list states).
Budget-raise: multi-select-content 20.45 KB → 20.6 KB (measured 20.47 KB): 6.0 approved proposals merged in v6/prop (MultiSelect chips, typed filter, create row and list states).
Budget-raise: global-header-root 1.45 KB → 1.6 KB (measured 1.49 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: carousel-previous 1.65 KB → 1.8 KB (measured 1.66 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: carousel-next 1.65 KB → 1.8 KB (measured 1.66 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: breadcrumb 24.35 KB → 25.15 KB (measured 25.04 KB): 6.0 approved proposals merged in v6/prop (DropdownMenu sub-menus and checkbox and radio options in the overflow menu).
Budget-raise: breadcrumb-root 24.25 KB → 25.1 KB (measured 24.99 KB): 6.0 approved proposals merged in v6/prop (DropdownMenu sub-menus and checkbox and radio options in the overflow menu).
Budget-raise: command 25.2 KB → 26.65 KB (measured 26.51 KB): 6.0 approved proposals merged in v6/prop (Command ranked fuzzy search, keywords, highlight and nested pages) and 6.0 B13/B14 (Dialog renders its overlay and close button).
Budget-raise: command-root 20.35 KB → 20.9 KB (measured 20.77 KB): 6.0 approved proposals merged in v6/prop (Command ranked fuzzy search) and 6.0 B13/B14 (Dialog renders its overlay and close button).
Budget-raise: command-input 4.6 KB → 4.85 KB (measured 4.72 KB): 6.0 approved proposals merged in v6/prop (Command nested pages and Kbd keys).
Budget-raise: command-item 4.6 KB → 4.8 KB (measured 4.66 KB): 6.0 approved proposals merged in v6/prop (Command keywords and match highlight).
Budget-raise: command-empty 1.45 KB → 1.6 KB (measured 1.48 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: dialog 22.35 KB → 22.55 KB (measured 22.43 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: dialog-content 17.65 KB → 17.8 KB (measured 17.66 KB): 6.0 B13/B14: DialogContent renders the portal, overlay and close button by default (absorbed DialogPortal and DialogOverlay).
Budget-raise: drawer 22.45 KB → 22.7 KB (measured 22.59 KB): 6.0 B11 (components follow the device locale, read on mount).
Budget-raise: drawer-content 17.75 KB → 17.9 KB (measured 17.80 KB): 6.0 B13/B14: DrawerContent renders the portal, overlay and close button by default (absorbed DrawerPortal and DrawerOverlay).
Budget-raise: popover 10.35 KB → 10.6 KB (measured 10.47 KB): 6.0 B11 (components follow the device locale, read on mount).

## Lowered (shrank, measured + ~0.1 KB)

- console-layout-breadcrumbs: 1 KB → 0.55 KB (measured 0.42 KB)
- date-range-picker: 35.05 KB → 34.45 KB (measured 34.34 KB)
- card-list: 19 KB → 8.25 KB (measured 8.15 KB)
- use-color-mode: 1.5 KB → 0.95 KB (measured 0.83 KB)
- frame-box: 2.5 KB → 1.35 KB (measured 1.21 KB)
- section-gap: 3.75 KB → 3 KB (measured 2.86 KB)
- section-title: 3.5 KB → 2.65 KB (measured 2.51 KB)
- hero-title: 2.5 KB → 1.65 KB (measured 1.55 KB)
- doc-callout: 6.7 KB → 6.3 KB (measured 6.19 KB)
- doc-card: 2 KB → 1.4 KB (measured 1.27 KB)
- doc-card-group: 3 KB → 1.6 KB (measured 1.49 KB)
- doc-item: 13.5 KB → 12.7 KB (measured 12.59 KB)
- doc-steps: 4 KB → 0.85 KB (measured 0.71 KB)
- doc-step: 3 KB → 1.1 KB (measured 0.98 KB)
- doc-frame: 6.5 KB → 5.75 KB (measured 5.62 KB)
- doc-accordion-group: 14.2 KB → 4 KB (measured 3.88 KB)
- doc-accordion-item: 1 KB → 0.5 KB (measured 0.40 KB)
- doc-heading: 1.5 KB → 1.1 KB (measured 0.96 KB)
- doc-tab: 1 KB → 0.5 KB (measured 0.36 KB)
- resizable-panel-root: 3 KB → 0.8 KB (measured 0.67 KB)
- band-stack: 2.5 KB → 1.95 KB (measured 1.83 KB)
- media-split: 5.75 KB → 5.2 KB (measured 5.08 KB)
- banner-art: 11.1 KB → 10.65 KB (measured 10.51 KB)
- section-module: 4.25 KB → 2.9 KB (measured 2.80 KB)
- section-container: 1.5 KB → 0.7 KB (measured 0.59 KB)
- embed: 3 KB → 0.65 KB (measured 0.52 KB)
- faq: 15 KB → 4.7 KB (measured 4.60 KB)
- media-tile: 2.75 KB → 2.2 KB (measured 2.08 KB)
- illustration: 2.5 KB → 1.25 KB (measured 1.14 KB)
- call-to-action: 4.5 KB → 3.65 KB (measured 3.52 KB)
- network-map: 7.5 KB → 7.1 KB (measured 6.97 KB)
- spinning-globe: 7.5 KB → 6.65 KB (measured 6.51 KB)
- brand-globe-scene: 16 KB → 14.85 KB (measured 14.72 KB)
- story-library: 33.55 KB → 32.9 KB (measured 32.78 KB)
- hero-form: 46 KB → 45.5 KB (measured 45.40 KB)
- site-nav: 57.3 KB → 56.65 KB (measured 56.53 KB)
- comparison-table: 24.75 KB → 24.3 KB (measured 24.19 KB)
- compare-plans: 37.4 KB → 36.5 KB (measured 36.37 KB)
- pricing-plans: 22.3 KB → 21.4 KB (measured 21.30 KB)
- feature-tiles: 8 KB → 5.9 KB (measured 5.78 KB)
- feature-widgets: 22 KB → 17.95 KB (measured 17.83 KB)
- stats-band: 5 KB → 4.5 KB (measured 4.38 KB)
- client-quotes: 27 KB → 26.25 KB (measured 26.15 KB)
- compliance-badges: 9 KB → 7.9 KB (measured 7.80 KB)
- investor-marks: 5 KB → 4.5 KB (measured 4.36 KB)
- job-posting: 52.1 KB → 51.2 KB (measured 51.06 KB)
- listing-browser: 75.85 KB → 39.7 KB (measured 39.56 KB)
- platform-directory: 5 KB → 4.5 KB (measured 4.40 KB)
- cli-terminal: 46.6 KB → 45.7 KB (measured 45.58 KB)
- faq-section: 18 KB → 7.2 KB (measured 7.08 KB)
- listing-table: 63.35 KB → 24.75 KB (measured 24.65 KB)
- site-footer: 37.05 KB → 36.35 KB (measured 36.23 KB)
- closing-call-to-action-newsletter: 15 KB → 12.8 KB (measured 12.68 KB)
- chart-line: 2.75 KB → 2.25 KB (measured 2.13 KB)
- chart-area: 3 KB → 2.5 KB (measured 2.36 KB)
- chart-brush: 1.5 KB → 1.1 KB (measured 0.96 KB)
- spark-chart: 5 KB → 4.55 KB (measured 4.42 KB)
- feature-list: 1.5 KB → 1 KB (measured 0.87 KB)
- phone-input: 29.35 KB → 28.8 KB (measured 28.69 KB)
- outcome-mark: 3 KB → 2.35 KB (measured 2.22 KB)
- topology-diagram: 34.75 KB → 26.85 KB (measured 26.72 KB)
- chat-message: 25.15 KB → 24.75 KB (measured 24.65 KB)
- table-cell-status: 3 KB → 1.55 KB (measured 1.41 KB)
- brand: 8.7 KB → 8.1 KB (measured 7.96 KB)
- item: 13.95 KB → 12.45 KB (measured 12.31 KB)
- item-root: 12.85 KB → 11.45 KB (measured 11.31 KB)
- alert: 6.5 KB → 5.75 KB (measured 5.64 KB)
- theme-switcher: 18.55 KB → 17.75 KB (measured 17.65 KB)
- scroll-area: 13.35 KB → 12.25 KB (measured 12.12 KB)
- sidebar: 26.6 KB → 24.55 KB (measured 24.42 KB)
- sidebar-header: 11.5 KB → 10.6 KB (measured 10.46 KB)
- sidebar-footer: 11.55 KB → 10.6 KB (measured 10.50 KB)
- breadcrumb-item: 13.15 KB → 11.6 KB (measured 11.46 KB)
- sidebar-menu: 23.4 KB → 21.5 KB (measured 21.40 KB)
- sidebar-menu-root: 22.95 KB → 21.1 KB (measured 20.96 KB)
- sidebar-menu-group: 13.3 KB → 11.85 KB (measured 11.73 KB)
- sidebar-menu-sub: 12.15 KB → 11.15 KB (measured 11.05 KB)
- sidebar-menu-sub-trigger: 16.6 KB → 15.75 KB (measured 15.61 KB)
- sidebar-menu-sub-content: 14.15 KB → 12.6 KB (measured 12.50 KB)
- sidebar-menu-back: 13.15 KB → 12.2 KB (measured 12.10 KB)
- sidebar-menu-item: 13.75 KB → 12.7 KB (measured 12.57 KB)
- tabs: 18 KB → 16.55 KB (measured 16.42 KB)
- tabs-root: 13.15 KB → 12.3 KB (measured 12.19 KB)
- navigation-menu: 28.5 KB → 25.65 KB (measured 25.53 KB)
- navigation-menu-root: 17.55 KB → 15.55 KB (measured 15.43 KB)
- dialog-description: 11.55 KB → 10.6 KB (measured 10.49 KB)
- dialog-title: 11.5 KB → 10.55 KB (measured 10.44 KB)
- drawer-description: 11.55 KB → 10.6 KB (measured 10.49 KB)
- drawer-title: 11.5 KB → 10.55 KB (measured 10.44 KB)
- panel-root: 11.75 KB → 10.8 KB (measured 10.69 KB)
- panel-content: 15.2 KB → 13.9 KB (measured 13.77 KB)
- panel-footer: 11.65 KB → 10.65 KB (measured 10.55 KB)
- panel-header: 11.6 KB → 10.8 KB (measured 10.70 KB)
  Budget-raise: card 13.75 → 13.85 KB — naming standard (slot/prop renames lengthen strings; no new logic)
  Budget-raise: site-nav 56.65 → 56.75 KB — naming standard (longer prop names; no new logic)
  Budget-raise: wizard 7.6 → 7.7 KB — naming standard (status vocabulary; no new logic)
  Budget-raise: log-view 42.05 → 42.15 KB — naming standard (status vocabulary; no new logic)
  Budget-raise: navigation-menu 25.65 → 25.9 KB — naming standard: Viewport now builds the overlay chain (Portal/Positioner/Popup/Arrow) itself so the compound keeps only shadcn part words
  Budget-raise: site-nav 56.75 → 57.05 KB — follows navigation-menu's Viewport wrapper
  Budget-raise: site-layout → 76.55 KB, site-page → 8.15 KB, recognition-marquee → 21.1 KB, multi-select → 29.5 KB — naming standard: category folder moves reordered imports and renamed parts; no new logic

## Roadmap 1 (2026-11-16)

One line per raised entry since cd72fb4c8 (the lanes' raises and the integration fixes); paste them into the PR body.

Budget-raise: console-layout-root 72.8 KB → 73 KB (measured 72.88 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: site-layout 76.55 KB → 76.8 KB (measured 76.72 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: doc-layout 68.3 KB → 68.55 KB (measured 68.52 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus; and Roadmap 1 docs: the page outline registry (use-heading-navigation).
Budget-raise: doc-markdown 24.7 KB → 25.9 KB (measured 25.76 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus; and Roadmap 1 docs: the page outline registry (use-heading-navigation).
Budget-raise: browser-frame 14.05 KB → 14.3 KB (measured 14.17 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: search-trigger 9.35 KB → 9.65 KB (measured 9.51 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: copy-prompt-button 8.6 KB → 8.9 KB (measured 8.79 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: doc-agent-card 13.9 KB → 14.05 KB (measured 13.95 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: property-filter 31.95 KB → 32.2 KB (measured 32.08 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: chip 7.45 KB → 7.75 KB (measured 7.65 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: doc-code-group 31.55 KB → 31.85 KB (measured 31.73 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: doc-heading 1.1 KB → 1.2 KB (measured 1.19 KB): Roadmap 1 docs: headings register in the page outline (use-heading-navigation).
Budget-raise: doc-prompt 11.75 KB → 12.1 KB (measured 11.96 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: doc-page-header 30.35 KB → 30.5 KB (measured 30.40 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: console-application-scene 115.4 KB → 115.7 KB (measured 115.57 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: console-trace-scene 68.75 KB → 69.05 KB (measured 68.94 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: article-body 44.3 KB → 44.6 KB (measured 44.47 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: story-index 32.9 KB → 33.3 KB (measured 33.20 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: copy-command 10.55 KB → 10.85 KB (measured 10.74 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: hero-form-section 45.5 KB → 45.85 KB (measured 45.72 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: competitor-comparison 24.3 KB → 24.55 KB (measured 24.43 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: plan-comparison 36.5 KB → 36.8 KB (measured 36.73 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: job-posting 51.2 KB → 51.4 KB (measured 51.32 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: site-footer 36.35 KB → 36.7 KB (measured 36.59 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: chart 23.75 KB → 24.05 KB (measured 23.94 KB): Roadmap 1 chart: span-aware date labels pick day or hour ticks from the range.
Budget-raise: chart-root 15.5 KB → 15.7 KB (measured 15.61 KB): Roadmap 1 chart: span-aware date labels pick day or hour ticks from the range.
Budget-raise: timestamp 18.6 KB → 18.95 KB (measured 18.85 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: hotspot 12.65 KB → 12.9 KB (measured 12.78 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: tree 8.4 KB → 10.1 KB (measured 10.00 KB): Roadmap 1 Tree windowing: only the rows in view render, so a 10,000-node tree stays fast.
Budget-raise: field 8.65 KB → 8.8 KB (measured 8.69 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: field-label 6.95 KB → 7.25 KB (measured 7.14 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: section-header 9.85 KB → 10.2 KB (measured 10.09 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: settings-section 7.7 KB → 7.95 KB (measured 7.82 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: phone-input 28.8 KB → 29.1 KB (measured 29.00 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: multi-select 29.5 KB → 29.85 KB (measured 29.75 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: code-block 31.1 KB → 31.4 KB (measured 31.27 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: log-viewer-content 28.05 KB → 28.2 KB (measured 28.10 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: trace 20.65 KB → 20.85 KB (measured 20.74 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: topology-diagram 26.85 KB → 27.25 KB (measured 27.11 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: tool-approval 11.45 KB → 11.65 KB (measured 11.54 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: artifact-canvas 10.95 KB → 11.3 KB (measured 11.20 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: artifact-preview 10.75 KB → 11.1 KB (measured 11.00 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: chat-message 24.75 KB → 25.1 KB (measured 25.00 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: chat-message-feedback 8.75 KB → 9 KB (measured 8.88 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: citation 6.5 KB → 6.8 KB (measured 6.69 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: streaming-response 34.85 KB → 35.1 KB (measured 34.99 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: button-group 15.35 KB → 15.5 KB (measured 15.39 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: combobox 12.8 KB → 13.05 KB (measured 12.94 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: schema-form 60.45 KB → 60.8 KB (measured 60.72 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: overflow-count 13.95 KB → 14.2 KB (measured 14.09 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: table-cell-id 9.55 KB → 9.85 KB (measured 9.72 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: table-cell-tags 15.05 KB → 15.25 KB (measured 15.13 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: table-cell-actions 11.3 KB → 11.5 KB (measured 11.39 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: filter-menu 35.15 KB → 35.9 KB (measured 35.79 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: filter-menu-root 31.45 KB → 32.2 KB (measured 32.06 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: filter-menu-chip-group 21.45 KB → 21.75 KB (measured 21.63 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: copy-button 9.15 KB → 9.5 KB (measured 9.38 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: split-button 15.1 KB → 15.25 KB (measured 15.14 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: log-viewer 42.15 KB → 42.35 KB (measured 42.25 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: log-viewer-steps 40 KB → 40.25 KB (measured 40.13 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: table-export-button 8.3 KB → 8.55 KB (measured 8.43 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: table-refresh-button 8.3 KB → 8.55 KB (measured 8.41 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: toast 10.6 KB → 11.1 KB (measured 11.00 KB): Roadmap 1 toast: start and end positions follow the reading direction (useDirection, RTL corners).
Budget-raise: toast-root 10.3 KB → 10.85 KB (measured 10.71 KB): Roadmap 1 toast: start and end positions follow the reading direction (useDirection, RTL corners).
Budget-raise: hint 5.8 KB → 6 KB (measured 5.88 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: theme-switcher 17.75 KB → 17.95 KB (measured 17.84 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: context-menu-root 6.8 KB → 7 KB (measured 6.86 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: dropdown-menu 11.15 KB → 11.3 KB (measured 11.17 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: dropdown-menu-root 6.55 KB → 6.85 KB (measured 6.74 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: dropdown-menu-sub-content 4.8 KB → 4.95 KB (measured 4.83 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: multi-select-trigger 9.65 KB → 10.05 KB (measured 9.92 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: multi-select-content 20.6 KB → 20.95 KB (measured 20.86 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: select-content 18.7 KB → 18.95 KB (measured 18.81 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: console-layout 74.1 KB → 74.3 KB (measured 74.20 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: sidebar 24.55 KB → 24.7 KB (measured 24.56 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: sidebar-root 24.35 KB → 24.5 KB (measured 24.36 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: tooltip 5.3 KB → 5.65 KB (measured 5.51 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: hover-card 5.35 KB → 5.6 KB (measured 5.50 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: hover-card-root 4.1 KB → 4.35 KB (measured 4.25 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: popover 10.6 KB → 10.8 KB (measured 10.69 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: popover-root 4.95 KB → 5.15 KB (measured 5.04 KB): Roadmap 1 overlays: usePlacement resolves side (start/end), align and sideOffset against the text direction, reached through Tooltip, Popover, HoverCard or the menus.
Budget-raise: css-button 10.5 KB → 10.65 KB (measured 10.51 KB, gzipped CSS of a Button-only app): Roadmap 1 fixes: the theme ships its fonts, so fonts.css declares @font-face rules with unicode-range for the local woff2 files instead of pointing at a font host.
Budget-raise: site-page 8.15 → 8.55 KB (measured 8.41): old page-JSON section ids keep resolving after the 37 -section renames.
Budget-raise: date-picker-root 17.6 → 17.75 KB (measured 17.61 KB): the Button label renders in a span that clips with an ellipsis and its wrapper takes min-w-0 max-w-full, so a Button shrinks inside a narrow container at 200% text size (fix-ci lane); merging the anchor and button roots into one element saved only 0.03 KB.
Budget-raise: date-picker 17.8 → 17.95 KB (measured 17.82 KB): the Button label renders in a span that clips with an ellipsis and its wrapper takes min-w-0 max-w-full, so a Button shrinks inside a narrow container at 200% text size (fix-ci lane); merging the anchor and button roots into one element saved only 0.03 KB.
Budget-raise: date-range-picker 34.45 → 34.6 KB (measured 34.47 KB): the Button label renders in a span that clips with an ellipsis and its wrapper takes min-w-0 max-w-full, so a Button shrinks inside a narrow container at 200% text size (fix-ci lane); merging the anchor and button roots into one element saved only 0.03 KB.
Budget-raise: data-table 56.25 → 56.4 KB (measured 56.28 KB): the Button label renders in a span that clips with an ellipsis and its wrapper takes min-w-0 max-w-full, so a Button shrinks inside a narrow container at 200% text size (fix-ci lane); merging the anchor and button roots into one element saved only 0.03 KB.
Budget-raise: confirm-dialog 25.05 → 25.2 KB (measured 25.07 KB): the Button label renders in a span that clips with an ellipsis and its wrapper takes min-w-0 max-w-full, so a Button shrinks inside a narrow container at 200% text size (fix-ci lane); merging the anchor and button roots into one element saved only 0.03 KB.
Budget-raise: site-header-section 57.05 → 57.2 KB (measured 57.07 KB): the Button label renders in a span that clips with an ellipsis and its wrapper takes min-w-0 max-w-full, so a Button shrinks inside a narrow container at 200% text size (fix-ci lane); merging the anchor and button roots into one element saved only 0.03 KB.
Budget-raise: pricing-plans-section 21.4 → 21.55 KB (measured 21.41 KB): the Button label renders in a span that clips with an ellipsis and its wrapper takes min-w-0 max-w-full, so a Button shrinks inside a narrow container at 200% text size (fix-ci lane); merging the anchor and button roots into one element saved only 0.03 KB.
Budget-raise: client-quotes-section 26.25 → 26.4 KB (measured 26.26 KB): the Button label renders in a span that clips with an ellipsis and its wrapper takes min-w-0 max-w-full, so a Button shrinks inside a narrow container at 200% text size (fix-ci lane); merging the anchor and button roots into one element saved only 0.03 KB.
Budget-raise: listing-index-section 39.7 → 39.85 KB (measured 39.73 KB): the Button label renders in a span that clips with an ellipsis and its wrapper takes min-w-0 max-w-full, so a Button shrinks inside a narrow container at 200% text size (fix-ci lane); merging the anchor and button roots into one element saved only 0.03 KB.
Budget-raise: architecture-tabs-section 21.6 → 21.75 KB (measured 21.62 KB): the Button label renders in a span that clips with an ellipsis and its wrapper takes min-w-0 max-w-full, so a Button shrinks inside a narrow container at 200% text size (fix-ci lane); merging the anchor and button roots into one element saved only 0.03 KB.
Budget-raise: plan-comparison-section 36.8 → 37.15 KB (measured 37.04 KB): each feature category opens in its own tbody with a start-aligned head (+0.24 KB), plus the Button label span.
Budget-raise: site-page 8.55 → 9.95 KB (measured 9.83 KB): SitePage translates old section props and values from the 6.0 rename map (+0.88 KB) and routes media bands with no picture to feature-scroll or console-showcase, drawing scenes through the static scene registry (+0.54 KB). Every section stays a lazy chunk; the growth is the translation tables in site-page-sections.ts, which run synchronously before a section resolves.
Budget-raise: browser-frame 14.3 KB → 14.45 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: copy-prompt-button 8.9 KB → 9.05 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: doc-agent-card 14.05 KB → 14.3 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: doc-prose 3.5 KB → 3.65 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: doc-code-group 31.85 KB → 32 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: doc-prompt 12.1 KB → 12.3 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: console-trace-scene 69.05 KB → 69.25 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: article-body-section 44.6 KB → 44.7 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: copy-command-section 10.85 KB → 11.05 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: timestamp 18.95 KB → 19.1 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: section-header 10.2 KB → 10.4 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: code-block 31.4 KB → 31.55 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: log-viewer-content 28.2 KB → 28.4 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: trace 20.85 KB → 21.1 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: topology-diagram 27.25 KB → 27.35 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: artifact-canvas 11.3 KB → 11.5 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: artifact-preview 11.1 KB → 11.3 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: streaming-response 35.1 KB → 35.25 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: table-cell-link 18.7 KB → 18.95 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: table-cell-id 9.85 KB → 10 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: copy-button 9.5 KB → 9.65 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: log-viewer 42.35 KB → 42.55 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).
Budget-raise: log-viewer-steps 40.25 KB → 40.45 KB (+0.1 to +0.25 KB): copying falls back to a hidden selected field when the clipboard API is missing or refuses (a page served over plain http), so CopyButton and every copy control copy instead of opening the manual-copy popover (utils/clipboard, 2026-11-16).

Budget-raise: site-layout 76.8 KB → 76.95 KB (measured 76.91 KB): the site footer is a one-row bar that spans like the header, and the brand is the home link through AppHeader.Brand (moved from review/impeccable, 2026-11-17).
Budget-raise: doc-layout 68.55 KB → 68.9 KB (measured 68.85 KB): the DocLayout search sits at the header end, the brand is the home link with its product label, and pages close with the console footer bar (moved from review/impeccable, 2026-11-17).
Budget-raise: diagram 11.25 KB → 11.3 KB (measured 11.26 KB): framed parts share one hairline where they meet (never double a line: SectionModule data-frame-edges), with the footer, header and DocProse changes it imports (moved from review/impeccable, 2026-11-17).
Budget-raise: data-grid 10.25 KB → 10.5 KB (measured 10.49 KB): DataGrid pastes a cell block or fills a range, typed and clipped, and copies through the native copy event (moved from review/impeccable, 2026-11-17).
Budget-raise: collection-preferences 31.6 KB → 31.65 KB (measured 31.60 KB): framed parts share one hairline where they meet (never double a line: SectionModule data-frame-edges), with the footer, header and DocProse changes it imports (moved from review/impeccable, 2026-11-17).
Budget-raise: doc-prose 3.65 KB → 3.75 KB (measured 3.70 KB): DocProse styles tables, scrolls wide ones sideways, and keeps a code chip inside a link a link (moved from review/impeccable, 2026-11-17).
Budget-raise: media-tabs 8.65 KB → 8.7 KB (measured 8.66 KB): framed parts share one hairline where they meet (never double a line: SectionModule data-frame-edges), with the footer, header and DocProse changes it imports (moved from review/impeccable, 2026-11-17).
Budget-raise: article-body-section 44.7 KB → 44.85 KB (measured 44.84 KB): framed parts share one hairline where they meet (never double a line: SectionModule data-frame-edges), with the footer, header and DocProse changes it imports (moved from review/impeccable, 2026-11-17).
Budget-raise: article-cards-section 5.85 KB → 5.9 KB (measured 5.87 KB): framed parts share one hairline where they meet (never double a line: SectionModule data-frame-edges), with the footer, header and DocProse changes it imports (moved from review/impeccable, 2026-11-17).
Budget-raise: article-highlight-section 11.65 KB → 11.7 KB (measured 11.68 KB): framed parts share one hairline where they meet (never double a line: SectionModule data-frame-edges), with the footer, header and DocProse changes it imports (moved from review/impeccable, 2026-11-17).
Budget-raise: story-index-section 33.3 KB → 33.35 KB (measured 33.31 KB): framed parts share one hairline where they meet (never double a line: SectionModule data-frame-edges), with the footer, header and DocProse changes it imports (moved from review/impeccable, 2026-11-17).
Budget-raise: capability-grid-section 7.2 KB → 7.3 KB (measured 7.25 KB): framed parts share one hairline where they meet (never double a line: SectionModule data-frame-edges), with the footer, header and DocProse changes it imports (moved from review/impeccable, 2026-11-17).
Budget-raise: console-showcase-section 21.4 KB → 21.45 KB (measured 21.41 KB): framed parts share one hairline where they meet (never double a line: SectionModule data-frame-edges), with the footer, header and DocProse changes it imports (moved from review/impeccable, 2026-11-17).
Budget-raise: site-header-section 57.2 KB → 57.45 KB (measured 57.42 KB): framed parts share one hairline where they meet (never double a line: SectionModule data-frame-edges), with the footer, header and DocProse changes it imports (moved from review/impeccable, 2026-11-17).
Budget-raise: network-section 26.5 KB → 26.55 KB (measured 26.50 KB): framed parts share one hairline where they meet (never double a line: SectionModule data-frame-edges), with the footer, header and DocProse changes it imports (moved from review/impeccable, 2026-11-17).
Budget-raise: job-posting-section 51.4 KB → 51.5 KB (measured 51.47 KB): framed parts share one hairline where they meet (never double a line: SectionModule data-frame-edges), with the footer, header and DocProse changes it imports (moved from review/impeccable, 2026-11-17).
Budget-raise: settings-section 7.95 KB → 8.05 KB (measured 8.01 KB): copy goes through the shared utils/clipboard helper, which also works on plain http pages (moved from review/impeccable, 2026-11-17).
Budget-raise: locales-pt-BR 10.05 KB → 10.35 KB (measured 10.33 KB): new strings for CopyText, SkipLink, PromptInput (attach, dictate, model, tools), DataGrid paste and the topology confirm (moved from review/impeccable, 2026-11-17).
Budget-raise: locales-es 10.2 KB → 10.5 KB (measured 10.47 KB): new strings for CopyText, SkipLink, PromptInput (attach, dictate, model, tools), DataGrid paste and the topology confirm (moved from review/impeccable, 2026-11-17).
Budget-raise: topology-diagram 27.35 KB → 27.8 KB (measured 27.75 KB): a binding applies only after Apply, with Cancel to drop it (confirm step), and the node header band is separated from its name row (moved from review/impeccable, 2026-11-17).
Budget-raise: app-header 1.85 KB → 2.4 KB (measured 2.38 KB): AppHeader.Brand is the home link (href, aria-label) and draws the product label beside the mark (moved from review/impeccable, 2026-11-17).
Budget-raise: console-layout-root 73 KB → 73.3 KB (measured 73.29 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: site-layout 76.95 KB → 77.05 KB (measured 77.01 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: doc-layout 68.9 KB → 69.05 KB (measured 69.04 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: diagram 11.3 KB → 11.55 KB (measured 11.50 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: doc-page-header 30.5 KB → 30.6 KB (measured 30.56 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: media-tabs 8.7 KB → 8.75 KB (measured 8.72 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: console-trace-scene 69.25 KB → 69.35 KB (measured 69.31 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: article-body-section 44.85 KB → 45 KB (measured 44.96 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: article-index-section 34.85 KB → 34.9 KB (measured 34.86 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: console-showcase-section 21.45 KB → 21.6 KB (measured 21.58 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: site-header-section 57.45 KB → 57.5 KB (measured 57.48 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: competitor-comparison-section 24.55 KB → 24.65 KB (measured 24.63 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: client-mosaic-section 7.1 KB → 7.2 KB (measured 7.16 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: recognition-marquee-section 21.1 KB → 21.15 KB (measured 21.11 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: architecture-tabs-section 21.75 KB → 22 KB (measured 21.99 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: topology-diagram 27.8 KB → 27.85 KB (measured 27.80 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: filter-menu 35.9 KB → 35.95 KB (measured 35.92 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: log-viewer 42.55 KB → 42.6 KB (measured 42.58 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: log-viewer-steps 40.45 KB → 40.5 KB (measured 40.45 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: console-layout 74.3 KB → 74.65 KB (measured 74.60 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: breadcrumb 25.15 KB → 25.3 KB (measured 25.26 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: breadcrumb-root 25.15 KB → 25.25 KB (measured 25.21 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: command 26.65 KB → 26.8 KB (measured 26.75 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: command-root 20.9 KB → 21.05 KB (measured 21.00 KB): the review/impeccable fixes and the ai-branch work each grew this entry on their own; merging the two adds both (2026-11-17).
Budget-raise: doc-code-group 32 KB → 32.85 KB (measured 32.83 KB): it renders a code-block, which gained JSON, SQL and Python highlighting merged from main (#1189) (2026-11-17).
Budget-raise: console-application-scene 115.7 KB → 115.8 KB (measured 115.76 KB): it draws a code-block, which gained JSON, SQL and Python highlighting from main (#1189) (2026-11-17).
Budget-raise: code-block 31.55 KB → 32.4 KB (measured 32.37 KB): JSON, SQL and Python highlighting merged from main (#1189), plus the copy-button backing so long lines do not show around it (#1187) (2026-11-17).
Budget-raise: streaming-response 35.25 KB → 36.15 KB (measured 36.10 KB): it renders a code-block, which gained JSON, SQL and Python highlighting merged from main (#1189) (2026-11-17).
Budget-raise: doc-frame 5.75 KB → 8.2 KB (measured 8.16 KB): an autoplaying clip now carries a pause control (an `IconButton`) and starts itself after mount so it can stay paused under a reduced-motion preference — WCAG 2.2.2, owner decision AU4 (2026-11-17).
Budget-raise: locales-pt-BR 10.35 KB → 10.4 KB (measured 10.37 KB): AvatarGroup (C-07) adds its two plural messages to the catalog, which had 15 bytes of headroom.
Budget-raise: console-layout-root 73.3 KB → 73.4 KB (measured 73.35 KB): the compact header keeps a page trail's control crumbs (the environment switch) in place of the brand, owner decision AU5 (2026-11-17).
Budget-raise: console-layout 74.65 KB → 74.75 KB (measured 74.67 KB): the same compact control crumbs, owner decision AU5 (2026-11-17).
Budget-raise: popover 10.8 KB → 10.85 KB (measured 10.82 KB): the shared overlay trigger host attaches its click and keydown listeners natively, so a click fired in the millisecond the trigger mounted is no longer dropped by Vue's listener timestamp guard (M2.10 row 73) (2026-11-17).
Budget-raise: doc-frame 8.2 KB → 8.3 KB (measured 8.26 KB): the autoplay pause control names its clip ("Pause animation: {alt}") so several frames on a page have distinct names (2026-11-17).
Budget-raise: locales-pt-BR 10.4 KB → 10.45 KB (measured 10.42 KB): the catalog adds DocFrame's two named pause and play messages (2026-11-17).
Budget-raise: locales-es 10.5 KB → 10.55 KB (measured 10.54 KB): the same two DocFrame messages (2026-11-17).
Budget-raise: trace 21.1 KB → 21.9 KB (measured 21.84 KB): the trace draws its critical path under the bars and shows self time and time on the path in the details (`highlightCriticalPath`, best-in-class tracing parity); the entry measured 21.13 KB before the change (2026-11-17).
Budget-raise: console-trace-scene 69.35 KB → 70.1 KB (measured 70.09 KB): the scene renders a trace, which gained the critical path and self time (2026-11-17).
Budget-raise: trace 21.9 KB → 36.3 KB (measured 36.21 KB): the toolbar holds a `ToggleGroup` that switches the Waterfall, Timeline and Tree views, and the timeline keeps hidden bars out of the keyboard order and labels only bars wide enough (owner request, 2026-11-17). Most of the growth is `tailwind-merge`, which `ToggleGroup` brings through `cn`; 51 components already import `cn` (ConsoleLayout and LogViewer among them), so in an app the shared chunk is already loaded and the trace adds about the toggle group's own code.
Budget-raise: console-trace-scene 70.1 KB → 73.9 KB (measured 73.82 KB): the scene renders a trace, which gained the view switch (2026-11-17).
Budget-raise: config-provider 11.25 KB → 11.35 KB (measured 11.31 KB): the English catalog it carries gained the trace's view, critical path and self time messages (2026-11-17).
Budget-raise: locales-pt-BR 10.45 KB → 10.5 KB (measured 10.49 KB): the same trace messages (2026-11-17).
Budget-raise: locales-es 10.6 KB → 10.65 KB (measured 10.62 KB): the same trace messages (2026-11-17).
Budget-raise: date-picker-root 17.75 KB → 17.9 KB (measured 17.84 KB): the trigger wraps a long value instead of cutting it off, and on a phone the panel opens as a full-width bottom sheet over a backdrop (owner request, 2026-11-18).
Budget-raise: date-range-picker 34.6 KB → 37.55 KB (measured 37.48 KB): the time range picker gains the Console parity features the owner asked for: Today and This week (ranges rounded to the start of the day or week in the zone), End at now (`since` ranges), auto refresh (`Switch`, interval, `refresh` event), the always-visible custom duration, the two-column quick ranges and the phone sheet (2026-11-18).
Budget-raise: config-provider 11.35 KB → 11.5 KB (measured 11.44 KB): the English catalog it carries gained the time range picker’s Today, This week, End at now and auto-refresh messages (2026-11-18).
Budget-raise: locales-pt-BR 10.5 KB → 10.7 KB (measured 10.62 KB): the same time range picker messages (2026-11-18).
Budget-raise: locales-es 10.65 KB → 10.8 KB (measured 10.74 KB): the same time range picker messages (2026-11-18).
Budget-raise: use-time-range 0.9 KB → 1.4 KB (measured 1.37 KB): `useTimeRange` rounds Today and This week in the time zone (option `timeZone`, else the ConfigProvider zone), which brings the wall-clock zone conversion it skipped before (2026-11-18).
Budget-raise: filter-menu 36.05 KB → 36.2 KB (measured 36.11 KB): its custom range is a `DateRangePicker`, which grew (2026-11-18).
Budget-raise: filter-menu-root 32.3 KB → 32.45 KB (measured 32.38 KB): the same `DateRangePicker` growth (2026-11-18).
Budget-raise: date-picker 17.95 KB → 18.1 KB (measured 18.05 KB): the same wrapping trigger and phone sheet (2026-11-18).
Budget-raise: date-range-picker 37.55 KB → 44.85 KB (measured 44.72 KB): round 2 of the time range proposal — each time field is now the existing `Combobox` (a typed time or a pick from a 30-minute list that opens under the field), so the panel stays as thin as the calendar; reusing Combobox instead of a new time list costs its code once (2026-11-18).
Budget-raise: date-picker 18.1 KB → 24.6 KB (measured 24.47 KB): the same `Combobox` time field, shared with DateRangePicker through the date fields part (2026-11-18).
Budget-raise: date-picker-root 17.9 KB → 24.4 KB (measured 24.24 KB): the same `Combobox` time field (2026-11-18).
Budget-raise: combobox 13.05 KB → 13.15 KB (measured 13.09 KB): the list opens scrolled to the committed option, and an `icon` prop lets a time field show a clock instead of the search glass, so a 48-entry time list shows the current time (2026-11-18).
Budget-raise: schema-form 60.8 KB → 61 KB (measured 60.89 KB): it renders `Combobox`, which grew by the scroll-to-current change (2026-11-18).
Budget-raise: table-filter 6.35 KB → 6.45 KB (measured 6.42 KB): the same `Combobox` growth (2026-11-18).

- llms-full.txt cap 2,080,000 → 2,100,000 bytes (2026-11-16): the Web Design Guide moved in from azion-ai-toolkit and the round-2 page guidance; measured 2,080,508.

## What an `entryOnly` budget leaves out (2026-11-17, M2.10 row 82)

`node scripts/check-size.mjs --lazy <entry>` lists, under each `entryOnly` entry, every chunk its initial code can request on render, with the gzipped size of what that request loads beyond the entry. For `media-split-section` (14.46 KB counted) and `media-split-stack-section` (14.79 KB counted) the excluded chunks are the scenes (`console-application-scene` 124.12 KB, `console-trace-scene` 71.53 KB, `brand-globe-scene` 15.13 KB, `diagram` 14.24 KB, `spinning-globe` 6.57 KB, `runtime-api-scene` 6.21 KB, `runtime-api-cloud` 5.44 KB), the console mockup (2.46 KB) and the illustration runtime (`registry` 1.56 KB, `scene` 1.32 KB). The scenes and the mockup load only when the page data names one and carry their own budgets, so leaving them out is right. The illustration runtime is the one real under-count: a section with an `illustration` loads 2.88 KB plus its drawing on top of the counted entry. The budgets stay as they are; a section page that always draws an illustration should read the `--lazy` line next to the entry.
Budget-raise: phone-input 29.1 KB → 33.25 KB (measured 33.13 KB): owner request 2026-11-18, PhoneInput offers every country and territory with a calling code (245, from libphonenumber metadata) instead of a curated 34, and the closed trigger shows the flag, name and dial code.
Budget-raise: hero-form-section 45.85 KB → 50.6 KB (measured 50.47 KB): its phone field is PhoneInput, which now offers every country and territory with a calling code (owner request 2026-11-18).
Budget-raise: job-posting-section 51.5 KB → 56.25 KB (measured 56.15 KB): its phone field is PhoneInput, which now offers every country and territory with a calling code (owner request 2026-11-18).
Budget-raise: listing-index-section 39.85 KB → 39.95 KB (measured 39.85 KB): Select's trigger gained the trailing slot PhoneInput uses for the dial code (owner request 2026-11-18), on a budget with no headroom.
Budget-raise: log-viewer-content 28.4 KB → 28.5 KB (measured 28.45 KB): owner request 2026-11-18, the time and level are columns of the whole log (each sized to its longest value), so every message starts at the same x; the search highlight was folded into one render helper to pay for most of it, on a budget with 0.01 KB headroom.
Budget-raise: log-viewer 42.6 KB → 42.7 KB (measured 42.65 KB): the LogViewer.Content log columns above.
Budget-raise: log-viewer-steps 40.5 KB → 40.6 KB (measured 40.53 KB): renders LogViewer.Content, the log columns above.
Budget-raise: console-trace-scene 73.9 KB → 74.05 KB (measured 73.97 KB): renders LogViewer.Content, the log columns above (+0.02 KB); it already measured 73.95 KB, over its budget, before this change.
Budget-raise: console-application-scene 115.8 KB → 115.95 KB (measured 115.9 KB): owner report 2026-11-18, Tabs.List placed its active indicator in on-screen pixels, so inside a CSS-scaled console mock-up the highlight sat off its label; it now measures in the list's own layout pixels and re-measures when any tab changes size (+0.12 KB on every Tabs.List, which is also the 73.95 KB console-trace-scene measured above).
Budget-raise: table-cell-time 18.7 KB → 18.75 KB (measured 18.70 KB): it renders Avatar, whose default pattern colors moved off the removed --text-primary to the logo orange and brand blue (owner decision RV-H1, 2026-11-18; +a few bytes).
Budget-raise: doc-markdown 26 KB → 26.05 KB (measured 26.00 KB, a few bytes over): owner report 2026-11-18, the inline code chip of DocProse, DocCallout and DocItem also matched `pre > code` and drew one pill per line of a code block; the chip selectors now exclude code inside `pre`.
Budget-raise: doc-callout 6.3 KB → 8.45 KB (measured 8.36 KB): owner request 2026-11-18, an inline command in a callout copies on click like DocProse chips do, and a chip marked data-command is a keyboard button with a polite Copied announcement; the callout now carries the shared useInlineCodeCopy composable, the clipboard helper, the copy tooltip and the copy messages.
Budget-raise: doc-prose 3.75 KB → 4.35 KB (measured 4.28 KB): the inline-code copy moved into the shared useInlineCodeCopy composable and gained the keyboard path for command chips (role, tabindex, accessible name, Enter and Space) and a polite live region.
Budget-raise: doc-markdown 26.05 KB → 28.1 KB (measured with both 2026-11-18 changes): renders DocCallout, which now copies its inline commands (the doc-callout raise above).
Budget-raise: article-body-section 45.1 KB → 45.75 KB (measured 45.62 KB): renders DocProse, whose inline-code copy gained the keyboard path for command chips and a polite live region (the doc-prose raise above).
Budget-raise: compliance-logos-section 7.9 KB → 7.95 KB (measured 7.91 KB): owner report 2026-11-18 (RV05, RV-C1), MediaSplit splits on its own width (a container query) instead of the window's and pads a large copy one step tighter in a narrow split, so TemplateGallerySection keeps its 50/50 split with a two-line headline; the band renders MediaSplit inline, on a budget with 0 KB headroom.
Budget-raise: tutorial-panel 9.55 KB → 9.75 KB (measured 9.72 KB): the hotspot's five locale strings moved into the shared `tutorialPanel` group when `Hotspot` became `TutorialPanelHotspot`, and the provider keeps one open tutorial step per page (owner report 2026-11-18, two step popovers opened at once on the Hotspot page).
Budget-raise: tutorial-panel-root 8.9 KB → 9 KB (measured 8.94 KB): the same five locale strings, now in the `tutorialPanel` group the panel reads.
Budget-raise: tutorial-panel-provider 1.1 KB → 1.15 KB (measured 1.13 KB): the one-open-step owner (`lib/open-step-owner.ts`), so starting a tutorial in one provider closes the step another provider had open.
Budget-raise: tutorial-panel-hotspot 13 KB → 13.25 KB (measured 13.21 KB): renamed from `hotspot` (13 KB); it now reads the whole `tutorialPanel` locale group instead of its own five strings.
Budget-raise: tree 10.1 KB → 10.35 KB (measured 10.28 KB): owner report 2026-11-18 (RV-T1, RV-T2), the new `size` prop (small, medium, large rows with their padding, type and indent steps), the inset 1px focus border and the guard that keeps Shift and Ctrl+click from selecting label text.
Budget-raise: doc-markdown 28.1 KB → 28.25 KB (measured 28.10 KB): RV-M1, DocTabs and DocTab are removed and DocMarkdown renders the MDX `<Tabs><Tab title>` tags straight onto the four `Tabs` parts (four lazy imports and the panel mapping instead of two lazy DocTabs imports).
Budget-raise: css-button 10.85 KB → 11.1 KB (measured 11.04 KB; the base branch already measured 10.94 KB, over its limit): owner report 2026-11-18 (RV-B1), the theme's three medium-weight `text-title-*` roles add their custom properties (size, line height, weight, tracking, wrap, and the two breakpoint sizes of `text-title-lg`) to every app's stylesheet.
Budget-raise: css-console 24 KB → 24.1 KB (measured 24.01 KB): the same `text-title-*` role properties (RV-B1).
Budget-raise: recognition-marquee-section 21.15 KB → 21.2 KB (measured 21.16 KB): `cn` now knows the `title`, `amount` and `tag` type roles, so it no longer drops them when a text colour follows (RV-B1).
Budget-raise: code-block 32.4 KB → 32.45 KB (measured 32.4 KB): the same `cn` role list (RV-B1).
Budget-raise: schema-form 61 KB → 61.05 KB: the same `cn` role list (RV-B1), on top of the date range picker raise.
Budget-raise: date-picker 24.6 KB → 41.7 KB (measured 41.57 KB): the calendar caption gains Month and Year selects between its arrows (owner 2026-11-18, decision RV-S2), built on the WebKit `Select` because the owner wants no native select; the Select's list brings `ScrollArea` and with it `cn` (tailwind-merge), which the date picker did not carry before.
Budget-raise: date-picker-root 24.4 KB → 41.5 KB (measured 41.36 KB): the same Month and Year `Select`s in the shared calendar caption (2026-11-18).
Budget-raise: date-range-picker 44.85 KB → 51.05 KB (measured 50.91 KB): the same Month and Year `Select`s, plus the Unit and Refresh every selects and the time zone selector moved from native selects to the WebKit `Select` and `Combobox` (owner 2026-11-18, decision RV-S4).
Budget-raise: locales-es 10.8 KB → 10.85 KB (measured 10.80 KB): the Month and Year names of the calendar caption selects (2026-11-18).
Budget-raise: flow-diagram-root 13.5 KB → 13.75 KB (measured 13.52 KB): the `uniform` prop (equal-size steps) the edge error page's request path needs (owner decision RV-D1, 2026-11-18).
