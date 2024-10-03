export interface CakeModel {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  tags: string[];
  comment: string;
  quantity: number;
  selected?: boolean;
}
