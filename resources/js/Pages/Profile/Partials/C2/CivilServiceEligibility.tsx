import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/Components/ui/input";
import { CalendarInput } from "../C1/FamilyBackground";
import { Button } from "@/Components/ui/button";
import { X } from "lucide-react";
import { defaultCS } from "../c2types";

type CivilServiceEligibilityProps = {
    form: any;
};

export default function CivilServiceEligibility({
    form,
}: CivilServiceEligibilityProps) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "cs",
    });

    return (
        <div className="space-y-4">
            <div className="font-medium uppercase italic">
                IV. CIVIL SERVICE ELIGIBILITY
            </div>

            <div className="space-y-6 !mt-6">
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
                                    const deleted = form.getValues('deletedCS')
                                    const deletable = form.getValues(`cs.${index}.csid`)
                                    if(deletable)
                                        form.setValue('deletedCS', [...deleted, deletable])

                                    remove(index);
                                }}
                            >
                                <X className="size-4" />
                            </Button>
                        </div>
                        <div className="sm:grid [@media(min-width:1290px)]:grid-cols-[1fr,auto] gap-3 max-sm:space-y-3">
                            <FormField
                                control={form.control}
                                name={`cs.${index}.eligibility`}
                                render={({ field }) => (
                                    <FormItem className="[@media(max-width:1290px)]:col-span-2">
                                        <FormLabel>
                                            Career service/RA 1080 (BOARD/BAR)
                                            under special Laws/CES/CSEE Barangay
                                            Eligibility / Driver's license
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="form-input"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`cs.${index}.rating`}
                                render={({ field }) => (
                                    <FormItem className="max-sm:col-span-1">
                                        <FormLabel>
                                            Rating (If applicable)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="form-input"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`cs.${index}.placeofexaminationconferment`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Place of Examination/Conferment
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="form-input"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="[@media(min-width:1290px)]:w-72 [@media(max-width:1290px)]:col-span-2">
                                <CalendarInput
                                    form={form}
                                    label="Date of Examination/Conferment"
                                    name={`cs.${index}.dateofexaminationconferment`}
                                    isRequired={false}
                                />
                            </div>
                        </div>

                        <div>
                            <FormLabel>LICENCE (If applicable)</FormLabel>
                            <div className="grid sm:grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name={`cs.${index}.license.number`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="form-input"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <CalendarInput
                                    form={form}
                                    label="Date of validity"
                                    name={`cs.${index}.license.dateofvalidity`}
                                    isRequired={false}
                                />
                            </div>
                        </div>
                    </div>
                ))}
                <div className="flex pt-2">
                    <Button
                        type="button"
                        className="px-8 ml-auto w-full"
                        onClick={() => append(defaultCS)}
                    >
                        Add
                    </Button>
                </div>
            </div>
        </div>
    );
}
