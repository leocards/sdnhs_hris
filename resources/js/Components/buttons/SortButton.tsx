import { cn } from "@/lib/utils";
import {
	Button,
	Popover,
	PopoverButton,
	PopoverPanel,
	Transition,
	CloseButton,
} from "@headlessui/react";
import { ArrowDownUp, Check } from "lucide-react";
import { PopoverPanelPositons, transitions } from "./type";
import { Fragment, useEffect, useState } from "react";

type SortTypes = {
	sort: string;
};

type SortProps = {
	sort: string;
	order?: string;
	sorts?: SortTypes[];
	bgStyle?: string;
	withActive?: boolean;
	size?: "sm" | "md" | "lg" | "xl";
	position?: "TOPLEFT" | "TOPRIGHT" | "BOTTOMLEFT" | "BOTTOMRIGHT";
	onSort: (order: string) => void;
	onOrderBy: (order: string) => void;
};

const InitialSort = [
	{ sort: "Title" },
	{ sort: "Date modified" },
	{ sort: "Type" },
];

export default function Sort({
	order = "ASC",
	position = "BOTTOMLEFT",
	size = "md",
	sorts = InitialSort,
	...props
}: SortProps) {

	const Sizes = {
		sm: "h-8",
		md: "h-9",
		lg: "h-10",
		xl: "h-11",
	}[size];

	return (
		<Popover className="group">
			{({ open }) => {
				return (
					<>
						<PopoverButton
							className={cn(
								"flex items-center text-sm/6 focus:outline-none data-[active]:dark:text-white px-3 rounded-md border-border relative",
								Sizes,
                                "before:absolute before:left-0 before:w-full before:h-full before:bg-secondary before:rounded-[inherit] before:scale-[.45] before:opacity-0 before:ease-in-out before:transition-all before:duration-150",
                                "group-data-[open]:before:scale-100 group-data-[open]:before:opacity-100",
                                "hover:before:scale-100 hover:before:opacity-100"
							)}
						>
							<ArrowDownUp className="w-4 h-4 sm:mr-2 z-10" />
							<span className="max-sm:hidden z-10">
								{props.withActive ? props.sort : "Sort"}
							</span>
						</PopoverButton>
						<Transition {...transitions}>
							<PopoverPanel
								anchor={PopoverPanelPositons[position]}
								className="divide-y border rounded-lg bg-background text-sm/6 [--anchor-gap:var(--spacing-5)] z-30 shadow-md dark:shadow-3xl min-w-[11rem] mt-1"
							>
								<ul className="py-1.5 w-full">
									{sorts?.map(({ sort }, index) => (
										<li key={index} className="basis-full">
											<CloseButton
												as={"div"}
												onClick={() =>
													props.onSort(sort)
												}
											>
												<Button
													className={cn(
														"px-3 h-8 hover:bg-secondary w-full text-left transition-colors flex items-center"
													)}
												>
													<div className="w-5 h-5 inline-flex mr-2 border border-slate-300 dark:border-zinc-600 rounded">
														{props.sort ===
															sort && (
															<Check className="w-4 h-4 mx-auto my-auto" />
														)}
													</div>
													<div>{sort}</div>
												</Button>
											</CloseButton>
										</li>
									))}
									<li className="basis-full border-t my-1" />
									<li className="basis-full">
										<CloseButton
											as={"div"}
											onClick={() =>
												props.onOrderBy("ASC")
											}
										>
											<Button
												className={cn(
													"px-3 h-8 hover:bg-secondary w-full text-left transition-colors flex items-center"
												)}
											>
												<div className="w-5 h-5 inline-flex mr-2 border border-slate-300 dark:border-zinc-600 rounded">
													{order === "ASC" && (
														<Check className="w-4 h-4 mx-auto my-auto" />
													)}
												</div>
												<div>Ascending</div>
											</Button>
										</CloseButton>
									</li>
									<li className="basis-full">
										<CloseButton
											as={"div"}
											onClick={() =>
												props.onOrderBy("DESC")
											}
										>
											<Button
												className={cn(
													"px-3 h-8 hover:bg-secondary w-full text-left transition-colors flex items-center"
												)}
											>
												<div className="w-5 h-5 inline-flex mr-2 border border-slate-300 dark:border-zinc-600 rounded">
													{order === "DESC" && (
														<Check className="w-4 h-4 mx-auto my-auto" />
													)}
												</div>
												<div>Descending</div>
											</Button>
										</CloseButton>
									</li>
								</ul>
							</PopoverPanel>
						</Transition>
					</>
				);
			}}
		</Popover>
	);
}
