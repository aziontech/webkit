// The certificates the sample is seeded with — the Secure → Certificate Manager
// module.
//
// A certificate list is read by asking one question first: what is about to expire.
// So EXPIRY is a real field here rather than only a sortable column, and it is a set
// of forward-looking windows (`Expired`, `Within 30 days`, …) rather than the
// backward-looking periods every other date field offers — "changed in the last 7
// days" is the wrong question to ask of an expiry date.
//
// `expiresAt` is the real instant; `expires` is the display string derived from it.
import { daysAgo, formatListDate } from "./dates";
import { authorAt, emailOf } from "./people";

/** A date `days` from now — the mirror of `daysAgo`, for expiry dates. */
const daysAhead = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

/** Certificate kind → the label every surface shows. */
export const CERTIFICATE_TYPES = {
  "edge-certificate": "Edge Certificate",
  "trusted-ca": "Trusted CA",
  "let-s-encrypt": "Let's Encrypt",
};

/** The label for a certificate type id, falling back to the id itself. */
export const certificateTypeLabel = (id) => CERTIFICATE_TYPES[id] ?? id;

/** The type list a filter field offers. */
export const certificateTypeOptions = Object.entries(CERTIFICATE_TYPES).map(
  ([value, label]) => ({ value, label })
);

/**
 * The expiry windows the Expiry field offers.
 *
 * `kind: 'range'` on the field, so exactly one is picked at a time — the windows
 * overlap by design (everything expiring within 30 days is also expiring within 90),
 * and holding two at once would say nothing the wider one does not.
 */
export const EXPIRY_WINDOWS = [
  { value: "expired", label: "Expired" },
  { value: "30d", label: "Within 30 days" },
  { value: "90d", label: "Within 90 days" },
  { value: "1y", label: "Within a year" },
];

/** Whether `date` falls inside the picked expiry window. */
export const matchExpiry = (date, values) => {
  const [window] = values ?? [];
  if (!window || !(date instanceof Date)) return true;
  const days = (date.getTime() - Date.now()) / (24 * 60 * 60 * 1000);
  if (window === "expired") return days < 0;
  if (window === "30d") return days >= 0 && days <= 30;
  if (window === "90d") return days >= 0 && days <= 90;
  if (window === "1y") return days >= 0 && days <= 365;
  return true;
};

/** The seeded certificates, in list order. */
export const CERTIFICATES = [
  {
    id: "cert-8801",
    name: "edgeflow.com wildcard",
    type: "edge-certificate",
    subject: "*.edgeflow.com",
    issuer: "DigiCert",
    status: "Active",
    expiresAt: daysAhead(212),
    modifiedAt: daysAgo(153),
  },
  {
    id: "cert-8802",
    name: "azion.design",
    type: "let-s-encrypt",
    subject: "azion.design",
    issuer: "Let's Encrypt",
    status: "Active",
    expiresAt: daysAhead(21),
    modifiedAt: daysAgo(69),
  },
  {
    id: "cert-8803",
    name: "api.edgeflow.com",
    type: "edge-certificate",
    subject: "api.edgeflow.com",
    issuer: "DigiCert",
    status: "Active",
    expiresAt: daysAhead(74),
    modifiedAt: daysAgo(291),
  },
  {
    id: "cert-8804",
    name: "legacy origin CA",
    type: "trusted-ca",
    subject: "legacy.edgeflow.com",
    issuer: "Internal CA",
    status: "Expired",
    expiresAt: daysAhead(-38),
    modifiedAt: daysAgo(403),
  },
  {
    id: "cert-8805",
    name: "staging wildcard",
    type: "edge-certificate",
    subject: "*.staging.edgeflow.com",
    issuer: "DigiCert",
    status: "Active",
    expiresAt: daysAhead(340),
    modifiedAt: daysAgo(25),
  },
  {
    id: "cert-8806",
    name: "partner mTLS CA",
    type: "trusted-ca",
    subject: "partners.edgeflow.com",
    issuer: "Internal CA",
    status: "Pending",
    expiresAt: daysAhead(3),
    modifiedAt: daysAgo(4),
  },
].map((certificate, index) => {
  const person = authorAt(index);
  return {
    ...certificate,
    typeLabel: certificateTypeLabel(certificate.type),
    expires: formatListDate(certificate.expiresAt),
    author: person.name,
    authorEmail: emailOf(person.name),
    authorAvatar: person.avatar,
    lastModified: formatListDate(certificate.modifiedAt),
  };
});

/** A seeded certificate by id, or `undefined`. */
export const certificateById = (id) =>
  CERTIFICATES.find((certificate) => certificate.id === String(id));
