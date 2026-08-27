import { Eye, Type, Contrast } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMediKiosk } from "@/lib/medikiosk/store";

export function AccessibilityToggle() {
  const { a11y, toggleA11y } = useMediKiosk();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Accessibility options">
          <Eye className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => toggleA11y("large")} className="flex items-center justify-between">
          <span className="flex items-center gap-2"><Type className="h-4 w-4" /> Large text</span>
          {a11y.large && <span className="text-success">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleA11y("contrast")} className="flex items-center justify-between">
          <span className="flex items-center gap-2"><Contrast className="h-4 w-4" /> High contrast</span>
          {a11y.contrast && <span className="text-success">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
