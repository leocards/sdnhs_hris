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

export default function Question38({ form }: { form: any }) {
    const watch38a = form.watch('q38.choicea.choices')
    const watch38b = form.watch('q38.choiceb.choices')

    useEffect(() => {
        if(watch38a === "No"){
            form.setValue('q38.choicea.details', '')
            form.clearErrors('q38.choicea.details', '')
        }
        if(watch38b === "No"){
            form.setValue('q38.choiceb.details', '')
            form.clearErrors('q38.choiceb.details', '')
        }

    }, [watch38a, watch38b])

    return (
        <div className="flex items-start gap-3 mt-10">
            &#8226;
            <div className="">
                <Choices
                    form={form}
                    label="a. Have you ever been a candidate in a national or local election held within the last year (except Barangay election)?"
                    name="q38.choicea.choices"
                >
                    <ChoiceDetails
                        form={form}
                        name="q38.choicea.details"
                        disabled={watch38a !== "Yes"}
                    />
                </Choices>

                <Choices
                    form={form}
                    className="mt-4"
                    label="b. Have you resigned from the government service during the three (3)-month period before the last election to promote/actively campaign for a national or local candidate?"
                    name="q38.choiceb.choices"
                >
                    <ChoiceDetails
                        form={form}
                        name="q38.choiceb.details"
                        disabled={watch38b !== "Yes"}
                    />
                </Choices>
            </div>
        </div>
    );
}
