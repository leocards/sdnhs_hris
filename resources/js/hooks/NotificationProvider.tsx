import { PaginateData } from "@/types";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
type NOTIFICATIONTYPE = {
    id: number;
    user_id: number;
    from_user_id: number;
    message: string;
    type: string;
    go_to_link: string;
    viewed: boolean;
    created_at: string;
    updated_at: string;
    sender: {
        id: number;
        first_name: string;
        last_name: string;
        middle_name: string;
        avatar: string;
        name: string;
        employee_list_name: string;
    };
}
type NOTIFICATIONLIST = Array<NOTIFICATIONTYPE>;
type PAGINATEDNOTIFICATION = Omit<PaginateData, 'data'> & {
    data: NOTIFICATIONLIST
}

type NotificationProviderState = {
    isAuth: boolean,
    setIsAuthNotification: (isAuth: boolean) => void,

    unreadNotifications: number;
    setUnreadNotifications: (unread: number) => void
}

type ProviderProps = {
} & PropsWithChildren

const initialState: NotificationProviderState = {
    isAuth: false,
    setIsAuthNotification: () => null,

    unreadNotifications: 0,
    setUnreadNotifications: () => {},
}

const NotificationContextProvider = createContext<NotificationProviderState>(initialState)

const NotificationProvider: React.FC<ProviderProps> = ({ children }) => {
    const [isAuth, setIsAuthNotification] = useState<boolean>(false);
    // const [notifications, setNotifications] = useState<PAGINATEDNOTIFICATION | null>()
    const [unreadNotifications, setUnreadNotifications] = useState(0)

    const value = {
        isAuth,
        setIsAuthNotification,

        unreadNotifications,
        setUnreadNotifications: (unread: number) => {
            setUnreadNotifications(unreadNotifications + unread)
        },
    }

    useEffect(() => {
        if(isAuth)
            window.axios
                .get(route('notification.unreads'))
                .then((response) => {
                    let unread = response.data

                    setUnreadNotifications(unread)
                })

        if(isAuth) {
            
        }
    }, [isAuth])

    return (
        <NotificationContextProvider.Provider value={value}>
            {children}
        </NotificationContextProvider.Provider>
    )
}

const useNotification = () => {
    const context = useContext(NotificationContextProvider);

    if (context === undefined)
        throw new Error("useNotification must be used within a NotificationProvider");

    return context;
}

export {
    NotificationProvider,
    useNotification,
    type NOTIFICATIONLIST,
    type NOTIFICATIONTYPE,
}
