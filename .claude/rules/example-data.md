# Rule: example data — reserved domains, one sample company, no national formats

Every value a reader sees in an example, a block, a demo, a component default, a spec or a skill is **sample data**, and an agent copies it into a real app. So it follows one house format, the one shadcn, Stripe and Cloudscape use: domains reserved for documentation, a neutral fictional person and company, and no country-specific identity formats. The consumer-facing form of this rule is [`rules/webkit-example-data.md`](../../rules/webkit-example-data.md).

## The rule

> Sample hosts are **`example.com`**, its subdomains, **`example.org`** and **`example.net`** (RFC 2606). The one sample company is **Acme**. Personal and company data is **fictional US format**, and no national ID format (CPF, CNPJ, CEP, SSN) or mask appears anywhere. Blank forms start **empty**.

| Value              | House format                                                                                                                         | Never                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Domain, URL        | `example.com`, `app.example.com`, `api.example.com`, `https://example.com/docs`; a second party `example.org`, a third `example.net` | `edgeflow.com`, `company.com`, `example.app`, `mydomain.com`, `example.com.br` |
| Email              | `jane.doe@example.com`, `m@example.com`                                                                                              | `ana@company.com`, `maria.silva@example.com`                                   |
| Company            | Acme (`Acme Inc.`); resources named for what they are: `production`, `staging`, `site-assets`, `docs-site`, `acme-store`             | invented brands (`Edgeflow`, `Contoso`, `Globex`)                              |
| Person             | Jane Doe, John Smith, Alex Morgan, Sam Lee, Priya Patel                                                                              | names of real people; one country's naming pattern throughout                  |
| Phone              | `+1 555-0100` … `+1 555-0199` (reserved fictional numbers)                                                                           | `+55 11 99999-0000`, a real number                                             |
| Address            | `100 Market Street`, `Suite 400`, `San Francisco`, `California`, `94105`, `United States`                                            | `Avenida Paulista, 1000`, `01310-100`                                          |
| Tax field          | `Tax ID`, empty, no mask                                                                                                             | `Company ID` with a CNPJ, CPF, `00.000.000/0001-00`                            |
| Money, dates, zone | USD (`$49`), en-US or ISO dates, UTC                                                                                                 | `R$ 49`, a Brazilian default zone                                              |
| IP address         | `192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`, `2001:db8::/32`                                                                 | a routable or private address presented as a customer's                        |

- **Real hosts are links, not sample data.** A link to the real resource stays real: Azion's own domains (`azion.com`, the `*.azion.app` and `*.azionedge.net` hostnames the product generates, the `aziondns` nameservers), GitHub, a vendor's documentation, a social platform. The allowed list is `EXAMPLE_DATA_ALLOWED_HOSTS` in [`example-data.js`](../../packages/webkit/src/eslint-plugin/example-data.js); adding a host needs the reason in the PR.
- **Selects start empty.** A blank form preselects no country, state or city; a saved state uses the United States. Brazil and every other country stay in the option list, alphabetical, never as the default.
- **Component defaults are neutral.** A default country is `US`, a default currency `USD`, a default zone UTC, a default locale `en`.
- **Placeholders follow shadcn.** A placeholder is at most a short example in the house format (`m@example.com`) or nothing; never a national mask.
- **Translated catalogs are not sample data.** `pt-BR` and `es` message catalogs translate UI text; a locale showcase example still uses house-format data.

## Hard prohibitions

- No sample host outside `example.com` / `example.org` / `example.net` (and the allowed real hosts as real links).
- No CPF, CNPJ, CEP or SSN value, label or mask; no `+55` phone, `R$` amount or Brazilian street in sample data.
- No invented company brand; Acme is the one sample company.
- No national default (country, currency, zone, locale) on a component.
- No preselected country in a blank form.

## Enforcement

- **`example-data`** in [`check-authoring.mjs`](../../packages/webkit/scripts/check-authoring.mjs) (the CI ratchet of the `toolkit` job and the `authoring` gate) scans `packages/webkit/src`, `blocks`, `examples`, `apps/demos/src`, `skills` and `rules` with [`example-data.js`](../../packages/webkit/src/eslint-plugin/example-data.js): `example-data:domain`, `example-data:regional-format` and `example-data:invented-brand`. Tests, translated catalogs and the phone country list are out of scope. Pinned both ways in [`example-data.test.mjs`](../../packages/webkit/test/eslint-plugin/example-data.test.mjs).
- Defaults, preselected options and personal names are not machine-checkable; reviewers hold them (`ui-craft`).

## Why this rule exists

Examples had drifted to one country's data: Brazilian addresses, CEP and CNPJ masks, `+55` phones, `Brazil` preselected, a `PhoneInput` that defaulted to Brazil, and an invented `edgeflow` brand in fragment domains. Every agent that copied a block carried those into a product for any market. Reserved documentation domains and one neutral fictional format are what every reference system uses, and they cannot collide with a real customer, company or person.
