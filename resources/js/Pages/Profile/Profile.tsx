import { PageProps } from "@/types";
import UpdateProfileInformationForm from ./Partials/UpdateProfileInformationForm";
import Authenticated from "@/Layouts/AuthenticatedLayout";

const Profile: React.FC<
    PageProps<{
        mustVerifyEmail: boolean;
        status?: string;
        userRoles: string[];
    }>
> = ({ mustVerifyEmail, status, userRoles }) => {
    return (
        <div>

        </div>
    );
};

export default Profile;
