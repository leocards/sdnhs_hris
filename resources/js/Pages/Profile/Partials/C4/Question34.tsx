import { Choices } from "./Choices";

export default function Question34({ form }: { form: any }) {
    return (
        <div>
            <div className="mb-3 flex items-start gap-3">
                <span>34.</span>
                Are you related by consanguinity or affinity to the appointing
                or recommending authority, or to the chief of bureau or office
                or to the person who has immediate supervision over you in the
                Office, Bureau or Department where you will be apppointed,
            </div>

            <div className="ml-8">
                <Choices
                    form={form}
                    label="a. within the third degree?"
                    name="c4.q34.choicea"
                />

                <Choices
                    form={form}
                    className="mt-4"
                    label="b. within the fourth degree (for Local Government Unit - Career Employees)?"
                    name="c4.q34.choiceb.choices"
                    detailsName="c4.q34.choiceb.details"
                    disabled={form.watch("c4.q34.choiceb.choices") !== "Yes"}
                />
            </div>
        </div>
    );
}
