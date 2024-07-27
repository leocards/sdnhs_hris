import { PageProps } from "@/types";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export default function Settings({
    auth,
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <div className="py-12">
            <div className="">
                <div className="">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </div>

                <div className="mt-10">
                    <UpdatePasswordForm  />
                </div>

                {/* <div className="p-4 sm:p-8">
                    <DeleteUserForm className="max-w-xl" />
                </div> */}
            </div>
        </div>
    );
}
