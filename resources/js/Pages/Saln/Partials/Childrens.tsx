import NumberInput from "@/Components/NumberInput";
import { Button } from "@/Components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { CalendarInput } from "@/Pages/Profile/Partials/C1/FamilyBackground";
import { X } from "lucide-react";
import React from "react";
import { useFieldArray } from "react-hook-form";

function calculateAge(birthdate: Date): number {
    const today = new Date();
    const birthYear = birthdate.getFullYear();
    const birthMonth = birthdate.getMonth();
    const birthDay = birthdate.getDate();

    let age = today.getFullYear() - birthYear;

    // Adjust if the birthday hasn't happened yet this year
    if (
        today.getMonth() < birthMonth ||
        (today.getMonth() === birthMonth && today.getDate() < birthDay)
    ) {
        age--;
    }

    return age;
}

const Childrens: React.FC<{ form: any }> = ({ form }) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "children",
    });
    return (
        <div className="my-10">
            <div className="font-bold underline text-center mb-4">
                UNMARRIED CHILDREN BELOW EIGHTEEN (18) YEARS OF AGE LIVING IN
                DECLARANT’S HOUSEHOLD
            </div>

            <div className="">
                <div className="space-y-3">
                    {fields.map((child, index) => (
                        <Card
                            key={child.id}
                            name={`children.${index}`}
                            form={form}
                            fields={fields}
                            remove={() => remove(index)}
                        />
                    ))}
                </div>

                <Button
                    className="w-full mt-3"
                    type="button"
                    variant={"secondary"}
                    onClick={() =>
                        append({ name: "", dateofbirth: "", age: "" })
                    }
                >
                    Add new row
                </Button>
            </div>
        </div>
    );
};

const Card: React.FC<{
    form: any;
    fields: any;
    name: string;
    remove: CallableFunction;
}> = ({ form, fields, remove, name }) => {
    const watchBday = form.watch(name+".dateofbirth")

    return (
        <div className="grid sm:grid-cols-[1fr,auto,auto] grid-cols-1 max-sm:gap-2.5 gap-4 border rounded-md p-3 shadow-sm relative">
            {fields.length > 1 && (
                <Button
                    type="button"
                    className="size-6 absolute top-1 right-1"
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => remove()}
                >
                    <X className="size-4" />
                </Button>
            )}

            <div className="">
                <FormField
                    control={form.control}
                    name={`${name}.name`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} className="form-input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="">
                <CalendarInput
                    form={form}
                    name={`${name}.dateofbirth`}
                    className="w-52 form-input"
                    isRequired={false}
                />
            </div>
            <div className="space-y-2 text-center">
                <Label className="">Age</Label>
                <div className="h-10 w-12 py-2 shadow-sm border rounded-md">
                    {watchBday && calculateAge(watchBday)}
                </div>
            </div>
        </div>
    );
};

export default Childrens;
