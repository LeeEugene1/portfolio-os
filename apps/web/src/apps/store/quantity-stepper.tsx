import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  label,
  onChange,
  quantity,
}: {
  label: string;
  onChange: (quantity: number) => void;
  quantity: number;
}) {
  return (
    <div className="quantity-stepper">
      <button
        aria-label={`Decrease ${label} quantity`}
        type="button"
        onClick={() => onChange(quantity - 1)}
      >
        <Minus size={15} />
      </button>
      <output aria-label={`${label} quantity`}>{quantity}</output>
      <button
        aria-label={`Increase ${label} quantity`}
        type="button"
        onClick={() => onChange(quantity + 1)}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
