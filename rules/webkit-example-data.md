# Rule: example data — reserved domains, one sample company, no national formats

Seed data, placeholders, mocks, fixtures and screenshots are **sample data**. Write it in one house format, the one shadcn, Stripe and Cloudscape use, so a mock never collides with a real customer, company or person, and a screen reads the same in any market.

## Do

- Use **`example.com`** for every sample host and email: `https://example.com`, `app.example.com`, `api.example.com`, `jane.doe@example.com`, `m@example.com`. Use `example.org` for a second party and `example.net` for a third. These are reserved for documentation (RFC 2606) and never resolve to anyone.
- Use **Acme** (`Acme Inc.`) as the one sample company, and name resources for what they are: `production`, `staging`, `site-assets`, `docs-site`, `acme-store`.
- Use neutral fictional people: Jane Doe, John Smith, Alex Morgan, Sam Lee, Priya Patel.
- Write phones as `+1 555-0100` … `+1 555-0199` (reserved fictional numbers) and addresses in US format: `100 Market Street`, `Suite 400`, `San Francisco`, `California`, `94105`, `United States`.
- Show money in USD (`$49`), dates in en-US or ISO, and default time zones to UTC.
- Take sample IPs from the documentation ranges: `192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`, `2001:db8::/32`.
- Start blank forms **empty**, and never seed a field the person edits with a sample value: sample emails and names belong in tables, lists and menus, not as a field's starting value. A placeholder is at most a short example in this format (`m@example.com`) or nothing.
- Label a company tax field `Tax ID`, with no mask.

## Do not

- Do not invent a domain or a brand (`edgeflow.com`, `company.com`, `mydomain.com`, `example.app`, `Contoso`).
- Do not use one country's identity formats in sample data: no CPF, CNPJ, CEP or SSN values, labels or masks (`00.000.000/0001-00`, `00000-000`), no `+55` phones, no `R$` amounts.
- Do not preselect a country, state or city in a blank form. Keep every country in the list, in alphabetical order.
- Do not default a component's country, currency, zone or locale to one market; let the app pass it.
- Do not hot-link avatars or photos from another site; use local assets or initials.

A link to a real resource stays real: your product's own domains, documentation, GitHub or a social platform are links, not sample data.
