import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { PageProps, User, UserInfo } from "@/types";
import { AvatarProfile } from "@/Components/ui/avatar";
import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";
import { Button } from "@/Components/ui/button";
import PersonalDataSheet from "./PersonalDataSheet";
import Settings from "./Settings";
import { useState } from "react";
import UploadAvatar from "./UploadAvatar";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export type UserInfoType = User &
    UserInfo & {
        pds_educational_background: Array<any>;
        pds_family_background: Array<any>;
        pds_personal_information: any;
        pds_civil_service_eligibility: any;
        pds_work_experience: any;
        pds_voluntary_work: any;
        pds_learning_development: any;
        pds_other_information: any;
        pds_cs4: any;
        pds_government: any;
        pds_referece: any;
        birth_place: string;
        civil_status: string;
        height: string;
        weight: string;
    };

export default function Edit({
    auth,
    userinfo,
    mustVerifyEmail,
    status,
    userRoles,
}: PageProps<{
    mustVerifyEmail: boolean;
    status?: string;
    userinfo: UserInfoType;
    userRoles: string[];
}>) {
    const name = auth.user.first_name + " " + auth.user.last_name;
    const [uploadAvatar, setUploadAvatar] = useState<boolean>(false);

    const { url } = usePage();

    return (
        <AuthenticatedLayout
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl text-secondary-foreground leading-tight">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="flex flex-row items-center mt-10 gap-4">
                <div className="relative group rounded-full overflow-hidden select-none">
                    <AvatarProfile
                        src={auth.user.avatar}
                        className="size-32"
                        fallbackSize={40}
                    />
                    <div
                        className={cn(
                            "flex justify-center items-center cursor-pointer opacity-0 bg-black/40 absolute top-0 left-0 z-10 size-full backdrop-blur-sm transition duration-200",
                            "group-hover:opacity-100"
                        )}
                        onClick={() => setUploadAvatar(true)}
                    >
                        <Camera className="size-8 text-white" />
                    </div>
                </div>
                <div className="">
                    <div className="font-medium text-lg">{name}</div>
                    <div className="">{auth.user.email}</div>
                    <div className="">{auth.user.position}</div>
                </div>
            </div>

            <div className="mt-8 flex gap-3">
                <Button
                    variant={(url !== "/profile/settings" && url !== "/profile/profile") ? "default" : "ghost"}
                    onClick={() => router.get(route("profile.edit"))}
                >
                    <span>Personal Data Sheet</span>
                </Button>
                <Button
                    variant={url.startsWith("/profile/profile") ? "default" : "ghost"}
                    onClick={() => router.get(route("profile.profile"))}
                >
                    <span>Profile</span>
                </Button>
                <Button
                    variant={
                        url.startsWith("/profile/settings")
                            ? "default"
                            : "ghost"
                    }
                    onClick={() => router.get(route("profile.settings"))}
                >
                    <span>Settings</span>
                </Button>
            </div>

            <div>
                {(url !== "/profile/settings" && url !== "/profile/profile") && (
                    <PersonalDataSheet user={userinfo} />
                )}
            </div>
            <div>
                {url.startsWith("/profile/profile") && (
                    <div className="py-12">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            userRoles={userRoles}
                        />
                    </div>
                )}
            </div>
            <div>
                {url.startsWith("/profile/settings") && (
                    <Settings
                        auth={auth}
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                )}
            </div>

            <UploadAvatar show={uploadAvatar} onClose={setUploadAvatar} />
        </AuthenticatedLayout>
    );
}
