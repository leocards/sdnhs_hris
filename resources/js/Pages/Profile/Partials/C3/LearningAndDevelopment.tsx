import { Button } from "@/Components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CalendarInput } from "../C1/FamilyBackground";
import { c3, C3LAndD } from "../../type";
import NumberInput from "@/Components/NumberInput";

export default function LearningAndDevelopment({form}: {form:any}) {
    const { control } = useFormContext();
    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "c3.landd",
    });

    return (
        <div className="space-y-4 !mt-12">
            <div className="font-medium uppercase italic">
                VII.  LEARNING AND DEVELOPMENT (L&D) INTERVENTIONS/TRAINING PROGRAMS ATTENDED
            </div>

            <div className="space-y-4 divide-y divide-zinc-400 !mt-0">
                <div className="flex pt-2">
                    <Button
                        type="button"
                        className="px-10 ml-auto"
                        onClick={() =>
                            prepend(C3LAndD)
                        }
                    >
                        Add
                    </Button>
                </div>
                {fields.map((item, index) => (
                    <div className="space-y-4 relative pt-3" key={item.id}>
                        <div className="w-fit ml-auto absolute right-2">
                            {fields.length > 1 && (
                                <Button
                                    size="icon"
                                    type="button"
                                    className="size-7"
                                    onClick={() => {
                                        fields.length > 1 && remove(index);
                                    }}
                                >
                                    <X className="size-4" />
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-[1fr,repeat(2,12rem)] gap-3">
                            <FormField 
                                control={form.control}
                                name={c3.landd+`${index}.title`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title of Learning and Development Interventions/Training Programs (Write in full)</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="form-input" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <CalendarInput
                                form={form}
                                label="From"
                                name={
                                    c3.landd +
                                    `${index}.inclusivedates.from`
                                }
                                isRequired={false}
                            />
                            <CalendarInput
                                form={form}
                                label="To"
                                name={
                                    c3.landd +
                                    `${index}.inclusivedates.to`
                                }
                                isRequired={false}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <FormField 
                                control={form.control}
                                name={c3.landd+`${index}.numberofhours`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Number of hours</FormLabel>
                                        <FormControl>
                                            <NumberInput {...field} className="form-input" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name={c3.landd+`${index}.typeofld`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type of LD (Managerial/Supervisory/Technical/etc)</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="form-input" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name={c3.landd+`${index}.conductedsponsoredby`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Conducted/Sponsored by (Write in full)</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="form-input" />
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
    )
}