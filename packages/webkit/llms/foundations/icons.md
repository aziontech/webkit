# Icons

> Every icon class of `@aziontech/icons`, grouped as Azion (products, product features, platform, solutions, services), Interface (arrows, actions, status, files, media, communication, commerce, people, devices, data, l…

yout, objects, git) and External (frameworks, AI models, developer tools, languages, online services). A monochrome icon is `az az-<name>`, coloured by the text colour; a colour logo is `az-color az-<name>`. Pick an icon by what it stands for: a product icon names only that product. Import `@aziontech/icons` once at the app entry (the font); the colour logos come with the WebKit stylesheet, compiled only for the classes written whole in your sources. An `icon` prop takes the class string.

552 names. These are the only values the components accept. An unknown class renders nothing. The MCP tool `list_assets({ kind: "icons" })` returns the same list (with a `query` to filter), and `catalog.json#assets.icons` points at it as data.

Used by: [Alert](../components/alert.md), [ArtifactPreview](../components/artifact-preview.md), [Avatar](../components/avatar.md), [Button](../components/button.md), [Combobox](../components/combobox.md), [DocCard](../components/doc-card.md), [DocItem](../components/doc-item.md), [DocPrompt](../components/doc-prompt.md), [EmptyState](../components/empty-state.md), [FeatureItem](../components/feature-item.md), [FileDropzone](../components/file-dropzone.md), [HighlightButton](../components/highlight-button.md), [IconButton](../components/icon-button.md), [Link](../components/link.md), [SettingsGroup](../components/settings-group.md), [SplitButton](../components/split-button.md), [Tag](../components/tag.md).

## Usage

```vue
<script setup>
  import '@aziontech/icons'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <i class="az az-firewall" aria-hidden="true"></i>
  <i class="az az-trash" aria-hidden="true"></i>
  <i class="az-color az-react" aria-hidden="true"></i>
  <Button icon="az az-plus">Create</Button>
</template>
```

## Names

### Azion

Everything that is Azion's own: its products, the parts inside them, the platform, its solutions and its services.

#### Azion · Products

| Class | Product | Stands for | Keywords |
| --- | --- | --- | --- |
| `az az-ai-gateway` | AI Gateway | AI Gateway | artificial intelligence, llm, model, proxy, api, routing |
| `az az-ai-inference` | AI Inference | AI Inference | artificial intelligence, llm, model, serverless ai, edge ai |
| `az az-application-accelerator` | Application Accelerator | Application Accelerator | performance, speed, product, app accelerator |
| `az az-applications` | Applications | Applications | app, delivery, cache, rules, edge application |
| `az az-bot-manager` | Bot Manager | Bot Manager | robot, automation, security |
| `az az-certificate-manager` | Certificate Manager | Certificate Manager | tls, ssl, security, https |
| `az az-connectors` | Connectors | Connectors | integration, origin, edge connectors |
| `az az-custom-pages` | Custom Pages | Custom Pages | product |
| `az az-data-stream` | Data Stream | Data Stream | logs, events |
| `az az-durable-objects` | Durable Objects | Durable Objects | product |
| `az az-edge-dns` | Edge DNS | Edge DNS | network, distributed, domain, name server, zone, records |
| `az az-orchestrator` | Orchestrator | Orchestrator | infrastructure, deploy, edge orchestrator |
| `az az-edge-pulse` | Edge Pulse | Edge Pulse | network, distributed |
| `az az-firewall` | Firewall | Firewall | security, waf, protection, edge firewall |
| `az az-functions` | Functions | Functions | serverless, compute, code, edge functions |
| `az az-image-processor` | Image Processor | Image Processor | picture, photo, media |
| `az az-kv-store` | KV Store | KV Store | key value, storage, shop, marketplace, edge kv |
| `az az-live-ingest` | Live Ingest | Live Ingest | product |
| `az az-load-balancer` | Load Balancer | Load Balancer | traffic, distribution, origin |
| `az az-marketplace` | Marketplace | Marketplace | templates, store, integrations |
| `az az-network-lists` | Network Lists | Network Lists | connectivity |
| `az az-object-storage` | Object Storage | Object Storage | bucket, files, edge storage |
| `az az-real-time-events` | Real-Time Events | Real-Time Events | product |
| `az az-real-time-metrics` | Real-Time Metrics | Real-Time Metrics | analytics, observability, charts |
| `az az-real-time-purge` | Real-Time Purge | Real-Time Purge | cache, clear, invalidate |
| `az az-sql-database` | SQL Database | SQL Database | query, data, storage, edge sql |
| `az az-variables` | Variables | Variables | environment, env, config |
| `az az-waf` | WAF | WAF | web application firewall, security, rules, waf rules |
| `az az-workloads` | Workloads | Workloads | domains, deploy, traffic |
| `az az-cache` | Cache | Cache | product |
| `az az-network-shield` | Network Shield | Network Shield | connectivity, security, protection, safe |
| `az az-ddos-protection` | DDoS Protection | DDoS Protection | product |
| `az az-secure-internet-access` | Secure Internet Access | Secure Internet Access | security, protection |
| `az az-lora-fine-tune` | LoRA Fine-Tune | LoRA Fine-Tune | fine-tuning, ai, model |
| `az az-origin-shield` | Origin Shield | Origin Shield | backend, server, security, protection, safe |

#### Azion · Product features

| Class | Product | Stands for | Keywords |
| --- | --- | --- | --- |
| `az az-domains` | Workloads | Domains (inside Workloads) | dns, url, workload |
| `az az-edge-libraries` | Orchestrator | Edge Libraries, where Orchestrator keeps the services it can install | network, distributed |
| `az az-edge-nodes` | Orchestrator | Edge Nodes, the servers Orchestrator manages | network, distributed, infrastructure |
| `az az-edge-services` | Orchestrator | Edge Services, the services Orchestrator installs on an edge node | network, distributed |
| `az az-rules-engine` | Applications | Rules Engine (part of Applications) | logic, conditions, behavior |
| `az az-tiered-cache` | Cache | Tiered Cache (Cache feature) | feature |

#### Azion · Platform

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-ask-azion` | Ask Azion (the Azion assistant) | question, chat, brand, logo, company |
| `az az-azion` | Azion | brand, logo, company |
| `az az-azion-api` | Azion API | brand, logo, company, endpoint, integration, developer |
| `az az-azion-cli` | Azion CLI | brand, logo, company, terminal, command line, console |
| `az az-build-pillar` | The Build pillar of the platform | product family |
| `az az-deploy-pillar` | The Deploy pillar of the platform | release, publish, ship, product family |
| `az az-observe-pillar` | The Observe pillar of the platform | observability, monitoring, product family |
| `az az-secure-pillar` | The Secure pillar of the platform | security, protection, product family |
| `az az-store-pillar` | The Store pillar of the platform | shop, marketplace, product family |

#### Azion · Solutions

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-application-development` | Build and run applications (Application Development) | web apps, websites, apis, serverless |
| `az az-performance-and-reliability` | Improve application performance and reliability (Performance and Reliability) | content delivery, speed, availability, uptime, cdn |
| `az az-artificial-intelligence` | Build and run AI workloads (Artificial Intelligence) | inference, agents, machine learning |
| `az az-application-security` | Secure applications and networks (Application Security) | protection, shield, abuse prevention, adaptive security, sase, network security, fraud, zero trust |
| `az az-media-and-streaming` | Deliver media and streaming content (Media and Streaming) | video, live streaming, broadcast |
| `az az-retail` | Retail (industry solution) | ecommerce, commerce, store |
| `az az-technology` | Technology (industry solution) | tech companies, saas, software |
| `az az-financial-services` | Financial Services (industry solution) | banking, fintech, payments, finance |

#### Azion · Services

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-business-support` | Business support plan | help, service |
| `az az-configuration-service` | Configuration service (professional service) | settings, preferences |
| `az az-integration-services` | Integration services (professional service) | service |
| `az az-practices-review` | Best practices review (professional service) | audit, pratices review |
| `az az-professional-services` | Professional services | service |
| `az az-security-team` | Security team (managed service) | protection, shield |
| `az az-technical-account` | Technical account manager | service |
| `az az-technical-support` | Technical support | help, service |

### Interface

Generic glyphs for the interface. They name an action, an object or a state, never a product.

#### Interface · Arrows

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-arrow-down` | Move down or go down | direction, navigate, sort down |
| `az az-arrow-down-0-1` | Sort ascending, 0 to 9 | direction, navigate, move, sort numeric down |
| `az az-arrow-down-1-0` | Sort descending, 9 to 0 | direction, navigate, move, sort numeric down alt |
| `az az-arrow-down-a-z` | Sort ascending, A to Z | direction, navigate, move, sort alpha down |
| `az az-arrow-down-left` | Move toward the lower left | direction, navigate |
| `az az-arrow-down-narrow-wide` | Sort ascending, smallest first | direction, navigate, move, sort amount down alt |
| `az az-arrow-down-right` | Move toward the lower right | direction, navigate |
| `az az-arrow-down-wide-narrow` | Sort descending, largest first | direction, navigate, move, sort amount down |
| `az az-arrow-down-z-a` | Sort descending, Z to A | direction, navigate, move, sort alpha down alt |
| `az az-arrow-left` | Go back or move left | direction, navigate |
| `az az-arrow-right` | Go forward or move right | direction, navigate |
| `az az-arrow-right-left` | Swap or exchange | direction, navigate, move |
| `az az-arrow-up` | Move up or go up | direction, navigate, sort up |
| `az az-arrow-up-0-1` | Sort ascending, 0 to 9 | direction, navigate, move, sort numeric up |
| `az az-arrow-up-1-0` | Sort descending, 9 to 0 | direction, navigate, move, sort numeric up alt |
| `az az-arrow-up-a-z` | Sort ascending, A to Z | direction, navigate, move, sort alpha up |
| `az az-arrow-up-left` | Move toward the upper left | direction, navigate |
| `az az-arrow-up-narrow-wide` | Sort ascending, smallest first | direction, navigate, move, sort amount up alt |
| `az az-arrow-up-right` | Open externally or move toward the upper right | direction, navigate |
| `az az-arrow-up-wide-narrow` | Sort descending, largest first | direction, navigate, move, sort amount up |
| `az az-arrow-up-z-a` | Sort Z to A, upwards | direction, navigate, move, sort alpha up alt |
| `az az-caret-down` | Expand or open a dropdown | arrow, triangle |
| `az az-caret-left` | Previous or collapse left | arrow, dropdown, triangle |
| `az az-caret-right` | Next or expand right | arrow, dropdown, triangle |
| `az az-caret-up` | Collapse or move up | arrow, dropdown, triangle |
| `az az-chevron-down` | Expand or open a menu downward | arrow, collapse, direction, angle, angle down |
| `az az-chevron-left` | Go back or previous | arrow, expand, collapse, direction, angle, angle left |
| `az az-chevron-right` | Go forward or next | arrow, expand, collapse, direction, angle, angle right |
| `az az-chevron-up` | Collapse or move up | arrow, expand, direction, angle, angle up |
| `az az-chevrons-down` | Expand all or jump down | double, arrow, first, last, direction, angle double down |
| `az az-chevrons-left` | Go to the first item or page | double, arrow, last, direction, angle double left |
| `az az-chevrons-right` | Go to the last item or page | double, arrow, first, direction, angle double right |
| `az az-chevrons-up` | Collapse all or jump to the top | double, arrow, first, last, direction, angle double up |
| `az az-circle-arrow-down` | Move down or download | status, shape, direction, navigate |
| `az az-circle-arrow-left` | Go back or move left | status, shape, direction, navigate |
| `az az-circle-arrow-right` | Go forward or proceed | status, shape, direction, navigate, move |
| `az az-circle-arrow-up` | Move up or upload | status, shape, direction, navigate |
| `az az-circle-chevron-down` | Expand or show more below | status, shape, arrow, collapse, direction, angle |
| `az az-circle-chevron-left` | Previous | status, shape, arrow, expand, collapse, direction, angle |
| `az az-circle-chevron-right` | Next | status, shape, arrow, expand, collapse, direction, angle |
| `az az-circle-chevron-up` | Collapse or show less | status, shape, arrow, expand, direction, angle |
| `az az-move` | Move or drag in any direction | reposition, arrows, arrows alt |
| `az az-move-horizontal` | Move or resize horizontally | drag, reposition, arrows, arrows h |
| `az az-move-vertical` | Move or resize vertically | drag, reposition, arrows, arrows v |
| `az az-sort` | Sort | order, arrange, sort alt |
| `az az-sort-down-fill` | Sort descending | order, arrange |
| `az az-sort-off` | Sorting off, not sorted | order, arrange, sort alt slash |
| `az az-sort-up-fill` | Sort ascending | order, arrange |

#### Interface · Actions

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-arrow-up-from-line` | Eject | direction, navigate, move |
| `az az-circle-plus` | Add or create | status, shape, new |
| `az az-cloud-download` | Download from the cloud | hosting, storage, save, export |
| `az az-cloud-upload` | Upload to the cloud | hosting, storage, import, send |
| `az az-copy` | Copy | duplicate, clipboard, clone |
| `az az-delete-left` | Backspace, delete the previous character | remove, erase |
| `az az-download` | Download | save, export |
| `az az-eraser` | Erase or clear | action |
| `az az-external-link` | Open in a new tab or external site | link out, url, chain, hyperlink |
| `az az-eye` | Show or view | visible, preview |
| `az az-eye-off` | Hide | hidden, invisible, view, show, visible, preview, eye slash |
| `az az-filter` | Filter a list | funnel, refine, narrow, filter alt |
| `az az-filter-fill` | Filter (active filter applied) | funnel, refine, narrow |
| `az az-filter-off` | Remove the filter | funnel, refine, narrow, filter slash |
| `az az-history` | History or recent activity | audit, log |
| `az az-link` | Link or URL | chain, hyperlink |
| `az az-log-in` | Sign in | login, enter |
| `az az-log-out` | Sign out | logout, exit |
| `az az-minus` | Remove, subtract or collapse | action |
| `az az-pencil` | Edit | write, rename |
| `az az-plus` | Add or create | new |
| `az az-power-off` | Power off or shut down | logout |
| `az az-refresh` | Refresh or reload | sync, update |
| `az az-replay` | Replay or restart from the beginning | repeat, retry |
| `az az-save` | Save changes | disk, store |
| `az az-scissors` | Cut | scizors |
| `az az-search` | Search | find, magnifier, lookup |
| `az az-settings` | Open settings | gear, cog, preferences, configuration |
| `az az-share` | Share | send, social, share alt |
| `az az-square-pen` | Edit | write, pen to square |
| `az az-sync` | Synchronize | refresh |
| `az az-trash` | Delete | remove, bin |
| `az az-undo` | Undo | revert, back |
| `az az-upload` | Upload | import, send |
| `az az-x` | Close or dismiss | cancel, times |
| `az az-zoom-in` | Zoom in | magnify, scale, search plus |
| `az az-zoom-out` | Zoom out | magnify, scale, search minus |

#### Interface · Status

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-attack` | An attack or threat | security, ddos |
| `az az-ban` | Not allowed or blocked | block, forbidden, deny |
| `az az-check` | Done, confirmed or selected | success, confirm, ok |
| `az az-circle` | Unselected or inactive state | status, shape |
| `az az-circle-alert` | Warning or error alert | exclamation, status, shape, notification, exclamation circle |
| `az az-circle-check` | Success or completed | status, shape, done, confirm, ok |
| `az az-circle-fill` | Active or status dot | shape |
| `az az-circle-half` | Partial, half done; also light and dark contrast | status, shape |
| `az az-circle-help` | Help or more information | question, faq, status, shape, question circle |
| `az az-circle-info` | Information | status, shape, help, about |
| `az az-circle-minus` | Remove, collapse | status, shape, subtract |
| `az az-circle-off` | Off, disabled or not available | status, shape |
| `az az-circle-on` | On or selected (radio state) | status, shape |
| `az az-circle-x` | Error, cancel or clear | close, times, status, shape, times circle |
| `az az-disabled` | Disabled status | off, inactive |
| `az az-enabled` | Enabled status | on, active |
| `az az-hourglass` | Waiting, pending or time running | wait |
| `az az-info` | Information | help, about |
| `az az-question` | Help or question | faq, support |
| `az az-spinner` | Loading in progress | busy |
| `az az-spinner-dotted` | Loading in progress | busy |
| `az az-square-check` | Checked or selected | checkbox, done, success, confirm, ok |
| `az az-triangle-alert` | Warning | exclamation, caution, notification, exclamation triangle |
| `az az-verified` | Verified | check, approved, badge, digital certificates |

#### Interface · Files

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-clipboard` | Clipboard or paste | copy |
| `az az-file` | File or document | page, file o |
| `az az-file-arrow-up` | Upload a file | document, page, direction, navigate, move |
| `az az-file-check` | File approved or verified | document, page, done, success, confirm, ok |
| `az az-file-excel` | Spreadsheet or Excel file | document, page |
| `az az-file-export` | Export to a file | document, page |
| `az az-file-import` | Import from a file | document, page |
| `az az-file-pdf` | PDF file | document, page |
| `az az-file-pen` | Edit a file | document, page, write |
| `az az-file-plus` | Create a new file | document, page, add |
| `az az-file-word` | Word document file | page |
| `az az-folder` | Folder | directory, files |
| `az az-folder-open` | Open folder | directory, files |
| `az az-folder-plus` | Create a new folder | directory, files, add |
| `az az-json` | JSON or code object | data, format |
| `az az-json-text` | JSON as a file type | data, format, code |
| `az az-paperclip` | Attachment | attach |

#### Interface · Media

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-backward` | Rewind or skip back | previous |
| `az az-camera` | Take a photo | picture |
| `az az-circle-pause` | Pause | status, shape, stop, hold |
| `az az-circle-play` | Play or start | status, shape, run, video |
| `az az-circle-stop` | Stop | status, shape, halt, end |
| `az az-forward` | Fast forward or skip ahead | next |
| `az az-image` | Image or photo | picture, media |
| `az az-images` | Image gallery or multiple images | pictures, photos, media |
| `az az-microphone` | Microphone, voice input or recording | audio, record |
| `az az-pause` | Pause | stop, hold |
| `az az-play` | Play | start, run, video |
| `az az-skip-back` | Skip to the start or previous track | next, fast backward, step backward alt |
| `az az-skip-forward` | Skip to the end or next track | previous, fast forward, step forward alt |
| `az az-step-back` | Skip back or previous | step backward |
| `az az-step-forward` | Skip forward or next | media |
| `az az-stop` | Stop playback | halt, end |
| `az az-video` | Video | movie, media |
| `az az-volume-down` | Lower the volume | sound, audio |
| `az az-volume-off` | Mute | sound, audio |
| `az az-volume-up` | Raise the volume | sound, audio |

#### Interface · Communication

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-at` | Email address or mention | communication |
| `az az-bell` | Notifications | notification, alert |
| `az az-bell-off` | Notifications turned off | notification, alert, bell slash |
| `az az-comment` | Comment or message | chat, feedback |
| `az az-comments` | Conversation or discussion | chat, messages |
| `az az-inbox` | Inbox or received items | messages, mail, empty |
| `az az-mail` | Email | envelope, message |
| `az az-megaphone` | Announcement or marketing | news |
| `az az-phone` | Phone call | contact |
| `az az-reply` | Reply to a message | answer, respond |
| `az az-rss` | RSS feed | subscribe, news |
| `az az-send` | Send a message | submit, paper plane |
| `az az-webhook` | Webhook | integration, callback, events |

#### Interface · Commerce

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-barcode` | Barcode or product code | scan |
| `az az-cart-arrow-down` | Add to cart | shopping, commerce, buy, direction, navigate, move |
| `az az-cart-minus` | Remove from cart | shopping, commerce, buy, subtract, collapse |
| `az az-cart-plus` | Add to cart | shopping, commerce, buy, create, new |
| `az az-credit-card` | Payment or billing | commerce |
| `az az-dollar` | Money, price or USD | billing, currency |
| `az az-euro` | Money, price or EUR | currency |
| `az az-gift` | Gift, reward or promotion | present |
| `az az-indian-rupee` | Indian rupee currency | commerce |
| `az az-money-bill` | Money, payment or cash | billing |
| `az az-pound` | British pound currency | money, gbp |
| `az az-receipt` | Receipt, invoice or billing | payment |
| `az az-shop` | A shop or store | commerce |
| `az az-shopping-bag` | Shopping bag or purchases | commerce, buy |
| `az az-shopping-cart` | Shopping cart | commerce, buy |
| `az az-ticket` | A ticket or pass | support, issue |
| `az az-turkish-lira` | Turkish lira currency | commerce |
| `az az-wallet` | Wallet or payment method | money |

#### Interface · People

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-address-book` | Contacts or address book | people, docs, documentation, read |
| `az az-face-smile` | Happy, emoji or positive feedback | person |
| `az az-id-card` | Identity, profile or account details | person |
| `az az-mars` | Male gender | person |
| `az az-user` | A user or account | person, profile |
| `az az-user-minus` | Remove a user | person, account, profile, subtract, collapse |
| `az az-user-pen` | Edit a user | person, account, profile, write |
| `az az-user-plus` | Add a user | person, account, profile, create, new |
| `az az-users` | Users or a group | people, team, members |
| `az az-venus` | Female | gender |

#### Interface · Devices

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-desktop` | Desktop computer or desktop view | screen, device |
| `az az-headphones` | Audio, listening or support | device |
| `az az-microchip` | Processor or hardware | compute |
| `az az-microchip-ai` | AI processing or AI model | hardware, processor, compute, artificial intelligence, llm |
| `az az-mobile` | Mobile device | phone, smartphone |
| `az az-print` | Print | printer |
| `az az-server` | A server or host | infrastructure, compute |
| `az az-tablet` | A tablet device | ipad |
| `az az-wifi` | Wi-Fi or wireless connection | network |

#### Interface · Data

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-calculator` | Calculate or estimate | math, pricing |
| `az az-chart-bar` | Bar chart | graph, analytics, metrics |
| `az az-chart-line` | Line chart or trend | graph, analytics, metrics |
| `az az-chart-pie` | Pie chart or share | graph, analytics, metrics |
| `az az-chart-scatter` | Scatter plot | graph, analytics, metrics |
| `az az-database` | A database in general (not a product) | data, storage, sql |
| `az az-gauge` | Gauge, performance or speed metric | meter |
| `az az-list` | List or list view | items, bullets |
| `az az-list-check` | Checklist or completed tasks | todo, items, bullets, done, success, confirm, ok |
| `az az-sheet` | A table or spreadsheet | grid, cells, datasheet |
| `az az-sql` | SQL as a language (not the product) | database, query |
| `az az-table` | A table | grid, data, rows |
| `az az-wave-pulse` | Activity or monitoring | health |

#### Interface · Layout

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-align-center` | Center-align text | alignment, format |
| `az az-align-justify` | Justify text | alignment, format |
| `az az-align-left` | Left-align text | alignment, format |
| `az az-align-right` | Right-align text | alignment, format |
| `az az-columns-3` | A column layout, show or hide columns | layout |
| `az az-ellipsis` | More options | menu, actions, overflow, ellipsis h |
| `az az-ellipsis-vertical` | More options menu | actions, overflow, ellipsis v |
| `az az-expand` | Expand or full screen | fullscreen, maximize |
| `az az-layers` | Layers or stacked levels | stack |
| `az az-layout-grid` | Grid view | tiles, dashboard, objects column, th large |
| `az az-maximize` | Maximize or enter full screen | fullscreen, expand, enlarge, arrow up right and arrow down left from center |
| `az az-menu` | Open the menu | hamburger, navigation, bars |
| `az az-minimize` | Minimize or exit full screen | exit fullscreen, collapse, shrink, arrow down left and arrow up right to center |
| `az az-sitemap` | Sitemap or hierarchy | tree, structure |
| `az az-sliders-horizontal` | Adjust settings or filters | controls, sliders h |
| `az az-sliders-vertical` | Adjust settings or levels | controls, filters, sliders v |
| `az az-app-window` | A window or an app; open something in a window | browser, window maximize |
| `az az-window-minimize` | Minimize the window | browser, app, exit fullscreen, collapse, shrink |

#### Interface · Objects

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-asterisk` | Required field or wildcard | star |
| `az az-bolt` | Power, energy or speed | fast, lightning |
| `az az-book` | Documentation or reading | docs, read |
| `az az-bookmark` | Save for later | favorite |
| `az az-bookmark-fill` | Saved item | save, favorite |
| `az az-box` | Package, product or bundle | object |
| `az az-briefcase` | Work or business | object |
| `az az-building` | Company or organization | office |
| `az az-building-columns` | Bank or institution | company, organization, office |
| `az az-bullseye` | Goal or target | object |
| `az az-calendar` | Date or schedule | time |
| `az az-calendar-clock` | Scheduled date and time | schedule, history |
| `az az-calendar-minus` | Remove an event or date | schedule, time, subtract, collapse |
| `az az-calendar-plus` | Add an event or date | schedule, time, create, new |
| `az az-calendar-x` | Cancel an event or clear a date | schedule, time, calendar times |
| `az az-car` | Vehicle or transport | automotive |
| `az az-clock` | Time, schedule or history | object |
| `az az-cloud` | Cloud or hosted service | hosting, storage |
| `az az-code` | Code or source view | developer, snippet |
| `az az-compass` | Explore or navigate | navigation |
| `az az-crown` | Premium, owner or top rank | plan, pro |
| `az az-directions` | Directions or route | navigation, map |
| `az az-equals` | Equals or equal to | math |
| `az az-flag` | Flag, mark or report an item | object |
| `az az-flag-fill` | Flagged item | report, mark |
| `az az-globe` | World, internet or language/region | global, web |
| `az az-graduation-cap` | Education, learning or courses | learn, course, instructor |
| `az az-hammer` | Build, tools or settings | object |
| `az az-hash` | Number, ID or hashtag | tag, channel |
| `az az-heart` | Favorite or like | love |
| `az az-heart-fill` | Favorited or liked | like, favorite, love |
| `az az-home` | Home, overview | house, start, dashboard |
| `az az-key` | Key, credentials or access | password, token, secret, credential |
| `az az-language` | Language or translation | translate, locale, i18n |
| `az az-lightbulb` | Idea, tip or hint | object |
| `az az-lock` | Locked or secure | private, password |
| `az az-lock-open` | Unlocked | unlock, public, secure, private, password, locked |
| `az az-map` | Map | location, geo |
| `az az-map-pin` | Location | marker, place, geo, thumbtack, pushpin, fixed, map marker |
| `az az-moon` | Dark mode or night | theme |
| `az az-palette` | Colors, theme or appearance | color, design |
| `az az-percentage` | Percentage or discount | percent, rate |
| `az az-pin` | Pin an item | thumbtack, pushpin, fixed |
| `az az-qrcode` | QR code | scan |
| `az az-route` | A route or path | routing, directions, gateway |
| `az az-shield` | Security or protection | safe |
| `az az-signpost` | Directions, routing or navigation | route, directions alt |
| `az az-sparkles` | AI features and generated content; also the AI pillar of the platform | magic, new, generate |
| `az az-star` | Favorite or rating | object |
| `az az-star-fill` | Favorited or full rating | favorite |
| `az az-star-half` | Half-star rating | favorite |
| `az az-star-half-fill` | Half a point in a rating | favorite |
| `az az-stopwatch` | Timer or elapsed time | duration |
| `az az-sun` | Light mode or daytime | day, theme |
| `az az-tag` | A tag or label | category |
| `az az-tags` | Tags or labels | categories |
| `az az-thumbs-down` | Dislike or negative feedback | bad |
| `az az-thumbs-down-fill` | Disliked | dislike, bad, feedback |
| `az az-thumbs-up` | Like or positive feedback | good |
| `az az-thumbs-up-fill` | Liked | like, good, feedback |
| `az az-trophy` | Achievement or winner | award |
| `az az-truck` | Shipping or delivery | object |
| `az az-warehouse` | A warehouse or storage | inventory |
| `az az-wrench` | Tools or configuration | settings, fix, maintenance |
| `az az-terminal` | A terminal or command line | object |

#### Interface · Git

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-git-branch` | A git branch | version control, source, repository, version |
| `az az-git-branch-delete` | Delete a branch | version control, source, repository, version, remove, erase |
| `az az-git-branch-plus` | Create a branch | version control, source, repository, version, add, new |
| `az az-git-cherry-pick` | Cherry-pick a commit | version control, source, repository |
| `az az-git-commit` | A commit | version control, source, repository |
| `az az-git-compare` | Compare two versions | version control, source, repository |
| `az az-git-diff` | A diff | version control, source, repository |
| `az az-git-fork` | A fork | version control, source, repository |
| `az az-git-graph` | A commit graph | version control, source, repository |
| `az az-git-merge` | A merge | version control, source, repository |
| `az az-git-merge-conflict` | A merge conflict | version control, source, repository |
| `az az-git-pull-request` | A pull request | version control, source, repository |
| `az az-git-pull-request-closed` | A closed pull request | version control, source, repository |
| `az az-git-pull-request-draft` | A draft pull request | version control, source, repository |
| `az az-git-repository` | A repository | version control, source, code |

### External

Logos of other companies and projects. Azion does not own them; each is used to name that third party.

#### External · Frameworks

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-angular` | Angular (framework) | brand, logo |
| `az az-astro` | Astro (framework) | brand, logo |
| `az az-docusaurus` | Docusaurus (framework) | brand, logo |
| `az az-eleventy` | Eleventy (framework) | brand, logo |
| `az az-gatsby` | Gatsby (framework) | brand, logo |
| `az az-hexo` | Hexo (framework) | brand, logo |
| `az az-hono` | Hono (framework) | brand, logo |
| `az az-hugo` | Hugo (framework) | brand, logo |
| `az az-jekyll` | Jekyll (framework) | brand, logo |
| `az az-nextjs` | Next.js (framework) | brand, logo |
| `az az-nitro` | Nitro (framework) | server, unjs, brand, logo |
| `az az-nuxt` | Nuxt (framework) | brand, logo |
| `az az-preact` | Preact (framework) | brand, logo |
| `az az-qwik` | Qwik (framework) | brand, logo |
| `az az-react` | React (framework) | brand, logo |
| `az az-remix` | Remix (framework) | brand, logo |
| `az az-stencil` | Stencil (framework) | web components, compiler, brand, logo |
| `az az-svelte` | Svelte (framework) | brand, logo |
| `az az-vitepress` | VitePress (framework) | brand, logo |
| `az az-vue` | Vue (framework) | brand, logo |
| `az az-vuepress` | VuePress (framework) | brand, logo |
| `az-color az-angular` | Angular (framework) | brand, logo |
| `az-color az-astro` | Astro (framework) | brand, logo |
| `az-color az-flutter` | Flutter (framework) | brand, logo |
| `az-color az-nextjs` | Next.js (framework) | brand, logo |
| `az-color az-nuxt` | Nuxt (framework) | brand, logo |
| `az-color az-react` | React (framework) | brand, logo |
| `az-color az-redwood` | RedwoodJS (framework) | brand, logo |
| `az-color az-solidjs` | SolidJS (framework) | brand, logo |
| `az-color az-svelte` | Svelte (framework) | brand, logo |
| `az-color az-vue` | Vue (framework) | brand, logo |
| `az-color az-docusaurus` | Docusaurus (framework) | brand, logo |
| `az-color az-eleventy` | Eleventy (framework) | brand, logo |
| `az-color az-gatsby` | Gatsby (framework) | brand, logo |
| `az-color az-hexo` | Hexo (framework) | brand, logo |
| `az-color az-hono` | Hono (framework) | brand, logo |
| `az-color az-hugo` | Hugo (framework) | brand, logo |
| `az-color az-jekyll` | Jekyll (framework) | brand, logo |
| `az-color az-preact` | Preact (framework) | brand, logo |
| `az-color az-qwik` | Qwik (framework) | brand, logo |
| `az-color az-remix` | Remix (framework) | brand, logo |
| `az-color az-vite` | Vite (build tool) | brand, logo |
| `az-color az-vitepress` | VitePress (framework) | brand, logo |
| `az-color az-vuepress` | VuePress (framework) | brand, logo |
| `az-color az-stencil` | Stencil (framework) | web components, compiler, brand, logo |
| `az-color az-htmx` | htmx (framework) | framework |

#### External · Languages

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-graphql` | GraphQL | brand, logo |
| `az az-html` | HTML | markup, web, brand |
| `az-color az-graphql` | GraphQL | brand, logo |
| `az-color az-html` | HTML | markup, web, brand |
| `az-color az-javascript` | JavaScript | brand, logo, js |
| `az-color az-kotlin` | Kotlin | brand, logo |
| `az-color az-typescript` | TypeScript | brand, logo, ts |
| `az az-nodejs` | Node.js (runtime) | language |
| `az az-python` | Python | language |
| `az-color az-nodejs` | Node.js (runtime) | language |
| `az-color az-python` | Python | language |
| `az-color az-rust` | Rust (language) | language |
| `az-color az-webassembly` | WebAssembly (language) | language |

#### External · AI models

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-claude` | Claude (AI model) | brand, logo |
| `az az-deepseek` | DeepSeek (AI model) | brand, logo |
| `az az-gemini` | Gemini (AI model) | brand, logo |
| `az az-grok` | Grok (AI model) | brand, logo |
| `az az-meta` | Meta (AI models) | brand, logo |
| `az az-mistral` | Mistral (AI model) | brand, logo |
| `az az-openai` | OpenAI | chatgpt, gpt, brand, logo, open |
| `az az-perplexity` | Perplexity (AI model) | brand, logo |
| `az az-qwen` | Qwen (AI model) | brand, logo |
| `az-color az-claude` | Claude (AI model) | brand, logo |
| `az-color az-deepseek` | DeepSeek (AI model) | brand, logo |
| `az-color az-gemini` | Gemini (AI model) | brand, logo |
| `az-color az-grok` | Grok (AI model) | brand, logo |
| `az-color az-meta` | Meta (AI models) | brand, logo |
| `az-color az-mistral` | Mistral (AI model) | brand, logo |
| `az-color az-openai` | OpenAI | chatgpt, gpt, brand, logo, open |
| `az-color az-perplexity` | Perplexity (AI model) | brand, logo |
| `az-color az-qwen` | Qwen (AI model) | brand, logo |
| `az-color az-kimi` | Kimi by Moonshot AI (AI model) | ai model |
| `az-color az-zhipu` | Zhipu AI, maker of GLM (AI model) | ai model |
| `az-color az-minimax` | MiniMax (AI model) | ai model |
| `az-color az-ernie` | ERNIE by Baidu (AI model) | ai model |
| `az-color az-hunyuan` | Hunyuan by Tencent (AI model) | ai model |
| `az-color az-doubao` | Doubao by ByteDance (AI model) | ai model |
| `az-color az-yi` | Yi by 01.AI (AI model) | ai model |
| `az-color az-stepfun` | StepFun (AI model) | ai model |
| `az-color az-baichuan` | Baichuan (AI model) | ai model |
| `az-color az-iflytek-spark` | Spark by iFlytek (AI model) | ai model |
| `az-color az-sensenova` | SenseNova by SenseTime (AI model) | ai model |
| `az-color az-internlm` | InternLM and InternVL by Shanghai AI Laboratory (AI model) | ai model |
| `az-color az-baai` | BAAI, maker of the BGE embedding and reranker models (AI model) | ai model |
| `az-color az-nanonets` | Nanonets, maker of Nanonets-OCR (AI model) | ai model |
| `az-color az-hugging-face` | Hugging Face (AI model hub) | ai model |
| `az-color az-suno` | Suno, maker of the Bark audio model (AI model) | ai model |
| `az-color az-fish-audio` | Fish Audio, maker of Fish Speech (AI model) | ai model |
| `az-color az-stability-ai` | Stability AI, maker of Stable Audio Open (AI model) | artificial intelligence, llm |
| `az-color az-nvidia` | NVIDIA, maker of the Parakeet and Canary speech models (AI model) | ai model |
| `az-color az-coqui` | Coqui, maker of the XTTS speech model (AI model) | ai model |

#### External · AI tools

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-microsoft-copilot` | Microsoft Copilot | brand, logo |
| `az az-cursor` | Cursor (code editor) | brand, logo |
| `az az-mcp` | Model Context Protocol | agent, integration, brand, logo, mcp logo |
| `az az-windsurf` | Windsurf (code editor) | brand, logo |
| `az-color az-microsoft-copilot` | Microsoft Copilot | brand, logo |
| `az-color az-cursor` | Cursor (code editor) | brand, logo |
| `az-color az-windsurf` | Windsurf (code editor) | brand, logo |
| `az az-langgraph` | LangGraph (agent framework) | ai tool |
| `az-color az-langgraph` | LangGraph (agent framework) | ai tool |
| `az-color az-mcp` | Model Context Protocol (AI tool) | agent, integration, brand, logo |
| `az-color az-github-copilot` | GitHub Copilot (AI tool) | brand, logo |
| `az-color az-codex` | Codex by OpenAI (AI tool) | ai tool |
| `az-color az-opencode` | OpenCode (AI tool) | ai tool |
| `az-color az-warp` | Warp (AI tool) | ai tool |
| `az-color az-kiro` | Kiro (AI tool) | ai tool |

#### External · Developer tools

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-github` | GitHub | brand, logo |
| `az az-terraform` | Terraform | infrastructure as code, iac, brand, logo |
| `az az-vite` | Vite (build tool) | brand, logo |
| `az-color az-azure-devops` | Azure DevOps | brand, logo, azuredevops |
| `az-color az-bitbucket` | Bitbucket | brand, logo |
| `az-color az-gitlab` | GitLab | brand, logo |
| `az-color az-terraform` | Terraform | infrastructure as code, iac, brand, logo |
| `az-color az-github` | GitHub (developer tool) | brand, logo |
| `az-color az-github-actions` | GitHub Actions (developer tool) | brand, logo |
| `az-color az-visual-studio-code` | Visual Studio Code (developer tool) | source, snippet |

#### External · Databases

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-redis` | Redis | brand, logo |
| `az az-turso` | Turso (database) | brand, logo |
| `az az-neon` | Neon (serverless Postgres) | database |
| `az az-upstash` | Upstash (serverless data) | database |
| `az-color az-neon` | Neon (serverless Postgres) | database |
| `az-color az-turso` | Turso (edge database) | brand, logo |
| `az-color az-upstash` | Upstash (serverless data) | database |
| `az-color az-supabase` | Supabase (database) | database |
| `az-color az-postgresql` | PostgreSQL (database) | database |
| `az-color az-mysql` | MySQL (database) | database |
| `az-color az-mongodb` | MongoDB (database) | database |
| `az-color az-tidb` | TiDB (database) | database |
| `az-color az-drizzle` | Drizzle ORM (database tool) | database |

#### External · Content management

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-wordpress` | WordPress (CMS) | cms |
| `az-color az-wordpress` | WordPress (CMS) | cms |
| `az-color az-sanity` | Sanity (content management) | cms |
| `az-color az-cosmic` | Cosmic (content management) | cms |

#### External · Observability and data

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az-color az-datadog` | Datadog (observability) | observability |
| `az-color az-splunk` | Splunk (observability) | observability |
| `az-color az-elasticsearch` | Elasticsearch (observability) | observability |
| `az-color az-grafana` | Grafana (observability) | observability |
| `az-color az-apache-kafka` | Apache Kafka (data streaming) | observability |
| `az-color az-amazon-kinesis` | Amazon Kinesis Data Firehose (data streaming) | aws, brand, logo |
| `az-color az-amazon-s3` | Amazon S3 (storage) | aws, brand, logo |
| `az-color az-microsoft-azure` | Microsoft Azure: Azure Monitor and Azure Blob Storage | brand, logo |
| `az-color az-google-bigquery` | Google BigQuery (analytics) | brand, logo |
| `az-color az-ibm` | IBM, maker of IBM QRadar (security analytics) | observability |

#### External · Identity and sign-in

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az-color az-okta` | Okta (identity provider) | identity |
| `az-color az-microsoft-entra` | Microsoft Entra ID (identity provider) | brand, logo |
| `az-color az-auth0` | Auth0 by Okta (identity provider) | identity |
| `az-color az-keycloak` | Keycloak (open source identity provider) | identity |
| `az-color az-authentik` | authentik (open source identity provider) | identity |
| `az-color az-authelia` | Authelia (open source identity provider) | identity |
| `az-color az-ory` | Ory (open source identity provider) | identity |
| `az-color az-zitadel` | ZITADEL (open source identity provider) | identity |

#### External · Security services

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az-color az-hcaptcha` | hCaptcha (bot protection) | security |
| `az-color az-recaptcha` | reCAPTCHA by Google (bot protection) | security |
| `az-color az-fingerprint-brand` | Fingerprint, the device identification service (security) | security |

#### External · Online services

| Class | Stands for | Keywords |
| --- | --- | --- |
| `az az-discord` | Discord (community) | brand, logo |
| `az az-facebook` | Facebook (social network) | brand, logo |
| `az az-google` | Google (search and cloud services) | brand, logo |
| `az az-instagram` | Instagram (photo social network) | brand, logo |
| `az az-linkedin` | LinkedIn (professional social network) | brand, logo |
| `az az-medium` | Medium (blog) | brand, logo |
| `az az-reddit` | Reddit (online discussion community) | brand, logo |
| `az az-slack` | Slack (team messaging app) | brand, logo |
| `az az-twitch` | Twitch | brand, logo |
| `az az-whatsapp` | WhatsApp (messaging app) | brand, logo |
| `az az-x-brand` | X (social network) | twitter, logo |
| `az az-youtube` | YouTube | brand, logo |
| `az-color az-discord` | Discord (community) | brand, logo |
| `az-color az-google` | Google | brand, logo |
| `az-color az-x-brand` | X (social network) | twitter, logo |
| `az-color az-youtube` | YouTube | brand, logo |
| `az-color az-stripe` | Stripe (payments) | online service |
| `az-color az-resend` | Resend (email) | online service |
| `az-color az-browserless` | Browserless (headless browsers) | online service |
