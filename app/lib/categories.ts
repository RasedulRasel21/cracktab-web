/**
 * Category tree helpers.
 *
 * There will only ever be a handful of categories, so the whole set is fetched
 * once and the tree is assembled in memory. That avoids recursive SQL and, more
 * usefully, means "give me every descendant of X" is a walk rather than a query
 * per level.
 */

export type FlatCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
};

export type CategoryNode = FlatCategory & {
  children: CategoryNode[];
  /** Posts filed here plus everything beneath it. */
  postCount: number;
  depth: number;
};

/**
 * Builds the tree and rolls post counts upward, so a parent showing "12" means
 * twelve posts are reachable from its archive — which is what the archive
 * actually renders.
 */
export function buildTree(
  categories: FlatCategory[],
  ownCounts: Map<string, number> = new Map(),
): CategoryNode[] {
  const nodes = new Map<string, CategoryNode>(
    categories.map((category) => [
      category.id,
      { ...category, children: [], postCount: ownCounts.get(category.id) ?? 0, depth: 0 },
    ]),
  );

  const roots: CategoryNode[] = [];

  for (const node of nodes.values()) {
    // A parent that was deleted concurrently leaves an orphan; treat it as a
    // root rather than dropping it from the tree entirely.
    const parent = node.parentId ? nodes.get(node.parentId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }

  const sortByName = (a: CategoryNode, b: CategoryNode) => a.name.localeCompare(b.name);

  // Depth is assigned by descent, not by counting parents, so a cycle that
  // somehow reached the database can't loop here.
  const assign = (node: CategoryNode, depth: number): number => {
    node.depth = depth;
    node.children.sort(sortByName);
    for (const child of node.children) {
      node.postCount += assign(child, depth + 1);
    }
    return node.postCount;
  };

  roots.sort(sortByName);
  for (const root of roots) assign(root, 0);

  return roots;
}

/** A category's id plus every descendant's — the filter a parent archive needs. */
export function descendantIds(categories: FlatCategory[], rootId: string): string[] {
  const childrenOf = new Map<string, string[]>();
  for (const category of categories) {
    if (!category.parentId) continue;
    const siblings = childrenOf.get(category.parentId) ?? [];
    siblings.push(category.id);
    childrenOf.set(category.parentId, siblings);
  }

  const collected: string[] = [];
  const seen = new Set<string>();
  const queue = [rootId];

  while (queue.length) {
    const id = queue.shift()!;
    // Guards against a cycle turning this into an infinite loop.
    if (seen.has(id)) continue;
    seen.add(id);
    collected.push(id);
    queue.push(...(childrenOf.get(id) ?? []));
  }

  return collected;
}

/** Flattens the tree for a <select>, indenting children. */
export function flattenForSelect(
  nodes: CategoryNode[],
): { id: string; label: string }[] {
  const out: { id: string; label: string }[] = [];
  const walk = (list: CategoryNode[]) => {
    for (const node of list) {
      out.push({ id: node.id, label: `${"— ".repeat(node.depth)}${node.name}` });
      walk(node.children);
    }
  };
  walk(nodes);
  return out;
}

/**
 * Would making `parentId` the parent of `categoryId` create a loop?
 * Re-parenting a category under its own descendant would orphan that whole
 * branch from the roots and hang any naive walk.
 */
export function wouldCycle(
  categories: FlatCategory[],
  categoryId: string,
  parentId: string | null,
): boolean {
  if (!parentId) return false;
  if (parentId === categoryId) return true;
  return descendantIds(categories, categoryId).includes(parentId);
}
