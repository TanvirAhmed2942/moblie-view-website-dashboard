"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  className?: string
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )

  const selected = options.find((opt) => opt.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[220px] justify-between font-normal", className)}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-2" align="end">
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2 h-8 text-sm"
        />
        <div className="max-h-52 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-muted-foreground py-2 text-center text-sm">No results.</p>
          ) : (
            filtered.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                  setSearch("")
                }}
                className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                <Check
                  className={cn("size-4 shrink-0", value === opt.value ? "opacity-100" : "opacity-0")}
                />
                <span className="truncate">{opt.label}</span>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
