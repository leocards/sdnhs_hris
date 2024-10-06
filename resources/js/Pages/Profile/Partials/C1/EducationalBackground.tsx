import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import NumberInput from "@/Components/NumberInput";
import { Checkbox } from "@/Components/ui/checkbox";
import { useFieldArray } from "react-hook-form";
import EducationForm from "./EducationForm";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";

type EducationalBackgroundProps = {
    form: any;
};

export default function EducationalBackground({
    form,
}: EducationalBackgroundProps) {
    const elementary = useFieldArray({
        control: form.control,
        name: "elementary",
    });
    const secondary = useFieldArray({
        control: form.control,
        name: "secondary",
    });
    const vocational = useFieldArray({
        control: form.control,
        name: "vocational",
    });
    const college = useFieldArray({
        control: form.control,
        name: "college",
    });
    const graduate = useFieldArray({
        control: form.control,
        name: "graduatestudies",
    });

    return (
        <div className="mt-10 space-y-4" id="educationalBackground">
            <div className="font-medium uppercase italic">
                III. EDUCATIONAL BACKGROUND
            </div>

            <div className="space-y-4 border p-3 rounded-md shadow-sm">
                <FormLabel>
                    <span className="opacity-60">ELEMENTARY</span>
                </FormLabel>
                <div className="divide-y-2 space-y-4">
                    {elementary.fields.map((field, index) => (
                        <div className={cn(index > 0 && "pt-4")} key={field.id}>
                            <EducationForm
                                form={form}
                                index={index}
                                educationLevel="elementary"
                            />
                        </div>
                    ))}
                </div>
                <Button
                    className="w-full"
                    type="button"
                    onClick={() => {
                        elementary.append({
                            ebid: null,
                            nameofschool: "",
                            basiceddegreecourse: "",
                            period: { from: "", to: "" },
                            highestlvl: "",
                            yeargraduated: "",
                            scholarshiphonor: "",
                        });
                    }}
                >
                    Add new row
                </Button>
            </div>

            <div className="space-y-4 border p-3 rounded-md shadow-sm">
                <FormLabel>
                    <span className="opacity-60">SECONDARY</span>
                </FormLabel>
                <div className="divide-y-2 space-y-4">
                    {secondary.fields.map((field, index) => (
                        <div className={cn(index > 0 && "pt-4")} key={field.id}>
                            <EducationForm
                                form={form}
                                index={index}
                                educationLevel="secondary"
                            />
                        </div>
                    ))}
                </div>
                <Button
                    className="w-full"
                    type="button"
                    onClick={() => {
                        secondary.append({
                            ebid: null,
                            nameofschool: "",
                            basiceddegreecourse: "",
                            period: { from: "", to: "" },
                            highestlvl: "",
                            yeargraduated: "",
                            scholarshiphonor: "",
                        });
                    }}
                >
                    Add new row
                </Button>
            </div>

            <div className="space-y-4 border p-3 rounded-md shadow-sm">
                <FormLabel>
                    <span className="opacity-60">VOCATIONAL/TRADE COURSE</span>
                </FormLabel>
                <div className="divide-y-2 space-y-4">
                    {vocational.fields.map((field, index) => (
                        <div className={cn(index > 0 && "pt-4")} key={field.id}>
                            <EducationForm
                                form={form}
                                index={index}
                                educationLevel="vocational"
                            />
                        </div>
                    ))}
                </div>
                <Button
                    className="w-full"
                    type="button"
                    onClick={() => {
                        vocational.append({
                            ebid: null,
                            nameofschool: "",
                            basiceddegreecourse: "",
                            period: { from: "", to: "" },
                            highestlvl: "",
                            yeargraduated: "",
                            scholarshiphonor: "",
                        });
                    }}
                >
                    Add new row
                </Button>
            </div>

            <div className="space-y-4 border p-3 rounded-md shadow-sm">
                <FormLabel>
                    <span className="opacity-60">COLLEGE</span>
                </FormLabel>
                <div className="divide-y-2 space-y-4">
                    {college.fields.map((field, index) => (
                        <div className={cn(index > 0 && "pt-4")} key={field.id}>
                            <EducationForm
                                form={form}
                                index={index}
                                educationLevel="college"
                            />
                        </div>
                    ))}
                </div>
                <Button
                    className="w-full"
                    type="button"
                    onClick={() => {
                        college.append({
                            ebid: null,
                            nameofschool: "",
                            basiceddegreecourse: "",
                            period: { from: "", to: "" },
                            highestlvl: "",
                            yeargraduated: "",
                            scholarshiphonor: "",
                        });
                    }}
                >
                    Add new row
                </Button>
            </div>

            <div className="space-y-4 border p-3 rounded-md shadow-sm">
                <FormLabel>
                    <span className="opacity-60">GRADUATE STUDIES</span>
                </FormLabel>
                <div className="divide-y-2 space-y-4">
                    {graduate.fields.map((field, index) => (
                        <div className={cn(index > 0 && "pt-4")} key={field.id}>
                            <EducationForm
                                form={form}
                                index={index}
                                educationLevel="graduatestudies"
                            />
                        </div>
                    ))}
                </div>
                <Button
                    className="w-full"
                    type="button"
                    onClick={() => {
                        graduate.append({
                            ebid: null,
                            nameofschool: "",
                            basiceddegreecourse: "",
                            period: { from: "", to: "" },
                            highestlvl: "",
                            yeargraduated: "",
                            scholarshiphonor: "",
                        });
                    }}
                >
                    Add new row
                </Button>
            </div>

            <div className="flex items-center gap-2.5"></div>
        </div>
    );
}
