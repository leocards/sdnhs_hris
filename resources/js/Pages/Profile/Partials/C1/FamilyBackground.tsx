import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { c1 } from "../../type";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/Components/ui/button";
import { CalendarIcon, X } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/Components/ui/calendar";

type FamilyBackgroundProps = {
    form: any;
};

export default function FamilyBackground({ form }: FamilyBackgroundProps) {
    const { control } = useFormContext(); // Get the control and watch from the form context
    const { fields, append, remove } = useFieldArray({
        control,
        name: `${c1.familybackground}.children`, // Adjust the name to fit your schema
    });

    return (
        <div className="mt-10 space-y-4" id="familyBackground">
            <div className="font-medium uppercase italic">
                II. FAMILY BACKGROUND
            </div>

            <div className="space-y-4">
                <div className="space-y-4">
                    <FormLabel>SPOUSE NAME</FormLabel>

                    <div className="grid [@media(min-width:1156px)]:grid-cols-4 sm:grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name={c1.familybackground + "spouse.surname"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Surname
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
                            name={c1.familybackground + "spouse.firstname"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        First name
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
                            name={c1.familybackground + "spouse.middlename"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
                                        Middle name
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
                            name={c1.familybackground + "spouse.extensionname"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
                                        Extension name (JR., SR)
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

                    <div className="grid [@media(min-width:1156px)]:grid-cols-4 sm:grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name={c1.familybackground + "spouse.occupation"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Occupation
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
                                c1.familybackground + "spouse.employerbusiness"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Employer/business name
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
                                c1.familybackground + "spouse.businessaddress"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
                                        Business address
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
                            name={c1.familybackground + "spouse.telephone"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
                                        Telephone no.
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
                </div>

                <div className="space-y-4 flex flex-col">
                    <FormLabel className="uppercase">Children</FormLabel>
                    {fields.map((item, index) => (
                        <div
                            key={item.id}
                            className="grid sm:grid-cols-2 gap-3 relative"
                        >
                            <FormField
                                control={form.control}
                                name={`${c1.familybackground}.children.${index}.name`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="">Name</FormLabel>
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
                                name={
                                    c1.familybackground +
                                    `children.${index}.dateOfBirth`
                                }
                                isRequired={false}
                            />
                            {fields.length > 1 && (
                                <Button
                                    type="button"
                                    size={"icon"}
                                    onClick={() => {
                                        fields.length > 1 && remove(index);
                                    }}
                                    className="absolute right-1 size-7"
                                >
                                    <X className="size-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button
                        type="button"
                        className="px-8 ml-auto"
                        onClick={() => append({ name: "", dateOfBirth: null })}
                    >
                        Add Child
                    </Button>
                </div>

                <div className="space-y-4">
                    <FormLabel>FATHER'S NAME</FormLabel>

                    <div className="grid [@media(min-width:1156px)]:grid-cols-4 sm:grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name={c1.familybackground + "father.surname"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Surname
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
                            name={c1.familybackground + "father.firstname"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        First name
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
                            name={c1.familybackground + "father.middlename"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
                                        Middle name
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
                            name={c1.familybackground + "father.extensionname"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
                                        Extension name (JR., SR)
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
                </div>

                <div className="space-y-4">
                    <FormLabel>MOTEHR'S MAIDEN NAME</FormLabel>

                    <div className="grid [@media(min-width:1156px)]:grid-cols-3 sm:grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name={c1.familybackground + "mother.surname"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Surname
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
                            name={c1.familybackground + "mother.firstname"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        First name
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
                            name={c1.familybackground + "mother.middlename"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
                                        Middle name
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
                </div>
            </div>
        </div>
    );
}

export const CalendarInput: React.FC<{
    form: any;
    name: string;
    label?: string | React.ReactNode;
    isRequired?: boolean;
    disabled?: boolean;
}> = ({ form, name, label = 'Date of birth', isRequired = true, disabled }) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className={cn(isRequired && "required")}>
                        {label}
                    </FormLabel>
                    <Popover
                        open={isCalendarOpen}
                        onOpenChange={setIsCalendarOpen}
                    >
                        <PopoverTrigger
                            asChild
                            className="hover:!bg-transparent aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                        >
                            <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    disabled={disabled}
                                >
                                    {field.value ? (
                                        <span>
                                            {format(field.value, "PPP")}
                                        </span>
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto size-5 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                    field.onChange(date);
                                    setIsCalendarOpen(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
