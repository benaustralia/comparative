import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export const PredictiveInput = React.forwardRef(({
  suggestions = [],
  recommended,
  onPredictionAccept,
  className,
  ...props
}, ref) => {
  const [suggestion, setSuggestion] = React.useState("")

  const updateSuggestion = (val) => {
    // If input is empty and we have a recommended value, show it
    if (!val && recommended) {
      setSuggestion(recommended);
      return;
    }

    // If input has value, look for match in suggestions
    if (val && suggestions.length > 0) {
      const match = suggestions.find(s => 
        s.toLowerCase().startsWith(val.toLowerCase())
      )
      // Only show suggestion if it's not an exact match already (case-insensitive)
      if (match && match.toLowerCase() !== val.toLowerCase()) {
        setSuggestion(match)
      } else {
        setSuggestion("")
      }
    } else {
      setSuggestion("")
    }
  }

  // Sync suggestion when value or props change
  React.useEffect(() => {
    updateSuggestion(props.value || "");
  }, [props.value, suggestions, recommended]);

  const handleInputChange = (e) => {
    const value = e.target.value
    props.onChange?.(e)
    updateSuggestion(value);
  }

  const handleKeyDown = (e) => {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && suggestion) {
      e.preventDefault()
      onPredictionAccept(suggestion)
    }
    props.onKeyDown?.(e)
  }

  return (
    <div className="relative w-full group font-sans">
      {/* Ghost Text Layer - Stacking Technique */}
      <div 
        className={cn(
          "absolute inset-0 px-3 py-1 text-base md:text-sm text-muted-foreground/30 pointer-events-none flex items-center bg-transparent font-normal select-none overflow-hidden whitespace-pre", 
          className
        )}
      >
        {/* If we have a suggestion and it starts with the current value, show the full suggestion.
            The user's input (black) will cover the matching part.
            The 'tail' (grey) will remain visible.
            Note: This requires perfect font matching between Input and this div.
        */}
        {suggestion && (props.value && suggestion.toLowerCase().startsWith(props.value.toLowerCase()) || !props.value) 
          ? suggestion 
          : ""}
      </div>
      
      {/* Real Input Layer */}
      <Input
        {...props}
        ref={ref}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        // Make background transparent so ghost shows through
        className={cn("bg-transparent relative z-10", className)}
      />
    </div>
  )
})
PredictiveInput.displayName = "PredictiveInput"
