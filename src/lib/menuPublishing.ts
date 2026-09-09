/** Only an unambiguous explicit publish choice opens a store's menu. */
export function menuIsPublished(rows: Array<{store: string; status: string}>, store: string) {
  const matching = rows.filter(row => row.store === store);
  return matching.length === 1 && matching[0].status === '投稿する';
}
