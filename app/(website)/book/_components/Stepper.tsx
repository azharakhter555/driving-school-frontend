import { Check } from "lucide-react";

export type Step = 1 | 2;

interface StepperProps {
  current: Step;
}

export function Stepper({ current }: StepperProps) {
  const steps = [
    { n: 1, label: "Choose time" },
    { n: 2, label: "Your details" },
  ];
  const progress = current === 1 ? 0 : 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {steps.map((s) => {
          const active = current === s.n;
          const done = current > s.n;
          return (
            <div key={s.n} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                  done
                    ? "bg-secondary text-secondary-foreground"
                    : active
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/15"
                      : "border border-border bg-card text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : s.n}
              </div>
              <span className={`text-sm ${active ? "font-semibold" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
