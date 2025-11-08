import { Badge } from "@/components/ui/badge"

interface FilterChipsProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function FilterChips({ options, selected, onChange }: FilterChipsProps) {
  const toggleFilter = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option))
    } else {
      onChange([...selected, option])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option)
        return (
          <Badge
            key={option}
            variant={isSelected ? "default" : "outline"}
            className="cursor-pointer hover-elevate active-elevate-2 transition-all"
            onClick={() => toggleFilter(option)}
            data-testid={`filter-${option.toLowerCase()}`}
          >
            {option}
          </Badge>
        )
      })}
    </div>
  )
}
