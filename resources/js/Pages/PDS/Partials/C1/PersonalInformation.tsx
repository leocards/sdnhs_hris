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
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { COUNTRIES } from "@/country";
import { ScrollArea } from "@/Components/ui/scroll-area";
import NumberInput from "@/Components/NumberInput";
import { CalendarInput } from "./FamilyBackground";
import { Checkbox } from "@/Components/ui/checkbox";
import { bloodTypes } from "../c1types";
import { useWatch } from "react-hook-form";

type PersonalInformationProps = {
    form: any;
};

type PROVINCE = {
    code: string
    name: string
    regionCode: string
    islandGroupCode: string
}

type CITYMUNICIPALITY = {
    code: string
    name: string
    oldName: string
    isCapital: boolean
    isCity: boolean
    isMunicipality: boolean
    districtCode: string
    provinceCode: string
    regionCode: string
    islandGroupCode: string
}

type BARANGAY = {
    code: string
    name: string
    oldName: string
    subMunicipalityCode: string
    cityCode: string
    municipalityCode: string
    districtCode: string
    provinceCode: string
    regionCode: string
    islandGroupCode: string
}

async function getApiAddress<T>(route: string, setData: (data: Array<T>) => void) {
    try {
        const response = await window.axios.get(route);

        setData(response.data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({ form }) => {
    const watchCitizenship = form.watch("citizenship.citizen");

    const watchCiviStatus = form.watch("civilstatus.status");

    const watchResidential = useWatch({
        control: form.control, name: "residentialaddress"
    })

    const watchIsSameResidential = form.watch(
        "permanentaddress.isSameResidential"
    );

    useEffect(() => {
        if (watchCitizenship !== "Dual Citizenship") {
            form.setValue("citizenship.dualby", null);
            form.setValue("citizenship.dualcitizencountry", null);
            form.clearErrors([
                "citizenship.dualby",
                "citizenship.dualcitizencountry",
            ]);
        }

        if (watchCiviStatus !== "Others") {
            form.setValue("civilstatus.otherstatus", "");
            form.clearErrors(["civilstatus.otherstatus"]);
        }
    }, [watchCitizenship, watchCiviStatus, form]);

    useEffect(() => {
        if(watchIsSameResidential) {
            form.setValue("permanentaddress", {
                isSameResidential: watchIsSameResidential,
                houselotblockno: form.getValues('residentialaddress.houselotblockno'),
                street: form.getValues('residentialaddress.street'),
                subdivision: form.getValues('residentialaddress.subdivision'),
                barangay: form.getValues('residentialaddress.barangay'),
                citymunicipality: form.getValues('residentialaddress.citymunicipality'),
                province: form.getValues('residentialaddress.province'),
                zipcode: form.getValues('residentialaddress.zipcode')
            }, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            })
        }
    }, [watchResidential, watchIsSameResidential])

    return (
        <div className="space-y-4" id="personalInformation">
            <div className="font-medium uppercase italic">
                I. PERSONAL INFORMATION
            </div>

            <div className="space-y-4">
                <div className="grid [@media(min-width:1156px)]:grid-cols-4 sm:grid-cols-2 gap-3">
                    <FormField
                        control={form.control}
                        name={"surname"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">
                                    Surname
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input uppercase" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={"firstname"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">
                                    First name
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input uppercase" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={"middlename"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">Middle name</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input uppercase" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={"extensionname"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">
                                    Extension name (JR., SR)
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input uppercase" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid [@media(min-width:1156px)]:grid-cols-3 sm:grid-cols-2 gap-3">
                    <CalendarInput
                        form={form}
                        name={"dateofbirth"}
                        isRequired={false}
                    />
                    <FormField
                        control={form.control}
                        name={"placeofbirth"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">
                                    Place of birth
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input uppercase" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={"sex"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">Sex</FormLabel>
                                <SelectOption
                                    onChange={field.onChange}
                                    initialValue={field.value}
                                >
                                    <SelectOptionTrigger>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left justify-between font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring uppercase",
                                                    !field.value &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                <span>
                                                    {field.value === ""
                                                        ? "Select sex"
                                                        : field.value}
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
                            name={"civilstatus.status"}
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Civil status</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1 uppercase"
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
                            name={"civilstatus.otherstatus"}
                            disabled={
                                form.watch("civilstatus.status") !== "Others"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        If civil status is others:
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="form-input uppercase"
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
                            name={"height"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Height (m)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="form-input uppercase"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={"weight"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Weight (kg)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="form-input uppercase"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={"bloodtype"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Blood type
                                    </FormLabel>
                                    <SelectOption
                                        onChange={field.onChange}
                                        initialValue={field.value}
                                    >
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
                                                        {field.value === "" ||
                                                        !field.value
                                                            ? "Select blood type"
                                                            : field.value}
                                                    </span>
                                                    <ChevronDown className="size-4" />
                                                </Button>
                                            </FormControl>
                                        </SelectOptionTrigger>
                                        <SelectOptionContent>
                                            <ScrollArea>
                                                {bloodTypes.map((bt, index) => (
                                                    <SelectOptionItem
                                                        value={bt}
                                                        key={index}
                                                    />
                                                ))}
                                            </ScrollArea>
                                        </SelectOptionContent>
                                    </SelectOption>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormField
                        control={form.control}
                        name={"gsisid"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">GSIS ID no.</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input uppercase" />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={"pagibigid"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">
                                    Pag-ibig ID no.
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input uppercase" />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={"philhealth"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">
                                    Philhealth no.
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input uppercase" />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormField
                        control={form.control}
                        name={"sss"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">SSS no.</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input uppercase" />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={"tin"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">TIN no.</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input uppercase" />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={"agencyemployee"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">
                                    Agency employee no.
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input uppercase" />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="">
                    <FormField
                        control={form.control}
                        name={"citizenship.citizen"}
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="required">
                                    Citizenship
                                </FormLabel>
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
                            name={"citizenship.dualby"}
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex gap-5 disabled:opacity-0"
                                            disabled={
                                                form.watch(
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
                            name={"citizenship.dualcitizencountry"}
                            disabled={
                                form.watch("citizenship.citizen") !==
                                "Dual Citizenship"
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
                                            <ScrollArea className="h-72">
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
                    <Address form={form} name="residentialaddress" />
                </div>

                <div className="">
                    <div className="flex items-center">
                        <FormLabel className="uppercase">
                            Permanent Address
                        </FormLabel>
                        <label
                            htmlFor="same_address"
                            className="text-xs font-medium flex items-center ml-2 gap-1"
                        >
                            <Checkbox
                                id="same_address"
                                checked={form.watch('permanentaddress.isSameResidential')}
                                onCheckedChange={(checked) => {
                                    form.setValue(
                                        "permanentaddress.isSameResidential",
                                        checked
                                    );
                                }}
                            />
                            Same as residential
                        </label>
                    </div>
                    <Address form={form} name="permanentaddress" />
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                    <FormField
                        control={form.control}
                        name={"telephone"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telephone no.</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input uppercase" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={"mobile"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">
                                    Mobile no.
                                </FormLabel>
                                <FormControl>
                                    <NumberInput
                                        {...field}
                                        className="form-input uppercase"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={"email"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email address (if any)</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input uppercase" />
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

type ADDRESSTYPE = {
    form: any
    name: string
}

const Address: React.FC<ADDRESSTYPE> = ({ form, name }) => {
    const [provinces, setProvinces] = useState<PROVINCE[]>([])
    const [municipalityCity, setMunicipalityCity] = useState<CITYMUNICIPALITY[]>([])
    const [barangays, setBarangay] = useState<BARANGAY[]>([])

    const watchProvince = form.watch(name+".province")
    const watchCityMunicipality = form.watch(name+".citymunicipality")

    const onProvinceSelect = (provinceCode?: string) => {
        getApiAddress<CITYMUNICIPALITY>("https://psgc.gitlab.io/api/provinces/"+provinceCode+"/cities-municipalities.json", setMunicipalityCity)
        form.setValue(name+".citymunicipality", "")
        form.setValue(name+".barangay", "")
    }

    const onCityMunicipalitySelect = (CMCode: string) => {
        getApiAddress<BARANGAY>("https://psgc.gitlab.io/api/cities-municipalities/"+CMCode+"/barangays.json", setBarangay)
        form.setValue(name+".barangay", "")
    }

    useEffect(() => {
        getApiAddress<PROVINCE>("https://psgc.gitlab.io/api/provinces.json", setProvinces)
    }, [])

    return (
        <div className="grid [@media(min-width:1156px)]:grid-cols-3 sm:grid-cols-2 gap-3 mt-2">
            <FormField
                control={form.control}
                name={name+".houselotblockno"}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="">House/Block/Lot No.</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                className="form-input uppercase"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={name+".street"}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="">Street</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                className="form-input uppercase"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={name+".subdivision"}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="">Subdivision/Village</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                className="form-input uppercase"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={name+".barangay"}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="required">Barangay</FormLabel>
                        <SelectOption
                            onChange={field.onChange}
                            initialValue={field.value}
                        >
                            <SelectOptionTrigger>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left justify-between disabled:!opacity-100 disabled:pointer-events-auto disabled:hover:text-foreground/60 disabled:cursor-not-allowed font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                                            !field.value &&
                                                "text-muted-foreground",
                                            "uppercase"
                                        )}
                                        disabled={!(watchCityMunicipality)}
                                    >
                                        <span>
                                            {field.value === "" || !field.value
                                                ? "Select barangay"
                                                : field.value}
                                        </span>
                                        <ChevronDown className="size-4" />
                                    </Button>
                                </FormControl>
                            </SelectOptionTrigger>
                            <SelectOptionContent>
                                <ScrollArea className="h-96">
                                    {barangays.map((barangay, index) => (
                                        <SelectOptionItem
                                            value={barangay.name}
                                            key={index}
                                        />
                                    ))}
                                </ScrollArea>
                            </SelectOptionContent>
                        </SelectOption>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={name+".citymunicipality"}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="required">
                            City/Municipality
                        </FormLabel>
                        <SelectOption
                            onChange={field.onChange}
                            initialValue={field.value}
                        >
                            <SelectOptionTrigger>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left justify-between font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                                            !field.value &&
                                                "text-muted-foreground",
                                            "uppercase"
                                        )}
                                        disabled={!(watchProvince)}
                                    >
                                        <span>
                                            {field.value === "" || !field.value
                                                ? "Select Municipality/City"
                                                : field.value}
                                        </span>
                                        <ChevronDown className="size-4" />
                                    </Button>
                                </FormControl>
                            </SelectOptionTrigger>
                            <SelectOptionContent>
                                <ScrollArea className="h-96">
                                    {municipalityCity.map((mc, index) => (
                                        <SelectOptionItem
                                            value={mc.name}
                                            key={index}
                                            onSelect={() => {
                                                onCityMunicipalitySelect(
                                                    mc.code,
                                                );
                                            }}
                                        />
                                    ))}
                                </ScrollArea>
                            </SelectOptionContent>
                        </SelectOption>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={name+".province"}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="required">Province</FormLabel>
                        <SelectOption
                            onChange={field.onChange}
                            initialValue={field.value}
                        >
                            <SelectOptionTrigger>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left justify-between font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                                            !field.value &&
                                                "text-muted-foreground",
                                            "uppercase"
                                        )}
                                    >
                                        <span>
                                            {field.value === "" || !field.value
                                                ? "Select province"
                                                : field.value}
                                        </span>
                                        <ChevronDown className="size-4" />
                                    </Button>
                                </FormControl>
                            </SelectOptionTrigger>
                            <SelectOptionContent>
                                <ScrollArea className="h-96">
                                    {provinces.map((prov, index) => (
                                        <SelectOptionItem
                                            value={prov.name}
                                            key={index}
                                            onSelect={() => {
                                                onProvinceSelect(prov.code);
                                            }}
                                        />
                                    ))}
                                </ScrollArea>
                            </SelectOptionContent>
                        </SelectOption>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={name+".zipcode"}
                render={({ field }) => (
                    <FormItem className="[@media(min-width:1156px)]:col-span-3 [@media(min-width:1156px)]:mx-auto">
                        <FormLabel className="required">ZIP code</FormLabel>
                        <FormControl>
                            <NumberInput
                                {...field}
                                className="form-input uppercase [@media(min-width:1156px)]:w-52"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}

export default PersonalInformation;
