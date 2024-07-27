import { Form } from "@/Components/ui/form";
import { useForm as reactForm } from "react-hook-form";
import {
    IFormPersonalDataSheet,
    initialValuePersonalDataSheet,
    PERSONALDATASHEETSCHEMA,
} from "../type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/Components/ui/button";
import CivilServiceEligibility from "./C2/CivilServiceEligibility";
import WorkExperience from "./C2/WorkExperience";

type C2Props = {};

const C2: React.FC<C2Props> = () => {
    const form = reactForm<IFormPersonalDataSheet>({
        resolver: zodResolver(PERSONALDATASHEETSCHEMA),
        defaultValues: initialValuePersonalDataSheet,
    });

    const onFormSubmit = (formData: IFormPersonalDataSheet) => {
        console.log(formData);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)}>
                <CivilServiceEligibility form={form} />

                <WorkExperience form={form} />

                <div className="mt-10 pt-2 border-t flex">
                    <Button type="submit" className="px-10 ml-auto">Save C2</Button>
                </div>
            </form>
        </Form>
    );
};

export default C2;
