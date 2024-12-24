export interface PaginationProps<T> {
  items: T[];
  itemsPerPage?: number;
  renderItem: (item: T) => React.ReactNode;
}
