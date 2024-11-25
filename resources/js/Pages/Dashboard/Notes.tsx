import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { ScrollArea } from "@/Components/ui/scroll-area";
import {
    CalendarDays,
    Ellipsis,
    NotebookPen,
    PencilLine,
    Plus,
    RefreshCw,
    Trash,
} from "lucide-react";
import NewNotes, { NOTETYPE } from "./NewNotes";
import { useEffect, useState } from "react";
import { getTimeFromNow } from "../Messages/TimeFromNow";
import ViewNotes from "./ViewNotes";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { cn } from "@/lib/utils";
import DeleteNoteConfirmation from "./DeleteNoteConfirmation";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";

const Notes = () => {
    const [showNewNote, setShowNewNote] = useState(false);
    const [notes, setNotes] = useState<Array<NOTETYPE>>([]);
    const [selectedNote, setSelectedNote] = useState<NOTETYPE | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshNotes, setRefreshNotes] = useState(true);
    const [viewNotes, setViewNotes] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    useEffect(() => {
        if (refreshNotes) {
            !loading && setLoading(true);

            window.axios
                .get(route("notes"))
                .then((response) => {
                    let notes = response.data;
                    setNotes(notes);
                })
                .finally(() => {
                    setLoading(false);
                    setRefreshNotes(false);
                });
        }
    }, [refreshNotes]);

    return (
        <div className="border rounded-md w-full lg:w-[20rem] xl:w-[28rem] grid grid-rows-[auto,1fr] shrink-0 overflow-hidden shadow-sm">
            <div className="border-b flex items-center h-14">
                <div className="font-medium ml-3">Notes</div>
                <div
                    role="button"
                    className="p-1 ml-2 opacity-55 hover:opacity-100 transition duration-150"
                    onClick={() => setRefreshNotes(true)}
                >
                    <RefreshCw className="size-4" />
                </div>
                <Button
                    variant={"outline"}
                    className="h-8 w-32 ml-auto mr-2 shadow gap-2"
                    onClick={() => setShowNewNote(true)}
                >
                    <Plus className="size-4" />
                    <span>Add note</span>
                </Button>
            </div>
            <ScrollArea>
                <div className="p-1.5 space-y-1.5 ">
                    {loading && (
                        <div className="w-fit h-fit mx-auto my-14 flex flex-col items-center gap-2">
                            <span className="loading loading-spinner loading-md"></span>
                            <div>Loading...</div>
                        </div>
                    )}

                    {!loading &&
                        notes.map((note, index) => (
                            <div
                                key={index}
                                className="relative border hover:border-primary/20 transition duration-150 rounded-md shadow-sm hover:shadow-md min-h-20"
                            >
                                <div className="flex items-center gap-3 absolute top-0.5 right-1 z-1">
                                    <div className="text-xs ml-auto w-fit">
                                        {getTimeFromNow(note.updated_at)}
                                    </div>
                                    <Popover>
                                        <PopoverButton
                                            className={cn(
                                                "h-7 w-8 flex items-center justify-center rounded relative outline-none",
                                                "transition duration-150 group [&>*]:z-10",
                                                "before:bg-accent before:w-full before:h-full before:absolute before:rounded-[inherit]",
                                                "before:scale-[.45] before:hover:scale-100 before:trasition before:duration-200 before:opacity-0 before:hover:opacity-100",
                                                "data-[active]:before:!bg-accent data-[active]:before:!opacity-100 data-[active]:before:!scale-100"
                                            )}
                                        >
                                            <Ellipsis className="size-4" />
                                        </PopoverButton>
                                        <PopoverPanel
                                            anchor="bottom end"
                                            className={cn(
                                                "shadow-md min-w-32 p-1 bg-background ring-1 ring-secondary rounded-md space-y-1 mt-1"
                                            )}
                                        >
                                            <div>
                                                <Button
                                                    variant={"ghost"}
                                                    className="h-8 w-full !justify-start p-0 !rounded-sm"
                                                    onClick={() => {
                                                        setSelectedNote(note);
                                                        setShowNewNote(true);
                                                    }}
                                                >
                                                    <PencilLine className="size-4 ml-2 mr-4" />
                                                    <span>Edit</span>
                                                </Button>
                                            </div>
                                            <div>
                                                <Button
                                                    variant={"ghost"}
                                                    className="h-8 w-full !justify-start p-0 !rounded-sm !text-red-500 hover:before:!bg-red-50"
                                                    onClick={() => {
                                                        setSelectedNote(note);
                                                        setShowDeleteConfirmation(true)
                                                    }}
                                                >
                                                    <Trash className="size-4 ml-2 mr-4" />
                                                    <span>Delete</span>
                                                </Button>
                                            </div>
                                        </PopoverPanel>
                                    </Popover>
                                </div>
                                <div
                                    role="button"
                                    className="p-2"
                                    onClick={() => {
                                        setSelectedNote(note);
                                        setViewNotes(true);
                                    }}
                                >
                                    <Label className="line-clamp-1 mt-3.5 pointer-events-none">
                                        {note.title}
                                    </Label>
                                    <div className="line-clamp-3 mt-2.5 text-foreground/70 text-sm pointer-events-none">
                                        {note.notes}
                                    </div>

                                    {note.reminder && <div className="border-t mt-2">
                                        <Badge className="py-1 items-center flex w-fit gap-2 mt-1.5 rounded-md">
                                            <CalendarDays className="size-3.5" strokeWidth={2.5} />
                                            <div className="leading-3">{format(note.reminder, "PP")}</div>
                                        </Badge>
                                    </div>}
                                </div>
                            </div>
                        ))}

                    {!loading && notes.length === 0 && (
                        <div className="mx-auto w-full grow mt-28 font-medium flex flex-col items-center">
                            <NotebookPen className="size-10 text-gray-400" />
                            <div className="opacity-60">Create your first note</div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <NewNotes
                show={showNewNote}
                onClose={() => {
                    setShowNewNote(false)
                    setSelectedNote(null)
                }}
                note={selectedNote}
                onSuccess={(data, isUpdate) => {
                    if (!isUpdate) {
                        setNotes([data, ...notes]);
                    } else {
                        setNotes([
                            data,
                            ...notes.filter(
                                ({ id }) => id !== selectedNote?.id
                            ),
                        ]);
                        setSelectedNote(null);
                    }
                }}
            />

            <ViewNotes
                show={viewNotes}
                note={selectedNote}
                onClose={() => {
                    setTimeout(() => setSelectedNote(null), 200)
                    setViewNotes(false);
                }}
            />

            <DeleteNoteConfirmation
                note={selectedNote}
                show={showDeleteConfirmation}
                onClose={() => {
                    setTimeout(() => setSelectedNote(null), 200)
                    setShowDeleteConfirmation(false)
                }}
                onDelete={(note) => {
                    setNotes([
                        ...notes.filter(({ id }) => id !== note.id)
                    ])
                }}
            />
        </div>
    );
};

export default Notes;
