import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormProps,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import NumberInput from "@/Components/NumberInput";

const ContactInformation: React.FC<FormProps> = ({ form }) => {
    return (
        <>
            <div className="mt-8 mb-4 py-3 relative">
                <div className="bg-background dark:bg-zinc-900 absolute top-1/2 -translate-y-1/2 h-fit pr-3 text-foregroun/75">
                    Contact information
                </div>
                <hr className="border-t-2 border-border" />
            </div>

            <div className="grid [@media(min-width:536px)]:grid-rows-2 grid-cols-1 w-full gap-3">
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem className="grow">
                            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                Address
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid [@media(max-width:536px)]:grid-cols-1 grid-cols-2 gap-3">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="grow">
                                <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem className="grow">
                                <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                    Phone number
                                </FormLabel>
                                <FormControl>
                                    <NumberInput
                                        {...field}
                                        className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </>
    );
};

export default ContactInformation;
