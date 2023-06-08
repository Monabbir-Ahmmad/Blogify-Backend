/**
 * @category DTOs
 * @subcategory Response
 * @classdesc A class that defines the structure of the paginated response DTO.
 * @property {any[]} data - The data of the paginated response.
 * @property {number} totalItems - The total number of items.
 * @property {number} pageSize - The number of items per page.
 */
export class PaginatedResDto {
  constructor(data, totalItems, pageSize) {
    this.data = data;
    this.totalItems = totalItems;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(totalItems / pageSize);
  }
}
