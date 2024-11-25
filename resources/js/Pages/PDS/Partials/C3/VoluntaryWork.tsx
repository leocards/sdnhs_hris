import { useFieldArray, useFormContext } from "react-hook-form";
import { CalendarInput } from "../C1/FamilyBackground";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import NumberInput from "@/Components/NumberInput";
import { Button } from "@/Components/ui/button";
import { X } from "lucide-react";
import { defaultVW } from "../c3types";

export default function VoluntaryWork({ form }: { form: any }) {
    const { fields, prepend, remove } = useFieldArray({
        control: form.control,
        name: "vw",
    });

    return (
        <div className="space-y-4">
            <div className="font-medium uppercase italic">
                VI. VOLUNTARY WORK OR INVOLVEMENT IN CIVIC / NON-GOVERNMENT /
                PEOPLE / VOLUNTARY ORGANIZATION/S
            </div>

            <div className="space-y-4 mt-12">
                <div className="flex pt-2 mb-3">
                    <Button
                        type="button"
                        className="px-10 w-full"
                        onClick={() => prepend(defaultVW)}
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
                                variant="ghost"
                                className="size-7"
                                onClick={() => {
                                    const deleted = form.getValues('deletedVW')
                                    const deletable = form.getValues(`vw.${index}.vwid`)
                                    if(deletable)
                                        form.setValue('deletedVW', [...deleted, deletable])

                                    remove(index);
                                }}
                            >
                                <X className="size-4" />
                            </Button>
                        </div>
                        <FormField
                            control={form.control}
                            name={`vw.${index}.nameandaddress`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Name & address of organization
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
                        <div className="grid [@media(min-width:624px)]:grid-cols-3 gap-3">
                            <CalendarInput
                                form={form}
                                label="From"
                                name={`vw.${index}.inclusivedates.from`}
                                isRequired={false}
                                isUppercase
                            />
                            <CalendarInput
                                form={form}
                                label="To"
                                name={`vw.${index}.inclusivedates.to`}
                                isRequired={false}
                                isUppercase
                            />
                            <FormField
                                control={form.control}
                                name={`vw.${index}.numberofhours`}
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

                        <div className="">
                            <FormField
                                control={form.control}
                                name={`vw.${index}.positionornatureofwork`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Position or nature of work
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
