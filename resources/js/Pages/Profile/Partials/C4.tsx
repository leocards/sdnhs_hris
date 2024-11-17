import { Form } from "@/Components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as reactForm } from "react-hook-form";
import { useForm } from "@inertiajs/react";
import { forwardRef, useEffect, useState } from "react";
import Question34 from "./C4/Question34";
import Question35to37 from "./C4/Question35to37";
import Question38 from "./C4/Question38";
import Question39to40 from "./C4/Question39to40";
import Question41 from "./C4/Question41";
import GovernmentIds from "./C4/GovernmentIds";
import { Button } from "@/Components/ui/button";
import { C4SCHEMA, IFormC4, referenceDefault } from "./c4types";
import { useToast } from "@/Components/ui/use-toast";
import Processing from "@/Components/Processing";
import { UserInfoType } from "../Edit";
import { PDSPDFIsDownloadProvider } from "@/Pages/Search/PDSPDF/context";
import { Pages } from "@/Pages/Search/PDSPDF";
import C4pdf from "@/Pages/Search/PDSPDF/C4";

type C4Props = {
    user: UserInfoType;
    data: any;
};

const getQkuestionData = (
    data: Array<any>,
    index: number,
    defaults: any = null,
    field: string = "id"
) => {
    if (data.length === 0) return defaults;
    else {
        if (field === "date_filed")
            return new Date(data[index][field]) ?? defaults;

        if (field === "choices")
            return data[index][field] === 1
                ? "Yes"
                : data[index][field] === 0
                ? "No"
                : null;

        return data[index][field] ?? defaults;
    }
};

const C4 = forwardRef<HTMLDivElement, C4Props>(({ user, data }, ref) => {
    const pds_questions = user?.pds_cs4;
    const pds_refence = user?.pds_reference;
    const pds_government = user?.pds_government;

    const form = reactForm<IFormC4>({
        resolver: zodResolver(C4SCHEMA),
        values: {
            q34: {
                choicea: {
                    c4id: getQkuestionData(pds_questions, 0, null),
                    choices: getQkuestionData(
                        pds_questions,
                        0,
                        null,
                        "choices"
                    ),
                },
                choiceb: {
                    c4id: getQkuestionData(pds_questions, 1, null),
                    choices: getQkuestionData(
                        pds_questions,
                        1,
                        null,
                        "choices"
                    ),
                    details: getQkuestionData(pds_questions, 1, "", "details"),
                },
            },
            q35: {
                choicea: {
                    c4id: getQkuestionData(pds_questions, 2, null),
                    choices: getQkuestionData(
                        pds_questions,
                        2,
                        null,
                        "choices"
                    ),
                    details: getQkuestionData(pds_questions, 2, "", "details"),
                },
                choiceb: {
                    c4id: getQkuestionData(pds_questions, 3, null),
                    choices: getQkuestionData(
                        pds_questions,
                        3,
                        null,
                        "choices"
                    ),
                    datefiled: undefined,
                    statusofcase: getQkuestionData(
                        pds_questions,
                        3,
                        "",
                        "case_status"
                    ),
                },
            },
            q36: {
                c4id: getQkuestionData(pds_questions, 4, null),
                choices: getQkuestionData(pds_questions, 4, null, "choices"),
                details: getQkuestionData(pds_questions, 4, "", "details"),
            },
            q37: {
                c4id: getQkuestionData(pds_questions, 5, null),
                choices: getQkuestionData(pds_questions, 5, null, "choices"),
                details: getQkuestionData(pds_questions, 5, "", "details"),
            },
            q38: {
                choicea: {
                    c4id: getQkuestionData(pds_questions, 6, null),
                    choices: getQkuestionData(
                        pds_questions,
                        6,
                        null,
                        "choices"
                    ),
                    details: getQkuestionData(pds_questions, 6, "", "details"),
                },
                choiceb: {
                    c4id: getQkuestionData(pds_questions, 7, null),
                    choices: getQkuestionData(
                        pds_questions,
                        7,
                        null,
                        "choices"
                    ),
                    details: getQkuestionData(pds_questions, 7, "", "details"),
                },
            },
            q39: {
                c4id: getQkuestionData(pds_questions, 8, null),
                choices: getQkuestionData(pds_questions, 8, null, "choices"),
                details: getQkuestionData(pds_questions, 8, "", "details"),
            },
            q40: {
                choicea: {
                    c4id: getQkuestionData(pds_questions, 9, null),
                    choices: getQkuestionData(
                        pds_questions,
                        9,
                        null,
                        "choices"
                    ),
                    details: getQkuestionData(pds_questions, 9, "", "details"),
                },
                choiceb: {
                    c4id: getQkuestionData(pds_questions, 10, null),
                    choices: getQkuestionData(
                        pds_questions,
                        10,
                        null,
                        "choices"
                    ),
                    details: getQkuestionData(pds_questions, 10, "", "details"),
                },
                choicec: {
                    c4id: getQkuestionData(pds_questions, 11, null),
                    choices: getQkuestionData(
                        pds_questions,
                        11,
                        null,
                        "choices"
                    ),
                    details: getQkuestionData(pds_questions, 11, "", "details"),
                },
            },
            q41:
                pds_refence?.length === 0
                    ? referenceDefault
                    : pds_refence.map((data: any) => ({
                          c4id: data.id,
                          name: data.name,
                          address: data.address,
                          telno: data.telephone,
                      })),
            governmentids: {
                c4id: pds_government?.id ?? null,
                governmentissuedid: pds_government?.government_id ?? "",
                licensepasswordid: pds_government?.id_number ?? "",
                issued: pds_government?.issued ?? "",
            },
        },
    });

    const { setData, post, processing, reset } = useForm<IFormC4>();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { toast } = useToast();

    const onFormSubmit = (formData: IFormC4) => {
        console.log(formData);
        setIsSubmit(true);
        setData(formData);
    };

    useEffect(() => {
        if (isSubmit) {
            post(route("pds.c4.upload"), {
                preserveScroll: true,
                onSuccess: (page) => {
                    toast({
                        variant: "success",
                        description: page.props.success?.toString(),
                    });
                    form.reset();
                },
                onError: (error) => {
                    console.log(error[0]);
                    toast({
                        variant: "destructive",
                        description: error[0],
                    });
                },
                onFinish: () => {
                    setIsSubmit(false);
                    reset();
                },
            });
        }
    }, [isSubmit]);

    useEffect(() => {
        if (pds_questions.length > 0) {
            if (form.getValues("q35.choiceb.choices") === "Yes") {
                form.setValue(
                    "q35.choiceb.datefiled",
                    getQkuestionData(pds_questions, 3, undefined, "date_filed")
                );
            }
        }
    }, [pds_questions]);

    return (
        <div className="flex overflow-hidden gap-2 relative">
            <div className="w-full shrink-0">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onFormSubmit)}
                        className="mt-5"
                    >
                        <Question34 form={form} />
                        <Question35to37 form={form} />
                        <Question38 form={form} />
                        <Question39to40 form={form} />
                        <Question41 form={form} />
                        <GovernmentIds form={form} />

                        <Processing is_processing={processing} />

                        <div className="mt-10 pt-2 border-t flex">
                            <Button
                                type="submit"
                                className="px-10 ml-auto max-sm:w-full"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>

            {data && (
                <div className="w-[calc(900px-20pt)] absolute top-0 -right-[120%]">
                    <PDSPDFIsDownloadProvider initialValue={true}>
                        <Pages ref={ref} pageNumber={4}>
                            <C4pdf
                                questions={data.c4}
                                reference={data.references}
                                government={data.governmentid}
                            />
                        </Pages>
                    </PDSPDFIsDownloadProvider>
                </div>
            )}
        </div>
    );
});

export default C4;
