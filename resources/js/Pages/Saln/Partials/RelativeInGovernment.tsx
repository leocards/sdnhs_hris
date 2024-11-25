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

const RelativeInGovernment: React.FC<{ form: any }> = ({
    form,
}) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "relativesingovernment.relatives",
    });

    return (
        <div className="mt-10">
            <div className="font-bold underline text-center">
                RELATIVES IN THE GOVERNMENT SERVICE
            </div>
            <div className="text-center text-foreground/50">
                (Within the Fourth Degree of Consanguinity or Affinity. Include also Bilas, Balae and Inso)
            </div>

            <div className="mx-auto w-fit mt-3">
                <CheckBoxForm
                    form={form}
                    label="I/We do not know of any relative/s in the government service)"
                    name="relativesingovernment.norelative"
                />
            </div>

            <div className="mt-7">
                <div className="space-y-3">
                    {fields.map((relative, index) => (
                        <div
                            key={relative.id}
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
                                    name={`relativesingovernment.relatives.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name of relative</FormLabel>
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
                                    name={`relativesingovernment.relatives.${index}.relationship`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Relationship</FormLabel>
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
                                    name={`relativesingovernment.relatives.${index}.position`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Position</FormLabel>
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
                                    name={`relativesingovernment.relatives.${index}.agencyandaddress`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name of agency/office and address</FormLabel>
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
                                name: "",
                                relationship: "",
                                position: "",
                                agencyandaddress: "",
                                relativeid: null
                            })
                        }
                    >
                        Add new row
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default RelativeInGovernment
