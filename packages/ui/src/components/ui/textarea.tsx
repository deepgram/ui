import * as React from "react";

import { cn } from "../../lib/utils.js";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "dg:flex dg:min-h-[60px] dg:w-full dg:rounded-md dg:border dg:border-input dg:bg-transparent dg:px-3 dg:py-2 dg:text-base dg:shadow-sm dg:placeholder:text-muted-foreground dg:focus-visible:outline-none dg:focus-visible:ring-1 dg:focus-visible:ring-ring dg:disabled:cursor-not-allowed dg:disabled:opacity-50 dg:md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
