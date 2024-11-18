import React from "react";
import NumberInput from "@/Components/NumberInput";
import { useFieldArray } from "react-hook-form";
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

const PersonalProperties: React.FC<{ form: any }> = ({ form }) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "assets.personal",
    });

    return (
        <div>
            <div className="space-y-3">
                {fields.map((personal, index) => (
                    <div key={personal.id} className="space-y-4 border rounded-md p-3 shadow-sm relative">
                        {fields.length > 1 && <Button
                            className="size-6 absolute top-1 right-1"
                            variant={"ghost"}
                            size={"icon"}
                            type="button"
                            onClick={() => remove(index)}
                        >
                            <X className="size-4" />
                        </Button>}

                        <div className="grid grid-cols-1 sm:grid-cols-[1fr,10rem,13rem] gap-4">
                            <FormField
                                control={form.control}
                                name={`assets.personal.${index}.description`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
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
                                name={`assets.personal.${index}.yearacquired`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Year acquired</FormLabel>
                                        <FormControl>
                                            <NumberInput
                                                {...field}
                                                max={4}
                                                className="form-input"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`assets.personal.${index}.acquisitioncost`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Acquisition cost/amount</FormLabel>
                                        <FormControl>
                                            <NumberInput
                                                isAmount
                                                {...field}
                                                className="form-input"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                ))}
                <Button
                    className="w-full !mt-5"
                    type="button"
                    variant={"secondary"}
                    onClick={() =>
                        append({
                            description: "",
                            kind: "",
                            exactlocation: "",
                            assessedvalue: "",
                            currentfairmarketvalue: "",
                            acquisition: {
                                year: "",
                                mode: "",
                            },
                            acquisitioncost: "",
                        })
                    }
                >
                    Add new row
                </Button>
            </div>
        </div>
    );
};

export default PersonalProperties;
