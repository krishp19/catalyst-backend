export declare class PaginationMetaDto {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}
export declare class PaginatedResponseDto<T> {
    items: T[];
    meta: PaginationMetaDto;
}
