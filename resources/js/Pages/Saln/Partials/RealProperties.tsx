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

const RealProperties: React.FC<{ form: any }> = ({ form }) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "assets.real",
    });

    return (
        <div>
            <div className="space-y-3">
                {fields.map((real, index) => (
                    <div key={real.id} className="space-y-4 border rounded-md p-3 shadow-sm relative">
                        {fields.length > 1 && <Button
                            className="size-6 absolute top-1 right-1"
                            variant={"ghost"}
                            size={"icon"}
                            type="button"
                            onClick={() => remove(index)}
                        >
                            <X className="size-4" />
                        </Button>}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name={`assets.real.${index}.description`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Description{" "}
                                            <span className="text-foreground/40">
                                                (e.g. lot, house and lot,
                                                condominium and improvements)
                                            </span>
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
                                name={`assets.real.${index}.kind`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Kind{" "}
                                            <span className="text-foreground/40">
                                                (e.g. residential, commercial,
                                                industrial, agricultural and
                                                mixed use)
                                            </span>
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
                        </div>

                        <div>
                            <FormField
                                control={form.control}
                                name={`assets.real.${index}.exactlocation`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Exact Location</FormLabel>
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
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name={`assets.real.${index}.assessedvalue`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assessed Value</FormLabel>
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
                                name={`assets.real.${index}.currentfairmarketvalue`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Current Fair Market Value
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
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name={`assets.real.${index}.acquisition.year`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Acquisition year</FormLabel>
                                        <FormControl>
                                            <NumberInput
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
                                name={`assets.real.${index}.acquisition.mode`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Acquisition mode</FormLabel>
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
                                name={`assets.real.${index}.acquisitioncost`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Acquisition cost</FormLabel>
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

export default RealProperties;
