import {
    useState,
    PropsWithChildren,
    ReactNode,
    useEffect,
    Fragment,
} from "react";
import {
    ChevronUp,
    LogOut,
    Settings,
    UserRound,
    ChevronDown,
    PanelLeft,
    Plus,
    SquarePen,
} from "lucide-react";
import {
    CloseButton,
    Popover,
    PopoverButton,
    PopoverPanel,
} from "@headlessui/react";
import { PageProps, ROLES,  User } from "@/types";
import { cn } from "@/lib/utils";
import { AvatarProfile } from "@/Components/ui/avatar";
import { router, usePage } from "@inertiajs/react";
import { Toaster } from "@/Components/ui/toaster";
import { useToast } from "@/Components/ui/use-toast";
import { createPortal } from "react-dom";
import { Button } from "@/Components/ui/button";
import { useDebouncedFunction } from "@/hooks/useDebounce";
import Loading from "@/Components/page-loading/Loading";
import { MESSAGELISTTYPE, useMessage } from "@/hooks/MessageProvider";
import messageNotification from "../assets/sound/messageNotification.mp3";
import newNotificationSound from "../assets/sound/newNotification.mp3";
import { formatISO } from "date-fns";
import {
    NOTIFICATIONTYPE,
    useNotification,
} from "@/hooks/NotificationProvider";
import SideNavigation from "@/Components/SideNavigation";
import { SidebarProvider, useSidebar } from "@/Components/ui/sidebar";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/Components/ui/menubar";
import NewSchoolYear from "@/Pages/Dashboard/NewSchoolYear";
import Processing from "@/Components/Processing";

export default function Authenticated({
    userAuth,
    header,
    children,
}: PropsWithChildren<{ userAuth: User; header?: ReactNode }>) {
    const {
        props: { auth, message },
        url,
    } = usePage<any>();
    const { toast } = useToast();
    const {
        user,
        setUser,
        setConversation,
        messageList,
        setMessageList,
        setMessage,
        setUnreadMessages,
        setIsAuth,
    } = useMessage();
    const [newMessage, setNewMessage] = useState<MESSAGELISTTYPE>();

    const { setIsAuthNotification, setUnreadNotifications } = useNotification();
    const [newNotification, setNewNotification] = useState<NOTIFICATIONTYPE>();

    const [showScrollUp, setShowScrollUp] = useState<boolean>(false);

    const messageNotificationVolume = localStorage.getItem("m-sound-volume");
    const newNotificationVolume = localStorage.getItem("n-sound-volume");

    const scrollToTop = () => {
        document.body.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        setShowScrollUp(false);
    };

    // scroll to top of the page
    const onScroll = useDebouncedFunction(() => {
        if (document.body.scrollTop >= 769) {
            setShowScrollUp(true);
        } else {
            setShowScrollUp(false);
        }
    }, 500);

    // add the onScroll method to the lsitener
    useEffect(() => {
        document.body.addEventListener("scroll", onScroll);

        return () => {
            document.removeEventListener("scroll", onScroll);
        };
    }, []);

    // dispalys message toaster
    useEffect(() => {
        if (message) {
            toast({
                description: message?.toString(),
            });
        }
    }, [message]);

    useEffect(() => {
        // get the messages list and add it to the message list
        if (messageList.length === 0) {
            window.axios
                .get(route("messages.list"))
                .then((response) => {
                    let messages = response.data;
                    setMessageList(messages);
                })
                .catch((error) => console.log(error));
        }

        // receive new message
        window.Echo.private(`message.${auth.user.id}`).listen(
            "SendMessageEvent",
            (message: MESSAGELISTTYPE) => {
                setNewMessage(message);
            }
        );

        // receive new notification
        window.Echo.private(`notification.${auth.user.id}`).listen(
            "SendNotificationEvent",
            (notification: { notification: NOTIFICATIONTYPE }) => {
                setNewNotification(notification.notification);
            }
        );

        setIsAuth(!!auth.user);
        setIsAuthNotification(!!auth.user);
    }, []);

    // when new message arrives make sound notification, and add new message on the list
    useEffect(() => {
        if (newMessage) {
            if (!document.hasFocus() || !url.startsWith("/messages")) {
                const sound = new Audio(messageNotification);
                sound.volume = messageNotificationVolume
                    ? parseFloat(messageNotificationVolume)
                    : 1;
                sound.play().catch(() => {});
            }

            let new_message = newMessage;

            // check if the user opened the message conversation
            // or if in the current messages page
            if (user && url.startsWith("/messages")) {
                // check if the open conversation opened is the sender of new message
                if (
                    (new_message.sender_id == user.id &&
                        auth.user.id == new_message.receiver_id) ||
                    (new_message.receiver_id == user.id &&
                        auth.user.id == new_message.sender_id)
                ) {
                    // append new message
                    setConversation([new_message.conversations]);
                    //set the message as seen
                    window.axios.post(route("message.seen", [new_message.id]));
                }

                if (!user.messageId) {
                    // set the message id if the user is a new conversation
                    setUser({ ...user, messageId: new_message.id });
                }

                // add count to unread messages if the opened conversation is not the sender
                if (!user.messageId || user.messageId != new_message.id) {
                    let m = messageList.find((ml) => ml.id === new_message.id);

                    // increment if the the message has been seen already
                    if (m?.conversations.seen_at) setUnreadMessages(1);
                }
            } else {
                // increment unread messages if the conversation box is not opened
                if (messageList.length > 0) {
                    let m = messageList.find((ml) => ml.id === new_message.id);

                    // increment if the the message has been seen already
                    if (m?.conversations.seen_at) setUnreadMessages(1);
                } /*  else {
                    // increament unread messages for new message in the list
                    setUnreadMessages(1);
                } */
            }

            // move the message item to the top for new messages
            if (messageList.length > 0) {
                // find the index of message of the new message
                let existMessage = messageList.findIndex(
                    (ml) => ml.user.id === new_message.sender_id
                );

                // move the message to the top
                if (existMessage || existMessage === 0) {
                    setMessage(
                        new_message.sender_id,
                        new_message.conversations.message,
                        new_message.sender_id,
                        new_message.conversations.created_at,
                        // set message as unread
                        user && user.messageId == new_message.id
                            ? formatISO(new Date())
                            : null
                    );
                } else {
                    // add new messages to the top
                    setMessageList([new_message]);
                }
            } else {
                // add new messages to the top

                setMessageList([new_message]);
            }
        }
    }, [newMessage]);

    // when new notification arrives make sound notification
    useEffect(() => {
        if (newNotification) {
            toast({
                variant: "default",
                description: "You have new notification",
            });

            // notifiy sound when tab is not focused or user not in notification page
            if (!document.hasFocus() || !url.startsWith("/notification")) {
                const sound = new Audio(newNotificationSound);
                sound.volume = newNotificationVolume
                    ? parseFloat(newNotificationVolume)
                    : 1;
                sound.play().catch(() => {});

                // increment unread notification count when user not in notificatin page or not in the current tab
                setUnreadNotifications(1);
            }

            // setNotifications([newNotification]);
        }
    }, [newNotification]);

    return (
        <SidebarProvider>
            <SideNavigation role={auth.user.role} />

            <main className="grow ring-inset z-0 flex-col relative overflow-hidden flex">
                <div className="h-12 flex items-center px-4 mb-5 sticky top-0 z-30 bg-background">
                    <ToggleSideBarButton />

                    <SchoolYearButton role={userAuth.role} />

                    <HeaderNavigation user={userAuth} iconSizes="size-8" />
                </div>

                <div className="pt-2 p-6 grow ring-inset flex flex-col">
                    <Loading>
                        <header className="text-secondary-foreground">
                            {header}
                        </header>
                        {children}
                    </Loading>
                </div>

                {createPortal(<Toaster />, document.body)}

                {showScrollUp && (
                    <div className="fixed z-[100] bottom-4 right-5">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={scrollToTop}
                            className="shadow-md"
                        >
                            <ChevronUp className="size-6" />
                        </Button>
                    </div>
                )}

            </main>
        </SidebarProvider>
    );
}

export const ToggleSideBarButton = (props: { className?: string }) => {
    const {
        toggleSidebar,
    } = useSidebar();

    return (
        <Button
            className={cn("size-9 shadow-sm", props.className)}
            size={"icon"}
            variant={"outline"}
            onClick={toggleSidebar}
        >
            <PanelLeft className="size-4" />
        </Button>
    );
};

const HeaderNavigation: React.FC<{ user: User; iconSizes?: string }> = ({
    user,
    iconSizes = "size-7",
}) => {
    const { url } = usePage();
    const { unreadmessages } = useMessage();
    const { unreadNotifications } = useNotification();
    const [isSigningOut, setIsSigningOut] = useState(false)

    return (
        <nav className="flex flex-1 items-center gap-4 max-lg:py-2.5">
            <div
                aria-hidden="true"
                className="-ml-4 flex justify-end grow gap-3"
            >
                <button
                    className={cn(
                        "size-9 relative flex items-center justify-center rounded-md",
                        url.startsWith("/notification")
                            ? "bg-neutral-content dark:bg-secondary"
                            : "hover:bg-secondary transition duration-200"
                    )}
                    onClick={() => router.get(route("notification"))}
                >
                    {!url.startsWith("/notification") ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                    {unreadNotifications > 0 && (
                        <div className="px-0.5 pt-px text-white bg-red-600 absolute text-[10px] -top-0 -right-0.5 font-medium rounded min-w-4 text-center">
                            {unreadNotifications}
                        </div>
                    )}
                </button>

                <button
                    className={cn(
                        "size-9 relative flex items-center justify-center rounded-md",
                        url.startsWith("/messages")
                            ? "bg-neutral-content dark:bg-secondary"
                            : "hover:bg-secondary transition duration-200"
                    )}
                    onClick={() => router.get(route("messages"))}
                >
                    {!url.startsWith("/messages") ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                    {unreadmessages > 0 && (
                        <div className="px-0.5 pt-px text-white bg-red-600 absolute text-[10px] -top-0 -right-0.5 font-medium rounded min-w-4 text-center">
                            {unreadmessages > 9 ? "9+" : unreadmessages}
                        </div>
                    )}
                </button>
            </div>
            <div className="flex items-center gap-3">
                <Popover className="group">
                    <PopoverButton
                        className={cn(
                            "grid grid-cols-[auto,1fr,auto] items-center p-1 w-full rounded-lg relative focus:outline-none",
                            "transition duration-150 [&>*]:z-10",
                            "before:w-full before:h-full before:absolute before:left-0 before:rounded-[inherit] before:bg-zinc-200 dark:before:!bg-white/10",
                            "before:scale-[.45] before:hover:scale-100 before:trasition before:duration-200 before:opacity-0 before:hover:opacity-100",
                            "group-data-[open]:before:scale-100 group-data-[open]:before:opacity-100"
                        )}
                    >
                        <AvatarProfile
                            src={user.avatar}
                            className={cn("rounded-md", iconSizes)}
                        />
                        <div className="text-sm flex items-center ml-2 mr-1 max-lg:hidden text-left">
                            <div>
                                <div>{`${user.first_name} ${user.last_name}`}</div>
                                <div className="text-xs">{`SDNHS-${user.position??user.role}`}</div>
                            </div>
                            <div className="h-fit ml-2">
                                <ChevronDown className="size-4" />
                            </div>
                        </div>
                    </PopoverButton>
                    <PopoverPanel
                        anchor={"bottom end"}
                        transition
                        className="border w-40 rounded-lg bg-background dark:bg-secondary [--anchor-gap:var(--spacing-10)] z-30 shadow-md dark:shadow-3xl min-w-[11rem] mt-1"
                    >
                        <ul className="p-1 text-sm font-medium [&>li]:flex [&>li]:items-center [&>li]:gap-4 [&>li]:pl-3 [&>li]:py-2 [&>li]:cursor-default [&>li]:rounded-md space-y-1">
                            <CloseButton
                                as="li"
                                className="hover:bg-primary hover:text-primary-foreground"
                                onClick={() =>
                                    router.get(route("profile.profile"))
                                }
                            >
                                <UserRound
                                    className="size-4"
                                    strokeWidth={2.4}
                                />{" "}
                                My account
                            </CloseButton>
                            <CloseButton
                                as="li"
                                className="hover:bg-primary hover:text-primary-foreground"
                                onClick={() =>
                                    router.get(route("profile.settings"))
                                }
                            >
                                <Settings
                                    className="size-4"
                                    strokeWidth={2.4}
                                />{" "}
                                Settings
                            </CloseButton>
                            <hr className="borde-t dark:border-white/10" />
                            <CloseButton
                                as="li"
                                className="hover:bg-primary hover:text-primary-foreground"
                                onClick={() => {
                                    setIsSigningOut(true)
                                    router.post(route("logout"), {}, {
                                        onFinish: () => setIsSigningOut(false)
                                    })
                                }}
                            >
                                <LogOut className="size-4" strokeWidth={2.4} />{" "}
                                Sign out
                            </CloseButton>
                        </ul>
                    </PopoverPanel>
                </Popover>
            </div>

            <Processing is_processing={isSigningOut} />
        </nav>
    );
};

const SchoolYearButton = (props: { role: ROLES }) => {
    const { props: { sy } } = usePage<PageProps>()
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [showSchoolYear, setShowSchoolYear] = useState<boolean>(false);

    return (
        <>
            {props.role == "HR" ? (
                <Fragment>
                    <Menubar className="p-0 overflow-hidden h-9 ml-3 shadow-sm bg-background">
                        <MenubarMenu>
                            <MenubarTrigger
                                className="h-full items-center text-sm cursor-pointer disabled:pointer-events-none"
                            >
                                {!sy ? (
                                    <div className="flex items-center gap-2">
                                        Click to add SY
                                    </div>
                                ) : (
                                    <span>SY {sy?.sy}</span>
                                )}
                            </MenubarTrigger>
                            <MenubarContent className="text-sm">
                                <MenubarItem
                                    className="cursor-pointer gap-3"
                                    onClick={() => {
                                        setShowSchoolYear(true);
                                    }}
                                >
                                    <Plus className="size-4" />
                                    <span>New School Year</span>
                                </MenubarItem>
                                <MenubarItem
                                    className="cursor-pointer gap-3"
                                    onClick={() => {
                                        if(sy) {
                                            setIsEdit(true);
                                            setShowSchoolYear(true);
                                        }
                                    }}
                                    disabled={!sy}
                                >
                                    <SquarePen className="size-4" />
                                    <span>Edit School Year</span>
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>

                    <NewSchoolYear
                        currentSy={sy}
                        isEdit={isEdit}
                        show={showSchoolYear}
                        onClose={() => {
                            setIsEdit(false);
                            setShowSchoolYear(false);
                        }}
                    />
                </Fragment>
            ) : (
                <div className="h-9 px-2 border border-border shadow-sm ml-3 rounded-md flex items-center overflow-hidden text-sm font-medium">
                    {!sy ? (
                        <div className="flex items-center gap-2">
                            Click to add SY
                        </div>
                    ) : (
                        <span>SY {sy?.sy}</span>
                    )}
                </div>
            )}
        </>
    );
};
