import { Link, Head } from "@inertiajs/react";
import Login from "./Auth/Login";
import { useEffect } from "react";

type expired = { expired: string };

export default function Welcome({ status }: { status?: string | expired }) {
    useEffect(() => {
        console.log(status)
    }, [status])
    return (
        <>
            <div className="absolute hidden top-0 left-0 pointer-events-none -z-[1] w-screen h-screen object-cover bg-no-repeat [background-image:url(/storage/assets/background.png)] [background-size:cover]"></div>

            <div className="grid md:grid-cols-5 min-h-screen">
                <div className="col-span-3 max-md:hidden flex items-center p-8 bg-yellow-700 [#C74375]">
                    <div className="flex items-center mx-auto">
                        <img
                            src="/storage/assets/sdnhs-logo.png"
                            alt="sdnhs logo"
                            className="size-60 shrink-0"
                        />

                        <div className="pl-8 text-yellow-100">
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
                <div className="col-span-2 flex items-center justify-center">
                    <Login status={status} />
                </div>
            </div>
        </>
    );
}
