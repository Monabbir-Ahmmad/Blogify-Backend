/**
 * @category DTOs
 * @subcategory Response
 * @classdesc A class that defines the structure of the paginated response DTO.
 * @property {number} pageCount - The page count of the paginated response.
 * @property {any[]} data - The data of the paginated response.
 */
export class PaginatedResDto {
  constructor(pageCount, data) {
    this.pageCount = pageCount;
    this.data = data;
  }
}
