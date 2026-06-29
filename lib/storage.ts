"use client";

import { useEffect, useMemo, useState } from "react";
import { initialState } from "./sample-data";
import type { BadgeId, BusinessLabState, CoachMoment, Product, RawMaterial } from "./types";
import {
  getProducts,
  getRawMaterials,
  getRecipes,
  getActivities,
  updateProductStock,
  updateRawMaterialStock,
} from "./supabase";

const STORAGE_KEY =
  "campus-life-business-lab-state-v2";

const cloneState = (): BusinessLabState => JSON.parse(JSON.stringify(initialState));

export function useBusinessLabStore() {
  const [state, setState] = useState<BusinessLabState>(cloneState);
  const [ready, setReady] = useState(false);

 useEffect(() => {
  async function load() {
  try {
    const products = await getProducts();
    const rawMaterials = await getRawMaterials();
    const recipes = await getRecipes();
    const activities = await getActivities();

console.log("Activities loaded:", activities);
    const productsWithRecipes = products.map((product) => ({
  ...product,
  recipe: recipes
    .filter((recipe) => recipe.product_id === product.id)
    .map((recipe) => ({
      materialId: recipe.material_id,
      quantity: recipe.quantity_required
    }))
}));

setState((current) => ({
  ...current,
  products: productsWithRecipes,
  rawMaterials,
  activities
}));
  } catch (err) {
    console.error("Failed to load data", err);
  }

  setReady(true);
}

  load();
}, []);

  const actions = useMemo(
    () => ({
      
      earnBadge(id: BadgeId) {
        setState((current) => ({
          ...current,
          badges: current.badges.map((badge) => (badge.id === id ? { ...badge, earned: true } : badge))
        }));
      },
      adjustStock(productId: string, amount: number) {
        setState((current) => ({
          ...current,
          products: current.products.map((product) =>
            product.id === productId
              ? { ...product, currentQuantity: Math.max(0, product.currentQuantity + amount) }
              : product
          ),
          badges: current.badges.map((badge) =>
            badge.id === "stock-counter" ? { ...badge, earned: true } : badge
          )
        }));
      },
      async makeProduct(productId: string) {
        setState((current) => {
          const product = current.products.find((item) => item.id === productId);
          if (!product) {
            return current;
          }

          const canMake = product.recipe.every((item) => {
            const material = current.rawMaterials.find((raw) => raw.id === item.materialId);
            return material ? material.quantityAvailable >= item.quantity : false;
          });

          if (!canMake) {
            return current;
          }
          const updatedProductStock = product.currentQuantity + 1;

updateProductStock(
  product.id,
  updatedProductStock
).catch(console.error);
product.recipe.forEach((recipeItem) => {
  const material = current.rawMaterials.find(
    (m) => m.id === recipeItem.materialId
  );

  if (!material) return;

  const newQuantity =
    material.quantityAvailable - recipeItem.quantity;

  updateRawMaterialStock(
    material.id,
    newQuantity
  ).catch(console.error);
});


          return {
            ...current,
            products: current.products.map((item) =>
              item.id === productId ? { ...item, currentQuantity: item.currentQuantity + 1 } : item
            ),
            rawMaterials: current.rawMaterials.map((material) => {
              const recipeItem = product.recipe.find((item) => item.materialId === material.id);
              return recipeItem
                ? { ...material, quantityAvailable: material.quantityAvailable - recipeItem.quantity }
                : material;
            }),
            production: [
              ...current.production,
              { id: crypto.randomUUID(), productId, quantity: 1, createdAt: new Date().toISOString() }
            ],
            badges: current.badges.map((badge) =>
              badge.id === "product-maker" ? { ...badge, earned: true } : badge
            )
          };
        });
      },
      async sellOne(productId: string) {
  setState((current) => {
    const product = current.products.find(
      (item) => item.id === productId
    );

    if (!product) {
      return current;
    }

    const updatedStock = Math.max(
      0,
      product.currentQuantity - 1
    );

    updateProductStock(
      product.id,
      updatedStock
    ).catch(console.error);

    return {
      ...current,
      products: current.products.map((item) =>
        item.id === productId
          ? {
              ...item,
              currentQuantity: Math.max(
                0,
                item.currentQuantity - 1
              )
            }
          : item
      ),
      sales: [
        ...current.sales,
        {
          id: crypto.randomUUID(),
          productId,
          quantity: 1,
          createdAt: new Date().toISOString()
        }
      ],
      badges: current.badges.map((badge) =>
        badge.id === "sales-superstar"
          ? { ...badge, earned: true }
          : badge
      )
    };
  });
},

addProduct(product: Product) {
  setState((current) => ({
    ...current,
    products: [...current.products, product]
  }));
},

updateProduct(product: Product) {
  setState((current) => ({
    ...current,
    products: current.products.map((item) =>
      item.id === product.id ? product : item
    )
  }));
},

addMaterial(material: RawMaterial) {
  setState((current) => ({
    ...current,
    rawMaterials: [...current.rawMaterials, material]
  }));
},

updateMaterial(material: RawMaterial) {
  setState((current) => ({
    ...current,
    rawMaterials: current.rawMaterials.map((item) =>
      item.id === material.id ? material : item
    )
  }));
},

setPoster(
  productId: string,
  headline: string,
  color: string,
  message: string
) {
  setState((current) => ({
    ...current,
    poster: {
      productId,
      headline,
      color,
      message
    }
  }));
}
          }),
    []
  );

  return { state, setState, actions, ready };
}
export function coachMoment(kind: string, productName?: string): CoachMoment {
  const name = productName ?? "this product";
  const moments: Record<string, CoachMoment> = {
    make: {
      title: "Kylie noticed new stock",
      lines: [
        `You made one ${name}.`,
        "Businesses turn materials into products people can use.",
        "This helps the team get ready for customers."
      ]
    },
    stock: {
      title: "Kylie checked the count",
      lines: [
        `The number for ${name} changed.`,
        "Businesses count stock so they know what they have.",
        "Good counting helps the team choose what to make next."
      ]
    },
    sale: {
      title: "Kylie saw a sale",
      lines: [
        `One ${name} was sold.`,
        "Businesses record sales to see what customers like.",
        "Sales information helps the team make better decisions."
      ]
    },
    poster: {
      title: "Kylie likes the poster",
      lines: [
        `You made a poster for ${name}.`,
        "Businesses use marketing to help customers notice products.",
        "Clear posters can help more people visit the market table."
      ]
    },
    decide: {
      title: "Kylie heard a decision",
      lines: [
        "You used business information to answer a question.",
        "Businesses look at facts before choosing what to do.",
        "This helps the team plan the next smart step."
      ]
    }
  };

  return moments[kind] ?? moments.decide;
}
