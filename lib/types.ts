export type Role = "participant" | "assistant";

export type Product = {
  id: string;
  name: string;
  photo: string;
  description: string;
  currentQuantity: number;
  minimumStockLevel: number;
  rawMaterialIds: string[];
  recipe: RecipeItem[];
};

export type RawMaterial = {
  id: string;
  name: string;
  photo: string;
  quantityAvailable: number;
};

export type RecipeItem = {
  materialId: string;
  quantity: number;
};

export type SaleRecord = {
  id: string;
  productId: string;
  quantity: number;
  createdAt: string;
};

export type ProductionRecord = {
  id: string;
  productId: string;
  quantity: number;
  createdAt: string;
};

export type BadgeId = "stock-counter" | "product-maker" | "sales-superstar" | "decision-maker";

export type Badge = {
  id: BadgeId;
  label: string;
  description: string;
  earned: boolean;
};

export type Poster = {
  productId: string;
  headline: string;
  color: string;
  message: string;
};

export type BusinessLabState = {
  products: Product[];
  rawMaterials: RawMaterial[];
  sales: SaleRecord[];
  production: ProductionRecord[];
  badges: Badge[];
  poster: Poster;
};

export type ModuleStage = "learn" | "do" | "understand" | "decide" | "reflect";

export type FutureModule = {
  id: string;
  title: string;
  stages: Record<ModuleStage, string>;
};

export type CoachMoment = {
  title: string;
  lines: [string, string, string];
};
