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
import { CalendarInput } from "../C1/FamilyBackground";
import { useEffect } from "react";

export default function Question35to37({ form }: { form: any }) {
    const watch35a = form.watch("q35.choicea.choices");
    const watch35b = form.watch("q35.choiceb.choices");
    const watch36 = form.watch("q36.choices");
    const watch37 = form.watch("q37.choices");

    useEffect(() => {
        if (watch35a === "No") {
            form.clearErrors("q35.choicea.details");
            form.setValue('q35.choicea.details', "")
        }
        if (watch35b === "No") {
            form.clearErrors("q35.choiceb.datefiled");
            form.setValue('q35.choiceb.datefiled', undefined, { shouldValidate: true, shouldDirty: true })
            form.clearErrors("q35.choiceb.statusofcase");
            form.setValue('q35.choiceb.statusofcase', "")
        }
        if (watch36 === "No") {
            form.clearErrors("q36.details");
            form.setValue('q36.details', "")
        }
        if (watch37 === "No") {
            form.clearErrors("q37.details");
            form.setValue('q37.details', "")
        }
    }, [watch35a, watch35b, watch36, watch37]);

    return (
        <>
            <div className="flex items-start gap-3 mt-10">
                &#8226;
                <div className="">
                    <Choices
                        form={form}
                        label="a. Have you ever been found guilty of any administrative offense?"
                        name="q35.choicea.choices"
                    >
                        <ChoiceDetails
                            form={form}
                            name="q35.choicea.details"
                            disabled={watch35a !== "Yes"}
                        />
                    </Choices>

                    <Choices
                        form={form}
                        className="mt-4"
                        label="b. Have you been criminally charged before any court?"
                        name="q35.choiceb.choices"
                    />
                    <div className="mt-4">
                        <div className="ml-5">
                            <div>If YES, give details:</div>
                        </div>
                        <div className="ml-5">
                            <CalendarInput
                                name="q35.choiceb.datefiled"
                                form={form.control}
                                label="Date Filed:"
                                isRequired={false}
                                disabled={watch35b !== "Yes"}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="q35.choiceb.statusofcase"
                            disabled={watch35b !== "Yes"}
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
                &#8226;
                <div className="">
                    <Choices
                        form={form}
                        label="Have you ever been convicted of any crime or violation of any law, decree, ordinance or regulation by any court or tribunal?"
                        name="q36.choices"
                        className=""
                        disabled={watch36 !== "Yes"}
                    >
                        <ChoiceDetails
                            form={form}
                            name="q36.details"
                            disabled={watch36 !== "Yes"}
                        />
                    </Choices>
                </div>
            </div>

            <div className="flex items-start gap-3 mt-10">
                &#8226;
                <div className="">
                    <Choices
                        form={form}
                        label="Have you ever been separated from the service in any of the following modes: resignation, retirement, dropped from the rolls, dismissal, termination, end of term, finished contract or phased out (abolition) in the public or private sector?"
                        name="q37.choices"
                        className=""
                        detailsName="q37.details"
                        disabled={watch37 !== "Yes"}
                    >
                        <ChoiceDetails
                            form={form}
                            name="q37.details"
                            disabled={watch37 !== "Yes"}
                        />
                    </Choices>
                </div>
            </div>
        </>
    );
}
