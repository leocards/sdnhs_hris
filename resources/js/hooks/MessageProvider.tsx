import { formatISO } from "date-fns";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

type USER = { id: number; name: string; avatar: string, messageId: number } | null;
type COVERSATIONTYPE = { id: number|null, sender: number, message: string, seen_at: string | null, created_at: string };
type MESSAGELISTTYPE = {
    id: number;
    sender_id: number;
    receiver_id: number;
    conversations: COVERSATIONTYPE;
    user: {id: number; name: string; avatar: string}
}
type ACTIVEUSERSTYPE = { id: number, name: string, active_at: string }
type CONVERSATION = Array<COVERSATIONTYPE>
type MESSAGELIST = Array<MESSAGELISTTYPE>
type ACTIVEUSERSLIST = Array<ACTIVEUSERSTYPE>

type MessageProviderState = {
    isAuth: boolean,
    setIsAuth: (isAuth: boolean) => void,

    user: USER;
    setUser: (user: USER, isReset?: boolean) => void;

    conversation: CONVERSATION;
    setConversation: (conversation: CONVERSATION, isFresh?: boolean) => void;

    loadingConversation: boolean;
    setLoadingConversation: (load: boolean) => void;

    messageList: MESSAGELIST;
    setMessageList: (list: MESSAGELIST, isAppendBeginning?: boolean, isFresh?: boolean) => void;

    setMessage: (userId: number, message: string, senderId: number, time: string, isSeen?: string | null) => void;

    setAsSeen: (messageId: number) => void;

    unreadmessages: number;
    setUnreadMessages: (unread: number) => void;

    searchConversation: number|null;
    setSearchConversation: (search: number|null) => void;

    activeUsers: ACTIVEUSERSLIST;
}

type ProviderProps = {
} & PropsWithChildren

const initialState : MessageProviderState = {
    isAuth: false,
    setIsAuth: () => null,

    user: null,
    setUser: () => null,

    conversation: [],
    setConversation: () => null,

    loadingConversation: false,
    setLoadingConversation: () => null,

    messageList: [],
    setMessageList: () => null,

    setMessage: () => null,

    setAsSeen: () => null,

    unreadmessages: 0,
    setUnreadMessages: () => null,

    searchConversation: null,
    setSearchConversation: () => null,

    activeUsers: [],
}

const MessageContextProvider = createContext<MessageProviderState>(initialState)

const MessageProvider: React.FC<ProviderProps> = ({ children }) => {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [user, setUser] = useState<USER>(null);
    const [conversation, setConversation] = useState<CONVERSATION>([]);
    const [messageList, setMessageList] = useState<MESSAGELIST>([]);
    const [loadingConversation, setLoadingConversation] = useState(false);
    const [unreadmessages, setUnreadMessages] = useState(0);
    const [searchConversation, setSearchConversation] = useState<number|null>(null);
    const [activeUsers, setActiveUsers] = useState<ACTIVEUSERSLIST>([])

    const setMessage = (userId: number, message: string, senderId: number, time: string, isSeen?: string | null) => {
        // Find the index of the user in the message list
        const messageIndex = messageList.findIndex((ml) => ml.user.id === userId);

        if (messageIndex !== -1) {
            // Create a copy of the messageList to avoid direct state mutation
            const updatedMessageList = [...messageList];

            // Update the message in the found user's conversation
            updatedMessageList[messageIndex].conversations.message = message;
            updatedMessageList[messageIndex].conversations.created_at = time;
            updatedMessageList[messageIndex].conversations.sender = senderId;
            updatedMessageList[messageIndex].conversations.seen_at = isSeen??null;

            // Remove the object and append it to the beginning
            const [removedObject] = updatedMessageList.splice(messageIndex, 1);
            updatedMessageList.unshift(removedObject);

            // Update the state with the new message list
            setMessageList(updatedMessageList);
        }
    };

    const setAsSeen = (messageId: number) => {
        let messageIndex = messageList.findIndex((ml) => ml.id === messageId)

        if(messageIndex !== -1) {
            const updatedMessageList = [...messageList];
            updatedMessageList[messageIndex].conversations.seen_at = formatISO(new Date())
            setMessageList(updatedMessageList);
        }
    }

    const value = {
        isAuth,
        setIsAuth,

        user,
        setUser: (user: USER, isReset?: boolean) => {
            if(isReset)
                setConversation([])

            setUser(user)
        },

        conversation,
        setConversation: (message: CONVERSATION, isFresh?: boolean) => {
            if(isFresh) {
                setConversation(message)
            } else
                setConversation(m => [...message, ...m])
        },

        loadingConversation,
        setLoadingConversation,

        messageList,
        setMessageList: (list: MESSAGELIST, isAppendBeginning?: boolean, isFresh?: boolean) => {
            if(isAppendBeginning)
                setMessageList([...list, ...messageList])
            else if(isFresh)
                setMessageList(list)
            else
                setMessageList([...messageList, ...list])
        },

        setMessage,

        setAsSeen,

        unreadmessages,
        setUnreadMessages: (unread: number) => {
            setUnreadMessages(unreadmessages + unread)
        },

        searchConversation,
        setSearchConversation,

        activeUsers,
    }

    useEffect(() => {
        if(isAuth)
            window.axios
                .get(route('messages.unreadmessages'))
                .then((response) => {
                    let unread = response.data

                    setUnreadMessages(unread.length)
                })
    }, [isAuth])

    useEffect(() => {
        if(isAuth)
            window.Echo.join('hris')
                .here((users: ACTIVEUSERSLIST) => {
                    console.log('here', users)
                    setActiveUsers(users)
                })
                .joining((user: ACTIVEUSERSTYPE) => {
                    console.log('joining', user)

                    let active_user = activeUsers.find((au) => au.id === user.id)

                    if(!active_user)
                        setActiveUsers([...activeUsers, user])
                })
                .leaving((user: ACTIVEUSERSTYPE) => {
                    console.log('leaving', user)
                    let active_users = [...activeUsers]

                    let active_user_index = active_users.findIndex((aui) => aui.id === user.id)

                    active_users.splice(active_user_index, 1)

                    setActiveUsers(active_users)
                })
                .error((error: ACTIVEUSERSTYPE) => {
                    console.log('error', error)
                })
    }, [isAuth])

    return (
        <MessageContextProvider.Provider value={value}>
            {children}
        </MessageContextProvider.Provider>
    )
}

const useMessage = () => {
    const context = useContext(MessageContextProvider);

    if (context === undefined)
        throw new Error("useMessage must be used within a MessageProvider");

    return context;
}

export {
    useMessage,
    MessageProvider,
    type MESSAGELISTTYPE,
    type USER,
}
