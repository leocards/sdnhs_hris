import {
    Form,
} from "@/Components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as reactForm } from "react-hook-form";
import { IFormPersonalDataSheet, initialValuePersonalDataSheet, PERSONALDATASHEETSCHEMA } from "../type";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import Question34 from "./C4/Question34";
import Question35to37 from "./C4/Question35to37";
import Question38 from "./C4/Question38";
import Question39to40 from "./C4/Question39to40";
import Question41 from "./C4/Question41";
import GovernmentIds from "./C4/GovernmentIds";
import { Button } from "@/Components/ui/button";

export default function C4() {
    const form = reactForm<IFormPersonalDataSheet>({
        resolver: zodResolver(PERSONALDATASHEETSCHEMA),
        defaultValues: initialValuePersonalDataSheet
    });

    const { setData, post, processing, reset } =
        useForm<IFormPersonalDataSheet>();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const onFormSubmit = (formData: IFormPersonalDataSheet) => {
        setIsSubmit(false);
        setData(formData);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)}>
                <Question34 form={form} />
                <Question35to37 form={form} />
                <Question38 form={form} />
                <Question39to40 form={form} />
                <Question41 form={form} />
                <GovernmentIds form={form} />

                <div className="mt-10 pt-2 border-t flex">
                    <Button type="submit" className="px-10 ml-auto max-sm:w-full">Save C4</Button>
                </div>
            </form>
        </Form>
    );
}


