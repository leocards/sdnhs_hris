import DataList from "@/Components/DataList";
import PaginationButton from "@/Components/PaginationButton";
import { AvatarProfile } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { useMessage } from "@/hooks/MessageProvider";
import { usePageList } from "@/hooks/pageListProvider";
import useDebounce from "@/hooks/useDebounce";
import { SearchIcon, X } from "lucide-react";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Badge } from "@/Components/ui/badge";
import { LEAVETYPES } from "../Leave/types";
import { ROLES } from "@/types";

const PersonnelList = () => {
    const { data, setList, setLoading, loading } =
        usePageList();
    const { activeUsers } = useMessage();
    const [search, setSearch] = useState<string>("");
    const searchRef = useRef<HTMLInputElement | null>(null);
    const debounceSearch = useDebounce<string>(search, search ? 700 : 0);
    const [intialList, setInitialList] = useState<any>();

    const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value.replace(/\s+/g, " ");

        setSearch(input);
        input && setLoading(true);
    };
    const clearSearch = () => {
        searchRef.current && searchRef.current.focus();
        setSearch("");
        setList(intialList)
    };

    const getPageData = (page?: number) => {
        setLoading(true);
        window.axios
            .get(
                route("dashboard.personnelList", {
                    _query: {
                        search: search,
                        page: page,
                    },
                })
            )
            .then((response) => {
                const data = response.data;
                setList(data);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (debounceSearch) {
            window.axios
                .get(
                    route("dashboard.personnelList", {
                        _query: {
                            search: search,
                        },
                    })
                )
                .then((response) => {
                    let data = response.data;

                    setList(data);
                })
                .finally(() => setLoading(false));
        }
    }, [debounceSearch]);

    useEffect(() => {
        window.axios
            .get(
                route("dashboard.personnelList", {
                    _query: {
                        search: search,
                        page: 1,
                    },
                })
            )
            .then((response) => {
                const data = response.data;
                setList(data);
                setInitialList(data)
                setLoading(false);
            });
    }, [])

    return (
        <div className="mt-4">
            <div className="border rounded-md h-[28rem] md:mt-8 grid grid-cols-1 overflow-hidden grid-rows-[auto,1fr]">
                <div className="border-b min-h-12 px-3 font-medium flex items-center bg-amber-300 dark:bg-amber-800/50 py-2">
                    <div className="">Personnel's Remaining Leave</div>

                    <div className="flex relative w-64 h-fit ml-auto">
                        <Input
                            className="w-full px-10"
                            value={search}
                            placeholder="Search personnel"
                            ref={searchRef}
                            onInput={onSearch}
                        />
                        <SearchIcon className="size-5 absolute top-1/2 -translate-y-1/2 left-2.5 opacity-45" />
                        {search !== "" && (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute top-1/2 -translate-y-1/2 right-1 size-8"
                                onClick={clearSearch}
                            >
                                <X className="size-5" />
                            </Button>
                        )}
                    </div>
                </div>
                <ScrollArea>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-3 px-3"></div>
                    <DataList empty={data.length === 0} loading={loading}>
                        <Accordion type="single" collapsible onValueChange={(value) => console.log(value)}>
                            {data.map((list, index) => (
                                <AccordionCard key={index} value={list.id.toString()} active={!!(activeUsers.find(({id}) => id == list.id))} user={list} />
                            ))}
                        </Accordion>
                    </DataList>
                </ScrollArea>
            </div>

            <PaginationButton
                onPage={getPageData}
                onNext={getPageData}
                onPrevious={getPageData}
            />
        </div>
    );
};

type AccordionCardProps = {
    value: string;
    active: boolean;
    user: { id: number; first_name: string; last_name: string; middle_name: string; avatar: string, leave_applications: any[], sex: "Male" | "Female", role: ROLES };
};

const AccordionCard: React.FC<AccordionCardProps> = ({ active, user, value }) => {

    let availableLeaveApplications = LEAVETYPES.filter((lt) => {
        return !user.leave_applications.some((la) => la.leave_type === lt) && lt !== "Others"
    })

    availableLeaveApplications = availableLeaveApplications.filter((lt) => {
        if(user.role == "Teaching") {
            if(lt != "Vacation Leave" && lt != "Special Privilege Leave" ) {
                return lt
            }
        } else return lt
    })

    availableLeaveApplications = availableLeaveApplications.filter((lt) => {
        if(user.sex === "Male") {
            // if it is male remove list which are not for male !["Maternity Leave", "Special Leave Benefits for Women"].includes(lt)
            if(lt != "Maternity Leave" && lt != "Special Leave Benefits for Women") {
                return lt
            }
        } else {
            if(lt != "Paternity Leave") {
                return lt
            }
        }
    })

    if(!availableLeaveApplications.includes('Sick Leave'))
        availableLeaveApplications.splice(2, 0, "Sick Leave")

    return (
        <AccordionItem value={value}>
            <AccordionTrigger className="py-2 flex items-center px-3 hover:bg-secondary">
                <div className="flex items-center gap-3">
                    <AvatarProfile className="size-8" active={active} />
                    <div className="line-clamp-1">{`${user.last_name}, ${user.first_name} ${user.middle_name??""}`}</div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="border-t shadow-inner px-3">
                <div className="p-2.5">
                    <div className="mb-1.5"> Available leave: </div>

                    <div className="flex flex-wrap gap-1.5">
                        {availableLeaveApplications.map((leave, index) => <Badge className="bg-blue-100 !text-blue-600 hover:bg-blue-200" key={index}>{leave}</Badge>)}
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};

export default PersonnelList;
