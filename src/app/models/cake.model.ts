export interface CakeModel {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  tags: string[];
  comment?: string;
  quantity?: number;
  selected?: boolean;
  allergens: AllergenInfo; // New property for allergens
}

export interface AllergenInfo {
  containsGluten: boolean;
  containsEgg: boolean;
  containsDairy: boolean;
  containsNuts: boolean;
  containsSesame: boolean;
  containsHazelnut: boolean;
}
