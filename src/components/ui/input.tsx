import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-neutral-400">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`flex h-10 w-full rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-white/20 focus:bg-neutral-900 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
