
export default function orderBy (queryParams) {
  if (queryParams.orderField && queryParams.orderType) {
    if (queryParams.orderType.toUpperCase() === 'ASC' || queryParams.orderType.toUpperCase() === 'DESC') {
      const orderBy = queryParams.orderField;
      const orderType = queryParams.orderType.toUpperCase();

      if (orderBy.indexOf('.') !== -1) {
        const orderColumns = orderBy.split('.');
        const tableName = orderColumns[orderColumns.length - 2];
        const columnName = orderColumns[orderColumns.length - 1];

        return [ tableName, columnName, orderType ];
      }

      return [ orderBy, orderType ];
    }
  }

  return [ 'id' ];
}
