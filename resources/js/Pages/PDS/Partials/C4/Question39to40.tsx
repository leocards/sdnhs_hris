import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { ChoiceDetails, Choices } from "./Choices";
import DatePicker from "@/Components/ui/date-picker";
import { Input } from "@/Components/ui/input";
import { useEffect } from "react";

export default function Question39to40({ form }: { form: any }) {
    const watch39 = form.watch("q39.choices");
    const watch40a = form.watch("q40.choicea.choices");
    const watch40b = form.watch("q40.choiceb.choices");
    const watch40c = form.watch("q40.choicec.choices");

    useEffect(() => {
        if(watch39 === "No"){
            form.setValue('q39.details', '')
            form.clearErrors('q39.details', '')
        }
        if(watch40a === "No"){
            form.setValue('q40.choicea.details', '')
            form.clearErrors('q40.choicea.details', '')
        }
        if(watch40b === "No"){
            form.setValue('q40.choiceb.details', '')
            form.clearErrors('q40.choiceb.details', '')
        }
        if(watch40c === "No"){
            form.setValue('q40.choicec.details', '')
            form.clearErrors('q40.choicec.details', '')
        }
    }, [watch39, watch40a, watch40b, watch40c])

    return (
        <>
            <div className="mt-10">
                <div className="mb-3 flex items-start gap-3">
                    <span>&#8226;</span>
                    Have you acquired the status of an immigrant or permanent
                    resident of another country?
                </div>

                <div className="ml-8">
                    <Choices form={form} label="" name="q39.choices">
                        <ChoiceDetails
                            form={form}
                            name="q39.details"
                            label="If YES, give details (country):"
                            disabled={watch39 !== "Yes"}
                        />
                    </Choices>
                </div>
            </div>

            <div className="mt-10">
                <div className="mb-3 flex items-start gap-3">
                    <span>&#8226;</span>
                    Pursuant to: (a) Indigenous People's Act (RA 8371); (b)
                    Magna Carta for Disabled Persons (RA 7277); and (c) Solo
                    Parents Welfare Act of 2000 (RA 8972), please answer the
                    following items:
                </div>

                <div className="ml-8">
                    <Choices
                        form={form}
                        label="a. Are you a member of any indigenous group?"
                        name="q40.choicea.choices"
                    >
                        <ChoiceDetails
                            form={form}
                            name="q40.choicea.details"
                            label="If YES, please specify:"
                            disabled={watch40a !== "Yes"}
                        />
                    </Choices>

                    <Choices
                        form={form}
                        className="mt-4"
                        label="b. Are you a person with disability?"
                        name="q40.choiceb.choices"
                    >
                        <ChoiceDetails
                            form={form}
                            name="q40.choiceb.details"
                            label="If YES, please specify ID No:"
                            disabled={watch40b !== "Yes"}
                        />
                    </Choices>

                    <Choices
                        form={form}
                        className="mt-4"
                        label="c. Are you a solo parent?"
                        name="q40.choicec.choices"
                    >
                        <ChoiceDetails
                            form={form}
                            name="q40.choicec.details"
                            label="If YES, please specify ID No:"
                            disabled={watch40c !== "Yes"}
                        />
                    </Choices>
                </div>
            </div>
        </>
    );
}
