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
import { C4Q41 } from "../../../Profile/type";

export default function Question41({ form }: { form: any }) {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "q41",
    });

    return (
        <div className="mt-10">
            <div className="mb-4">
                &#8226; REFERENCES{" "}
                <span className="text-destructive">
                    (Person not related by consanguinity or affinity to
                    applicant /appointee)
                </span>
            </div>
            <div className="">
                {fields.map((item, index) => (
                    <div
                        key={item.id}
                        className="grid 2xl:grid-cols-3 sm:grid-cols-2 gap-3 relative mt-4 border rounded-md p-3"
                    >
                        <FormField
                            control={form.control}
                            name={`q41.${index}.name`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
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
                            name={`q41.${index}.address`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
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
                            name={`q41.${index}.telno`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tel. No.</FormLabel>
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
                ))}
            </div>
        </div>
    );
}
