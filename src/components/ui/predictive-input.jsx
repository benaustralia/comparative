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
    // Propagate change first
    props.onChange?.(e)
    // Update local suggestion state
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
    <div className="relative w-full group">
      {/* Ghost Text Layer - Suffix Only (when typing) */}
      {props.value && suggestion.toLowerCase().startsWith(props.value.toLowerCase()) && (
        <div 
            className={cn(
            "absolute inset-0 px-3 py-1 text-base md:text-sm text-muted-foreground/40 pointer-events-none flex items-center bg-transparent font-normal select-none overflow-hidden whitespace-nowrap", 
            className
            )}
        >
            <span className="invisible">{props.value}</span>
            <span>{suggestion.slice(props.value.length)}</span>
        </div>
      )}
      
      {/* Ghost Text Overlay - Full Suggestion (when empty) */}
      {!props.value && suggestion && (
         <div className={cn(
          "absolute inset-0 px-3 py-1 text-base md:text-sm text-muted-foreground/40 pointer-events-none flex items-center bg-transparent font-normal select-none overflow-hidden whitespace-nowrap", 
          className
        )}>
           {suggestion}
         </div>
      )}

      {/* Real Input Layer */}
      <Input
        {...props}
        ref={ref}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={suggestion ? "" : props.placeholder}
        className={cn("bg-transparent relative z-10", className)}
      />
    </div>
  )
})
PredictiveInput.displayName = "PredictiveInput"
