export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string | null;
  createdAt: Date;
}

export interface CreateCategoryDto {
  name: string;
  color: string;
  icon?: string | null;
}
