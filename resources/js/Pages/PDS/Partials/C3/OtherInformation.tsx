import { Button } from "@/Components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/Components/ui/form";
import { X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { c3 } from "../../../Profile/type";
import { Input } from "@/Components/ui/input";
import { defaultOI } from "../c3types";

export default function OtherInformation({ form }: { form: any }) {
    return (
        <div className="space-y-4 !mt-12">
            <div className="font-medium uppercase italic">
                VIII. OTHER INFORMATION
            </div>

            <div className="grid [@media(min-width:698px)]:grid-cols-3 [@media(min-width:698px)]:gap-4 gap-6">
                <div>
                    <FormLabel>Special skills & Hobbies</FormLabel>
                    <Informations
                        form={form}
                        name="skills"
                        fieldName={(index) => `skills.${index}.detail`}
                        defaultValue={{ skill: "" }}
                    />
                </div>
                <div>
                    <FormLabel>
                        Non-academics distinction/recognition (Write in full)
                    </FormLabel>
                    <Informations
                        form={form}
                        name="nonacademicrecognition"
                        fieldName={(index) =>
                            `nonacademicrecognition.${index}.detail`
                        }
                        defaultValue={{ recognition: "" }}
                    />
                </div>
                <div>
                    <FormLabel>
                        Membership in association/organization (Write in full)
                    </FormLabel>
                    <Informations
                        form={form}
                        name="membership"
                        fieldName={(index) => `membership.${index}.detail`}
                        defaultValue={{ member: "" }}
                    />
                </div>
            </div>
        </div>
    );
}

const Informations: React.FC<{
    form: any;
    name: string;
    fieldName: (index: number) => string;
    defaultValue: any;
}> = ({ form, name, fieldName, defaultValue }) => {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: name,
    });

    return (
        <div className="space-y-3 mt-3">
            {fields.map((item, index) => (
                <div className="relative" key={item.id}>
                    <Button
                        size={"icon"}
                        className="size-6 absolute -top-3 -right-2"
                        onClick={() => {
                            const deleted = form.getValues("deletedOI");
                            const deletable = form.getValues(
                                `${name}.${index}.oiid`
                            );
                            if (deletable)
                                form.setValue("deletedOI", [
                                    ...deleted,
                                    deletable,
                                ]);

                            remove(index);
                        }}
                    >
                        <X className="size-4" />
                    </Button>
                    <FormField
                        control={form.control}
                        name={fieldName(index)}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} className="form-input uppercase" />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            ))}
            <Button
                type="button"
                className="px-8 w-full"
                onClick={() => append(defaultOI)}
            >
                Add
            </Button>
        </div>
    );
};
