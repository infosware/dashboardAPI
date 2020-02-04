
export default function paginate (queryParams) {
  if (queryParams.pageNumber && queryParams.pageSize) {
    const pageNumber = Number.parseInt(queryParams.pageNumber, 10);
    const pageSize = Number.parseInt(queryParams.pageSize, 10);

    if (!pageNumber || !pageSize) {
      return null;
    }

    const startWith = pageNumber * pageSize - pageSize;

    return {
      offset: startWith,
      limit: pageSize,
    };
  }

  return {};
}
