"use client";

import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/client/lib/utils";
import { SIZES, DEFAULT_SIZE, type ControlSize } from "./_shared/sizes";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  /** Selected value (controlled). */
  value?: string | null;
  /** Default selected value (uncontrolled). */
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  /** @default "md" — shares heights with Button/Input so controls line up. */
  size?: ControlSize;
  disabled?: boolean;
  /** Class applied to the trigger. */
  className?: string;
  /** Optional custom rendering of an option row in the dropdown. */
  renderItem?: (option: SelectOption) => React.ReactNode;
}

/**
 * Single-component select: pass `options` + `value` + `onValueChange`.
 * Uses Base UI's native `items` map so the closed trigger shows the selected
 * option's label (not its raw value).
 */
const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      placeholder = "",
      size = DEFAULT_SIZE,
      disabled,
      className,
      renderItem,
    },
    ref
  ) => {
    return (
      <BaseSelect.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next: string | null) => {
          if (next !== null) onValueChange?.(next);
        }}
        items={options}
        disabled={disabled}
      >
        <BaseSelect.Trigger
          ref={ref}
          className={cn(
            "inline-flex w-full items-center justify-between border border-gray-300 bg-white text-left text-gray-900 shadow-sm outline-none transition-colors",
            "cursor-pointer data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
            "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
            "data-[popup-open]:border-gray-400",
            SIZES[size],
            className
          )}
        >
          <BaseSelect.Value className="block truncate" placeholder={placeholder} />
          <BaseSelect.Icon className="ml-2 shrink-0 text-gray-500">
            <ChevronDown className="size-4" aria-hidden="true" />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner sideOffset={4} className="z-50 outline-none">
            <BaseSelect.Popup
              className={cn(
                "max-h-[var(--available-height)] min-w-[var(--anchor-width)] overflow-y-auto rounded-md border border-gray-200 bg-white p-1 text-gray-900 shadow-md outline-none"
              )}
            >
              <BaseSelect.List>
                {options.map((option) => (
                  <BaseSelect.Item
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    disabled={option.disabled}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-7 pr-2 text-sm outline-none",
                      "data-[highlighted]:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    )}
                  >
                    <span className="absolute left-2 flex items-center">
                      <BaseSelect.ItemIndicator>
                        <Check className="size-4" aria-hidden="true" />
                      </BaseSelect.ItemIndicator>
                    </span>
                    <BaseSelect.ItemText>
                      {renderItem ? renderItem(option) : option.label}
                    </BaseSelect.ItemText>
                  </BaseSelect.Item>
                ))}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    );
  }
);
Select.displayName = "Select";

export { Select };
