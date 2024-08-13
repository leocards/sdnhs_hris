import { Form } from "@/Components/ui/form";
import { useForm as reactForm } from "react-hook-form";
import {
    IFormPersonalDataSheet,
    initialValuePersonalDataSheet,
    PERSONALDATASHEETSCHEMA,
} from "../type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/Components/ui/button";
import VoluntaryWork from "./C3/VoluntaryWork";
import LearningAndDevelopment from "./C3/LearningAndDevelopment";
import OtherInformation from "./C3/OtherInformation";

const C3 = () => {
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
                <VoluntaryWork form={form} />

                <LearningAndDevelopment form={form} />

                <OtherInformation form={form} />

                <div className="mt-10 pt-2 border-t flex">
                    <Button type="submit" className="px-10 ml-auto max-sm:w-full">Save C3</Button>
                </div>
            </form>
        </Form>
    );
}

export default C3