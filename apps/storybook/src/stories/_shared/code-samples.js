const IMPORT = 'import'

const FILE_UPLOAD = `${IMPORT} type { AzionBucketObject, AzionStorageResponse } from "azion/storage";
${IMPORT} { createObject } from "azion/storage";
${IMPORT} { Hono } from "hono";

const app = new Hono();

app.post("/upload", async (c) => {
  const body = await c.req.parseBody();
  const file = body["file"]; // File | string

  // First check if file is a valid File object
  if (
    !file ||
    typeof file !== "object" ||
    typeof file.arrayBuffer !== "function"
  ) {
    return c.json({ message: "Invalid file" }, 400);
  }

  const { data: newObject } = (await createObject({
    bucket: "uploads",
    key: file.name,
    content: await file.arrayBuffer(),
  })) as AzionStorageResponse<AzionBucketObject>;

  return c.json({ key: newObject?.key }, 201, {
    "Content-Type": file.type,
    "Content-Disposition": \`attachment; filename="\${newObject?.key}"\`,
    "Content-Length": newObject?.size?.toString() ?? "0",
  });
});

export default app;`

const TRANSACTIONAL_EMAIL = `${IMPORT} { Hono } from "hono";

const app = new Hono();

app.post("/welcome", async (c) => {
  const { email, name } = await c.req.json();

  // The API key lives in the workload's environment, never in the bundle
  const sent = await fetch("https://api.provider.com/v1/messages", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${Azion.env.get("EMAIL_API_KEY")}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: email,
      subject: "Welcome aboard",
      text: \`Hi \${name}, your account is ready.\`,
    }),
  });

  if (!sent.ok) {
    return c.json({ message: "Could not send the email" }, 502);
  }

  return c.json({ queued: true }, 202);
});

export default app;`

export const FUNCTION_SAMPLE_TABS = [
  {
    label: 'File upload',
    value: 'file-upload',
    language: 'typescript',
    code: FILE_UPLOAD,
    fileName: 'github.com/aziontech/azion-samples',
    fileIcon: 'pi pi-github'
  },
  {
    label: 'Send transactional emails',
    value: 'transactional-email',
    language: 'typescript',
    code: TRANSACTIONAL_EMAIL,
    fileName: 'github.com/aziontech/azion-samples',
    fileIcon: 'pi pi-github'
  }
]
