import Modal from "@/Components/Modal";
import { Button } from "@/Components/ui/button";
import { useEffect, useState } from "react";

type StaffDetailsProps = {
    user?: User | null;
    show: boolean;
    onClose: (close: false) => void;
    onViewPDS: (view: true) => void;
};

export default function StaffDetails({
    user = null,
    show,
    onClose,
    onViewPDS,
}: StaffDetailsProps) {
    const staff = useUserDetails(user ?? null);

    return (
        <Modal show={show} onClose={() => onClose(false)}>
            <div className="p-6">
                <div className="flex flex-row items-center">
                    <div className="font-semibold text-xl">{staff?.name}</div>

                    <Button variant="ghost" className="ml-auto h-9" onClick={() => {
                        onClose(false)
                        setTimeout(() => {
                            onViewPDS(true)
                        }, 300)
                    }}>
                        <span>View PDS</span>
                    </Button>
                </div>

                <div className="flex mt-8">
                    <Button className="ml-auto px-8" variant="secondary">
                        <span>Close</span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

type User = {
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
    staff_id: string;
};

const useUserDetails = (user: User | null) => {
    const [staff, setStaff] = useState<{
        address: string;
        date_hired: string;
        date_of_birth: string;
        department: string;
        email: string;
        id: number | null;
        name: string;
        leave_credits: number | null;
        middle_name: string;
        phone_number: string;
        position: any;
        role: string;
        sex: string;
        staff_id: string;
    }>();

    useEffect(() => {
        if (user)
            setStaff({
                address: user.address,
                date_hired: user.date_hired,
                date_of_birth: user.date_of_birth,
                department: user.department,
                email: user.email,
                name: user.first_name + " " + user.last_name,
                id: user.id,
                leave_credits: user.leave_credits,
                middle_name: user.middle_name,
                phone_number: user.phone_number,
                position: user.position,
                role: user.role,
                sex: user.sex,
                staff_id: user.staff_id,
            });
        else
            setStaff({
                address: "",
                date_hired: "",
                date_of_birth: "",
                department: "",
                email: "",
                name: "",
                id: null,
                leave_credits: null,
                middle_name: "",
                phone_number: "",
                position: "",
                role: "",
                sex: "",
                staff_id: "",
            });
    }, [user]);

    return staff;
};
