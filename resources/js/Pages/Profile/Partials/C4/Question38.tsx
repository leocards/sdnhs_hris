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

export default function Question38({ form }: { form: any }) {
    return (
        <div className="flex items-start gap-3 mt-10">
            38.
            <div className="">
                <Choices
                    form={form}
                    label="a. Have you ever been a candidate in a national or local election held within the last year (except Barangay election)?"
                    name="c4.q38.choicea.choices"
                    detailsName="c4.q38.choicea.details"
                />

                <Choices
                    form={form}
                    className="mt-4"
                    label="b. Have you resigned from the government service during the three (3)-month period before the last election to promote/actively campaign for a national or local candidate?"
                    name="c4.q38.choiceb.choices"
                    detailsName="c4.q38.choiceb.details"
                />
            </div>
        </div>
    );
}
