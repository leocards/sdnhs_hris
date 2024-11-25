import { Dot } from "lucide-react";
import { ChoiceDetails, Choices } from "./Choices";
import { useEffect } from "react";

export default function Question34({ form }: { form: any }) {
    const disabledDetails = form.watch("q34.choiceb.choices")

    useEffect(() => {
        if(disabledDetails === "No") {
            form.setValue('q34.choiceb.details', "")
            form.clearErrors('q34.choiceb.details')
        }
    }, [disabledDetails])

    return (
        <div>
            <div className="mb-3 flex items-start gap-3">
                <span>&#8226;</span>
                Are you related by consanguinity or affinity to the appointing
                or recommending authority, or to the chief of bureau or office
                or to the person who has immediate supervision over you in the
                Office, Bureau or Department where you will be apppointed,
            </div>

            <div className="ml-8">
                <Choices
                    form={form}
                    label="a. within the third degree?"
                    name="q34.choicea.choices"
                />

                <Choices
                    form={form}
                    className="mt-4"
                    label="b. within the fourth degree (for Local Government Unit - Career Employees)?"
                    name="q34.choiceb.choices"
                >
                    <ChoiceDetails
                        form={form}
                        name="q34.choiceb.details"
                        disabled={disabledDetails !== "Yes"}
                    />
                </Choices>
            </div>
        </div>
    );
}
