# Icons

> Every icon class of `@aziontech/icons` with search keywords.

A monochrome icon is `ai ai-<name>`, coloured by the text colour; a colour brand icon is `ai-color ai-<name>`. Import `@aziontech/icons` once at the app entry; an `icon` prop takes the class string.

456 names. These are the only values the components accept. An unknown class renders nothing. The MCP tool `list_assets({ kind: "icons" })` returns the same list (with a `query` to filter), and `catalog.json#assets.icons` points at it as data.

Used by: [Alert](../components/alert.md), [ArtifactPreview](../components/artifact-preview.md), [Avatar](../components/avatar.md), [Button](../components/button.md), [ButtonHighlight](../components/button-highlight.md), [DocCard](../components/doc-card.md), [DocItem](../components/doc-item.md), [DocPrompt](../components/doc-prompt.md), [EmptyState](../components/empty-state.md), [FileDropzone](../components/file-dropzone.md), [IconButton](../components/icon-button.md), [Link](../components/link.md), [SettingsSection](../components/settings-section.md), [SplitButton](../components/split-button.md), [Tag](../components/tag.md), [Topic](../components/topic.md).

## Usage

```vue
<script setup>
  import '@aziontech/icons'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <i class="ai ai-edge-firewall" aria-hidden="true"></i>
  <i class="ai ai-trash" aria-hidden="true"></i>
  <i class="ai-color ai-react" aria-hidden="true"></i>
  <Button icon="ai ai-plus">Create</Button>
</template>
```

## Names

| Class | Set | Keywords |
| --- | --- | --- |
| `ai ai-abuse-prevention` | azionicons | abuse, prevention, fraud, security |
| `ai ai-adaptive-security` | azionicons | adaptive, security, protection, shield |
| `ai ai-address-book` | azionicons | address, book, contacts, people, docs, documentation, read |
| `ai ai-ai-gateway` | azionicons | gateway, artificial intelligence, llm, model, proxy, api, routing |
| `ai ai-ai-pillar` | azionicons | pillar, artificial intelligence, llm, model, product family |
| `ai ai-align-center` | azionicons | align, center, text, alignment, format |
| `ai ai-align-justify` | azionicons | align, justify, text, alignment, format |
| `ai ai-align-left` | azionicons | align, left, text, alignment, format |
| `ai ai-align-right` | azionicons | align, right, text, alignment, format |
| `ai ai-angular` | azionicons | brand, logo |
| `ai ai-app-accelerator` | azionicons | app, accelerator, performance, speed, product |
| `ai ai-arrow-down-0-1` | azionicons | arrow, down, direction, navigate, move |
| `ai ai-arrow-down-1-0` | azionicons | arrow, down, direction, navigate, move |
| `ai ai-arrow-down-a-z` | azionicons | arrow, down, direction, navigate, move |
| `ai ai-arrow-down-left` | azionicons | arrow, down, left, direction, navigate, move |
| `ai ai-arrow-down-narrow-wide` | azionicons | arrow, down, narrow, wide, direction, navigate, move |
| `ai ai-arrow-down-right` | azionicons | arrow, down, right, direction, navigate, move |
| `ai ai-arrow-down-wide-narrow` | azionicons | arrow, down, wide, narrow, direction, navigate, move |
| `ai ai-arrow-down-z-a` | azionicons | arrow, down, direction, navigate, move |
| `ai ai-arrow-down` | azionicons | arrow, down, direction, navigate, move |
| `ai ai-arrow-left` | azionicons | arrow, left, direction, navigate, move |
| `ai ai-arrow-right-left` | azionicons | arrow, right, left, direction, navigate, move |
| `ai ai-arrow-right` | azionicons | arrow, right, direction, navigate, move |
| `ai ai-arrow-up-0-1` | azionicons | arrow, direction, navigate, move |
| `ai ai-arrow-up-1-0` | azionicons | arrow, direction, navigate, move |
| `ai ai-arrow-up-a-z` | azionicons | arrow, direction, navigate, move |
| `ai ai-arrow-up-left` | azionicons | arrow, left, direction, navigate, move |
| `ai ai-arrow-up-narrow-wide` | azionicons | arrow, narrow, wide, direction, navigate, move |
| `ai ai-arrow-up-right` | azionicons | arrow, right, direction, navigate, move |
| `ai ai-arrow-up-wide-narrow` | azionicons | arrow, wide, narrow, direction, navigate, move |
| `ai ai-arrow-up-z-a` | azionicons | arrow, direction, navigate, move |
| `ai ai-arrow-up` | azionicons | arrow, direction, navigate, move |
| `ai ai-ask-azion` | azionicons | ask, azion, question, assistant, chat, brand, logo, company |
| `ai ai-asterisk` | azionicons | required, star |
| `ai ai-astro` | azionicons | brand, logo |
| `ai ai-at` | azionicons | email, mention |
| `ai ai-attack` | azionicons | threat, security, ddos |
| `ai ai-azion-api` | azionicons | azion, api, brand, logo, company, endpoint, integration, developer |
| `ai ai-azion-cli` | azionicons | azion, cli, brand, logo, company, terminal, command line, console |
| `ai ai-azion` | azionicons | brand, logo, company |
| `ai ai-backward` | azionicons | previous, rewind |
| `ai ai-ban` | azionicons | block, forbidden, deny |
| `ai ai-barcode` | azionicons | scan, product code |
| `ai ai-bell-off` | azionicons | bell, off, notification, alert |
| `ai ai-bell` | azionicons | notification, alert |
| `ai ai-bolt` | azionicons | fast, lightning, power |
| `ai ai-book` | azionicons | docs, documentation, read |
| `ai ai-bookmark-fill` | azionicons | bookmark, fill, save, favorite |
| `ai ai-bookmark` | azionicons | save, favorite |
| `ai ai-bot-manager` | azionicons | bot, manager, robot, automation, security |
| `ai ai-box` | azionicons | package, product |
| `ai ai-briefcase` | azionicons | work, business |
| `ai ai-build-pillar` | azionicons | build, pillar, product family |
| `ai ai-building-columns` | azionicons | building, columns, company, organization, office |
| `ai ai-building` | azionicons | company, organization, office |
| `ai ai-bullseye` | azionicons | target, goal |
| `ai ai-business-support` | azionicons | business, support, help, service |
| `ai ai-calculator` | azionicons | math, pricing |
| `ai ai-calendar-clock` | azionicons | calendar, clock, date, schedule, time, history |
| `ai ai-calendar-minus` | azionicons | calendar, minus, date, schedule, time, remove, subtract, collapse |
| `ai ai-calendar-plus` | azionicons | calendar, plus, date, schedule, time, add, create, new |
| `ai ai-calendar-x` | azionicons | calendar, date, schedule, time |
| `ai ai-calendar` | azionicons | date, schedule, time |
| `ai ai-camera` | azionicons | photo, picture |
| `ai ai-car` | azionicons | vehicle, automotive |
| `ai ai-caret-down` | azionicons | caret, down, arrow, dropdown, triangle |
| `ai ai-caret-left` | azionicons | caret, left, arrow, dropdown, triangle |
| `ai ai-caret-right` | azionicons | caret, right, arrow, dropdown, triangle |
| `ai ai-caret-up` | azionicons | caret, arrow, dropdown, triangle |
| `ai ai-cart-arrow-down` | azionicons | cart, arrow, down, shopping, commerce, buy, direction, navigate, move |
| `ai ai-cart-minus` | azionicons | cart, minus, shopping, commerce, buy, remove, subtract, collapse |
| `ai ai-cart-plus` | azionicons | cart, plus, shopping, commerce, buy, add, create, new |
| `ai ai-certificate-manager` | azionicons | certificate, manager, tls, ssl, security, https |
| `ai ai-chart-bar` | azionicons | chart, bar, graph, analytics, metrics |
| `ai ai-chart-line` | azionicons | chart, line, graph, analytics, metrics |
| `ai ai-chart-pie` | azionicons | chart, pie, graph, analytics, metrics |
| `ai ai-chart-scatter` | azionicons | chart, scatter, graph, analytics, metrics |
| `ai ai-check` | azionicons | done, success, confirm, ok |
| `ai ai-chevron-down` | azionicons | chevron, down, arrow, expand, collapse, direction, angle |
| `ai ai-chevron-left` | azionicons | chevron, left, arrow, expand, collapse, direction, angle |
| `ai ai-chevron-right` | azionicons | chevron, right, arrow, expand, collapse, direction, angle |
| `ai ai-chevron-up` | azionicons | chevron, arrow, expand, collapse, direction, angle |
| `ai ai-chevrons-down` | azionicons | chevrons, down, double, arrow, first, last, direction |
| `ai ai-chevrons-left` | azionicons | chevrons, left, double, arrow, first, last, direction |
| `ai ai-chevrons-right` | azionicons | chevrons, right, double, arrow, first, last, direction |
| `ai ai-chevrons-up` | azionicons | chevrons, double, arrow, first, last, direction |
| `ai ai-circle-alert` | azionicons | circle, alert, error, exclamation, warning, status, shape, notification |
| `ai ai-circle-arrow-down` | azionicons | circle, arrow, down, status, shape, direction, navigate, move |
| `ai ai-circle-arrow-left` | azionicons | circle, arrow, left, status, shape, direction, navigate, move |
| `ai ai-circle-arrow-right` | azionicons | circle, arrow, right, status, shape, direction, navigate, move |
| `ai ai-circle-arrow-up` | azionicons | circle, arrow, status, shape, direction, navigate, move |
| `ai ai-circle-check` | azionicons | circle, check, status, shape, done, success, confirm, ok |
| `ai ai-circle-chevron-down` | azionicons | circle, chevron, down, status, shape, arrow, expand, collapse, direction, angle |
| `ai ai-circle-chevron-left` | azionicons | circle, chevron, left, status, shape, arrow, expand, collapse, direction, angle |
| `ai ai-circle-chevron-right` | azionicons | circle, chevron, right, status, shape, arrow, expand, collapse, direction, angle |
| `ai ai-circle-chevron-up` | azionicons | circle, chevron, status, shape, arrow, expand, collapse, direction, angle |
| `ai ai-circle-fill` | azionicons | circle, fill, status, shape |
| `ai ai-circle-half` | azionicons | circle, half, status, shape |
| `ai ai-circle-help` | azionicons | circle, help, question, faq, status, shape |
| `ai ai-circle-info` | azionicons | circle, info, status, shape, information, help, about |
| `ai ai-circle-minus` | azionicons | circle, minus, status, shape, remove, subtract, collapse |
| `ai ai-circle-off` | azionicons | circle, off, status, shape |
| `ai ai-circle-on` | azionicons | circle, status, shape |
| `ai ai-circle-pause` | azionicons | circle, pause, status, shape, stop, hold |
| `ai ai-circle-play` | azionicons | circle, play, status, shape, start, run, video |
| `ai ai-circle-plus` | azionicons | circle, plus, status, shape, add, create, new |
| `ai ai-circle-stop` | azionicons | circle, stop, status, shape, halt, end |
| `ai ai-circle-x` | azionicons | circle, close, error, clear, times, status, shape |
| `ai ai-circle` | azionicons | status, shape |
| `ai ai-claude` | azionicons | brand, logo |
| `ai ai-clipboard` | azionicons | copy, paste |
| `ai ai-clock` | azionicons | time, schedule, history |
| `ai ai-cloud-download` | azionicons | cloud, download, hosting, storage, save, export |
| `ai ai-cloud-upload` | azionicons | cloud, upload, hosting, storage, import, send |
| `ai ai-cloud` | azionicons | hosting, storage |
| `ai ai-code` | azionicons | developer, source, snippet |
| `ai ai-column` | azionicons | layout, grid |
| `ai ai-comment` | azionicons | chat, message, feedback |
| `ai ai-comments` | azionicons | chat, messages, discussion |
| `ai ai-compass` | azionicons | explore, navigation |
| `ai ai-configuration-service` | azionicons | configuration, service, settings, preferences |
| `ai ai-content-delivery` | azionicons | content, delivery |
| `ai ai-copy` | azionicons | duplicate, clipboard |
| `ai ai-credit-card` | azionicons | credit, card, payment, billing |
| `ai ai-crown` | azionicons | premium, plan, pro |
| `ai ai-cursor` | azionicons | brand, logo |
| `ai ai-custom-pages` | azionicons | custom, pages |
| `ai ai-data-stream` | azionicons | data, stream, logs, events |
| `ai ai-database` | azionicons | data, storage, sql |
| `ai ai-datasheet` | azionicons | document, specification |
| `ai ai-deepseek` | azionicons | brand, logo |
| `ai ai-delete-left` | azionicons | delete, left, remove, erase |
| `ai ai-deploy-pillar` | azionicons | deploy, pillar, release, publish, ship, product family |
| `ai ai-desktop` | azionicons | computer, screen, device |
| `ai ai-digital-certificates` | azionicons | digital, certificates, certificate, security, tls, ssl, https |
| `ai ai-directions` | azionicons | route, navigation, map |
| `ai ai-disabled` | azionicons | off, inactive, status |
| `ai ai-discord` | azionicons | brand, logo |
| `ai ai-docusaurus` | azionicons | brand, logo |
| `ai ai-dollar` | azionicons | money, price, billing, currency |
| `ai ai-domains` | azionicons | dns, url, workload |
| `ai ai-download` | azionicons | save, export |
| `ai ai-durable-objects` | azionicons | durable, objects |
| `ai ai-edge-ai` | azionicons | edge, network, distributed, artificial intelligence, llm, model |
| `ai ai-edge-application` | azionicons | edge, application, network, distributed |
| `ai ai-edge-connectors` | azionicons | edge, connectors, network, distributed, integration, origin |
| `ai ai-edge-dns` | azionicons | edge, dns, network, distributed, domain, name server, zone, records |
| `ai ai-edge-firewall` | azionicons | edge, firewall, network, distributed, security, waf, protection |
| `ai ai-edge-functions` | azionicons | edge, functions, network, distributed, serverless, compute, code |
| `ai ai-edge-kv` | azionicons | edge, network, distributed, key value, store, storage |
| `ai ai-edge-libraries` | azionicons | edge, libraries, network, distributed |
| `ai ai-edge-nodes` | azionicons | edge, nodes, network, distributed, servers, infrastructure |
| `ai ai-edge-orchestrator` | azionicons | edge, orchestrator, network, distributed, infrastructure, deploy |
| `ai ai-edge-pulse` | azionicons | edge, pulse, network, distributed |
| `ai ai-edge-services` | azionicons | edge, services, network, distributed |
| `ai ai-edge-sql` | azionicons | edge, sql, network, distributed, database, query |
| `ai ai-edge-storage` | azionicons | edge, storage, network, distributed, bucket, files, object storage |
| `ai ai-eject` | azionicons | remove, unmount |
| `ai ai-eleventy` | azionicons | brand, logo |
| `ai ai-ellipsis-vertical` | azionicons | ellipsis, vertical, more, menu, actions, overflow |
| `ai ai-ellipsis` | azionicons | more, menu, actions, overflow |
| `ai ai-enabled` | azionicons | on, active, status |
| `ai ai-equals` | azionicons | equal, math |
| `ai ai-eraser` | azionicons | clear, erase |
| `ai ai-euro` | azionicons | money, currency |
| `ai ai-expand` | azionicons | fullscreen, maximize |
| `ai ai-external-link` | azionicons | external, link, open, new tab, link out, url, chain, hyperlink |
| `ai ai-eye-off` | azionicons | eye, off, hide, hidden, invisible, view, show, visible, preview |
| `ai ai-eye` | azionicons | view, show, visible, preview |
| `ai ai-face-smile` | azionicons | face, smile |
| `ai ai-facebook` | azionicons | brand, logo |
| `ai ai-fast-backward` | azionicons | fast, backward, previous, rewind |
| `ai ai-fast-forward` | azionicons | fast, forward, next, skip |
| `ai ai-file-arrow-up` | azionicons | file, arrow, document, page, direction, navigate, move |
| `ai ai-file-check` | azionicons | file, check, document, page, done, success, confirm, ok |
| `ai ai-file-excel` | azionicons | file, excel, document, page |
| `ai ai-file-export` | azionicons | file, export, document, page |
| `ai ai-file-import` | azionicons | file, import, document, page |
| `ai ai-file-pdf` | azionicons | file, pdf, document, page |
| `ai ai-file-pen` | azionicons | file, pen, document, page, edit, write |
| `ai ai-file-plus` | azionicons | file, plus, document, page, add, create, new |
| `ai ai-file-word` | azionicons | file, word, document, page |
| `ai ai-file` | azionicons | document, page |
| `ai ai-filter-fill` | azionicons | filter, fill, funnel, refine, narrow |
| `ai ai-filter-off` | azionicons | filter, off, funnel, refine, narrow |
| `ai ai-filter` | azionicons | funnel, refine, narrow |
| `ai ai-flag-fill` | azionicons | flag, fill, report, mark |
| `ai ai-flag` | azionicons | report, mark |
| `ai ai-folder-open` | azionicons | folder, open, directory, files |
| `ai ai-folder-plus` | azionicons | folder, plus, directory, files, add, create, new |
| `ai ai-folder` | azionicons | directory, files |
| `ai ai-forward` | azionicons | next, skip |
| `ai ai-gateway` | azionicons | proxy, api, routing |
| `ai ai-gatsby` | azionicons | brand, logo |
| `ai ai-gauge` | azionicons | performance, speed, meter |
| `ai ai-gemini` | azionicons | brand, logo |
| `ai ai-gift` | azionicons | present, reward |
| `ai ai-git-branch-delete` | azionicons | git, branch, delete, version control, source, repository, version, remove, erase |
| `ai ai-git-branch-plus` | azionicons | git, branch, plus, version control, source, repository, version, add, create, new |
| `ai ai-git-branch` | azionicons | git, branch, version control, source, repository, version |
| `ai ai-git-cherry-pick` | azionicons | git, cherry, pick, version control, source, repository |
| `ai ai-git-commit` | azionicons | git, commit, version control, source, repository |
| `ai ai-git-compare` | azionicons | git, compare, version control, source, repository |
| `ai ai-git-diff` | azionicons | git, diff, version control, source, repository |
| `ai ai-git-fork` | azionicons | git, fork, version control, source, repository |
| `ai ai-git-graph` | azionicons | git, graph, version control, source, repository |
| `ai ai-git-merge-conflict` | azionicons | git, merge, conflict, version control, source, repository |
| `ai ai-git-merge` | azionicons | git, merge, version control, source, repository |
| `ai ai-git-pull-request-closed` | azionicons | git, pull, request, closed, version control, source, repository |
| `ai ai-git-pull-request-draft` | azionicons | git, pull, request, draft, version control, source, repository |
| `ai ai-git-pull-request` | azionicons | git, pull, request, version control, source, repository |
| `ai ai-git-repository` | azionicons | git, repository, version control, source, code |
| `ai ai-github` | azionicons | brand, logo |
| `ai ai-globe` | azionicons | world, global, language, web |
| `ai ai-google` | azionicons | brand, logo |
| `ai ai-graduation-cap` | azionicons | graduation, cap, learn, education, course |
| `ai ai-graphql` | azionicons | brand, logo |
| `ai ai-grok` | azionicons | brand, logo |
| `ai ai-hammer` | azionicons | build, tools |
| `ai ai-hash` | azionicons | hashtag, tag, number, channel |
| `ai ai-headphones` | azionicons | support, audio |
| `ai ai-heart-fill` | azionicons | heart, fill, like, favorite, love |
| `ai ai-heart` | azionicons | like, favorite, love |
| `ai ai-hexo` | azionicons | brand, logo |
| `ai ai-history` | azionicons | recent, activity, audit, log |
| `ai ai-home` | azionicons | house, start, dashboard |
| `ai ai-hono` | azionicons | brand, logo |
| `ai ai-hourglass` | azionicons | wait, pending, time |
| `ai ai-html` | azionicons | markup, web, brand |
| `ai ai-hugo` | azionicons | brand, logo |
| `ai ai-id-card` | azionicons | card, identity, profile, account |
| `ai ai-image-processor` | azionicons | image, processor, picture, photo, media |
| `ai ai-image` | azionicons | picture, photo, media |
| `ai ai-images` | azionicons | pictures, photos, gallery, media |
| `ai ai-inbox` | azionicons | messages, mail, empty |
| `ai ai-indian-rupee` | azionicons | indian, rupee |
| `ai ai-info` | azionicons | information, help, about |
| `ai ai-instagram` | azionicons | brand, logo |
| `ai ai-instructor` | azionicons | teacher, training, course |
| `ai ai-integration-services` | azionicons | integration, services |
| `ai ai-jekyll` | azionicons | brand, logo |
| `ai ai-json-text` | azionicons | json, text, data, format, code |
| `ai ai-json` | azionicons | data, format, code |
| `ai ai-key` | azionicons | password, token, secret, credential |
| `ai ai-language` | azionicons | translate, locale, i18n |
| `ai ai-layers` | azionicons | stack, levels |
| `ai ai-layout-grid` | azionicons | layout, grid, tiles, dashboard |
| `ai ai-lightbulb` | azionicons | idea, tip, hint |
| `ai ai-link` | azionicons | url, chain, hyperlink |
| `ai ai-linkedin` | azionicons | brand, logo |
| `ai ai-list-check` | azionicons | list, check, tasks, todo, checklist, items, bullets, done, success, confirm, ok |
| `ai ai-list` | azionicons | items, bullets |
| `ai ai-live-ingest` | azionicons | live, ingest |
| `ai ai-load-balancer` | azionicons | load, balancer, traffic, distribution, origin |
| `ai ai-lock-open` | azionicons | lock, open, unlock, public, unlocked, secure, private, password, locked |
| `ai ai-lock` | azionicons | secure, private, password, locked |
| `ai ai-log-in` | azionicons | log, login, sign in, enter |
| `ai ai-log-out` | azionicons | log, out, logout, sign out, exit |
| `ai ai-lora` | azionicons | fine-tuning, ai, model |
| `ai ai-mail` | azionicons | email, envelope, message |
| `ai ai-map-pin` | azionicons | map, pin, location, marker, place, geo, thumbtack, pushpin, fixed |
| `ai ai-map` | azionicons | location, geo |
| `ai ai-marketplace` | azionicons | templates, store, integrations |
| `ai ai-mars` | azionicons | male, gender |
| `ai ai-maximize` | azionicons | fullscreen, expand, enlarge |
| `ai ai-mcp` | azionicons | model context protocol, agent, integration, brand, logo |
| `ai ai-medium` | azionicons | brand, logo |
| `ai ai-megaphone` | azionicons | announcement, marketing, news |
| `ai ai-menu` | azionicons | hamburger, navigation, bars |
| `ai ai-meta` | azionicons | brand, logo |
| `ai ai-microchip-ai` | azionicons | microchip, hardware, processor, compute, artificial intelligence, llm, model |
| `ai ai-microchip` | azionicons | hardware, processor, compute |
| `ai ai-microphone` | azionicons | audio, voice, record |
| `ai ai-microsoft-copilot` | azionicons | microsoft, copilot, brand, logo |
| `ai ai-minimize` | azionicons | exit fullscreen, collapse, shrink |
| `ai ai-minus` | azionicons | remove, subtract, collapse |
| `ai ai-mistral` | azionicons | brand, logo |
| `ai ai-mobile` | azionicons | phone, device, smartphone |
| `ai ai-money-bill` | azionicons | money, bill, payment, billing, cash |
| `ai ai-moon` | azionicons | dark mode, night, theme |
| `ai ai-move-horizontal` | azionicons | move, horizontal, drag, reposition, arrows |
| `ai ai-move-vertical` | azionicons | move, vertical, drag, reposition, arrows |
| `ai ai-move` | azionicons | drag, reposition, arrows |
| `ai ai-network-lists` | azionicons | network, lists, connectivity |
| `ai ai-nextjs` | azionicons | brand, logo |
| `ai ai-nitro` | azionicons | server, framework, unjs, brand, logo |
| `ai ai-nuxt` | azionicons | brand, logo |
| `ai ai-observe-pillar` | azionicons | observe, pillar, observability, monitoring, product family |
| `ai ai-openai` | azionicons | chatgpt, gpt, brand, logo |
| `ai ai-origin-accelerator` | azionicons | origin, accelerator, backend, server, performance, speed, product |
| `ai ai-origin-shield` | azionicons | origin, shield, backend, server, security, protection, safe |
| `ai ai-palette` | azionicons | color, theme, design |
| `ai ai-paperclip` | azionicons | attachment, attach |
| `ai ai-pause` | azionicons | stop, hold |
| `ai ai-pencil` | azionicons | edit, write, rename |
| `ai ai-percentage` | azionicons | percent, discount, rate |
| `ai ai-perplexity` | azionicons | brand, logo |
| `ai ai-phone` | azionicons | call, contact |
| `ai ai-pin` | azionicons | thumbtack, pushpin, fixed |
| `ai ai-play` | azionicons | start, run, video |
| `ai ai-plus` | azionicons | add, create, new |
| `ai ai-pound` | azionicons | currency, money, gbp |
| `ai ai-power-off` | azionicons | power, off, shut down, logout |
| `ai ai-practices-review` | azionicons | practices, review |
| `ai ai-preact` | azionicons | brand, logo |
| `ai ai-print` | azionicons | printer |
| `ai ai-professional-services` | azionicons | professional, services |
| `ai ai-qrcode` | azionicons | qr code, scan |
| `ai ai-question` | azionicons | help, faq, support |
| `ai ai-qwen` | azionicons | brand, logo |
| `ai ai-qwik` | azionicons | brand, logo |
| `ai ai-react` | azionicons | brand, logo |
| `ai ai-real-time-events` | azionicons | real, time, events |
| `ai ai-real-time-metrics` | azionicons | real, time, metrics, analytics, observability, charts |
| `ai ai-real-time-purge` | azionicons | real, time, purge, cache, clear, invalidate |
| `ai ai-receipt` | azionicons | invoice, billing, payment |
| `ai ai-reddit` | azionicons | brand, logo |
| `ai ai-redis` | azionicons | brand, logo |
| `ai ai-refresh` | azionicons | reload, sync, update |
| `ai ai-remix` | azionicons | brand, logo |
| `ai ai-replay` | azionicons | repeat, retry |
| `ai ai-reply` | azionicons | answer, respond |
| `ai ai-rss` | azionicons | feed, subscribe, news |
| `ai ai-rules-engine` | azionicons | rules, engine, logic, conditions, behavior |
| `ai ai-sase` | azionicons | secure access, network security, zero trust |
| `ai ai-save` | azionicons | disk, store |
| `ai ai-scissors` | azionicons | cut |
| `ai ai-search` | azionicons | find, magnifier, lookup |
| `ai ai-secure-pillar` | azionicons | secure, pillar, security, protection, product family |
| `ai ai-security-team` | azionicons | security, team, protection, shield |
| `ai ai-send` | azionicons | submit, paper plane, message |
| `ai ai-server` | azionicons | host, infrastructure, compute |
| `ai ai-settings` | azionicons | gear, cog, preferences, configuration |
| `ai ai-share` | azionicons | send, social |
| `ai ai-shield` | azionicons | security, protection, safe |
| `ai ai-shop` | azionicons | store, commerce |
| `ai ai-shopping-bag` | azionicons | shopping, bag, commerce, buy |
| `ai ai-shopping-cart` | azionicons | shopping, cart, commerce, buy |
| `ai ai-signpost` | azionicons | directions, route, navigation |
| `ai ai-sitemap` | azionicons | hierarchy, tree, structure |
| `ai ai-slack` | azionicons | brand, logo |
| `ai ai-sliders-horizontal` | azionicons | sliders, horizontal, settings, controls, adjust, filters |
| `ai ai-sliders-vertical` | azionicons | sliders, vertical, settings, controls, adjust, filters |
| `ai ai-sort-down-fill` | azionicons | sort, down, fill, order, arrange |
| `ai ai-sort-off` | azionicons | sort, off, order, arrange |
| `ai ai-sort-up-fill` | azionicons | sort, fill, order, arrange |
| `ai ai-sort` | azionicons | order, arrange |
| `ai ai-sparkles` | azionicons | ai, magic, new, generate |
| `ai ai-spinner-dotted` | azionicons | spinner, dotted, loading, progress, busy |
| `ai ai-spinner` | azionicons | loading, progress, busy |
| `ai ai-sql` | azionicons | database, query |
| `ai ai-square-check` | azionicons | square, check, checkbox, done, success, confirm, ok |
| `ai ai-square-pen` | azionicons | square, pen, edit, write |
| `ai ai-star-fill` | azionicons | star, fill, favorite, rating |
| `ai ai-star-half-fill` | azionicons | star, half, fill, favorite, rating |
| `ai ai-star-half` | azionicons | star, half, favorite, rating |
| `ai ai-star` | azionicons | favorite, rating |
| `ai ai-stencil` | azionicons | web components, compiler, framework, brand, logo |
| `ai ai-step-back` | azionicons | step, back |
| `ai ai-step-forward` | azionicons | step, forward, next, skip |
| `ai ai-stop` | azionicons | halt, end |
| `ai ai-stopwatch` | azionicons | timer, time, duration |
| `ai ai-store` | azionicons | shop, marketplace |
| `ai ai-sun` | azionicons | light mode, day, theme |
| `ai ai-svelte` | azionicons | brand, logo |
| `ai ai-sync` | azionicons | refresh, synchronize |
| `ai ai-table` | azionicons | grid, data, rows |
| `ai ai-tablet` | azionicons | device, ipad |
| `ai ai-tag` | azionicons | label, category |
| `ai ai-tags` | azionicons | labels, categories |
| `ai ai-technical-account` | azionicons | technical, account |
| `ai ai-technical-support` | azionicons | technical, support, help, service |
| `ai ai-terraform` | azionicons | infrastructure as code, iac, brand, logo |
| `ai ai-thumbs-down-fill` | azionicons | thumbs, down, fill, dislike, bad, feedback |
| `ai ai-thumbs-down` | azionicons | thumbs, down, dislike, bad, feedback |
| `ai ai-thumbs-up-fill` | azionicons | thumbs, fill, like, good, feedback |
| `ai ai-thumbs-up` | azionicons | thumbs, like, good, feedback |
| `ai ai-ticket` | azionicons | support, issue |
| `ai ai-tiered-cache` | azionicons | tiered, cache |
| `ai ai-trash` | azionicons | delete, remove, bin |
| `ai ai-triangle-alert` | azionicons | triangle, alert, warning, exclamation, caution, notification |
| `ai ai-trophy` | azionicons | award, winner |
| `ai ai-truck` | azionicons | delivery, shipping |
| `ai ai-turkish-lira` | azionicons | turkish, lira |
| `ai ai-turso` | azionicons | brand, logo |
| `ai ai-twitch` | azionicons | brand, logo |
| `ai ai-undo` | azionicons | revert, back |
| `ai ai-upload` | azionicons | import, send |
| `ai ai-user-minus` | azionicons | user, minus, person, account, profile, remove, subtract, collapse |
| `ai ai-user-pen` | azionicons | user, pen, person, account, profile, edit, write |
| `ai ai-user-plus` | azionicons | user, plus, person, account, profile, add, create, new |
| `ai ai-user` | azionicons | person, account, profile |
| `ai ai-users` | azionicons | people, team, members |
| `ai ai-variables` | azionicons | environment, env, config |
| `ai ai-venus` | azionicons | female, gender |
| `ai ai-verified` | azionicons | check, approved, badge |
| `ai ai-video` | azionicons | movie, media |
| `ai ai-vite` | azionicons | brand, logo |
| `ai ai-vitepress` | azionicons | brand, logo |
| `ai ai-volume-down` | azionicons | volume, down, sound, audio |
| `ai ai-volume-off` | azionicons | volume, off, sound, audio |
| `ai ai-volume-up` | azionicons | volume, sound, audio |
| `ai ai-vue` | azionicons | brand, logo |
| `ai ai-vuepress` | azionicons | brand, logo |
| `ai ai-waf-rules` | azionicons | waf, rules, web application firewall, security, logic, conditions, behavior |
| `ai ai-wallet` | azionicons | payment, money |
| `ai ai-warehouse` | azionicons | storage, inventory |
| `ai ai-wave-pulse` | azionicons | wave, pulse, activity, health, monitoring |
| `ai ai-webhook` | azionicons | integration, callback, events |
| `ai ai-whatsapp` | azionicons | brand, logo |
| `ai ai-wifi` | azionicons | network, wireless, connection |
| `ai ai-window-maximize` | azionicons | window, maximize, browser, app, fullscreen, expand, enlarge |
| `ai ai-window-minimize` | azionicons | window, minimize, browser, app, exit fullscreen, collapse, shrink |
| `ai ai-windsurf` | azionicons | brand, logo |
| `ai ai-workloads` | azionicons | domains, deploy, traffic |
| `ai ai-wrench` | azionicons | settings, tools, fix, maintenance |
| `ai ai-x-brand` | azionicons | brand, twitter, social, logo |
| `ai ai-x` | azionicons | close, cancel, dismiss, times |
| `ai ai-youtube` | azionicons | brand, logo |
| `ai ai-zoom-in` | azionicons | zoom, magnify, scale |
| `ai ai-zoom-out` | azionicons | zoom, out, magnify, scale |
| `ai-color ai-angular` | color | brand, logo |
| `ai-color ai-astro` | color | brand, logo |
| `ai-color ai-azure-devops` | color | azure, devops, brand, logo |
| `ai-color ai-bitbucket` | color | brand, logo |
| `ai-color ai-claude` | color | brand, logo |
| `ai-color ai-cursor` | color | brand, logo |
| `ai-color ai-deepseek` | color | brand, logo |
| `ai-color ai-discord` | color | brand, logo |
| `ai-color ai-flutter` | color | brand, logo |
| `ai-color ai-gemini` | color | brand, logo |
| `ai-color ai-gitlab` | color | brand, logo |
| `ai-color ai-google` | color | brand, logo |
| `ai-color ai-graphql` | color | brand, logo |
| `ai-color ai-grok` | color | brand, logo |
| `ai-color ai-html` | color | markup, web, brand |
| `ai-color ai-javascript` | color | brand, logo |
| `ai-color ai-kotlin` | color | brand, logo |
| `ai-color ai-meta` | color | brand, logo |
| `ai-color ai-microsoft-copilot` | color | microsoft, copilot, brand, logo |
| `ai-color ai-mistral` | color | brand, logo |
| `ai-color ai-nextjs` | color | brand, logo |
| `ai-color ai-nuxt` | color | brand, logo |
| `ai-color ai-openai` | color | chatgpt, gpt, brand, logo |
| `ai-color ai-perplexity` | color | brand, logo |
| `ai-color ai-qwen` | color | brand, logo |
| `ai-color ai-react` | color | brand, logo |
| `ai-color ai-redwood` | color | brand, logo |
| `ai-color ai-solidjs` | color | brand, logo |
| `ai-color ai-svelte` | color | brand, logo |
| `ai-color ai-terraform` | color | infrastructure as code, iac, brand, logo |
| `ai-color ai-typescript` | color | brand, logo |
| `ai-color ai-vue` | color | brand, logo |
| `ai-color ai-windsurf` | color | brand, logo |
| `ai-color ai-x-brand` | color | brand, twitter, social, logo |
| `ai-color ai-youtube` | color | brand, logo |
