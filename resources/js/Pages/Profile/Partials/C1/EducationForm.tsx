import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import {
    SelectOption,
    SelectOptionContent,
    SelectOptionItem,
    SelectOptionTrigger,
} from "@/Components/SelectOption";
import { Input } from "@/Components/ui/input";
import NumberInput from "@/Components/NumberInput";
import { Button } from "@/Components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
    educationLevel: string;
    form: any;
    index: number;
};

const EducationForm: React.FC<Props> = ({ form, educationLevel, index }) => {
    return (
        <div className="space-y-4">
            <div className="grid [@media(min-width:1256px)]:grid-cols-[1fr,1fr,repeat(2,7rem)] sm:grid-cols-2 gap-3">
                <FormField
                    control={form.control}
                    name={`${educationLevel}.${index}.nameofschool`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Name of School (write in full)
                            </FormLabel>
                            <FormControl>
                                <Input {...field} className="form-input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`${educationLevel}.${index}.basiceddegreecourse`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="">
                                Basic Education/Degree/Course (write in full)
                            </FormLabel>
                            <FormControl>
                                <Input {...field} className="form-input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={`${educationLevel}.${index}.period.from`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="">From</FormLabel>
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
                    name={`${educationLevel}.${index}.period.to`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="">To</FormLabel>
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
            <div className="grid [@media(min-width:1256px)]:grid-cols-3 sm:grid-cols-2 gap-3">
                <FormField
                    control={form.control}
                    name={`${educationLevel}.${index}.highestlvl`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Highest level/Units earned</FormLabel>
                            <FormControl>
                                <Input {...field} className="form-input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`${educationLevel}.${index}.yeargraduated`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Year graduate
                            </FormLabel>
                            <FormControl>
                                <NumberInput
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
                    name={`${educationLevel}.${index}.scholarshiphonor`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Scholarship/Academic honors received
                            </FormLabel>
                            <FormControl>
                                <Input {...field} className="form-input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
};

export default EducationForm;
