import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useMessage } from "@/hooks/MessageProvider";
import { User } from "@/types";

type Props = {
};

const PDFConversation = forwardRef<HTMLDivElement, Props>(({ }, ref) => {
    const { user, conversation } =
        useMessage();

    return (
        <div ref={ref} className="w-[8.3in] shrink-0 print:scale-90 my-3">
            <div className="uppercase font-medium text-center border-b border-black pb-3 mb-3">CONVERSATION WITH {user?.name}</div>
            <table className="table [&>tbody>tr]:border-none">
                <tbody>
                    {conversation.map((convo, index) => (
                        convo.sender === user?.id ? (
                            <tr key={index} className="[&>td]:py-1.5">
                                <td className="w-40 text-[10pt] font-medium align-bottom">{user?.name}</td>
                                <td className=""><div className="p-2 px-3 rounded-md bg-gray-200 w-fit max-w-96 whitespace-pre-line break-words">{convo.message}</div></td>
                                <td className="w-40 text-[10pt] font-medium align-bottom"></td>
                            </tr>
                        ) : (
                            <tr key={index} className="[&>td]:py-1.5">
                                <td className="w-40 text-[10pt] font-medium align-bottom"></td>
                                <td className=""><div className="ml-auto p-2 px-3 rounded-3xl bg-blue-500 text-white w-fit max-w-96 whitespace-pre-line break-words">{convo.message}</div></td>
                                <td className="w-40 text-[10pt] font-medium align-bottom">You</td>
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
        </div>
    );
});

export default PDFConversation;
