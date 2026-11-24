# Security policy

## Supported versions

| Package                                                                                                                              | Supported |
| ------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| `@aziontech/webkit` 6.x, with the `@aziontech/theme`, `@aziontech/icons` and `@aziontech/webkit-mcp` releases published alongside it | Yes       |
| Anything older than 6.0                                                                                                              | No        |

Fixes land on `main` and ship in the next 6.x release. Older majors receive no security fixes;
upgrade with `npx @aziontech/webkit migrate v6`.

## Reporting a vulnerability

Email **[security@azion.com](mailto:security@azion.com)**, the Azion Security Office. Do not open
a public issue, pull request or discussion, and do not post details anywhere public.

Put this in the email:

1. The affected package and version (for example `@aziontech/webkit` 6.0.0).
2. How to reproduce it. A minimal reproduction helps most.
3. What an attacker could do with it.

If the repository's **Security** tab shows a **Report a vulnerability** button (GitHub private
vulnerability reporting), you can use it instead; it reaches the same people. The email address
always works.

Only the Security Office, the maintainers and you see the report. We aim to acknowledge it within
three business days, agree a fix and a disclosure date with you, and publish a GitHub security
advisory (with a CVE where it applies) when the fixed version is on npm. We credit you in the
advisory unless you ask us not to.

## How the code is checked

Every pull request and every merge to `main` runs the same scans as Azion's other repositories,
and they run again every week: Semgrep (code scanning), osv-scanner (known vulnerabilities in the
lockfiles), Gitleaks (secrets in the whole history), a review of every new dependency's
vulnerabilities and license, `pnpm audit`, TruffleHog, the workflow linters actionlint and zizmor,
and the OSSF Scorecard. Each release carries a CycloneDX SBOM and npm provenance.

## Scope

In scope: the published npm packages (`@aziontech/webkit`, `@aziontech/theme`,
`@aziontech/icons`, `@aziontech/webkit-mcp`) and the workflows in `.github/workflows/` that build
and publish them. The docs site and demos are in scope when the problem comes from code in this
repository.

Out of scope: vulnerabilities in a dependency that we do not ship or call in a vulnerable way, and
findings that need a compromised maintainer account or machine.
