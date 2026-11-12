# Icons

> Every icon class of `@aziontech/icons` with search keywords.

A monochrome icon is `ai ai-<name>` (Azion) or `pi pi-<name>` (PrimeIcons), coloured by the text colour; a colour brand icon is `ai-cor ai-<name>`. Import `@aziontech/icons` once at the app entry; an `icon` prop takes the class string.

495 names. These are the only values the components accept. An unknown class renders nothing. The MCP tool `list_assets({ kind: "icons" })` returns the same list (with a `query` to filter), and `catalog.json#assets.icons` points at it as data.

Used by: [Alert](../components/alert.md), [ArtifactPreview](../components/artifact-preview.md), [Avatar](../components/avatar.md), [Button](../components/button.md), [ButtonHighlight](../components/button-highlight.md), [DocCard](../components/doc-card.md), [DocItem](../components/doc-item.md), [DocPrompt](../components/doc-prompt.md), [EmptyState](../components/empty-state.md), [FileDropzone](../components/file-dropzone.md), [IconButton](../components/icon-button.md), [Link](../components/link.md), [MiniButton](../components/mini-button.md), [SettingsSection](../components/settings-section.md), [SplitButton](../components/split-button.md), [Tag](../components/tag.md), [Topic](../components/topic.md).

## Usage

```vue
<script setup>
  import '@aziontech/icons'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <i class="ai ai-edge-firewall" aria-hidden="true"></i>
  <i class="pi pi-trash" aria-hidden="true"></i>
  <i class="ai-cor ai-react" aria-hidden="true"></i>
  <Button icon="pi pi-plus">Create</Button>
</template>
```

## Names

| Class | Set | Keywords |
| --- | --- | --- |
| `ai ai-abuse-prevention` | azionicons | abuse, prevention, fraud, security |
| `ai ai-adaptive-security` | azionicons | adaptive, security, protection, shield |
| `ai ai-ai-gateway` | azionicons | gateway, artificial intelligence, llm, model, proxy, api, routing |
| `ai ai-ai-pillar` | azionicons | pillar, artificial intelligence, llm, model, product family |
| `ai ai-angular` | azionicons | brand, logo |
| `ai ai-app-accelerator` | azionicons | app, accelerator, performance, speed, product |
| `ai ai-ask-azion` | azionicons | ask, azion, question, assistant, chat, brand, logo, company |
| `ai ai-astro` | azionicons | brand, logo |
| `ai ai-attack` | azionicons | threat, security, ddos |
| `ai ai-azion-api` | azionicons | azion, api, brand, logo, company, endpoint, integration, developer |
| `ai ai-azion-cli` | azionicons | azion, cli, brand, logo, company, terminal, command line, console |
| `ai ai-azion` | azionicons | brand, logo, company |
| `ai ai-bot-manager` | azionicons | bot, manager, robot, automation, security |
| `ai ai-branch` | azionicons | git, version |
| `ai ai-build-pillar` | azionicons | build, pillar, product family |
| `ai ai-business-support` | azionicons | business, support, help, service |
| `ai ai-certificate-manager` | azionicons | certificate, manager, tls, ssl, security, https |
| `ai ai-circle-half` | azionicons | circle, half, status, shape |
| `ai ai-circle-minus` | azionicons | circle, minus, status, shape, remove, subtract, collapse |
| `ai ai-claude` | azionicons | brand, logo |
| `ai ai-column` | azionicons | layout, grid |
| `ai ai-configuration-service` | azionicons | configuration, service, settings, preferences |
| `ai ai-content-delivery` | azionicons | content, delivery |
| `ai ai-cursor` | azionicons | brand, logo |
| `ai ai-custom-pages` | azionicons | custom, pages |
| `ai ai-data-stream` | azionicons | data, stream, logs, events |
| `ai ai-database` | azionicons | data, storage, sql |
| `ai ai-datasheet` | azionicons | document, specification |
| `ai ai-deepseek` | azionicons | brand, logo |
| `ai ai-deploy-pillar` | azionicons | deploy, pillar, release, publish, ship, product family |
| `ai ai-digital-certificates` | azionicons | digital, certificates, certificate, security, tls, ssl, https |
| `ai ai-disabled` | azionicons | off, inactive, status |
| `ai ai-discord` | azionicons | brand, logo |
| `ai ai-docusaurus` | azionicons | brand, logo |
| `ai ai-domains` | azionicons | dns, url, workload |
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
| `ai ai-eleventy` | azionicons | brand, logo |
| `ai ai-enabled` | azionicons | on, active, status |
| `ai ai-filter-alt` | azionicons | filter, alt, funnel, refine, narrow |
| `ai ai-gateway` | azionicons | proxy, api, routing |
| `ai ai-gatsby` | azionicons | brand, logo |
| `ai ai-gemini` | azionicons | brand, logo |
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
| `ai ai-graphql` | azionicons | brand, logo |
| `ai ai-grok` | azionicons | brand, logo |
| `ai ai-hexo` | azionicons | brand, logo |
| `ai ai-home` | azionicons | house, start, dashboard |
| `ai ai-hono` | azionicons | brand, logo |
| `ai ai-html` | azionicons | markup, web, brand |
| `ai ai-hugo` | azionicons | brand, logo |
| `ai ai-image-processor` | azionicons | image, processor, picture, photo, media |
| `ai ai-instructor` | azionicons | teacher, training, course |
| `ai ai-integration-services` | azionicons | integration, services |
| `ai ai-jekyll` | azionicons | brand, logo |
| `ai ai-json-text` | azionicons | json, text, data, format, code |
| `ai ai-json` | azionicons | data, format, code |
| `ai ai-layers` | azionicons | stack, levels |
| `ai ai-live-ingest` | azionicons | live, ingest |
| `ai ai-load-balancer` | azionicons | load, balancer, traffic, distribution, origin |
| `ai ai-lora` | azionicons | fine-tuning, ai, model |
| `ai ai-marketplace` | azionicons | templates, store, integrations |
| `ai ai-mcp-logo` | azionicons | mcp, logo, brand |
| `ai ai-medium` | azionicons | brand, logo |
| `ai ai-meta` | azionicons | brand, logo |
| `ai ai-microsoft-copilot` | azionicons | microsoft, copilot, brand, logo |
| `ai ai-mistral` | azionicons | brand, logo |
| `ai ai-network-lists` | azionicons | network, lists, connectivity |
| `ai ai-next` | azionicons | brand, logo |
| `ai ai-nitro` | azionicons | server, framework, unjs, brand, logo |
| `ai ai-nuxt` | azionicons | brand, logo |
| `ai ai-observe-pillar` | azionicons | observe, pillar, observability, monitoring, product family |
| `ai ai-open` | azionicons | openai, brand, logo |
| `ai ai-origin-accelerator` | azionicons | origin, accelerator, backend, server, performance, speed, product |
| `ai ai-origin-shield` | azionicons | origin, shield, backend, server, security, protection, safe |
| `ai ai-perplexity` | azionicons | brand, logo |
| `ai ai-pratices-review` | azionicons | pratices, review |
| `ai ai-preact` | azionicons | brand, logo |
| `ai ai-professional-services` | azionicons | professional, services |
| `ai ai-qwen` | azionicons | brand, logo |
| `ai ai-qwik` | azionicons | brand, logo |
| `ai ai-react` | azionicons | brand, logo |
| `ai ai-real-time-events` | azionicons | real, time, events |
| `ai ai-real-time-metrics` | azionicons | real, time, metrics, analytics, observability, charts |
| `ai ai-real-time-purge` | azionicons | real, time, purge, cache, clear, invalidate |
| `ai ai-redis` | azionicons | brand, logo |
| `ai ai-remix` | azionicons | brand, logo |
| `ai ai-rss` | azionicons | feed, subscribe, news |
| `ai ai-rules-engine` | azionicons | rules, engine, logic, conditions, behavior |
| `ai ai-sase` | azionicons | secure access, network security, zero trust |
| `ai ai-scizors` | azionicons | scissors, cut |
| `ai ai-secure-pillar` | azionicons | secure, pillar, security, protection, product family |
| `ai ai-security-team` | azionicons | security, team, protection, shield |
| `ai ai-sparkles` | azionicons | ai, magic, new, generate |
| `ai ai-sql` | azionicons | database, query |
| `ai ai-stencil` | azionicons | web components, compiler, framework, brand, logo |
| `ai ai-store` | azionicons | shop, marketplace |
| `ai ai-svelte` | azionicons | brand, logo |
| `ai ai-technical-account` | azionicons | technical, account |
| `ai ai-technical-support` | azionicons | technical, support, help, service |
| `ai ai-terraform` | azionicons | infrastructure as code, iac, brand, logo |
| `ai ai-tiered-cache` | azionicons | tiered, cache |
| `ai ai-turso` | azionicons | brand, logo |
| `ai ai-twitch` | azionicons | brand, logo |
| `ai ai-variables` | azionicons | environment, env, config |
| `ai ai-vite` | azionicons | brand, logo |
| `ai ai-vitepress` | azionicons | brand, logo |
| `ai ai-vue` | azionicons | brand, logo |
| `ai ai-vuepress` | azionicons | brand, logo |
| `ai ai-waf-rules` | azionicons | waf, rules, web application firewall, security, logic, conditions, behavior |
| `ai ai-webhook` | azionicons | integration, callback, events |
| `ai ai-windsurf` | azionicons | brand, logo |
| `ai ai-workloads` | azionicons | domains, deploy, traffic |
| `ai ai-x` | azionicons | brand, logo |
| `ai ai-youtube` | azionicons | brand, logo |
| `ai ai-sparkles` | primeicons | ai, magic, new, generate |
| `pi pi-address-book` | primeicons | address, book, contacts, people, docs, documentation, read |
| `pi pi-align-center` | primeicons | align, center, text, alignment, format |
| `pi pi-align-justify` | primeicons | align, justify, text, alignment, format |
| `pi pi-align-left` | primeicons | align, left, text, alignment, format |
| `pi pi-align-right` | primeicons | align, right, text, alignment, format |
| `pi pi-amazon` | primeicons | aws, brand, logo |
| `pi pi-android` | primeicons | brand, logo |
| `pi pi-angle-double-down` | primeicons | angle, double, down, chevron, arrow, direction |
| `pi pi-angle-double-left` | primeicons | angle, double, left, chevron, arrow, direction |
| `pi pi-angle-double-right` | primeicons | angle, double, right, chevron, arrow, direction |
| `pi pi-angle-double-up` | primeicons | angle, double, chevron, arrow, direction |
| `pi pi-angle-down` | primeicons | angle, down, chevron, arrow, direction |
| `pi pi-angle-left` | primeicons | angle, left, chevron, arrow, direction |
| `pi pi-angle-right` | primeicons | angle, right, chevron, arrow, direction |
| `pi pi-angle-up` | primeicons | angle, chevron, arrow, direction |
| `pi pi-apple` | primeicons | brand, logo |
| `pi pi-arrow-circle-down` | primeicons | arrow, circle, down, direction, navigate, move, status, shape |
| `pi pi-arrow-circle-left` | primeicons | arrow, circle, left, direction, navigate, move, status, shape |
| `pi pi-arrow-circle-right` | primeicons | arrow, circle, right, direction, navigate, move, status, shape |
| `pi pi-arrow-circle-up` | primeicons | arrow, circle, direction, navigate, move, status, shape |
| `pi pi-arrow-down-left-and-arrow-up-right-to-center` | primeicons | arrow, down, left, and, right, center, direction, navigate, move |
| `pi pi-arrow-down-left` | primeicons | arrow, down, left, direction, navigate, move |
| `pi pi-arrow-down-right` | primeicons | arrow, down, right, direction, navigate, move |
| `pi pi-arrow-down` | primeicons | arrow, down, direction, navigate, move |
| `pi pi-arrow-left` | primeicons | arrow, left, direction, navigate, move |
| `pi pi-arrow-right-arrow-left` | primeicons | arrow, right, left, direction, navigate, move |
| `pi pi-arrow-right` | primeicons | arrow, right, direction, navigate, move |
| `pi pi-arrow-up-left` | primeicons | arrow, left, direction, navigate, move |
| `pi pi-arrow-up-right-and-arrow-down-left-from-center` | primeicons | arrow, right, and, down, left, from, center, direction, navigate, move |
| `pi pi-arrow-up-right` | primeicons | arrow, right, direction, navigate, move |
| `pi pi-arrow-up` | primeicons | arrow, direction, navigate, move |
| `pi pi-arrows-alt` | primeicons | arrows, alt, move, resize, direction |
| `pi pi-arrows-h` | primeicons | arrows, move, resize, direction |
| `pi pi-arrows-v` | primeicons | arrows, move, resize, direction |
| `pi pi-asterisk` | primeicons | required, star |
| `pi pi-at` | primeicons | email, mention |
| `pi pi-backward` | primeicons | previous, rewind |
| `pi pi-ban` | primeicons | block, forbidden, deny |
| `pi pi-barcode` | primeicons | scan, product code |
| `pi pi-bars` | primeicons | menu, hamburger, navigation |
| `pi pi-bell-slash` | primeicons | bell, slash, notification, alert |
| `pi pi-bell` | primeicons | notification, alert |
| `pi pi-bitcoin` | primeicons | brand, logo |
| `pi pi-bolt` | primeicons | fast, lightning, power |
| `pi pi-book` | primeicons | docs, documentation, read |
| `pi pi-bookmark-fill` | primeicons | bookmark, fill, save, favorite |
| `pi pi-bookmark` | primeicons | save, favorite |
| `pi pi-box` | primeicons | package, product |
| `pi pi-briefcase` | primeicons | work, business |
| `pi pi-building-columns` | primeicons | building, columns, company, organization, office |
| `pi pi-building` | primeicons | company, organization, office |
| `pi pi-bullseye` | primeicons | target, goal |
| `pi pi-calculator` | primeicons | math, pricing |
| `pi pi-calendar-clock` | primeicons | calendar, clock, date, schedule, time, history |
| `pi pi-calendar-minus` | primeicons | calendar, minus, date, schedule, time, remove, subtract, collapse |
| `pi pi-calendar-plus` | primeicons | calendar, plus, date, schedule, time, add, create, new |
| `pi pi-calendar-times` | primeicons | calendar, times, date, schedule, time, close, cancel, dismiss, x |
| `pi pi-calendar` | primeicons | date, schedule, time |
| `pi pi-camera` | primeicons | photo, picture |
| `pi pi-car` | primeicons | vehicle, automotive |
| `pi pi-caret-down` | primeicons | caret, down, arrow, dropdown, triangle |
| `pi pi-caret-left` | primeicons | caret, left, arrow, dropdown, triangle |
| `pi pi-caret-right` | primeicons | caret, right, arrow, dropdown, triangle |
| `pi pi-caret-up` | primeicons | caret, arrow, dropdown, triangle |
| `pi pi-cart-arrow-down` | primeicons | cart, arrow, down, shopping, commerce, buy, direction, navigate, move |
| `pi pi-cart-minus` | primeicons | cart, minus, shopping, commerce, buy, remove, subtract, collapse |
| `pi pi-cart-plus` | primeicons | cart, plus, shopping, commerce, buy, add, create, new |
| `pi pi-chart-bar` | primeicons | chart, bar, graph, analytics, metrics |
| `pi pi-chart-line` | primeicons | chart, line, graph, analytics, metrics |
| `pi pi-chart-pie` | primeicons | chart, pie, graph, analytics, metrics |
| `pi pi-chart-scatter` | primeicons | chart, scatter, graph, analytics, metrics |
| `pi pi-check-circle` | primeicons | check, circle, done, success, confirm, ok, status, shape |
| `pi pi-check-square` | primeicons | check, square, done, success, confirm, ok |
| `pi pi-check` | primeicons | done, success, confirm, ok |
| `pi pi-chevron-circle-down` | primeicons | chevron, circle, down, arrow, expand, collapse, direction, status, shape |
| `pi pi-chevron-circle-left` | primeicons | chevron, circle, left, arrow, expand, collapse, direction, status, shape |
| `pi pi-chevron-circle-right` | primeicons | chevron, circle, right, arrow, expand, collapse, direction, status, shape |
| `pi pi-chevron-circle-up` | primeicons | chevron, circle, arrow, expand, collapse, direction, status, shape |
| `pi pi-chevron-down` | primeicons | chevron, down, arrow, expand, collapse, direction |
| `pi pi-chevron-left` | primeicons | chevron, left, arrow, expand, collapse, direction |
| `pi pi-chevron-right` | primeicons | chevron, right, arrow, expand, collapse, direction |
| `pi pi-chevron-up` | primeicons | chevron, arrow, expand, collapse, direction |
| `pi pi-circle-fill` | primeicons | circle, fill, status, shape |
| `pi pi-circle-off` | primeicons | circle, off, status, shape |
| `pi pi-circle-on` | primeicons | circle, status, shape |
| `pi pi-circle` | primeicons | status, shape |
| `pi pi-claude` | primeicons | brand, logo |
| `pi pi-clipboard` | primeicons | copy, paste |
| `pi pi-clock` | primeicons | time, schedule, history |
| `pi pi-clone` | primeicons | copy, duplicate |
| `pi pi-cloud-download` | primeicons | cloud, download, hosting, storage, save, export |
| `pi pi-cloud-upload` | primeicons | cloud, upload, hosting, storage, import, send |
| `pi pi-cloud` | primeicons | hosting, storage |
| `pi pi-code` | primeicons | developer, source, snippet |
| `pi pi-cog` | primeicons | settings, gear, preferences, configuration |
| `pi pi-comment` | primeicons | chat, message, feedback |
| `pi pi-comments` | primeicons | chat, messages, discussion |
| `pi pi-compass` | primeicons | explore, navigation |
| `pi pi-copy` | primeicons | duplicate, clipboard |
| `pi pi-credit-card` | primeicons | credit, card, payment, billing |
| `pi pi-crown` | primeicons | premium, plan, pro |
| `pi pi-database` | primeicons | data, storage, sql |
| `pi pi-delete-left` | primeicons | delete, left, remove, erase |
| `pi pi-desktop` | primeicons | computer, screen, device |
| `pi pi-directions-alt` | primeicons | directions, alt, route, navigation, map |
| `pi pi-directions` | primeicons | route, navigation, map |
| `pi pi-discord` | primeicons | brand, logo |
| `pi pi-dollar` | primeicons | money, price, billing, currency |
| `pi pi-download` | primeicons | save, export |
| `pi pi-eject` | primeicons | remove, unmount |
| `pi pi-ellipsis-h` | primeicons | ellipsis, more, menu, actions, overflow |
| `pi pi-ellipsis-v` | primeicons | ellipsis, more, menu, actions, overflow |
| `pi pi-envelope` | primeicons | email, mail, message |
| `pi pi-equals` | primeicons | equal, math |
| `pi pi-eraser` | primeicons | clear, erase |
| `pi pi-ethereum` | primeicons | brand, logo |
| `pi pi-euro` | primeicons | money, currency |
| `pi pi-exclamation-circle` | primeicons | exclamation, circle, warning, error, alert, status, shape |
| `pi pi-exclamation-triangle` | primeicons | exclamation, triangle, warning, error, alert |
| `pi pi-expand` | primeicons | fullscreen, maximize |
| `pi pi-external-link` | primeicons | external, link, open, new tab, link out, url, chain, hyperlink |
| `pi pi-eye-slash` | primeicons | eye, slash, hide, hidden, invisible, view, show, visible, preview |
| `pi pi-eye` | primeicons | view, show, visible, preview |
| `pi pi-face-smile` | primeicons | face, smile |
| `pi pi-facebook` | primeicons | brand, logo |
| `pi pi-fast-backward` | primeicons | fast, backward, previous, rewind |
| `pi pi-fast-forward` | primeicons | fast, forward, next, skip |
| `pi pi-file-arrow-up` | primeicons | file, arrow, document, page, direction, navigate, move |
| `pi pi-file-check` | primeicons | file, check, document, page, done, success, confirm, ok |
| `pi pi-file-edit` | primeicons | file, edit, document, page |
| `pi pi-file-excel` | primeicons | file, excel, document, page |
| `pi pi-file-export` | primeicons | file, export, document, page |
| `pi pi-file-import` | primeicons | file, import, document, page |
| `pi pi-file-o` | primeicons | file, document, page |
| `pi pi-file-pdf` | primeicons | file, pdf, document, page |
| `pi pi-file-plus` | primeicons | file, plus, document, page, add, create, new |
| `pi pi-file-word` | primeicons | file, word, document, page |
| `pi pi-file` | primeicons | document, page |
| `pi pi-filter-fill` | primeicons | filter, fill, funnel, refine, narrow |
| `pi pi-filter-slash` | primeicons | filter, slash, funnel, refine, narrow |
| `pi pi-filter` | primeicons | funnel, refine, narrow |
| `pi pi-flag-fill` | primeicons | flag, fill, report, mark |
| `pi pi-flag` | primeicons | report, mark |
| `pi pi-folder-open` | primeicons | folder, open, directory, files, openai, brand, logo |
| `pi pi-folder-plus` | primeicons | folder, plus, directory, files, add, create, new |
| `pi pi-folder` | primeicons | directory, files |
| `pi pi-forward` | primeicons | next, skip |
| `pi pi-gauge` | primeicons | performance, speed, meter |
| `pi pi-gemini` | primeicons | brand, logo |
| `pi pi-gift` | primeicons | present, reward |
| `pi pi-github` | primeicons | brand, logo |
| `pi pi-globe` | primeicons | world, global, language, web |
| `pi pi-google` | primeicons | brand, logo |
| `pi pi-graduation-cap` | primeicons | graduation, cap, learn, education, course |
| `pi pi-hammer` | primeicons | build, tools |
| `pi pi-hashtag` | primeicons | tag, number, channel |
| `pi pi-headphones` | primeicons | support, audio |
| `pi pi-heart-fill` | primeicons | heart, fill, like, favorite, love |
| `pi pi-heart` | primeicons | like, favorite, love |
| `pi pi-history` | primeicons | recent, activity, audit, log |
| `pi pi-home` | primeicons | house, start, dashboard |
| `pi pi-hourglass` | primeicons | wait, pending, time |
| `pi pi-id-card` | primeicons | card, identity, profile, account |
| `pi pi-image` | primeicons | picture, photo, media |
| `pi pi-images` | primeicons | pictures, photos, gallery, media |
| `pi pi-inbox` | primeicons | messages, mail, empty |
| `pi pi-indian-rupee` | primeicons | indian, rupee |
| `pi pi-info-circle` | primeicons | info, circle, information, help, about, status, shape |
| `pi pi-info` | primeicons | information, help, about |
| `pi pi-instagram` | primeicons | brand, logo |
| `pi pi-key` | primeicons | password, token, secret, credential |
| `pi pi-language` | primeicons | translate, locale, i18n |
| `pi pi-lightbulb` | primeicons | idea, tip, hint |
| `pi pi-link` | primeicons | url, chain, hyperlink |
| `pi pi-linkedin` | primeicons | brand, logo |
| `pi pi-list-check` | primeicons | list, check, tasks, todo, checklist, items, bullets, done, success, confirm, ok |
| `pi pi-list` | primeicons | items, bullets |
| `pi pi-lock-open` | primeicons | lock, open, unlock, public, unlocked, secure, private, password, locked, openai, brand, logo |
| `pi pi-lock` | primeicons | secure, private, password, locked |
| `pi pi-map-marker` | primeicons | map, marker, location, pin, place, geo |
| `pi pi-map` | primeicons | location, geo |
| `pi pi-mars` | primeicons | male, gender |
| `pi pi-megaphone` | primeicons | announcement, marketing, news |
| `pi pi-microchip-ai` | primeicons | microchip, hardware, processor, compute, artificial intelligence, llm, model |
| `pi pi-microchip` | primeicons | hardware, processor, compute |
| `pi pi-microphone` | primeicons | audio, voice, record |
| `pi pi-microsoft` | primeicons | brand, logo |
| `pi pi-minus-circle` | primeicons | minus, circle, remove, subtract, collapse, status, shape |
| `pi pi-minus` | primeicons | remove, subtract, collapse |
| `pi pi-mobile` | primeicons | phone, device, smartphone |
| `pi pi-money-bill` | primeicons | money, bill, payment, billing, cash |
| `pi pi-moon` | primeicons | dark mode, night, theme |
| `pi pi-objects-column` | primeicons | objects, column, layout, grid |
| `pi pi-palette` | primeicons | color, theme, design |
| `pi pi-paperclip` | primeicons | attachment, attach |
| `pi pi-pause-circle` | primeicons | pause, circle, stop, hold, status, shape |
| `pi pi-pause` | primeicons | stop, hold |
| `pi pi-paypal` | primeicons | brand, logo |
| `pi pi-pen-to-square` | primeicons | pen, square, edit, write |
| `pi pi-pencil` | primeicons | edit, write, rename |
| `pi pi-percentage` | primeicons | percent, discount, rate |
| `pi pi-phone` | primeicons | call, contact |
| `pi pi-pinterest` | primeicons | brand, logo |
| `pi pi-play-circle` | primeicons | play, circle, start, run, video, status, shape |
| `pi pi-play` | primeicons | start, run, video |
| `pi pi-plus-circle` | primeicons | plus, circle, add, create, new, status, shape |
| `pi pi-plus` | primeicons | add, create, new |
| `pi pi-pound` | primeicons | currency, money, gbp |
| `pi pi-power-off` | primeicons | power, off, shut down, logout |
| `pi pi-prime` | primeicons | primevue, primefaces, brand |
| `pi pi-print` | primeicons | printer |
| `pi pi-qrcode` | primeicons | qr code, scan |
| `pi pi-question-circle` | primeicons | question, circle, help, faq, support, status, shape |
| `pi pi-question` | primeicons | help, faq, support |
| `pi pi-receipt` | primeicons | invoice, billing, payment |
| `pi pi-reddit` | primeicons | brand, logo |
| `pi pi-refresh` | primeicons | reload, sync, update |
| `pi pi-replay` | primeicons | repeat, retry |
| `pi pi-reply` | primeicons | answer, respond |
| `pi pi-save` | primeicons | disk, store |
| `pi pi-search-minus` | primeicons | search, minus, zoom out, find, magnifier, lookup, remove, subtract, collapse |
| `pi pi-search-plus` | primeicons | search, plus, zoom in, find, magnifier, lookup, add, create, new |
| `pi pi-search` | primeicons | find, magnifier, lookup |
| `pi pi-send` | primeicons | submit, paper plane, message |
| `pi pi-server` | primeicons | host, infrastructure, compute |
| `pi pi-share-alt` | primeicons | share, alt, send, social |
| `pi pi-shield` | primeicons | security, protection, safe |
| `pi pi-shop` | primeicons | store, commerce |
| `pi pi-shopping-bag` | primeicons | shopping, bag, commerce, buy |
| `pi pi-shopping-cart` | primeicons | shopping, cart, commerce, buy |
| `pi pi-sign-in` | primeicons | sign, login, log in, enter |
| `pi pi-sign-out` | primeicons | sign, out, logout, log out, exit |
| `pi pi-sitemap` | primeicons | hierarchy, tree, structure |
| `pi pi-slack` | primeicons | brand, logo |
| `pi pi-sliders-h` | primeicons | sliders, settings, controls, adjust, filters |
| `pi pi-sliders-v` | primeicons | sliders, settings, controls, adjust, filters |
| `pi pi-sort-alpha-down-alt` | primeicons | sort, alpha, down, alt, order, arrange |
| `pi pi-sort-alpha-down` | primeicons | sort, alpha, down, order, arrange |
| `pi pi-sort-alpha-up-alt` | primeicons | sort, alpha, alt, order, arrange |
| `pi pi-sort-alpha-up` | primeicons | sort, alpha, order, arrange |
| `pi pi-sort-alt-slash` | primeicons | sort, alt, slash, order, arrange |
| `pi pi-sort-alt` | primeicons | sort, alt, order, arrange |
| `pi pi-sort-amount-down-alt` | primeicons | sort, amount, down, alt, order, arrange |
| `pi pi-sort-amount-down` | primeicons | sort, amount, down, order, arrange |
| `pi pi-sort-amount-up-alt` | primeicons | sort, amount, alt, order, arrange |
| `pi pi-sort-amount-up` | primeicons | sort, amount, order, arrange |
| `pi pi-sort-down-fill` | primeicons | sort, down, fill, order, arrange |
| `pi pi-sort-down` | primeicons | sort, down, order, arrange |
| `pi pi-sort-numeric-down-alt` | primeicons | sort, numeric, down, alt, order, arrange |
| `pi pi-sort-numeric-down` | primeicons | sort, numeric, down, order, arrange |
| `pi pi-sort-numeric-up-alt` | primeicons | sort, numeric, alt, order, arrange |
| `pi pi-sort-numeric-up` | primeicons | sort, numeric, order, arrange |
| `pi pi-sort-up-fill` | primeicons | sort, fill, order, arrange |
| `pi pi-sort-up` | primeicons | sort, order, arrange |
| `pi pi-sort` | primeicons | order, arrange |
| `pi pi-sparkles` | primeicons | ai, magic, new, generate |
| `pi pi-spinner-dotted` | primeicons | spinner, dotted, loading, progress, busy |
| `pi pi-spinner` | primeicons | loading, progress, busy |
| `pi pi-star-fill` | primeicons | star, fill, favorite, rating |
| `pi pi-star-half-fill` | primeicons | star, half, fill, favorite, rating |
| `pi pi-star-half` | primeicons | star, half, favorite, rating |
| `pi pi-star` | primeicons | favorite, rating |
| `pi pi-step-backward-alt` | primeicons | step, backward, alt, previous, rewind |
| `pi pi-step-backward` | primeicons | step, backward, previous, rewind |
| `pi pi-step-forward-alt` | primeicons | step, forward, alt, next, skip |
| `pi pi-step-forward` | primeicons | step, forward, next, skip |
| `pi pi-stop-circle` | primeicons | stop, circle, halt, end, status, shape |
| `pi pi-stop` | primeicons | halt, end |
| `pi pi-stopwatch` | primeicons | timer, time, duration |
| `pi pi-sun` | primeicons | light mode, day, theme |
| `pi pi-sync` | primeicons | refresh, synchronize |
| `pi pi-table` | primeicons | grid, data, rows |
| `pi pi-tablet` | primeicons | device, ipad |
| `pi pi-tag` | primeicons | label, category |
| `pi pi-tags` | primeicons | labels, categories |
| `pi pi-telegram` | primeicons | brand, logo |
| `pi pi-th-large` | primeicons | large, grid, tiles, layout |
| `pi pi-thumbs-down-fill` | primeicons | thumbs, down, fill, dislike, bad, feedback |
| `pi pi-thumbs-down` | primeicons | thumbs, down, dislike, bad, feedback |
| `pi pi-thumbs-up-fill` | primeicons | thumbs, fill, like, good, feedback |
| `pi pi-thumbs-up` | primeicons | thumbs, like, good, feedback |
| `pi pi-thumbtack` | primeicons | pin |
| `pi pi-ticket` | primeicons | support, issue |
| `pi pi-tiktok` | primeicons | brand, logo |
| `pi pi-times-circle` | primeicons | times, circle, close, error, clear, cancel, dismiss, x, status, shape |
| `pi pi-times` | primeicons | close, cancel, dismiss, x |
| `pi pi-trash` | primeicons | delete, remove, bin |
| `pi pi-trophy` | primeicons | award, winner |
| `pi pi-truck` | primeicons | delivery, shipping |
| `pi pi-turkish-lira` | primeicons | turkish, lira |
| `pi pi-twitch` | primeicons | brand, logo |
| `pi pi-twitter` | primeicons | brand, logo |
| `pi pi-undo` | primeicons | revert, back |
| `pi pi-unlock` | primeicons | open, unlocked |
| `pi pi-upload` | primeicons | import, send |
| `pi pi-user-edit` | primeicons | user, edit, person, account, profile |
| `pi pi-user-minus` | primeicons | user, minus, person, account, profile, remove, subtract, collapse |
| `pi pi-user-plus` | primeicons | user, plus, person, account, profile, add, create, new |
| `pi pi-user` | primeicons | person, account, profile |
| `pi pi-users` | primeicons | people, team, members |
| `pi pi-venus` | primeicons | female, gender |
| `pi pi-verified` | primeicons | check, approved, badge |
| `pi pi-video` | primeicons | movie, media |
| `pi pi-vimeo` | primeicons | brand, logo |
| `pi pi-volume-down` | primeicons | volume, down, sound, audio |
| `pi pi-volume-off` | primeicons | volume, off, sound, audio |
| `pi pi-volume-up` | primeicons | volume, sound, audio |
| `pi pi-wallet` | primeicons | payment, money |
| `pi pi-warehouse` | primeicons | storage, inventory |
| `pi pi-wave-pulse` | primeicons | wave, pulse, activity, health, monitoring |
| `pi pi-whatsapp` | primeicons | brand, logo |
| `pi pi-wifi` | primeicons | network, wireless, connection |
| `pi pi-window-maximize` | primeicons | window, maximize, browser, app |
| `pi pi-window-minimize` | primeicons | window, minimize, browser, app |
| `pi pi-wrench` | primeicons | settings, tools, fix, maintenance |
| `pi pi-youtube` | primeicons | brand, logo |
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
