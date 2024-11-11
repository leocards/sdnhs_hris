import Modal, { ModalProps } from "@/Components/Modal";
import React, { useState, useEffect, Fragment, useRef } from "react";
import { Button } from "@/Components/ui/button";
import { Printer } from "lucide-react";
import { SALNTYPE, User } from "@/types";
import SALNPage1 from "../Personnel/Partials/SALNPage1";
import SALNPage2 from "../Personnel/Partials/SALNPage2";
import SALNSeparatePage from "../Personnel/Partials/SALNSeparatePage";
import { useReactToPrint } from "react-to-print";

type Props = {
    user: User;
    saln: {
        id: number;
        user_id: number;
        asof: string;
        date: string;
        isjoint: "joint" | "separate" | "none";
        isApproved: number | null;
        created_at: string;
        updated_at: string;
        saln_liability_sum_balances: number;
        saln_assets_sum_cost: number;
    } | null;
} & ModalProps;

const ViewSaln: React.FC<Props> = ({ show, saln, user, onClose }) => {
    const [salnData, setSalnData] = useState<SALNTYPE | null>(null);

    const contentRef = useRef(null)
    const handlePrint = useReactToPrint({
        content: () => contentRef.current,
        bodyClass: "margin-0"
    })

    useEffect(() => {
        if (show && saln) {
            window.axios
                .get<SALNTYPE>(route("saln.json.view", [saln.id]))
                .then((response) => {
                    setSalnData(response.data);
                });
        }
    }, [show]);

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="5xl" center>
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <Button
                        variant="ghost"
                        onClick={handlePrint}
                        size={"icon"}
                        disabled={!saln?.isApproved}
                    >
                        <Printer className="size-5" />
                    </Button>

                    <Button
                        variant="secondary"
                        className="ml-auto px-6"
                        onClick={() => onClose(false)}
                    >
                        Close
                    </Button>
                </div>
                <div className="h-[31rem] overflow-y-auto rounded-scrollbar flex flex-col items-center p-4 bg-gray-200 rounded-md">
                    <div ref={contentRef} className="space-y-3 print:space-y-0">
                        {salnData?.pages.map(
                            (
                                {
                                    children,
                                    real,
                                    personal,
                                    liabilities,
                                    bifc,
                                    relatives,
                                    saln_totals,
                                },
                                index
                            ) =>
                                index === 0 ? (
                                    <Fragment key={index}>
                                        <SALNPage1
                                            page={{
                                                page: 1, totalPage: salnData?.pages.length + 1
                                            }}
                                            user={user}
                                            isjoint={saln?.isjoint}
                                            asof={saln?.asof || ""}
                                            spouse={salnData?.spouse}
                                            children={children}
                                            real={real}
                                            personal={personal}
                                            saln_totals={saln_totals}
                                        />
                                        <SALNPage2
                                            page={{
                                                page: 2, totalPage: salnData?.pages.length + 1
                                            }}
                                            user={user}
                                            spouse={salnData?.spouse}
                                            liabilities={liabilities}
                                            bifc={bifc}
                                            relatives={relatives}
                                            saln_totals={saln_totals}
                                            declarant={salnData?.declarant}
                                        />
                                    </Fragment>
                                ) : (
                                    <SALNSeparatePage
                                        page={{
                                            page: index + 2, totalPage: salnData?.pages.length + 1
                                        }}
                                        user={user}
                                        key={index}
                                        asof={saln?.asof || ""}
                                        real={real}
                                        personal={personal}
                                        bifc={bifc}
                                        relatives={relatives}
                                        saln_totals={saln_totals}
                                        liabilities={liabilities}
                                    />
                                )
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ViewSaln;
