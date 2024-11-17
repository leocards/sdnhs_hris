import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";

export default function GovernmentIds({ form }: { form: any }) {
    return (
        <>
            <div className="mt-10 mb-4">
                Government Issued ID (i.e.Passport, GSIS, SSS, PRC, Driver's
                License, etc.) PLEASE INDICATE ID Number and Date of Issuance
            </div>
            <div className="grid 2xl:grid-cols-3 sm:grid-cols-2 gap-3 px-1">
                <FormField
                    control={form.control}
                    name={`governmentids.governmentissuedid`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Government Issued ID: </FormLabel>
                            <FormControl>
                                <Input {...field} className="form-input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={`governmentids.licensepasswordid`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>ID/License/Passport No.: </FormLabel>
                            <FormControl>
                                <Input {...field} className="form-input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={`governmentids.issued`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date/Place of Issuance: </FormLabel>
                            <FormControl>
                                <Input {...field} className="form-input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </>
    );
}
