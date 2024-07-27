import { cn } from "@/lib/utils";
import {
	Button,
	Popover,
	PopoverButton,
	PopoverPanel,
	Transition,
	CloseButton,
} from "@headlessui/react";
import { Check, ListFilter } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { PopoverPanelPositons, POSITIONS, transitions } from "./type";
import { useEffect, useState } from "react";

type ItemsType = {
	filter: string;
	onClick: (fitler: string) => void;
};

type FilterProps = {
	filter: string;
	active?: string;
	size?: string;
	bgStyle?: string;
	bordered?: boolean;
	items: ItemsType[];
    icon?: React.ReactNode;
	position?: POSITIONS;
	onClear?: () => void;
};

export default function Filter({
	position = "BOTTOMLEFT",
	size = "md",
	bordered = false,
	...props
}: FilterProps) {
	const [show, setShow] = useState<boolean>(false);
	const [popOver, setPopOver] = useState<boolean>(false);
    
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
								bordered && "border",
								Sizes,
                                "before:absolute before:left-0 before:w-full before:h-full before:bg-secondary before:rounded-[inherit] before:scale-[.45] before:opacity-0 before:ease-in-out before:transition-all before:duration-150",
                                "group-data-[open]:before:scale-100 group-data-[open]:before:opacity-100",
                                "hover:before:scale-100 hover:before:opacity-100"
							)}
						>
							{props.icon??<ListFilter className="w-4 h-4 sm:mr-2 z-10" />}
							<span className="max-sm:hidden z-10">
								{!props.active ? props.filter : props.active}
							</span>
						</PopoverButton>
						<Transition {...transitions}>
							<PopoverPanel
								anchor={PopoverPanelPositons[position]}
								className="divide-y border rounded-lg bg-background text-sm/6 [--anchor-gap:var(--spacing-5)] z-30 shadow-md dark:shadow-3xl min-w-[11rem] mt-1"
							>
								<ul className="py-1.5 w-full">
									{props.items.map(
										({ filter, onClick }, index) => (
											<li
												key={index}
												className="basis-full"
											>
												<CloseButton
													as={"div"}
													onClick={() =>
														onClick(filter)
													}
												>
													<Button
														className={cn(
															"px-3 h-8 hover:bg-secondary w-full text-left transition-colors flex items-center"
														)}
													>
														<div className="w-5 h-5 inline-flex mr-2 border border-slate-300 dark:border-zinc-600 rounded">
															{props.active ===
																filter && (
																<Check className="w-4 h-4 mx-auto my-auto" />
															)}
														</div>
														<div>{filter}</div>
													</Button>
												</CloseButton>
											</li>
										)
									)}
								</ul>
								<div className="flex items-center justify-end h-10 px-1 mt-2">
									<CloseButton as={Fragment}>
										<Button
											className={cn(
												"hover:bg-secondary px-3.5 py-1 rounded-full disabled:opacity-60 disabled:pointer-events-none"
											)}
											disabled={!props.active}
											onClick={() => {
												if (props.active) {
													props.onClear &&
														props.onClear();
												}
											}}
										>
											Clear
										</Button>
									</CloseButton>
								</div>
							</PopoverPanel>
						</Transition>
					</>
				);
			}}
		</Popover>
	);
}
