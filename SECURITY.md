# Security policy

## Supported versions

| Package                                                                                                                              | Supported |
| ------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| `@aziontech/webkit` 6.x, with the `@aziontech/theme`, `@aziontech/icons` and `@aziontech/webkit-mcp` releases published alongside it | Yes       |
| Anything older than 6.0                                                                                                              | No        |

Fixes land on `main` and ship in the next 6.x release. Older majors receive no security fixes;
upgrade with `npx @aziontech/webkit migrate v6`.

## Reporting a vulnerability

Report it privately. Do not open a public issue, pull request or discussion.

Send an email to **security@azion.com**, the Azion security office, with:

- the affected package and version, tag or commit;
- the type of vulnerability and what an attacker could do with it;
- the steps to reproduce it, and a proof of concept when you have one.

When the repository's **Security** tab shows **Report a vulnerability** (GitHub private
vulnerability reporting), you can report there instead; only the maintainers and you see it.

We acknowledge the report within two business days and send a status update within five. We agree
a fix and a disclosure date with you, and publish a GitHub security advisory (with a CVE where it
applies) when the fixed version is on npm. We credit you in the advisory unless you ask us not to.

## Scope

In scope: the published npm packages (`@aziontech/webkit`, `@aziontech/theme`,
`@aziontech/icons`, `@aziontech/webkit-mcp`) and the workflows in `.github/workflows/` that build
and publish them. The docs site and demos are in scope when the problem comes from code in this
repository.

Out of scope: vulnerabilities in a dependency that we do not ship or call in a vulnerable way, and
findings that need a compromised maintainer account or machine.
