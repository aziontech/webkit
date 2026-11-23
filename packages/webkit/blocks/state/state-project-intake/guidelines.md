# Project intake

The surfaces a project passes through when the user drops it on the page. The user's job is to deploy a folder they already have without filling in a form: a drop target fills the page body and says what will happen, with a Choose a folder button for anyone not dragging; once it is dropped, a full-screen Initializing overlay lists the received files with their status until the upload is done and the deploy takes over.

DropZone is a page-body overlay inside the default slot of `ConsoleLayout` (`shell/shell-console`); Initializing covers the whole screen.

## When to use

- Pages where dropping a project is a shortcut to deploying it: Home, its empty state, a creation hub, and a project detail page.
- Showing upload progress per file, when the files are few enough to list.

## When not to use

- Choosing a single file as a form value: use a file upload field inside the form (`skills/webkit-form`).
- Browsing or managing stored files: use `view/view-file-browser`.
- The build and deploy that follow the upload: use `state/state-async-submit` and `detail/detail-deployment-logs`.
- Importing from a repository: use the From GitHub method in `state/state-first-use` or `create/create-deploy-template` (ImportFromGit).

## Building blocks

The primary SFC is the drop target and, once `uploads` is set, the overlay that follows.

### A. Drop target — `FileDropzone` (required)

The inline `FileDropzone` with `directories`, filling the page body: its title says what dropping does and its description what is accepted. Its `drop` event carries the accepted files with their relative paths.

### B. Keyboard way in — `Button` (required)

An outlined Choose a folder `Button` in the dropzone's default slot opens the system folder picker (`useFilePicker` with `directory`). Drag and drop is a shortcut, never the only way; keyboard and screen reader users take this button.

### C. Upload list — `UploadProgress` (Initializing, UploadError)

`UploadProgress` with `:floating="false"`, centred under the heading: one row per received file with its name, size and status in words (Done, the percentage and a progress bar while uploading, Waiting), Cancel on moving files and Retry on a failed one. It announces the summary through its own status region; the page adds no second live region. A drop of more than 50 files lists only the files still moving, so a repository with `node_modules` never renders thousands of rows; the heading keeps the full count.

### D. Failure summary — `Alert` (UploadError)

A danger `Alert` above the list says how many files failed and what to do, with Retry, which retries every failed file.

## Data

The block fetches and uploads nothing: it hands the chosen files to the page and renders the upload the page reports back. `ProjectIntakeUpload` and `ProjectIntakeProps` are exported from `state-project-intake.vue`, and `sample.ts` holds the two sample uploads the Initializing and UploadError variants pass.

| Prop          | Type                    | What it does                                                                                                  |
| ------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| `uploads`     | `ProjectIntakeUpload[]` | The files of the upload, in order, with their status and progress. Set, the overlay replaces the drop target. |
| `title`       | `string`                | The drop target's heading (`Drop your project to deploy it`).                                                 |
| `description` | `string`                | What the drop target accepts.                                                                                 |

| Event    | Payload          | When                                                                                                                                  |
| -------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `select` | `(event, files)` | Files were dropped, or a folder was chosen with Choose a folder.                                                                      |
| `retry`  | `(event, id)`    | Retry on one failed file (its `id`), or Retry in the `Alert` (`undefined`, every failed file). The row shows uploading again at once. |
| `cancel` | `(event, id)`    | Cancel on one moving file, or Cancel all (`undefined`). The row shows canceled at once.                                               |

To go live, start the upload on `select` and pass its progress back:

```vue
<script setup lang="ts">
  import StateProjectIntake from './state-project-intake.vue'

  const { uploads, start, retry, cancel } = useProjectUpload()
</script>

<template>
  <StateProjectIntake
    :uploads="uploads"
    @select="(event, files) => start(files)"
    @retry="(event, id) => retry(id)"
    @cancel="(event, id) => cancel(id)"
  />
</template>
```

Keep `uploads` `undefined` until the first file arrives, so the drop target shows. Then delete `sample.ts` with the variants.

## Do

- Keep the drop target where a drop does something, with Choose a folder beside the message.
- Say what dropping does, not how to drop: the user is already dragging.
- Render Initializing over the page the drop came from (Home, its empty state, the creation hub), so the user keeps their place.
- Advance the rows in order and keep finished rows visible while the list is short; past 50 files list only what is still moving.
- Keep Choose a folder in the drop target; drag and drop is a shortcut, never the only way.

## Don't

- Don't use a percentage bar alone for a handful of files; the per-file rows say more.
- Don't hide a failed file in the list; say it in the `Alert` and keep Retry on its row.
- Don't show the drop target on pages where a drop does nothing.
- Don't keep the overlay up after the upload ends; hand over to the deploy's own progress.

## Copy

- **Drop heading:** what the drop does, one line: `Drop your project to deploy it`. On a project page: `We build a new version of web-app, then you choose where it goes live.`
- **Drop lead:** what is accepted, full sentences: `A project folder, or the files inside one. We detect what it is built with.`
- **Overlay heading:** one word for the phase: `Initializing`; `Upload paused` while a file has failed, with the danger `Alert` as the only summary of the failure. The `UploadProgress` header is the one place that counts the files.
- **Overlay progress:** what is happening and how far, with a period: `Setting up your deployment. 2 of 5 files.`
- **Summary:** count and total size, formatted with `formatFileSize` from `useLocale` like the rows: `5 files, 8.4 kB`.
- **Failure:** what failed and what to do: `1 file could not be uploaded. Retry it, or remove it from the folder and drop the project again.`

## Accessibility

- The drop target names itself through its title and description; Choose a folder is the keyboard and screen reader path, and the number of received files is announced once.
- `UploadProgress` announces the transfer summary in its own status region, without stealing focus; the overlay itself is not a live region, so rows changing are not re-announced.
- Each row says its status in words; glyphs are decorative.
- Every fade and the row advance honour `prefers-reduced-motion`.

## States

- DropZone: `uploads` left out; the drop target fills the page body with the drop message and Choose a folder.
- Initializing: `uploads` set; the overlay mid-upload, two files uploaded, the third uploading, two queued, each row with its status in words, path and size.
- UploadError: `uploads` holds a file with `status: 'error'`; one file failed, its row shows the reason and Retry, and a danger `Alert` above the list sums it up with Retry.

## Related

- `state/state-first-use` — an empty list page that can also render the drop target.
- `create/create-hub` — a creation hub that renders the drop target and Initializing.
- `dashboard/dashboard-home` — Home and its empty state, which render both surfaces.
- `state/state-async-submit` — how the deploy that follows reports back.
