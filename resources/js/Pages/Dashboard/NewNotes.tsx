import Modal, { ModalProps } from "@/Components/Modal";
import Processing from "@/Components/Processing";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { useEffect, useState } from "react";
import { z } from "zod";
import { requiredError } from "../types";
import { useForm as useReactForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/Components/ui/form";
import { cn } from "@/lib/utils";
import { AlarmClock, CalendarDays } from "lucide-react";
import { CalendarInput } from "../Profile/Partials/C1/FamilyBackground";

const NOTESSCHEMA = z.object({
    title: z.string().min(1, requiredError("title")),
    notes: z.string().min(1, requiredError("notes")),
    reminder: z.date().nullable().optional(),
});

type IFormNotes = z.infer<typeof NOTESSCHEMA>;

export type NOTETYPE = {
    id: number | null;
    title: string;
    notes: string;
    reminder: string;
    updated_at: string;
};

type Props = {
    note: NOTETYPE | null;
    onSuccess: (newNote: NOTETYPE, isUpdate: boolean) => void;
} & ModalProps;

const NewNotes: React.FC<Props> = ({ show, note, onClose, onSuccess }) => {
    const [processing, setProcessing] = useState(false);
    const form = useReactForm<IFormNotes>({
        resolver: zodResolver(NOTESSCHEMA),
        defaultValues: {
            title: "",
            notes: "",
            reminder: null,
        },
    });

    const { toast } = useToast();

    const onFormSubmit = (formDate: IFormNotes) => {
        setProcessing(true);
        window.axios
            .post(route("notes.save", [note?.id]), formDate)
            .then((response) => {
                let data = response.data;
                let responseStatus = "Note successfully ";

                if (!note) {
                    onSuccess(data, false);
                    responseStatus += "created.";
                } else {
                    onSuccess(data, true);
                    responseStatus += "updated";
                }

                toast({
                    variant: "success",
                    description: responseStatus,
                });

                onClose(false);
            })
            .finally(() => {
                setProcessing(false);
                form.reset();
            });
    };

    useEffect(() => {
        if (show && note) {
            form.setValue("title", note.title, {
                shouldDirty: true,
                shouldTouch: true,
            });
            form.setValue("notes", note.notes, {
                shouldDirty: true,
                shouldTouch: true,
            });
            form.setValue(
                "reminder",
                note.reminder ? new Date(note.reminder) : null,
                {
                    shouldDirty: true,
                    shouldTouch: true,
                }
            );
        }
    }, [show]);

    return (
        <Modal
            show={show}
            onClose={() => onClose(false)}
            center
            closeable={false}
        >
            {processing ? (
                <Processing is_processing={processing} backdrop="" />
            ) : (
                <div className="p-6 pt-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onFormSubmit)}>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div
                                                className={cn(
                                                    "pb-1 border-b focus-within:border-primary/50 transition duration-150",
                                                    fieldState.error &&
                                                        "!border-red-500"
                                                )}
                                            >
                                                <Input
                                                    className="!ring-0 !border-none text-lg font-medium px-0"
                                                    placeholder="Title"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                className="max-h-80 mt-4 rounded-scrollbar min-h-40 aria-[invalid=true]:ring-red-500 aria-[invalid=true]:border-red-500"
                                                placeholder="Aa"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center w-fit border mt-3 rounded-md overflow-hidden gap-2">
                                <CalendarDays className="size-4 mx-3 mr-2" />
                                <CalendarInput
                                    form={form}
                                    name="reminder"
                                    className="w-52 rounded-none border-y-0 border-r-0 !ring-0"
                                    withLabel={false}
                                    placeholder="Set date reminder"
                                    align="center"
                                />
                            </div>

                            <div className="mt-7 flex items-center">
                                <Button
                                    className="px-6 ml-auto"
                                    variant={"secondary"}
                                    onClick={() => onClose(false)}
                                    type="button"
                                >
                                    Close
                                </Button>

                                <Button className="px-10 ml-4">Save</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            )}
        </Modal>
    );
};

export default NewNotes;
