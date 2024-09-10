import { z } from "zod";
import { requiredError } from "../types";
import { User } from "@/types"

export const PERSONNELPOSITIONS = [
    "Teacher I",
    "Teacher II",
    "Teacher III",
    "Teacher IV",
    "Master Teacher I",
    "Master Teacher II",
    "Master Teacher III",
    "ADAS I",
    "ADAS II",
    "ADAS III",
    "Principal I",
    "Principal II",
    "Principal III",
    "HR"
] as const;

export const ROLE = ["HR", "HOD", "Teaching", "Non-teaching"] as const;

export const NEWPERSONNELSCHEMA = z.object({
    firstName: z.string().min(1, requiredError("first name")).default(""),
    middleName: z.string().optional().default(""),
    lastName: z.string().min(1, requiredError("last name")).default(""),
    birthDate: z.date({ required_error: requiredError("birth date") }).nullable().default(null),
    sex: z.enum(["Male", "Female"], { required_error: requiredError("sex") }),
    email: z.string().min(1, requiredError("email")).email().default(""),
    address: z.string().min(1, requiredError("address")).default(""),
    phoneNumber: z
        .string()
        .startsWith("09", "Must starts with 09")
        .length(11, "Must be 11 characters long")
        .default(""),
    position: z.enum(PERSONNELPOSITIONS, { required_error: requiredError("position") }),
    personnelId: z.string().min(1, requiredError("personnel Id")).default(""),
    department: z.string().optional().default(""),
    userRole: z.enum(ROLE, { required_error: requiredError("user role") }),
    dateHired: z.date({ required_error: requiredError("date hired") }).nullable().default(null),
    currentCredits: z.preprocess(
        (value) => {
            if (value === "" || value === undefined) {
                return 0;
            }
            return parseInt(value as string);
        },
        z.number().optional()
    ).default(0),
    password: z
        .string()
        .min(8, "Password must have atleast 8 characters.")
        .default("12345678"),
}).refine(({ userRole, department }) => {
    if(userRole !== "HOD" && !department) {
        return false
    }
    return true
}, { message: requiredError("department"), path: ['department'] })
.refine(({ userRole, currentCredits }) => {
    if(userRole !== "HOD" && !currentCredits) {
        return false
    }
    return true
}, { message: requiredError("current credits"), path: ['currentCredits']});

export type PersonnelListProps = {
    user: User
    onClick?: (action: string, id: any) => void
}

const ATTENDANCEOBJECTSCHEMA = z.object({
    id: z.string().optional(),
    attendanceId: z.number().nullable().optional(),
    name: z.string().min(1, "The name field is required."),
    personnelId: z.number().optional().nullable(),
    present: z.string().min(1, "The number of days present is required."),
    absent: z.string().min(1, "The number of days absent is required."),
});

export const ATTENDANCESCHEMA = z.object({
    attendances: z.array(ATTENDANCEOBJECTSCHEMA),
});
