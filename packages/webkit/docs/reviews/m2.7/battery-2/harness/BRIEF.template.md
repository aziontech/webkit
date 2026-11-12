# Battery 2 builder brief — job {{JOB}} ({{SURFACE}})

You are a {{ROLE}} at Azion who has never used WebKit, Azion's Vue 3 design system. Your task is to rebuild
{{N}} existing {{SURFACE_LONG}} with WebKit, as faithfully as you can, and to write down every place where
WebKit was unclear, missing or wrong.

## What you have (all inside this folder: `{{DIR}}`)

- `pages.json`: one entry per page (`id`, `title`, `url_or_route`, `description`). The description is the
  copy and structure of the page, in order. Use the copy verbatim.
- `ref/<id>--desktop.png` (1440 px wide, full page) and `ref/<id>--iphone.png` (iPhone 15, 393 px wide, full
  page): screenshots of the reference. They are tall; `ref/tiles/<id>--desktop-NN.jpg` and
  `ref/tiles/<id>--iphone-NN.jpg` are the same images cut into readable tiles, top to bottom. Look at them.
- `pkgs/`: the three WebKit tarballs (`@aziontech/webkit`, `@aziontech/theme`, `@aziontech/icons`).
- `/data/eval-m27b/bin/shoot.sh`: a screenshot helper (see "Check your work").

## Hard rules

1. **Learn WebKit only from the package.** Once installed, read `node_modules/@aziontech/webkit` (its README,
   `llms/`, `skills/`, `rules/`, `adapters/`, `catalog.json`, `catalog/`, `blocks/`, `examples/`, `MIGRATION-v6.md`)
   and use its CLI (`npx @aziontech/webkit --help`: `init`, `search`, `view`, `add`, `check`, `doctor`). Do
   **not** read, list or search anything under `/data/claude/`, anything under `/data/eval-m27b/` outside
   `{{DIR}}` (except running `/data/eval-m27b/bin/shoot.sh`), or any other job's folder. Do not use the web
   (no WebFetch/WebSearch); the npm registry for installs is fine.
2. Work only in `{{DIR}}/app`. Start it as an **empty Vite + Vue 3 + TypeScript app** (`npm create vite@latest`
   or by hand), then install the three tarballs from `../pkgs/` (`file:` dependencies) plus what WebKit's own
   docs tell you to install. Follow WebKit's setup instructions (for example `npx @aziontech/webkit init`).
3. Use WebKit components, blocks and tokens wherever WebKit has something that fits. Do not restyle WebKit
   components; when WebKit cannot produce what the reference shows, do the closest thing WebKit allows and
   record the gap in the journal. No hex colours; tokens only.
4. **Routes:** Vue Router in history mode, one route per page at `/<id>` (for example `/{{FIRST}}`), and `/`
   listing links to every page. {{THEME_RULE}}
5. **Build:** `npm run build` must produce `app/dist/` that works when served as a static SPA (every unknown path
   falls back to `index.html`). No server needed at runtime. Mock data only; no network calls at runtime
   except fonts or assets the WebKit packages themselves reference.
6. **Checkpoints:** `git init` in `app/` (with a `.gitignore` for `node_modules` and `dist`) and commit after
   setup and after every page (`git -c user.name=builder -c user.email=builder@example.invalid commit …`).
7. Never stop to ask questions; decide, and write the decision in the journal. Keep going until every page is
   built, or you have truly run out of options for one (then say so in `DONE.md`).

## Check your work

Run the dev server on port {{PORT}} (`npx vite --port {{PORT}} --strictPort --host 127.0.0.1`, in the background)
and shoot a page the same way the references were shot:

```bash
/data/eval-m27b/bin/shoot.sh {{DIR}}/shots <id> http://127.0.0.1:{{PORT}}/<id> {{SCHEME}}{{EXPAND}}
/data/eval-m27b/venv/bin/python /data/eval-m27b/bin/tile.py {{DIR}}/shots/tiles {{DIR}}/shots/<id>--desktop.png {{DIR}}/shots/<id>--iphone.png
```

Compare your tiles with `ref/tiles/` (desktop and iPhone) and fix the differences you can fix with WebKit.
Shoot each page at least once at the end. Stop the dev server when you finish.

## Write as you go

- `{{DIR}}/JOURNAL.md`: timestamped (`date -u +%H:%M`) notes of where WebKit was unclear, missing or wrong, with
  what you tried, what you used instead, and how much time it cost. Name the component, block, doc file or CLI
  command each time. Mark each friction **blocker / high / medium / low**. Also note what worked well.
- `{{DIR}}/DONE.md` at the very end: one line per page (`id`: built / partial / missing, plus what is missing),
  the WebKit pieces you used most, the top 5 problems with WebKit in order of impact, and confirmation that
  `npm run build` passes.

The pages for this job: {{PAGES}}.
