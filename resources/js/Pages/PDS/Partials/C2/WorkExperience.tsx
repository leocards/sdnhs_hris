import { useFieldArray } from "react-hook-form";
import { CalendarInput } from "../C1/FamilyBackground";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Button } from "@/Components/ui/button";
import { X } from "lucide-react";
import { defaultWE } from "../c2types";
import NumberInput from "@/Components/NumberInput";

export default function WorkExperience({ form }: { form: any }) {
    const { fields, prepend, remove } = useFieldArray({
        control: form.control,
        name: "we",
    });

    return (
        <div className="space-y-4 mt-12">
            <div className="font-medium uppercase italic">
                V. WORK EXPERIENCE
            </div>
            <div className="!mt-0 text-foreground/70">
                (Include private employment. Start from your recent work)
                Description of duties should be indicated in the attached Work
                Experience sheet.
            </div>

            <div className="space-y-4">
                <div className="flex pt-2">
                    <Button
                        type="button"
                        className="px-8 w-full"
                        onClick={() => prepend(defaultWE)}
                    >
                        Add new row
                    </Button>
                </div>
                {fields.map((item, index) => (
                    <div
                        className="space-y-4 relative pt-3 border p-3 px-3.5 rounded-md shadow-sm"
                        key={item.id}
                    >
                        <div className="w-fit ml-auto absolute right-1 top-1">
                            <Button
                                size="icon"
                                type="button"
                                variant="ghost"
                                className="size-7"
                                onClick={() => {
                                    const deleted = form.getValues('deletedWE')
                                    const deletable = form.getValues(`we.${index}.weid`)
                                    if(deletable)
                                        form.setValue('deletedWE', [...deleted, deletable])

                                    remove(index);
                                }}
                            >
                                <X className="size-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 [@media(min-width:568px)]:grid-cols-2 gap-3">
                            <FormField
                                control={form.control}
                                name={`we.${index}.positiontitle`}
                                render={({ field }) => (
                                    <FormItem className="[@media(min-width:568px)]:col-span-2">
                                        <FormLabel>
                                            Position title{" "}
                                            <span className="text-xs">
                                                (Write in full/Do not
                                                abbreviate)
                                            </span>
                                        </FormLabel>
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
                            <CalendarInput
                                form={form}
                                label={
                                    <div className="mb-1.5">
                                        <span className="text-xs text-foreground/60">
                                            (Inclusive date)
                                        </span>{" "}
                                        From
                                    </div>
                                }
                                name={`we.${index}.inclusivedates.from`}
                                isRequired={false}
                                isUppercase
                            />
                            <CalendarInput
                                form={form}
                                placeholder="mm/dd/yyyy or present"
                                label={
                                    <div className="mb-1.5">
                                        <span className="text-xs text-foreground/60">
                                            (Inclusive date)
                                        </span>{" "}
                                        To
                                    </div>
                                }
                                name={`we.${index}.inclusivedates.to`}
                                isRequired={false}
                                asInput
                                isUppercase
                            />

                        </div>

                        <div className="grid [@media(min-width:660px)]:grid-cols-2 gap-3">
                            <FormField
                                control={form.control}
                                name={`we.${index}.department`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Department/Agency/Office/Company{" "}
                                            <br />
                                            <span className="text-xs">
                                                (Write in full/Do not
                                                abbreviate)
                                            </span>
                                        </FormLabel>
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
                                name={`we.${index}.salarygrade`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Salary/Job/Pay Grade <br />
                                            <span className="text-xs">
                                                (if applicable) & Step (Format
                                                "00-0")/Increment
                                            </span>
                                        </FormLabel>
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

                        <div className="grid [@media(min-width:660px)]:grid-cols-[1fr,1fr,15rem] gap-3">
                            <FormField
                                control={form.control}
                                name={`we.${index}.monthlysalary`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Monthly salary</FormLabel>
                                        <FormControl>
                                            <NumberInput
                                                {...field}
                                                isAmount={true}
                                                className="form-input uppercase"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`we.${index}.statusofappointment`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Status of appointment
                                        </FormLabel>
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
                                name={`we.${index}.isgovernment`}
                                render={({ field }) => (
                                    <FormItem className="space-y-4 [@media(min-width:660px)]:text-center">
                                        <FormLabel className="text-center">
                                            Gov't service (Y/N)
                                        </FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex gap-7 items-center [@media(min-width:660px)]:justify-center"
                                            >
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="Y" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        Y
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="N" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        N
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
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
