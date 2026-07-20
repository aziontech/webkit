// Shared "team members" used as mock authors across every list view (the
// Last Modified avatar). Photos are the team's Slack profile images (public
// ca.slack-edge.com CDN); LastModifiedCell falls back to a person's initials
// if an image fails to load, so no table ever breaks.
export const people = [
  { name: "Robson Junior", avatar: "https://ca.slack-edge.com/TDVATDGUU-UDW2MSZAP-81cad567c9a1-512" },
  { name: "Isaque Böck", avatar: "https://ca.slack-edge.com/TDVATDGUU-U09745PDX6D-971b0e576ab1-512" },
  { name: "Rafael Garbinatto", avatar: "https://ca.slack-edge.com/TDVATDGUU-ULU0NHDSM-5c3d561a39e1-512" },
  { name: "Herbert Júlio", avatar: "https://ca.slack-edge.com/TDVATDGUU-U036GK4J347-399781903ba3-512" },
  { name: "Rafael Umman", avatar: "https://ca.slack-edge.com/TDVATDGUU-UDUPJUL1E-d70389018587-512" },
  { name: "Marcus Grando", avatar: "https://ca.slack-edge.com/TDVATDGUU-UDVG1K05Q-g75bb0e36e1c-512" },
  { name: "Bruno Germano", avatar: "https://ca.slack-edge.com/TDVATDGUU-U08HZ0M4P1D-16b5a8e0519a-512" },
  { name: "Gab Lisboa", avatar: "https://ca.slack-edge.com/TDVATDGUU-U0279S2BC12-d09077d857f7-512" },
];

// Round-robin author for row `index` — spreads the team evenly across a list.
export const authorAt = (index) => people[index % people.length];
