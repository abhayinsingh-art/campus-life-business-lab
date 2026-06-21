import type { Badge, BusinessLabState, FutureModule } from "./types";

export const badges: Badge[] = [
  {
    id: "stock-counter",
    label: "Stock Counter",
    description: "Changed stock during stocktake.",
    earned: false
  },
  {
    id: "product-maker",
    label: "Product Maker",
    description: "Made a finished product.",
    earned: false
  },
  {
    id: "sales-superstar",
    label: "Sales Superstar",
    description: "Recorded a market sale.",
    earned: false
  },
  {
    id: "decision-maker",
    label: "Decision Maker",
    description: "Answered a business reflection.",
    earned: false
  }
];

export const initialState: BusinessLabState = {
  products: [
    {
      id: "bracelets",
      name: "Bracelets",
      photo: "/assets/bracelets.png",
      description: "Colourful handmade bracelets for the campus market.",
      currentQuantity: 8,
      minimumStockLevel: 5,
      rawMaterialIds: ["beads", "elastic"],
      recipe: [
        { materialId: "beads", quantity: 12 },
        { materialId: "elastic", quantity: 1 }
      ]
    },
    {
      id: "dog-biscuits",
      name: "Dog Biscuits",
      photo: "/assets/dog-biscuits.png",
      description: "Small handmade treats for dogs.",
      currentQuantity: 12,
      minimumStockLevel: 8,
      rawMaterialIds: ["flour", "labels"],
      recipe: [
        { materialId: "flour", quantity: 2 },
        { materialId: "labels", quantity: 1 }
      ]
    },
    {
      id: "bath-bombs",
      name: "Bath Bombs",
      photo: "/assets/bath-bombs.png",
      description: "Bright fizzy bath bombs in small batches.",
      currentQuantity: 6,
      minimumStockLevel: 6,
      rawMaterialIds: ["bath-mix", "wrapping"],
      recipe: [
        { materialId: "bath-mix", quantity: 3 },
        { materialId: "wrapping", quantity: 1 }
      ]
    }
  ],
  rawMaterials: [
    { id: "beads", name: "Beads", photo: "/assets/bracelets.png", quantityAvailable: 240 },
    { id: "elastic", name: "Elastic", photo: "/assets/bracelets.png", quantityAvailable: 28 },
    { id: "flour", name: "Biscuit Mix", photo: "/assets/dog-biscuits.png", quantityAvailable: 48 },
    { id: "labels", name: "Labels", photo: "/assets/dog-biscuits.png", quantityAvailable: 36 },
    { id: "bath-mix", name: "Bath Bomb Mix", photo: "/assets/bath-bombs.png", quantityAvailable: 54 },
    { id: "wrapping", name: "Wrapping", photo: "/assets/bath-bombs.png", quantityAvailable: 42 }
  ],
    sales: [],
  production: [],
  activities: [],
  badges,
  poster: {
    productId: "bracelets",
    headline: "Come and see our handmade bracelets",
    color: "#5bc0eb",
    message: "Made by our campus team"
  }
};

export const futureModules: FutureModule[] = [
  {
    id: "sustainability",
    title: "Sustainability",
    stages: {
      learn: "Notice materials, waste, and reuse.",
      do: "Choose a lower-waste activity.",
      understand: "Connect choices to people and the planet.",
      decide: "Pick the better option for the next batch.",
      reflect: "Talk about what changed."
    }
  },
  {
    id: "ethics",
    title: "Ethics",
    stages: {
      learn: "Explore fair and kind choices.",
      do: "Practise a fair business action.",
      understand: "See who is affected.",
      decide: "Choose what feels right and respectful.",
      reflect: "Name why the choice mattered."
    }
  },
  {
    id: "stakeholders",
    title: "Stakeholders",
    stages: {
      learn: "Meet customers, makers, helpers, and suppliers.",
      do: "Match people to a business activity.",
      understand: "See what each person needs.",
      decide: "Choose who to ask or help next.",
      reflect: "Share who benefited."
    }
  },
  {
    id: "business-law",
    title: "Business Law",
    stages: {
      learn: "Use simple rules for safe selling.",
      do: "Check labels, prices, and permission.",
      understand: "Know why rules protect people.",
      decide: "Pick the safe next step.",
      reflect: "Say which rule helped."
    }
  },
  {
    id: "customer-service",
    title: "Customer Service",
    stages: {
      learn: "Practise greeting and listening.",
      do: "Use a friendly market script.",
      understand: "Notice how customers respond.",
      decide: "Choose a helpful reply.",
      reflect: "Share what made the sale easier."
    }
  },
  {
    id: "risk-management",
    title: "Risk Management",
    stages: {
      learn: "Spot what could go wrong.",
      do: "Use a simple safety check.",
      understand: "Connect risks to safer choices.",
      decide: "Choose what to fix first.",
      reflect: "Name how the team stayed safe."
    }
  }
];
