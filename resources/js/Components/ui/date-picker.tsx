import { useState } from "react";
import { Calendar } from "@/Components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { CalendarIcon } from "lucide-react";
import { FormControl } from "./form";

type DatePickerProps = {
    field: any
    isForm: boolean
    disabled?: boolean
}

const DatePicker: React.FC<DatePickerProps> = ({
    field,
    isForm = false,
    disabled = false
}) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<Date>()

    return (
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger
                asChild
                className="hover:!bg-transparent aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
            >
                {
                    isForm ? (
                        <FormDatePicker field={field} disabled={disabled} />
                    ) : (
                        <Button
                            type="button"
                            variant={"outline"}
                            disabled={disabled}
                            className={cn(
                                "w-full pl-3 text-left font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                                !field.value && "text-muted-foreground",
                                "disabled:!cursor-not-allowed"
                            )}
                        >
                            {field.value ? (
                                <span>{format(field.value, "PPP")}</span>
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto size-5 opacity-50" />
                        </Button>
                    )
                }
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
    );
};

const FormDatePicker: React.FC<{field: any; disabled?: boolean}> = ({ field, disabled = false }) => {
    return (
        <FormControl>
            <Button
                type="button"
                variant={"outline"}
                disabled={disabled}
                className={cn(
                    "w-full pl-3 text-left font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                    !field.value && "text-muted-foreground",
                    "disabled:!cursor-not-allowed"
                )}
            >
                {field.value ? (
                    <span>{format(field.value, "PPP")}</span>
                ) : (
                    <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto size-5 opacity-50" />
            </Button>
        </FormControl>
    );
};

export default DatePicker;
