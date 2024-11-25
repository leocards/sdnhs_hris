import Modal from "@/Components/Modal";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import MaleGender from "@/assets/malegender.png";
import FemaleGender from "@/assets/femalegender.png";
import { AvatarProfile } from "@/Components/ui/avatar";
import { useMessage } from "@/hooks/MessageProvider";
import { cn } from "@/lib/utils";
import { AtSign, Cake, Smartphone, X } from "lucide-react";

type User = {
    avatar: string;
    address: string;
    date_hired: string;
    date_of_birth: string;
    department: string;
    email: string;
    first_name: string;
    id: number | null;
    last_name: string;
    leave_credits: number | null;
    leave_rendered: number | null;
    middle_name: string;
    phone_number: string;
    position: any;
    role: string;
    sex: string;
    personnel_id: string;
};

type PersonnelDetailsProps = {
    user?: User | null;
    show: boolean;
    onClose: CallableFunction;
    onViewPDS: (view: true) => void;
};

export default function PersonnelDetails({
    user = null,
    show,
    onClose,
    onViewPDS,
}: PersonnelDetailsProps) {
    const { activeUsers } = useMessage();

    const gender = {
        Male: {
            icon: MaleGender,
            label: "Male",
            style: "bg-blue-100 text-blue-600",
        },
        Female: {
            icon: FemaleGender,
            label: "Female",
            style: "bg-red-100 text-red-600",
        },
    }[user?.sex ?? ""];

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="sm">
            <div className="p-6 flex flex-col">
                <div className="mx-auto">
                    <AvatarProfile
                        src={user?.avatar}
                        className="size-20"
                        activeStatusPosition={"bottom-1 right-1.5 !size-3"}
                        active={!!activeUsers.find(({ id }) => id == user?.id)}
                    />
                </div>

                <Label className="text-lg text-center mt-2">{`${user?.first_name} ${user?.middle_name} ${user?.last_name}`}</Label>
                <Label className="text-center">{user?.position}</Label>

                <div className="flex flex-wrap justify-center gap-2 mx-auto mt-3">
                    <div
                        className={cn(
                            "flex items-center gap-2 rounded-md p-1 px-3 text-sm font-medium shrink-0",
                            gender?.style
                        )}
                    >
                        <img src={gender?.icon} alt="" className="size-5" />
                        {gender?.label}
                    </div>
                    <div className="flex items-center px-3 py-1 gap-2 text-yellow-600 bg-yellow-100 rounded-md text-sm font-medium shrink-0">
                        <Cake className="size-5 text-yellow-600" />
                        {user?.date_of_birth &&
                            format(user?.date_of_birth, "PP")}
                    </div>
                </div>

                <div className="mx-auto flex flex-col p-3 rounded-md border mt-5 shadow-sm">
                    <div className="flex items-center gap-2 mx-auto text-sm">
                        <Smartphone className="size-4" strokeWidth={2.2} />
                        {user?.phone_number}
                    </div>

                    <div className="flex items-center gap-2 text-sm mx-auto mt-2">
                        <AtSign className="size-4" strokeWidth={2.2} />
                        {user?.email}
                    </div>

                    <div className="flex items-center gap-2 text-sm mx-auto mt-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-map-pin-house size-5"
                        >
                            <path d="M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z" />
                            <path d="M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2" />
                            <path d="M18 22v-3" />
                            <circle cx="10" cy="10" r="3" />
                        </svg>
                        {user?.address}
                    </div>
                </div>

                {/* <div className="flex flex-row items-center mt-10">
                    <Button
                        variant="secondary"
                        className="h-9 w-full"
                        onClick={() => {
                            onClose(false);
                            setTimeout(() => {
                                onViewPDS(true);
                            }, 300);
                        }}
                    >
                        <span>View PDS</span>
                    </Button>
                </div> */}

                <Button
                        className="rounded-full absolute top-1.5 right-1.5"
                        variant="secondary"
                        onClick={() => onClose(false)}
                        size="icon"
                    >
                        <X className="size-4" />
                    </Button>
            </div>
        </Modal>
    );
}
