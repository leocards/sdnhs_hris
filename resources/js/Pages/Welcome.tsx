import Login from "./Auth/Login";
import { useState } from "react";
import Processing from "@/Components/Processing";

type expired = { expired: string };

export default function Welcome({ status }: { status?: string | expired }) {
    const [loading, setLoading] = useState(false)

    return (
        <>
            <div className="absolute hidden top-0 left-0 pointer-events-none -z-[1] w-screen h-screen object-cover bg-no-repeat [background-image:url(/storage/assets/background.png)] [background-size:cover]"></div>

            {loading ? (
                <div className="relative size-full">
                    <Processing is_processing={loading} className="text-foreground" classNameSpinner="bg-foreground" backdrop="" label="Please wait..." />
                </div>
            ) : (<div className="grid [@media(min-width:985px)]:grid-cols-5 min-h-screen">
                <div className="col-span-3 [@media(max-width:985px)]:hidden flex items-center p-8 bg-primary">
                    <div className="[@media(min-width:1030px)]:flex items-center mx-auto">
                        <img
                            src="/storage/assets/sdnhs-logo.png"
                            alt="sdnhs logo"
                            className="size-60 shrink-0"
                        />

                        <div className="[@media(min-width:1030px)]:pl-8 text-primary-foreground">
                            <div className="font-bold text-4xl">Welcome to</div>
                            <div className="font-black text-4xl uppercase">
                                Human Resource
                            </div>
                            <div className="font-black text-4xl uppercase">
                                Information System
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-2 flex items-center justify-center px-4 [@media(max-width:985px)]:bg-primary">
                    <Login status={status} onForgotPass={setLoading} />
                </div>
            </div>)}
        </>
    );
}
