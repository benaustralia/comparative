import { GripVertical } from "lucide-react"
import { Group, Panel, Separator } from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({ className, ...props }) => (
  <Group
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

const ResizablePanel = Panel

const ResizableHandle = ({ withHandle, className, ...props }) => (
  <Separator
    className={cn(
      "relative flex w-2 items-center justify-center bg-slate-200 hover:bg-blue-400 transition-all after:absolute after:inset-y-0 after:left-1/2 after:w-4 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-8 w-4 items-center justify-center rounded-sm border border-slate-300 bg-white hover:bg-blue-50 transition-all shadow-sm">
        <GripVertical className="h-3 w-3 text-slate-500" />
      </div>
    )}
  </Separator>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
