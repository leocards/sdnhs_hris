import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
import { usePageList } from "@/hooks/pageListProvider";
import { Button } from "./ui/button";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "./ui/menubar";
import { Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
    onPage: (page?: number) => void;
    onNext: (page?: number) => void;
    onPrevious: (page?: number) => void;
};

const PaginationButton = ({ onPage, onNext, onPrevious }: Props) => {
    const { pages } = usePageList();

    return (
        (pages?.total || 0) > 50 && (
            <Pagination className="!mt-auto pt-2">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            disabled={!!!pages?.prevPageUrl}
                            onClick={() => {
                                let pageNumber = pages?.currentPage || 1;
                                if (pages?.currentPage != 1)
                                    onPrevious((pageNumber -= 1));
                                [].splice
                            }}
                        />
                    </PaginationItem>
                    {pages?.pageSet.map((page, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink
                                isActive={pages?.currentPage === page}
                                onClick={() => onPage(page)}
                            >
                                <span>{page}</span>
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    {(pages?.lastPage || 1) > 3 && (
                        <PaginationItem className="">
                            <Menubar className="p-0 h-fit border-none">
                                <MenubarMenu>
                                    <MenubarTrigger className="p-0 !h-fit cursor-pointer">
                                        <PaginationEllipsis className="size-10" />
                                    </MenubarTrigger>
                                    <MenubarContent
                                        align="center"
                                        className={cn("overflow-hidden p-0")}
                                    >
                                        <div
                                            className={cn(
                                                "grid grid-cols-[repeat(5,2.5rem)] gap-0.5 max-h-32 overflow-y-auto p-1",
                                                "[&::-webkit-scrollbar]:w-[10px] [&::-webkit-scrollbar-thumb]:bg-zinc-400/60 [&::-webkit-scrollbar-thumb]:hover:bg-zinc-400"
                                            )}
                                        >
                                            {Array.from({
                                                length: (pages?.lastPage || 1),
                                            }).map((_, index) => {
                                                let page = (++index)
                                                return (
                                                    <MenubarItem
                                                        key={index}
                                                        className="hover:!bg-transparent p-0"
                                                    >
                                                        <PaginationLink
                                                            isActive={
                                                                pages?.currentPage ===
                                                                page
                                                            }
                                                            onClick={() =>
                                                                onPage(page)
                                                            }
                                                        >
                                                            <span>{page}</span>
                                                        </PaginationLink>
                                                    </MenubarItem>
                                                )
                                            })}
                                        </div>
                                    </MenubarContent>
                                </MenubarMenu>
                            </Menubar>
                        </PaginationItem>
                    )}
                    <PaginationItem>
                        <PaginationNext
                            disabled={!!!pages?.nextPageUrl}
                            onClick={() => {
                                let pageNumber = pages?.currentPage || 1;
                                if (
                                    (pages?.lastPage || 1) >
                                    (pages?.currentPage || 1)
                                )
                                    onNext((pageNumber += 1));
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        )
    );
};

export default PaginationButton;
