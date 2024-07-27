import { Link, Head } from "@inertiajs/react";
import Login from "./Auth/Login";

type expired = {expired: string}

export default function Welcome({ status }: { status?: string | expired }) {
    return (
        <>
            <div className="absolute hidden top-0 left-0 pointer-events-none -z-[1] w-screen h-screen object-cover bg-no-repeat [background-image:url(/storage/assets/background.png)] [background-size:cover]"></div>

            <div className="grid md:grid-cols-5 min-h-screen">
                <div className="col-span-3 max-md:hidden flex items-center p-8 bg-[#F9D930]">
                    <div className="flex items-center mx-auto">
                        <div className="h-[20rem] w-[12rem] overflow-hidden border-r-2 border-[#9F2516] flex items-center shrink-0 relative">
                            <div className="absolute top-0 left-3 h-80 w-80 bg-gradient-to-l from-[#BCA421] blur-xl " />
                            <div className="size-72 shrink-0 z-10 relative ml-5">
                                <img
                                    src="/storage/assets/sdnhs-logo.png"
                                    alt="sdnhs logo"
                                    className="size-72 shrink-0"
                                />
                            </div>
                        </div>

                        <div className="pl-8">
                            <div className="font-bold text-4xl">Welcome to</div>
                            <div className="font-black text-4xl uppercase">Southern Davao <br /> National High School</div>

                            <div className="my-4 h-1.5 bg-[#9F2516]" />

                            <div className="font-semibold text-2xl uppercase">Human Resource Information System</div>
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
