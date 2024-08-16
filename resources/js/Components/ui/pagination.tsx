import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, ButtonProps, buttonVariants } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
    />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn("flex flex-row items-center gap-1", className)}
        {...props}
    />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
    isActive?: boolean;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
} & Pick<ButtonProps, "size"> & React.PropsWithChildren;

const PaginationLink = ({
    className,
    isActive,
    size = "icon",
    ...props
}: PaginationLinkProps) =>  (
    <Button variant={isActive ? "default" : "ghost"} {...props} size={size}>
        {props.children}
    </Button>
) /* (
    <Link
        as="button"
        href={href??"#"}
        aria-current={isActive ? "page" : undefined}
        className={cn(
            buttonVariants({
                variant: isActive ? "default" : "ghost",
                size,
            }),
            className,
            "[&>*]:z-[10]",
            "before:absolute before:left-0 before:w-full before:h-full before:bg-secondary before:rounded-[inherit] before:scale-[.45] before:opacity-0 hover:before:scale-100 hover:before:opacity-100 before:transition-all",
            isActive && "before:!bg-white/20"
        )}
        onClick={() => onClick && onClick()}
        {...props}
    >
        {props.children}
    </Link>
); */
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to previous page"
        size="icon"
        className={cn("gap-1 pl-2.5 [&>*]:z-[1]", className)}
        {...props}
    >
        <ChevronLeft className="h-4 w-4" />
    </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to next page"
        size="icon"
        className={cn("gap-1 pr-2.5 [&>*]:z-[1]", className)}
        {...props}
    >
        <ChevronRight className="h-4 w-4" />
    </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
    className,
    ...props
}: React.ComponentProps<"span">) => (
    <span
        aria-hidden
        className={cn("flex h-9 w-9 items-center justify-center", className)}
        {...props}
    >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">More pages</span>
    </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
};
