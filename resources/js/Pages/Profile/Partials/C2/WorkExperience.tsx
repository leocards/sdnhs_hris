import { useFieldArray, useFormContext } from "react-hook-form";
import { c2, C2workExperienceDefault } from "../../type";
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

export default function WorkExperience({ form }: { form: any }) {
    const { control } = useFormContext();
    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "c2.workexperience",
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

            <div className="space-y-4 divide-y divide-zinc-400 !mt-0">
                <div className="flex pt-2">
                    <Button
                        type="button"
                        className="px-8 ml-auto"
                        onClick={() =>
                            prepend(C2workExperienceDefault)
                        }
                    >
                        Add
                    </Button>
                </div>
                {fields.map((item, index) => (
                    <div className="space-y-4 relative pt-3" key={item.id}>
                        <div className="w-fit ml-auto absolute right-2">
                            {fields.length > 1 && (
                                <Button
                                    size="icon"
                                    type="button"
                                    className="size-7"
                                    onClick={() => {
                                        fields.length > 1 && remove(index);
                                    }}
                                >
                                    <X className="size-4" />
                                </Button>
                            )}
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <CalendarInput
                                form={form}
                                label={<div className="mb-1.5"><span className="text-xs text-foreground/60">(Inclusive date)</span> From</div>}
                                name={
                                    c2.workexperience +
                                    `${index}.inclusivedates.from`
                                }
                                isRequired={false}
                            />
                            <CalendarInput
                                form={form}
                                label={<div className="mb-1.5"><span className="text-xs text-foreground/60">(Inclusive date)</span> To</div>}
                                name={
                                    c2.workexperience +
                                    `${index}.inclusivedates.to`
                                }
                                isRequired={false}
                            />
                            <FormField
                                control={form.control}
                                name={
                                    c2.workexperience + `${index}.positiontitle`
                                }
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Position title  <span className="text-xs">(Write in full/Do not
                                            abbreviate)</span>
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

                        <div className="grid grid-cols-2 gap-3">
                            <FormField
                                control={form.control}
                                name={
                                    c2.workexperience + `${index}.department`
                                }
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Department/Agency/Office/Company <span className="text-xs">(Write in full/Do not
                                            abbreviate)</span> 
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
                                name={
                                    c2.workexperience + `${index}.salarygrade`
                                }
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Salary/Job/Pay Grade <span className="text-xs">(if applicable) & Step (Format "00-0")/Increment</span>
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

                        <div className="grid grid-cols-[1fr,1fr,15rem] gap-3">
                            <FormField
                                control={form.control}
                                name={
                                    c2.workexperience + `${index}.monthlysalary`
                                }
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Monthly salary
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
                                name={
                                    c2.workexperience + `${index}.statusofappointment`
                                }
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Status of appointment
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
                                name={
                                    c2.workexperience + `${index}.isgovernment`
                                }
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel className="">Gov't service (Y/N)</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex gap-7 items-center"
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
