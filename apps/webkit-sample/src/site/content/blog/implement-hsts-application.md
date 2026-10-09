### Introduction

In a landscape of growing digital threats, security headers like HSTS and CSP are essential to protect web applications and their users. However, many domains still do not implement these protections effectively. This article aims to provide a technical and practical guide to implement HSTS and CSP at the edge using Azion **Applications**, with Rules Engine examples and a checklist to ensure a successful rollout.

---

### Why are HSTS + CSP important?

- **HSTS (Strict-Transport-Security)**: instructs browsers to always use HTTPS for the domain for a defined period (max-age). It protects against downgrade attacks and reduces windows for MITM (Man-in-the-Middle) attacks.
- **CSP (Content-Security-Policy)**: defines trusted sources for scripts, styles, images, connections, frames, among others, mitigating XSS (Cross-Site Scripting) attacks and data exfiltration via third-party resources.
- **Combined benefits**: reduce the attack surface, increase the security of applications that handle sensitive data, and help meet regulatory requirements such as LGPD and HIPAA.

---

### Benefits of applying HSTS + CSP at the edge with Azion

- **Delivery with reduced latency**: headers are applied at the first point of presence, reducing latency and protecting before requests reach the origin.
- **Instant deployments**: changes can be applied and rolled back quickly via Rules Engine, without the need for changes to the origin infrastructure.
- **Continuous protection**: even if the origin is unavailable, security policies continue to be applied at the edge.

---

### Expected results after implementation

- **Connections forced to HTTPS**: eliminates downgrade risks.
- **XSS prevention**: blocking of malicious scripts with CSP.
- **Reduced latency**: headers delivered directly at the edge, reducing the time to apply policies.
- **Less malicious traffic**: blocking malicious requests before they reach the origin.
- **Better compliance posture**: security headers help meet regulatory requirements and audits.

---

### Technical implementation — step by step in Azion Console

#### 1. Force HTTPS (HTTP → HTTPS)

**Goal**: ensure that all connections are made over HTTPS.

1. Access Azion Console > **Applications**.
2. Select the desired **Application**.
3. Click the **Rules Engine** tab.
4. Click **+ Rule**.
5. Define a name and description, such as “Redirect to HTTPS”.
6. Select **Request Phase**.
7. In **Criteria**, define for which cases the header will be added. If you want to add it for all, use this rule:

- IF `${uri}` STARTS WITH `/` .

1. In **Behavior** define:

- “Redirect HTTP to HTTPS”.

1. Click **Save**.

---

#### 2. Add HSTS Header

**Recommended header**:

1. Access Azion Console > **Applications**.
2. Select the desired **Application**.
3. Click the **Rules Engine** tab.
4. Click **+ Rule**.
5. Define a name and description, such as “Add HSTS Header”.
6. Select **Response Phase**.
7. In **Criteria**, define for which cases the header will be added. If you want to add it for all, use this rule:

- IF `${uri}` STARTS WITH `/` .

1. In **Behavior** define:

- **Add Response Header** and `Strict-Transport-Security: max-age=31536000. includeSubDomains`.

1. Click “Save”.

**Best practices**:

- **Preload**: only add the `preload` parameter after ensuring all subdomains support HTTPS. Submit the domain at [hstspreload.org](https://hstspreload.org/) for inclusion in the preload list.
- **includeSubDomains**: use only if all subdomains are configured for HTTPS.

---

#### 3. Add CSP

**How to create an effective CSP policy**:

1. **Start with an asset inventory**:
  - List all scripts, styles, images, and other resources used by your site
  - Identify all third-party domains that provide resources
2. **Define directives by content type**:
  - `default-src`: fallback directive for other unspecified directives
  - `script-src`: controls which scripts can be executed
  - `style-src`: controls CSS styles
  - `img-src`: controls images
  - `connect-src`: limits origins for fetch, XHR, and WebSockets requests
3. **Evolve gradually**:
  - Start with less restrictive policies in report-only mode
  - Analyze the reports and refine the rules
  - Move to enforced mode when you are confident in the policy
4. **Test across environments**:
  - Verify behavior in multiple browsers
  - Test with different user flows

**Note**: For a complete reference on CSP directives and supported values, see the [Content Security Policy reference](https://content-security-policy.com/).

1. **Configuring the CSP header in Azion Console**:

Here we use a header with example values. Remember to adjust the values for your domains and resources.

**Start with report-only mode**: allows you to collect violation reports before enforcing the policy.  **Example of how to configure the CSP header in report-only mode**:

1. Access Azion Console > **Applications**.
2. Select the desired **Application**.
3. Click the **Rules Engine** tab.
4. Click **+ Rule**.
5. Define a name and description, such as “Add CSP Header”.
6. Select **Response Phase**.
7. In **Criteria**, define for which cases the header will be added. If you want to add t for all, use this rule:

- IF `${uri}` STARTS WITH `/` .

1. In **Behavior** define:

- **Add Response Header** and `Content-Security-Policy-Report-Only: default-src 'self'. script-src 'self' https://trusted-scripts.example.com. style-src 'self' 'unsafe-inline'. img-src 'self' data: https:. connect-src 'self' https://api.example.com. frame-ancestors 'none'. report-uri https://example.com/csp-report`.

1. Click **Save**.

**After adjustments, apply in enforced mode**:

1. In the same location as the previous step, edit the value of “Add Response Header” to:

- `Content-Security-Policy: default-src 'self'. script-src 'self' https://trusted-scripts.example.com. style-src 'self' 'unsafe-inline'. img-src 'self' data: https:. connect-src 'self' https://api.example.com. frame-ancestors 'none'.`.

1. Click “Save”.

**Best practices for CSP**:

- Minimize the use of `'unsafe-inline'` and prefer hashes or nonces for inline scripts.
- Use `report-to` for modern reporting, but keep `report-uri` for compatibility with older browsers.
- Adjust the policy based on the collected reports before applying in enforced mode.

---

### Rollout checklist and monitoring

- **Canary deploy**: apply the policies on a subdomain or a small percentage of traffic for initial tests.
- **Report collection**: send CSP reports to an endpoint configured for analysis (for example, SIEM or database).
- **Verification tools**:
  - [securityheaders.com](https://securityheaders.com) to validate headers.
  - `curl` to check HTTP responses directly.
- **Continuous monitoring**: use tools like Sentry or Datadog to monitor errors related to CSP and HSTS.

---

### Next steps

Do you want me to generate Azion rules ready to import in your preferred format (UI JSON, API payload, or Terraform)? Or do you prefer a detailed guide for automated tests with `curl`?

**Technical notes**:

- Examples provided are representative and may need adjustments depending on the Azion Console or API version.
- Make sure to validate the policies in a staging environment before applying them in production.
- For HSTS preload, follow the requirements from [hstspreload.org](https://hstspreload.org/) for submission.

**Expected impact**:

- **Before**: Without HSTS and CSP. higher exposure to downgrade, MITM and XSS attacks.
- **After**: HTTPS enforced. HSTS and CSP applied at the edge. Lower latency, higher security and regulatory compliance.

---
