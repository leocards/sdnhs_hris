import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Input } from "@/Components/ui/input";

export const ChoiceDetails: React.FC<{
    form: any;
    name: string;
    disabled: boolean;
    detailsLabel?: string;
}> = ({ form, name, disabled, detailsLabel }) => {
    return (
        <FormField
            control={form.control}
            name={name}
            disabled={disabled}
            render={({ field }) => (
                <FormItem className="mt-4 ml-5">
                    <div className="flex items-start">
                        <FormLabel className="mt-0.5 mr-2 font-normal">
                            {detailsLabel??'if YES, give details:'}
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            {...field}
                            className="form-input max-w-80 min-w-32 w-full"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export const Choices: React.FC<{
    form: any;
    label: string;
    name: string;
    detailsName?: string | null;
    disabled?: boolean;
    className?: string;
    detailsLabel?: string;
}> = ({ form, label, name, detailsName, disabled = true, className, detailsLabel }) => {
    return (
        <>
            <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                    <FormItem className={className}>
                        <div className="flex items-start">
                            <FormLabel className="mr-2 font-normal text-base leading-5">
                                {label}
                            </FormLabel>
                        </div>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex gap-5 ml-5"
                            >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="Yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        Yes
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="No" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        No
                                    </FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {detailsName && (
                <ChoiceDetails
                    form={form}
                    name={detailsName}
                    disabled={disabled}
                    detailsLabel={detailsLabel}
                />
            )}
        </>
    );
};
