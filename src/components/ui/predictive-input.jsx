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
  console.log('PREDICT_DEBUG_DATA:', suggestions)
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

  // Calculate the tail of the suggestion that hasn't been typed yet
  const ghostTail = (suggestion && props.value && suggestion.toLowerCase().startsWith(props.value.toLowerCase())) 
    ? suggestion.slice(props.value.length) 
    : "";

  console.log('PREDICT_DEBUG_MATCH:', { value: props.value, suggestion, tail: ghostTail })

  return (
    <div className="relative w-full group font-sans">
      {/* Ghost Text Layer - Mirror Technique */}
      <div 
        className={cn(
          "absolute inset-0 px-3 py-1 text-base md:text-sm pointer-events-none flex items-center bg-transparent font-normal select-none overflow-hidden whitespace-pre", 
          className
        )}
      >
        {/* Case 1: Typing - Show invisible mirror + visible tail */}
        {props.value && ghostTail ? (
          <>
            <span className="text-transparent">{props.value}</span>
            <span className="text-red-500">{ghostTail}</span>
          </>
        ) : (
          /* Case 2: Empty Input - Show full suggestion (if any) */
          !props.value && suggestion && (
             <span className="text-red-500">{suggestion}</span>
          )
        )}
      </div>
      
      {/* Real Input Layer */}
      <Input
        {...props}
        ref={ref}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        // Make background transparent so ghost shows through
        className={cn("bg-transparent relative z-10 opacity-50", className)}
      />
    </div>
  )
})
PredictiveInput.displayName = "PredictiveInput"
