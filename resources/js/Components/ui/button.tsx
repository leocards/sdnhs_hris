import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background relative transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground hover:bg-prim ary/90",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline:
					"border border-input bg-background hover:bg-accent hover:text-accent-foreground",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:text-accent-foreground group",
				link: "text-primary dark:text-zinc-400 underline-offset-4 hover:underline",
				inherit: "",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
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
	withBackdrop?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			withBackdrop = true,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : "button";

		const bg = {
			default: "before:bg-white/20",
			destructive: "before:bg-white/20",
			secondary: "before:bg-primary/5",
			ghost: "before:bg-accent",
			outline: "before:bg-accent",
			link: "",
			inherit: "before:bg-inherit",
		};

		return (
			<Comp
				className={cn(
					buttonVariants({ variant, size, className }),
					"transition duration-150 group [&>*]:z-10",
                    "before:w-full before:h-full before:absolute before:rounded-[inherit]",
                    "before:scale-[.45] before:hover:scale-100 before:trasition before:duration-200 before:opacity-0 before:hover:opacity-100",
                    bg[variant ? variant : "default"]
				)}
				ref={ref}
				{...props}
			>
				{props.children}
			</Comp>
		);
	}
);
Button.displayName = "Button";

export { Button, buttonVariants };
