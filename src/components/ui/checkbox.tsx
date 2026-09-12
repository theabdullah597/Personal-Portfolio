import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, checked, onChange, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="flex items-start space-x-3">
        <div className="relative flex items-center mt-0.5">
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            checked={checked}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              "h-5 w-5 rounded-md border border-border/80 bg-background/60 peer-checked:bg-primary peer-checked:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary flex items-center justify-center cursor-pointer transition-all duration-150",
              className
            )}
          >
            <Check
              className={cn(
                "h-3.5 w-3.5 text-primary-foreground stroke-[3] transition-transform duration-150 scale-0",
                checked && "scale-100"
              )}
            />
          </label>
        </div>
        {(label || description) && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-normal cursor-pointer select-none"
          >
            {label && <span className="text-foreground block">{label}</span>}
            {description && (
              <span className="text-xs text-muted-foreground block font-normal">
                {description}
              </span>
            )}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
