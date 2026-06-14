"use client";

import Image from "next/image";
import {
  BadgeCheck,
  BarChart3,
  Box,
  Camera,
  Download,
  Factory,
  Megaphone,
  Minus,
  PackagePlus,
  Plus,
  RefreshCcw,
  Sparkles,
  Store,
  UserRoundCog
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import type { ElementType, ReactNode } from "react";
import { futureModules } from "@/lib/sample-data";
import { coachMoment, useBusinessLabStore } from "@/lib/storage";
import type { CoachMoment, Product, RawMaterial } from "@/lib/types";

type Mode = "make" | "stocktake" | "market" | "marketing" | "decision" | "assistant";

const modes: { id: Mode; label: string; icon: ElementType; assistantOnly?: boolean }[] = [
  { id: "make", label: "Make", icon: Factory },
  { id: "stocktake", label: "Count", icon: Box },
  { id: "market", label: "Sell", icon: Store },
  { id: "marketing", label: "Poster", icon: Megaphone },
  { id: "decision", label: "Decide", icon: BarChart3 },
  { id: "assistant", label: "Setup", icon: UserRoundCog, assistantOnly: true }
];

const posterHeadlines = ["Fresh from our team", "Handmade today", "Come and see our table"];
const posterMessages = ["Made with care", "Great gift idea", "Limited batch"];
const posterColors = ["#5bc0eb", "#ff6b6b", "#8ac926"];

export default function Home() {
  const { state, actions, ready } = useBusinessLabStore();
  const [mode, setMode] = useState<Mode>("make");
  const [assistantMode, setAssistantMode] = useState(false);
  const [coach, setCoach] = useState<CoachMoment>(coachMoment("decide"));

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  const selectedPosterProduct = state.products.find((product) => product.id === state.poster.productId) ?? state.products[0];

  const salesByProduct = useMemo(() => {
    return state.products.map((product) => ({
      ...product,
      sold: state.sales.filter((sale) => sale.productId === product.id).reduce((sum, sale) => sum + sale.quantity, 0)
    }));
  }, [state.products, state.sales]);

  const mostSold = [...salesByProduct].sort((a, b) => b.sold - a.sold)[0];
  const lowStock = state.products.filter((product) => product.currentQuantity <= product.minimumStockLevel);
  const nextToMake = [...state.products].sort(
    (a, b) => a.currentQuantity - a.minimumStockLevel - (b.currentQuantity - b.minimumStockLevel)
  )[0];

  const showCoach = (kind: string, product?: Product) => {
    setCoach(coachMoment(kind, product?.name));
  };

  const recordDecision = () => {
    actions.earnBadge("decision-maker");
    setCoach(coachMoment("decide"));
  };

  if (!ready) {
    return <main className="grid min-h-screen place-items-center p-6 text-3xl font-black">Opening the lab...</main>;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 p-4 sm:p-6">
      <header className="flex flex-col gap-4 rounded-[2rem] border-4 border-white bg-white/72 p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/assets/kylie-koala.png"
            alt="Kylie the Business Koala"
            width={92}
            height={92}
            className="h-20 w-20 rounded-3xl border-4 border-sunshine object-cover"
            priority
          />
          <div>
            <p className="text-lg font-black uppercase tracking-wide text-coral">Campus Life</p>
            <h1 className="text-3xl font-black leading-tight sm:text-5xl">Business Lab</h1>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setAssistantMode((value) => !value);
            setMode(assistantMode ? "make" : "assistant");
          }}
          className="min-h-16 rounded-3xl bg-ink px-6 text-xl font-black text-white shadow-lg"
        >
          {assistantMode ? "Participant View" : "Assistant View"}
        </button>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {modes
            .filter((item) => assistantMode || !item.assistantOnly)
            .map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                  className={`touch-card flex min-h-24 flex-col items-center justify-center gap-2 rounded-[1.75rem] px-3 text-xl font-black transition ${
                    mode === item.id ? "bg-sunshine text-ink" : "bg-white text-ink"
                  }`}
                  aria-pressed={mode === item.id}
                >
                  <Icon size={34} aria-hidden />
                  {item.label}
                </button>
              );
            })}
        </div>
        <CoachCard moment={coach} />
      </section>

      {mode === "make" && (
        <section className="safe-grid gap-5">
          {state.products.map((product) => {
            const canMake = product.recipe.every((item) => {
              const material = state.rawMaterials.find((raw) => raw.id === item.materialId);
              return material && material.quantityAvailable >= item.quantity;
            });
            return (
              <ProductCard key={product.id} product={product}>
                <div className="space-y-3">
                  <RecipeList product={product} materials={state.rawMaterials} />
                  <button
                    type="button"
                    disabled={!canMake}
                    onClick={() => {
                      actions.makeProduct(product.id);
                      showCoach("make", product);
                    }}
                    className="flex min-h-20 w-full items-center justify-center gap-3 rounded-3xl bg-mint px-5 text-2xl font-black text-ink disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                  >
                    <PackagePlus size={34} aria-hidden />
                    Make One
                  </button>
                </div>
              </ProductCard>
            );
          })}
        </section>
      )}

      {mode === "stocktake" && (
        <section className="safe-grid gap-5">
          {state.products.map((product) => (
            <ProductCard key={product.id} product={product}>
              <div className="grid grid-cols-[5rem_1fr_5rem] items-center gap-3">
                <button
                  type="button"
                  aria-label={`Take one ${product.name} away`}
                  onClick={() => {
                    actions.adjustStock(product.id, -1);
                    showCoach("stock", product);
                  }}
                  className="grid aspect-square place-items-center rounded-3xl bg-coral text-white"
                >
                  <Minus size={42} aria-hidden />
                </button>
                <div className="rounded-3xl bg-paper p-4 text-center">
                  <p className="text-lg font-bold">Now</p>
                  <p className="text-6xl font-black">{product.currentQuantity}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Add one ${product.name}`}
                  onClick={() => {
                    actions.adjustStock(product.id, 1);
                    showCoach("stock", product);
                  }}
                  className="grid aspect-square place-items-center rounded-3xl bg-mint text-ink"
                >
                  <Plus size={42} aria-hidden />
                </button>
              </div>
            </ProductCard>
          ))}
        </section>
      )}

      {mode === "market" && (
        <section className="safe-grid gap-5">
          {state.products.map((product) => (
            <ProductCard key={product.id} product={product}>
              <button
                type="button"
                disabled={product.currentQuantity === 0}
                onClick={() => {
                  actions.sellOne(product.id);
                  showCoach("sale", product);
                }}
                className="flex min-h-24 w-full items-center justify-center gap-3 rounded-3xl bg-coral px-5 text-3xl font-black text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
              >
                <Sparkles size={38} aria-hidden />
                SOLD ONE
              </button>
              <p className="mt-3 rounded-3xl bg-sunshine/55 p-4 text-center text-xl font-black">
                {salesByProduct.find((item) => item.id === product.id)?.sold ?? 0} sold so far
              </p>
            </ProductCard>
          ))}
        </section>
      )}

      {mode === "marketing" && selectedPosterProduct && (
        <section className="grid gap-5 lg:grid-cols-[24rem_1fr]">
          <div className="rounded-[2rem] bg-white p-5 shadow-soft">
            <h2 className="text-3xl font-black">Marketing Studio</h2>
            <GuidedChoices
              label="Choose product"
              options={state.products.map((product) => ({ label: product.name, value: product.id }))}
              value={state.poster.productId}
              onChange={(value) => actions.setPoster(value, state.poster.headline, state.poster.color, state.poster.message)}
            />
            <GuidedChoices
              label="Choose headline"
              options={posterHeadlines.map((item) => ({ label: item, value: item }))}
              value={state.poster.headline}
              onChange={(value) => actions.setPoster(state.poster.productId, value, state.poster.color, state.poster.message)}
            />
            <GuidedChoices
              label="Choose message"
              options={posterMessages.map((item) => ({ label: item, value: item }))}
              value={state.poster.message}
              onChange={(value) => actions.setPoster(state.poster.productId, state.poster.headline, state.poster.color, value)}
            />
            <div className="mt-4">
              <p className="mb-2 text-xl font-black">Choose colour</p>
              <div className="grid grid-cols-3 gap-3">
                {posterColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Choose poster colour ${color}`}
                    onClick={() => actions.setPoster(state.poster.productId, state.poster.headline, color, state.poster.message)}
                    className={`h-20 rounded-3xl border-4 ${state.poster.color === color ? "border-ink" : "border-white"}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => showCoach("poster", selectedPosterProduct)}
              className="mt-5 flex min-h-16 w-full items-center justify-center gap-2 rounded-3xl bg-ink text-xl font-black text-white"
            >
              <Camera size={30} aria-hidden />
              Finish Poster
            </button>
          </div>
          <div
            className="grid min-h-[34rem] place-items-center rounded-[2rem] border-8 border-white p-5 shadow-soft"
            style={{ backgroundColor: state.poster.color }}
          >
            <div className="w-full max-w-xl rounded-[2rem] bg-white p-6 text-center shadow-soft">
              <Image
                src={selectedPosterProduct.photo}
                alt=""
                width={420}
                height={300}
                className="mx-auto h-72 w-full rounded-[1.5rem] object-cover"
              />
              <h2 className="mt-5 text-4xl font-black leading-tight">{state.poster.headline}</h2>
              <p className="mt-3 text-2xl font-black text-coral">{selectedPosterProduct.name}</p>
              <p className="mt-2 text-xl font-bold">{state.poster.message}</p>
            </div>
          </div>
        </section>
      )}

      {mode === "decision" && (
        <section className="space-y-5">
          <h2 className="text-4xl font-black">Decision Lab</h2>
          <div className="safe-grid gap-5">
            <DecisionQuestion title="Which product sold the most?" product={mostSold} detail={`${mostSold?.sold ?? 0} sold`} onChoose={recordDecision} />
            <DecisionQuestion title="Which product should we make next?" product={nextToMake} detail={`${nextToMake?.currentQuantity ?? 0} in stock`} onChoose={recordDecision} />
            <DecisionQuestion
              title="Which product is running low?"
              product={lowStock[0] ?? nextToMake}
              detail={lowStock.length ? "At or below minimum" : "Nothing is low today"}
              onChoose={recordDecision}
            />
          </div>
        </section>
      )}

      {mode === "assistant" && assistantMode && <AssistantPanel state={state} actions={actions} />}

      <section className="grid gap-4 rounded-[2rem] bg-white/78 p-5 shadow-soft lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="text-3xl font-black">Badges</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {state.badges.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-3xl p-4 text-center ${badge.earned ? "bg-sunshine" : "bg-slate-100 text-slate-500"}`}
              >
                <BadgeCheck className="mx-auto" size={34} aria-hidden />
                <p className="mt-2 text-lg font-black">{badge.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-black">Future Modules</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {futureModules.map((module) => (
              <div key={module.id} className="rounded-3xl bg-paper p-4">
                <p className="text-lg font-black">{module.title}</p>
                <p className="text-sm font-bold">Learn - Do - Understand - Decide - Reflect</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function CoachCard({ moment }: { moment: CoachMoment }) {
  return (
    <aside className="touch-card flex gap-3 rounded-[2rem] bg-white p-4">
      <Image
        src="/assets/kylie-koala.png"
        alt="Kylie the Business Koala"
        width={86}
        height={86}
        className="h-20 w-20 shrink-0 rounded-3xl object-cover"
      />
      <div>
        <h2 className="text-2xl font-black">{moment.title}</h2>
        {moment.lines.map((line) => (
          <p key={line} className="mt-1 text-lg font-bold leading-snug">
            {line}
          </p>
        ))}
      </div>
    </aside>
  );
}

function ProductCard({ product, children }: { product: Product; children: ReactNode }) {
  const isLow = product.currentQuantity <= product.minimumStockLevel;
  return (
    <article className="touch-card rounded-[2rem] bg-white p-4">
      <Image
        src={product.photo}
        alt={product.name}
        width={520}
        height={360}
        className="h-56 w-full rounded-[1.5rem] object-cover"
      />
      <div className="my-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black leading-tight">{product.name}</h2>
          <p className="mt-1 text-lg font-bold">{product.description}</p>
        </div>
        <div className={`rounded-3xl px-4 py-2 text-center ${isLow ? "bg-coral text-white" : "bg-bubble/30"}`}>
          <p className="text-sm font-black">Stock</p>
          <p className="text-4xl font-black">{product.currentQuantity}</p>
        </div>
      </div>
      {children}
    </article>
  );
}

function RecipeList({ product, materials }: { product: Product; materials: RawMaterial[] }) {
  return (
    <div className="rounded-3xl bg-paper p-4">
      <p className="text-lg font-black">Materials used</p>
      <div className="mt-2 grid gap-2">
        {product.recipe.map((item) => {
          const material = materials.find((raw) => raw.id === item.materialId);
          return (
            <div key={item.materialId} className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 font-bold">
              <span>{material?.name ?? "Material"}</span>
              <span>
                {item.quantity} used / {material?.quantityAvailable ?? 0} left
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GuidedChoices({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-xl font-black">{label}</p>
      <div className="grid gap-2">
        {options.slice(0, 3).map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`min-h-14 rounded-3xl px-4 text-left text-lg font-black ${
              value === option.value ? "bg-sunshine" : "bg-paper"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function DecisionQuestion({
  title,
  product,
  detail,
  onChoose
}: {
  title: string;
  product?: Product;
  detail: string;
  onChoose: () => void;
}) {
  if (!product) {
    return null;
  }

  return (
    <button type="button" onClick={onChoose} className="touch-card rounded-[2rem] bg-white p-4 text-left">
      <p className="text-2xl font-black">{title}</p>
      <Image
        src={product.photo}
        alt={product.name}
        width={520}
        height={360}
        className="my-4 h-56 w-full rounded-[1.5rem] object-cover"
      />
      <p className="text-3xl font-black">{product.name}</p>
      <p className="text-xl font-bold text-coral">{detail}</p>
    </button>
  );
}

function AssistantPanel({
  state,
  actions
}: {
  state: ReturnType<typeof useBusinessLabStore>["state"];
  actions: ReturnType<typeof useBusinessLabStore>["actions"];
}) {
  const [productDraft, setProductDraft] = useState({
    name: "",
    description: "",
    currentQuantity: 0,
    minimumStockLevel: 3,
    photo: "/assets/bracelets.png"
  });
  const [materialDraft, setMaterialDraft] = useState({
    name: "",
    quantityAvailable: 20,
    photo: "/assets/bracelets.png"
  });

  const exportReport = () => {
    const report = {
      exportedAt: new Date().toISOString(),
      products: state.products,
      rawMaterials: state.rawMaterials,
      sales: state.sales,
      production: state.production,
      badges: state.badges
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "campus-life-business-lab-report.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const addProduct = (event: FormEvent) => {
    event.preventDefault();
    if (!productDraft.name.trim()) {
      return;
    }
    const id = productDraft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    actions.addProduct({
      id: `${id}-${Date.now()}`,
      name: productDraft.name,
      description: productDraft.description || "A product made by the campus team.",
      currentQuantity: productDraft.currentQuantity,
      minimumStockLevel: productDraft.minimumStockLevel,
      photo: productDraft.photo,
      rawMaterialIds: [],
      recipe: []
    });
    setProductDraft({ name: "", description: "", currentQuantity: 0, minimumStockLevel: 3, photo: "/assets/bracelets.png" });
  };

  const addMaterial = (event: FormEvent) => {
    event.preventDefault();
    if (!materialDraft.name.trim()) {
      return;
    }
    const id = materialDraft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    actions.addMaterial({
      id: `${id}-${Date.now()}`,
      name: materialDraft.name,
      quantityAvailable: materialDraft.quantityAvailable,
      photo: materialDraft.photo
    });
    setMaterialDraft({ name: "", quantityAvailable: 20, photo: "/assets/bracelets.png" });
  };

  return (
    <section className="grid gap-5 lg:grid-cols-2">
      <form onSubmit={addProduct} className="rounded-[2rem] bg-white p-5 shadow-soft">
        <h2 className="text-3xl font-black">Add Product</h2>
        <TextInput label="Product name" value={productDraft.name} onChange={(value) => setProductDraft({ ...productDraft, name: value })} />
        <TextInput
          label="Description"
          value={productDraft.description}
          onChange={(value) => setProductDraft({ ...productDraft, description: value })}
        />
        <NumberInput
          label="Current quantity"
          value={productDraft.currentQuantity}
          onChange={(value) => setProductDraft({ ...productDraft, currentQuantity: value })}
        />
        <NumberInput
          label="Minimum stock"
          value={productDraft.minimumStockLevel}
          onChange={(value) => setProductDraft({ ...productDraft, minimumStockLevel: value })}
        />
        <ImageUpload label="Product photo" onChange={(photo) => setProductDraft({ ...productDraft, photo })} />
        <button type="submit" className="mt-4 min-h-16 w-full rounded-3xl bg-mint text-xl font-black">
          Add Product
        </button>
      </form>

      <form onSubmit={addMaterial} className="rounded-[2rem] bg-white p-5 shadow-soft">
        <h2 className="text-3xl font-black">Add Raw Material</h2>
        <TextInput label="Material name" value={materialDraft.name} onChange={(value) => setMaterialDraft({ ...materialDraft, name: value })} />
        <NumberInput
          label="Quantity available"
          value={materialDraft.quantityAvailable}
          onChange={(value) => setMaterialDraft({ ...materialDraft, quantityAvailable: value })}
        />
        <ImageUpload label="Material photo" onChange={(photo) => setMaterialDraft({ ...materialDraft, photo })} />
        <button type="submit" className="mt-4 min-h-16 w-full rounded-3xl bg-bubble text-xl font-black">
          Add Material
        </button>
      </form>

      <div className="rounded-[2rem] bg-white p-5 shadow-soft lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-black">Products and Recipes</h2>
          <div className="flex gap-3">
            <button type="button" onClick={exportReport} className="flex min-h-14 items-center gap-2 rounded-3xl bg-ink px-5 font-black text-white">
              <Download size={24} aria-hidden />
              Export
            </button>
            <button type="button" onClick={actions.reset} className="flex min-h-14 items-center gap-2 rounded-3xl bg-coral px-5 font-black text-white">
              <RefreshCcw size={24} aria-hidden />
              Reset
            </button>
          </div>
        </div>
        <div className="mt-4 grid gap-4">
          {state.products.map((product) => (
            <div key={product.id} className="rounded-3xl bg-paper p-4">
              <div className="grid gap-3 md:grid-cols-[8rem_1fr]">
                <Image src={product.photo} alt="" width={160} height={120} className="h-32 w-full rounded-2xl object-cover" />
                <div>
                  <p className="text-2xl font-black">{product.name}</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    <NumberInput
                      label="Current stock"
                      value={product.currentQuantity}
                      onChange={(value) => actions.updateProduct({ ...product, currentQuantity: value })}
                    />
                    <NumberInput
                      label="Low stock alert"
                      value={product.minimumStockLevel}
                      onChange={(value) => actions.updateProduct({ ...product, minimumStockLevel: value })}
                    />
                  </div>
                  <div className="mt-3">
                    <p className="text-lg font-black">Recipe materials</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {state.rawMaterials.map((material) => {
                        const existing = product.recipe.find((item) => item.materialId === material.id);
                        return (
                          <button
                            key={material.id}
                            type="button"
                            onClick={() => {
                              const recipe = existing
                                ? product.recipe.filter((item) => item.materialId !== material.id)
                                : [...product.recipe, { materialId: material.id, quantity: 1 }];
                              actions.updateProduct({
                                ...product,
                                rawMaterialIds: recipe.map((item) => item.materialId),
                                recipe
                              });
                            }}
                            className={`rounded-3xl px-4 py-3 font-black ${existing ? "bg-sunshine" : "bg-white"}`}
                          >
                            {material.name}
                          </button>
                        );
                      })}
                    </div>
                    {product.recipe.length > 0 && (
                      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {product.recipe.map((recipeItem) => {
                          const material = state.rawMaterials.find((item) => item.id === recipeItem.materialId);
                          return (
                            <NumberInput
                              key={recipeItem.materialId}
                              label={`${material?.name ?? "Material"} used`}
                              value={recipeItem.quantity}
                              onChange={(value) =>
                                actions.updateProduct({
                                  ...product,
                                  recipe: product.recipe.map((item) =>
                                    item.materialId === recipeItem.materialId ? { ...item, quantity: value } : item
                                  )
                                })
                              }
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] bg-white p-5 shadow-soft lg:col-span-2">
        <h2 className="text-3xl font-black">Raw Materials</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {state.rawMaterials.map((material) => (
            <div key={material.id} className="rounded-3xl bg-paper p-4">
              <Image src={material.photo} alt="" width={160} height={120} className="h-32 w-full rounded-2xl object-cover" />
              <p className="mt-3 text-2xl font-black">{material.name}</p>
              <NumberInput
                label="Quantity available"
                value={material.quantityAvailable}
                onChange={(value) => actions.updateMaterial({ ...material, quantityAvailable: value })}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-4 block text-lg font-black">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-14 w-full rounded-3xl border-4 border-slate-200 px-4"
      />
    </label>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block text-lg font-black">
      {label}
      <input
        type="number"
        min={0}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 min-h-14 w-full rounded-3xl border-4 border-slate-200 px-4"
      />
    </label>
  );
}

function ImageUpload({ label, onChange }: { label: string; onChange: (value: string) => void }) {
  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <label className="mt-4 block text-lg font-black">
      {label}
      <input type="file" accept="image/*" onChange={handleFile} className="mt-2 block w-full rounded-3xl bg-paper p-4" />
    </label>
  );
}
