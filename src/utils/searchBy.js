
export default function searchBy (queryParams) {
  if (queryParams.searchBy && queryParams.searchBy.length) {
    
    // TODO: some sanitizing against XSS
    return `%${queryParams.searchBy}%`;
  }

  return null;
}
