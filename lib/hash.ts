export function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function pickFromArray<T>(items: T[], hash: number): T {
  if (!items.length) {
    throw new Error('Cannot pick from an empty array');
  }
  const index = hash % items.length;
  return items[index];
}
