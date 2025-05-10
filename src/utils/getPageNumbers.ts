export const getPageNumbers = (current: number, total: number) => {
  const pages = [];

  if (total <= 7) {
    for (let i = 0; i < total; i++) pages.push(i);
  } else {
    pages.push(0);

    if (current > 2) pages.push(-1);

    for (let i = current - 1; i <= current + 1; i++) {
      if (i > 0 && i < total - 1) pages.push(i);
    }

    if (current < total - 3) pages.push(-1);

    pages.push(total - 1);
  }

  return pages;
};
