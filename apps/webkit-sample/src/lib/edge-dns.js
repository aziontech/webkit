// Shared Edge DNS domain data used across the zone list, create flow, zone
// detail (Main Settings + Records), and the Create Record drawer, so the
// nameservers, record types, and TTL/policy vocabulary stay identical
// everywhere the module renders them.

// Azion's authoritative nameservers — the values a user copies into their
// domain provider to delegate the zone. Shown read-only in the zone detail's
// "Configure your Nameserver" section and copied by the list's "Copy
// Nameserver Values" action.
export const NAMESERVERS = ["ns1.aziondns.net", "ns2.aziondns.com", "ns3.aziondns.org"];

// The record types Edge DNS supports. `placeholder` seeds the Value field and
// `valueHelper` describes the accepted format — both switch with the selected
// type in the Create Record drawer.
export const RECORD_TYPES = [
  { value: "A", label: "A - IPv4 Address", placeholder: "192.0.2.1", valueHelper: "Accepts an IPv4 address." },
  { value: "AAAA", label: "AAAA - IPv6 Address", placeholder: "2001:db8::1", valueHelper: "Accepts an IPv6 address." },
  { value: "CNAME", label: "CNAME - Canonical Name", placeholder: "example.com", valueHelper: "Accepts a single hostname." },
  { value: "MX", label: "MX - Mail Exchange", placeholder: "10 mail.example.com", valueHelper: "Accepts a priority and a mail server, e.g. 10 mail.example.com." },
  { value: "TXT", label: "TXT - Text", placeholder: "v=spf1 include:example.com ~all", valueHelper: "Accepts free-form text." },
  { value: "NS", label: "NS - Nameserver", placeholder: "ns1.example.com", valueHelper: "Accepts a nameserver hostname." },
];

export const recordType = (value) => RECORD_TYPES.find((type) => type.value === value) ?? RECORD_TYPES[0];

// Simple = standard DNS resolution; Weighted = distribute answers by weight.
export const POLICY_TYPES = [
  { value: "simple", label: "Simple" },
  { value: "weighted", label: "Weighted" },
];

export const policyLabel = (value) => POLICY_TYPES.find((policy) => policy.value === value)?.label ?? "";
