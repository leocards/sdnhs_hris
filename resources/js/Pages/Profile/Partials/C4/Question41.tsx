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
import { C4Q41 } from "../../type";

export default function Question41({ form }: { form: any }) {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "c4.q41",
    });

    return (
        <div className="mt-10">
            <div className="mb-4">
                41. REFERENCES{" "}
                <span className="text-destructive">
                    (Person not related by consanguinity or affinity to
                    applicant /appointee)
                </span>
            </div>
            <div className="">
                {fields.map((item, index) => (
                    <div
                        key={item.id}
                        className="grid grid-cols-3 gap-3 relative mt-4"
                    >
                        {fields.length > 1 && (
                            <Button
                                size="icon"
                                className="size-7 absolute right-0 -top-2"
                                onClick={() => remove(index)}
                            >
                                <X className="size-4" />
                            </Button>
                        )}
                        <FormField
                            control={form.control}
                            name={`c4.q41.${index}.name`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
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
                            name={`c4.q41.${index}.address`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
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
                            name={`c4.q41.${index}.telno`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tel. No.</FormLabel>
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
                ))}
                <div className="flex mt-4">
                    <Button
                        className="px-7 ml-auto"
                        onClick={() => append(C4Q41)}
                    >
                        Add new row
                    </Button>
                </div>
            </div>
        </div>
    );
}
