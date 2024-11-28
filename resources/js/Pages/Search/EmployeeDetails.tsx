import { Label } from "@/Components/ui/label";
import { format } from "date-fns";
import React from "react";

type UserDetails = {
    birthDate: string;
    sex: string;
    address: string;
    email: string;
    phoneNumber: string;
    staffId: string;
    dateHired: string;
    department: string;
    credits: string;
    leave: string;
};

type Props = {
    user: UserDetails;
};

const EmployeeDetails: React.FC<Props> = ({ user }) => {
    return (
        <div className="mt-8 grid [@media(min-width:1285px)]:grid-cols-2 [@media(min-width:1285px)]:gap-8 gap-3">
            <div className="space-y-3">
                <div className="sm:flex items-center">
                    <Label className="w-40 flex items-center text-foreground/50 font-semibold">
                        Date of Birth <span className="ml-auto mr-3 max-sm:hidden">:</span>{" "}
                    </Label>
                    <div>{format(user.birthDate, "LLLL d, y")}</div>
                </div>
                <div className="sm:flex items-center">
                    <Label className="w-40 flex items-center text-foreground/50 font-semibold">
                        Sex <span className="ml-auto mr-3 max-sm:hidden">:</span>{" "}
                    </Label>
                    <div>{user.sex}</div>
                </div>
                <div className="sm:flex items-center">
                    <Label className="w-40 flex items-center text-foreground/50 font-semibold">
                        Address <span className="ml-auto mr-3 max-sm:hidden">:</span>{" "}
                    </Label>
                    <div>{user.address}</div>
                </div>
                <div className="sm:flex items-center">
                    <Label className="w-40 flex items-center text-foreground/50 font-semibold">
                        Email <span className="ml-auto mr-3 max-sm:hidden">:</span>{" "}
                    </Label>
                    <div>{user.email}</div>
                </div>
                <div className="sm:flex items-center">
                    <Label className="w-40 flex items-center text-foreground/50 font-semibold">
                        Phone number <span className="ml-auto mr-3 max-sm:hidden">:</span>{" "}
                    </Label>
                    <div>{user.phoneNumber}</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="sm:flex items-center">
                    <Label className="w-40 flex items-center text-foreground/50 font-semibold">
                        Staff ID <span className="ml-auto mr-3 max-sm:hidden">:</span>{" "}
                    </Label>
                    <div>{user.staffId}</div>
                </div>
                <div className="sm:flex items-center">
                    <Label className="w-40 flex items-center text-foreground/50 font-semibold">
                        Date hired <span className="ml-auto mr-3 max-sm:hidden">:</span>{" "}
                    </Label>
                    <div>{format(user.dateHired, 'LLLL d, y')}</div>
                </div>
                <div className="sm:flex items-center">
                    <Label className="w-40 flex items-center text-foreground/50 font-semibold">
                        Department <span className="ml-auto mr-3 max-sm:hidden">:</span>{" "}
                    </Label>
                    <div>{user.department}</div>
                </div>
                <div className="sm:flex items-center">
                    <Label className="w-40 flex items-center text-foreground/50 font-semibold">
                        Credits <span className="ml-auto mr-3 max-sm:hidden">:</span>{" "}
                    </Label>
                    <div>{user.credits}</div>
                </div>
                <div className="sm:flex items-center">
                    <Label className="w-40 flex items-center text-foreground/50 font-semibold">
                        Leave <span className="ml-auto mr-3 max-sm:hidden">:</span>{" "}
                    </Label>
                    <div>{user.leave}</div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetails;
