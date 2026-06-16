export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  badge: string;
};

export const products: Product[] = [
  {
    id: "desk-mat",
    name: "Grid Desk Mat",
    description: "A broad work surface for sketches, notes, and laptop flow.",
    price: 32000,
    badge: "Workspace",
  },
  {
    id: "field-notebook",
    name: "Field Notebook",
    description: "Compact dot-grid pages for product notes and quick diagrams.",
    price: 9000,
    badge: "Notes",
  },
  {
    id: "focus-timer",
    name: "Focus Timer",
    description: "A small desk timer for deep work blocks and reset breaks.",
    price: 24000,
    badge: "Tool",
  },
];
