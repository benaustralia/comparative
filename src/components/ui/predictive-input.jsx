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
    if (!val && recommended) { setSuggestion(recommended); return }
    if (val && suggestions.length > 0) {
      const match = suggestions.find(s => s.toLowerCase().startsWith(val.toLowerCase()))
      setSuggestion(match && match.toLowerCase() !== val.toLowerCase() ? match : "")
    } else {
      setSuggestion("")
    }
  }

  React.useEffect(() => {
    updateSuggestion(props.value || "");
  }, [props.value, suggestions, recommended]);

  const handleInputChange = (e) => {
    props.onChange?.(e)
    updateSuggestion(e.target.value)
  }

  const handleKeyDown = (e) => {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && suggestion) {
      e.preventDefault()
      onPredictionAccept(suggestion)
    }
    props.onKeyDown?.(e)
  }

  const ghostTail = (suggestion && props.value && suggestion.toLowerCase().startsWith(props.value.toLowerCase()))
    ? suggestion.slice(props.value.length) : ""

  return (
    <div className="relative w-full group font-sans">
      {/* Ghost Text Layer - Matches Input's border+padding coordinate system */}
      <div
        className={cn(
          "absolute inset-0 px-3 py-1 text-base md:text-sm pointer-events-none border border-transparent bg-transparent font-normal select-none overflow-hidden whitespace-pre z-[5] flex items-center",
          className
        )}
      >
        {props.value && ghostTail ? (
          <>
            <span className="text-transparent">{props.value}</span>
            <span className="text-muted-foreground opacity-30">{ghostTail}</span>
          </>
        ) : (
          !props.value && suggestion && (
             <span className="text-muted-foreground opacity-30">{suggestion}</span>
          )
        )}
      </div>

      {/* Real Input Layer */}
      <Input
        {...props}
        ref={ref}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        className={cn("bg-transparent relative z-10", className)}
      />
    </div>
  )
})
PredictiveInput.displayName = "PredictiveInput"
