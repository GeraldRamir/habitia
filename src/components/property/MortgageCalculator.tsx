"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";
import { Calculator } from "lucide-react";

interface MortgageCalculatorProps {
  price: number;
}

export function MortgageCalculator({ price }: MortgageCalculatorProps) {
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const principal = price * (1 - downPayment / 100);
  const monthlyRate = interestRate / 100 / 12;
  const months = years * 12;
  const monthly =
    monthlyRate > 0
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
      : principal / months;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Calculator size={20} className="text-secondary" />
        <h3 className="font-semibold text-title">Calculadora de hipoteca</h3>
      </div>

      <div className="space-y-4">
        <Input
          label={`Enganche (${downPayment}%)`}
          type="range"
          min={5}
          max={50}
          value={downPayment}
          onChange={(e) => setDownPayment(Number(e.target.value))}
        />
        <p className="text-sm text-muted -mt-2">
          Enganche: {formatPrice(price * (downPayment / 100))}
        </p>

        <Input
          label="Tasa de interés anual (%)"
          type="number"
          step={0.1}
          value={interestRate}
          onChange={(e) => setInterestRate(Number(e.target.value))}
        />

        <Input
          label="Plazo (años)"
          type="number"
          min={5}
          max={30}
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
        />

        <div className="p-4 rounded-xl bg-secondary/10 text-center">
          <p className="text-sm text-muted mb-1">Cuota mensual estimada</p>
          <p className="text-2xl font-bold text-secondary">{formatPrice(monthly)}</p>
          <p className="text-xs text-muted mt-2">
            Monto financiado: {formatPrice(principal)}
          </p>
        </div>
      </div>
    </Card>
  );
}
