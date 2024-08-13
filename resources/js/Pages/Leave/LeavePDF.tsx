import React from "react";
import { Square, SquareCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import LeavePDFApplicant from "./Partials/LeavePDFApplicant";
import LeavePDFDetailsOfApplication from "./Partials/LeavePDFDetailsOfApplication";
import LeavePDFDetailsOfActionOnApplication from "./Partials/LeavePDFDetailsOfActionOnApplication";

const LeavePDF = React.forwardRef<
    HTMLDivElement,
    { isDownload?: boolean; leave: any; hr: string }
>(({ isDownload, leave, hr }, ref) => {

    return (
        <div ref={ref} className="w-[790px] shrink-0 mx-auto text-[11px]">
            <div className={cn("flex flex-col m-[40pt] mx-[30pt]", isDownload && "my-[20pt]")}>
                <div className="flex p-2 mx-auto">
                    <img
                        src={"/storage/assets/DepEd.png"}
                        alt=""
                        style={{ width: 80, height: 80 }}
                    />
                    <div className="ml-10 text-center mr-auto">
                        <div>Republic of the Philippines</div>
                        <div>Department of Education</div>
                        <div>Region XI</div>
                        <div>SCHOOLS DIVISION OF PANABO CITY</div>
                        <div
                            style={{
                                fontSize: 14,
                                fontWeight: "bold",
                                marginTop: 5,
                            }}
                        >
                            APPLICATION FOR LEAVE
                        </div>
                    </div>
                    <img
                        src={"/storage/assets/DepEd.png"}
                        alt=""
                        style={{ width: 65, height: 65 }}
                        className="opacity-0"
                    />
                </div>

                <div className="mt-4 border border-black">
                    <LeavePDFApplicant applicant={{
                        department: leave?.user?.first_name,
                        first: leave?.user?.first_name,
                        last: leave?.user?.last_name,
                        middle: leave?.user?.middle_name,
                        dateOfFiling: leave?.created_at,
                        position: leave?.user?.position,
                        
                    }} isDownload={isDownload} />

                    <LeavePDFDetailsOfApplication
                        detailsOfApplication={{
                            leave_type: leave?.leave_type,
                            leave_type_others: leave?.details_of_leave?.leave_type_others,
                            is_philippines: leave?.details_of_leave?.is_philippines,
                            is_philippines_input: leave?.details_of_leave?.is_philippines_input,
                            is_abroad: leave?.details_of_leave?.is_abroad,
                            is_abroad_input: leave?.details_of_leave?.is_abroad_input,
                            is_in_hospital: leave?.details_of_leave?.is_in_hospital,
                            is_in_hospital_input: leave?.details_of_leave?.is_in_hospital_input,
                            is_out_patient: leave?.details_of_leave?.is_out_patient,
                            is_out_patient_input: leave?.details_of_leave?.is_out_patient_input,
                            special_leave_women: leave?.details_of_leave?.special_leave_women,
                            is_master_degree: leave?.details_of_leave?.is_master_degree,
                            is_review: leave?.details_of_leave?.is_review,
                            is_monetization: leave?.details_of_leave?.is_monetization,
                            is_terminal_leave: leave?.details_of_leave?.is_terminal_leave,
                            num_days_applied: leave?.num_days_applied,
                            inclusive_date_from: leave?.inclusive_date_from,
                            inclusive_date_to: leave?.inclusive_date_to,
                            is_not_requested: leave?.is_not_requested,
                            is_requested: leave?.is_requested,
                        }}
                        isDownload={isDownload}
                    />
                    
                    <LeavePDFDetailsOfActionOnApplication
                        isDownload={isDownload}
                        hr={hr}
                        detailsOfActionOnApplication={{
                            as_of: leave?.details_of_action_leave?.as_of,
                            total_earned_sick: leave?.details_of_action_leave?.total_earned_sick,
                            total_earned_vacation: leave?.details_of_action_leave?.total_earned_vacation,
                            less_application_sick: leave?.details_of_action_leave?.less_application_sick,
                            less_application_vacation: leave?.details_of_action_leave?.less_application_vacation,
                            balanced_sick: leave?.details_of_action_leave?.balanced_sick,
                            balanced_vacation: leave?.details_of_action_leave?.balanced_vacation,
                            is_for_approval: leave?.details_of_action_leave?.is_for_approval,
                            is_for_disapproval: leave?.details_of_action_leave?.is_for_disapproval,    
                            is_for_disapproval_input: leave?.details_of_action_leave?.is_for_disapproval_input,    
                            approved_for_days_with_out_pay: leave?.details_of_action_leave?.approved_for_days_with_out_pay,
                            approved_for_days_with_pay: leave?.details_of_action_leave?.approved_for_days_with_pay,
                            approved_for_others: leave?.details_of_action_leave?.approved_for_others,
                            disapproved: leave?.details_of_action_leave?.disapproved,
                        }}
                    />
                </div>
            </div>
        </div>
    );
});

export default LeavePDF;
