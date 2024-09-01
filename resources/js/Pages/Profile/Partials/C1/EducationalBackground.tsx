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

type EducationalBackgroundProps = {
    form: any;
};

export default function EducationalBackground({
    form,
}: EducationalBackgroundProps) {
    return (
        <div className="mt-10 space-y-4" id="educationalBackground">
            <div className="font-medium uppercase italic">
                III. EDUCATIONAL BACKGROUND
            </div>

            <div className="space-y-4">
                <FormLabel
                    htmlFor="elementary"
                    className="items-center flex gap-2 w-fit"
                >
                    <Checkbox
                        id="elementary"
                        onCheckedChange={(checked) => {
                            form.setValue(
                                "attained.isElementary",
                                checked,
                                { shouldDirty: true }
                            );
                        }}
                        checked={form.watch('attained.isElementary')}
                    />
                    <span className="opacity-60">ELEMENTARY</span>
                </FormLabel>
                {form.watch("attained.isElementary") ===
                    true && (
                    <>
                        <div className="grid [@media(min-width:1256px)]:grid-cols-[1fr,1fr,repeat(2,7rem)] sm:grid-cols-2 gap-3">
                            <FormField
                                control={form.control}
                                name={
                                    "elementary.nameofschool"
                                }
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="required">
                                            Name of School (write in full)
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
                                    "elementary.basiceddegreecourse"
                                }
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="">
                                            Basic Education/Degree/Course (write
                                            in full)
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
                                    "elementary.period.from"
                                }
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="">From</FormLabel>
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
                                name={
                                    "elementary.period.to"
                                }
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="">To</FormLabel>
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
                        </div>
                        <div className="grid [@media(min-width:1256px)]:grid-cols-3 sm:grid-cols-2 gap-3">
                            <FormField
                                control={form.control}
                                name={
                                    "elementary.highestlvl"
                                }
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Highest level/Units earned
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
                                    "elementary.yeargraduated"
                                }
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="required">
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
                                name={
                                    "elementary.scholarshiphonor"
                                }
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Scholarship/Academic honors received
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
                    </>
                )}
            </div>

            <div className="space-y-4 pt-5">
                <FormLabel
                    htmlFor="secondary"
                    className="items-center flex gap-2 w-fit"
                >
                    <Checkbox
                        id="secondary"
                        onCheckedChange={(checked) => {
                            form.setValue(
                                "attained.isSecondary",
                                checked,
                                { shouldDirty: true }
                            );
                        }}
                        checked={form.watch('attained.isSecondary')}
                    />
                    <span className="opacity-60">SECONDARY</span>
                </FormLabel>
                {form.watch("attained.isSecondary") === true && <>
                    <div className="grid [@media(min-width:1256px)]:grid-cols-[1fr,1fr,repeat(2,7rem)] sm:grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name={"secondary.nameofschool"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
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
                            name={
                                "secondary.basiceddegreecourse"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
                                        Basic Education/Degree/Course (write in
                                        full)
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
                            name={"secondary.period.from"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">From</FormLabel>
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
                            name={"secondary.period.to"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">To</FormLabel>
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
                    </div>
                    <div className="grid [@media(min-width:1256px)]:grid-cols-3 sm:grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name={"secondary.highestlvl"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Highest level/Units earned
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
                            name={"secondary.yeargraduated"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
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
                            name={
                                "secondary.scholarshiphonor"
                            }
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
                </>}
            </div>

            <div className="space-y-4 pt-5">
                <FormLabel
                    htmlFor="vocational"
                    className="items-center flex gap-2 w-fit"
                >
                    <Checkbox
                        id="vocational"
                        onCheckedChange={(checked) => {
                            form.setValue(
                                "attained.isVocational",
                                checked,
                                { shouldDirty: true }
                            );
                        }}
                        checked={form.watch('attained.isVocational')}
                    />
                    <span className="opacity-60">VOCATIONAL/TRADE COURSE</span>
                </FormLabel>
                {form.watch("attained.isVocational") === true && <>
                    <div className="grid [@media(min-width:1256px)]:grid-cols-[1fr,1fr,repeat(2,7rem)] sm:grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name={"vocational.nameofschool"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
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
                            name={
                                "vocational.basiceddegreecourse"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
                                        Basic Education/Degree/Course (write in
                                        full)
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
                            name={"vocational.period.from"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">From</FormLabel>
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
                            name={"vocational.period.to"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">To</FormLabel>
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
                    </div>
                    <div className="grid [@media(min-width:1256px)]:grid-cols-3 sm:grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name={"vocational.highestlvl"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Highest level/Units earned
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
                            name={"vocational.yeargraduated"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
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
                            name={
                                "vocational.scholarshiphonor"
                            }
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
                </>}
            </div>

            <div className="space-y-4 pt-5">
                <FormLabel
                    htmlFor="college"
                    className="items-center flex gap-2 w-fit"
                >
                    <Checkbox
                        id="college"
                        onCheckedChange={(checked) => {
                            form.setValue(
                                "attained.isCollege",
                                checked,
                                { shouldDirty: true }
                            );
                        }}
                        checked={form.watch('attained.isCollege')}
                    />
                    <span className="opacity-60">COLLEGE</span>
                </FormLabel>
                {form.watch("attained.isCollege") === true && <>
                    <div className="grid [@media(min-width:1256px)]:grid-cols-[1fr,1fr,repeat(2,7rem)] sm:grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name={"college.nameofschool"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
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
                            name={
                                "college.basiceddegreecourse"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
                                        Basic Education/Degree/Course (write in
                                        full)
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
                            name={"college.period.from"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">From</FormLabel>
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
                            name={"college.period.to"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">To</FormLabel>
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
                    </div>
                    <div className="grid [@media(min-width:1256px)]:grid-cols-3 sm:grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name={"college.highestlvl"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Highest level/Units earned
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
                            name={"college.yeargraduated"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
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
                            name={"college.scholarshiphonor"}
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
                </>}
            </div>

            <div className="space-y-4 pt-5">
                <FormLabel
                    htmlFor="graduate"
                    className="items-center flex gap-2 w-fit"
                >
                    <Checkbox
                        id="graduate"
                        onCheckedChange={(checked) => {
                            form.setValue(
                                "attained.isGraduate",
                                checked,
                                { shouldDirty: true }
                            );
                        }}
                        checked={form.watch('attained.isGraduate')}
                    />
                    <span className="opacity-60">GRADUATE STUDIES</span>
                </FormLabel>
                {form.watch("attained.isGraduate") === true && <>
                    <div className="grid [@media(min-width:1256px)]:grid-cols-[1fr,1fr,repeat(2,7rem)] sm:grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name={
                                "graduatestudies.nameofschool"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
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
                            name={
                                "graduatestudies.basiceddegreecourse"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
                                        Basic Education/Degree/Course (write in
                                        full)
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
                            name={
                                "graduatestudies.period.from"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">From</FormLabel>
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
                            name={"graduatestudies.period.to"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">To</FormLabel>
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
                    </div>
                    <div className="grid [@media(min-width:1256px)]:grid-cols-3 sm:grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name={
                                "graduatestudies.highestlvl"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Highest level/Units earned
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
                            name={
                                "graduatestudies.yeargraduated"
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
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
                            name={
                                "graduatestudies.scholarshiphonor"
                            }
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
                </>}
            </div>

            <div className="flex items-center gap-2.5"></div>
        </div>
    );
}
