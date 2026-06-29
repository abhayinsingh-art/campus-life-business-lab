import { createClient } from "@supabase/supabase-js";
import type { Product } from "./types";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type SupabaseProduct = {
  id: string;
  name: string;
  description: string | null;
  stock: number;
  minimum_stock: number;
  image_url: string | null;
};

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    throw error;
  }

  return ((data ?? []) as SupabaseProduct[]).map((row) => ({
    id: row.id,
    name: row.name,
    photo: row.image_url || "/assets/kylie-koala.png",
    description: row.description || "",
    currentQuantity: row.stock,
    minimumStockLevel: row.minimum_stock,
    rawMaterialIds: [],
    recipe: []
  }));
}
type SupabaseRawMaterial = {
  id: string;
  name: string;
  quantity_available: number;
  image_url: string | null;
};

export async function getRawMaterials() {
  const { data, error } = await supabase
    .from("raw_materials")
    .select("*");

  if (error) {
    throw error;
  }

  return ((data ?? []) as SupabaseRawMaterial[]).map(
    (row) => ({
      id: row.id,
      name: row.name,
      photo: row.image_url || "/assets/kylie-koala.png",
      quantityAvailable: row.quantity_available
    })
  );
}
type SupabaseRecipe = {
  id: string;
  product_id: string;
  material_id: string;
  quantity_required: number;
};

export async function getRecipes(): Promise<SupabaseRecipe[]> {
  const { data, error } = await supabase
    .from("recipes")
    .select("*");

  if (error) {
    throw error;
  }

  return (data ?? []) as SupabaseRecipe[];
}
export async function updateProductStock(
  productId: string,
  newStock: number
) {
  const { error } = await supabase
    .from("products")
    .update({ stock: newStock })
    .eq("id", productId);

  if (error) {
    throw error;
  }
}

export async function updateRawMaterialStock(
  materialId: string,
  newQuantity: number
) {
  const { error } = await supabase
    .from("raw_materials")
    .update({
      quantity_available: newQuantity
    })
    .eq("id", materialId);

  if (error) {
    throw error;
  }
}
export async function decreaseProductStock(
  productId: string,
  newStock: number
) {
  const { error } = await supabase
    .from("products")
    .update({
      stock: newStock
    })
    .eq("id", productId);

  if (error) {
    throw error;
  }
}
export async function createProduct(
  name: string,
  description: string,
  stock: number,
  minimumStock: number,
  imageUrl: string
) {
  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        name,
        description,
        stock,
        minimum_stock: minimumStock,
        image_url: imageUrl
      }
    ])
    .select();

  if (error) {
    throw error;
  }

  return data;
}
export async function createRawMaterial(
  name: string,
  quantityAvailable: number,
  imageUrl: string
) {
  const { data, error } = await supabase
    .from("raw_materials")
    .insert([
      {
        name,
        quantity_available: quantityAvailable,
        image_url: imageUrl
      }
    ])
    .select();

  if (error) {
    throw error;
  }

  return data;
}
export async function createRecipe(
  productId: string,
  materialId: string,
  quantityRequired: number
) {
  const { data, error } = await supabase
    .from("recipes")
    .insert([
      {
        product_id: productId,
        material_id: materialId,
        quantity_required: quantityRequired
      }
    ])
    .select();

  if (error) {
    throw error;
  }

  return data;
}
export async function deleteRecipe(
  productId: string,
  materialId: string
) {
  const { error } = await supabase
    .from("recipes")
    .delete()
    .eq("product_id", productId)
    .eq("material_id", materialId);

  if (error) {
    throw error;
  }
}
export async function updateRecipe(
  productId: string,
  materialId: string,
  quantityRequired: number
) {
  const { error } = await supabase
    .from("recipes")
    .update({
      quantity_required: quantityRequired
    })
    .eq("product_id", productId)
    .eq("material_id", materialId);

  if (error) {
    throw error;
  }
}
export async function createActivity(activity: {
  title: string;
  learn: string;
  activity_do: string;
  understand: string;
  decide: string;
  reflect: string;
}) {
  const { data, error } = await supabase
    .from("activities")
    .insert([activity])
    .select();

  if (error) {
    throw error;
  }

  return data;
}
import type { Activity } from "./types";

export async function getActivities(): Promise<Activity[]> {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("title");

  console.log("Activities:", data);

  if (error) {
    console.error("Activities error:", error);
    throw error;
  }

  return (data ?? []) as Activity[];
}
export async function deleteProduct(productId: string) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    throw error;
  }
}
export async function deleteRawMaterial(
  materialId: string
) {
  const { error } = await supabase
    .from("raw_materials")
    .delete()
    .eq("id", materialId);

  if (error) {
    throw error;
  }
}
export async function deleteActivity(
  activityId: string
) {
  const { error } = await supabase
    .from("activities")
    .delete()
    .eq("id", activityId);

  if (error) {
    throw error;
  }
}