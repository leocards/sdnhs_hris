import { router } from "@inertiajs/react";
import { forwardRef, useMemo, useState } from "react";
import Processing from "@/Components/Processing";
import { UserInfoType } from "./PersonalDataSheet";
import Tabs from "@/Components/framer/Tabs";
import PersonalInformationForm from "./C1/PersonalInformationForm";
import FamilyBackgroundForm from "./C1/FamilyBackgroundForm";
import EducationalBackgroundForm from "./C1/EducationalBackgroundForm";
import C1pdf from "@/Pages/Search/PDSPDF/C1";
import { DefaultEducationalBackground, Pages } from "@/Pages/Search/PDSPDF";
import Header from "@/Pages/Search/PDSPDF/C1/Header";
import { getFamilyData } from "@/Pages/PDS/Partials/C1/FamilyBackgroundForm";
import { getEducationalData } from "@/Pages/PDS/Partials/C1/EducationalBackgroundForm";
import { PDSPDFIsDownloadProvider } from "@/Pages/Search/PDSPDF/context";

type C1Props = {
    user: UserInfoType;
    activeTab: string;
    pds_c: string;
    data: any;
};

const C1 = forwardRef<HTMLDivElement, C1Props>(
    ({ user, activeTab, pds_c, data }, ref) => {
        const [routeProcessing, setRouteProcessing] = useState(false);
        const [processing, setProcessing] = useState(false);

        const { spouse, father, mother, children } = useMemo(
            () => getFamilyData(data?.familyBackground ?? [], true),
            [data?.familyBackground]
        );
        const { elementary, secondary, vocational, college, graduatestudies } =
            useMemo(
                () => getEducationalData(data?.educationalBackground ?? []),
                [data?.educationalBackground]
            );

        return (
            <div className="flex overflow-hidden gap-2 px-1 relative">
                <div className="w-full shrink-0">
                    <div className="w-full border-b mb-6">
                        <Tabs
                            id="pds-sub-tab"
                            active={activeTab}
                            tabs={[
                                { id: "I", label: "I." },
                                { id: "II", label: "II." },
                                { id: "III", label: "III." },
                            ]}
                            className="w-fit"
                            tabWidth="w-14"
                            navigate={(nav) => {
                                setRouteProcessing(true);
                                router.get(
                                    route("pds", {
                                        _query: {
                                            c: pds_c,
                                            section: nav,
                                        },
                                    }),
                                    undefined,
                                    {
                                        onFinish: () =>
                                            setRouteProcessing(false),
                                    }
                                );
                            }}
                        />
                    </div>
                    {routeProcessing ? (
                        <div className="relative w-fit mx-auto py-4">
                            <span className="loading loading-spinner loading-md"></span>
                        </div>
                    ) : (
                        <div>
                            {(activeTab === "I" || !activeTab) && (
                                <PersonalInformationForm
                                    user={user}
                                    onProcess={setProcessing}
                                />
                            )}
                            {activeTab === "II" && (
                                <FamilyBackgroundForm
                                    user={user}
                                    onProcess={setProcessing}
                                />
                            )}
                            {activeTab === "III" && (
                                <EducationalBackgroundForm
                                    user={user}
                                    onProcess={setProcessing}
                                />
                            )}
                        </div>
                    )}

                    <Processing is_processing={processing} />
                </div>
                {data && (
                    <div className="w-[calc(900px-20pt)] absolute top-0 -right-[120%]">
                        <PDSPDFIsDownloadProvider initialValue={true}>
                            <Pages ref={ref} pageNumber={1}>
                                <Header />
                                <C1pdf
                                    personalInfo={{
                                        surname: data?.last_name ?? "",
                                        firstname: data?.first_name ?? "",
                                        middlename: data?.middle_name ?? "",
                                        extenionname:
                                            data?.extension_name ?? "",
                                        date_of_birth:
                                            data?.date_of_birth ?? "",
                                        place_of_bith: data?.birth_place ?? "",
                                        sex: data?.sex ?? "",
                                        civil_status: data?.civil_status ?? "",
                                        height: data?.height ?? "",
                                        weight: data?.weight ?? "",
                                        blood_type:
                                            data?.personalInformation
                                                ?.blood_type ?? "",
                                        gsis:
                                            data?.personalInformation?.gsis ??
                                            "",
                                        pag_ibig:
                                            data?.personalInformation
                                                ?.pag_ibig ?? "",
                                        philhealth:
                                            data?.personalInformation
                                                ?.philhealth ?? "",
                                        sss:
                                            data?.personalInformation?.sss ??
                                            "",
                                        tin:
                                            data?.personalInformation?.tin ??
                                            "",
                                        agency:
                                            data?.personalInformation?.agency ??
                                            "",
                                        citizenship: {
                                            citizen:
                                                data?.personalInformation
                                                    ?.citienship ?? "",
                                            dual_by:
                                                data?.personalInformation
                                                    ?.dual_by ?? "",
                                            country:
                                                data?.personalInformation
                                                    ?.citizenship_country ?? "",
                                        },
                                        residential: {
                                            house_no:
                                                data?.personalInformation
                                                    ?.address[1].house_no ?? "",
                                            street:
                                                data?.personalInformation
                                                    ?.address[1].street ?? "",
                                            subdivision:
                                                data?.personalInformation
                                                    ?.address[1].subdivision ??
                                                "",
                                            barangay:
                                                data?.personalInformation
                                                    ?.address[1].barangay ?? "",
                                            city:
                                                data?.personalInformation
                                                    ?.address[1].municipality ??
                                                "",
                                            province:
                                                data?.personalInformation
                                                    ?.address[1].province ?? "",
                                            zip_code:
                                                data?.personalInformation
                                                    ?.address[1].zip_code ?? "",
                                        },
                                        permanent: {
                                            house_no:
                                                data?.personalInformation
                                                    ?.address[0].house_no ?? "",
                                            street:
                                                data?.personalInformation
                                                    ?.address[0].street ?? "",
                                            subdivision:
                                                data?.personalInformation
                                                    ?.address[0].subdivision ??
                                                "",
                                            barangay:
                                                data?.personalInformation
                                                    ?.address[0].barangay ?? "",
                                            city:
                                                data?.personalInformation
                                                    ?.address[0].municipality ??
                                                "",
                                            province:
                                                data?.personalInformation
                                                    ?.address[0].province ?? "",
                                            zip_code:
                                                data?.personalInformation
                                                    ?.address[0].zip_code ?? "",
                                        },
                                        telephone:
                                            data?.personalInformation
                                                ?.telephone ?? "",
                                        mobile:
                                            data?.personalInformation?.mobile ??
                                            "",
                                        email:
                                            data?.personalInformation?.email ??
                                            "",
                                    }}
                                    familyBackground={{
                                        spouse: {
                                            surname: spouse?.surname ?? "",
                                            firstname: spouse?.first_name ?? "",
                                            middlename:
                                                spouse?.middle_name ?? "",
                                            extensionname:
                                                spouse?.extension_name ?? "",
                                            occupation:
                                                spouse?.occupation ?? "",
                                            employer:
                                                spouse?.business_name ?? "",
                                            businessaddress:
                                                spouse?.business_address ?? "",
                                            telephone: spouse?.telephone ?? "",
                                        },
                                        father: {
                                            surname: father?.surname ?? "",
                                            firstname: father?.first_name ?? "",
                                            middlename:
                                                father?.middle_name ?? "",
                                            extensionname:
                                                father?.extension_name ?? "",
                                        },
                                        mother: {
                                            surname: mother?.surname ?? "",
                                            firstname: mother?.first_name ?? "",
                                            middlename:
                                                mother?.middle_name ?? "",
                                        },
                                        children: children.map((child) => ({
                                            name: child.full_name,
                                            birthdate: child.birthdate,
                                        })),
                                    }}
                                    education={{
                                        elementary: elementary.length
                                            ? elementary
                                            : DefaultEducationalBackground,
                                        secondary: secondary.length
                                            ? secondary
                                            : DefaultEducationalBackground,
                                        seniorhigh: [],
                                        vocational: vocational.length
                                            ? vocational
                                            : DefaultEducationalBackground,
                                        college: college.length
                                            ? college
                                            : DefaultEducationalBackground,
                                        graduate: graduatestudies.length
                                            ? graduatestudies
                                            : DefaultEducationalBackground,
                                    }}
                                />
                            </Pages>
                        </PDSPDFIsDownloadProvider>
                    </div>
                )}
            </div>
        );
    }
);

export default C1;
