<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import CodeSplit from '@aziontech/webkit/code-split'

  const codeTabs = [
    {
      label: 'File upload',
      value: 'file-upload',
      language: 'typescript',
      code: 'import type { AzionBucketObject, AzionStorageResponse } from "azion/storage";\nimport { createObject } from "azion/storage";\nimport { Hono } from "hono";\n\nconst app = new Hono();\n\napp.post("/upload", async (c) => {\n  const body = await c.req.parseBody();\n  const file = body["file"]; // File | string\n\n  // First check if file is a valid File object\n  if (\n    !file ||\n    typeof file !== "object" ||\n    typeof file.arrayBuffer !== "function"\n  ) {\n    return c.json({ message: "Invalid file" }, 400);\n  }\n\n  const { data: newObject } = (await createObject({\n    bucket: "uploads",\n    key: file.name,\n    content: await file.arrayBuffer(),\n  })) as AzionStorageResponse<AzionBucketObject>;\n\n  return c.json({ key: newObject?.key }, 201, {\n    "Content-Type": file.type,\n    "Content-Disposition": `attachment; filename="${newObject?.key}"`,\n    "Content-Length": newObject?.size?.toString() ?? "0",\n  });\n});\n\nexport default app;',
      fileName: 'github.com/aziontech/azion-samples',
      fileIcon: 'pi pi-github'
    },
    {
      label: 'Send transactional emails',
      value: 'transactional-email',
      language: 'typescript',
      code: 'import { Hono } from "hono";\n\nconst app = new Hono();\n\napp.post("/welcome", async (c) => {\n  const { email, name } = await c.req.json();\n\n  // The API key lives in the workload\'s environment, never in the bundle\n  const sent = await fetch("https://api.provider.com/v1/messages", {\n    method: "POST",\n    headers: {\n      Authorization: `Bearer ${Azion.env.get("EMAIL_API_KEY")}`,\n      "Content-Type": "application/json",\n    },\n    body: JSON.stringify({\n      to: email,\n      subject: "Welcome aboard",\n      text: `Hi ${name}, your account is ready.`,\n    }),\n  });\n\n  if (!sent.ok) {\n    return c.json({ message: "Could not send the email" }, 502);\n  }\n\n  return c.json({ queued: true }, 202);\n});\n\nexport default app;',
      fileName: 'github.com/aziontech/azion-samples',
      fileIcon: 'pi pi-github'
    }
  ]

  const primaryAction = {
    label: 'Explore Azion Lib',
    href: 'https://www.azion.com/en/documentation/products/azion-lib/overview/',
    trailing: true
  }

  const secondaryAction = {
    label: 'See GitHub',
    href: 'https://github.com/aziontech',
    icon: 'pi pi-github',
    target: '_blank'
  }
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <CodeSplit
      title="From hello world to full-stack applications"
      description="Run application logic next to what a full-stack product needs: SQL Database, KV Store, Object Storage and AI Inference, through Azion libraries."
      :code-tabs="codeTabs"
      copy-aria-label="Copy the code sample"
      :primary-action="primaryAction"
      :secondary-action="secondaryAction"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
