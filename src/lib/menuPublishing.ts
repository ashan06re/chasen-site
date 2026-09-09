/** Only an unambiguous explicit publish choice opens a store's menu. */
export function menuIsPublished(rows: Array<{store: string; status: string}>, store: string) {
  const matching = rows.filter(row => row.store === store);
  return matching.length === 1 && matching[0].status === '投稿する';
}

export function photoPreset(size: string, position: string) {
  const zoom: Record<string, number> = { '標準': 100, '少し寄る': 115, '大きく見せる': 130 };
  const point: Record<string, [number, number]> = {
    '中央': [50, 50], '上': [50, 20], '下': [50, 80], '左': [20, 50], '右': [80, 50],
  };
  return { photoZoom: zoom[size], photoX: point[position]?.[0], photoY: point[position]?.[1] };
}
