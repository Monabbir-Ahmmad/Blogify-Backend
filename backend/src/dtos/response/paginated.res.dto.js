/**
 * @category DTOs
 * @subcategory Response
 * @classdesc A class that defines the structure of the paginated response DTO.
 * @property {any[]} data - The data of the paginated response.
 * @property {number} count - The item count of the paginated response.
 * @property {number} limit - The limit of the paginated response.
 */
export class PaginatedResDto {
  constructor(data, count, limit) {
    this.data = data;
    this.count = count;
    this.limit = limit;
  }
}
