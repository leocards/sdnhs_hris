import { PageProps } from "@/types";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import { useTheme } from "@/hooks/themeProvider";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Slider } from "@/Components/ui/slider";
import { useState } from "react";
import messageNotification from "../../assets/sound/messageNotification.mp3";
import newNotification from "../../assets/sound/newNotification.mp3";

export default function Settings({
    auth
}: PageProps) {
    const { setTheme, theme } = useTheme();
    const [messageNotificationVolume, setMessageNotificationVolume] = useState(
        parseFloat(localStorage.getItem("m-sound-volume") ?? "1.0")
    );
    const [newNotificationVolume, setNewNotificationVolume] = useState(
        parseFloat(localStorage.getItem("n-sound-volume") ?? "1.0")
    );

    const [enableEmailNotifications, setEnableEmailNotifications] = useState({
        notification: { enabled: !!(auth.user.enable_email_notification), loading: false },
        message: { enabled: !!(auth.user.enable_email_message_notification), loading: false },
        note: { enabled: !!(auth.user.enable_email_note_reminder), loading: false }
    })



    const enableEmailNotification = (enableFor: "notification" | "message" | "note", status: boolean) => {
        setEnableEmailNotifications({...enableEmailNotifications, [enableFor]: {enabled: status, loading: true}})
        window.axios
            .post(route('profile.settings.emails'), {
                enableFor:enableFor,
                enable: status
            })
            .then((response) => console.log(response.data))
            .finally(() => setEnableEmailNotifications({...enableEmailNotifications, [enableFor]: {enabled: status, loading: false}}))
    }

    return (
        <div className="py-12">
            <div className="">
                <div className="mt-10">
                    <UpdatePasswordForm />
                </div>

                <div className="mt-10">
                    <header>
                        <h2 className="text-lg font-medium text-">
                            Appearance
                        </h2>
                    </header>

                    <div className="flex flex-wrap gap-3 mt-5">
                        <Button
                            variant={theme === "dark" ? "default" : "ghost"}
                            className="gap-2 items-center"
                            onClick={() => setTheme("dark")}
                        >
                            <Moon className="size-4" />
                            <span>Dark theme</span>
                        </Button>
                        <Button
                            variant={theme === "light" ? "default" : "ghost"}
                            className="gap-2 items-center"
                            onClick={() => setTheme("light")}
                        >
                            <Sun className="size-4" />
                            <span>Light theme</span>
                        </Button>
                        <Button
                            variant={theme === "system" ? "default" : "ghost"}
                            className="gap-2 items-center"
                            onClick={() => setTheme("system")}
                        >
                            <Monitor className="size-4" />
                            <span>System theme</span>
                        </Button>
                    </div>
                </div>

                <div className="mt-10">
                    <header>
                        <h2 className="text-lg font-medium text-">
                            Notification
                        </h2>
                    </header>

                    <div className="space-y-3 mt-5">
                        <div className="text-foreground/60 font-medium">
                            Email
                        </div>
                        <div className="flex items-center">
                            <Checkbox className="text-primary" checked={enableEmailNotifications.notification.enabled} disabled={enableEmailNotifications.notification.loading} onCheckedChange={(status: boolean) => enableEmailNotification('notification', status)} />
                            <div className="ml-3">
                                Enable email notifications
                            </div>
                            {enableEmailNotifications.notification.loading && (
                                <div className="flex items-center ml-4 text-sm gap-2">
                                    <div className="loading loading-spinner loading-sm"></div>
                                    <div className="text-foreground/60">Saving...</div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center">
                            <Checkbox className="text-primary" checked={enableEmailNotifications.message.enabled} disabled={enableEmailNotifications.message.loading} onCheckedChange={(status: boolean) => enableEmailNotification('message', status)} />
                            <div className="ml-3">
                                Enable email notification for new messages
                            </div>
                            {enableEmailNotifications.message.loading && (
                                <div className="flex items-center ml-4 text-sm gap-2">
                                    <div className="loading loading-spinner loading-sm"></div>
                                    <div className="text-foreground/60">Saving...</div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center">
                            <Checkbox className="text-primary" checked={enableEmailNotifications.note.enabled} disabled={enableEmailNotifications.note.loading} onCheckedChange={(status: boolean) => enableEmailNotification('note', status)} />
                            <div className="ml-3">
                                Enable email notification for note reminders
                            </div>
                            {enableEmailNotifications.note.loading && (
                                <div className="flex items-center ml-4 text-sm gap-2">
                                    <div className="loading loading-spinner loading-sm"></div>
                                    <div className="text-foreground/60">Saving...</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3 mt-8">
                        <div className="text-foreground/60 font-medium">
                            Sounds
                        </div>

                        <div className="space-y-1.5 w-[22rem] border p-3 rounded-md">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                                        />
                                    </svg>

                                    <div className="">Message</div>
                                </div>
                                <div>
                                    {(messageNotificationVolume * 100).toFixed(
                                        0
                                    )}
                                </div>
                            </div>
                            <Slider
                                defaultValue={[
                                    parseFloat(
                                        localStorage.getItem(
                                            "m-sound-volume"
                                        ) ?? "1.0"
                                    ),
                                ]}
                                max={1}
                                step={0.01}
                                onValueChange={(volume) => {
                                    setMessageNotificationVolume(volume[0]);
                                }}
                                onValueCommit={(volume) => {
                                    const sound = new Audio(
                                        messageNotification
                                    );
                                    sound.volume = volume[0];
                                    sound.play();

                                    localStorage.setItem(
                                        "m-sound-volume",
                                        volume[0].toString()
                                    );
                                }}
                            />
                        </div>

                        <div className="space-y-1.5 w-[22rem] border p-3 rounded-md">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                                        />
                                    </svg>
                                    Notifcation
                                </div>
                                <div>
                                    {(newNotificationVolume * 100).toFixed(
                                        0
                                    )}
                                </div>
                            </div>
                            <Slider
                                defaultValue={[
                                    parseFloat(
                                        localStorage.getItem(
                                            "n-sound-volume"
                                        ) ?? "1.0"
                                    ),
                                ]}
                                max={1}
                                step={0.01}
                                onValueChange={(volume) => {
                                    setNewNotificationVolume(volume[0]);
                                }}
                                onValueCommit={(volume) => {
                                    const sound = new Audio(
                                        newNotification
                                    );
                                    sound.volume = volume[0];
                                    sound.play();

                                    localStorage.setItem(
                                        "n-sound-volume",
                                        volume[0].toString()
                                    );

                                }}
                            />
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
