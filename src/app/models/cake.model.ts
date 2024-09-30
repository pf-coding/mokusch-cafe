export interface CakeModel {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  tags: string[];
  comment?: string;
  quantity?: string;
  selected?: boolean;
}
