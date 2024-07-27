import { Button } from "@/Components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/Components/ui/form";
import { X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { c3 } from "../../type";
import { Input } from "@/Components/ui/input";

export default function OtherInformation({ form }: { form: any }) {

    return (
        <div className="space-y-4 !mt-12">
            <div className="font-medium uppercase italic">
                VIII.  OTHER INFORMATION
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div>
                    <FormLabel>Special skills & Hobbies</FormLabel>
                    <Informations
                        form={form}
                        name="c3.otherinformation.skills"
                        fieldName={(index) =>
                            c3.otherinformation + `skills.${index}.skill`
                        }
                        defaultValue={{skill: ""}}
                    />
                </div>
                <div>
                    <FormLabel>Non-academics distinction/recognition (Write in full)</FormLabel>
                    <Informations
                        form={form}
                        name="c3.otherinformation.nonacademicrecognition"
                        fieldName={(index) =>
                            c3.otherinformation + `nonacademicrecognition.${index}.recognition`
                        }
                        defaultValue={{recognition: ""}}
                    />
                </div>
                <div>
                    <FormLabel>Membership in association/organization (Write in full)</FormLabel>
                    <Informations
                        form={form}
                        name="c3.otherinformation.membership"
                        fieldName={(index) =>
                            c3.otherinformation + `membership.${index}.member`
                        }
                        defaultValue={{member: ""}}
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
                    {fields.length > 1 && (
                        <Button
                            size={"icon"}
                            className="size-6 absolute -top-3 -right-2"
                            onClick={() => {
                                fields.length > 1 && remove(index);
                            }}
                        >
                            <X className="size-4" />
                        </Button>
                    )}
                    <FormField
                        control={form.control}
                        name={fieldName(index)}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            ))}
            <Button
                type="button"
                className="px-8 w-full"
                onClick={() => append(defaultValue)}
            >
                Add
            </Button>
        </div>
    );
};
