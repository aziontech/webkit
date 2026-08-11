// The functions the sample is seeded with — the Build → Functions module.
//
// A FUNCTION is the code itself, written once and instanced per application (an
// application's Functions Instances tab binds a function with its own arguments).
// So this list is the library, not the bindings: a row is a function, its runtime
// and how many instances currently run it.
//
// `modifiedAt` is the real instant — the Last Modified filter compares it, the cell
// renders it relative, and `lastModified` (the sortable display string) is derived
// from it by one formatter instead of being hand-written per row.
import { daysAgo, formatListDate } from "./dates";
import { authorAt, emailOf } from "./people";

/** The seeded functions, in list order. */
export const FUNCTIONS = [
  {
    id: "4021884",
    name: "auth-handler",
    runtime: "JavaScript",
    language: "javascript",
    instances: 4,
    status: "Active",
    modifiedAt: daysAgo(3),
  },
  {
    id: "4021885",
    name: "image-optimizer",
    runtime: "JavaScript",
    language: "javascript",
    instances: 2,
    status: "Active",
    modifiedAt: daysAgo(11),
  },
  {
    id: "4021886",
    name: "geo-router",
    runtime: "JavaScript",
    language: "javascript",
    instances: 6,
    status: "Active",
    modifiedAt: daysAgo(21),
  },
  {
    id: "4021887",
    name: "ab-test-splitter",
    runtime: "JavaScript",
    language: "javascript",
    instances: 1,
    status: "Draft",
    modifiedAt: daysAgo(2),
  },
  {
    id: "4021888",
    name: "waf-log-shipper",
    runtime: "WebAssembly",
    language: "rust",
    instances: 3,
    status: "Active",
    modifiedAt: daysAgo(44),
  },
  {
    id: "4021889",
    name: "signed-url-guard",
    runtime: "JavaScript",
    language: "javascript",
    instances: 0,
    status: "Inactive",
    modifiedAt: daysAgo(96),
  },
  {
    id: "4021890",
    name: "html-rewriter",
    runtime: "WebAssembly",
    language: "rust",
    instances: 2,
    status: "Active",
    modifiedAt: daysAgo(7),
  },
  {
    id: "4021891",
    name: "bot-score-tagger",
    runtime: "JavaScript",
    language: "javascript",
    instances: 5,
    status: "Active",
    modifiedAt: daysAgo(15),
  },
].map((fn, index) => {
  const person = authorAt(index);
  return {
    ...fn,
    author: person.name,
    authorEmail: emailOf(person.name),
    authorAvatar: person.avatar,
    lastModified: formatListDate(fn.modifiedAt),
  };
});

/** A seeded function by id, or `undefined`. */
export const functionById = (id) => FUNCTIONS.find((fn) => fn.id === String(id));

/** The function at `index`, wrapping round. */
export const functionAt = (index) => FUNCTIONS[index % FUNCTIONS.length];
