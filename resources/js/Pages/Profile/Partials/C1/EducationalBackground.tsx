import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { c1 } from "../../type";
import { Input } from "@/Components/ui/input";

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
                <FormLabel className="opacity-60">ELEMENTARY</FormLabel>
                <div className="grid grid-cols-[1fr,1fr,repeat(2,7rem)] gap-3">
                    <FormField 
                        control={form.control}
                        name={c1.educationalbackground+"elementary.nameofschool"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">Name of School (write in full)</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name={c1.educationalbackground+"elementary.basiceddegreecourse"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">Basic Education/Degree/Course (write in full)</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name={c1.educationalbackground+"elementary.period.from"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">From</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name={c1.educationalbackground+"elementary.period.to"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">To</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <FormField
                        control={form.control}
                        name={c1.educationalbackground+"elementary.highestlvl"}
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
                        name={c1.educationalbackground+"elementary.yeargraduated"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">Year graduate</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={c1.educationalbackground+"elementary.scholarshiphonor"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Scholarship/Academic honors received</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <div className="space-y-4">
                <FormLabel className="opacity-60">SECONDARY</FormLabel>
                <div className="grid grid-cols-[1fr,1fr,repeat(2,7rem)] gap-3">
                    <FormField 
                        control={form.control}
                        name={c1.educationalbackground+"secondary.nameofschool"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">Name of School (write in full)</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name={c1.educationalbackground+"secondary.basiceddegreecourse"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">Basic Education/Degree/Course (write in full)</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name={c1.educationalbackground+"secondary.period.from"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">From</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name={c1.educationalbackground+"secondary.period.to"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">To</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <FormField
                        control={form.control}
                        name={c1.educationalbackground+"secondary.highestlvl"}
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
                        name={c1.educationalbackground+"secondary.yeargraduated"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">Year graduate</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={c1.educationalbackground+"secondary.scholarshiphonor"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Scholarship/Academic honors received</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <div className="space-y-4">
                <FormLabel className="opacity-60">VOCATIONAL/TRADE COURSE</FormLabel>
                <div className="grid grid-cols-[1fr,1fr,repeat(2,7rem)] gap-3">
                    <FormField 
                        control={form.control}
                        name={c1.educationalbackground+"vocational.nameofschool"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">Name of School (write in full)</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name={c1.educationalbackground+"vocational.basiceddegreecourse"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">Basic Education/Degree/Course (write in full)</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name={c1.educationalbackground+"vocational.period.from"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">From</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name={c1.educationalbackground+"vocational.period.to"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">To</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <FormField
                        control={form.control}
                        name={c1.educationalbackground+"vocational.highestlvl"}
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
                        name={c1.educationalbackground+"vocational.yeargraduated"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">Year graduate</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={c1.educationalbackground+"vocational.scholarshiphonor"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Scholarship/Academic honors received</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <div className="space-y-4">
                <FormLabel className="opacity-60">COLLEGE</FormLabel>
                <div className="grid grid-cols-[1fr,1fr,repeat(2,7rem)] gap-3">
                    <FormField 
                        control={form.control}
                        name={c1.educationalbackground+"college.nameofschool"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">Name of School (write in full)</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name={c1.educationalbackground+"college.basiceddegreecourse"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">Basic Education/Degree/Course (write in full)</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name={c1.educationalbackground+"college.period.from"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">From</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name={c1.educationalbackground+"college.period.to"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">To</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <FormField
                        control={form.control}
                        name={c1.educationalbackground+"college.highestlvl"}
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
                        name={c1.educationalbackground+"college.yeargraduated"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">Year graduate</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={c1.educationalbackground+"college.scholarshiphonor"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Scholarship/Academic honors received</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <div className="space-y-4">
                <FormLabel className="opacity-60">GRADUATE STUDIES</FormLabel>
                <div className="grid grid-cols-[1fr,1fr,repeat(2,7rem)] gap-3">
                    <FormField 
                        control={form.control}
                        name={c1.educationalbackground+"graduatestudies.nameofschool"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">Name of School (write in full)</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name={c1.educationalbackground+"graduatestudies.basiceddegreecourse"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">Basic Education/Degree/Course (write in full)</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name={c1.educationalbackground+"graduatestudies.period.from"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">From</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name={c1.educationalbackground+"graduatestudies.period.to"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">To</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <FormField
                        control={form.control}
                        name={c1.educationalbackground+"graduatestudies.highestlvl"}
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
                        name={c1.educationalbackground+"graduatestudies.yeargraduated"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">Year graduate</FormLabel>
                                <FormControl>
                                    <Input {...field} className="form-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={c1.educationalbackground+"graduatestudies.scholarshiphonor"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Scholarship/Academic honors received</FormLabel>
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
}
