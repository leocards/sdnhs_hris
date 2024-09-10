import { PageProps } from "@/types";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { useTheme } from "@/hooks/themeProvider";
import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";

export default function Settings({
    auth,
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const { setTheme, theme } = useTheme()

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

                <div className="mt-10">
                    <header>
                        <h2 className="text-lg font-medium text-">Appearance</h2>
                    </header>

                    <div className="flex flex-wrap gap-3 mt-5">
                        <Button variant={theme === "dark" ? 'default' : 'ghost'} className="gap-2 items-center" onClick={() => setTheme('dark')}>
                            <Moon className="size-4" />
                            <span>Dark theme</span>
                        </Button>
                        <Button variant={theme === "light" ? 'default' : 'ghost'} className="gap-2 items-center" onClick={() => setTheme('light')}>
                            <Sun className="size-4" />
                            <span>Light theme</span>
                        </Button>
                        <Button variant={theme === "system" ? 'default' : 'ghost'} className="gap-2 items-center" onClick={() => setTheme('system')}>
                            <Monitor className="size-4" />
                            <span>System theme</span>
                        </Button>
                    </div>
                </div>

                <div className="mt-10">
                    <header>
                        <h2 className="text-lg font-medium text-">Notification</h2>
                    </header>

                    <div className="space-y-3 mt-5">
                        <div className="flex items-center">
                            <Checkbox checked className="text-primary" />
                            <div className="ml-3">Enable email notifications</div>
                        </div>
                        <div className="flex items-center">
                            <Checkbox className="text-primary" />
                            <div className="ml-3">Enable email notification for new messages</div>
                        </div>
                    </div>
                </div>

                {/* <div className="p-4 sm:p-8">
                    <DeleteUserForm className="max-w-xl" />
                </div> */}
            </div>
        </div>
    );
}
