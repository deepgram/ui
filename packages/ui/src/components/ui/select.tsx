"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "../../lib/utils.js";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "dg:flex dg:h-9 dg:w-full dg:items-center dg:justify-between dg:whitespace-nowrap dg:rounded-md dg:border dg:border-input dg:bg-transparent dg:px-3 dg:py-2 dg:text-sm dg:shadow-sm dg:ring-offset-background dg:data-[placeholder]:text-muted-foreground dg:focus:outline-none dg:focus:ring-1 dg:focus:ring-ring dg:disabled:cursor-not-allowed dg:disabled:opacity-50 dg:[&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="dg:h-4 dg:w-4 dg:opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("dg:flex dg:cursor-default dg:items-center dg:justify-center dg:py-1", className)}
    {...props}
  >
    <ChevronUp className="dg:h-4 dg:w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("dg:flex dg:cursor-default dg:items-center dg:justify-center dg:py-1", className)}
    {...props}
  >
    <ChevronDown className="dg:h-4 dg:w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "dg:relative dg:z-50 dg:max-h-[--radix-select-content-available-height] dg:min-w-[8rem] dg:overflow-y-auto dg:overflow-x-hidden dg:rounded-md dg:border dg:bg-popover dg:text-popover-foreground dg:shadow-md dg:data-[state=open]:animate-in dg:data-[state=closed]:animate-out dg:data-[state=closed]:fade-out-0 dg:data-[state=open]:fade-in-0 dg:data-[state=closed]:zoom-out-95 dg:data-[state=open]:zoom-in-95 dg:data-[side=bottom]:slide-in-from-top-2 dg:data-[side=left]:slide-in-from-right-2 dg:data-[side=right]:slide-in-from-left-2 dg:data-[side=top]:slide-in-from-bottom-2 dg:origin-[--radix-select-content-transform-origin]",
        position === "popper" &&
          "dg:data-[side=bottom]:translate-y-1 dg:data-[side=left]:-translate-x-1 dg:data-[side=right]:translate-x-1 dg:data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "dg:p-1",
          position === "popper" &&
            "dg:h-[var(--radix-select-trigger-height)] dg:w-full dg:min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("dg:px-2 dg:py-1.5 dg:text-sm dg:font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "dg:relative dg:flex dg:w-full dg:cursor-default dg:select-none dg:items-center dg:rounded-sm dg:py-1.5 dg:pl-2 dg:pr-8 dg:text-sm dg:outline-none dg:focus:bg-accent dg:focus:text-accent-foreground dg:data-[disabled]:pointer-events-none dg:data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="dg:absolute dg:right-2 dg:flex dg:h-3.5 dg:w-3.5 dg:items-center dg:justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="dg:h-4 dg:w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("dg:-mx-1 dg:my-1 dg:h-px dg:bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
