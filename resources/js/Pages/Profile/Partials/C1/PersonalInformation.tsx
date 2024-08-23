import {
    SelectOption,
    SelectOptionContent,
    SelectOptionItem,
    SelectOptionTrigger,
} from "@/Components/SelectOption";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { c1 } from "../../type";
import { COUNTRIES } from "@/country";
import { ScrollArea } from "@/Components/ui/scroll-area";
import NumberInput from "@/Components/NumberInput";
import { CalendarInput } from "./FamilyBackground";

type PersonalInformationProps = {
    form: any;
};

const PersonalInformation: React.FC<PersonalInformationProps> = ({ form }) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

    const watchCitizenship = form.watch(
        c1.personalinformation + "citizenship.citizen"
    );

    const watchCiviStatus = form.watch(
        c1.personalinformation + "civilstatus.status"
    );

    useEffect(() => {
        if (watchCitizenship !== "Dual Citizenship") {
            form.setValue(c1.personalinformation + "citizenship.dualby", null);
            form.setValue(
                c1.personalinformation + "citizenship.dualcitizencountry",
                null
            );
            form.clearErrors([
                c1.personalinformation + "citizenship.dualby",
                c1.personalinformation + "citizenship.dualcitizencountry",
            ]);
        }

        if (watchCiviStatus !== "Others") {
            form.setValue(
                c1.personalinformation + "civilstatus.otherstatus",
                ""
            );
            form.clearErrors([
                c1.personalinformation + "civilstatus.otherstatus",
            ]);
        }
    }, [watchCitizenship, watchCiviStatus, form]);

    return (
        <div className="space-y-4" id="personalInformation">
            <div className="font-medium uppercase italic">
                I. PERSONAL INFORMATION
            </div>

            <div className="space-y-4">
                <div className="grid [@media(min-width:1156px)]:grid-cols-4 sm:grid-cols-2 gap-3">
                    <FormField
                        control={form.control}
                        name={c1.personalinformation + "surname"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">
                                    Surname
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
                        name={c1.personalinformation + "firstname"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">
                                    First name
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
                        name={c1.personalinformation + "middlename"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">Middle name</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={c1.personalinformation + "extensionname"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">
                                    Extension name (JR., SR)
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid [@media(min-width:1156px)]:grid-cols-3 sm:grid-cols-2 gap-3">
                    <CalendarInput
                        form={form}
                        name={c1.personalinformation + "dateofbirth"}
                        isRequired={false}
                    />
                    <FormField
                        control={form.control}
                        name={c1.personalinformation + "placeofbirth"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">
                                    Place of birth
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
                        name={c1.personalinformation + "sex"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">Sex</FormLabel>
                                <SelectOption onChange={field.onChange}>
                                    <SelectOptionTrigger>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left justify-between font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                                                    !field.value &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                <span>
                                                    {field.value ??
                                                        "Select sex"}
                                                </span>
                                                <ChevronDown className="size-4" />
                                            </Button>
                                        </FormControl>
                                    </SelectOptionTrigger>
                                    <SelectOptionContent>
                                        <SelectOptionItem value="Male" />
                                        <SelectOptionItem value="Female" />
                                    </SelectOptionContent>
                                </SelectOption>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2.5">
                        <FormField
                            control={form.control}
                            name={c1.personalinformation + "civilstatus.status"}
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Civil status</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Single" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Single
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Married" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Married
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Widowed" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Widowed
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Separated" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Separated
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Others" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Others
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={
                                c1.personalinformation +
                                "civilstatus.otherstatus"
                            }
                            disabled={
                                form.watch(
                                    "c1.personalinformation.civilstatus.status"
                                ) !== "Others"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        If civil status is others:
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
                    <div className="flex flex-col justify-between">
                        <FormField
                            control={form.control}
                            name={c1.personalinformation + "height"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Height (m)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="form-input"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={c1.personalinformation + "weight"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Weight (kg)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="form-input"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={c1.personalinformation + "bloodtype"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Blood type
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="form-input"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormField
                        control={form.control}
                        name={c1.personalinformation + "gsisid"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">
                                    GSIS ID no.
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={c1.personalinformation + "pagibigid"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">
                                    Pag-ibig ID no.
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={c1.personalinformation + "philhealth"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">
                                    Philhealth no.
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormField
                        control={form.control}
                        name={c1.personalinformation + "sss"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">
                                    SSS no.
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={c1.personalinformation + "tin"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">
                                    TIN no.
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={c1.personalinformation + "agencyemployee"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">
                                    Agency employee no.
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="">
                    <FormField
                        control={form.control}
                        name={c1.personalinformation + "citizenship.citizen"}
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Citizenship</FormLabel>
                                <FormDescription className="!mt-0 text-xs">
                                    If holder of dual citizenship, please
                                    indicate the details.
                                </FormDescription>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Filipino" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Filipino
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Dual Citizenship" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Dual Citizenship
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex [@media(min-width:1070px)]:flex-row flex-col gap-5 [@media(min-width:1070px)]:items-center [@media(max-width:1070px)]:mt-3 ml-3 sm:ml-7">
                        <FormField
                            control={form.control}
                            name={c1.personalinformation + "citizenship.dualby"}
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex gap-5 disabled:opacity-0"
                                            disabled={
                                                form.watch(
                                                    c1.personalinformation +
                                                        "citizenship.citizen"
                                                ) !== "Dual Citizenship"
                                            }
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="by birth" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    by birth
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="by naturalization" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    by naturalization
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={
                                c1.personalinformation +
                                "citizenship.dualcitizencountry"
                            }
                            disabled={
                                form.watch(
                                    c1.personalinformation +
                                        "citizenship.citizen"
                                ) !== "Dual Citizenship"
                            }
                            render={({ field }) => (
                                <FormItem className="">
                                    <SelectOption onChange={field.onChange}>
                                        <SelectOptionTrigger>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full sm:w-96 pl-3 text-left justify-between font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                                                        !field.value &&
                                                            "text-muted-foreground"
                                                    )}
                                                    disabled={
                                                        form.watch(
                                                            c1.personalinformation +
                                                                "citizenship.citizen"
                                                        ) !== "Dual Citizenship"
                                                    }
                                                >
                                                    <span>
                                                        {field.value ??
                                                            "Please indicate country"}
                                                    </span>
                                                    <ChevronDown className="size-4" />
                                                </Button>
                                            </FormControl>
                                        </SelectOptionTrigger>
                                        <SelectOptionContent>
                                            <ScrollArea className="h-96">
                                                {COUNTRIES.map(
                                                    (country, index) => (
                                                        <SelectOptionItem
                                                            key={index}
                                                            value={country}
                                                        />
                                                    )
                                                )}
                                            </ScrollArea>
                                        </SelectOptionContent>
                                    </SelectOption>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="">
                    <FormLabel className="uppercase">
                        Residential Address
                    </FormLabel>
                    <div className="grid [@media(min-width:1156px)]:grid-cols-3 sm:grid-cols-2 gap-3 mt-2">
                        <FormField
                            control={form.control}
                            name={
                                c1.personalinformation +
                                "residentialaddress.houselotblockno"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
                                        House/Block/Lot No.
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
                                c1.personalinformation +
                                "residentialaddress.street"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">Street</FormLabel>
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
                                c1.personalinformation +
                                "residentialaddress.subdivision"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
                                        Subdivision/Village
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
                                c1.personalinformation +
                                "residentialaddress.barangay"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Barangay
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
                                c1.personalinformation +
                                "residentialaddress.citymunicipality"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        City/Municipality
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
                                c1.personalinformation +
                                "residentialaddress.province"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Province
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
                                c1.personalinformation +
                                "residentialaddress.zipcode"
                            }
                            render={({ field }) => (
                                <FormItem className="[@media(min-width:1156px)]:col-span-3 [@media(min-width:1156px)]:mx-auto">
                                    <FormLabel className="required">
                                        ZIP code
                                    </FormLabel>
                                    <FormControl>
                                        <NumberInput
                                            {...field}
                                            className="form-input [@media(min-width:1156px)]:w-52"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="">
                    <FormLabel className="uppercase">
                        Permanent Address
                    </FormLabel>
                    <div className="grid [@media(min-width:1156px)]:grid-cols-3 sm:grid-cols-2 gap-3 mt-2">
                        <FormField
                            control={form.control}
                            name={
                                c1.personalinformation +
                                "permanentaddress.houselotblockno"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
                                        House/Block/Lot No.
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
                                c1.personalinformation +
                                "permanentaddress.street"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">Street</FormLabel>
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
                                c1.personalinformation +
                                "permanentaddress.subdivision"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
                                        Subdivision/Village
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
                                c1.personalinformation +
                                "permanentaddress.barangay"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Barangay
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
                                c1.personalinformation +
                                "permanentaddress.citymunicipality"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        City/Municipality
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
                                c1.personalinformation +
                                "permanentaddress.province"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Province
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
                                c1.personalinformation +
                                "permanentaddress.zipcode"
                            }
                            render={({ field }) => (
                                <FormItem className="[@media(min-width:1156px)]:col-span-3 [@media(min-width:1156px)]:mx-auto">
                                    <FormLabel className="required">
                                        ZIP code
                                    </FormLabel>
                                    <FormControl>
                                        <NumberInput
                                            {...field}
                                            className="form-input [@media(min-width:1156px)]:w-52"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                    <FormField
                        control={form.control}
                        name={c1.personalinformation + "telephone"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telephone no.</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={c1.personalinformation + "mobile"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">
                                    Mobile no.
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
                        name={c1.personalinformation + "email"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email address (if any)</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default PersonalInformation;
