# Icons

> Every icon class of `@aziontech/icons` with search keywords.

A monochrome icon is `ai ai-<name>`, coloured by the text colour; a colour brand icon is `ai-cor ai-<name>`. Import `@aziontech/icons` once at the app entry; an `icon` prop takes the class string.

471 names. These are the only values the components accept. An unknown class renders nothing. The MCP tool `list_assets({ kind: "icons" })` returns the same list (with a `query` to filter), and `catalog.json#assets.icons` points at it as data.

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
  <i class="ai-cor ai-react" aria-hidden="true"></i>
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
| `ai ai-angle-double-down` | azionicons | angle, double, down, chevron, arrow, direction |
| `ai ai-angle-double-left` | azionicons | angle, double, left, chevron, arrow, direction |
| `ai ai-angle-double-right` | azionicons | angle, double, right, chevron, arrow, direction |
| `ai ai-angle-double-up` | azionicons | angle, double, chevron, arrow, direction |
| `ai ai-angle-down` | azionicons | angle, down, chevron, arrow, direction |
| `ai ai-angle-left` | azionicons | angle, left, chevron, arrow, direction |
| `ai ai-angle-right` | azionicons | angle, right, chevron, arrow, direction |
| `ai ai-angle-up` | azionicons | angle, chevron, arrow, direction |
| `ai ai-angular` | azionicons | brand, logo |
| `ai ai-app-accelerator` | azionicons | app, accelerator, performance, speed, product |
| `ai ai-arrow-circle-down` | azionicons | arrow, circle, down, direction, navigate, move, status, shape |
| `ai ai-arrow-circle-left` | azionicons | arrow, circle, left, direction, navigate, move, status, shape |
| `ai ai-arrow-circle-right` | azionicons | arrow, circle, right, direction, navigate, move, status, shape |
| `ai ai-arrow-circle-up` | azionicons | arrow, circle, direction, navigate, move, status, shape |
| `ai ai-arrow-down-left-and-arrow-up-right-to-center` | azionicons | arrow, down, left, and, right, center, direction, navigate, move |
| `ai ai-arrow-down-left` | azionicons | arrow, down, left, direction, navigate, move |
| `ai ai-arrow-down-right` | azionicons | arrow, down, right, direction, navigate, move |
| `ai ai-arrow-down` | azionicons | arrow, down, direction, navigate, move |
| `ai ai-arrow-left` | azionicons | arrow, left, direction, navigate, move |
| `ai ai-arrow-right-arrow-left` | azionicons | arrow, right, left, direction, navigate, move |
| `ai ai-arrow-right` | azionicons | arrow, right, direction, navigate, move |
| `ai ai-arrow-up-left` | azionicons | arrow, left, direction, navigate, move |
| `ai ai-arrow-up-right-and-arrow-down-left-from-center` | azionicons | arrow, right, and, down, left, from, center, direction, navigate, move |
| `ai ai-arrow-up-right` | azionicons | arrow, right, direction, navigate, move |
| `ai ai-arrow-up` | azionicons | arrow, direction, navigate, move |
| `ai ai-arrows-alt` | azionicons | arrows, alt, move, resize, direction |
| `ai ai-arrows-h` | azionicons | arrows, move, resize, direction |
| `ai ai-arrows-v` | azionicons | arrows, move, resize, direction |
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
| `ai ai-bars` | azionicons | menu, hamburger, navigation |
| `ai ai-bell-slash` | azionicons | bell, slash, notification, alert |
| `ai ai-bell` | azionicons | notification, alert |
| `ai ai-bolt` | azionicons | fast, lightning, power |
| `ai ai-book` | azionicons | docs, documentation, read |
| `ai ai-bookmark-fill` | azionicons | bookmark, fill, save, favorite |
| `ai ai-bookmark` | azionicons | save, favorite |
| `ai ai-bot-manager` | azionicons | bot, manager, robot, automation, security |
| `ai ai-box` | azionicons | package, product |
| `ai ai-branch` | azionicons | git, version |
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
| `ai ai-calendar-times` | azionicons | calendar, times, date, schedule, time, close, cancel, dismiss, x |
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
| `ai ai-check-circle` | azionicons | check, circle, done, success, confirm, ok, status, shape |
| `ai ai-check-square` | azionicons | check, square, done, success, confirm, ok |
| `ai ai-check` | azionicons | done, success, confirm, ok |
| `ai ai-chevron-circle-down` | azionicons | chevron, circle, down, arrow, expand, collapse, direction, status, shape |
| `ai ai-chevron-circle-left` | azionicons | chevron, circle, left, arrow, expand, collapse, direction, status, shape |
| `ai ai-chevron-circle-right` | azionicons | chevron, circle, right, arrow, expand, collapse, direction, status, shape |
| `ai ai-chevron-circle-up` | azionicons | chevron, circle, arrow, expand, collapse, direction, status, shape |
| `ai ai-chevron-down` | azionicons | chevron, down, arrow, expand, collapse, direction |
| `ai ai-chevron-left` | azionicons | chevron, left, arrow, expand, collapse, direction |
| `ai ai-chevron-right` | azionicons | chevron, right, arrow, expand, collapse, direction |
| `ai ai-chevron-up` | azionicons | chevron, arrow, expand, collapse, direction |
| `ai ai-circle-fill` | azionicons | circle, fill, status, shape |
| `ai ai-circle-half` | azionicons | circle, half, status, shape |
| `ai ai-circle-minus` | azionicons | circle, minus, status, shape, remove, subtract, collapse |
| `ai ai-circle-off` | azionicons | circle, off, status, shape |
| `ai ai-circle-on` | azionicons | circle, status, shape |
| `ai ai-circle` | azionicons | status, shape |
| `ai ai-claude` | azionicons | brand, logo |
| `ai ai-clipboard` | azionicons | copy, paste |
| `ai ai-clock` | azionicons | time, schedule, history |
| `ai ai-clone` | azionicons | copy, duplicate |
| `ai ai-cloud-download` | azionicons | cloud, download, hosting, storage, save, export |
| `ai ai-cloud-upload` | azionicons | cloud, upload, hosting, storage, import, send |
| `ai ai-cloud` | azionicons | hosting, storage |
| `ai ai-code` | azionicons | developer, source, snippet |
| `ai ai-cog` | azionicons | settings, gear, preferences, configuration |
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
| `ai ai-directions-alt` | azionicons | directions, alt, route, navigation, map |
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
| `ai ai-ellipsis-h` | azionicons | ellipsis, more, menu, actions, overflow |
| `ai ai-ellipsis-v` | azionicons | ellipsis, more, menu, actions, overflow |
| `ai ai-enabled` | azionicons | on, active, status |
| `ai ai-envelope` | azionicons | email, mail, message |
| `ai ai-equals` | azionicons | equal, math |
| `ai ai-eraser` | azionicons | clear, erase |
| `ai ai-euro` | azionicons | money, currency |
| `ai ai-exclamation-circle` | azionicons | exclamation, circle, warning, error, alert, status, shape |
| `ai ai-exclamation-triangle` | azionicons | exclamation, triangle, warning, error, alert |
| `ai ai-expand` | azionicons | fullscreen, maximize |
| `ai ai-external-link` | azionicons | external, link, open, new tab, link out, url, chain, hyperlink |
| `ai ai-eye-slash` | azionicons | eye, slash, hide, hidden, invisible, view, show, visible, preview |
| `ai ai-eye` | azionicons | view, show, visible, preview |
| `ai ai-face-smile` | azionicons | face, smile |
| `ai ai-facebook` | azionicons | brand, logo |
| `ai ai-fast-backward` | azionicons | fast, backward, previous, rewind |
| `ai ai-fast-forward` | azionicons | fast, forward, next, skip |
| `ai ai-file-arrow-up` | azionicons | file, arrow, document, page, direction, navigate, move |
| `ai ai-file-check` | azionicons | file, check, document, page, done, success, confirm, ok |
| `ai ai-file-edit` | azionicons | file, edit, document, page |
| `ai ai-file-excel` | azionicons | file, excel, document, page |
| `ai ai-file-export` | azionicons | file, export, document, page |
| `ai ai-file-import` | azionicons | file, import, document, page |
| `ai ai-file-o` | azionicons | file, document, page |
| `ai ai-file-pdf` | azionicons | file, pdf, document, page |
| `ai ai-file-plus` | azionicons | file, plus, document, page, add, create, new |
| `ai ai-file-word` | azionicons | file, word, document, page |
| `ai ai-file` | azionicons | document, page |
| `ai ai-filter-alt` | azionicons | filter, alt, funnel, refine, narrow |
| `ai ai-filter-fill` | azionicons | filter, fill, funnel, refine, narrow |
| `ai ai-filter-slash` | azionicons | filter, slash, funnel, refine, narrow |
| `ai ai-filter` | azionicons | funnel, refine, narrow |
| `ai ai-flag-fill` | azionicons | flag, fill, report, mark |
| `ai ai-flag` | azionicons | report, mark |
| `ai ai-folder-open` | azionicons | folder, open, directory, files, openai, brand, logo |
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
| `ai ai-hashtag` | azionicons | tag, number, channel |
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
| `ai ai-info-circle` | azionicons | info, circle, information, help, about, status, shape |
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
| `ai ai-lightbulb` | azionicons | idea, tip, hint |
| `ai ai-link` | azionicons | url, chain, hyperlink |
| `ai ai-linkedin` | azionicons | brand, logo |
| `ai ai-list-check` | azionicons | list, check, tasks, todo, checklist, items, bullets, done, success, confirm, ok |
| `ai ai-list` | azionicons | items, bullets |
| `ai ai-live-ingest` | azionicons | live, ingest |
| `ai ai-load-balancer` | azionicons | load, balancer, traffic, distribution, origin |
| `ai ai-lock-open` | azionicons | lock, open, unlock, public, unlocked, secure, private, password, locked, openai, brand, logo |
| `ai ai-lock` | azionicons | secure, private, password, locked |
| `ai ai-lora` | azionicons | fine-tuning, ai, model |
| `ai ai-map-marker` | azionicons | map, marker, location, pin, place, geo |
| `ai ai-map` | azionicons | location, geo |
| `ai ai-marketplace` | azionicons | templates, store, integrations |
| `ai ai-mars` | azionicons | male, gender |
| `ai ai-mcp-logo` | azionicons | mcp, logo, brand |
| `ai ai-medium` | azionicons | brand, logo |
| `ai ai-megaphone` | azionicons | announcement, marketing, news |
| `ai ai-meta` | azionicons | brand, logo |
| `ai ai-microchip-ai` | azionicons | microchip, hardware, processor, compute, artificial intelligence, llm, model |
| `ai ai-microchip` | azionicons | hardware, processor, compute |
| `ai ai-microphone` | azionicons | audio, voice, record |
| `ai ai-microsoft-copilot` | azionicons | microsoft, copilot, brand, logo |
| `ai ai-minus` | azionicons | remove, subtract, collapse |
| `ai ai-mistral` | azionicons | brand, logo |
| `ai ai-mobile` | azionicons | phone, device, smartphone |
| `ai ai-money-bill` | azionicons | money, bill, payment, billing, cash |
| `ai ai-moon` | azionicons | dark mode, night, theme |
| `ai ai-network-lists` | azionicons | network, lists, connectivity |
| `ai ai-next` | azionicons | brand, logo |
| `ai ai-nitro` | azionicons | server, framework, unjs, brand, logo |
| `ai ai-nuxt` | azionicons | brand, logo |
| `ai ai-objects-column` | azionicons | objects, column, layout, grid |
| `ai ai-observe-pillar` | azionicons | observe, pillar, observability, monitoring, product family |
| `ai ai-open` | azionicons | openai, brand, logo |
| `ai ai-origin-accelerator` | azionicons | origin, accelerator, backend, server, performance, speed, product |
| `ai ai-origin-shield` | azionicons | origin, shield, backend, server, security, protection, safe |
| `ai ai-palette` | azionicons | color, theme, design |
| `ai ai-paperclip` | azionicons | attachment, attach |
| `ai ai-pause-circle` | azionicons | pause, circle, stop, hold, status, shape |
| `ai ai-pause` | azionicons | stop, hold |
| `ai ai-pen-to-square` | azionicons | pen, square, edit, write |
| `ai ai-pencil` | azionicons | edit, write, rename |
| `ai ai-percentage` | azionicons | percent, discount, rate |
| `ai ai-perplexity` | azionicons | brand, logo |
| `ai ai-phone` | azionicons | call, contact |
| `ai ai-play-circle` | azionicons | play, circle, start, run, video, status, shape |
| `ai ai-play` | azionicons | start, run, video |
| `ai ai-plus-circle` | azionicons | plus, circle, add, create, new, status, shape |
| `ai ai-plus` | azionicons | add, create, new |
| `ai ai-pound` | azionicons | currency, money, gbp |
| `ai ai-power-off` | azionicons | power, off, shut down, logout |
| `ai ai-pratices-review` | azionicons | pratices, review |
| `ai ai-preact` | azionicons | brand, logo |
| `ai ai-print` | azionicons | printer |
| `ai ai-professional-services` | azionicons | professional, services |
| `ai ai-qrcode` | azionicons | qr code, scan |
| `ai ai-question-circle` | azionicons | question, circle, help, faq, support, status, shape |
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
| `ai ai-scizors` | azionicons | scissors, cut |
| `ai ai-search-minus` | azionicons | search, minus, zoom out, find, magnifier, lookup, remove, subtract, collapse |
| `ai ai-search-plus` | azionicons | search, plus, zoom in, find, magnifier, lookup, add, create, new |
| `ai ai-search` | azionicons | find, magnifier, lookup |
| `ai ai-secure-pillar` | azionicons | secure, pillar, security, protection, product family |
| `ai ai-security-team` | azionicons | security, team, protection, shield |
| `ai ai-send` | azionicons | submit, paper plane, message |
| `ai ai-server` | azionicons | host, infrastructure, compute |
| `ai ai-share-alt` | azionicons | share, alt, send, social |
| `ai ai-shield` | azionicons | security, protection, safe |
| `ai ai-shop` | azionicons | store, commerce |
| `ai ai-shopping-bag` | azionicons | shopping, bag, commerce, buy |
| `ai ai-shopping-cart` | azionicons | shopping, cart, commerce, buy |
| `ai ai-sign-in` | azionicons | sign, login, log in, enter |
| `ai ai-sign-out` | azionicons | sign, out, logout, log out, exit |
| `ai ai-sitemap` | azionicons | hierarchy, tree, structure |
| `ai ai-slack` | azionicons | brand, logo |
| `ai ai-sliders-h` | azionicons | sliders, settings, controls, adjust, filters |
| `ai ai-sliders-v` | azionicons | sliders, settings, controls, adjust, filters |
| `ai ai-sort-alpha-down-alt` | azionicons | sort, alpha, down, alt, order, arrange |
| `ai ai-sort-alpha-down` | azionicons | sort, alpha, down, order, arrange |
| `ai ai-sort-alpha-up-alt` | azionicons | sort, alpha, alt, order, arrange |
| `ai ai-sort-alpha-up` | azionicons | sort, alpha, order, arrange |
| `ai ai-sort-alt-slash` | azionicons | sort, alt, slash, order, arrange |
| `ai ai-sort-alt` | azionicons | sort, alt, order, arrange |
| `ai ai-sort-amount-down-alt` | azionicons | sort, amount, down, alt, order, arrange |
| `ai ai-sort-amount-down` | azionicons | sort, amount, down, order, arrange |
| `ai ai-sort-amount-up-alt` | azionicons | sort, amount, alt, order, arrange |
| `ai ai-sort-amount-up` | azionicons | sort, amount, order, arrange |
| `ai ai-sort-down-fill` | azionicons | sort, down, fill, order, arrange |
| `ai ai-sort-down` | azionicons | sort, down, order, arrange |
| `ai ai-sort-numeric-down-alt` | azionicons | sort, numeric, down, alt, order, arrange |
| `ai ai-sort-numeric-down` | azionicons | sort, numeric, down, order, arrange |
| `ai ai-sort-numeric-up-alt` | azionicons | sort, numeric, alt, order, arrange |
| `ai ai-sort-numeric-up` | azionicons | sort, numeric, order, arrange |
| `ai ai-sort-up-fill` | azionicons | sort, fill, order, arrange |
| `ai ai-sort-up` | azionicons | sort, order, arrange |
| `ai ai-sort` | azionicons | order, arrange |
| `ai ai-sparkles` | azionicons | ai, magic, new, generate |
| `ai ai-spinner-dotted` | azionicons | spinner, dotted, loading, progress, busy |
| `ai ai-spinner` | azionicons | loading, progress, busy |
| `ai ai-sql` | azionicons | database, query |
| `ai ai-star-fill` | azionicons | star, fill, favorite, rating |
| `ai ai-star-half-fill` | azionicons | star, half, fill, favorite, rating |
| `ai ai-star-half` | azionicons | star, half, favorite, rating |
| `ai ai-star` | azionicons | favorite, rating |
| `ai ai-stencil` | azionicons | web components, compiler, framework, brand, logo |
| `ai ai-step-backward-alt` | azionicons | step, backward, alt, previous, rewind |
| `ai ai-step-backward` | azionicons | step, backward, previous, rewind |
| `ai ai-step-forward-alt` | azionicons | step, forward, alt, next, skip |
| `ai ai-step-forward` | azionicons | step, forward, next, skip |
| `ai ai-stop-circle` | azionicons | stop, circle, halt, end, status, shape |
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
| `ai ai-th-large` | azionicons | large, grid, tiles, layout |
| `ai ai-thumbs-down-fill` | azionicons | thumbs, down, fill, dislike, bad, feedback |
| `ai ai-thumbs-down` | azionicons | thumbs, down, dislike, bad, feedback |
| `ai ai-thumbs-up-fill` | azionicons | thumbs, fill, like, good, feedback |
| `ai ai-thumbs-up` | azionicons | thumbs, like, good, feedback |
| `ai ai-thumbtack` | azionicons | pin |
| `ai ai-ticket` | azionicons | support, issue |
| `ai ai-tiered-cache` | azionicons | tiered, cache |
| `ai ai-times-circle` | azionicons | times, circle, close, error, clear, cancel, dismiss, x, status, shape |
| `ai ai-times` | azionicons | close, cancel, dismiss, x |
| `ai ai-trash` | azionicons | delete, remove, bin |
| `ai ai-trophy` | azionicons | award, winner |
| `ai ai-truck` | azionicons | delivery, shipping |
| `ai ai-turkish-lira` | azionicons | turkish, lira |
| `ai ai-turso` | azionicons | brand, logo |
| `ai ai-twitch` | azionicons | brand, logo |
| `ai ai-undo` | azionicons | revert, back |
| `ai ai-unlock` | azionicons | open, unlocked |
| `ai ai-upload` | azionicons | import, send |
| `ai ai-user-edit` | azionicons | user, edit, person, account, profile |
| `ai ai-user-minus` | azionicons | user, minus, person, account, profile, remove, subtract, collapse |
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
| `ai ai-window-maximize` | azionicons | window, maximize, browser, app |
| `ai ai-window-minimize` | azionicons | window, minimize, browser, app |
| `ai ai-windsurf` | azionicons | brand, logo |
| `ai ai-workloads` | azionicons | domains, deploy, traffic |
| `ai ai-wrench` | azionicons | settings, tools, fix, maintenance |
| `ai ai-x` | azionicons | brand, logo |
| `ai ai-youtube` | azionicons | brand, logo |
| `ai-cor ai-angular` | color | brand, logo |
| `ai-cor ai-astro` | color | brand, logo |
| `ai-cor ai-azuredevops` | color | brand, logo |
| `ai-cor ai-bitbucket` | color | brand, logo |
| `ai-cor ai-claude` | color | brand, logo |
| `ai-cor ai-cursor` | color | brand, logo |
| `ai-cor ai-deepseek` | color | brand, logo |
| `ai-cor ai-discord` | color | brand, logo |
| `ai-cor ai-flutter` | color | brand, logo |
| `ai-cor ai-gemini` | color | brand, logo |
| `ai-cor ai-gitlab` | color | brand, logo |
| `ai-cor ai-google` | color | brand, logo |
| `ai-cor ai-graphql` | color | brand, logo |
| `ai-cor ai-grok` | color | brand, logo |
| `ai-cor ai-html` | color | markup, web, brand |
| `ai-cor ai-js` | color | brand, logo |
| `ai-cor ai-kotlin` | color | brand, logo |
| `ai-cor ai-meta` | color | brand, logo |
| `ai-cor ai-microsoft-copilot` | color | microsoft, copilot, brand, logo |
| `ai-cor ai-mistral` | color | brand, logo |
| `ai-cor ai-next` | color | brand, logo |
| `ai-cor ai-nuxt` | color | brand, logo |
| `ai-cor ai-open` | color | openai, brand, logo |
| `ai-cor ai-perplexity` | color | brand, logo |
| `ai-cor ai-qwen` | color | brand, logo |
| `ai-cor ai-react` | color | brand, logo |
| `ai-cor ai-redwood` | color | brand, logo |
| `ai-cor ai-solidjs` | color | brand, logo |
| `ai-cor ai-svelte` | color | brand, logo |
| `ai-cor ai-terraform` | color | infrastructure as code, iac, brand, logo |
| `ai-cor ai-ts` | color | brand, logo |
| `ai-cor ai-vue` | color | brand, logo |
| `ai-cor ai-windsurf` | color | brand, logo |
| `ai-cor ai-x` | color | brand, logo |
| `ai-cor ai-youtube` | color | brand, logo |
