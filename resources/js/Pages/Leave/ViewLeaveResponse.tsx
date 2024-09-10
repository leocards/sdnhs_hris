import LeaveStatus from "@/Components/LeaveStatus";
import Modal from "@/Components/Modal";
import { Button } from "@/Components/ui/button";

type Props = {
    show: boolean;
    onClose: CallableFunction;
    response: {
        hr: {
            reponse: "Approved" | "Pending" | "Rejected";
            message?: string;
        },
        principal: {
            reponse: "Approved" | "Pending" | "Rejected";
            message?: string;
        }
    };
}

const ViewLeaveResponse = ({ response, show, onClose }: Props) => {
    return (
        <Modal show={show} onClose={() => onClose(false)}>
            <div className="p-6">
                <div className="font-bold text-xl mb-6 px-1 pl-0">
                    Response
                </div>

                <div className="p-1.5 rounded-md border border-border">
                    <div className="font-semibold">Principal's response</div>
                    <div className="mt-3 flex gap-1">
                        <div className="font-medium opacity-80">Action: </div>
                        <LeaveStatus status={response.principal.reponse} />
                    </div>
                    <div className="grid sm:grid-cols-[auto,1fr] mt-1 gap-1">
                        <div className="font-medium opacity-80">Message: </div>
                        <div className="">
                            {response.principal.message??(response.principal.reponse === "Approved" ? "Your application has been approved." : "" )}
                        </div>
                    </div>
                </div>

                <div className="p-1.5 rounded-md border border-border mt-5">
                    <div className="font-semibold">HR's response</div>
                    <div className="mt-3 flex gap-1">
                        <div className="font-medium opacity-80">Action: </div>
                        <LeaveStatus status={response.hr.reponse} />
                    </div>
                    <div className="grid sm:grid-cols-[auto,1fr] mt-1 gap-1">
                        <div className="font-medium opacity-80">Message: </div>
                        <div className="">
                            {(response.hr.message)??(response.hr.reponse === "Approved" ? "Your application has been approved." : "" )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-7">
                    <Button variant="secondary" onClick={() => onClose(false)}>
                        <span>Close</span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ViewLeaveResponse;
