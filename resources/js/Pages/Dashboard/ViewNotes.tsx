import Modal, { ModalProps } from "@/Components/Modal";
import { Button } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { NOTETYPE } from "./NewNotes";
import { format } from "date-fns";
import { Badge } from "@/Components/ui/badge";
import { CalendarDays } from "lucide-react";

type Props = {
    note: NOTETYPE | null;
} & ModalProps;

const ViewNotes: React.FC<Props> = ({ show, note, onClose }) => {
    return (
        <Modal show={show} onClose={() => onClose(false)} center maxWidth="md">
            <div className="p-6">
                <div className="border-b pb-4">
                    <div className="text-lg font-medium leading-5">
                        {note?.title}
                    </div>
                </div>

                {note?.reminder && (
                    <div className="border-b pb-2">
                        <Badge className="py-1 items-center flex w-fit gap-2 mt-1.5 rounded-md">
                            <CalendarDays
                                className="size-3.5"
                                strokeWidth={2.5}
                            />
                            <div className="leading-3">
                                {format(note.reminder, "PP")}
                            </div>
                        </Badge>
                    </div>
                )}

                <ScrollArea className="h-80 mt-5">
                    <div className="whitespace-pre break-words">
                        {note?.notes}
                    </div>
                </ScrollArea>

                <div className="mt-5 w-fit ml-auto">
                    <Button
                        variant={"secondary"}
                        className="px-8"
                        onClick={() => onClose(false)}
                    >
                        <span>Close</span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ViewNotes;
