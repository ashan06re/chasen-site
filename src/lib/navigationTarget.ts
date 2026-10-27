/** A same-page link without a fragment means return to its beginning. */
export function isSamePageTopLink(current: URL, target: URL) {
  return current.origin === target.origin && current.pathname === target.pathname && current.search === target.search && !target.hash;
}
