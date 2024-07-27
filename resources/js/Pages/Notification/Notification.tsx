import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";

export default function Notification({ auth }: PageProps) {
    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Notification
                </h2>
            }
        >
            
        </Authenticated>
    );
}
