"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils.js";

const toggleVariants = cva(
  "dg:inline-flex dg:items-center dg:justify-center dg:gap-2 dg:rounded-md dg:text-sm dg:font-medium dg:transition-colors dg:hover:bg-muted dg:hover:text-muted-foreground dg:focus-visible:outline-none dg:focus-visible:ring-1 dg:focus-visible:ring-ring dg:disabled:pointer-events-none dg:disabled:opacity-50 dg:data-[state=on]:bg-accent dg:data-[state=on]:text-accent-foreground dg:[&_svg]:pointer-events-none dg:[&_svg]:size-4 dg:[&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "dg:bg-transparent",
        outline: "dg:border dg:border-input dg:bg-transparent dg:shadow-sm dg:hover:bg-accent dg:hover:text-accent-foreground",
      },
      size: {
        default: "dg:h-9 dg:px-2 dg:min-w-9",
        sm: "dg:h-8 dg:px-1.5 dg:min-w-8",
        lg: "dg:h-10 dg:px-2.5 dg:min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
