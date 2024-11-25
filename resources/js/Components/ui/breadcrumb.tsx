import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "./menubar"
import { Link, router } from "@inertiajs/react"
import useWindowSize from "@/hooks/useWindowResize"

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"

type LinksType = {
	link: string;
	linkname: string;
};

type BreadcrumbsProps = {
	home?: React.ReactNode | string;
	homeLink?: string;
	links?: LinksType[];
    _query?: Record<string, unknown>
};

export function Breadcrumbs({
	home = "Home",
	homeLink = "/",
	links,
    _query,
}: BreadcrumbsProps) {
	const { width } = useWindowSize();

	const breadcrumLinks = links ? [...links] : links;

	const setBreadcrumbs = () => {
		if (width > 639) {
			if (breadcrumLinks && breadcrumLinks.length > 3) {
				return breadcrumLinks.splice(0, breadcrumLinks.length - 2);
			}
		} else {
			if (breadcrumLinks && breadcrumLinks.length > 3) {
				return breadcrumLinks.splice(0, breadcrumLinks.length - 1);
			}
		}

		return null;
	};

	const listlinks = setBreadcrumbs();

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem className="max-[467px]:hidden">
					<BreadcrumbLink asChild>
						<Link href={route(homeLink, { _query })}>{home}</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator className="max-[467px]:hidden" />
				{listlinks && (
					<>
						<BreadcrumbItem>
							<Menubar className="p-0 h-fit border-none">
								<MenubarMenu>
									<MenubarTrigger className="size-7 min-[467px]:size-6 px-0 flex items-center justify-center cursor-pointer">
										<BreadcrumbEllipsis className="size-5 min-[467px]:size-4 shrink-0" />
										<span className="sr-only">
											Toggle menu
										</span>
									</MenubarTrigger>
									<MenubarContent align="start">
										<MenubarItem
											onClick={() => router.get(homeLink)}
                                            className="min-[467px]:hidden"
										>
											{home}
										</MenubarItem>
										{listlinks?.map((link, index) => (
											<MenubarItem
												key={index}
												onClick={() =>
													router.get(link.link)
												}
											>
												{link.linkname}
											</MenubarItem>
										))}
									</MenubarContent>
								</MenubarMenu>
							</Menubar>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
					</>
				)}

				{breadcrumLinks?.map((link, index) => (
					<React.Fragment key={index}>
						{breadcrumLinks.length - 1 === index ? (
							<BreadcrumbItem key={index}>
								<BreadcrumbPage className="line-clamp-1 max-w-[10rem]">
									{link.linkname}
								</BreadcrumbPage>
							</BreadcrumbItem>
						) : (
							<React.Fragment key={index}>
								<BreadcrumbItem>
									<BreadcrumbLink asChild>
										<Link
											href={route(link.link)}
											className="line-clamp-1 max-w-[10rem] dark:text-white/60 dark:hover:text-foreground"
										>
											{link.linkname}
										</Link>
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
							</React.Fragment>
						)}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
