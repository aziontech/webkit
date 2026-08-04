// Walking a webkit `Menu` tree down to its destinations.
//
// Both command palettes in this app (the console rail's and the docs shell's) list
// the navigation they sit next to, and neither may offer a CONTAINER as a result:
// "Build" or "Modules" navigate nowhere, so picking one from a palette would look
// broken. This walks a Menu tree to its leaves, descending both shapes a container
// can take — an inline sub-menu (`children`) and a drill's own groups (`groups`).
export const menuLeaves = (nodes) =>
  nodes.flatMap((node) =>
    node.children
      ? menuLeaves(node.children)
      : node.groups
        ? menuLeaves(node.groups.flatMap((group) => group.items))
        : [node]
  );

// The container ids on the way down to `id`, outermost first — what a palette jump
// has to open for the row it selected to be visible in the rail. Without it, landing
// on `Secure → Firewall → Modules → WAF → Guides → …` from a search would move the
// selection to a row nobody can see. Empty array when the id is at the root or absent.
export const menuPath = (nodes, id) => {
  for (const node of nodes) {
    if (node.id === id) return [];
    const children = node.children ?? node.groups?.flatMap((group) => group.items);
    if (!children) continue;
    const below = menuPath(children, id);
    if (below) return [node.id, ...below];
  }
  return null;
};
