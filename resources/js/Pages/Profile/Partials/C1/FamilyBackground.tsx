import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
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
import { isValidDate } from "@/Pages/types";

type FamilyBackgroundProps = {
    form: any;
};

export default function FamilyBackground({ form }: FamilyBackgroundProps) {
    const { control } = useFormContext(); // Get the control and watch from the form context
    const { fields, append, remove } = useFieldArray({
        control,
        name: `children`, // Adjust the name to fit your schema
    });

    const currentDeletedChild = form.watch("deletedChild");

    return (
        <div className="mt-10 space-y-4" id="familyBackground">
            <div className="font-medium uppercase italic">
                II. FAMILY BACKGROUND
            </div>

            <div className="space-y-4">
                <div className="space-y-4">
                    <FormLabel className="opacity-60">SPOUSE NAME</FormLabel>

                    <div className="grid [@media(min-width:1156px)]:grid-cols-4 sm:grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name={"spouse.surname"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">Surname</FormLabel>
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
                            name={"spouse.firstname"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
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
                            name={"spouse.middlename"}
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
                            name={"spouse.extensionname"}
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
                            name={"spouse.occupation"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
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
                            name={"spouse.employerbusiness"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
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
                            name={"spouse.businessaddress"}
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
                            name={"spouse.telephone"}
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

                <div className="space-y-4 pt-5 flex flex-col">
                    <FormLabel className="uppercase opacity-60">
                        Children
                    </FormLabel>
                    {fields.map((item, index) => (
                        <div
                            key={item.id}
                            className="grid sm:grid-cols-2 gap-3 relative"
                        >
                            <FormField
                                control={form.control}
                                name={`children.${index}.name`}
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
                                name={`children.${index}.dateOfBirth`}
                                isRequired={false}
                            />
                            <Button
                                type="button"
                                size={"icon"}
                                onClick={() => {
                                    let id = form.getValues(
                                        `children.${index}.childid`
                                    );
                                    if (id)
                                        form.setValue("deletedChild", [
                                            ...currentDeletedChild,
                                            form.getValues(
                                                `children.${index}.childid`
                                            ),
                                        ]);

                                    remove(index);
                                }}
                                className="absolute right-1 size-7"
                            >
                                <X className="size-4" />
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        className="px-8 ml-auto w-full"
                        onClick={() => append({ name: "", dateOfBirth: null })}
                    >
                        Add Child
                    </Button>
                </div>

                <div className="space-y-4 pt-5">
                    <FormLabel className="opacity-60">FATHER'S NAME</FormLabel>

                    <div className="grid [@media(min-width:1156px)]:grid-cols-4 sm:grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name={"father.surname"}
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
                            name={"father.firstname"}
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
                            name={"father.middlename"}
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
                            name={"father.extensionname"}
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

                <div className="space-y-4 pt-5">
                    <FormLabel className="opacity-60">
                        MOTEHR'S MAIDEN NAME
                    </FormLabel>

                    <div className="grid [@media(min-width:1156px)]:grid-cols-3 sm:grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name={"mother.surname"}
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
                            name={"mother.firstname"}
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
                            name={"mother.middlename"}
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
    className?: string;
    asInput?: boolean;
    withLabel?: boolean;
    placeholder?: string;
    align?: "center" | "end" | "start";
}> = ({
    form,
    name,
    label = "Date of birth",
    isRequired = true,
    disabled,
    className,
    asInput,
    withLabel = true,
    placeholder,
    align,
}) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {withLabel && <FormLabel className={cn(isRequired && "required")}>
                        {label}
                    </FormLabel>}
                    <div className="flex relative">
                        {asInput && (
                            <FormControl>
                                <Input
                                    className="form-input pr-10"
                                    {...field}
                                    value={
                                        isValidDate(field.value)
                                            ? format(field.value, "P")
                                            : field.value
                                    }
                                    placeholder={placeholder??"mm/dd/yyyy"}
                                />
                            </FormControl>
                        )}
                        <Popover
                            open={isCalendarOpen}
                            onOpenChange={setIsCalendarOpen}
                        >
                            <PopoverTrigger
                                asChild
                                className="hover:!bg-transparent aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive dark:border-zinc-700 dark:bg-zinc-800"
                            >
                                {asInput ? (
                                    <Button
                                        type="button"
                                        variant={"ghost"}
                                        size={"icon"}
                                        className={cn(
                                            "shrink-0 !size-8 absolute top-1/2 -translate-y-1/2 right-1 data-[state=open]:!bg-accent"
                                        )}
                                        disabled={disabled}
                                    >
                                        <CalendarIcon className="size-4 opacity-50" />
                                    </Button>
                                ) : (
                                    <FormControl>
                                        <Button
                                            type="button"
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                                                !field.value &&
                                                    "text-muted-foreground",
                                                className
                                            )}
                                            disabled={disabled}
                                        >
                                            {field.value ? (
                                                <span>
                                                    {isValidDate(field.value)
                                                        ? format(
                                                              field.value,
                                                              "P"
                                                          )
                                                        : field.value}
                                                </span>
                                            ) : (
                                                <span>{placeholder??'mm/dd/yyyy'}</span>
                                            )}
                                            <CalendarIcon className="ml-auto size-5 opacity-50" />
                                        </Button>
                                    </FormControl>
                                )}
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align={align??"end"}>
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
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
