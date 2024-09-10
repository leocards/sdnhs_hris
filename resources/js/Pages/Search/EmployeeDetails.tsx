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
                <div className="flex items-center">
                    <Label className="w-40 flex items-center">
                        Date of Birth <span className="ml-auto mr-3">:</span>{" "}
                    </Label>
                    <div>{format(user.birthDate, "PPP")}</div>
                </div>
                <div className="flex items-center">
                    <Label className="w-40 flex items-center">
                        Sex <span className="ml-auto mr-3">:</span>{" "}
                    </Label>
                    <div>{user.sex}</div>
                </div>
                <div className="flex items-center">
                    <Label className="w-40 flex items-center">
                        Address <span className="ml-auto mr-3">:</span>{" "}
                    </Label>
                    <div>{user.address}</div>
                </div>
                <div className="flex items-center">
                    <Label className="w-40 flex items-center">
                        Email <span className="ml-auto mr-3">:</span>{" "}
                    </Label>
                    <div>{user.email}</div>
                </div>
                <div className="flex items-center">
                    <Label className="w-40 flex items-center">
                        Phone number <span className="ml-auto mr-3">:</span>{" "}
                    </Label>
                    <div>{user.phoneNumber}</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="flex items-center">
                    <Label className="w-40 flex items-center">
                        Staff ID <span className="ml-auto mr-3">:</span>{" "}
                    </Label>
                    <div>{user.staffId}</div>
                </div>
                <div className="flex items-center">
                    <Label className="w-40 flex items-center">
                        Date hired <span className="ml-auto mr-3">:</span>{" "}
                    </Label>
                    <div>{format(user.dateHired, 'PPP')}</div>
                </div>
                <div className="flex items-center">
                    <Label className="w-40 flex items-center">
                        Department <span className="ml-auto mr-3">:</span>{" "}
                    </Label>
                    <div>{user.department}</div>
                </div>
                <div className="flex items-center">
                    <Label className="w-40 flex items-center">
                        Credits <span className="ml-auto mr-3">:</span>{" "}
                    </Label>
                    <div>{user.credits}</div>
                </div>
                <div className="flex items-center">
                    <Label className="w-40 flex items-center">
                        Leave <span className="ml-auto mr-3">:</span>{" "}
                    </Label>
                    <div>{user.leave}</div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetails;
