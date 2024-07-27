import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { c2, C2CivilService } from "../../type";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/Components/ui/input";
import { CalendarInput } from "../C1/FamilyBackground";
import { Button } from "@/Components/ui/button";
import { X } from "lucide-react";

type CivilServiceEligibilityProps = {
    form: any;
};

export default function CivilServiceEligibility({
    form,
}: CivilServiceEligibilityProps) {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "c2.civilserviceeligibility",
    });

    return (
        <div className="space-y-4">
            <div className="font-medium uppercase italic">
                IV. CIVIL SERVICE ELIGIBILITY
            </div>

            <div className="space-y-4 divide-y divide-zinc-400 !mt-0">
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
                        <div className="grid grid-cols-[1fr,auto] gap-3">
                            <FormField
                                control={form.control}
                                name={
                                    c2.civilserviceeligibility +
                                    `${index}.eligibility`
                                }
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Career service/RA 1080 (BOARD/BAR)
                                            under special Laws/CES/CSEE Barangay
                                            Eligibility / Driver's license
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
                                    c2.civilserviceeligibility +
                                    `${index}.rating`
                                }
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Rating (If applicable)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="form-input w-52"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-[20rem,1fr] gap-3">
                            <CalendarInput
                                form={form}
                                label="Date of Examination/Conferment"
                                name={
                                    c2.civilserviceeligibility +
                                    `${index}.dateofexaminationconferment`
                                }
                                isRequired={false}
                            />
                            <FormField
                                control={form.control}
                                name={
                                    c2.civilserviceeligibility +
                                    `${index}.placeofexaminationconferment`
                                }
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Place of Examination/Conferment
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

                        <div>
                            <FormLabel>LICENCE (If applicable)</FormLabel>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name={
                                        c2.civilserviceeligibility +
                                        `${index}.license.number`
                                    }
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Number</FormLabel>
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
                                    label="Date of validity"
                                    name={
                                        c2.civilserviceeligibility +
                                        `${index}.license.dateofvalidity`
                                    }
                                    isRequired={false}
                                />
                            </div>
                        </div>
                    </div>
                ))}
                <div className="flex pt-2">
                    <Button
                        type="button"
                        className="px-8 ml-auto"
                        onClick={() =>
                            append(C2CivilService)
                        }
                    >
                        Add
                    </Button>
                </div>
            </div>
        </div>
    );
}
