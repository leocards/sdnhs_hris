import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Choices } from "./Choices";
import DatePicker from "@/Components/ui/date-picker";
import { Input } from "@/Components/ui/input";

export default function Question39to40({ form }: { form: any }) {
    return (
        <>
            <div className="mt-10">
                <div className="mb-3 flex items-start gap-3">
                    <span>39.</span>
                    Have you acquired the status of an immigrant or permanent
                    resident of another country?
                </div>

                <div className="ml-8">
                    <Choices
                        form={form}
                        label=""
                        name="c4.q39.choices"
                        detailsName="c4.q39.details"
                        disabled={form.watch("c4.q39.choices") !== "Yes"}
                        detailsLabel="If YES, give details (country):"
                    />
                </div>
            </div>

            <div className="mt-10">
                <div className="mb-3 flex items-start gap-3">
                    <span>40.</span>
                    Pursuant to: (a) Indigenous People's Act (RA 8371); (b)
                    Magna Carta for Disabled Persons (RA 7277); and (c) Solo
                    Parents Welfare Act of 2000 (RA 8972), please answer the
                    following items:
                </div>

                <div className="ml-8">
                    <Choices
                        form={form}
                        label="a. Are you a member of any indigenous group?"
                        name="c4.q40.choicea.choices"
                        detailsName="c4.q40.choicea.details"
                        disabled={
                            form.watch("c4.q40.choicea.choices") !== "Yes"
                        }
                        detailsLabel="If YES, please specify:"
                    />

                    <Choices
                        form={form}
                        className="mt-4"
                        label="b. Are you a person with disability?"
                        name="c4.q34.choiceb.choices"
                        detailsName="c4.q34.choiceb.details"
                        disabled={
                            form.watch("c4.q40.choiceb.choices") !== "Yes"
                        }
                        detailsLabel="If YES, please specify ID No:"
                    />

                    <Choices
                        form={form}
                        className="mt-4"
                        label="c. Are you a solo parent?"
                        name="c4.q34.choiceb.choices"
                        detailsName="c4.q34.choiceb.details"
                        disabled={
                            form.watch("c4.q40.choiceb.choices") !== "Yes"
                        }
                        detailsLabel="If YES, please specify ID No:"
                    />
                </div>
            </div>
        </>
    );
}
