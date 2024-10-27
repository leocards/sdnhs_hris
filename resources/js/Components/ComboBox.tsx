import useDebounce from "@/hooks/useDebounce";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { ScrollArea } from "@/Components/ui/scroll-area";
import DataList from "@/Components/DataList";
import { ChevronDown } from "lucide-react";
import { Input } from "./ui/input";

const ComboBox = ({
    label,
    disabled,
    routeSearch,
    onSelectResult,
    selected,
    initialList,
}: {
    label?: string;
    selected?: {id: number; name: string;}
    disabled?: boolean;
    routeSearch: string;
    onSelectResult: CallableFunction;
    initialList: Array<any>;
}) => {
    const [search, setSearch] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [popoverWidth, setPopoverWidth] = useState<number>(0);
    const [personnels, setPersonnels] = useState<Array<any>>([]);

    const debounceSearch = useDebounce(search, 500);
    const popoverWidthRef = useRef<HTMLButtonElement | null>(null);

    const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
        // remove all the white spaces to get the data only
        const input = event.target.value.replace(/\s+/g, " ");

        setSearch(input);
        if (input != "") setLoading(true);
        else {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (debounceSearch) {
            setLoading(true);
            window.axios
                .get(
                    route(routeSearch, {
                        _query: {
                            search: debounceSearch,
                        },
                    })
                )
                .then((response) => {
                    let data = response.data

                    let filtered = data.filter((d: any) => d.id != selected?.id)

                    setPersonnels(filtered)
                })
                .finally(() => setLoading(false));
        }
    }, [debounceSearch]);

    useEffect(() => {
        if(show) {
            let filtered = null;
            if(selected) {
                filtered = initialList.filter((il: any) => il.id != selected?.id)
            }

            setPersonnels(filtered??initialList)
        }
    }, [show])

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) {
                setPopoverWidth(entries[0].target.clientWidth);
            }
        });

        if (popoverWidthRef.current) {
            resizeObserver.observe(popoverWidthRef.current);
        }

        return () => {
            if (popoverWidthRef.current) {
                resizeObserver.unobserve(popoverWidthRef.current);
            }
        };
    }, []);

    return (
        <Popover open={show} onOpenChange={setShow}>
            <FormControl>
                <PopoverTrigger
                    ref={popoverWidthRef}
                    disabled={disabled}
                    className="w-full border rounded-md form-input px-3 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <div className="line-clamp-1 text-left">
                        {selected?.name||label}
                    </div>
                    <ChevronDown className="size-4 ml-auto shrink-0" />
                </PopoverTrigger>
            </FormControl>
            <PopoverContent
                className="p-2 rounded-lg"
                style={{ width: popoverWidth }}
            >
                <Input
                    className="form-input h-9"
                    placeholder="Search personnel"
                    onInput={onSearch}
                />
                <div className="pt-2">
                    <ScrollArea className="h-48">
                        <DataList
                            empty={personnels.length === 0}
                            emptyResults={search}
                            loading={loading}
                            customEmpty="You have not searched yet"
                        >
                            {personnels?.map((personnel, indx) => (
                                <div
                                    key={indx}
                                    className="rounded-md p-2 px-3 hover:bg-secondary transition cursor-pointer"
                                    onClick={() => {
                                        onSelectResult(personnel)
                                        setShow(false);
                                    }}
                                >
                                    {personnel.name}
                                </div>
                            ))}
                        </DataList>
                    </ScrollArea>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default ComboBox;
