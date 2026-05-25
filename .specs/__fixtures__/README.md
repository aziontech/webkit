# `.specs/__fixtures__/` — invalid specs

Each file in this directory is **intentionally broken**. The hook test suite runs `spec-validator` against every fixture; if the validator does **not** block the fixture, the test fails.

Fixtures are **not** real components and are excluded from `/component-create` discovery (any name starting with `_` is ignored).

## Catalog

| Fixture | What's wrong | Validator that should block |
|---|---|---|
| `_extra-prop.md` | Props table has `tone` but the Constraints block forbids it (synthetic clash). | spec-validator (Constraints check) |
| `_missing-jsdoc.md` | A row in the Props table has an empty JSDoc cell. | spec-validator |
| `_kebab-event.md` | An event is named `onClick` instead of kebab-case. | spec-validator |
| `_hex-token.md` | The Tokens table references `#0066ff` instead of a `var(--*)`. | spec-validator |
| `_missing-constraints.md` | The Constraints — DO NOT block is absent. | spec-validator |
| `_bad-checksum.md` | `status: approved` but `checksum` is wrong. | enforce-spec-exists |
| `_locked-no-bump.md` | `status: locked`; trying to re-implement without a new `spec_version`. | enforce-spec-exists |

Update this README every time you add a fixture.
