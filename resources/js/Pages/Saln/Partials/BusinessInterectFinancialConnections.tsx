import React from "react";
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
import { CheckBoxForm } from "./PersonalInformation";
import { CalendarInput } from "@/Pages/PDS/Partials/C1/FamilyBackground";

const BusinessInterectFinancialConnections: React.FC<{ form: any }> = ({
    form,
}) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "biandfc.bifc",
    });

    return (
        <div className="mt-10">
            <div className="font-bold underline text-center">
                BUSINESS INTERESTS AND FINANCIAL CONNECTIONS
            </div>
            <div className="text-center text-foreground/50">
                (of Declarant /Declarant’s spouse/ Unmarried Children Below
                Eighteen (18) years of Age Living in Declarant’s Household)
            </div>

            <div className="mx-auto w-fit mt-3">
                <CheckBoxForm
                    form={form}
                    label="I/We do not have any business interest or financial connection"
                    name="biandfc.nobiandfc"
                />
            </div>

            <div className="mt-7">
                <div className="space-y-3">
                    {fields.map((bifc, index) => (
                        <div
                            key={bifc.id}
                            className="space-y-4 border rounded-md p-3 shadow-sm relative"
                        >
                            {fields.length > 1 && (
                                <Button
                                    className="size-6 absolute top-1 right-1"
                                    variant={"ghost"}
                                    size={"icon"}
                                    type="button"
                                    onClick={() => remove(index)}
                                >
                                    <X className="size-4" />
                                </Button>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name={`biandfc.bifc.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name of entity/business enterprise</FormLabel>
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
                                    name={`biandfc.bifc.${index}.address`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Business address</FormLabel>
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
                                    name={`biandfc.bifc.${index}.nature`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nature of business interest &/or financial connection</FormLabel>
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
                                    name={`biandfc.bifc.${index}.date`}
                                    label="Date of acquisition of interest or connection"
                                    isRequired={false}
                                    formatDate="LLLL dd, y"
                                    asInput
                                    isString
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
                                name: "",
                                address: "",
                                nature: "",
                                date: "",
                                bifcid: null
                            })
                        }
                    >
                        Add new row
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BusinessInterectFinancialConnections;
