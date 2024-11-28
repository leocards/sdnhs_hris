import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import React from "react";
import PersonalDataSheet, { UserInfoType } from "./Partials/PersonalDataSheet";

type Props = {
    userinfo: UserInfoType
    isApprovedPds: any
} & PageProps

const MyPersonalDataSheet: React.FC<Props> = ({ auth, userinfo, isApprovedPds }) => {
    return (
        <Authenticated
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight capitalize">
                    (PDS) Personal data sheet
                </h2>
            }
        >
            <PersonalDataSheet user={userinfo} isApprovedPds={!(isApprovedPds?.pds_personal_information?.is_approved)} />
        </Authenticated>
    );
};

export default MyPersonalDataSheet;
