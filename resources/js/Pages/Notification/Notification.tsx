import DataList from "@/Components/DataList";
import Tabs from "@/Components/framer/Tabs";
import { AvatarProfile } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/Components/ui/menubar";
import { useToast } from "@/Components/ui/use-toast";
import { useNotification } from "@/hooks/NotificationProvider";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { cn } from "@/lib/utils";
import { PageProps, PaginateData } from "@/types";
import { Head, router } from "@inertiajs/react";
import { formatDistanceToNow } from "date-fns";
import { Ellipsis } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
    notifications: PaginateData;
} & PageProps;

export default function Notification({ auth, notifications }: Props) {
    const activeTab = !!window.location.search;
    const [data, setData] = useState(notifications);
    const { toast, dismiss } = useToast();
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [removedData, setRemovedData] = useState<{
        index: number;
        data: any;
    }>({ index: 0, data: null });

    const { unreadNotifications, setUnreadNotifications } = useNotification();

    const getData = async (nav: string) => {
        setLoading(true);
        if (nav === "all") setData(notifications);
        else {
            let response = await window.axios.get(
                route("notification.json", { _query: { filter: "unread" } })
            );
            let data = response.data;
            setData(data);
        }
        setLoading(false);
    };

    const redirectTo = (notif: any) => {
        router.get(
            route("notification.redirect", {
                notif: notif.id,
                _query: {
                    open: notif.type,
                },
            })
        );

        if(!notif.viewed)
            setUnreadNotifications(-1)
    };

    const markAsReadNotification = (
        id: number,
        index: number,
        isViewed: boolean
    ) => {
        if (!isViewed) {
            setData({
                ...data,
                data: data.data.map((item, indx) =>
                    indx === index ? { ...item, viewed: 1 } : item
                ),
            });

            if(unreadNotifications > 0)
                setUnreadNotifications(-1)

            window.axios
                .get(route("notification.masrkRead", [id]))
                .catch((error) => {
                    setData({
                        ...data,
                        data: data.data.map((item, indx) =>
                            indx === index ? { ...item, viewed: 1 } : item
                        ),
                    });
                    console.log("error:" + error);
                });
        }
    };

    const deleteNotification = (index: number, dataRemoved: any) => {
        setRemovedData({ index: index, data: dataRemoved });
        const updatedData = [...data.data];
        updatedData.splice(index, 1);

        setData({ ...data, data: updatedData });
    };

    const undoNotification = () => {
        const updatedData = [...data.data];
        updatedData.splice(removedData.index, 0, removedData?.data);

        setData({ ...data, data: updatedData });

        setRemovedData({ index: 0, data: null });

        dismiss();

        toast({
            variant: "default",
            description: "Notification has been restored.",
        });
    };

    const loadMore = async () => {
        setLoadingMore(true);
        let response = await window.axios.get(
            route("notification.json", { _query: { filter: "unread" } })
        );
        let pagedData: PaginateData = response.data;
        let previousData = data.data;
        let newData = {
            ...pagedData,
            data: [...previousData, ...pagedData.data],
        };
        setLoadingMore(false);
        setData(newData);
    };

    useEffect(() => {
        if (!!removedData.data) {
            toast({
                variant: "default",
                description: "Notification has been deleted.",
                action: (
                    <Button
                        className="h-8 text-xs !mr-3"
                        variant={"secondary"}
                        onClick={() => undoNotification()}
                    >
                        <span>Undo</span>
                    </Button>
                ),
            });
        }
    }, [removedData.data]);

    return (
        <Authenticated
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight">
                    Notification
                </h2>
            }
        >
            <Head title="Notification" />

            <div className="mx-auto max-w-2xl mt-10">
                <div>
                    <Tabs
                        id="notifications"
                        active={activeTab ? "unread" : "all"}
                        className="w-fit"
                        tabs={[
                            { id: "all", label: "All" },
                            { id: "unread", label: "Unread" },
                        ]}
                        navigate={getData}
                    />
                </div>

                <div className="mt-5 space-y-1">
                    <DataList empty={data.data.length === 0} loading={loading}>
                        {data.data.map((notif, index) => (
                            <div className="relative group" key={index}>
                                <div
                                    className={cn(
                                        "notification",
                                        notif.viewed && "opacity-90"
                                    )}
                                    role="button"
                                    onClick={() => redirectTo(notif)}
                                >
                                    <div>
                                        <AvatarProfile
                                            src={notif.sender.avatar}
                                        />
                                    </div>
                                    <div>
                                        <div
                                            className={cn(
                                                notif.viewed
                                                    ? "font-normal"
                                                    : "font-medium",
                                                "text-sm"
                                            )}
                                        >
                                            <span
                                                className={cn("text-base",
                                                    !notif.view ?
                                                        "font-medium"
                                                        : "font-semibold"
                                                )}
                                            >
                                                {notif.sender.name}
                                            </span>
                                            {notif.message}
                                        </div>
                                        <div
                                            className={cn(
                                                !notif.viewed && "font-medium",
                                                "text-xs text-foreground"
                                            )}
                                        >
                                            {formatDistanceToNow(
                                                notif.created_at
                                            ).replace("about", "")}{" "}
                                            ago
                                        </div>
                                    </div>
                                </div>
                                <Menubar className="p-0 h-fit border-none ml-auto rounded-full absolute top-1/2 -translate-y-1/2 right-7 shadow">
                                    <MenubarMenu>
                                        <MenubarTrigger className="size-10 p-0 justify-center !cursor-pointer data-[state=open]:flex data-[state=close]:hidden group-hover:flex hidden">
                                            <Ellipsis className="size-5" />
                                        </MenubarTrigger>
                                        <MenubarContent align="end">
                                            <MenubarItem
                                                className="transition duration-200"
                                                onClick={() =>
                                                    markAsReadNotification(
                                                        notif.id,
                                                        index,
                                                        notif.viewed
                                                    )
                                                }
                                            >
                                                Mark as read
                                            </MenubarItem>
                                            <MenubarItem
                                                className="transition duration-200"
                                                onClick={() =>
                                                    deleteNotification(
                                                        index,
                                                        notif
                                                    )
                                                }
                                            >
                                                Delete notification
                                            </MenubarItem>
                                        </MenubarContent>
                                    </MenubarMenu>
                                </Menubar>

                                {!notif.viewed && (
                                    <div className="absolute top-1/2 -translate-y-1/2 right-2.5 bg-blue-500 size-2 rounded-full"></div>
                                )}
                            </div>
                        ))}
                    </DataList>
                </div>

                {data.total >= 50 && (
                    <div className="mt-5">
                        <Button
                            variant={"secondary"}
                            className="w-full before:hover:!bg-transparent before:hover:!opacity-0"
                            onClick={loadMore}
                        >
                            {loadingMore ? (
                                <div className="flex gap-2">
                                    <span className="loading loading-spinner loading-md"></span>
                                    <div>Loading...</div>
                                </div>
                            ) : (
                                <span>See more</span>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </Authenticated>
    );
}
