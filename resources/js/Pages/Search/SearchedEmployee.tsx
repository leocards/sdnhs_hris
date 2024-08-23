import Tabs from "@/Components/framer/Tabs";
import { AvatarProfile } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { MessageCircle, Undo2 } from "lucide-react";
import useWindowSize from "@/hooks/useWindowResize";
import { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { cn } from "@/lib/utils";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import pdsPDF from "@/pds.pdf";

type PagesType = { prev: number; current: number; next: number };

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const options = {
    cMapUrl: "/cmaps/",
    standardFontDataUrl: "/standard_fonts/",
};

const initialPages = {
    prev: 0,
    current: 1,
    next: 0,
};

export default function SearchedEmployee({
    auth,
    user,
}: PageProps & { user: any }) {
    const [activeTab, setActiveTab] = useState<string>("attendance");
    const { width } = useWindowSize();
    const [size, setSize] = useState<number>(900);
    const [numPages, setNumPages] = useState<number>();
    const [pages, setPages] = useState<PagesType>(initialPages);

    function onDocumentLoadSuccess({
        numPages: nextNumPages,
    }: PDFDocumentProxy): void {
        setNumPages(nextNumPages);
        if (nextNumPages > 1) {
            setPages((prev) => ({ ...prev, next: 2 }));
        }
    }

    useEffect(() => {
        if (width >= 1289) {
            setSize(900);
        } else if (width <= 1288 && width >= 1199) {
            setSize(800);
        } else if (width <= 1997 && width >= 1046) {
            setSize(650);
        } else if (width <= 1045 && width >= 1024) {
            setSize(450);
        } else if (width <= 1023 && width >= 810) {
            setSize(700);
        } else if (width <= 809 && width >= 598) {
            setSize(500);
        } else {
            setSize(350);
        }
    }, [width]);

    return (
        <Authenticated user={auth.user}>
            <div className="mb-8">
                <Button
                    className="gap-3 ml-auto"
                    variant="ghost"
                    onClick={() => router.get(route("general-search"))}
                >
                    <Undo2 className="size-4" />
                    <span>Back</span>
                </Button>
            </div>

            <div className="flex items-center gap-3">
                <AvatarProfile src={user.avatar} className="size-16" />
                <div>
                    <div className="flex items-center">
                        <Label className="w-28 flex items-center">
                            Name <span className="ml-auto mr-3">:</span>{" "}
                        </Label>
                        <div className="font-semibold text-lg">{`${user.first_name} ${user.middle_name??''} ${user.last_name}`}</div>
                    </div>
                    <div className="flex items-center">
                        <Label className="w-28 flex items-center">
                            Role <span className="ml-auto mr-3">:</span>{" "}
                        </Label>
                        <div>{user.role}</div>
                    </div>
                    <div className="flex items-center">
                        <Label className="w-28 flex items-center">
                            Position <span className="ml-auto mr-3">:</span>{" "}
                        </Label>
                        <div>{user.position}</div>
                    </div>
                </div>

                <Button className="gap-3 ml-auto" variant="ghost">
                    <MessageCircle className="size-4" />
                    <span>Message</span>
                </Button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-8">
                <div className="">
                    <div className="flex items-center">
                        <Label className="w-40 flex items-center">
                            Date of Birth{" "}
                            <span className="ml-auto mr-3">:</span>{" "}
                        </Label>
                        <div>{format(user.date_of_birth, "PPP")}</div>
                    </div>
                    <div className="flex items-center">
                        <Label className="w-40 flex items-center">
                            Sex <span className="ml-auto mr-3">:</span>{" "}
                        </Label>
                        <div>{user.sex}</div>
                    </div>
                    <div className="flex items-center">
                        <Label className="w-40 flex items-center">
                            Address <span className="ml-auto mr-3">:</span>{" "}
                        </Label>
                        <div>{user.address}</div>
                    </div>
                    <div className="flex items-center">
                        <Label className="w-40 flex items-center">
                            Email <span className="ml-auto mr-3">:</span>{" "}
                        </Label>
                        <div>{user.email}</div>
                    </div>
                    <div className="flex items-center">
                        <Label className="w-40 flex items-center">
                            Phone number <span className="ml-auto mr-3">:</span>{" "}
                        </Label>
                        <div>{user.phone_number}</div>
                    </div>
                </div>
                <div className="">
                    <div className="flex items-center">
                        <Label className="w-40 flex items-center">
                            Staff ID <span className="ml-auto mr-3">:</span>{" "}
                        </Label>
                        <div>SDNH-1234</div>
                    </div>
                    <div className="flex items-center">
                        <Label className="w-40 flex items-center">
                            Date hired <span className="ml-auto mr-3">:</span>{" "}
                        </Label>
                        <div>{format(new Date(), "PPP")}</div>
                    </div>
                    <div className="flex items-center">
                        <Label className="w-40 flex items-center">
                            Department <span className="ml-auto mr-3">:</span>{" "}
                        </Label>
                        <div>{user.department}</div>
                    </div>
                    <div className="flex items-center">
                        <Label className="w-40 flex items-center">
                            Credits <span className="ml-auto mr-3">:</span>{" "}
                        </Label>
                        <div>4</div>
                    </div>
                    <div className="flex items-center">
                        <Label className="w-40 flex items-center">
                            Leave <span className="ml-auto mr-3">:</span>{" "}
                        </Label>
                        <div>2</div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <Tabs
                    id="searched-view"
                    active={"attendance"}
                    navigate={setActiveTab}
                    tabs={[
                        { id: "attendance", label: "Attendance" },
                        { id: "certificates", label: "Certificates" },
                        { id: "PDS", label: "PDS" },
                    ]}
                    className="w-fit"
                />
            </div>

            <div className="mt-5">
                {activeTab === "attendance" && (
                    <div className="border rounded-lg divide-y">
                        <div className="grid grid-cols-3 px-2 py-3 bg-secondary font-medium">
                            <div>Year</div>
                            <div>Days present</div>
                            <div>Days absent</div>
                        </div>
                        <div className="grid grid-cols-3 px-2 py-3">
                            <div>2023</div>
                            <div>162 days</div>
                            <div>3 days</div>
                        </div>
                        <div className="grid grid-cols-3 px-2 py-3">
                            <div>2022</div>
                            <div>162 days</div>
                            <div>3 days</div>
                        </div>
                        <div className="grid grid-cols-3 px-2 py-3">
                            <div>2021</div>
                            <div>162 days</div>
                            <div>3 days</div>
                        </div>
                    </div>
                )}

                {activeTab === "certificates" && (
                    <div className="text-center text-foreground/60">
                        No certificates uploaded
                    </div>
                )}

                {activeTab === "PDS" && (
                    <div className={cn("mx-auto w-fit")}>
                        <Document
                            file={pdsPDF}
                            onLoadSuccess={onDocumentLoadSuccess}
                            options={options}
                            className={"flex flex-col space-y-6 h-fit"}
                            loading={
                                <div className="flex items-center gap-3 justify-center p-5">
                                    <span className="loading loading-spinner loading-md"></span>
                                    Loading
                                </div>
                            }
                        >
                            {Array.from(new Array(numPages), (_, index) => (
                                <PDFPages
                                    key={index}
                                    index={index}
                                    size={size}
                                    pdfpages={pages}
                                    totalPages={numPages}
                                    inView={setPages}
                                />
                            ))}
                        </Document>
                    </div>
                )}
            </div>

            <div className="mt-8 hidden">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]">
                    <div className="bg-secondary p-2 rounded-md">
                        <div className="line-clamp-1">Sick leave</div>
                        <div className="text-xs">
                            {format(new Date(), "PP")}
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}

const PDFPages = ({
    size,
    index,
    inView,
    pdfpages,
    totalPages,
}: {
    totalPages?: number;
    pdfpages: PagesType;
    index: number;
    size: number;
    inView?: (pageview: PagesType) => void;
}) => {
    const [isRendered, setIsRendered] = useState<boolean>(false);
    const page = index + 1;

    const setInView = (isView: boolean) => {
        // when page has been rendred and viewed in the screen
        if (isRendered && inView) {
            // check if there are more than 1 page
            if (totalPages && totalPages > 1) {
                // initialize next page number
                const next = totalPages > page + 1 ? page + 1 : 0;
                // check if the page is viewed on the screen
                if (isView) {
                    // check if the user scroll up by checking if the viewed page is equal to previous page
                    if (pdfpages.prev == page) {
                        inView({ current: page, prev: page - 1, next: next });
                    } else {
                        inView({ ...pdfpages, current: page });
                    }
                } else {
                    inView({ ...pdfpages, prev: page, next: next });
                }
            }
        }
    };

    return (
        <div className="relative shadow-[0px_1px_2px_0px_rgba(60,64,67,0.3),0px_2px_6px_2px_rgba(60,64,67,0.15)]">
            <Page
                key={`page_${page}`}
                pageNumber={page}
                width={size}
                onRenderSuccess={() => setIsRendered(true)}

            />
        </div>
    );
};
