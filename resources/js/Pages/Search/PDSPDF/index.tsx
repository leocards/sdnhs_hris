import React, { HtmlHTMLAttributes, MouseEventHandler, PropsWithChildren, useMemo } from "react";
import C1pdf from "./C1";
import Header from "./C1/Header";

import { cn } from "@/lib/utils";
import C2pdf from "./C2";
import { PDSPDFIsDownloadProvider, useIsDownloadChecker } from "./context";
import C3pdf from "./C3";
import C4pdf from "./C4";
import { getFamilyData } from "@/Pages/Profile/Partials/C1/FamilyBackgroundForm";
import { getEducationalData } from "@/Pages/Profile/Partials/C1/EducationalBackgroundForm";

type Props = {
    data: any;
    tab: 'C1' | 'C2' | 'C3' | 'C4';
};

const PersonalDataSheetPDF = React.forwardRef<HTMLDivElement, Props>(
    ({ ...props }, ref) => {

        const { spouse, father, mother, children } = useMemo(() => getFamilyData(props.data.familyBackground??[], true), [props.data.familyBackground])
        const { elementary, secondary, vocational, college, graduatestudies } = useMemo(() => getEducationalData(props.data.educationalBackground??[]), [props.data.educationalBackground])

        return (
            <div className="inline-flex gap-4 w-[calc(900px-20pt)] overflow-hidden !bg-gray-50">
                {props.tab === 'C1' && (<>
                    <div>
                        <PDSPDFIsDownloadProvider>
                            <Pages pageNumber={1}>
                                <Header />
                                <C1pdf
                                    personalInfo={{
                                        surname: props.data.last_name??'',
                                        firstname: props.data.first_name??'',
                                        middlename: props.data.middle_name??'',
                                        extenionname: props.data.extension_name??'',
                                        date_of_birth: props.data.date_of_birth??'',
                                        place_of_bith: props.data.birth_place??'',
                                        sex: props.data.sex??'',
                                        civil_status: props.data.civil_status??'',
                                        height: props.data.height??'',
                                        weight: props.data.weight??'',
                                        blood_type: props.data.personalInformation?.blood_type??'',
                                        gsis: props.data.personalInformation?.gsis??'',
                                        pag_ibig: props.data.personalInformation?.pag_ibig??'',
                                        philhealth: props.data.personalInformation?.philhealth??'',
                                        sss: props.data.personalInformation?.sss??'',
                                        tin: props.data.personalInformation?.tin??'',
                                        agency: props.data.personalInformation?.agency??'',
                                        citizenship: {
                                            citizen: props.data.personalInformation?.citienship??'',
                                            dual_by: props.data.personalInformation?.dual_by??'',
                                            country: props.data.personalInformation?.citizenship_country??'',
                                        },
                                        residential: {
                                            house_no: props.data.personalInformation?.address[1].house_no??'',
                                            street: props.data.personalInformation?.address[1].street??'',
                                            subdivision: props.data.personalInformation?.address[1].subdivision??'',
                                            barangay: props.data.personalInformation?.address[1].barangay??'',
                                            city: props.data.personalInformation?.address[1].municipality??'',
                                            province: props.data.personalInformation?.address[1].province??'',
                                            zip_code: props.data.personalInformation?.address[1].zip_code??'',
                                        },
                                        permanent: {
                                            house_no: props.data.personalInformation?.address[0].house_no??'',
                                            street: props.data.personalInformation?.address[0].street??'',
                                            subdivision: props.data.personalInformation?.address[0].subdivision??'',
                                            barangay: props.data.personalInformation?.address[0].barangay??'',
                                            city: props.data.personalInformation?.address[0].municipality??'',
                                            province: props.data.personalInformation?.address[0].province??'',
                                            zip_code: props.data.personalInformation?.address[0].zip_code??'',
                                        },
                                        telephone: props.data.personalInformation?.telephone??'',
                                        mobile: props.data.personalInformation?.mobile??'',
                                        email: props.data.personalInformation?.email??'',
                                    }}

                                    familyBackground={{
                                        spouse: {
                                            surname: spouse?.surname??'', firstname: spouse?.first_name??'', middlename: spouse?.middle_name??'', extensionname: spouse?.extension_name??'', occupation: spouse?.occupation??'', employer: spouse?.business_name??'',
                                            businessaddress: spouse?.business_address??'', telephone: spouse?.telephone??'',
                                        },
                                        father: {
                                            surname: father?.surname??'', firstname: father?.first_name??'', middlename: father?.middle_name??'', extensionname: father?.extension_name??'',
                                        },
                                        mother: {
                                            surname: mother?.surname??'', firstname: mother?.first_name??'', middlename: mother?.middle_name??'',
                                        },
                                        children: children.map((child) => ({ name: child.full_name, birthdate: child.birthdate }))
                                    }}

                                    education={{
                                        elementary: elementary.length ? elementary : DefaultEducationalBackground,
                                        secondary: secondary.length ? secondary : DefaultEducationalBackground,
                                        seniorhigh: [],
                                        vocational: vocational.length ? vocational : DefaultEducationalBackground,
                                        college: college.length ? college : DefaultEducationalBackground,
                                        graduate: graduatestudies.length ? graduatestudies : DefaultEducationalBackground
                                    }}
                                />
                            </Pages>
                        </PDSPDFIsDownloadProvider>
                    </div>

                    <div>
                        <PDSPDFIsDownloadProvider initialValue={true}>
                            <Pages ref={ref} pageNumber={1} className="">
                                <Header />
                                <C1pdf
                                    personalInfo={{
                                        surname: props.data.last_name??'',
                                        firstname: props.data.first_name??'',
                                        middlename: props.data.middle_name??'',
                                        extenionname: props.data.extension_name??'',
                                        date_of_birth: props.data.date_of_birth??'',
                                        place_of_bith: props.data.birth_place??'',
                                        sex: props.data.sex??'',
                                        civil_status: props.data.civil_status??'',
                                        height: props.data.height??'',
                                        weight: props.data.weight??'',
                                        blood_type: props.data.personalInformation?.blood_type??'',
                                        gsis: props.data.personalInformation?.gsis??'',
                                        pag_ibig: props.data.personalInformation?.pag_ibig??'',
                                        philhealth: props.data.personalInformation?.philhealth??'',
                                        sss: props.data.personalInformation?.sss??'',
                                        tin: props.data.personalInformation?.tin??'',
                                        agency: props.data.personalInformation?.agency??'',
                                        citizenship: {
                                            citizen: props.data.personalInformation?.citienship??'',
                                            dual_by: props.data.personalInformation?.dual_by??'',
                                            country: props.data.personalInformation?.citizenship_country??'',
                                        },
                                        residential: {
                                            house_no: props.data.personalInformation?.address[1].house_no??'',
                                            street: props.data.personalInformation?.address[1].street??'',
                                            subdivision: props.data.personalInformation?.address[1].subdivision??'',
                                            barangay: props.data.personalInformation?.address[1].barangay??'',
                                            city: props.data.personalInformation?.address[1].municipality??'',
                                            province: props.data.personalInformation?.address[1].province??'',
                                            zip_code: props.data.personalInformation?.address[1].zip_code??'',
                                        },
                                        permanent: {
                                            house_no: props.data.personalInformation?.address[0].house_no??'',
                                            street: props.data.personalInformation?.address[0].street??'',
                                            subdivision: props.data.personalInformation?.address[0].subdivision??'',
                                            barangay: props.data.personalInformation?.address[0].barangay??'',
                                            city: props.data.personalInformation?.address[0].municipality??'',
                                            province: props.data.personalInformation?.address[0].province??'',
                                            zip_code: props.data.personalInformation?.address[0].zip_code??'',
                                        },
                                        telephone: props.data.personalInformation?.telephone??'',
                                        mobile: props.data.personalInformation?.mobile??'',
                                        email: props.data.personalInformation?.email??'',
                                    }}

                                    familyBackground={{
                                        spouse: {
                                            surname: spouse?.surname??'', firstname: spouse?.first_name??'', middlename: spouse?.middle_name??'', extensionname: spouse?.extension_name??'', occupation: spouse?.occupation??'', employer: spouse?.business_name??'',
                                            businessaddress: spouse?.business_address??'', telephone: spouse?.telephone??'',
                                        },
                                        father: {
                                            surname: father?.surname??'', firstname: father?.first_name??'', middlename: father?.middle_name??'', extensionname: father?.extension_name??'',
                                        },
                                        mother: {
                                            surname: mother?.surname??'', firstname: mother?.first_name??'', middlename: mother?.middle_name??'',
                                        },
                                        children: children.map((child) => ({ name: child.full_name, birthdate: child.birthdate }))
                                    }}

                                    education={{
                                        elementary: elementary.length ? elementary : DefaultEducationalBackground,
                                        secondary: secondary.length ? secondary : DefaultEducationalBackground,
                                        seniorhigh: [],
                                        vocational: vocational.length ? vocational : DefaultEducationalBackground,
                                        college: college.length ? college : DefaultEducationalBackground,
                                        graduate: graduatestudies.length ? graduatestudies : DefaultEducationalBackground
                                    }}
                                />
                            </Pages>
                        </PDSPDFIsDownloadProvider>
                    </div>
                </>)}

                {props.tab === 'C2' && (<>
                    <div>
                        <PDSPDFIsDownloadProvider>
                            <Pages pageNumber={2}>
                                <C2pdf civilservice={props.data.civilservice} workexperience={props.data.workexperience}/>
                            </Pages>
                        </PDSPDFIsDownloadProvider>
                    </div>

                    <div>
                        <PDSPDFIsDownloadProvider initialValue={true}>
                            <Pages ref={ref} pageNumber={2}>
                                <C2pdf civilservice={props.data.civilservice} workexperience={props.data.workexperience}/>
                            </Pages>
                        </PDSPDFIsDownloadProvider>
                    </div>
                </>)}

                {props.tab === 'C3' && (<>
                    <div>
                        <PDSPDFIsDownloadProvider>
                            <Pages pageNumber={3}>
                                <C3pdf voluntarywork={props.data.voluntarywork} learningdevelopment={props.data.learningdevelopment} otherinformation={props.data.otherinformation} />
                            </Pages>
                        </PDSPDFIsDownloadProvider>
                    </div>

                    <div>
                        <PDSPDFIsDownloadProvider initialValue={true}>
                            <Pages ref={ref} pageNumber={3}>
                                <C3pdf voluntarywork={props.data.voluntarywork} learningdevelopment={props.data.learningdevelopment} otherinformation={props.data.otherinformation} />
                            </Pages>
                        </PDSPDFIsDownloadProvider>
                    </div>
                </>)}

                {props.tab === 'C4' && (<>
                    <div>
                        <PDSPDFIsDownloadProvider>
                            <Pages pageNumber={4}>
                                <C4pdf questions={props.data.c4} reference={props.data.references} government={props.data.governmentid} />
                            </Pages>
                        </PDSPDFIsDownloadProvider>
                    </div>

                    <div>
                        <PDSPDFIsDownloadProvider initialValue={true}>
                            <Pages ref={ref} pageNumber={4}>
                                <C4pdf questions={props.data.c4} reference={props.data.references} government={props.data.governmentid} />
                            </Pages>
                        </PDSPDFIsDownloadProvider>
                    </div>
                </>)}
            </div>
        );
    }
);

export const DefaultEducationalBackground = [{
    nameofschool: '',
    basiceddegreecourse: '',
    period: { from: '', to: '' },
    highestlvl: '',
    yeargraduated: '',
    scholarshiphonor: '',
}]

type PagesProps = {
    pageNumber: number;
    className?: string;
} & PropsWithChildren;

export const Pages = React.forwardRef<HTMLDivElement, PagesProps>(
    ({ ...props }, ref) => {
        const { checkIfDownLoad } = useIsDownloadChecker();

        return (
            <div
                ref={ref}
                className={cn("w-[calc(900px-20pt)] mx-auto shadow-md font-arial-narrow text-[10pt] text-black p x-[20pt] scale-[.95]", props.className)}
            >
                <div
                    className={cn(
                        "border-[2.5px]  border-black h-full",
                        props.pageNumber === 4
                            ? "border-t-[2.5px]"
                            : "border-t-[4px]"
                    )}
                >
                    {props.children}
                </div>
                <div className="text-[6pt] italic text-right pr-2 h-[16px]">
                    <div className={cn(checkIfDownLoad("-mt-1.5 pb-"))}>
                        CS FORM 212 (Revised 2017), Page {props.pageNumber} of 4
                    </div>
                </div>
            </div>
        );
    }
);

export const TextCenter = ({
    children,
    ...props
}: { className?: string } & PropsWithChildren) => {
    return (
        <div
            {...props}
            className={cn("flex items-center justify-center", props.className)}
        >
            {children}
        </div>
    );
};

export default PersonalDataSheetPDF;
