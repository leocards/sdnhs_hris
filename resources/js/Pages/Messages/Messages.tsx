import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import ChatBox from "./ChatBox";
import { Head } from "@inertiajs/react";
import SidePanel from "./SidePanel";
import { USER } from "@/hooks/MessageProvider";

type Props = {
    user_open_message: USER
};

export default function Messages({ auth, user_open_message }: PageProps & Props) {
    return (
        <Authenticated
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight">
                    Messages
                </h2>
            }
        >
            <Head title="Messages" />

            <div className="mt-6 grid grid-cols-1 grid-rows-1">
                <div className="grid [@media(min-width:720px)]:grid-cols-[20rem,1fr] row-span-1 gap-3 [&>div]:h-[calc(100vh-10.5em)]">
                    <SidePanel auth={auth} user_open_message={user_open_message} />

                    <ChatBox auth={auth.user} />
                </div>
            </div>
        </Authenticated>
    );
}
