import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormProps,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { useRef, useState } from "react";

interface UserCredentialsProps extends FormProps {}

const UserCredentials: React.FC<UserCredentialsProps> = ({ form }) => {
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const [isViewPassword, setIsViewPassword] = useState<boolean>(false);

    return (
        <>
            <div className="mt-8 mb-4 py-3 relative">
                <div className="bg-background absolute top-1/2 -translate-y-1/2 h-fit pr-3 text-foreground/75">
                    User credentials
                </div>
                <hr className="border-t-2 border-border" />
            </div>

            <div className="grid [@media(max-width:536px)]:grid-cols-1 grid-cols-2 w-full gap-3">
                <div className="space-y-2">
                    <FormLabel className="text-foreground w-full">Email</FormLabel>
                    <Input readOnly disabled value={form.watch('email')} className="h-10 shadow-sm" />
                </div>
                
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="relative">
                            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                Password
                            </FormLabel>
                            <div className="relative">
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="password"
                                        {...field}
                                        ref={(e) => {
                                            field.ref(e);
                                            if (e) passwordRef.current = e;
                                        }}
                                        className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                    />
                                </FormControl>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    className="absolute top-1/2 -translate-y-1/2 right-1 size-8 before:!bg-zinc-200"
                                    onClick={() => {
                                        if (
                                            passwordRef.current?.type ===
                                            "password"
                                        ) {
                                            passwordRef.current.type = "text";
                                            setIsViewPassword(true);
                                        } else if (
                                            passwordRef.current?.type === "text"
                                        ) {
                                            passwordRef.current.type =
                                                "password";
                                            setIsViewPassword(false);
                                        }
                                    }}
                                >
                                    {!isViewPassword ? (
                                        <Eye className="size-[1.1rem]" />
                                    ) : (
                                        <EyeOff className="size-[1.1rem]" />
                                    )}
                                </Button>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </>
    );
};

export default UserCredentials;
