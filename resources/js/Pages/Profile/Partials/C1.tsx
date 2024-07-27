import EducationalBackground from "./C1/EducationalBackground";
import FamilyBackground from "./C1/FamilyBackground";
import PersonalInformation from "./C1/PersonalInformation";
import { Form } from "@/Components/ui/form";
import { useForm as reactForm } from "react-hook-form";
import {
    IFormPersonalDataSheet,
    initialValuePersonalDataSheet,
    PERSONALDATASHEETSCHEMA,
} from "../type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/Components/ui/button";

type C1Props = {};

const C1: React.FC<C1Props> = () => {
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
                <PersonalInformation form={form} />

                <FamilyBackground form={form} />

                <EducationalBackground form={form} />

                <div className="mt-10 pt-2 border-t flex">
                    <Button type="submit" className="px-10 ml-auto">Save C1</Button>
                </div>
            </form>
        </Form>
    );
};

export default C1;
