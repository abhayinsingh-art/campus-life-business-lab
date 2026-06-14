"use client";

import { useEffect, useMemo, useState } from "react";
import { initialState } from "./sample-data";
import type { BadgeId, BusinessLabState, CoachMoment, Product, RawMaterial } from "./types";

const STORAGE_KEY = "campus-life-business-lab-state-v1";

const cloneState = (): BusinessLabState => JSON.parse(JSON.stringify(initialState));

export function useBusinessLabStore() {
  const [state, setState] = useState<BusinessLabState>(cloneState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setState(JSON.parse(saved) as BusinessLabState);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [ready, state]);

  const actions = useMemo(
    () => ({
      reset() {
        setState(cloneState());
      },
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
      makeProduct(productId: string) {
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
      sellOne(productId: string) {
        setState((current) => ({
          ...current,
          products: current.products.map((product) =>
            product.id === productId
              ? { ...product, currentQuantity: Math.max(0, product.currentQuantity - 1) }
              : product
          ),
          sales: [
            ...current.sales,
            { id: crypto.randomUUID(), productId, quantity: 1, createdAt: new Date().toISOString() }
          ],
          badges: current.badges.map((badge) =>
            badge.id === "sales-superstar" ? { ...badge, earned: true } : badge
          )
        }));
      },
      addProduct(product: Product) {
        setState((current) => ({ ...current, products: [...current.products, product] }));
      },
      updateProduct(product: Product) {
        setState((current) => ({
          ...current,
          products: current.products.map((item) => (item.id === product.id ? product : item))
        }));
      },
      addMaterial(material: RawMaterial) {
        setState((current) => ({ ...current, rawMaterials: [...current.rawMaterials, material] }));
      },
      updateMaterial(material: RawMaterial) {
        setState((current) => ({
          ...current,
          rawMaterials: current.rawMaterials.map((item) => (item.id === material.id ? material : item))
        }));
      },
      setPoster(productId: string, headline: string, color: string, message: string) {
        setState((current) => ({ ...current, poster: { productId, headline, color, message } }));
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
