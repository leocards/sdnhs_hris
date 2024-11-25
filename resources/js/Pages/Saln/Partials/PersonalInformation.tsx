import { Checkbox } from "@/Components/ui/checkbox";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { cn } from "@/lib/utils";
import { CalendarInput } from "@/Pages/PDS/Partials/C1/FamilyBackground";
import { User } from "@/types";
import React, { useMemo } from "react";
import { DeclarantType } from "../AddSaln";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import NumberInput from "@/Components/NumberInput";

type Props = {
    form: any;
    user: User;
    declarant: DeclarantType;
};

const PersonalInformation: React.FC<Props> = ({ form, user, declarant }) => {
    // const address = useMemo(() => {
    //     if(declarant.pds_personal_information) {

    //     }

    //     return
    // }, [declarant])

    return (
        <div className="mt-5">
            <div className="font-bold text-lg text-center">
                SWORN STATEMENT OF ASSETS, LIABILITIES AND NET WORTH
            </div>
            <div className="space-y-4">
                <div className="mx-auto w-fit [&>div]:flex [&>div]:items-center [&>div]:gap-2">
                    <CalendarInput
                        form={form}
                        name="asof"
                        label="As of"
                        className="w-52"
                        formatDate="LLLL dd, y"
                    />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <div className="">
                        <b>Note:</b> Husband and wife who are both public
                        officials and employees may file the required statements
                        jointly or separately.
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center gap-3.5">
                            <RadioBoxForm
                                form={form}
                                label=""
                                name="isjoint"
                                items={[
                                    {value: "joint", label: "Joint Filing"},
                                    {value: "separate", label: "Separate Filing"},
                                    {value: "none", label: "Not Applicable"}
                                ]}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2.5">
                    <Label className="uppercase">Declarant</Label>
                    <div className="grid grid-cols-3 gap-2.5 sm:gap-4 [&>div]:h-12 [&>div]:flex [&>div]:flex-col">
                        <div>
                            <div className="text-center grow">
                                <div className="line-clamp-1">
                                    {user.last_name}
                                </div>
                            </div>
                            <hr className="border-black/40" />
                            <div className="text-foreground/40 text-center">
                                (Family Name)
                            </div>
                        </div>
                        <div>
                            <div className="text-center grow">
                                <div className="line-clamp-1">
                                    {user.first_name}
                                </div>
                            </div>
                            <hr className="border-black/40" />
                            <div className="text-foreground/40 text-center">
                                (First Name)
                            </div>
                        </div>
                        <div>
                            <div className="text-center grow">
                                <div className="line-clamp-1">
                                    {user.middle_name?.charAt(0)}
                                </div>
                            </div>
                            <hr className="border-black/40" />
                            <div className="text-foreground/40 text-center">
                                (M.I.)
                            </div>
                        </div>
                    </div>
                    <div className="h-12 flex flex-col">
                        <div className="text-center grow">
                            <div className="line-clamp-1">{user.address}</div>
                        </div>
                        <hr className="border-black/40" />
                        <div className="text-foreground/40 text-center">
                            (Address)
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5 sm:gap-4 [&>div]:h-12 [&>div]:flex [&>div]:flex-col">
                        <div>
                            <div className="text-center grow">
                                <div className="line-clamp-1">
                                    {user.position}
                                </div>
                            </div>
                            <hr className="border-black/40" />
                            <div className="text-foreground/40 text-center">
                                (Position)
                            </div>
                        </div>
                        <div>
                            <div className="text-center grow">
                                <div className="line-clamp-1">
                                    SOUTHERN DAVAO NHS
                                </div>
                            </div>
                            <hr className="border-black/40" />
                            <div className="text-foreground/40 text-center">
                                (Agency/Office/School)
                            </div>
                        </div>
                        <div>
                            <div className="text-center grow">
                                <div className="line-clamp-1">
                                    SOUTHERN DAVAO, PANABO CITY
                                </div>
                            </div>
                            <hr className="border-black/40" />
                            <div className="text-foreground/40 text-center">
                                (Office address)
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="uppercase">Spouse</Label>
                    <div className="grid sm:grid-cols-3 gap-2.5 sm:gap-4">
                        <FormField
                            control={form.control}
                            name="spouse.familyname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Family Name</FormLabel>
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
                            name="spouse.firstname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
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
                            name="spouse.middleinitial"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>M.I.</FormLabel>
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
                    <div className="grid sm:grid-cols-3 gap-2.5 sm:gap-4">
                        <FormField
                            control={form.control}
                            name="spouse.position"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Position</FormLabel>
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
                            name="spouse.office"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Agency/Office/School</FormLabel>
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
                            name="spouse.officeaddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Office address</FormLabel>
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

                    <div className="grid sm:grid-cols-3 gap-2.5 sm:gap-4">
                        <FormField
                            control={form.control}
                            name="spouse.governmentissuedid"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Government Issued Id</FormLabel>
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
                            name="spouse.idno"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ID No</FormLabel>
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
                        <CalendarInput
                            form={form}
                            name="spouse.dateissued"
                            label="Date Issued"

                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const RadioBoxForm: React.FC<{ form: any; name: string; label: string; items: Array<{value:string;label:string;}> }> = ({
    form,
    name,
    label,
    items
}) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-3 required"
                        >
                            {items.map((item, index) => (
                                <FormItem key={index} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value={item.value} />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {item.label}
                                    </FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                </FormItem>
            )}
        />
    );
};

export const CheckBoxForm: React.FC<{
    form: any;
    name: string;
    label: string;
    isRequired?: boolean;
    value?: string;
}> = ({ form, name, label, isRequired, value }) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex items-center gap-2.5">
                    <FormControl>
                        <Checkbox
                            checked={
                                !value ? field.value : field.value == value
                            }
                            onCheckedChange={(check) =>
                                field.onChange(value ? value : check)
                            }
                        />
                    </FormControl>
                    <FormLabel
                        className={cn(isRequired && "required", "!mt-0")}
                    >
                        {label}
                    </FormLabel>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default PersonalInformation;
