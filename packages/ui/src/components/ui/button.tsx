import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils.js";

const buttonVariants = cva(
  "dg:inline-flex dg:items-center dg:justify-center dg:gap-2 dg:whitespace-nowrap dg:rounded-md dg:text-sm dg:font-medium dg:transition-colors dg:focus-visible:outline-none dg:focus-visible:ring-1 dg:focus-visible:ring-ring dg:disabled:pointer-events-none dg:disabled:opacity-50 dg:[&_svg]:pointer-events-none dg:[&_svg]:size-4 dg:[&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "dg:bg-primary dg:text-primary-foreground dg:shadow dg:hover:bg-primary/90",
        destructive: "dg:bg-destructive dg:text-destructive-foreground dg:shadow-sm dg:hover:bg-destructive/90",
        outline: "dg:border dg:border-input dg:bg-background dg:shadow-sm dg:hover:bg-accent dg:hover:text-accent-foreground",
        secondary: "dg:bg-secondary dg:text-secondary-foreground dg:shadow-sm dg:hover:bg-secondary/80",
        ghost: "dg:hover:bg-accent dg:hover:text-accent-foreground",
        link: "dg:text-primary dg:underline-offset-4 dg:hover:underline",
      },
      size: {
        default: "dg:h-9 dg:px-4 dg:py-2",
        sm: "dg:h-8 dg:rounded-md dg:px-3 dg:text-xs",
        lg: "dg:h-10 dg:rounded-md dg:px-8",
        icon: "dg:h-9 dg:w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
