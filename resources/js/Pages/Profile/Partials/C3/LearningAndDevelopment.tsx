import { Button } from "@/Components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CalendarInput } from "../C1/FamilyBackground";
import { c3, C3LAndD } from "../../type";
import NumberInput from "@/Components/NumberInput";
import { defaultLD } from "../c3types";

export default function LearningAndDevelopment({ form }: { form: any }) {
    const { control } = useFormContext();
    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "ld",
    });

    return (
        <div className="space-y-4 !mt-12">
            <div className="font-medium uppercase italic">
                VII. LEARNING AND DEVELOPMENT (L&D) INTERVENTIONS/TRAINING
                PROGRAMS ATTENDED
            </div>

            <div className="space-y-4 !mt-0">
                <div className="flex pt-2">
                    <Button
                        type="button"
                        className="px-10 ml-auto w-full"
                        onClick={() => prepend(defaultLD)}
                    >
                        Add
                    </Button>
                </div>
                {fields.map((item, index) => (
                    <div
                        className="space-y-4 relative pt-3 border p-3 px-3.5 rounded-md shadow-sm"
                        key={item.id}
                    >
                        <div className="w-fit ml-auto absolute right-1 top-1">
                            <Button
                                size="icon"
                                type="button"
                                variant={"ghost"}
                                className="size-7"
                                onClick={() => {
                                    const deleted = form.getValues('deletedLD')
                                    const deletable = form.getValues(`ld.${index}.ldid`)
                                    if(deletable)
                                        form.setValue('deletedLD', [...deleted, deletable])

                                    remove(index);
                                }}
                            >
                                <X className="size-4" />
                            </Button>
                        </div>

                        <FormField
                            control={form.control}
                            name={`ld.${index}.title`}
                            render={({ field }) => (
                                <FormItem className="sm:col-span-2">
                                    <FormLabel>
                                        Title of Learning and Development
                                        Interventions/Training Programs (Write
                                        in full)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="form-input uppercase"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid [@media_screen_and_(min-width:1024px)_and_(max-width:1120px)]:grid-cols-1 grid-cols-3 [@media(max-width:700px)]:grid-cols-1 gap-3">
                            <CalendarInput
                                form={form}
                                label="From"
                                name={`ld.${index}.inclusivedates.from`}
                                isRequired={false}
                                isUppercase
                            />
                            <CalendarInput
                                form={form}
                                label="To"
                                name={`ld.${index}.inclusivedates.to`}
                                isRequired={false}
                                isUppercase
                            />
                            <FormField
                                control={form.control}
                                name={`ld.${index}.numberofhours`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Number of hours</FormLabel>
                                        <FormControl>
                                            <NumberInput
                                                {...field}
                                                className="form-input uppercase"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid [@media_screen_and_(min-width:1024px)_and_(max-width:1120px)]:grid-cols-1 grid-cols-2 [@media(max-width:789px)]:grid-cols-1 gap-3">
                            <FormField
                                control={form.control}
                                name={`ld.${index}.typeofld`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Type of LD
                                            (Managerial/Supervisory/Technical/etc)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="form-input uppercase"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={
                                    `ld.${index}.conductedsponsoredby`
                                }
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Conducted/Sponsored by (Write in
                                            full)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="form-input uppercase"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
