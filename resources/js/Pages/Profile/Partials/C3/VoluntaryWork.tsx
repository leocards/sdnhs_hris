import { useFieldArray, useFormContext } from "react-hook-form";
import { CalendarInput } from "../C1/FamilyBackground";
import { c3, C3VoluntaryWork } from "../../type";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import NumberInput from "@/Components/NumberInput";
import { Button } from "@/Components/ui/button";
import { X } from "lucide-react";

export default function VoluntaryWork({ form }: { form: any }) {
    const { control } = useFormContext();
    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "c3.voluntarywork",
    });

    return (
        <div className="space-y-4">
            <div className="font-medium uppercase italic">
                VI. VOLUNTARY WORK OR INVOLVEMENT IN CIVIC / NON-GOVERNMENT /
                PEOPLE / VOLUNTARY ORGANIZATION/S
            </div>

            <div className="space-y-4 divide-y divide-zinc-400 !mt-0">
                <div className="flex pt-2">
                    <Button
                        type="button"
                        className="px-10 ml-auto"
                        onClick={() =>
                            prepend(C3VoluntaryWork)
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
                        <div className="grid xl:grid-cols-3 sm:grid-cols-2 gap-3">
                            <FormField 
                                control={form.control}
                                name={c3.voluntarywork+`${index}.nameandaddress`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name & address of organization</FormLabel>
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
                                    c3.voluntarywork +
                                    `${index}.inclusivedates.from`
                                }
                                isRequired={false}
                            />
                            <CalendarInput
                                form={form}
                                label="To"
                                name={
                                    c3.voluntarywork +
                                    `${index}.inclusivedates.to`
                                }
                                isRequired={false}
                            />
                        </div>

                        <div className="grid sm:grid-cols-[10rem,1fr] gap-3">
                            <FormField 
                                control={form.control}
                                name={c3.voluntarywork+`${index}.numberofhours`}
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
                                name={c3.voluntarywork+`${index}.positionornatureofwork`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Position or nature of work</FormLabel>
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
    );
}
