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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Label } from "@/Components/ui/label";

type Props = {
    ratings: {
        outstanding: Array<{
            id: number;
            first_name: string;
            middle_name: string;
            last_name: string;
            avatar: string;
            ratings: number;
        }>;
        least_performing: Array<{
            id: number;
            first_name: string;
            middle_name: string;
            last_name: string;
            avatar: string;
            ratings: number;
        }>;
    };
};

const PersonnelList: React.FC<Props> = ({ ratings }) => {
    return (
        <div className="">
            <div className="border rounded-md p-2 shadow-sm">
                <Tabs defaultValue="Outstanding" className="w-full flex flex-col">
                    <TabsList className="mb-5 w-fit">
                        <TabsTrigger value="Outstanding">Outstanding</TabsTrigger>
                        <TabsTrigger value="Least Performing">Least Performing</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center px-3">
                        <div className="text-sm text-foreground/50 font-medium">Personnel</div>
                        <div className="text-sm text-foreground/50 font-medium ml-auto">Ratings</div>
                    </div>
                    <TabsContent value="Outstanding" className="overflow-y-auto h-[22rem]">
                        {ratings.outstanding.length === 0 && (
                            <div className="px-3 text-center">No records</div>
                        )}
                        {ratings.outstanding.map((rating, index) => (
                            <div className="p-2 px-3 flex items-center gap-3 hover:bg-seconday" key={index}>
                                <AvatarProfile className="size-9" src={rating.avatar} />
                                <div className="line-clamp-1">{`${rating.last_name}, ${rating.first_name} ${rating.middle_name ? rating.middle_name?.charAt(0).toUpperCase()+'.' : ""}`}</div>
                                <Label className="ml-auto">{rating.ratings}</Label>
                            </div>
                        ))}
                    </TabsContent>
                    <TabsContent value="Least Performing" className="overflow-y-auto h-[22rem]">
                        {ratings.least_performing.length === 0 && (
                            <div className="px-3 text-center">No records</div>
                        )}
                        {ratings.least_performing.map((rating, index) => (
                            <div className="p-2 px-3 flex items-center gap-3 hover:bg-seconday" key={index}>
                                <AvatarProfile className="size-9" src={rating.avatar} />
                                <div className="line-clamp-1">{`${rating.last_name}, ${rating.first_name} ${rating.middle_name ? rating.middle_name?.charAt(0) : ""}`}</div>
                                <Label className="ml-auto">{rating.ratings}</Label>
                            </div>
                        ))}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default PersonnelList;
