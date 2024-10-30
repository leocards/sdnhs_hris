
import React from "react";
import RealProperties from "./RealProperties";
import PersonalProperties from "./PersonalProperties";

const Assets: React.FC<{ form: any }> = ({ form }) => {

    return (
        <div>
            <div>1. ASSETS</div>
            <div className="mt-2 mb-3">a. Real Properties*</div>

            <RealProperties form={form} />

            <div className="mt-7 mb-3">b. Personal Properties*</div>

            <PersonalProperties form={form} />
        </div>
    );
};

export default Assets;
