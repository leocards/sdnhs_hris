import Modal, { ModalProps } from "@/Components/Modal";
import Processing from "@/Components/Processing";
import {
    SelectOption,
    SelectOptionContent,
    SelectOptionItem,
    SelectOptionTrigger,
} from "@/Components/SelectOption";
import { Button } from "@/Components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { useToast } from "@/Components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm as useReact } from "react-hook-form";
import { z } from "zod";

const SCHOOLYEARSCHEMA = z.object({
    sy: z.string().min(1, "The School Year field is rquired."),
});

type IFormSY = z.infer<typeof SCHOOLYEARSCHEMA>;

type Props = {
    currentSY: string;
} & ModalProps;

function generateSchoolYears(startYear: number): string[] {
    const schoolYears: string[] = [];
    const endYear = new Date().getFullYear() - 6

    for (let year = startYear; year > endYear; year--) {
        schoolYears.push(`${year-1}-${year}`);
    }

    return schoolYears;
}

const NewSchoolYear: React.FC<Props> = ({ show, currentSY, onClose }) => {
    const form = useReact<IFormSY>({
        resolver: zodResolver(SCHOOLYEARSCHEMA),
        defaultValues: {
            sy: currentSY??"",
        },
    });

    const { setData, post, processing, reset } = useForm<IFormSY>();
    const [setSubmit, setIsSubmit] = useState(false);
    const { toast } = useToast();

    const onSubmitForm = (formData: IFormSY) => {
        if(formData.sy == currentSY) {
            toast({
                variant: "default",
                description: "No changes made"
            })
            onClose(false)
        } else {
            setIsSubmit(true);
            setData(formData);
        }
    };

    useEffect(() => {
        if (setSubmit) {
            post(route("dashboard.new.school_year"), {
                onSuccess: () => {
                    toast({
                        variant: "success",
                        description: "School year has been updated.",
                    });
                    form.reset();
                    onClose(false);
                },
                onFinish: () => {
                    setIsSubmit(false);
                    reset();
                },
            });
        }
    }, [setSubmit]);

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="md" center>
            <div className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitForm)}>
                        <FormField
                            control={form.control}
                            name="sy"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        S.Y.
                                    </FormLabel>
                                    <SelectOption
                                        onChange={field.onChange}
                                        initialValue={currentSY}
                                        rerenders
                                    >
                                        <SelectOptionTrigger>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left justify-between font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                                                        !field.value &&
                                                            "text-muted-foreground"
                                                    )}
                                                >
                                                    <span className="line-clamp-1">
                                                        {!field.value ?
                                                            "Select school year" : field.value}
                                                    </span>
                                                    <ChevronDown className="size-4" />
                                                </Button>
                                            </FormControl>
                                        </SelectOptionTrigger>
                                        <SelectOptionContent>
                                            <ScrollArea className="h-32">
                                                <div className="p-1 grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-1">
                                                    {generateSchoolYears(
                                                        new Date().getFullYear() + 3
                                                    ).map((sy, index) => (
                                                        <SelectOptionItem
                                                            key={index}
                                                            value={sy}
                                                            className="pr-3"
                                                        />
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </SelectOptionContent>
                                    </SelectOption>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-between items-center mt-7">
                            <Button type="button" variant={'outline'} className="px-8" onClick={() => onClose(false)}>
                                <span>Cancel</span>
                            </Button>
                            <Button className="px-10">
                                Save
                            </Button>
                        </div>

                    </form>
                </Form>
            </div>

            <Processing is_processing={processing} />
        </Modal>
    );
};

export default NewSchoolYear;
