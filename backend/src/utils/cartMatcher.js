export function normalizeCartItemId(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object') {
    if (value._id) return normalizeCartItemId(value._id);
    if (value.id) return normalizeCartItemId(value.id);
    if (value.productid) return normalizeCartItemId(value.productid);
  }
  return String(value).trim();
}

export function findCartItemIndex(items, targetId) {
  const normalized = normalizeCartItemId(targetId);

  return items.findIndex((item) => {
    if (!item) return false;

    const itemId = normalizeCartItemId(item._id);
    const productId = normalizeCartItemId(item.productid);

    return itemId === normalized || productId === normalized;
  });
}
