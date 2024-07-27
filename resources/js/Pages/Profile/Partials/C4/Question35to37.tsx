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

export default function Question35to37({ form }: { form: any }) {
    return (
        <>
            <div className="flex items-start gap-3 mt-10">
                35.
                <div className="">
                    <Choices
                        form={form}
                        label="a. Have you ever been found guilty of any administrative offense?"
                        name="c4.q35.choicea"
                        className=""
                    />

                    <Choices
                        form={form}
                        className="mt-4"
                        label="b. within the fourth degree (for Local Government Unit - Career Employees)?"
                        name="c4.q35.choiceb.choices"
                    />
                    <div className="mt-4">
                        <div className="ml-5">
                            <div>If YES, give details:</div>
                        </div>
                        <FormField
                            control={form.control}
                            name="c4.q35.choiceb.datefiled"
                            render={({ field }) => (
                                <FormItem className="ml-5">
                                    <FormLabel>Date Filed:</FormLabel>
                                    <DatePicker
                                        field={field}
                                        isForm
                                        disabled={
                                            form.watch(
                                                "c4.q35.choiceb.choices"
                                            ) !== "Yes"
                                        }
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="c4.q35.choiceb.statusofcase"
                            disabled={
                                form.watch("c4.q35.choiceb.choices") !== "Yes"
                            }
                            render={({ field }) => (
                                <FormItem className="ml-5 mt-4">
                                    <FormLabel>Status of Case/s:</FormLabel>
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
                </div>
            </div>

            <div className="flex items-start gap-3 mt-10">
                36.
                <div className="">
                    <Choices
                        form={form}
                        label="Have you ever been convicted of any crime or violation of any law, decree, ordinance or regulation by any court or tribunal?"
                        name="c4.q36.choices"
                        className=""
                        detailsName="c4.q36.details"
                        disabled={form.watch('c4.q36.choices') !== "Yes"}
                    />
                </div>
            </div>
            <div className="flex items-start gap-3 mt-10">
                37.
                <div className="">
                    <Choices
                        form={form}
                        label="Have you ever been separated from the service in any of the following modes: resignation, retirement, dropped from the rolls, dismissal, termination, end of term, finished contract or phased out (abolition) in the public or private sector?"
                        name="c4.q36.choices"
                        className=""
                        detailsName="c4.q36.details"
                        disabled={form.watch('c4.q36.choices') !== "Yes"}
                    />
                </div>
            </div>
        </>
    );
}
