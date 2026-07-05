export function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 1) return [1];

  const siblings = 1;
  const pages: (number | 'ellipsis')[] = [1];

  const showLeftEllipsis = current - siblings > 2;
  const showRightEllipsis = current + siblings < total - 1;

  if (showLeftEllipsis) pages.push('ellipsis');

  const start = Math.max(2, current - siblings);
  const end = Math.min(total - 1, current + siblings);
  for (let page = start; page <= end; page += 1) pages.push(page);

  if (showRightEllipsis) pages.push('ellipsis');
  pages.push(total);

  return pages;
}
