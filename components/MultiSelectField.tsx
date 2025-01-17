"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

// Type definition for options (employees, customers, etc.)
type Option = {
  value: string;
  label: string;
};

// Props for the reusable MultiSelectField component
interface MultiSelectFieldProps {
  label?: string; // e.g., "Select your employees" or "Select your equipment"
  description?: string;
  options: Option[]; // The array of selectable items
  placeholder?: string;
  onChange: (selectedValues: string[]) => void; // Callback to handle value changes
  value: string[]; // Currently selected values
}

export function MultiSelectField({
  label,
  description,
  options,
  placeholder = "Select...",
  onChange,
  value,
}: MultiSelectFieldProps) {
  // Whether the Popover (dropdown) is open
  const [open, setOpen] = React.useState(false);

  // Track what's typed in the search input
  const [searchValue, setSearchValue] = React.useState("");

  // A ref to re-focus the input, if desired
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Filter options based on the search value
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Toggles an item in or out of the selected values array
  function handleSelect(currentValue: string) {
    const isAlreadySelected = value.includes(currentValue);
    const newSelectedValues = isAlreadySelected
      ? value.filter((item) => item !== currentValue) // Remove
      : [...value, currentValue]; // Add

    onChange(newSelectedValues);

    // Reset the search value
    setSearchValue("");

    // Optionally refocus the input and keep the popover open
    setOpen(true);
    inputRef.current?.focus();
  }

  // Removes a given item from the selected array
  function handleRemove(itemToRemove: string) {
    const newValues = value.filter((item) => item !== itemToRemove);
    onChange(newValues);
  }

  return (
    <div className="space-y-2">
      {/* Optional Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Our Popover + Command-based combobox */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between"
          >
            {/* If we have selected items, show count. Otherwise show placeholder. */}
            {value.length > 0 ? `${value.length} selected` : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[300px] p-0 dark:border-zinc-800">
          <Command>
            {/* CommandInput - the search field (built-in filtering) */}
            <CommandInput
              ref={inputRef}
              placeholder="Search..."
              value={searchValue}
              onValueChange={setSearchValue}
            />

            {/* Render selected values as badges with remove buttons */}
            {value.length > 0 && (
              <div className="p-2 flex flex-wrap gap-1">
                {value.map((selected) => {
                  const found = options.find((o) => o.value === selected);
                  return (
                    <Badge key={selected} variant="secondary" className="mr-1">
                      {found?.label ?? selected}
                      <button
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleRemove(selected);
                          }
                        }}
                        onMouseDown={(e) => {
                          // Prevent losing focus from input
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={() => handleRemove(selected)}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}

            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {/* 
                  Command automatically filters items by the value in `CommandItem` if you pass `value={option.value}`.
                  The text inside is also used for searching. 
                */}
                {filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Optional description below */}
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
}
