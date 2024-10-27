import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import React, {
    ChangeEvent,
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { ScrollArea } from "@/Components/ui/scroll-area";
import useDebounce from "@/hooks/useDebounce";
import DataList from "@/Components/DataList";

type PersonnelDataType = {
    personnelId: number;
    name: string;
};

export const AttendanceHeader: React.FC<PropsWithChildren> = ({
    children,
}) => {
    return (
        <div className="p-6 px-5">
            <div className="font-bold text-xl px-1 mb-2">Attendance Form</div>
            {children}
        </div>
    );
};

export const setDraftData = (form: any) => {
    // retrieve the drafted data
    let tardinessDraft = localStorage.getItem("tardinessDraft");

    // check if there is a drafted data
    if (!tardinessDraft) {
        // if there is no drafted data, then add one to the local storage
        localStorage.setItem(
            "tardinessDraft",
            JSON.stringify(form.getValues("attendances"))
        );
    } else {
        // if there is a drafted data, then replace the form with draft.
        form.setValue("attendances", JSON.parse(tardinessDraft));

        // remove the draft in local storeage
        localStorage.removeItem("tardinessDraft");
    }
};

export const Counter: React.FC<{ withCount: boolean; counter: number }> = ({
    withCount,
    counter,
}) => {
    return (
        !withCount && (
            <div
                className={cn(
                    "font-medium w-8 text-left shrink-0",
                    ++counter > 99 && "!text-[13px]"
                )}
            >
                {counter}.
            </div>
        )
    );
};

export const ComboBox = ({
    form,
    index,
    disabled,
    initialList,
}: {
    form: any;
    index: number;
    disabled?: boolean;
    initialList: Array<any>;
}) => {
    const [search, setSearch] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [popoverWidth, setPopoverWidth] = useState<number>(0);
    const [personnels, setPersonnels] = useState<Array<any>>();

    const debounceSearch = useDebounce(search, 500);
    const popoverWidthRef = useRef<HTMLButtonElement | null>(null);

    const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
        // remove all the white spaces to get the data only
        const input = event.target.value.replace(/\s+/g, " ");

        setSearch(input);
        if (input != "") setLoading(true);
        else {
            setLoading(false);
            setPersonnels(initialList);
        }
    };

    useEffect(() => {
        setPersonnels(initialList);
    }, [initialList]);

    useEffect(() => {
        if (debounceSearch) {
            setLoading(true);
            window.axios
                .get(
                    route("personnel.tardiness.att.search", {
                        _query: {
                            search: debounceSearch,
                        },
                    })
                )
                .then((response) => {
                    let addedData = form.getValues("attendances");
                    // assign the response data to a variable
                    let data: Array<PersonnelDataType> = response.data;

                    // filter the results to retrieve only the data which are not existing to the form.
                    let filteredData = data.filter(
                        (fd) =>
                            !addedData.some(
                                (ap: any) => fd.personnelId === ap.personnelId
                            )
                    );

                    setPersonnels(filteredData);

                    // remove the loading indicator
                    setLoading(false);
                });
        }
    }, [debounceSearch]);

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
        <FormField
            control={form.control}
            name={`attendances.${index}.name`}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="required">Name</FormLabel>
                    <Popover open={show} onOpenChange={setShow}>
                        <FormControl>
                            <PopoverTrigger
                                ref={popoverWidthRef}
                                disabled={disabled}
                                className="w-full border rounded-md form-input px-3 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <div className="line-clamp-1 text-left">
                                    {field.value ? (
                                        field.value
                                    ) : (
                                        <span>Select personnel</span>
                                    )}
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
                                        empty={personnels?.length === 0}
                                        emptyResults={search}
                                        loading={loading}
                                    >
                                        {personnels?.map((personnel, indx) => (
                                            <div
                                                key={indx}
                                                className="rounded-md p-2 px-3 hover:bg-secondary transition cursor-pointer"
                                                onClick={() => {
                                                    field.onChange(
                                                        personnel.name
                                                    );
                                                    form.setValue(
                                                        `attendances.${index}.personnelId`,
                                                        personnel.personnelId
                                                    );
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
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
